> [!Note]
> **InfluxDB Core and Enterprise relationship**
>
> InfluxDB 3 Enterprise is a superset of InfluxDB 3 Core.
> All updates to Core are automatically included in Enterprise.
> The Enterprise sections below only list features exclusive to Enterprise.


## v0.1.0 Beta {date="2025-03-17"}

### Core
#### Features

##### Query and storage enhancements
- New ability to stream response data for CSV and JSON queries, similar to how JSONL streaming works
- Parquet files are now cached on the query path, improving performance
- Query buffer is incrementally cleared when snapshotting, lowering memory spikes

##### Processing engine improvements
- New Trigger Types:
  - *Scheduled*: Run Python plugins on custom, time-defined basis
  - *Request*: Call Python plugins via HTTP requests
- New in-memory cache for storing data temporarily; cached data can be stored for a single trigger or across all triggers
- Integration with virtual environments and install packages:
  - Specify Python virtual environment via CLI or `VIRTUAL_ENV` variable
  - Install packages or a `requirements.txt`
- Python plugins are now implemented through triggers only. Simply create a trigger that references your Python plugin code file directly
- Snapshots are now persisted in parallel, improving performance by running jobs simultaneously, rather than sequentially
- Write to logs from within the Processing Engine

##### DB and CLI Improvements
- You can now specify the precision on your timestamps for writes using the `--precision` flag. Includes nano/micro/milli/seconds (ns/us/ms/s)
- Added a new `show` system subcommand to display system tables with different options via SQL (default limit: 100)
- Clearer table creation error messages

##### Bug Fixes
- If a database was created and the service was killed before any data was written, the database would not be retained
- A last cache with specific "value" columns could not be queried
- Running CTRL-C no longer stopped an InfluxDB process, due to a Python trigger
- A previous build had broken JSON queries for RecordBatches
- There was an issue with the distinct cache that caused panics

#### Command Parameter Changes

Multiple parameters and modes for the `serve` command have been consolidated for simplicity:

| Old Parameter | New Parameter |
|---------------|---------------|
| `--writer-id`<br>`--host-id` | `--node-id` |
| `--mode=read`<br>`--mode=read_write` | `--mode=query`<br>`--mode=ingest`|

### Enterprise
#### Features

##### Cluster Management
- Nodes are now associated with *clusters*, simplifying compaction, read replication, and processing
- Node specs are now available for simpler management of cache creations

##### Mode Types
- Ingest, query, compaction, and processing engine can now all be set individually per node

#### Command Parameter Changes

For Enterprise, additional parameters for the `serve` command have been consolidated for simplicity:

| Old Parameter | New Parameter |
|---------------|---------------|
| `--read-from-node-ids`<br>`--compact-from-node-ids` | `--cluster-id` |
| `--run-compactions`<br>`--mode=compactor` | `--mode=compact`<br>`--mode=compact` |

In addition to the above changes, `--cluster-id` is now a required parameter for all new instances.