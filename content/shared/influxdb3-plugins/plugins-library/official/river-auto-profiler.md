<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
A zero-config {{% product-name %}} Processing Engine plugin that incrementally profiles incoming time-series data, classifies data patterns, and writes recommended anomaly detection parameters per series. This is the "zero-config" enabler — it learns about your data so the anomaly detector can auto-tune.

## Features

- **Incremental profiling:** Uses River ML's streaming statistics to build profiles one observation at a time
- **Pattern classification:** Automatically classifies data as stable, noisy, trending, seasonal, or bursty
- **Adaptive recommendations:** Recommends detector mode, threshold, and fading factors based on data characteristics
- **Calibrated EW stats:** Collects initial observations to determine optimal fading factor before creating EW statistics, then replays calibration data
- **Exceedance-calibrated thresholds:** Automatically adjusts anomaly thresholds based on observed data distribution (targets ~1% anomaly rate)
- **Per-series profiles:** Each unique combination of table + tags + field gets its own profile
- **Low overhead:** Only writes profiles every N observations (default 50) or every 5 minutes for slow data
- **LRU eviction:** Configurable limit on tracked series to control memory usage

## How It Works

On every write, the profiler iterates over each numeric field in each row and updates streaming statistics for a unique series, keyed by `table + tag values + field name`. Tracked stats include EW mean/variance, skewness, kurtosis, write interval, and seasonal variance buckets (hourly or weekly).

Each series starts in a short **calibration phase** (30 observations). During calibration values are buffered; once it ends, the profiler uses the observed write interval to pick an appropriate fading factor and replays the buffered values through the EW stats so the profile starts off already informed by early history.

After calibration, every `profile_write_interval` observations (or every 5 minutes for slow streams) the plugin writes a profile snapshot to `_meta.series_profiles` — pattern label, recommended detector mode, threshold, and fading factors. Profiles with fewer than `min_observations` are flagged `profile_mature=false`, so downstream consumers can fall back to safe defaults until the profile has seen enough data.

## Prerequisites

- {{% product-name %}} with Processing Engine enabled
- River ML library (`river>=0.23.0`)

## Quick Start

### 1. Install River (if not already installed)

```bash
influxdb3 install package river
```
### 2. Create the profiler trigger

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename river_auto_profiler.py \
  --trigger-spec "all_tables" \
  auto_profiler
```
### 3. Query profiles

```sql
SELECT * FROM "_meta.series_profiles" ORDER BY time DESC LIMIT 10
```
## Trigger Arguments

Arguments can be passed inline (space-separated lists) or via TOML config file (native TOML lists). Parameter names are the same in both modes.

| Argument                      | Required  | Default    | Description                                                                                        |
|-------------------------------|-----------|------------|----------------------------------------------------------------------------------------------------|
| `include_fields`              | No        | `""`       | Fields to profile (space-separated). If set, only these numeric fields are processed               |
| `exclude_fields`              | No        | `""`       | Fields to exclude from profiling (space-separated)                                                 |
| `exclude_tables`              | No        | `""`       | Tables to skip when using `all_tables` trigger (space-separated)                                   |
| `string_fields`               | No        | `""`       | String columns that are fields, not tags (space-separated). All other strings become tags          |
| `max_series`                  | No        | `1000`     | Max unique series to track (LRU eviction)                                                          |
| `initial_fading_factor`       | No        | `0.3`      | Initial fading factor for EW stats. Auto-adapted based on write frequency after calibration        |
| `seasonal_period`             | No        | `"hourly"` | Seasonal period for variance buckets: `"hourly"` (24 buckets) or `"weekly"` (168 buckets)          |
| `profile_write_interval`      | No        | `50`       | Write profile every N observations per series                                                      |
| `min_observations`            | No        | `50`       | Observations needed before profile is considered mature                                            |
| `log_profiles`                | No        | `false`    | Log profile updates to server log                                                                  |
| `checkpoint_interval_seconds` | No        | `1800`     | Seconds between model checkpoints to the database                                                  |
| `max_checkpoint_age_hours`    | No        | `24`       | Ignore checkpoints older than this when restoring                                                  |
| `min_checkpoint_observations` | No        | `10`       | Skip checkpointing profiles with fewer observations than this (avoids persisting cold-start state) |
| `config_file_path`            | No        | —          | Path to TOML config file. Supports absolute paths or relative paths (resolved via PLUGIN_DIR)      |

### Inline example

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename river_auto_profiler.py \
  --trigger-spec "all_tables" \
  --trigger-arguments 'include_fields=temperature humidity' 'exclude_tables=debug_info system_logs' \
  auto_profiler
```
### TOML config example

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename river_auto_profiler.py \
  --trigger-spec "all_tables" \
  --trigger-arguments config_file_path=river_auto_profiler_config.toml \
  auto_profiler
```
Or with an absolute path (no PLUGIN_DIR needed):

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename river_auto_profiler.py \
  --trigger-spec "all_tables" \
  --trigger-arguments config_file_path=/etc/influxdb3/river_auto_profiler_config.toml \
  auto_profiler
```
See `river_auto_profiler_config.toml` for an example configuration.

## Column Classification

The plugin classifies each column in incoming data:

1. `time` — skipped
2. String columns listed in `string_fields` — skipped (not a tag, not numeric)
3. Other string columns — treated as **tags** (used in series key)
4. Numeric columns (`int`, `float`, not `bool`) — treated as **fields** to profile
   - Filtered by `include_fields` (if set, only listed fields are profiled)
   - Filtered by `exclude_fields` (excluded fields are skipped)

## Table Filtering

All tables starting with `_` are automatically skipped (for example, `_meta.*`, `_anomalies.*`, `_system.*`, `_forecasts.*`). Additional tables can be excluded via `exclude_tables`.

## Output Schema

Profiles are written to `_meta.series_profiles`.

**Tags:** `source_table`, `field_name`, plus all original tags from the source data.

**Fields:**

| Field                          | Type     | Description                                                        |
|--------------------------------|----------|--------------------------------------------------------------------|
| `observations`                 | integer  | Total observation count                                            |
| `write_interval_seconds`       | float    | Average seconds between writes                                     |
| `value_mean`                   | float    | Exponentially weighted mean                                        |
| `value_std`                    | float    | Exponentially weighted standard deviation                          |
| `value_min`                    | float    | Minimum observed value                                             |
| `value_max`                    | float    | Maximum observed value                                             |
| `coefficient_of_variation`     | float    | std / mean (key metric for tuning)                                 |
| `pattern_label`                | string   | Data pattern: stable, noisy, trending, seasonal, bursty            |
| `recommended_detector_mode`    | string   | Recommended detector mode for anomaly detector                     |
| `seasonality_strength`         | float    | Seasonality strength (0.0-1.0)                                     |
| `trend_strength`               | float    | Trend strength (0.0-1.0)                                           |
| `data_skewness`                | float    | Data asymmetry (skewness)                                          |
| `data_kurtosis`                | float    | Heavy-tailedness (kurtosis)                                        |
| `recommended_threshold`        | float    | Exceedance-calibrated `rolling_std_threshold` for anomaly detector |
| `recommended_fading_factor`    | float    | Recommended `ew_fading_factor` for anomaly detector                |
| `recommended_seasonal_fading`  | float    | Recommended seasonal fading factor                                 |
| `profile_mature`               | boolean  | True if observations ≥ min_observations                            |
| `seasonality_ready`            | boolean  | True if enough seasonal buckets are filled for reliable detection  |
| `seasonal_buckets_filled`      | integer  | Number of seasonal buckets with 2+ observations                    |

## Integration with Anomaly Detector

The recommended parameters written to `_meta.series_profiles` are consumed by the companion `river_anomaly_detector` plugin when it runs with `auto_tune=true` (default). Deploying both triggers on the same database lets the detector auto-tune per series:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename river_auto_profiler.py \
  --trigger-spec "all_tables" \
  auto_profiler

influxdb3 create trigger \
  --database mydb \
  --plugin-filename river_anomaly_detector.py \
  --trigger-spec "all_tables" \
  anomaly_detector
```
Until a profile matures (`profile_mature=true`, i.e. at least `min_observations` observations), the anomaly detector falls back to conservative defaults.

## Pattern Classification

The profiler classifies each series into one of five patterns based on streaming statistics:

| Condition                  | Pattern   | Recommended Detector Mode    |
|----------------------------|-----------|------------------------------|
| Seasonality strength > 0.4 | seasonal  | zscore_conservative seasonal |
| Trend strength > 0.7       | trending  | zscore_conservative adwin    |
| CV < 0.05                  | stable    | zscore_low                   |
| Kurtosis > 5 or CV > 1.0   | bursty    | zscore_adaptive              |
| CV > 0.2                   | noisy     | zscore_high                  |
| Otherwise                  | stable    | zscore_low                   |

### Seasonality Detection

Uses hourly (24 buckets) or weekly (168 buckets) variance buckets. If the coefficient of variation across bucket variances is high, the data is seasonal. Requires at least 25% of buckets with 2+ observations each. The `seasonality_ready` field in the output indicates whether enough data has been collected for reliable seasonality detection.

### Trend Detection

Uses EW mean drift — compares a fast EW mean (fading factor 0.3) against a slow EW mean (fading factor 0.05). Large divergence relative to the standard deviation indicates trending data. Requires at least 20 observations.

## Tuning Rules

### Threshold Recommendation (exceedance-calibrated)

The threshold is calibrated automatically using exceedance rate tracking. The profiler monitors what fraction of observations fall outside `mean ± threshold × std` and adjusts the threshold to target a ~1% anomaly rate. The threshold is bounded to [2.5, 10.0] and calibrated every 200 observations. Initial value is set from pattern classification:

| Data Pattern       | Initial Threshold   |
|--------------------|---------------------|
| stable             | 3.5                 |
| noisy (CV 0.2-0.5) | 6.0                 |
| noisy (CV > 0.5)   | 8.0                 |
| trending           | 5.0                 |
| seasonal           | 5.0                 |
| bursty             | 7.0                 |

### Fading Factor Recommendation (based on write frequency)

| Write Interval | Recommended Factor  |
|----------------|---------------------|
| < 10 seconds   | 0.1                 |
| 10s - 60s      | 0.2                 |
| 1min - 5min    | 0.3                 |
| > 5 minutes    | 0.5                 |

### Seasonal Fading Factor Recommendation

| Write Interval | Recommended Factor  |
|----------------|---------------------|
| < 60 seconds   | 0.05                |
| 1min - 5min    | 0.1                 |
| > 5 minutes    | 0.2                 |

## Model Persistence

The plugin automatically checkpoints and restores models so they survive server restarts.

### Checkpoint

Every `checkpoint_interval_seconds` (default: 1800 = 30 minutes), the plugin pickles each per-series profile, compresses with zlib, base64-encodes, and writes to `_system.model_checkpoints`. Large models are automatically chunked across multiple rows (60KB chunks) to stay within InfluxDB's string field limit.

Profiles with fewer than `min_checkpoint_observations` observations (default: 10) are skipped — there is no point persisting cold-start state that would be rebuilt from scratch on restore anyway.

### Restore

On the first invocation after a server restart (detected by an empty profile cache), the plugin queries `_system.model_checkpoints` for the latest checkpoint per series. Checkpoints older than `max_checkpoint_age_hours` (default: 24) are ignored. Restored profiles resume profiling immediately with their full statistical history.

### Checkpoint Schema (`_system.model_checkpoints`)

| Column                  | Type    | Description                                   |
|-------------------------|---------|-----------------------------------------------|
| `plugin`                | tag     | `"river_auto_profiler"`                       |
| `series_key`            | tag     | Unique series identifier                      |
| `chunk_index`           | tag     | 0-based chunk index (for multi-row models)    |
| `chunk_total`           | tag     | Total chunks for this model                   |
| `model_data`            | string  | Base64-encoded, zlib-compressed pickle        |
| `model_type`            | string  | `"SeriesProfile"`                             |
| `observation_count`     | integer | Observations the profile has processed        |
| `checkpoint_size_bytes` | integer | Size of the compressed data                   |


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
