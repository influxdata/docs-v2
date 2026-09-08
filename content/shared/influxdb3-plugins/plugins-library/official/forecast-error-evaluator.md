<!-- BEGIN GENERATED PLUGIN CONTENT -->
The Forecast Error Evaluator Plugin validates forecast model accuracy for time series data in {{% product-name %}} by comparing predicted values with actual observations. On every scheduled run the plugin matches the two measurements over a time window, computes an error metric (MSE, MAE, RMSE, MAPE, or SMAPE) for each matched timestamp, and notifies for the points that reach a configured threshold. It includes debounce logic to suppress transient anomalies and supports multi-channel notifications via the Notification Sender Plugin.

The metric is computed per timestamp rather than aggregated over the window, which is what lets `min_condition_duration` measure how long an elevated error persists. As a consequence `rmse` yields the same value as `mae`: the root of a single squared difference is its absolute value.

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. Some plugins support TOML configuration files, which can be specified using the plugin's `config_file_path` parameter.

If a plugin supports multiple trigger specifications, some parameters may depend on the trigger specification that you use.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Required parameters

| Parameter              | Type   | Default  | Description                                                                                                                         |
|------------------------|--------|----------|-------------------------------------------------------------------------------------------------------------------------------------|
| `forecast_measurement` | string | required | Measurement containing forecasted values                                                                                            |
| `actual_measurement`   | string | required | Measurement containing actual (ground truth) values                                                                                 |
| `forecast_field`       | string | required | Field name for forecasted values                                                                                                    |
| `actual_field`         | string | required | Field name for actual values                                                                                                        |
| `error_metric`         | string | required | Error metric to compute: `mse`, `mae`, `rmse`, `mape`, or `smape`                                                                   |
| `error_thresholds`     | string | required | Colon-separated `<level>-<threshold>` pairs, e.g. `INFO-"0.5":WARN-"0.9":ERROR-"1.2":CRITICAL-"1.5"`. See [Thresholds](#thresholds) |
| `window`               | string | required | Time window for data analysis. Must be a positive duration. Units: `us`, `ms`, `s`, `min`, `h`, `d`, `w`                            |
| `senders`              | string | required | Dot-separated list of notification channels (for example, "slack.discord")                                                                 |

### Thresholds

Levels are `INFO`, `WARN`, `ERROR` and `CRITICAL`, and each threshold must be above `0`. Every supported metric is non-negative, so a threshold of `0` or below would flag every point of the window; such a level is skipped with a warning.

Levels are evaluated independently: a point whose error reaches several thresholds produces one notification per level, each with its own debounce state. Configure only the levels you want to be paged about. Levels are processed from the highest threshold down, so `max_notifications_per_run` is spent on the most severe alerts first.

Malformed segments, and a level given twice, are skipped with a warning and the remaining levels still apply. If no level survives parsing, the run logs an error and stops without notifying.

### Notification parameters

| Parameter                   | Type    | Default          | Description                                                                                                                     |
|-----------------------------|---------|------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `notification_text`         | string  | default template | Template for notification message with variables `$measurement`, `$level`, `$field`, `$error`, `$metric`, `$tags`, `$timestamp` |
| `notification_path`         | string  | "notify"         | URL path for the notification sending plugin                                                                                    |
| `port_override`             | integer | 8181             | Port number where InfluxDB accepts requests                                                                                     |
| `max_notifications_per_run` | integer | 20               | Maximum notifications sent by a single run. Alerts beyond the limit are counted in a warning and not resent later               |

### Timing parameters

| Parameter                | Type   | Default     | Description                                                                                                                                                          |
|--------------------------|--------|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `min_condition_duration` | string | `0s`        | Time an error must stay above a threshold before alerting. Units: `us`, `ms`, `s`, `min`, `h`, `d`, `w`. With the default the first point above the threshold alerts |
| `rounding_freq`          | string | no rounding | Fixed pandas frequency used to round timestamps before matching the two measurements, e.g. `1s`, `500ms`, `5min`, `1h`                                               |

### Authentication parameters

| Parameter              | Type   | Default      | Description                                                     |
|------------------------|--------|--------------|-----------------------------------------------------------------|
| `influxdb3_auth_token` | string | env variable | API token for {{% product-name %}}. Can be set via `INFLUXDB3_AUTH_TOKEN` |

### Sender-specific parameters

#### Slack notifications

| Parameter           | Type   | Default  | Description                 |
|---------------------|--------|----------|-----------------------------|
| `slack_webhook_url` | string | required | Webhook URL from Slack      |
| `slack_headers`     | string | none     | Base64-encoded HTTP headers |

#### Discord notifications

| Parameter             | Type   | Default  | Description                 |
|-----------------------|--------|----------|-----------------------------|
| `discord_webhook_url` | string | required | Webhook URL from Discord    |
| `discord_headers`     | string | none     | Base64-encoded HTTP headers |

#### HTTP notifications

| Parameter          | Type   | Default  | Description                          |
|--------------------|--------|----------|--------------------------------------|
| `http_webhook_url` | string | required | Custom webhook URL for POST requests |
| `http_headers`     | string | none     | Base64-encoded HTTP headers          |

#### SMS notifications (via Twilio)

| Parameter            | Type   | Default      | Description                                   |
|----------------------|--------|--------------|-----------------------------------------------|
| `twilio_sid`         | string | env variable | Twilio Account SID (or `TWILIO_SID` env var)  |
| `twilio_token`       | string | env variable | Twilio Auth Token (or `TWILIO_TOKEN` env var) |
| `twilio_from_number` | string | required     | Twilio sender number (for example, "+1234567890")    |
| `twilio_to_number`   | string | required     | Recipient number (for example, "+0987654321")        |

### Matching forecast to actual values

Forecast and actual rows are matched with an inner join on the timestamp plus the tags that both measurements share. Tags present in only one of them are ignored with a warning, so a forecast table without the tag columns of the actual table still works.

Set `rounding_freq` when the two series are written with slightly different timestamps. Rounding coarser than the sampling interval puts several points into the same slot; only the earliest point of each slot is kept, and the number of collapsed rows is logged. Without that, matching would join every forecast of the slot against every actual value in it.

Rows where either value is missing are dropped before the metric is computed. For `mape`, rows with `actual = 0` are skipped; for `smape`, rows where both values are `0` are skipped.

### Alert state

Debounce and alert state live in the trigger-local cache, keyed by measurement, field, level and tag values:

- While an error stays above a threshold for less than `min_condition_duration`, the plugin logs the pending state and waits. The duration is measured in data time, and a pending start that has scrolled out of the window is discarded, so a gap in the data cannot stand in for a persistent error.
- After an alert is delivered, its timestamp is recorded and earlier or equal timestamps are never alerted again. Overlapping windows on successive runs therefore do not resend the same point.
- If delivery fails after all retries, the state is left untouched so the next run alerts on that point again.
- The cache is in-memory and trigger-local: restarting the server clears the debounce and last-alert state.

### TOML configuration

| Parameter          | Type   | Default | Description                                                                      |
|--------------------|--------|---------|----------------------------------------------------------------------------------|
| `config_file_path` | string | none    | TOML config file path relative to `PLUGIN_DIR` (required for TOML configuration) |

*To use a TOML configuration file, set the `PLUGIN_DIR` environment variable and specify the `config_file_path` in the trigger arguments.* This is in addition to the `--plugin-dir` flag when starting {{% product-name %}}. Relative paths are resolved against the first directory that is set: `PLUGIN_DIR`, then `INFLUXDB3_PLUGIN_DIR`, then the parent of `VIRTUAL_ENV`. Only that directory is used — the file is not looked up in the remaining ones.

When `config_file_path` is set, the TOML file provides the whole configuration and inline trigger arguments are ignored. `INFLUXDB3_AUTH_TOKEN` from the environment still applies when `influxdb3_auth_token` is not set in the file. In TOML, `senders` and `error_thresholds` can use native structures (a list and a table) instead of the inline string formats, though the inline strings are also accepted.

#### Example TOML configuration

[forecast_error_config_scheduler.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/forecast_error_evaluator/forecast_error_config_scheduler.toml)

For more information on using TOML configuration files, see the Using TOML Configuration Files section in the [influxdb3_plugins/README.md](https://github.com/influxdata/influxdb3_plugins/blob/master/README.md).

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled.
- **Notification Sender Plugin for {{% product-name %}}**: Required for sending notifications. See the [influxdata/notifier plugin](/influxdb3/version/plugins/library/official/notifier/).
- **Python packages**:
 	- `influxdata-plugin-utils>=0.3.0` (configuration loading, parsing, and schema introspection)
 	- `pandas` (for data processing)
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
   influxdb3 install package influxdata-plugin-utils
   influxdb3 install package pandas
   influxdb3 install package requests
   ```
3. Install the [influxdata/notifier plugin](/influxdb3/version/plugins/library/official/notifier/) (required)

## Trigger setup

### Scheduled forecast validation

Run forecast error evaluation periodically:

```bash
influxdb3 create trigger \
  --database weather_forecasts \
  --path "gh:influxdata/forecast_error_evaluator/forecast_error_evaluator.py" \
  --trigger-spec "every:30m" \
  --trigger-arguments 'forecast_measurement=temperature_forecast,actual_measurement=temperature_actual,forecast_field=predicted_temp,actual_field=temp,error_metric=rmse,error_thresholds=INFO-"0.5":WARN-"1.0":ERROR-"2.0",window=1h,senders=slack,slack_webhook_url="$SLACK_WEBHOOK_URL"' \
  forecast_validation
```
Set `SLACK_WEBHOOK_URL` to your Slack incoming webhook URL.

## Example usage

### Example 1: Temperature forecast validation with Slack alerts

Validate temperature forecast accuracy and send Slack notifications:

```bash
# Create the trigger
influxdb3 create trigger \
  --database weather_db \
  --path "gh:influxdata/forecast_error_evaluator/forecast_error_evaluator.py" \
  --trigger-spec "every:15m" \
  --trigger-arguments 'forecast_measurement=temp_forecast,actual_measurement=temp_actual,forecast_field=predicted,actual_field=temperature,error_metric=rmse,error_thresholds=INFO-"0.5":WARN-"1.0":ERROR-"2.0":CRITICAL-"3.0",window=30min,senders=slack,slack_webhook_url="$SLACK_WEBHOOK_URL",min_condition_duration=10min' \
  temp_forecast_check

# Write forecast data
influxdb3 write \
  --database weather_db \
  "temp_forecast,location=station1 predicted=22.5"

# Write actual data  
influxdb3 write \
  --database weather_db \
  "temp_actual,location=station1 temperature=21.8"

# Check logs after trigger runs
influxdb3 query \
  --database YOUR_DATABASE \
  "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'temp_forecast_check'"
```
**Expected output**

- Plugin computes the error between forecast and actual values for every matched timestamp
- Points with an error of 0.5 or more send an INFO notification, 1.0 or more a WARN notification, and so on for each configured level
- A point is only alerted after its error has stayed above the level for 10 minutes (debounce)

Set `SLACK_WEBHOOK_URL` to your Slack incoming webhook URL.

**Notification example:**

[WARN] Forecast error alert in temp_actual.temperature: rmse=1.2. Tags: location=station1

The message names the actual measurement and field, because that is where the observed value comes from.

### Example 2: Multi-metric validation with multiple channels

Monitor multiple forecast metrics with different notification channels:

```bash
# Create trigger with Discord and HTTP notifications
influxdb3 create trigger \
  --database analytics \
  --path "gh:influxdata/forecast_error_evaluator/forecast_error_evaluator.py" \
  --trigger-spec "every:1h" \
  --trigger-arguments 'forecast_measurement=sales_forecast,actual_measurement=sales_actual,forecast_field=predicted_sales,actual_field=sales_amount,error_metric=mae,error_thresholds=WARN-"1000":ERROR-"5000":CRITICAL-"10000",window=6h,senders=discord.http,discord_webhook_url="$DISCORD_WEBHOOK_URL",http_webhook_url="$HTTP_WEBHOOK_URL",notification_text="[$$level] Sales forecast error: $$metric=$$error (threshold exceeded)",rounding_freq=5min' \
  sales_forecast_monitor
```
Set `DISCORD_WEBHOOK_URL` and `HTTP_WEBHOOK_URL` to your webhook URLs.

### Example 3: SMS alerts for critical forecast failures

Set up SMS notifications for critical forecast accuracy issues:

```bash
# Set environment variables (recommended for sensitive data)
export TWILIO_SID="your_twilio_sid"
export TWILIO_TOKEN="your_twilio_token"

# Create trigger with SMS notifications
influxdb3 create trigger \
  --database production_forecasts \
  --path "gh:influxdata/forecast_error_evaluator/forecast_error_evaluator.py" \
  --trigger-spec "every:5m" \
  --trigger-arguments 'forecast_measurement=demand_forecast,actual_measurement=demand_actual,forecast_field=predicted_demand,actual_field=actual_demand,error_metric=mse,error_thresholds=CRITICAL-"100000",window=15min,senders=sms,twilio_from_number="+1234567890",twilio_to_number="+0987654321",notification_text="CRITICAL: Production demand forecast error exceeded threshold. MSE: $$error",min_condition_duration=2min' \
  critical_forecast_alert
```
## Using TOML Configuration Files

This plugin supports using TOML configuration files for complex configurations.

### Important Requirements

**To use TOML configuration files, you must set the `PLUGIN_DIR` environment variable in the {{% product-name %}} host environment:**

```bash
PLUGIN_DIR=~/.plugins influxdb3 serve \
  --node-id node0 \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --plugin-dir ~/.plugins
```
### Example TOML Configuration

```toml
# forecast_error_config_scheduler.toml
forecast_measurement = "temperature_forecast"
actual_measurement = "temperature_actual"
forecast_field = "predicted_temp"
actual_field = "temperature"
error_metric = "rmse"
error_thresholds = 'INFO-"0.5":WARN-"1.0":ERROR-"2.0":CRITICAL-"3.0"'
window = "1h"
senders = "slack"
slack_webhook_url = "$SLACK_WEBHOOK_URL"
min_condition_duration = "10min"
rounding_freq = "1min"
notification_text = "[$$level] Forecast validation alert: $$metric=$$error in $$measurement.$$field"

# Authentication (use environment variables instead when possible)
influxdb3_auth_token = "your_token_here"
```
Set `SLACK_WEBHOOK_URL` to your Slack incoming webhook URL.

### Create trigger using TOML config

```bash
influxdb3 create trigger \
  --database weather_db \
  --path "gh:influxdata/forecast_error_evaluator/forecast_error_evaluator.py" \
  --trigger-spec "every:30m" \
  --trigger-arguments config_file_path=forecast_error_config_scheduler.toml \
  forecast_validation_trigger
```
## Code overview

### Files

- `forecast_error_evaluator.py`: The main plugin code containing scheduler handler for forecast validation
- `forecast_error_config_scheduler.toml`: Example TOML configuration file
- `test_forecast_error_evaluator.py`: Pytest suite, runs without a live {{% product-name %}} server
- `requirements.txt`: Runtime dependencies (`influxdata-plugin-utils>=0.3.0`, `pandas`, `requests`)
- `requirements-dev.txt`: Development dependencies (`pytest`)

### Logging

Logs are stored in the trigger's database in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database YOUR_DATABASE "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'your_trigger_name'"
```
Log columns:

- **event_time**: Timestamp of the log event
- **trigger_name**: Name of the trigger that generated the log
- **log_level**: Severity level (INFO, WARN, ERROR)
- **log_text**: Message describing validation results or errors

### Main functions

#### `process_scheduled_call(influxdb3_local, call_time, args)`

Handles scheduled forecast validation tasks. Queries forecast and actual measurements, computes error metrics, and triggers notifications.

Key operations:

1. Parses configuration from arguments or TOML file
2. Verifies that both measurements exist and resolves the tags they share
3. Queries forecast and actual measurements within the time window
4. Rounds timestamps, collapses duplicate keys and matches the two series
5. Computes the error metric for every matched timestamp
6. Evaluates each threshold level, applies debounce logic and skips already-alerted points
7. Sends notifications via configured channels, up to `max_notifications_per_run`

#### `compute_error(influxdb3_local, merged, error_metric, task_id)`

Adds a per-timestamp `error` column to the matched frame.

| Metric  | Formula per timestamp                                       | Notes                                                      |
|---------|-------------------------------------------------------------|------------------------------------------------------------|
| `mse`   | `(forecast - actual)²`                                      | Thresholds are in squared units                            |
| `mae`   | `\|forecast - actual\|`                                     |                                                            |
| `rmse`  | `((forecast - actual)²)^0.5`                                | Equals `mae` for a single point                            |
| `mape`  | `\|forecast - actual\| / \|actual\| * 100`                  | Rows with `actual = 0` are skipped                         |
| `smape` | `200 * \|forecast - actual\| / (\|forecast\| + \|actual\|)` | Bounded 0-200%; rows where both values are `0` are skipped |

#### `align_frames(influxdb3_local, df_forecast, df_actual, tags, rounding_freq, task_id)`

Rounds timestamps, keeps the earliest row per key and inner-joins the two frames on the timestamp and the shared tags.

#### `parse_error_thresholds(influxdb3_local, config, task_id)`

Parses the inline `<level>-<value>` string or the TOML table into a `{level: threshold}` mapping, skipping unknown levels, non-numeric values and thresholds at or below zero.

## Troubleshooting

### Common issues

#### Issue: No overlapping timestamps between forecast and actual data

**Solution**: Check that both measurements have data in the specified time window and use `rounding_freq` for alignment:

```bash
influxdb3 query --database mydb "SELECT time, field_value FROM forecast_measurement WHERE time >= now() - 1h"
influxdb3 query --database mydb "SELECT time, field_value FROM actual_measurement WHERE time >= now() - 1h"
```
#### Issue: Notifications not being sent

**Solution**: Verify the Notification Sender Plugin is installed and webhook URLs are correct:

```bash
# Check if notifier plugin exists
ls ~/.plugins/notifier_plugin.py

# Test webhook URL manually
curl -X POST "your_webhook_url" -d '{"text": "test message"}'
```
#### Issue: Error threshold format not recognized

**Solution**: Use proper threshold format with level prefixes. Note that MAPE and SMAPE thresholds are in percentages:

```bash
# For absolute metrics (MSE, MAE, RMSE)
--trigger-arguments 'error_thresholds=INFO-"0.5":WARN-"1.0":ERROR-"2.0":CRITICAL-"3.0"'

# For percentage metrics (MAPE, SMAPE)
--trigger-arguments 'error_thresholds=INFO-"5.0":WARN-"10.0":ERROR-"20.0":CRITICAL-"30.0"'
```
A `Skipping threshold` warning names the level that was dropped and why. `No valid error thresholds configured` means every level was rejected, so nothing was evaluated.

#### Issue: Trigger fails with "Failed to load configuration"

**Solution**: The message names the offending parameter. Common causes are a duration without a supported unit (use `min`, not `m`), a `window` of `0s`, a `port_override` outside 1-65535 and an `error_metric` outside `mse`, `mae`, `rmse`, `mape`, `smape`.

#### Issue: Many rows collapse into one timestamp

**Solution**: A `Collapsed N forecast and M actual rows sharing a rounded timestamp` line means `rounding_freq` is coarser than the sampling interval, so only the earliest point of each slot is compared. Lower `rounding_freq` to match how far apart the two series are actually written.

#### Issue: Notifications stop mid-run

**Solution**: `Suppressed N notifications after reaching max_notifications_per_run` means the per-run cap was hit. Raise `max_notifications_per_run`, raise the thresholds, or set `min_condition_duration` so short spikes are not alerted.

#### Issue: MAPE/SMAPE calculation errors with zero values

**Solution**: MAPE cannot be calculated when actual values are zero, and SMAPE cannot be calculated when both forecast and actual are zero. The plugin automatically skips such rows and logs warnings. For datasets with frequent zero values, consider using MAE or RMSE instead.

#### Issue: Environment variables not loaded

**Solution**: Set environment variables before starting InfluxDB:

```bash
export INFLUXDB3_AUTH_TOKEN="your_token"
export TWILIO_SID="your_sid"
influxdb3 serve --plugin-dir ~/.plugins
```
### Debugging tips

1. **Check data availability** in both measurements:

 ```bash
 influxdb3 query --database mydb \
  "SELECT COUNT(*) FROM forecast_measurement WHERE time >= now() - window"
 ```
2. **Verify timestamp alignment** with rounding frequency:

 ```bash
 --trigger-arguments 'rounding_freq=5min'
 ```
3. **Test with shorter windows** for faster debugging:

 ```bash
 --trigger-arguments 'window=10min,min_condition_duration=1min'
 ```
4. **Monitor notification delivery** in logs:

 ```bash
 influxdb3 query --database YOUR_DATABASE \
  "SELECT * FROM system.processing_engine_logs WHERE log_text LIKE '%notification%'"
 ```
### Performance considerations

- **Data alignment**: Use appropriate `rounding_freq` to balance accuracy and performance
- **Window size**: Larger windows evaluate more points per run, and every point is checked against every configured level
- **Debounce duration**: Balance between noise suppression and alert responsiveness
- **Notification throttling**: Deliveries are sequential with up to three retries each, so `max_notifications_per_run` bounds how long a run can take
- **Trigger interval**: An interval shorter than `window` re-reads the overlap on every run; the last-alert state keeps it from resending, but the data is queried again
- **Memory usage**: Plugin processes data in pandas DataFrames - consider memory for large datasets

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- END GENERATED PLUGIN CONTENT -->
