The `influxdb3 update trigger` command updates an existing trigger in your {{< product-name >}} instance.

Use this command to update trigger plugin code, configuration, or behavior without recreating the trigger. This preserves trigger history and configuration while allowing you to iterate on plugin development.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 update trigger [OPTIONS] \
  --database <DATABASE_NAME> \
  --trigger-name <TRIGGER_NAME>
```

## Arguments

- **`DATABASE_NAME`**: (Required) The name of the database containing the trigger.
- **`TRIGGER_NAME`**: (Required) The name of the trigger to update.

## Options

| Option |                      | Description                                                                                                                                      |
| :----- | :------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `-H`   | `--host`             | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`)                                                         |
| `-d`   | `--database`         | _({{< req >}})_ Name of the database containing the trigger                                                                                       |
|        | `--trigger-name`     | _({{< req >}})_ Name of the trigger to update                                                                                                     |
| `-p`   | `--path`             | Path to plugin file or directory (single `.py` file or directory containing `__init__.py` for multifile plugins). Can be local path (with `--upload`) or server path. |
|        | `--upload`           | Upload local plugin files to the server. Requires admin token. Use with `--path` to specify local files.                                         |
|        | `--trigger-arguments`| Additional arguments for the trigger, in the format `key=value`, separated by commas (for example, `arg1=val1,arg2=val2`)                        |
|        | `--disabled`         | Set the trigger state to disabled                                                                                                                 |
|        | `--enabled`          | Set the trigger state to enabled                                                                                                                  |
|        | `--error-behavior`   | Error handling behavior: `log`, `retry`, or `disable`                                                                                             |
|        | `--token`            | Authentication token                                                                                                                             |
|        | `--tls-ca`           | Path to a custom TLS certificate authority (for testing or self-signed certificates)                                                             |
|        | `--tls-no-verify`    | Disable TLS certificate verification. **Not recommended in production.** Useful for testing with self-signed certificates                        |
| `-h`   | `--help`             | Print help information                                                                                                                           |
|        | `--help-all`         | Print detailed help information                                                                                                                  |

### Option environment variables

You can use the following environment variables instead of providing CLI options directly:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |
| `INFLUXDB3_TLS_CA`        | `--tls-ca`   |
| `INFLUXDB3_TLS_NO_VERIFY` | `--tls-no-verify` |

## Examples

The following examples show how to update triggers in different scenarios.

- [Update trigger plugin code](#update-trigger-plugin-code)
- [Upload and update with a local plugin](#upload-and-update-with-a-local-plugin)
- [Update trigger arguments](#update-trigger-arguments)
- [Enable or disable a trigger](#enable-or-disable-a-trigger)
- [Update error handling behavior](#update-error-handling-behavior)

---

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: Database name
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: Authentication token
- {{% code-placeholder-key %}}`TRIGGER_NAME`{{% /code-placeholder-key %}}: Name of the trigger to update

{{% code-placeholders "(DATABASE|TRIGGER)_NAME|AUTH_TOKEN" %}}

### Update trigger plugin code

Update a trigger to use modified plugin code from the server's plugin directory.

<!--pytest.mark.skip-->

```bash
influxdb3 update trigger \
  --database DATABASE_NAME \
  --trigger-name TRIGGER_NAME \
  --path "my_plugin.py" \
  --token AUTH_TOKEN
```

### Upload and update with a local plugin

Upload new plugin code from your local machine and update the trigger in a single operation. Requires admin token.

<!--pytest.mark.skip-->

```bash
# Upload single-file plugin
influxdb3 update trigger \
  --database DATABASE_NAME \
  --trigger-name TRIGGER_NAME \
  --path "/local/path/to/updated_plugin.py" \
  --upload \
  --token AUTH_TOKEN

# Upload multifile plugin directory
influxdb3 update trigger \
  --database DATABASE_NAME \
  --trigger-name TRIGGER_NAME \
  --path "/local/path/to/plugin_directory" \
  --upload \
  --token AUTH_TOKEN
```

The `--upload` flag transfers local files to the server's plugin directory, making it easy to iterate on plugin development without manual file copying.

### Update trigger arguments

Modify the arguments passed to a trigger's plugin code.

<!--pytest.mark.skip-->

```bash
influxdb3 update trigger \
  --database DATABASE_NAME \
  --trigger-name TRIGGER_NAME \
  --trigger-arguments threshold=100,window=5m \
  --token AUTH_TOKEN
```

### Enable or disable a trigger

Change the trigger's enabled state without modifying other configuration.

<!--pytest.mark.skip-->

```bash
# Disable a trigger
influxdb3 update trigger \
  --database DATABASE_NAME \
  --trigger-name TRIGGER_NAME \
  --disabled \
  --token AUTH_TOKEN

# Enable a trigger
influxdb3 update trigger \
  --database DATABASE_NAME \
  --trigger-name TRIGGER_NAME \
  --enabled \
  --token AUTH_TOKEN
```

### Update error handling behavior

Change how the trigger responds to errors.

<!--pytest.mark.skip-->

```bash
# Log errors without retrying
influxdb3 update trigger \
  --database DATABASE_NAME \
  --trigger-name TRIGGER_NAME \
  --error-behavior log \
  --token AUTH_TOKEN

# Retry on errors
influxdb3 update trigger \
  --database DATABASE_NAME \
  --trigger-name TRIGGER_NAME \
  --error-behavior retry \
  --token AUTH_TOKEN

# Disable trigger on error
influxdb3 update trigger \
  --database DATABASE_NAME \
  --trigger-name TRIGGER_NAME \
  --error-behavior disable \
  --token AUTH_TOKEN
```

{{% /code-placeholders %}}
