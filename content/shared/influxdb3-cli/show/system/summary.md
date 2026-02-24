
The `influxdb3 show system summary` command returns a summary of various types of
system table data.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 show system --database <DATABASE_NAME> summary [OPTIONS]
```

## Options

| Option |              | Description                                                                                    |
| :----- | :----------- | :--------------------------------------------------------------------------------------------- |
| `-l`   | `--limit`    | Maximum number of entries from each table to display (default is `10`, `0` indicates no limit) |
|        | `--format`   | Output format (`pretty` _(default)_, `json`, `jsonl`, `csv`, or `parquet`)                     |
|        | `--tls-ca`   | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
|        | `--tls-no-verify` | Disable TLS certificate verification (**Not recommended in production**, useful for self-signed certificates) |
| `-h`   | `--help`     | Print help information                                                                         |
|        | `--help-all` | Print detailed help information                                                                |

## Examples

- [Summarize system table data](#summarize-system-table-data)
- [Summarize system table data in JSON-formatted output](#summarize-system-table-data-in-json-formatted-output)

In the examples below, replace
{{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}} with
the name of the database to operate on.

{{% code-placeholders "DATABASE_NAME" %}}

### Summarize system table data

<!--pytest.mark.skip-->

```bash
influxdb3 show system --database DATABASE_NAME summary
```

### Summarize system table data in JSON-formatted output

<!--pytest.mark.skip-->

```bash
influxdb3 show system --database DATABASE_NAME summary --format json
```

{{% /code-placeholders %}}
