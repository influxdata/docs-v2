
The `influxdb3 create plugin` command creates a new processing engine plugin.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 create plugin [OPTIONS] \
  --database <DATABASE_NAME> \
  --token <AUTH_TOKEN> \
  --filename <PLUGIN_FILENAME> \
  --entry-point <FUNCTION_NAME> \
  <PLUGIN_NAME>
```

## Arguments

- **PLUGIN_NAME**: The name of the plugin to create.

## Options

| Option |                 | Description                                                                              |
| :----- | :-------------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`        | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
| `-d`   | `--database`    | _({{< req >}})_ Name of the database to operate on                                       |
|        | `--token`       | _({{< req >}})_ Authentication token                                                     |
|        | `--filename`    | _({{< req >}})_ Name of the plugin Python file in the plugin directory                   |
|        | `--entry-point` | _({{< req >}})_ Entry point function name for the plugin                                 |
|        | `--plugin-type` | Type of trigger the plugin processes (default is `wal_rows`)                             |
| `-h`   | `--help`        | Print help information                                                                   |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

<!-- TODO: GET EXAMPLES -->
