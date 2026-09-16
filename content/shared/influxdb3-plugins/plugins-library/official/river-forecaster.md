<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
An {{% product-name %}} Processing Engine plugin that provides online time-series forecasting using [River ML](https://riverml.xyz)'s SNARIMAX model. The plugin learns incrementally from incoming data and periodically produces multi-step-ahead forecasts, all within a single WAL trigger.

## Features

- **Online learning:** SNARIMAX model updates incrementally with each observation — no batch retraining needed
- **Single-trigger design:** Learns from incoming data and produces forecasts when previous predictions are fully consumed — self-throttling per model
- **Auto-horizon:** Automatically determines forecast horizon from the model's own observed write frequency
- **Per-series models:** Each unique combination of table + tags + field gets its own forecast model
- **Explicit table selection:** You specify which tables and fields to forecast — no surprise cardinality explosions
- **LRU eviction:** Configurable limit on tracked series to control memory usage

## Prerequisites

- {{% product-name %}} with Processing Engine enabled
- River ML library (`river>=0.23.0`)

## Quick Start

### 1. Install River

```bash
influxdb3 install package river
```
### 2. Create the trigger

Specify which tables to forecast with `include_tables`:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename river_forecaster.py \
  --trigger-spec "all_tables" \
  --trigger-arguments "include_tables=system_cpu system_memory" \
  forecaster
```
The plugin will start learning from all numeric fields in the specified tables and produce forecasts once models warm up (default: 30 observations). Each model produces a new forecast automatically once its previous predictions have been fully consumed by incoming actuals.

### 3. Query forecasts

```sql
SELECT * FROM "_forecasts.system_cpu"
WHERE field_name = 'idle'
ORDER BY time DESC LIMIT 12
```
## Customized Example

Forecast specific fields with tuned parameters:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename river_forecaster.py \
  --trigger-spec "all_tables" \
  --trigger-arguments "include_tables=system_cpu system_memory" "include_fields=idle used available" "max_series=100" "default_horizon=24" "log_forecasts=true" \
  forecaster
```
## Trigger Arguments

| Argument                      | Required   | Default    | Description                                                                                                                                      |
|-------------------------------|------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| `include_tables`              | **Yes**    | —          | Space-separated tables to forecast (for example, `system_cpu system_memory`). In TOML config use a list.                                                |
| `include_fields`              | No         | *(all)*    | Space-separated fields to forecast (for example, `idle used`). Omit to use all numeric fields. In TOML config use a list.                               |
| `string_fields`               | No         | *(none)*   | Space-separated string column names that should be treated as fields, not tags. All other string columns become tags. In TOML config use a list. |
| `max_series`                  | No         | `50`       | Max unique series to track (LRU eviction)                                                                                                        |
| `min_observations`            | No         | `30`       | Minimum observations before forecasting                                                                                                          |
| `default_horizon`             | No         | `12`       | Fallback horizon if the model's own write_interval estimate is unavailable                                                                       |
| `forecast_target_seconds`     | No         | `3600`     | Target forecast window for auto-horizon                                                                                                          |
| `snarimax_p`                  | No         | `0` (auto) | SNARIMAX autoregressive order. 0 = auto-tune from write frequency (~1h lookback, clamped 4-30)                                                   |
| `snarimax_d`                  | No         | `1`        | SNARIMAX differencing order                                                                                                                      |
| `snarimax_q`                  | No         | `1`        | SNARIMAX moving average order                                                                                                                    |
| `calibration_count`           | No         | `30`       | Observations buffered before finalizing SNARIMAX `p` (only used when `snarimax_p=0`). Larger = more reliable interval estimate, longer warm-up.  |
| `log_forecasts`               | No         | `false`    | Log forecast details                                                                                                                             |
| `checkpoint_interval_seconds` | No         | `1800`     | Seconds between model checkpoints to the database                                                                                                |
| `max_checkpoint_age_hours`    | No         | `24`       | Ignore checkpoints older than this when restoring                                                                                                |
| `min_checkpoint_observations` | No         | `10`       | Skip checkpointing models with fewer observations than this (avoids persisting cold-start models)                                                |
| `config_file_path`            | No         | —          | Path to TOML config file                                                                                                                         |

## Output Schema

Forecasts are written to `_forecasts.{source_table}`.

**Tags:** All original tags from the source row, plus `field_name` (name of the forecasted field) and `model` (always `"snarimax"`).

**Fields:**

| Field            | Type    | Description                                      |
|------------------|---------|--------------------------------------------------|
| `horizon_step`   | integer | 1-based index of this step in the forecast run   |
| `forecast_value` | float   | Predicted value for this future step             |
| `horizon_total`  | integer | Total steps in this forecast                     |
| `observations`   | integer | How many observations the model has learned from |

**Timestamps:** Each forecast row gets a future timestamp:
```
forecast_time = last_observed_time + (step * write_interval_seconds)
```
## How It Works

### SNARIMAX Model

River's `time_series.SNARIMAX` is an online ARIMA variant. Default parameters:

| Parameter          | Default    | Rationale                                                                                                     |
|--------------------|------------|---------------------------------------------------------------------------------------------------------------|
| `p` (AR order)     | `0` (auto) | Auto-tuned from write frequency to capture ~1 hour of lag history (clamped 4-30). Set explicitly to override. |
| `d` (differencing) | `1`        | Handle non-stationary trends                                                                                  |
| `q` (MA order)     | `1`        | Basic error correction                                                                                        |

### Calibration Phase

When `snarimax_p=0` (auto — the default), the model cannot be created immediately because it does not yet know the write frequency. Instead the plugin enters a calibration phase:

1. The first `calibration_count` observations (default: 30) are buffered in memory. A smoothed write-interval estimate is tracked in parallel.
2. Once the buffer is full, the plugin chooses `p = round(3600 / write_interval_s)` (clamped to `[4, 30]`), creates the SNARIMAX model, and replays the buffered observations through it.
3. From that point on the model learns online on every incoming observation — calibration is a one-time bootstrap.

Calibration happens only once per series. Increasing `calibration_count` gives a more reliable write-interval estimate at the cost of a longer warm-up. When `snarimax_p` is set to a non-zero value, calibration is skipped entirely and the model is created immediately.

### Warm-up Behavior

Models need at least `min_observations` (default: 30) before producing forecasts. During warm-up, the plugin continues learning but skips the series when producing forecasts.

When `snarimax_p=0`, the calibration phase counts toward the observation total: with the defaults (`calibration_count=30`, `min_observations=30`) the first forecast is produced right after calibration finishes. If `min_observations > calibration_count`, the model still needs extra observations after calibration before it starts forecasting.

### Auto-Horizon

The forecast horizon — how many future steps each run predicts — is derived from each model's own EW-smoothed write interval (tracked from incoming timestamps). The goal is to cover roughly `forecast_target_seconds` of future data per run:

1. **Primary:** `horizon = max(1, round(forecast_target_seconds / write_interval))`. With defaults (1 hour target, 10 s write interval) this gives 360 future points per forecast.
2. **Fallback:** `default_horizon` (12) — used only when the interval estimate is not yet available (e.g. immediately after a checkpoint restore, before the second observation has arrived).

### LRU Eviction

When the number of tracked series exceeds `max_series`, the least recently used series is evicted. If an evicted series reappears, it starts fresh with a new warm-up period.

## Model Persistence

Models are stored in `influxdb3_local.cache` (in-memory) and persist across WAL flushes. To survive server restarts, the plugin automatically checkpoints and restores them.

### Checkpoint

Every `checkpoint_interval_seconds` (default: 1800 = 30 minutes), the plugin pickles each per-series model, zlib-compresses it, base64-encodes the result, and writes it to `_system.model_checkpoints`. Large checkpoints are split into chunks that fit within InfluxDB's 64 KB string field limit. This is time-gated so it only runs once per interval regardless of how often WAL flushes trigger the plugin.

Models with fewer than `min_checkpoint_observations` observations (default: 10) are skipped — there is no point persisting cold-start state that would be rebuilt from scratch on restore anyway.

### Restore

On the first invocation after a server restart (detected by an empty model cache), the plugin queries `_system.model_checkpoints` for the latest checkpoint per series. Checkpoints older than `max_checkpoint_age_hours` (default: 24) are ignored. Chunks are grouped by their timestamp so that chunks from different checkpoint runs are never mixed together. Restored models resume learning and forecasting immediately.

### Checkpoint Schema (`_system.model_checkpoints`)

| Column                  | Type    | Description                                 |
|-------------------------|---------|---------------------------------------------|
| `plugin`                | tag     | `"river_forecaster"`                        |
| `series_key`            | tag     | Unique series identifier                    |
| `chunk_index`           | tag     | 0-based index of this chunk                 |
| `chunk_total`           | tag     | Total number of chunks for this checkpoint  |
| `model_data`            | string  | Base64-encoded zlib-compressed pickle chunk |
| `model_type`            | string  | `"SeriesForecaster"`                        |
| `observation_count`     | integer | Observations the model has processed        |
| `checkpoint_size_bytes` | integer | Size of the compressed pickle               |

## Forecast Evaluation

After each forecast run, the plugin stores predictions in memory and compares them step-by-step against incoming actual values. A new forecast is only produced once all steps from the previous forecast have been evaluated, so MAE always covers the full forecast horizon.

MAE is tracked per model in memory (and persisted via checkpoints). When `log_forecasts=true`, it is written to the plugin log after each forecast run that accumulated new evaluation points, in the form `EVAL: <series_key> MAE=<value> (<N> points)`.

## TOML Configuration

Instead of passing trigger arguments inline, you can use a TOML config file:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename river_forecaster.py \
  --trigger-spec "all_tables" \
  --trigger-arguments config_file_path=river_forecaster_config.toml \
  forecaster
```
See `river_forecaster_config.toml` for an example configuration.

## Query Examples

```sql
-- All forecasts for a specific host and field
SELECT time, horizon_step, forecast_value
FROM "_forecasts.system_cpu"
WHERE host = 'server01' AND field_name = 'idle'
ORDER BY time DESC LIMIT 12

-- Latest forecast run for one series (all horizon steps)
SELECT time, horizon_step, forecast_value, horizon_total
FROM "_forecasts.system_cpu"
WHERE host = 'server01' AND field_name = 'idle'
  AND time > now() - interval '2 hours'
ORDER BY horizon_step ASC

-- Recent actuals for the same series (for manual comparison against forecasts)
SELECT time, idle
FROM system_cpu
WHERE host = 'server01'
ORDER BY time DESC LIMIT 12
```

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
