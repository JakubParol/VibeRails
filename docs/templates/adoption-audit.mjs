#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const failures = [];
const excludedDirectories = new Set([
  ".git",
  ".venv",
  "venv",
  "node_modules",
  ".next",
  "dist",
  "build",
  "coverage",
  ".pytest_cache",
  ".mypy_cache",
  ".ruff_cache",
  ".turbo",
  ".nx",
  "bin",
  "obj",
]);

function toRepoPath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function fail(message) {
  failures.push(message);
}

function walkFiles(directory) {
  const files = [];
  if (!fs.existsSync(directory)) {
    return files;
  }

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);
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

function requiredFile(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    fail(`Missing required file: ${relativePath}`);
  }
  return fullPath;
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
    let match;

    if (/<[^>\n]+>/.test(text) || /\bTODO\b/i.test(text)) {
      fail(`${sourceRelativePath} contains unresolved placeholder or TODO text.`);
    }

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
        fail(`${sourceRelativePath} has missing link target '${target}'.`);
        continue;
      }

      const targetRealPath = fs.realpathSync(resolved.targetPath);
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

function auditManifest() {
  const manifestPath = requiredFile(".viberails/adoption.json");
  if (!fs.existsSync(manifestPath)) {
    return;
  }

  let manifest;
  try {
    manifest = JSON.parse(readText(manifestPath));
  } catch (error) {
    fail(`.viberails/adoption.json is not valid JSON: ${error.message}`);
    return;
  }

  for (const field of ["schemaVersion", "adoptedAt", "viberails", "target", "profiles", "auth", "selfImprove", "copiedFiles"]) {
    if (manifest[field] === undefined) {
      fail(`.viberails/adoption.json is missing '${field}'.`);
    }
  }
  if (manifest.profiles?.agentRuntime !== "codex") {
    fail(".viberails/adoption.json must record profiles.agentRuntime as 'codex'.");
  }
  if (!Array.isArray(manifest.target?.qualityGate?.pathToScopeMap)) {
    fail(".viberails/adoption.json must record target.qualityGate.pathToScopeMap as an array.");
  }
  if (!Array.isArray(manifest.copiedFiles)) {
    fail(".viberails/adoption.json must record copiedFiles as an array.");
  }
}

requiredFile("README.md");
requiredFile("AGENTS.md");
requiredFile("docs/INDEX.md");
requiredFile("docs/viberails-adoption.md");
auditManifest();

const files = walkFiles(repoRoot);
const markdownFiles = files.filter((file) => file.endsWith(".md"));
const linkGraph = auditMarkdown(markdownFiles);
auditReachability(markdownFiles, linkGraph);

if (failures.length > 0) {
  for (const failure of failures.sort()) {
    console.log(`FAIL: ${failure}`);
  }
  console.log(`VibeRails adoption audit failed with ${failures.length} issue(s).`);
  process.exit(1);
}

console.log("VibeRails adoption audit passed.");
