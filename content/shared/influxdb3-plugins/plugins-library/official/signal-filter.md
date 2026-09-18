<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
The Signal Filter Plugin applies streaming digital IIR filters (Butterworth,
Chebyshev I, Bessel — lowpass/highpass/bandpass/bandstop — or manually supplied
second-order sections) to numeric time-series fields as they are written to
{{% product-name %}}. Filtering is causal and per series: each tag combination gets its own
filter whose delay-line state persists in the trigger cache across WAL commits, so
output over a stream of small writes is identical to filtering the whole signal at
once. It pairs naturally with the
[`signal_generator`](https://github.com/influxdata/influxdb3_plugins/tree/main/influxdata/signal_generator)
plugin but works with any measurement carrying numeric fields.

- **Streaming, stateful**: per-series delay-line state persists in the trigger
  cache, so chunked writes filter identically to a single batch
- **Preset or manual design**: SciPy-designed Butterworth, Chebyshev I, and Bessel
  prototypes, or raw second-order sections you supply
- **Automatic sample-rate inference**: infers `fs` per series from the data when
  not configured explicitly
- **Multi-field, multi-series**: filters each configured field and each tag
  combination independently
- **Flexible output routing**: rename, prefix/suffix, and redirect the filtered
  field to another measurement or database

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments`
flag (`influxdb3 create trigger`) or in the `trigger_arguments` field of the API.
Values are strings; the plugin coerces them. Alternatively, supply every parameter
from a TOML file via `config_file_path` — see [TOML configuration](#toml-configuration).

> **CLI limitation:** the `sos` argument is a JSON array containing commas, and
> `influxdb3 create trigger --trigger-arguments` splits on every comma, so the value
> is fragmented before it reaches the plugin. Configure `sos` (i.e. `design_type=manual`)
> through the InfluxDB 3 Explorer UI, the `/api/v3/configure/processing_engine_trigger`
> API, or a TOML file — not the CLI. Space-separated arguments such as `input_fields`
> and `tag_keys` are unaffected.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported
trigger types and configuration parameters. This metadata enables the
[InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display
and configure the plugin.

### Input parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `input_measurement` | string | *(all tables)* | Table to filter. If omitted, every table the trigger fires for is filtered. |
| `input_fields` | string | `value` | Space-separated numeric fields to filter; each is filtered independently. |
| `tag_keys` | string | *(auto)* | Space-separated tag columns that define a series. Defaults to all string-valued columns except `time` and the input fields. Set explicitly if a string *field* would otherwise be mistaken for a tag. |

### Design parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `design_type` | string | `preset` | `preset` (SciPy-designed IIR) or `manual` (SOS coefficients supplied via `sos`). |
| `prototype` | string | `butter` | Preset prototype: `butter`, `cheby1`, or `bessel`. |
| `order` | integer | `4` | Filter order, 1–12. Band filters yield effective order 2N. |
| `ripple` | float | — | Passband ripple in dB, 0.01–80 (0.1–3 typical). Required for `cheby1`; invalid otherwise. |
| `filter_type` | string | `lowpass` | `lowpass`, `highpass`, `bandpass`, or `bandstop`. |
| `fc` | float | — | Convenience alias for the single cutoff (Hz) of lowpass/highpass. Invalid for band types or together with the parameter it maps to. |
| `fc1` | float | — | Lower cutoff (Hz). Required for highpass and band filters. |
| `fc2` | float | — | Upper cutoff (Hz). Required for lowpass and band filters. Band filters require `fc1 < fc2`. |
| `bessel_norm` | string | `phase` | Bessel normalization: `phase`, `delay`, or `mag`. Bessel only. |
| `sos` | JSON string | — | Manual second-order sections as JSON `[[b0,b1,b2,a0,a1,a2], ...]`. Required for `design_type` `manual`; invalid otherwise. Rows are normalized by `a0`; unstable filters (any pole magnitude ≥ 1) are rejected. |
| `sample_rate` | float | *(inferred)* | Sample rate in Hz for preset design. If omitted, inferred per series from the median inter-sample interval and frozen once enough samples are seen (see [Sample-rate inference](#sample-rate-inference)). |
| `init_from_first_sample` | boolean | `true` | Initialize filter state from the first sample to suppress the startup transient. |

### Output parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `output_target_database` | string | *(trigger db)* | Database to write filtered output to. |
| `output_measurement` | string | *(source table)* | Measurement to write filtered output to. |
| `output_field` | string | *(source field)* | Base name override for the output field. Only valid when a single input field is configured. |
| `field_prefix` | string | *(empty)* | Prefix for the output field name. |
| `field_suffix` | string | `_filtered` | Suffix for the output field name. |
| `config_file_path` | string | — | Path to a TOML file supplying all parameters; mutually exclusive with inline arguments. Relative paths resolve against `PLUGIN_DIR`. |

The final output field name is `{field_prefix}{output_field or source_field}{field_suffix}`
— by default, `value` becomes `value_filtered`. The raw input field is never copied
to the output.

### TOML configuration

To use a TOML configuration file, set the `PLUGIN_DIR` environment variable and
reference the file with the `config_file_path` trigger argument (relative paths
resolve against `PLUGIN_DIR`, then `INFLUXDB3_PLUGIN_DIR`, then the parent of
`VIRTUAL_ENV`). The TOML file then supplies **all** parameters — it is mutually
exclusive with inline trigger arguments, so passing both is rejected. See
[`signal_filter_config_data_writes.toml`](signal_filter_config_data_writes.toml)
for an annotated template.

## Data requirements

- Input fields must be numeric (float or int). Null, boolean, and string values
  contribute no samples; NaN/±Inf samples are dropped (they would permanently
  poison IIR filter state).
- Duplicate timestamps within a commit keep the last occurrence, matching the
  database's last-write-wins semantics.
- **Samples must arrive in time order across commits.** The plugin records the
  last filtered timestamp per series and drops late/backfilled samples with a
  warning — replaying old samples through a stateful causal filter would corrupt
  the output. To re-filter history, delete the trigger's cache state (or recreate
  the trigger) and replay the data in order.

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled
  (`--plugin-dir` configured).
- **Python packages**: `numpy`, `scipy`, and `influxdata-plugin-utils`.

### Installation steps

1. Start {{% product-name %}} with the Processing Engine enabled (`--plugin-dir /path/to/plugins`):

   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```
2. Install the Python dependencies into the plugin environment:

   ```bash
   influxdb3 install package numpy scipy influxdata-plugin-utils
   ```
   or via the HTTP API:

   ```bash
   curl -X POST "http://localhost:8181/api/v3/configure/plugin_environment/install_packages" \
     -H "Authorization: Bearer $INFLUXDB3_AUTH_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"packages": ["numpy", "scipy", "influxdata-plugin-utils"]}'
   ```
3. Copy `signal_filter.py` into your plugin directory (or upload it with
   `POST /api/v3/plugins/files`).

## Trigger setup

Create the trigger with `run_async: false` (the plugin's per-series state assumes
one invocation in flight at a time) and `error_behavior: log` or `retry` (state is
saved only after all writes are buffered, so retries re-filter and re-emit the same
points idempotently). Note the lowercase values — the live API rejects `Log`.

### Data write trigger

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename signal_filter.py \
  --trigger-spec "table:signal" \
  --trigger-arguments 'input_fields=value,filter_type=lowpass,fc=5.0,order=4' \
  signal_lowpass
```
or via the HTTP API:

```bash
curl -X POST "http://localhost:8181/api/v3/configure/processing_engine_trigger" \
  -H "Authorization: Bearer $INFLUXDB3_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "db": "mydb",
    "plugin_filename": "signal_filter.py",
    "trigger_name": "signal_lowpass",
    "trigger_specification": "table:signal",
    "trigger_settings": {"run_async": false, "error_behavior": "log"},
    "trigger_arguments": {
      "input_fields": "value",
      "filter_type": "lowpass",
      "fc": "5.0",
      "order": "4"
    },
    "disabled": false
  }'
```
### Enable the trigger

```bash
influxdb3 enable trigger --database mydb signal_lowpass
```
### Testing without a trigger

Use the WAL plugin test endpoint. Passing a fixed `cache_name` across calls
exercises cross-commit state continuity:

```bash
curl -X POST "http://localhost:8181/api/v3/plugin_test/wal" \
  -H "Authorization: Bearer $INFLUXDB3_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "signal_filter.py",
    "database": "mydb",
    "input_lp": "signal,host=a value=1.0 1717000000000000000\nsignal,host=a value=2.0 1717000000100000000",
    "cache_name": "sigfilt_test",
    "input_arguments": {"filter_type": "lowpass", "fc": "5.0", "sample_rate": "10.0"}
  }'
```
Note: test caches expire after 30 minutes by default; production trigger caches
persist indefinitely.

## Example usage

### Example 1: Lowpass smoothing (defaults)

Attenuate high-frequency noise on the `value` field of the `signal` table with a
4th-order Butterworth lowpass at 5 Hz:

```bash
# Create and enable the trigger
influxdb3 create trigger \
  --database mydb \
  --plugin-filename signal_filter.py \
  --trigger-spec "table:signal" \
  --trigger-arguments 'input_fields=value,filter_type=lowpass,fc=5.0,order=4,sample_rate=100.0' \
  signal_lowpass
influxdb3 enable trigger --database mydb signal_lowpass

# Write some data, then query the filtered field
influxdb3 query \
  --database mydb \
  "SELECT time, value, value_filtered FROM signal ORDER BY time DESC LIMIT 10"
```
**Expected output**: for every written `value`, a `value_filtered` field appears at
the same timestamp, with high-frequency content removed. The raw `value` is left
untouched.

### Example 2: Bandpass with an explicit sample rate

Isolate a 1–5 Hz band on a `vibration` field sampled at 50 Hz:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename signal_filter.py \
  --trigger-spec "table:sensors" \
  --trigger-arguments 'input_measurement=sensors,input_fields=vibration,filter_type=bandpass,fc1=1.0,fc2=5.0,order=4,sample_rate=50.0' \
  vibration_bandpass
influxdb3 enable trigger --database mydb vibration_bandpass
```
**Expected output**: a `vibration_filtered` field carrying only the 1–5 Hz band,
per tag combination present in `sensors`.

### Example 3: Manual second-order sections

Apply coefficients you designed elsewhere, routed to a separate measurement:

```bash
curl -X POST "http://localhost:8181/api/v3/configure/processing_engine_trigger" \
  -H "Authorization: Bearer $INFLUXDB3_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "db": "mydb",
    "plugin_filename": "signal_filter.py",
    "trigger_name": "manual_sos",
    "trigger_specification": "table:signal",
    "trigger_settings": {"run_async": false, "error_behavior": "log"},
    "trigger_arguments": {
      "design_type": "manual",
      "sos": "[[0.2, 0.4, 0.2, 1.0, -0.4, 0.2]]",
      "output_measurement": "signal_filtered"
    },
    "disabled": false
  }'
```
**Expected output**: filtered points written to `signal_filtered` (not the source
`signal` table). Manual mode needs no sample rate — the coefficients are already
digital.

## Sample-rate inference

Preset design needs the sample rate. Resolution order per series:

1. Explicit `sample_rate` argument — always wins, so config corrections take
   effect immediately (a changed rate re-designs the filter and resets state).
2. Frozen per-series value from a previous successful inference.
3. Inference: `fs = 1e9 / median(inter-sample interval)` over accumulated
   timestamps. An estimate is frozen only after ≥ 8 inter-sample intervals have
   been observed; smaller commits accumulate timestamps across invocations and
   are skipped (with an info log, samples not emitted) until the threshold is
   met. At typical `signal_generator` rates a single commit clears it
   immediately.

Manual mode needs no sample rate — the coefficients are already digital.

## Write-loop behavior

Writing the output into the source measurement re-fires this trigger. This is
safe by default: re-fired rows carry only the output field, the input field is
null on them, and null values produce no samples. **However**, if your overrides
resolve the output field to the *same name* as the input field in the same
measurement and database (for example `field_suffix=""` with no `output_field`),
the output feeds the filter again and grows without bound. The plugin logs a
prominent warning in that configuration — change `field_suffix`, `output_field`,
`output_measurement`, or `output_target_database` to break the cycle.

## Code overview

### Files

- `signal_filter.py`: The main plugin code — config parsing/validation, filter
  design (preset + manual), the streaming runtime, per-series state helpers, and
  the `process_writes` WAL entry point.
- `signal_filter_config_data_writes.toml`: Annotated example TOML configuration.
- `test_signal_filter.py`: Unit and integration tests (mock-based; no running
  engine required).

### Logging

Every log line is prefixed with a per-invocation task id: `[<task_id>] signal_filter: ...`.
Per invocation the plugin logs an info summary — tables and series processed,
samples in, points written, and counts of dropped non-finite, out-of-order, and
warm-up-skipped samples. Warnings cover out-of-order drops and the write-loop
hazard; errors cover missing dependencies, invalid configuration, and filter
design failures (for example a cutoff at or above the Nyquist frequency). Logs are
available in the `system.processing_engine_logs` table.

### Main functions

#### `process_writes(influxdb3_local, table_batches, args)`

Entry point for data write triggers. Validates configuration, then for each table
batch: extracts per-(field, series) samples, resolves the sample rate, designs (or
reuses a memoized) filter, applies it with the cached delay-line state, writes the
filtered points, and finally saves the advanced per-series state.

Key operations:

1. Guards that `numpy`, `scipy`, and `influxdata-plugin-utils` are installed; logs an install command otherwise
2. Parses and validates trigger arguments (inline, or entirely from a TOML file)
3. Warns on any write-loop hazard configuration
4. Groups rows into per-(field, series) samples, dropping null/non-numeric/non-finite values
5. Resolves the sample rate (explicit → frozen → inferred with warm-up)
6. Designs the IIR filter (memoized by parameters + `fs`) and checks stability
7. Applies the filter using cached `zi` state, writing each point with `write_sync(..., no_sync=True)`
8. Saves the advanced state (delay line, `fs`, coeff hash, last timestamp) to the cache

## Troubleshooting

### Common issues

#### Issue: "required packages are not installed"

**Cause**: The plugin environment lacks `numpy`, `scipy`, or `influxdata-plugin-utils`.

**Solution**: Run `influxdb3 install package numpy scipy influxdata-plugin-utils` and re-enable the trigger.

#### Issue: No output points

**Cause**: Warm-up (sample-rate inference not yet frozen), a single-sample sparse
series, or a non-numeric/null input field.

**Solution**:

- Check the info logs for warm-up skips: with no `sample_rate` argument the
  plugin waits for ≥ 8 inter-sample intervals per series before filtering.
- A single-sample series with no `sample_rate` cannot infer a rate; set the
  argument explicitly for very sparse data.
- Verify the input field is numeric and non-null in the written rows.

#### Issue: "filter design failed: cutoff ... must be within (0, fs/2)"

**Cause**: The (possibly inferred) sample rate puts your cutoff at or beyond Nyquist.

**Solution**: Set `sample_rate` explicitly or lower the cutoff.

#### Issue: Output has a transient after a server restart

**Cause**: The cache is cleared on restart, so filters re-initialize and inferred
sample rates re-freeze (the cutoff may shift very slightly if the new estimate
differs).

**Solution**: This is expected; set `sample_rate` explicitly to pin the design.

#### Issue: Series explosion / unexpected series

**Cause**: The automatic tag heuristic treats every string-valued column as a tag,
including string *fields*.

**Solution**: Set `tag_keys` explicitly to bound the series set.

### Viewing logs

```bash
influxdb3 query \
  --database YOUR_DATABASE \
  "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'signal_lowpass' ORDER BY event_time DESC LIMIT 20"
```

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
