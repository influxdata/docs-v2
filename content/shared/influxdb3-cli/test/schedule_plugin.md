
The `influxdb3 test schedule_plugin` command tests a schedule plugin. Use this command to verify plugin behavior without creating a trigger.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 test schedule_plugin [OPTIONS] --database <DATABASE_NAME> <FILENAME>
```

## Arguments

- **FILENAME**: the path to the plugin file. Use the full absolute path or the path relative to the current working directory, such as `<plugin-dir>/<plugin-file-name>.py`.

## Options

| Option | Flag               | Description                                                                              |
| :----- | :----------------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`           | Host URL of the running {{< product-name >}} server (default: `http://127.0.0.1:8181`)   |
| `-d`   | `--database`       | _({{< req >}})_ Name of the database to operate on                                       |
|        | `--token`          | _({{< req >}})_ Authentication token                                                     |
|        | `--tls-ca`         | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
| `-h`   | `--help`           | Print help information                                                                   |
|        | `--help-all`       | Print detailed help information                                                          |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Corresponding Option |
| :------------------------ | :------------------- |
| `INFLUXDB3_HOST_URL`      | `--host`             |
| `INFLUXDB3_DATABASE_NAME` | `--database`         |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`            |

## Examples 

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: Your target database
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: Your authentication token
- {{% code-placeholder-key %}}`PLUGIN_DIR`{{% /code-placeholder-key %}}: 
  Plugin directory name
- {{% code-placeholder-key %}}`FILENAME`{{% /code-placeholder-key %}}: 
  Plugin file name

{{% code-placeholders "(DATABASE|PLUGIN_DIR|FILENAME|AUTH_TOKEN" %}}

### Test a schedule plugin

<!--pytest.mark.skip-->

```bash
influxdb3 test schedule_plugin \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  PLUGIN_DIR/FILENAME.py
```

{{% /code-placeholders %}}
