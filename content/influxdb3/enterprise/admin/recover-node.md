---
title: Recover a crashed node
seotitle: Recover a crashed or ungracefully stopped InfluxDB 3 Enterprise node
description: >
  Safely recover an InfluxDB 3 Enterprise node that crashed or was stopped
  without a graceful `stop node`: restart it with the same node ID, let it
  drain its write-ahead log (WAL), stop it gracefully, and then remove it.
menu:
  influxdb3_enterprise:
    parent: Administer InfluxDB
    name: Recover a crashed node
weight: 121
related:
  - /influxdb3/enterprise/reference/cli/influxdb3/stop/node/
  - /influxdb3/enterprise/reference/cli/influxdb3/remove/node/
  - /influxdb3/enterprise/reference/cli/influxdb3/show/nodes/
influxdb3/enterprise/tags: [clustering, nodes, recovery, wal]
---

Use this procedure to recover a node that stopped **ungracefully**--for
example, the process crashed, was killed (`kill -9`), or its container was
force-stopped--or that is wedged in the `stopping` state.

This procedure applies to both the Parquet engine and the upgraded storage
engine (the default for new clusters).

## Why ungraceful stops put writes at risk

A node buffers recently acknowledged writes in its write-ahead log (WAL) and
only periodically captures them in a snapshot.
A graceful [`influxdb3 stop node`](/influxdb3/enterprise/reference/cli/influxdb3/stop/node/)
against the **live** node drains this WAL tail before the node reads as
`stopped`--the Parquet engine flushes the WAL and the upgraded storage
engine snapshots it.

A node that dies without a graceful stop skips that drain:

- Running `stop node` against the dead process cannot drain anything.
- [Removing the node](/influxdb3/enterprise/reference/cli/influxdb3/remove/node/)
  purges its object-store file paths, permanently deleting any acknowledged
  writes not covered by its last snapshot.
- Sending the process a bare `SIGTERM` (without calling `stop node`) does not
  force a WAL snapshot on the upgraded storage engine, so a plain process
  shutdown can also leave
  a WAL tail behind.

On clusters that have fully adopted the upgraded storage engine,
`remove node` refuses (HTTP 409) to remove a `stopped`
node that still has an un-snapshotted WAL tail unless you pass
`--force-finalize`.
Parquet clusters and clusters still mid-upgrade do
**not** have this safeguard--on those clusters, completing this recovery
procedure before removal is the only protection against losing the tail.

## Recover the node

1. **Restart a server process with the same `--node-id`** (environment
   variable: `INFLUXDB3_NODE_ID`) and the same object store configuration.
   This is functionally the same as restarting the original node: on startup,
   WAL recovery finds and replays the un-drained WAL files, so the
   acknowledged writes are safe again.

   <!--pytest.mark.skip-->

   ```bash { placeholders="NODE_ID|CLUSTER_ID" }
   influxdb3 serve \
     --node-id NODE_ID \
     --cluster-id CLUSTER_ID \
     # ...same object store configuration as the original node
   ```

2. **Stop the node gracefully** and wait for it to reach `stopped`.
   This drains the WAL tail (Parquet: WAL flush; upgraded engine: WAL
   snapshot):

   <!--pytest.mark.skip-->

   ```bash { placeholders="NODE_ID" }
   influxdb3 stop node --node-id NODE_ID
   ```

   The command waits (up to `--timeout`, default `5m`) for the node to
   confirm the stop.

3. **Remove the node** if you intend to permanently remove it from the
   cluster:

   <!--pytest.mark.skip-->

   ```bash { placeholders="NODE_ID" }
   influxdb3 remove node --node-id NODE_ID
   ```

   If you are recovering the node to keep using it, skip this step--after a
   graceful stop, you can start it again at any time.

## If the node cannot be brought back

If the node genuinely cannot be restarted (for example, its data is
unrecoverable or the hardware is gone) and you accept the possible loss of
un-snapshotted writes, use the
[`--force-finalize` option](/influxdb3/enterprise/reference/cli/influxdb3/remove/node/#force-removal-of-a-wedged-node-data-loss-unsafe)
to force the removal:

<!--pytest.mark.skip-->

```bash { placeholders="NODE_ID" }
influxdb3 remove node --node-id NODE_ID --force-finalize
```

> [!Warning]
> `--force-finalize` is **DATA-LOSS-UNSAFE**: it removes the node using
> whatever snapshot exists in object storage and permanently deletes any
> acknowledged writes not covered by that snapshot.
> Always attempt the [recovery procedure](#recover-the-node) first.

## Verify node status

At any point, check node states with
[`influxdb3 show nodes`](/influxdb3/enterprise/reference/cli/influxdb3/show/nodes/):

<!--pytest.mark.skip-->

```bash
influxdb3 show nodes
```
