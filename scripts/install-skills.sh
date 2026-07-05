#!/usr/bin/env sh
set -eu

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
skills_source="$repo_root/.agents/skills"
codex_home="${CODEX_HOME:-$HOME/.codex}"
skills_target_root="$codex_home/skills"
remove=0

case "${1:-}" in
  --remove)
    remove=1
    ;;
  "")
    ;;
  *)
    echo "Usage: scripts/install-skills.sh [--remove]" >&2
    exit 2
    ;;
esac

if [ ! -d "$skills_source" ]; then
  echo "Skill source folder not found: $skills_source" >&2
  exit 1
fi

mkdir -p "$skills_target_root"

status=0
for skill_dir in "$skills_source"/*; do
  [ -d "$skill_dir" ] || continue
  skill_name=$(basename "$skill_dir")
  link_path="$skills_target_root/$skill_name"

  if [ "$remove" -eq 1 ]; then
    if [ ! -e "$link_path" ] && [ ! -L "$link_path" ]; then
      printf '%s\t%s\t%s\n' "$skill_name" "absent" "no user-scope entry"
      continue
    fi

    if [ -L "$link_path" ]; then
      rm "$link_path"
      printf '%s\t%s\t%s\n' "$skill_name" "removed" "symlink removed"
      continue
    fi

    printf '%s\t%s\t%s\n' "$skill_name" "skipped" "not a symlink; refusing to delete a real directory"
    status=1
    continue
  fi

  if [ -e "$link_path" ] || [ -L "$link_path" ]; then
    if [ -L "$link_path" ]; then
      current_target=$(readlink "$link_path")
      if [ "$current_target" = "$skill_dir" ]; then
        printf '%s\t%s\t%s\n' "$skill_name" "ok" "symlink already points here"
        continue
      fi

      rm "$link_path"
      ln -s "$skill_dir" "$link_path"
      printf '%s\t%s\t%s\n' "$skill_name" "repaired" "symlink retargeted from $current_target"
      continue
    fi

    printf '%s\t%s\t%s\n' "$skill_name" "conflict" "a real directory exists at $link_path; resolve manually (vendored copy?)"
    status=1
    continue
  fi

  ln -s "$skill_dir" "$link_path"
  if [ ! -f "$link_path/SKILL.md" ]; then
    printf '%s\t%s\t%s\n' "$skill_name" "error" "symlink created but SKILL.md not readable through it"
    status=1
    continue
  fi

  printf '%s\t%s\t%s\n' "$skill_name" "installed" "symlink created"
done

if [ "$status" -ne 0 ]; then
  echo "Completed with items that need attention. Restart Codex after resolving them." >&2
  exit "$status"
fi

if [ "$remove" -eq 1 ]; then
  echo "User-scope skill symlinks removed from $skills_target_root."
else
  echo "Skills installed at the Codex user scope: $skills_target_root"
  echo "Restart Codex so it rescans skills."
fi
