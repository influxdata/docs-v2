
The `influxdb3 delete database` command deletes a database.

## Usage

<!--pytest.mark.skip-->

```bash
# Syntax
influxdb3 delete database [OPTIONS] <DATABASE_NAME>
```

## Arguments

- **DATABASE_NAME**: The name of the database to delete. Valid database names are alphanumeric and start with a letter or number. Dashes (`-`) and underscores (`_`) are allowed.
  
  Environment variable: `INFLUXDB3_DATABASE_NAME`

## Options

<!--docs:exclude
--database-name: internal variable, use positional <DATABASE_NAME>
-->

{{% hide-in "enterprise" %}}
| Option |                   | Description                                                                              |
| :----- | :---------------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`          | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
|        | `--hard-delete`   | When to hard delete data (never/now/default/timestamp). Default behavior is a soft delete that allows recovery |
|        | `--token`         | Authentication token                                                                     |
|        | `--tls-ca`        | Path to a custom TLS certificate authority (for self-signed or internal certificates)    |
|        | `--tls-no-verify` | Disable TLS certificate verification. **Not recommended in production.** Useful for testing with self-signed certificates |
| `-h`   | `--help`          | Print help information                                                                   |
|        | `--help-all`      | Print detailed help information                                                          |
{{% /hide-in %}}

{{% show-in "enterprise" %}}
| Option |                   | Description                                                                              |
| :----- | :---------------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`          | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
|        | `--data-only`     | Delete only data while preserving schemas and all associated resources (tokens, triggers, caches, etc.). Default behavior deletes everything |
|        | `--remove-tables` | Used with `--data-only` to remove table resources (caches) while preserving database-level resources (tokens, triggers, processing engine configurations) |
|        | `--hard-delete`   | When to hard delete data (never/now/default/timestamp). Default behavior is a soft delete that allows recovery |
|        | `--token`         | Authentication token                                                                     |
|        | `--tls-ca`        | Path to a custom TLS certificate authority (for self-signed or internal certificates)    |
|        | `--tls-no-verify` | Disable TLS certificate verification. **Not recommended in production.** Useful for testing with self-signed certificates |
| `-h`   | `--help`          | Print help information                                                                   |
|        | `--help-all`      | Print detailed help information                                                          |
{{% /show-in %}}

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option            |
| :------------------------ | :---------------- |
| `INFLUXDB3_HOST_URL`      | `--host`          |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`         |
| `INFLUXDB3_TLS_NO_VERIFY` | `--tls-no-verify` |

## Examples

- [Delete a database](#delete-a-database)
- [Delete a database while specifying the token inline](#delete-a-database-while-specifying-the-token-inline)
{{% show-in "enterprise" %}}- [Delete database data only (preserve schema and resources)](#delete-database-data-only-preserve-schema-and-resources)
- [Delete database data and tables (preserve database resources)](#delete-database-data-and-tables-preserve-database-resources){{% /show-in %}}
- [Hard delete a database immediately](#hard-delete-a-database-immediately)
- [Hard delete a database at a specific time](#hard-delete-a-database-at-a-specific-time)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Database name
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  Authentication token

### Delete a database

<!--pytest.mark.skip-->

```bash { placeholders="DATABASE_NAME" }
influxdb3 delete database DATABASE_NAME
```

### Delete a database while specifying the token inline

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME" }
influxdb3 delete database --token AUTH_TOKEN DATABASE_NAME
```

{{% show-in "enterprise" %}}
### Delete database data only (preserve schema and resources)

Delete all data from a database while preserving:
- Database schema (tables and columns)
- Authentication tokens
- Processing engine configurations and triggers
- Last value caches (LVC) and distinct value caches (DVC)

This is useful when you want to clear old data and re-write new data to the same schema without recreating resources.

<!--pytest.mark.skip-->

```bash { placeholders="DATABASE_NAME" }
influxdb3 delete database --data-only DATABASE_NAME
```

### Delete database data and tables (preserve database resources)

Delete all data and table resources (caches) while preserving database-level resources:
- Authentication tokens
- Processing engine triggers
- Processing engine configurations

This is useful when you want to start fresh with a new schema but keep existing authentication and trigger configurations.

<!--pytest.mark.skip-->

```bash { placeholders="DATABASE_NAME" }
influxdb3 delete database --data-only --remove-tables DATABASE_NAME
```
{{% /show-in %}}

### Hard delete a database immediately

Permanently delete a database and all its data immediately without the ability to recover.

<!--pytest.mark.skip-->

```bash { placeholders="DATABASE_NAME" }
influxdb3 delete database --hard-delete now DATABASE_NAME
```

### Hard delete a database at a specific time

Schedule a database for permanent deletion at a specific timestamp.

<!--pytest.mark.skip-->

```bash { placeholders="DATABASE_NAME" }
influxdb3 delete database --hard-delete "2024-01-01T00:00:00Z" DATABASE_NAME
```
