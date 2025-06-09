> [!Note]
> #### InfluxDB 3 Core and Enterprise relationship
>
> InfluxDB 3 Enterprise is a superset of InfluxDB 3 Core.
> All updates to Core are automatically included in Enterprise.
> The Enterprise sections below only list updates exclusive to Enterprise.

## v3.1.0 {date="2025-05-29"}
**Core**: revision 482dd8aac580c04f37e8713a8fffae89ae8bc264

**Enterprise**: revision 2cb23cf32b67f9f0d0803e31b356813a1a151b00

### Core

#### Token and Security Updates
- Named admin tokens can now be created, with configurable expirations
- `health`, `ping`, and `metrics` endpoints can now be opted out of authorization
- `Basic $TOKEN` is now supported for all APIs
- Additional info available when creating a new token
- Additional info available when starting InfuxDB using `--without-auth`

#### Additional Updates
- New catalog metrics available for count operations
- New object store metrics available for transfer latencies and transfer sizes
- New query duration metrics available for Last Value caches
- `/ping` API now contains versioning headers
- Other performance improvements

#### Fixes
- New tags are now backfilled with NULL instead of empty strings
- Bitcode deserialization error fixed
- Series key metadata not persisting to Parquet is now fixed
- Other general fixes and corrections

### Enterprise

#### Token and Security Updates
- Resource tokens now use resource names in `show tokens`
- Tokens can now be granted `CREATE` permission for creating databases

#### Additional Updates
- Last value caches populate on creation and reload on restart
- Distinct value caches populate on creation and reload on restart
- Other performance improvements
- Replaces remaining "INFLUXDB_IOX" Dockerfile environment variables with the following:
  - `ENV INFLUXDB3_OBJECT_STORE=file`
  - `ENV INFLUXDB3_DB_DIR=/var/lib/influxdb3`

#### Fixes
- Improvements and fixes for license validations
- False positive fixed for catalog error on shutdown
- UX improvements for error and onboarding messages
- Other general fixes and corrections

## v3.0.3 {date="2025-05-16"}
**Core**: revision 384c457ef5f0d5ca4981b22855e411d8cac2688e

**Enterprise**: revision 34f4d28295132b9efafebf654e9f6decd1a13caf

### Core

#### Fixes

- Prevent operator token, `_admin`, from being deleted.  

### Enterprise

#### Fixes

- Fix object store info digest that is output during onboarding. 
- Fix issues with false positive catalog error on shutdown.
- Fix licensing validation issues.
- Other fixes and performance improvements.



## v3.0.2 {date="2025-05-01"}
**Core**: revision d80d6cd60049c7b266794a48c97b1b6438ac5da9

**Enterprise**: revision e9d7e03c2290d0c3e44d26e3eeb60aaf12099f29

### Core

#### Security updates

- Generate testing TLS certificates on the fly.  
- Set the TLS CA via the INFLUXDB3_TLS_CA environment variable.  
- Enforce a minimum TLS version for enhanced security.  
- Allow CORS requests from browsers.  

#### General updates

- Support the `--format json` option in the token creation output.  
- Remove the Last Values Cache size limitation to improve performance and flexibility.  
- Incorporate additional performance improvements.  

#### Fixes

- Fix a counting bug in the distinct cache.  
- Fix how the distinct cache handles rows with null values.  
- Fix handling of `group by` tag columns that use escape quotes.  
- Sort the IOx table schema consistently in the `SHOW TABLES` command.  

### Enterprise

#### Updates

- Introduce a command and system table to list cluster nodes.  
- Support multiple custom permission argument matches.  
- Improve overall performance.  

#### Fixes

- Initialize the object store only once.  
- Prevent the Home license server from crashing on restart.  
- Enforce the `--num-cores` thread allocation limit.  

## v3.0.1 {date="2025-04-16"}
**Core**: revision d7c071e0c4959beebc7a1a433daf8916abd51214

**Enterprise**: revision 96e4aad870b44709e149160d523b4319ea91b54c

### Core

#### Updates
- TLS CA can now be set with an environment variable: `INFLUXDB3_TLS_CA`
- Other general performance improvements

#### Fixes
- The `--tags` argument is now optional for creating a table, and additionally now requires at least one tag _if_ specified

### Enterprise

#### Updates
- Catalog limits for databases, tables, and columns are now configurable using `influxdb3 serve` options:
  - `--num-database-limit`
  - `--num-table-limit`
  - `--num-total-columns-per-table-limit`
- Improvements to licensing prompts for clarity
- Other general performance improvements

#### Fixes
- **Home** license thread count log errors


## v3.0.0 {date="2025-04-14"}

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
  - _Scheduled_: Run Python plugins on custom, time-defined basis
  - _Request_: Call Python plugins via HTTP requests
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
