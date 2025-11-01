The `influxdb3 show plugins` command lists loaded Processing Engine plugins in your
{{< product-name >}} server.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 show plugins [OPTIONS]
```

## Options

| Option |              | Description                                                                              |
| :----- | :----------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`     | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
|        | `--token`    | *({{< req >}})* Authentication token                                                     |
|        | `--format`   | Output format (`pretty` *(default)*, `json`, `jsonl`, `csv`, or `parquet`)               |
|        | `--output`   | Path where to save output when using the `parquet` format                                |
|        | `--tls-ca`   | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
| `-h`   | `--help`     | Print help information                                                                   |
|        | `--help-all` | Print detailed help information                                                          |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable   | Option    |
| :--------------------- | :-------- |
| `INFLUXDB3_HOST_URL`   | `--host`  |
| `INFLUXDB3_AUTH_TOKEN` | `--token` |

## Output

The command returns information about loaded plugin files:

- **plugin\_name**: Name of a trigger using this plugin
- **file\_name**: Plugin filename
- **file\_path**: Full server path to the plugin file
- **size\_bytes**: File size in bytes
- **last\_modified**: Last modification timestamp (milliseconds since epoch)

> \[!Note]
> This command queries the `system.plugin_files` table in the `_internal` database.
> For more advanced queries and filtering, see [Query system data](/influxdb3/version/admin/query-system-data/).

## Examples

- [List all plugins](#list-all-plugins)
- [List plugins in different output formats](#list-plugins-in-different-output-formats)
- [Output plugins to a Parquet file](#output-plugins-to-a-parquet-file)

### List all plugins

<!--pytest.mark.skip-->

```bash
influxdb3 show plugins
```

### List plugins in different output formats

You can specify the output format using the `--format` option:

<!--pytest.mark.skip-->

```bash
# JSON format
influxdb3 show plugins --format json

# JSON Lines format
influxdb3 show plugins --format jsonl

# CSV format
influxdb3 show plugins --format csv
```

### Output plugins to a Parquet file

[Parquet](https://parquet.apache.org/) is a binary format.
Use the `--output` option to specify the file where you want to save the Parquet data.

<!--pytest.mark.skip-->

```bash
influxdb3 show plugins \
  --format parquet \
  --output /Users/me/plugins.parquet
```
