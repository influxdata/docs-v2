The `influxdb3 stop node` command requests a graceful, two-phase stop of a
node in your {{< product-name >}} cluster.

When you run this command against a **live** node:

1. The node is marked as `stopping` in the catalog.
2. The node completes its stop cascade--including draining its
   write-ahead log (WAL) tail (the Parquet engine flushes the WAL; the
   upgraded storage engine, the default for new clusters, snapshots
   it)--and then confirms the stop.
3. The node reads as `stopped` in the catalog, and its licensed cores are
   freed for other nodes.

By default, the command waits until the node reaches the `stopped` state
(up to [`--timeout`](#options), default `5m`) and exits with a non-zero
status if the node does not reach `stopped` in time.
Use `--no-wait` to return as soon as the stop request is accepted.

> [!Important]
> #### Run this command against the live node--do not kill it first
>
> `stop node` is how a node drains its WAL tail.
> If you kill the process first (for example, with `kill -9` or by
> force-stopping a container) and run `stop node` afterward, the dead process
> cannot drain anything: recently acknowledged writes that were not yet
> flushed or snapshotted remain stranded in the WAL, and
> [removing the node](/influxdb3/version/reference/cli/influxdb3/remove/node/)
> can then permanently delete them.
> If a node has already stopped ungracefully, follow
> [Recover a crashed node](/influxdb3/version/admin/recover-node/) instead.

> [!Note]
> Sending the server process a bare `SIGTERM` (without calling `stop node`)
> does not force a WAL snapshot on the upgraded storage engine.
> Always use `stop node` to stop a cluster node gracefully.

## Usage

<!--pytest.mark.skip-->

```bash { placeholders="NODE_ID" }
influxdb3 stop node [OPTIONS] --node-id <NODE_ID>
```

## Options

| Option |                | Description                                                                              |
| :----- | :------------- | :--------------------------------------------------------------------------------------- |
|        | `--node-id`    | *({{< req >}})* The node ID to stop                                                      |
|        | `--no-confirm` | Skip the confirmation prompt (`--force` is a deprecated alias)                           |
|        | `--timeout`    | How long to wait for the node to reach `stopped` before giving up--for example: `30s`, `5m`, `1h` (default is `5m`) |
|        | `--no-wait`    | Return as soon as the stop request is accepted instead of waiting for `stopped`          |
| `-H`   | `--host`       | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
|        | `--token`      | Authentication token                                                                     |
|        | `--tls-ca`     | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
|        | `--tls-no-verify` | Disable TLS certificate verification (**Not recommended in production**, useful for self-signed certificates) |
| `-h`   | `--help`       | Print help information                                                                   |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable   | Option    |
| :--------------------- | :-------- |
| `INFLUXDB3_HOST_URL`   | `--host`  |
| `INFLUXDB3_AUTH_TOKEN` | `--token` |
| `INFLUXDB3_TLS_NO_VERIFY` | `--tls-no-verify` |

## Behavior

The node lifecycle is two-phase: `stop node` marks the node `stopping`, but
the node only reads as `stopped` after its own stop cascade completes and it
confirms the stop.
That cascade is what drains the node's WAL tail (Parquet: WAL flush;
upgraded engine: WAL snapshot).

- By default, the command polls the node state (from `system.nodes`) until it
  reaches `stopped`, up to `--timeout` (default `5m`).
- If the node does not reach `stopped` within the timeout, the command prints
  the last observed state and exits with a non-zero status.
  The node may be wedged in `stopping`--for example, if the process died
  mid-cascade.
  To recover, follow
  [Recover a crashed node](/influxdb3/version/admin/recover-node/).
- With `--no-wait`, the command returns after the stop request is accepted.
  Verify that the node reaches `stopped` before removing it.
- Other nodes in the cluster see the state change after their catalog sync
  interval (default 10 seconds).
- The command requires authentication if the server has auth enabled.

Running `stop node` against a node whose process is **already dead** cannot
drain anything: the catalog still moves the node toward `stopped`, but any
un-drained WAL tail remains at risk until the node is restarted.
See [Recover a crashed node](/influxdb3/version/admin/recover-node/).

## Examples

- [Stop a node gracefully](#stop-a-node-gracefully)
- [Stop a node without waiting](#stop-a-node-without-waiting)
- [Stop a node without confirmation](#stop-a-node-without-confirmation)
- [Stop a node on a remote server](#stop-a-node-on-a-remote-server)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`NODE_ID`{{% /code-placeholder-key %}}:
  The node identifier of the node to stop
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  Authentication token with sufficient privileges
- {{% code-placeholder-key %}}`INFLUXDB_HOST`{{% /code-placeholder-key %}}:
  Host URL of the running {{< product-name >}} server

### Stop a node gracefully

Run `stop node` against the live node.
The command prompts for confirmation, requests the stop, and waits for the
node to finish its final flush and confirm the stop:

<!--pytest.mark.skip-->

```bash { placeholders="NODE_ID" }
influxdb3 stop node --node-id NODE_ID
```

After the node reads as `stopped`, you can
[remove it from the cluster](/influxdb3/version/reference/cli/influxdb3/remove/node/)
if you intend to permanently remove it.

### Stop a node without waiting

Use `--no-wait` to return as soon as the stop request is accepted.
Verify that the node reaches `stopped` (for example, with
[`influxdb3 show nodes`](/influxdb3/version/reference/cli/influxdb3/show/nodes/))
before removing it:

<!--pytest.mark.skip-->

```bash { placeholders="NODE_ID" }
influxdb3 stop node --node-id NODE_ID --no-wait
```

### Stop a node without confirmation

<!--pytest.mark.skip-->

```bash { placeholders="NODE_ID" }
influxdb3 stop node --node-id NODE_ID --no-confirm
```

### Stop a node on a remote server

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN|INFLUXDB_HOST|NODE_ID" }
influxdb3 stop node \
  --host INFLUXDB_HOST \
  --node-id NODE_ID \
  --token AUTH_TOKEN
```

## Verify node status

Verify the node state using the
[`influxdb3 show nodes`](/influxdb3/version/reference/cli/influxdb3/show/nodes/) command:

<!--pytest.mark.skip-->

```bash
influxdb3 show nodes
```

A gracefully stopped node appears with `state: "stopped"` in the output.
