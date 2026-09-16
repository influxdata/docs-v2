---
title: Run the EDR signals demo
description: >
  Run the 4-node signals demo—two edges replicating up through a regional
  relay to a central hub, entirely in Docker—and see EDR recover from a
  dropped link with no data loss.
menu:
  influxdb3_edr:
    name: Demo
weight: 4
---

The signals demo is the fastest way to see EDR's store-and-forward,
multi-tier relay, and at-least-once delivery in one topology: two edges
replicating up through a regional relay to a central hub, entirely in
Docker.

1. [How EDR sources data](#how-edr-sources-data)
2. [The topology](#the-topology)
3. [The three config shapes](#the-three-config-shapes)
4. [Run it](#run-it)
5. [What this demonstrates](#what-this-demonstrates)
6. [Next](#next)

If you haven't set up EDR yet, start with
[Get started with EDR](/influxdb3/edr/get-started/), which walks through a
simpler two-node case on one host.

## How EDR sources data

**Primary source: WAL files.** InfluxDB 3 Enterprise, on the
[upgraded storage engine](/influxdb3/enterprise/reference/internals/storage-engine/)
(the default for new clusters on 3.11+; on 3.10.x enable it with
`--upgrade-pacha-tree`), flushes incoming data to WAL files on the object
store roughly every second—the flush interval, sooner under heavy ingest
as the buffer fills. Snapshots later roll these already-persisted WAL
files up into compacted files. EDR's WAL replicator discovers new files as
they appear and ships them downstream.

**Secondary source: compacted PT files.** The upgraded storage engine
promotes WAL data through compaction levels:

```
Write arrives
  -> WAL file created
  -> Snapshot creates gen0 PT file from WAL data (manifest: .ptsnap)
  -> Compaction promotes gen0 -> cv2 (L1+) progressively
  -> Eventually: retention expiry deletes the data
```

After a WAL file is snapshotted, it becomes eligible for deletion. If EDR
was down or disconnected when that happened, the WAL file may be gone—but
the data still exists in gen0 or a higher compaction level (cv2 files).
Historic fill and gap fill recover data from these files. For more
information, see
[Historic fill and gap fill](/influxdb3/edr/monitor/historic-and-gap-fill/#historic-fill)
and [Size WAL retention](/influxdb3/edr/size-wal-retention/), which
covers sizing the InfluxDB flag that governs this recovery window and the
trade-offs of raising it.

## The topology

Two edges replicate up through a regional relay to a central hub, entirely
in Docker.

<!-- Regenerated as Mermaid from the source's hand-authored inline SVG
(docs/external/start-here.md); the box-and-labeled-edge topology translates
cleanly to a flowchart. -->
{{< diagram >}}
flowchart LR
  Mumbai["Mumbai\nupstream · source\nInfluxDB 3 + EDR"] -- EDR --> Singapore
  Chennai["Chennai\nupstream · source\nInfluxDB 3 + EDR"] -- EDR --> Singapore
  Singapore["Singapore\nregional · relay\nreceives + forwards"] -- EDR --> London["London\ndownstream · sink\nInfluxDB 3 + EDR"]
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

## The three config shapes

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
tree. For a two-node version of these shapes, see
[Get started with EDR](/influxdb3/edr/get-started/).

> [!Note]
> #### One demo-only twist
> Above, each sender's `downstream.address` is the next hop's EDR
> directly—the production shape. The demo instead points each
> `downstream.address` at the dashboard's relay, which transparently
> forwards to the same receiver, only so the dashboard can cut and restore a
> channel. It changes nothing about how EDR works; in production you point
> straight at the next hop.

## Run it

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

## What this demonstrates

- **Store-and-forward** across intermittent links—data written while a hop
  is down is queued and delivered when it returns.
- **Multi-tier relay**—a regional node that both receives and forwards (and
  forwards its own locally-written data too).
- **At-least-once delivery** with automatic catch-up; no data lost on
  disconnection.

The demo runs happily on defaults. Before you size a production deployment,
see [Size WAL retention](/influxdb3/edr/size-wal-retention/) for the
two settings worth setting deliberately.

## Next

- [Manage EDR](/influxdb3/edr/admin/)—install, configure, and run EDR in
  production.
- [Monitor EDR](/influxdb3/edr/monitor/)—health, historic fill, and
  gap fill.
- [Troubleshoot EDR](/influxdb3/edr/admin/troubleshoot/)—when something
  looks wrong.
