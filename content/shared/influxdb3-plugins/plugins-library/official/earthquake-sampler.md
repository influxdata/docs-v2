<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
The Earthquake Sampler Plugin ingests earthquake events from the USGS GeoJSON feeds on a schedule and writes normalized points for dashboards and alerting. It can also read from a custom JSON endpoint or from an existing InfluxDB table, and optionally writes directly into an existing canonical `quake` table using that table's column names (`write_quake_schema=true`). Events are deduplicated with a per-event update-marker cache, so reruns only write new or updated earthquakes.

- **Zero authentication**: USGS feeds require no API keys or signup
- **Two source modes**: HTTP (USGS or custom JSON) and `influxdb_table` (transform rows from an existing table)
- **Per-event deduplication**: update markers are cached per event id; updated events are re-written, unchanged events are skipped
- **Canonical quake schema**: optional direct writes into an existing `quake` table

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. All parameters are optional; invalid values abort the run with an error log rather than silently falling back to defaults.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Data selection parameters

| Parameter          | Type    | Default        | Description                                                                                                                                                                                                           |
|--------------------|---------|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `feed`             | string  | all_hour       | USGS GeoJSON feed key: `all`, `significant`, `4.5`, `2.5`, or `1.0` combined with `_hour`, `_day`, `_week`, or `_month` (for example `significant_day`)                                                               |
| `source_type`      | string  | http           | Data source type: `http` fetches JSON from `source_url` or `feed`; `influxdb_table` queries an existing table in the trigger database                                                                                 |
| `source_url`       | string  | none           | Custom source URL (`http` or `https` only). When provided, overrides `feed` and uses `source_format` parsing                                                                                                          |
| `source_format`    | string  | usgs_geojson   | Source parser for HTTP mode: `usgs_geojson` or `flat_json` (for records like `{id, latitude, longitude, mag, time, ...}`)                                                                                             |
| `source_table`     | string  | quake          | Source table name when `source_type=influxdb_table`                                                                                                                                                                   |
| `source_query`     | string  | none           | Optional SQL override for `influxdb_table` mode; disables watermark paging and the source-table existence check. A query containing commas must come from a TOML file — see [TOML configuration](#toml-configuration) |
| `lookback_minutes` | integer | 15             | Initial lookback window for `influxdb_table` mode. Later runs page forward from the cached fetch watermark while `skip_unchanged=true`                                                                                |

### Optional parameters

| Parameter             | Type    | Default                         | Description                                                                                                                                                  |
|-----------------------|---------|---------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `measurement`         | string  | earthquakes                     | Destination measurement name                                                                                                                                 |
| `write_quake_schema`  | boolean | false                           | Write events using the canonical `quake` table's column names; no tags or normalized-only columns are written. Use with `measurement=quake`                  |
| `min_magnitude`       | float   | none                            | Optional minimum magnitude. When omitted, nothing is filtered (USGS feeds include negative-magnitude microseisms and events without a magnitude)             |
| `max_events`          | integer | 250                             | Maximum events written per run, applied after filtering. Events deferred by the cap remain uncached and are written on a later run                            |
| `use_event_timestamp` | boolean | true                            | Use the event time as the point timestamp; `false` uses the trigger execution time. Ignored (forced `true`) when `write_quake_schema=true`                   |
| `skip_unchanged`      | boolean | true                            | Skip events whose update marker is not newer than the last written copy of the same event. Events without an id are always written                            |
| `user_agent`          | string  | InfluxDB3-Earthquake-Plugin/1.0 | Custom User-Agent header for API requests                                                                                                                    |
| `enable_full_logging` | boolean | false                           | When `true`, full exception messages are logged. When `false` (default), only exception types are logged                                                     |
| `config_file_path`    | string  | none                            | Path to a TOML configuration file, relative to the plugin directory. See [TOML configuration](#toml-configuration)                                            |

### TOML configuration

Trigger arguments are a comma-separated `key=value` list, so a value that itself contains a comma — most notably `source_query` — cannot be passed inline. Put those parameters in a TOML file instead and point `config_file_path` at it. The path is resolved relative to the plugin directory (`PLUGIN_DIR`, `INFLUXDB3_PLUGIN_DIR`, or the processing-engine virtualenv).

Values in the file override the inline trigger arguments. A file that is missing, malformed, or fails validation is reported in the logs and skipped, and the run continues with the inline arguments; a path that does not end in `.toml` is rejected the same way.

`earthquake_sampler_config_scheduler.toml` ships alongside the plugin with every
parameter documented and commented out. Copy it into your plugin directory and
uncomment what you need:

```toml
measurement = "earthquakes"
feed = "all_day"
min_magnitude = 2.5
max_events = 500
skip_unchanged = true

# A query containing commas is only expressible here, not in --trigger-arguments.
# Use a single-quoted TOML string when column names need double quotes.
source_type = "influxdb_table"
source_table = "quake"
source_query = 'SELECT time, id, mag, depth, "magType", net, updated FROM quake ORDER BY time DESC LIMIT 500'
```
```bash
influxdb3 create trigger \
  --database quakes \
  --path "gh:influxdata/earthquake_sampler/earthquake_sampler.py" \
  --trigger-spec "every:5m" \
  --trigger-arguments "config_file_path=earthquake_sampler_config_scheduler.toml" \
  earthquakes_from_toml
```
Types are native in TOML: `min_magnitude = 2.5` and `skip_unchanged = true` need no quoting, unlike the string values that inline arguments always deliver.

## Schema requirements

`write_quake_schema=true` targets an existing `quake` table with the USGS CSV column layout (`depth`, `dmin`, `gap`, `id`, `latitude`, `longitude`, `mag`, `magType`, `net`, `nst`, `place`, `rms`, `status`, `time`, `type`, and the CSV-only columns below).

- All numeric columns (including `nst` and `magNst`) are written as float64. This matches quake tables created by CSV import, where numeric columns containing blanks are inferred as doubles. If your existing table stores these columns as int64, the writes are rejected with a type conflict.
- `depthError`, `horizontalError`, `magError`, `magNst`, `locationSource`, and `magSource` exist only in USGS CSV feeds, not GeoJSON, so they are written only when a `flat_json` or `influxdb_table` source supplies them.
- Quake-schema rows carry no tags, so point identity rests entirely on the timestamp. USGS supplies millisecond-precision times; the plugin fills the unused sub-millisecond bits with a stable per-event offset so two earthquakes in the same millisecond do not overwrite each other. Millisecond-level time is unchanged.

## Software requirements

- **{{% product-name %}}**: 3.8.2 or later (the plugin writes with `write_sync`), with the Processing Engine enabled
- **Python packages**: `influxdata-plugin-utils>=0.3.0`
- **Network access**: Outbound HTTPS access to `earthquake.usgs.gov` (HTTP mode)

### Installation steps

1. Start {{% product-name %}} with the Processing Engine enabled (`--plugin-dir /path/to/plugins`):

   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```
2. Install the required Python package:

   ```bash
   influxdb3 install package influxdata-plugin-utils
   ```
## Trigger setup

### Scheduled trigger

Create a trigger that ingests the USGS `all_hour` feed every two minutes:

```bash
influxdb3 create trigger \
  --database quakes \
  --path "gh:influxdata/earthquake_sampler/earthquake_sampler.py" \
  --trigger-spec "every:2m" \
  earthquake_sampler_trigger

# Enable the trigger
influxdb3 enable trigger --database quakes earthquake_sampler_trigger
```
## Example usage

### Example 1: Normalized earthquake ingestion

Ingest the daily feed into the normalized `earthquakes` measurement:

```bash
# Create the trigger
influxdb3 create trigger \
  --database quakes \
  --path "gh:influxdata/earthquake_sampler/earthquake_sampler.py" \
  --trigger-spec "every:5m" \
  --trigger-arguments "feed=all_day" \
  earthquakes_all_day

# Enable the trigger
influxdb3 enable trigger --database quakes earthquakes_all_day

# Query events (after a few minutes)
influxdb3 query \
  --database quakes \
  "SELECT event_id, magnitude, place, latitude, longitude, depth_km, time FROM earthquakes ORDER BY time DESC LIMIT 5"
```
### Expected output

 event_id   | magnitude | place                        | latitude | longitude | depth_km | time
 -----------|-----------|------------------------------|----------|-----------|----------|-----
 us7000abcd | 4.6       | 100 km SSW of Sand Point, AK | 54.5     | -161.2    | 32.4     | 2026-08-21T17:58:12.421Z
 ak0261abcd | 1.4       | 12 km NNE of Palmer, AK      | 61.7     | -148.9    | 27.9     | 2026-08-21T17:55:03.118Z
 nc75abcdef | 0.9       | 8 km WNW of Cobb, CA         | 38.8     | -122.8    | 1.6      | 2026-08-21T17:51:47.902Z

### Example 2: Write directly into an existing quake table

Write USGS events into an existing `quake` table using its original column names (see [Schema requirements](#schema-requirements)):

```bash
influxdb3 create trigger \
  --database usgs \
  --path "gh:influxdata/earthquake_sampler/earthquake_sampler.py" \
  --trigger-spec "every:2m" \
  --trigger-arguments "feed=all_hour,measurement=quake,write_quake_schema=true" \
  usgs_to_quake
```
### Example 3: Transform rows from an existing table

Read rows from an existing `quake` table and write them as normalized events. The plugin pages forward from a cached fetch watermark, so each run picks up where the previous one stopped:

```bash
influxdb3 create trigger \
  --database usgs \
  --path "gh:influxdata/earthquake_sampler/earthquake_sampler.py" \
  --trigger-spec "every:1m" \
  --trigger-arguments "source_type=influxdb_table,source_table=quake,measurement=earthquakes,lookback_minutes=60" \
  quake_to_earthquakes
```
### Example 4: Magnitude filtering

Only ingest events at or above magnitude 2.5:

```bash
influxdb3 create trigger \
  --database quakes \
  --path "gh:influxdata/earthquake_sampler/earthquake_sampler.py" \
  --trigger-spec "every:5m" \
  --trigger-arguments "feed=all_day,min_magnitude=2.5" \
  earthquakes_m25
```
## Code overview

### Files

- `earthquake_sampler.py`: The main plugin code containing the scheduled handler for earthquake ingestion
- `requirements.txt`: Python dependencies (`influxdata-plugin-utils`, used for configuration loading, validation, and writes)
- `earthquake_sampler_config_scheduler.toml`: Example TOML configuration with every parameter documented

### Logging

Logs are stored in the trigger's database in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database YOUR_DATABASE "SELECT event_time, log_level, log_text FROM system.processing_engine_logs WHERE trigger_name = 'earthquake_sampler_trigger' ORDER BY event_time DESC LIMIT 20"
```
Log lines are prefixed with a per-run task id. Logged source names strip URL credentials/query strings and truncate custom SQL.

### Main functions

#### `process_scheduled_call(influxdb3_local, call_time, args)`

Handles a scheduled run end to end: validates configuration (aborting with an error on invalid values), fetches events from the configured source, normalizes and filters them, deduplicates against the per-event marker cache, and writes points with `write_sync` so write errors surface during the run.

#### `_fetch_payload(url, user_agent)` / `_fetch_table_rows(...)`

HTTP fetching (scheme-validated, `http`/`https` only) and table reading. Table reads page oldest-first from the cached fetch watermark (`WHERE time > watermark ORDER BY time ASC LIMIT max_events`), falling back to the `lookback_minutes` window on the first run.

#### `_normalize_usgs_feature(feature)` / `_normalize_flat_event(item)`

Normalize a USGS GeoJSON feature or a flat JSON/table record into the common internal event shape. Timestamps of unknown shape (ISO strings, epoch seconds/ms/us/ns) are coerced by magnitude.

#### `_write_event(...)` / `_write_quake_event(...)`

Build and write a point in the normalized schema (tags: `event_type`, `status`, `alert`, `net`, `mag_type`; `event_id` is a string field to avoid unbounded series cardinality) or in the canonical quake schema (no tags). Fields the source does not supply are left out of the point rather than written as empty values, and an event with no usable field at all is skipped and logged. Millisecond-aligned timestamps get a stable per-event sub-millisecond offset so same-millisecond events stay distinct.

## Troubleshooting

### Common issues

#### Issue: No data appearing

**Solution**: Check trigger status, review plugin logs, and verify network connectivity:

```bash
# Check trigger status
influxdb3 show summary --database quakes --token YOUR_TOKEN

# Check plugin logs
influxdb3 query --database quakes "SELECT event_time, log_level, log_text FROM system.processing_engine_logs WHERE log_text LIKE '%Earthquake%' ORDER BY event_time DESC LIMIT 10"

# Verify the feed is reachable
curl -H "User-Agent: test" https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson
```
#### Issue: `Invalid configuration` error in logs

**Solution**: A trigger argument has an invalid value (unknown `feed` key, non-numeric `min_magnitude`, unrecognized boolean, `max_events` below 1, and so on). The message quotes the offending value; the run aborts rather than proceeding with a silent fallback. Booleans accept `true/false`, `yes/no`, `on/off`, and `1/0`.

#### Issue: `Source table ... not found in the trigger database`

**Solution**: `source_type=influxdb_table` checks that `source_table` exists before querying it. Verify the name with `influxdb3 query --database YOUR_DATABASE "SHOW TABLES"`, or supply an explicit `source_query`, which bypasses the check.

#### Issue: Log summary shows `written=0` with a nonzero `skipped` count

**Solution**: This is normal steady-state behavior: `skip_unchanged=true` skips events already written at their current update marker. New and updated events are still written. Set `skip_unchanged=false` to re-write everything the source returns.

#### Issue: Field type conflict when writing with `write_quake_schema=true`

**Solution**: The plugin writes all numeric quake columns as float64 (see [Schema requirements](#schema-requirements)). If your existing table stores `nst` or `magNst` as int64, rename the destination via `measurement` or recreate the table with float64 columns.

#### Issue: Table mode does not re-read older rows

**Solution**: With `skip_unchanged=true`, table reads page forward from the cached fetch watermark and do not revisit rows behind it. Set `skip_unchanged=false` to re-read the full `lookback_minutes` window, or provide an explicit `source_query`.

### Debugging tips

1. **Check trigger status**:
   ```bash
   influxdb3 show summary --database quakes --token YOUR_TOKEN
   ```
2. **Enable/Disable trigger**:
   ```bash
   influxdb3 disable trigger earthquake_sampler_trigger --database quakes --token YOUR_TOKEN
   influxdb3 enable trigger earthquake_sampler_trigger --database quakes --token YOUR_TOKEN
   ```
3. **Enable full exception logging temporarily**: add `enable_full_logging=true` to the trigger arguments.

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
