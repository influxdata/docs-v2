Use `influxdb3 update trigger` to update an existing trigger's plugin code in {{< product-name >}}.
The command loads new code for the existing trigger and preserves its configuration and history.
To change whether the trigger runs, use [`influxdb3 enable trigger`](/influxdb3/version/reference/cli/influxdb3/enable/trigger/) or [`influxdb3 disable trigger`](/influxdb3/version/reference/cli/influxdb3/disable/trigger/).

{{% show-in "enterprise" %}}

To move a trigger to another process node, delete the trigger and [create it with the new `--node-spec`](/influxdb3/enterprise/reference/cli/influxdb3/create/trigger/#pin-a-trigger-to-the-process-node).

{{% /show-in %}}

> [!Note]
> In v3.12.3 and later, you can [fetch updated code for a `gh:` trigger](#update-a-gh-trigger)
> by passing the trigger's `gh:` plugin path to `--path`.
> In earlier versions, disable and re-enable the trigger instead.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 update trigger [OPTIONS] \
  --database <DATABASE_NAME> \
  --trigger-name <TRIGGER_NAME> \
  --path <PLUGIN_PATH>
```

## Arguments

- **`DATABASE_NAME`**: (Required) The name of the database containing the trigger.
- **`TRIGGER_NAME`**: (Required) The name of the trigger to update.
- **`PLUGIN_PATH`**: (Required) The plugin file or directory to upload, or the trigger's `gh:` plugin path.

## Options

| Option |                      | Description                                                                                                                                      |
| :----- | :------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `-H`   | `--host`             | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`)                                                         |
| `-d`   | `--database`         | _({{< req >}})_ Name of the database containing the trigger                                                                                       |
| `-t`   | `--trigger-name`     | _({{< req >}})_ Name of the trigger to update                                                                                                     |
| `-p`   | `--path`             | _({{< req >}})_ Local path to a plugin file or directory (single `.py` file or directory containing `__init__.py` for multifile plugins), or the trigger's own `gh:` plugin path to fetch the plugin again (v3.12.3+). |
|        | `--token`            | Authentication token                                                                                                                             |
|        | `--tls-ca`           | Path to a custom TLS certificate authority (for testing or self-signed certificates)                                                             |
|        | `--tls-no-verify`    | Disable TLS certificate verification (**Not recommended in production**, useful for self-signed certificates)  |
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
- [Refresh a plugin from its repository](#update-a-gh-trigger)

---

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: Database name
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: Authentication token
- {{% code-placeholder-key %}}`TRIGGER_NAME`{{% /code-placeholder-key %}}: Name of the trigger to update

### Update trigger plugin code

Update a trigger with modified plugin code from a local file.
The command transfers the file to the server and requires an admin token.

<!--pytest.mark.skip-->

```bash { placeholders="(DATABASE|TRIGGER)_NAME|AUTH_TOKEN" }
influxdb3 update trigger \
  --database DATABASE_NAME \
  --trigger-name TRIGGER_NAME \
  --path "my_plugin.py" \
  --token AUTH_TOKEN
```

### Upload and update with a local plugin

Upload new plugin code from your local machine and update the trigger in a single operation. Requires admin token.

<!--pytest.mark.skip-->

```bash { placeholders="(DATABASE|TRIGGER)_NAME|AUTH_TOKEN" }
# Upload single-file plugin
influxdb3 update trigger \
  --database DATABASE_NAME \
  --trigger-name TRIGGER_NAME \
  --path "/local/path/to/updated_plugin.py" \
  --token AUTH_TOKEN

# Upload multifile plugin directory
influxdb3 update trigger \
  --database DATABASE_NAME \
  --trigger-name TRIGGER_NAME \
  --path "/local/path/to/plugin_directory" \
  --token AUTH_TOKEN
```

The command transfers local files to the server's plugin directory.

### Refresh a plugin from its repository {#update-a-gh-trigger}

In v3.12.3 and later, you can refresh a plugin that a trigger references with the `gh:` prefix.
Publish the updated plugin at the configured source, then pass the same `gh:` path that you used to create the trigger to `--path`.
Use an admin token.
InfluxDB fetches the plugin and uses the new code the next time it runs the trigger.
If InfluxDB can't fetch the plugin, the command fails and the current code remains in use.

{{% show-in "enterprise" %}}

In a cluster, send the CLI or HTTP refresh request to a node that runs the Processing Engine.
For the CLI, set `--host` to that node's URL.

{{% /show-in %}}

<!--pytest.mark.skip-->

```bash { placeholders="(DATABASE|TRIGGER)_NAME|AUTH_TOKEN" }
influxdb3 update trigger \
  --database DATABASE_NAME \
  --trigger-name TRIGGER_NAME \
  --path "gh:examples/wal_plugin/wal_plugin.py" \
  --token AUTH_TOKEN
```

To refresh the plugin over HTTP, send `POST /api/v3/configure/processing_engine_trigger/refresh` with your admin token.
Set the `db` and `trigger_name` query parameters to the database and trigger names.
Set `plugin_filename` to the existing `gh:` path.

Before v3.12.3, `influxdb3 update trigger` didn't accept `gh:` paths.
Disable and re-enable the trigger to fetch the updated code:

<!--pytest.mark.skip-->

```bash { placeholders="(DATABASE|TRIGGER)_NAME|AUTH_TOKEN" }
influxdb3 disable trigger \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  TRIGGER_NAME

influxdb3 enable trigger \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  TRIGGER_NAME
```
