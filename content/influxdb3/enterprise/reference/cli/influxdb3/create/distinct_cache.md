---
title: influxdb3 create distinct_cache
description: >
  The `influxdb3 create distinct_cache` command creates a new distinct value cache.
menu:
  influxdb3_enterprise:
    parent: influxdb3 create
    name: influxdb3 create distinct_cache
weight: 400
---

The `influxdb3 create distinct_cache` command creates a new distinct value cache.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 create distinct_cache [OPTIONS] \
  --database <DATABASE_NAME> \
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
|        | `--token`           | Authentication token                                                                                                                                                    |
| `-t`   | `--table`           | _({{< req >}})_ Table to create the cache for                                                                                                                           |
|        | `--columns`         | _({{< req >}})_ Comma-separated list of columns to cache distinct values for--for example: `col1,col2,col3` (see [Metadata cache hierarchy](#metadata-cache-hierarchy)) |
|        | `--max-cardinality` | Maximum number of distinct value combinations to hold in the cache                                                                                                      |
|        | `--max-age`         | Maximum age of an entry in the cache entered as a human-readable duration--for example: `30d`, `24h`                                                                    |
| `-h`   | `--help`            | Print help information                                                                                                                                                  |

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

<!-- TODO: GET EXAMPLES -->
