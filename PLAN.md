# Node lifecycle docs — live verification matrix

Working doc for the `claude/influxdb3-node-lifecycle-docs-m9pbew` branch.
**Remove before merge** (a required PR check blocks `PLAN.md` on the default
branch).

Every item below corresponds to a `VERIFY (live instance)` comment in
`content/shared/influxdb3-admin/node-lifecycle.md`.
Delete each comment as its question is answered, and apply the "if wrong" fix.

The claims not listed here were already validated against the InfluxDB catalog
source and need no live test: the four state names and their semantics, the
re-registration matrix, the four removal-refusal conditions and their error
strings, remove idempotency, and `removing` being terminal for a node ID.

---

## Part 1 — Answerable on Core (no license required)

Start a throwaway node:

```bash
influxdb3 serve \
  --node-id test-node-1 \
  --object-store file \
  --data-dir /tmp/influxdb3-lifecycle-test
```

### 1.1 Does a restarting process reuse its instance ID? (HIGHEST PRIORITY)

This one claim carries the page. `can_re_register` accepts a `running` or
`stopping` node **only when the incoming instance ID matches**. If a restart
mints a new UUID, then restarting a node still recorded as `running` — the
post-crash case — is refused, and the re-registration section, the
crashed-node troubleshooting entry, and the rolling-restart guidance behind
the whole Helm/Ansible section all fail together.

```bash
# 1. Record the instance ID while running
influxdb3 query --database _internal --token $TOKEN \
  "SELECT node_id, instance_id, state FROM system.nodes"

# 2. Kill ungracefully so the catalog keeps state = running
kill -9 $(pgrep -f 'influxdb3 serve')

# 3. Confirm the catalog still says running, then restart with the SAME node ID
influxdb3 serve --node-id test-node-1 --object-store file \
  --data-dir /tmp/influxdb3-lifecycle-test

# 4. Did it re-register, and did instance_id change?
influxdb3 query --database _internal --token $TOKEN \
  "SELECT node_id, instance_id, state FROM system.nodes"
```

- **Re-registers, instance ID unchanged** → claim holds, delete the comment.
- **Re-registers, instance ID changed** → the node ID must be re-claimable by
  some other path; rewrite the explanation, since the current one is wrong even
  though the outcome is right.
- **Refused** → the page is materially wrong. Fix the re-registration section,
  the crashed-node entry, and add recovery guidance for a node wedged in
  `running`.

### 1.2 Core shutdown sequence and order

The four steps were written from the Enterprise stop cascade plus the
durability docs, not Core source.

```bash
# Send SIGTERM, then check the recorded state
kill -TERM $(pgrep -f 'influxdb3 serve')
influxdb3 query --database _internal --token $TOKEN \
  "SELECT node_id, state, updated_at FROM system.nodes"
```

Confirm (a) writes stop being accepted before the flush rather than in-flight
writes draining first, and (b) Core marks itself `stopped` at all. If a cleanly
stopped Core node still reads `running`, say so on the page — it changes what
"verify node state" means for Core users.

### 1.3 Can a Core node surface `stopping` or `removing`?

The state enum is shared catalog code; `NodeMode::Core` is just another mode.
The page asserts Core only ever reads `running` or `stopped` because Core lacks
the commands — not because the states are unreachable.

```bash
# Does the endpoint exist on Core even without a CLI subcommand?
curl -i -X POST "http://localhost:8181/api/v3/enterprise/configure/node/stop" \
  -H "Authorization: Bearer $TOKEN" -d '{"node_id":"test-node-1"}'
```

A 404/501 supports the current wording. Anything that transitions the node
means the note needs softening.

### 1.4 `system.nodes` database and columns

Used by two queries on the page.

```bash
influxdb3 query --database _internal --token $TOKEN \
  "SELECT * FROM system.nodes"
```

Confirm `_internal` is right and that `node_id`, `mode`, `state`, and
`updated_at` exist under those names. If `instance_id` is exposed, add it to
the page's example — it is what the re-registration rules turn on.

---

## Part 2 — Enterprise only

Needs a multi-node cluster. Use a **throwaway** cluster: 2.6 and 2.7 are
destructive.

### 2.1 Does reaching `stopped` free licensed cores?

The page and the published `stop node` CLI page both claim it does. Support
case 00123680 (3.4.1) reported cores were **not** freed by stopping a node, and
case 00129706 ("Incorrect core count when updating deployment") suggests core
accounting problems persisted.

```bash
influxdb3 show nodes                      # record core_count and total in use
influxdb3 stop node --node-id NODE_ID     # wait for stopped
influxdb3 show nodes
# Then: can a new node claim those cores?
```

If cores are only freed on `remove node` — or not at all — correct **both**
this page and `content/influxdb3/enterprise/reference/cli/influxdb3/stop/node.md`.

### 2.2 Stopping a node that isn't running: 400 or 200?

Two catalog ops have opposite responses. `StopNodeOp` returns
`NodeAlreadyStopped` → 400; `RequestStopNodeOp` returns `IdempotentNoOp` → 200
so controllers can retry safely. The page documents the 400 because that is
what real users hit (case 00129706 via CLI, case 00130867 via the API).

```bash
influxdb3 stop node --node-id NODE_ID     # let it reach stopped
influxdb3 stop node --node-id NODE_ID     # repeat: 400 or 200?
# Also test against a node that is `stopping`, and one that is `removing`
```

If the CLI now returns 200, replace the section with idempotent-retry guidance
for controller authors.

### 2.3 Empty reply from the stop API

EAR #6744: scaling down returned an empty reply (curl exit 52) even when the
stop succeeded — suspected race where the server tears down before flushing the
200.

```bash
curl -i -X POST "http://NODE:8181/api/v3/enterprise/configure/node/stop" \
  -H "Authorization: Bearer $TOKEN" -d '{"node_id":"NODE_ID"}'
```

If reproducible, document that an empty reply does not mean failure, and tell
automation to confirm via `show nodes` rather than retrying.

### 2.4 Stopping a node whose process is dead, via `--host`

Support drove this in case 00130867 and verified it on a test cluster, but it
is not in the published CLI docs.

```bash
kill -9 <target node process>
influxdb3 stop node --node-id DEAD_NODE \
  --host http://A_RUNNING_NODE:8181 --token $TOKEN
influxdb3 show nodes
```

EAR #7030 reports the node moves to `stopping` and **never** reaches `stopped`,
because no live process completes the handshake. If so, state that explicitly —
it changes what an operator should expect next.

### 2.5 `system.pt_compaction_nodes` database and columns

The page's stuck-removal diagnostic queries `--database _internal`; internal
notes describe `db=<any-db>` from any querier.

```bash
influxdb3 query --database _internal --token $TOKEN \
  "SELECT * FROM system.pt_compaction_nodes"
```

Confirm the database, the column names, and that this table is not
compactor-only (unlike `system.pt_compaction_active_jobs` and
`system.pt_compaction_deferred_snapshots`, which return
`400 ... is only available on compactors` through the normal query path).
If these tables are internal or unstable, drop the example and describe the
symptom qualitatively.

### 2.6 Compactor replacement — DESTRUCTIVE

Stop the compactor, start a replacement on different hardware with the same
`--node-id` and `--mode compact`, and confirm it takes the single-writer
compaction lease cleanly. Determine whether the lease TTL (reported as 30s)
forces a wait between stopping the old node and starting the replacement.

A dead compactor's catalog record made other nodes crash-loop in case 00130867,
so the happy path is worth proving.

### 2.7 `--force-finalize` on a zombie node — DESTRUCTIVE, product decision

EAR #7030 (open, seen on 3.11.0) reports this causing a self-perpetuating
compactor panic loop (`duplicate catalog subscription name:
pt_compactor_restore`) that kills the node-removal driver so removal never
completes — escalating in one case to an unresponsive `/health` and a suspected
deadlock.

```bash
kubectl logs <compactor-pod> | grep -m1 'duplicate catalog subscription'
```

If still reproducible, the page's current warning is too mild: force-finalize
can wedge the cluster, not just lose writes. **Decide with engineering** whether
to publish the stronger caution plus the log diagnostic, or hold until fixed.

---

## Not testable — needs a product owner

**Catalog sync interval default of 10 seconds** (page: "Verify node state").
Carried over from the published `stop node` CLI page. Confirm against current
config options and name the setting on the page if it is user-tunable.

**Per-engine name for the drain step a graceful stop forces** (pages: shared
`stop node` CLI "Behavior", `admin/recover-node.md` step 2). Both spots read
`(Parquet: WAL flush; upgraded engine: WAL snapshot)` on master. Changed to
`Parquet persistence` on this branch, on the reading that:

- WAL flush is the constant `--wal-flush-interval` operation (default 1s), so
  it is not something a graceful stop has to force.
- Data durability says buffered writes stay in the WAL "until the next Parquet
  persistence captures it" — that is the step that makes the tail durable.

Confirm with engineering, and confirm `WAL snapshot` is the right name for the
upgraded-engine side. If the original wording was right, revert both spots
together — they must stay in sync. A `VERIFY (eng/product review)` comment sits
at each location.
