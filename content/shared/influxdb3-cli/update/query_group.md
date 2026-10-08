The `influxdb3 update query_group` command updates an existing distributed
query group in your {{< product-name >}} cluster.

Use this command to rename a query group, change its member query nodes, or
change its replication factor.

`--node-ids` replaces the entire member list, and the order you provide is
significant--each node's position in the list determines the slice of data
it's responsible for. Reordering existing members, even without adding or
removing a node, redistributes work across the group. For conceptual
background and cautions, see
[Configure query groups](/influxdb3/enterprise/admin/query-groups/).

## Usage

<!--pytest.mark.skip-->

```bash
# Syntax
influxdb3 update query_group [OPTIONS] <QUERY_GROUP_ID>
```

## Arguments

- **`QUERY_GROUP_ID`**: (Required) The ID of the query group to update

## Options

| Option |                          | Description                                                                               |
| :----- | :----------------------- | :------------------------------------------------------------------------------------------ |
| `-H`   | `--host`                 | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`)   |
|        | `--token`                | Authentication token                                                                        |
|        | `--name`                 | New name for the query group                                                                |
|        | `--node-ids`             | New comma-separated list of query node IDs for the group                                    |
|        | `--replication-factor`   | New replication factor for the group                                                        |
|        | `--tls-ca`               | Path to a custom TLS certificate authority (for testing or self-signed certificates)        |
|        | `--tls-no-verify`        | Disable TLS certificate verification (**Not recommended in production**, useful for self-signed certificates) |
| `-h`   | `--help`                 | Print help information                                                                      |
|        | `--help-all`             | Print detailed help information                                                             |

### Option environment variables

You can use the following environment variables instead of providing CLI options directly:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |
| `INFLUXDB3_TLS_CA`        | `--tls-ca`   |
| `INFLUXDB3_TLS_NO_VERIFY` | `--tls-no-verify` |

## Examples

In your commands, replace the following:

- {{% code-placeholder-key %}}`QUERY_GROUP_ID`{{% /code-placeholder-key %}}:
  ID of the query group to update
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  Authentication token with sufficient privileges

### Change only the replication factor, leaving name and members untouched

<!--pytest.mark.skip-->

```bash { placeholders="QUERY_GROUP_ID|AUTH_TOKEN" }
influxdb3 update query_group QUERY_GROUP_ID \
  --replication-factor 2 \
  --token AUTH_TOKEN
```

### Change several fields at once

<!--pytest.mark.skip-->

```bash { placeholders="QUERY_GROUP_ID|AUTH_TOKEN" }
influxdb3 update query_group QUERY_GROUP_ID \
  --name g1 \
  --node-ids query-node-0,query-node-1 \
  --replication-factor 2 \
  --token AUTH_TOKEN
```
