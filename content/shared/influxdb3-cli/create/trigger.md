
The `influxdb3 create trigger` command creates a new trigger for the
processing engine.

## Usage

<!--pytest.mark.skip-->

```bash
# Syntax
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
|        | `--disabled`        | Create the trigger in disabled state (default: enabled)                                                  |
|        | `--error-behavior`  | Error handling behavior: `log`, `retry`, or `disable` (default: `log`) |
|        | `--run-asynchronous` | Run the trigger asynchronously, allowing multiple triggers to run simultaneously (default is synchronous)                                                 |
|        | `--tls-ca`          | Path to a custom TLS certificate authority (for self-signed or internal certificates)                    |
|        | `--tls-no-verify`   | Disable TLS certificate verification (**Not recommended in production**, useful for self-signed certificates) |
| `-h`   | `--help`            | Print help information                                                                                   |
|        | `--help-all`        | Print detailed help information                                                                          |

{{% show-in "enterprise" %}}
Additional {{% product-name %}} option:

| Option |               | Description                                                                                                                                                                 |
| :----- | :------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|        | `--node-spec` | Which nodes own the trigger. Two value formats are supported: `all` (default) - every node that runs the Processing Engine (a node with `--plugin-dir` configured) owns the trigger, or `nodes:<node-id>[,<node-id>...]` - only the listed nodes own the trigger. In a cluster, set this to your process node, see [Pin a trigger to the process node](#pin-a-trigger-to-the-process-node) |
{{% /show-in %}}

### Reference a plugin from GitHub

To fetch a plugin remotely instead of downloading it locally, prefix the plugin path with `gh:`. The path after the prefix is appended to the configured `--plugin-repo`--for example:

```
gh:examples/wal_plugin/wal_plugin.py
```

Despite the name, `gh:` doesn't require GitHub or a Git repository--`--plugin-repo` accepts any HTTP/HTTPS URL that serves raw plugin files.

By default, `gh:`-prefixed plugins resolve against the [`influxdata/influxdb3_plugins`](https://github.com/influxdata/influxdb3_plugins) repository at `https://raw.githubusercontent.com/influxdata/influxdb3_plugins/main/`.
For example, `gh:examples/wal_plugin/wal_plugin.py` resolves to `https://raw.githubusercontent.com/influxdata/influxdb3_plugins/main/examples/wal_plugin/wal_plugin.py`.

To reference plugins from a different repository, set the `--plugin-repo` server option (or the `INFLUXDB3_PLUGIN_REPO` environment variable) to a raw content URL base path. For more information, see the [`plugin-repo` config option](/influxdb3/version/reference/config-options/#plugin-repo).

InfluxDB fetches the plugin over HTTP when the trigger is created (to validate it), and again each time the trigger starts--for example, on server startup or when re-enabled. If the fetch fails, `influxdb3 create trigger` returns an error with the HTTP status code and URL:

```
error fetching plugin from repository: 404 Not Found https://raw.githubusercontent.com/influxdata/influxdb3_plugins/main/not_found.py
```

Unlike local plugins, `gh:`-prefixed plugins aren't automatically reloaded when the source changes--disable and re-enable the trigger to fetch updates. Only single-file plugins are supported with the `gh:` prefix; multi-file plugin directories must be uploaded locally with `--upload`.


### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option            |
| :------------------------ | :---------------- |
| `INFLUXDB3_HOST_URL`      | `--host`          |
| `INFLUXDB3_DATABASE_NAME` | `--database`      |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`         |
| `INFLUXDB3_TLS_NO_VERIFY` | `--tls-no-verify` |

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

### Create a trigger for a specific table

Create a trigger that processes data from a specific table.

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME|PLUGIN_FILENAME|TABLE_NAME|TRIGGER_NAME" }
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

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME|PLUGIN_FILENAME|TRIGGER_NAME" }
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

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME|PLUGIN_FILENAME|TRIGGER_NAME" }
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

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME|PLUGIN_FILENAME|TRIGGER_NAME" }
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

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME|PLUGIN_FILENAME|REQUEST_PATH|TRIGGER_NAME" }
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

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME|TRIGGER_NAME" }
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

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME|TABLE_NAME|TRIGGER_NAME" }
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

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME|PLUGIN_FILENAME|TABLE_NAME|TRIGGER_NAME" }
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

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME|PLUGIN_FILENAME|TABLE_NAME|TRIGGER_NAME" }
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

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME|PLUGIN_FILENAME|TABLE_NAME|TRIGGER_NAME" }
influxdb3 create trigger \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --plugin-filename <PLUGIN_FILENAME> \
  --trigger-spec table:TABLE_NAME \
  --error-behavior log \
  TRIGGER_NAME
```

Rerun the trigger if it fails:

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME|PLUGIN_FILENAME|TABLE_NAME|TRIGGER_NAME" }
influxdb3 create trigger \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --plugin-filename <PLUGIN_FILENAME> \
  --trigger-spec table:TABLE_NAME \
  --error-behavior retry \
  TRIGGER_NAME
```

Disable the trigger if it fails:

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME|PLUGIN_FILENAME|TABLE_NAME|TRIGGER_NAME" }
influxdb3 create trigger \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --plugin-filename <PLUGIN_FILENAME> \
  --trigger-spec table:TABLE_NAME \
  --error-behavior disable \
  TRIGGER_NAME
```

{{% show-in "enterprise" %}}

### Pin a trigger to the process node

In a cluster, we recommend running the Processing Engine on a standalone process node.
Create the trigger on the process node, and set `--node-spec` to the process node's ID:

```bash { placeholders="PROCESS_HOST|AUTH_TOKEN|DATABASE_NAME|PROCESS_NODE_ID" }
influxdb3 create trigger \
  --host http://PROCESS_HOST:8181 \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  --path schedule_rollup.py \
  --trigger-spec "every:5s" \
  --node-spec "nodes:PROCESS_NODE_ID" \
  hourly_rollup
```

The default, `--node-spec all`, makes every node that runs the Processing Engine own the trigger.

The node in `--node-spec` must exist and run `process` mode:

- An unknown node ID returns `invalid node name (<id>)`.
- A node that doesn't run `process` mode returns `Node doesn't have proper mode, expect process`.

You can't change `--node-spec` after you create the trigger.
To move a trigger to another node, delete the trigger and create it again.

For request triggers, send `/api/v3/engine/<path>` requests to the node in `--node-spec`.
For the complete setup, see [Configure a standalone Processing Engine](/influxdb3/enterprise/admin/processing-engine/).

{{% /show-in %}}
