> [!Note] 
> InfluxDB 3 Enterprise is a super set of InfluxDB 3 Core. Any updates to Core are also reflected in Enterprise. Only non-Core updates are listed in the Enterprise sections below.

## v0.1.0 Beta {date="2025-03-17"}

### Core
#### Features
- **Query & Storage Enhancements**
  - New ability to stream data back for CSV and JSON queries, similar to how JSONL streaming works. 
  - Parquet files are now cached on the query path, improving performance.
  - Query buffer is incrementally cleared when snapshotting, lowering memory spikes.

- **Processing Engine Improvements**
  - New _scheduled_ trigger, enabling Python plugins to run on a custom, time-defined basis.
  - New _request_ trigger, enabling Python plugins to be called via HTTP requests.
  - New in-memory cache for storing data temporarily; this data can be stored for a single trigger or across all triggers. 
  - Integration with virtual environments and install packages. You can now specify a Python virtual environment via the CLI or `VIRTUAL_ENV` variable and install packages or a requirements.txt.
  - Plugins no longer need to be created as their own entity. Simply creating a trigger and tying it to a Python file is enough.
  - Snapshots are now persisted in parallel, improving performance by running jobs simultaneously, rather than sequentially.
  - You can now leverage logging from within the Processing Engine.

- **DB and CLI Improvements**
  - You can now specify the precision on your timestamps for writes using the `--precision` flag. Includes nano/micro/milli/seconds (ns/us/ms/s).
  - Added a new `show` system  subcommand to display system tables with different options via SQL (default limit: 100)
  - Clearer table creation error messages

#### Bug Fixes
  - If a database was created and the service was killed before any data was written, the database would not be retained. 
  - A last cache with specific “value” columns could not be queried.
  - Running CTRL-C no longer stopped an InfluxDB process, due to a Python trigger.
  - A previous build had broken JSON queries for RecordBatches.
  - There was an issue with the distinct cache that caused panics.


### Enterprise
#### Features
- **Cluster Management**
  - Nodes are now tied to clusters simplifying compaction, read replication, processing, and more.
  - Node specs are now available for simpler management of cache creations. 
- **Mode Types**
  - Ingest, query, compaction, and processing engine can now all be set individually per node. 


_See also: [Getting Started with Core](/influxdb3/core/)._
_See also: [Getting Started with Enterprise](/influxdb3/enterprise/)._

