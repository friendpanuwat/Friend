#!/usr/bin/env bash
# Deliver a large file (e.g. edit_hq.mp4, > chat limit) through the GitHub repo of the current session.
# usage: deliver_github.sh <file> [name-in-repo]
# Pushes to branch "exports" (one commit holding only the latest export → repo does not grow);
# falls back to the current branch under exports/ if that push is refused. Prints a download link.
set -euo pipefail
F="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"; NAME="${2:-$(basename "$1")}"
ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "NO GIT REPO: start the Claude Code session with a GitHub repo selected"; exit 1; }
SIZE=$(stat -c %s "$F"); [ "$SIZE" -lt 100000000 ] || { echo "FILE TOO BIG for GitHub (>100 MB): $SIZE bytes"; exit 1; }
REMOTE=$(git -C "$ROOT" remote get-url origin)
SLUG=$(echo "$REMOTE" | sed -E 's#.*github\.com[:/]##; s#\.git$##; s#^.*/git/##')
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
push() { for i in 1 2 3 4; do git "$@" && return 0; sleep $((2**i)); done; return 1; }
git -C "$TMP" init -q && git -C "$TMP" checkout -q -b exports
mkdir -p "$TMP/exports" && cp "$F" "$TMP/exports/$NAME"
git -C "$TMP" add -A && git -C "$TMP" -c user.name="${GIT_AUTHOR_NAME:-Claude}" -c user.email="${GIT_AUTHOR_EMAIL:-noreply@anthropic.com}" commit -qm "Export $NAME"
if push -C "$TMP" push -q --force "$REMOTE" exports:exports 2>"$TMP/err"; then BR=exports
else
  echo "exports branch refused ($(tail -1 "$TMP/err")) → using current branch"
  BR=$(git -C "$ROOT" branch --show-current)
  mkdir -p "$ROOT/exports" && cp "$F" "$ROOT/exports/$NAME"
  git -C "$ROOT" add "exports/$NAME" && git -C "$ROOT" commit -qm "Export $NAME"
  push -C "$ROOT" push -q -u origin "$BR"
fi
echo "DELIVERED $(du -h "$F" | cut -f1) → branch $BR"
echo "DOWNLOAD: https://github.com/$SLUG/raw/$BR/exports/$NAME"
echo "VIEW:     https://github.com/$SLUG/blob/$BR/exports/$NAME"
