The `influxdb3 remove node` command permanently removes a **stopped** node
from your {{< product-name >}} cluster.
The cluster drains the node's data (up to its final snapshot) before the
catalog entry and the node's object-store file paths are purged.

> [!Important]
> #### Stop the node gracefully before removing it
>
> A node must be `stopped` before it can be removed.
> Use [`influxdb3 stop node`](/influxdb3/version/reference/cli/influxdb3/stop/node/)
> against the live node and wait for it to reach `stopped`--the graceful stop
> is what drains the node's write-ahead log (WAL) tail.
> A node stuck in `stopping` (for example, because the process was killed
> mid-stop or was already dead) cannot be removed normally.
> To recover such a node safely, follow
> [Recover a crashed node](/influxdb3/version/admin/recover-node/).

## Usage

<!--pytest.mark.skip-->

```bash { placeholders="NODE_ID" }
influxdb3 remove node [OPTIONS] --node-id <NODE_ID>
```

## Options

| Option |                    | Description                                                                              |
| :----- | :----------------- | :--------------------------------------------------------------------------------------- |
|        | `--node-id`        | *({{< req >}})* The node ID to remove                                                    |
|        | `--no-confirm`     | Skip the confirmation prompt                                                             |
|        | `--force-finalize` | **DATA-LOSS-UNSAFE**: force removal of a node that did not shut down cleanly (see [Force removal](#force-removal-of-a-wedged-node-data-loss-unsafe)) |
| `-H`   | `--host`           | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
|        | `--token`          | Authentication token                                                                     |
|        | `--tls-ca`         | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
|        | `--tls-no-verify`  | Disable TLS certificate verification (**Not recommended in production**, useful for self-signed certificates) |
| `-h`   | `--help`           | Print help information                                                                   |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable   | Option    |
| :--------------------- | :-------- |
| `INFLUXDB3_HOST_URL`   | `--host`  |
| `INFLUXDB3_AUTH_TOKEN` | `--token` |
| `INFLUXDB3_TLS_NO_VERIFY` | `--tls-no-verify` |

## Behavior

When you remove a node:

1. The command verifies the node is `stopped` and marks it `removing` in the
   catalog.
2. The cluster drains the node's data up to the node's final snapshot.
3. The node's catalog entry and object-store file paths are purged.

Removal permanently deletes the node's object-store file paths, including its
WAL files.
Any acknowledged writes that were **not** covered by the node's final
snapshot are deleted with them--that is why the node must complete a graceful
stop first.

### Removal is refused if un-snapshotted WAL remains (upgraded engine)

On clusters that have fully adopted the upgraded storage engine (the default
for new clusters), removing a `stopped` node
that still has an un-snapshotted WAL tail is **refused** (HTTP 409):

```text
node 'NODE_ID' has unsnapshotted WAL (wal file N, snapshotted through M);
restart the node so it snapshots the tail, or force the removal (set
force_finalize=true, or pass --force-finalize on the CLI) to remove it and
lose the unsnapshotted writes
```

To resolve this safely, follow
[Recover a crashed node](/influxdb3/version/admin/recover-node/): restart the
node with the same `--node-id`, stop it gracefully so it snapshots the tail,
and then remove it.

> [!Note]
> This safeguard applies only to clusters that have fully adopted the
> upgraded storage engine (new clusters, or after the storage engine upgrade
> completes).
> Parquet clusters and clusters still mid-upgrade are **not**
> guarded--on those clusters, a graceful
> [`stop node`](/influxdb3/version/reference/cli/influxdb3/stop/node/) before
> removal is the only protection against losing an un-drained WAL tail.

## Force removal of a wedged node (DATA-LOSS-UNSAFE)

If `remove node` fails without `--force-finalize`, the node never finished
stopping--its process is gone and never confirmed a clean stop.
`--force-finalize` removes it anyway.

**This can lose data**: recently acknowledged writes the node had not yet
captured in a snapshot are deleted with it.
If the node had finished snapshotting and only failed to report a clean stop,
nothing is lost.

Prefer the safe path first: restart the node with the same `--node-id`, let
it shut down cleanly, and remove it again--see
[Recover a crashed node](/influxdb3/version/admin/recover-node/).
Use `--force-finalize` only when the node cannot be brought back and you
accept the possible loss.

## Examples

- [Remove a stopped node](#remove-a-stopped-node)
- [Remove a node without confirmation](#remove-a-node-without-confirmation)
- [Force removal of a node that cannot be recovered](#force-removal-of-a-node-that-cannot-be-recovered)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`NODE_ID`{{% /code-placeholder-key %}}:
  The node identifier of the node to remove
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  Authentication token with sufficient privileges

### Remove a stopped node

First stop the node gracefully, then remove it:

<!--pytest.mark.skip-->

```bash { placeholders="NODE_ID" }
# Stop the node and wait for it to reach the stopped state
influxdb3 stop node --node-id NODE_ID

# Remove the stopped node from the cluster
influxdb3 remove node --node-id NODE_ID
```

The command prompts for confirmation.

### Remove a node without confirmation

<!--pytest.mark.skip-->

```bash { placeholders="NODE_ID" }
influxdb3 remove node --node-id NODE_ID --no-confirm
```

### Force removal of a node that cannot be recovered

Only use `--force-finalize` after attempting
[crash recovery](/influxdb3/version/admin/recover-node/), when the node
cannot be brought back and you accept the possible loss of un-snapshotted
writes:

<!--pytest.mark.skip-->

```bash { placeholders="NODE_ID" }
influxdb3 remove node --node-id NODE_ID --force-finalize
```
