<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
The Signal Generator Plugin lets new users produce realistic time-series data for testing {{% product-name %}} functionality and downstream plugins without needing an external data source. Generate configurable waveform signals on a schedule to test alerts, anomaly detection, threshold checks, and dashboards from the moment you start.

- **Zero dependencies**: Uses Python standard library only — no packages to install
- **Composable waveforms**: Mix sine, square, triangle, sawtooth, noise, and spike signals by stacking them
- **Realistic signals**: Default preset produces a signal centered at 30 with a slow sine trend, Gaussian noise, and occasional large spikes — immediately useful for alert testing
- **Timestamp jitter**: Offsets point timestamps by default to simulate sensors that do not sample at perfectly uniform intervals
- **Simulated gaps**: Simulates temporary data-source outages by default — bounded windows with no written points, useful for testing deadman alerts and gap handling. Set `gap_enabled=false` for continuous output
- **Catch-up generation**: Generates data for the full span between executions regardless of trigger schedule — the only missing spans are the simulated gaps
- **Flexible output**: Configure measurement name, field name, and custom tags per trigger

## Important CLI limitation

Trigger configurations that pass JSON values, including `waveforms` and `tags`, currently cannot be created with the `influxdb3 create trigger --trigger-arguments` CLI flag.
The CLI splits `--trigger-arguments` on every comma, including commas inside JSON arrays and objects, so values such as `waveforms=[{"type":"spike","value":7}]` are split into invalid fragments before they reach the plugin.
Use the InfluxDB 3 Explorer UI or the `/api/v3/configure/processing_engine_trigger` API to create configured Signal Generator triggers.

The default no-argument trigger can still be created with the CLI because it does not pass JSON or comma-containing values.
Configured examples below use the API until the CLI parsing fix is available.

## Configuration

Plugin parameters should be specified in the `trigger_arguments` field when creating a trigger with the API or InfluxDB 3 Explorer.
Avoid the CLI for configured Signal Generator triggers until comma-aware parsing is available for JSON arrays and objects.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Optional parameters

This plugin has no required parameters.

| Parameter          | Type         | Default          | Description                                                                                  |
|--------------------|--------------|------------------|----------------------------------------------------------------------------------------------|
| `waveforms`        | JSON string  | *(default preset)* | JSON array of waveform config objects. If omitted, uses the built-in default preset.        |
| `measurement`      | string       | `signal`         | Output measurement name.                                                                     |
| `field`            | string       | `value`          | Output field name.                                                                           |
| `tags`             | JSON string  | *(none)*         | Optional JSON object of tags to add to each data point. Example: `{"host": "server01"}`.    |
| `points_per_second`| float        | `1.0`            | Data point resolution in points per second. Controls how many points are generated per second of elapsed time. |
| `jitter_amplitude_seconds` | float | 10% of point interval | Maximum timestamp offset in seconds. Set to `0` to disable timestamp jitter. |
| `jitter_seed`      | integer      | *(none)*         | Optional seed for reproducible per-timestamp jitter, mainly useful for tests.              |
| `gap_enabled`      | boolean      | `true`           | Enables simulated data-source outage gaps. Set to `false` for continuous output.           |
| `gap_min_duration_seconds` | float | `10.0`          | Shortest simulated outage duration, in seconds.                                            |
| `gap_max_duration_seconds` | float | `30.0`          | Longest simulated outage duration, in seconds.                                             |
| `gap_min_interval_seconds` | float | `120.0`         | Shortest time between consecutive outage starts, in seconds. Must be at least `gap_max_duration_seconds`. |
| `gap_max_interval_seconds` | float | `240.0`         | Longest time between consecutive outage starts, in seconds.                                |
| `gap_seed`         | integer      | *(none)*         | Optional seed for reproducible gap timing.                                                 |
| `target_database`  | string       | *(none)*         | Optional target database. If omitted, writes to the trigger's own database.                 |

### Timestamp jitter

Timestamp jitter is enabled by default. If `jitter_amplitude_seconds` is omitted, the plugin uses 10% of the point interval:

```text
point_interval_seconds = 1 / points_per_second
default_jitter_amplitude_seconds = 0.10 * point_interval_seconds
```
Each generated timestamp receives an independent random offset from `[-jitter_amplitude_seconds, +jitter_amplitude_seconds]`. When `jitter_seed` is set, the offset is derived from the seed and the nominal timestamp, so each timestamp still gets its own offset even if scheduled executions generate one point at a time. Waveforms are still evaluated at the nominal cadence timestamps, then jitter is applied only to the timestamp that is written. With the same waveform seeds, jittered and non-jittered runs produce the same field values.

Set `jitter_amplitude_seconds=0` to preserve perfectly regular timestamps. The plugin rejects jitter settings that could produce duplicate or reordered timestamps.

### Simulated gaps

Simulated gaps are enabled by default. The plugin periodically simulates a data-source outage: points whose final (jittered) timestamps fall inside an outage window are not written, leaving realistic missing spans in the output.

With the default configuration, each outage lasts 10–30 seconds, consecutive outages start 2–4 minutes apart, and about 11% of generated points are removed. The min/max bounds are hard guarantees:

- Every outage duration lies in `[gap_min_duration_seconds, gap_max_duration_seconds]`.
- The time between consecutive outage starts lies in `[gap_min_interval_seconds, gap_max_interval_seconds]`.
- At least `gap_min_interval_seconds - gap_max_duration_seconds` seconds of continuous data separate consecutive outages (90 seconds at defaults).

Gap windows are anchored to absolute time, so the same outage pattern is produced whether each scheduled execution writes one point or thousands, and catch-up after downtime contains the same gaps an uninterrupted run would have. When `gap_seed` is set, gap timing is fully reproducible. When omitted, the plugin generates a seed during first-run initialization and caches it, so the schedule stays coherent across executions; a restart that clears the trigger cache starts a new schedule.

Missing spans are never backfilled: the generation boundary advances even when every point in a window was removed. Runs that removed points log a summary, for example:

```text
Wrote 585 points to signal.value (600 generated, 15 removed by 1 gap windows)
```
Set `gap_enabled=false` to disable simulated gaps entirely.

**Upgrade note:** existing triggers pick up default gaps on upgrade with no configuration change. Downstream demos that use deadman or no-data alerts will begin firing on the simulated outages — useful for exercising those alerts, but set `gap_enabled=false` if you need continuous data.

### Waveform types

Waveform configuration is supplied as a JSON array. Each object requires a `type` key; all other parameters are optional and fall back to defaults.

```json
[
  {"type": "sine", "frequency": 0.1, "amplitude": 5.0},
  {"type": "noise", "stddev": 0.3}
]
```
Multiple waveforms are summed together to produce the final signal value.

#### Deterministic waveforms

| Type       | Parameters                                       | Defaults                                              | Notes                                              |
|------------|--------------------------------------------------|-------------------------------------------------------|----------------------------------------------------|
| `constant` | `value`                                          | `0.0`                                                 | Fixed y-offset; shifts the entire combined signal. |
| `sine`     | `frequency`, `amplitude`, `offset`, `phase`      | `0.05 Hz`, `1.0`, `0.0`, `0.0`                       | 0.05 Hz = ~20 s period. Anchored to absolute time. |
| `square`   | `frequency`, `amplitude`, `offset`, `phase`, `duty_cycle` | `0.05 Hz`, `1.0`, `0.0`, `0.0`, `0.5`   | `duty_cycle` is 0–1, fraction of period spent high.|
| `triangle` | `frequency`, `amplitude`, `offset`, `phase`      | `0.05 Hz`, `1.0`, `0.0`, `0.0`                       | Linear ramp up then down.                          |
| `sawtooth` | `frequency`, `amplitude`, `offset`, `phase`      | `0.05 Hz`, `1.0`, `0.0`, `0.0`                       | Linear ramp up, instant drop.                      |

#### Stochastic waveforms

| Type    | Parameters                                         | Defaults                              | Notes                                                                             |
|---------|----------------------------------------------------|---------------------------------------|-----------------------------------------------------------------------------------|
| `noise` | `stddev`, `mean`, `seed`                           | `0.1`, `0.0`, `None`                  | Gaussian noise. `seed` enables reproducible sequences.                            |
| `spike` | `probability`, `min_amplitude`, `max_amplitude`, `seed` | `0.01`, `5.0`, `10.0`, `None`    | 1% chance of a spike per point. Magnitude drawn uniformly from `[min, max]` with random sign. |

### Default preset

When no `waveforms` argument is provided, the plugin uses this preset:

```json
[
  {"type": "constant", "value": 30.0},
  {"type": "sine", "frequency": 0.005, "amplitude": 10.0},
  {"type": "noise", "stddev": 0.5},
  {"type": "spike", "probability": 0.005, "min_amplitude": 8.0, "max_amplitude": 15.0}
]
```
This produces a signal centered around 30 with a slow-moving sine wave (period ~200 s / ~3.3 minutes), light Gaussian noise (stddev 0.5), and occasional large spikes (0.5% chance per point, magnitude 8–15). Designed to be immediately useful for testing alerts and anomaly detection without any configuration.

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled
- **Python packages**: No additional packages required (uses Python standard library only)

### Installation steps

1. Start {{% product-name %}} with the Processing Engine enabled (`--plugin-dir /path/to/plugins`):

   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```
2. No additional Python packages are required for this plugin.

## Trigger setup

### Scheduled trigger with API configuration

Use the API or InfluxDB 3 Explorer for configured triggers, especially when passing JSON values in `waveforms` or `tags`.

```bash
curl -X POST "http://localhost:8181/api/v3/configure/processing_engine_trigger" \
  -H "Content-Type: application/json" \
  -d '{
    "db": "signals",
    "plugin_filename": "gh:influxdata/signal_generator/signal_generator.py",
    "trigger_name": "signal_generator_trigger",
    "trigger_specification": "every:10s",
    "trigger_arguments": {
      "waveforms": "[{\"type\":\"constant\",\"value\":30.0},{\"type\":\"sine\",\"frequency\":0.005,\"amplitude\":10.0},{\"type\":\"noise\",\"stddev\":0.5}]",
      "measurement": "signal",
      "field": "value",
      "jitter_amplitude_seconds": "0.2"
    },
    "trigger_settings": {
      "run_async": false,
      "error_behavior": "log"
    },
    "disabled": false
  }'
```
### Default CLI trigger

The CLI can create a default no-argument trigger because no JSON value is passed.
Do not use the CLI for `waveforms` or `tags` until the CLI parsing issue is fixed.

```bash
influxdb3 create trigger \
  --database signals \
  --path "gh:influxdata/signal_generator/signal_generator.py" \
  --trigger-spec "every:10s" \
  signal_generator_default
```
**Note:** The first execution initializes the plugin (stores the current time in cache) and does not write any data. Data begins flowing on the second execution.

## Example usage

### Example 1: Basic (defaults)

Use the default preset with no configuration. Creates a signal centered around 30 with sine trend, noise, and spikes:

```bash
# Create the trigger
influxdb3 create trigger \
  --database signals \
  --path "gh:influxdata/signal_generator/signal_generator.py" \
  --trigger-spec "every:10s" \
  signal_basic

# Enable the trigger
influxdb3 enable trigger --database signals signal_basic

# Query signal data (after the second execution)
influxdb3 query \
  --database signals \
  "SELECT time, value FROM signal ORDER BY time DESC LIMIT 10"
```
### Example 2: Custom waveforms (square + noise)

Generate a square wave with added noise — useful for simulating on/off processes with sensor jitter:

```bash
curl -X POST "http://localhost:8181/api/v3/configure/processing_engine_trigger" \
  -H "Content-Type: application/json" \
  -d '{
    "db": "signals",
    "plugin_filename": "gh:influxdata/signal_generator/signal_generator.py",
    "trigger_name": "signal_square_noise",
    "trigger_specification": "every:10s",
    "trigger_arguments": {
      "waveforms": "[{\"type\":\"square\",\"frequency\":0.02,\"amplitude\":5.0,\"duty_cycle\":0.3},{\"type\":\"noise\",\"stddev\":0.2}]"
    },
    "trigger_settings": {
      "run_async": false,
      "error_behavior": "log"
    },
    "disabled": false
  }'
```
### Example 3: Custom output (measurement, field, tags)

Write signal data to a specific measurement with custom field name and tags for multi-series dashboards:

```bash
curl -X POST "http://localhost:8181/api/v3/configure/processing_engine_trigger" \
  -H "Content-Type: application/json" \
  -d '{
    "db": "signals",
    "plugin_filename": "gh:influxdata/signal_generator/signal_generator.py",
    "trigger_name": "signal_custom_output",
    "trigger_specification": "every:10s",
    "trigger_arguments": {
      "measurement": "cpu_temperature",
      "field": "temperature",
      "tags": "{\"host\":\"server01\",\"region\":\"us-west\"}"
    },
    "trigger_settings": {
      "run_async": false,
      "error_behavior": "log"
    },
    "disabled": false
  }'
```
### Example 4: Multiple independent signals

Run two triggers to generate multiple independent signals in the same database. Each trigger has its own cache and waveform configuration:

```bash
# Signal A: slow sine wave (temperature-like)
curl -X POST "http://localhost:8181/api/v3/configure/processing_engine_trigger" \
  -H "Content-Type: application/json" \
  -d '{
    "db": "signals",
    "plugin_filename": "gh:influxdata/signal_generator/signal_generator.py",
    "trigger_name": "signal_temperature",
    "trigger_specification": "every:10s",
    "trigger_arguments": {
      "waveforms": "[{\"type\":\"constant\",\"value\":22.0},{\"type\":\"sine\",\"frequency\":0.002,\"amplitude\":3.0},{\"type\":\"noise\",\"stddev\":0.1}]",
      "measurement": "environment",
      "field": "temperature",
      "tags": "{\"sensor\":\"A\"}"
    },
    "trigger_settings": {
      "run_async": false,
      "error_behavior": "log"
    },
    "disabled": false
  }'

# Signal B: faster oscillation with spikes (pressure-like)
curl -X POST "http://localhost:8181/api/v3/configure/processing_engine_trigger" \
  -H "Content-Type: application/json" \
  -d '{
    "db": "signals",
    "plugin_filename": "gh:influxdata/signal_generator/signal_generator.py",
    "trigger_name": "signal_pressure",
    "trigger_specification": "every:10s",
    "trigger_arguments": {
      "waveforms": "[{\"type\":\"constant\",\"value\":101.3},{\"type\":\"sine\",\"frequency\":0.01,\"amplitude\":0.8},{\"type\":\"spike\",\"probability\":0.01,\"min_amplitude\":2.0,\"max_amplitude\":5.0}]",
      "measurement": "environment",
      "field": "pressure",
      "tags": "{\"sensor\":\"B\"}"
    },
    "trigger_settings": {
      "run_async": false,
      "error_behavior": "log"
    },
    "disabled": false
  }'
```
### Waveform JSON examples

#### Single sine wave (all defaults)

```json
[{"type": "sine"}]
```
Produces a sine at 0.05 Hz (20 s period), amplitude 1.0, centered at 0.

#### Combined sine and noise

```json
[
  {"type": "constant", "value": 50.0},
  {"type": "sine", "frequency": 0.01, "amplitude": 15.0},
  {"type": "noise", "stddev": 1.0}
]
```
Produces a signal centered at 50 with a 100 s period sine (±15) and moderate noise.

#### Square wave with custom duty cycle

```json
[
  {"type": "square", "frequency": 0.05, "amplitude": 10.0, "duty_cycle": 0.25}
]
```
Produces a square wave spending 25% of each period at +10 and 75% at -10.

#### Full custom signal

```json
[
  {"type": "constant", "value": 100.0},
  {"type": "triangle", "frequency": 0.005, "amplitude": 20.0},
  {"type": "noise", "stddev": 2.0},
  {"type": "spike", "probability": 0.02, "min_amplitude": 30.0, "max_amplitude": 60.0}
]
```
Produces a triangle wave centered at 100, with 2% spike probability and magnitude 30–60.

## Output schema

### Measurement: `signal` (default, configurable)

**Tags:**

Tags are optional and have no defaults. Tags are only present when specified via the `tags` trigger argument.

Example with `tags={"host": "server01", "region": "us-west"}`:
- `host`: `server01`
- `region`: `us-west`

**Fields:**

- `value` (float64): The computed signal value at each timestamp. Field name is configurable via the `field` argument.

**Timestamp:**

- Nanosecond precision Unix epoch timestamps. Each point's timestamp reflects simulated sample time, not the wall-clock time of the write.
- Timestamp jitter is enabled by default, so adjacent timestamps are usually close to, but not exactly on, the nominal cadence grid. Set `jitter_amplitude_seconds=0` for regular intervals.
- Simulated gaps are enabled by default, so output contains periodic missing spans of 10–30 seconds. Set `gap_enabled=false` for continuous data.

### Line protocol examples

Without tags (default):

```
signal value=32.47 1712678399918245021
signal value=31.89 1712678401084217139
signal value=33.21 1712678401962364102
```
With custom measurement, field, and tags:

```
cpu_temperature,host=server01,region=us-west temperature=72.3 1712678400000000000
cpu_temperature,host=server01,region=us-west temperature=71.8 1712678401000000000
```
## Example queries

### View the most recent signal values

```sql
SELECT time, value
FROM signal
WHERE time > now() - INTERVAL '5 minutes'
ORDER BY time DESC
LIMIT 20;
```
### Compute rolling statistics

```sql
SELECT
  time_bucket(time, INTERVAL '1 minute') AS minute,
  AVG(value) AS avg_value,
  MIN(value) AS min_value,
  MAX(value) AS max_value
FROM signal
WHERE time > now() - INTERVAL '1 hour'
GROUP BY minute
ORDER BY minute DESC;
```
### Find spikes (values far from the mean)

```sql
SELECT time, value
FROM signal
WHERE time > now() - INTERVAL '1 hour'
  AND ABS(value - 30.0) > 10.0
ORDER BY time DESC;
```
### Compare multiple signals

```sql
SELECT time, temperature, pressure
FROM environment
WHERE time > now() - INTERVAL '30 minutes'
ORDER BY time DESC
LIMIT 50;
```
## Code overview

### Files

- `signal_generator.py`: The main plugin code containing all waveform factories, config parsing, time series generation, and the scheduled trigger entry point.

### Main functions

#### `process_scheduled_call(influxdb3_local, call_time, args)`

Entry point for scheduled triggers. Orchestrates the full execution: parses config, reads the cache, generates timestamps and signal values, writes points, and updates the cache.

Key operations:

1. Parses waveform, output, resolution, timestamp jitter, and gap configuration from trigger arguments
2. Reads `last_time` from the trigger-local cache
3. On first run: stores current time (and the auto-generated gap seed when gaps are enabled and unseeded) and returns without writing (initialization)
4. Generates timestamps in the half-open interval `(last_time, now]`
5. Evaluates the combined waveform at each nominal timestamp
6. Applies timestamp jitter without changing field values
7. Removes points whose final timestamps fall inside simulated gap windows (see [Simulated gaps](#simulated-gaps))
8. Writes the remaining points using `write_sync` with `no_sync=True`
9. Updates `last_time` in the cache

#### Waveform factories

`make_constant`, `make_sine`, `make_square`, `make_triangle`, `make_sawtooth`, `make_noise`, `make_spike` — each returns a function `f(t: float) -> float` where `t` is Unix epoch seconds. Deterministic waveforms are anchored to absolute time (same `t` always produces the same value). Stochastic waveforms draw from a `random.Random` instance per factory call.

#### `combine(waveform_fns)`

Composes a list of waveform functions by summing their outputs: `combined(t) = sum(fn(t) for fn in waveform_fns)`.

#### `generate_timestamps(start, end, points_per_second)`

Generates timestamps in the half-open interval `(start, end]`. The interval is exclusive of `start` to prevent duplicate points across consecutive executions.

#### `apply_timestamp_jitter(points, amplitude_seconds, seed)`

Offsets generated point timestamps after signal evaluation. Values are unchanged; only timestamps are moved.

#### `gap_window(gap_config, n)` / `in_gap(gap_config, t)` / `apply_gaps(points, gap_config)`

Implements the simulated gap schedule: absolute time is divided into fixed strata, and stratum `n` contains one gap whose start offset and duration are derived from a `blake2b` hash of `(seed, n)`. Every window is a pure function of seed, configuration, and gap index, so results are identical regardless of how many points each scheduled call generates. `apply_gaps` filters final (jittered) timestamps and reports how many points were removed. See `GAP_DESIGN.md` for the full design.

## Troubleshooting

### Common issues

#### Issue: No data appearing after enabling the trigger

**Cause**: The first execution initializes the plugin (stores the current time) and does not write any data. This is by design.

**Solution**: Wait for the second execution. Check the logs to confirm initialization succeeded:

```bash
influxdb3 query \
  --database signals \
  "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'signal_basic' ORDER BY event_time DESC LIMIT 5"
```
Look for a log entry containing `"Signal generator initializing"` — this confirms the first run completed successfully and data will appear on the next execution.

#### Issue: Config parsing error in logs

**Cause**: Malformed JSON in `waveforms` or `tags` arguments, or an unknown waveform type.

**Solution**: Validate your JSON before passing it as a trigger argument. Supported waveform types are: `constant`, `sine`, `square`, `triangle`, `sawtooth`, `noise`, `spike`. Check for typos and ensure the JSON array is valid:

```bash
# Validate JSON locally
echo '[{"type": "sine"}, {"type": "noise"}]' | python3 -m json.tool
```
#### Issue: Missing spans in query results

**Cause**: Simulated gaps are enabled by default. The plugin periodically simulates a data-source outage and writes no points inside the outage window.

**Solution**: This is expected behavior. To confirm a missing span is a simulated gap rather than a real failure, check the logs — runs that removed points report `... (N generated, M removed by K gap windows)`. Set `gap_enabled=false` in the trigger arguments for continuous output.

#### Issue: No points generated (interval too short)

**Cause**: The trigger fires more frequently than `1 / points_per_second` seconds, so no timestamps fall in the interval.

**Solution**: Increase `points_per_second` to match your trigger frequency, or reduce trigger frequency. For example, if firing every 1 s with `points_per_second=1.0`, at least one point is generated per execution. If firing every 100ms, increase to `points_per_second=10.0`.

#### Issue: Invalid jitter config in logs

**Cause**: `jitter_amplitude_seconds` is negative, non-numeric, or too large for the configured `points_per_second`, or `jitter_seed` is not an integer.

**Solution**: Reduce `jitter_amplitude_seconds`, reduce `points_per_second`, set `jitter_amplitude_seconds=0`, or use an integer `jitter_seed`. The plugin requires at least a 1 microsecond minimum gap between any two possible jittered timestamps.

#### Issue: Write failures for individual points

**Cause**: Intermittent write errors. The plugin logs each failed point and continues.

**Solution**: Check logs for write error details:

```bash
influxdb3 query \
  --database signals \
  "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'signal_basic' AND log_text LIKE '%Write failed%' ORDER BY event_time DESC LIMIT 10"
```
#### Issue: Signal is not phase-continuous after restart

**Cause**: Deterministic waveforms (sine, square, triangle, sawtooth) are anchored to absolute Unix time, so they are always at the correct phase for a given wall-clock time. If the signal appears discontinuous, check that the `frequency` parameter is the same before and after the restart.

**Cause of gaps in data**: Short gaps (10–30 seconds by default) are simulated outages; see [Simulated gaps](#simulated-gaps). For downtime-related gaps: if the trigger was disabled or InfluxDB was stopped, the cache retains `last_time` from the last successful execution, and on restart the plugin generates all missing points from `last_time` to the current time — the caught-up span contains the same simulated gap windows an uninterrupted run would have.

### Viewing logs

```bash
influxdb3 query \
  --database YOUR_DATABASE \
  "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'signal_basic' ORDER BY event_time DESC LIMIT 20"
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
