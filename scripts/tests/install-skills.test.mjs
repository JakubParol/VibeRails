// Run only on POSIX. All installation/removal is confined to synthetic CODEX_HOME directories.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../install-skills.sh", import.meta.url));
if (process.platform === "win32") throw new Error("Use a POSIX runner; this suite does not test PowerShell.");
function fixture(action) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "viberails-install-")));
  const pack = path.join(root, "pack with spaces");
  const home = path.join(root, "user home");
  const skill = path.join(pack, ".agents/skills/example");
  const link = path.join(home, "skills/example");
  fs.mkdirSync(skill, { recursive: true });
  fs.mkdirSync(path.join(pack, "scripts"));
  fs.mkdirSync(path.dirname(link), { recursive: true });
  fs.writeFileSync(path.join(skill, "SKILL.md"), "# Synthetic skill\n");
  const script = path.join(pack, "scripts/install-skills.sh");
  fs.copyFileSync(source, script);
  const run = (...args) => {
    const result = spawnSync("sh", [script, ...args], {
      cwd: root, env: { ...process.env, CODEX_HOME: home }, encoding: "utf8", timeout: 10000,
    });
    assert.equal(result.error, undefined, result.error?.message);
    return { ...result, output: result.stdout + result.stderr };
  };
  try { action({ root, pack, home, skill, link, run }); }
  finally { fs.rmSync(root, { recursive: true, force: true }); }
}
function passes(result) { assert.equal(result.status, 0, result.output); }
function conflicts(result) { assert.equal(result.status, 1, result.output); assert.match(result.output, /conflict|refusing/); }

test("fresh install, repeat and owned removal preserve source content", () => {
  fixture(({ skill, link, run }) => {
    passes(run()); assert.equal(fs.realpathSync(link), skill);
    const inode = fs.lstatSync(link).ino;
    passes(run()); assert.equal(fs.lstatSync(link).ino, inode);
    passes(run("--remove")); assert.equal(fs.existsSync(link), false);
    assert.equal(fs.readFileSync(path.join(skill, "SKILL.md"), "utf8"), "# Synthetic skill\n");
    passes(run("--remove"));
  });
});

for (const args of [[], ["--remove"]]) {
  test(`foreign skill link is preserved during ${args.length ? "removal" : "installation"}`, () => {
    fixture(({ root, link, run }) => {
      const target = path.join(root, "user skill"); fs.mkdirSync(target);
      fs.writeFileSync(path.join(target, "SKILL.md"), "# User skill\n");
      fs.symlinkSync(target, link);
      conflicts(run(...args));
      assert.equal(fs.readlinkSync(link), target);
      assert.equal(fs.readFileSync(path.join(target, "SKILL.md"), "utf8"), "# User skill\n");
    });
  });
}

test("dangling foreign links survive both operations", () => {
  fixture(({ root, link, run }) => {
    const target = path.join(root, "absent user skill"); fs.symlinkSync(target, link);
    for (const args of [[], ["--remove"]]) {
      conflicts(run(...args)); assert.equal(fs.readlinkSync(link), target);
    }
  });
});

test("real user directory or file is never replaced or removed", () => {
  fixture(({ link, run }) => {
    fs.mkdirSync(link); fs.writeFileSync(path.join(link, "keep.txt"), "keep\n");
    for (const args of [[], ["--remove"]]) {
      conflicts(run(...args)); assert.equal(fs.readFileSync(path.join(link, "keep.txt"), "utf8"), "keep\n");
    }
    fs.rmSync(link, { recursive: true }); fs.writeFileSync(link, "keep file\n");
    conflicts(run()); conflicts(run("--remove"));
    assert.equal(fs.readFileSync(link, "utf8"), "keep file\n");
  });
});

test("a link from another checkout is a conflict, not an automatic upgrade", () => {
  fixture(({ root, link, run }) => {
    const target = path.join(root, "other checkout/.agents/skills/example");
    fs.mkdirSync(target, { recursive: true }); fs.writeFileSync(path.join(target, "SKILL.md"), "# Other version\n");
    fs.symlinkSync(target, link);
    conflicts(run()); conflicts(run("--remove"));
    assert.equal(fs.readlinkSync(link), target);
  });
});

test("relative link to this checkout is recognized without retargeting", () => {
  fixture(({ skill, link, run }) => {
    const relative = path.relative(path.dirname(link), skill);
    fs.symlinkSync(relative, link);
    passes(run()); assert.equal(fs.readlinkSync(link), relative);
    passes(run("--remove")); assert.equal(fs.existsSync(link), false);
    assert.equal(fs.existsSync(path.join(skill, "SKILL.md")), true);
  });
});

test("missing source entrypoint does not leave an installed broken skill", () => {
  fixture(({ skill, link, run }) => {
    fs.rmSync(path.join(skill, "SKILL.md"));
    assert.equal(run().status, 1);
    assert.throws(() => fs.lstatSync(link), /ENOENT/);
  });
});
