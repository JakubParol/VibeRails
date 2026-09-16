// Internal navigation checks for the optional read-only adoption audit.
import fs from "node:fs";
import path from "node:path";

export function createNavigationChecks(context, values = {}) {
  const { repoRoot, fail, readText, toRepoPath, markdownPlaceholderAuditPaths } = context;
  const { containsPlaceholder } = values;
  function stripFencedBlocks(text) {
    const kept = [];
    let fence = null;
    for (const line of text.split(/\r?\n/)) {
      if (fence) {
        const close = line.match(/^\s*(`+|~+)\s*$/);
        if (close && close[1][0] === fence[0] && close[1].length >= fence.length) fence = null;
        kept.push("");
      } else {
        const opening = line.match(/^\s*(`{3,}|~{3,})/);
        if (opening) { fence = opening[1]; kept.push(""); }
        else kept.push(line);
      }
    }
    return kept.join("\n");
  }

  // Mask complete same-line spans, preserving a link's nonempty code-formatted label.
  function stripInlineCode(text) {
    return text.split("\n").map((line) => {
      const runs = [...line.matchAll(/`+/g)];
      const chars = line.split("");
      for (let i = 0; i < runs.length; i += 1) {
        let j = i + 1;
        while (j < runs.length && runs[j][0].length !== runs[i][0].length) j += 1;
        if (j === runs.length) continue;
        const start = runs[i].index;
        const end = runs[j].index + runs[j][0].length;
        for (let at = start; at < end; at += 1) chars[at] = " ";
        i = j;
      }
      return chars.join("");
    }).join("\n");
  }

  function convertToMarkdownAnchor(heading) {
    return heading
      .trim()
      .toLowerCase()
      .replace(/[^A-Za-z0-9_\s-]/g, "")
      .replace(/\s/g, "-");
  }

  function markdownAnchors(filePath) {
    const anchors = new Set();
    for (const line of stripFencedBlocks(readText(filePath)).split("\n")) {
      const heading = line.match(/^#{1,6}\s+(.+?)\s*$/);
      if (heading) anchors.add(convertToMarkdownAnchor(heading[1]));
    }
    return anchors;
  }

  function resolveMarkdownTarget(sourceFile, target) {
    const [rawPathPart, ...anchorParts] = target.split("#");
    const pathPart = rawPathPart.trim().replace(/^<|>$/g, "");
    const anchorPart = anchorParts.join("#").trim();

    if (!pathPart) {
      return { targetPath: sourceFile, anchorPart, exists: true };
    }
    if (/^[a-zA-Z]+:/.test(pathPart)) {
      return { targetPath: null, anchorPart, exists: true, external: true };
    }

    const targetPath = path.resolve(path.dirname(sourceFile), pathPart);
    return { targetPath, anchorPart, exists: fs.existsSync(targetPath) };
  }

  function auditMarkdown(markdownFiles) {
    const anchorCache = new Map();
    const linkGraph = new Map(markdownFiles.map((file) => [fs.realpathSync(file), []]));
    const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;

    for (const sourceFile of markdownFiles) {
      const sourceRealPath = fs.realpathSync(sourceFile);
      const sourceRelativePath = toRepoPath(sourceFile);
      const text = readText(sourceFile);
      const navigationText = stripInlineCode(stripFencedBlocks(text));
      let match;

      const shouldCheckPlaceholders = markdownPlaceholderAuditPaths.has(sourceRelativePath)
        && !sourceRelativePath.startsWith("docs/standards/");
      const textOutsideFences = stripFencedBlocks(text);
      const proseText = stripInlineCode(textOutsideFences);
      if (shouldCheckPlaceholders && (containsPlaceholder(textOutsideFences) || /\bTODO\b/i.test(proseText) || /\bReplace (with|this)\b/i.test(proseText))) {
        fail(`${sourceRelativePath} contains unresolved placeholder, TODO, or replacement instruction text.`);
      }

      while ((match = linkPattern.exec(navigationText)) !== null) {
        const target = match[1].trim();
        if (!target || /^(https?:|mailto:)/i.test(target)) {
          continue;
        }

        const resolved = resolveMarkdownTarget(sourceFile, target);
        if (resolved.external) {
          continue;
        }
        if (!resolved.exists) {
          fail(`${sourceRelativePath} has missing link target '${target}'.`);
          continue;
        }

        const targetRealPath = fs.realpathSync(resolved.targetPath);
        const relative = path.relative(repoRoot, targetRealPath);
        if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
          fail(`${sourceRelativePath} has a link outside the target repository.`);
          continue;
        }
        if (targetRealPath.endsWith(".md")) {
          linkGraph.get(sourceRealPath).push(targetRealPath);
        }

        if (resolved.anchorPart && targetRealPath.endsWith(".md")) {
          if (!anchorCache.has(targetRealPath)) {
            anchorCache.set(targetRealPath, markdownAnchors(targetRealPath));
          }
          if (!anchorCache.get(targetRealPath).has(resolved.anchorPart.toLowerCase())) {
            fail(`${sourceRelativePath} links to missing anchor '#${resolved.anchorPart}'.`);
          }
        }
      }
    }

    return linkGraph;
  }

  function auditReachability(markdownFiles, linkGraph) {
    const entrypoints = ["README.md", "AGENTS.md", "docs/INDEX.md"]
      .map((relativePath) => path.join(repoRoot, relativePath))
      .filter((filePath) => fs.existsSync(filePath))
      .map((filePath) => fs.realpathSync(filePath));
    const reachable = new Set();
    const queue = [...entrypoints];

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
        fail(`${toRepoPath(file)} is not reachable from README.md, AGENTS.md, or docs/INDEX.md.`);
      }
    }
  }

  return { auditMarkdown, auditReachability };
}
