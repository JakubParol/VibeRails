// Internal records checks for the optional read-only adoption audit.
import fs from "node:fs";
import path from "node:path";
import { stripFencedBlocks } from "./navigation.mjs";

export function createRecordChecks(context, values = {}) {
  const { repoRoot, fail, readText, excludedDirectories, markdownPlaceholderAuditPaths } = context;
  const { requireNonPlaceholderString, requireEnum, isPlaceholder } = values;
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

  function requireStringList(items, field) {
    if (!Array.isArray(items) || items.length === 0) {
      fail(`${field} must include non-empty concrete strings.`);
      return;
    }
    items.forEach((item, index) => requireNonPlaceholderString(item, `${field}[${index}]`));
  }

  function auditPathToScopeMap(pathToScopeMap) {
    const scopes = new Set();
    if (!Array.isArray(pathToScopeMap) || pathToScopeMap.length === 0) {
      fail("target.qualityGate.pathToScopeMap must be a non-empty array.");
      return scopes;
    }
    for (const [index, entry] of pathToScopeMap.entries()) {
      const field = `target.qualityGate.pathToScopeMap[${index}]`;
      requireStringList(entry.paths, `${field}.paths`);
      requireStringList(entry.commands, `${field}.commands`);
      requireNonPlaceholderString(entry.scope, `${field}.scope`);
      if (typeof entry.scope === "string" && entry.scope.trim()) scopes.add(entry.scope);
      requireNonPlaceholderString(entry.workingDirectory, `${field}.workingDirectory`);
      if (typeof entry.requiredBeforePr !== "boolean") {
        fail(`${field}.requiredBeforePr must be a boolean.`);
      }
    }
    return scopes;
  }

  function auditProjectProfiles(projectProfiles, gateScopes) {
    if (!Array.isArray(projectProfiles)) {
      return;
    }

    for (const [index, entry] of projectProfiles.entries()) {
      requireStringList(entry.paths, `target.projectProfiles[${index}].paths`);
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
      if (!gateScopes.has(entry.qualityGateScope)) {
        fail(`target.projectProfiles[${index}].qualityGateScope must name a defined pathToScopeMap scope.`);
      }
      if (entry.profile === "documented-exception") {
        requireNonPlaceholderString(entry.exception, `target.projectProfiles[${index}].exception`);
        if (typeof entry.exception === "string" && /^(none|null|n\/a|not applicable)$/i.test(entry.exception.trim())) {
          fail(`target.projectProfiles[${index}].exception must explain why a standard profile does not fit.`);
        }
      }

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
    auditConfigurationMirror(reportText, manifest.configuration);
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

  function auditConfigurationMirror(reportText, configuration) {
    if (configuration === undefined) return; // Legacy/unselected does not require this table.
    const visible = stripFencedBlocks(reportText.replace(/<!--[\s\S]*?(?:-->|$)/g, ""));
    const sections = visible.split(/^##[ \t]+/m).slice(1).filter((section) =>
      section.split("\n", 1)[0].trim().toLowerCase() === "configuration and instruction baseline");
    if (sections.length !== 1) {
      fail("docs/viberails-adoption.md must mirror configuration in one Configuration And Instruction Baseline section.");
      return;
    }
    const rows = new Map();
    const cell = (value) => value.trim().replace(/^`([^`]*)`$/, "$1");
    for (const line of sections[0].split("\n").slice(1)) {
      const columns = line.trim().split("|");
      if (columns.length !== 4 || columns[0] !== "" || columns[3] !== "") continue;
      const field = cell(columns[1]);
      if (Object.hasOwn(configuration, field)) {
        const entries = rows.get(field) ?? [];
        entries.push(cell(columns[2])); rows.set(field, entries);
      }
    }
    for (const [field, expected] of Object.entries(configuration)) {
      const entries = rows.get(field) ?? [];
      if (entries.length !== 1 || entries[0] !== String(expected)) {
        fail(`docs/viberails-adoption.md must mirror configuration.${field} in exactly one matching table row.`);
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

  return { auditOpenQuestions, auditPathToScopeMap, auditProjectProfiles, auditDiscoveredProjectRoots, auditCopiedFiles, auditAdoptionReportMirror };
}
