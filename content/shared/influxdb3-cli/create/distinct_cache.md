
The `influxdb3 create distinct_cache` command creates a new distinct value cache.

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

- **CACHE_NAME**: _(Optional)_ Name for the cache.
  If not provided, the command automatically generates a name.

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

## Examples

### Create a distinct value cache

{{% code-placeholders "(DATABASE|TABLE|COLUMN|CACHE)_NAME" %}}

<!--pytest.mark.skip-->

```bash
influxdb3 create distinct_cache \
  --database DATABASE_NAME \
  --table TABLE_NAME \
  --column COLUMN_NAME \
  CACHE_NAME
```

{{% /code-placeholders %}}

In the example above, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Database name
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: 
  Table name
- {{% code-placeholder-key %}}`CACHE_NAME`{{% /code-placeholder-key %}}: 
  Name of the distinct value cache to create
- {{% code-placeholder-key %}}`COLUMN_NAME`{{% /code-placeholder-key %}}: Column to cache distinct values from



