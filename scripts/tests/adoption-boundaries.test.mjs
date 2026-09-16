// Regression evidence for maintained instructions, not an LLM performance evaluation.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { snapshotBaseline } from "../../docs/templates/adoption-pins.mjs";
import { audit, createTarget, pack, read, run, save, withTarget, write } from "./adoption-fixtures.mjs";

function passes(result) { assert.equal(result.status, 0, result.output); }
function fails(result) { assert.equal(result.status, 1, result.output); }
function selectSkill(root, manifest) {
  fs.mkdirSync(path.join(root, ".agents/skills/example"), { recursive: true });
  Object.assign(manifest.agentSkills, {
    mode: "vendored", targetPath: ".agents/skills", selectedSkills: ["example"],
    sourceRef: "a".repeat(40),
  });
}
function receipt(root, manifest, snapshot = false) {
  save(root, manifest, { snapshot });
  write(root, "docs/viberails-adoption.md", read(root, "docs/viberails-adoption.md") + "Selected skill: example.\n");
}
function skill(root) {
  write(root, ".agents/skills/example/SKILL.md", "# Example\n\nPreserve the local boundary.\n\n[Docs](../../../docs/INDEX.md)\n");
  write(root, "docs/INDEX.md", read(root, "docs/INDEX.md") + "[Skill](../.agents/skills/example/SKILL.md)\n");
}

test("configured standards outside docs/standards are pinned and detect drift", () => {
  withTarget((root, manifest) => {
    write(root, "policy/security.md", "# Security\n\nKeep approval explicit.\n\n[Docs](../docs/INDEX.md)\n");
    write(root, "docs/INDEX.md", read(root, "docs/INDEX.md") + "[Security](../policy/security.md)\n");
    manifest.target.projectProfiles[0].standards.push("policy/security.md");
    save(root, manifest, { snapshot: true }); passes(audit(root));
    assert.ok(manifest.promptBaseline.components.some((entry) => entry.path === "policy/security.md"));
    const receiptBefore = read(root, ".viberails/adoption.json");
    write(root, "policy/security.md", read(root, "policy/security.md") + "A changed rule.\n");
    const result = audit(root); fails(result);
    assert.match(result.output, /content changed/);
    assert.equal(read(root, ".viberails/adoption.json"), receiptBefore);
    save(root, manifest, { snapshot: true }); passes(audit(root));
  });
});

test("missing selected vendored skill cannot receive a successful snapshot or audit", () => {
  withTarget((root, manifest) => {
    selectSkill(root, manifest); receipt(root, manifest);
    assert.throws(() => snapshotBaseline(root, manifest));
    fails(audit(root));
  });
});

test("selected vendored entrypoint cannot be hidden behind a symlink", () => {
  withTarget((root, manifest) => {
    selectSkill(root, manifest);
    write(root, "payload.txt", "Synthetic instruction bytes\n");
    fs.symlinkSync("../../../payload.txt", path.join(root, ".agents/skills/example/SKILL.md"), "file");
    receipt(root, manifest);
    assert.throws(() => snapshotBaseline(root, manifest));
    fails(audit(root));
  });
});

test("vendored reference symlinks cannot disappear from the maintained inventory", () => {
  withTarget((root, manifest) => {
    selectSkill(root, manifest); skill(root);
    write(root, "payload.txt", "Synthetic reference bytes\n");
    fs.mkdirSync(path.join(root, ".agents/skills/example/references"));
    fs.symlinkSync("../../../../payload.txt", path.join(root, ".agents/skills/example/references/rules.md"), "file");
    receipt(root, manifest);
    assert.throws(() => snapshotBaseline(root, manifest));
    fails(audit(root));
  });
});

test("valid vendored instructions are pinned and later changes do not rewrite receipts", () => {
  withTarget((root, manifest) => {
    selectSkill(root, manifest); skill(root); receipt(root, manifest, true);
    passes(audit(root));
    const before = read(root, ".viberails/adoption.json");
    write(root, ".agents/skills/example/SKILL.md", read(root, ".agents/skills/example/SKILL.md") + "New reviewed rule.\n");
    fails(audit(root));
    assert.equal(read(root, ".viberails/adoption.json"), before);
    receipt(root, manifest, true); passes(audit(root));
  });
});

test("vendored selection rejects duplicate names and path traversal", () => {
  withTarget((root, manifest) => {
    selectSkill(root, manifest); skill(root);
    for (const names of [[], ["example", "example"], ["../example"], ["example/references"]]) {
      manifest.agentSkills.selectedSkills = names;
      receipt(root, manifest);
      assert.throws(() => snapshotBaseline(root, manifest));
      fails(audit(root));
    }
  });
});

test("configured standard cannot be silently dropped after deletion", () => {
  withTarget((root, manifest) => {
    fs.rmSync(path.join(root, "docs/standards/architecture.md"));
    assert.throws(() => snapshotBaseline(root, manifest));
    fails(audit(root));
  });
});

test("snapshot and audit work on a target path containing spaces", () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), "viberails-paths-"));
  const root = path.join(parent, "target with spaces");
  fs.mkdirSync(root);
  try {
    const manifest = createTarget(root);
    const before = read(root, ".viberails/adoption.json");
    passes(audit(root));
    const result = run(root, process.execPath, [path.join(pack, "docs/templates/adoption-pins.mjs"), "snapshot", root]);
    passes(result);
    assert.deepEqual(JSON.parse(result.stdout), manifest.promptBaseline);
    assert.equal(read(root, ".viberails/adoption.json"), before);
  } finally { fs.rmSync(parent, { recursive: true, force: true }); }
});

test("a physical parent alias keeps local links inside the root and external links outside", () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), "viberails-alias-"));
  const physical = path.join(parent, "physical");
  const root = path.join(physical, "target");
  const alias = path.join(parent, "visible");
  fs.mkdirSync(root, { recursive: true });
  try {
    const manifest = createTarget(root);
    fs.symlinkSync(physical, alias, "junction");
    const aliasedRoot = path.join(alias, "target");
    passes(audit(aliasedRoot));
    write(physical, "outside.md", "# Outside the target\n");
    write(root, "docs/INDEX.md", read(root, "docs/INDEX.md") + "[Outside](../../outside.md)\n");
    save(root, manifest, { snapshot: true });
    const result = audit(aliasedRoot);
    fails(result);
    assert.match(result.output, /link outside the target repository/);
  } finally { fs.rmSync(parent, { recursive: true, force: true }); }
});
