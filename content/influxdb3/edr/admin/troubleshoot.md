---
title: Troubleshoot EDR
description: >
  Symptom-to-tool quick index, agent startup errors, halted-state recovery,
  replication lag, and Docker-specific troubleshooting for EDR.
menu:
  influxdb3_edr:
    name: Troubleshoot
    parent: Manage
weight: 110
---

When something looks wrong, start here. The quick index maps a symptom to
the first tool to run; the sections below go deeper.

## Quick index

Symptom, what to run first, and what it tells you:

| Symptom | Run first | What it tells you / fix |
|---|---|---|
| Replication stopped / "halted" | `edr-inspect metrics` (live), or the log's last `REPLICATION HALTED ...` (after a crash) | The halt **class** (auth / schema / network). Fix the cause—the halted batch retries as a probe and **auto-resumes**; nothing is skipped. |
| Lag climbing / "behind" | `edr-inspect state`, then `edr-inspect metrics` | Whether anything is actually **lost** (rare) or just **owed backlog** that drains once the link recovers. Lag != loss. |
| Data missing | `edr-inspect state` (lost / gap counts) | **The only authority on loss.** A non-zero `lost(unrecoverable)` here is real; a scary `metrics` reading is not. |
| Agent crashed / restarted | capture the log, then follow the log post-mortem procedure below | In-memory metrics reset on restart—the log is the only witness. |

> [!Important]
> Trust order when the planes disagree: durable `state` > the log's
> sequence > a single live `metrics` snapshot. A `metrics`/UI reading is
> point-in-time and resets each run, so it can catch a transient at its
> worst instant. Always confirm a conclusion against `edr-inspect state`
> before acting—see [Data not flowing](#data-not-flowing).

## Agent won't start

| Error | Cause | Fix |
|----|----|---|
| "config must include at least one of 'downstream' or 'upstreams'" | Config has neither section. | Add one. |
| "downstream.historic_fill must be set explicitly ..." | No historic intent declared. | Add `historic_fill: { mode: none }` (live-only) or `full`/`since`. See [Historic fill](/influxdb3/edr/admin/monitor/#historic-fill). |
| "historic_fill mode 'since' requires a 'since' value" / "... is not parseable" | `since` missing or malformed. | Set `since` to a whole-day duration (`7d`) or an ISO date (`2026-06-01`); sub-day units (`30m`/`6h`) are rejected. |
| "Multiple ingest nodes detected... idempotent_writes is false" | Multi-node store without the guarantee. | Add `idempotent_writes: true` or point at a single-node store. |
| "failed to resolve token" | Token file missing from store. | Check `--token-store` path and file names. |
| "... changed — requires full restart" (on reload) | A non-reloadable field changed. | Restart the agent. |

## Data not flowing

1. First-line triage: `edr-inspect state <state-location>` (what's owed / in
   progress, even if the agent is wedged) and `edr-inspect topology` /
   `edr-inspect metrics` (live health + flow). See
   [Triage CLI](/influxdb3/edr/admin/monitor/#triage-cli-edr-inspect). For
   what the state files mean—and before deleting ANY of them—see
   [State & recovery](/influxdb3/edr/reference/state-and-recovery/).
2. Check node info: `curl http://127.0.0.1:9091/edr/v1/node_info`
   (observability listener, loopback)
3. Check connectivity: `curl http://destination:9090/health` (network
   listener)
4. Check WAL files exist: `ls <data-dir>/<node-id>/pt_wal/`
5. Check scope includes the database/table.
6. Verbose logs: restart with `RUST_LOG=debug`.

> [!Important]
> Before acting on a `metrics` or UI reading, cross-check `state`. A live
> `metrics` snapshot is point-in-time and resets each run, so it can catch a
> transient at its worst instant—for example, `health: Error`, a high
> `live-lag`, or `REPLICATION HALTED: N batch(es) since 1s ago` shown
> alongside `consecutive-fails=0` (a halt only ~1s old, already recovering).
> `edr-inspect state` is the durable authority on what is genuinely lost or
> gapped; if it shows no loss and no pending gaps, the system is caught up
> regardless of how the live reading looks.

## Common log messages

| Message | Meaning |
|-----|-----|
| `historic fill: MANIFEST GAP ...` | Expected—compactor deleted old manifests; recovery proceeds via WAL/cv2. See [Historic fill](/influxdb3/edr/admin/monitor/#historic-fill). |
| cv2 over-replication warnings | Expected when recovering compacted data; idempotent writes absorb it. |
| `... POTENTIAL DATA LOSS` | Not expected—data missing from all tiers. Check retention settings. |
| Schema conflict / channel blocked, retrying every 60s | Destination rejected a write due to a type mismatch. Drop the conflicting table on the destination; the retry recreates it with the source schema. |
| Unauthorised | Destination rejected the auth token. Update the token file; the next retry picks it up. |
| Cursor reset detected | InfluxDB WAL IDs reset (for example, after a data wipe with state retained). The agent auto-detects and resets its cursor. |
| `failed to connect to downstream` + a burst of `batch send failed`, right after a restart | Restart-ordering gap—the source came up before the destination's listener was accepting. Clears at the next `connected to downstream` / `edge connected`. Benign and self-healing; not data loss. |
| `rejecting data: upstream has not called /connect` (destination side) | Momentary—data arrived a beat before the `/connect` handshake re-registered (typical just after a restart). Self-clears once the source re-issues `/connect`. |
| Source `REPLICATION HALTED: auth failure` **and** destination `batch write failed: auth failure` on the **same `batch_id`** | Both ends agree, so this is a genuine token mismatch on that hop, not a source-side phantom. Update the token (see *Unauthorised* above); the next probe resumes. |

## Protocol incompatible (agents of different versions)

Symptoms: nothing flows to one downstream; health shows **Halted**; the log
carries `protocol halt: replication to this downstream is STOPPED` once at
ERROR and a `PROTOCOL-HALTED` WARN every minute; the downstream's log (or
the upstream's error) names both protocol versions and both minimums.

- This is deliberate: the two agents' protocol versions cannot interoperate
  (or the downstream lacks a capability the config requires, for example
  `encoding: pt`). The message says which side must be upgraded.
- Upgrade the named agent. Negotiation re-runs on **every report** (default
  10s), so the halted upstream resumes by itself within one report interval
  (`protocol compatibility restored` in the log); a config reload also
  re-negotiates immediately.
- Agents released before protocol versioning (0.1.x/0.2.x) are always
  accepted as protocol v1—they can never be refused by current builds.

See [Compatibility](/influxdb3/edr/reference/compatibility/) for the full
protocol version matrix.

## Stale binaries

After replacing a binary (for example, an EDR upgrade), make sure the old
process is actually gone before concluding the new one misbehaves: stop the
agent, start it again, and confirm the running binary's modification time
predates the process start time. A lingering old process is a common cause
of "the new version didn't take effect".

## Port conflicts and orphan processes

EDR agents, proxies, and InfluxDB instances hold their listen ports until
fully stopped. If a start fails with "address in use", find the holder with
`lsof -ti :<port>`. Process managers that track PID files can lose track of
processes across crashes—always verify with
`ps aux | grep influxdb3 | grep -v grep` that no orphans remain before
restarting. Orphaned old agents reading the same state file as a new agent
will fight over the cursor.

## Replication lag

- **Lag is not loss.** A high `live-lag` / `pending_bytes` is almost always
  **owed backlog** that drains once the destination catches up, not missing
  data. `edr-inspect state` (`lost(unrecoverable)`, pending gaps) is the
  authority on what—if anything—is actually unrecoverable. Confirm there
  before treating lag as an incident.
- High `pending_bytes` -> the destination is slow or unreachable.
- WAL files deleted before replication -> increase
  `--wal-snapshots-to-keep` on the source server. See
  [Size WAL retention](/influxdb3/edr/admin/size-wal-retention/). Gap fill
  will recover, but at a cost.
- Slow WAL discovery -> lower `--poll-interval-ms` (more frequent object
  store listing).
- Constrained link -> check whether a `bandwidth_schedule` window is active
  (`limited`/`silent` shows in the UI and logs).

## Source WAL / disk growing

- The **source** server owns WAL lifecycle; a large or growing `pt_wal`
  footprint usually means `--wal-snapshots-to-keep` is set high (often to
  cover long outages). That is working as intended—WAL is retained until
  the source rolls it to gen0.
- If the buildup of already-replicated WAL is a problem, enable EDR's
  opt-in `--wal-cleanup-enabled` so the agent prunes the replicated tail
  itself. See [Size WAL retention](/influxdb3/edr/admin/size-wal-retention/).
  It only deletes below `min(cursor, snapshot boundary - margin,
  historic-fill floor)`, so it cannot strand replication, source recovery,
  or backfill.
- After enabling, confirm `gaps_pending` / `wal_files_lost_total` stay
  flat—a rise is not expected (cleanup is designed never to create gaps)
  and warrants a look. A sweep that prunes anything logs `wal cleanup:
  deleted replicated WAL files`; delete failures warn and hold the
  watermark.

## Log post-mortem (after a crash or restart)

When an agent has **crashed, been killed, or restarted**, the live views
can't help—its in-memory metrics reset on restart, so the logs are the
only witness. EDR logs structured JSON to stdout; capture them first (a
`--rm` container discards them on removal):

```bash
docker logs <container> > edr.log 2>&1     # or: journalctl -u <edr-unit> -o cat > edr.log
```

Then reconstruct the final run:

1. The last startup banner marks the final run (count banners to get the
   number of restarts).
2. The last successful send is last-known-good.
3. A `shutdown signal received` + `... shutting down` cascade means a clean
   stop; **no** shutdown markers means an unclean exit (crash / OOM /
   kill).
4. Identify the dominant ERROR/WARN class and its fields (`table`,
   `upstream`, `error`).
5. Write a one-line verdict and remediation.

For the complete rule set—delivery failures, data loss, cursor/state,
connectivity, config, and infrastructure signatures—see the
[EDR log post-mortem playbook](/influxdb3/edr/admin/log-postmortem-playbook/).
The manual procedure above always works without any additional tooling.

## Docker-specific troubleshooting

See [Run EDR in Docker](/influxdb3/edr/install/docker/#docker-specific-troubleshooting).
