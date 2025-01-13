
The `influxdb3 create last_cache` command creates a new last value cache.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 create last_cache [OPTIONS] --database <DATABASE_NAME> --table <TABLE> [CACHE_NAME]
```

## Arguments

- **CACHE_NAME**: _(Optional)_ Name for the cache.
  If not provided, the command automatically generates a name.

## Options

| Option |                   | Description                                                                                                                                                           |
| :----- | :---------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-H`   | `--host`          | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`)                                                                              |
| `-d`   | `--database`      | _({{< req >}})_ Name of the database to operate on                                                                                                                    |
|        | `--token`         | Authentication token                                                                                                                                                  |
| `-t`   | `--table`         | _({{< req >}})_ Table to create the cache for                                                                                                                         |
|        | `--key-columns`   | Comma-separated list of columns to use as keys in the cache--for example: `foo,bar,baz`                                                                               |
|        | `--value-columns` | Comma-separated list of columns to store as values in the cache--for example: `foo,bar,baz`                                                                           |
|        | `--count`         | Number of entries per unique key column combination to store in the cache                                                                                             |
|        | `--ttl`           | Cache entries' time-to-live (TTL) in [Humantime form](https://docs.rs/humantime/latest/humantime/fn.parse_duration.html)--for example: `10s`, `1min 30sec`, `3 hours` |
| `-h`   | `--help`          | Print help information                                                                                                                                                |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

<!-- TODO: GET EXAMPLES -->
