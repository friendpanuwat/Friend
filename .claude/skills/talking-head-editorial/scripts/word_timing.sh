#!/usr/bin/env bash
# Word-accurate timing (Whisper) with automatic fallback to make_timeline.py.
# usage: word_timing.sh <project_dir> <video> <transcript>
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; PROJ="$1"; IN="$2"; TR="$3"
python3 -c "import faster_whisper" 2>/dev/null || pip install -q faster-whisper >/dev/null 2>&1
if python3 -I "$HERE/word_timing.py" "$IN" "$TR" "$PROJ"; then exit 0; fi
echo "WHISPER UNAVAILABLE → falling back to pause-snapped timing (make_timeline.py)"
python3 "$HERE/make_timeline.py" "$IN" "$TR" "$PROJ"
