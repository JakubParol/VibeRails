// Internal providers checks for the optional read-only adoption audit.
import fs from "node:fs";
import path from "node:path";

export function createProviderChecks(context, values = {}) {
  const { repoRoot, fail } = context;
  const { requireNonPlaceholderString, requireNullableStringField, requireEnum, requireMatchingValue, requireArrayEquals, auditStringArray, isPlaceholder } = values;
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

  return { auditPrPolicy, auditAllowedPrWriteOperations, auditAuthSection, auditIntegrationsSection, auditWorkTrackingIntegration, auditCodeHostingIntegration, auditProviderTypeMap, auditUnsupportedProvider, auditAgentSkillsSection, auditSelfImproveSection, auditSelfImproveSink };
}
