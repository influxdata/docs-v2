<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
⚡ scheduled, http
🏷️ forecasting, machine-learning, time-series, deep-learning
🔧 {{% product-name %}}

> **Note:** This plugin requires {{% product-name %}}.8.2 or later.


The Chronos Forecasting Plugin enables zero-shot time-series forecasting for data in {{% product-name %}} using Amazon's Chronos model family from HuggingFace.
Generate predictions for future data points without model training, using pre-trained transformer models.
Supports both scheduled batch forecasting and on-demand HTTP-triggered forecasts.

- **Zero-shot inference**: No training required — pre-trained models generalize to any time series
- **Model flexibility**: Supports Chronos-2 (group attention multivariate), Chronos-Bolt (fast), and original Chronos-T5
- **Multivariate support**: Chronos-2 models accept covariate fields for multivariate forecasting; `covariate_mode` selects whether they are used as auxiliary `past_covariates` or as jointly forecast target series
- **Prediction intervals**: Returns 50% and 80% prediction intervals alongside median forecasts
- **Model caching**: Downloaded models are cached on disk (HuggingFace cache) for fast reloads

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger.
Some plugins support TOML configuration files, which can be specified using the plugin's `config_file_path` parameter.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters.
This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Scheduled trigger parameters

| Parameter            | Type   | Default                      | Description                                                                                                                 |
|----------------------|--------|------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| `measurement`        | string | required                     | Source table containing historical time-series data                                                                         |
| `field`              | string | required                     | Numeric field name to forecast                                                                                              |
| `window`             | string | required                     | Historical lookback window. Format: `<number><unit>` (s, min, h, d)                                                         |
| `horizon`            | int    | required                     | Number of forecast steps to generate                                                                                        |
| `target_measurement` | string | `_forecasts.{measurement}`   | Destination table for forecast results                                                                                      |
| `model_id`           | string | `amazon/chronos-bolt-tiny`   | HuggingFace model ID                                                                                                        |
| `context_limit`      | int    | `512`                        | Maximum data points fed to the model                                                                                        |
| `agg_interval`       | string | `30s`                        | Aggregation interval for `date_bin` query                                                                                   |
| `tag_values`         | string | none                         | Dot-separated tag filters, values joined by `@` (e.g. `tag:v1@v2.tag2:v3`)                                                  |
| `covariate_fields`   | string | none                         | Space-separated covariate field names. Setting this enables Chronos-2 multivariate forecasting (requires a Chronos-2 model) |
| `covariate_mode`     | string | `covariate`                  | How covariates are used (Chronos-2): `covariate` (auxiliary past covariates) or `target` (jointly forecast all series)      |
| `target_database`    | string | current                      | Database for forecast storage                                                                                               |

### HTTP trigger parameters

HTTP parameters are sent in the JSON request body. Any value also set as a trigger argument is used as a default and overridden by the request body. The `covariate_fields` value may be a space-separated string or a JSON array.

| Parameter            | Type   | Default                      | Description                                                                                                                 |
|----------------------|--------|------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| `table`              | string | required                     | Source table name containing historical data                                                                                |
| `field`              | string | required                     | Numeric field name to forecast                                                                                              |
| `horizon`            | int    | `64`                         | Number of forecast steps to generate                                                                                        |
| `context_limit`      | int    | `512`                        | Maximum context window size (data points)                                                                                   |
| `model_id`           | string | `amazon/chronos-bolt-tiny`   | HuggingFace model ID                                                                                                        |
| `covariate_fields`   | string | none                         | Space-separated covariate field names. Setting this enables Chronos-2 multivariate forecasting (requires a Chronos-2 model) |
| `covariate_mode`     | string | `covariate`                  | How covariates are used (Chronos-2): `covariate` (auxiliary past covariates) or `target` (jointly forecast all series)      |
| `write_results`      | string | `false`                      | Write forecast results to the database                                                                                      |
| `target_measurement` | string | none                         | Destination table for results (required if `write_results` is true)                                                         |
| `target_database`    | string | current                      | Database for forecast storage                                                                                               |

> **`where_clause`**: An optional SQL `WHERE` clause for filtering source data, passed in the request body like any other parameter. Example: `{"where_clause": "host = 'server1'"}`.

### TOML configuration

| Parameter          | Type   | Default | Description                                                                                                                                         |
|--------------------|--------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| `config_file_path` | string | none    | Path to a TOML config file: absolute, or relative to the plugin directory (`INFLUXDB3_PLUGIN_DIR` or `PLUGIN_DIR`). Required for TOML configuration |

*To use a TOML configuration file, specify the `config_file_path` in the trigger arguments. Relative paths are resolved from the plugin directory (`INFLUXDB3_PLUGIN_DIR` or `PLUGIN_DIR`), with a fallback to the processing engine's virtual environment; absolute paths are used as-is.*

#### Example TOML configuration

[chronos_forecasting_scheduler.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/chronos_forecasting/chronos_forecasting_scheduler.toml)

## Software requirements

- **{{% product-name %}}**: with the Processing Engine enabled.
- **Python packages**:
    - `chronos-forecasting` (Amazon Chronos model pipeline)
    - `torch` (PyTorch for model inference)

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
   influxdb3 install package chronos-forecasting
   influxdb3 install package torch
   ```
## Trigger setup

### HTTP trigger

Create a trigger for on-demand forecasting:

```bash
influxdb3 create trigger \
  --database mydb \
  --path chronos_forecasting.py \
  --trigger-spec "request:forecast_series" \
  chronos_forecast_http
```
### Scheduled trigger

Create a trigger for periodic forecasting:

```bash
influxdb3 create trigger \
  --database mydb \
  --path chronos_forecasting.py \
  --trigger-spec "every:5m" \
  --trigger-arguments "measurement=sensor_data,field=temperature,window=6h,horizon=64" \
  chronos_forecast_scheduled
```
### Enable triggers

```bash
influxdb3 enable trigger --database mydb chronos_forecast_http
influxdb3 enable trigger --database mydb chronos_forecast_scheduled
```
## Example usage

### On-demand HTTP forecast

Parameters are sent in the JSON request body:

```bash
curl -X POST "http://localhost:8181/api/v3/engine/forecast_series" \
  -H "Content-Type: application/json" \
  -d '{"table": "sensor_data", "field": "temperature", "horizon": 28, "context_limit": 128}'
```
### Expected output

```json
{
  "status": "ok",
  "model_id": "amazon/chronos-bolt-tiny",
  "table": "sensor_data",
  "field": "temperature",
  "context_length": 128,
  "horizon": 28,
  "load_seconds": 0.03,
  "inference_ms": 42.1,
  "step_ms": 30000,
  "historical": [
    {"timestamp": 1776300000000, "value": 21.34}
  ],
  "forecast": [
    {"step": 1, "timestamp": 1776300030000, "median": 21.5, "lower_80": 19.8, "upper_80": 23.1, "lower_50": 20.3, "upper_50": 22.7}
  ]
}
```
### Error responses

On failure, the HTTP endpoint returns a JSON object with `status` set to `error` and a human-readable `error` message (HTTP path only; the scheduled trigger logs errors instead):

```json
{"status": "error", "error": "Only 4 data points — need at least 10"}
```
### Filtering source data with a WHERE clause

Add `where_clause` to the request body:

```bash
curl -X POST "http://localhost:8181/api/v3/engine/forecast_series" \
  -H "Content-Type: application/json" \
  -d '{"table": "sensor_data", "field": "temperature", "where_clause": "host = '"'"'server1'"'"'"}'
```
### Multivariate forecast with Chronos-2

```bash
curl -X POST "http://localhost:8181/api/v3/engine/forecast_series" \
  -H "Content-Type: application/json" \
  -d '{"table": "sensor_data", "field": "temperature", "model_id": "amazon/chronos-2", "covariate_fields": ["humidity", "pressure"], "horizon": 64}'
```
## Code overview

### Key functions

- **`process_request(influxdb3_local, query_parameters, request_headers, request_body, args=None)`**: HTTP entry point for on-demand forecasting.
  Queries historical data, runs inference, and returns JSON with historical context and forecast points including confidence intervals.
- **`process_scheduled_call(influxdb3_local, call_time: datetime, args: dict | None = None)`**: Scheduled entry point for recurring forecasts.
  Reads config from trigger args or TOML, queries with `date_bin` aggregation, runs inference, and writes results back via `LineBuilder`.
- **`_load_model(model_id, influxdb3_local, task_id)`**: Loads Chronos models from HuggingFace.
  The plugin module is reloaded on every trigger run, so there is no in-process model cache; reloads are served from the on-disk HuggingFace cache (`HF_HOME`).
- **`_build_query_simple(table, fields, where_clause, context_limit)` / `_build_query_aggregated(measurement, fields, window, agg_interval, tag_values, context_limit)`**: Build the SQL that selects the target and any covariate fields in a single query, so every row stays time-aligned (covariates are aligned to the target by bin/row, not by length).
- **`_query_aligned_series(influxdb3_local, sql, aliases, time_col, reverse=False)` / `_fill_nulls(seq)`**: Execute the query, drop rows with a null target, keep covariate columns row-aligned, and forward/back-fill covariate gaps.
- **`_build_model_input(target_vals, covariates, model_id, covariate_mode)`**: Builds the model input appropriate to the model type.
  For Chronos-2 covariates: `covariate` mode passes them as `past_covariates`; `target` mode stacks them as extra target variates (`[1, channels, length]`) for group attention. Bolt and univariate cases use a list of 1D tensors.
- **`_run_inference(pipeline, tensor, horizon, target_channel=0)`**: Runs `predict_quantiles` for the quantile levels in `[0.1, 0.25, 0.5, 0.75, 0.9]` (within the trained `[0.1, 0.9]` range; `0.25`/`0.75` are interpolated) and returns the matrix transposed to `[quantiles, horizon]`.
- **`_write_lines(influxdb3_local, lines, target_database, task_id)`**: Writes `LineBuilder` objects synchronously via `write_sync` / `write_sync_to_db`.

### Docker environment notes

The plugin sets environment variables at import time for Docker compatibility:

- `USER=influxdb3` — HuggingFace Hub requires a username
- `HF_HOME=/tmp/hf_cache` — writable cache directory for model downloads
- `HOME=/tmp` — fallback home directory for unmapped UIDs
- `TORCHDYNAMO_DISABLE=1` — disables `torch.compile` to avoid conflicts in embedded Python
- `HF_HUB_DISABLE_PROGRESS_BARS=1`, `TQDM_DISABLE=1` — disable tqdm/HuggingFace progress bars

These are no-ops when running outside Docker with a normal user environment.

## Output data structure

Forecast results (scheduled mode) are written to the target measurement with the following structure:

### Tags

- `field`: source field name
- `model`: model label (for example, `chronos-bolt-tiny`)
- `source_table`: source measurement name
- `mode`: `univariate` or `multivariate`
- Additional tags from `tag_values` configuration

### Fields

- `forecast`: median predicted value
- `lower_80`, `upper_80`: 80% prediction interval bounds (quantiles 0.1 / 0.9)
- `lower_50`, `upper_50`: 50% prediction interval bounds (quantiles 0.25 / 0.75)
- `step`: forecast step number (1-indexed)

### Timestamp

- `time`: future timestamp in nanoseconds, spaced by `agg_interval` starting from the last observed data point

## Troubleshooting

### Common issues

**Model download failures**

- Ensure the InfluxDB host has internet access for the first model download from HuggingFace.
- Verify `HF_HOME` is writable.
  In Docker, the plugin automatically sets `HF_HOME=/tmp/hf_cache`.
- For air-gapped environments, pre-download models and set `model_id` to the local path.

**Insufficient data**

- The plugin requires at least 10 data points.
  Ensure the `window` parameter covers enough data at the specified `agg_interval`.
- For a `30s` interval and `6h` window, expect up to 720 points (capped at `context_limit`).

**Slow inference**

- `chronos-bolt-tiny` (~8M params) provides near-instant CPU inference.
- `amazon/chronos-2` is significantly slower on CPU (1-3 seconds per forecast).
- The first invocation downloads the model; subsequent calls reload it from the on-disk HuggingFace cache (`HF_HOME`). There is no in-process model cache, since the plugin module is reloaded on every trigger run.

**Multivariate mode not engaging**

- Set `covariate_fields` with at least one field name (this alone enables multivariate mode).
- Use a Chronos-2 model (`model_id` containing "chronos-2" or "chronos_2").
  Bolt and original Chronos models do not support group attention.
- Choose how covariates are treated with `covariate_mode`: `covariate` (default) passes them as auxiliary `past_covariates`; `target` jointly forecasts the target and all covariate series via group attention.

**Timestamp issues in HTTP response**

- If timestamps return as `null`, verify that `influxdb3_local.query()` returns parseable timestamp values.
- The plugin handles nanosecond integers, datetime objects, and ISO strings.


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
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
