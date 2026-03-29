The `influxdb3 update table` command updates an existing table in a database in your {{< product-name >}} instance.

Use this command to update a table's retention period.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 update table [OPTIONS] --database <DATABASE_NAME> <TABLE_NAME>
```

## Arguments

- **`TABLE_NAME`**: (Required) The name of the table to update

## Options

| Option |                      | Description                                                                                                                                      |
| :----- | :------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `-H`   | `--host`             | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`)                                                         |
| `-d`   | `--database`         | The name of the database containing the table                                                                                                    |
|        | `--token`            | Authentication token                                                                                                                             |
| `-r`   | `--retention-period` | The retention period as a [duration](/influxdb3/version/reference/glossary/#duration) value (for example: `30d`, `24h`) or `none` to clear     |
|        | `--tls-ca`           | Path to a custom TLS certificate authority (for testing or self-signed certificates)                                                             |
|        | `--tls-no-verify`    | Disable TLS certificate verification (**Not recommended in production**, useful for self-signed certificates)  |
| `-h`   | `--help`             | Print help information                                                                                                                           |
|        | `--help-all`         | Print detailed help information                                                                                                                  |

### Option environment variables

You can use the following environment variables instead of providing CLI options directly:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |
| `INFLUXDB3_TLS_CA`        | `--tls-ca`   |
| `INFLUXDB3_TLS_NO_VERIFY` | `--tls-no-verify` |

## Examples

The following examples show how to update a table.

In your commands replace the following:
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Database name
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}:
  Table name
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: 
  Authentication token

{{% code-placeholders "DATABASE_NAME|TABLE_NAME|AUTH_TOKEN" %}}

### Update a table retention period

Updates a table retention period to 30 days.

<!--pytest.mark.skip-->

```bash
influxdb3 update table --database DATABASE_NAME --token AUTH_TOKEN --retention-period 30d TABLE_NAME
```

### Clear a table retention period

Removes the retention period from a table by setting it to `none`.

<!--pytest.mark.skip-->

```bash
influxdb3 update table --database DATABASE_NAME --retention-period none TABLE_NAME
```

{{% /code-placeholders %}}