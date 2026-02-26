> \[!Note]
>
> #### InfluxDB 3 Core and Enterprise relationship
>
> InfluxDB 3 Enterprise is a superset of InfluxDB 3 Core.
> All updates to Core are automatically included in Enterprise.
> The Enterprise sections below only list updates exclusive to Enterprise.

## v3.8.3 {date="2026-02-24"}

### Core

#### Bug fixes

- **WAL Buffer**: An edge case causing potential overflow of the WAL Buffer has been fixed


## v3.8.2 {date="2026-02-23"}

### Core

#### Features

- **TLS: Skip certificate verification in CLI subcommands**: Use the new `--tls-no-verify` flag with any CLI subcommand to skip TLS certificate verification when connecting to a server. Useful for testing environments with self-signed certificates.

- **Environment variable prefix standardization**: InfluxDB 3 specific environment variables use the `INFLUXDB3_` prefix for consistency. Legacy variable names continue to work (deprecated) for backward compatibility.

  > [!IMPORTANT]
  > `INFLUXDB3_LOG_FILTER` is currently ignored. To set the log filter, use `LOG_FILTER` or the `--log-filter` flag.

- **Parquet output format for `show` subcommands**: You can now save query results from the `show` subcommand directly to a Parquet file.

- **SQL: `tag_values()` table function**: Query distinct tag values using the new `tag_values()` SQL table function.

- **InfluxQL: `SHOW TAG VALUES` improvements**: In Enterprise deployments with auto-DVC enabled, `SHOW TAG VALUES` queries now use the Distinct Value Cache (DVC) automatically for improved performance. The `WHERE` clause is also now supported in `SHOW TAG VALUES` queries backed by the DVC, including compound predicates using `AND` and `OR`.

- **InfluxQL: `SHOW RETENTION POLICIES` returns duration**: The `duration` column in `SHOW RETENTION POLICIES` results now returns the configured retention period in InfluxDB v1-compatible format (for example, `168h0m0s`) instead of returning an empty value.

- **Ceph S3 backend support**: Use `--aws-s3-custom-backend ceph` with `influxdb3 serve` to connect to Ceph S3-compatible object storage. This enables ETag quote stripping required for conditional PUT operations with Ceph.

- **`_internal` database default retention**: The `_internal` system database now defaults to a 7-day retention period (previously infinite). Only admin tokens can modify retention on the `_internal` database.


#### Bug fixes

- **Sparse write handling for LVC, DVC, and Processing Engine**: Fixed incorrect behavior when processing sparse writes (writes that include only some fields from a table with multiple field families).

- **`influxdb3-launcher`: SSL certificate path on RHEL systems**: Fixed an issue where the `SSL_CERT_FILE` environment variable was not correctly set on affected RHEL-based
  systems when using the `influxdb3-launcher` script.
- Additional bug fixes and performance improvements.

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific features and fixes:

#### Features

- **Data-only deletion for databases and tables**: Delete only the stored data from a database or table while preserving catalog entries, schema, and associated resources (tokens, triggers, caches, and processing engine configurations).

#### Bug fixes

- **Compaction stability**: Several fixes to compaction scheduling and processing to improve stability and correctness in multi-node clusters.

- **TableIndexCache initialization**: Fixed a concurrency bug that could cause incorrect behavior during `TableIndexCache` initialization.

- **Snapshot checkpointing**: Fixed an issue where snapshot checkpoint cleanup was not running as a background task.

## v3.8.0 {date="2025-12-18"}

### Core

#### Features

- **Linux Service Management**: Run InfluxDB 3 as a managed system service on Linux ([#27026](https://github.com/influxdata/influxdb/pull/27026)):
  - Use `influxdb3-launcher` script to initialize the service
  - Deploy with systemd on modern Linux distributions
  - Deploy with SysV init on legacy systems
  - Customize service behavior with configuration files

#### Bug fixes

- **CLI**: View only active databases and tables when running `SHOW RETENTION`
- **Database operations**: Receive an error when attempting to delete tables from an already-deleted database
- **Retention Policy**: Receive an error when attempting to modify retention settings on deleted databases

#### Security

- **Processing Engine**: Run processing engine plugins with Python 3.13.11, which includes security and bug fixes ([#27014](https://github.com/influxdata/influxdb/pull/27014))

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

#### Bug fixes

- **Table Limits**: Delete tables without affecting your table limit quota
- **Retention Policy**: Receive an error when attempting to modify retention settings on deleted tables

## v3.7.0 {date="2025-11-19"}

### Core

#### Features

- **HTTP API Enhancements**:
  - All HTTP responses now include a `cluster-uuid` header containing the catalog UUID, enabling clients to identify specific cluster instances programmatically
  - HTTP API now supports multi-member gzip payloads enabling batch operations
- **CLI Commands**:
  - The new `influxdb3 show retention` command displays effective retention periods for each table, showing whether retention is set at the database-level or table-level with human-readable formatting (for example, "7d", "24h")

#### Bug fixes

- **Authorization**: Fixed multi-database permission handling to properly authorize queries across multiple databases.

- **General Improvements**: Several key bug fixes and performance improvements.

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

- **General Improvements**: Several key bug fixes and performance improvements.

## v3.6.0 {date="2025-10-30"}

### Core

#### Features

- **Quick-Start Developer Experience**:
  - `influxdb3` now supports running without arguments for instant database startup, automatically generating IDs and storage flags values based on your system's setup.
- **Processing Engine**:
  - Plugins now support multiple files instead of single-file limitations.
  - When creating a trigger, you can upload a plugin directly from your local machine using the `--upload` flag.
  - Existing plugin files can now be updated at runtime without recreating triggers.
  - New `system.plugin_files` table and `show plugins` CLI command now provide visibility into all loaded plugin files.
  - Custom plugin repositories are now supported via `--plugin-repo` CLI flag.
  - Python package installation can now be disabled with `--package-manager disabled` for locked-down environments.
  - Plugin file path validation now prevents directory traversal attacks by blocking relative and absolute path patterns.

#### Bug fixes

- **Write API**: Fixed abbreviated precision values (`ns`, `ms`, `us`, `s`) to work correctly with the `/api/v3/write_lp` endpoint. Previously, only full precision names (`nanosecond`, `microsecond`, `millisecond`, `second`) worked.
- **Token management**: Token display now works correctly for hard-deleted databases

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

#### Operational improvements

- **Storage engine**: improvements to the Docker-based license service development environment
- **Catalog consistency**: Node management fixes for catalog edge cases
- Other enhancements and performance improvements

## v3.5.0 {date="2025-09-30"}

### Core

#### Features

- **Custom Plugin Repository**:
  - Use the `--plugin-repo` option with `influxdb3 serve` to specify custom plugin repositories. This enables loading plugins from personal repos or disabling remote repo access.

#### Bug fixes

- **Database reliability**:
  - Table index updates now complete atomically before creating new indices, preventing race conditions that could corrupt database state ([#26838](https://github.com/influxdata/influxdb/pull/26838))
  - Delete operations are now idempotent, preventing errors during object store cleanup ([#26839](https://github.com/influxdata/influxdb/pull/26839))
- **Write path**:
  - Write operations to soft-deleted databases are now rejected, preventing data loss ([#26722](https://github.com/influxdata/influxdb/pull/26722))
- **Runtime stability**:
  - Fixed a compatibility issue that could cause deadlocks for concurrent operations ([#26804](https://github.com/influxdata/influxdb/pull/26804))
- Other bug fixes and performance improvements

#### Security & Misc

- Sensitive environment variable values are now hidden in CLI output and log messages ([#26837](https://github.com/influxdata/influxdb/pull/26837))

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

#### Features

- **Cache optimization**:
  - Last Value Cache (LVC) and Distinct Value Cache (DVC) now populate on creation and only on query nodes, reducing resource usage on ingest nodes.

#### Bug fixes

- **Object store reliability**:
  - Object store operations now use retryable mechanisms with better error handling

#### Operational improvements

- **Compaction optimizations**:
  - Compaction producer now waits 10 seconds before starting cycles, reducing resource contention during startup
  - Enhanced scheduling algorithms distribute compaction work more efficiently across available resources
- **System tables**:
  - System tables now provide consistent data across different node modes (ingest, query, compact), enabling better monitoring in multi-node deployments

## v3.4.2 {date="2025-09-11"}

### Core

#### Bug fixes

- **Database reliability**:
  - TableIndexCache initialization and ObjectStore improvements
  - Persister doesn't need a TableIndexCache

#### HTTP API changes

- **v2 write API**: Standardized `/api/v2/write` error response format to match other InfluxDB editions. Error responses now use the consistent format: `{"code": "<code>", "message": "<detailed message>"}` ([#26787](https://github.com/influxdata/influxdb/pull/26787))

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

#### Features

- **Storage engine**: Pass in root CA and disable TLS verify for object store
- **Support**: Add support for manually stopping a node

#### Bug fixes

- **Bug fix**: Generation detail path calculation panic
- **Database reliability**: Pass TableIndexCache through to PersistedFiles

#### Operational improvements

- **Compaction optimizations**:
  - Compaction cleaner now waits for 1 hour by default (previously 10 minutes)
  - Compaction producer now waits for 10 seconds before starting compaction cycle
- **Catalog synchronization**: Background catalog update is synchronized every 1 second (previously 10 seconds)
- **Logging improvements**: Added clear logging to indicate what sequence is persisted on producer side and what is consumed by the consumer side

## v3.4.1 {date="2025-08-28"}

### Core

#### Bug Fixes

- Upgrading from 3.3.0 to 3.4.x no longer causes possible catalog migration issues ([#26756](https://github.com/influxdata/influxdb/pull/26756))

## v3.4.0 {date="2025-08-27"}

### Core

#### Features

- **Token Provisioning**:
  - Generate admin tokens offline and use them when starting the database if tokens do not already exist.
    This is meant for automated deployments and containerized environments.
    ([#26734](https://github.com/influxdata/influxdb/pull/26734))
- **Azure Endpoint**:
  - Use the `--azure-endpoint` option with `influxdb3 serve` to specify the Azure Blob Storage endpoint for object store connections. ([#26687](https://github.com/influxdata/influxdb/pull/26687))
- **No\_Sync via CLI**:
  - Use the `--no-sync` option with `influxdb3 write` to skip waiting for WAL persistence on write and immediately return a response to the write request. ([#26703](https://github.com/influxdata/influxdb/pull/26703))

#### Bug Fixes

- Validate tag and field names when creating tables ([#26641](https://github.com/influxdata/influxdb/pull/26641))
- Using GROUP BY twice on the same column no longer causes incorrect data ([#26732](https://github.com/influxdata/influxdb/pull/26732))

#### Operational and security improvements

- Introduce a new `v2` catalog path structure:

  - `catalog/v2/logs/` directory for log files (instead of `catalogs/`)
  - `catalog/v2/snapshot` file for checkpoint/snapshot files (instead of `_catalog_checkpoint`)
- Reduce verbosity of the TableIndexCache log. ([#26709](https://github.com/influxdata/influxdb/pull/26709))
- WAL replay concurrency limit defaults to number of CPU cores, preventing possible OOMs. ([#26715](https://github.com/influxdata/influxdb/pull/26715))
- Remove unsafe signal\_handler code. ([#26685](https://github.com/influxdata/influxdb/pull/26685))
- Upgrade Python version to 3.13.7-20250818. ([#26686](https://github.com/influxdata/influxdb/pull/26686), [#26700](https://github.com/influxdata/influxdb/pull/26700))
- Tags with `/` in the name no longer break the primary key.

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

#### Features

- **Token Provisioning**:
  - Generate *resource* and *admin* tokens offline and use them when starting the database.

- Select a home or trial license without using an interactive terminal.
  Use `--license-type` \[home | trial | commercial] option to the `influxdb3 serve` command to automate the selection of the license type.

#### Bug Fixes

- Don't initialize the Processing Engine when the specified `--mode` does not require it.
- Don't panic when `INFLUXDB3_PLUGIN_DIR` is set in containers without the Processing Engine enabled.

## v3.3.0 {date="2025-07-29"}

### Core

#### Features

- **Database management**:
  - Add `influxdb_schema` system table for database schema management ([#26640](https://github.com/influxdata/influxdb/pull/26640))
  - Add `system.processing_engine_trigger_arguments` table for trigger configuration management ([#26604](https://github.com/influxdata/influxdb/pull/26604))
  - Add write path logging to capture database name and client IP address for failed writes. The IP address is fetched from `x-forwarded-for` header if available, `x-real-ip` if available, or remote address as reported by TlsStream/AddrStream ([#26616](https://github.com/influxdata/influxdb/pull/26616))
- **Storage engine**: Introduce `TableIndexCache` for efficient automatic cleanup of expired gen1 Parquet files based on retention policies and hard deletes. Includes new background loop for applying data retention policies with configurable intervals and comprehensive purge operations for tables and retention period expired data ([#26636](https://github.com/influxdata/influxdb/pull/26636))
- **Authentication and security**: Add admin token recovery server that allows regenerating lost admin tokens without existing authentication. Includes new `--admin-token-recovery-http-bind` option for running recovery server on separate port, with automatic shutdown after successful token regeneration ([#26594](https://github.com/influxdata/influxdb/pull/26594))
- **Build process**: Allow passing git hash via environment variable in build process ([#26618](https://github.com/influxdata/influxdb/pull/26618))

#### Bug Fixes

- **Database reliability**:
  - Fix URL-encoded table name handling failures ([#26586](https://github.com/influxdata/influxdb/pull/26586))
  - Allow hard deletion of existing soft-deleted schema ([#26574](https://github.com/influxdata/influxdb/pull/26574))
- **Authentication**: Fix AWS S3 API error handling when tokens are expired ([#1013](https://github.com/influxdata/influxdb/pull/1013))
- **Query processing**: Set nanosecond precision as default for V1 query API CSV output ([#26577](https://github.com/influxdata/influxdb/pull/26577))
- **CLI reliability**:
  - Mark `--object-store` CLI argument as explicitly required ([#26575](https://github.com/influxdata/influxdb/pull/26575))
  - Add help text for the new update subcommand ([#26569](https://github.com/influxdata/influxdb/pull/26569))

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

#### Features

- **License management**:
  - Improve licensing suggestions for Core users
  - Update license information handling
- **Database management**:
  - Enhance `TableIndexCache` with advanced features beyond Core's basic cleanup: persistent snapshots, object store integration, merge operations for distributed environments, and recovery capabilities for multi-node clusters
  - Add `TableIndexSnapshot`, `TableIndex`, and `TableIndices` types for distributed table index management
- **Support**: Include contact information in trial error messages
- **Telemetry**: Send onboarding telemetry before licensing setup

#### Bug Fixes

- **Compaction stability**:
  - Fix compactor re-compaction issues on max generation data overwrite
  - Fix compactor to treat "all" mode as "ingest" mode
- **Database reliability**:
  - Add missing system tables to compact mode
- **Storage integrity**: Update Parquet file paths to use 20 digits of 0-padding
- **General fixes**:
  - Only load processing engine in correct server modes
  - Remove load generator alias clash

## v3.2.1 {date="2025-07-03"}

### Core

#### Features

- **Enhanced database lifecycle management**:
  - Allow updating the hard deletion date for already-deleted databases and tables, providing flexibility in managing data retention and compliance requirements
  - Include `hard_deletion_date` column in `_internal` system tables (`databases` and `tables`) for better visibility into data lifecycle and audit trails

#### Bug Fixes

- **CLI improvements**:
  - Added help text for the new `update` subcommand for database and table update features ([#26569](https://github.com/influxdata/influxdb/pull/26569))
  - `--object-store` and storage configuration parameters are required for the `serve` command ([#26575](https://github.com/influxdata/influxdb/pull/26575))
- **Query processing**: Fixed V1-compatible `/query` HTTP API endpoint to correctly default to nanosecond precision (`ns`) for CSV output, ensuring backward compatibility with InfluxDB 1.x clients and preventing data precision loss ([#26577](https://github.com/influxdata/influxdb/pull/26577))
- **Database reliability**: Fixed issue preventing hard deletion of soft-deleted databases and tables, enabling complete data removal for compliance and storage management needs ([#26574](https://github.com/influxdata/influxdb/pull/26574))

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

#### Features

- **License management improvements**: New `influxdb3 show license` command displays detailed license information including type, expiration date, and resource limits, making it easier to monitor license status and compliance

#### Bug Fixes

- **API stability**: Fixed HTTP API trigger specification to use the correct `"request:REQUEST_PATH"` syntax, ensuring proper request-based trigger configuration for processing engine workflows

## v3.2.0 {date="2025-06-25"}

**Core**: revision 1ca3168bee\
**Enterprise**: revision 1ca3168bee

### Core

#### Features

- **Hard delete for databases and tables**: Permanently delete databases and tables, enabling complete removal of data structures for compliance and storage management ([#26553](https://github.com/influxdata/influxdb/pull/26553))
- **AWS credentials auto-reload**: Support dynamic reloading of ephemeral AWS credentials from files, improving security and reliability when using AWS services ([#26537](https://github.com/influxdata/influxdb/pull/26537))
- **Database retention period support**: Add retention period support for databases via CLI commands (`create database` and `update database` commands) and HTTP APIs ([#26520](https://github.com/influxdata/influxdb/pull/26520)):
  - New CLI command: `update database --retention-period`
- **Configurable lookback duration**: Users can specify lookback duration for PersistedFiles buffer, providing better control over query performance ([#26528](https://github.com/influxdata/influxdb/pull/26528))
- **WAL replay concurrency control**: Add concurrency limits for WAL (Write-Ahead Log) replay to improve startup performance and resource management ([#26483](https://github.com/influxdata/influxdb/pull/26483))
- **Enhanced write path**: Separate write path executor with unbounded memory for improved write performance ([#26455](https://github.com/influxdata/influxdb/pull/26455))

#### Bug Fixes

- **WAL corruption handling**: Handle corrupt WAL files during replay without panic, improving data recovery and system resilience ([#26556](https://github.com/influxdata/influxdb/pull/26556))
- **Database naming validation**: Disallow underscores in database names when created via API to ensure consistency ([#26507](https://github.com/influxdata/influxdb/pull/26507))
- **Object store cleanup**: Automatic intermediate directory cleanup for file object store, preventing storage bloat ([#26480](https://github.com/influxdata/influxdb/pull/26480))

#### Additional Updates

- Track generation 1 duration in catalog for better performance monitoring ([#26508](https://github.com/influxdata/influxdb/pull/26508))
- Add retention period support to the catalog ([#26479](https://github.com/influxdata/influxdb/pull/26479))
- Update help text for improved user experience ([#26509](https://github.com/influxdata/influxdb/pull/26509))

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

#### Features

- **License management improvements**:
  - New `influxdb3 show license` command to display current license information
- **Table-level retention period support**: Add retention period support for individual tables in addition to database-level retention, providing granular data lifecycle management
  - New CLI commands: `create table --retention-period` and `update table --retention-period`
  - Set or clear table-specific retention periods independent of database settings
- **Compaction improvements**:
  - Address compactor restart issues for better reliability
  - Track compacted generation durations in catalog for monitoring
  - Disable Parquet cache for ingest mode to optimize memory usage

#### Bug Fixes

- **Query optimization**: Correctly partition query chunks into generations for improved performance
- **Data integrity**: Don't delete generation 1 files as part of compaction process
- **License handling**: Trim whitespace from license file contents after reading to prevent validation issues

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

- Last value caches reload on restart
- Distinct value caches reload on restart
- Other performance improvements
- Replaces remaining "INFLUXDB\_IOX" Dockerfile environment variables with the following:
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
- Set the TLS CA via the INFLUXDB3\_TLS\_CA environment variable.
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

- The `--tags` argument is now optional for creating a table, and additionally now requires at least one tag *if* specified

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

#### Breaking Changes

- **Parquet cache configuration**: Replaced `--parquet-mem-cache-size-mb` option with `--parquet-mem-cache-size`. The new option accepts values in megabytes (as an integer) or as a percentage of total available memory (for example, `20%`). The default value changed from `1000` MB to `20%` of total available memory. The environment variable `INFLUXDB3_PARQUET_MEM_CACHE_SIZE_MB` was replaced with `INFLUXDB3_PARQUET_MEM_CACHE_SIZE`. ([#26023](https://github.com/influxdata/influxdb/pull/26023))
- **Memory settings updates**:
  - Force snapshot memory threshold now defaults to `50%` of available memory
  - DataFusion execution memory pool now defaults to `20%` of available memory

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

This update brings several backend performance improvements to both Core and Enterprise in preparation for additional new features over the next several weeks.

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

| Old Parameter                | New Parameter |
| ---------------------------- | ------------- |
| `--writer-id`<br>`--host-id` | `--node-id`   |

### Enterprise features

#### Cluster management

- Nodes are now associated with *clusters*, simplifying compaction, read replication, and processing
- Node specs are now available for simpler management of cache creations

#### Mode types

- Set `ingest`, `query`, `compact`, and `process` individually per node

### Enterprise parameter changes

For Enterprise, additional parameters for the `serve` command have been consolidated for simplicity:

| Old Parameter                                       | New Parameter                        |
| --------------------------------------------------- | ------------------------------------ |
| `--read-from-node-ids`<br>`--compact-from-node-ids` | `--cluster-id`                       |
| `--run-compactions`<br>`--mode=compactor`           | `--mode=compact`<br>`--mode=compact` |

In addition to the above changes, `--cluster-id` is now a required parameter for all new instances.
