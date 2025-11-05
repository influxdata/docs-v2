The `influxdb3 stop node` command marks a node as stopped in the catalog, freeing up the licensed cores it was using for other nodes.

> [!Important]
> This command is designed for cleaning up the catalog **after** you have already stopped the physical instance.
> It does not shut down the running process - you must stop the instance first (for example, using `kill` or stopping the container).

## Usage

<!--pytest.mark.skip-->

```bash { placeholders="NODE_ID" }
influxdb3 stop node [OPTIONS] --node-id <NODE_ID>
```

## Options

| Option |             | Description                                                                              |
| :----- | :---------- | :--------------------------------------------------------------------------------------- |
|        | `--node-id` | *({{< req >}})* The node ID to stop                                                      |
|        | `--force`   | Skip confirmation prompt                                                                 |
| `-H`   | `--host`    | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
|        | `--token`   | Authentication token                                                                     |
|        | `--tls-ca`  | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
| `-h`   | `--help`    | Print help information                                                                   |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable   | Option    |
| :--------------------- | :-------- |
| `INFLUXDB3_HOST_URL`   | `--host`  |
| `INFLUXDB3_AUTH_TOKEN` | `--token` |

## Use case

Use this command when you have forcefully stopped a node instance (for example, using `kill -9` or stopping a container) and need to update the catalog to reflect the change.
This frees up the licensed cores from the stopped node so other nodes can use them.

## Behavior

When you run this command:

1. The command marks the specified node as `stopped` in the catalog
2. Licensed cores from the stopped node are freed for reuse by other nodes
3. Other nodes in the cluster see the update after their catalog sync interval (default 10 seconds)
4. The command requires authentication if the server has auth enabled

> \[!Warning]
> **Stop the instance first**
>
> This command only updates catalog metadata.
> Always stop the physical instance **before** running this command.
> If the instance is still running, it may cause inconsistencies in the cluster.

## Examples

- [Clean up catalog after killing a node](#clean-up-catalog-after-killing-a-node)
- [Clean up catalog without confirmation](#clean-up-catalog-without-confirmation)
- [Clean up catalog on a remote server](#clean-up-catalog-on-a-remote-server)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`NODE_ID`{{% /code-placeholder-key %}}:
  The node identifier for the stopped instance
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  Authentication token with sufficient privileges
- {{% code-placeholder-key %}}`INFLUXDB_HOST`{{% /code-placeholder-key %}}:
  Host URL of the running {{< product-name >}} server

### Clean up catalog after killing a node

This example shows the typical workflow: first stop the instance, then clean up the catalog.

<!--pytest.mark.skip-->

```bash { placeholders="NODE_ID|PID" }
# First, stop the physical instance (for example, using kill)
kill -9 <PID>

# Then, clean up the catalog
influxdb3 stop node --node-id NODE_ID
```

The command prompts for confirmation.

### Clean up catalog without confirmation

<!--pytest.mark.skip-->

```bash { placeholders="NODE_ID" }
influxdb3 stop node --node-id NODE_ID --force
```

### Clean up catalog on a remote server

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN|INFLUXDB_HOST|NODE_ID" }
influxdb3 stop node \
  --host INFLUXDB_HOST \
  --node-id NODE_ID \
  --token AUTH_TOKEN
```

## Verify node status

After stopping a node, verify its status using the [`influxdb3 show nodes`](/influxdb3/version/reference/cli/influxdb3/show/nodes/) command:

<!--pytest.mark.skip-->

```bash
influxdb3 show nodes
```

The stopped node appears with `state: "stopped"` in the output.
