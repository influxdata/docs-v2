Every {{% product-name %}} server process registers itself as a _node_ in the
catalog—the metadata store that tracks databases, tables, and nodes.
The catalog is the source of truth for a node's identity and state, and it
persists in object storage—independently of the process, its container, or its
host.
Understanding how a node moves through its states helps you restart, upgrade,
scale, and decommission {{% product-name %}} safely.

{{% show-in "enterprise" %}}
- [Node states](#node-states)
- [Lifecycle overview](#lifecycle-overview)
- [Register a node](#register-a-node)
- [Stop a node](#stop-a-node)
- [Remove a node](#remove-a-node)
- [Re-register a node](#re-register-a-node)
- [Restart compared to removal](#restart-compared-to-removal)
- [Deploy with an orchestrator](#deploy-with-an-orchestrator)
- [Verify node state](#verify-node-state)
- [Troubleshoot node lifecycle issues](#troubleshoot-node-lifecycle-issues)
{{% /show-in %}}
{{% show-in "core" %}}
- [Node states](#node-states)
- [Lifecycle overview](#lifecycle-overview)
- [Register a node](#register-a-node)
- [Stop a node](#stop-a-node)
- [Re-register a node](#re-register-a-node)
- [Deploy with an orchestrator](#deploy-with-an-orchestrator)
- [Verify node state](#verify-node-state)
- [Troubleshoot node lifecycle issues](#troubleshoot-node-lifecycle-issues)
{{% /show-in %}}

## Node states

The catalog records one of the following states for each node:

| State      | Description                                                                 |
| :--------- | :-------------------------------------------------------------------------- |
| `running`  | The node started and registered itself in the catalog                       |
| `stopping` | A graceful stop was requested, but the node hasn't acknowledged it yet      |
| `stopped`  | The node acknowledged its final snapshot and completed shutdown             |
| `removing` | The node is marked for permanent removal from the cluster                   |

{{% show-in "core" %}}
> [!Note]
> #### Core uses running and stopped
>
> {{% product-name %}} runs a single node and doesn't provide node management
> commands, so a {{% product-name %}} node only ever reads as `running` or
> `stopped`.
> The `stopping` and `removing` states apply to
> [InfluxDB 3 Enterprise](/influxdb3/enterprise/admin/node-lifecycle/) clusters,
> where an operator can stop and remove individual nodes.
{{% /show-in %}}

{{% show-in "enterprise" %}}
Node identity has two parts:

- **Node ID**: The name you assign with
  [`--node-id`](/influxdb3/version/reference/config-options/#node-id).
  It identifies the node across restarts and is the value you pass to node
  management commands.
- **Instance ID**: A UUID that {{% product-name %}} generates the first time a
  node ID registers.
  A node that restarts with the same node ID reuses its existing instance ID.
{{% /show-in %}}
{{% show-in "core" %}}
Node identity has two parts:

- **Node ID**: The name you assign with
  [`--node-id`](/influxdb3/version/reference/config-options/#node-id).
  It identifies the node across restarts.
- **Instance ID**: A UUID that {{% product-name %}} generates the first time a
  node ID registers.
  A node that restarts with the same node ID reuses its existing instance ID.
{{% /show-in %}}

## Lifecycle overview

{{< show-in "enterprise" >}}
{{< diagram >}}
stateDiagram-v2
    [*] --> running: influxdb3 serve
    running --> stopped: SIGTERM or SIGINT
    running --> stopping: influxdb3 stop node
    stopping --> stopped: node acknowledges final snapshot
    stopped --> running: influxdb3 serve (same node ID)
    stopped --> removing: influxdb3 remove node
    removing --> [*]: catalog entry and files purged

{{< /diagram >}}
{{< /show-in >}}

{{% show-in "enterprise" %}}
A node reaches `stopped` by one of two paths:

- **Process shutdown** (`SIGTERM`, `SIGINT`, or Ctrl-c) moves the node directly
  from `running` to `stopped`.
- **[`influxdb3 stop node`](/influxdb3/version/reference/cli/influxdb3/stop/node/)**
  moves the node from `running` to `stopping`, and then to `stopped` after the
  node acknowledges its final snapshot.

Only the second path records a final snapshot sequence, and only the second
path frees the node's licensed cores for other nodes.
{{% /show-in %}}
{{< show-in "core" >}}
{{< diagram >}}
stateDiagram-v2
    [*] --> running: influxdb3 serve
    running --> stopped: SIGTERM or SIGINT
    stopped --> running: influxdb3 serve (same node ID)

{{< /diagram >}}
{{< /show-in >}}

## Register a node

When you start a server with
[`influxdb3 serve`](/influxdb3/version/reference/cli/influxdb3/serve/), the node
registers itself in the catalog and enters the `running` state:

{{% show-in "enterprise" %}}
<!--pytest.mark.skip-->

```bash { placeholders="NODE_ID|CLUSTER_ID|BUCKET_NAME" }
influxdb3 serve \
  --node-id NODE_ID \
  --cluster-id CLUSTER_ID \
  --object-store s3 \
  --bucket BUCKET_NAME
```

Replace the following:

- {{% code-placeholder-key %}}`NODE_ID`{{% /code-placeholder-key %}}:
  A unique identifier for this node
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}:
  The identifier shared by all nodes in the cluster
- {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}}:
  The object storage bucket for the cluster
{{% /show-in %}}
{{% show-in "core" %}}
<!--pytest.mark.skip-->

```bash { placeholders="NODE_ID" }
influxdb3 serve \
  --node-id NODE_ID \
  --object-store file \
  --data-dir ~/.influxdb3
```

Replace {{% code-placeholder-key %}}`NODE_ID`{{% /code-placeholder-key %}}
with a unique identifier for the node.
{{% /show-in %}}

Registration is how a node claims its node ID.
If the node ID already exists in the catalog, {{% product-name %}} applies the
[re-registration rules](#re-register-a-node) before accepting the node.

## Stop a node

{{% show-in "core" %}}
Stop {{% product-name %}} by signaling the process—for example, press Ctrl-c in
the foreground, run `systemctl stop influxdb3`, or stop the container.
`SIGTERM` and `SIGINT` both start a graceful shutdown.

During a graceful shutdown, the node does the following:

1. Stops accepting writes.
2. Flushes the write-ahead log (WAL) buffer to object storage.
3. Waits for an in-progress snapshot to finish.
4. Marks itself `stopped` in the catalog.

Because the final flush writes buffered data to the WAL in object storage,
acknowledged writes survive the shutdown.
When the node restarts, WAL replay restores any writes that weren't yet
captured in a snapshot.

> [!Important]
> #### Give the process time to shut down
>
> A graceful shutdown isn't instantaneous.
> If your init system, container runtime, or orchestrator sends `SIGKILL`
> before the flush completes, the node can't finish its final flush.
> For guidance on timeouts, see
> [Deploy with an orchestrator](#deploy-with-an-orchestrator).
{{% /show-in %}}

{{% show-in "enterprise" %}}
How you stop a node depends on whether the node stays in the cluster.

### Stop a node for a restart

To restart a node in place—for a rolling upgrade, a configuration change, or a
node reschedule—signal the process (`SIGTERM`, `SIGINT`, or Ctrl-c).
The node stops accepting writes, flushes its write-ahead log (WAL) buffer to
object storage, waits for an in-progress snapshot to finish, and marks itself
`stopped` in the catalog.

Because the final flush writes buffered data to the WAL in object storage,
acknowledged writes survive the shutdown, and WAL replay restores them when the
node restarts with the same node ID.

### Stop a node before removing it

To take a node out of the cluster permanently, use
[`influxdb3 stop node`](/influxdb3/version/reference/cli/influxdb3/stop/node/)
against the **live** node:

<!--pytest.mark.skip-->

```bash { placeholders="NODE_ID" }
influxdb3 stop node --node-id NODE_ID
```

The stop proceeds in two phases:

1. {{% product-name %}} marks the node `stopping` in the catalog.
2. The node completes its stop cascade, draining its
   [WAL tail](/influxdb3/version/reference/internals/durability/#wal-tail)—the
   writes buffered since the last snapshot.
3. The node acknowledges the stop, reads as `stopped`, and its licensed cores
   are freed for other nodes.

By default, the command waits for the node to reach `stopped`
(up to `--timeout`, default `5m`).
Use `--no-wait` to return as soon as the cluster accepts the request.

> [!Important]
> #### Run stop node against the live node—don't kill it first
>
> `stop node` is how a node drains its WAL tail and records a final snapshot.
> If you kill the process first and run `stop node` afterward, the dead process
> can't drain anything, and
> [removing the node](/influxdb3/version/reference/cli/influxdb3/remove/node/)
> can permanently delete the stranded writes.
> If a node already stopped ungracefully, follow
> [Recover a crashed node](/influxdb3/version/admin/recover-node/).

> [!Note]
> #### A flush isn't a snapshot
>
> A bare `SIGTERM` flushes the WAL buffer, but it doesn't force a new snapshot.
> The writes are durable and replay on restart, but they remain part of the WAL
> tail.
> That distinction matters only before
> [removing a node](#remove-a-node), because removal purges the node's WAL
> files.

### Repeat a stop request safely

Requesting a stop for a node that's already `stopping`, `stopped`, or
`removing` succeeds without changing the node's state (HTTP `200 OK`).
Controllers and automation can retry a stop without treating the repeat as a
conflict.
{{% /show-in %}}

{{% show-in "enterprise" %}}
## Remove a node

Removal is permanent.
After a node reaches `stopped`, remove it with
[`influxdb3 remove node`](/influxdb3/version/reference/cli/influxdb3/remove/node/):

<!--pytest.mark.skip-->

```bash { placeholders="NODE_ID" }
influxdb3 remove node --node-id NODE_ID
```

{{% product-name %}} marks the node `removing`, drains its data up to its final
snapshot, and then purges the node's catalog entry and its object-store file
paths.

> [!Warning]
> #### Removal deletes the node's files
>
> Removal permanently deletes the node's object-store file paths, including its
> WAL files.
> Any acknowledged writes not covered by the node's final snapshot are deleted
> with them.
> Complete a graceful [`stop node`](#stop-a-node-before-removing-it) first.

Repeating a remove request for a node that's already `removing` succeeds
without changing state (HTTP `200 OK`).

### When removal is refused

{{% product-name %}} refuses removal (HTTP `409 Conflict`) in the following
cases:

| Condition                       | Message                                                                  | Resolution                                                                                          |
| :------------------------------ | :------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------- |
| Node isn't `stopped`            | `node 'NODE_ID' is not fully stopped (current state: STATE)`             | [Stop the node gracefully](#stop-a-node-before-removing-it) and wait for `stopped`                   |
| Node runs in `compact` mode     | `node 'NODE_ID' has compact mode and cannot be removed`                  | Compactor nodes can't be removed—see [Remove a compactor node](#remove-a-compactor-node)             |
| Node belongs to a query group   | `cannot remove node 'NODE_ID' because it is a member of query group ...` | Remove the node from the query group first                                                          |
| Unsnapshotted WAL remains       | `node 'NODE_ID' has unsnapshotted WAL (wal file N, snapshotted through M)` | Restart the node, stop it gracefully, then remove it—see [Recover a crashed node](/influxdb3/version/admin/recover-node/) |

Trying to stop a node that's already stopped returns HTTP `400 Bad Request`
with `tried to stop a node (NODE_ID) that is already stopped`.

> [!Note]
> #### The unsnapshotted WAL safeguard requires the upgraded storage engine
>
> The unsnapshotted WAL check applies only to clusters that fully adopted the
> [upgraded storage engine](/influxdb3/version/reference/internals/storage-engine/)
> (the default for new clusters in {{% product-name %}} 3.11+).
> Clusters on the Parquet engine, or still mid-upgrade, aren't guarded—on those
> clusters, a graceful stop before removal is your only protection against
> losing the WAL tail.

### Remove a compactor node

A node running in `compact` mode holds the cluster's single-writer compaction
lease and can't be removed.
To retire the host running your compactor, start a replacement compactor node
that reuses the same node ID, as described in
[Configure specialized cluster nodes](/influxdb3/version/admin/clustering/#from-single-node-to-specialized-cluster).
{{% /show-in %}}

## Re-register a node

Whether a node ID can be claimed again depends on the current state of the
node in the catalog:

{{% show-in "enterprise" %}}
| Current state           | Can register again?                                          |
| :---------------------- | :------------------------------------------------------------ |
| `stopped`               | Yes—any instance can take over the node ID                   |
| `running` or `stopping` | Only the same instance ID (an idempotent retry or a restart) |
| `removing`              | No—`removing` is terminal for the node ID                    |
{{% /show-in %}}
{{% show-in "core" %}}
| Current state | Can register again?                                          |
| :------------ | :------------------------------------------------------------ |
| `stopped`     | Yes—any instance can take over the node ID                   |
| `running`     | Only the same instance ID (an idempotent retry or a restart) |
{{% /show-in %}}

Because a node restarting with the same node ID reuses its existing instance
ID, an ordinary restart always satisfies these rules—even if the node still
reads as `running` after an ungraceful stop.

{{% show-in "enterprise" %}}
> [!Warning]
> #### Don't reuse the node ID of a removed node
>
> After removal completes, {{% product-name %}} purges the node's catalog entry
> and its object-store file paths.
> While the node is `removing`, registration with that node ID is rejected.
> Assign a new node ID to a replacement node instead of racing the removal.

## Restart compared to removal

Choosing the wrong operation is the most common way to lose data during routine
maintenance.

| Goal                                                       | Operation                                                                  |
| :--------------------------------------------------------- | :-------------------------------------------------------------------------- |
| Rolling upgrade, config change, pod reschedule, host reboot | Restart the process with the **same** node ID—don't remove the node        |
| Permanently scale down or decommission hardware             | `stop node`, verify `stopped`, then `remove node`                          |
| Replace a failed host, keeping its data                     | Start a node with the same node ID and object store configuration          |

Restarting a node is not a removal: the node keeps its catalog entry, its
instance ID, and its object-store files.
Removal is the only operation that purges them.

For upgrade-specific sequencing and catalog version constraints, see
[Troubleshooting cluster upgrades](/influxdb3/version/admin/upgrade/#troubleshooting-cluster-upgrades).
{{% /show-in %}}

## Deploy with an orchestrator

Helm, Kubernetes, and Ansible deployments drive the node lifecycle on your
behalf.
The following guidance keeps orchestrated restarts on the graceful path.

### Kubernetes and Helm

**Give each node a stable node ID.**
Use a StatefulSet so pod names are stable and ordinal-based, and derive
`--node-id` from the pod name.
{{% show-in "enterprise" %}}
The official
[{{% product-name %}} Helm chart](https://github.com/influxdata/helm-charts/tree/master/charts/influxdb3-enterprise)
does this already—it runs a StatefulSet per node mode and sets
`--node-id=$(POD_NAME)` from `metadata.name`.
{{% /show-in %}}
{{% show-in "core" %}}
The official
[{{% product-name %}} Helm chart](https://github.com/influxdata/helm-charts/tree/master/charts/influxdb3-core)
does this already—it runs a StatefulSet and sets `--node-id=$(POD_NAME)` from
`metadata.name`.
{{% /show-in %}}
A Deployment generates a new random pod name on every rollout, which registers a
new node in the catalog on each restart and leaves the old entries behind.

**Set a termination grace period that fits your WAL.**
Kubernetes sends `SIGTERM`, waits `terminationGracePeriodSeconds`
(default `30`), and then sends `SIGKILL`.
A node that's still flushing when `SIGKILL` arrives stops ungracefully.
Set `terminationGracePeriodSeconds` well above your observed shutdown time:

```yaml
spec:
  template:
    spec:
      terminationGracePeriodSeconds: 300
```

> [!Important]
> #### The Helm chart doesn't set a grace period
>
> The {{% product-name %}} Helm chart doesn't set
> `terminationGracePeriodSeconds`, so pods inherit the Kubernetes default of
> 30 seconds.
> For nodes with a large WAL, raise it in your `values.yaml` overrides and
> confirm the shutdown completes in the pod logs.

{{% show-in "enterprise" %}}
**Don't remove nodes during a rolling update.**
A `helm upgrade` or `kubectl rollout restart` terminates and recreates pods
with the same names.
Each node re-registers with its existing node ID, which is exactly what you
want.
Never put
[`influxdb3 remove node`](/influxdb3/version/reference/cli/influxdb3/remove/node/)
in a `preStop` hook—it turns every rollout into a permanent decommission.

**Sequence rollouts across node modes yourself.**
The Helm chart runs a separate StatefulSet per node mode, but the image tag is a
single chart-wide value, so one `helm upgrade` rolls every mode at once.
Kubernetes doesn't order rollouts across StatefulSets, so a plain upgrade
doesn't follow the
[recommended node upgrade order](/influxdb3/version/admin/upgrade/#recommended-node-upgrade-order).
Freeze the modes you aren't upgrading yet with
`updateStrategy.rollingUpdate.partition` and release them one at a time—see the
**Helm** tab in
[Perform a rolling upgrade](/influxdb3/version/admin/upgrade/#perform-a-rolling-upgrade).

**Protect nodes from concurrent drains.**
A node drain (`kubectl drain`, cluster autoscaler, or a managed node-pool
upgrade) evicts pods the same way a rollout does, but nothing stops several
nodes from draining at once.
Enable the chart's pod disruption budget so voluntary disruptions take one node
at a time:

```yaml
ingester:
  podDisruptionBudget:
    enabled: true
    maxUnavailable: 1
```

Set it per node mode (`ingester`, `querier`, `compactor`, and
`processingEngine`).
The chart creates a budget for a mode only when that mode runs more than one
replica, so single-replica modes still drain without protection—make sure their
termination grace period is long enough to finish the final flush.
{{% /show-in %}}
{{% show-in "core" %}}
**Restarts reuse the same node.**
A `helm upgrade` or `kubectl rollout restart` terminates and recreates the pod
with the same name, so the node re-registers with its existing node ID and
replays its WAL.
{{% /show-in %}}

{{% show-in "enterprise" %}}
**Scale down deliberately.**
Reducing a StatefulSet's replica count stops the pods but leaves the nodes in
the catalog as `stopped`.
Removing them is a separate, deliberate step:

<!--pytest.mark.skip-->

```bash { placeholders="NODE_ID" }
# 1. Confirm the node reached the stopped state
influxdb3 show nodes

# 2. Remove the stopped node from the cluster
influxdb3 remove node --node-id NODE_ID
```

**Disabling a node mode leaves its nodes in the catalog.**
Setting a mode's `enabled: false` (for example, `compactor.enabled=false`)
deletes that StatefulSet, but the nodes it ran keep their catalog entries.
Stop and remove them deliberately, in that order, the same way you would after
scaling down.
A [compactor node can't be removed](#remove-a-compactor-node) at all, so disable
the compactor only when you're retiring the cluster or replacing it with a node
that reuses the same node ID.

**Uninstalling doesn't clean the catalog.**
`helm uninstall` removes Kubernetes resources, but the catalog and object
storage persist, and the nodes remain as catalog entries.
Reinstalling with the same node IDs and object store reattaches those nodes.
{{% /show-in %}}

### Ansible and systemd

**Let systemd send `SIGTERM`.**
The systemd default `KillSignal` is `SIGTERM`, which starts a graceful
shutdown—don't override it with `SIGKILL`.

**Raise `TimeoutStopSec`.**
If the node doesn't exit within `TimeoutStopSec`, systemd escalates to
`SIGKILL`.
Set it above your observed shutdown time:

```ini
[Service]
KillSignal=SIGTERM
TimeoutStopSec=300
```

{{% show-in "enterprise" %}}
**Roll one node at a time.**
Use `serial: 1` in your playbook and confirm each node returns to `running`
before proceeding.
Group your inventory by node mode and order the plays to match the
[recommended node upgrade order](/influxdb3/version/admin/upgrade/#recommended-node-upgrade-order)—for
a complete playbook, see the **Ansible** tab in
[Perform a rolling upgrade](/influxdb3/version/admin/upgrade/#perform-a-rolling-upgrade).

**Don't put `remove node` in a playbook.**
A restart keeps the node's catalog entry and object-store files; removal purges
them.
Reserve
[`influxdb3 remove node`](/influxdb3/version/reference/cli/influxdb3/remove/node/)
for deliberate decommissioning, never for routine configuration or version
rollouts.
{{% /show-in %}}
{{% show-in "core" %}}
**Wait for the node to return to `running`.**
Confirm the node re-registered and finished WAL replay before you send traffic
to it again.
{{% /show-in %}}

**Never use `kill -9`.**
Ad hoc `kill -9`, `docker kill`, and force-stopped containers all skip the
final flush.

## Verify node state

{{% show-in "enterprise" %}}
Use [`influxdb3 show nodes`](/influxdb3/version/reference/cli/influxdb3/show/nodes/)
to check the state of every node in the cluster:

<!--pytest.mark.skip-->

```bash
influxdb3 show nodes
```

The output includes a `state` column for each node—abbreviated here to the
lifecycle-relevant columns:

```
+---------+--------+------------+---------+
| node_id | mode   | core_count | state   |
+---------+--------+------------+---------+
| node-1  | ingest | 1          | running |
| node-2  | ingest | 1          | stopped |
+---------+--------+------------+---------+
```

Other nodes observe a state change after their catalog sync interval
(default 10 seconds), so allow for that delay when scripting checks.

You can also query the `system.nodes` table in the `_internal` database:

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN" }
influxdb3 query \
  --database _internal \
  --token AUTH_TOKEN \
  "SELECT node_id, mode, state, updated_at FROM system.nodes"
```

Replace {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}
with a token that has permission to query the `_internal` database.
{{% /show-in %}}
{{% show-in "core" %}}
{{% product-name %}} doesn't provide node management commands, but you can query
the `system.nodes` table in the `_internal` database to see the node's
registered state:

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN" }
influxdb3 query \
  --database _internal \
  --token AUTH_TOKEN \
  "SELECT node_id, mode, state, updated_at FROM system.nodes"
```

Replace {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}
with a token that has permission to query the `_internal` database.
{{% /show-in %}}

## Troubleshoot node lifecycle issues

{{% show-in "enterprise" %}}
### A node is stuck in stopping

The node was marked `stopping` but never acknowledged the stop—usually because
the process died mid-cascade.
Follow [Recover a crashed node](/influxdb3/version/admin/recover-node/):
restart the node with the same node ID, stop it gracefully, and then remove it
if you still intend to.

### A node still reads as running after it crashed

A node that dies without a graceful shutdown never updates its catalog entry,
so it keeps its last recorded state.
Restarting the node with the same node ID re-registers it—the
[re-registration rules](#re-register-a-node) allow it because the instance ID
matches.

### Removal fails with a 409 conflict

See [When removal is refused](#when-removal-is-refused) for each condition and
its resolution.
Prefer restarting and gracefully stopping the node over
[`--force-finalize`](/influxdb3/version/reference/cli/influxdb3/remove/node/#force-removal-of-a-node-that-did-not-shut-down-cleanly),
which can delete unsnapshotted writes.

### Nodes multiply in the catalog after each restart

Each restart registered a new node ID.
Check that your deployment assigns a stable node ID—see
[Kubernetes and Helm](#kubernetes-and-helm).
Stop and remove the stale entries after confirming which nodes are current.

### Writes fail during a rolling upgrade

This is usually a catalog version constraint rather than a lifecycle problem.
See [Troubleshooting cluster upgrades](/influxdb3/version/admin/upgrade/#troubleshooting-cluster-upgrades).
{{% /show-in %}}
{{% show-in "core" %}}
### The node didn't shut down cleanly

If the process was killed before it finished flushing, restart it with the same
node ID and object store configuration.
WAL replay restores acknowledged writes that weren't yet captured in a
snapshot.

### A new node appears after each restart

Each restart registered a new node ID.
Check that your deployment assigns a stable
[`--node-id`](/influxdb3/version/reference/config-options/#node-id)—see
[Deploy with an orchestrator](#deploy-with-an-orchestrator).
{{% /show-in %}}
