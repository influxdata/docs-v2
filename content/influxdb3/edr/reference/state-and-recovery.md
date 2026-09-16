---
title: EDR state and recovery
description: >
  What EDR remembers between restarts, where it keeps it, what each piece
  means, and what happens if you delete it.
menu:
  influxdb3_edr:
    name: State & recovery
    parent: Reference
weight: 205
---

What EDR remembers between restarts, where it keeps it, what each piece
means, and—the part you are probably here for—what happens if you delete
it. Every behavior stated on this page is asserted by an automated test in
the EDR test suite.

1. [Where the state lives](#where-the-state-lives)
2. [What each file is](#what-each-file-is)
3. [Read before you touch](#read-before-you-touch)
4. [The golden rules](#the-golden-rules)
5. [Corruption vs. deliberate deletion](#corruption-vs-deliberate-deletion)
6. [The deletion matrix](#the-deletion-matrix)
7. [Sanctioned recovery recipes](#sanctioned-recovery-recipes)
8. [Risk summary](#risk-summary)

## Where the state lives

Everything the agent remembers is under `--state-location` (env
`INFLUXDB3_EDR_STATE_LOCATION`, default `edr-state`). A bare path or
`file://` URL selects the local filesystem; `s3://bucket/prefix`, `gs://...`,
`az://...` select object storage (credentials from the same `AWS_*` /
`GOOGLE_*` / `AZURE_*` environment the data plane uses).

Each item is one JSON object named `{key}.json`. The state location is
**independent of the data-plane object store**—moving or resetting it
never touches your data; it only changes what the agent believes it has
already done.

### Per-destination namespaces

Journals are namespaced **per downstream destination**:
`{state-location}/{destination}/wal_cursor.json` (and siblings). Each
destination's cursor, gap ledger, and historic progress are fully
independent—a fan-out node has one namespace per destination. Two items
live at the root: `state_layout.json` (the layout format marker) and
`wal_cleanup_watermark.json` (agent-level—the cleanup watermark is shared
by all destinations).

The layout is self-maintaining, and **config is the source of truth** (a
destination's namespace exists iff the destination is configured):

- **Migration**: on the first start of a fan-out-capable build, journals
  from the old un-namespaced layout are moved into the (single) configured
  destination's namespace, one log line per file. With multiple
  destinations configured and un-namespaced journals present, the agent
  refuses to start—it cannot guess whose history they are.
- **Orphan sweep**: at startup, a namespace with no matching configured
  destination (removed while the agent was down) is **deleted, loudly**.
- **Rename guard**: if the same pass sees an orphan namespace AND a
  configured destination with no state—the signature of a typo'd
  rename—the agent refuses to start rather than delete a real cursor. The
  error names both and the fix (correct the name, or delete the orphan
  namespace deliberately). The same guard rejects a live reload that
  removes one destination and adds a stateless new one in one pass.
- **Removing a destination via reload deletes its namespace** immediately;
  re-adding the same name later starts fresh.

The token store (`--token-store`) is separate and is not covered here—it
holds secrets, not progress.

## What each file is

| File | Plane | What it records | Written by |
|---|---|---|---|
| `wal_cursor.json` | Live replication | Per-ingest-node high-water mark (`last_replicated_wal_id`), out-of-order completions, and **skip receipts**—durable records that a WAL range was handed to gap fill | The dispatcher on every file completion; the replicator on seeding and receipts. `wal_cursor_prev.json` is its safety mirror |
| `gap_ledger.json` | Gap fill | Recovery obligations: each detected gap with its status (pending / in-progress / resolved / unrecoverable) and the files that covered it | The gap-fill worker; `gap_ledger_prev.json` is its safety mirror |
| `historic_manifest.json` | Historic fill | The backfill plan: snapshot work list, cv2 work list, per-file statuses, and the completed flag | The historic planner (full saves); `historic_manifest_prev.json` is its safety mirror |
| `historic_progress.json` | Historic fill | Compact status checkpoints overlaid on the plan, guarded by a sequence number so a stale overlay can never resurrect finished work | The historic fill task (frequent) |
| `live_seed_done.json` | Live replication | Marker: first-start seeding already happened—a restart resumes instead of re-seeding | The replicator, once |
| `wal_cleanup_watermark.json` | WAL cleanup | Per-node "deleted through id N" resume points (only with `--wal-cleanup-enabled`). **Lives at the state ROOT**—agent-level, shared by all destinations | The cleanup sweep |

All files except `wal_cleanup_watermark.json` and `state_layout.json` live
inside a destination's namespace; a recovery recipe that says "delete the
cursor" means **that destination's** cursor—the other destinations' state
is untouched.

## Read before you touch

`edr-inspect` ships in the EDR image and renders all three planes
read-only:

```bash
edr-inspect state /var/lib/edr/state
```

(or `docker exec <container> edr-inspect state`—it picks up the agent's
own `INFLUXDB3_EDR_STATE_LOCATION`). If you are diagnosing, start there;
most questions ("is it stuck?", "what does it think it owes?") are
answered without touching anything.

## The golden rules

1. **Never modify state while the agent is running.** The in-memory copy is
   authoritative; your edit is silently overwritten by the next persist.
   (Deleting files while running is harmless but pointless—see the
   matrix.)
2. **Never hand-edit the JSON at all.** The schemas evolve between releases
   and the fields interlock (a cursor that disagrees with its own skip
   receipts is worse than either alone). Recovery is done by *deleting*
   specific files with the agent stopped—never by editing.
3. **Resets are only safe when the destination absorbs re-sends**—that is,
   `idempotent_writes: true`. With `idempotent_writes: false`, any reset
   that causes re-delivery corrupts the destination (duplicate points at
   new timestamps). Do not reset state in that mode without also clearing
   the affected destination range.
4. **Your `historic_fill` mode decides what a full reset means.** With
   `mode: full` the agent re-plans and re-sends all history (safe,
   expensive). With `mode: none` it seeds at the current leading edge—
   **any backlog the old cursor still owed is silently skipped**. That's
   genuine data loss with no gap recorded, because the record of the debt
   was the thing you deleted.

## Corruption vs. deliberate deletion

The cursor, gap ledger, and historic manifest each write a **previous-good
mirror** alongside the primary (`{key}_prev.json`) on every successful
save. On load, a corrupt or unreadable primary silently falls back to the
mirror—logged as a WARN, no operator action needed, no restart required.
This is different from the deletion matrix below, which is about what
happens when *both* copies are gone (deliberately, or because corruption
hit both).

When **both** the primary and mirror are corrupt or unreadable—"state
loss"—the agent's behavior is governed by `on_state_loss` (a downstream
config knob):

- **`recover`** (the default when `idempotent_writes: true`): rebuild a
  conservative per-node cursor position from the oldest surviving snapshot
  and continue—re-replicates the retained WAL window (bounded, absorbed by
  idempotent writes), rather than defaulting to position 0 and silently
  re-sending the *entire* retained backlog. The historic manifest, on its
  own state loss, rebuilds the plan from current store state the same way
  it always has (loud, double-send absorbed)—it never needed the mirror to
  have a safe fallback.
- **`halt`** (the default when `idempotent_writes: false`, since
  re-sending isn't safe there): refuse to start; an operator decides.
  Restore the state location from backup, or switch to `recover` (requires
  `idempotent_writes: true`).

`edr-inspect state` reports which tier each journal was actually read
from—healthy primary, recovered-from-mirror, or state loss—so this is
visible without touching anything.

## The deletion matrix

What happens when a state item is removed, by agent state:

| Deleted | Agent RUNNING | Agent STOPPED, then restarted |
|---|---|---|
| **Entire state location** | Self-heals piecemeal (files reappear as each plane persists), but you have destroyed receipts mid-flight—don't do this; stop first | The sanctioned **full reset**. Behavior is governed entirely by golden rules 3 and 4: `full` + idempotent gives a safe re-fill; `none` means owed backlog is silently skipped |
| **`wal_cursor.json`** ONLY (`wal_cursor_prev.json` intact) | Harmless: in-memory state is authoritative, delivery continues, the journal re-persists on the next file completion | Recovers transparently **from the mirror** (WARN logged)—resumes at the mirror's position, not a fresh start, no re-transmission storm |
| **`wal_cursor.json`** AND its mirror | Harmless (same as above—in-memory state is authoritative) | **State loss**—see `on_state_loss` above. `recover`: rebuilds a conservative per-node floor and re-sends the retained window (bounded). `halt`: refuses to start |
| **`gap_ledger.json`** | Recreated on the next ledger save | The most forgiving: outstanding obligations are **rebuilt from the cursor's skip receipts** at startup (works even with the mirror ALSO gone, as long as the cursor survives). You lose the resolved/unrecoverable *history* (audit trail), not the obligations |
| **`historic_manifest.json`** ONLY (`historic_manifest_prev.json` intact, fill incomplete) | Recreated only at the next *full plan save*—routine checkpoints write the overlay, not the plan | Recovers transparently **from the mirror** (WARN logged)—resumes the existing plan, no rebuild, no double-send |
| **`historic_manifest.json`** AND its mirror (historic_fill configured, fill incomplete) | Same as above | With a **non-zero cursor**: the agent **refuses to start** (`CursorExists`—historic_fill added late vs. manifest vanished are indistinguishable, and a same-session cursor rebuild doesn't resolve that ambiguity either). Restore a file, do a full reset, or remove `historic_fill`. With a genuinely **fresh cursor**: normal fresh start, plan rebuilt |
| **`historic_progress.json`** | Recreated at the next checkpoint | Statuses revert to the last full plan save—some already-sent files are re-sent (absorbed by idempotence). The sequence guard prevents any stale overlay from marking unfinished work done |
| **`live_seed_done.json`** | No effect until restart | With a cursor present: harmless (a non-zero cursor is itself proof of a previous start). With the cursor *also* gone: a genuine fresh start—see full reset |
| **`wal_cleanup_watermark.json`** | Next sweep reseeds from the oldest surviving snapshot | Same—the sweep re-derives its position; at worst it re-issues deletes for already-deleted files (harmless NotFounds) |

## Sanctioned recovery recipes

**Full reset (start replication over)**

```bash
# 1. Stop the agent.
# 2. Confirm your posture: idempotent_writes true? historic_fill mode?
#    (Golden rules 3 and 4 -- this decides whether the reset is safe.)
# 3. Delete the state location contents.
rm -rf /var/lib/edr/state/*
# 4. Start the agent. With historic_fill: full it re-plans all history.
```

**Force a re-backfill without touching live progress**

```bash
# Stop the agent, then remove the historic plan, ITS MIRROR, and the overlay
# -- leaving historic_manifest_prev.json in place would just recover the old
# plan from the mirror instead of triggering a rebuild:
rm /var/lib/edr/state/historic_manifest.json \
   /var/lib/edr/state/historic_manifest_prev.json \
   /var/lib/edr/state/historic_progress.json
# ALSO delete the cursor (and its mirror) if you want history re-planned
# from scratch -- without it the agent refuses to start (see the matrix
# row). In most cases you actually want the full reset above.
```

**Clear a poisoned gap ledger** (for example, an Unrecoverable entry you
have resolved out of band)

```bash
# Stop the agent, delete the ledger and its mirror:
rm /var/lib/edr/state/gap_ledger.json /var/lib/edr/state/gap_ledger_prev.json
# On restart, genuinely outstanding gaps are re-created from the
# cursor's skip receipts and re-attempted; settled history is gone.
```

**Move the state location**

```bash
# Stop the agent, copy the whole directory (it is just files), point
# --state-location / INFLUXDB3_EDR_STATE_LOCATION at the new place,
# start. Copying while stopped is also the correct backup procedure.
```

## Risk summary

| Action | Risk |
|---|---|
| Full reset, `historic_fill: full`, idempotent | Re-transmission cost only |
| Full reset, `historic_fill: none` | **Silent loss of owed backlog** |
| Any reset with `idempotent_writes: false` | **Destination corruption** |
| Delete cursor primary only (mirror intact) | None—recovers from mirror |
| Delete cursor primary AND mirror (stopped) | `recover`: bounded re-send from the snapshot floor. `halt`: startup refusal |
| Delete manifest primary only (mirror intact, fill incomplete) | None—recovers from mirror |
| Delete manifest primary AND mirror (stopped, fill incomplete, non-zero cursor) | Startup refusal until resolved (`CursorExists`) |
| Delete gap ledger alone | Lost audit history; obligations survive |
| Hand-editing any file | Undefined; never sanctioned |
| Anything while the agent runs | Ineffective (overwritten)—stop first |
