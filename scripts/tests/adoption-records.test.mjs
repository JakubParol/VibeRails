// Concrete record checks; no commands from a manifest are executed.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { audit, read, save, withTarget, write } from "./adoption-fixtures.mjs";

const receipt = "docs/viberails-adoption.md";
function passes(result) { assert.equal(result.status, 0, result.output); }
function rejects(root, pattern) {
  const before = read(root, ".viberails/adoption.json");
  const reportBefore = read(root, receipt);
  const result = audit(root);
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, pattern);
  assert.equal(read(root, ".viberails/adoption.json"), before);
  assert.equal(read(root, receipt), reportBefore);
}

const invalidMaps = [
  ["empty map", (m) => { m.target.qualityGate.pathToScopeMap = []; }],
  ["null command", (m) => { m.target.qualityGate.pathToScopeMap[0].commands = [null]; }],
  ["blank command", (m) => { m.target.qualityGate.pathToScopeMap[0].commands = [" "]; }],
  ["null path", (m) => { m.target.qualityGate.pathToScopeMap[0].paths = [null]; }],
  ["blank project path", (m) => { m.target.projectProfiles[0].paths = [""]; }],
  ["unknown scope", (m) => { m.target.projectProfiles[0].qualityGateScope = "absent"; }],
];
for (const [name, mutate] of invalidMaps) {
  test(`gate mapping rejects ${name} without rewriting records`, () => {
    withTarget((root, manifest) => {
      passes(audit(root));
      mutate(manifest); save(root, manifest);
      rejects(root, /pathToScopeMap|projectProfiles.*paths|qualityGateScope/);
    });
  });
}

test("multiple referenced scopes and glob paths remain data, never executed", () => {
  withTarget((root, manifest) => {
    manifest.target.qualityGate.pathToScopeMap.push({
      paths: ["packages/**", "services/*"], scope: "packages", workingDirectory: ".",
      commands: ["touch should-not-exist"], requiredBeforePr: false,
    });
    manifest.target.projectProfiles[1].qualityGateScope = "packages";
    save(root, manifest); passes(audit(root));
    assert.equal(fs.existsSync(path.join(root, "should-not-exist")), false);
  }, { multi: true });
});

test("documented-exception requires a concrete rationale", () => {
  withTarget((root, manifest) => {
    manifest.target.projectProfiles[0].profile = "documented-exception";
    for (const value of [null, "", " ", "none", {}, "<reason>"]) {
      manifest.target.projectProfiles[0].exception = value;
      save(root, manifest); rejects(root, /exception|unresolved/);
    }
    manifest.target.projectProfiles[0].exception = "Root coordinates independently deployed tools; shared boundary rules still apply.";
    save(root, manifest); passes(audit(root));
    manifest.target.projectProfiles[0].profile = "python-cli";
    manifest.target.projectProfiles[0].exception = null;
    save(root, manifest); passes(audit(root));
  });
});

test("configuration mirror checks each field, not a bag of values", () => {
  withTarget((root, manifest) => {
    const original = read(root, receipt);
    for (const key of Object.keys(manifest.configuration)) {
      const row = `| ${key} | \`${manifest.configuration[key]}\` |`;
      assert.ok(original.includes(row), key);
      write(root, receipt, original.replace(row, `| ${key} | \`wrong\` |`)
        + `\nHistorical value elsewhere: ${manifest.configuration[key]}\n`);
      rejects(root, new RegExp(`configuration\\.${key}`));
    }
    write(root, receipt, original); passes(audit(root));
  });
});

test("independent manifest review cannot be hidden behind adaptive receipt text", () => {
  withTarget((root, manifest) => {
    manifest.configuration.review = "independent";
    write(root, ".viberails/adoption.json", JSON.stringify(manifest, null, 2) + "\n");
    write(root, receipt, read(root, receipt) + "\nIndependent review is an available alternative.\n");
    rejects(root, /configuration\.review/);
    save(root, manifest); passes(audit(root));
  });
});

test("missing and duplicate configuration rows are rejected", () => {
  withTarget((root, manifest) => {
    const original = read(root, receipt);
    const row = "| review | `adaptive` |";
    for (const replacement of ["", `${row}\n| review | independent |`, `${row}\n${row}`]) {
      write(root, receipt, original.replace(row, replacement));
      rejects(root, /configuration\.review/);
    }
    save(root, manifest); passes(audit(root));
  });
});

test("fenced or commented examples do not satisfy a missing configuration mirror", () => {
  withTarget((root, manifest) => {
    const original = read(root, receipt);
    const start = original.indexOf("## Configuration And Instruction Baseline");
    const end = original.indexOf("## Preservation");
    const table = original.slice(start, end);
    for (const example of [`\`\`\`md\n${table}\`\`\`\n`, `<!--\n${table}-->\n`]) {
      write(root, receipt, original.slice(0, start) + example + original.slice(end));
      rejects(root, /configuration/);
    }
    save(root, manifest); passes(audit(root));
  });
});

test("legacy absence needs no new configuration table or pin mutation", () => {
  withTarget((root, manifest) => {
    delete manifest.configuration; delete manifest.promptBaseline;
    save(root, manifest);
    const before = read(root, ".viberails/adoption.json");
    const result = audit(root); passes(result);
    assert.match(result.output, /legacy\/unselected/);
    assert.equal(read(root, ".viberails/adoption.json"), before);
  });
});
