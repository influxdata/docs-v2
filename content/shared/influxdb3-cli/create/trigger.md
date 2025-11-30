
The `influxdb3 create trigger` command creates a new trigger for the
processing engine.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 create trigger [OPTIONS] \
  --database <DATABASE_NAME> \
  --token <AUTH_TOKEN> \
  --plugin-filename <PLUGIN_FILENAME> \
  --trigger-spec <TRIGGER_SPECIFICATION> \
  <TRIGGER_NAME>
```

## Arguments

- **TRIGGER_NAME**: A name for the new trigger.

## Options

<!--docs:exclude
--trigger-name: internal variable, use positional <TRIGGER_NAME>
-->

| Option |                     | Description                                                                                              |
| :----- | :------------------ | :------------------------------------------------------------------------------------------------------- |
| `-H`   | `--host`            | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`)                 |
| `-d`   | `--database`        | _({{< req >}})_ Name of the database to operate on                                                       |
|        | `--token`           | _({{< req >}})_ Authentication token                                                                     |
| `-p`   | `--path`            | Path to plugin file or directory (single `.py` file or directory containing `__init__.py` for multifile plugins). Can be local path (with `--upload`) or server path. Replaces `--plugin-filename`. |
|        | `--upload`          | Upload local plugin files to the server. Requires admin token. Use with `--path` to specify local files. |
|        | `--plugin-filename` | _(Deprecated: use `--path` instead)_ Name of the file, stored in the server's `plugin-dir`, that contains the Python plugin code to run     |
|        | `--trigger-spec`    | Trigger specification: `table:<TABLE_NAME>`, `all_tables`, `every:<DURATION>`, `cron:<EXPRESSION>`, or `request:<REQUEST_PATH>`                             |
|        | `--trigger-arguments` | Additional arguments for the trigger, in the format `key=value`, separated by commas (for example, `arg1=val1,arg2=val2`) |
|        | `--disabled`        | Create the trigger in disabled state                                                                     |
|        | `--error-behavior`  | Error handling behavior: `log`, `retry`, or `disable` |
|        | `--run-asynchronous` | Run the trigger asynchronously, allowing multiple triggers to run simultaneously (default is synchronous)                                                 |
{{% show-in "enterprise" %}}|        | `--node-spec`       | Which node(s) the trigger should be configured on. Two value formats are supported: `all` (default) - applies to all nodes, or `nodes:<node-id>[,<node-id>..]` - applies only to specified comma-separated list of nodes |{{% /show-in %}}
|        | `--tls-ca`          | Path to a custom TLS certificate authority (for testing or self-signed certificates)                     |
| `-h`   | `--help`            | Print help information                                                                                   |
|        | `--help-all`        | Print detailed help information                                                                          |

If you want to use a plugin from the [Plugin Library](https://github.com/influxdata/influxdb3_plugins) repo, use the URL path with `gh:` specified as the prefix.
For example, to use the [System Metrics](https://github.com/influxdata/influxdb3_plugins/blob/main/influxdata/system_metrics/system_metrics.py) plugin, the plugin filename is `gh:influxdata/system_metrics/system_metrics.py`.


### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

The following examples show how to use the `influxdb3 create trigger` command to create triggers in different scenarios.

- [Create a trigger for a specific table](#create-a-trigger-for-a-specific-table)
- [Create a trigger for all tables](#create-a-trigger-for-all-tables)
- [Create a trigger with a schedule](#create-a-trigger-with-a-schedule)
- [Create a trigger for HTTP requests](#create-a-trigger-for-http-requests)
- [Create a trigger with a multifile plugin](#create-a-trigger-with-a-multifile-plugin)
- [Upload and create a trigger with a local plugin](#upload-and-create-a-trigger-with-a-local-plugin)
- [Create a trigger with additional arguments](#create-a-trigger-with-additional-arguments)
- [Create a disabled trigger](#create-a-disabled-trigger)
- [Create a trigger with error handling](#create-a-trigger-with-error-handling)

---

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: Database name
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: Authentication token
- {{% code-placeholder-key %}}`PLUGIN_FILENAME`{{% /code-placeholder-key %}}: Python plugin filename
- {{% code-placeholder-key %}}`TRIGGER_NAME`{{% /code-placeholder-key %}}:
Name of the trigger to create
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}:
Name of the table to trigger on

{{% code-placeholders "(DATABASE|TRIGGER)_NAME|AUTH_TOKEN|TABLE_NAME" %}}

### Create a trigger for a specific table

Create a trigger that processes data from a specific table.

<!--pytest.mark.skip-->

```bash
influxdb3 create trigger \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --plugin-filename PLUGIN_FILENAME \
  --trigger-spec table:TABLE_NAME \
  TRIGGER_NAME
```

`PLUGIN_FILENAME` must implement the [data write plugin](/influxdb3/version/plugins/#create-a-data-write-plugin) interface.

### Create a trigger for all tables

Create a trigger that applies to all tables in the specified database.

<!--pytest.mark.skip-->

```bash
influxdb3 create trigger \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --plugin-filename <PLUGIN_FILENAME> \
  --trigger-spec all_tables \
  TRIGGER_NAME
```

`PLUGIN_FILENAME` must implement the [data write plugin](/influxdb3/version/plugins/#create-a-data-write-plugin) interface.

This is useful when you want a trigger to apply to any table in the database, regardless of name.

### Create a trigger with a schedule

Create a trigger that runs at a specific interval using a duration. Supported duration units: `s` (seconds), `m` (minutes), `h` (hours), `d` (days), `w` (weeks), `M` (months), `y` (years). Maximum interval is 1 year.

```bash
influxdb3 create trigger \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --plugin-filename <PLUGIN_FILENAME> \
  --trigger-spec every:5m \
  TRIGGER_NAME
```

Create a trigger that runs based on a cron schedule using extended 6-field cron format. The cron expression follows the format:

```console
second minute hour day_of_month month day_of_week
```

Fields:
- **second**: 0-59
- **minute**: 0-59
- **hour**: 0-23
- **day_of_month**: 1-31
- **month**: 1-12 or JAN-DEC
- **day_of_week**: 0-7 (0 or 7 is Sunday) or SUN-SAT

Example: Run at 6:00 AM every weekday (Monday-Friday):

```bash
influxdb3 create trigger \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --plugin-filename <PLUGIN_FILENAME> \
  --trigger-spec "cron:0 0 6 * * 1-5" \
  TRIGGER_NAME
```

`PLUGIN_FILENAME` must implement the [scheduled plugin](/influxdb3/version/plugins/#create-a-scheduled-plugin) interface.

### Create a trigger for HTTP requests

Create a trigger that provides an API endpoint and processes HTTP requests.

```bash
influxdb3 create trigger \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --plugin-filename PLUGIN_FILENAME \
  --trigger-spec request:REQUEST_PATH \
  TRIGGER_NAME
```

`PLUGIN_FILENAME` must implement the [HTTP request plugin](/influxdb3/version/plugins/#create-an-http-request-plugin) interface.

### Create a trigger with a multifile plugin

Create a trigger using a plugin organized in multiple files. The plugin directory must contain an `__init__.py` file.

<!--pytest.mark.skip-->

```bash
influxdb3 create trigger \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --path "my_complex_plugin" \
  --trigger-spec "every:5m" \
  TRIGGER_NAME
```

The `--path` points to a directory in the server's `plugin-dir` with the following structure:

```
my_complex_plugin/
├── __init__.py       # Required entry point
├── processors.py     # Supporting modules
└── utils.py
```

For more information about multifile plugins, see [Create your plugin file](/influxdb3/version/plugins/#create-your-plugin-file).

### Upload and create a trigger with a local plugin

Upload plugin files from your local machine and create a trigger in a single command. Requires admin token.

<!--pytest.mark.skip-->

```bash
# Upload single-file plugin
influxdb3 create trigger \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --path "/local/path/to/plugin.py" \
  --upload \
  --trigger-spec "every:1m" \
  TRIGGER_NAME

# Upload multifile plugin directory
influxdb3 create trigger \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --path "/local/path/to/plugin-dir" \
  --upload \
  --trigger-spec "table:TABLE_NAME" \
  TRIGGER_NAME
```

The `--upload` flag transfers local files to the server's plugin directory. This is useful for:
- Local plugin development and testing
- Deploying plugins without SSH access
- Automating plugin deployment

For more information, see [Upload plugins from local machine](/influxdb3/version/plugins/#upload-plugins-from-local-machine).

### Create a trigger with additional arguments

```bash
influxdb3 create trigger \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --plugin-filename <PLUGIN_FILENAME> \
  --trigger-spec table:TABLE_NAME \
  --trigger-arguments arg1=value1,arg2=value2 \
  TRIGGER_NAME
```

### Create a disabled trigger

Create a trigger in a disabled state. 

<!--pytest.mark.skip-->

```bash
influxdb3 create trigger \
  --disabled \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --plugin-filename <PLUGIN_FILENAME> \
  --trigger-spec table:TABLE_NAME \
  TRIGGER_NAME
```

Creating a trigger in a disabled state prevents it from running immediately. You can enable it later when you're ready to activate it.

### Create a trigger with error handling

Log the error to the service output and the `system.processing_engine_logs` table:

```bash
influxdb3 create trigger \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --plugin-filename <PLUGIN_FILENAME> \
  --trigger-spec table:TABLE_NAME \
  --error-behavior log \
  TRIGGER_NAME
```

Rerun the trigger if it fails:

```bash
influxdb3 create trigger \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --plugin-filename <PLUGIN_FILENAME> \
  --trigger-spec table:TABLE_NAME \
  --error-behavior retry \
  TRIGGER_NAME
```

Disable the trigger if it fails:

```bash
influxdb3 create trigger \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --plugin-filename <PLUGIN_FILENAME> \
  --trigger-spec table:TABLE_NAME \
  --error-behavior disable \
  TRIGGER_NAME
```

{{% /code-placeholders %}}
