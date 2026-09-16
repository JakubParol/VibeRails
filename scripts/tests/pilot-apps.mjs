// Two bounded Python pilot applications. These are synthetic fixtures, not package templates.
import { read, write } from "./adoption-fixtures.mjs";

const correct = `from typing import Callable


def unique_labels(values: list[str]) -> list[str]:
    if not isinstance(values, list):
        raise TypeError("expected a list")
    result: list[str] = []
    seen: set[str] = set()
    for value in values:
        if not isinstance(value, str):
            raise TypeError("expected text")
        item = value.strip()
        if not item:
            raise ValueError("empty label")
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result


def apply_batch(values: list[str], save: Callable[[list[str]], None]) -> list[str]:
    result = unique_labels(values)
    save(result)
    return result
`;
const broken = correct.replace('if item not in seen:', 'if True:'); // Deliberate red: duplicates.

const commonTests = `import unittest
from IMPORT_PATH import unique_labels, apply_batch


class BatchTests(unittest.TestCase):
    def test_trim_and_stable_dedupe(self):
        self.assertEqual(unique_labels([" b ", "a", "b", " a "]), ["b", "a"])

    def test_preserve_case_and_unicode(self):
        self.assertEqual(unique_labels(["A", "a", "caf\\u00e9"]), ["A", "a", "caf\\u00e9"])

    def test_empty_list(self):
        self.assertEqual(unique_labels([]), [])

    def test_blank_invalid(self):
        with self.assertRaises(ValueError):
            unique_labels(["valid", " "])

    def test_non_text_invalid(self):
        for value in [None, 7, False]:
            with self.subTest(value=value), self.assertRaises(TypeError):
                unique_labels(["valid", value])

    def test_input_container(self):
        with self.assertRaises(TypeError):
            unique_labels("text")

    def test_validate_before_side_effect(self):
        writes = []
        with self.assertRaises(ValueError):
            apply_batch(["valid", " "], writes.append)
        self.assertEqual(writes, [])

    def test_save_once_and_do_not_mutate_input(self):
        values = [" b ", "b", "a"]
        writes = []
        self.assertEqual(apply_batch(values, writes.append), ["b", "a"])
        self.assertEqual(values, [" b ", "b", "a"])
        self.assertEqual(writes, [["b", "a"]])
`;
const adapter = `import json
from pathlib import Path


class JsonStore:
    def __init__(self, target: Path):
        self.target = target

    def save(self, values: list[str]) -> None:
        self.target.write_text(json.dumps(values), encoding="utf-8")
`;
const presentation = `from typing import Callable


def render(values: list[str], operation: Callable[[list[str]], list[str]]) -> str:
    return "\\n".join(operation(values))
`;
const composition = `import json
import sys
from functools import partial
from pathlib import Path
from packages.labels.batch import apply_batch
from services.cli.presentation import render
from services.cli.store import JsonStore


def main() -> int:
    try:
        if len(sys.argv) != 3:
            raise ValueError("expected input and output paths")
        values = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
        operation = partial(apply_batch, save=JsonStore(Path(sys.argv[2])).save)
        print(render(values, operation))
        return 0
    except (ValueError, TypeError, OSError):
        print("Invalid batch or inaccessible path", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
`;
const integrationTests = `import ast
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from packages.labels.batch import unique_labels
from services.cli.presentation import render


class IntegrationTests(unittest.TestCase):
    def test_presentation_uses_bound_operation(self):
        self.assertEqual(render([" a ", "a"], unique_labels), "a")

    def test_cli_real_files(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "input.json"
            target = Path(directory) / "output.json"
            source.write_text(json.dumps([" b ", "a", "b"]), encoding="utf-8")
            result = subprocess.run([sys.executable, "-B", "-m", "services.cli.main", str(source), str(target)],
                                    capture_output=True, text=True, timeout=5)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(result.stdout.strip(), "b\\na")
            self.assertEqual(json.loads(target.read_text()), ["b", "a"])

    def test_invalid_cli_does_not_overwrite_existing_output(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "input.json"
            target = Path(directory) / "output.json"
            source.write_text('["valid", " "]', encoding="utf-8")
            target.write_text("existing owner bytes", encoding="utf-8")
            result = subprocess.run([sys.executable, "-B", "-m", "services.cli.main", str(source), str(target)],
                                    capture_output=True, text=True, timeout=5)
            self.assertEqual(result.returncode, 2)
            self.assertEqual(target.read_text(), "existing owner bytes")

    def test_inner_module_has_no_concrete_io_imports(self):
        for name in ["packages/labels/batch.py", "services/cli/presentation.py"]:
            tree = ast.parse(Path(name).read_text())
            imports = []
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    imports.extend(item.name for item in node.names)
                elif isinstance(node, ast.ImportFrom):
                    imports.append(node.module or "")
            self.assertEqual(imports, ["typing"], name)
`;

export function prepareApplication(root, multi) {
  const module = multi ? "packages.labels.batch" : "batch";
  write(root, multi ? "packages/labels/batch.py" : "batch.py", broken);
  write(root, "test_batch.py", commonTests.replace("IMPORT_PATH", module));
  write(root, ".gitignore", "__pycache__/\n*.pyc\n");
  if (multi) {
    write(root, "services/cli/store.py", adapter);
    write(root, "services/cli/presentation.py", presentation);
    write(root, "services/cli/main.py", composition);
    write(root, "test_integration.py", integrationTests);
  }
  const modules = ["test_label", "test_batch", ...(multi ? ["test_integration"] : [])];
  write(root, "README.md", read(root, "README.md").replace("test_label.", `${modules.join(" ")}.`));
  return { modules, caseCount: multi ? 15 : 11, fix: () => {
    write(root, multi ? "packages/labels/batch.py" : "batch.py", correct);
  } };
}
