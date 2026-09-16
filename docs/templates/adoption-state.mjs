// Small explicit configuration contract. No commands, external services or writes are executed.
import { checkBaseline, isCommit, isRecord, localPath, vendoredSkillPaths } from "./adoption-pins.mjs";

const fields = Object.freeze({
  version: [1],
  initializedFrom: ["light", "standard"],
  architecture: ["minimal", "layered"],
  verification: ["local-focused", "ci-first"],
  documentation: ["essential", "standard"],
  workflow: ["local", "pull-request"],
  review: ["adaptive", "independent"],
  modelRouting: ["inherit"],
});

/** Explicit initialization only. Changing initializedFrom later recomputes nothing. */
export function createConfiguration(preset, overrides = {}) {
  if (!["light", "standard"].includes(preset) || !isRecord(overrides)) {
    throw new Error("expected light/standard and explicit overrides");
  }
  if (Object.keys(overrides).some((key) => !Object.hasOwn(fields, key)
    || ["version", "initializedFrom"].includes(key))) throw new Error("unsupported override");
  const light = preset === "light";
  const config = {
    version: 1, initializedFrom: preset,
    architecture: light ? "minimal" : "layered",
    verification: light ? "local-focused" : "ci-first",
    documentation: light ? "essential" : "standard",
    workflow: light ? "local" : "pull-request",
    review: light ? "adaptive" : "independent",
    modelRouting: "inherit", ...overrides,
  };
  if (checkConfiguration(config).length) throw new Error("unsupported configuration value");
  return config;
}

export function checkConfiguration(config) {
  if (!isRecord(config)) return ["configuration must be an object (absence means legacy/unselected)"];
  const errors = [];
  if (Object.keys(config).some((key) => !Object.hasOwn(fields, key))) errors.push("unknown configuration field");
  for (const [key, values] of Object.entries(fields)) {
    if (!values.includes(config[key])) errors.push(`configuration.${key} is missing or unsupported`);
  }
  return errors;
}

/** New-contract preflight. Keep the legacy field/graph audit as a separate existing responsibility. */
export function checkAdoptionState(root, manifest) {
  if (!isRecord(manifest)) return { errors: ["manifest must be an object"], mode: "unsupported", pending: 0 };
  const errors = [];
  if (manifest.schemaVersion !== 1) errors.push("unsupported schemaVersion (expected numeric 1)");
  const selected = Object.hasOwn(manifest, "configuration");
  if (selected) {
    errors.push(...checkConfiguration(manifest.configuration));
    if (!isCommit(manifest.viberails?.sourceRef)) errors.push("selected configuration requires an immutable viberails.sourceRef");
    if ((manifest.configuration?.workflow === "pull-request" || manifest.configuration?.verification === "ci-first")
      && manifest.profiles?.codeHosting === "none") errors.push("selected PR/CI policy needs a code host; do not downgrade silently");
    if (!Object.hasOwn(manifest, "promptBaseline")) errors.push("selected configuration requires promptBaseline");
  }
  // Reject malformed arrays before legacy consumers dereference their entries.
  for (const [name, entries] of [
    ["copiedFiles", manifest.copiedFiles],
    ["projectProfiles", manifest.target?.projectProfiles],
    ["pathToScopeMap", manifest.target?.qualityGate?.pathToScopeMap],
    ["openQuestions", manifest.openQuestions],
  ]) {
    if (!Array.isArray(entries) || entries.some((entry) => !isRecord(entry))) {
      errors.push(`${name} must contain object entries`);
    }
  }
  function checkPath(relative, label, directory = false) {
    try { localPath(root, relative, { directory }); }
    catch { errors.push(`${label} must resolve inside the target without symlinks`); }
  }
  for (const [index, item] of (Array.isArray(manifest.target?.projectProfiles) ? manifest.target.projectProfiles : []).entries()) {
    if (isRecord(item)) {
      checkPath(item.documentationRoot, `projectProfiles[${index}].documentationRoot`, true);
      if (selected && Array.isArray(item.standards)) {
        for (const [offset, standard] of item.standards.entries()) {
          const relative = typeof standard === "string" && !standard.includes("/")
            ? `docs/standards/${standard}` : standard;
          checkPath(relative, `projectProfiles[${index}].standards[${offset}]`);
        }
      }
    }
  }
  for (const [index, item] of (Array.isArray(manifest.target?.qualityGate?.pathToScopeMap) ? manifest.target.qualityGate.pathToScopeMap : []).entries()) {
    if (isRecord(item)) checkPath(item.workingDirectory, `pathToScopeMap[${index}].workingDirectory`, true);
  }
  for (const [index, item] of (Array.isArray(manifest.copiedFiles) ? manifest.copiedFiles : []).entries()) {
    if (isRecord(item) && item.mode !== "skipped") checkPath(item.targetPath, `copiedFiles[${index}].targetPath`);
    if (selected && isRecord(item) && !isCommit(item.sourceRef)) errors.push(`copiedFiles[${index}] needs an immutable source ref`);
  }
  if (selected && ["user-scope", "vendored"].includes(manifest.agentSkills?.mode)
    && !isCommit(manifest.agentSkills.sourceRef)) errors.push("selected skills require an immutable source ref");
  if (manifest.agentSkills?.mode === "vendored") {
    try { vendoredSkillPaths(root, manifest.agentSkills); }
    catch { errors.push("agentSkills vendored selection must resolve to distinct safe SKILL.md files"); }
  }
  if (!errors.length && Object.hasOwn(manifest, "promptBaseline")) errors.push(...checkBaseline(root, manifest));
  return {
    errors, mode: selected ? "selected" : "legacy/unselected",
    pending: Array.isArray(manifest.openQuestions) ? manifest.openQuestions.length : 0,
  };
}
