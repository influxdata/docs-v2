---
title: Run the Processing Engine in a cluster
description: >
  Configure, start, and troubleshoot Processing Engine plugins in a multi-node
  InfluxDB 3 Enterprise cluster: how process nodes follow every ingester's
  write-ahead log, how `--node-spec` selects owning schedulers, how runs
  place across nodes, and how to recognize common misconfiguration errors.
menu:
  influxdb3_enterprise:
    name: Run the Processing Engine in a cluster
    parent: Administer InfluxDB
weight: 102
related:
  - /influxdb3/enterprise/admin/clustering/
  - /influxdb3/enterprise/plugins/
  - /influxdb3/enterprise/reference/processing-engine/
  - /influxdb3/enterprise/reference/cli/influxdb3/create/trigger/
  - /influxdb3/enterprise/reference/cli/influxdb3/serve/
influxdb3/enterprise/tags: [processing engine, plugins, clustering, triggers, troubleshooting]
---

This guide covers how the Processing Engine behaves in a multi-node {{% product-name %}} cluster and how to troubleshoot common misconfigurations.

For single-node deployments, defaults work as documented in [Set up the Processing Engine](/influxdb3/enterprise/plugins/#set-up-the-processing-engine).
The cluster-specific behavior described here applies when you run more than one `influxdb3 serve` process against a shared catalog and object store.

- [How trigger execution works in a cluster](#how-trigger-execution-works-in-a-cluster)
- [Start the cluster](#start-the-cluster)
- [Worked example: 5-node reference architecture](#worked-example-5-node-reference-architecture)
- [Troubleshoot misconfigurations](#troubleshoot-misconfigurations)

## How trigger execution works in a cluster

A **process node** is any node with [`--plugin-dir`](/influxdb3/enterprise/reference/config-options/#plugin-dir) configured.
Setting `--plugin-dir` implicitly adds `process` mode, so you rarely need to set `--mode=process` explicitly.

### Every process node follows every ingester's WAL

Each process node follows the write-ahead log (WAL) of every ingest node in the cluster through object storage.
A process node starts following from the moment it comes up: it doesn't replay WAL history that was written before it started.
This behavior is the same on the Parquet engine and the upgraded storage engine.

### `--node-spec` selects owning schedulers, not execution nodes

[`--node-spec`](/influxdb3/enterprise/reference/cli/influxdb3/create/trigger/#options) selects which process nodes' **schedulers own** the trigger, not which node executes each run:

- `all` (default): Every process node owns the trigger and schedules it independently.
- `nodes:<node-id>[,<node-id>...]`: Only the listed nodes' schedulers own the trigger.

Because every owning scheduler acts independently, `--node-spec all` duplicates work in a cluster with more than one process node:

- A **schedule trigger** (`every:` or `cron:`) fires once per owning process node on every tick.
- A **WAL trigger** (`table:` or `all_tables`) can fire once per owning process node for every write, since each process node follows every ingester's WAL.
- A **request trigger** (`request:`) exposes the `/api/v3/engine/<trigger_name>` route on every owning process node.

To run a trigger from exactly one node, pin it with `--node-spec nodes:<node-id>`.

### Runs place across process nodes with round robin

An owning scheduler doesn't always execute a run itself.
It spreads runs across itself and the other `Running` process nodes that advertise an internode address:

- Set `--internode-bind-addr` on a process node to have it listen for internode RPCs; {{% product-name %}} derives the address that peers dial from that listener automatically.
- If the node's hostname doesn't resolve for its peers, set [`--conn-info`](/influxdb3/enterprise/reference/config-options/#conn-info) (alias `--internode-conn-addr`) to the address explicitly.

A process node that doesn't advertise an internode address is never selected as a placement target for another node's scheduler, though it's still eligible to run the triggers its own scheduler owns.

A candidate node that doesn't have the trigger's plugin file in its own `--plugin-dir` declines the run, and the scheduler tries the next candidate.
`gh:`-prefixed plugins are fetched over HTTP the first time they run, so a node never declines a `gh:` plugin for a missing file.
A node that declines is skipped for [`--trigger-work-silence-timeout`](/influxdb3/enterprise/reference/config-options/#trigger-work-silence-timeout) (default `60s`) before the scheduler tries it again.
If every candidate declines, the scheduler still runs the trigger on the node whose scheduler owns it, so the real error, for example a missing plugin file, surfaces in `system.processing_engine_logs` there.

### `--mode` doesn't gate trigger execution; `--plugin-dir` does

What determines whether a node can execute a trigger is `--plugin-dir`, not `--mode`.
Pinning a trigger to a node without `--plugin-dir` configured succeeds at create time, but that node logs an error when the trigger starts, and its own worker always declines the run, since it never has the plugin file.
The scheduler then places the work on another reachable process node instead.
A schedule trigger that calls `influxdb3_local.query()` still needs a node with `query` mode to read locally; without it, the call HTTP-hops to a query node.

| Trigger type   | Pin to                                                             | Why                                                                                              |
|----------------|--------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| WAL (`table:`) | A single process node                                              | Every process node follows every ingester's WAL, so pinning to one node keeps the trigger from running once per process node for each write. |
| Schedule (`every:` or `cron:`) | A process node with `query` mode (typically `process,query`) | The plugin reads via `influxdb3_local.query()` locally; results write back to an ingester via HTTP. |
| Request (`request:`) | A process node with `query` mode (the host-exposed port)     | The HTTP route exists only on pinned nodes; unpinned nodes return `404 not found`.               |

### Retry and recovery options

Three options tune retry and recovery behavior; set them the same way on every process node:

- [`--trigger-retry-max-attempts`](/influxdb3/enterprise/reference/config-options/#trigger-retry-max-attempts) (default `5`): Maximum attempts for a failed invocation before it stops retrying.
- [`--trigger-work-silence-timeout`](/influxdb3/enterprise/reference/config-options/#trigger-work-silence-timeout) (default `60s`): How long a scheduler waits on a candidate node that's gone quiet, including a node that declined, before trying another one.
- [`--processing-engine-restart-state-snapshot-interval`](/influxdb3/enterprise/reference/config-options/#processing-engine-restart-state-snapshot-interval) (default `1s`): How often a process node checkpoints its scheduler state.

### Scheduler state persists across restarts

Each process node saves its scheduler state to `<cluster-id>/<node-id>/processing_engine/restart-state.postcard` in object storage, on the `--processing-engine-restart-state-snapshot-interval` and again at shutdown.

After a restart, the node:

- Replays every schedule tick that came due while it was down.
- Resumes following each ingester's WAL from where it stopped.
- Keeps pending retries.

A trigger that was disabled or deleted while the node was down stays that way; the replay doesn't revive it.
Replay is at-least-once: a run that completed just before a hard restart, or a run that was in flight during one, can execute again.
Write your plugins so a repeated run is safe, for example by making writes idempotent or deduplicating on a natural key.

### Request triggers aren't persisted, and their queue is bounded

A request trigger's in-flight invocation is never written to the restart-state snapshot.
If a node restarts mid-request, the request itself doesn't replay; the client sees the connection drop and can retry.

Each trigger holds up to 60 pending invocations in its queue, regardless of trigger type.
Once a request trigger's queue is full, `/api/v3/engine/<trigger_name>` returns `503 Service Unavailable` with body `{"error": "trigger queue is full"}` instead of waiting for a free slot.

## Start the cluster

Each cluster node runs `influxdb3 serve` with a unique `--node-id`, the same `--cluster-id`, and a shared object store and catalog.
Configure `--plugin-dir` on every process node, and set `--internode-bind-addr` on each one so their schedulers can place runs on each other.

```bash { placeholders="CLUSTER_ID|DATA_DIR|PLUGINS_DIR|NODE_ID" }
# Ingest node
influxdb3 serve \
  --cluster-id CLUSTER_ID \
  --node-id NODE_ID \
  --mode ingest \
  --object-store file \
  --data-dir DATA_DIR

# Query node (host-exposed)
influxdb3 serve \
  --cluster-id CLUSTER_ID \
  --node-id NODE_ID \
  --mode query \
  --object-store file \
  --data-dir DATA_DIR

# Compact node (one per cluster)
influxdb3 serve \
  --cluster-id CLUSTER_ID \
  --node-id NODE_ID \
  --mode compact \
  --object-store file \
  --data-dir DATA_DIR

# Process,query node (hosts schedule plugins)
influxdb3 serve \
  --cluster-id CLUSTER_ID \
  --node-id NODE_ID \
  --mode process,query \
  --object-store file \
  --data-dir DATA_DIR \
  --plugin-dir PLUGINS_DIR \
  --internode-bind-addr 0.0.0.0:8083
```

Only nodes that run Processing Engine plugins need `--plugin-dir`.
Unlike earlier releases, an ingest-only or compact-only node doesn't need `--plugin-dir` just to satisfy trigger validation: without `process` mode, schedulers never consider it as a placement target, and it doesn't validate registered triggers at startup.

If you run more than one process node, give each one `--plugin-dir` (pointing at the same plugin files, for example a shared mount) and `--internode-bind-addr`, so schedulers can round-robin runs across all of them.

After all nodes are up, register triggers from any node and pin them with `--node-spec`:

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME|NODE_ID" }
# Schedule trigger pinned to the process,query node
influxdb3 create trigger \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --path schedule_rollup.py \
  --trigger-spec "every:5s" \
  --node-spec "nodes:NODE_ID" \
  hourly_rollup
```

## Worked example: 5-node reference architecture

The [`influxdata/influxdb3-ref-network-telemetry`](https://github.com/influxdata/influxdb3-ref-network-telemetry) repo provides a complete 5-node {{% product-name %}} cluster you can run locally with `docker compose`:

- 2 ingest nodes (`--mode=ingest`)
- 1 query node (`--mode=query`, host-exposed on port 8181)
- 1 compact node (`--mode=compact`)
- 1 process,query node (`--mode=process,query`, hosts schedule plugins)

The repo demonstrates:

- Pinning schedule triggers to the process node and request triggers to the query node with `--node-spec nodes:<id>`.
- Cross-node write-back from schedule plugins via HTTP, see [`plugins/_writeback.py`](https://github.com/influxdata/influxdb3-ref-network-telemetry/blob/main/plugins/_writeback.py).
- Mounting the same plugin directory on the process node.

This architecture has only one process node, so `--node-spec all` and `--node-spec nodes:<the-process-node-id>` behave the same.
Use this repo as a template, and add `--internode-bind-addr` on each process node if you extend it to run more than one.

## Troubleshoot misconfigurations

### `invalid node name (<id>)` when creating a trigger

The cluster validates `--node-spec nodes:<id>` against current cluster membership at create time.
A typo or unknown node ID returns an error: `invalid node name (<id>)`.

To fix:

1. List current cluster members and their node IDs:

   ```bash { placeholders="AUTH_TOKEN" }
   influxdb3 show nodes --token AUTH_TOKEN
   ```

   The `mode` column shows the node's runtime modes; `process` is included automatically on any node that has `--plugin-dir` configured.

2. Reissue `influxdb3 create trigger` with the correct `--node-spec`.

### `HTTP 404 {error: "not found"}` when calling a request trigger

The `/api/v3/engine/<trigger_name>` route exists only on the node(s) whose schedulers own the trigger.
There is no internal cross-node routing for request triggers.

To fix:

- Verify the node-spec on the trigger:

  ```bash { placeholders="AUTH_TOKEN|DATABASE_NAME" }
  influxdb3 query \
    --database DATABASE_NAME \
    --token AUTH_TOKEN \
    "SELECT trigger_name, trigger_specification FROM system.processing_engine_triggers"
  ```

- Either pin the trigger to the node receiving the HTTP request (typically a `query`-mode node), or route the request to a node the trigger is pinned to.

### A WAL trigger runs more than once per write

With the default `--node-spec all`, every process node owns the trigger and follows every ingester's WAL, so a WAL trigger can fire once per process node for the same write.

To fix:

- Pin the trigger to a single process node with `--node-spec nodes:<node-id>` so only one scheduler owns it.
- If you can't guarantee single execution (for example, during a rolling restart), write the plugin so a repeated run is safe.

### Request trigger returns `503 {error: "trigger queue is full"}`

Each trigger holds up to 60 pending invocations.
Once the queue is full, the HTTP route returns `503` immediately instead of waiting for a free slot.

To fix:

- Check `system.processing_engine_logs` on the node the trigger runs on for slow or failing invocations.
- Reduce the plugin's per-invocation work, or send requests at a lower rate.
- If invocations are failing and retrying, check [`--trigger-retry-max-attempts`](/influxdb3/enterprise/reference/config-options/#trigger-retry-max-attempts) and [`--trigger-work-silence-timeout`](/influxdb3/enterprise/reference/config-options/#trigger-work-silence-timeout).

### Schedule trigger logs `ModuleNotFoundError` per tick

The trigger fired on the node that executed it, but the plugin imports a module that's not in that node's per-node Python virtual environment.

To fix:

- Install the missing package on the node:

  ```bash { placeholders="PACKAGE_NAME" }
  influxdb3 install package PACKAGE_NAME
  ```

- Or pin the trigger to a node that has the required module already installed.

### A node logs an error at trigger start and never runs the trigger

If a trigger's `--node-spec` includes a node without `--plugin-dir` configured, that node logs an error when the trigger starts, and its own worker always declines the run.
This isn't fatal: the scheduler places the work on another reachable process node instead, if one is available.

To fix:

- Pin the trigger only to nodes that have `--plugin-dir` configured.
- If a plugin file referenced by a registered trigger is missing from a node's `--plugin-dir`, add the file (or mount the same plugin directory on every process node).
- If a plugin was deleted but the trigger still references it, drop the orphaned trigger:

  ```bash { placeholders="AUTH_TOKEN|DATABASE_NAME|TRIGGER_NAME" }
  influxdb3 delete trigger \
    --database DATABASE_NAME \
    --token AUTH_TOKEN \
    --force TRIGGER_NAME
  ```

### Plugin operations fail in administrative tools

If an administrative tool reports a generic plugin error against your cluster, check whether any node satisfies the request:

1. Confirm at least one process node has `--plugin-dir` configured and runs the plugin's required mode, typically `process,query` for schedule plugins and `query` for request plugins.
2. Confirm the trigger's `--node-spec` includes a running, healthy node.
3. Inspect the `system.processing_engine_logs` table on the pinned node for execution errors:

   ```bash { placeholders="AUTH_TOKEN|DATABASE_NAME" }
   influxdb3 query \
     --database DATABASE_NAME \
     --token AUTH_TOKEN \
     "SELECT event_time, trigger_name, log_level, log_text \
      FROM system.processing_engine_logs \
      ORDER BY event_time DESC LIMIT 20"
   ```
