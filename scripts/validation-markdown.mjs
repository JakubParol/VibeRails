import fs from "node:fs";
import path from "node:path";

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
}

function toRepoPath(repoRoot, filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function convertToMarkdownAnchor(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[^A-Za-z0-9_\s-]/g, "")
    .replace(/\s/g, "-");
}

function getFenceOpening(line) {
  const match = line.match(/^\s*(`{3,}|~{3,})/);
  if (!match) {
    return null;
  }

  return {
    character: match[1][0],
    length: match[1].length,
  };
}

function closesFence(line, fence) {
  const match = line.match(/^\s*(`+|~+)\s*$/);
  return Boolean(
    match
      && match[1][0] === fence.character
      && match[1].length >= fence.length,
  );
}

function forEachMarkdownLineOutsideFences(text, callback) {
  let fence = null;

  for (const line of text.split(/\r?\n/)) {
    if (fence) {
      if (closesFence(line, fence)) {
        fence = null;
      }
      continue;
    }

    const openingFence = getFenceOpening(line);
    if (openingFence) {
      fence = openingFence;
      continue;
    }

    callback(line);
  }
}

function findInlineCodeClosingDelimiter(line, startIndex, delimiterLength) {
  for (let index = startIndex; index < line.length; index += 1) {
    if (line[index] !== "`") {
      continue;
    }

    let delimiterEnd = index + 1;
    while (line[delimiterEnd] === "`") {
      delimiterEnd += 1;
    }

    if (delimiterEnd - index === delimiterLength) {
      return index;
    }
    index = delimiterEnd - 1;
  }

  return -1;
}

function maskInlineCodeSpans(line) {
  let maskedLine = "";

  for (let index = 0; index < line.length;) {
    if (line[index] !== "`") {
      maskedLine += line[index];
      index += 1;
      continue;
    }

    let delimiterEnd = index + 1;
    while (line[delimiterEnd] === "`") {
      delimiterEnd += 1;
    }

    const delimiterLength = delimiterEnd - index;
    const closingIndex = findInlineCodeClosingDelimiter(line, delimiterEnd, delimiterLength);
    if (closingIndex === -1) {
      maskedLine += line.slice(index, delimiterEnd);
      index = delimiterEnd;
      continue;
    }

    const closingEnd = closingIndex + delimiterLength;
    maskedLine += " ".repeat(closingEnd - index);
    index = closingEnd;
  }

  return maskedLine;
}

function getMarkdownTextOutsideCode(text) {
  let fence = null;
  const lines = [];

  for (const line of text.split(/\r?\n/)) {
    if (fence) {
      if (closesFence(line, fence)) {
        fence = null;
      }
      lines.push("");
      continue;
    }

    const openingFence = getFenceOpening(line);
    if (openingFence) {
      fence = openingFence;
      lines.push("");
      continue;
    }

    lines.push(maskInlineCodeSpans(line));
  }

  return lines.join("\n");
}

function getMarkdownAnchors(filePath) {
  const anchors = new Set();
  forEachMarkdownLineOutsideFences(readText(filePath), (line) => {
    const heading = line.match(/^#{1,6}\s+(.+?)\s*$/);
    if (heading) {
      anchors.add(convertToMarkdownAnchor(heading[1]));
    }
  });

  return anchors;
}

function resolveMarkdownTarget(sourceFile, target) {
  const [rawPathPart, ...anchorParts] = target.split("#");
  const pathPart = rawPathPart.trim().replace(/^<|>$/g, "");
  const anchorPart = anchorParts.join("#").trim();

  if (!pathPart) {
    return {
      targetPath: sourceFile,
      anchorPart,
      exists: true,
    };
  }

  if (/^[a-zA-Z]+:/.test(pathPart)) {
    return {
      targetPath: null,
      anchorPart,
      exists: true,
      external: true,
    };
  }

  const resolvedPath = path.resolve(path.dirname(sourceFile), pathPart);
  return {
    targetPath: resolvedPath,
    anchorPart,
    exists: fs.existsSync(resolvedPath),
  };
}

function isAllowedTemplateCopyLink(repoRoot, sourceRelativePath, target) {
  const allowedTargetsByTemplate = new Map([
    ["docs/templates/project-docs-INDEX.md", new Set(["../README.md", "../AGENTS.md"])],
    ["docs/templates/viberails-adoption.md", new Set(["INDEX.md"])],
  ]);

  if (sourceRelativePath === "docs/templates/project-docs-INDEX.md") {
    if (target === "<relative-path-to-repo>/docs/viberails-adoption.md"
      || target === "<relative-path-to-repo>/docs/INDEX.md") {
      return true;
    }
    const standardsPrefix = "<relative-path-to-repo>/docs/standards/";
    if (target.startsWith(standardsPrefix)) {
      const targetSuffix = target.slice(standardsPrefix.length);
      return targetSuffix.endsWith(".md")
        && !targetSuffix.includes("/")
        && fs.existsSync(path.join(repoRoot, "docs", "standards", targetSuffix));
    }
  }

  return allowedTargetsByTemplate.get(sourceRelativePath)?.has(target) ?? false;
}

function testMarkdownLinks(markdownFiles, repoRoot, failures) {
  const anchorCache = new Map();
  const linkGraph = new Map(markdownFiles.map((file) => [fs.realpathSync(file), []]));
  const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;

  for (const sourceFile of markdownFiles) {
    const sourceRealPath = fs.realpathSync(sourceFile);
    const sourceRelativePath = toRepoPath(repoRoot, sourceFile);
    const text = getMarkdownTextOutsideCode(readText(sourceFile));
    let match;

    while ((match = linkPattern.exec(text)) !== null) {
      const target = match[1].trim();
      if (!target || /^(https?:|mailto:)/i.test(target)) {
        continue;
      }
      if (isAllowedTemplateCopyLink(repoRoot, sourceRelativePath, target)) {
        continue;
      }

      const resolved = resolveMarkdownTarget(sourceFile, target);
      if (resolved.external) {
        continue;
      }

      if (!resolved.exists) {
        failures.push(`${sourceRelativePath} has missing link target '${target}'.`);
        continue;
      }

      const targetRealPath = fs.realpathSync(resolved.targetPath);
      if (targetRealPath.endsWith(".md")) {
        linkGraph.get(sourceRealPath).push(targetRealPath);
      }

      if (resolved.anchorPart && targetRealPath.endsWith(".md")) {
        if (!anchorCache.has(targetRealPath)) {
          anchorCache.set(targetRealPath, getMarkdownAnchors(targetRealPath));
        }

        if (!anchorCache.get(targetRealPath).has(resolved.anchorPart.toLowerCase())) {
          failures.push(
            `${sourceRelativePath} links to missing anchor '#${resolved.anchorPart}' in '${toRepoPath(repoRoot, targetRealPath)}'.`,
          );
        }
      }
    }
  }

  return linkGraph;
}

function testOrphanMarkdownFiles(markdownFiles, linkGraph, repoRoot, failures) {
  const rootReadme = path.join(repoRoot, "README.md");

  if (!fs.existsSync(rootReadme)) {
    failures.push("Repository root README.md is missing.");
    return;
  }

  const reachable = new Set();
  const queue = [fs.realpathSync(rootReadme)];

  while (queue.length > 0) {
    const current = queue.shift();
    if (reachable.has(current)) {
      continue;
    }

    reachable.add(current);
    for (const linked of linkGraph.get(current) ?? []) {
      if (!reachable.has(linked)) {
        queue.push(linked);
      }
    }
  }

  for (const file of markdownFiles) {
    const realPath = fs.realpathSync(file);
    if (!reachable.has(realPath)) {
      failures.push(`${toRepoPath(repoRoot, file)} is an orphan: not reachable from README.md through Markdown links.`);
    }
  }
}

export function validateMarkdownNavigation({ markdownFiles, repoRoot, checkOrphans }) {
  const failures = [];
  const linkGraph = testMarkdownLinks(markdownFiles, repoRoot, failures);
  if (checkOrphans) {
    testOrphanMarkdownFiles(markdownFiles, linkGraph, repoRoot, failures);
  }
  return failures;
}
