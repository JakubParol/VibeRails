// POSIX only. Every case fails before any network request; no TypeSafe call is made.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const helper = fileURLToPath(new URL("../../.agents/skills/typesafe-jev/scripts/jev.py", import.meta.url));
if (process.platform === "win32") throw new Error("Use a POSIX runner; credential-file checks need POSIX modes.");

function run(request, extraEnv = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "viberails-jev-"));
  try {
    fs.writeFileSync(path.join(root, "request.json"), JSON.stringify(request));
    const env = { PATH: process.env.PATH, HOME: root, ...extraEnv };
    const result = spawnSync("python3", ["-I", helper, "request.json"], { cwd: root, env, encoding: "utf8", timeout: 10000 });
    assert.equal(result.error, undefined, result.error?.message);
    return { root, status: result.status, output: result.stdout + result.stderr, stdout: result.stdout };
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}
const valid = { state: { options: { A: "keep one function", B: "add a service layer" } },
  questions: { simpler: { type: "noul", instructions: "Does `options.A` meet the same criteria as `options.B`?" } } };
function fails(result, pattern) {
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, pattern);
  assert.equal(result.stdout, "", "nothing is printed on stdout after a refused request");
}

test("secrets in state or questions are refused before credentials or network", () => {
  for (const secret of ["Authorization: Bearer abcdefghijklmnop", "API_KEY=abcd1234", "ghp_abcdefghijklmnopqrstuvwxyz"]) {
    fails(run({ ...valid, state: { note: secret } }), /possible secret/);
  }
  fails(run({ ...valid, questions: { leak: { type: "noul", instructions: "export TOKEN=abcd" } } }), /possible secret/);
});

test("malformed requests and model identifiers are rejected", () => {
  fails(run({ state: valid.state }), /nonempty state and questions/);
  fails(run({ state: valid.state, questions: {} }), /nonempty state and questions/);
  fails(run({ ...valid, model: "gpt-x" }), /jev-\* identifier/);
});

test("a valid request without any credential stops at auth", () => {
  fails(run(valid), /TYPESAFE_API_KEY is unavailable/);
});

test("a credential file must be a private regular file", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "viberails-jev-key-"));
  try {
    const keyFile = path.join(directory, "key");
    fs.writeFileSync(keyFile, "synthetic-not-a-real-key\n", { mode: 0o644 });
    fs.chmodSync(keyFile, 0o644);
    fails(run(valid, { TYPESAFE_API_KEY_FILE: keyFile }), /not private/);
    const link = path.join(directory, "link");
    fs.chmodSync(keyFile, 0o600);
    fs.symlinkSync(keyFile, link);
    fails(run(valid, { TYPESAFE_API_KEY_FILE: link }), /not private/);
    fails(run(valid, { TYPESAFE_API_KEY_FILE: path.join(directory, "absent") }), /does not exist/);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
