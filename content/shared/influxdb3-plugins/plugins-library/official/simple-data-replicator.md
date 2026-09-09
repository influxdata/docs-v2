<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
The Simple Data Replicator Plugin replicates data from a local {{% product-name %}} instance to a remote {{% product-name %}} instance over HTTP. It supports table and field filtering, table and field renaming, and runs either on a schedule (pulling a time window from a source measurement) or on every write (replicating committed WAL batches). Data is buffered in a compressed JSONL queue file and delivered with automatic retries, so it survives transient remote failures.

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. This plugin supports TOML configuration files, which can be specified using the `config_file_path` parameter; values in the file override the arguments passed to the trigger.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Scheduler mode parameters

Multi-value arguments (`excluded_fields`, `field_renames`) use delimited strings on the CLI and native TOML types (lists/tables) in a config file.

| Argument                 | Description                                                                              | Required | Example (CLI)      | Example (TOML)                           | Default              |
|--------------------------|------------------------------------------------------------------------------------------|----------|--------------------|------------------------------------------|----------------------|
| `host`                   | Remote InfluxDB host URL. Default scheme `http`, port `8181`.                            | `true`   | `example.com`      | `host = "example.com"`                   | `None`               |
| `remote_token`           | Remote InfluxDB API token. Falls back to `REMOTE_INFLUXDB_TOKEN` env var.                | `false`  | `apiv3_AuHk...`    | `remote_token = "apiv3_AuHk..."`         | `None`               |
| `database`               | Remote database name.                                                                    | `true`   | `remote_db`        | `database = "remote_db"`                 | `None`               |
| `source_measurement`     | Measurement to replicate.                                                                | `true`   | `home`             | `source_measurement = "home"`            | `None`               |
| `window`                 | Time window per job. Format `<number><unit>` (`s`, `min`, `h`, `d`, `w`).                | `true`   | `1h`               | `window = "1h"`                          | `None`               |
| `unique_file_suffix`     | Unique suffix for the queue file to avoid conflicts.                                     | `true`   | `abcd1234`         | `unique_file_suffix = "abcd1234"`        | `None`               |
| `max_size`               | Maximum size for the queue file in MB. Integer ≥ 1.                                      | `false`  | `1024`             | `max_size = 1024`                        | `512`                |
| `verify_ssl`             | Whether to verify SSL certificates when connecting via HTTPS.                            | `false`  | `false`            | `verify_ssl = false`                     | `true`               |
| `max_retries`            | Maximum number of retries for write operations. Integer ≥ 1.                             | `false`  | `5`                | `max_retries = 5`                        | `3`                  |
| `queue_flush_chunk_size` | Line-protocol entries sent per remote flush request. Integer ≥ 1.                        | `false`  | `1000`             | `queue_flush_chunk_size = 1000`          | `500`                |
| `excluded_fields`        | Fields and tags to exclude. CLI: space-separated. TOML: list.                            | `false`  | `co location`      | `excluded_fields = ["co", "location"]`   | `None`               |
| `target_table`           | New name for the measurement in the remote database.                                     | `false`  | `home2`            | `target_table = "home2"`                 | `source_measurement` |
| `field_renames`          | Field renames. CLI: `old:new` pairs separated by space. TOML: table.                     | `false`  | `temp:temperature` | `field_renames = {temp = "temperature"}` | `None`               |
| `offset`                 | Time offset to apply to the window. Format `<number><unit>` (`s`, `min`, `h`, `d`, `w`). | `false`  | `10min`            | `offset = "10min"`                       | `0`                  |
| `config_file_path`       | Path to the TOML config file. Absolute, or relative to `PLUGIN_DIR`.                     | `false`  | `config.toml`      | —                                        | `None`               |

### Data write mode parameters

Multi-value arguments (`tables`, `excluded_fields`, `tables_rename`, `field_renames`) use delimited strings on the CLI and native TOML types (lists/tables) in a config file.

| Argument                 | Description                                                                                            | Required | Example (CLI)                         | Example (TOML)                                                         | Default |
|--------------------------|--------------------------------------------------------------------------------------------------------|----------|---------------------------------------|------------------------------------------------------------------------|---------|
| `host`                   | Remote InfluxDB host URL. Default scheme `http`, port `8181`.                                          | `true`   | `example.com`                         | `host = "example.com"`                                                 | `None`  |
| `remote_token`           | Remote InfluxDB API token. Falls back to `REMOTE_INFLUXDB_TOKEN` env var.                              | `false`  | `apiv3_AuHk...`                       | `remote_token = "apiv3_AuHk..."`                                       | `None`  |
| `database`               | Remote database name.                                                                                  | `true`   | `remote_db`                           | `database = "remote_db"`                                               | `None`  |
| `unique_file_suffix`     | Unique suffix for the queue file to avoid conflicts.                                                   | `true`   | `wxyz5678`                            | `unique_file_suffix = "wxyz5678"`                                      | `None`  |
| `tables`                 | Tables to replicate; all tables if omitted. CLI: space-separated. TOML: list.                          | `false`  | `home home2`                          | `tables = ["home", "home2"]`                                           | `None`  |
| `verify_ssl`             | Whether to verify SSL certificates when connecting via HTTPS.                                          | `false`  | `false`                               | `verify_ssl = false`                                                   | `true`  |
| `max_size`               | Maximum size for the queue file in MB. Integer ≥ 1.                                                    | `false`  | `1024`                                | `max_size = 1024`                                                      | `512`   |
| `queue_flush_chunk_size` | Line-protocol entries sent per remote flush request. Integer ≥ 1.                                      | `false`  | `1000`                                | `queue_flush_chunk_size = 1000`                                        | `500`   |
| `excluded_fields`        | Fields/tags to exclude per table. CLI: `table:f1\|f2` blocks separated by space. TOML: table of lists. | `false`  | `home:co\|location home2:temp`        | `excluded_fields = {home = ["co", "location"], home2 = ["temp"]}`      | `None`  |
| `tables_rename`          | Table renames. CLI: `old:new` pairs separated by space. TOML: table.                                   | `false`  | `home:home2 office:office2`           | `tables_rename = {home = "home2", office = "office2"}`                 | `None`  |
| `field_renames`          | Field renames per table. CLI: `table:old=new\|old=new` blocks separated by space. TOML: nested table.  | `false`  | `home:temp=temperature\|hum=humidity` | `[field_renames]`<br>`home = {temp = "temperature", hum = "humidity"}` | `None`  |
| `config_file_path`       | Path to the TOML config file. Absolute, or relative to `PLUGIN_DIR`.                                   | `false`  | `config.toml`                         | —                                                                      | `None`  |

### Authentication

The remote API token is read from the `remote_token` argument first; if it is not set, the plugin falls back to the `REMOTE_INFLUXDB_TOKEN` environment variable. If neither is provided, the plugin returns an error.

### File path resolution

The `config_file_path` and the queue directory follow the same resolution logic:

- **Absolute paths** are used as-is.
- **Relative paths** are resolved from the `PLUGIN_DIR` environment variable. If `PLUGIN_DIR` is not set, the plugin falls back to `INFLUXDB3_PLUGIN_DIR` and then the parent of `VIRTUAL_ENV`.

If none of these are available, the plugin returns an error.

#### Example TOML configuration

- [simple_data_replicator_config_scheduler.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/simple_data_replicator/simple_data_replicator_config_scheduler.toml) — scheduler mode
- [simple_data_replicator_config_data_writes.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/simple_data_replicator/simple_data_replicator_config_data_writes.toml) — data write mode

## Data requirements

The plugin assumes the table schema is already defined in the local database; it relies on this schema to retrieve the field and tag names required for processing. The remote target database must already exist.

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled
- **Python packages**:
  - `influxdb3-python` ({{% product-name %}} client library used to write to the remote instance)

### Installation steps

1. Start {{% product-name %}} with the Processing Engine enabled (`--plugin-dir /path/to/plugins`):

   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/plugins
   ```
2. Install required Python packages:

   ```bash
   influxdb3 install package influxdb3-python
   ```
## Trigger setup

### Scheduler mode

Periodically pulls data from a local measurement within a time window and replicates it to the remote instance:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/simple_data_replicator/simple_data_replicator.py \
  --trigger-spec "every:10s" \
  --trigger-arguments host=example.com,remote_token=apiv3_token,database=remote_db,source_measurement=home,window=10s,unique_file_suffix=abcd1234 \
  simple_data_replicator_trigger
```
Enable the trigger to start periodic replication:

```bash
influxdb3 enable trigger --database mydb simple_data_replicator_trigger
```
### Data write mode

Replicates data automatically whenever the Write-Ahead Log (WAL) is flushed after a write:

```bash
influxdb3 create trigger \
  --database mydb \
  --trigger-spec "all_tables" \
  --plugin-filename gh:influxdata/simple_data_replicator/simple_data_replicator.py \
  --trigger-arguments host=example.com,remote_token=apiv3_token,database=remote_db,tables="home home2",field_renames="home:hum=humidity|temp=temperature",unique_file_suffix=wxyz5678 \
  simple_data_replicator_trigger
```
Enable the trigger to start replication on WAL flush events:

```bash
influxdb3 enable trigger --database mydb simple_data_replicator_trigger
```
> **Note:**
> - The plugin is triggered whenever the WAL is flushed, which happens after data is written.
> - It processes the batches of data written to the database, using the arguments specified in `--trigger-arguments`.
> - The plugin caches the list of measurements in the database and the tag names for each measurement for one hour to avoid repeated queries.
> - In data write mode the remote flush is attempted once per invocation (no in-call retries); any data that fails to deliver stays in the queue and is retried on the next WAL flush.
> - Run the trigger in the default synchronous mode. Do not use `--run-asynchronous`: concurrent invocations would access the same queue file in parallel and can corrupt it or lose data. Synchronous execution serializes invocations and keeps queue access safe.

### Replication with TOML configuration

Recommended for complex filtering and renaming. Store the arguments in a TOML file and reference it with the `config_file_path` argument (absolute, or relative to `PLUGIN_DIR`):

```bash
export PLUGIN_DIR=~/plugins
cp simple_data_replicator_config_scheduler.toml $PLUGIN_DIR/

influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/simple_data_replicator/simple_data_replicator.py \
  --trigger-spec "every:10s" \
  --trigger-arguments config_file_path=simple_data_replicator_config_scheduler.toml \
  simple_data_replicator_trigger
```
## Queue management

The plugin buffers data in a compressed JSONL queue file before delivery, ensuring reliable replication. The file is unique per trigger configuration to avoid conflicts.

- **Location**: the `sdr_queues` subdirectory of the resolved plugin directory (see [File path resolution](#file-path-resolution)). For example, with `PLUGIN_DIR=/opt/plugins` the queue lives in `/opt/plugins/sdr_queues/`.
- **File name**:
  - Data write mode: `sdr_queue_writes_<unique_file_suffix>.jsonl.gz`
  - Scheduler mode: `sdr_queue_schedule_<unique_file_suffix>.jsonl.gz`
- **Format**: gzip-compressed JSON Lines, one JSON object per line.
- **Lifecycle**: data is appended before replication and removed after it is delivered successfully.
- **Maximum size**: controlled by `max_size` (default 512 MB); exceeding it raises an error.

Use a distinct `unique_file_suffix` for every trigger, and monitor the file size to avoid disk overflow.

## Logging

Logs are stored in the `_internal` database (or the database where the trigger is created) in the `system.processing_engine_logs` table:

```bash
influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs"
```
Example output:

```text
+-------------------------------+-----------------+--------------+----------------------------------------------------------------------------------------------------------+
| event_time                    | trigger_name    | log_level    | log_text                                                                                                 |
+-------------------------------+-----------------+--------------+----------------------------------------------------------------------------------------------------------+
| 2025-05-14T16:31:10.033295886 | my_scheduler    | INFO         | [4726cf36-3b15-442e-bd9d-f9b768ad8781] Finished execution in 31ms 449us 193ns                            |
| 2025-05-14T16:31:10.033275724 | my_scheduler    | INFO         | [4726cf36-3b15-442e-bd9d-f9b768ad8781] Replicated 10 lines to remote instance                            |
| 2025-05-14T16:31:10.033232792 | my_scheduler    | INFO         | [4726cf36-3b15-442e-bd9d-f9b768ad8781] Queued 10 lines from table1,table2                                |
| 2025-05-14T16:31:00.046579787 | some_scheduler  | ERROR        | [528a316e-b28c-4bd2-8c05-07ad50bc1de2] Error during replication: Connection failed                       |
| 2025-05-14T16:31:00.025482558 | my_scheduler    | INFO         | [cd5caa89-47db-443c-9621-5f90a129a0cc] Starting data replication process                                 |
+-------------------------------+-----------------+--------------+----------------------------------------------------------------------------------------------------------+
```
Each entry carries the task ID in `log_text`, so logs from a single execution can be correlated.

## Troubleshooting

### Check plugin logs

```bash
influxdb3 query --database _internal \
  "SELECT * FROM system.processing_engine_logs
   WHERE trigger_name = 'simple_data_replicator_trigger'
   ORDER BY time DESC LIMIT 20"
```
### Common issues

#### "Missing remote token"

Set the `remote_token` argument or the `REMOTE_INFLUXDB_TOKEN` environment variable.

#### Relative `config_file_path` not found

For relative paths, ensure `PLUGIN_DIR` (or `INFLUXDB3_PLUGIN_DIR`) is set. For absolute paths, verify the file exists.

#### Queue file exceeds `max_size`

Replication is failing or falling behind. Check the logs for delivery errors, fix the remote connection, or raise `max_size`.

#### Corrupted or invalid queue file

If the plugin reports persistent errors caused by a corrupted queue file, delete it to reset the queue:

```bash
# Data write triggers:
rm $PLUGIN_DIR/sdr_queues/sdr_queue_writes_<unique_file_suffix>.jsonl.gz

# Scheduled triggers:
rm $PLUGIN_DIR/sdr_queues/sdr_queue_schedule_<unique_file_suffix>.jsonl.gz
```
**Warning:** deleting the queue file permanently loses any entries that have not yet been replicated. Only delete it if you are certain the data is corrupted or you accept the loss.

## Architecture

### How It Works

1. **Trigger fires**: on a schedule (`every:<interval>`) or on each WAL flush (`all_tables`).
2. **Read rows**: scheduler mode queries the time window from `source_measurement`; data write mode reads the committed table batches.
3. **Filter and rename**: excluded tables and fields are dropped, then table and field renames are applied.
4. **Queue**: rows are converted to points and appended to the compressed JSONL queue file. If the queue already reached `max_size`, new rows are skipped (with a warning) but the existing queue is still flushed, so the buffer can drain once the remote recovers.
5. **Replicate**: the queue is flushed to the remote instance over HTTP in chunks of `queue_flush_chunk_size` lines (default 500). Scheduler mode retries failures and rate limits; data write mode attempts each flush once.
6. **Cleanup**: entries are removed from the queue only after they are delivered successfully.

### Performance Optimization

- **Client caching**: the remote client is cached and reused across invocations instead of reconnecting each cycle. It is rebuilt when the connection settings change, and evicted after retries are exhausted on a connection failure so the next cycle reconnects cleanly.
- **Chunked flush**: the queue is written to the remote instance in chunks of `queue_flush_chunk_size` lines (default 500), bounding request size and memory for large backlogs. Each successful chunk is removed from the queue, so a mid-flush failure does not re-send already delivered data.
- **Schema caching**: the measurement list and per-measurement tag names are cached for one hour to avoid repeated queries.
- **Compressed queue**: gzip-compressed JSONL keeps the on-disk buffer small.
- **Retry logic**: in scheduler mode, transient failures and rate limits are retried up to `max_retries` times; in data write mode failed data stays queued for the next WAL flush.

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
