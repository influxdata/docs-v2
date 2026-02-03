The State Change Plugin provides comprehensive field monitoring and threshold detection for {{% product-name %}} data streams. Detect field value changes, monitor threshold conditions, and trigger notifications when specified criteria are met. Supports both scheduled batch monitoring and real-time data write monitoring with configurable stability checks and multi-channel alerts.

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. Some plugins support TOML configuration files, which can be specified using the plugin's `config_file_path` parameter.

If a plugin supports multiple trigger specifications, some parameters may depend on the trigger specification that you use.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Required parameters

| Parameter            | Type   | Default  | Description                                                                                  |
|----------------------|--------|----------|----------------------------------------------------------------------------------------------|
| `measurement`        | string | required | Measurement to monitor for field changes                                                     |
| `field_change_count` | string | required | Dot-separated field thresholds (for example, "temp:3.load:2"). Supports count-based conditions    |
| `senders`            | string | required | Dot-separated notification channels with multi-channel alert support (Slack, Discord, etc.) |
| `window`             | string | required | Time window for analysis. Format: `<number><unit>` (for example, "10m", "1h")                      |

### Data write trigger parameters

| Parameter          | Type   | Default  | Description                                                                                                    |
|--------------------|--------|----------|----------------------------------------------------------------------------------------------------------------|
| `measurement`      | string | required | Measurement to monitor for threshold conditions                                                                |
| `field_thresholds` | string | required | Flexible threshold conditions with count-based and duration-based support (for example, "temp:30:10@status:ok:1h") |
| `senders`          | string | required | Dot-separated notification channels with multi-channel alert support (Slack, Discord, HTTP, SMS, WhatsApp)   |

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
| `state_change_window` | number | 1       | Recent values to check for stability (configurable state change detection to reduce noise) |
| `state_change_count`  | number | 1       | Max changes allowed within stability window (configurable state change detection)         |

### TOML configuration

| Parameter          | Type   | Default | Description                                                                      |
|--------------------|--------|---------|----------------------------------------------------------------------------------|
| `config_file_path` | string | none    | TOML config file path relative to `PLUGIN_DIR` (required for TOML configuration) |

*To use a TOML configuration file, set the `PLUGIN_DIR` environment variable and specify the `config_file_path` in the trigger arguments.* This is in addition to the `--plugin-dir` flag when starting {{% product-name %}}.

Example TOML configuration files provided:

- [state_change_config_scheduler.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/state_change/state_change_config_scheduler.toml) - for scheduled triggers
- [state_change_config_data_writes.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/state_change/state_change_config_data_writes.toml) - for data write triggers

For more information on using TOML configuration files, see the Using TOML Configuration Files section in the [influxdb3_plugins/README.md](https://github.com/influxdata/influxdb3_plugins/blob/master/README.md).

### Channel-specific configuration

Notification channels require additional parameters based on the sender type (same as the [influxdata/notifier plugin](../notifier/README.md)).

## Schema requirement

The plugin assumes that the table schema is already defined in the database, as it relies on this schema to retrieve field and tag names required for processing.

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled.
- **Notification Sender Plugin for {{% product-name %}}**: Required for sending notifications. See the [influxdata/notifier plugin](../notifier/README.md).
- **Python packages**:
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
   influxdb3 install package requests
   ```
3. *Optional*: For notifications, install and configure the [influxdata/notifier plugin](../notifier/README.md)

## Trigger setup

### Scheduled trigger

Create a trigger for periodic field change monitoring:

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/state_change/state_change_check_plugin.py" \
  --trigger-spec "every:10m" \
  --trigger-arguments "measurement=cpu,field_change_count=temp:3.load:2,window=10m,senders=slack,slack_webhook_url=https://hooks.slack.com/services/..." \
  state_change_scheduler
```
### Data write trigger

Create a trigger for real-time threshold monitoring:

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/state_change/state_change_check_plugin.py" \
  --trigger-spec "all_tables" \
  --trigger-arguments "measurement=cpu,field_thresholds=temp:30:10@status:ok:1h,senders=slack,slack_webhook_url=https://hooks.slack.com/services/..." \
  state_change_datawrite
```
### Enable triggers

```bash
influxdb3 enable trigger --database mydb state_change_scheduler
influxdb3 enable trigger --database mydb state_change_datawrite
```
## Example usage

### Example 1: Scheduled field change monitoring

Monitor field changes over a time window and alert when thresholds are exceeded:

```bash
# Write test data with changing values
influxdb3 write \
  --database sensors \
  "temperature,location=office value=22.5"

influxdb3 write \
  --database sensors \
  "temperature,location=office value=25.0"

influxdb3 write \
  --database sensors \
  "temperature,location=office value=28.5"

# Create and enable the trigger
influxdb3 create trigger \
  --database sensors \
  --path "gh:influxdata/state_change/state_change_check_plugin.py" \
  --trigger-spec "every:15m" \
  --trigger-arguments "measurement=temperature,field_change_count=value:5,window=1h,senders=slack,slack_webhook_url=https://hooks.slack.com/services/..." \
  temp_change_monitor

influxdb3 enable trigger --database sensors temp_change_monitor

# Query to verify data
influxdb3 query \
  --database sensors \
  "SELECT * FROM temperature ORDER BY time DESC LIMIT 5"
```
**Expected output**

When the field changes more than 5 times within 1 hour, a notification is sent: "Temperature sensor value changed 6 times in 1h for tags location=office"

### Example 2: Advanced scheduled field change monitoring

Monitor field changes over a time window and alert when thresholds are exceeded:

```bash
influxdb3 create trigger \
  --database sensors \
  --path "gh:influxdata/state_change/state_change_check_plugin.py" \
  --trigger-spec "every:15m" \
  --trigger-arguments "measurement=temperature,field_change_count=value:5,window=1h,senders=slack,slack_webhook_url=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX,notification_text=Temperature sensor $field changed $changes times in $window for tags $tags" \
  temp_change_monitor
```
### Real-time threshold detection

Monitor data writes for threshold conditions:

```bash
influxdb3 create trigger \
  --database monitoring \
  --path "gh:influxdata/state_change/state_change_check_plugin.py" \
  --trigger-spec "all_tables" \
  --trigger-arguments "measurement=system_metrics,field_thresholds=cpu_usage:80:5@memory_usage:90:10min,senders=discord,discord_webhook_url=https://discord.com/api/webhooks/..." \
  system_threshold_monitor
```
### Multi-condition monitoring

Monitor multiple fields with different threshold types:

```bash
influxdb3 create trigger \
  --database application \
  --path "gh:influxdata/state_change/state_change_check_plugin.py" \
  --trigger-spec "all_tables" \
  --trigger-arguments "measurement=app_health,field_thresholds=error_rate:0.05:3@response_time:500:30s@status:down:1,senders=slack.sms,slack_webhook_url=https://hooks.slack.com/services/...,twilio_from_number=+1234567890,twilio_to_number=+0987654321" \
  app_health_monitor
```
## Code overview

### Files

- `state_change_check_plugin.py`: The main plugin code containing handlers for scheduled and data write triggers
- `state_change_config_scheduler.toml`: Example TOML configuration for scheduled triggers
- `state_change_config_data_writes.toml`: Example TOML configuration for data write triggers

### Logging

Logs are stored in the `_internal` database in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'state_change_scheduler'"
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
- Example: `temp:"30.5":10` (10 occurrences of temperature = 30.5)

**Time-based thresholds**

- Format: `field_name:"value":duration`
- Example: `status:"error":5min` (status = error for 5 minutes)
- Supported units: `s`, `min`, `h`, `d`, `w`

**Multiple conditions**

- Separate with `@`: `temp:"30":5@humidity:"high":10min`

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