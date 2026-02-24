The `influxdb3 show nodes` command displays information about nodes in your {{< product-name >}} cluster, including their state, mode, and resource usage.

## Usage

<!--pytest.mark.skip-->

```bash
# Syntax
influxdb3 show nodes [OPTIONS]
```

## Options

| Option |            | Description                                                                              |
| :----- | :--------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`   | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
|        | `--format` | Output format (`pretty` _(default)_, `json`, `jsonl`, `csv`, or `parquet`)               |
|        | `--output` | Path where to save output when using the `parquet` format                                |
|        | `--token`  | Authentication token                                                                     |
|        | `--tls-ca` | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
|        | `--tls-no-verify` | Disable TLS certificate verification. **Not recommended in production.** Useful for testing with self-signed certificates |
| `-h`   | `--help`   | Print help information                                                                   |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable   | Option    |
| :--------------------- | :-------- |
| `INFLUXDB3_HOST_URL`   | `--host`  |
| `INFLUXDB3_AUTH_TOKEN` | `--token` |
| `INFLUXDB3_TLS_NO_VERIFY` | `--tls-no-verify` |

## Output

The command displays the following information for each node:

- **node\_id**: The unique identifier for the node
- **node\_catalog\_id**: The internal catalog identifier
- **instance\_id**: The unique instance identifier
- **mode**: The node's operating modes (ingest, query, process, compact)
- **core\_count**: Number of CPU cores allocated to the node
- **state**: Current node state (`running` or `stopped`)
- **updated\_at**: Timestamp of the last update
- **cli\_params**: Command-line parameters used to start the node

## Examples

- [List all nodes in pretty format](#list-all-nodes-in-pretty-format)
- [List nodes in JSON format](#list-nodes-in-json-format)
- [Export nodes data to Parquet format](#export-nodes-data-to-parquet-format)
- [List nodes on a remote server](#list-nodes-on-a-remote-server)

### List all nodes in pretty format

<!--pytest.mark.skip-->

```bash
influxdb3 show nodes
```

<!--pytest-codeblocks:expected-output-->

```
+----------+-----------------+--------------------------------------+--------+------------+---------+---------------------------+
| node_id  | node_catalog_id | instance_id                          | mode   | core_count | state   | updated_at                |
+----------+-----------------+--------------------------------------+--------+------------+---------+---------------------------+
| node-1   | 0               | e38944e4-1204-4bb4-92f3-71138894d674 | ingest | 1          | running | 2025-09-04T10:15:57.126   |
| node-2   | 1               | f5418c97-eb6d-47b5-8176-efc0ad7b882e | ingest | 1          | stopped | 2025-09-04T10:16:57.503   |
+----------+-----------------+--------------------------------------+--------+------------+---------+---------------------------+
```

### List nodes in JSON format

<!--pytest.mark.skip-->

```bash
influxdb3 show nodes --format json
```

The output is similar to the following:

<!--pytest-codeblocks:expected-output-->

```json
[
  {
    "node_id": "node-1",
    "node_catalog_id": 0,
    "instance_id": "e38944e4-1204-4bb4-92f3-71138894d674",
    "mode": [
      "ingest"
    ],
    "core_count": 1,
    "state": "running",
    "updated_at": "2025-09-04T10:15:57.126",
    "cli_params": "{\"http-bind\":\"127.0.0.1:8181\",\"node-id\":\"node-1\",\"data-dir\":\"/path/to/data\",\"object-store\":\"file\",\"mode\":\"ingest\"}"
  },
  {
    "node_id": "node-2",
    "node_catalog_id": 1,
    "instance_id": "f5418c97-eb6d-47b5-8176-efc0ad7b882e",
    "mode": [
      "ingest"
    ],
    "core_count": 1,
    "state": "stopped",
    "updated_at": "2025-09-04T10:16:57.503",
    "cli_params": "{\"http-bind\":\"127.0.0.1:8182\",\"node-id\":\"node-2\",\"data-dir\":\"/path/to/data\",\"object-store\":\"file\",\"mode\":\"ingest\"}"
  }
]
```

### Export nodes data to Parquet format

[Parquet](https://parquet.apache.org/) is a binary format.
Use the `--output` option to specify the file where you want to save the Parquet data.

<!--pytest.mark.skip-->

```bash
influxdb3 show nodes \
  --format parquet \
  --output nodes-data.parquet
```

### List nodes on a remote server

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN|INFLUXDB_HOST" }
influxdb3 show nodes \
  --host INFLUXDB_HOST \
  --token AUTH_TOKEN
```

Replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: Authentication token with sufficient privileges
- {{% code-placeholder-key %}}`INFLUXDB_HOST`{{% /code-placeholder-key %}}: Host URL of the running {{< product-name >}} server
