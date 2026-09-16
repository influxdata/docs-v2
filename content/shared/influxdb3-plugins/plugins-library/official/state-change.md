<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
The State Change Plugin provides comprehensive field monitoring and threshold detection for {{% product-name %}} data streams. Detect field value changes, monitor threshold conditions, and trigger notifications when specified criteria are met. Supports both scheduled batch monitoring and real-time data write monitoring with configurable stability checks and multi-channel alerts.

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. Some plugins support TOML configuration files, which can be specified using the plugin's `config_file_path` parameter.

If a plugin supports multiple trigger specifications, some parameters may depend on the trigger specification that you use.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Required parameters

| Parameter            | Type   | Default  | Description                                                                                                            |
|----------------------|--------|----------|------------------------------------------------------------------------------------------------------------------------|
| `measurement`        | string | required | Measurement to monitor for field changes                                                                               |
| `field_change_count` | string | required | Dot-separated field thresholds (for example, "temp:3.load:2" or "temp:3.disk.used:2"). Each count must be 1 or greater |
| `senders`            | string | required | Dot-separated notification channels with multi-channel alert support (Slack, Discord, etc.)                            |
| `window`             | string | required | Time window for analysis. Format: `<number><unit>`, units: `us`, `ms`, `s`, `min`, `h`, `d`, `w`. Must be positive     |

### Data write trigger parameters

| Parameter          | Type   | Default  | Description                                                                                                                                                 |
|--------------------|--------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `measurement`      | string | required | Measurement to monitor for threshold conditions                                                                                                             |
| `field_thresholds` | string | required | Threshold conditions with count-based and duration-based support (for example, "temp:30:10@status:ok:1h"). Counts must be 1 or greater; durations must be positive |
| `senders`          | string | required | Dot-separated notification channels with multi-channel alert support (Slack, Discord, HTTP, SMS, WhatsApp)                                                  |

### Notification parameters

| Parameter                 | Type   | Default  | Description                                                                             |
|---------------------------|--------|----------|-----------------------------------------------------------------------------------------|
| `influxdb3_auth_token`    | string | env var  | {{% product-name %}} API token with environment variable support for credential management        |
| `notification_text`       | string | template | Customizable message template for scheduled notifications with dynamic variables        |
| `notification_count_text` | string | template | Customizable message template for count-based notifications with dynamic variables     |
| `notification_time_text`  | string | template | Customizable message template for time-based notifications with dynamic variables      |
| `notification_path`       | string | "notify" | Notification endpoint path                                                              |
| `port_override`           | number | 8181     | InfluxDB port override                                                                  |

### Advanced parameters

| Parameter             | Type   | Default | Description                                                                               |
|-----------------------|--------|---------|-------------------------------------------------------------------------------------------|
| `state_change_window` | number | 1       | Recent values to check for stability (reduces noise from flapping fields)                 |
| `state_change_count`  | number | 1       | Changes within the stability window at which notifications start being suppressed         |

The stability check applies only when `state_change_window` is 2 or greater; the default of 1 leaves it off. Notifications are suppressed once the window contains `state_change_count` changes, so `state_change_count=3` is the setting that tolerates two flips.

### TOML configuration

| Parameter          | Type   | Default | Description                                                                      |
|--------------------|--------|---------|----------------------------------------------------------------------------------|
| `config_file_path` | string | none    | TOML config file path relative to `PLUGIN_DIR` (required for TOML configuration) |

*To use a TOML configuration file, set the `PLUGIN_DIR` environment variable and specify the `config_file_path` in the trigger arguments.* This is in addition to the `--plugin-dir` flag when starting {{% product-name %}}. Relative paths are resolved against the first directory that is set: `PLUGIN_DIR`, then `INFLUXDB3_PLUGIN_DIR`, then the parent of `VIRTUAL_ENV`. Only that directory is used — the file is not looked up in the remaining ones.

When `config_file_path` is set, the TOML file provides the whole configuration and inline trigger arguments are ignored. `INFLUXDB3_AUTH_TOKEN` from the environment still applies when `influxdb3_auth_token` is not set in the file. In TOML, `senders`, `field_thresholds`, and `field_change_count` use native structures (list, list of entries, table) instead of the inline string formats, though the inline strings are also accepted.

Data write triggers cache the loaded configuration for 10 minutes to keep the write path fast, so configuration changes take effect within that window.

Example TOML configuration files provided:

- [state_change_config_scheduler.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/state_change/state_change_config_scheduler.toml) - for scheduled triggers
- [state_change_config_data_writes.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/state_change/state_change_config_data_writes.toml) - for data write triggers

For more information on using TOML configuration files, see the Using TOML Configuration Files section in the [influxdb3_plugins/README.md](https://github.com/influxdata/influxdb3_plugins/blob/master/README.md).

### Channel-specific configuration

Notification channels require additional parameters based on the sender type (same as the [influxdata/notifier plugin](/influxdb3/version/plugins/library/official/notifier/)).

## Schema requirement

The plugin assumes that the table schema is already defined in the database, as it relies on this schema to retrieve field and tag names required for processing.

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled.
- **Notification Sender Plugin for {{% product-name %}}**: Required for sending notifications. See the [influxdata/notifier plugin](/influxdb3/version/plugins/library/official/notifier/).
- **Python packages**:
   - `influxdata-plugin-utils>=0.3.0` (configuration loading, parsing, and schema introspection)
   - `requests` (for HTTP notifications)

### Installation steps

1. Start {{% product-name %}} with the Processing Engine enabled (`--plugin-dir /path/to/plugins`):

   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```
2. Install required Python packages:

   ```bash
   influxdb3 install package "influxdata-plugin-utils>=0.3.0"
   influxdb3 install package requests
   ```
3. *Optional*: For notifications, install and configure the [influxdata/notifier plugin](/influxdb3/version/plugins/library/official/notifier/)

## Trigger setup

### Scheduled trigger

Create a trigger for periodic field change monitoring:

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/state_change/state_change_check_plugin.py" \
  --trigger-spec "every:10m" \
  --trigger-arguments "measurement=cpu,field_change_count=temp:3.load:2,window=10min,senders=slack,slack_webhook_url=$SLACK_WEBHOOK_URL" \
  state_change_scheduler
```
Set `SLACK_WEBHOOK_URL` to your Slack incoming webhook URL.

### Data write trigger

Create a trigger for real-time threshold monitoring:

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/state_change/state_change_check_plugin.py" \
  --trigger-spec "all_tables" \
  --trigger-arguments "measurement=cpu,field_thresholds=temp:30:10@status:ok:1h,senders=slack,slack_webhook_url=$SLACK_WEBHOOK_URL" \
  state_change_datawrite
```
Set `SLACK_WEBHOOK_URL` to your Slack incoming webhook URL.

### Enable triggers

```bash
influxdb3 enable trigger --database mydb state_change_scheduler
influxdb3 enable trigger --database mydb state_change_datawrite
```
## Example usage

### Example 1: Scheduled field change monitoring

Monitor field changes over a time window and alert when thresholds are exceeded:

```bash
# Write test data with changing values (7 writes = 6 changes)
influxdb3 write \
  --database sensors \
  "temperature,location=office value=22.5"
influxdb3 write \
  --database sensors \
  "temperature,location=office value=25.0"
influxdb3 write \
  --database sensors \
  "temperature,location=office value=22.8"
influxdb3 write \
  --database sensors \
  "temperature,location=office value=26.5"
influxdb3 write \
  --database sensors \
  "temperature,location=office value=23.0"
influxdb3 write \
  --database sensors \
  "temperature,location=office value=27.2"
influxdb3 write \
  --database sensors \
  "temperature,location=office value=24.0"

# Create and enable the trigger
influxdb3 create trigger \
  --database sensors \
  --path "gh:influxdata/state_change/state_change_check_plugin.py" \
  --trigger-spec "every:15m" \
  --trigger-arguments "measurement=temperature,field_change_count=value:5,window=1h,senders=slack,slack_webhook_url=$SLACK_WEBHOOK_URL" \
  temp_change_monitor

influxdb3 enable trigger --database sensors temp_change_monitor
```
Set `SLACK_WEBHOOK_URL` to your Slack incoming webhook URL.

**Expected output**

When the field changes 5 or more times within 1 hour, a notification is sent: "Field value in table temperature changed 6 times in window 1:00:00 for tags location=office"

### Example 2: Advanced scheduled field change monitoring

Monitor field changes over a time window and alert when thresholds are exceeded:

```bash
influxdb3 create trigger \
  --database sensors \
  --path "gh:influxdata/state_change/state_change_check_plugin.py" \
  --trigger-spec "every:15m" \
  --trigger-arguments "measurement=temperature,field_change_count=value:5,window=1h,senders=slack,slack_webhook_url=$SLACK_WEBHOOK_URL,notification_text=Temperature sensor $field changed $changes times in $window for tags $tags" \
  temp_change_monitor
```
Set `SLACK_WEBHOOK_URL` to your Slack incoming webhook URL.

### Real-time threshold detection

Monitor data writes for threshold conditions:

```bash
influxdb3 create trigger \
  --database monitoring \
  --path "gh:influxdata/state_change/state_change_check_plugin.py" \
  --trigger-spec "all_tables" \
  --trigger-arguments "measurement=system_metrics,field_thresholds=cpu_usage:80:5@memory_usage:90:10min,senders=discord,discord_webhook_url=$DISCORD_WEBHOOK_URL" \
  system_threshold_monitor
```
Set `DISCORD_WEBHOOK_URL` to your Discord incoming webhook URL.

### Multi-condition monitoring

Monitor multiple fields with different threshold types:

```bash
influxdb3 create trigger \
  --database application \
  --path "gh:influxdata/state_change/state_change_check_plugin.py" \
  --trigger-spec "all_tables" \
  --trigger-arguments "measurement=app_health,field_thresholds=error_rate:0.05:3@response_time:500:30s@status:down:1,senders=slack.sms,slack_webhook_url=$SLACK_WEBHOOK_URL,twilio_from_number=+1234567890,twilio_to_number=+0987654321" \
  app_health_monitor
```
Set `SLACK_WEBHOOK_URL` to your Slack incoming webhook URL.

## Code overview

### Files

- `state_change_check_plugin.py`: The main plugin code containing handlers for scheduled and data write triggers
- `state_change_config_scheduler.toml`: Example TOML configuration for scheduled triggers
- `state_change_config_data_writes.toml`: Example TOML configuration for data write triggers
- `test_state_change.py`: Pytest suite, runs without a live {{% product-name %}} server
- `requirements.txt`: Runtime dependencies (`influxdata-plugin-utils>=0.3.0`, `requests`)
- `requirements-dev.txt`: Development dependencies (`pytest`)

### Logging

Logs are stored in the trigger's database in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database YOUR_DATABASE "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'state_change_scheduler'"
```
### Main functions

#### `process_scheduled_call(influxdb3_local, call_time, args)`

Handles scheduled field change monitoring. Queries data within the specified window and counts field value changes.

#### `process_writes(influxdb3_local, table_batches, args)`

Handles real-time threshold monitoring on data writes. Evaluates incoming data against configured thresholds.

## Troubleshooting

### Common issues

#### Issue: No notifications triggered

**Solution**: Verify notification channel configuration (webhook URLs, credentials). Check threshold values are appropriate for your data. Ensure the Notifier Plugin is installed and configured. Review plugin logs for error messages.

#### Issue: Too many notifications

**Solution**: Adjust `state_change_window` and `state_change_count` for stability filtering. Increase threshold values to reduce sensitivity. Consider longer monitoring windows for scheduled triggers.

#### Issue: Authentication errors

**Solution**: Set `INFLUXDB3_AUTH_TOKEN` environment variable. Verify token has appropriate database permissions. Check Twilio credentials for SMS/WhatsApp notifications.

### Field threshold formats

**Count-based thresholds**

- Format: `field_name:"value":count`
- Example: `temp:"30.5":10` (10 consecutive occurrences of temperature = 30.5)
- The count must be an integer of 1 or greater

**Time-based thresholds**

- Format: `field_name:"value":duration`
- Example: `status:"error":5min` (status = error for 5 minutes)
- Supported units: `us`, `ms`, `s`, `min`, `h`, `d`, `w`; the duration must be positive

**Multiple conditions**

- Separate with `@`: `temp:"30":5@humidity:"high":10min`
- Segments that fail to parse are skipped with a warning; if none remain, the run stops with an error

In TOML, the same thresholds are written as entries: `field_thresholds = [["temp", 30.5, 10], ["status", "error", "5min"]]`.

### Message template variables

**Scheduled notifications**

- `$table`: Measurement name
- `$field`: Field name
- `$changes`: Number of changes detected
- `$window`: Time window
- `$tags`: Tag values

**Data write notifications**

- `$table`: Measurement name
- `$field`: Field name  
- `$value`: Threshold value
- `$duration`: Time duration or count
- `$row`: Unique row identifier

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
