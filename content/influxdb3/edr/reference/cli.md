---
title: EDR CLI reference
description: >
  Complete flag and environment variable reference for the influxdb3-edr
  agent and the edr-inspect triage CLI.
menu:
  influxdb3_edr:
    name: CLI
    parent: Reference
weight: 203
---

<!-- ADAPTED_FROM: influxdata/influxdb3_edr@085be6c docs/external/configuration.md, docs/external/operations.md -->

## `influxdb3-edr`

```
influxdb3-edr [OPTIONS]
```

| Flag | Required | Default |
|---|---|---|
| `--config <PATH>` | Yes | — |
| `--data-dir <PATH>` | Yes | — |
| `--token-store <PATH>` | Yes | — |
| `--listen <ADDR:PORT>` | No | `0.0.0.0:9090` |
| `--observability-listen <ADDR:PORT>` | No | `127.0.0.1:9091` |
| `--listener-file-path <PATH>` | No | — |
| `--state-location <URL/PATH>` | No | `edr-state` |
| `--poll-interval-ms <MS>` | No | `1000` |
| `--object-store-type <TYPE>` | No | — |
| `--wal-cleanup-enabled` | No | `false` |
| `--wal-cleanup-interval-secs <S>` | No | `300` |
| `--wal-cleanup-snapshot-margin <N>` | No | `100` |
| `--wal-cleanup-max-destination-hold <D>` | No | unbounded |
| `--benchmark <N>` | No | — |

- **`--config <PATH>`**—path to the replication config YAML file.
- **`--data-dir <PATH>`**—InfluxDB data directory (shared object store).
- **`--token-store <PATH>`**—path to the token store directory.
- **`--listen <ADDR:PORT>`**—network listener for the replication
  protocol (`/edr/v1/connect|data|report`) and `/health`. Must be
  reachable by upstreams. `0.0.0.0:0` for an OS-assigned port. Env:
  `INFLUXDB3_EDR_LISTEN`.
- **`--observability-listen <ADDR:PORT>`**—**loopback by default**: the
  UI, `/metrics`, and the JSON observability API. Set to
  `0.0.0.0:<PORT>` (or a specific interface) to expose for off-host
  Prometheus or a remote UI. Env: `INFLUXDB3_EDR_OBSERVABILITY_LISTEN`.
- **`--listener-file-path <PATH>`**—file to write the actual network
  listener address to (for testing with port 0).
- **`--state-location <URL/PATH>`**—state persistence location,
  **independent of `--object-store-type`**. A path or `file://` URL is
  local; `s3://bucket/prefix`, `gs://...`, `az://...` are object
  storage (credentials and region from the environment). Holds
  `wal_cursor.json`, `gap_ledger.json`, `historic_manifest.json`. Env:
  `INFLUXDB3_EDR_STATE_LOCATION`.
- **`--poll-interval-ms <MS>`**—object store polling interval in
  milliseconds.
- **`--object-store-type <TYPE>`**—override the object store type
  (`s3`, `google`, `azure`). Uses environment variables for
  credentials.
- **`--wal-cleanup-enabled`**—**opt-in, temporary stop-gap.** Enables
  agent-side deletion of already-replicated WAL files from the source
  object store, so they don't build up past the replicated journal.
  Off by default (deleting source WAL is destructive). See
  [Size WAL retention](/influxdb3/edr/size-wal-retention/). Env:
  `INFLUXDB3_EDR_WAL_CLEANUP_ENABLED`.
- **`--wal-cleanup-interval-secs <S>`**—how often the cleanup sweep
  runs (only when enabled). Env:
  `INFLUXDB3_EDR_WAL_CLEANUP_INTERVAL_SECS`.
- **`--wal-cleanup-snapshot-margin <N>`**—WAL files to keep below the
  last snapshotted WAL id, the safety margin behind the snapshot
  boundary (only when enabled). Env:
  `INFLUXDB3_EDR_WAL_CLEANUP_SNAPSHOT_MARGIN`.
- **`--wal-cleanup-max-destination-hold <D>`**—fan-out only: a
  destination whose cursor hasn't advanced for this long (`"7d"`,
  `"12h"`, `"30m"`) stops holding the cleanup floor; it recovers the
  evicted range through gap fill when it returns (over-replication, never
  loss). Unset means a down destination pins WAL indefinitely. Env:
  `INFLUXDB3_EDR_WAL_CLEANUP_MAX_DESTINATION_HOLD`.
- **`--benchmark <N>`**—run a bandwidth benchmark against up to N WAL
  files and exit.

State and index files live wherever you point them—keep them on durable
local storage. The state file holds the WAL cursor (what has been
replicated); losing it forces re-replication from the snapshot boundary,
which is safe but wasteful. The index file is an append-only
change-tracking log.

### Environment variables

| Variable | Purpose |
|-----|-----|
| `EDR_WRITE_ENDPOINT` | Local InfluxDB write endpoint for the destination facet (default: `http://localhost:8181`). |
| `RUST_LOG` | Log level filter (default: `info`). Example: `info,influxdb3_catalog=warn` |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_DEFAULT_REGION` | S3 credentials (with `--object-store-type s3`). |
| `INFLUXDB3_BUCKET` | S3, GCS, or Azure bucket name. |
| `INFLUXDB3_EDR_WAL_CLEANUP_ENABLED` | Enable agent-side WAL cleanup (`--wal-cleanup-enabled`). |
| `INFLUXDB3_EDR_WAL_CLEANUP_INTERVAL_SECS` | WAL cleanup sweep interval (`--wal-cleanup-interval-secs`). |
| `INFLUXDB3_EDR_WAL_CLEANUP_SNAPSHOT_MARGIN` | WAL files kept below the snapshot boundary (`--wal-cleanup-snapshot-margin`). |
| `INFLUXDB3_EDR_WAL_CLEANUP_MAX_DESTINATION_HOLD` | Fan-out cleanup-floor hold bound (`--wal-cleanup-max-destination-hold`). |

## `edr-inspect`

`edr-inspect` is a **read-only** triage CLI shipped alongside the agent.

| Command | Reads | Output |
|---|---|---|
| `edr-inspect state <STATE_LOCATION>` | the state journals only (offline—no running agent) | live replication (WAL cursor), live gap fill (gap ledger), historic replication (manifest progress) |
| `edr-inspect metrics [addr]` | the live `/metrics` (observability listener) | a scrolling table watch; `--once` for one detailed block |
| `edr-inspect topology [addr]` | `/edr/v1/topology` | a one-shot upstream and downstream ASCII diagram with per-edge health |

`state` works even against a stopped or wedged agent (it reads the journals
directly); it also accepts a cloud `state-location` (`s3://`, `gs://`, or
`az://`, credentials from the environment). `metrics` and `topology`
default to the loopback observability address
(`$INFLUXDB3_EDR_OBSERVABILITY_LISTEN`). `edr-inspect` needs no
`--data-dir`—it reads only the state journals and the agent's `/metrics`,
never the object store.

For usage in Docker through `docker exec`, see
[Run EDR in Docker](/influxdb3/edr/install/docker/#triage-with-edr-inspect-through-docker-exec).
