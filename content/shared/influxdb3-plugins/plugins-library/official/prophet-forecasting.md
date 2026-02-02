⚡ scheduled, http  
🏷️ forecasting, machine-learning, time-series, predictive-analytics 🔧 {{% product-name %}}


The Prophet Forecasting Plugin enables time series forecasting for data in {{% product-name %}} using Facebook's Prophet library. Generate predictions for future data points based on historical patterns, including seasonality, trends, and custom events. Supports both scheduled batch forecasting and on-demand HTTP-triggered forecasts with model persistence and validation capabilities.

- **Model persistence**: Save and reuse trained models for consistent predictions
- **Forecast validation**: Built-in accuracy assessment using Mean Squared Relative Error (MSRE)
- **Holiday support**: Built-in holiday calendars and custom holiday configuration
- **Advanced seasonality**: Configurable seasonality modes and changepoint detection
- **Flexible time intervals**: Support for seconds, minutes, hours, days, weeks, months, quarters, and years

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. Some plugins support TOML configuration files, which can be specified using the plugin's `config_file_path` parameter.

If a plugin supports multiple trigger specifications, some parameters may depend on the trigger specification that you use.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [{{% product-name %}} Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Scheduled trigger parameters

| Parameter            | Type   | Default  | Description                                                       |
|----------------------|--------|----------|-------------------------------------------------------------------|
| `measurement`        | string | required | Source measurement containing historical data                     |
| `field`              | string | required | Field name to forecast                                            |
| `window`             | string | required | Historical data window. Format: `<number><unit>` (for example, "30d")    |
| `forecast_horizont`  | string | required | Forecast duration. Format: `<number><unit>` (for example, "2d")          |
| `tag_values`         | string | required | Dot-separated tag filters (for example, "region:us-west.device:sensor1") |
| `target_measurement` | string | required | Destination measurement for forecast results                      |
| `model_mode`         | string | required | Operation mode: "train" or "predict"                              |
| `unique_suffix`      | string | required | Unique model identifier for versioning                            |

### HTTP trigger parameters

| Parameter            | Type   | Default  | Description                                              |
|----------------------|--------|----------|----------------------------------------------------------|
| `measurement`        | string | required | Source measurement containing historical data            |
| `field`              | string | required | Field name to forecast                                   |
| `forecast_horizont`  | string | required | Forecast duration. Format: `<number><unit>` (for example, "7d") |
| `tag_values`         | object | required | Tag filters as JSON object (for example, {"region":"us-west"})  |
| `target_measurement` | string | required | Destination measurement for forecast results             |
| `unique_suffix`      | string | required | Unique model identifier for versioning                   |
| `start_time`         | string | required | Historical window start (ISO 8601 format)                |
| `end_time`           | string | required | Historical window end (ISO 8601 format)                  |

### Advanced parameters

| Parameter                 | Type         | Default    | Description                                              |
|---------------------------|--------------|------------|----------------------------------------------------------|
| `seasonality_mode`        | string       | "additive" | Prophet seasonality mode: "additive" or "multiplicative" |
| `changepoint_prior_scale` | number       | 0.05       | Flexibility of trend changepoints                        |
| `changepoints`            | string/array | none       | Changepoint dates (ISO format)                           |
| `holiday_date_list`       | string/array | none       | Custom holiday dates (ISO format)                        |
| `holiday_names`           | string/array | none       | Holiday names corresponding to dates                     |
| `holiday_country_names`   | string/array | none       | Country codes for built-in holidays                      |
| `inferred_freq`           | string       | auto       | Manual frequency specification (for example, "1D", "1H")        |
| `validation_window`       | string       | "0s"       | Validation period duration                               |
| `msre_threshold`          | number       | infinity   | Maximum acceptable Mean Squared Relative Error           |
| `target_database`         | string       | current    | Database for forecast storage                            |
| `save_mode`               | string       | "false"    | Whether to save/load models (HTTP only)                  |

### Notification parameters

| Parameter              | Type   | Default  | Description                         |
|------------------------|--------|----------|-------------------------------------|
| `is_sending_alert`     | string | "false"  | Enable alerts on validation failure |
| `notification_text`    | string | template | Custom alert message template       |
| `senders`              | string | none     | Dot-separated notification channels |
| `notification_path`    | string | "notify" | Notification endpoint path          |
| `influxdb3_auth_token` | string | env var  | Authentication token                |

### TOML configuration

| Parameter          | Type   | Default | Description                                                                      |
|--------------------|--------|---------|----------------------------------------------------------------------------------|
| `config_file_path` | string | none    | TOML config file path relative to `PLUGIN_DIR` (required for TOML configuration) |

*To use a TOML configuration file, set the `PLUGIN_DIR` environment variable and specify the `config_file_path` in the trigger arguments.* This is in addition to the `--plugin-dir` flag when starting {{% product-name %}}.

#### Example TOML configuration

[prophet_forecasting_scheduler.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/prophet_forecasting/prophet_forecasting_scheduler.toml)

For more information on using TOML configuration files, see the Using TOML Configuration Files section in the [influxdb3_plugins/README.md](https://github.com/influxdata/influxdb3_plugins/blob/master/README.md).

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled.
- **Python packages**:
 	- `pandas` (for data manipulation)
 	- `numpy` (for numerical operations)
 	- `requests` (for HTTP requests)
 	- `prophet` (for time series forecasting)

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
   influxdb3 install package numpy
   influxdb3 install package requests
   influxdb3 install package prophet
   ```
### Create scheduled trigger

Create a trigger for periodic forecasting:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename prophet_forecasting.py \
  --trigger-spec "every:1d" \
  --trigger-arguments "measurement=temperature,field=value,window=30d,forecast_horizont=2d,tag_values=region:us-west.device:sensor1,target_measurement=temperature_forecast,model_mode=train,unique_suffix=20250619_v1" \
  prophet_forecast_trigger
```
### Create HTTP trigger

Create a trigger for on-demand forecasting:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename prophet_forecasting.py \
  --trigger-spec "request:forecast" \
  prophet_forecast_http_trigger
```
### Enable triggers

```bash
influxdb3 enable trigger --database mydb prophet_forecast_trigger
influxdb3 enable trigger --database mydb prophet_forecast_http_trigger
```
## Examples

### Scheduled forecasting

Example HTTP request for on-demand forecasting:

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
    "unique_suffix": "model_v1_20250722",
    "start_time": "2025-05-20T00:00:00Z",
    "end_time": "2025-06-19T00:00:00Z",
    "seasonality_mode": "additive",
    "changepoint_prior_scale": 0.05,
    "validation_window": "3d",
    "msre_threshold": 0.05
  }'
```
### Advanced forecasting with holidays

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
    "unique_suffix": "retail_model_v2",
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

Forecast results are written to the target measurement with the following structure:

### Tags

- `model_version`: Model identifier from unique_suffix parameter
- Additional tags from original measurement query filters

### Fields

- `forecast`: Predicted value (yhat from Prophet model)
- `yhat_lower`: Lower bound of confidence interval
- `yhat_upper`: Upper bound of confidence interval  
- `run_time`: Forecast execution timestamp (ISO 8601 format)

### Timestamp

- `time`: Forecast timestamp in nanoseconds

## Troubleshooting

### Common issues

**Model training failures**

- Ensure sufficient historical data points for the specified window
- Verify data contains required time column and forecast field
- Check for data gaps that might affect frequency inference
- Set `inferred_freq` manually if automatic detection fails

**Validation failures**

- Review MSRE threshold settings - values too low may cause frequent failures
- Ensure validation window provides sufficient data for comparison
- Check that validation data aligns temporally with forecast period

**HTTP trigger issues**

- Verify JSON request body format matches expected schema
- Check authentication tokens and database permissions
- Ensure start_time and end_time are in valid ISO 8601 format with timezone

**Model persistence problems**

- Verify plugin directory permissions for model storage
- Check disk space availability in plugin directory
- Ensure unique_suffix values don't conflict between different model versions

### Model storage

- **Location**: Models stored in `prophet_models/` directory within plugin directory
- **Naming**: Files named `prophet_model_{unique_suffix}.json`
- **Versioning**: Use descriptive unique_suffix values for model management

### Time format support

Supported time units for window, forecast_horizont, and validation_window:

- `s` (seconds), `min` (minutes), `h` (hours)  
- `d` (days), `w` (weeks)
- `m` (months ≈30.42 days), `q` (quarters ≈91.25 days), `y` (years = 365 days)

### Validation process

When validation_window is set:

1. Training data: `current_time - window` to `current_time - validation_window`
2. Validation data: `current_time - validation_window` to `current_time`
3. MSRE calculation: `mean((actual - predicted)² / actual²)`
4. Threshold comparison and optional alert dispatch


## Logging

Logs are stored in the `_internal` database (or the database where the trigger is created) in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'your_trigger_name'"
```

Log columns:
- **event_time**: Timestamp of the log event
- **trigger_name**: Name of the trigger that generated the log
- **log_level**: Severity level (INFO, WARN, ERROR)
- **log_text**: Message describing the action or error

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.