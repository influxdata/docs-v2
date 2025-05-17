
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

| Option |              | Description                                                                              |
| :----- | :----------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`     | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
|        | `--token`    | Authentication token                                                                     |
|        | `--tls-ca`   | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
| `-h`   | `--help`     | Print help information                                                                   |
|        | `--help-all` | Print detailed help information                                                          |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

- [Delete a database](#delete-a-new-database)
- [Delete a database while specifying the token inline](#delete-a-new-database-while-specifying-the-token-inline)

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

{{% /code-placeholders %}}
