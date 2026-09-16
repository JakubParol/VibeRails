#!/usr/bin/env node
// Read-only instruction snapshots. Copy beside adoption-state.mjs and adoption-audit.mjs.
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const excluded = new Set([
  ".git", ".venv", "venv", "node_modules", ".next", "dist", "build", "coverage",
  ".pytest_cache", ".mypy_cache", ".ruff_cache", ".turbo", ".nx", "bin", "obj",
]);
export const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
export const isCommit = (value) => typeof value === "string" && /^[a-f0-9]{40}$/.test(value);
export const contentHash = (bytes) => createHash("sha256").update(bytes).digest("hex");

/** Resolve a repository-relative path without traversing symlinks or leaving the root. */
export function localPath(root, relative, { directory = false } = {}) {
  if (typeof relative !== "string" || relative.includes("\\") || relative.includes("\0")
    || path.posix.isAbsolute(relative) || path.win32.isAbsolute(relative)
    || /^[a-z]:/i.test(relative) || relative === "") {
    throw new Error("expected a repository-relative path");
  }
  const parts = relative === "." && directory ? [] : relative.split("/");
  if (parts.some((part) => !part || part === "." || part === ".." || excluded.has(part))) {
    throw new Error("path has unsafe or excluded segments");
  }
  let current = path.resolve(root);
  for (const part of parts) {
    current = path.join(current, part);
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error("symlink paths are not pinned");
  }
  const stat = fs.statSync(current);
  if (directory ? !stat.isDirectory() : !stat.isFile()) throw new Error("wrong path type");
  return current;
}

function walk(root, relative = "") {
  const result = [];
  for (const entry of fs.readdirSync(path.join(root, relative), { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const item = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) {
      if (["AGENTS.md", "README.md"].includes(entry.name) || /(^|\/)docs\/standards(\/|$)/.test(item)) {
        throw new Error("instruction symlink is not auditable");
      }
      continue;
    }
    if (entry.isDirectory()) result.push(...walk(root, item));
    else if (entry.isFile()) result.push(item);
  }
  return result;
}

/** Maintained instruction inventory, not a claim about everything loaded in any execution. */
export function instructionPaths(root, manifest) {
  const selected = new Set();
  for (const profile of manifest.target?.projectProfiles ?? []) {
    if (!isRecord(profile) || typeof profile.documentationRoot !== "string") {
      throw new Error("invalid project profile");
    }
    localPath(root, profile.documentationRoot, { directory: true });
    const prefix = profile.documentationRoot === "." ? "" : `${profile.documentationRoot}/`;
    for (const name of ["README.md", "AGENTS.md", "docs/INDEX.md"]) selected.add(prefix + name);
  }
  for (const entry of manifest.copiedFiles ?? []) {
    if (!isRecord(entry) || typeof entry.targetPath !== "string") throw new Error("invalid copy record");
    if (entry.mode !== "skipped" && /\.md$/i.test(entry.targetPath)
      && entry.targetPath !== "docs/viberails-adoption.md") selected.add(entry.targetPath);
  }
  for (const item of walk(root)) {
    if (["AGENTS.md", "README.md"].includes(path.posix.basename(item))
      || /(^|\/)docs\/standards\/.*\.md$/i.test(item)) selected.add(item);
    const skills = manifest.agentSkills;
    if (skills?.mode === "vendored" && typeof skills.targetPath === "string"
      && item.startsWith(`${skills.targetPath}/`) && /\.(md|ya?ml)$/i.test(item)) selected.add(item);
  }
  return [...selected].sort();
}

function identity(relative, manifest, hash) {
  const matches = (manifest.copiedFiles ?? []).filter(
    (item) => item?.targetPath === relative && item.mode !== "skipped",
  );
  if (matches.length > 1) throw new Error("duplicate copy records");
  if (matches.length === 1) {
    const entry = matches[0];
    if (!isCommit(entry.sourceRef) || typeof entry.sourcePath !== "string" || !entry.sourcePath.trim()) {
      throw new Error("copy record needs an immutable source commit and source path");
    }
    return { id: `viberails:${entry.sourcePath}@${relative}`, version: entry.sourceRef };
  }
  return { id: `project:${relative}`, version: `sha256:${hash}` };
}

/** Generate a candidate only; callers must review adoption changes before recording it. */
export function snapshotBaseline(root, manifest) {
  if (!isRecord(manifest) || manifest.schemaVersion !== 1 || !isCommit(manifest.viberails?.sourceRef)) {
    throw new Error("snapshot requires manifest schema 1 and an immutable source commit");
  }
  const components = instructionPaths(root, manifest).map((relative) => {
    const sha256 = contentHash(fs.readFileSync(localPath(root, relative)));
    return { ...identity(relative, manifest, sha256), path: relative, sha256 };
  });
  if (components.length === 0) throw new Error("no maintained instructions selected");
  const unobserved = ["Runtime/system instructions", "Dynamic task, code, tool and retrieved context"];
  if (manifest.agentSkills?.mode === "user-scope") unobserved.push("External user-scope skill contents");
  return { version: 1, components, unobserved };
}

/** Return diagnostics without modifying the manifest, files, pins or project settings. */
export function checkBaseline(root, manifest) {
  const errors = [];
  const baseline = manifest.promptBaseline;
  if (!isRecord(baseline)) return ["promptBaseline must be an object"];
  const keys = ["version", "components", "unobserved"];
  if (Object.keys(baseline).some((key) => !keys.includes(key))) errors.push("unknown promptBaseline field");
  if (baseline.version !== 1) errors.push("unsupported promptBaseline.version (expected 1)");
  if (!Array.isArray(baseline.components) || !baseline.components.length) {
    return [...errors, "promptBaseline.components must be nonempty"];
  }
  if (!Array.isArray(baseline.unobserved) || !baseline.unobserved.length
    || baseline.unobserved.some((item) => typeof item !== "string" || !item.trim())) {
    errors.push("promptBaseline.unobserved must disclose unobserved instruction layers");
  }
  const paths = new Set();
  const ids = new Set();
  for (const [index, item] of baseline.components.entries()) {
    const field = `promptBaseline.components[${index}]`;
    if (!isRecord(item)) { errors.push(`${field} must be an object`); continue; }
    if (Object.keys(item).some((key) => !["id", "version", "path", "sha256"].includes(key))) {
      errors.push(`${field} has an unknown field`);
    }
    if (paths.has(item.path) || ids.has(item.id)) errors.push(`${field} duplicates an identity or path`);
    paths.add(item.path); ids.add(item.id);
    if (typeof item.sha256 !== "string" || !/^[a-f0-9]{64}$/.test(item.sha256)) {
      errors.push(`${field}.sha256 must be a SHA-256 digest`);
    }
    try {
      const actual = contentHash(fs.readFileSync(localPath(root, item.path)));
      const expected = identity(item.path, manifest, actual);
      if (actual !== item.sha256) errors.push(`${field} content changed; review before repinning`);
      if (item.id !== expected.id || item.version !== expected.version) {
        errors.push(`${field} identity/version does not match provenance`);
      }
    } catch {
      errors.push(`${field} cannot resolve a safe file or immutable provenance`);
    }
  }
  try {
    for (const relative of instructionPaths(root, manifest)) {
      if (!paths.has(relative)) errors.push("maintained instruction missing from promptBaseline");
    }
  } catch {
    errors.push("cannot resolve maintained instruction inventory");
  }
  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 4 || process.argv[2] !== "snapshot") {
      throw new Error("Usage: node adoption-pins.mjs snapshot TARGET_ROOT");
    }
    const root = path.resolve(process.argv[3]);
    const manifest = JSON.parse(fs.readFileSync(localPath(root, ".viberails/adoption.json"), "utf8"));
    console.log(JSON.stringify(snapshotBaseline(root, manifest), null, 2));
  } catch {
    console.error("Cannot snapshot instructions. Check arguments, schema, safe paths and immutable source refs.");
    process.exitCode = 1;
  }
}
