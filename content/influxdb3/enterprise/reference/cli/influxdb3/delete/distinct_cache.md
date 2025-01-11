---
title: influxdb3 delete distinct_cache
description: >
  The `influxdb3 delete distinct_cache` command deletes a distinct value cache.
menu:
  influxdb3_enterprise:
    parent: influxdb3 delete
    name: influxdb3 delete distinct_cache
weight: 400
---

The `influxdb3 delete distinct_cache` command deletes a distinct value cache.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 delete distinct_cache [OPTIONS] \
  --database <DATABASE_NAME> \
  --table <TABLE> \
  [CACHE_NAME]
```

## Arguments

- **CACHE_NAME**: _(Optional)_ Name of the cache to delete.

## Options

| Option |                     | Description                                                                                                                                                             |
| :----- | :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-H`   | `--host`            | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`)                                                                                |
| `-d`   | `--database`        | _({{< req >}})_ Name of the database to operate on                                                                                                                      |
|        | `--token`           | Authentication token                                                                                                                                                    |
| `-t`   | `--table`           | _({{< req >}})_ Table to delete the cache for                                                                                                                           |
| `-h`   | `--help`            | Print help information                                                                                                                                                  |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

### Delete a distinct value cache

{{% code-placeholders "(DATABASE|TABLE|CACHE)_NAME" %}}

<!--pytest.mark.skip-->

```bash
influxdb3 delete distinct_cache \
  --database DATABASE_NAME \
  --table TABLE_NAME \
  CACHE_NAME
```

{{% /code-placeholders %}}

In the example above, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Database name
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: 
  Table name
- {{% code-placeholder-key %}}`CACHE_NAME`{{% /code-placeholder-key %}}: 
  Name of the distinct value cache to delete
