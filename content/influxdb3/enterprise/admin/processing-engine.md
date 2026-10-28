---
title: Configure a standalone process node
seotitle: Configure a standalone process node for the Processing Engine
description: >
  Configure a standalone process node, a node that runs only the Processing
  Engine, in an InfluxDB 3 Enterprise cluster: plan the cluster, start the
  nodes, create triggers, send each request to the right node, and troubleshoot
  common errors.
menu:
  influxdb3_enterprise:
    name: Configure a standalone process node
    parent: Administer InfluxDB
weight: 102
aliases:
  - /influxdb3/enterprise/admin/processing-engine-cluster/
related:
  - /influxdb3/enterprise/admin/clustering/
  - /influxdb3/enterprise/plugins/
  - /influxdb3/enterprise/reference/processing-engine/
  - /influxdb3/enterprise/reference/cli/influxdb3/create/trigger/
  - /influxdb3/enterprise/reference/cli/influxdb3/serve/
influxdb3/enterprise/tags: [processing engine, plugins, clustering, triggers, troubleshooting]
---

A _standalone process node_ is a node that runs only in `process` mode.
It runs [Processing Engine](/influxdb3/enterprise/reference/processing-engine/) plugins.
It doesn't store writes or answer data queries; the other nodes in the cluster do that work.

In a cluster, we recommend running the Processing Engine on a standalone process node.
This keeps plugin CPU and memory use off your ingest and query nodes.
You can also restart the process node, or [limit its resources](/influxdb3/enterprise/admin/security/harden-the-host/#example-add-memory-cpu-and-io-control-for-process-node), without affecting the other nodes.

This page covers the standalone process node only.
For an overview of process node architectures, see [Configure a process node](/influxdb3/enterprise/admin/clustering/#configure-a-process-node).

> [!Important]
> #### Requires {{% product-name %}} 3.12.0 or later
>
> Before 3.12.0, a standalone process node can't read WAL files from other nodes, so its WAL triggers never run.
> The trigger is accepted, and the node logs `Ingest mode not configured; processing engine will not run wal flush triggers.`

- [How a process node runs plugins](#how-a-process-node-runs-plugins)
- [Plan the cluster](#plan-the-cluster)
- [Start the nodes](#start-the-nodes)
- [Verify the cluster](#verify-the-cluster)
- [Add plugins and packages](#add-plugins-and-packages)
- [Create triggers](#create-triggers)
- [Send each request to the right node](#send-each-request-to-the-right-node)
- [Manage triggers](#manage-triggers)
- [Migrate to a standalone process node](#migrate-to-a-standalone-process-node)
- [Stop and restart the process node](#stop-and-restart-the-process-node)
- [Troubleshoot](#troubleshoot)

## How a process node runs plugins

The process node starts each trigger type differently:

- **WAL triggers** (`table:` or `all_tables`): The process node reads each ingest node's WAL files from object storage and passes new rows to the plugin's `process_writes()` function.
- **Schedule triggers** (`every:` or `cron:`): The process node calls the plugin's `process_scheduled_call()` function on the schedule.
- **Request triggers** (`request:`): The process node serves `/api/v3/engine/<path>` and calls the plugin's `process_request()` function for each request.

For every trigger type, the plugin reaches data through other nodes over the internode protocol:

- `influxdb3_local.query()` runs the query on a query node.
- `influxdb3_local.write_sync()` and the other write methods send data to an ingest node.
- `influxdb3_local.info()`, `warn()`, and `error()` messages are written to `system.processing_engine_logs` through an ingest node.

## Plan the cluster

A cluster with a process node needs at least two nodes: the process node and one or more nodes that run `ingest` and `query`.
All nodes share one object store, one `--cluster-id`, and one license.

Start every ingest node and every query node with `--internode-bind-addr`:

- **Ingest nodes**: Receive plugin writes and plugin log messages.
- **Query nodes**: Run plugin queries.

The process node doesn't need `--internode-bind-addr`.

The smallest cluster is one combined node and the process node:

| Node ID    | `--mode`               | Processing Engine flags      |
| :--------- | :--------------------- | :--------------------------- |
| `node0`    | `ingest,query,compact` | `--internode-bind-addr`      |
| `process0` | `process`              | `--plugin-dir`               |

To scale ingest, query, and compaction separately, run each mode on its own node:

| Node ID    | `--mode`  | Processing Engine flags      |
| :--------- | :-------- | :--------------------------- |
| `ingest0`  | `ingest`  | `--internode-bind-addr`      |
| `query0`   | `query`   | `--internode-bind-addr`      |
| `compact0` | `compact` |                              |
| `process0` | `process` | `--plugin-dir`               |

### Secure the process node

A process node isn't a security boundary: it needs the same credentials as the other nodes.

- **Object storage credentials**: The process node reads the catalog and saves its trigger state in object storage.
  For WAL triggers, it also reads each ingest node's WAL files from object storage.
- **License**: The process node needs the cluster's license file.
- **Internode credentials**: Plugin queries, writes, and log messages use the internode protocol.
  If you set `--internode-jwt-primary` or the `--internode-tls-*` options on the cluster, set them on the process node too.
  Without these options, internode traffic is unencrypted.

## Start the nodes

Start each node with `influxdb3 serve`.
The following examples start the four-node cluster from [Plan the cluster](#plan-the-cluster), with each node on its own host.
To keep the commands short, they use a `file` object store in a directory that every host can reach.
In production, use an object store such as Amazon S3.
See [Connect to your object store](/influxdb3/enterprise/get-started/multi-server/#connect-to-your-object-store).

```bash { placeholders="CLUSTER_ID|DATA_DIR|PLUGIN_DIR|INGEST_HOST|QUERY_HOST" }
# Ingest node
influxdb3 serve \
  --cluster-id CLUSTER_ID \
  --node-id ingest0 \
  --mode ingest \
  --object-store file \
  --data-dir DATA_DIR \
  --internode-bind-addr 0.0.0.0:8083 \
  --conn-info INGEST_HOST:8083

# Query node
influxdb3 serve \
  --cluster-id CLUSTER_ID \
  --node-id query0 \
  --mode query \
  --object-store file \
  --data-dir DATA_DIR \
  --internode-bind-addr 0.0.0.0:8083 \
  --conn-info QUERY_HOST:8083

# Compact node
influxdb3 serve \
  --cluster-id CLUSTER_ID \
  --node-id compact0 \
  --mode compact \
  --object-store file \
  --data-dir DATA_DIR

# Process node
influxdb3 serve \
  --cluster-id CLUSTER_ID \
  --node-id process0 \
  --mode process \
  --object-store file \
  --data-dir DATA_DIR \
  --plugin-dir PLUGIN_DIR
```

Replace the following:

- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: the same cluster ID on every node
- {{% code-placeholder-key %}}`DATA_DIR`{{% /code-placeholder-key %}}: the shared data directory
- {{% code-placeholder-key %}}`PLUGIN_DIR`{{% /code-placeholder-key %}}: the directory on the process node that holds your plugin files
- {{% code-placeholder-key %}}`INGEST_HOST`{{% /code-placeholder-key %}}, {{% code-placeholder-key %}}`QUERY_HOST`{{% /code-placeholder-key %}}: the host name or IP address that the process node uses to reach the ingest or query node

[`--conn-info`](/influxdb3/enterprise/reference/config-options/#conn-info) sets the address that other nodes use to reach the node's internode port.
Without it, a node bound to a wildcard address such as `0.0.0.0` advertises `<hostname>:<port>`.
If the process node can't resolve that host name, plugin queries, plugin writes, and plugin log messages fail.

On first start, the process node creates a Python virtual environment at `PLUGIN_DIR/.venv` from the Python bundled with {{% product-name %}}.

> [!Warning]
> #### Docker containers run the Processing Engine by default
>
> The official Docker image sets `INFLUXDB3_PLUGIN_DIR=/plugins`.
> A node with a plugin directory runs the Processing Engine regardless of `--mode`, so every container started from the image becomes a process node.
> On ingest, query, and compact containers, unset the variable with `-e INFLUXDB3_UNSET_VARS=INFLUXDB3_PLUGIN_DIR`.
> For more information, see [Disable in Docker deployments](/influxdb3/enterprise/reference/processing-engine/#disable-in-docker-deployments).

## Verify the cluster

Query `system.nodes` on a query node:

```bash { placeholders="QUERY_HOST|AUTH_TOKEN" }
influxdb3 query \
  --host http://QUERY_HOST:8181 \
  --token AUTH_TOKEN \
  --database _internal \
  "SELECT node_id, mode, state, conn_info FROM system.nodes"
```

Check the following:

- `process0` has `mode` `[process]` and `state` `running`.
- Each ingest and query node has a `conn_info` that the process node can reach.

## Add plugins and packages

Put plugin files in the process node's plugin directory.
For the plugin API, see the [Python API reference](/influxdb3/enterprise/plugins/python-api-reference/).

To install Python packages, run [`influxdb3 install package`](/influxdb3/enterprise/reference/cli/influxdb3/install/package/) against the process node:

```bash { placeholders="PROCESS_HOST|AUTH_TOKEN|PACKAGE_NAME" }
influxdb3 install package \
  --host http://PROCESS_HOST:8181 \
  --token AUTH_TOKEN \
  PACKAGE_NAME
```

Packages are installed only on the node that receives the request.

## Create triggers

1. Create the database on any node.
2. Create the trigger on the process node.
   Set `--node-spec` to `nodes:process0`.
   Other nodes reject the request with `405 Current node mode does not use the processing engine`.

```bash { placeholders="PROCESS_HOST|AUTH_TOKEN|DATABASE_NAME|PLUGIN_FILE|TABLE_NAME|TRIGGER_NAME" }
influxdb3 create trigger \
  --host http://PROCESS_HOST:8181 \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  --path PLUGIN_FILE \
  --trigger-spec "table:TABLE_NAME" \
  --node-spec "nodes:process0" \
  TRIGGER_NAME
```

Always set `--node-spec`.
With the default `--node-spec all`, every process node schedules the trigger independently.
You can't change a trigger's `--node-spec` after you create it.

If you use `--upload` to send a local plugin file, the file is stored on the process node.

> [!Note]
> #### WAL triggers process only new writes
>
> The first time the process node detects an ingest node, it starts reading that node's WAL from the current position.
> A WAL trigger doesn't run for data written before then.

## Send each request to the right node

| Request                                                                        | Send it to        |
| :----------------------------------------------------------------------------- | :---------------- |
| Write data                                                                     | An ingest node    |
| Query data or `system.processing_engine_logs`                                  | A query node      |
| Create a trigger                                                               | The process node  |
| Install Python packages                                                        | The process node  |
| Call a request trigger (`/api/v3/engine/<path>`)                               | The process node  |
| Create a database; enable, disable, or delete a trigger; stop a node           | Any node          |

A request sent to the wrong node returns an error.
See [HTTP errors](#http-errors).

## Manage triggers

Enable, disable, and delete triggers from any node.
The process node applies the change within a few seconds.

```bash { placeholders="HOST|AUTH_TOKEN|DATABASE_NAME|TRIGGER_NAME" }
influxdb3 disable trigger \
  --host http://HOST:8181 \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  TRIGGER_NAME

influxdb3 enable trigger \
  --host http://HOST:8181 \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  TRIGGER_NAME

influxdb3 delete trigger \
  --host http://HOST:8181 \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  --force \
  TRIGGER_NAME
```

To list triggers, query `system.processing_engine_triggers` on a query node:

```bash { placeholders="QUERY_HOST|AUTH_TOKEN|DATABASE_NAME" }
influxdb3 show system \
  --host http://QUERY_HOST:8181 \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  table processing_engine_triggers
```

## Migrate to a standalone process node

In {{% product-name %}} 3.12 and later, a process node can run WAL triggers for writes sent to any ingest node.
We recommend moving plugins from mixed nodes to a standalone process node when you upgrade a cluster.
First, follow [Upgrade a multi-node cluster](/influxdb3/enterprise/admin/upgrade/#upgrade-a-multi-node-cluster) to upgrade the nodes.

A new process node starts reading each ingest node's WAL from the current position.
It doesn't process earlier writes.
If your WAL plugins must process every write, pause writes during the migration and verify the new process node before resuming writes.

1. Record each trigger's name, database, plugin path, trigger specification, arguments, and error behavior.
   Disable the triggers before moving them.
   See [Manage triggers](#manage-triggers).
2. Start a standalone process node with `--mode=process` and `--plugin-dir`.
   Use the existing cluster ID and object store, and a unique node ID.
   Configure internode connections, copy the plugin files, and install their Python dependencies.
   See [Start the nodes](#start-the-nodes) and [Add plugins and packages](#add-plugins-and-packages).
3. Remove `--plugin-dir` and `INFLUXDB3_PLUGIN_DIR` from nodes that no longer run plugins, then restart those nodes with their intended modes.
   Remove `process` from their `--mode` lists and don't use `all`.
   For Docker, unset the inherited variable with `-e INFLUXDB3_UNSET_VARS=INFLUXDB3_PLUGIN_DIR`.
4. Delete each disabled trigger and recreate it on the new process node with its recorded settings and `--node-spec nodes:PROCESS_NODE_ID`.
   Replace `PROCESS_NODE_ID` with the new process node's ID.
   You can't change an existing trigger's `--node-spec`.
5. Send request trigger calls and package installation requests to the new process node.
   Keep data queries on query nodes and writes on ingest nodes.
6. Verify the node's mode and internode addresses with [Verify the cluster](#verify-the-cluster).
   Test your triggers and check both `system.processing_engine_logs` on a query node and the process node's server log.
   Resume writes after verifying WAL trigger execution.

## Stop and restart the process node

Stop the process node with [`influxdb3 stop node`](/influxdb3/enterprise/reference/cli/influxdb3/stop/node/) from any node:

```bash { placeholders="HOST|AUTH_TOKEN" }
influxdb3 stop node \
  --host http://HOST:8181 \
  --token AUTH_TOKEN \
  --node-id process0
```

To restart it, run `influxdb3 serve` with the same options.

The process node saves its trigger state to `<cluster-id>/<node-id>/processing_engine/restart-state.postcard` in object storage.
It saves the state every [`--processing-engine-restart-state-snapshot-interval`](/influxdb3/enterprise/reference/config-options/#processing-engine-restart-state-snapshot-interval) (default `1s`) and at shutdown.
After a restart, the process node does the following:

- **WAL triggers**: Resumes reading each ingest node's WAL where it stopped, if the required WAL files are still available.
  For limitations after a long outage, see [Known issues](/influxdb3/enterprise/release-notes/#known-issues).
- **Schedule triggers**: Runs each scheduled call that came due while it was down.
- **Request triggers**: Doesn't replay requests.
  During a graceful shutdown, in-progress requests return `503` with `{"error": "server is shutting down"}`.
  After a forced stop, the connection drops.
  Clients can retry either way.
- **Retries**: Keeps pending retries.

A trigger that you disable or delete while the process node is down stays disabled or deleted.

> [!Important]
> #### Make plugins safe to run more than once
>
> A WAL trigger run or scheduled call can run again after a restart, for example when the run was in progress during the restart.
> Write plugins so that a repeated run gives the same result, for example by writing the same points with the same timestamps.

### Retry and queue limits

- [`--trigger-retry-max-attempts`](/influxdb3/enterprise/reference/config-options/#trigger-retry-max-attempts) (default `5`): Sets how many times a failed run is attempted for triggers with `--error-behavior retry`.
- Each trigger queues up to 60 pending runs.
  When a request trigger's queue is full, `/api/v3/engine/<path>` returns `503` with `{"error": "trigger queue is full"}`.

## Troubleshoot

- [Startup errors](#startup-errors)
- [Plugin query and write errors](#plugin-query-and-write-errors)
- [HTTP errors](#http-errors)
- [Trigger problems](#trigger-problems)

### Startup errors

#### The process node doesn't start

`--mode process` without `--plugin-dir` fails with:

```text
starting a node with mode 'process' requires a configured plugin dir for the python environment
```

Add `--plugin-dir`.

#### A node runs the Processing Engine unexpectedly

`--plugin-dir` or `INFLUXDB3_PLUGIN_DIR` adds `process` mode to a node, whatever its `--mode`.
Remove the option or variable from every node except the process node.
For Docker, see [Start the nodes](#start-the-nodes).

#### The process node doesn't start after a crash

If `restart-state.postcard` is corrupt, the process node doesn't start.
Restarting without this file discards queued runs, pending retries, and the saved position in each WAL.
Before you restart, back up the object at `<cluster-id>/<node-id>/processing_engine/restart-state.postcard`.
Remove the original object from object storage, then start the node.

### Plugin query and write errors

`influxdb3_local.query()`, `write_sync()`, and `write_sync_to_db()` raise these errors in the plugin.
`write()` and `write_to_db()` don't: they queue rows until the plugin returns, so a failed write loses the rows and the error appears only in the process node's log.
We recommend `write_sync()` or `write_sync_to_db()` so that your plugin can detect and handle failed writes.

#### `Cannot query: no remote query client found`

No running query node has an internode address.
Restart a query node with `--internode-bind-addr`.
The process node detects it within a few seconds; you don't need to restart the process node.

#### `Cannot write: no remote write client found`

No running ingest node has an internode address.
Until you fix it, plugin writes and plugin log messages fail.
Failed log messages don't raise an error in the plugin; look for this line in the process node's log:

```text
failed to persist processing engine log error=Cannot log: Cannot write: no remote write client found
```

Restart an ingest node with `--internode-bind-addr`.
The process node detects it within a few seconds.

#### `dns error`, then `circuit-open`

A plugin query or `write_sync()` call fails with `dns error`.
After a few failures, it fails with `all remote query clients are circuit-open` or `all remote write clients are circuit-open`.
Plugin log messages are lost with the same error.

An ingest or query node advertises a `conn_info` that the process node can't resolve, usually the host name from a `0.0.0.0` bind.
Check `conn_info` in [`system.nodes`](#verify-the-cluster), then restart that node with `--conn-info` set to an address the process node can reach.
The process node detects the new address without a restart.

#### `ModuleNotFoundError` for a package you installed

The package isn't installed on the process node.
Run [`influxdb3 install package`](#add-plugins-and-packages) against the process node.

### HTTP errors

| Error                                                                                 | Cause                                                                                    | Fix                                                        |
| :------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------- | :--------------------------------------------------------- |
| `500 cannot write to a read-only server: must enable ingest mode`                     | You wrote data to the process node.                                                      | Write to an ingest node.                                   |
| `405 this node does not run the query mode`                                           | You queried data or `system.processing_engine_logs` on the process node.                 | Query a query node.                                        |
| `405 Current node mode does not use the processing engine`                            | You created a trigger, installed packages, or called `/api/v3/engine/<path>` on a node without the Processing Engine. | Send the request to the process node.                      |
| `404 {error: "not found"}` on `/api/v3/engine/<path>`                                 | The trigger is disabled, deleted, or owned by another node.                              | Enable the trigger, or call the node in its `--node-spec`. |
| `500 Node doesn't have proper mode, expect process`                                   | `--node-spec` names a node that isn't a process node.                                    | Set `--node-spec` to the process node.                     |
| `500 invalid node name (<id>)`                                                        | `--node-spec` names a node that doesn't exist.                                           | Check the node ID in `system.nodes`.                       |
| `500 Plugin not found: <plugin-dir>/<file>`                                           | The plugin file isn't in the process node's plugin directory.                            | Copy the file to the process node.                         |
| `404 Database not found <db>` right after you create the database on another node     | The process node hasn't loaded the catalog change yet.                                   | Wait 2 seconds and retry.                                  |

Nodes load catalog changes every [`--catalog-sync-interval`](/influxdb3/enterprise/reference/config-options/#catalog-sync-interval) (default `1s`).

### Trigger problems

#### A trigger disables itself

With `--error-behavior disable`, the first failed run disables the trigger.
The process node logs `trigger execution failed; disabling trigger`.
Fix the plugin, then enable the trigger.

#### A trigger stops running after you replace the process node

Only the node in a trigger's `--node-spec` owns the trigger.
If that node no longer runs `process` mode, the trigger never runs, but `system.processing_engine_triggers` still shows it as enabled.
Delete the trigger and create it again with the new node ID in `--node-spec`.

#### A plugin error doesn't appear in the logs table

Python tracebacks appear only in the process node's log, in lines that contain `trigger execution failed`.
They don't appear in `system.processing_engine_logs`.

Rows in `system.processing_engine_logs` can appear up to 50 seconds after the run.
The `node_id` column shows the node that ran the plugin.
