
The `influxdb3 delete database` command deletes a database.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 delete database [OPTIONS] <DATABASE_NAME>
```

## Arguments

- **DATABASE_NAME**: The name of the database to delete. Valid database names are alphanumeric and start with a letter or number. Dashes (`-`) and underscores (`_`) are allowed.
  
  Environment variable: `INFLUXDB3_DATABASE_NAME`

## Options

| Option |               | Description                                                                              |
| :----- | :------------ | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`      | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
|        | `--hard-delete` | When to hard delete data (never/now/default/timestamp). Default behavior is a soft delete that allows recovery |
|        | `--token`     | Authentication token                                                                     |
|        | `--tls-ca`    | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
| `-h`   | `--help`      | Print help information                                                                   |
|        | `--help-all`  | Print detailed help information                                                          |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

- [Delete a database](#delete-a-database)
- [Delete a database while specifying the token inline](#delete-a-database-while-specifying-the-token-inline)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Database name
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: 
  Authentication token

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}

### Delete a database

<!--pytest.mark.skip-->

```bash
influxdb3 delete database DATABASE_NAME
```

### Delete a database while specifying the token inline

<!--pytest.mark.skip-->

```bash
influxdb3 delete database --token AUTH_TOKEN DATABASE_NAME
```

### Hard delete a database immediately

Permanently delete a database and all its data immediately without the ability to recover.

<!--pytest.mark.skip-->

```bash
influxdb3 delete database --hard-delete now DATABASE_NAME
```

### Hard delete a database at a specific time

Schedule a database for permanent deletion at a specific timestamp.

<!--pytest.mark.skip-->

```bash
influxdb3 delete database --hard-delete "2024-01-01T00:00:00Z" DATABASE_NAME
```

{{% /code-placeholders %}}
