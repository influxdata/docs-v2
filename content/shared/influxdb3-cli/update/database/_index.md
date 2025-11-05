The `influxdb3 update database` command updates an existing database in your {{< product-name >}} instance.

{{% show-in "enterprise" %}}
Use this command to update a database's retention period.
{{% /show-in %}}

{{% show-in "core" %}}
> [!Note]
> {{< product-name >}} does not support updating database retention periods.
> Retention periods can only be set when [creating a database](/influxdb3/core/admin/databases/create/)
> and cannot be changed afterward.
{{% /show-in %}}

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 update database [OPTIONS] --database <DATABASE_NAME>
```

## Arguments

- **`DATABASE_NAME`**: (Required) The name of the database to update.
  
You can also set the database name using the `INFLUXDB3_DATABASE_NAME` environment variable.

## Options

{{% hide-in "enterprise" %}}
| Option |              | Description                                                                                                                                      |
| :----- | :----------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `-H`   | `--host`     | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`)                                                         |
| `-d`   | `--database` | The name of the database to update                                                                                                               |
|        | `--token`    | Authentication token                                                                                                                             |
|        | `--tls-ca`   | Path to a custom TLS certificate authority (for testing or self-signed certificates)                                                             |
| `-h`   | `--help`     | Print help information                                                                                                                           |
|        | `--help-all` | Print detailed help information                                                                                                                  |
{{% /hide-in %}}

{{% show-in "enterprise" %}}
| Option |                      | Description                                                                                                                                      |
| :----- | :------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `-H`   | `--host`             | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`)                                                         |
| `-d`   | `--database`         | The name of the database to update                                                                                                               |
|        | `--token`            | Authentication token                                                                                                                             |
| `-r`   | `--retention-period` | The retention period as a [duration](/influxdb3/version/reference/glossary/#duration) value (for example: `30d`, `24h`) or `none` to clear     |
|        | `--tls-ca`           | Path to a custom TLS certificate authority (for testing or self-signed certificates)                                                             |
| `-h`   | `--help`             | Print help information                                                                                                                           |
|        | `--help-all`         | Print detailed help information                                                                                                                  |
{{% /show-in %}}

### Option environment variables

You can use the following environment variables instead of providing CLI options directly:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |
| `INFLUXDB3_TLS_CA`        | `--tls-ca`   |

{{% show-in "enterprise" %}}
## Examples

The following examples show how to update a database.

In your commands replace the following:
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Database name
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  Authentication token


### Update a database retention period

Updates a database retention period to 30 days.

<!--pytest.mark.skip-->

```bash{placeholders="DATABASE_NAME|AUTH_TOKEN"}
influxdb3 update database --retention-period 30d --database DATABASE_NAME
```

### Clear a database retention period

Removes the retention period from a database by setting it to `none`.

<!--pytest.mark.skip-->

```bash{placeholders="DATABASE_NAME|AUTH_TOKEN"}
influxdb3 update database --retention-period none --database DATABASE_NAME
```

### Update a database with authentication

Updates a database using an authentication token.

<!--pytest.mark.skip-->

```bash{placeholders="DATABASE_NAME|AUTH_TOKEN"}
influxdb3 update database --token AUTH_TOKEN --retention-period 7d --database DATABASE_NAME
```

{{% /show-in %}}
