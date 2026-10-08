<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
The Value Counter Plugin counts how many times each unique value of one or more watched fields appears in a source table, then writes the result as a rollup measurement with field keys of the form `<field>_<value>=<count>i`. It is a direct port of the [Telegraf `valuecounter` aggregator](https://github.com/influxdata/telegraf/tree/master/plugins/aggregators/valuecounter) to the {{% product-name %}} Processing Engine. The plugin ships with two independent modes — a data-write (WAL) trigger that accumulates counts as rows arrive, and a scheduled trigger that queries the source table on every fire and aggregates the window since the previous successful fire.

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. Some plugins support TOML configuration files, which can be specified using the plugin's `config_file_path` parameter.

If a plugin supports multiple trigger specifications, some parameters may depend on the trigger specification that you use.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Required parameters

| Parameter | Type   | Default                   | Description                                                                                                  |
|-----------|--------|---------------------------|--------------------------------------------------------------------------------------------------------------|
| `fields`  | string | required                  | Space-separated list of field names whose unique values are counted (for example, `status method`)           |
| `table`   | string | required (scheduled only) | Source table to query. Mode A derives the source table from the trigger spec and rejects this key            |

### Data write trigger parameters

| Parameter        | Type    | Default          | Description                                                                                                                      |
|------------------|---------|------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `period_seconds` | integer | `60`             | Emission period in seconds, at least `1`. Cache TTL is set to `2 * period_seconds`                                               |
| `period`         | string  | `60s`            | Emission period as a duration, at least `1s`. Units: `s`, `min`, `h`, `d`, `w`. Overridden by `period_seconds` when both are set |
| `output_suffix`  | string  | `_valuecounts`   | Suffix appended to the source measurement name for rollup output. Must be non-empty                                              |
| `dest_database`  | string  | trigger's own DB | Optional database to write rollups to via `write_sync_to_db`                                                                     |

### Scheduled trigger parameters

| Parameter       | Type   | Default          | Description                                                                          |
|-----------------|--------|------------------|--------------------------------------------------------------------------------------|
| `output_suffix` | string | `_valuecounts`   | Suffix appended to the source measurement name for rollup output. Must be non-empty  |
| `dest_database` | string | trigger's own DB | Optional database to write rollups to via `write_sync_to_db`                         |

Mode B is drift-based: the trigger's `every:<duration>` spec is the only cadence knob. The plugin queries the window between the previous successful fire and the current `call_time`, so it self-aligns to whatever the scheduler delivers. Mode B rejects `period_seconds` and `period` keys.

### TOML configuration

| Parameter          | Type   | Default | Description                                                                      |
|--------------------|--------|---------|----------------------------------------------------------------------------------|
| `config_file_path` | string | none    | TOML config file path relative to `PLUGIN_DIR` (required for TOML configuration) |

*To use a TOML configuration file, set the `PLUGIN_DIR` environment variable and specify the `config_file_path` in the trigger arguments.* This is in addition to the `--plugin-dir` flag when starting {{% product-name %}}. Relative paths are resolved against `PLUGIN_DIR`, then `INFLUXDB3_PLUGIN_DIR`, then the parent of `VIRTUAL_ENV`.

If `config_file_path` is set, no other inline arguments may be set on the trigger. The TOML accepts the same keys as inline arguments.

#### Example TOML configuration

- [valuecounter_config.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/valuecounter/valuecounter_config.toml) — shows both Mode A (WAL) and Mode B (scheduled) shapes

For more information on using TOML configuration files, see the Using TOML Configuration Files section in the [influxdb3_plugins/README.md](https://github.com/influxdata/influxdb3_plugins/blob/master/README.md).

## Schema requirement

The plugin reads tag column names from `information_schema.columns` for the source table; the source measurement must exist before the trigger fires. The watched fields named in `fields` must be of categorical type (string or low-cardinality numeric). The rollup measurement is created on first emission; do not pre-create it with a conflicting schema.

The rollup measurement name is always `<source_table><output_suffix>`. The default suffix (`_valuecounts`) keeps the rollup separate from the source table so the WAL trigger does not feed itself. An empty `output_suffix` is rejected at trigger creation.

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled
- **Python packages**: `influxdata-plugin-utils>=0.3.0`

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
   ```
## Trigger setup

> **Do not install both Mode A and Mode B triggers against the same source table.** The two modes share no state and will write duplicate rollup rows. Choose one mode per source table.

### Data write trigger (Mode A)

Count unique field values as rows are written. Emission is period-gated by the plugin's own bookkeeping — the trigger emits when at least `period_seconds` have elapsed since the last successful emission for a given series.

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/valuecounter/valuecounter.py" \
  --trigger-spec "table:http_requests" \
  --trigger-arguments "fields=status method,period_seconds=60" \
  --error-behavior log \
  http_status_counter
```
Mode A's `--trigger-spec` must name a single table (`table:<name>`). `all_tables` is not supported because one `fields` list cannot apply to heterogeneous tables.

### Scheduled trigger (Mode B)

Query the source table on a fixed cadence and aggregate the window since the previous fire. Best when writes are bursty or sparse, or when a deterministic emission cadence matters more than per-write freshness.

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/valuecounter/valuecounter.py" \
  --trigger-spec "every:60s" \
  --trigger-arguments "table=http_requests,fields=status method" \
  --error-behavior log \
  http_status_counter_scheduled
```
The first fire after install (or after a server restart that wipes the cache) only establishes the cadence anchor and emits no rollup. The second fire emits a rollup covering the window from the first fire to the second.

### Enable triggers

```bash
influxdb3 enable trigger --database mydb http_status_counter
```
## Example usage

### Example 1: HTTP status code rollup (Mode A)

Roll up HTTP status codes to per-minute counts per host and endpoint:

```bash
# Create and enable the trigger
influxdb3 create trigger \
  --database web \
  --path "gh:influxdata/valuecounter/valuecounter.py" \
  --trigger-spec "table:http_requests" \
  --trigger-arguments "fields=status,period_seconds=60" \
  --error-behavior log \
  http_status_counter

influxdb3 enable trigger --database web http_status_counter

# Write some sample requests
influxdb3 write \
  --database web \
  "http_requests,host=web-1,endpoint=/api/users status=200i
http_requests,host=web-1,endpoint=/api/users status=200i
http_requests,host=web-1,endpoint=/api/users status=404i
http_requests,host=web-1,endpoint=/api/users status=500i"

# After period_seconds elapses, write one more row to drive emission
sleep 60
influxdb3 write \
  --database web \
  "http_requests,host=web-1,endpoint=/api/users status=200i"

# Query the rollup
influxdb3 query \
  --database web \
  "SELECT * FROM http_requests_valuecounts WHERE time >= now() - 5m"
```
**Expected output**

```text
http_requests_valuecounts,host=web-1,endpoint=/api/users status_200=2i,status_404=1i,status_500=1i
```
### Example 2: Log level counts (Mode B)

Roll up application log levels per service over a fixed five-minute cadence:

```bash
influxdb3 create trigger \
  --database observability \
  --path "gh:influxdata/valuecounter/valuecounter.py" \
  --trigger-spec "every:5m" \
  --trigger-arguments "table=app_logs,fields=level" \
  --error-behavior log \
  log_level_counter

influxdb3 enable trigger --database observability log_level_counter
```
Each fire produces one rollup row per `(service, env)` tag combination, with fields like `level_INFO=120i`, `level_WARN=8i`, `level_ERROR=2i`.

### Example 3: Cross-database rollup (Mode B)

Write rollups to a separate analytics database while leaving the source database untouched:

```bash
influxdb3 create trigger \
  --database production \
  --path "gh:influxdata/valuecounter/valuecounter.py" \
  --trigger-spec "every:1m" \
  --trigger-arguments "table=payment_attempts,fields=result,dest_database=analytics" \
  --error-behavior log \
  payment_result_rollup
```
The rollup measurement `payment_attempts_valuecounts` is written to the `analytics` database.

## Code overview

### Files

- `valuecounter.py`: The main plugin code containing `process_writes` (Mode A) and `process_scheduled_call` (Mode B)
- `valuecounter_config.toml`: Example TOML configuration with both Mode A and Mode B shapes
- `test_valuecounter.py`: Pytest suite (79 tests, runs without a live {{% product-name %}} server)
- `requirements.txt`: Runtime dependencies (`influxdata-plugin-utils>=0.3.0`)
- `requirements-dev.txt`: Development dependencies (`pytest`)

### Logging

Logs are stored in the trigger's database in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database YOUR_DATABASE "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'your_trigger_name'"
```
Every log line is prefixed with a per-fire `task_id` (eight hex characters) so log records from a single trigger fire can be correlated.

### Main functions

#### `process_writes(influxdb3_local, table_batches, args)`

Handles Mode A WAL-trigger invocations. Accumulates per-value counts into trigger-local cache entries, period-gates emission per series, and writes one rollup row per series via `write_sync` (or `write_sync_to_db` if `dest_database` is set). Uses a snapshot-subtract pattern on emit so concurrent increments arriving during a write are preserved across emissions.

#### `process_scheduled_call(influxdb3_local, call_time, args)`

Handles Mode B scheduled invocations. On the first fire, only the cadence anchor is established (no rollup emitted). On subsequent fires, the plugin queries the source table for the window since the previous successful fire, groups results by tag set and watched field, and writes one rollup row per series. The anchor advances only on a successful write or a genuinely empty window — write failures cause the next fire to cover a larger window and naturally retry.

## Troubleshooting

### Common issues

#### Issue: No rollup rows appear

**Solution (Mode A)**: Mode A emission is tied to write traffic. If no rows are written for at least `period_seconds`, emission stops. Confirm the source table is receiving writes and that `period_seconds` is shorter than the inter-write interval. Check `system.processing_engine_logs` for the trigger.

**Solution (Mode B)**: The first fire after install (or server restart) establishes the cadence anchor and emits no rollup — look for a log line containing `vc-scheduled: first fire`. Subsequent fires emit normally.

#### Issue: Rollup measurement schema explosion

**Solution**: The plugin creates one rollup field per unique value of each watched field. Configuring `fields` against a high-cardinality column (for example, `user_id`) creates one column per distinct value and stresses the Parquet schema. Use only on bounded-cardinality categorical fields such as HTTP status, log level, or A/B variant.

#### Issue: Field key contains an invalid character

**Solution**: Watched-field values that contain characters other than `[A-Za-z0-9_]` are sanitized — every disallowed character is replaced with `_`. Two distinct raw values that sanitize to the same key (for example, `"not found"` and `"not_found"`) are summed into one rollup field. When this happens, the plugin emits a warning to `system.processing_engine_logs` listing the colliding raw values.

#### Issue: Source table tag list changed and rollups are missing tags

**Solution**: The plugin caches tag-column names from `information_schema.columns` for one hour per source table. Schema changes are picked up within an hour. To force a refresh, delete the cache key `shared:tags:<table>`.

#### Issue: Both modes installed against the same source table

**Solution**: The two modes share no state and will both emit rollups, producing duplicate rows. Drop one trigger and use the other exclusively.

### Operational notes

- Do not enable `--run-asynchronous` on a Mode A trigger. The plugin assumes serialized per-trigger invocations; concurrent fires race on the per-series counts dict and the in-memory index.
- Re-running a fire (for example, via `influxdb3 test schedule_plugin`) overwrites the previous emission idempotently because every rollup row uses the same timestamp for a given fire (Mode A: `now_ns`; Mode B: `call_time_ns`). Combined with {{% product-name %}}'s last-write-wins semantics, replays do not produce duplicate rollup rows.
- Server restart wipes the trigger-local cache. Mode A loses any accumulated-but-not-yet-emitted counts; Mode B's next fire is treated as a "first fire" and skips one period of source data. Both behaviors are documented above.

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
