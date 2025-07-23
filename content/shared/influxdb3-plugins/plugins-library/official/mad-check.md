The MAD-Based Anomaly Detection Plugin provides real-time anomaly detection for time series data in InfluxDB 3 using Median Absolute Deviation (MAD).
Detect outliers in your field values as data is written, with configurable thresholds for both count-based and duration-based alerts.
The plugin maintains in-memory deques for efficient computation and integrates with the Notification Sender Plugin to deliver alerts via multiple channels.

## Configuration

### Required parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `measurement` | string | required | Source measurement to monitor for anomalies |
| `mad_thresholds` | string | required | MAD threshold conditions. Format: `field:k:window_count:threshold` |
| `senders` | string | required | Dot-separated list of notification channels (for example, `"slack.discord"`) |

### MAD threshold parameters

| Component | Description | Example |
|-----------|-------------|---------|
| `field_name` | The numeric field to monitor | `temp` |
| `k` | MAD multiplier for anomaly threshold | `2.5` |
| `window_count` | Number of recent points for MAD computation | `20` |
| `threshold` | Count (integer) or duration (for example, `"2m"`, `"1h"`) | `5` or `2m` |

Multiple thresholds are separated by `@`: `temp:2.5:20:5@load:3:10:2m`

### Optional parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `influxdb3_auth_token` | string | env var | API token for InfluxDB 3 (or use INFLUXDB3_AUTH_TOKEN env var) |
| `state_change_count` | string | "0" | Maximum allowed value flips before suppressing notifications |
| `notification_count_text` | string | see below | Template for count-based alerts with variables: $table, $field, $threshold_count, $tags |
| `notification_time_text` | string | see below | Template for duration-based alerts with variables: $table, $field, $threshold_time, $tags |
| `notification_path` | string | "notify" | URL path for the notification sending plugin |
| `port_override` | string | "8181" | Port number where InfluxDB accepts requests |
| `config_file_path` | string | none | Path to TOML config file relative to PLUGIN_DIR |

Default notification templates:
- Count: `"MAD count alert: Field $field in $table outlier for $threshold_count consecutive points. Tags: $tags"`
- Time: `"MAD duration alert: Field $field in $table outlier for $threshold_time. Tags: $tags"`

### Notification channel parameters

#### Slack
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slack_webhook_url` | string | Yes | Webhook URL from Slack |
| `slack_headers` | string | No | Base64-encoded HTTP headers |

#### Discord
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `discord_webhook_url` | string | Yes | Webhook URL from Discord |
| `discord_headers` | string | No | Base64-encoded HTTP headers |

#### HTTP
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `http_webhook_url` | string | Yes | Custom webhook URL for POST requests |
| `http_headers` | string | No | Base64-encoded HTTP headers |

#### SMS/WhatsApp (via Twilio)
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `twilio_sid` | string | Yes | Twilio Account SID (or use TWILIO_SID env var) |
| `twilio_token` | string | Yes | Twilio Auth Token (or use TWILIO_TOKEN env var) |
| `twilio_from_number` | string | Yes | Sender phone number |
| `twilio_to_number` | string | Yes | Recipient phone number |

## Requirements

### Software requirements
- InfluxDB 3 Core or Enterprise with Processing Engine enabled
- Python packages:
  - `requests` (for notification delivery)
- Notification Sender Plugin (required for sending alerts)

### Installation steps

1. Start InfluxDB 3 with plugin support:
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

3. Install and configure the [Notification Sender Plugin](https://github.com/influxdata/influxdb3_plugins/tree/main/influxdata/notifier)

## Trigger setup

### Real-time anomaly detection

Detect anomalies as data is written:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/mad_check/mad_check_plugin.py \
  --trigger-spec "all_tables" \
  --trigger-arguments 'measurement=cpu,mad_thresholds="temp:2.5:20:5@load:3:10:2m",senders=slack,slack_webhook_url="https://hooks.slack.com/services/..."' \
  mad_anomaly_detector
```

## Example usage

### Example 1: Basic count-based anomaly detection

Detect when temperature exceeds 2.5 MADs from the median for 5 consecutive points:

```bash
# Create trigger for count-based detection
influxdb3 create trigger \
  --database sensors \
  --plugin-filename gh:influxdata/mad_check/mad_check_plugin.py \
  --trigger-spec "all_tables" \
  --trigger-arguments 'measurement=environment,mad_thresholds="temperature:2.5:20:5",senders=slack,slack_webhook_url="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"' \
  temp_anomaly_detector

# Write test data with an anomaly
influxdb3 write \
  --database sensors \
  "environment,room=office temperature=22.1"
influxdb3 write \
  --database sensors \
  "environment,room=office temperature=22.3"
influxdb3 write \
  --database sensors \
  "environment,room=office temperature=45.8"  # Anomaly
# Continue writing anomalous values...
```

### Expected results
- Plugin maintains a 20-point window of recent temperature values
- Computes median and MAD from this window
- When temperature exceeds median ± 2.5*MAD for 5 consecutive points, sends Slack notification
- Notification includes: "MAD count alert: Field temperature in environment outlier for 5 consecutive points. Tags: room=office"

### Example 2: Duration-based anomaly detection with multiple fields

Monitor CPU load and memory usage with different thresholds:

```bash
# Create trigger with multiple thresholds
influxdb3 create trigger \
  --database monitoring \
  --plugin-filename gh:influxdata/mad_check/mad_check_plugin.py \
  --trigger-spec "all_tables" \
  --trigger-arguments 'measurement=system_metrics,mad_thresholds="cpu_load:3:30:2m@memory_used:2.5:30:5m",senders=slack.discord,slack_webhook_url="https://hooks.slack.com/...",discord_webhook_url="https://discord.com/api/webhooks/..."' \
  system_anomaly_detector
```

### Expected results
- Monitors two fields independently:
  - `cpu_load`: Alerts when exceeds 3 MADs for 2 minutes
  - `memory_used`: Alerts when exceeds 2.5 MADs for 5 minutes
- Sends notifications to both Slack and Discord

### Example 3: Anomaly detection with flip suppression

Prevent alert fatigue from rapidly fluctuating values:

```bash
# Create trigger with flip suppression
influxdb3 create trigger \
  --database iot \
  --plugin-filename gh:influxdata/mad_check/mad_check_plugin.py \
  --trigger-spec "all_tables" \
  --trigger-arguments 'measurement=sensor_data,mad_thresholds="vibration:2:50:10",state_change_count=3,senders=http,http_webhook_url="https://api.example.com/alerts",notification_count_text="Vibration anomaly detected on $table. Field: $field, Tags: $tags"' \
  vibration_monitor
```

### Expected results
- Detects vibration anomalies exceeding 2 MADs for 10 consecutive points
- If values flip between normal/anomalous more than 3 times in the 50-point window, suppresses notifications
- Sends custom formatted message to HTTP endpoint

## Using TOML Configuration Files

This plugin supports using TOML configuration files to specify all plugin arguments.

### Important Requirements

**To use TOML configuration files, you must set the `PLUGIN_DIR` environment variable in the InfluxDB 3 host environment.**

### Setting Up TOML Configuration

1. **Start InfluxDB 3 with the PLUGIN_DIR environment variable set**:
   ```bash
   PLUGIN_DIR=~/.plugins influxdb3 serve --node-id node0 --object-store file --data-dir ~/.influxdb3 --plugin-dir ~/.plugins
   ```

2. **Copy the example TOML configuration file to your plugin directory**:
   ```bash
   cp mad_anomaly_config_data_writes.toml ~/.plugins/
   ```

3. **Edit the TOML file** to match your requirements:
   ```toml
   # Required parameters
   measurement = "cpu"
   mad_thresholds = "temp:2.5:20:5@load:3:10:2m"
   senders = "slack"
   
   # Notification settings
   slack_webhook_url = "https://hooks.slack.com/services/..."
   notification_count_text = "Custom alert: $field anomaly detected"
   ```

4. **Create a trigger using the `config_file_path` argument**:
   ```bash
   influxdb3 create trigger \
     --database mydb \
     --plugin-filename mad_check_plugin.py \
     --trigger-spec "all_tables" \
     --trigger-arguments config_file_path=mad_anomaly_config_data_writes.toml \
     mad_toml_trigger
   ```

## Code overview

### Files

- `mad_check_plugin.py`: The main plugin code containing the handler for data write triggers
- `mad_anomaly_config_data_writes.toml`: Example TOML configuration file

### Logging

Logs are stored in the `_internal` database in the `system.processing_engine_logs` table:

```bash
influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'your_trigger_name'"
```

Log columns:
- **event_time**: Timestamp of the log event
- **trigger_name**: Name of the trigger that generated the log
- **log_level**: Severity level (INFO, WARN, ERROR)
- **log_text**: Message describing the action or error

### Main functions

#### `process_writes(influxdb3_local, table_batches, args)`
Handles real-time anomaly detection on incoming data.

Key operations:
1. Filters table batches for the specified measurement
2. Maintains in-memory deques of recent values per field
3. Computes MAD for each monitored field
4. Tracks consecutive outliers and duration
5. Sends notifications when thresholds are met

### Key algorithms

#### MAD (Median Absolute Deviation) Calculation
```python
median = statistics.median(values)
mad = statistics.median([abs(x - median) for x in values])
threshold = k * mad
is_anomaly = abs(value - median) > threshold
```

#### Flip Detection
Counts transitions between normal and anomalous states within the window to prevent alert fatigue from rapidly changing values.

## Troubleshooting

### Common issues

#### Issue: No notifications being sent
**Solution**:
1. Verify the Notification Sender Plugin is installed and running
2. Check webhook URLs are correct:
   ```bash
   influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE log_text LIKE '%notification%'"
   ```
3. Ensure notification channel parameters are provided for selected senders

#### Issue: "Invalid MAD thresholds format" error
**Solution**: Check threshold format is correct:
- Count-based: `field:k:window:count` (for example, `temp:2.5:20:5`)
- Duration-based: `field:k:window:duration` (for example, `temp:2.5:20:2m`)
- Multiple thresholds separated by `@`

#### Issue: Too many false positive alerts
**Solution**:
1. Increase the k multiplier (for example, from 2.5 to 3.0)
2. Increase the threshold count or duration
3. Enable flip suppression with `state_change_count`
4. Increase the window size for more stable statistics

#### Issue: Missing anomalies (false negatives)
**Solution**:
1. Decrease the k multiplier
2. Decrease the threshold count or duration
3. Check if data has seasonal patterns that affect the median

### Debugging tips

1. **Monitor deque sizes**:
   ```bash
   influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE log_text LIKE '%Deque%'"
   ```

2. **Check MAD calculations**:
   ```bash
   influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE log_text LIKE '%MAD:%'"
   ```

3. **Test with known anomalies**:
   Write test data with obvious outliers to verify detection

### Performance considerations

- **Memory usage**: Each field maintains a deque of `window_count` values
- **Computation**: MAD is computed on every data write for monitored fields
- **Caching**: Measurement and tag names are cached for 1 hour
- **Notification retries**: Failed notifications retry up to 3 times with exponential backoff

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.