<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
The Prophet Forecasting Plugin enables time series forecasting for data in {{% product-name %}} using Facebook's Prophet library. Generate predictions for future data points based on historical patterns, including seasonality, trends, and custom events. Supports both scheduled batch forecasting and on-demand HTTP-triggered forecasts with model persistence and validation capabilities.

- **Model persistence**: Save and reuse trained models for consistent predictions
- **Forecast validation**: Built-in accuracy assessment using Mean Squared Relative Error (MSRE)
- **Holiday support**: Built-in holiday calendars and custom holiday configuration
- **Advanced seasonality**: Configurable seasonality modes and changepoint detection
- **Flexible time intervals**: Support for microseconds through years

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. Some plugins support TOML configuration files, which can be specified using the plugin's `config_file_path` parameter.

If a plugin supports multiple trigger specifications, some parameters may depend on the trigger specification that you use.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Scheduled trigger parameters

Set these parameters with `--trigger-arguments` when creating a scheduled trigger:

| Parameter            | Type   | Default  | Description                                                                                                                                     |
|----------------------|--------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| `measurement`        | string | required | Source measurement containing historical data                                                                                                   |
| `field`              | string | required | Field name to forecast                                                                                                                          |
| `window`             | string | required | Historical data window, ending at the trigger's call time. Format: `<number><unit>` (for example, "30d")                                        |
| `forecast_horizont`  | string | required | Forecast duration. Format: `<number><unit>` (for example, "2d")                                                                                 |
| `tag_values`         | string | required | Tag filters as dot-separated `tag:value` pairs (for example, "region:us-west.device:sensor1")                                                   |
| `target_measurement` | string | required | Destination measurement for forecast results                                                                                                    |
| `model_mode`         | string | required | `train` trains an in-memory model on every run; `predict` loads the saved model for `unique_suffix`, or trains and saves it when no file exists |
| `unique_suffix`      | string | required | Model version identifier, also used as the model file name suffix. Up to 64 characters from letters, digits, `.`, `_` and `-`                   |

### HTTP request parameters

Send these parameters as JSON in the HTTP POST request body, which must be a JSON object of at most 10 MB. A request carries three layers of its own — the body, then the headers, then the query string, each overriding the one before — and all three override what the trigger holds: the [environment](#environment-variables), the trigger arguments, then the [TOML file](#toml-configuration) they name. A trigger created without arguments is configured by the request alone; one created with them holds the defaults each request overrides only where it names them. A value that arrives empty — a JSON `null` or a blank string — counts as not set, so the trigger's value or the default applies. A key outside the tables below is refused and named in the response, as is `config_file_path` whatever its value, so a misspelling is reported rather than silently dropped.

| Parameter            | Type          | Default  | Description                                                                                        |
|----------------------|---------------|----------|----------------------------------------------------------------------------------------------------|
| `measurement`        | string        | required | Source measurement containing historical data                                                      |
| `field`              | string        | required | Field name to forecast                                                                             |
| `forecast_horizont`  | string        | required | Forecast duration. Format: `<number><unit>` (for example, "7d")                                    |
| `tag_values`         | object/string | required | Tag filters as a JSON object (for example, `{"region": "us-west"}`) or a dot-separated string      |
| `target_measurement` | string        | required | Destination measurement for forecast results                                                       |
| `unique_suffix`      | string        | required | Model version identifier, also used as the model file name suffix                                  |
| `start_time`         | string        | required | Historical window start, ISO 8601 with timezone                                                    |
| `end_time`           | string        | required | Historical window end, ISO 8601 with timezone. Forecast points are written from this moment onward |
| `save_mode`          | boolean       | false    | When true, load the saved model for `unique_suffix`, or train and save it when no file exists      |

#### Headers and query parameters

The same names reach the plugin as headers, spelled `X-Influxdb3-Prophet-Forecasting-<PARAMETER>` with underscores written as hyphens (`X-Influxdb3-Prophet-Forecasting-Start-Time` sets `start_time`), and as query-string parameters, spelled exactly like the parameter (`?save_mode=true`). Header names are matched regardless of casing, which RFC 9110 makes meaningless.

```bash
curl -X POST "http://localhost:8181/api/v3/engine/forecast?save_mode=true" \
  -H "Authorization: Bearer $INFLUXDB3_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Influxdb3-Prophet-Forecasting-Unique-Suffix: v2" \
  -d '{"start_time": "2026-08-01T00:00:00Z", "end_time": "2026-08-29T00:00:00Z"}'
```
A header the plugin does not ask for is ignored, since a client sends headers of its own on every request; an unknown query parameter is refused and named in the response, like an unknown body field. Neither layer can name `config_file_path`, for the reason the body cannot.

### Advanced parameters

Available to both trigger types:

| Parameter                 | Type         | Default    | Description                                                                                                                                                                      |
|---------------------------|--------------|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `seasonality_mode`        | string       | "additive" | Prophet seasonality mode: "additive" or "multiplicative"                                                                                                                         |
| `changepoint_prior_scale` | number       | 0.05       | Flexibility of trend changepoints; must be greater than 0                                                                                                                        |
| `changepoints`            | string/array | none       | Changepoint dates (ISO format), space-separated or as a list                                                                                                                     |
| `holiday_date_list`       | string/array | none       | Custom holiday dates (ISO format), space-separated or as a list                                                                                                                  |
| `holiday_names`           | string/array | none       | Holiday names matching `holiday_date_list`, dot-separated or as a list                                                                                                           |
| `holiday_country_names`   | string/array | none       | Country code for built-in holidays, dot-separated or as a list. Prophet supports one country, so only the first entry is used                                                    |
| `inferred_freq`           | string       | auto       | Pandas frequency alias, fixed ("30min", "1h") or calendar ("D", "W-SUN", "MS", "QS"); inferred from the data when omitted                                                        |
| `validation_window`       | string       | "0s"       | Duration held back from training and used to validate the forecast                                                                                                               |
| `validation_alignment`    | string       | "position" | How actual and forecasted values are paired: `position` pairs them in time order, `nearest` pairs each actual value with the closest forecast point within half a frequency step |
| `msre_threshold`          | number       | infinity   | Maximum acceptable Mean Squared Relative Error; must be 0 or greater                                                                                                             |
| `max_forecast_points`     | integer      | 10000      | Maximum number of forecast points per run, counting the validation window                                                                                                        |
| `target_database`         | string       | "default"  | Database for forecast results. Without this parameter, results go to a database named `default`, created on the first write                                                      |

### Notification parameters

Scheduled triggers only:

| Parameter              | Type    | Default  | Description                                                                                                                |
|------------------------|---------|----------|----------------------------------------------------------------------------------------------------------------------------|
| `is_sending_alert`     | boolean | false    | Send an alert when validation fails                                                                                        |
| `notification_text`    | string  | template | Alert message template. Variables: `$version`, `$measurement`, `$field`, `$start_time`, `$end_time`, `$output_measurement` |
| `senders`              | string  | none     | Dot-separated notification channels; required when `is_sending_alert` is true                                              |
| `notification_path`    | string  | "notify" | URL path of the notification sender plugin                                                                                 |
| `influxdb3_auth_token` | string  | env var  | Token for the notification request; falls back to `INFLUXDB3_AUTH_TOKEN`                                                   |
| `port_override`        | integer | 8181     | Port for notification dispatch (1–65535)                                                                                   |

Each channel listed in `senders` needs its own keys (`slack_webhook_url`, `discord_webhook_url`, `http_webhook_url`, `twilio_sid`, `twilio_token`, `twilio_from_number`, `twilio_to_number`, and the optional `*_headers`). See the [influxdata/notifier plugin](/influxdb3/version/plugins/library/official/notifier/).

### Environment variables

Every parameter can also come from an environment variable named `INFLUXDB3_PROPHET_FORECASTING_<PARAMETER>` in upper case — for example, `INFLUXDB3_PROPHET_FORECASTING_MEASUREMENT` sets `measurement`, and `INFLUXDB3_PROPHET_FORECASTING_TWILIO_TOKEN` keeps a channel credential out of the trigger. `influxdb3_auth_token` keeps its own variable, `INFLUXDB3_AUTH_TOKEN`. The environment is the lowest layer: a trigger argument overrides it, the TOML file overrides both, and on the HTTP trigger the request — its body, its headers and its query string — overrides them all. `INFLUXDB3_PROPHET_FORECASTING_CONFIG_FILE_PATH` names the TOML file when the trigger doesn't carry a `config_file_path` argument.

### TOML configuration

| Parameter          | Type   | Default | Description                                                                      |
|--------------------|--------|---------|----------------------------------------------------------------------------------|
| `config_file_path` | string | none    | `.toml` file, relative to `PLUGIN_DIR` or absolute. A trigger argument on either trigger |

*To use a TOML configuration file, set the `PLUGIN_DIR` environment variable and specify the `config_file_path` in the trigger arguments.* This is in addition to the `--plugin-dir` flag when starting {{% product-name %}}. Relative paths are resolved against the first directory that is set: `PLUGIN_DIR`, then `INFLUXDB3_PLUGIN_DIR`, then the parent of `VIRTUAL_ENV`. Only that directory is used — the file is not looked up in the remaining ones.

The file's values override the other trigger arguments, and on the HTTP trigger the request overrides the file; an argument the file does not set still applies. `INFLUXDB3_AUTH_TOKEN` from the environment applies when `influxdb3_auth_token` is set neither as an argument nor in the file. In TOML, `tag_values`, `senders`, `changepoints`, `holiday_date_list`, `holiday_names` and `holiday_country_names` can use native structures (a table or a list) instead of the inline string formats, though the inline strings are also accepted. The path is never read from a request — not from its body, its headers or its query string. It names a layer rather than setting a value: a request that could choose which file the trigger reads would take the trigger's configuration out of the operator's hands, so the body and the query string refuse it and a header spelling it is dropped.

#### Example TOML configuration

[prophet_forecasting_scheduler.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/prophet_forecasting/prophet_forecasting_scheduler.toml)

For more information on using TOML configuration files, see the Using TOML Configuration Files section in the [influxdb3_plugins/README.md](https://github.com/influxdata/influxdb3_plugins/blob/master/README.md).

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled.
- **Python packages**:
  - `influxdata-plugin-utils>=0.4.0` (configuration loading, parsing, and writing)
  - `pandas` (for data manipulation; 2.x and 3.x are both supported)
  - `requests` (for HTTP requests)
  - `prophet` (for time series forecasting)
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
   influxdb3 install package pandas
   influxdb3 install package requests
   influxdb3 install package prophet
   ```
3. *(Optional)* For notifications, install the [influxdata/notifier plugin](/influxdb3/version/plugins/library/official/notifier/) and create an HTTP trigger for it.

## Trigger setup

### Scheduled trigger

Create a trigger for periodic forecasting:

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/prophet_forecasting/prophet_forecasting.py" \
  --trigger-spec "every:1d" \
  --trigger-arguments "measurement=temperature,field=value,window=30d,forecast_horizont=2d,tag_values=region:us-west.device:sensor1,target_measurement=temperature_forecast,model_mode=train,unique_suffix=20250619_v1,target_database=mydb" \
  prophet_forecast_trigger
```
### HTTP trigger

Create a trigger for on-demand forecasting. Without trigger arguments the request body carries the whole configuration; with them, they are the defaults the body overrides. See [TOML configuration](#toml-configuration) for naming a file on the trigger.

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/prophet_forecasting/prophet_forecasting.py" \
  --trigger-spec "request:forecast" \
  prophet_forecast_http_trigger
```
A trigger that fixes the source and destination leaves each request to name only its window and model version:

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/prophet_forecasting/prophet_forecasting.py" \
  --trigger-spec "request:forecast" \
  --trigger-arguments "measurement=temperature,field=value,forecast_horizont=7d,tag_values=region:us-west,target_measurement=temperature_forecast,target_database=mydb" \
  prophet_forecast_http_trigger
```
### Enable triggers

```bash
influxdb3 enable trigger --database mydb prophet_forecast_trigger
influxdb3 enable trigger --database mydb prophet_forecast_http_trigger
```
## Example usage

### Example 1: Basic scheduled forecasting

Write historical data and create a forecast:

```bash
# Write historical temperature data
influxdb3 write \
  --database mydb \
  "temperature,region=us-west,device=sensor1 value=22.5"

# Create and enable the trigger
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/prophet_forecasting/prophet_forecasting.py" \
  --trigger-spec "every:1d" \
  --trigger-arguments "measurement=temperature,field=value,window=30d,forecast_horizont=2d,tag_values=region:us-west.device:sensor1,target_measurement=temperature_forecast,model_mode=train,unique_suffix=v1,target_database=mydb" \
  prophet_forecast

influxdb3 enable trigger --database mydb prophet_forecast

# Query forecast results (after trigger runs)
influxdb3 query \
  --database mydb \
  "SELECT time, forecast, yhat_lower, yhat_upper FROM temperature_forecast ORDER BY time DESC LIMIT 5"
```
**Expected output**

```
+----------------------+---------+------------+------------+
| time                 | forecast| yhat_lower | yhat_upper |
+----------------------+---------+------------+------------+
| 2025-06-21T00:00:00Z | 23.2    | 21.8       | 24.6       |
| 2025-06-20T00:00:00Z | 22.9    | 21.5       | 24.3       |
+----------------------+---------+------------+------------+
```
### Example 2: On-demand HTTP forecasting

```bash
curl -X POST http://localhost:8181/api/v3/engine/forecast \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "measurement": "temperature",
    "field": "value",
    "forecast_horizont": "7d",
    "tag_values": {"region":"us-west","device":"sensor1"},
    "target_measurement": "temperature_forecast",
    "target_database": "mydb",
    "unique_suffix": "model_v1_20250722",
    "start_time": "2025-05-20T00:00:00Z",
    "end_time": "2025-06-19T00:00:00Z",
    "seasonality_mode": "additive",
    "changepoint_prior_scale": 0.05,
    "validation_window": "3d",
    "validation_alignment": "nearest",
    "msre_threshold": 0.05
  }'
```
**Expected response**

```json
{"message": "[<task_id>] Forecast written to temperature_forecast"}
```
### Example 3: Advanced forecasting with holidays

```bash
curl -X POST http://localhost:8181/api/v3/engine/forecast \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "measurement": "sales",
    "field": "revenue",
    "forecast_horizont": "30d",
    "tag_values": {"store":"main_branch"},
    "target_measurement": "revenue_forecast",
    "target_database": "mydb",
    "unique_suffix": "retail_model_v2",
    "save_mode": true,
    "start_time": "2024-01-01T00:00:00Z",
    "end_time": "2025-06-01T00:00:00Z",
    "holiday_country_names": ["US"],
    "holiday_date_list": ["2025-07-04"],
    "holiday_names": ["Independence Day"],
    "changepoints": ["2025-01-01", "2025-03-01"],
    "inferred_freq": "1D"
  }'
```
## Output data structure

Forecast results are written to the target measurement in `target_database`, or to a database named `default` when that parameter is omitted.

### Tags

- `model_version`: Model identifier from the `unique_suffix` parameter
- One tag per entry in `tag_values`

### Fields

- `forecast`: Predicted value (`yhat` from the Prophet model)
- `yhat_lower`: Lower bound of the confidence interval
- `yhat_upper`: Upper bound of the confidence interval
- `run_time`: Time the forecast ran, ISO 8601 with UTC offset

### Timestamp

- `time`: Forecast timestamp in nanoseconds

Points where a forecast value is not finite are skipped, and their count is logged as a warning.

## Code overview

### Files

- `prophet_forecasting.py`: The main plugin code containing handlers for scheduled and HTTP triggers
- `prophet_forecasting_scheduler.toml`: Example TOML configuration file for scheduled triggers
- `requirements.txt`, `requirements-dev.txt`: Runtime and development dependencies

### Logging

Logs are stored in the trigger's database in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database YOUR_DATABASE "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'prophet_forecast_trigger'"
```
### Main functions

#### `process_scheduled_call(influxdb3_local, call_time, args)`

Handles scheduled forecasting. The training window ends at `call_time - validation_window` and starts at `call_time - window`; forecast points are written from `call_time` onward.

Key operations:

1. Loads and validates the configuration from the trigger arguments or the TOML file
2. Queries the historical window with the configured tag filters
3. Trains a model or loads the saved one, depending on `model_mode`
4. Forecasts at the resolved frequency, from one step after the last queried point up to `call_time` plus `forecast_horizont`
5. Validates the forecast when `validation_window` is set, and sends an alert on failure
6. Writes the forecast points

#### `process_request(influxdb3_local, query_parameters, request_headers, request_body, args)`

Handles on-demand forecasts over an explicit window. The training window is `start_time` to `end_time - validation_window`, and forecast points are written from `end_time` onward. Returns `{"message": ...}` describing the outcome.

## Troubleshooting

### Common issues

#### Issue: Model training failures

**Solution**: Ensure sufficient historical data points for the specified window. Verify the data contains the forecast field with numeric values; rows where the field is missing or non-numeric are dropped and counted in a warning. Set `inferred_freq` manually when the frequency cannot be inferred (at least three points are required); a frequency that does not move time forward, such as `0h`, is rejected.

#### Issue: Validation failures

**Solution**: Review the `msre_threshold` setting — values that are too low cause frequent failures. Ensure the validation window holds enough data. With `validation_alignment=nearest`, an actual value is only compared when a forecast point falls within half a frequency step of it, and validation is skipped when nothing matches; check that `inferred_freq` matches the real cadence of the data.

#### Issue: `Invalid unique_suffix`

**Solution**: `unique_suffix` becomes part of the model file name and accepts up to 64 characters from letters, digits, `.`, `_` and `-`.

#### Issue: HTTP trigger issues

**Solution**: Verify the JSON request body matches the expected schema. The response message names the key or value that was refused. Check authentication tokens and database permissions. Ensure `start_time` and `end_time` are valid ISO 8601 values with a timezone.

#### Issue: Forecast results are not in the expected database

**Solution**: Set `target_database`. Without it, results are written to a database named `default`, which is created on the first write.

### Model storage

- **Location**: `prophet_models/` under the resolved plugin directory (`PLUGIN_DIR`, `INFLUXDB3_PLUGIN_DIR`, or the parent of `VIRTUAL_ENV`)
- **Naming**: Files named `prophet_model_{unique_suffix}.json`
- **Writing**: Models are written to a temporary file and renamed into place
- **Versioning**: Use descriptive `unique_suffix` values for model management
- **Reuse**: A model loaded from disk forecasts the timestamps derived from the freshly queried data, so it stays usable after the data has moved on; its coefficients still come from the data it was trained on, so the further the run is from that training window, the wider the extrapolation

### Frequency support

The forecast step comes from `inferred_freq` or is inferred from the data. Fixed aliases (`1s`, `30min`, `1h`) and calendar aliases (`D`, `W-SUN`, `MS`, `QS`, `YS`) are both supported; calendar steps follow the calendar, so a monthly forecast lands on month starts. Forecast timestamps start one step after the last queried point and run until `forecast_horizont` past the trigger's call time (or `end_time` for HTTP requests).

### Time format support

Supported units for `window`, `forecast_horizont` and `validation_window`:

- `us` (microseconds), `ms` (milliseconds), `s` (seconds), `min` (minutes), `h` (hours)
- `d` (days), `w` (weeks)
- `m` (months ≈30.42 days), `q` (quarters ≈91.25 days), `y` (years = 365 days)

### Validation process

When `validation_window` is set:

1. Training data: window start to `window_end - validation_window`
2. Validation data: `window_end - validation_window` to `window_end`
3. Actual and forecasted values are paired according to `validation_alignment`; `nearest` compares each actual value with the forecast point closest in time — at most half a frequency step away — and ignores actual values that fall outside the forecast range
4. MSRE: `mean((actual - predicted)² / actual²)`, computed over non-zero actual values
5. Validation fails when MSRE exceeds `msre_threshold` or cannot be computed at all — the validation window holds no data, no actual value is close enough to a forecast point, or every actual value is zero. A failed validation withholds the forecast and sends an alert if configured

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
