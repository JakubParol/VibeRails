#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { validateMarkdownNavigation } from "./validation-markdown.mjs";

const repoRoot = path.resolve(path.join(path.dirname(fileURLToPath(import.meta.url)), ".."));
const repoRealPath = fs.realpathSync(repoRoot);
const failures = [];
const excludedDirectories = new Set([
  ".git",
  ".venv",
  "venv",
  "node_modules",
  ".next",
  "dist",
  "build",
  "coverage",
  ".pytest_cache",
  ".mypy_cache",
  ".ruff_cache",
  ".turbo",
  ".nx",
  "bin",
  "obj",
]);

function addFailure(message) {
  failures.push(message);
}

function toRepoPath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function isInsideDirectory(directory, candidate) {
  const relativePath = path.relative(directory, candidate);
  return relativePath !== ""
    && relativePath !== ".."
    && !relativePath.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relativePath);
}

function walkFiles(directory) {
  const files = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    const relativePath = toRepoPath(fullPath);

    if (entry.isDirectory() && excludedDirectories.has(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
}

function readDenylist() {
  const denylistPath = path.join(repoRoot, "scripts", "source-leak-denylist.txt");
  if (!fs.existsSync(denylistPath)) {
    return [];
  }

  return readText(denylistPath)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

function isCheckedTextFile(file) {
  return path.basename(file) === "LICENSE" || /\.(md|mjs|sh|ps1|json|ya?ml|gitattributes)$/i.test(file);
}

function parseArguments(argumentsList) {
  if (argumentsList.length === 0 || (argumentsList.length === 1 && argumentsList[0] === "--all")) {
    return { mode: "full" };
  }

  if (argumentsList[0] === "--files") {
    const fileArguments = argumentsList.slice(1);
    if (fileArguments.length === 0) {
      addFailure("--files requires one or more repository-relative text file paths.");
      return null;
    }

    const optionArgument = fileArguments.find((argument) => argument.startsWith("-"));
    if (optionArgument) {
      addFailure(`--files does not accept option '${optionArgument}'.`);
      return null;
    }

    return { mode: "focused", fileArguments };
  }

  if (argumentsList.includes("--all")) {
    addFailure("--all cannot be combined with other arguments.");
    return null;
  }

  addFailure(`Unknown argument '${argumentsList[0]}'. Use --all or --files <file...>.`);
  return null;
}

function resolveFocusedFiles(fileArguments) {
  const selectedFiles = new Map();

  for (const fileArgument of fileArguments) {
    if (path.isAbsolute(fileArgument) || path.win32.isAbsolute(fileArgument)) {
      addFailure(`Focused path '${fileArgument}' must be repository-relative.`);
      continue;
    }

    const candidatePath = path.resolve(repoRoot, fileArgument);
    if (!isInsideDirectory(repoRoot, candidatePath)) {
      addFailure(`Focused path '${fileArgument}' is outside the repository.`);
      continue;
    }

    let fileStats;
    try {
      fileStats = fs.statSync(candidatePath);
    } catch {
      addFailure(`Focused path '${fileArgument}' does not exist.`);
      continue;
    }

    if (!fileStats.isFile()) {
      addFailure(`Focused path '${fileArgument}' must be a regular file.`);
      continue;
    }

    let realPath;
    try {
      realPath = fs.realpathSync(candidatePath);
    } catch {
      addFailure(`Focused path '${fileArgument}' could not be resolved.`);
      continue;
    }

    if (!isInsideDirectory(repoRealPath, realPath)) {
      addFailure(`Focused path '${fileArgument}' resolves outside the repository.`);
      continue;
    }

    if (!isCheckedTextFile(candidatePath)) {
      addFailure(`Focused path '${fileArgument}' is not a supported text file.`);
      continue;
    }

    selectedFiles.set(realPath, candidatePath);
  }

  return [...selectedFiles.values()];
}

function testLineEndingsAndTrailingWhitespace(files) {
  const checked = files.filter(isCheckedTextFile);

  for (const file of checked) {
    const text = readText(file);
    if (text.includes("\r\n")) {
      addFailure(`${toRepoPath(file)} uses CRLF line endings; use LF for cross-platform diffs.`);
    }

    const lines = text.split("\n");
    for (let index = 0; index < lines.length; index += 1) {
      if (/[ \t]+$/.test(lines[index].replace(/\r$/, ""))) {
        addFailure(`${toRepoPath(file)}:${index + 1} has trailing whitespace.`);
      }
    }
  }
}

function testNoBom(files) {
  const checked = files.filter(isCheckedTextFile);

  for (const file of checked) {
    const bytes = fs.readFileSync(file);
    if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
      addFailure(`${toRepoPath(file)} starts with a UTF-8 BOM; remove it for portable text diffs.`);
    }
  }
}

function testAsciiFiles(files) {
  const checked = files.filter(isCheckedTextFile);

  for (const file of checked) {
    const text = readText(file);
    if (/[^\x00-\x7F]/.test(text)) {
      addFailure(`Non-ASCII content found in ${toRepoPath(file)}.`);
    }
  }
}

function getAffectedSkillNames(files) {
  const skillNames = new Set();

  for (const file of files) {
    const pathSegments = toRepoPath(file).split("/");
    if (pathSegments[0] !== ".agents" || pathSegments[1] !== "skills" || pathSegments.length < 4) {
      continue;
    }

    const skillDirectory = path.join(repoRoot, ".agents", "skills", pathSegments[2]);
    if (fs.existsSync(skillDirectory) && fs.statSync(skillDirectory).isDirectory()) {
      skillNames.add(pathSegments[2]);
    }
  }

  return skillNames;
}

function testSkillMetadata(skillNames = null) {
  const skillsRoot = path.join(repoRoot, ".agents", "skills");

  if (!fs.existsSync(skillsRoot)) {
    return;
  }

  const namesToCheck = skillNames ?? fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const skillName of namesToCheck) {
    const skillDirectory = path.join(skillsRoot, skillName);
    const skillFile = path.join(skillDirectory, "SKILL.md");

    if (!fs.existsSync(skillFile)) {
      addFailure(`Skill ${skillName} is missing SKILL.md.`);
      continue;
    }

    const skillText = readText(skillFile);
    const frontmatter = skillText.match(/^---\r?\n(?<yaml>[\s\S]*?)\r?\n---/);
    if (!frontmatter) {
      addFailure(`Skill ${skillName} is missing YAML frontmatter.`);
      continue;
    }

    const yaml = frontmatter.groups.yaml;
    const name = yaml.match(/^name:\s*(?<value>[a-z0-9-]+)\s*$/m);
    const description = yaml.match(/^description:\s*(?<value>[\s\S]+?)(\r?\n[a-zA-Z_-]+:|$)/m);

    if (!name) {
      addFailure(`Skill ${skillName} is missing a valid name field.`);
    } else if (name.groups.value !== skillName) {
      addFailure(`Skill ${skillName} name field does not match folder name.`);
    } else if (!/^[a-z0-9-]{1,63}$/.test(name.groups.value)) {
      addFailure(`Skill ${skillName} name field violates naming rules.`);
    }

    if (!description || !description.groups.value.trim()) {
      addFailure(`Skill ${skillName} is missing a non-empty description field.`);
    }

    const openAiYaml = path.join(skillDirectory, "agents", "openai.yaml");
    if (!fs.existsSync(openAiYaml)) {
      addFailure(`Skill ${skillName} is missing agents/openai.yaml.`);
      continue;
    }

    const metadata = readText(openAiYaml);
    for (const required of ["display_name", "short_description", "default_prompt"]) {
      const fieldPattern = new RegExp(`^\\s+${required}:\\s*"[^"]+"\\s*$`, "m");
      if (!fieldPattern.test(metadata)) {
        addFailure(`Skill ${skillName} agents/openai.yaml is missing ${required}.`);
      }
    }

    if (!metadata.includes(`$${skillName}`)) {
      addFailure(`Skill ${skillName} default_prompt must mention $${skillName}.`);
    }
  }
}

function testAgentAssetsAreGeneric(files) {
  const forbiddenPatterns = readDenylist();
  const forbiddenRegexes = [
    /\/Users\/[A-Za-z0-9._-]+\//,
    /\/home\/[A-Za-z0-9._-]+\//,
    /C:\\Users\\[A-Za-z0-9._-]+\\/,
  ];
  const allowlistedFiles = new Set([
    "scripts/validate.mjs",
    "scripts/validate.ps1",
    "scripts/source-leak-denylist.txt",
  ]);

  for (const file of files) {
    const relativePath = toRepoPath(file);
    if (allowlistedFiles.has(relativePath)) {
      continue;
    }

    if (!isCheckedTextFile(file)) {
      continue;
    }

    const text = readText(file);
    for (const pattern of forbiddenPatterns) {
      if (text.includes(pattern)) {
        addFailure(`${relativePath} contains source-specific term '${pattern}'.`);
      }
    }

    for (const pattern of forbiddenRegexes) {
      if (pattern.test(text)) {
        addFailure(`${relativePath} contains a local absolute path '${pattern}'.`);
      }
    }
  }
}

const options = parseArguments(process.argv.slice(2));
const files = options?.mode === "focused"
  ? resolveFocusedFiles(options.fileArguments)
  : options?.mode === "full"
    ? walkFiles(repoRoot)
    : [];
const markdownFiles = files.filter((file) => file.endsWith(".md"));
const affectedSkillNames = options?.mode === "focused" ? getAffectedSkillNames(files) : null;

if (options) {
  testLineEndingsAndTrailingWhitespace(files);
  testNoBom(files);
  testAsciiFiles(files);
  for (const failure of validateMarkdownNavigation({
    markdownFiles,
    repoRoot,
    checkOrphans: options.mode === "full",
  })) {
    addFailure(failure);
  }
  testSkillMetadata(affectedSkillNames);
  testAgentAssetsAreGeneric(files);
}

if (failures.length > 0) {
  for (const failure of failures.sort()) {
    console.log(`FAIL: ${failure}`);
  }
  if (options?.mode === "focused") {
    console.log(
      `VibeRails focused validation failed with ${failures.length} issue(s) across ${files.length} selected file(s); repository-wide reachability and orphan checks were not run.`,
    );
  } else {
    console.log(`VibeRails validation failed with ${failures.length} issue(s).`);
  }
  process.exit(1);
}

if (options?.mode === "focused") {
  console.log(
    `VibeRails focused validation passed for ${files.length} selected file(s): ${markdownFiles.length} Markdown file(s), ${affectedSkillNames.size} affected skill(s); repository-wide reachability and orphan checks were not run.`,
  );
} else {
  console.log("VibeRails validation passed.");
}
