#!/usr/bin/env bash
# Behavior test for sync-worktree-deps.sh. Mocks only yarn (the slow external
# boundary); everything else uses a real throwaway git repo + worktrees.
set -euo pipefail

HOOK="$(cd "$(dirname "$0")" && pwd)/sync-worktree-deps.sh"
tmp="$(mktemp -d)"
trap 'git -C "$tmp/main" worktree prune 2>/dev/null || true; rm -rf "$tmp"' EXIT

# --- source ("main") checkout with a real node_modules and a lockfile -------
main="$tmp/main"
mkdir -p "$main/node_modules"
git -C "$main" init -q
git -C "$main" config user.email t@example.com
git -C "$main" config user.name test
printf 'LOCK_A\n' > "$main/yarn.lock"
git -C "$main" add -A && git -C "$main" commit -qm init

# --- yarn shim: record the call, recreate node_modules like a real install --
shimdir="$tmp/bin"; mkdir -p "$shimdir"
cat > "$shimdir/yarn" <<'SHIM'
#!/usr/bin/env bash
echo "yarn $*" >> "$YARN_LOG"
mkdir -p node_modules
SHIM
chmod +x "$shimdir/yarn"

run_hook() { ( cd "$1" && PATH="$shimdir:$PATH" YARN_LOG="$2" bash "$HOOK" ); }

# --- Case 1: matching lockfile -> keep symlink, no install ------------------
wt1="$tmp/wt-match"
git -C "$main" worktree add -q "$wt1" -b match
printf 'LOCK_A\n' > "$wt1/yarn.lock"
ln -s "$main/node_modules" "$wt1/node_modules"
log1="$tmp/log1"; : > "$log1"
run_hook "$wt1" "$log1"
[ -L "$wt1/node_modules" ] || { echo "FAIL case1: symlink removed"; exit 1; }
[ ! -s "$log1" ]          || { echo "FAIL case1: yarn called"; exit 1; }
echo "PASS case1: matching lock keeps symlink"

# --- Case 2: divergent lockfile -> drop symlink, install --------------------
wt2="$tmp/wt-diff"
git -C "$main" worktree add -q "$wt2" -b diff
printf 'LOCK_B\n' > "$wt2/yarn.lock"
ln -s "$main/node_modules" "$wt2/node_modules"
log2="$tmp/log2"; : > "$log2"
run_hook "$wt2" "$log2"
[ ! -L "$wt2/node_modules" ] || { echo "FAIL case2: symlink kept"; exit 1; }
[ -s "$log2" ]               || { echo "FAIL case2: yarn not called"; exit 1; }
[ -d "$main/node_modules" ]  || { echo "FAIL case2: source node_modules gone"; exit 1; }
echo "PASS case2: divergent lock installs locally, source intact"

# --- Case 3: real node_modules (main checkout) -> no-op ---------------------
log3="$tmp/log3"; : > "$log3"
run_hook "$main" "$log3"
[ ! -s "$log3" ] || { echo "FAIL case3: yarn called in main checkout"; exit 1; }
echo "PASS case3: real node_modules untouched"

echo "ALL PASS"
