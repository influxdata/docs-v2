<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
The MAD-Based Anomaly Detection Plugin provides real-time anomaly detection for time series data in {{% product-name %}} using Median Absolute Deviation (MAD). Detect outliers in your field values as data is written, with configurable thresholds for both count-based and duration-based alerts. The plugin maintains in-memory deques for efficient computation and integrates with the Notification Sender Plugin to deliver alerts via multiple channels.

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. Some plugins support TOML configuration files, which can be specified using the plugin's `config_file_path` parameter.

If a plugin supports multiple trigger specifications, some parameters may depend on the trigger specification that you use.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Required parameters

| Parameter        | Type   | Default  | Description                                                         |
|------------------|--------|----------|---------------------------------------------------------------------|
| `measurement`    | string | required | Source measurement to monitor for anomalies                         |
| `mad_thresholds` | string | required | MAD threshold conditions. Format: `field:k:window_count:threshold`  |
| `senders`        | string | required | Dot-separated list of notification channels (for example, "slack.discord") |

### MAD threshold parameters

| Component      | Description                                                    | Example       |
|----------------|----------------------------------------------------------------|---------------|
| `field_name`   | The numeric field to monitor                                   | `temp`        |
| `k`            | MAD multiplier for the anomaly cutoff (float, ≥ 0)             | `2.5`         |
| `window_count` | Number of recent points for MAD computation (integer, 2–10000) | `20`          |
| `threshold`    | Consecutive outliers (integer, ≥ 1) or a duration              | `5` or `2min` |

Multiple thresholds are separated by `@`: `temp:2.5:20:5@load:3:10:2min`

Durations use the format `<number><unit>`, where unit is `us` (microseconds), `ms` (milliseconds), `s` (seconds), `min` (minutes), `h` (hours), `d` (days), or `w` (weeks).

Thresholds that share a field and `window_count` share one MAD window, so you can combine a count-based and a duration-based alert on the same detector: `temp:2.5:20:5@temp:2.5:20:2min`. Invalid thresholds are skipped with a warning; if none remain, the plugin logs an error and stops. Repeated identical thresholds are also skipped with a warning, because they would share one counter.

### Optional parameters

| Parameter                 | Type   | Default                              | Description                                                                                                                                                                         |
|---------------------------|--------|--------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `influxdb3_auth_token`    | string | env var                              | API token for {{% product-name %}} (or use INFLUXDB3_AUTH_TOKEN env var)                                                                                                                      |
| `state_change_count`      | string | "0"                                  | Number of transitions between normal and outlier state, within the MAD window, at which notifications are suppressed. Use 2 or greater; `1` is treated as `0`. See *Flip Detection* |
| `notification_count_text` | string | see *Default notification templates* | Template for count-based alerts with variables: $table, $field, $threshold_count, $tags                                                                                             |
| `notification_time_text`  | string | see *Default notification templates* | Template for duration-based alerts with variables: $table, $field, $threshold_time, $tags                                                                                           |
| `notification_path`       | string | "notify"                             | URL path for the notification sending plugin                                                                                                                                        |
| `port_override`           | string | "8181"                               | Port number where InfluxDB accepts requests                                                                                                                                         |

#### Default notification templates

- Count: `"MAD count alert: Field $field in $table outlier for $threshold_count consecutive points. Tags: $tags"`
- Time: `"MAD duration alert: Field $field in $table outlier for $threshold_time. Tags: $tags"`

### Notification channel parameters

#### Slack

| Parameter           | Type   | Required | Description                 |
|---------------------|--------|----------|-----------------------------|
| `slack_webhook_url` | string | Yes      | Webhook URL from Slack      |
| `slack_headers`     | string | No       | Base64-encoded HTTP headers |

#### Discord

| Parameter             | Type   | Required | Description                 |
|-----------------------|--------|----------|-----------------------------|
| `discord_webhook_url` | string | Yes      | Webhook URL from Discord    |
| `discord_headers`     | string | No       | Base64-encoded HTTP headers |

#### HTTP

| Parameter          | Type   | Required | Description                          |
|--------------------|--------|----------|--------------------------------------|
| `http_webhook_url` | string | Yes      | Custom webhook URL for POST requests |
| `http_headers`     | string | No       | Base64-encoded HTTP headers          |

#### SMS/WhatsApp (via Twilio)

| Parameter            | Type   | Required | Description                                     |
|----------------------|--------|----------|-------------------------------------------------|
| `twilio_sid`         | string | Yes      | Twilio Account SID (or use TWILIO_SID env var)  |
| `twilio_token`       | string | Yes      | Twilio Auth Token (or use TWILIO_TOKEN env var) |
| `twilio_from_number` | string | Yes      | Sender phone number                             |
| `twilio_to_number`   | string | Yes      | Recipient phone number                          |

### TOML configuration

| Parameter          | Type   | Default | Description                                                                      |
|--------------------|--------|---------|----------------------------------------------------------------------------------|
| `config_file_path` | string | none    | TOML config file path relative to `PLUGIN_DIR` (required for TOML configuration) |

*To use a TOML configuration file, set the `PLUGIN_DIR` environment variable and specify the `config_file_path` in the trigger arguments.* This is in addition to the `--plugin-dir` flag when starting {{% product-name %}}. Relative paths are resolved against the first directory that is set: `PLUGIN_DIR`, then `INFLUXDB3_PLUGIN_DIR`, then the parent of `VIRTUAL_ENV`. Only that directory is used — the file is not looked up in the remaining ones.

When `config_file_path` is set, the TOML file provides the whole configuration and inline trigger arguments are ignored. `INFLUXDB3_AUTH_TOKEN` from the environment still applies when `influxdb3_auth_token` is not set in the file. In TOML, `senders` and `mad_thresholds` use native structures (a list and a list of entries) instead of the inline string formats, though the inline strings are also accepted.

The plugin caches the loaded configuration for 10 minutes to keep the write path fast, so configuration changes take effect within that window.

#### Example TOML configuration

[mad_anomaly_config_data_writes.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/mad_check/mad_anomaly_config_data_writes.toml)

For more information on using TOML configuration files, see the Using TOML Configuration Files section in the [influxdb3_plugins/README.md](https://github.com/influxdata/influxdb3_plugins/blob/master/README.md).

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled.
- **Python packages**:
  - `influxdata-plugin-utils>=0.3.0` (configuration loading, parsing, and schema introspection)
  - `requests` (for notification delivery)
- **Notification Sender Plugin** *(optional)*: Required if using the `senders` parameter. See the [influxdata/notifier plugin](/influxdb3/version/plugins/library/official/notifier/).

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
   influxdb3 install package influxdata-plugin-utils
   influxdb3 install package requests
   ```
3. *(Optional)* For notifications, install the [influxdata/notifier plugin](/influxdb3/version/plugins/library/official/notifier/) and create an HTTP trigger for it.

## Schema requirement

The plugin assumes that the table schema is already defined in the database, as it relies on this schema to retrieve field and tag names required for processing.

## Trigger setup

### Real-time anomaly detection

Detect anomalies as data is written:

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/mad_check/mad_check_plugin.py" \
  --trigger-spec "all_tables" \
  --trigger-arguments 'measurement=cpu,mad_thresholds="temp:2.5:20:5@load:3:10:2min",senders=slack,slack_webhook_url="$SLACK_WEBHOOK_URL"' \
  mad_anomaly_detector
```
Set `SLACK_WEBHOOK_URL` to your Slack incoming webhook URL.

## Example usage

### Example 1: Basic count-based anomaly detection

Detect when temperature exceeds 2.5 MADs from the median for 5 consecutive points:

```bash
# Create trigger for count-based detection
influxdb3 create trigger \
  --database sensors \
  --path "gh:influxdata/mad_check/mad_check_plugin.py" \
  --trigger-spec "all_tables" \
  --trigger-arguments 'measurement=environment,mad_thresholds="temperature:2.5:20:5",senders=slack,slack_webhook_url="$SLACK_WEBHOOK_URL"' \
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
Set `SLACK_WEBHOOK_URL` to your Slack incoming webhook URL.

**Expected output**

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
  --path "gh:influxdata/mad_check/mad_check_plugin.py" \
  --trigger-spec "all_tables" \
  --trigger-arguments 'measurement=system_metrics,mad_thresholds="cpu_load:3:30:2min@memory_used:2.5:30:5min",senders=slack.discord,slack_webhook_url="$SLACK_WEBHOOK_URL",discord_webhook_url="$DISCORD_WEBHOOK_URL"' \
  system_anomaly_detector
```
Set `SLACK_WEBHOOK_URL` and `DISCORD_WEBHOOK_URL` to your webhook URLs.

**Expected output**

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
  --path "gh:influxdata/mad_check/mad_check_plugin.py" \
  --trigger-spec "all_tables" \
  --trigger-arguments 'measurement=sensor_data,mad_thresholds="vibration:2:50:10",state_change_count=3,senders=http,http_webhook_url="$HTTP_WEBHOOK_URL",notification_count_text="Vibration anomaly detected on $table. Field: $field, Tags: $tags"' \
  vibration_monitor
```
Set `HTTP_WEBHOOK_URL` to your HTTP webhook endpoint.

**Expected output**

- Detects vibration anomalies exceeding 2 MADs for 10 consecutive points
- Suppresses notifications once the value has switched between normal and outlier state 3 times within the 50-point window, so two switches are still tolerated
- Sends custom formatted message to HTTP endpoint

## Using TOML Configuration Files

This plugin supports using TOML configuration files to specify all plugin arguments.

### Important Requirements

**To use TOML configuration files, you must set the `PLUGIN_DIR` environment variable in the {{% product-name %}} host environment.**

### Setting Up TOML Configuration

1. **Start {{% product-name %}} with the PLUGIN_DIR environment variable set**:

 ```bash
 PLUGIN_DIR=~/.plugins influxdb3 serve \
   --node-id node0 \
   --object-store file \
   --data-dir ~/.influxdb3 \
   --plugin-dir ~/.plugins
 ```
2. **Copy the example TOML configuration file to your plugin directory**:

 ```bash
 cp mad_anomaly_config_data_writes.toml ~/.plugins/
 ```
3. **Edit the TOML file** to match your requirements:

   ```toml
   # Required parameters
   measurement = "cpu"
   mad_thresholds = "temp:2.5:20:5@load:3:10:2min"
   senders = "slack"

   # Notification settings
   slack_webhook_url = "$SLACK_WEBHOOK_URL"
   notification_count_text = "Custom alert: $field anomaly detected"
   ```
   Set `SLACK_WEBHOOK_URL` to your Slack incoming webhook URL.

4. **Create a trigger using the `config_file_path` argument**:
   
   ```bash
   influxdb3 create trigger \
     --database mydb \
     --path "gh:influxdata/mad_check/mad_check_plugin.py" \
     --trigger-spec "all_tables" \
     --trigger-arguments config_file_path=mad_anomaly_config_data_writes.toml \
     mad_toml_trigger
   ```
## Code overview

### Files

- `mad_check_plugin.py`: The main plugin code containing the handler for data write triggers
- `mad_anomaly_config_data_writes.toml`: Example TOML configuration file
- `test_mad_check.py`: Pytest suite, runs without a live {{% product-name %}} server
- `requirements.txt`: Runtime dependencies (`influxdata-plugin-utils>=0.3.0`, `requests`)
- `requirements-dev.txt`: Development dependencies (`pytest`)

### Logging

Logs are stored in the trigger's database in the `system.processing_engine_logs` table:

```bash
influxdb3 query --database YOUR_DATABASE "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'your_trigger_name'"
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
When more than half of the values in the window are identical, `mad` is `0` and the bounds collapse onto the median, so any different value counts as an outlier no matter how large `k` is. This affects flat signals: a stable sensor, a metric that is usually `0`, or a low-resolution integer field. The effect also works in reverse — once outliers fill more than half of the window they become the new median and stop being detected.

#### Flip Detection

The plugin keeps the recent outlier flags of each threshold in a deque the size of `window_count` and counts transitions between normal and outlier state. Once the number of transitions reaches `state_change_count`, the alert is computed as usual but not delivered, and a warning is logged instead. This prevents alert fatigue from values that switch in and out of the outlier state.

An alert that follows normal data always records one normal-to-outlier transition, so `state_change_count` must be 2 or greater to leave sustained anomalies alone. A value of `1` would suppress every alert; the plugin logs a warning and treats it as `0`.

A count threshold needs consecutive outliers, so when it fires the last `threshold` flags are all outliers and only `window_count - threshold` transitions can remain in the window. Suppression therefore requires `window_count >= threshold + state_change_count`; otherwise the plugin logs a `Flip suppression never triggers` warning naming the field. Duration thresholds have no such limit.

## Troubleshooting

### Common issues

#### Issue: No notifications being sent

**Solution**:

1. Verify the Notification Sender Plugin is installed and running
2. Check webhook URLs are correct:`bash
 influxdb3 query --database YOUR_DATABASE "SELECT * FROM system.processing_engine_logs WHERE log_text LIKE '%notification%'"
 `
3. Ensure notification channel parameters are provided for selected senders

#### Issue: "No valid MAD thresholds provided" error

**Solution**: Each invalid threshold is logged as a warning naming the part that failed. Check the format:

- Count-based: `field:k:window_count:count` (for example, `temp:2.5:20:5`)
- Duration-based: `field:k:window_count:duration` (for example, `temp:2.5:20:2min`)
- Multiple thresholds separated by `@`
- `k` must not be negative, `window_count` must be 2 or greater, the count must be 1 or greater

#### Issue: Alerts are logged but never delivered

**Solution**: Look for `Suppressed count alert` or `Suppressed duration alert` warnings. They mean flip suppression is active. Raise `state_change_count`, or remove it to disable suppression.

#### Issue: Too many false positive alerts

**Solution**:

1. Increase the k multiplier (for example, from 2.5 to 3.0)
2. Increase the threshold count or duration
3. Enable flip suppression with `state_change_count`
4. Increase the window size for more stable statistics

If the log line reports `mad=0.000`, the window has no spread and `k` has no effect. Require the change to persist with a count or duration threshold instead.

#### Issue: Missing anomalies (false negatives)

**Solution**:

1. Decrease the k multiplier
2. Decrease the threshold count or duration
3. Check if data has seasonal patterns that affect the median

### Debugging tips

1. **Check whether windows are still filling up**:

 ```bash
 influxdb3 query --database YOUR_DATABASE "SELECT * FROM system.processing_engine_logs WHERE log_text LIKE '%Waiting for%points for MAD%'"
 ```
2. **Check MAD calculations** (logged for detected outliers only):

 ```bash
 influxdb3 query --database YOUR_DATABASE "SELECT * FROM system.processing_engine_logs WHERE log_text LIKE '%MAD calculation%'"
 ```
3. **Test with known anomalies**: Write test data with obvious outliers to verify detection

### Performance considerations

- **Memory usage**: Each field and series maintains a deque of `window_count` values
- **Computation**: MAD is computed on every data write for monitored fields
- **Caching**: Measurement and tag names are cached for 1 hour, the loaded configuration for 10 minutes
- **Early exit**: Writes that contain no rows of the configured measurement return before thresholds, senders and tags are parsed; the configuration and the table list come from the cache
- **Notification delivery**: Each alert is sent in a single attempt with a 5-second timeout; retries would hold up the write path
- **Logging**: MAD calculations are logged only for points detected as outliers, so a calm table produces two log lines per write

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
