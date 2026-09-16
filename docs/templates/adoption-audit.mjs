#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createValueChecks } from "./adoption-audit/values.mjs";
import { createProviderChecks } from "./adoption-audit/providers.mjs";
import { createRecordChecks } from "./adoption-audit/records.mjs";
import { createNavigationChecks } from "./adoption-audit/navigation.mjs";
import { checkAdoptionState } from "./adoption-state.mjs";
import { localPath } from "./adoption-pins.mjs";

const repoRoot = process.argv[2]
  ? path.resolve(process.argv[2])
  : process.cwd();
const failures = [];
let adoptionState;
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
  try {
    return localPath(repoRoot, relativePath);
  } catch {
    fail(`Missing or unsafe required file: ${relativePath}`);
    return null;
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
    fail(".viberails/adoption.json is not valid JSON; no input contents are logged.");
    return;
  }

  adoptionState = checkAdoptionState(repoRoot, manifest);
  for (const error of adoptionState.errors) fail(error);
  if (adoptionState.errors.length) return;

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

const context = { repoRoot, fail, readText, toRepoPath, excludedDirectories, markdownPlaceholderAuditPaths };
const values = createValueChecks(context);
const { auditManifestPlaceholders, requireNullableStringField, requireSanitizedNullableRemote,
  requireNonPlaceholderString, requireEnum } = values;
const { auditPrPolicy, auditIntegrationsSection, auditAgentSkillsSection, auditAuthSection,
  auditSelfImproveSection } = createProviderChecks(context, values);
const { auditPathToScopeMap, auditProjectProfiles, auditDiscoveredProjectRoots, auditCopiedFiles,
  auditOpenQuestions, auditAdoptionReportMirror } = createRecordChecks(context, values);
const { auditMarkdown, auditReachability } = createNavigationChecks(context, values);

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

console.log(`VibeRails adoption structural checks passed; configuration: ${adoptionState?.mode ?? "unknown"}.`);
console.log(`Open questions: ${adoptionState?.pending ?? "unknown"}. No code-compliance, live-capability or CI PASS is implied.`);
