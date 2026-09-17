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

Diagnose **what happened** to an EDR agent from a **captured log**, after
the fact—especially a **crashed or restarted** agent, when the live views
(`edr-inspect metrics` / `topology`) can't help because the agent's
in-memory counters reset on every restart. EDR logs are structured JSON, so
this is deterministic field-extraction, not guesswork.

1. [Capture the log first](#capture-the-log-first)
2. [Log shape](#log-shape)
3. [Cause-of-death procedure](#cause-of-death-procedure)
4. [Detector rules](#detector-rules)
5. [Worked example](#worked-example)
6. [Limits](#limits)
7. [Corroborate with `edr-inspect`](#corroborate-with-edr-inspect)

## Capture the log first

EDR logs JSON to **stdout**—there is no log file by default, so capture the
evidence before it's gone:

```bash
# Docker -- do this BEFORE removing a --rm container (removal discards logs):
docker logs <CONTAINER> > edr.log 2>&1

# systemd:
journalctl -u <EDR_UNIT> -o cat > edr.log
```

If you ship logs to an aggregator (Loki / ELK / CloudWatch), export the
agent's stream for the incident window instead. This playbook is for the
dead/restarted case—but pair it with `edr-inspect` either way: `state`
reads the durable journals **offline** (works even on a dead agent), and
`metrics`/`topology` give the live picture **if the agent is running
again** (see [Corroborate with `edr-inspect`](#corroborate-with-edr-inspect)).

## Log shape

Each line is JSON with: `timestamp`, `level` (`ERROR`/`WARN`/`INFO`/
`DEBUG`), `target` (the module), structured `fields` (for example,
`node_id`, `upstream`, `wal_id`, `database`, `table`, `error`), and
`message`. `ERROR` and `WARN` always indicate a real problem—EDR doesn't
log warnings for expected conditions. `INFO` is routine: startup,
shutdown, and other lifecycle transitions, not faults.

Useful filters:

```bash
jq -c 'select(.level=="ERROR" or .level=="WARN")' edr.log     # just the abnormal
jq -c 'select(.fields.upstream=="Dublin")' edr.log            # one channel
jq -rc '[.timestamp,.level,.message]|@tsv' edr.log | tail -50 # the tail, compact
```

## Cause-of-death procedure

Run this after you've captured the log (see
[Capture the log first](#capture-the-log-first)). This reconstructs what
happened in the agent's final run—information the live tools can't give
you once the agent is gone, because their counters reset on restart.
Reconstruct the final run in five steps:

1. **Find the final run.** The last startup banner—`"upstream replication
   pipeline started"` / `"starting HTTP servers"`. Everything after it is
   the run that ended. **Count the banners** across the whole log to get
   the number of (re)starts.
2. **Find last-known-good.** The last successful send / replication before
   the tail, that is, "last good at T."
3. **Classify the ending.**
   - **Clean stop**—the tail contains `"shutdown signal received"`
     followed by the orderly cascade (`"WAL replicator shutting down"`,
     `"tiered dispatcher shutting down"`, `"... shutting down"`). An
     operator or orchestrator stopped it.
   - **Unclean**—**no** shutdown markers: the log just stops, or ends on
     an `ERROR`/panic. This indicates a crash, OOM, or SIGKILL.
4. **Find the dominant failure.** The most frequent `ERROR`/`WARN` class in
   the final run, with its fields (`table=`, `upstream=`, `error=`).
5. **State the verdict (one line).** Combine the above, for example:
   > *"Final run started 11:31; last good send 11:33; then 18x
   > schema-conflict on db=sensors table=air_quality; **no shutdown marker
   > -> ended uncleanly at 11:41**. Likely cause: schema conflict—drop the
   > table downstream."*

## Detector rules

Each rule keys on a real log signal. Evidence-first: when you cite one,
record its **count, first/last timestamp, and a sample line**—never a bare
verdict.

### Exit and lifecycle

- **info**—`upstream replication pipeline started` / `starting HTTP
  servers`. Run boundary. **Count to find restarts.** Many, tightly
  spaced, indicates a **crash loop** (the live tools can't show this—
  counters reset each run).
- **info**—`shutdown signal received` + `... shutting down` cascade at
  the tail. **Clean stop**—operator/orchestrator initiated. Not a fault.
- **high**—tail has none of the above; ends on `ERROR` or just stops.
  **Unclean exit**—crash / OOM / SIGKILL. The headline post-mortem fact.

### Delivery failures (why replication stalled)

- **high**—halt / "halted batch ... is the probe". **Halted**—the channel
  is wedged on a batch it can't deliver. Cause = the **preceding**
  auth/schema/write error. Resolve the cause; the halted batch retries as
  the probe and resumes.
- **high**—`Unauthorised`. Downstream rejected the auth token. Update the
  token file; the next retry picks it up.
- **high**—schema conflict / "channel blocked, retrying". Downstream
  rejected a write on a type mismatch. Drop the conflicting table
  downstream; the retry recreates it with the source schema.
- **info**—`schema conflict resolved — replication resumed`. It
  recovered—the conflict was **transient**. Closes the loop on an earlier
  halt.

### Data loss (durable—always surface)

- **critical**—`POTENTIAL DATA LOSS`. Data missing from **all** tiers.
  Record the time window. Check retention/eviction settings; this is not
  self-healing.
- **critical**—`historic fill: ... no Gen0 AND no cv2 coverage — data may
  be missing`. A historic range is unrecoverable from any medium.
- **high**—WAL files lost / eviction outrunning replication. The source
  evicted WAL before EDR replicated it. Raise `--wal-snapshots-to-keep`;
  gap fill recovers what it can (at a cost).

### State and cursor

- **high**—`failed to save cursor — will not survive restart`. Explains
  **post-restart rework** (re-replication)—the cursor didn't persist.
  Check the state-location's durability/permissions.
- **medium**—`cursor state unparseable — falling back to previous-good
  copy`. Primary corrupt, recovered from the mirror—self-healed, no
  operator action. Explains nothing else; not a large re-replication.
- **high**—`previous-good cursor also unparseable — starting from
  default` / `cursor state loss: primary AND mirror both
  corrupt/unreadable`. **State loss**—both copies gone. What happens next
  depends on `on_state_loss`: see the next two entries.
- **high**—`cursor rebuilt from snapshot floor` (per node).
  `on_state_loss: recover` fired—explains a re-replication bounded by the
  node's retained WAL (not the whole backlog from WAL 1, and not
  silent—the position and reason are both in this line).
- **critical**—`cursor state loss ... Refusing to start per
  on_state_loss: halt`. The agent **did not start**. Restore the state
  location from backup, or switch to `on_state_loss: recover` (requires
  `idempotent_writes: true`).
- **critical**—`historic fill manifest state loss ... Refusing to start
  per on_state_loss: halt`. Same as above, for the historic manifest
  specifically—distinct from `historic_fill is configured but live
  replication has already started` (a config-ambiguity refusal, not a
  corruption event).
- **medium**—`Cursor reset detected`. Upstream InfluxDB WAL IDs reset (for
  example, a data wipe with state retained). The agent auto-resets;
  explains a discontinuity.
- **medium**—`failed to save gap ledger ...`. Gap obligations may not have
  survived a restart.

### Connectivity

- **medium**—`upstream timed out — marking disconnected` alternating with
  `reconnect requested`. **Flapping** if cycling. Report the rate over
  the window to identify network instability, not an EDR fault.

### Config and startup refusal (never got going)

- **high**—`config must include at least one of 'downstream' or
  'upstreams'`. The agent **refused to start**—fix the config.
- **high**—`historic fill: cannot parse 'since' value — aborting` / `...
  requires a 'since' value`. Refused to start—set `since` to a whole-day
  duration (`7d`) or ISO date (sub-day units are rejected).
- **medium**—`config reload skipped — requires full restart`. A config
  change was **silently not applied**—a non-reloadable field changed; the
  agent kept the old config. Restart to apply.

### Infrastructure

- **high**—`catalog could not be read from the object store
  (transient?)` / `verify the object store is reachable, then restart`.
  Object store / InfluxDB unreachable—an **infrastructure** root cause,
  not an EDR fault.
- **high**—`catalog not found ... cannot resolve database/table names` /
  `ensure the InfluxDB instance has been started at least once`. The
  source InfluxDB never wrote a catalog. Start the InfluxDB 3 Enterprise
  instance before the agent; if it runs on 3.10.x, start it with
  `--upgrade-pacha-tree` so it writes the
  [upgraded storage engine](/influxdb3/enterprise/reference/internals/storage-engine/)'s
  catalog format.

### WAL cleanup (only when `--wal-cleanup-enabled`)

- **info**—`wal cleanup: deleted replicated WAL files`. **Routine.** The
  agent pruned already-replicated WAL (logs the watermark and the
  floors). Not loss—only WAL below `min(cursor, snapshot-margin,
  historic-fill floor)`.
- **low**—`wal cleanup: delete failed` / `sweep had delete errors;
  watermark held`. Transient object-store delete errors; the watermark is
  held and the range retried next sweep (idempotent). Persistent errors
  warrant checking store reachability/permissions.
- **info**—`wal cleanup: historic fill not ready — skipping sweep`.
  Cleanup is configured but historic fill's plan isn't built yet, so the
  sweep no-ops (conservative). Expected early in a backfill.

### Everything else

Roll up the remaining `ERROR`/`WARN` lines **by `target`** with counts, so
the long tail is visible and nothing is silently dropped.

## Worked example

```json {lint="false"}
{"timestamp":"...11:31:02","level":"INFO","message":"upstream replication pipeline started"}
{"timestamp":"...11:33:10","level":"INFO","message":"...replicated...","fields":{"wal_id":1042}}
{"timestamp":"...11:33:41","level":"WARN","message":"schema conflict","fields":{"database":"sensors","table":"air_quality"}}
... (17 more schema-conflict WARNs, ~1/min) ...
{"timestamp":"...11:41:55","level":"ERROR","message":"...halt..."}
<log ends here -- no shutdown markers>
```

**Verdict:** one run (1 banner, no restarts). Last good send 11:33:10. From
11:33:41, 18x schema-conflict on `sensors/air_quality`, escalating to a halt
at 11:41:55. **No shutdown marker, so this is an unclean end** (crash or
kill while halted). **Likely cause:** schema conflict—drop `air_quality`
downstream; the retry recreates it with the source schema.

## Limits

So the inference isn't oversold:

- **Needs captured logs.** Gone if a `--rm` container was removed, or
  beyond log rotation. Capture early (see
  [Capture the log first](#capture-the-log-first)).
- **Clean-exit is inferred from markers**—a truncated/rotated log can look
  unclean. Phrase it "no shutdown marker *in the captured window*."
- **SIGKILL / OOM emit nothing.** Only "abrupt end" is inferable, never
  proven. Correlate with the host's OOM killer / orchestrator events for
  the real cause.

## Corroborate with `edr-inspect`

The log says *how it got there*; `edr-inspect` says *where it ended up* and
*whether it's still broken*. Confirm and quantify the log's findings with
the three views—but they split on whether the agent is running:

- **`edr-inspect state <STATE_LOCATION>`**—no, reads the journals
  offline. The durable end-state, even on a dead agent (the journals
  survive on the volume): the WAL cursor, the gap ledger (pending /
  unrecoverable), and historic progress + lost-counts. The primary
  corroborator.
- **`edr-inspect metrics [addr]`**—yes, needs a live agent. Current live
  health of the (restarted) agent—*is it still failing?* Counters are
  for the **current run**, so they show recovery state, **not** the
  incident—the log does that.
- **`edr-inspect topology [addr]`**—yes, needs a live agent. Current
  per-channel health after recovery—which upstream/downstream is
  degraded now.

**Map a log finding to its corroborator:**

- `POTENTIAL DATA LOSS` / WAL lost -> `state`: HISTORIC lost-counts + GAP
  FILL `unrecoverable` entries.
- `Cursor reset` / corrupt-cursor re-seed -> `state`: LIVE REPLICATION
  (current cursor vs. expected).
- gap advisories -> `state`: gap ledger (what's `pending` /
  `in-progress` now).
- halt / `Unauthorised` / schema conflict (agent **now running**) ->
  `metrics` (`replication_halted`, `last_write_result`) / `topology`
  (channel health) to check whether it's still wedged, or recovered.

Rule of thumb: **check `state` always** (it's offline and durable); check
**`metrics`/`topology` only if the agent is back up**, and treat their
numbers as "the new run," not the incident.

**No single plane is trustworthy alone—cross-check before concluding.** A
metrics reading is a point-in-time snapshot of the *current run*: it can
catch a **transient at its worst moment** and read far scarier than
reality. For example, a captured snapshot might show
`replication_halted: true` with high lag—looking like it died wedged on
auth—yet the **log** shows `REPLICATION RESUMED` the same second, and
`edr-inspect state` shows the cursor fully caught up with **zero loss**. So:

- **metrics** = current-run health—*is it failing right now?* (may be a
  blip);
- **log** = the sequence—*did it recover, and what was the cause?*;
- **state** = the durable truth—*where did it actually end up?*

When the planes disagree, the **log and state** win over a lone metrics
snapshot—and a clean conclusion needs at least the durable `state` to
confirm it. If you have metrics/state snapshots *captured at the time* (not
just live), feed all of them to the post-mortem and reconcile them against
the log—don't act on any one in isolation.
