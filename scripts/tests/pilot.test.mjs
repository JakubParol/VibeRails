// Fixed-revision compatibility pilot. No model calls, provider writes or performance ranking.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { read, run, write } from "./adoption-fixtures.mjs";
import {
  versions, mapping, sourceRoot, renderSource, assemble, native, targetAudit, seal,
  passes, git, commitFixture, protect, checkProtected, treeBytes,
} from "./pilot-fixtures.mjs";

function workspace(action) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "viberails-pilot-"));
  const root = path.join(directory, "project");
  fs.mkdirSync(root);
  try { return action(root, directory); }
  finally { fs.rmSync(directory, { recursive: true, force: true }); }
}
function cloneHandoff(root, directory, app) {
  const head = git(root, ["rev-parse", "HEAD"]);
  assert.equal(git(root, ["status", "--porcelain"]), "");
  const clone = path.join(directory, "handoff");
  passes(run(directory, "git", ["clone", "--no-hardlinks", root, clone]));
  assert.equal(git(clone, ["rev-parse", "HEAD"]), head);
  native(clone, app);
  passes(targetAudit(clone));
  assert.equal(git(clone, ["status", "--porcelain"]), "");
  return { clone, head };
}

for (const version of versions) {
  for (const multi of [false, true]) {
    test(`${version.name} ${multi ? "multi-root" : "small"}: red/green task and clean-clone handoff`, (t) => {
      workspace((root, directory) => {
        const { manifest, app } = assemble(root, version, multi);
        const protectedState = protect(root, manifest);
        const pins = read(root, ".viberails/adoption.json");
        const initial = passes(targetAudit(root));
        assert.match(initial.output, /Open questions: 1/);
        assert.match(initial.output, /No code-compliance, live-capability or CI PASS is implied/);
        // This seeded failure is an intentional control, not an accidental model mistake.
        native(root, app, 1);
        app.fix();
        native(root, app);
        assert.equal(read(root, ".viberails/adoption.json"), pins, "Code changes must not repin instructions");
        checkProtected(root, manifest, protectedState);
        passes(targetAudit(root));
        git(root, ["init", "-b", "main"]);
        commitFixture(root, "Complete controlled batch task and pinned adoption");
        const handoff = cloneHandoff(root, directory, app);
        t.diagnostic(`Source ${version.ref}; ${app.caseCount} native cases in each red/green/clone run; handoff ${handoff.head}`);
      });
    });
  }
}

test("0.4.0 -> 0.4.1 refresh preserves custom rules and provenance; no-op and rollback remain honest", (t) => {
  workspace((root) => {
    const [beforeVersion, afterVersion] = versions;
    const oldSource = sourceRoot(beforeVersion);
    const newSource = sourceRoot(afterVersion);
    const { manifest, app } = assemble(root, beforeVersion, true);
    app.fix();
    const ownerFile = "docs/standards/agent-workflow.md";
    const warning = "Local contract: preserve the named Team verification check and assigned human owner.\n";
    write(root, ownerFile, read(root, ownerFile).replace("# Agent Workflow Standard\n", `# Agent Workflow Standard\n\n${warning}`));
    seal(root, manifest);
    passes(targetAudit(root)); native(root, app);
    const preserved = protect(root, manifest);
    const originalFiles = new Map([...mapping.values(), ".viberails/adoption.json", "docs/viberails-adoption.md"]
      .map((file) => [file, read(root, file)]));
    const unchangedRefs = new Map();
    let updated = 0;
    for (const [from, to] of mapping) {
      const entry = manifest.copiedFiles.find((item) => item.targetPath === to);
      if (read(oldSource, from) === read(newSource, from)) {
        unchangedRefs.set(to, entry.sourceRef);
        continue;
      }
      const temp = fs.mkdtempSync(path.join(os.tmpdir(), "viberails-three-way-"));
      try {
        write(temp, "old.txt", renderSource(oldSource, from, beforeVersion));
        write(temp, "new.txt", renderSource(newSource, from, afterVersion));
        const localBefore = read(root, to);
        const merged = passes(run(root, "git", ["merge-file", "-p", to, path.join(temp, "old.txt"), path.join(temp, "new.txt")]));
        assert.equal(read(root, to), localBefore, "Preview must not mutate the target");
        write(root, to, merged.stdout); // Fixture's explicit approval of this inspected nonconflicting delta.
        Object.assign(entry, { sourceRef: afterVersion.ref, mode: "refreshed", reason: "Controlled approved version delta" });
        updated++;
      } finally { fs.rmSync(temp, { recursive: true, force: true }); }
    }
    assert.ok(updated > 0 && unchangedRefs.size > 0);
    assert.match(read(root, ownerFile), /Local contract: preserve/);
    const stale = targetAudit(root);
    assert.equal(stale.status, 1, stale.output);
    assert.match(stale.output, /content changed; review before repinning/);
    manifest.viberails.sourceRef = afterVersion.ref;
    manifest.viberails.packVersion = afterVersion.name;
    manifest.adoptedAt = "2026-09-16T12:00:00Z";
    seal(root, manifest);
    passes(targetAudit(root)); native(root, app);
    checkProtected(root, manifest, preserved);
    for (const [file, ref] of unchangedRefs) {
      assert.equal(manifest.copiedFiles.find((item) => item.targetPath === file).sourceRef, ref);
    }
    const bytes = treeBytes(root);
    const candidate = passes(run(root, process.execPath, [path.join(root, "tools/viberails/adoption-pins.mjs"), "snapshot", root]));
    assert.deepEqual(JSON.parse(candidate.stdout), manifest.promptBaseline);
    passes(targetAudit(root));
    assert.deepEqual(treeBytes(root), bytes, "An unchanged check/snapshot must not rewrite files or dates");
    // Version-only rollback is invalid. Restore the matching files, then receipt.
    write(root, ".viberails/adoption.json", originalFiles.get(".viberails/adoption.json"));
    assert.equal(targetAudit(root).status, 1);
    for (const [file, text] of originalFiles) write(root, file, text);
    passes(targetAudit(root)); native(root, app);
    assert.match(read(root, ownerFile), /Local contract: preserve/);
    t.diagnostic(`Real source delta: ${updated} files refreshed; ${unchangedRefs.size} retained source refs; native cases ${app.caseCount}`);
  });
});

test("a later task change invalidates an old clean handoff instead of relabeling its evidence", (t) => {
  workspace((root, directory) => {
    const { app } = assemble(root, versions[1], true);
    app.fix(); native(root, app); passes(targetAudit(root));
    git(root, ["init", "-b", "main"]);
    commitFixture(root, "First verified task revision");
    const handoff = cloneHandoff(root, directory, app);
    const file = "packages/labels/batch.py";
    const good = read(root, file);
    write(root, file, good.replace('if item not in seen:', 'if True:'));
    const changedHead = commitFixture(root, "Seed later behavior regression to exercise stale evidence");
    assert.notEqual(changedHead, handoff.head);
    native(root, app, 1); // Old clone is green, current revision is not.
    assert.equal(git(handoff.clone, ["rev-parse", "HEAD"]), handoff.head);
    write(root, file, good);
    native(root, app);
    commitFixture(root, "Restore and reverify the affected task behavior");
    assert.equal(git(root, ["status", "--porcelain"]), "");
    t.diagnostic("Old clone result retained for its own SHA; changed revision required correction and fresh native evidence");
  });
});
