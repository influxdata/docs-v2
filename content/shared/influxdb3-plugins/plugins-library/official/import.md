<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
> **Note:** This plugin requires {{% product-name %}}.8.2 or later.


The InfluxDB Import Plugin enables seamless data import from InfluxDB v1, v2, or v3 instances to {{% product-name %}}. It provides comprehensive import capabilities with pause/resume functionality, progress tracking, conflict detection, and robust error handling. The plugin operates via HTTP endpoints, allowing you to start, pause, resume, cancel, and monitor imports through simple HTTP requests.

Key features:
- Import data from InfluxDB v1, v2, or v3 to {{% product-name %}}
- Automatic data sampling for optimal batch sizing
- Resume interrupted imports from the last checkpoint
- Pause and cancel running imports
- Crash recovery with stale import detection
- Progress tracking and statistics
- Tag/field conflict detection and resolution
- Data type mismatch handling
- Configurable time ranges and table filtering
- Dry run mode for import planning (estimates, schema conflicts, configuration preview)
- Support for both token and username/password authentication

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI), in the `trigger_arguments` field (API) when creating a trigger or via body of HTTP request. This plugin supports TOML configuration files, which can be specified using the `config_file_path` parameter.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Required parameters

| Parameter           | Type    | Default  | Description                                                        |
|---------------------|---------|----------|--------------------------------------------------------------------|
| `source_url`        | string  | required | Source InfluxDB URL (with optional port, for example, `http://localhost:8086`) |
| `influxdb_version`  | integer | required | Source InfluxDB version: 1, 2, or 3                                |
| `source_database`   | string  | required | Source database name to import from                               |

### Authentication

Credentials are passed via HTTP headers on each request.

| Header | Purpose |
|--------|---------|
| `Source-Token` | Bearer/API token authentication (InfluxDB v1/v2/v3) |
| `Source-Username` | Basic auth username (InfluxDB v1) |
| `Source-Password` | Basic auth password (InfluxDB v1) |

**Method 1: Token-based authentication**

Use the `Source-Token` header for token-based authentication:

```bash
curl -X POST http://localhost:8181/api/v3/engine/import?action=start \
  -H "Content-Type: application/json" \
  -H "Source-Token: my-secret-token" \
  -d '{
    "source_url": "http://localhost:8086",
    "influxdb_version": 2,
    "source_database": "telegraf"
  }'
```
**Method 2: Username/Password authentication**

Use the `Source-Username` and `Source-Password` headers for basic authentication:

```bash
curl -X POST http://localhost:8181/api/v3/engine/import?action=start \
  -H "Content-Type: application/json" \
  -H "Source-Username: admin" \
  -H "Source-Password: my-password" \
  -d '{
    "source_url": "http://localhost:8086",
    "influxdb_version": 1,
    "source_database": "telegraf"
  }'
```
> **Note**: Authentication errors from the source InfluxDB are returned directly. The plugin does not validate credentials upfront.

### Optional parameters

| Parameter            | Type    | Default        | Description                                                                                                   |
|----------------------|---------|----------------|---------------------------------------------------------------------------------------------------------------|
| `dest_database`      | string  | none           | Destination database name in {{% product-name %}} (if not specified, uses database where trigger was created)           |
| `start_timestamp`    | string  | none           | Import start time (datetime format). If not specified, starts from oldest data                                |
| `end_timestamp`      | string  | none           | Import end time (datetime format). If not specified, imports to newest data                                   |
| `query_interval_ms`  | integer | 100            | Delay between queries in milliseconds to avoid overloading source database                                    |
| `import_direction`  | string  | "oldest_first" | Import direction: "oldest_first" or "newest_first"                                                            |
| `target_batch_size`  | integer | 2000           | Target number of rows per query batch                                                                         |
| `table_filter`       | string  | none           | Dot-separated list of tables to import (for example, "cpu.mem.disk"). If not specified, imports all tables           |
| `dry_run`            | boolean | false          | If true, generates import plan without processing data (shows estimates, schema conflicts, and configuration) |

### TOML configuration

| Parameter          | Type   | Default | Description                                                                      |
|--------------------|--------|---------|----------------------------------------------------------------------------------|
| `config_file_path` | string | none    | TOML config file path relative to `PLUGIN_DIR` (required for TOML configuration) |

*To use a TOML configuration file, set the `PLUGIN_DIR` environment variable and specify the `config_file_path` in the trigger arguments.* This is in addition to the `--plugin-dir` flag when starting {{% product-name %}}.

#### Example TOML configuration

[import_config.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/import/import_config.toml)

For more information on using TOML configuration files, see the Using TOML Configuration Files section in the [influxdb3_plugins/README.md](https://github.com/influxdata/influxdb3_plugins/blob/master/README.md).

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled.
- **Source InfluxDB instance**: InfluxDB v1.x or v2.x instance accessible via HTTP/HTTPS.
- **Python packages**:
  - `requests` (for HTTP communication with source InfluxDB)

### Installation steps

1. Start {{% product-name %}} with the Processing Engine and `PLUGIN_DIR` environment variable:

   ```bash
   PLUGIN_DIR=~/.plugins influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```
2. Install required Python packages:

   ```bash
   influxdb3 install package requests
   ```
## Trigger setup

### HTTP trigger setup

Create an HTTP trigger to handle import requests:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/import/import.py \
  --trigger-spec "request:import" \
  import_trigger
```
Enable the trigger:

```bash
influxdb3 enable trigger --database mydb import_trigger
```
The endpoint is registered at `/api/v3/engine/import`.

## HTTP Endpoint

The import plugin provides the following type of requests:

### Start Import

Start a new import from source InfluxDB to {{% product-name %}}.

**Request**: `POST /api/v3/engine/import?action=start`

**Headers**:
- `Source-Token: my-token` (or `Source-Username` + `Source-Password`)
- `Content-Type: application/json`

**Request body** (JSON):
```json
{
  "source_url": "http://localhost:8086",
  "influxdb_version": 1,
  "source_database": "telegraf",
  "dest_database": "imported_data",
  "start_timestamp": "2024-01-01T00:00:00Z",
  "end_timestamp": "2024-12-31T23:59:59Z",
  "table_filter": "cpu.mem.disk"
}
```
### Get Import Status

Check the status and progress of a import.

**Request**: `GET /api/v3/engine/import?action=status&import_id=<import_id>`


### Pause Import

Pause a running import to resume later.

**Request**: `POST /api/v3/engine/import?action=pause&import_id=<import_id>`

> **Note**: Returns error if import is not found, already paused, already cancelled, or already completed.

### Resume Import

Resume a paused or interrupted import.

**Request**: `POST /api/v3/engine/import?action=resume&import_id=<import_id>`

**Headers**:
- `Source-Token: my-token` (or `Source-Username` + `Source-Password`)

> **Note**: Credentials must be provided via headers when resuming. Authentication credentials are not stored for security reasons and must be provided when resuming. Returns error if import is not found, already cancelled, already completed, or actively running.

#### Crash recovery

If the plugin or the server crashes during an import, the import state may be left as "running" even though nothing is actually running. The resume action handles this with **stale import detection**:

- When the import state is "running", the plugin checks the timestamp of the last `import_state` record.
- If the last update is older than **5 minutes**, the import is considered stale (crashed) and resume is allowed.
- If no `import_state` records exist at all (the import crashed before processing any tables), the import is restarted from the beginning.

If the plugin itself crashes (for example, source database becomes unavailable), it writes a paused state before exiting, so the import can be resumed with a regular resume call after fixing the issue.

### Cancel Import

Cancel a running import. Cancelled imports cannot be resumed.

**Request**: `POST /api/v3/engine/import?action=cancel&import_id=<import_id>`

> **Note**: Returns error if import is not found, already cancelled, or already completed.

### Test Connection

Test connectivity to a URL and identify if it's an InfluxDB instance. Uses a 5-second timeout for fast feedback.

**Request**: `POST /api/v3/engine/import?action=test_connection`

**Request body** (JSON):
```json
{
  "source_url": "http://localhost:8086"
}
```
> **Note**: If port is omitted, it is inferred from the scheme (`http` → 80, `https` → 443).

**Success response** (InfluxDB v1/v2 detected):
```json
{
  "success": true,
  "version": "2.7.0",
  "build": "OSS"
}
```
**Success response** (InfluxDB v3 detected via `cluster-uuid` header):
```json
{
  "success": true,
  "version": "3.x.x",
  "build": ""
}
```
> **Note**: InfluxDB v3 does not expose version headers without authentication. Detection uses the `cluster-uuid` header instead.

**Failure response** (not InfluxDB or unreachable):
```json
{
  "success": false,
  "message": "Not an InfluxDB instance"
}
```
**Failure response** (InfluxDB requires authentication, version unknown):
```json
{
  "success": false,
  "message": "Unable to determine InfluxDB version"
}
```
> **Note**: When InfluxDB returns 401/403 without version headers, the connection test cannot determine the version. This typically means authentication is required. The instance is likely InfluxDB, but version detection requires valid credentials.

### List Databases

Get list of databases from source InfluxDB instance.

**Request**: `POST /api/v3/engine/import?action=databases`

**Headers**:
- `Source-Token: my-token` (or `Source-Username` + `Source-Password`)
- `Content-Type: application/json`

**Request body** (JSON):
```json
{
  "source_url": "http://localhost:8086",
  "influxdb_version": 1
}
```
### List Tables

Get list of tables/measurements from a source database.

**Request**: `POST /api/v3/engine/import?action=tables`

**Headers**:
- `Source-Token: my-token` (or `Source-Username` + `Source-Password`)
- `Content-Type: application/json`

**Request body** (JSON):
```json
{
  "source_url": "http://localhost:8086",
  "influxdb_version": 1,
  "source_database": "telegraf"
}
```
> **Note**: For InfluxDB v2, include `source_org` in the request body.

## Example usage

### Example 1: Basic import with token authentication

Import all data from an InfluxDB v1 instance:

```bash
# Create and enable HTTP trigger
influxdb3 create trigger \
  --database mydb \
  --plugin-filename import.py \
  --trigger-spec "request:import" \
  import_trigger

influxdb3 enable trigger --database mydb import_trigger

# Start import via HTTP
curl -X POST http://localhost:8181/api/v3/engine/import?action=start \
  -H "Source-Token: my-super-secret-token" \
  -H "Content-Type: application/json" \
  -d '{
    "source_url": "http://localhost:8086",
    "influxdb_version": 1,
    "source_database": "telegraf",
    "dest_database": "imported_data"
  }'
```
### Expected results

- Plugin connects to source InfluxDB at `http://localhost:8086` (port from URL)
- Discovers all measurements in the `telegraf` database
- Estimates import time based on data sampling
- Imports all data to {{% product-name %}} in the `imported_data` database
- Logs import_id for tracking statistics

### Example 2: Time-range import with table filtering

Import specific tables within a date range:

```bash
# Start import with time range and table filter
curl -X POST http://localhost:8181/api/v3/engine/import?action=start \
  -H "Source-Username: admin" \
  -H "Source-Password: my-password" \
  -H "Content-Type: application/json" \
  -d '{
    "source_url": "http://influxdb-source.example.com:8086",
    "influxdb_version": 1,
    "source_database": "telegraf",
    "dest_database": "production_metrics",
    "start_timestamp": "2024-01-01T00:00:00Z",
    "end_timestamp": "2024-12-31T23:59:59Z",
    "table_filter": "cpu.mem.disk.network",
    "import_direction": "newest_first",
    "target_batch_size": 5000
  }'
```
### Expected results

- Imports only `cpu`, `mem`, `disk`, and `network` measurements
- Processes data from January 1, 2024 to December 31, 2024
- Imports newest data first
- Uses larger batch size (5000 rows) for better performance

### Example 3: Pause, check status, and resume import

Monitor and control a long-running import:

```bash
# Start import (logs import_id, does not return it immediately)
curl -X POST http://localhost:8181/api/v3/engine/import?action=start \
  -H "Source-Token: my-token" \
  -H "Content-Type: application/json" \
  -d '{
    "source_url": "http://localhost:8086",
    "influxdb_version": 2,
    "source_database": "large_database",
    "dest_database": "imported"
  }'

# Find import_id from logs:
influxdb3 query --database _internal "SELECT log_text FROM system.processing_engine_logs WHERE trigger_name = 'import_trigger' AND log_text LIKE '%Starting import%' ORDER BY event_time DESC LIMIT 1"

# Set the import_id from logs
IMPORT_ID="<import_id_from_logs>"

# Pause import (for example, during high-traffic hours)
curl -X POST "http://localhost:8181/api/v3/engine/import?action=pause&import_id=$IMPORT_ID"

# Check status after import completion (paused, cancelled, or completed)
curl "http://localhost:8181/api/v3/engine/import?action=status&import_id=$IMPORT_ID"

# Resume later
curl -X POST "http://localhost:8181/api/v3/engine/import?action=resume&import_id=$IMPORT_ID" \
  -H "Source-Token: my-token"
```
### Expected results

- Import starts and logs a unique import_id (check logs to obtain it)
- Import continues running in the background, logging progress
- Pause command stops import gracefully at current position
- Status endpoint returns comprehensive statistics **only after import completion** (paused, cancelled, or finished)
- Resume command continues from the exact point where it was paused and returns final results upon completion

### Example 4: Dry run for import plan

```bash
curl -X POST http://localhost:8181/api/v3/engine/import?action=start \
  -H "Source-Token: my-token" \
  -H "Content-Type: application/json" \
  -d '{
    "source_url": "http://localhost:8086",
    "influxdb_version": 1,
    "source_database": "telegraf",
    "dry_run": true
  }'
```
### Expected results

With `dry_run: true`, the plugin generates a comprehensive import plan **without processing any data**. It only performs:
- Schema inspection (tags and fields)
- Data sampling for time estimation
- Conflict detection

The response returns immediately with a detailed import plan:

```json {lint="false"}
{
  "import_id": "abc123...",
  "status": "dry_run_plan",
  "source": {
    "url": "http://localhost:8086",
    "database": "telegraf",
    "influxdb_version": 1
  },
  "destination": {
    "database": "imported_data"
  },
  "time_range": {
    "start": "all data",
    "end": "all data"
  },
  "import_settings": {
    "direction": "oldest_first",
    "target_batch_size": 2000,
    "query_interval_ms": 100
  },
  "tables": {
    "total": 5,
    "list": ["cpu", "mem", "disk", "network", "processes"],
    "filtered": "all tables"
  },
  "estimated_import": {
    "total_rows": 5000000,
    "estimated_duration": "1 hour 15 minutes",
    "estimated_duration_seconds": 4500,
    "per_table_estimates": [
      {
        "measurement": "cpu",
        "estimated_rows": 1000000,
        "estimated_seconds": 900
      },
      {
        "measurement": "mem",
        "estimated_rows": 800000,
        "estimated_seconds": 720
      }
    ]
  },
  "schema_conflicts": {
    "total": 2,
    "details": [
      {
        "measurement": "cpu",
        "type": "tag_field_conflict",
        "conflicts": ["host", "region"],
        "resolution": "Tags will be renamed with '_tag' suffix: host -> host_tag, region -> region_tag"
      }
    ]
  }
}
```
**Note**: Dry run mode is fast and lightweight - it does not query or process any actual data points, only metadata. Use it to:
- Preview import scope and estimates
- Identify schema conflicts before import
- Validate configuration and connectivity
- Plan import time windows

## Using TOML Configuration Files

This plugin supports using TOML configuration files to specify all plugin arguments.

### Important Requirements

**To use TOML configuration files, you must set the `PLUGIN_DIR` environment variable in the {{% product-name %}} host environment.**

### Setting Up TOML Configuration

1. **Start {{% product-name %}} with the PLUGIN_DIR environment variable set**:

   ```bash
   PLUGIN_DIR=~/.plugins influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```
2. **Copy the example TOML configuration file to your plugin directory**:

   ```bash
   cp import_config.toml ~/.plugins/
   ```
3. **Edit the TOML file** to match your requirements:

   ```toml
   # Required parameters
   source_url = "http://localhost:8086"
   influxdb_version = 1
   source_database = "telegraf"

   # Optional parameters
   dest_database = "imported_data"
   start_timestamp = "2024-01-01T00:00:00Z"
   end_timestamp = "2024-12-31T23:59:59Z"
   table_filter = "cpu.mem.disk"
   ```
> **Note**: Credentials are NOT stored in TOML files. Provide them via HTTP headers on each request.

4. **Create a trigger using the `config_file_path` argument**:

   ```bash
   influxdb3 create trigger \
     --database mydb \
     --plugin-filename import.py \
     --trigger-spec "request:import" \
     --trigger-arguments config_file_path=import_config.toml \
     import_trigger
   ```
5. **Start import via HTTP** (config from TOML file will be used as defaults, can be overridden in request body):

   ```bash
   curl -X POST http://localhost:8181/api/v3/engine/import?action=start
   ```
## Configuration Priority and Loading

The import plugin loads configuration from multiple sources with the following priority order (highest to lowest):

1. **HTTP Request Body** (highest priority) - JSON parameters in POST request body
2. **TOML Configuration File** - Parameters from file specified in `config_file_path`
3. **Trigger Arguments** - Parameters from `--trigger-arguments` when creating trigger
4. **Environment Variables** (lowest priority) - System environment variables

### Configuration Loading Process

When a import starts, the plugin loads configuration in this order:

```python
# 1. Start with environment variables (lowest priority)
IMPORT_SOURCE_URL, IMPORT_SOURCE_DATABASE, etc.

# 2. Override with trigger arguments (--trigger-arguments)
config_file_path=import_config.toml, source_url=http://localhost:8086, etc.

# 3. Override with TOML file contents (if config_file_path specified)
[from import_config.toml file]

# 4. Override with HTTP request body (highest priority)
{
  "source_url": "http://localhost:8086",
  ...
}
```
### Environment Variables Supported

The following environment variables can be used:

- `IMPORT_SOURCE_URL` → `source_url`
- `IMPORT_SOURCE_DATABASE` → `source_database`
- `IMPORT_DEST_DATABASE` → `dest_database`
- `IMPORT_START_TIMESTAMP` → `start_timestamp`
- `IMPORT_END_TIMESTAMP` → `end_timestamp`

## Data Type Mismatch Handling

The plugin automatically handles data type mismatches that can occur in older InfluxDB versions where different nodes might have different field types for the same field name.

### How It Works

1. **Schema Detection**: At import start, plugin queries source database for field types using `SHOW FIELD KEYS`
2. **Runtime Type Checking**: For each data point, plugin checks if the actual value type matches the expected field type
3. **Automatic Field Creation**: If type mismatch is detected, plugin creates a new field with a type suffix

### Supported Type Suffixes

When type mismatches occur, the plugin appends these suffixes:

- `_string` - for string values
- `_integer` - for integer values
- `_float` - for float values
- `_boolean` - for boolean values

## Code overview

### Files

- `import.py`: The main plugin code containing HTTP request handler and import logic
- `import_config.toml`: Example TOML configuration file

### Logging

Logs are stored in the `_internal` database in the `system.processing_engine_logs` table:

```bash
influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'import_trigger'"
```
Log columns:

- **event_time**: Timestamp of the log event
- **trigger_name**: Name of the trigger that generated the log
- **log_level**: Severity level (INFO, WARN, ERROR)
- **log_text**: Message describing the action or error

### Import state tracking

The plugin creates several measurements to track import state:

#### `import_config`
Stores import configuration (credentials excluded for security).

```bash
influxdb3 query --database mydb "SELECT * FROM import_config WHERE import_id = 'your-import-id'"
```
#### `import_state`
Tracks per-table import progress.

```bash
influxdb3 query --database mydb "SELECT * FROM import_state WHERE import_id = 'your-import-id' ORDER BY time DESC"
```
#### `import_pause_state`
Stores pause/cancel/completed state for controlling running imports.

```bash
influxdb3 query --database mydb "SELECT * FROM import_pause_state WHERE import_id = 'your-import-id' ORDER BY time DESC LIMIT 1"
```
### Main functions

#### `process_request(influxdb3_local, query_parameters, request_headers, request_body, args)`

HTTP request handler that routes to appropriate import actions based on the `action` query parameter. Extracts credentials from `request_headers` using `extract_credentials()` and passes them to action handlers.

#### `extract_credentials(request_headers)`

Extracts authentication credentials from HTTP headers. Returns a dict with keys `source_token`, `source_username`, `source_password` (values are `None` if header not present).

#### `start_import(influxdb3_local, config, credentials, task_id)`

Starts a new import process:
1. Performs pre-flight checks (connectivity, measurements discovery)
2. Estimates import time based on data sampling
3. Creates import configuration and state records
4. Initiates table-by-table import
5. On any unhandled error, writes paused state so the import can be resumed after fixing the issue

#### `import_table(influxdb3_local, config, credentials, import_id, measurement, start_time, end_time, task_id, ...)`

Imports a single table:
1. Finds actual data boundaries within specified range
2. Samples data to determine optimal batch window size
3. Detects and resolves tag/field conflicts
4. Queries data in batches and converts to line protocol
5. Writes to destination database
6. Tracks progress and checks for pause/cancel signals

#### `resume_import(influxdb3_local, import_id, credentials, task_id)`

Resumes an interrupted import:
1. Detects stale imports — if the import state is "running" but the last update is older than 5 minutes, treats it as crashed and allows resume
2. If no `import_state` records exist (crashed before processing any tables), restarts from the beginning
3. Loads saved import configuration
4. Identifies incomplete tables and their last checkpoint
5. Continues import from checkpoint positions
6. On any unhandled error, writes paused state so the import can be resumed again

#### `get_import_stats(influxdb3_local, import_id, task_id)`

Returns comprehensive statistics for a import including overall status, per-table progress, timing information, and configuration.

#### `check_source_connection(body_data, session)`

Tests connectivity to a URL and identifies if it's an InfluxDB instance (5-second timeout):
1. Validates that `source_url` is provided
2. Infers port from scheme if not specified (http→80, https→443)
3. Sends request to `/ping` endpoint
4. Returns success with version/build from `X-Influxdb-*` headers (v1/v2)
5. Falls back to `cluster-uuid` header detection for v3 (returns `version: "3.x.x"`)
6. Returns failure with message if not InfluxDB or unreachable

#### `get_source_databases_list(body_data, credentials, session)`

Lists databases from source InfluxDB instance:
1. Validates required parameters
2. For v1: Executes `SHOW DATABASES` query, filters out `_internal`
3. For v2: Queries `/api/v2/buckets` API, filters out system buckets (prefixed with `_`)
4. Returns sorted list of database names

#### `get_source_tables_list(body_data, credentials, session)`

Lists tables/measurements from a source database:
1. Validates required parameters including `source_database`
2. For v1: Executes `SHOW MEASUREMENTS` query
3. For v2: Executes Flux schema.measurements() query (requires `source_org`)
4. Returns sorted list of table names

### Key algorithms

#### Automatic batch sizing

The plugin samples data at different time intervals to determine optimal window size:

```python
# Test intervals: 1 second, 1 minute, 1 hour, 1 day
# Calculate rows per second from samples
# Determine window size to achieve target_batch_size
optimal_window = target_batch_size / avg_rows_per_second
```
#### Tag/field conflict resolution

When a column name exists as both tag and field in source data:

```python
# Original data has conflict:
# tag: room
# field: room

# Plugin renames conflicting tag:
# tag: room_tag
# field: room (unchanged)
```
#### Resume checkpoint tracking

During import, the plugin saves checkpoints:

```python
# Save paused_at_time (data timestamp, not record timestamp)
# On resume:
# 1. Load last paused_at_time
# 2. Add 1 microsecond offset to avoid duplicates
# 3. Continue import from (paused_at_time + 1µs)
```
## Troubleshooting

### Common issues

#### Issue: "Failed to connect to source database" error

**Solution**:

1. Verify source InfluxDB is running and accessible:
   ```bash
   curl http://<source_url>/ping
   ```
2. Check network connectivity and firewall rules
3. Verify credentials are correct
4. For InfluxDB v2/v3, ensure you're using token authentication

#### Issue: Authentication errors from source InfluxDB

**Solution**: Pass credentials via HTTP headers:
1. For token auth: Add header `-H "Source-Token: your-token"`
2. For username/password: Add headers `-H "Source-Username: user" -H "Source-Password: pass"`
3. Verify credentials work directly against source InfluxDB
4. Check that headers are not being stripped by proxies

#### Issue: "Import is already running" after server crash

**Solution**:

1. Wait at least 5 minutes after the crash — the plugin uses a 5-minute stale import threshold
2. Call the resume endpoint with credentials:
   ```bash
   curl -X POST "http://localhost:8181/api/v3/engine/import?action=resume&import_id=$IMPORT_ID" \
     -H "Content-Type: application/json" \
     -d '{"source_token": "my-token"}'
   ```
3. The plugin detects the stale state and resumes from the last checkpoint (or restarts from the beginning if no checkpoint exists)

#### Issue: "Import already completed" when trying to resume

**Solution**:

1. Check import status:
   ```bash
   curl "http://localhost:8181/api/v3/import?action=status&import_id=<import_id>"
   ```
2. If truly incomplete, check for status discrepancies in `import_state` table
3. Start a new import if needed

#### Issue: Tag/field conflicts causing warnings

**Solution**: This is informational only. The plugin automatically renames conflicting tags with a `_tag` suffix:
- Original tag `temperature` → `temperature_tag`
- Field `temperature` remains unchanged

#### Issue: Slow import performance

**Solution**:

1. Increase `target_batch_size` (for example, from 2000 to 5000)
2. Decrease `query_interval_ms` if source can handle higher load
3. Use table filtering to import tables in parallel using multiple triggers
4. Check network latency between source and destination


### Performance considerations

- **Network bandwidth**: Main bottleneck for large imports. Use local network when possible.
- **Source database load**: The plugin includes rate limiting (`query_interval_ms`) to avoid overwhelming source.
- **Batch size optimization**: Plugin automatically samples data to determine optimal batch size, but you can override with `target_batch_size`.
- **Connection pooling**: Plugin uses HTTP session with connection pooling for better performance.
- **Retry logic**: Built-in exponential backoff (1s → 2s → 4s → 8s → 16s) for transient errors.

## Import best practices

1. **Use table filtering**: Import critical tables first, then others in batches
2. **Plan for pauses**: Pause during high-traffic hours if sharing infrastructure
3. **Verify data**: Compare row counts and sample data after import
4. **Handle conflicts**: Review log warnings about tag/field conflicts

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
