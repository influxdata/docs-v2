---
title: EDR log post-mortem playbook
description: >
  Diagnose what happened to a crashed or restarted EDR agent from a captured
  log, using structured JSON log fields and a deterministic procedure.
menu:
  influxdb3_edr:
    name: Log post-mortem playbook
    parent: Troubleshoot
weight: 2
---

<!-- ADAPTED_FROM: influxdata/influxdb3_edr@085be6c docs/external/log-postmortem-playbook.md -->

Diagnose what happened to an EDR agent from a captured log, after the fact.
This helps most when the agent crashed or restarted.
The live views (`edr-inspect metrics` and `topology`) can't help in that case,
because the agent's in-memory counters reset on every restart.
EDR logs are structured JSON,
so this playbook relies on deterministic field extraction, not guesswork.

1. [Capture the log first](#capture-the-log-first)
2. [Log shape](#log-shape)
3. [Reconstruct the final run](#reconstruct-the-final-run)
4. [Detector rules](#detector-rules)
5. [Worked example](#worked-example)
6. [Limits](#limits)
7. [Corroborate with `edr-inspect`](#corroborate-with-edr-inspect)

## Capture the log first

EDR logs JSON to **stdout**.
There's no log file by default, so capture the evidence before it's gone.

```bash
# Docker -- do this BEFORE removing a --rm container (removal discards logs):
docker logs <CONTAINER> > edr.log 2>&1

# systemd:
journalctl -u <EDR_UNIT> -o cat > edr.log
```

If you ship logs to an aggregator such as Loki, ELK, or CloudWatch,
export the agent's stream for the incident window instead.

This playbook covers the dead or restarted case.
Pair it with `edr-inspect`:

- **`state`** reads the durable journals **offline**,
  so it works even on a dead agent.
- **`metrics`** and **`topology`** give the live picture,
  but only **if the agent is running again**.

See [Corroborate with `edr-inspect`](#corroborate-with-edr-inspect).

## Log shape

Each line is a JSON object with these fields:

| Field | Value |
| :--- | :--- |
| `timestamp` | Time of the log line |
| `level` | `ERROR`, `WARN`, `INFO`, or `DEBUG` |
| `target` | The module |
| `fields` | Structured context, for example `node_id`, `upstream`, `wal_id`, `database`, `table`, and `error` |
| `message` | The log message |

What each level means:

- **`ERROR`** and **`WARN`** always indicate a real problem.
  EDR doesn't log warnings for expected conditions.
- **`INFO`** is routine.
  It covers startup, shutdown, and other lifecycle transitions, not faults.

Useful filters:

```bash
jq -c 'select(.level=="ERROR" or .level=="WARN")' edr.log     # just the abnormal
jq -c 'select(.fields.upstream=="Dublin")' edr.log            # one channel
jq -rc '[.timestamp,.level,.message]|@tsv' edr.log | tail -50 # the tail, compact
```

## Reconstruct the final run

[Capture the log first](#capture-the-log-first), then run this procedure.
It reconstructs what happened in the agent's final run.
The live tools can't give you that once the agent is gone,
because their counters reset on restart.

Reconstruct the final run in five steps:

1. **Find the final run.** Locate the last startup banner:
   `upstream replication pipeline started` or `starting HTTP servers`.
   Everything after it belongs to the run that ended.
   **Count the banners** across the whole log to get the number of
   (re)starts.
2. **Find last-known-good.** Find the last successful send or replication
   before the tail—that is, "last good at T."
3. **Classify the ending.**
   - **Clean stop**—the tail contains `shutdown signal received` followed
     by the orderly cascade (`WAL replicator shutting down`,
     `tiered dispatcher shutting down`, `... shutting down`).
     An operator or orchestrator stopped the agent.
   - **Unclean**—the tail has **no** shutdown markers:
     the log just stops, or ends on an `ERROR` or a panic.
     This indicates a crash, an out-of-memory (OOM) kill, or `SIGKILL`.
4. **Find the dominant failure.** Identify the most frequent `ERROR` or
   `WARN` class in the final run,
   with its fields (`table=`, `upstream=`, `error=`).
5. **State the verdict in one line.** Combine the findings above,
   for example:
   > *"Final run started 11:31; last good send 11:33; then 18
   > schema-conflict warnings on db=sensors table=air_quality;
   > **no shutdown marker, so the run ended uncleanly at 11:41**.
   > Likely cause: schema conflict—drop the table downstream."*

## Detector rules

Each rule keys on a real log signal.
Lead with evidence: when you cite a rule,
record its **count, its first and last timestamp, and a sample line**.
Never report a bare verdict.

Each entry below gives the signal, its severity, and what it means.

### Exit and lifecycle

- **`upstream replication pipeline started`** or
  **`starting HTTP servers`** (info)—marks a run boundary.
  **Count occurrences to find restarts.**
  Many, tightly spaced, indicate a **crash loop**.
  The live tools can't show a crash loop, because counters reset each run.
- **`shutdown signal received`** plus the `... shutting down` cascade at
  the tail (info)—indicates a **clean stop** initiated by an operator or
  orchestrator. Not a fault.
- **The tail has none of the above signals**;
  it ends on `ERROR` or just stops (high)—indicates an **unclean exit**:
  a crash, an OOM kill, or `SIGKILL`. The headline post-mortem fact.

### Delivery failures (why replication stalled)

- **Halt**, or `halted batch ... is the probe` (high)—indicates a
  **halted** channel: it's wedged on a batch it can't deliver.
  The cause is the **preceding** auth, schema, or write error.
  Resolve that cause; the halted batch retries as the probe and resumes.
- **`Unauthorised`** (high)—the downstream rejected the auth token.
  Update the token file; the next retry picks it up.
- **Schema conflict**, or `channel blocked, retrying` (high)—the
  downstream rejected a write on a type mismatch.
  Drop the conflicting table downstream;
  the retry recreates it with the source schema.
- **`schema conflict resolved — replication resumed`** (info)—the agent
  recovered, so the conflict was **transient**.
  Closes the loop on an earlier halt.

### Data loss (durable—always report)

- **`POTENTIAL DATA LOSS`** (critical)—data is missing from **all** tiers.
  Record the time window.
  Check retention and eviction settings; this doesn't self-heal.
- **`historic fill: ... no Gen0 AND no cv2 coverage — data may be
  missing`** (critical)—a historic range is unrecoverable from any medium.
- **WAL files lost**, or eviction outrunning replication (high)—the source
  evicted WAL before EDR replicated it.
  Raise `--wal-snapshots-to-keep`; gap fill recovers what it can, at a cost.

### State and cursor

- **`failed to save cursor — will not survive restart`** (high)—the cursor
  didn't persist, which explains **post-restart rework** (re-replication).
  Check the state location's durability and permissions.
- **`cursor state unparseable — falling back to previous-good copy`**
  (medium)—the primary was corrupt.
  The agent recovered from the mirror and self-healed,
  so no operator action is needed.
  This explains nothing else, and it isn't a large re-replication.
- **`previous-good cursor also unparseable — starting from default`** or
  **`cursor state loss: primary AND mirror both corrupt/unreadable`**
  (high)—indicates **state loss**: both copies are gone.
  What happens next depends on `on_state_loss`; see the next two entries.
- **`cursor rebuilt from snapshot floor`** (per node) (high)—indicates
  `on_state_loss: recover` fired.
  It explains a re-replication bounded by the node's retained WAL,
  not the whole backlog from WAL 1.
  It isn't silent either: the position and the reason are both in this line.
- **`cursor state loss ... Refusing to start per on_state_loss: halt`**
  (critical)—the agent **did not start**.
  Restore the state location from backup,
  or switch to `on_state_loss: recover` (requires `idempotent_writes: true`).
- **`historic fill manifest state loss ... Refusing to start per
  on_state_loss: halt`** (critical)—same as the previous entry,
  but for the historic manifest specifically.
  It's distinct from `historic_fill is configured but live replication has
  already started`, which is a config-ambiguity refusal,
  not a corruption event.
- **`Cursor reset detected`** (medium)—the upstream InfluxDB WAL IDs reset,
  for example after a data wipe with state retained.
  The agent auto-resets; this explains a discontinuity.
- **`failed to save gap ledger ...`** (medium)—gap obligations might not
  have survived a restart.

### Connectivity

- **`upstream timed out — marking disconnected`** alternating with
  **`reconnect requested`** (medium)—indicates **flapping** if the two
  cycle. Report the rate over the window.
  This identifies network instability, not an EDR fault.

### Config and startup refusal (the agent never started)

- **`config must include at least one of 'downstream' or 'upstreams'`**
  (high)—the agent **refused to start**. Fix the config.
- **`historic fill: cannot parse 'since' value — aborting`** or
  **`... requires a 'since' value`** (high)—the agent refused to start.
  Set `since` to a whole-day duration (`7d`) or an ISO date;
  sub-day units are rejected.
- **`config reload skipped — requires full restart`** (medium)—a
  non-reloadable field changed, so the agent kept the old config and the
  change was **silently not applied**. Restart to apply the change.

### Infrastructure

- **`catalog could not be read from the object store (transient?)`** or
  **`verify the object store is reachable, then restart`** (high)—the
  object store or InfluxDB is unreachable.
  The root cause is **infrastructure**, not an EDR fault.
- **`catalog not found ... cannot resolve database/table names`** or
  **`ensure the InfluxDB instance has been started at least once`**
  (high)—the source InfluxDB never wrote a catalog.
  Start the InfluxDB 3 Enterprise instance before the agent.
  If it runs on 3.10.x, start it with `--upgrade-pacha-tree` so it writes
  the
  [upgraded storage engine](/influxdb3/enterprise/reference/internals/storage-engine/)'s
  catalog format.

### WAL cleanup (only when `--wal-cleanup-enabled`)

- **`wal cleanup: deleted replicated WAL files`** (info)—**routine**.
  The agent pruned already-replicated WAL and logs the watermark and floors.
  This isn't data loss: only WAL below
  `min(cursor, snapshot-margin, historic-fill floor)` is pruned.
- **`wal cleanup: delete failed`** or
  **`sweep had delete errors; watermark held`** (low)—transient
  object-store delete errors.
  The watermark is held and the range retries on the next sweep
  (idempotent).
  Persistent errors warrant checking store reachability and permissions.
- **`wal cleanup: historic fill not ready — skipping sweep`** (info)—
  cleanup is configured, but historic fill's plan isn't built yet,
  so the sweep no-ops (conservative).
  Expected early in a backfill.

### Everything else

Roll up the remaining `ERROR` and `WARN` lines **by `target`** with counts,
so the long tail is visible and you don't silently drop anything.

## Worked example

```json {lint="false"}
{"timestamp":"...11:31:02","level":"INFO","message":"upstream replication pipeline started"}
{"timestamp":"...11:33:10","level":"INFO","message":"...replicated...","fields":{"wal_id":1042}}
{"timestamp":"...11:33:41","level":"WARN","message":"schema conflict","fields":{"database":"sensors","table":"air_quality"}}
... (17 more schema-conflict WARNs, ~1/min) ...
{"timestamp":"...11:41:55","level":"ERROR","message":"...halt..."}
<log ends here -- no shutdown markers>
```

**Verdict:** one run (one banner, no restarts).
Last good send at 11:33:10.
Starting at 11:33:41, 18 schema-conflict `WARN` lines on
`sensors/air_quality`, escalating to a halt at 11:41:55.
**No shutdown marker, so this is an unclean end**—the process crashed or
was killed while halted.
**Likely cause:** schema conflict.
Drop `air_quality` downstream; the retry recreates it with the source schema.

## Limits

Keep these limits in mind so you don't overstate the verdict:

- **The procedure needs a captured log.**
  The evidence is gone if a `--rm` container was removed,
  or if the log rotated past the incident.
  [Capture the log first](#capture-the-log-first).
- **A clean exit is an inference, not a fact.**
  You infer it from shutdown markers,
  so a truncated or rotated log can look unclean.
  Phrase the finding as "no shutdown marker *in the captured window*."
- **`SIGKILL` and OOM kills emit nothing.**
  You can infer only an "abrupt end," never prove the cause.
  To find the real cause, correlate with the host's OOM killer or
  orchestrator events.

## Corroborate with `edr-inspect`

The log says how the agent got there.
`edr-inspect` says where it ended up and whether it's still broken.

### Check the evidence in this order

Confirm and quantify the log's findings with the evidence below.
Each kind of evidence answers a different question:

1. `edr-inspect state <STATE_LOCATION>`—the durable truth:
   where did it actually end up?
   Always check it first.
   It needs no live agent, because it reads the journals offline,
   and the journals survive on the volume.
   It shows the WAL cursor, the gap ledger (pending and unrecoverable),
   and historic progress and lost-counts.
   This is the primary corroborator.
2. The log—the sequence: did it recover, and what was the cause?
   The log shows the incident.
3. `edr-inspect metrics [addr]` and `edr-inspect topology [addr]`—current
   health: is it still failing?
   Check these only if the agent is back up, because both need a live
   agent.
   - `metrics` shows the live health of the restarted agent.
     Its counters cover the current run,
     so they show recovery state, not the incident.
     Treat the numbers as data from "the new run."
     A single reading might be a blip.
   - `topology` shows per-channel health after recovery:
     which upstream or downstream is degraded now.

### Map a log finding to its corroborator

<!-- VERIFIED against a live EDR 1.0.0-rc.1 and InfluxDB 3 Enterprise 3.11.4
cluster: edr-inspect metrics showed the halt and recovery states described
below, and agent logs recorded replication resuming. -->

- **`POTENTIAL DATA LOSS` or WAL lost**—check `state`:
  HISTORIC lost-counts and GAP FILL `unrecoverable` entries.
- **`Cursor reset` or a corrupt-cursor re-seed**—check `state`:
  LIVE REPLICATION (current cursor compared to expected).
- **Gap advisories**—check `state`: the gap ledger
  (what's `pending` or `in-progress` now).
- **Halt, `Unauthorised`, or schema conflict**, if the agent is **now
  running**—check `metrics` for `REPLICATION HALTED` and `last-write`.
  Check `topology` for channel health.
  These views show whether the agent is still halted or has recovered.
  For the corresponding JSON fields and numeric values,
  see the [halt field values](/influxdb3/edr/reference/api/#halt-fields).

### When the evidence disagrees

No single kind of evidence is trustworthy alone,
so cross-check before you conclude.
A metrics reading is a point-in-time snapshot of the current run.
It can capture a transient failure at its peak.
The snapshot can overstate the incident's severity.

For example, a captured snapshot might show
`REPLICATION HALTED: 1 batch(es)` with high lag.
That output can look like the agent stopped while authentication was failing.
Yet the log shows `REPLICATION RESUMED` the same second.
`edr-inspect state` shows the cursor fully caught up with zero loss.

When the evidence disagrees, the log and `state` win over a lone
`metrics` snapshot.
A clean conclusion needs at least the durable `state` to confirm it.
If you captured metrics or state snapshots at the time of the incident,
and not just live readings,
feed all of them into the post-mortem and reconcile them against the log.
Don't act on any one in isolation.
