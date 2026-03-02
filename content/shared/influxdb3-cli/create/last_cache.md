The `influxdb3 create last_cache` command creates a last value cache, which stores the most recent values for specified columns in a table. Use this to efficiently retrieve the latest values based on key column combinations.

## Usage

{{% code-placeholders "DATABASE_NAME|TABLE_NAME|AUTH_TOKEN|CACHE_NAME" %}}

<!--pytest.mark.skip-->

```bash
influxdb3 create last_cache [OPTIONS] \
  --database DATABASE_NAME \
  --table TABLE_NAME \
  --token AUTH_TOKEN \
  CACHE_NAME
```
{{% /code-placeholders %}}

## Arguments

- **CACHE_NAME**: _(Optional)_ Name for the cache. If omitted, InfluxDB automatically generates one.

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
|        | `--tls-no-verify` | Disable TLS certificate verification. **Not recommended in production.** Useful for testing with self-signed certificates                                             |
| `-h`   | `--help`          | Print help information                                                                                                                                                |
|        | `--help-all`      | Print detailed help information                                                                                                                                       |

### Option environment variables

You can use the following environment variables as substitutes for CLI options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |
| `INFLUXDB3_TLS_NO_VERIFY` | `--tls-no-verify` |

## Prerequisites

Before creating a last value cache, ensure you’ve done the following:

- Create a [database](/influxdb3/version/reference/cli/influxdb3/create/database/).
- Create a [table](/influxdb3/version/reference/cli/influxdb3/create/table/) with the columns you want to cache.
- Have a valid authentication token.

## Examples

A last value cache stores the most recent values from specified columns in a table.

### Create a basic last value cache for one column

The following example shows how to track the most recent value for a single key (the last temperature for each room):

<!--pytest.mark.skip-->

```bash
influxdb3 create last_cache \
  --database DATABASE_NAME \
  --table my_sensor_table \
  --token AUTH_TOKEN \
  --key-columns room \
  --value-columns temp \
  my_temp_cache
```

### Create a last value cache with multiple keys and values

The following example shows how to:

- Use multiple columns as a composite key
- Track several values per key combination
- Set a cache entry limit with `--count`
- Configure automatic expiry with `--ttl`

<!--pytest.mark.skip-->

```bash
influxdb3 create last_cache \
  --database DATABASE_NAME \
  --table my_sensor_table \
  --token AUTH_TOKEN \
  --key-columns room,sensor_id \
  --value-columns temp,hum \
  --count 10 \
  --ttl 1h \
  my_sensor_cache
```

## Usage notes 

- Define the table schema to include all specified key and value columns.
- Pass tokens using `--token`, unless you've set one through an environment variable.
- Specify `--count` and `--ttl` to override the defaults; otherwise, the system uses default values.