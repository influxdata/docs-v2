
The `influxdb3 delete table` command deletes a table from a database.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 delete table [OPTIONS] --database <DATABASE_NAME> <TABLE_NAME>
```

## Arguments

- **TABLE_NAME**: The name of the table to delete.

## Options

| Option |               | Description                                                                              |
| :----- | :------------ | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`      | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
| `-d`   | `--database`  | _({{< req >}})_ Name of the database to operate on                                       |
|        | `--hard-delete` | When to hard delete data (never/now/default/timestamp). Default behavior is a soft delete that allows recovery |
|        | `--token`     | _({{< req >}})_ Authentication token                                                     |
|        | `--tls-ca`    | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
| `-h`   | `--help`      | Print help information                                                                   |
|        | `--help-all`  | Print detailed help information                                                          |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

### Delete a table

{{% code-placeholders "(DATABASE|TABLE)_NAME|AUTH_TOKEN" %}}

<!--pytest.mark.skip-->

```bash
influxdb3 delete table \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  TABLE_NAME
```

### Hard delete a table immediately

Permanently delete a table and all its data immediately without the ability to recover.

<!--pytest.mark.skip-->

```bash
influxdb3 delete table \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --hard-delete now \
  TABLE_NAME
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Database name
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: 
  Authentication token
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: 
  Name of the table to delete
