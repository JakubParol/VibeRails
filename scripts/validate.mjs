#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.join(path.dirname(fileURLToPath(import.meta.url)), ".."));
const failures = [];

function addFailure(message) {
  failures.push(message);
}

function toRepoPath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function walkFiles(directory) {
  const files = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    const relativePath = toRepoPath(fullPath);

    if (relativePath === ".git" || relativePath.startsWith(".git/")) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
}

function testAsciiFiles(files) {
  const checked = files.filter((file) => /\.(md|ps1|ya?ml)$/i.test(file));

  for (const file of checked) {
    const text = readText(file);
    if (/[^\x00-\x7F]/.test(text)) {
      addFailure(`Non-ASCII content found in ${toRepoPath(file)}.`);
    }
  }
}

function convertToMarkdownAnchor(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[^A-Za-z0-9_\s-]/g, "")
    .replace(/\s/g, "-");
}

function getMarkdownAnchors(filePath) {
  const anchors = new Set();
  let insideFence = false;

  for (const line of readText(filePath).split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      insideFence = !insideFence;
      continue;
    }

    if (insideFence) {
      continue;
    }

    const heading = line.match(/^#{1,6}\s+(.+?)\s*$/);
    if (heading) {
      anchors.add(convertToMarkdownAnchor(heading[1]));
    }
  }

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

function testMarkdownLinks(markdownFiles) {
  const anchorCache = new Map();
  const linkGraph = new Map(markdownFiles.map((file) => [fs.realpathSync(file), []]));
  const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;

  for (const sourceFile of markdownFiles) {
    const sourceRealPath = fs.realpathSync(sourceFile);
    const sourceRelativePath = toRepoPath(sourceFile);
    const text = readText(sourceFile);
    let match;

    while ((match = linkPattern.exec(text)) !== null) {
      const target = match[1].trim();
      if (!target || /^(https?:|mailto:)/i.test(target)) {
        continue;
      }

      const resolved = resolveMarkdownTarget(sourceFile, target);
      if (resolved.external) {
        continue;
      }

      if (!resolved.exists) {
        addFailure(`${sourceRelativePath} has missing link target '${target}'.`);
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
          addFailure(
            `${sourceRelativePath} links to missing anchor '#${resolved.anchorPart}' in '${toRepoPath(targetRealPath)}'.`,
          );
        }
      }
    }
  }

  return linkGraph;
}

function testOrphanMarkdownFiles(markdownFiles, linkGraph) {
  const rootReadme = path.join(repoRoot, "README.md");

  if (!fs.existsSync(rootReadme)) {
    addFailure("Repository root README.md is missing.");
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
      addFailure(`${toRepoPath(file)} is an orphan: not reachable from README.md through Markdown links.`);
    }
  }
}

function testSkillMetadata() {
  const skillsRoot = path.join(repoRoot, ".agents", "skills");

  if (!fs.existsSync(skillsRoot)) {
    return;
  }

  for (const entry of fs.readdirSync(skillsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const skillName = entry.name;
    const skillDirectory = path.join(skillsRoot, skillName);
    const skillFile = path.join(skillDirectory, "SKILL.md");

    if (!fs.existsSync(skillFile)) {
      addFailure(`Skill ${skillName} is missing SKILL.md.`);
      continue;
    }

    const skillText = readText(skillFile);
    const frontmatter = skillText.match(/^---\r?\n(?<yaml>[\s\S]*?)\r?\n---/);
    if (!frontmatter) {
      addFailure(`Skill ${skillName} is missing YAML frontmatter.`);
      continue;
    }

    const yaml = frontmatter.groups.yaml;
    const name = yaml.match(/^name:\s*(?<value>[a-z0-9-]+)\s*$/m);
    const description = yaml.match(/^description:\s*(?<value>[\s\S]+?)(\r?\n[a-zA-Z_-]+:|$)/m);

    if (!name) {
      addFailure(`Skill ${skillName} is missing a valid name field.`);
    } else if (name.groups.value !== skillName) {
      addFailure(`Skill ${skillName} name field does not match folder name.`);
    } else if (!/^[a-z0-9-]{1,63}$/.test(name.groups.value)) {
      addFailure(`Skill ${skillName} name field violates naming rules.`);
    }

    if (!description || !description.groups.value.trim()) {
      addFailure(`Skill ${skillName} is missing a non-empty description field.`);
    }

    const openAiYaml = path.join(skillDirectory, "agents", "openai.yaml");
    if (!fs.existsSync(openAiYaml)) {
      addFailure(`Skill ${skillName} is missing agents/openai.yaml.`);
      continue;
    }

    const metadata = readText(openAiYaml);
    for (const required of ["display_name", "short_description", "default_prompt"]) {
      const fieldPattern = new RegExp(`^\\s+${required}:\\s*"[^"]+"\\s*$`, "m");
      if (!fieldPattern.test(metadata)) {
        addFailure(`Skill ${skillName} agents/openai.yaml is missing ${required}.`);
      }
    }

    if (!metadata.includes(`$${skillName}`)) {
      addFailure(`Skill ${skillName} default_prompt must mention $${skillName}.`);
    }
  }
}

function testAgentAssetsAreGeneric() {
  const agentsRoot = path.join(repoRoot, ".agents");

  if (!fs.existsSync(agentsRoot)) {
    return;
  }

  const forbiddenPatterns = [
    "DocMind",
    "docmind",
    "DOCMINDAI",
    "ELITMIND.DOCMINDAI",
    "ElitMind",
    "elitmind",
    "ELITMIND",
    "Elitmindvs",
  ];

  for (const file of walkFiles(agentsRoot)) {
    const text = readText(file);
    for (const pattern of forbiddenPatterns) {
      if (text.includes(pattern)) {
        addFailure(`${toRepoPath(file)} contains source-specific term '${pattern}'.`);
      }
    }
  }
}

const files = walkFiles(repoRoot);
const markdownFiles = files.filter((file) => file.endsWith(".md"));

testAsciiFiles(files);
const markdownLinkGraph = testMarkdownLinks(markdownFiles);
testOrphanMarkdownFiles(markdownFiles, markdownLinkGraph);
testSkillMetadata();
testAgentAssetsAreGeneric();

if (failures.length > 0) {
  for (const failure of failures.sort()) {
    console.log(`FAIL: ${failure}`);
  }
  console.log(`VibeRails validation failed with ${failures.length} issue(s).`);
  process.exit(1);
}

console.log("VibeRails validation passed.");
