#!/bin/bash
# Plan phase: every clip back to back (captions + both styles' plans), stop when real spend reaches the cap.
# usage: plan_all.sh <raw dir> <words dir> <work dir> <cap usd> <clip names...>
RAW=$1; WORDS=$2; W=$3; CAP=$4; shift 4
REPO=/home/user/Friend; TOOLS=$(dirname "$0")
export ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-$KEY}"
[ -n "$ANTHROPIC_API_KEY" ] || { echo "no key"; exit 1; }
mkdir -p "$W"
for c in "$@"; do
  spent=$(python3 "$TOOLS/spent.py" "$W/runs.jsonl" "$REPO" 2>/dev/null || echo 0)
  if python3 -c "import sys; sys.exit(0 if float('$spent') >= $CAP else 1)"; then echo "STOP: spent $spent USD ≥ $CAP"; break; fi
  t0=$(date +%s)
  echo "=== $c (spent so far $spent USD) $(date +%T)"
  st=editorial,overlay; case "$c" in *:*) st=${c#*:}; c=${c%%:*};; esac   # name:styles runs only those styles
  (cd "$REPO" && python3 cutpack/engine/run_clip.py "$RAW/$c.mp4" "$W/$c" --words "$WORDS/$c.json" --styles $st --stop-after plan --log "$W/runs.jsonl" --state "$W/plan_times.json" ${PLAN_MODEL:+--plan-model $PLAN_MODEL} 2>&1 | grep -vE "WARNING|telemetry")
  echo "--- $c took $(( $(date +%s)-t0 )) s · spent now $(python3 "$TOOLS/spent.py" "$W/runs.jsonl" "$REPO") USD"
done
(cd "$REPO" && python3 cutpack/cost-test/cost_model.py report "$W/runs.jsonl")
