The `influxdb3 create query_group` command creates a new distributed query
group--a named set of query nodes that {{% product-name %}} load-balances
queries across.

Together, the nodes in a query group act as a single availability zone: as a
group they can answer any query, but each member node reads only a subset of
ingester streams and compacted shards, splitting the memory and I/O cost of
tracking all the data across the group instead of every node bearing the full
cost alone.
A query node belongs to at most one query group; a node that isn't a member
of any group falls back to loading all data.

The order of `--node-ids` is significant and is never sorted--each node's
position in the list determines the slice of data it's responsible for. For
conceptual background and cautions, see
[Configure query groups](/influxdb3/enterprise/admin/query-groups/).

## Usage

<!--pytest.mark.skip-->

```bash
# Syntax
influxdb3 create query_group [OPTIONS] \
  --node-ids <NODE_IDS>... \
  --replication-factor <REPLICATION_FACTOR> \
  <QUERY_GROUP_NAME>
```

## Arguments

- **`QUERY_GROUP_NAME`**: (Required) The name of the query group to create

## Options

| Option |                          | Description                                                                                                        |
| :----- | :----------------------- | :------------------------------------------------------------------------------------------------------------------ |
| `-H`   | `--host`                 | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`)                            |
|        | `--token`                | Authentication token                                                                                                 |
|        | `--node-ids`             | _({{< req >}})_ Comma-separated list of query node IDs that make up the group                                       |
|        | `--replication-factor`   | _({{< req >}})_ Number of query nodes each partition is replicated to. Must be greater than zero and no greater than the number of node IDs |
|        | `--tls-ca`               | Path to a custom TLS certificate authority (for testing or self-signed certificates)                                |
|        | `--tls-no-verify`        | Disable TLS certificate verification (**Not recommended in production**, useful for self-signed certificates)       |
| `-h`   | `--help`                 | Print help information                                                                                               |
|        | `--help-all`             | Print detailed help information                                                                                     |

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

- {{% code-placeholder-key %}}`QUERY_GROUP_NAME`{{% /code-placeholder-key %}}:
  A name for the new query group
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  Authentication token with sufficient privileges

### Create a query group across three query nodes

<!--pytest.mark.skip-->

```bash { placeholders="QUERY_GROUP_NAME|AUTH_TOKEN" }
influxdb3 create query_group QUERY_GROUP_NAME \
  --node-ids query-node-0,query-node-1,query-node-2 \
  --replication-factor 2 \
  --token AUTH_TOKEN
```

- `--node-ids`: The three query nodes that make up the group
- `--replication-factor`: Each partition replicates to 2 of the 3 nodes.
  Required, and can't exceed the number of node IDs.
