
The `influxdb3 show system table-list` command lists available system tables.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 show system --database <DATABASE_NAME> table-list [OPTIONS]
```

## Options

| Option |              | Description                                                                          |
| :----- | :----------- | :----------------------------------------------------------------------------------- |
|        | `--format`   | Output format (`pretty` _(default)_, `json`, `jsonl`, `csv`, or `parquet`)           |
|        | `--tls-ca`   | Path to a custom TLS certificate authority (for testing or self-signed certificates) |
| `-h`   | `--help`     | Print help information                                                               |
|        | `--help-all` | Print detailed help information                                                      |

## Examples

- [List system tables](#list-system-tables)
- [List system tables in JSON-formatted output](#list-system-tables-in-json-formatted-output)

In the examples below, replace
{{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}} with
the name of the database to operate on.

{{% code-placeholders "DATABASE_NAME" %}}

### List system tables

<!--pytest.mark.skip-->

```bash
influxdb3 show system --database DATABASE_NAME summary
```

### List system tables in JSON-formatted output

<!--pytest.mark.skip-->

```bash
influxdb3 show system --database DATABASE_NAME summary --format json
```

{{% /code-placeholders %}}
