# Execute a guarded PR write

The guard uses the authenticated GitHub CLI account for live reads and writes.
Prepare a JSON request with the invoking user's login and the exact target.
Store requests outside tracked files, for example in the system temporary directory.

```json
{
  "operation": "push",
  "actor": "YOUR_LOGIN",
  "repository": "OWNER/REPOSITORY",
  "branch": "fix/example",
  "expectedHead": "CURRENT_REMOTE_COMMIT_SHA",
  "sha": "LOCAL_HEAD_COMMIT_SHA",
  "pullRequest": { "repository": "UPSTREAM/REPOSITORY", "number": 123 }
}
```

Use `expectedHead: null` only when creating a new branch.
For an existing PR, identify it with `pullRequest`, including when its head
branch lives in a different fork repository.
The guard also checks for open PRs on the target repository's branch.
It allows owned PRs, owned fork branches, and new branches only when the
authenticated account has push access.
Existing branches with unknown ownership require explicit authorization.

Check without writing, then execute the same request:

```sh
node scripts/pr-write-guard.mjs /tmp/pr-write-request.json --check
node scripts/pr-write-guard.mjs /tmp/pr-write-request.json
```

Each invocation refreshes GitHub facts.
Pushes require the requested commit to equal local `HEAD` and retain the old
remote head as an ancestor.
The push uses an exact ref lease and the GitHub CLI credential helper.
The guard refuses history rewrites.

## Explicit authorization

For another author's branch, merging, or closing a PR, generate the scope:

```sh
node scripts/pr-write-guard.mjs /tmp/pr-write-request.json --scope
```

Add the result as the request's `authorization` object.
Fill its `instruction` with the user's explicit instruction authorizing this write.
The generated scope binds the actor, repository, operation, target, expected
head, and a digest of the exact request payload.
Changes to the proposed commit, file content, or successor invalidate it.
Record an instruction the user actually gave; don't manufacture approval.
This agent-authored record checks scope consistency, not the authenticity of
human consent.
It grants no additional GitHub access.

## Supported API writes

| Operation | Additional request fields |
| --- | --- |
| `update-ref` | `branch`, `sha`, and optional `pullRequest`. Always uses a non-forced update. |
| `update-file` | `branch`, optional `pullRequest`, and `file` with relative `path`, commit `message`, current blob `sha`, and base64 `content`. |
| `delete-file` | Same as `update-file`, without `content`. |
| `merge-pr` | `pr` and scoped authorization. Preserves commits with a merge commit. |
| `close-pr` | `pr` and scoped authorization. For another author's PR, also supply `successor`, the replacement PR number in the same upstream repository. |

PR operations use `repository` for the PR's base repository and `expectedHead`
for its current head commit.
Closing another author's PR requires closure permission and an open successor
with the same upstream base and preserved original-head ancestry.
If any check fails, the guard performs no write.
It doesn't retry a failed mutation; inspect GitHub before trying again.
GitHub still enforces branch protections and token restrictions.

## Hook coverage and limits

Repository hooks in [Codex](../../../../.codex/hooks.json) and
[Claude Code](../../../../.claude/settings.json) invoke the same guard in
`--hook` mode before shell and MCP calls.
They block recognizable raw Git pushes, protected GitHub CLI and REST writes,
and named MCP file/ref updates, merges, and closures.
They direct those operations through the structured write command above.
Ordinary read operations and PR description updates remain available.

Codex requires review and trust of new hook definitions through `/hooks`.
Hook installation in the repository does not establish runtime activation.
Shell detection is conservative and does not interpret arbitrary programs,
aliases, indirect scripts, GraphQL assembled elsewhere, or browser actions.
Some tool paths do not invoke hooks.
Use the guarded command even when no hook runs.
These hooks are a workflow backstop, not a security sandbox.

See [Codex hook coverage and trust](https://learn.chatgpt.com/docs/hooks) and
[Claude Code hook behavior](https://code.claude.com/docs/en/hooks).
