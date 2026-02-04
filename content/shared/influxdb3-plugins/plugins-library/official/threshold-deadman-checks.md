
The Threshold Deadman Checks Plugin provides comprehensive monitoring capabilities for time series data in {{% product-name %}}, combining real-time threshold detection with deadman monitoring. Monitor field values against configurable thresholds, detect data absence patterns, and trigger multi-level alerts based on aggregated metrics. Features both scheduled batch monitoring and real-time data write monitoring with configurable trigger counts and severity levels.

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Required parameters

| Parameter     | Type   | Default  | Description                                                                                       |
|---------------|--------|----------|---------------------------------------------------------------------------------------------------|
| `measurement` | string | required | Measurement to monitor for deadman alerts and aggregation-based conditions                       |
| `senders`     | string | required | Dot-separated notification channels with multi-channel notification integration                   |
| `window`      | string | required | Time window for periodic data presence checking                                                   |

### Data write trigger parameters

| Parameter          | Type   | Default  | Description                                                                                                          |
|--------------------|--------|----------|----------------------------------------------------------------------------------------------------------------------|
| `measurement`      | string | required | Measurement to monitor for real-time threshold violations in dual monitoring mode                                   |
| `field_conditions` | string | required | Real-time threshold conditions with multi-level alerting (INFO, WARN, ERROR, CRITICAL severity levels)             |
| `senders`          | string | required | Dot-separated notification channels with multi-channel notification integration                                      |

### Threshold check parameters

| Parameter                  | Type    | Default | Description                                                                                                                                                       |
|----------------------------|---------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `field_aggregation_values` | string  | none    | Multi-level aggregation conditions with aggregation support for avg, min, max, count, sum, median, stddev, first_value, last_value, var, and approx_median values |
| `deadman_check`            | boolean | false   | Enable deadman detection to monitor for data absence and missing data streams                                                                                     |
| `interval`                 | string  | "5min"  | Configurable aggregation time interval for batch processing with performance optimization                                                                         |
| `trigger_count`            | number  | 1       | Configurable triggers requiring multiple consecutive failures before alerting                                                                                     |

### Notification parameters

| Parameter                     | Type   | Default  | Description                                                                                |
|-------------------------------|--------|----------|--------------------------------------------------------------------------------------------|
| `influxdb3_auth_token`        | string | env var  | {{% product-name %}} API token with environment variable support                                     |
| `notification_deadman_text`   | string | template | Customizable deadman alert template message with dynamic variables                         |
| `notification_threshold_text` | string | template | Customizable threshold alert template message with dynamic variables                       |
| `notification_text`           | string | template | Customizable notification template message for data write triggers with dynamic variables  |
| `notification_path`           | string | "notify" | Notification endpoint path with retry logic and exponential backoff                        |
| `port_override`               | number | 8181     | InfluxDB port override for notification delivery                                           |

### TOML configuration

| Parameter          | Type   | Default | Description                                                                      |
|--------------------|--------|---------|----------------------------------------------------------------------------------|
| `config_file_path` | string | none    | TOML config file path relative to `PLUGIN_DIR` (required for TOML configuration) |

*To use a TOML configuration file, set the `PLUGIN_DIR` environment variable and specify the `config_file_path` in the trigger arguments.* This is in addition to the `--plugin-dir` flag when starting {{% product-name %}}.

Example TOML configuration files provided:

- [threshold_deadman_config_scheduler.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/threshold_deadman_checks/threshold_deadman_config_scheduler.toml) - for scheduled triggers
- [threshold_deadman_config_data_writes.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/threshold_deadman_checks/threshold_deadman_config_data_writes.toml) - for data write triggers

For more information on using TOML configuration files, see the Using TOML Configuration Files section in the [influxdb3_plugins/README.md](https://github.com/influxdata/influxdb3_plugins/blob/master/README.md).

### Channel-specific configuration

Notification channels require additional parameters based on the sender type (same as the [influxdata/notifier plugin](../notifier/README.md)).

## Schema requirement

The plugin assumes that the table schema is already defined in the database, as it relies on this schema to retrieve field and tag names required for processing.

## Software requirements

- **InfluxDB v3 Core/Enterprise**: with the Processing Engine enabled.
- **Notification Sender Plugin for {{% product-name %}}**: This plugin is required for sending notifications. See the [influxdata/notifier plugin](../notifier/README.md).

## Installation steps

1. **Start {{% product-name %}} with the Processing Engine enabled** (`--plugin-dir /path/to/plugins`):

   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```
2. **Install required Python packages**:

   ```bash
   influxdb3 install package requests
   ```
3. **Optional**: For notifications, install and configure the [influxdata/notifier plugin](../notifier/README.md)

## Trigger setup

### Scheduled trigger

Create a trigger for periodic threshold and deadman checks:

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/threshold_deadman_checks/threshold_deadman_checks_plugin.py" \
  --trigger-spec "every:10m" \
  --trigger-arguments "measurement=cpu,senders=slack,field_aggregation_values=temp:avg@>=30-ERROR,window=10m,trigger_count=3,deadman_check=true,slack_webhook_url=https://hooks.slack.com/services/..." \
  threshold_scheduler
```
### Data write trigger

Create a trigger for real-time threshold monitoring:

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/threshold_deadman_checks/threshold_deadman_checks_plugin.py" \
  --trigger-spec "all_tables" \
  --trigger-arguments "measurement=cpu,field_conditions=temp>30-WARN:status==ok-INFO,senders=slack,trigger_count=2,slack_webhook_url=https://hooks.slack.com/services/..." \
  threshold_datawrite
```
### Enable triggers

```bash
influxdb3 enable trigger --database mydb threshold_scheduler
influxdb3 enable trigger --database mydb threshold_datawrite
```
## Example usage

### Example 1: Basic threshold monitoring

Write test data and monitor for threshold violations:

```bash
# Write test data
influxdb3 write \
  --database sensors \
  "heartbeat,host=server1 status=1"

influxdb3 write \
  --database sensors \
  "heartbeat,host=server1 status=0"

# Create and enable the trigger
influxdb3 create trigger \
  --database sensors \
  --path "gh:influxdata/threshold_deadman_checks/threshold_deadman_checks_plugin.py" \
  --trigger-spec "every:5m" \
  --trigger-arguments "measurement=heartbeat,senders=slack,window=5m,deadman_check=true,slack_webhook_url=https://hooks.slack.com/services/..." \
  heartbeat_monitor

influxdb3 enable trigger --database sensors heartbeat_monitor

# Query to verify data
influxdb3 query \
  --database sensors \
  "SELECT * FROM heartbeat ORDER BY time DESC LIMIT 5"
```
**Expected output**

When no data is received within the window, a deadman alert is sent: "CRITICAL: No heartbeat data from heartbeat between 2025-06-01T10:00:00Z and 2025-06-01T10:05:00Z"

### Example 2: Deadman monitoring

Monitor for data absence and alert when no data is received:

```bash
influxdb3 create trigger \
  --database sensors \
  --path "gh:influxdata/threshold_deadman_checks/threshold_deadman_checks_plugin.py" \
  --trigger-spec "every:15m" \
  --trigger-arguments "measurement=heartbeat,senders=sms,window=10m,deadman_check=true,trigger_count=2,twilio_from_number=+1234567890,twilio_to_number=+0987654321,notification_deadman_text=CRITICAL: No heartbeat data from \$table between \$time_from and \$time_to" \
  heartbeat_monitor
```
### Multi-level threshold monitoring

Monitor aggregated values with different severity levels:

```bash
influxdb3 create trigger \
  --database monitoring \
  --path "gh:influxdata/threshold_deadman_checks/threshold_deadman_checks_plugin.py" \
  --trigger-spec "every:5m" \
  --trigger-arguments "measurement=system_metrics,senders=slack.discord,field_aggregation_values='cpu_usage:avg@>=80-WARN cpu_usage:avg@>=95-ERROR memory_usage:max@>=90-WARN',window=5m,interval=1min,trigger_count=3,slack_webhook_url=https://hooks.slack.com/services/...,discord_webhook_url=https://discord.com/api/webhooks/..." \
  system_threshold_monitor
```
### Real-time field condition monitoring

Monitor data writes for immediate threshold violations:

```bash
influxdb3 create trigger \
  --database applications \
  --path "gh:influxdata/threshold_deadman_checks/threshold_deadman_checks_plugin.py" \
  --trigger-spec "all_tables" \
  --trigger-arguments "measurement=response_times,field_conditions=latency>500-WARN:latency>1000-ERROR:error_rate>0.05-CRITICAL,senders=http,trigger_count=1,http_webhook_url=https://alertmanager.example.com/webhook,notification_text=[\$level] Application alert: \$field \$op_sym \$compare_val (actual: \$actual)" \
  app_performance_monitor
```
### Combined monitoring

Monitor both aggregation thresholds and deadman conditions:

```bash
influxdb3 create trigger \
  --database comprehensive \
  --path "gh:influxdata/threshold_deadman_checks/threshold_deadman_checks_plugin.py" \
  --trigger-spec "every:10m" \
  --trigger-arguments "measurement=temperature_sensors,senders=whatsapp,field_aggregation_values='temperature:avg@>=35-WARN temperature:max@>=40-ERROR',window=15m,deadman_check=true,trigger_count=2,twilio_from_number=+1234567890,twilio_to_number=+0987654321" \
  comprehensive_sensor_monitor
```

## Code overview

### Files

- `threshold_deadman_checks_plugin.py`: The main plugin code containing handlers for scheduled and data write triggers
- `threshold_deadman_config_scheduler.toml`: Example TOML configuration for scheduled triggers
- `threshold_deadman_config_data_writes.toml`: Example TOML configuration for data write triggers

### Logging

Logs are stored in the `_internal` database in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'threshold_scheduler'"
```
### Main functions

#### `process_scheduled_call(influxdb3_local, call_time, args)`

Handles scheduled threshold and deadman checks. Queries data within the specified window, evaluates aggregation-based conditions, and checks for data absence.

#### `process_writes(influxdb3_local, table_batches, args)`

Handles real-time threshold monitoring on data writes. Evaluates incoming data against configured field conditions with multi-level severity.

## Troubleshooting

### Common issues

#### Issue: No alerts triggered

**Solution**: Verify threshold values are appropriate for your data ranges. Check that notification channels are properly configured. Ensure the Notifier Plugin is installed and accessible. Review plugin logs for configuration errors.

#### Issue: False positive alerts

**Solution**: Increase `trigger_count` to require more consecutive failures. Adjust threshold values to be less sensitive. Consider longer aggregation intervals for noisy data.

#### Issue: Missing deadman alerts

**Solution**: Verify `deadman_check=true` is set in configuration. Check that the measurement name matches existing data. Ensure the time window is appropriate for your data frequency.

#### Issue: Authentication issues

**Solution**: Set `INFLUXDB3_AUTH_TOKEN` environment variable. Verify API token has required database permissions. Check Twilio credentials for SMS/WhatsApp notifications.

### Configuration formats

**Aggregation conditions (scheduled)**

- Format: `field:aggregation@operator value-level`
- Example: `temp:avg@>=30-ERROR`
- Multiple conditions: `"temp:avg@>=30-WARN humidity:min@<40-INFO"`

**Field conditions (data write)**

- Format: `field operator value-level`
- Example: `temp>30-WARN:status==ok-INFO`
- Supported operators: `>`, `<`, `>=`, `<=`, `==`, `!=`

**Supported aggregations**

- `avg`: Average value
- `min`: Minimum value  
- `max`: Maximum value
- `count`: Count of records
- `sum`: Sum of values
- `median`: Median value
- `stddev`: Standard deviation
- `first_value`: First value in time interval
- `last_value`: Last value in time interval
- `var`: Variance of values
- `approx_median`: Approximate median (faster than exact median)

### Message template variables

**Deadman notifications**

- `$table`: Measurement name
- `$time_from`: Start of checked period
- `$time_to`: End of checked period

**Threshold notifications (scheduled)**

- `$level`: Alert severity level
- `$table`: Measurement name
- `$field`: Field name
- `$aggregation`: Aggregation type
- `$op_sym`: Operator symbol
- `$compare_val`: Threshold value
- `$actual`: Actual measured value
- `$row`: Unique identifier

**Threshold notifications (data write)**

- `$level`: Alert severity level
- `$field`: Field name
- `$op_sym`: Operator symbol
- `$compare_val`: Threshold value
- `$actual`: Actual field value

### Row identification

The `row` variable uniquely identifies alert contexts using format: `measurement:level:tag1=value1:tag2=value2`

This ensures trigger counts are maintained independently for each unique combination of measurement, severity level, and tag values.

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.