
The `influxdb3 delete table` command deletes a table from a database.

## Usage

<!--pytest.mark.skip-->

```bash
# Syntax
influxdb3 delete table [OPTIONS] --database <DATABASE_NAME> <TABLE_NAME>
```

## Arguments

- **TABLE_NAME**: The name of the table to delete.

## Options

<!--docs:exclude
--table-name: internal variable, use positional <TABLE_NAME>
-->

{{% hide-in "enterprise" %}}
| Option |                   | Description                                                                              |
| :----- | :---------------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`          | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
| `-d`   | `--database`      | _({{< req >}})_ Name of the database to operate on                                       |
|        | `--hard-delete`   | When to hard delete data (never/now/default/timestamp). Default behavior is a soft delete that allows recovery |
|        | `--token`         | _({{< req >}})_ Authentication token                                                     |
|        | `--tls-ca`        | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
|        | `--tls-no-verify` | Disable TLS certificate verification (useful for development or self-signed certificates)|
| `-h`   | `--help`          | Print help information                                                                   |
|        | `--help-all`      | Print detailed help information                                                          |
{{% /hide-in %}}

{{% show-in "enterprise" %}}
| Option |                   | Description                                                                              |
| :----- | :---------------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`          | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
| `-d`   | `--database`      | _({{< req >}})_ Name of the database to operate on                                       |
|        | `--data-only`     | Delete only data while preserving the table schema and all associated resources (caches, etc.). Default behavior deletes everything |
|        | `--hard-delete`   | When to hard delete data (never/now/default/timestamp). Default behavior is a soft delete that allows recovery |
|        | `--token`         | _({{< req >}})_ Authentication token                                                     |
|        | `--tls-ca`        | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
|        | `--tls-no-verify` | Disable TLS certificate verification (useful for development or self-signed certificates)|
| `-h`   | `--help`          | Print help information                                                                   |
|        | `--help-all`      | Print detailed help information                                                          |
{{% /show-in %}}

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option            |
| :------------------------ | :---------------- |
| `INFLUXDB3_HOST_URL`      | `--host`          |
| `INFLUXDB3_DATABASE_NAME` | `--database`      |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`         |
| `INFLUXDB3_TLS_NO_VERIFY` | `--tls-no-verify` |

## Examples

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Database name
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  Authentication token
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}:
  Name of the table to delete

### Delete a table

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME|TABLE_NAME" }
influxdb3 delete table \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  TABLE_NAME
```

{{% show-in "enterprise" %}}
### Delete table data only (preserve schema and resources)

Delete all data from a table while preserving:
- Table schema (column definitions)
- Last value caches (LVC) and distinct value caches (DVC) associated with the table

This is useful when you want to clear old data and re-write new data to the same schema without recreating the table structure.

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME|TABLE_NAME" }
influxdb3 delete table \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --data-only \
  TABLE_NAME
```
{{% /show-in %}}

### Hard delete a table immediately

Permanently delete a table and all its data immediately without the ability to recover.

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME|TABLE_NAME" }
influxdb3 delete table \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --hard-delete now \
  TABLE_NAME
```
