#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const repoRoot = process.argv[2]
  ? path.resolve(process.argv[2])
  : process.cwd();
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
const htmlTagNames = new Set([
  "a",
  "abbr",
  "b",
  "br",
  "code",
  "dd",
  "del",
  "details",
  "div",
  "dl",
  "dt",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "kbd",
  "li",
  "ol",
  "p",
  "pre",
  "samp",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul",
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

function stripFencedBlocks(text) {
  const lines = text.split(/\r?\n/);
  const kept = [];
  let insideFence = false;

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      insideFence = !insideFence;
      continue;
    }
    if (!insideFence) {
      kept.push(line);
    }
  }

  return kept.join("\n");
}

function stripInlineCode(text) {
  return text.replace(/`[^`\n]*`/g, "");
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

    const visibleText = stripInlineCode(stripFencedBlocks(text));
    const shouldCheckPlaceholders = !sourceRelativePath.startsWith("docs/standards/");
    if (shouldCheckPlaceholders && (containsPlaceholder(visibleText) || /\bTODO\b/i.test(visibleText))) {
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

  auditManifestPlaceholders(manifest);
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
  if (!Array.isArray(manifest.target?.projectProfiles)) {
    fail(".viberails/adoption.json must record target.projectProfiles as an array.");
  } else if (manifest.target.projectProfiles.length === 0) {
    fail(".viberails/adoption.json must record at least one target.projectProfiles entry.");
  } else if (!manifest.target.projectProfiles.some((profile) => profile?.documentationRoot === ".")) {
    fail(".viberails/adoption.json must include a root target.projectProfiles entry with documentationRoot '.'.");
  }
  if (!Array.isArray(manifest.copiedFiles)) {
    fail(".viberails/adoption.json must record copiedFiles as an array.");
  }
  requireEnum(manifest.profiles?.stack, "profiles.stack", [
    "nextjs-frontend-only",
    "nextjs-full-stack",
    "nextjs-python-fastapi",
    "mixed",
    "documented-exception",
  ]);
  requireEnum(manifest.profiles?.workTracking, "profiles.workTracking", [
    "azure-devops-work-tracking",
    "jira-work-tracking",
    "unsupported-provider",
    "none",
  ]);
  requireEnum(manifest.profiles?.codeHosting, "profiles.codeHosting", [
    "github-code-hosting",
    "azure-repos-code-hosting",
    "unsupported-provider",
    "none",
  ]);
  requireEnum(manifest.profiles?.scriptPlatform, "profiles.scriptPlatform", [
    "powershell",
    "posix-shell",
    "both",
  ]);
  requireNonPlaceholderString(manifest.viberails?.sourceRef, "viberails.sourceRef");
  requireNonPlaceholderString(manifest.viberails?.packVersion, "viberails.packVersion");
  requireNonPlaceholderString(manifest.target?.defaultBranch, "target.defaultBranch");
  requireNonPlaceholderString(manifest.target?.prTargetBranch, "target.prTargetBranch");
  requireNonPlaceholderString(manifest.target?.qualityGate?.canonicalCommand, "target.qualityGate.canonicalCommand");
  auditPrPolicy(manifest.target?.prPolicy);
  auditAuthSection(manifest.auth);
  auditSelfImproveSection(manifest.selfImprove, manifest.openQuestions);
  auditPathToScopeMap(manifest.target?.qualityGate?.pathToScopeMap);
  auditProjectProfiles(manifest.target?.projectProfiles);
  auditDiscoveredProjectRoots(manifest.target?.projectProfiles);
  auditCopiedFiles(manifest.copiedFiles);
}

function auditPrPolicy(prPolicy) {
  if (!prPolicy || typeof prPolicy !== "object") {
    fail(".viberails/adoption.json must record target.prPolicy as an object.");
    return;
  }
  if (typeof prPolicy.draftByDefault !== "boolean") {
    fail(".viberails/adoption.json must record target.prPolicy.draftByDefault as a boolean.");
  }
  if (!Array.isArray(prPolicy.allowedWriteOperations) || prPolicy.allowedWriteOperations.length === 0) {
    fail(".viberails/adoption.json must record target.prPolicy.allowedWriteOperations as a non-empty array.");
  }
  requireEnum(prPolicy.reviewPublishing, "target.prPolicy.reviewPublishing", [
    "local-only",
    "provider-comments",
    "target-local-profile",
  ]);
  requireNonPlaceholderString(prPolicy.notes, "target.prPolicy.notes");
}

function auditManifestPlaceholders(value, pathParts = []) {
  if (typeof value === "string") {
    if (containsPlaceholder(value) || /\bTODO\b/i.test(value) || /^n\/a$/i.test(value.trim())) {
      fail(`.viberails/adoption.json contains unresolved value at '${pathParts.join(".")}'.`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => auditManifestPlaceholders(item, [...pathParts, String(index)]));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      auditManifestPlaceholders(item, [...pathParts, key]);
    }
  }
}

function isPlaceholder(value) {
  return typeof value === "string" && containsPlaceholder(value);
}

function containsPlaceholder(value) {
  if (typeof value !== "string") {
    return false;
  }

  const matches = value.matchAll(/<([^>\n]+)>/g);
  for (const match of matches) {
    if (isPlaceholderToken(match[1])) {
      return true;
    }
  }

  return false;
}

function isPlaceholderToken(rawToken) {
  const token = rawToken.trim();
  if (!token || token.startsWith("!--") || token.startsWith("/") || /^[a-z]+:/i.test(token)) {
    return false;
  }
  if (/^\S+@\S+\.\S+$/.test(token)) {
    return false;
  }

  const tagName = token.split(/\s+/)[0].replace(/\/$/, "").toLowerCase();
  if (htmlTagNames.has(tagName)) {
    return false;
  }

  return true;
}

function requireNonPlaceholderString(value, field) {
  if (typeof value !== "string" || value.trim() === "" || isPlaceholder(value)) {
    fail(`.viberails/adoption.json must record a concrete '${field}'.`);
  }
}

function requireEnum(value, field, allowedValues) {
  if (!allowedValues.includes(value)) {
    fail(`.viberails/adoption.json has invalid '${field}': expected one of ${allowedValues.join(", ")}.`);
  }
}

function auditAuthSection(auth) {
  if (!auth || typeof auth !== "object") {
    fail(".viberails/adoption.json must record auth as an object.");
    return;
  }

  for (const key of ["workTracking", "codeHosting"]) {
    const value = auth[key];
    if (typeof value !== "string" || value.trim() === "" || isPlaceholder(value)) {
      fail(`.viberails/adoption.json must record concrete auth.${key} instructions or 'none'.`);
    }
  }
}

function auditSelfImproveSection(selfImprove, openQuestions) {
  if (!selfImprove || typeof selfImprove !== "object") {
    fail(".viberails/adoption.json must record selfImprove as an object.");
    return;
  }

  requireEnum(selfImprove.tracker, "selfImprove.tracker", [
    "azure-devops",
    "jira",
    "custom-ticket-sink",
    "local-file-sink",
    "none",
  ]);
  if (typeof selfImprove.enabled !== "boolean") {
    fail(".viberails/adoption.json must record selfImprove.enabled as a boolean.");
  }
  if (selfImprove.enabled) {
    requireNonPlaceholderString(selfImprove.dedupe?.queryTemplate, "selfImprove.dedupe.queryTemplate");
    requireNonPlaceholderString(selfImprove.auth?.readCheck, "selfImprove.auth.readCheck");
    requireNonPlaceholderString(selfImprove.auth?.writeCheck, "selfImprove.auth.writeCheck");
    requireNonPlaceholderString(selfImprove.writeApprovalPolicy, "selfImprove.writeApprovalPolicy");
    auditSelfImproveSink(selfImprove);
  } else if (!hasSelfImproveDecision(selfImprove, openQuestions)) {
    fail(".viberails/adoption.json must record selfImprove.disabledReason or a self-improve open question when selfImprove.enabled is false.");
  }
  if (!Array.isArray(selfImprove.alternateClients)) {
    fail(".viberails/adoption.json must record selfImprove.alternateClients as an array.");
  }
}

function auditSelfImproveSink(selfImprove) {
  switch (selfImprove.tracker) {
    case "azure-devops":
      for (const field of ["organizationUrl", "project", "workItemType", "queryCommand", "createCommand", "commentCommand"]) {
        requireNonPlaceholderString(selfImprove.sink?.azureDevOps?.[field], `selfImprove.sink.azureDevOps.${field}`);
      }
      break;
    case "jira":
      for (const field of ["baseUrl", "projectKey", "issueType", "queryCommand", "createCommand", "commentCommand"]) {
        requireNonPlaceholderString(selfImprove.sink?.jira?.[field], `selfImprove.sink.jira.${field}`);
      }
      break;
    case "custom-ticket-sink":
      for (const field of ["name", "owner", "queryCommand", "createCommand", "commentCommand", "authCheck"]) {
        requireNonPlaceholderString(selfImprove.sink?.customTicketSink?.[field], `selfImprove.sink.customTicketSink.${field}`);
      }
      break;
    case "local-file-sink":
      for (const field of ["path", "writePolicy", "dedupeRule", "reviewOwner"]) {
        requireNonPlaceholderString(selfImprove.sink?.localFileSink?.[field], `selfImprove.sink.localFileSink.${field}`);
      }
      break;
    default:
      fail(".viberails/adoption.json cannot enable selfImprove when selfImprove.tracker is 'none'.");
      break;
  }
}

function hasSelfImproveDecision(selfImprove, openQuestions) {
  if (typeof selfImprove.disabledReason === "string" && selfImprove.disabledReason.trim() && !isPlaceholder(selfImprove.disabledReason)) {
    return true;
  }

  return Array.isArray(openQuestions)
    && openQuestions.some((question) => question?.category === "self-improve");
}

function auditPathToScopeMap(pathToScopeMap) {
  if (!Array.isArray(pathToScopeMap)) {
    return;
  }

  for (const [index, entry] of pathToScopeMap.entries()) {
    if (!Array.isArray(entry.paths) || entry.paths.length === 0) {
      fail(`target.qualityGate.pathToScopeMap[${index}] must include non-empty paths.`);
    }
    if (!Array.isArray(entry.commands) || entry.commands.length === 0) {
      fail(`target.qualityGate.pathToScopeMap[${index}] must include non-empty commands.`);
    }
    requireNonPlaceholderString(entry.scope, `target.qualityGate.pathToScopeMap[${index}].scope`);
    requireNonPlaceholderString(entry.workingDirectory, `target.qualityGate.pathToScopeMap[${index}].workingDirectory`);
    if (typeof entry.requiredBeforePr !== "boolean") {
      fail(`target.qualityGate.pathToScopeMap[${index}].requiredBeforePr must be a boolean.`);
    }
  }
}

function auditProjectProfiles(projectProfiles) {
  if (!Array.isArray(projectProfiles)) {
    return;
  }

  for (const [index, entry] of projectProfiles.entries()) {
    if (!Array.isArray(entry.paths) || entry.paths.length === 0) {
      fail(`target.projectProfiles[${index}] must include non-empty paths.`);
    }
    requireNonPlaceholderString(entry.documentationRoot, `target.projectProfiles[${index}].documentationRoot`);
    requireEnum(entry.profile, `target.projectProfiles[${index}].profile`, [
      "nextjs-frontend-only",
      "nextjs-full-stack",
      "nextjs-python-fastapi",
      "python-cli",
      "python-worker",
      "shared-package",
      "infrastructure",
      "dapr-distributed-app",
      "documented-exception",
    ]);
    if (!Array.isArray(entry.standards) || entry.standards.length === 0) {
      fail(`target.projectProfiles[${index}] must include non-empty standards.`);
    }
    requireNonPlaceholderString(entry.qualityGateScope, `target.projectProfiles[${index}].qualityGateScope`);

    const documentationRoot = path.resolve(repoRoot, entry.documentationRoot);
    for (const required of ["README.md", "AGENTS.md", "docs/INDEX.md"]) {
      if (!fs.existsSync(path.join(documentationRoot, required))) {
        fail(`target.projectProfiles[${index}] documentation root is missing ${path.join(entry.documentationRoot, required)}.`);
      }
    }
  }
}

function auditDiscoveredProjectRoots(projectProfiles) {
  if (!Array.isArray(projectProfiles)) {
    return;
  }

  const coveredDocumentationRoots = new Set();
  for (const profile of projectProfiles) {
    if (typeof profile.documentationRoot === "string") {
      coveredDocumentationRoots.add(path.normalize(profile.documentationRoot));
    }
  }

  for (const root of discoverLikelyProjectRoots()) {
    if (!coveredDocumentationRoots.has(path.normalize(root))) {
      fail(`Likely standalone project root '${root}' is not listed as a target.projectProfiles documentationRoot.`);
    }
  }
}

function discoverLikelyProjectRoots() {
  const containerNames = [
    "apps",
    "services",
    "workers",
    "packages",
    "libs",
    "infra",
    "infrastructure",
    "mobile",
    "tools",
    "crates",
    "cmd",
  ];
  const markerFiles = ["package.json", "pyproject.toml", "requirements.txt", "Dockerfile", "docs/INDEX.md"];
  const discovered = [];

  for (const containerName of containerNames) {
    const containerPath = path.join(repoRoot, containerName);
    if (!fs.existsSync(containerPath)) {
      continue;
    }

    for (const entry of fs.readdirSync(containerPath, { withFileTypes: true })) {
      if (!entry.isDirectory() || excludedDirectories.has(entry.name)) {
        continue;
      }

      discoverRootCandidates(path.join(containerName, entry.name), markerFiles, discovered, entry.name.startsWith("@") ? 2 : 1);
    }
  }

  return discovered;
}

function discoverRootCandidates(relativeDirectory, markerFiles, discovered, remainingDepth) {
  const directory = path.join(repoRoot, relativeDirectory);
  if (markerFiles.some((marker) => fs.existsSync(path.join(directory, marker)))) {
    discovered.push(relativeDirectory.split(path.sep).join("/"));
    return;
  }

  if (remainingDepth <= 0) {
    return;
  }

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory() || excludedDirectories.has(entry.name)) {
      continue;
    }
    discoverRootCandidates(path.join(relativeDirectory, entry.name), markerFiles, discovered, remainingDepth - 1);
  }
}

function auditCopiedFiles(copiedFiles) {
  if (!Array.isArray(copiedFiles)) {
    return;
  }

  for (const [index, entry] of copiedFiles.entries()) {
    for (const field of ["sourcePath", "targetPath", "sourceRef", "mode", "scope", "reason"]) {
      requireNonPlaceholderString(entry[field], `copiedFiles[${index}].${field}`);
    }
    requireEnum(entry.mode, `copiedFiles[${index}].mode`, ["created", "merged", "refreshed", "skipped"]);
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
