#!/usr/bin/env python3
"""Send one TypeSafe Jev state and question map from a JSON file.

Standard library only. Refuses obvious secrets before any request and prints only the model,
latency, answers and usage. Credentials: TYPESAFE_API_KEY, then the project's git-ignored
.env.local, then the private file named by TYPESAFE_API_KEY_FILE.
"""

import json
import os
import re
import socket
import stat
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ENDPOINT = "https://api.typesafe.ai/v1/systemone"
DEFAULT_MODEL = "jev-1.13.0"
SECRET_PATTERNS = (
    re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
    re.compile(r"\bBearer\s+[A-Za-z0-9._~+/-]{12,}", re.IGNORECASE),
    re.compile(r"\b(?:sk-[A-Za-z0-9_-]{12,}|gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b"),
    re.compile(r"\b(?:[A-Za-z_][A-Za-z0-9_]*_)?(?:API[_-]?KEY|TOKEN|SECRET|PASSWORD|PRIVATE_KEY|CREDENTIAL)['\"]?\s*[:=]\s*['\"]?[^\s,'\"}]{4,}", re.IGNORECASE),
    re.compile(r"(?m)^\s*(?:export\s+)?[A-Z][A-Z0-9_]*\s*=\s*\S+"),
)


def _text_values(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for key, item in value.items():
            yield str(key)
            yield from _text_values(item)
    elif isinstance(value, list):
        for item in value:
            yield from _text_values(item)


def reject_secrets(value):
    """Fail closed before egress; the caller removes sensitive text, it is not masked here."""
    for text in (json.dumps(value, ensure_ascii=False), *_text_values(value)):
        if any(pattern.search(text) for pattern in SECRET_PATTERNS):
            raise ValueError("Jev validation failed: possible secret or .env content in request")


def _key_from_file(path):
    if not hasattr(os, "getuid"):
        raise ValueError("Jev auth failed: TYPESAFE_API_KEY_FILE needs a POSIX system; set TYPESAFE_API_KEY")
    metadata = path.lstat()
    if (
        not stat.S_ISREG(metadata.st_mode)
        or metadata.st_uid != os.getuid()
        or stat.S_IMODE(metadata.st_mode) != 0o600
    ):
        raise ValueError("Jev auth failed: credential file is not private")
    key = path.read_text(encoding="utf-8").strip()
    if not key or "\n" in key or "\r" in key:
        raise ValueError("Jev auth failed: credential file is invalid")
    return key


def api_key():
    key = os.environ.get("TYPESAFE_API_KEY")
    if key:
        return key
    local = Path.cwd() / ".env.local"
    if local.is_file():
        for line in local.read_text(encoding="utf-8").splitlines():
            name, separator, value = line.partition("=")
            if separator and name.strip() == "TYPESAFE_API_KEY":
                return value.strip().strip('"\'')
    named = os.environ.get("TYPESAFE_API_KEY_FILE")
    if named:
        path = Path(named).expanduser()
        if not (path.exists() or path.is_symlink()):
            raise ValueError("Jev auth failed: TYPESAFE_API_KEY_FILE does not exist")
        return _key_from_file(path)
    raise ValueError("Jev auth failed: TYPESAFE_API_KEY is unavailable")


def load_request(argv):
    if len(argv) != 2:
        raise ValueError("Usage: jev.py request.json")
    supplied = json.loads(Path(argv[1]).read_text(encoding="utf-8"))
    if (not isinstance(supplied, dict) or not supplied.get("state")
            or not isinstance(supplied.get("questions"), dict) or not supplied["questions"]):
        raise ValueError("Jev validation failed: JSON must contain nonempty state and questions")
    model = supplied.get("model", DEFAULT_MODEL)
    if not isinstance(model, str) or not re.fullmatch(r"jev-[A-Za-z0-9._-]+", model):
        raise ValueError("Jev validation failed: model must be a jev-* identifier")
    reject_secrets({"state": supplied["state"], "questions": supplied["questions"]})
    return {"model": model, "state": supplied["state"], "questions": supplied["questions"]}


def main():
    payload = load_request(sys.argv)
    body = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        ENDPOINT, data=body, method="POST",
        headers={"Authorization": "Bearer " + api_key(), "Content-Type": "application/json"},
    )
    started = time.monotonic()
    for attempt in range(2):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                data = json.load(response)
            break
        except urllib.error.HTTPError as exc:
            category = ("auth failed" if exc.code in (401, 403)
                        else "validation failed" if exc.code in (400, 422) else "HTTP failed")
            raise RuntimeError(f"Jev {category}: HTTP {exc.code}") from None
        except (urllib.error.URLError, TimeoutError, socket.timeout) as exc:
            if attempt:
                reason = getattr(exc, "reason", exc)
                raise RuntimeError(f"Jev network failed after one retry: {reason}") from None
            time.sleep(0.5)
        except (ValueError, json.JSONDecodeError):
            raise RuntimeError("Jev validation failed: invalid response JSON") from None
    if not isinstance(data, dict) or not isinstance(data.get("answers"), dict):
        raise RuntimeError("Jev validation failed: missing answers in response")
    print(json.dumps({
        "model": data.get("model"),
        "latency_ms": round((time.monotonic() - started) * 1000),
        "answers": data.get("answers"),
        "usage": data.get("usage"),
    }, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    try:
        main()
    except (ValueError, RuntimeError, json.JSONDecodeError, OSError) as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(1)
