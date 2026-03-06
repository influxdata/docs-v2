
The Forecast Error Evaluator Plugin validates forecast model accuracy for time series data in {{% product-name %}} by comparing predicted values with actual observations. The plugin periodically computes error metrics (MSE, MAE, RMSE, MAPE, or SMAPE), detects anomalies based on error thresholds, and sends notifications when forecast accuracy degrades. It includes debounce logic to suppress transient anomalies and supports multi-channel notifications via the Notification Sender Plugin.

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. Some plugins support TOML configuration files, which can be specified using the plugin's `config_file_path` parameter.

If a plugin supports multiple trigger specifications, some parameters may depend on the trigger specification that you use.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Required parameters

| Parameter              | Type   | Default  | Description                                                                  |
|------------------------|--------|----------|------------------------------------------------------------------------------|
| `forecast_measurement` | string | required | Measurement containing forecasted values                                     |
| `actual_measurement`   | string | required | Measurement containing actual (ground truth) values                          |
| `forecast_field`       | string | required | Field name for forecasted values                                             |
| `actual_field`         | string | required | Field name for actual values                                                 |
| `error_metric`         | string | required | Error metric to compute: "mse", "mae", "rmse", "mape", or "smape"            |
| `error_thresholds`     | string | required | Threshold levels. Format: `INFO-"0.5":WARN-"0.9":ERROR-"1.2":CRITICAL-"1.5"` |
| `window`               | string | required | Time window for data analysis. Format: `<number><unit>` (for example, "1h")         |
| `senders`              | string | required | Dot-separated list of notification channels (for example, "slack.discord")          |

### Notification parameters

| Parameter           | Type    | Default          | Description                                                                                                       |
|---------------------|---------|------------------|-------------------------------------------------------------------------------------------------------------------|
| `notification_text` | string  | default template | Template for notification message with variables `$measurement`, `$level`, `$field`, `$error`, `$metric`, `$tags` |
| `notification_path` | string  | "notify"         | URL path for the notification sending plugin                                                                      |
| `port_override`     | integer | 8181             | Port number where InfluxDB accepts requests                                                                       |

### Timing parameters

| Parameter                | Type   | Default | Description                                                                      |
|--------------------------|--------|---------|----------------------------------------------------------------------------------|
| `min_condition_duration` | string | none    | Minimum duration for anomaly condition to persist before triggering notification |
| `rounding_freq`          | string | "1s"    | Frequency to round timestamps for alignment                                      |

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

### TOML configuration

| Parameter          | Type   | Default | Description                                                                      |
|--------------------|--------|---------|----------------------------------------------------------------------------------|
| `config_file_path` | string | none    | TOML config file path relative to `PLUGIN_DIR` (required for TOML configuration) |

*To use a TOML configuration file, set the `PLUGIN_DIR` environment variable and specify the `config_file_path` in the trigger arguments.* This is in addition to the `--plugin-dir` flag when starting {{% product-name %}}.

#### Example TOML configuration

[forecast_error_config_scheduler.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/forecast_error_evaluator/forecast_error_config_scheduler.toml)

For more information on using TOML configuration files, see the Using TOML Configuration Files section in the [influxdb3_plugins/README.md](https://github.com/influxdata/influxdb3_plugins/blob/master/README.md).

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled.
- **Notification Sender Plugin for {{% product-name %}}**: Required for sending notifications. See the [influxdata/notifier plugin](../notifier/README.md).
- **Python packages**:
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
   influxdb3 install package pandas
   influxdb3 install package requests
   ```
3. Install the [influxdata/notifier plugin](../notifier/README.md) (required)

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
  --trigger-arguments 'forecast_measurement=temp_forecast,actual_measurement=temp_actual,forecast_field=predicted,actual_field=temperature,error_metric=rmse,error_thresholds=INFO-"0.5":WARN-"1.0":ERROR-"2.0":CRITICAL-"3.0",window=30m,senders=slack,slack_webhook_url="$SLACK_WEBHOOK_URL",min_condition_duration=10m' \
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

- Plugin computes RMSE between forecast and actual values
- If RMSE > 0.5, sends INFO-level notification
- If RMSE > 1.0, sends WARN-level notification
- Only triggers if condition persists for 10+ minutes (debounce)

Set `SLACK_WEBHOOK_URL` to your Slack incoming webhook URL.

**Notification example:**

[WARN] Forecast error alert in temp_forecast.predicted: rmse=1.2. Tags: location=station1

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
  --trigger-arguments 'forecast_measurement=demand_forecast,actual_measurement=demand_actual,forecast_field=predicted_demand,actual_field=actual_demand,error_metric=mse,error_thresholds=CRITICAL-"100000",window=15m,senders=sms,twilio_from_number="+1234567890",twilio_to_number="+0987654321",notification_text="CRITICAL: Production demand forecast error exceeded threshold. MSE: $$error",min_condition_duration=2m' \
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
min_condition_duration = "10m"
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
2. Queries forecast and actual measurements within time window
3. Aligns timestamps using rounding frequency
4. Computes specified error metric (MSE, MAE, RMSE, MAPE, or SMAPE)
5. Evaluates thresholds and applies debounce logic
6. Sends notifications via configured channels

#### `compute_error_metric(forecast_values, actual_values, metric_type)`

Core error computation engine that calculates forecast accuracy metrics.

Supported error metrics:

- `mse`: Mean Squared Error - measures average squared differences
- `mae`: Mean Absolute Error - measures average absolute differences
- `rmse`: Root Mean Squared Error - square root of MSE, same units as original data
- `mape`: Mean Absolute Percentage Error - percentage-based error
- `smape`: Symmetric Mean Absolute Percentage Error - bounded 0-200%, handles over/under-estimation symmetrically

#### `evaluate_thresholds(error_value, threshold_config)`

Evaluates computed error against configured thresholds to determine alert level.

Returns alert level based on threshold ranges:

- `INFO`: Informational threshold exceeded
- `WARN`: Warning threshold exceeded
- `ERROR`: Error threshold exceeded
- `CRITICAL`: Critical threshold exceeded

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
 --trigger-arguments 'window=10m,min_condition_duration=1m'
 ```
4. **Monitor notification delivery** in logs:

 ```bash
 influxdb3 query --database YOUR_DATABASE \
  "SELECT * FROM system.processing_engine_logs WHERE log_text LIKE '%notification%'"
 ```
### Performance considerations

- **Data alignment**: Use appropriate `rounding_freq` to balance accuracy and performance
- **Window size**: Larger windows increase computation time but provide more robust error estimates
- **Debounce duration**: Balance between noise suppression and alert responsiveness
- **Notification throttling**: Built-in retry logic prevents notification spam
- **Memory usage**: Plugin processes data in pandas DataFrames - consider memory for large datasets

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.