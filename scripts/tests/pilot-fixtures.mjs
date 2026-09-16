// Fixed pilot source revisions and fixture assembly, not an adoption or orchestration engine.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createTarget, read, report, run, write } from "./adoption-fixtures.mjs";
import { prepareApplication } from "./pilot-apps.mjs";

export const versions = [
  { name: "0.4.0", ref: "a60dca9638bf12cd84244aedcf5fc8d2a9734baa", env: "VIBERAILS_BASELINE_ROOT",
    reviewHash: "3c547567ac896eef5261d3483736ed9a14c088b111e22b2b50da2e695842c051" },
  { name: "0.4.1", ref: "d92f6fa34d1809997c2d9629d81ca382d00e9ff2", env: "VIBERAILS_CANDIDATE_ROOT",
    reviewHash: "27e9d1ba4c37a2b92471ec60c62929f609447d657bf2444ec65f6e5926002191" },
];
export const names = ["agent-workflow", "change-protocol", "documentation", "configuration",
  "adoption", "adoption-manifest", "documentation-audit", "integration-profiles", "platform-profiles",
  "quality-gate", "self-improve-loop", "architecture", "coding", "stack-profiles"];
export const mapping = new Map(names.map((name) => [`docs/standards/${name}.md`, `docs/standards/${name}.md`]));
mapping.set("docs/templates/adopt-standards-prompt.md", "docs/adopt-standards.md");
for (const name of ["adoption-audit", "adoption-state", "adoption-pins"]) {
  mapping.set(`docs/templates/${name}.mjs`, `tools/viberails/${name}.mjs`);
}
for (const name of ["values", "providers", "records", "navigation"]) {
  mapping.set(`docs/templates/adoption-audit/${name}.mjs`, `tools/viberails/adoption-audit/${name}.mjs`);
}
export function sourceRoot(version) {
  const value = process.env[version.env];
  assert.ok(value, `${version.env} must identify the documented pinned snapshot; no current-tree fallback`);
  const root = path.resolve(value);
  const hash = createHash("sha256").update(read(root, ".agents/skills/code-review/SKILL.md")).digest("hex");
  assert.equal(hash, version.reviewHash, "Wrong review entrypoint for the selected source snapshot");
  return root;
}
export function passes(result) { assert.equal(result.status, 0, result.output); return result; }
export function targetAudit(root) {
  return run(root, process.execPath, [path.join(root, "tools/viberails/adoption-audit.mjs"), root]);
}
export function seal(root, manifest) {
  report(root, manifest);
  write(root, ".viberails/adoption.json", JSON.stringify(manifest, null, 2) + "\n");
  const result = passes(run(root, process.execPath, [path.join(root, "tools/viberails/adoption-pins.mjs"), "snapshot", root]));
  manifest.promptBaseline = JSON.parse(result.stdout);
  write(root, ".viberails/adoption.json", JSON.stringify(manifest, null, 2) + "\n");
}
export function renderSource(root, source, version) {
  let text = read(root, source);
  if (!source.endsWith(".md")) return text;
  // This fixture maps known copied references. It is not a general Markdown migration parser.
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, target) => {
    if (/^[a-z]+:/i.test(target) || target.startsWith("#")) return match;
    const [relative, anchor] = target.split("#");
    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(source), relative));
    const mapped = mapping.get(resolved);
    const destination = mapping.get(source);
    const url = mapped ? path.posix.relative(path.posix.dirname(destination), mapped)
      : `https://github.com/JakubParol/VibeRails/blob/${version.ref}/${resolved}`;
    return `[${label}](${url}${anchor ? `#${anchor}` : ""})`;
  });
  return text.replace("<source-path-or-url-and-immutable-ref>", `the source at ${version.ref}`);
}
export function assemble(root, version, multi) {
  const source = sourceRoot(version);
  const manifest = createTarget(root, { multi });
  const app = prepareApplication(root, multi);
  manifest.viberails = { sourcePath: null, sourceRemote: "https://github.com/JakubParol/VibeRails",
    sourceRef: version.ref, packVersion: version.name };
  manifest.target.qualityGate.canonicalCommand = `python3 -B -m unittest ${app.modules.join(" ")}`;
  manifest.target.qualityGate.pathToScopeMap[0].commands = [manifest.target.qualityGate.canonicalCommand];
  manifest.target.projectProfiles.forEach((profile) => { profile.standards = names.map((name) => `${name}.md`); });
  // This controlled local endpoint does not claim that provider CI or independent review ran.
  if (multi) Object.assign(manifest.configuration, { initializedFrom: "standard", architecture: "layered", documentation: "standard" });
  write(root, "AGENTS.md", read(root, "AGENTS.md") + "\nBatch input is validated before saving. Preserve existing output on invalid input.\n");
  write(root, "docs/operations.md", read(root, "docs/operations.md") + "\nRequired future remote check: Team verification. Local tests do not substitute for it.\n");
  manifest.openQuestions = [{ category: "workflow", question: "Confirm remote Team verification and independent human handoff",
    impact: "Local checks do not prove production acceptance", owner: "Project owner", neededBefore: "Production adoption" }];
  manifest.copiedFiles = [];
  for (const [from, to] of mapping) {
    write(root, to, renderSource(source, from, version));
    manifest.copiedFiles.push({ sourcePath: from, targetPath: to, sourceRef: version.ref, mode: "created",
      scope: "repo", reason: "Controlled pinned-source adoption" });
  }
  write(root, "docs/INDEX.md", read(root, "docs/INDEX.md") + [...mapping.values()]
    .filter((file) => file.endsWith(".md") && !file.endsWith("architecture.md"))
    .map((file) => `[${path.posix.basename(file)}](${path.posix.relative("docs", file)})\n`).join(""));
  seal(root, manifest);
  return { manifest, app };
}
export function native(root, app, expectedStatus = 0) {
  const result = run(root, "python3", ["-B", "-m", "unittest", ...app.modules]);
  assert.equal(result.status, expectedStatus, result.output);
  assert.match(result.output, new RegExp(`Ran ${app.caseCount} tests?`));
  if (expectedStatus === 0) {
    assert.match(result.output, /\bOK\b/);
    assert.doesNotMatch(result.output, /skipped=|expected failures=|unexpected successes=/);
  }
  else assert.match(result.output, /FAILED \(failures=/);
  return result;
}
export function git(root, args) { return passes(run(root, "git", args)).stdout.trim(); }
export function commitFixture(root, message) {
  git(root, ["add", "."]);
  git(root, ["-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "commit", "-m", message]);
  return git(root, ["rev-parse", "HEAD"]);
}
export function protect(root, manifest) {
  const paths = ["AGENTS.md", "docs/operations.md", "README.md", ".gitignore"];
  if (manifest.target.projectProfiles.length > 1) paths.push("services/cli/AGENTS.md", "packages/labels/AGENTS.md");
  return { files: new Map(paths.map((file) => [file, read(root, file)])),
    settings: structuredClone({ configuration: manifest.configuration, target: manifest.target, auth: manifest.auth }) };
}
export function checkProtected(root, manifest, before) {
  for (const [file, text] of before.files) assert.equal(read(root, file), text, file);
  assert.deepEqual({ configuration: manifest.configuration, target: manifest.target, auth: manifest.auth }, before.settings);
}
export function treeBytes(root) {
  const values = [];
  function walk(relative) {
    for (const item of fs.readdirSync(path.join(root, relative), { withFileTypes: true })) {
      if (item.name === ".git") continue;
      const file = path.posix.join(relative, item.name);
      if (item.isDirectory()) walk(file);
      else values.push([file, createHash("sha256").update(fs.readFileSync(path.join(root, file))).digest("hex")]);
    }
  }
  walk(""); return values.sort(([a], [b]) => a.localeCompare(b));
}
