---
title: Get started with EDR
description: >
  Learn EDR's core concepts—the push model, at-least-once delivery, WAL vs.
  compacted-file sourcing, and topology shapes—and then run the 4-node
  signals demo.
menu:
  influxdb3_edr:
    name: Get started
weight: 3
---

The fastest way to understand {{% product-name %}} is the **signals demo**:
two edges replicating up through a regional relay to a central hub, entirely
in Docker. This page covers the concepts EDR is built on and then walks
through what the demo runs.

## Architecture: external sidecar agent

EDR runs as a separate process (`influxdb3-edr`) alongside InfluxDB 3
Enterprise, reading the shared object store directly. The InfluxDB binary
itself is unmodified.

<!-- Regenerated as Mermaid from the source's hand-authored inline SVG
(docs/external/overview.md); the two-cluster box-and-arrow shape translates
cleanly to a flowchart with subgraphs. —>
{{< diagram >}}
flowchart LR
  subgraph SRC["Source Node"]
    direction LR
    S1["InfluxDB 3 Enterprise"] — "shared object store" —> S2["EDR Agent"]
  end
  subgraph DST["Destination Node"]
    direction LR
    D1["EDR Agent"] —> D2["InfluxDB 3"]
  end
  S2 — "HTTP POST (EDRP)" —> D1
{{< /diagram >}}

Components:

- **EDR Agent** (`influxdb3-edr`)—the replication process. One per node. A
  single agent can be a source (has `downstream:`/`downstreams:` config), a
  destination (has `upstreams:`), or both. A source can fan out to multiple
  destinations at once—for example, its regional hub and a central
  archive—each with independent scope, history, and health. See
  [Replicate to multiple destinations](/influxdb3/edr/admin/multi-destination-fan-out/).
- **Token Store**—a directory of secret files for authentication.
- **Config File**—YAML defining topology, scope, and behavior.
- **Object Store**—the InfluxDB data directory (local filesystem, or
  S3/GCS/Azure via `--object-store-type`).

## How EDR sources data

**Primary source: WAL files.** InfluxDB 3 Enterprise (PachaTree—the default
engine for new clusters on 3.11+; on 3.10.x enable it with
`--use-pacha-tree`) flushes incoming data to WAL files on the object store
roughly every second (the flush interval; sooner under heavy ingest as the
buffer fills). Snapshots later roll these already-persisted WAL files up
into compacted files. EDR's WAL replicator discovers new files as they
appear and ships them downstream.

**Secondary source: compacted PT files.** PachaTree promotes WAL data
through compaction levels:

```
Write arrives
  -> WAL file created
  -> Snapshot creates gen0 PT file from WAL data (manifest: .ptsnap)
  -> Compaction promotes gen0 -> cv2 (L1+) progressively
  -> Eventually: retention expiry deletes the data
```

After a WAL file is snapshotted, it becomes eligible for deletion. If EDR was
down or disconnected when that happened, the WAL file may be gone—but the
data still exists in gen0 or higher level compaction files (cv2 files).
Historic fill and gap fill recover data from these files. For more
information, see [Historic fill and gap fill](/influxdb3/edr/admin/monitor/#historic-fill)
and [Size WAL retention](/influxdb3/edr/admin/size-wal-retention/).

**WAL retention is the critical knob.** The InfluxDB flag
`--wal-snapshots-to-keep` (spelled `--pt-wal-snapshots-to-keep` on InfluxDB
3.10.x) controls how many WAL snapshots are retained before deletion:

```
retention_window ~= snapshots_to_keep x snapshot_interval (~10-20s)
```

| `--wal-snapshots-to-keep` | Approximate retention window |
|--------------|---------------|
| 5 *(InfluxDB default)* | ~1-2 minutes |
| 100 | ~17-33 minutes |
| 1,000 | ~3-6 hours |
| 10,000 | ~28-56 hours |
| 100,000 | ~12-23 days |

The InfluxDB default (5) is only about one to two minutes of retention—with
it, any agent restart or network interruption longer than that sends EDR to
compacted-file recovery. To be clear: EDR is **correct** either way—delivery
is at-least-once regardless, and data that outlives WAL retention is
recovered from the compacted files. But EDR is *better* with sized
retention: WAL replication is precise and cheap, recovery from cv2 is slower
and replicates more bytes than strictly necessary. Size retention to exceed
your maximum expected outage plus margin, and WAL replication stays the
steady state with compacted-file recovery as the safety net it is meant to
be. WAL files are compact (about 3x smaller than gen0), so generous
retention is cheap: a source ingesting 1 MB/s needs about 86 GB for 24 hours
of WAL retention.

The trade-off: generous retention also means WAL files linger long after EDR
has replicated them. If that buildup becomes a storage concern, EDR can
prune the already-replicated tail itself with the opt-in
`--wal-cleanup-enabled`—a temporary stop-gap that safely deletes only WAL
EDR no longer needs. For more information, see
[Size WAL retention](/influxdb3/edr/admin/size-wal-retention/).

## The 4-node signals demo

Two edges replicate up through a regional relay to a central hub, entirely
in Docker.

<!-- Regenerated as Mermaid from the source's hand-authored inline SVG
(docs/external/start-here.md); the box-and-labeled-edge topology translates
cleanly to a flowchart. —>
{{< diagram >}}
flowchart LR
  Mumbai["Mumbai\nupstream · source\nInfluxDB 3 + EDR"] — EDR —> Singapore
  Chennai["Chennai\nupstream · source\nInfluxDB 3 + EDR"] — EDR —> Singapore
  Singapore["Singapore\nregional · relay\nreceives + forwards"] — EDR —> London["London\ndownstream · sink\nInfluxDB 3 + EDR"]
{{< /diagram >}}

Four nodes, each a pair of containers—an InfluxDB 3 Enterprise instance and
an EDR agent beside it. The three roles are the *only* three an EDR agent
ever takes:

| Node | Role | What its config has |
|---|---|---|
| `mumbai`, `chennai` | **upstream-only**—a pure source | a `downstream:` block (where it sends) |
| `singapore` | **regional relay**—receives *and* forwards | both `upstreams:` and `downstream:` |
| `london` | **downstream-only**—a pure sink | an `upstreams:` list (who sends to it) |

A fifth container—the **dashboard**—generates the test signals, queries
every tier, serves the UI, and runs the channel relay. It is demo
scaffolding, not part of EDR.

### The three config shapes

These are the heart of EDR, and the *only* three. The `auth_token` on each
sender's `downstream` matches an `upstreams` entry on the receiver—that
pairing is how a receiver knows who connected.

**Edge (upstream-only)**—`mumbai` (Chennai is identical with its own
name/token):

```yaml
name: mumbai
downstream:
  name: singapore
  address: http://singapore-edr:9090    # the next hop's EDR --listen
  auth_token: mumbai-auth               # token-store key
  historic_fill: { mode: none }         # live-only for the demo
```

**Regional relay**—`singapore` receives from both edges, forwards to the
hub:

```yaml
name: singapore
upstreams:
  - { name: mumbai,  auth_token: mumbai-auth,  write_token: singapore-token }
  - { name: chennai, auth_token: chennai-auth, write_token: singapore-token }
downstream:
  name: london
  address: http://london-edr:9090
  auth_token: singapore-auth
  historic_fill: { mode: none }
```

**Hub (downstream-only)**—`london`, the sink:

```yaml
name: london
upstreams:
  - { name: singapore, auth_token: singapore-auth, write_token: london-token }
```

Every EDR deployment, however large, is just these shapes composed into a
tree.

> [!Note]
> #### One demo-only twist
> Above, each sender's `downstream.address` is the next hop's EDR
> directly—the production shape. The demo instead points each
> `downstream.address` at the dashboard's relay, which transparently
> forwards to the same receiver, only so the dashboard can cut and restore a
> channel. It changes nothing about how EDR works; in production you point
> straight at the next hop.

### Run it

The demo is a self-contained bundle (`demo/signals-demo/`). Unzip it and
follow its `README.md`—that's the canonical guide, covering prerequisites,
licensing (trial or file-based), driving the dashboard (start/stop signals,
cut/restore channels), the `edr-inspect` triage tooling, ports, and layout.
In brief:

```bash
cp .env.example .env        # set the Enterprise image + the four license emails
docker compose up --build   # then open http://localhost:8090
```

You'll watch three signals propagate across the tiers—and, by cutting a
channel, watch a downstream node freeze and then catch up with no loss when
the link is restored.

### What this demonstrates

- **Store-and-forward** across intermittent links—data written while a hop
  is down is queued and delivered when it returns.
- **Multi-tier relay**—a regional node that both receives and forwards (and
  forwards its own locally-written data too).
- **At-least-once delivery** with automatic catch-up; no data lost on
  disconnection.

### Before production: two settings worth sizing

The demo runs happily on defaults; a production deployment should set two
things deliberately (EDR is correct without them—delivery is at-least-once
regardless—but it is *better* with them):

- **WAL retention on each source server.** The InfluxDB default
  (`--wal-snapshots-to-keep 5`; spelled `--pt-wal-snapshots-to-keep` on
  3.10.x) is only ~1-2 minutes—any longer interruption sends EDR to the
  slower compacted-file recovery path. Size it to your longest expected
  outage plus margin. See
  [Size WAL retention](/influxdb3/edr/admin/size-wal-retention/).
- **EDR's WAL cleanup** (`--wal-cleanup-enabled`, off by default)—bounds
  the storage cost of that raised retention by pruning the
  already-replicated tail. See
  [Size WAL retention](/influxdb3/edr/admin/size-wal-retention/).

## Next

- [Manage EDR](/influxdb3/edr/admin/)—install, configure, and run EDR in
  production.
- [Monitor EDR](/influxdb3/edr/admin/monitor/)—health, historic fill, and
  gap fill.
- [Troubleshoot EDR](/influxdb3/edr/admin/troubleshoot/)—when something
  looks wrong.
