<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
> **Note:** This plugin requires {{% product-name %}}.8.2 or later (uses the synchronous write API).


The Resampler Plugin interpolates time series with non-uniform timestamps
(sensor timestamp jitter) onto a uniform time grid and writes the result to a
separate measurement. Uniform sampling is required by most signal-processing
and forecasting algorithms (FIR/IIR filters, FFT, ML models).

Numeric fields are interpolated; all other fields (strings, booleans) are
carried onto the same grid points by last known value, so the full data set
is preserved. A separate `snap` mode skips interpolation entirely: each
point's timestamp is rounded to the nearest grid node and all values and
types stay unchanged (on node collisions the latest point wins).

Each run processes a sliding window of history. Output timestamps are exact
multiples of the grid interval, so overlapping runs overwrite the same points
idempotently and late-arriving data is picked up automatically. Every unique
tag combination is resampled as an independent series, with all tags preserved.

The plugin does not fill large data gaps: when two neighboring source points
are more than `max_gap` apart, grid points between them are not written, so
sensor outages stay visible in the output.

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. This plugin supports TOML configuration files, which can be specified using the `config_file_path` parameter.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Required parameters

| Parameter            | Type   | Default  | Description                                                                 |
|----------------------|--------|----------|-----------------------------------------------------------------------------|
| `measurement`        | string | required | Source measurement with non-uniform timestamps                              |
| `target_measurement` | string | required | Output measurement; must differ from the source measurement                 |

### Grid parameters

| Parameter  | Type   | Default | Description                                                                                                                                                                                                             |
|------------|--------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `interval` | string | `1s`    | Uniform grid step, at least `1ms`. Units: `us`, `ms`, `s`, `min`, `h`, `d`, `w`. (`window` + `max_gap`)/`interval` is capped at 1,000,000 grid points per run, so sub-second grids need a proportionally small `window` |
| `window`   | string | `10min` | How much history each run processes; at least one `interval`                                                                                                                                                            |
| `offset`   | string | `0s`    | Processing delay for late-arriving data                                                                                                                                                                                 |

### Processing parameters

| Parameter              | Type   | Default        | Description                                                                                                                                                                                                                                                                                      |
|------------------------|--------|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `mode`                 | string | `interpolate`  | `interpolate` recalculates numeric fields at grid nodes; `snap` only rounds timestamps to the nearest node, values and types unchanged (`interpolation_method` and `max_gap` are ignored)                                                                                                        |
| `fields`               | string | all numeric    | Space-separated numeric fields to interpolate; numeric fields not listed are dropped. In snap mode: fields of any type to carry (default all)                                                                                                                                                    |
| `excluded_fields`      | string | none           | Space-separated fields of any type to exclude from the output; listing a field in both `fields` and `excluded_fields` is an error                                                                                                                                                                |
| `interpolation_method` | string | `linear`       | `linear`, `nearest`, `cubic`, `previous`, or `next`. Use `previous` (last known value) for step-like signals such as states or counters. `nearest`/`previous`/`next` return source values unchanged (integer fields keep their type and precision); `linear`/`cubic` always produce float values |
| `max_gap`              | string | 2 × `interval` | Source-point spacing above which grid points in between are not written; at least one `interval`                                                                                                                                                                                                 |

### Output parameters

| Parameter         | Type    | Default    | Description                              |
|-------------------|---------|------------|------------------------------------------|
| `target_database` | string  | trigger DB | Optional target database for the output  |
| `max_retries`     | integer | `5`        | Maximum number of write attempts         |

### TOML configuration

| Parameter          | Type   | Default | Description                                                                                   |
|--------------------|--------|---------|-----------------------------------------------------------------------------------------------|
| `config_file_path` | string | none    | TOML config file path relative to `PLUGIN_DIR` (replaces trigger arguments entirely when set) |

*To use a TOML configuration file, set the `PLUGIN_DIR` environment variable and specify the `config_file_path` in the trigger arguments.* This is in addition to the `--plugin-dir` flag when starting {{% product-name %}}.

#### Example TOML configuration

[resampler_config_scheduler.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/resampler/resampler_config_scheduler.toml)

For more information on using TOML configuration files, see the Using TOML Configuration Files section in the [influxdb3_plugins/README.md](https://github.com/influxdata/influxdb3_plugins/blob/master/README.md).

## Data requirements

Interpolation needs at least 2 source points per series inside the window; a
grid node is written only when it has a source point on each side at most
`max_gap` apart (or an exact source match). Snap mode has no such requirement.

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled
- **Python packages** (declared in `manifest.toml`):
  - `influxdata-plugin-utils>=0.3.0`
  - `scipy` (installs `numpy`)

## Installation steps

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
   influxdb3 install package "influxdata-plugin-utils>=0.3.0"
   influxdb3 install package scipy
   ```
## Trigger setup

### Scheduled resampling

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/resampler/resampler.py \
  --trigger-spec "every:10s" \
  --trigger-arguments 'measurement=signal,target_measurement=signal_resampled,interval=1s,window=1min' \
  resampler_trigger
```
### Scheduled resampling with TOML configuration

```bash
# Copy and edit the configuration file
cp resampler_config_scheduler.toml $PLUGIN_DIR/resampler_config.toml

influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/resampler/resampler.py \
  --trigger-spec "every:10s" \
  --trigger-arguments config_file_path=resampler_config.toml \
  resampler_trigger
```
## Example usage

### Example 1: Linear interpolation onto a 1-second grid

```bash
# Create the trigger
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/resampler/resampler.py \
  --trigger-spec "every:10s" \
  --trigger-arguments 'measurement=signal,target_measurement=signal_resampled,interval=1s,window=10min' \
  resampler_trigger

# Query resampled data (after trigger runs)
influxdb3 query --database mydb "SELECT * FROM signal_resampled"
```
Source data with timestamp jitter:

```
signal value=39.1 1750000000083000000   # 00.083
signal value=40.2 1750000000947000000   # 00.947
signal value=41.0 1750000002114000000   # 02.114
```
### Expected output

```
signal_resampled value=40.24 1750000001000000000  # 01.000
signal_resampled value=40.92 1750000002000000000  # 02.000
```
Grid points inside gaps larger than `max_gap` are not written and can be
filled by a downstream fill plugin. Non-numeric fields follow the same gap
rules but are carried by last known value instead of being interpolated.

### Example 2: Snap mode

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/resampler/resampler.py \
  --trigger-spec "every:10s" \
  --trigger-arguments 'measurement=signal,target_measurement=signal_resampled,interval=1s,mode=snap' \
  resampler_snap
```
### Expected output

Timestamps are aligned to the grid; values and types are unchanged:

```
signal_resampled value=39.1 1750000000000000000  # 00.083 -> 00.000
signal_resampled value=40.2 1750000001000000000  # 00.947 -> 01.000
signal_resampled value=41.0 1750000002000000000  # 02.114 -> 02.000
```
## Code overview

### Files

- `resampler.py`: The main plugin code containing the handler for scheduled resampling
- `resampler_config_scheduler.toml`: Example TOML configuration file

### Logging

Logs are stored in the `_internal` database in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database _internal \
  "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'resampler_trigger' ORDER BY event_time DESC LIMIT 20"
```
### Main functions

#### `process_scheduled_call(influxdb3_local, call_time, args)`

Entry point for the scheduled trigger. Parses and validates the configuration,
queries the source window, groups rows by tag set, resamples or snaps each
series, and writes the result with retries.

#### `resample_series(...)`

Resamples all fields of one series: numeric fields selected for interpolation
are recalculated at grid nodes (`resample_field`), all other carried fields
use last known value (`carry_field_previous`), with the same `max_gap` rules.

#### `snap_series(...)`

Rounds each source point's timestamp to the nearest grid node, keeping values
and types unchanged; on node collisions the latest point wins per field.

## Troubleshooting

### Common issues

#### Issue: No output data

**Solution**: Check that the window contains at least 2 source points per
series and that `interval` is not larger than `window`.

#### Issue: Missing points near "now"

**Solution**: The freshest grid points need a source neighbor on the right;
they are written by the next run once that neighbor arrives. Increase `offset`
to delay processing instead.

#### Issue: Holes in the output

**Solution**: Source gaps larger than `max_gap` are preserved by design.
Increase `max_gap` to interpolate across larger gaps.

#### Issue: `cubic` falls back to linear

**Solution**: Cubic interpolation needs at least 4 points per series in the
window; add more data or use `linear`.

#### Issue: A numeric field is missing from the output

**Solution**: `fields` is set and does not list it — numeric fields not
listed there are dropped by design.

#### Issue: Duplicate-looking values in snap mode

**Solution**: Two source points rounded to the same grid node — the later one
wins per field. Use a smaller `interval` to keep them apart.

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
