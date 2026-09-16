import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const validatorSource = path.resolve(testDirectory, "..", "validate.mjs");
const markdownValidatorSource = path.resolve(testDirectory, "..", "validation-markdown.mjs");

function writeFixtureFile(root, relativePath, contents) {
  const destination = path.join(root, ...relativePath.split("/"));
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, contents);
}

function withFixture(files, action) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "viberails-validator-"));
  try {
    fs.mkdirSync(path.join(root, "scripts"), { recursive: true });
    fs.copyFileSync(validatorSource, path.join(root, "scripts", "validate.mjs"));
    fs.copyFileSync(markdownValidatorSource, path.join(root, "scripts", "validation-markdown.mjs"));
    for (const [relativePath, contents] of Object.entries(files)) {
      writeFixtureFile(root, relativePath, contents);
    }
    return action(root);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function runValidator(root, argumentsList = []) {
  const result = spawnSync(
    process.execPath,
    [path.join(root, "scripts", "validate.mjs"), ...argumentsList],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(result.error, undefined, result.error?.message);
  return result;
}

function commandOutput(result) {
  return `${result.stdout}${result.stderr}`;
}

test("focused validation ignores unrelated broken files", () => {
  withFixture(
    {
      "README.md": "# Root\n",
      "docs/selected.md": "# Selected\n",
      "docs/unrelated.md": "[broken](missing.md)\n",
    },
    (root) => {
      const result = runValidator(root, ["--files", "docs/selected.md"]);
      const output = commandOutput(result);

      assert.equal(result.status, 0, output);
      assert.match(output, /focused validation passed for 1 selected file/);
      assert.match(output, /repository-wide reachability and orphan checks were not run/);
      assert.doesNotMatch(output, /VibeRails validation passed\./);
    },
  );
});

test("focused Markdown links check anchors in unselected targets", () => {
  withFixture(
    {
      "README.md": "# Root\n",
      "docs/source.md": "[target](target.md#target-heading)\n",
      "docs/target.md": "# Target heading\n",
    },
    (root) => {
      const result = runValidator(root, ["--files", "docs/source.md"]);

      assert.equal(result.status, 0, commandOutput(result));
    },
  );
});

test("focused Markdown links report real broken targets and anchors", () => {
  withFixture(
    {
      "README.md": "# Root\n",
      "docs/source.md": "[missing target](missing.md)\n[missing anchor](target.md#absent)\n",
      "docs/target.md": "# Present\n",
    },
    (root) => {
      const result = runValidator(root, ["--files", "docs/source.md"]);
      const output = commandOutput(result);

      assert.equal(result.status, 1, output);
      assert.match(output, /missing link target 'missing.md'/);
      assert.match(output, /missing anchor '#absent'/);
    },
  );
});

test("link scanning ignores code examples while checking real Markdown links", () => {
  withFixture(
    {
      "README.md": "# Root\n",
      "docs/source.md": [
        "# Source",
        "`[inline](not-inline.md)`",
        "````text",
        "ns[code-like](not-code.md)",
        "[backtick fence](not-backtick-fence.md)",
        "# hidden-backtick-heading",
        "```",
        "# still-hidden-backtick-heading",
        "````",
        "~~~text",
        "[tilde fence](not-tilde-fence.md)",
        "```",
        "# still-hidden-tilde-heading",
        "~~~",
        "[real](missing-real.md)",
        "",
      ].join("\n"),
    },
    (root) => {
      const result = runValidator(root, ["--files", "docs/source.md"]);
      const output = commandOutput(result);

      assert.equal(result.status, 1, output);
      assert.match(output, /missing-real.md/);
      assert.doesNotMatch(output, /not-code.md/);
      assert.doesNotMatch(output, /not-inline.md/);
      assert.doesNotMatch(output, /not-backtick-fence.md/);
      assert.doesNotMatch(output, /not-tilde-fence.md/);
    },
  );
});

test("link scanning keeps real links around inline-code delimiters", () => {
  withFixture(
    {
      "README.md": "# Root\n",
      "docs/source.md": [
        "[`guide`](missing-code-label.md)",
        "Unmatched ` marker [guide](missing-unmatched.md)",
        "See[guide](missing-adjacent.md)",
        "",
      ].join("\n"),
    },
    (root) => {
      const result = runValidator(root, ["--files", "docs/source.md"]);
      const output = commandOutput(result);

      assert.equal(result.status, 1, output);
      assert.match(output, /missing-code-label.md/);
      assert.match(output, /missing-unmatched.md/);
      assert.match(output, /missing-adjacent.md/);
    },
  );
});

test("anchor extraction ignores fenced headings with matching delimiters", () => {
  withFixture(
    {
      "README.md": "# Root\n",
      "docs/linker.md": "[visible](source.md#visible)\n[hidden](source.md#hidden)\n",
      "docs/source.md": [
        "# Visible",
        "````",
        "# Hidden",
        "```",
        "# Still hidden",
        "````",
        "",
      ].join("\n"),
    },
    (root) => {
      const result = runValidator(root, ["--files", "docs/linker.md"]);
      const output = commandOutput(result);

      assert.equal(result.status, 1, output);
      assert.match(output, /missing anchor '#hidden'/);
      assert.doesNotMatch(output, /missing anchor '#visible'/);
    },
  );
});

test("focused validation applies text checks only to the selected file", () => {
  withFixture(
    {
      "README.md": "# Root\n",
      "scripts/source-leak-denylist.txt": "FixtureMarker\n",
      "docs/unselected.md": "FixtureMarker\n",
      "docs/selected.md": "\uFEFF# Selected \r\nnonascii: \u00e9\r\nFixtureMarker\r\n",
    },
    (root) => {
      const result = runValidator(root, ["--files", "docs/selected.md"]);
      const output = commandOutput(result);

      assert.equal(result.status, 1, output);
      assert.match(output, /uses CRLF line endings/);
      assert.match(output, /has trailing whitespace/);
      assert.match(output, /starts with a UTF-8 BOM/);
      assert.match(output, /Non-ASCII content found/);
      assert.match(output, /source-specific term 'FixtureMarker'/);
    },
  );
});

test("focused skill metadata only checks affected skills", () => {
  withFixture(
    {
      "README.md": "# Root\n",
      "docs/note.md": "# Note\n",
      ".agents/skills/selected/SKILL.md": "# Missing metadata\n",
      ".agents/skills/unrelated/SKILL.md": "# Missing metadata\n",
    },
    (root) => {
      const unrelatedResult = runValidator(root, ["--files", "docs/note.md"]);
      assert.equal(unrelatedResult.status, 0, commandOutput(unrelatedResult));

      const selectedResult = runValidator(root, ["--files", ".agents/skills/selected/SKILL.md"]);
      const output = commandOutput(selectedResult);
      assert.equal(selectedResult.status, 1, output);
      assert.match(output, /Skill selected is missing YAML frontmatter/);
      assert.doesNotMatch(output, /Skill unrelated/);
    },
  );
});

test("focused CLI rejects malformed and unsafe paths", (t) => {
  withFixture(
    {
      "README.md": "# Root\n",
      "docs/valid.md": "# Valid\n",
      "asset.bin": "binary-looking fixture\n",
    },
    (root) => {
      const cases = [
        [["--unknown"], /Unknown argument '--unknown'/],
        [["--files"], /--files requires one or more/],
        [["--files", "--all"], /--files does not accept option '--all'/],
        [["--files", "missing.md"], /does not exist/],
        [["--files", "docs"], /must be a regular file/],
        [["--files", "../outside.md"], /outside the repository/],
        [["--files", "asset.bin"], /not a supported text file/],
      ];

      for (const [argumentsList, expectedMessage] of cases) {
        const result = runValidator(root, argumentsList);
        assert.equal(result.status, 1, commandOutput(result));
        assert.match(commandOutput(result), expectedMessage);
      }

      const externalRoot = fs.mkdtempSync(path.join(os.tmpdir(), "viberails-validator-escape-"));
      try {
        const externalFile = path.join(externalRoot, "outside.md");
        fs.writeFileSync(externalFile, "# Outside\n");
        const escapedLink = path.join(root, "docs", "escape.md");
        try {
          fs.symlinkSync(externalFile, escapedLink, "file");
        } catch (error) {
          t.skip(`could not create a symlink fixture: ${error.message}`);
          return;
        }

        const result = runValidator(root, ["--files", "docs/escape.md"]);
        assert.equal(result.status, 1, commandOutput(result));
        assert.match(commandOutput(result), /resolves outside the repository/);
      } finally {
        fs.rmSync(externalRoot, { recursive: true, force: true });
      }
    },
  );
});

test("full mode keeps orphan detection for no arguments and --all", () => {
  withFixture(
    {
      "README.md": "# Root\n",
      "orphan.md": "# Orphan\n",
    },
    (root) => {
      for (const argumentsList of [[], ["--all"]]) {
        const result = runValidator(root, argumentsList);
        const output = commandOutput(result);

        assert.equal(result.status, 1, output);
        assert.match(output, /orphan.md is an orphan/);
        assert.doesNotMatch(output, /focused validation/);
      }
    },
  );
});
