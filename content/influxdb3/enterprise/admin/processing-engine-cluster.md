---
title: Run the Processing Engine in a cluster
description: >
  Configure, start, and troubleshoot Processing Engine plugins in a multi-node
  InfluxDB 3 Enterprise cluster — including how triggers fan out across nodes,
  how to pin triggers, and how to recognize common misconfiguration errors.
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

Three independent factors determine whether a Processing Engine trigger runs on a given node:

1. The node has [`--plugin-dir`](/influxdb3/enterprise/reference/config-options/#plugin-dir) configured.
2. The trigger's [`--node-spec`](/influxdb3/enterprise/reference/cli/influxdb3/create/trigger/#options) includes the node — by default, `all` (every node with `--plugin-dir`).
3. The trigger's plugin imports modules that are available in that node's per-node Python virtual environment.

`--mode` controls which APIs the node serves (writes, queries, compaction).
**`--mode` does not gate trigger execution.**
A trigger pinned to a `compact`-only node still fires on that node — it just fails per tick if the plugin needs APIs the node doesn't serve.

| Trigger type   | Pin to                                                             | Why                                                                                              |
|----------------|--------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| WAL (`table:`) | An ingest-capable node                                             | Each ingester owns its own WAL; pinning to one ingester sees only that node's writes.            |
| Schedule (`every:` or `cron:`) | A node with `process,query` mode                   | The plugin reads via `influxdb3_local.query()` locally; results write back to an ingester via HTTP. |
| Request (`request:`) | A node with `query` mode (the host-exposed port)             | The HTTP route exists only on pinned nodes; unpinned nodes return `404 not found`.               |

## Start the cluster

Each cluster node runs `influxdb3 serve` with a unique `--node-id`, the same `--cluster-id`, and a shared object store and catalog.
Configure `--plugin-dir` on **every** node, even nodes that don't execute plugins — see [Configure `--plugin-dir` on every cluster node](/influxdb3/enterprise/admin/clustering/#configure-process-capable-nodes).

```bash { placeholders="CLUSTER_ID|DATA_DIR|PLUGINS_DIR|NODE_ID" }
# Ingest node
influxdb3 serve \
  --cluster-id CLUSTER_ID \
  --node-id NODE_ID \
  --mode ingest \
  --object-store file \
  --data-dir DATA_DIR \
  --plugin-dir PLUGINS_DIR

# Query node (host-exposed)
influxdb3 serve \
  --cluster-id CLUSTER_ID \
  --node-id NODE_ID \
  --mode query \
  --object-store file \
  --data-dir DATA_DIR \
  --plugin-dir PLUGINS_DIR

# Compact node (one per cluster)
influxdb3 serve \
  --cluster-id CLUSTER_ID \
  --node-id NODE_ID \
  --mode compact \
  --object-store file \
  --data-dir DATA_DIR \
  --plugin-dir PLUGINS_DIR

# Process,query node (hosts schedule plugins)
influxdb3 serve \
  --cluster-id CLUSTER_ID \
  --node-id NODE_ID \
  --mode process,query \
  --object-store file \
  --data-dir DATA_DIR \
  --plugin-dir PLUGINS_DIR
```

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
- Cross-node write-back from schedule plugins via HTTP — see [`plugins/_writeback.py`](https://github.com/influxdata/influxdb3-ref-network-telemetry/blob/main/plugins/_writeback.py).
- Mounting the same plugin directory on every node (including ingest and compact) for catalog validation at startup.

Use this repo as a template when designing your own cluster.

## Troubleshoot misconfigurations

### `invalid node name (<id>)` when creating a trigger

The cluster validates `--node-spec nodes:<id>` against current cluster membership at create time.
A typo or unknown node ID returns `HTTP 500: invalid node name (<id>)`.

To fix:

1. List current cluster members and their node IDs:

   ```bash { placeholders="AUTH_TOKEN" }
   influxdb3 show nodes --token AUTH_TOKEN
   ```

   The `mode` column shows the node's runtime modes — `process` is included automatically on any node that has `--plugin-dir` configured.

2. Reissue `influxdb3 create trigger` with the correct `--node-spec`.

### `HTTP 404 {error: "not found"}` when calling a request trigger

The `/api/v3/engine/<trigger_name>` route exists only on the node(s) the trigger is pinned to.
There is no internal cross-node routing for request triggers.

To fix:

- Verify the node-spec on the trigger:

  ```bash { placeholders="AUTH_TOKEN|DATABASE_NAME" }
  influxdb3 query \
    --database DATABASE_NAME \
    --token AUTH_TOKEN \
    "SELECT trigger_name, trigger_specification FROM system.processing_engine_triggers"
  ```

- Either pin the trigger to the node receiving the HTTP request (typically a `query`-mode node), or route the request to a node where the trigger is already pinned.

### Schedule trigger logs `ModuleNotFoundError` per tick

The trigger fired on its pinned node, but the plugin imports a module that's not in that node's per-node Python virtual environment.

To fix:

- Install the missing package on the pinned node:

  ```bash { placeholders="PACKAGE_NAME" }
  influxdb3 install package PACKAGE_NAME
  ```

- Or pin the trigger to a node that has the required module already installed.

### Engine panics on startup with a missing plugin file

The Enterprise catalog registers triggers cluster-wide.
Every node validates the registered triggers at startup, including nodes that don't execute them.
If a plugin file referenced by a registered trigger is missing on a node, the engine panics on startup.

To fix:

- Configure `--plugin-dir` on every cluster node and copy or mount the same plugin files to each one.
- If a plugin was deleted but the trigger still references it, drop the orphaned trigger:

  ```bash { placeholders="AUTH_TOKEN|DATABASE_NAME|TRIGGER_NAME" }
  influxdb3 delete trigger \
    --database DATABASE_NAME \
    --token AUTH_TOKEN \
    --force TRIGGER_NAME
  ```

### Plugin operations fail in administrative tools

If an administrative tool reports a generic plugin error against your cluster, check whether any node satisfies the request:

1. Confirm at least one node has `--plugin-dir` configured and runs the plugin's required mode (typically `process,query` for schedule plugins, `query` for request plugins).
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
