> [!Note]
> #### InfluxDB Core and Enterprise relationship
>
> InfluxDB 3 Enterprise is a superset of InfluxDB 3 Core.
> All updates to Core are automatically included in Enterprise.
> The Enterprise sections below only list features exclusive to Enterprise.

## v3.0.0-0 {date="2025-04-14"}

### Core

#### General Updates

- Performance and reliability improvements.

### Enterprise

#### Token Support

- Authorization is now turned on by default.
- Token support for database level permissions are now available.
- Token support for system level queries are now available.

#### General Updates

- You can now use Commercial, Trial, and At-Home licenses.


## v3.0.0-0.beta.3 {date="2025-04-01"}
**Core**: revision f881c5844bec93a85242f26357a1ef3ebf419dd3
**Enterprise**: revision 6bef9e700a59c0973b0cefdc6baf11583933e262
### Core
#### General Improvements
- InfluxDB 3 now supports graceful shutdowns when sending the interrupt signal to the service.

#### Bug fixes
- Empty batches in JSON format results are now handled properly
- The Processing Engine now properly extracts data from DictionaryArrays

### Enterprise
##### Multi-node improvements
- Query nodes now automatically detect new ingest nodes

#### Bug fixes
- Several fixes for compaction planning and processing 
- The Processing Engine now properly extracts data from DictionaryArrays


## v3.0.0-0.beta.2 {date="2025-03-24"}
**Core**: revision 033e1176d8c322b763b4aefb24686121b1b24f7c
**Enterprise**: revision e530fcd498c593cffec2b56d4f5194afc717d898

This update brings several backend performance improvements to both Core and Enterprise in preparation for additional new features over the next several weeks! 


## v3.0.0-0.beta.1 {date="2025-03-17"}
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

##### Database and CLI improvements
- You can now specify the precision on your timestamps for writes using the `--precision` flag. Includes nano/micro/milli/seconds (ns/us/ms/s)
- Added a new `show` system subcommand to display system tables with different options via SQL (default limit: 100)
- Clearer table creation error messages

##### Bug fixes
- If a database was created and the service was killed before any data was written, the database would not be retained
- A last cache with specific "value" columns could not be queried
- Running CTRL-C no longer stopped an InfluxDB process, due to a Python trigger
- A previous build had broken JSON queries for RecordBatches
- There was an issue with the distinct cache that caused panics

#### Parameter changes

For Core and Enterprise, there are parameter changes for simplicity:

| Old Parameter | New Parameter |
|---------------|---------------|
| `--writer-id`<br>`--host-id` | `--node-id` |

### Enterprise features

#### Cluster management
- Nodes are now associated with _clusters_, simplifying compaction, read replication, and processing
- Node specs are now available for simpler management of cache creations

#### Mode types

- Set `ingest`, `query`, `compact`, and `process` individually per node

### Enterprise parameter changes

For Enterprise, additional parameters for the `serve` command have been consolidated for simplicity:

| Old Parameter | New Parameter |
|---------------|---------------|
| `--read-from-node-ids`<br>`--compact-from-node-ids` | `--cluster-id` |
| `--run-compactions`<br>`--mode=compactor` | `--mode=compact`<br>`--mode=compact` |

In addition to the above changes, `--cluster-id` is now a required parameter for all new instances.