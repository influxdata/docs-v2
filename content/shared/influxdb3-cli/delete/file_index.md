
The `influxdb3 delete file_index` command deletes a file index for a
database or table.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 delete file_index [OPTIONS] --database <DATABASE_NAME>
```

## Options

| Option |              | Description                                                                              |
| :----- | :----------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`     | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
| `-d`   | `--database` | _({{< req >}})_ Name of the database to operate on                                       |
|        | `--token`    | _({{< req >}})_ Authentication token                                                     |
| `-t`   | `--table`    | Table to delete the file index from                                                      |
|        | `--tls-ca`   | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
| `-h`   | `--help`     | Print help information                                                                   |
|        | `--help-all` | Print detailed help information                                                          |
  
### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

- [Delete a file index from a database](#delete-a-file-index-from-a-database)
- [Delete a file index from a specific table](#delete-a-file-index-from-a-specific-table)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Database name
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: 
  Authentication token
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: 
  Table name

{{% code-placeholders "(DATABASE|TABLE)_NAME|AUTH_TOKEN" %}}

### Delete a file index from a database

<!--pytest.mark.skip-->

```bash
influxdb3 delete file_index \
  --database DATABASE_NAME \
  --token AUTH_TOKEN
```

### Delete a file index from a specific table

<!--pytest.mark.skip-->

```bash
influxdb3 delete file_index \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --table TABLE_NAME
```

{{% /code-placeholders %}}
