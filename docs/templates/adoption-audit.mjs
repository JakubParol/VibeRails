#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const repoRoot = process.argv[2]
  ? path.resolve(process.argv[2])
  : process.cwd();
const failures = [];
const markdownPlaceholderAuditPaths = new Set(["docs/viberails-adoption.md"]);
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
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "search",
  "section",
  "select",
  "slot",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
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

    const shouldCheckPlaceholders = markdownPlaceholderAuditPaths.has(sourceRelativePath)
      && !sourceRelativePath.startsWith("docs/standards/");
    const textOutsideFences = stripFencedBlocks(text);
    const proseText = stripInlineCode(textOutsideFences);
    if (shouldCheckPlaceholders && (containsPlaceholder(textOutsideFences) || /\bTODO\b/i.test(proseText))) {
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
  for (const field of ["schemaVersion", "adoptedAt", "viberails", "target", "profiles", "integrations", "agentSkills", "auth", "selfImprove", "copiedFiles", "exceptions", "openQuestions"]) {
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
  if (!Array.isArray(manifest.exceptions)) {
    fail(".viberails/adoption.json must record exceptions as an array.");
  }
  if (!Array.isArray(manifest.openQuestions)) {
    fail(".viberails/adoption.json must record openQuestions as an array.");
  }
  requireEnum(manifest.profiles?.stack, "profiles.stack", [
    "nextjs-frontend-only",
    "nextjs-full-stack",
    "nextjs-python-fastapi",
    "python-cli",
    "python-worker",
    "shared-package",
    "infrastructure",
    "dapr-distributed-app",
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
  requireNullableStringField(manifest.viberails, "sourcePath", "viberails.sourcePath");
  requireSanitizedNullableRemote(manifest.viberails, "sourceRemote", "viberails.sourceRemote");
  requireNonPlaceholderString(manifest.viberails?.sourceRef, "viberails.sourceRef");
  requireNonPlaceholderString(manifest.viberails?.packVersion, "viberails.packVersion");
  requireNonPlaceholderString(manifest.target?.repositoryRoot, "target.repositoryRoot");
  requireSanitizedNullableRemote(manifest.target, "remote", "target.remote");
  requireNonPlaceholderString(manifest.target?.defaultBranch, "target.defaultBranch");
  requireNonPlaceholderString(manifest.target?.prTargetBranch, "target.prTargetBranch");
  requireNonPlaceholderString(manifest.target?.branchNaming, "target.branchNaming");
  requireNonPlaceholderString(manifest.target?.qualityGate?.canonicalCommand, "target.qualityGate.canonicalCommand");
  auditPrPolicy(manifest.target?.prPolicy, manifest.profiles?.codeHosting);
  auditIntegrationsSection(manifest.integrations, manifest.profiles, manifest.target);
  auditAgentSkillsSection(manifest.agentSkills);
  auditAuthSection(manifest.auth);
  auditSelfImproveSection(manifest.selfImprove, manifest.openQuestions);
  auditPathToScopeMap(manifest.target?.qualityGate?.pathToScopeMap);
  auditProjectProfiles(manifest.target?.projectProfiles);
  auditDiscoveredProjectRoots(manifest.target?.projectProfiles);
  auditCopiedFiles(manifest.copiedFiles);
  auditOpenQuestions(manifest.openQuestions);
  auditAdoptionReportMirror(manifest);
}

function auditPrPolicy(prPolicy, codeHostingProfile) {
  if (!prPolicy || typeof prPolicy !== "object") {
    fail(".viberails/adoption.json must record target.prPolicy as an object.");
    return;
  }
  if (typeof prPolicy.draftByDefault !== "boolean") {
    fail(".viberails/adoption.json must record target.prPolicy.draftByDefault as a boolean.");
  }
  if (!Array.isArray(prPolicy.allowedWriteOperations) || prPolicy.allowedWriteOperations.length === 0) {
    fail(".viberails/adoption.json must record target.prPolicy.allowedWriteOperations as a non-empty array.");
  } else {
    auditAllowedPrWriteOperations(prPolicy.allowedWriteOperations);
    if (codeHostingProfile === "none" && (prPolicy.allowedWriteOperations.length !== 1 || prPolicy.allowedWriteOperations[0] !== "none")) {
      fail(".viberails/adoption.json target.prPolicy.allowedWriteOperations must be ['none'] when profiles.codeHosting is 'none'.");
    }
  }
  requireEnum(prPolicy.reviewPublishing, "target.prPolicy.reviewPublishing", [
    "local-only",
    "provider-comments",
    "target-local-profile",
  ]);
  requireNonPlaceholderString(prPolicy.notes, "target.prPolicy.notes");
}

function auditAllowedPrWriteOperations(operations) {
  const allowed = new Set(["create-pr", "edit-description", "comment", "none"]);
  const seen = new Set();

  for (const operation of operations) {
    if (typeof operation !== "string" || !allowed.has(operation)) {
      fail(`.viberails/adoption.json has invalid target.prPolicy.allowedWriteOperations entry '${operation}'.`);
      continue;
    }
    seen.add(operation);
  }

  if (seen.has("none") && seen.size > 1) {
    fail(".viberails/adoption.json target.prPolicy.allowedWriteOperations cannot combine 'none' with write operations.");
  }
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
  if (!token || token.startsWith("!--") || token.startsWith("/")) {
    return false;
  }
  if (/^(https?|mailto|ftp|file):/i.test(token)) {
    return false;
  }
  if (/^\S+@\S+\.\S+$/.test(token)) {
    return false;
  }
  if (isTypeParameterToken(token)) {
    return false;
  }

  const tagName = token.split(/\s+/)[0].replace(/\/$/, "").toLowerCase();
  if (htmlTagNames.has(tagName)) {
    return false;
  }

  return true;
}

function isTypeParameterToken(token) {
  return token
    .split(",")
    .map((part) => part.trim())
    .every((part) => /^[A-Z]$/.test(part) || /^T[A-Za-z0-9_]*$/.test(part));
}

function requireNonPlaceholderString(value, field) {
  if (typeof value !== "string" || value.trim() === "" || isPlaceholder(value)) {
    fail(`.viberails/adoption.json must record a concrete '${field}'.`);
  }
}

function requireNullableStringField(parent, field, displayName) {
  if (!parent || !Object.prototype.hasOwnProperty.call(parent, field)) {
    fail(`.viberails/adoption.json must record '${displayName}' as a string or null.`);
    return;
  }

  const value = parent[field];
  if (value !== null && (typeof value !== "string" || value.trim() === "" || isPlaceholder(value))) {
    fail(`.viberails/adoption.json must record '${displayName}' as a concrete string or null.`);
  }
}

function requireSanitizedNullableRemote(parent, field, displayName) {
  requireNullableStringField(parent, field, displayName);
  if (!parent || !Object.prototype.hasOwnProperty.call(parent, field)) {
    return;
  }

  const value = parent[field];
  if (value === null) {
    return;
  }
  if (typeof value !== "string" || value.trim() === "" || isPlaceholder(value)) {
    return;
  }
  if (/[?#]/.test(value)) {
    fail(`.viberails/adoption.json must record '${displayName}' without query strings or fragments.`);
  }
  if (/^[a-z][a-z0-9+.-]*:\/\/[^/\s@]+@/i.test(value)) {
    fail(`.viberails/adoption.json must record '${displayName}' without username, password, or token userinfo.`);
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

function auditIntegrationsSection(integrations, profiles, target) {
  if (!integrations || typeof integrations !== "object") {
    fail(".viberails/adoption.json must record integrations as an object.");
    return;
  }

  auditWorkTrackingIntegration(integrations.workTracking, profiles?.workTracking);
  auditCodeHostingIntegration(integrations.codeHosting, profiles?.codeHosting, target);
}

function auditWorkTrackingIntegration(workTracking, selectedProfile) {
  if (!workTracking || typeof workTracking !== "object") {
    fail(".viberails/adoption.json must record integrations.workTracking as an object.");
    return;
  }
  if (workTracking.profile !== selectedProfile) {
    fail(".viberails/adoption.json integrations.workTracking.profile must match profiles.workTracking.");
  }

  switch (selectedProfile) {
    case "azure-devops-work-tracking":
      for (const field of ["organizationUrl", "project", "iterationPolicy", "readCheck", "writeApprovalPolicy"]) {
        requireNonPlaceholderString(workTracking.azureDevOps?.[field], `integrations.workTracking.azureDevOps.${field}`);
      }
      requireNullableStringField(workTracking.azureDevOps, "areaPath", "integrations.workTracking.azureDevOps.areaPath");
      auditStringArray(workTracking.azureDevOps?.labels, "integrations.workTracking.azureDevOps.labels");
      auditProviderTypeMap(workTracking.azureDevOps?.workItemTypes, "integrations.workTracking.azureDevOps.workItemTypes");
      break;
    case "jira-work-tracking":
      for (const field of ["baseUrl", "projectKey", "readCheck", "writeApprovalPolicy"]) {
        requireNonPlaceholderString(workTracking.jira?.[field], `integrations.workTracking.jira.${field}`);
      }
      requireNullableStringField(workTracking.jira, "component", "integrations.workTracking.jira.component");
      auditStringArray(workTracking.jira?.labels, "integrations.workTracking.jira.labels");
      auditProviderTypeMap(workTracking.jira?.issueTypes, "integrations.workTracking.jira.issueTypes");
      break;
    case "unsupported-provider":
      auditUnsupportedProvider(workTracking.unsupportedProvider, "integrations.workTracking.unsupportedProvider");
      break;
    case "none":
      requireNonPlaceholderString(workTracking.noneReason, "integrations.workTracking.noneReason");
      break;
    default:
      fail(".viberails/adoption.json integrations.workTracking cannot be validated without a valid profiles.workTracking value.");
      break;
  }
}

function auditCodeHostingIntegration(codeHosting, selectedProfile, target) {
  if (!codeHosting || typeof codeHosting !== "object") {
    fail(".viberails/adoption.json must record integrations.codeHosting as an object.");
    return;
  }
  if (codeHosting.profile !== selectedProfile) {
    fail(".viberails/adoption.json integrations.codeHosting.profile must match profiles.codeHosting.");
  }

  switch (selectedProfile) {
    case "github-code-hosting":
      for (const field of ["owner", "repository", "defaultBranch", "prTargetBranch", "branchNaming", "authCheck"]) {
        requireNonPlaceholderString(codeHosting.github?.[field], `integrations.codeHosting.github.${field}`);
      }
      requireMatchingValue(codeHosting.github?.defaultBranch, target?.defaultBranch, "integrations.codeHosting.github.defaultBranch", "target.defaultBranch");
      requireMatchingValue(codeHosting.github?.prTargetBranch, target?.prTargetBranch, "integrations.codeHosting.github.prTargetBranch", "target.prTargetBranch");
      requireMatchingValue(codeHosting.github?.branchNaming, target?.branchNaming, "integrations.codeHosting.github.branchNaming", "target.branchNaming");
      requireMatchingValue(codeHosting.github?.draftByDefault, target?.prPolicy?.draftByDefault, "integrations.codeHosting.github.draftByDefault", "target.prPolicy.draftByDefault");
      requireArrayEquals(codeHosting.github?.allowedWriteOperations, target?.prPolicy?.allowedWriteOperations, "integrations.codeHosting.github.allowedWriteOperations", "target.prPolicy.allowedWriteOperations");
      break;
    case "azure-repos-code-hosting":
      for (const field of ["organizationUrl", "project", "repository", "defaultBranch", "prTargetBranch", "branchNaming", "authCheck"]) {
        requireNonPlaceholderString(codeHosting.azureRepos?.[field], `integrations.codeHosting.azureRepos.${field}`);
      }
      requireMatchingValue(codeHosting.azureRepos?.defaultBranch, target?.defaultBranch, "integrations.codeHosting.azureRepos.defaultBranch", "target.defaultBranch");
      requireMatchingValue(codeHosting.azureRepos?.prTargetBranch, target?.prTargetBranch, "integrations.codeHosting.azureRepos.prTargetBranch", "target.prTargetBranch");
      requireMatchingValue(codeHosting.azureRepos?.branchNaming, target?.branchNaming, "integrations.codeHosting.azureRepos.branchNaming", "target.branchNaming");
      requireMatchingValue(codeHosting.azureRepos?.draftByDefault, target?.prPolicy?.draftByDefault, "integrations.codeHosting.azureRepos.draftByDefault", "target.prPolicy.draftByDefault");
      requireArrayEquals(codeHosting.azureRepos?.allowedWriteOperations, target?.prPolicy?.allowedWriteOperations, "integrations.codeHosting.azureRepos.allowedWriteOperations", "target.prPolicy.allowedWriteOperations");
      break;
    case "unsupported-provider":
      auditUnsupportedProvider(codeHosting.unsupportedProvider, "integrations.codeHosting.unsupportedProvider");
      break;
    case "none":
      requireNonPlaceholderString(codeHosting.noneReason, "integrations.codeHosting.noneReason");
      break;
    default:
      fail(".viberails/adoption.json integrations.codeHosting cannot be validated without a valid profiles.codeHosting value.");
      break;
  }
}

function auditProviderTypeMap(value, field) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(`.viberails/adoption.json must record ${field} as an object.`);
    return;
  }

  for (const type of ["story", "task", "bug", "selfImprove"]) {
    requireNonPlaceholderString(value[type], `${field}.${type}`);
  }
}

function auditUnsupportedProvider(value, field) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(`.viberails/adoption.json must record ${field} as an object.`);
    return;
  }

  for (const key of ["name", "evidence", "manualPolicy"]) {
    requireNonPlaceholderString(value[key], `${field}.${key}`);
  }
}

function requireMatchingValue(actual, expected, actualField, expectedField) {
  if (actual !== expected) {
    fail(`.viberails/adoption.json ${actualField} must match ${expectedField}.`);
  }
}

function requireArrayEquals(actual, expected, actualField, expectedField) {
  if (!Array.isArray(actual) || !Array.isArray(expected) || actual.length !== expected.length) {
    fail(`.viberails/adoption.json ${actualField} must match ${expectedField}.`);
    return;
  }

  for (const [index, item] of actual.entries()) {
    if (item !== expected[index]) {
      fail(`.viberails/adoption.json ${actualField} must match ${expectedField}.`);
      return;
    }
  }
}

function auditAgentSkillsSection(agentSkills) {
  if (!agentSkills || typeof agentSkills !== "object") {
    fail(".viberails/adoption.json must record agentSkills as an object.");
    return;
  }

  requireEnum(agentSkills.mode, "agentSkills.mode", ["none", "user-scope", "vendored"]);
  if (!Array.isArray(agentSkills.selectedSkills)) {
    fail(".viberails/adoption.json must record agentSkills.selectedSkills as an array.");
  } else if (agentSkills.mode !== "none" && agentSkills.selectedSkills.length === 0) {
    fail(".viberails/adoption.json must record at least one selected skill when agentSkills.mode is not 'none'.");
  } else {
    for (const [index, skill] of agentSkills.selectedSkills.entries()) {
      requireNonPlaceholderString(skill, `agentSkills.selectedSkills[${index}]`);
    }
  }
  requireNullableStringField(agentSkills, "sourcePath", "agentSkills.sourcePath");
  requireNullableStringField(agentSkills, "sourceRef", "agentSkills.sourceRef");
  requireNullableStringField(agentSkills, "targetPath", "agentSkills.targetPath");
  requireNonPlaceholderString(agentSkills.duplicateNamePolicy, "agentSkills.duplicateNamePolicy");
  requireNonPlaceholderString(agentSkills.decisionReason, "agentSkills.decisionReason");

  if (agentSkills.mode !== "none") {
    requireNonPlaceholderString(agentSkills.sourceRef, "agentSkills.sourceRef");
  }
  if (agentSkills.mode === "vendored") {
    requireNonPlaceholderString(agentSkills.targetPath, "agentSkills.targetPath");
    if (typeof agentSkills.targetPath === "string"
      && !isPlaceholder(agentSkills.targetPath)
      && !fs.existsSync(path.join(repoRoot, agentSkills.targetPath))) {
      fail(`agentSkills.targetPath '${agentSkills.targetPath}' does not exist for vendored skills.`);
    }
  }
}

function auditOpenQuestions(openQuestions) {
  if (!Array.isArray(openQuestions)) {
    return;
  }

  const allowedCategories = new Set([
    "provider",
    "auth",
    "quality-gate",
    "documentation",
    "stack-exception",
    "self-improve",
    "workflow",
  ]);

  for (const [index, question] of openQuestions.entries()) {
    if (!question || typeof question !== "object") {
      fail(`openQuestions[${index}] must be an object.`);
      continue;
    }
    if (!allowedCategories.has(question.category)) {
      fail(`openQuestions[${index}].category must be one of ${Array.from(allowedCategories).join(", ")}.`);
    }
    for (const field of ["question", "impact", "owner", "neededBefore"]) {
      requireNonPlaceholderString(question[field], `openQuestions[${index}].${field}`);
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
    auditStringArray(selfImprove.labels, "selfImprove.labels");
    auditStringArray(selfImprove.providerLabels, "selfImprove.providerLabels");
    requireNonPlaceholderString(selfImprove.dedupe?.queryTemplate, "selfImprove.dedupe.queryTemplate");
    auditStringArray(selfImprove.dedupe?.matchFields, "selfImprove.dedupe.matchFields");
    requireNonPlaceholderString(selfImprove.dedupe?.statusScope, "selfImprove.dedupe.statusScope");
    requireNonPlaceholderString(selfImprove.dedupe?.manualFallback, "selfImprove.dedupe.manualFallback");
    requireNonPlaceholderString(selfImprove.commentTemplate, "selfImprove.commentTemplate");
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

function auditStringArray(value, field) {
  if (!Array.isArray(value) || value.length === 0) {
    fail(`.viberails/adoption.json must record ${field} as a non-empty array.`);
    return;
  }

  for (const [index, item] of value.entries()) {
    requireNonPlaceholderString(item, `${field}[${index}]`);
  }
}

function auditSelfImproveSink(selfImprove) {
  switch (selfImprove.tracker) {
    case "azure-devops":
      for (const field of ["organizationUrl", "project", "workItemType", "iterationPolicy", "queryCommand", "createCommand", "commentCommand"]) {
        requireNonPlaceholderString(selfImprove.sink?.azureDevOps?.[field], `selfImprove.sink.azureDevOps.${field}`);
      }
      requireNullableStringField(selfImprove.sink?.azureDevOps, "areaPath", "selfImprove.sink.azureDevOps.areaPath");
      break;
    case "jira":
      for (const field of ["baseUrl", "projectKey", "issueType", "queryCommand", "createCommand", "commentCommand"]) {
        requireNonPlaceholderString(selfImprove.sink?.jira?.[field], `selfImprove.sink.jira.${field}`);
      }
      requireNullableStringField(selfImprove.sink?.jira, "component", "selfImprove.sink.jira.component");
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
    "frontend",
    "backend",
    "api",
    "server",
    "client",
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
    if (markerFiles.some((marker) => fs.existsSync(path.join(containerPath, marker)))) {
      discovered.push(containerName);
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
    if (["created", "merged", "refreshed"].includes(entry.mode)
      && typeof entry.targetPath === "string"
      && !isPlaceholder(entry.targetPath)
      && !fs.existsSync(path.join(repoRoot, entry.targetPath))) {
      fail(`copiedFiles[${index}].targetPath '${entry.targetPath}' does not exist.`);
    }
    if (typeof entry.targetPath === "string" && entry.targetPath.endsWith(".md")) {
      markdownPlaceholderAuditPaths.add(entry.targetPath);
    }
  }
}

function auditAdoptionReportMirror(manifest) {
  const reportPath = path.join(repoRoot, "docs/viberails-adoption.md");
  if (!fs.existsSync(reportPath)) {
    return;
  }

  const reportText = readText(reportPath);
  const requiredValues = [];
  addReportValue(requiredValues, manifest.viberails?.sourceRef);
  addReportValue(requiredValues, manifest.viberails?.packVersion);
  addReportValue(requiredValues, manifest.target?.defaultBranch);
  addReportValue(requiredValues, manifest.target?.prTargetBranch);
  addReportValue(requiredValues, manifest.target?.branchNaming);
  addReportValue(requiredValues, manifest.target?.qualityGate?.canonicalCommand);
  addReportValue(requiredValues, manifest.target?.prPolicy?.draftByDefault);
  addReportValue(requiredValues, manifest.target?.prPolicy?.reviewPublishing);
  addReportValues(requiredValues, manifest.target?.prPolicy?.allowedWriteOperations);
  addReportValue(requiredValues, manifest.profiles?.agentRuntime);
  addReportValue(requiredValues, manifest.profiles?.stack);
  addReportValue(requiredValues, manifest.profiles?.workTracking);
  addReportValue(requiredValues, manifest.profiles?.codeHosting);
  addReportValue(requiredValues, manifest.profiles?.scriptPlatform);
  addReportValue(requiredValues, manifest.integrations?.workTracking?.profile);
  addReportValue(requiredValues, manifest.integrations?.codeHosting?.profile);
  addIntegrationReportValues(requiredValues, manifest.integrations, manifest.profiles);
  addReportValue(requiredValues, manifest.agentSkills?.mode);
  addReportValues(requiredValues, manifest.agentSkills?.selectedSkills);
  addReportValue(requiredValues, manifest.selfImprove?.enabled);
  addReportValue(requiredValues, manifest.selfImprove?.tracker);
  addReportValues(requiredValues, manifest.selfImprove?.labels);
  addReportValues(requiredValues, manifest.selfImprove?.providerLabels);

  for (const value of new Set(requiredValues)) {
    if (!reportText.includes(value)) {
      fail(`docs/viberails-adoption.md must mirror manifest value '${value}'.`);
    }
  }
}

function addIntegrationReportValues(requiredValues, integrations, profiles) {
  switch (profiles?.workTracking) {
    case "azure-devops-work-tracking":
      addReportValue(requiredValues, integrations?.workTracking?.azureDevOps?.organizationUrl);
      addReportValue(requiredValues, integrations?.workTracking?.azureDevOps?.project);
      addReportValue(requiredValues, integrations?.workTracking?.azureDevOps?.areaPath);
      addReportValue(requiredValues, integrations?.workTracking?.azureDevOps?.iterationPolicy);
      addReportValues(requiredValues, integrations?.workTracking?.azureDevOps?.labels);
      break;
    case "jira-work-tracking":
      addReportValue(requiredValues, integrations?.workTracking?.jira?.baseUrl);
      addReportValue(requiredValues, integrations?.workTracking?.jira?.projectKey);
      addReportValue(requiredValues, integrations?.workTracking?.jira?.component);
      addReportValues(requiredValues, integrations?.workTracking?.jira?.labels);
      break;
    case "unsupported-provider":
      addReportValue(requiredValues, integrations?.workTracking?.unsupportedProvider?.name);
      break;
    default:
      break;
  }

  switch (profiles?.codeHosting) {
    case "github-code-hosting":
      addReportValue(requiredValues, integrations?.codeHosting?.github?.owner);
      addReportValue(requiredValues, integrations?.codeHosting?.github?.repository);
      break;
    case "azure-repos-code-hosting":
      addReportValue(requiredValues, integrations?.codeHosting?.azureRepos?.organizationUrl);
      addReportValue(requiredValues, integrations?.codeHosting?.azureRepos?.project);
      addReportValue(requiredValues, integrations?.codeHosting?.azureRepos?.repository);
      break;
    case "unsupported-provider":
      addReportValue(requiredValues, integrations?.codeHosting?.unsupportedProvider?.name);
      break;
    default:
      break;
  }
}

function addReportValues(requiredValues, values) {
  if (!Array.isArray(values)) {
    return;
  }
  for (const value of values) {
    addReportValue(requiredValues, value);
  }
}

function addReportValue(requiredValues, value) {
  if (value === null || value === undefined) {
    return;
  }
  const text = String(value).trim();
  if (!text || isPlaceholder(text)) {
    return;
  }
  requiredValues.push(text);
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
