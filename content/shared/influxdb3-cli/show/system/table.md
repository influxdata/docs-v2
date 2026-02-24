
The `influxdb3 show system table` command queries data from a system table.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 show system --database <DATABASE_NAME> table [OPTIONS] <SYSTEM_TABLE>
```

## Arguments

- **SYSTEM_TABLE**: the system table to query

## Options

| Option |              | Description                                                                           |
| :----- | :----------- | :------------------------------------------------------------------------------------ |
| `-l`   | `--limit`    | Maximum number of tables entries to display (default is `10`, `0` indicates no limit) |
| `-o`   | `--order-by` | Order by the specified columns                                                        |
| `-s`   | `--select`   | Select specific columns from the system table                                         |
|        | `--format`   | Output format (`pretty` _(default)_, `json`, `jsonl`, `csv`, or `parquet`)            |
|        | `--tls-ca`   | Path to a custom TLS certificate authority (for testing or self-signed certificates)  |
|        | `--tls-no-verify` | Disable TLS certificate verification. **Not recommended in production.** Useful for testing with self-signed certificates |
| `-h`   | `--help`     | Print help information                                                                |
|        | `--help-all` | Print detailed help information                                                       |

## Examples

- [Query a system table](#query-a-system-table)
- [Query specific columns from a system table](#query-specific-columns-from-a-system-table)
- [Query a system table and order by a specific column](#query-a-system-table-and-order-by-a-specific-column)
- [Query a system table and return JSON-formatted output](#query-a-system-table-and-return-json-formatted-output)

In the examples below, replace
{{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}} with
the name of the database to operate on.

{{% code-placeholders "DATABASE_NAME" %}}

### Query a system table

<!--pytest.mark.skip-->

```bash
# Query the parquet_files system table
influxdb3 show system --database DATABASE_NAME table parquet_files
```

### Query specific columns from a system table

<!--pytest.mark.skip-->

```bash
# Select specific columns from the parquet_files system table
influxdb3 show system \
  --database DATABASE_NAME \
  table \
  --select table_name,size_bytes,row_count \
  parquet_files
```

### Query a system table and order by a specific column

<!--pytest.mark.skip-->

```bash
influxdb3 show system \
  --database DATABASE_NAME \
  table \
  --order-by size_bytes,row_count \
  parquet_files
```

### Query a system table and return JSON-formatted output

<!--pytest.mark.skip-->

```bash
influxdb3 show system \
  --database DATABASE_NAME \
  table \
  --format json \
  parquet_files
```

{{% /code-placeholders %}}
