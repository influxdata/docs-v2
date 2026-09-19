---
title: Replicate to multiple destinations
description: >
  Configure one EDR source to replicate to several destinations at once,
  each with independent scope, schedule, and health.
menu:
  influxdb3_edr:
    name: Multi-destination fan-out
    parent: Replicate
weight: 3
---

<!-- ADAPTED_FROM: influxdata/influxdb3_edr@085be6c docs/external/configuration.md -->

One agent can replicate to several destinations at once—an edge feeding its
regional hub and a central archive, or dual centers for redundancy.
`downstreams:` is a list of the exact same destination shape as `downstream:`
(singular); `downstream:` remains valid indefinitely and is exactly a
one-entry list.

The following generic example fans one source out to a regional relay and a
separate long-term archive:

```yaml
name: edge-01

downstreams:
  - name: regional-relay          # identity -- also the journal namespace key
    address: http://relay:9090
    auth_token: relay-token
    historic_fill: { mode: none }

  - name: archive
    address: http://archive:9090
    auth_token: archive-token
    idempotent_writes: true
    historic_fill: { mode: full }   # per-destination: the archive takes
                                     # full history; the relay is live-only
```

Scope (selective fan-out), encoding, ordering guarantees, retry and
comms settings, schedules, priorities, historic intent, and protocol
negotiation are all independent per destination. There are no shared
destination defaults—each entry is explicit. One shared WAL discovery
feeds every destination, so discovery cost does not grow with
destination count.

## Validation rules

- Destination `name`s must be unique—they key the journals, metrics, and UI
  (and their sanitized forms must not collide).
- Two destinations must not resolve to the same endpoint (normalized
  host:port), irrespective of `auth_token` or `name`—one endpoint fed by
  two pipelines is a double-send.
- `historic_fill` remains required per destination.

## State

Each destination's journals live in their own namespace,
`{state-location}/{destination}/...`—fully independent cursors and
recovery. See [State and recovery](/influxdb3/edr/reference/state-and-recovery/).

## Live add and remove (config reload, no restart)

- **Adding** a destination spawns its pipeline immediately: it seeds at the
  leading edge or runs its declared historic fill, while existing
  destinations keep flowing undisturbed.
- **Removing** a destination stops its pipeline and deletes its journal
  namespace—config is the source of truth for state. Re-adding the same
  name later starts fresh (with idempotent writes the cost is
  over-replication, never corruption).
- **Renaming is a remove and an add** (the name is the journal
  identity). A single reload that removes one name and adds a
  brand-new one is rejected as a probable typo—apply the remove and
  the add as two separate reloads if intentional.
- To **pause** a destination without losing its cursor, don't remove it—
  give it a `silent` bandwidth schedule. A paused destination keeps
  holding the WAL-cleanup floor. See
  [Size WAL retention](/influxdb3/edr/size-wal-retention/).
