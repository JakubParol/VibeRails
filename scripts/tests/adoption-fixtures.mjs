// Synthetic targets only. This builder is test data, not a production adoption/migration engine.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createConfiguration } from "../../docs/templates/adoption-state.mjs";
import { snapshotBaseline } from "../../docs/templates/adoption-pins.mjs";

export const pack = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const sourceRef = "a".repeat(40); // Explicit synthetic Git identity for structural tests.
export function write(root, name, text) {
  const file = path.join(root, name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}
export function read(root, name) { return fs.readFileSync(path.join(root, name), "utf8"); }
export function run(root, command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", timeout: 15000 });
  assert.equal(result.error, undefined, result.error?.message);
  return { ...result, output: `${result.stdout}${result.stderr}` };
}
export function audit(root) {
  return run(root, process.execPath, [path.join(pack, "docs/templates/adoption-audit.mjs"), root]);
}
export function report(root, manifest) {
  write(root, "docs/viberails-adoption.md", [
    "# VibeRails Adoption", "", "Synthetic controlled target; no live integration is claimed.",
    `Source: ${manifest.viberails.sourceRef}; pack: ${manifest.viberails.packVersion}.`,
    `Branch: ${manifest.target.defaultBranch}; target: ${manifest.target.prTargetBranch}; naming: ${manifest.target.branchNaming}.`,
    `Gate: ${manifest.target.qualityGate.canonicalCommand}.`,
    `PR: ${manifest.target.prPolicy.draftByDefault}, ${manifest.target.prPolicy.reviewPublishing}, ${manifest.target.prPolicy.allowedWriteOperations.join(", ")}.`,
    `Profiles: ${Object.values(manifest.profiles).join(", ")}.`,
    `Skills: ${manifest.agentSkills.mode}; self-improve: ${manifest.selfImprove.enabled}, ${manifest.selfImprove.tracker}.`,
    `Labels: ${manifest.selfImprove.labels.join(", ")}; ${manifest.selfImprove.providerLabels.join(", ")}.`,
    "", "## Configuration And Instruction Baseline",
    ...(manifest.configuration ? ["| Field | Actual value |", "|---|---|",
      ...Object.entries(manifest.configuration).map(([key, value]) => `| ${key} | \`${value}\` |`)]
      : ["Configuration is legacy/unselected."]),
    "", "## Preservation", "Local warnings, commands and operations documentation remain owned by the target.",
    "Open questions and remaining code migration are not evidence of completed compliance.",
    "", "## Navigation", "[Index](INDEX.md)", "",
  ].join("\n"));
}
export function save(root, manifest, { snapshot = false } = {}) {
  report(root, manifest);
  if (snapshot) manifest.promptBaseline = snapshotBaseline(root, manifest);
  write(root, ".viberails/adoption.json", JSON.stringify(manifest, null, 2) + "\n");
}
export function createTarget(root, { multi = false } = {}) {
  const manifest = JSON.parse(read(pack, "docs/templates/viberails-adoption.json"));
  manifest.adoptedAt = "2026-09-16T00:00:00Z";
  manifest.viberails = { sourcePath: null, sourceRemote: null, sourceRef, packVersion: "0.4.0" };
  manifest.target = {
    repositoryRoot: ".", remote: null, defaultBranch: "main", prTargetBranch: "none",
    prPolicy: { draftByDefault: false, allowedWriteOperations: ["none"], reviewPublishing: "local-only", notes: "Local controlled target" },
    branchNaming: "work/task",
    qualityGate: { canonicalCommand: "python3 -m unittest discover", pathToScopeMap: [
      { paths: ["**"], scope: "repo", commands: ["python3 -m unittest test_label"], workingDirectory: ".", requiredBeforePr: true },
    ] },
    projectProfiles: [{ paths: ["."], documentationRoot: ".", profile: "python-cli", standards: ["architecture.md"], qualityGateScope: "repo", exception: null }],
  };
  manifest.profiles = { agentRuntime: "codex", stack: "python-cli", workTracking: "none", codeHosting: "none", scriptPlatform: "posix-shell" };
  manifest.integrations.workTracking.profile = "none";
  manifest.integrations.workTracking.noneReason = "Controlled local exercise";
  manifest.integrations.codeHosting.profile = "none";
  manifest.integrations.codeHosting.noneReason = "No remote in controlled exercise";
  manifest.agentSkills = { mode: "none", selectedSkills: [], sourcePath: null, sourceRef: null, targetPath: null, duplicateNamePolicy: "One scope per skill name", decisionReason: "No optional skill needed" };
  manifest.auth = { workTracking: "none", codeHosting: "none" };
  manifest.selfImprove.providerLabels = [];
  manifest.selfImprove.commentTemplate = "Sanitized evidence only";
  manifest.selfImprove.auth.readCheck = "none";
  manifest.selfImprove.auth.writeCheck = "none";
  manifest.selfImprove.disabledReason = "No live service in controlled exercise";
  manifest.openQuestions = [];
  manifest.exceptions = [];
  manifest.configuration = createConfiguration("light");
  manifest.copiedFiles = [{ sourcePath: "docs/standards/architecture.md", targetPath: "docs/standards/architecture.md", sourceRef, mode: "created", scope: "repo", reason: "Synthetic general rule" }];
  write(root, "README.md", "# Label CLI\n\nRun python3 -m unittest test_label.\n\n[Rules](AGENTS.md) | [Docs](docs/INDEX.md)\n");
  write(root, "AGENTS.md", "# Local Rules\n\nNever publish without owner approval.\nPreserve required CI and commands.\n\n[Docs](docs/INDEX.md)\n");
  write(root, "docs/operations.md", "# Operations\n\nPreserve the existing retry contract.\n\n[Index](INDEX.md)\n");
  write(root, "docs/standards/architecture.md", "# Architecture\n\nKeep policy pure.\n\n[Index](../INDEX.md)\n");
  const index = ["# Documentation", "", "[Root](../README.md)", "[Rules](../AGENTS.md)", "[Architecture](standards/architecture.md)", "[Operations](operations.md)", "[Adoption](viberails-adoption.md)"];
  if (multi) {
    manifest.profiles.stack = "mixed";
    manifest.target.projectProfiles[0].profile = "documented-exception";
    manifest.target.projectProfiles[0].exception = "Root coordinates two small packages";
    for (const relative of ["services/cli", "packages/labels"]) {
      write(root, `${relative}/pyproject.toml`, '[project]\nname = "synthetic-package"\nversion = "0.0.1"\n');
      write(root, `${relative}/README.md`, "# Package\n\nUse its documented Python command.\n\n[Docs](docs/INDEX.md)\n");
      write(root, `${relative}/AGENTS.md`, "# Package Rules\n\nDo not remove the local validation boundary.\n\n[Docs](docs/INDEX.md)\n");
      write(root, `${relative}/docs/INDEX.md`, "# Package Docs\n\n[Readme](../README.md) | [Rules](../AGENTS.md) | [Root](../../../docs/INDEX.md)\n");
      manifest.target.projectProfiles.push({ paths: [relative], documentationRoot: relative, profile: "python-cli", standards: ["architecture.md"], qualityGateScope: "repo", exception: null });
      index.push(`[${relative}](../${relative}/docs/INDEX.md)`);
    }
  }
  write(root, "docs/INDEX.md", index.join("\n") + "\n");
  write(root, "label.py", 'def label(value):\n    result = value.strip()\n    if not result:\n        raise ValueError("empty label")\n    return result\n');
  write(root, "test_label.py", 'import unittest\nfrom label import label\n\nclass LabelTests(unittest.TestCase):\n    def test_trim(self): self.assertEqual(label(" x "), "x")\n    def test_preserve(self): self.assertEqual(label("two words"), "two words")\n    def test_empty(self):\n        with self.assertRaises(ValueError): label(" ")\n');
  save(root, manifest, { snapshot: true });
  return manifest;
}
export function withTarget(action, options = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "viberails-adoption-"));
  try { return action(root, createTarget(root, options)); }
  finally { fs.rmSync(root, { recursive: true, force: true }); }
}
