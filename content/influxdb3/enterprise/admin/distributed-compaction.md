---
title: Distributed compaction
seotitle: Distributed compaction in InfluxDB 3 Enterprise
description: >
  Run compaction jobs across every compact node in a cluster instead of
  only the node that holds the compactor lease, using `influxdb3 serve
  --compactor-dispatch-target`.
menu:
  influxdb3_enterprise:
    name: Distributed compaction
    parent: Administer InfluxDB
    params:
      state: beta
weight: 108
related:
  - /influxdb3/enterprise/admin/clustering/
  - /influxdb3/enterprise/admin/orphaned-file-cleanup/
  - /influxdb3/enterprise/reference/storage-engine-config-options/
  - /influxdb3/enterprise/reference/config-options/
  - /influxdb3/enterprise/reference/cli/influxdb3/debug/
influxdb3/enterprise/tags: [compaction, clustering, performance, beta]
---

Distributed compaction lets a cluster run compaction jobs on every
[compact node](/influxdb3/enterprise/admin/clustering/#configure-node-modes), not only
the node that currently holds the compactor lease.

> [!Important]
> #### Beta feature
>
> Distributed compaction is a beta feature of the
> [upgraded storage engine](/influxdb3/enterprise/reference/internals/storage-engine/).
> It isn't available on clusters still running the Parquet engine.
> The default configuration (`--compactor-dispatch-target local`) keeps the
> v3.11 behavior, so upgrading to 3.12 doesn't change compaction placement
> unless you opt in.

- [How distributed compaction works](#how-distributed-compaction-works)
- [Choose a dispatch target](#choose-a-dispatch-target)
- [Size compact nodes for the fleet](#size-compact-nodes-for-the-fleet)
- [Failure handling](#failure-handling)
- [Monitor distributed compaction](#monitor-distributed-compaction)
- [Example: a fleet of compact nodes](#example-a-fleet-of-compact-nodes)

## How distributed compaction works

At any moment, exactly one compact node holds the compactor lease and acts
as the **primary**.
The primary plans compaction work, dispatches it, and publishes the
compactor checkpoint.
It never hands scheduling state to another node.

Every other node running in `compact` or `all` mode is a potential
**worker**.
A worker only takes work if it advertises an internode address with
`--internode-bind-addr` (see [conn-info](/influxdb3/enterprise/reference/config-options/#conn-info))
so the primary can connect to it.
A compact node without an internode address stays idle as a worker, even
though it still competes for the compactor lease.

Where a job actually executes is a configuration choice, not a fixed role:
the primary can run jobs itself, hand them to workers, or both, depending
on `--compactor-dispatch-target`.

If the primary is replaced, for example because the node restarts or loses
the lease, a standby compact node takes over, reloads the compactor
checkpoint, and continues scheduling.
Uncommitted work is replanned; nothing dispatched is lost.

## Choose a dispatch target

[`--compactor-dispatch-target`](/influxdb3/enterprise/reference/config-options/#compactor-dispatch-target)
(environment variable `INFLUXDB3_COMPACTOR_DISPATCH_TARGET`) selects where
compaction jobs run:

| Value | Behavior |
| :---- | :------- |
| `local` _(default)_ | Every job runs on the lease holder itself. This matches {{% product-name %}} 3.11 and earlier behavior. |
| `remote` | Jobs run only on other compact nodes. With no worker connected, jobs wait and the dispatcher retries as workers become available. |
| `all` | The lease holder and every other compact node are eligible. |

Set the same `--compactor-dispatch-target` value on every compact node.
The primary reads only its own value, so a mismatched worker doesn't change
where jobs run: it just wastes a node's capacity as an idle worker.

`remote` keeps compaction execution off the primary, so an execution
failure that would otherwise kill the process (such as an out-of-memory
condition) can't take the scheduler down with it.
Consider `remote` or `all` when compaction jobs are large enough to risk
destabilizing the node that also plans and dispatches them.

## Size compact nodes for the fleet

Run compact nodes of the same size when you use `remote` or `all`.
The primary plans and hands out work against the capacity of the fleet, not
against its own node, and it assumes every worker reports the same
execution limits:

- [`--compactor-input-size-budget`](/influxdb3/enterprise/reference/storage-engine-config-options/#compactor)
- [`--compactor-max-concurrent-merges`](/influxdb3/enterprise/reference/storage-engine-config-options/#compactor)

If compact nodes advertise different values for either flag, the primary
plans for the **smallest** value across the fleet and logs a warning
naming the fields that differ.
An unequal fleet still runs correctly, but it gets the throughput of its
weakest node.

## Failure handling

Distributed compaction is built to lose workers and the primary without
losing work:

- **A worker dies or stops responding.** The primary detects the loss
  through a missed heartbeat or a failed dispatch acknowledgment
  (`--compactor-dispatch-ack-timeout`, default `5s`), fails that worker's
  in-flight jobs retryably, and redispatches them to another eligible
  worker. Any files the dead worker already wrote become orphans for
  [orphaned file cleanup](/influxdb3/enterprise/admin/orphaned-file-cleanup/)
  to reclaim.
- **The primary dies.** A standby compact node takes the lease, reloads the
  compactor checkpoint, and replans uncommitted work. The scheduling gap is
  roughly one lease term.
- **A worker rejects a dispatch.** A worker at capacity or draining rejects
  the dispatch without costing a retry attempt: the primary requeues the
  job for the next pass.

## Monitor distributed compaction

Every compact node exports Prometheus metrics under the
`influxdb3_compactor_` prefix at `/metrics`.
A metric only reports a nonzero value on the node playing the role it
describes: lease metrics move on every node, dispatch and fleet-capacity
metrics move on the current primary, and execution metrics move on
whichever node runs the work.

> [!Note]
> Prometheus exposition appends a `_total` suffix to counters.
> For example, `influxdb3_compactor_dispatches` (a counter) is scraped as
> `influxdb3_compactor_dispatches_total`.
> Gauges, such as `influxdb3_compactor_is_primary`, keep their exact name.

| Metric | Type | Labels | Reports |
| :----- | :--- | :----- | :------ |
| `influxdb3_compactor_is_primary` | Gauge | | `1` on the node that holds the compactor lease, `0` everywhere else. Alert if no node reports `1`, or if more than one node reports `1` for longer than about one lease term. |
| `influxdb3_compactor_lease_version` | Gauge | | The current lease term. Steps on every term change. |
| `influxdb3_compactor_fleet_workers` | Gauge | | Workers the primary currently counts for planning. `0` with `--compactor-dispatch-target remote` means compaction is stalled for want of a worker. |
| `influxdb3_compactor_worker_discovered` | Gauge | `node_id` | `1` for each compaction-eligible peer the primary finds in the catalog with connection info. |
| `influxdb3_compactor_worker_connected` | Gauge | `node_id` | `1` for each worker with a live claim and heartbeat. `0` while `worker_discovered` is `1` means the primary can't reach that worker. |
| `influxdb3_compactor_worker_failures` | Counter | `node_id` | Unplanned worker deaths, per worker. |
| `influxdb3_compactor_dispatches` | Counter | `node_id` | Jobs handed to a worker, per receiving node (redispatches included). All work landing on the primary's own node in a multi-node cluster means no remote worker is in use. |
| `influxdb3_compactor_dispatch_ack_timeouts` | Counter | `node_id` | Dispatches a worker didn't acknowledge within `--compactor-dispatch-ack-timeout`. Each timeout disconnects that worker. |
| `influxdb3_compactor_unassigned_output_groups` | Gauge | | Jobs held because no worker is ready or has room for them. A sustained value above zero with `remote` means no worker is connected. |
| `influxdb3_compactor_dispatch_held_no_fit` | Counter | | Times the primary held a job because no eligible worker had room. Read alongside `unassigned_output_groups` to tell a saturated fleet from an absent one. |

For the complete metric set, including per-worker capacity, file-ID grant,
and work-host metrics, see the compactor observability reference shipped
with {{% product-name %}}.

## Example: a fleet of compact nodes

The following example starts two compact nodes that share compaction work.
Replace the following:

- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}:
  your cluster identifier
- {{% code-placeholder-key %}}`S3_BUCKET`{{% /code-placeholder-key %}}:
  your object store bucket name
- {{% code-placeholder-key %}}`COMPACT_NODE_1_ADDR`{{% /code-placeholder-key %}},
  {{% code-placeholder-key %}}`COMPACT_NODE_2_ADDR`{{% /code-placeholder-key %}}:
  the internode gRPC addresses of each compact node

<!--pytest.mark.skip-->

```bash { placeholders="CLUSTER_ID|S3_BUCKET|COMPACT_NODE_(1|2)_ADDR" }
# Compact node 1
influxdb3 serve \
  --node-id compact01 \
  --cluster-id CLUSTER_ID \
  --mode compact \
  --object-store s3 \
  --bucket S3_BUCKET \
  --compactor-dispatch-target all \
  --compactor-input-size-budget 12GB \
  --compactor-max-concurrent-merges 8 \
  --internode-bind-addr COMPACT_NODE_1_ADDR

# Compact node 2
influxdb3 serve \
  --node-id compact02 \
  --cluster-id CLUSTER_ID \
  --mode compact \
  --object-store s3 \
  --bucket S3_BUCKET \
  --compactor-dispatch-target all \
  --compactor-input-size-budget 12GB \
  --compactor-max-concurrent-merges 8 \
  --internode-bind-addr COMPACT_NODE_2_ADDR
```

Whichever node acquires the compactor lease first becomes the primary.
Because both nodes set `--compactor-dispatch-target all`, the primary plans
work for itself and the other node alike.
