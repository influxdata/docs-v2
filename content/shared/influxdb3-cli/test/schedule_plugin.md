
The `influxdb3 test schedule_plugin` command tests a schedule plugin. Use this command to verify plugin behavior without creating a trigger.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 test schedule_plugin [OPTIONS] --database <DATABASE_NAME> <FILENAME>
```

## Arguments

- **FILENAME**: Path to the plugin file. Use the absolute path or the path relative to the current working directory, such as `<plugin-dir>/<plugin-file-name>.py`.

## Options

| Option | Flag                  | Description                                                                                   |
| :----- | :-------------------- | :-------------------------------------------------------------------------------------------- |
| `-H`   | `--host`              | URL of the running {{< product-name >}} server <br>(default: `http://127.0.0.1:8181`)         |
| `-d`   | `--database`          | _({{< req >}})_ Name of the database you want to test the plugin against                      |
|        | `--token`             | _({{< req >}})_ Authentication token                                                          |
|        | `--input-arguments`   | JSON map of key/value pairs to pass as plugin input arguments (for example, `'{"key":"val"}'`)|
|        | `--schedule`          | Cron schedule to simulate when testing the plugin <br>(default: `* * * * *`)                  |
|        | `--cache-name`        | Optional cache name to associate with the test                                                |
|        | `--tls-ca`            | Path to a custom TLS certificate authority for self-signed certs                              |
| `-h`   | `--help`              | Show basic help information                                                                   |
|        | `--help-all`          | Show all available help options                                                               |


### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Corresponding Option |
| :------------------------ | :------------------- |
| `INFLUXDB3_HOST_URL`      | `--host`             |
| `INFLUXDB3_DATABASE_NAME` | `--database`         |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`            |
| `INFLUXDB3_TLS_CA`        | `--tls-ca`           |

## Examples 

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: Your target database
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: Your authentication token
- {{% code-placeholder-key %}}`PLUGIN_DIR`{{% /code-placeholder-key %}}: 
  the path to the plugin directory you provided when starting the server
- {{% code-placeholder-key %}}`FILENAME`{{% /code-placeholder-key %}}: 
  Plugin file name

{{% code-placeholders "(DATABASE|PLUGIN_DIR|FILENAME|AUTH_TOKEN)" %}}

### Test a schedule plugin

<!--pytest.mark.skip-->

```bash
influxdb3 test schedule_plugin \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  PLUGIN_DIR/FILENAME.py
```

### Test with input arguments and a custom cron schedule 

<!--pytest.mark.skip-->

```bash
influxdb3 test schedule_plugin \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --input-arguments '{"threshold": "10", "unit": "seconds"}' \
  --schedule "0 * * * *" \
  PLUGIN_DIR/FILENAME.py
```

{{% /code-placeholders %}}
