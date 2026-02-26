The `influxdb3 create distinct_cache` command creates a new distinct value cache for a specific table and column set in your {{< product-name >}} instance.

Use this command to configure a cache that tracks unique values in specified columns. You must provide the database, token, table, and columns. Optionally, you can specify a name for the cache.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 create distinct_cache [OPTIONS] \
  --database <DATABASE_NAME> \
  --token <AUTH_TOKEN>
  --table <TABLE> \
  --columns <COLUMNS> \
  [CACHE_NAME]
```

## Arguments

- **`CACHE_NAME`**: _(Optional)_ A name to assign to the cache. If omitted, the CLI generates a name automatically.

## Options 

| Option |                     | Description                                                                                                                                                             |
| :----- | :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-H`   | `--host`            | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`)                                                                                |
| `-d`   | `--database`        | _({{< req >}})_ Name of the database to operate on                                                                                                                      |
|        | `--token`           | _({{< req >}})_ Authentication token                                                                                                                                    |
| `-t`   | `--table`           | _({{< req >}})_ Table to create the cache for                                                                                                                           |
|        | `--columns`         | _({{< req >}})_ Comma-separated list of columns to cache distinct values for--for example: `col1,col2,col3` (see [Metadata cache hierarchy](#metadata-cache-hierarchy)) |
|        | `--max-cardinality` | Maximum number of distinct value combinations to hold in the cache                                                                                                      |
|        | `--max-age`         | Maximum age of an entry in the cache entered as a human-readable duration--for example: `30d`, `24h`                                                                    |
|        | `--tls-ca`          | Path to a custom TLS certificate authority (for testing or self-signed certificates)                                                                                    |
|        | `--tls-no-verify`   | Disable TLS certificate verification. **Not recommended in production.** Useful for testing with self-signed certificates                                               |
| `-h`   | `--help`            | Print help information                                                                                                                                                  |
|        | `--help-all`        | Print detailed help information                                                                                                                                         |

> [!Important]
>
> #### Metadata cache hierarchy
>
> The distinct value cache has a hierarchical structure with a level for each specified column.
> The order specified in the `--columns` option determines the order of levels,
> from top-to-bottom, of the cache hierarchy.

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |
| `INFLUXDB3_TLS_NO_VERIFY` | `--tls-no-verify` |


## Prerequisites

Before creating a distinct value cache, make sure you:

1. [Create a database](/influxdb3/version/reference/cli/influxdb3/create/database/)

2. [Create a table](/influxdb3/version/reference/cli/influxdb3/create/table/) that includes the columns you want to cache

3. Have a valid authentication token

## Examples

Before running the following commands, replace the placeholder values with your own:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  The database name
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: 
  The name of the table to cache values from
- {{% code-placeholder-key %}}`CACHE_NAME`{{% /code-placeholder-key %}}: 
  The name of the distinct value cache to create
- {{% code-placeholder-key %}}`COLUMN_NAME`{{% /code-placeholder-key %}}: The column to 
cache distinct values from

You can also set environment variables (such as `INFLUXDB3_AUTH_TOKEN`) instead of passing options inline.

{{% code-placeholders "(DATABASE|TABLE|COLUMN|CACHE)_NAME" %}}

### Create a distinct cache for one column

Track unique values from a single column. This setup is useful for testing or simple use cases.

<!--pytest.mark.skip-->

```bash
influxdb3 create distinct_cache \
  --database DATABASE_NAME \
  --table TABLE_NAME \
  --column COLUMN_NAME \
  CACHE_NAME
```

### Create a hierarchical cache with constraints

Create a distinct value cache for multiple columns. The following example tracks unique combinations of `room` and `sensor_id`, and sets limits on the number of entries and their maximum age.

<!--pytest.mark.skip-->

```bash
influxdb3 create distinct_cache \
  --database my_test_db \
  --table my_sensor_table \
  --columns room,sensor_id \
  --max-cardinality 1000 \
  --max-age 30d \
  my_sensor_distinct_cache
```

{{% /code-placeholders %}}

## Common pitfalls

- `--column` is not valid. Use `--columns`.
- Tokens must be included explicitly unless set via `INFLUXDB3_AUTH_TOKEN`
- Table and column names must already exist or be recognized by the engine

