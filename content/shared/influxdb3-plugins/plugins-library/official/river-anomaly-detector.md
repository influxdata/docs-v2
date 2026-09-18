<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
An adaptive {{% product-name %}} Processing Engine plugin that detects anomalies in incoming time-series data using the [River ML](https://riverml.xyz) library. The detector automatically adapts its detection strategy based on data characteristics learned by the companion auto-profiler plugin.

## Features

- **Adaptive detection:** Automatically selects detectors (Z-Score, Seasonal, ADWIN) based on profiler's pattern classification
- **Zero-config:** Works out of the box with sensible defaults — just create a trigger and go
- **Auto-tune by default:** Reads profiler recommendations when available, falls back to conservative defaults otherwise
- **Always-learn detectors:** Rolling, seasonal, and ADWIN detectors all learn from every observation; only the ones active in the current mode contribute votes to the anomaly decision
- **Seasonal awareness:** Learns hour-of-day (24 buckets) or hour-of-week (168 buckets) patterns — activated only when the profiler detects seasonality
- **Drift detection:** Uses ADWIN algorithm for trending data — activated only when profiler detects trends
- **Hysteresis on mode changes:** Detector mode only switches after 3 consecutive same-mode recommendations to prevent flip-flopping
- **Configurable combination:** Combine detector votes with "any" (OR), "majority", or "all" (AND) logic
- **Per-series models:** Each unique combination of table + tags + field gets its own detector set
- **Online learning:** Models update incrementally with each observation — no batch retraining needed
- **LRU eviction:** Configurable limit on tracked series to control memory usage
- **Model persistence:** Models are pickled, compressed, chunked, and checkpointed to the database so they survive server restarts

## Prerequisites

- {{% product-name %}} with Processing Engine enabled
- River ML library (`river>=0.23.0`)

## Quick Start

### 1. Install River

```bash
influxdb3 install package river
```
### 2. Create a trigger (zero-config)

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename river_anomaly_detector.py \
  --trigger-spec "all_tables" \
  anomaly_detector
```
That's it! The plugin will start monitoring all numeric fields in all tables. With `auto_tune=true` (default), it reads profiler recommendations when available.

### 3. Query anomalies

```sql
SELECT * FROM "_anomalies.cpu" ORDER BY time DESC LIMIT 10
```
## Customized Example

Monitor specific fields with explicit detector overrides:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename river_anomaly_detector.py \
  --trigger-spec "table:cpu" \
  --trigger-arguments 'include_fields=temperature humidity' 'rolling_std_threshold=3.0' 'enable_seasonal=true' \
  anomaly_detector_cpu
```
## Trigger Arguments

Arguments can be passed inline (space-separated lists) or via TOML config file (native TOML lists). Parameter names are the same in both modes.

| Argument                      | Required   | Default  | Description                                                                                                                                                     |
|-------------------------------|------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `include_fields`              | No         | `""`     | Fields to monitor (space-separated). If set, only these numeric fields are processed                                                                            |
| `exclude_fields`              | No         | `""`     | Fields to exclude from detection (space-separated)                                                                                                              |
| `exclude_tables`              | No         | `""`     | Tables to skip when using `all_tables` trigger (space-separated)                                                                                                |
| `string_fields`               | No         | `""`     | String columns that are fields, not tags (space-separated). All other strings become tags                                                                       |
| `rolling_std_threshold`       | No         | `5.0`    | Standard deviations from the mean to flag as anomaly                                                                                                            |
| `ew_fading_factor`            | No         | `0.3`    | Fading factor for exponentially weighted stats (lower = longer memory)                                                                                          |
| `combination_mode`            | No         | `any`    | How to combine detector votes: `any` (OR), `majority`, or `all` (AND)                                                                                           |
| `enable_seasonal`             | No         | `""`     | Force seasonal detection: `true`/`false` to override, empty = auto from profiler                                                                                |
| `enable_adwin`                | No         | `""`     | Force ADWIN drift detection: `true`/`false` to override, empty = auto from profiler                                                                             |
| `detector_mode`               | No         | `""`     | Explicitly set detector mode components (space-separated or TOML list). Overrides profiler's mode recommendation. See [Adaptive Detection](#adaptive-detection) |
| `adwin_delta`                 | No         | `0.002`  | ADWIN sensitivity parameter. Lower values = more sensitive to drift                                                                                             |
| `seasonal_fading_factor`      | No         | `0.1`    | Fading factor for seasonal bucket stats (lower = longer memory)                                                                                                 |
| `seasonal_period`             | No         | `""`     | Seasonal bucket period: `hourly` (24 buckets, hour-of-day) or `weekly` (168 buckets, hour-of-week). Empty = auto from profiler, falls back to `hourly`          |
| `seasonal_threshold`          | No         | `3.0`    | Std devs from seasonal bucket mean to flag as anomaly                                                                                                           |
| `min_seasonal_observations`   | No         | `5`      | Min observations per bucket before contributing to anomaly detection                                                                                            |
| `min_rolling_observations`    | No         | `10`     | Min total observations per series before the rolling Z-score starts scoring (cold-start guard)                                                                  |
| `max_series`                  | No         | `1000`   | Max unique series to track (LRU eviction)                                                                                                                       |
| `auto_tune`                   | No         | `true`   | Read per-series parameters from `_meta.series_profiles` (requires auto-profiler plugin)                                                                         |
| `tune_refresh_interval`       | No         | `100`    | Observations per series between auto-tune refreshes from `_meta.series_profiles`                                                                                |
| `log_anomalies`               | No         | `true`   | Log detected anomalies to server log                                                                                                                            |
| `checkpoint_interval_seconds` | No         | `1800`   | Seconds between model checkpoints to the database                                                                                                               |
| `max_checkpoint_age_hours`    | No         | `24`     | Ignore checkpoints older than this when restoring                                                                                                               |
| `min_checkpoint_observations` | No         | `10`     | Skip checkpointing models with fewer observations than this (avoids persisting cold-start state)                                                                |
| `config_file_path`            | No         | —        | Path to TOML config file. Supports absolute paths or relative paths (resolved via PLUGIN_DIR)                                                                   |

## Column Classification

The plugin classifies each column in incoming data:

1. `time` — skipped
2. String columns listed in `string_fields` — skipped from anomaly detection and not used as tags in the series key
3. Other string columns — treated as **tags** (used in series key)
4. Numeric columns (`int`, `float`, not `bool`) — treated as **fields** for anomaly detection
   - Filtered by `include_fields` (if set, only listed fields are monitored)
   - Filtered by `exclude_fields` (excluded fields are skipped)

NaN and infinity values are skipped with a warning. Column types are inferred from the first row of each batch.

## Table Filtering

All tables starting with `_` are automatically skipped (for example, `_anomalies.*`, `_meta.*`, `_system.*`, `_forecasts.*`). Additional tables can be excluded via `exclude_tables`.

## Adaptive Detection

`detector_mode` is a space-separated list of components. Exactly one **base** component selects the Z-score behavior; optional **add-ons** enable seasonal and ADWIN voting:

**Base components** (pick one, reflects profiler's pattern classification):

| Base Mode             | Used For                         |
|-----------------------|----------------------------------|
| `zscore_conservative` | No profile yet (default)         |
| `zscore_low`          | Stable data (lower threshold)    |
| `zscore_high`         | Noisy data (higher threshold)    |
| `zscore_adaptive`     | Bursty data (adaptive threshold) |

**Add-on components** (zero or more):

| Component  | Effect                                                          |
|------------|-----------------------------------------------------------------|
| `seasonal` | Enables seasonal-bucket voting on top of the base Z-score       |
| `adwin`    | Enables ADWIN drift-detection voting on top of the base Z-score |

Examples: `zscore_conservative`, `zscore_low seasonal`, `zscore_high adwin`, `zscore_conservative seasonal adwin`.

> **Note:** All detectors always *learn* from every observation regardless of mode. The mode only controls which detectors *vote* on the anomaly decision.

### How Adaptation Works

Mode selection:
1. **Explicit `detector_mode`** — if set, overrides the base mode from the profiler
2. **Auto-tune** (`auto_tune=true`) — reads `recommended_detector_mode` from `_meta.series_profiles`
3. **Model default** — `zscore_conservative`

After the base mode is determined, `enable_seasonal` and `enable_adwin` overrides are applied on top (can add or remove the `seasonal` / `adwin` components from any base mode).

Even when `detector_mode` is explicitly set, the profiler is still consulted (with `auto_tune=true`) for per-series `threshold`, `ew_fading_factor`, `seasonal_fading_factor`, and `seasonal_period` — only the mode itself is overridden.

**Hysteresis:** `detector_mode` only switches after **3 consecutive fresh profiler recommendations** of the same new mode (one recommendation = one `tune_refresh_interval` query). Non-mode fields (`threshold`, `fading_factor`, `seasonal_fading`, `seasonal_period`) update on every refresh without hysteresis. This prevents flip-flopping on noisy pattern classifications while still letting thresholds and fading factors track the data.

**Seasonality readiness gate:** If the profiler recommends `seasonal` but hasn't marked `seasonality_ready=true` yet, the `seasonal` component is stripped before the model is configured (so the model doesn't score against an immature seasonal grid).

### Detector Details

**Rolling Z-Score (always active for scoring):** Exponentially weighted mean and variance track the "normal" range. When a value exceeds `mean ± N*std` (configurable threshold), it's flagged. Starts scoring after `min_rolling_observations` observations (default 10) to reduce false positives during cold start. When the fading factor changes via auto-tune, the EW stats are re-seeded from the prior mean/std to avoid a cold restart.

**Seasonal:** Time-based buckets, each maintaining its own EW mean and variance. Values are compared against their bucket's learned pattern. The bucketing scheme is controlled by `seasonal_period`:
- `hourly` — 24 buckets (H00–H23), one per hour-of-day
- `weekly` — 168 buckets (Mon-H00 … Sun-H23), one per hour-of-week

Each bucket matures independently after `min_seasonal_observations` (default 5) data points. Buckets always learn; they only *vote* when `seasonal` is part of the detector mode. Changing `seasonal_period` at runtime resets the seasonal grid.

**ADWIN:** River ML's Adaptive Windowing algorithm on raw values. Detects when the statistical properties of the data stream change (concept drift). Sensitivity is controlled by `adwin_delta` (default 0.002; lower = more sensitive). ADWIN always learns but only votes when `adwin` is part of the detector mode.

### Combination Modes

The `combination_mode` parameter controls how active detector votes are combined:

- `any` (default): Anomaly if **any** active detector flags it (OR logic)
- `majority`: Anomaly if **at least half** of active detectors flag it (⌈n/2⌉ votes). With 2 active detectors, 1 flag is enough; with 3, at least 2 are required
- `all`: Anomaly if **all** active detectors flag it (AND logic)

Only detectors that are active in the current mode participate in voting.

## Output Schema

Anomalies are written to `_anomalies.{source_table}`.

**Tags:** All original tags preserved + `field_name`

**Fields:**

| Field                   | Type    | Description                                                                  |
|-------------------------|---------|------------------------------------------------------------------------------|
| `original_value`        | float   | The value that triggered detection                                           |
| `is_anomaly`            | boolean | True if detector combination flagged                                         |
| `observations`          | integer | Total observations for this series                                           |
| `detector_mode`         | string  | Active detector mode (for example, `zscore_conservative seasonal`)                  |
| `rolling_anomaly`       | boolean | Rolling stats detector flagged                                               |
| `rolling_mean`          | float   | Current exponentially weighted mean                                          |
| `rolling_std`           | float   | Current exponentially weighted std deviation                                 |
| `rolling_deviation`     | float   | How many std devs from mean                                                  |
| `rolling_threshold`     | float   | Configured std dev threshold                                                 |
| `seasonal_anomaly`      | boolean | Seasonal detector flagged                                                    |
| `seasonal_mature`       | boolean | Whether bucket has enough observations                                       |
| `seasonal_mean`         | float   | Exponentially weighted mean for this bucket                                  |
| `seasonal_std`          | float   | Exponentially weighted std dev for this bucket                               |
| `seasonal_deviation`    | float   | How many std devs from seasonal bucket mean                                  |
| `seasonal_bucket`       | string  | Bucket identifier, for example, `H14` (2pm UTC) for hourly, or `Mon-H14` for weekly |
| `seasonal_observations` | integer | Observation count in this bucket                                             |
| `adwin_anomaly`         | boolean | ADWIN drift detector flagged                                                 |
| `drift_detected`        | boolean | Whether ADWIN detected a concept drift                                       |

Only rows where `is_anomaly=true` are written. Seasonal bucket fields (`seasonal_mean`, `seasonal_std`, `seasonal_deviation`, `seasonal_bucket`, `seasonal_observations`) appear once the seasonal grid has accumulated enough data for the current bucket, regardless of whether the `seasonal` component is active — because seasonal stats always learn. `seasonal_anomaly` and `adwin_anomaly` only flip to `true` when their respective components are part of the active detector mode.

## Model Persistence

The plugin automatically checkpoints and restores models so they survive server restarts.

### Checkpoint

Every `checkpoint_interval_seconds` (default: 1800 = 30 minutes), the plugin pickles each per-series model, compresses with zlib, base64-encodes, and writes to `_system.model_checkpoints`. Large models are automatically chunked across multiple rows (60KB chunks).

Models with fewer than `min_checkpoint_observations` observations (default: 10) are skipped — there is no point persisting cold-start state that would be rebuilt from scratch on restore anyway.

### Restore

On the first invocation after a server restart (detected by an empty model cache), the plugin queries `_system.model_checkpoints` for the latest checkpoint per series. Checkpoints older than `max_checkpoint_age_hours` (default: 24) are ignored. Restored models resume scoring immediately with their full learned history.

### Checkpoint Schema (`_system.model_checkpoints`)

| Column                  | Type    | Description                                         |
|-------------------------|---------|-----------------------------------------------------|
| `plugin`                | tag     | `"river_anomaly_detector"`                          |
| `series_key`            | tag     | Unique series identifier                            |
| `chunk_index`           | tag     | 0-based chunk index (for multi-row models)          |
| `chunk_total`           | tag     | Total chunks for this model                         |
| `model_data`            | string  | Base64-encoded, zlib-compressed pickle of the model |
| `model_type`            | string  | `"SeriesModel"`                                     |
| `observation_count`     | integer | Observations the model has processed                |
| `checkpoint_size_bytes` | integer | Size of the compressed data                         |

## TOML Configuration

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename river_anomaly_detector.py \
  --trigger-spec "all_tables" \
  --trigger-arguments config_file_path=river_anomaly_detector_config.toml \
  anomaly_detector
```
Or with an absolute path (no PLUGIN_DIR needed):

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename river_anomaly_detector.py \
  --trigger-spec "all_tables" \
  --trigger-arguments config_file_path=/etc/influxdb3/river_anomaly_detector_config.toml \
  anomaly_detector
```
See `river_anomaly_detector_config.toml` for an example configuration.


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
