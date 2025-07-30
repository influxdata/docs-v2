The Threshold Deadman Checks Plugin provides comprehensive monitoring capabilities for time series data in InfluxDB 3, combining real-time threshold detection with deadman monitoring.
Monitor field values against configurable thresholds, detect data absence patterns, and trigger multi-level alerts based on aggregated metrics.
Features both scheduled batch monitoring and real-time data write monitoring with configurable trigger counts and severity levels.

## Configuration

### Scheduled trigger parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `measurement` | string | required | Measurement to monitor |
| `senders` | string | required | Dot-separated notification channels |
| `window` | string | required | Time window for data checking |

### Data write trigger parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `measurement` | string | required | Measurement to monitor for threshold conditions |
| `field_conditions` | string | required | Threshold conditions (for example, `"temp>30-WARN:status==ok-INFO"`) |
| `senders` | string | required | Dot-separated notification channels |

### Threshold check parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `field_aggregation_values` | string | none | Aggregation conditions for scheduled checks |
| `deadman_check` | boolean | false | Enable deadman data presence checking |
| `interval` | string | "5min" | Aggregation time interval |
| `trigger_count` | number | 1 | Consecutive failures before alerting |

### Notification parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `influxdb3_auth_token` | string | env var | InfluxDB 3 API token |
| `notification_deadman_text` | string | template | Deadman alert message template |
| `notification_threshold_text` | string | template | Threshold alert message template |
| `notification_text` | string | template | General notification template (data write) |
| `notification_path` | string | "notify" | Notification endpoint path |
| `port_override` | number | 8181 | InfluxDB port override |
| `config_file_path` | string | none | TOML config file path relative to PLUGIN_DIR |

### Channel-specific configuration

Notification channels require additional parameters based on the sender type (same as the [Notifier Plugin](../notifier/README.md)).

## Schema requirements

The plugin assumes that the table schema is already defined in the database, as it relies on this schema to retrieve field and tag names required for processing.

> [!WARNING]
> #### Requires existing schema
>
> By design, the plugin returns an error if the schema doesn't exist or doesn't contain the expected columns.

### TOML configuration

| Parameter          | Type   | Default | Description                                                                      |
|--------------------|--------|---------|----------------------------------------------------------------------------------|
| `config_file_path` | string | none    | TOML config file path relative to `PLUGIN_DIR` (required for TOML configuration) |

*To use a TOML configuration file, set the `PLUGIN_DIR` environment variable and specify the `config_file_path` in the trigger arguments.* This is in addition to the `--plugin-dir` flag when starting InfluxDB 3.

Example TOML configuration files provided:
- [threshold_deadman_config_scheduler.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/threshold_deadman_checks/threshold_deadman_config_scheduler.toml) - for scheduled triggers
- [threshold_deadman_config_data_writes.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/threshold_deadman_checks/threshold_deadman_config_data_writes.toml) - for data write triggers

For more information on using TOML configuration files, see the Using TOML Configuration Files section in the [influxdb3_plugins
/README.md](https://github.com/influxdata/influxdb3_plugins/blob/master/README.md).

## Installation

1. Start {{% product-name %}} with the Processing Engine enabled (`--plugin-dir /path/to/plugins`)

2. Install required Python packages:

    - `requests` (for HTTP requests)
  
    ```bash
    influxdb3 install package requests
    ```

### Create scheduled trigger

Create a trigger for periodic threshold and deadman checks:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename threshold_deadman_checks_plugin.py \
  --trigger-spec "every:10m" \
  --trigger-arguments "measurement=cpu,senders=slack,field_aggregation_values=temp:avg@>=30-ERROR,window=10m,trigger_count=3,deadman_check=true,slack_webhook_url=https://hooks.slack.com/services/..." \
  threshold_scheduler
```

### Create data write trigger

Create a trigger for real-time threshold monitoring:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename threshold_deadman_checks_plugin.py \
  --trigger-spec "all_tables" \
  --trigger-arguments "measurement=cpu,field_conditions=temp>30-WARN:status==ok-INFO,senders=slack,trigger_count=2,slack_webhook_url=https://hooks.slack.com/services/..." \
  threshold_datawrite
```

### Enable triggers

```bash
influxdb3 enable trigger --database mydb threshold_scheduler
influxdb3 enable trigger --database mydb threshold_datawrite
```

## Examples

### Deadman monitoring

Monitor for data absence and alert when no data is received:

```bash
influxdb3 create trigger \
  --database sensors \
  --plugin-filename threshold_deadman_checks_plugin.py \
  --trigger-spec "every:15m" \
  --trigger-arguments "measurement=heartbeat,senders=sms,window=10m,deadman_check=true,trigger_count=2,twilio_from_number=+1234567890,twilio_to_number=+0987654321,notification_deadman_text=CRITICAL: No heartbeat data from \$table between \$time_from and \$time_to" \
  heartbeat_monitor
```

### Multi-level threshold monitoring

Monitor aggregated values with different severity levels:

```bash
influxdb3 create trigger \
  --database monitoring \
  --plugin-filename threshold_deadman_checks_plugin.py \
  --trigger-spec "every:5m" \
  --trigger-arguments "measurement=system_metrics,senders=slack.discord,field_aggregation_values=cpu_usage:avg@>=80-WARN\$cpu_usage:avg@>=95-ERROR\$memory_usage:max@>=90-WARN,window=5m,interval=1min,trigger_count=3,slack_webhook_url=https://hooks.slack.com/services/...,discord_webhook_url=https://discord.com/api/webhooks/..." \
  system_threshold_monitor
```

### Real-time field condition monitoring

Monitor data writes for immediate threshold violations:

```bash
influxdb3 create trigger \
  --database applications \
  --plugin-filename threshold_deadman_checks_plugin.py \
  --trigger-spec "all_tables" \
  --trigger-arguments "measurement=response_times,field_conditions=latency>500-WARN:latency>1000-ERROR:error_rate>0.05-CRITICAL,senders=http,trigger_count=1,http_webhook_url=https://alertmanager.example.com/webhook,notification_text=[\$level] Application alert: \$field \$op_sym \$compare_val (actual: \$actual)" \
  app_performance_monitor
```

### Combined monitoring

Monitor both aggregation thresholds and deadman conditions:

```bash
influxdb3 create trigger \
  --database comprehensive \
  --plugin-filename threshold_deadman_checks_plugin.py \
  --trigger-spec "every:10m" \
  --trigger-arguments "measurement=temperature_sensors,senders=whatsapp,field_aggregation_values=temperature:avg@>=35-WARN\$temperature:max@>=40-ERROR,window=15m,deadman_check=true,trigger_count=2,twilio_from_number=+1234567890,twilio_to_number=+0987654321" \
  comprehensive_sensor_monitor
```

## Features

- **Dual monitoring modes**: Scheduled aggregation checks and real-time data write monitoring
- **Deadman detection**: Monitor for data absence and missing data streams
- **Multi-level alerting**: Support for INFO, WARN, ERROR, and CRITICAL severity levels
- **Aggregation support**: Monitor avg, min, max, count, sum, derivative, and median values
- **Configurable triggers**: Require multiple consecutive failures before alerting
- **Multi-channel notifications**: Integration with various notification systems
- **Template messages**: Customizable alert templates with dynamic variables
- **Performance optimization**: Measurement and tag caching for improved efficiency

## Troubleshooting

### Common issues

**No alerts triggered**
- Verify threshold values are appropriate for your data ranges
- Check that notification channels are properly configured
- Ensure the Notifier Plugin is installed and accessible
- Review plugin logs for configuration errors

**False positive alerts**
- Increase `trigger_count` to require more consecutive failures
- Adjust threshold values to be less sensitive
- Consider longer aggregation intervals for noisy data

**Missing deadman alerts**
- Verify `deadman_check=true` is set in configuration
- Check that the measurement name matches existing data
- Ensure the time window is appropriate for your data frequency

**Authentication issues**
- Set `INFLUXDB3_AUTH_TOKEN` environment variable
- Verify API token has required database permissions
- Check Twilio credentials for SMS/WhatsApp notifications

### Configuration formats

**Aggregation conditions (scheduled)**
- Format: `field:aggregation@"operator value-level"`
- Example: `temp:avg@">=30-ERROR"`
- Multiple conditions: `temp:avg@">=30-WARN"$humidity:min@"<40-INFO"`

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
- `derivative`: Rate of change
- `median`: Median value

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

The `row` variable uniquely identifies alert contexts using format:
`measurement:level:tag1=value1:tag2=value2`

This ensures trigger counts are maintained independently for each unique combination of measurement, severity level, and tag values.


## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for {{% product-name %}}.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.