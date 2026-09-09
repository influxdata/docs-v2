<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
> **Note:** This plugin requires {{% product-name %}}.8.2 or later (uses the synchronous write API).


The Gapfill Plugin detects gaps in time series (spacing between consecutive
points wider than a threshold) and fills them with imputed values using
standard missing-data imputation methods. Fill points land on an epoch-anchored
time grid strictly inside each gap, so overlapping runs are idempotent. It
works both on uniform-grid data (for example, the output of the
[`resampler`](https://github.com/influxdata/influxdb3_plugins/tree/main/influxdata/resampler)
plugin) and directly on irregular raw series, and supports two modes of
operation: continuous scheduled filling and one-off historical repair over
HTTP.

- **Detects and fills in one pass**: a gap is any inter-point spacing greater
  than `gap_threshold`; detection runs per numeric field, so a field that goes
  missing while others keep reporting is still filled — non-numeric fields are
  carried onto fill points by last known value
- **Standard imputation methods**: linear, previous (LOCF), next, nearest,
  cubic spline, PCHIP (monotone cubic, no overshoot at gap edges), constant
- **Two output modes**: materialize the full series into a target measurement
  (pipeline mode), or append only fill points into the source (in-place repair)
- **Bounded imputation**: gaps longer than `max_fill_gap` are never invented,
  only reported

Unlike SQL
[`date_bin_gapfill`](https://docs.influxdata.com/influxdb3/enterprise/reference/sql/functions/time-and-date/#date_bin_gapfill),
which fills gaps at query time, this plugin **materializes** a continuous series
that downstream consumers — dashboards, other plugins such as
[`signal_filter`](https://github.com/influxdata/influxdb3_plugins/tree/main/influxdata/signal_filter)
— read as physical points, with more fill methods, optional marking of imputed
points, and a per-gap quality report.

## Configuration

Plugin parameters may be specified as key-value pairs in the
`--trigger-arguments` flag (`influxdb3 create trigger`) or in the
`trigger_arguments` field of the API. Values are strings; the plugin coerces
them. Alternatively, supply every parameter from a TOML file via
`config_file_path` — see [TOML configuration](#toml-configuration). For the
HTTP trigger, parameters are passed as a JSON request body.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines
supported trigger types and configuration parameters, enabling the
[InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to
display and configure the plugin.

### Shared parameters (scheduled args and HTTP body)

| Parameter            | Type    |  Default       | Description                                                                                                                                                                                    |
|----------------------|---------|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `source_measurement` | string  | required       | Source measurement to scan for gaps.                                                                                                                                                           |
| `target_measurement` | string  | *(in-place)*   | Target measurement: the full series (existing points plus fills) is written there. Omit to append only the fill points into the source measurement. Must differ from the source.               |
| `interval`           | string  | `1s`           | Expected series cadence and fill grid step, at least 1ms. Units: `us`, `ms`, `s`, `min`, `h`, `d`, `w`.                                                                                        |
| `method`             | string  | `linear`       | Fill method: `linear`, `previous` (LOCF), `next`, `nearest`, `cubic`, `pchip`, or `constant`.                                                                                                  |
| `fill_value`         | float   | —              | Constant used when `method=constant`; required for it, invalid otherwise.                                                                                                                      |
| `gap_threshold`      | string  | 1.5× interval  | Spacing between consecutive points above which a gap is detected, at least one interval.                                                                                                       |
| `max_fill_gap`       | string  | *(unlimited)*  | Gaps longer than this are not filled, only reported. At least one `gap_threshold`.                                                                                                             |
| `fields`             | string  | all numeric    | Space-separated numeric fields to fill with the configured method; numeric fields not listed are dropped. Non-numeric fields are carried into fill points by last known value unless excluded. |
| `excluded_fields`    | string  | none           | Space-separated fields of any type to exclude from the output.                                                                                                                                 |
| `mark_filled`        | boolean | `false`        | When `true`, points that received filled values carry a boolean marker field (`filled=true` by default); such a point may also hold real values of other fields.                               |
| `filled_field_name`  | string  | `filled`       | Name of the marker field written when `mark_filled` is true; must not collide with an existing source column.                                                                                  |
| `report_measurement` | string  | *(off)*        | Optional measurement receiving one row per detected gap; written to `target_database` when set.                                                                                               |
| `target_database`    | string  | *(trigger db)* | Database for writing output. Requires `target_measurement` (chain mode).                                                                                                                       |
| `max_retries`        | integer | `5`            | Maximum number of write attempts.                                                                                                                                                              |
| `config_file_path`   | string  | —              | Path to a TOML file supplying all parameters — replaces the trigger arguments or HTTP body entirely. Relative paths resolve against `PLUGIN_DIR`.                                              |

### Scheduled-only parameters

| Parameter  | Type   | Default   | Description                                                 |
|------------|--------|-----------|-------------------------------------------------------------|
| `window`   | string | `10min`   | How much history each run processes, at least one interval. |
| `offset`   | string | `0s`      | Processing delay for late-arriving data.                    |

### HTTP-only parameters

| Parameter        | Type   | Default         | Description                                                                                         |
|------------------|--------|-----------------|-----------------------------------------------------------------------------------------------------|
| `backfill_start` | string | *(oldest data)* | ISO 8601 start of the repair range (for example, `2026-07-18T14:00:00Z`). Naive values are treated as UTC. |
| `backfill_end`   | string | *(now)*         | ISO 8601 end of the repair range.                                                                   |
| `batch_size`     | string | `30d`           | Time span processed per batch, at least one `interval`.                                             |

### TOML configuration

Set the `PLUGIN_DIR` environment variable and reference the file with the
`config_file_path` trigger argument (relative paths resolve against
`PLUGIN_DIR`, then `INFLUXDB3_PLUGIN_DIR`, then the parent of `VIRTUAL_ENV`).
The TOML file then supplies **all** parameters — it is mutually exclusive with
inline trigger arguments. See
[`gapfill_config_scheduler.toml`](gapfill_config_scheduler.toml) for an
annotated template.

## Output modes

- **Chain mode** (`target_measurement` set): the full series — existing points
  plus fills — is written to the target measurement each run, so downstream
  consumers read one continuous measurement. Raw data is never modified.
- **In-place repair** (`target_measurement` omitted): fill values are appended
  into the source measurement. Filling is per field, so a fill may land on a
  timestamp where other fields already hold real values — the missing field's
  value (and the marker, when enabled) is added to that point; existing values
  are never modified.

Every value is written with the source column's stored type: integer fills are
rounded and UInt64 stays `uint`, so output never conflicts with the schema.
Blending methods (`linear`, `cubic`, `pchip`, `constant`) produce float64, so
in chain mode those columns — fills and copied values alike — become float in
the target; in in-place mode such fills are cast back to the column's type.

## Gap report

With `report_measurement` set, each detected gap produces one row:

- **Tags**: the series tags plus `gap_field` (the field the gap was detected
  in).
- **Fields**: `gap_start_ns`, `gap_end_ns` (boundary timestamps), `duration_s`
  (float seconds), `points` (fill points actually written for the gap; `0`
  when skipped), `status` (`filled`, or `skipped` when the gap is longer than
  `max_fill_gap` or no point could be written).
- **Timestamp**: the gap end, so re-reporting the same gap overwrites in place.

Report rows are written next to the output: with `target_database` set they
land in that database, not in the trigger's.

Alerting on this measurement (for example, with the
[`notifier`](https://github.com/influxdata/influxdb3_plugins/tree/main/influxdata/notifier)
plugin) turns gapfill into a sensor-health monitor.

## Data requirements

- Existing timestamps are never changed: fills are added on the epoch-anchored
  grid, existing points keep their original time. The output is continuous but
  not uniform — run
  [`resampler`](https://github.com/influxdata/influxdb3_plugins/tree/main/influxdata/resampler)
  first when downstream consumers need an exact grid.
- On jittery raw data, raise `gap_threshold` above the expected jitter (the
  default is 1.5× `interval`), otherwise normal spacing is detected as gaps and
  imputed points appear between healthy readings.
- Detecting a gap requires both its boundary points inside one run's query
  window (quantified below), so a longer outage is neither filled nor reported.
  Repair those with the HTTP trigger over an explicit range, and alert on them
  with a deadman check (e.g.
  [`threshold_deadman_checks`](https://github.com/influxdata/influxdb3_plugins/tree/main/influxdata/threshold_deadman_checks)).
- A gap is filled only after it closes (a point arrives on its right side); an
  ongoing outage is not extrapolated.
- A series/field needs at least 2 points to be processed; `cubic` needs at
  least 4 (falls back to `linear` with a warning).
- Visibility costs reads: each run queries three times the range it processes
  (the range plus lookback padding on both sides). A scheduled run processes
  `window + max(window, max_fill_gap)`, so `window=10min` without
  `max_fill_gap` reads about 60 minutes of history per run. HTTP backfill
  batches are padded the same way.

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled
  (`--plugin-dir` configured).
- **Python packages**: `scipy` and `influxdata-plugin-utils` (numpy is
  installed with scipy).

### Installation steps

1. Start {{% product-name %}} with the Processing Engine enabled
   (`--plugin-dir /path/to/plugins`):

   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```
2. Install the Python dependencies into the plugin environment:

   ```bash
   influxdb3 install package "influxdata-plugin-utils>=0.3.0"
   influxdb3 install package scipy
   ```
## Trigger setup

### Scheduled trigger (continuous pipeline)

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/gapfill/gapfill.py \
  --trigger-spec "every:1m" \
  --trigger-arguments 'source_measurement=signal_resampled,target_measurement=signal_filled,interval=1s,method=linear,max_fill_gap=1min' \
  gapfill_signal
influxdb3 enable trigger --database mydb gapfill_signal
```
### HTTP trigger (one-off historical repair)

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/gapfill/gapfill.py \
  --trigger-spec "request:gapfill" \
  gapfill_backfill
influxdb3 enable trigger --database mydb gapfill_backfill

curl -X POST "http://localhost:8181/api/v3/engine/gapfill" \
  -H "Authorization: Bearer $INFLUXDB3_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "source_measurement": "sensors",
    "interval": "15s",
    "method": "pchip",
    "backfill_start": "2026-07-18T00:00:00Z",
    "backfill_end": "2026-07-19T00:00:00Z"
  }'
```
**Expected response** (fills appended in-place, since `target_measurement` is
omitted):

```json
{
  "status": "ok",
  "task_id": "…",
  "batches": 1,
  "rows_scanned": 5730,
  "gaps_filled": 12,
  "gaps_skipped": 0,
  "fills_written": 96,
  "rows_copied": 0
}
```
## Example usage

### Example 1: Fill outage gaps after resampling (pipeline mode)

With `signal_resampled` on a 1s grid containing 10–30s outage holes:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/gapfill/gapfill.py \
  --trigger-spec "every:1m" \
  --trigger-arguments 'source_measurement=signal_resampled,target_measurement=signal_filled,interval=1s,max_fill_gap=1min,mark_filled=true' \
  gapfill_signal
influxdb3 enable trigger --database mydb gapfill_signal

influxdb3 query --database mydb \
  "SELECT time, value, filled FROM signal_filled ORDER BY time DESC LIMIT 10"
```
**Expected output**: a continuous 1s series in `signal_filled`; timestamps that
were missing in `signal_resampled` carry interpolated `value`s and
`filled=true`, copied real points have `filled` null.

### Example 2: Constant fill for an event counter

A gap in an event-rate series means "no events", not "interpolate":

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/gapfill/gapfill.py \
  --trigger-spec "every:5m" \
  --trigger-arguments 'source_measurement=events_per_min,interval=1min,method=constant,fill_value=0' \
  gapfill_events
influxdb3 enable trigger --database mydb gapfill_events
```
**Expected output**: zero-valued points appended in-place at missing minutes.

### Example 3: Gap report for sensor-health monitoring

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/gapfill/gapfill.py \
  --trigger-spec "every:1m" \
  --trigger-arguments 'source_measurement=sensors,interval=15s,max_fill_gap=2min,report_measurement=gapfill_report' \
  gapfill_sensors

influxdb3 query --database mydb \
  "SELECT * FROM gapfill_report WHERE status = 'skipped' ORDER BY time DESC"
```
**Expected output**: one row per gap with boundaries, duration, and status;
`skipped` rows mark outages too long to impute — alert on those.

## Code overview

### Files

- `gapfill.py`: The main plugin code containing the handlers for scheduled
  filling and HTTP backfill
- `gapfill_config_scheduler.toml`: Example TOML configuration file

### Logging

Logs are stored in the `_internal` database in the
`system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database _internal \
  "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'gapfill_signal' ORDER BY event_time DESC LIMIT 20"
```
### Main functions

#### `process_scheduled_call(influxdb3_local, call_time, args)`

Entry point for the scheduled trigger. Loads and validates the configuration,
then fills a sliding window of history ending at `call_time - offset`.

#### `process_request(influxdb3_local, query_parameters, request_headers, request_body, args)`

Entry point for the HTTP trigger. Repairs `[backfill_start, backfill_end)` in
`batch_size` chunks, resolving the schema once, and returns the run totals.

#### `run_gapfill(...)`

One pass over a time range: resolves the schema, queries the padded window,
groups rows by tag set, fills each series (and copies existing points in chain
mode), and writes the result with retries.

#### `fill_series(...)`

Detects gaps of one series per numeric field, computes fill values on the
epoch grid, attaches carried fields by last known value, and builds the gap
report rows.

## Troubleshooting

### Common issues

#### Issue: "required packages are not installed"

**Cause**: The plugin environment lacks `scipy` or `influxdata-plugin-utils`.

**Solution**: Run `influxdb3 install package "influxdata-plugin-utils>=0.3.0"`
and `influxdb3 install package scipy`, then re-enable the trigger.

#### Issue: Field type conflict on write

**Cause**: The chain-mode target measurement already contains a field whose
stored type conflicts with the plugin's output (blending methods write
float64; another producer may have created the column as integer).

**Solution**: Use a fresh target measurement, or a selection method
(`previous`, `next`, `nearest`), which preserves source types. In-place mode
preserves integer column types by rounding fills.

#### Issue: No fills appear

**Cause**: The gap has not closed yet (no point on its right side), the gap is
longer than `max_fill_gap` or the lookback, or the series/field has fewer than
2 points.

**Solution**: Check the info logs for skip counts; increase `max_fill_gap` or
repair the range explicitly via the HTTP trigger.

#### Issue: "source_measurement already has a column named 'filled'"

**Cause**: `mark_filled` is true and the marker name (`filled_field_name`,
default `filled`) is taken by a source tag or by a non-boolean field; the
plugin refuses to overwrite it. In in-place mode, a boolean column of that
name is treated as the plugin's own marker from earlier runs and reused.

**Solution**: Set `filled_field_name` to a name not used by the source, or
disable `mark_filled`. With `mark_filled` off, a source field named `filled`
is processed normally.

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
