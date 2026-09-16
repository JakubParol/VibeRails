import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createConfiguration, checkConfiguration } from "../../docs/templates/adoption-state.mjs";
import { snapshotBaseline } from "../../docs/templates/adoption-pins.mjs";
import { audit, pack, read, run, save, withTarget, write } from "./adoption-fixtures.mjs";

function passes(result) { assert.equal(result.status, 0, result.output); }
function fails(result, pattern) { assert.equal(result.status, 1, result.output); assert.match(result.output, pattern); }

test("presets initialize explicit independent values, not inherited quality levels", () => {
  const config = createConfiguration("light", { verification: "ci-first", review: "independent" });
  assert.equal(config.architecture, "minimal");
  assert.equal(config.verification, "ci-first");
  assert.equal(config.review, "independent");
  const before = structuredClone(config);
  config.initializedFrom = "standard";
  assert.deepEqual(checkConfiguration(config), []);
  assert.deepEqual({ ...config, initializedFrom: "light" }, before);
  assert.throws(() => createConfiguration("light", { version: 2 }));
  assert.throws(() => createConfiguration("light", { extra: true }));
  assert.throws(() => createConfiguration("light", { modelRouting: "automatic" }));
});

test("fresh selected adoption passes structure and native behavior without changing files", () => {
  withTarget((root) => {
    const before = read(root, ".viberails/adoption.json");
    const result = audit(root); passes(result);
    assert.match(result.output, /configuration: selected/);
    assert.match(result.output, /No code-compliance, live-capability or CI PASS/);
    passes(run(root, "python3", ["-B", "-m", "unittest", "test_label"]));
    assert.equal(read(root, ".viberails/adoption.json"), before);
  });
});

test("legacy absence stays unselected and is never silently populated", () => {
  withTarget((root, manifest) => {
    delete manifest.configuration; delete manifest.promptBaseline;
    manifest.viberails.sourceRef = "legacy-tag";
    save(root, manifest);
    const before = read(root, ".viberails/adoption.json");
    const result = audit(root); passes(result);
    assert.match(result.output, /legacy\/unselected/);
    assert.equal(read(root, ".viberails/adoption.json"), before);
  });
});

test("unsupported manifest, configuration and pin versions fail closed", () => {
  withTarget((root, manifest) => {
    for (const mutate of [
      (m) => { m.schemaVersion = 2; },
      (m) => { m.schemaVersion = "1"; },
      (m) => { m.configuration.version = 2; },
      (m) => { m.promptBaseline.version = 2; },
      (m) => { m.configuration = null; },
      (m) => { delete m.configuration.documentation; },
      (m) => { m.configuration.extra = "unknown"; },
      (m) => { m.configuration.modelRouting = "automatic"; },
    ]) {
      const invalid = structuredClone(manifest); mutate(invalid); save(root, invalid);
      fails(audit(root), /unsupported|unknown|must be an object/);
    }
  });
});

test("selected adoption requires immutable source refs and complete pins", () => {
  withTarget((root, manifest) => {
    for (const mutate of [
      (m) => { m.viberails.sourceRef = "main"; },
      (m) => { m.copiedFiles[0].sourceRef = "latest"; },
      (m) => { delete m.promptBaseline; },
      (m) => { m.agentSkills.mode = "user-scope"; m.agentSkills.sourceRef = "main"; },
      (m) => { m.promptBaseline.components.pop(); },
      (m) => { m.promptBaseline.components.push(m.promptBaseline.components[0]); },
    ]) {
      const invalid = structuredClone(manifest); mutate(invalid); save(root, invalid);
      fails(audit(root), /immutable|promptBaseline|duplicates/);
    }
  });
});

test("stale instruction content and new local rules require explicit reviewed repinning", () => {
  withTarget((root, manifest) => {
    write(root, "AGENTS.md", read(root, "AGENTS.md") + "Keep the new local invariant.\n");
    const stale = read(root, ".viberails/adoption.json");
    fails(audit(root), /content changed/);
    assert.equal(read(root, ".viberails/adoption.json"), stale);
    save(root, manifest, { snapshot: true }); passes(audit(root));
    write(root, "feature/AGENTS.md", "# Feature\n\nDo not bypass validation.\n\n[Root](../docs/INDEX.md)\n");
    write(root, "docs/INDEX.md", read(root, "docs/INDEX.md") + "[Feature](../feature/AGENTS.md)\n");
    fails(audit(root), /maintained instruction missing|content changed/);
    save(root, manifest, { snapshot: true }); passes(audit(root));
    write(root, "feature/README.md", "# Feature purpose\n\nPreserve this local rule.\n[Root](../docs/INDEX.md)\n");
    write(root, "feature/AGENTS.md", read(root, "feature/AGENTS.md") + "[Context](README.md)\n");
    fails(audit(root), /maintained instruction missing|content changed/);
    save(root, manifest, { snapshot: true }); passes(audit(root));
  });
});

test("snapshot CLI emits a deterministic candidate, never modifies settings or timestamps", () => {
  withTarget((root, manifest) => {
    const before = read(root, ".viberails/adoption.json");
    const args = [path.join(pack, "docs/templates/adoption-pins.mjs"), "snapshot", root];
    const first = run(root, process.execPath, args); passes(first);
    const second = run(root, process.execPath, args); passes(second);
    assert.equal(first.stdout, second.stdout);
    assert.deepEqual(JSON.parse(first.stdout), snapshotBaseline(root, manifest));
    assert.equal(read(root, ".viberails/adoption.json"), before);
  });
});

test("pending migrations remain disclosed and a PR policy without a host cannot silently downgrade", () => {
  withTarget((root, manifest) => {
    manifest.openQuestions.push({ category: "workflow", question: "Reconcile an existing adapter boundary", impact: "Code compliance is not verified", owner: "Project owner", neededBefore: "Compliance acceptance" });
    save(root, manifest); const result = audit(root); passes(result);
    assert.match(result.output, /Open questions: 1/);
    manifest.configuration.workflow = "pull-request"; save(root, manifest);
    fails(audit(root), /needs a code host/);
    assert.equal(JSON.parse(read(root, ".viberails/adoption.json")).configuration.workflow, "pull-request");
  });
});

test("unsafe paths, symlinks and malformed records cannot bypass target boundaries", () => {
  withTarget((root, manifest) => {
    for (const mutate of [
      (m) => { m.target.projectProfiles[0].documentationRoot = "../outside"; },
      (m) => { m.target.qualityGate.pathToScopeMap[0].workingDirectory = "../outside"; },
      (m) => { m.promptBaseline.components[0].path = "../outside"; },
      (m) => { m.target.projectProfiles = [null]; },
      (m) => { m.copiedFiles = [null]; },
      (m) => { m.target.projectProfiles[0].standards = ["missing.md"]; },
    ]) {
      const invalid = structuredClone(manifest); mutate(invalid); save(root, invalid);
      fails(audit(root), /inside the target|safe file|object entries/);
    }
    save(root, manifest);
    fs.renameSync(path.join(root, "AGENTS.md"), path.join(root, "saved-rules"));
    fs.symlinkSync("saved-rules", path.join(root, "AGENTS.md"));
    fails(audit(root), /unsafe required file|safe file/);
    write(root, ".viberails/adoption.json", "null\n");
    fails(audit(root), /manifest must be an object/);
  });
});

test("legacy checks still reject inconsistent mirrors, placeholders, missing roots and malformed JSON", () => {
  withTarget((root, manifest) => {
    write(root, "docs/viberails-adoption.md", "# Adoption\n[Index](INDEX.md)\n");
    fails(audit(root), /must mirror/);
    save(root, manifest);
    manifest.target.branchNaming = "<branch-rule>"; save(root, manifest);
    fails(audit(root), /unresolved|concrete/);
    manifest.target.branchNaming = "work/task"; save(root, manifest);
    fs.rmSync(path.join(root, "README.md"));
    fails(audit(root), /Missing or unsafe|cannot resolve/);
    write(root, ".viberails/adoption.json", "{broken");
    fails(audit(root), /not valid JSON/);
  });
});

test("adoption Markdown checks ignore examples but still reject real broken links", () => {
  withTarget((root, manifest) => {
    write(root, "docs/operations.md", "# Operations\n\n```text\n[example](absent-example.md)\n```\n`[inline](absent-inline.md)`\n\n[Index](INDEX.md)\n");
    passes(audit(root));
    write(root, "docs/operations.md", read(root, "docs/operations.md") + "[real](missing-real.md)\n");
    fails(audit(root), /missing-real/);
    save(root, manifest);
  });
});


test("navigation keeps code labels and ignores nested fence examples and complete spans", () => {
  withTarget((root) => {
    write(root, "docs/operations.md", [
      "# Operations", "", "````md", "```text", "[nested](never.md)", "~~~", "````", "",
      "\u00e9 ``[example](inline-never.md) ` still code`` [`Index`](INDEX.md)", "",
    ].join("\n"));
    passes(audit(root));
    write(root, "docs/operations.md", read(root, "docs/operations.md") + "[`bad`](absent-code-label.md)\n");
    fails(audit(root), /absent-code-label/);
  });
});
