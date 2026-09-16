#!/usr/bin/env sh
set -eu

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd -P)
skills_source="$repo_root/.agents/skills"
codex_home="${CODEX_HOME:-$HOME/.codex}"
skills_target_root="$codex_home/skills"
remove=0

case "${1:-}" in
  --remove) remove=1 ;;
  "") ;;
  *) echo "Usage: scripts/install-skills.sh [--remove]" >&2; exit 2 ;;
esac

if [ ! -d "$skills_source" ]; then
  echo "Skill source folder not found: $skills_source" >&2
  exit 1
fi

if [ "$remove" -eq 0 ]; then mkdir -p "$skills_target_root"; fi
status=0
for skill_dir in "$skills_source"/*; do
  [ -d "$skill_dir" ] || continue
  skill_name=$(basename "$skill_dir")
  link_path="$skills_target_root/$skill_name"

  if [ "$remove" -eq 0 ] && [ ! -f "$skill_dir/SKILL.md" ]; then
    printf '%s\t%s\t%s\n' "$skill_name" "error" "source SKILL.md is not readable; no link changed"
    status=1
    continue
  fi

  if [ ! -e "$link_path" ] && [ ! -L "$link_path" ]; then
    if [ "$remove" -eq 1 ]; then
      printf '%s\t%s\t%s\n' "$skill_name" "absent" "no user-scope entry"
    else
      ln -s "$skill_dir" "$link_path"
      printf '%s\t%s\t%s\n' "$skill_name" "installed" "symlink created"
    fi
    continue
  fi

  if [ ! -L "$link_path" ]; then
    printf '%s\t%s\t%s\n' "$skill_name" "conflict" "not a symlink; refusing to change a user-owned entry"
    status=1
    continue
  fi

  # Follow relative targets from the link's parent, not the caller's working directory.
  current_target=$(readlink "$link_path")
  case "$current_target" in
    /*) ;;
    *) current_target="$(dirname "$link_path")/$current_target" ;;
  esac
  physical_target=$(CDPATH= cd -- "$current_target" 2>/dev/null && pwd -P) || physical_target=""
  expected_target=$(CDPATH= cd -- "$skill_dir" && pwd -P)
  if [ "$physical_target" != "$expected_target" ]; then
    printf '%s\t%s\t%s\n' "$skill_name" "conflict" "link is not owned by this checkout; resolve explicitly"
    status=1
    continue
  fi

  if [ "$remove" -eq 1 ]; then
    rm "$link_path"
    printf '%s\t%s\t%s\n' "$skill_name" "removed" "owned symlink removed; source content preserved"
  else
    printf '%s\t%s\t%s\n' "$skill_name" "ok" "symlink already points here"
  fi
done

if [ "$status" -ne 0 ]; then
  echo "Completed with conflicts or errors; existing unrelated entries were preserved." >&2
  exit "$status"
fi

if [ "$remove" -eq 1 ]; then
  echo "Owned user-scope skill symlinks removed from $skills_target_root."
else
  echo "Skills installed at the Codex user scope: $skills_target_root"
  echo "Restart Codex so it rescans skills."
fi
