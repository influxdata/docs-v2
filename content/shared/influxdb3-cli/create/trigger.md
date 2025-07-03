
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

| Option |                     | Description                                                                                              |
| :----- | :------------------ | :------------------------------------------------------------------------------------------------------- |
| `-H`   | `--host`            | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`)                 |
| `-d`   | `--database`        | _({{< req >}})_ Name of the database to operate on                                                       |
|        | `--token`           | _({{< req >}})_ Authentication token                                                                     |
|        | `--plugin-filename` | _({{< req >}})_ Name of the file, stored in the server's `plugin-dir`, that contains the Python plugin code to run     | 
|        | `--trigger-spec`    | Trigger specification: `table:<TABLE_NAME>`, `all_tables`, `every:<DURATION>`, `cron:<EXPRESSION>`, or `request:<REQUEST_PATH>`                             |
|        | `--disabled`        | Create the trigger in disabled state                                                                     |
|        | `--tls-ca`          | Path to a custom TLS certificate authority (for testing or self-signed certificates)                     |
| `-h`   | `--help`            | Print help information                                                                                   |
|        | `--help-all`        | Print detailed help information                                                                          |

If you want to use a plugin from the [Plugin Library](https://github.com/influxdata/influxdb3_plugins) repo, use the url path with `gh:` specified as the prefix.
For example, to use the [System Metrics](https://github.com/influxdata/influxdb3_plugins/blob/main/examples/schedule/system_metrics/system_metrics.py) plugin, the plugin filename is `gh:examples/schedule/system_metrics/system_metrics.py`.


### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

The following examples show how to use the `influxdb3 create trigger` command to create triggers in different scenarios.


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

This is useful when you want a trigger to apply to any table in the database, regardless of name.

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

{{% /code-placeholders %}}

{{% show-in "enterprise" %}}
> [!Warning]
> #### Request trigger specification format differs between CLI and API
> 
> Due to a bug in InfluxDB 3 Enterprise, the request trigger specification format differs:
> 
> - **CLI**: `request:<REQUEST_PATH>` (same as Core CLI and API)
> - **Enterprise API**: `{"request_path": {"path": "<REQUEST_PATH>"}}`
> 
> See the [API reference](/influxdb3/enterprise/api/#operation/PostConfigureProcessingEngineTrigger) for examples. Use `influxdb3 show summary` to verify the actual trigger specification.
{{% /show-in %}}
