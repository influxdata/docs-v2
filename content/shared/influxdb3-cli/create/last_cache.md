
The `influxdb3 create last_cache` command creates a new last value cache.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 create last_cache [OPTIONS] \
  --database <DATABASE_NAME> \
  --table <TABLE_NAME> \
  [CACHE_NAME]
```

## Arguments

- **CACHE_NAME**: _(Optional)_ Name for the cache.
  If not provided, the command automatically generates a name.

## Options

| Option |                   | Description                                                                                                                                                           |
| :----- | :---------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-H`   | `--host`          | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`)                                                                              |
| `-d`   | `--database`      | _({{< req >}})_ Name of the database to operate on                                                                                                                    |
|        | `--token`         | _({{< req >}})_ Authentication token                                                                                                                                  |
| `-t`   | `--table`         | _({{< req >}})_ Table to create the cache for                                                                                                                         |
|        | `--key-columns`   | Comma-separated list of columns to use as keys in the cache--for example: `foo,bar,baz`                                                                               |
|        | `--value-columns` | Comma-separated list of columns to store as values in the cache--for example: `foo,bar,baz`                                                                           |
|        | `--count`         | Number of entries per unique key column combination to store in the cache                                                                                             |
|        | `--ttl`           | Cache entries' time-to-live (TTL) in [Humantime form](https://docs.rs/humantime/latest/humantime/fn.parse_duration.html)--for example: `10s`, `1min 30sec`, `3 hours` |
|        | `--tls-ca`        | Path to a custom TLS certificate authority (for testing or self-signed certificates)                                                                                  |
| `-h`   | `--help`          | Print help information                                                                                                                                                |
|        | `--help-all`      | Print detailed help information                                                                                                                                       |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Prerequisites

Before creating a last value cache, you must:

Before creating a distinct value cache, you must:

- Create a [database](/influxdb3/version/reference/cli/influxdb3/create/database/).
- Create a [table](/influxdb3/version/reference/cli/influxdb3/create/table/) with the columns you want to cache.
- Have a valid authentication token.

## Examples

### Generic syntax

{{% code-placeholders "(DATABASE|TABLE|CACHE)_NAME (TAG_COLUMN|FIELD_COLUMN)" %}}

<!--pytest.mark.skip-->

```bash
influxdb3 create last_cache \
  --database DATABASE_NAME \
  --table TABLE_NAME \
  --key-columns TAG_COLUMN \
  --value-columns FIELD_COLUMN \
  CACHE_NAME
```

In the example above, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: Database name
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: Table name
- {{% code-placeholder-key %}}`TAG_COLUMN`{{% /code-placeholder-key %}}: Column to use as the key in the cache
- {{% code-placeholder-key %}}`FIELD_COLUMN`{{% /code-placeholder-key %}}: Column to store as the value in the cache
- {{% code-placeholder-key %}}`CACHE_NAME`{{% /code-placeholder-key %}}: Optional name for the last value cache

## Create a basic last value cache for one column

Use this example to create a simple cache for a single key and value column:

<!--pytest.mark.skip-->

```bash
influxdb3 create last_cache \
  --database DATABASE_NAME \
  --table my_sensor_table \
  --key-columns room \
  --value-columns temp \
  my_temp_cache
```

## Create a last value cache with multiple keys and values

This example shows how to configure a more complex cache:

<!--pytest.mark.skip-->

```bash
influxdb3 create last_cache \
  --database DATABASE_NAME \
  --table my_sensor_table \
  --key-columns room,sensor_id \
  --value-columns temp,hum \
  --count 10 \
  --ttl 1h \
  my_sensor_cache
```

{{% /code-placeholders %}}

## Common pitfalls

- All specified key and value columns must exist in the table schema.
- Tokens must be passed with `--token` unless set via environment variable.
- If not specified, default values are used for `--count` and `--ttl`.