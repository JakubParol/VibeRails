// Executable controlled adoption examples, not an autonomous migration or agent evaluator.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createConfiguration } from "../../docs/templates/adoption-state.mjs";
import { snapshotBaseline } from "../../docs/templates/adoption-pins.mjs";
import { audit, pack, read, run, save, sourceRef, withTarget, write } from "./adoption-fixtures.mjs";

const acceptedReference = "418980e59b77327cbc63a3aa67728bba6bb09523";
function passes(result) { assert.equal(result.status, 0, result.output); }

test("fresh actual standard copies and the optional audit bundle work in an isolated target", () => {
  withTarget((root, manifest) => {
    const names = ["agent-workflow", "change-protocol", "documentation", "configuration", "adoption",
      "adoption-manifest", "documentation-audit", "integration-profiles", "platform-profiles",
      "quality-gate", "self-improve-loop", "architecture", "coding", "stack-profiles"];
    const mapping = new Map(names.map((name) => [`docs/standards/${name}.md`, `docs/standards/${name}.md`]));
    mapping.set("docs/templates/adopt-standards-prompt.md", "docs/adopt-standards.md");
    for (const name of ["adoption-audit", "adoption-state", "adoption-pins"]) {
      mapping.set(`docs/templates/${name}.mjs`, `tools/viberails/${name}.mjs`);
    }
    for (const name of ["values", "providers", "records", "navigation"]) {
      mapping.set(`docs/templates/adoption-audit/${name}.mjs`, `tools/viberails/adoption-audit/${name}.mjs`);
    }
    manifest.copiedFiles = [];
    for (const [source, destination] of mapping) {
      let text = read(pack, source);
      if (source.endsWith(".md")) {
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, target) => {
          if (/^[a-z]+:/i.test(target) || target.startsWith("#")) return match;
          const [relative, anchor] = target.split("#");
          const absolute = path.posix.normalize(path.posix.join(path.posix.dirname(source), relative));
          const mapped = mapping.get(absolute);
          if (mapped) {
            const local = path.posix.relative(path.posix.dirname(destination), mapped);
            return `[${label}](${local}${anchor ? `#${anchor}` : ""})`;
          }
          if (absolute === "docs/INDEX.md") {
            return `[${label}](${path.posix.relative(path.posix.dirname(destination), "docs/INDEX.md")})`;
          }
          // Optional, unselected source references stay external and pinned, not copied rules.
          // External fetches are deliberately outside this structural fixture's evidence.
          return `[${label}](https://github.com/JakubParol/VibeRails/blob/${acceptedReference}/${absolute}${anchor ? `#${anchor}` : ""})`;
        });
        if (source.endsWith("adopt-standards-prompt.md")) {
          text = text.replace("<source-path-or-url-and-immutable-ref>", "the approved pinned source in the adoption record");
        }
      }
      write(root, destination, text);
      manifest.copiedFiles.push({ sourcePath: source, targetPath: destination, sourceRef, mode: "created", scope: "repo", reason: "Controlled copy of current general standards" });
    }
    const index = read(root, "docs/INDEX.md") + [...mapping.values()]
      .filter((p) => p.endsWith(".md") && !p.endsWith("architecture.md"))
      .map((p) => `[${path.posix.basename(p)}](${path.posix.relative("docs", p)})\n`).join("");
    write(root, "docs/INDEX.md", index);
    const protectedRules = read(root, "AGENTS.md");
    save(root, manifest, { snapshot: true });
    passes(audit(root));
    passes(run(root, process.execPath, [path.join(root, "tools/viberails/adoption-audit.mjs"), root]));
    passes(run(root, "python3", ["-B", "-m", "unittest", "test_label"]));
    assert.equal(read(root, "AGENTS.md"), protectedRules);
    assert.equal(manifest.configuration.modelRouting, "inherit");
    assert.ok(manifest.promptBaseline.components.length >= 18);
  });
});

test("multi-root refresh preserves local rules, settings and old per-file refs; repeated refresh is a no-op", () => {
  withTarget((root, manifest) => {
    manifest.configuration = createConfiguration("standard", { workflow: "local", verification: "local-focused" });
    write(root, "docs/standards/local-testing.md", "# Testing\n\nPreserve the project test command.\n\n[Index](../INDEX.md)\n");
    write(root, "docs/INDEX.md", read(root, "docs/INDEX.md") + "[Testing](standards/local-testing.md)\n");
    manifest.copiedFiles.push({ sourcePath: "docs/standards/testing.md", targetPath: "docs/standards/local-testing.md", sourceRef, mode: "merged", scope: "repo", reason: "Prior local adaptation" });
    save(root, manifest, { snapshot: true }); passes(audit(root));
    const protectedFiles = new Map(["AGENTS.md", "docs/operations.md", "services/cli/AGENTS.md", "packages/labels/AGENTS.md", "label.py"]
      .map((file) => [file, read(root, file)]));
    const choices = structuredClone({ configuration: manifest.configuration, qualityGate: manifest.target.qualityGate, auth: manifest.auth, integrations: manifest.integrations });
    // The scenario approves this one nonconflicting general-rule refresh, not a blanket overwrite.
    const nextRef = "b".repeat(40);
    write(root, "docs/standards/architecture.md", read(root, "docs/standards/architecture.md") + "Keep adapters outside pure policy.\n");
    assert.equal(audit(root).status, 1); // Never silently repin unexplained changes.
    manifest.viberails.sourceRef = nextRef;
    manifest.copiedFiles[0] = { ...manifest.copiedFiles[0], sourceRef: nextRef, mode: "refreshed", reason: "Approved general-rule delta" };
    manifest.openQuestions.push({ category: "workflow", question: "Verify a legacy code boundary", impact: "Full code compliance remains unproved", owner: "Project owner", neededBefore: "Compliance acceptance" });
    save(root, manifest, { snapshot: true });
    const checked = audit(root); passes(checked); assert.match(checked.output, /Open questions: 1/);
    for (const [file, text] of protectedFiles) assert.equal(read(root, file), text);
    assert.deepEqual({ configuration: manifest.configuration, qualityGate: manifest.target.qualityGate, auth: manifest.auth, integrations: manifest.integrations }, choices);
    const unchangedPin = manifest.promptBaseline.components.find((p) => p.path.endsWith("local-testing.md"));
    assert.equal(unchangedPin.version, sourceRef);
    const before = read(root, ".viberails/adoption.json");
    assert.deepEqual(snapshotBaseline(root, manifest), manifest.promptBaseline);
    passes(audit(root)); assert.equal(read(root, ".viberails/adoption.json"), before);
    passes(run(root, "python3", ["-B", "-m", "unittest", "test_label"]));
  }, { multi: true });
});

test("a real three-way conflict leaves local instructions unchanged until the scoped resolution", () => {
  withTarget((root, manifest) => {
    const original = read(root, "docs/standards/architecture.md");
    const local = original.replace("Keep policy pure.", "Keep the existing local boundary.");
    const upstream = original.replace("Keep policy pure.", "Use the revised general boundary.");
    write(root, "docs/standards/architecture.md", local);
    write(root, "old-source.txt", original); write(root, "new-source.txt", upstream);
    const result = run(root, "git", ["merge-file", "-p", "docs/standards/architecture.md", "old-source.txt", "new-source.txt"]);
    assert.equal(result.status, 1, result.output);
    assert.match(result.stdout, /<<<<<<<|>>>>>>>/);
    assert.equal(read(root, "docs/standards/architecture.md"), local);
    assert.equal(audit(root).status, 1);
    // Explicit fixture decision preserves the local boundary; this is not auto-conflict resolution.
    write(root, "docs/standards/architecture.md", local + "The general update is deferred pending boundary review.\n");
    manifest.openQuestions.push({ category: "workflow", question: "Reconcile general and local boundaries", impact: "Requested rule not yet migrated", owner: "Project owner", neededBefore: "Rule migration" });
    save(root, manifest, { snapshot: true });
    const checked = audit(root); passes(checked); assert.match(checked.output, /Open questions: 1/);
    assert.equal(manifest.copiedFiles[0].sourceRef, sourceRef);
  });
});

test("rollback requires restoring matching instruction bytes and receipt, not changing a version label", () => {
  withTarget((root, manifest) => {
    const file = "docs/standards/architecture.md";
    const beforeFile = read(root, file); const beforeManifest = read(root, ".viberails/adoption.json");
    write(root, file, beforeFile + "An explicitly approved instruction change.\n");
    save(root, manifest, { snapshot: true }); passes(audit(root));
    write(root, ".viberails/adoption.json", beforeManifest);
    assert.equal(audit(root).status, 1);
    write(root, file, beforeFile); passes(audit(root));
    assert.equal(read(root, ".viberails/adoption.json"), beforeManifest);
  });
});
