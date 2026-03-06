
The `influxdb3 delete last_cache` command deletes a last value cache.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 delete last_cache [OPTIONS] --database <DATABASE_NAME> --table <TABLE> [CACHE_NAME]
```

## Arguments

- **CACHE_NAME**: _(Optional)_ Name of the cache to delete.

## Options

| Option |              | Description                                                                              |
| :----- | :----------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`     | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
| `-d`   | `--database` | _({{< req >}})_ Name of the database to operate on                                       |
|        | `--token`    | _({{< req >}})_ Authentication token                                                     |
| `-t`   | `--table`    | _({{< req >}})_ Table to delete the cache from                                           |
|        | `--tls-ca`   | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
|        | `--tls-no-verify` | Disable TLS certificate verification (**Not recommended in production**, useful for self-signed certificates) |
| `-h`   | `--help`     | Print help information                                                                   |
|        | `--help-all` | Print detailed help information                                                          |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |
| `INFLUXDB3_TLS_NO_VERIFY` | `--tls-no-verify` |

## Examples

### Delete a last value cache

{{% code-placeholders "(DATABASE|TABLE|CACHE)_NAME|AUTH_TOKEN" %}}

<!--pytest.mark.skip-->

```bash
influxdb3 delete last_cache \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --table TABLE_NAME \
  CACHE_NAME
```

{{% /code-placeholders %}}

In the example above, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Database name
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: 
  Authentication token
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: 
  Table name
- {{% code-placeholder-key %}}`CACHE_NAME`{{% /code-placeholder-key %}}: 
  Name of the last value cache to delete
