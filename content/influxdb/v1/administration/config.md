---
title: Configure InfluxDB OSS
description: >
  Learn about InfluxDB OSS configuration settings and environment variables.
menu:
  influxdb_v1:
    name: Configure InfluxDB
    weight: 10
    parent: Administration
alt_links:
  v2: /influxdb/v2/reference/config-options/
---

The InfluxDB open source (OSS) configuration file contains configuration settings specific to a local node.

#### Content

- [Configuration overview](#configuration-overview)
- [Environment variables](#environment-variables)
  - [InfluxDB environment variables (`INFLUXDB_*`)](#influxdb-environment-variables-influxdb)
  - [`GOMAXPROCS` environment variable](#gomaxprocs-environment-variable)
- [Using the configuration file](#using-the-configuration-file)
- [Configuration settings](#configuration-settings)
  - [Global settings](#global-settings)
  - [Metastore `[meta]`](#metastore-settings)
  - [Data `[data]`](#data-settings)
  - [Query management `[coordinator]`](#query-management-settings)
  - [Flux query management `[flux-controller]`](#flux-query-management-settings)
  - [Retention policies `[retention]`](#retention-policy-settings)
  - [Shard precreation `[shard-precreation]`](#shard-precreation-settings)
  - [Monitoring `[monitor]`](#monitoring-settings)
  - [HTTP endpoints `[http]`](#http-endpoints-settings)
  - [Subscriptions `[subscriber]`](#subscription-settings)
  - [Graphite `[[graphite]]`](#graphite-settings)
  - [CollectD `[[collectd]]`](#collectd-settings)
  - [OpenTSB `[[opentsdb]]`](#opentsdb-settings)
  - [UDP `[[udp]]`](#udp-settings)
  - [Continuous queries `[continuous_queries]`](#continuous-queries-settings)
  - [TLS `[tls]`](#transport-layer-security-tls-settings)

## Configuration overview

InfluxDB is configured using the configuration file (`influxdb.conf`) and environment variables.
If you do not uncomment a configuration option, the system uses its default setting.
The configuration settings in this document are set to their default settings.

Configuration settings that specify a duration support the following duration units:

- `ns` _(nanoseconds)_
- `us` or `µs` _(microseconds)_
- `ms` _(milliseconds)_
- `s` _(seconds)_
- `m` _(minutes)_
- `h` _(hours)_
- `d` _(days)_
- `w` _(weeks)_

> [!Note]
> Configuration file settings are documented here for the latest official release.
> The [sample configuration file on GitHub](https://github.com/influxdb/influxdb/blob/1.8/etc/config.sample.toml)
> might be slightly newer.

## Environment variables

All of the configuration settings in the configuration file can be specified
either in the configuration file or in an environment variable.
The environment variable overrides the equivalent option in the configuration
file. If a configuration option is not specified in either the configuration
file or in an environment variable, InfluxDB uses its internal default configuration.

> [!Note]
> If an environment variable has already been set, the equivalent configuration
> setting in the configuration file is ignored.

### InfluxDB environment variables (`INFLUXDB_*`) {#influxdb-environment-variables-influxdb}

The InfluxDB environment variables are documented below with the corresponding
configuration file settings. All of the InfluxDB-specific environment variables
are prefixed with `INFLUXDB_`.

### `GOMAXPROCS` environment variable

> [!Note]
> The GOMAXPROCS environment variable cannot be set using the InfluxDB
> configuration file settings, like other environment variables.

The `GOMAXPROCS` [Go language environment variable](https://golang.org/pkg/runtime/#hdr-Environment_Variables)
can be used to set the maximum number of CPUs that can execute simultaneously.

The default value of `GOMAXPROCS` is the number of CPUs (whatever your operating
system considers to be a CPU) that are visible to the program _on startup_.
For a 32-core machine, the `GOMAXPROCS` value would be `32`.
You can override this value to be less than the maximum value, which can be
useful in cases where you are running the InfluxDB along with other processes on
the same machine and want to ensure that the database doesn't completely starve
those processes.

> [!Note]
> Setting `GOMAXPROCS=1` will eliminate all parallelization.

## Using the configuration file

The InfluxDB system has internal defaults for all of the settings in the
configuration file. To view the default configuration settings, use the 
`influxd config` command.

The local InfluxDB configuration file is located here:

- **Linux**: `/etc/influxdb/influxdb.conf`
- **macOS**: `/usr/local/etc/influxdb.conf`
- **Windows**: _Same directory as `influxd.exe`_

Settings that are commented out are set to the internal system defaults.
Uncommented settings override the internal defaults.
Note that the local configuration file does not need to include every
configuration setting.

There are two ways to launch InfluxDB with your configuration file:

- Point the process to the configuration file by using the `-config`
  option. For example:

  ```bash
  influxd -config /etc/influxdb/influxdb.conf
  ```

- Set the environment variable `INFLUXDB_CONFIG_PATH` to the path of your
  configuration file and start the process.
  For example:

  ```bash
  echo $INFLUXDB_CONFIG_PATH
  /etc/influxdb/influxdb.conf

  influxd
  ```

InfluxDB first checks for the `-config` option and then for the environment
variable.


## Configuration settings

> [!Note]
> To set or override settings in a config section that allows multiple
> configurations (any section with `[[double_brackets]]` in the header supports
> multiple configurations), the desired configuration must be specified by ordinal
> number.
> For example, for the first set of `[[graphite]]` environment variables,
> prefix the configuration setting name in the environment variable with the
> relevant position number (in this case: `0`):
>
> ```txt
> INFLUXDB_GRAPHITE_0_BATCH_PENDING
> INFLUXDB_GRAPHITE_0_BATCH_SIZE
> INFLUXDB_GRAPHITE_0_BATCH_TIMEOUT
> INFLUXDB_GRAPHITE_0_BIND_ADDRESS
> INFLUXDB_GRAPHITE_0_CONSISTENCY_LEVEL
> INFLUXDB_GRAPHITE_0_DATABASE
> INFLUXDB_GRAPHITE_0_ENABLED
> INFLUXDB_GRAPHITE_0_PROTOCOL
> INFLUXDB_GRAPHITE_0_RETENTION_POLICY
> INFLUXDB_GRAPHITE_0_SEPARATOR
> INFLUXDB_GRAPHITE_0_TAGS
> INFLUXDB_GRAPHITE_0_TEMPLATES
> INFLUXDB_GRAPHITE_0_UDP_READ_BUFFER
> ```
>
> For the Nth Graphite configuration in the configuration file, the relevant
> environment variables would be of the form `INFLUXDB_GRAPHITE_(N-1)_BATCH_PENDING`.
> For each section of the configuration file the numbering restarts at zero.

## Global settings

### reporting-disabled

InfluxData uses voluntarily reported data from running InfluxDB nodes 
primarily to track the adoption rates of different InfluxDB versions. This 
data helps InfluxData support the continuing development of InfluxDB.

The `reporting-disabled` option toggles the reporting of data every 24 hours 
to `usage.influxdata.com`. Each report includes a randomly-generated 
identifier, OS, architecture, InfluxDB version, and the number of 
[databases](/influxdb/v1/concepts/glossary/#database), 
[measurements](/influxdb/v1/concepts/glossary/#measurement), and unique 
[series](/influxdb/v1/concepts/glossary/#series). Setting this option to 
`true` will disable reporting.

> [!Note]
> **Note:** No data from user databases is ever transmitted.

**Default**: `false`  
**Environment variable**: `INFLUXDB_REPORTING_DISABLED`

### bind-address {#rpc-bind-address}

The `bind-address` option specifies the address and port to bind the RPC 
service for [backup and restore](/influxdb/v1/administration/backup_and_restore/).

**Default**: `127.0.0.1:8088`  
**Environment variable**: `INFLUXDB_BIND_ADDRESS`

### compact-series-file {metadata="v1.11.4+"}

The `compact-series-file` options determines if series files should be compacted
on startup. If `true`, InfluxDB runs
[`influxd_inspect -compact-series-file`](/influxdb/v1/tools/influx_inspect/#--compact-series-file-)
before starting the `influxd` server.

Default: `false`  
Environment variable: `INFLUXDB_COMPACT_SERIES_FILE`

## Metastore settings

### [meta]

This section controls parameters for the InfluxDB metastore,
which stores information on users, databases, retention policies, shards, and continuous queries.

### dir

The directory where the metadata/raft database is stored. Files in the `meta`
directory include `meta.db`, the InfluxDB metastore file.

> [!Note]
> The default directory for macOS installations is `/Users/<username>/.influxdb/meta`.

**Default**: `/var/lib/influxdb/meta`  
**Environment variable**: `INFLUXDB_META_DIR`

### retention-autocreate

Enables the automatic creation of the 
[`DEFAULT` retention policy](/influxdb/v1/concepts/glossary/#retention-policy-rp) 
`autogen` when a database is created. The retention policy `autogen` has an 
infinite duration and is also set as the database's `DEFAULT` retention policy, 
which is used when a write or query does not specify a retention policy. Disable 
this setting to prevent the creation of this retention policy when creating 
databases.

**Default**: `true`  
**Environment variable**: `INFLUXDB_META_RETENTION_AUTOCREATE`

### logging-enabled

Enables the logging of messages from the meta service.

**Default**: `true`  
**Environment variable**: `INFLUXDB_META_LOGGING_ENABLED`

## Data settings

### [data]

The `[data]` settings control where the actual shard data for InfluxDB lives and
how it is flushed from the Write-Ahead Log (WAL).
`dir` may need to be changed to a suitable place for your system, but the WAL
settings are an advanced configuration.
The defaults should work for most systems.

#### dir

The InfluxDB directory where the TSM engine stores TSM files. This directory 
may be changed.

> [!Note]
> The default directory for macOS installations is `/Users/<username>/.influxdb/data`.

**Default**: `/var/lib/influxdb/data`  
**Environment variable**: `INFLUXDB_DATA_DIR`

#### wal-dir

The location of the directory for 
[write ahead log (WAL)](/influxdb/v1/concepts/glossary/#wal-write-ahead-log) 
files.

> [!Note]
> For macOS installations, the default WAL directory is 
> `/Users/<username>/.influxdb/wal`.

**Default**: `/var/lib/influxdb/wal`  
**Environment variable**: `INFLUXDB_DATA_WAL_DIR`

#### wal-fsync-delay

The amount of time that a write waits before fsyncing. Use a duration greater 
than `0` to batch up multiple fsync calls. This is useful for slower disks or 
when experiencing [WAL](/influxdb/v1/concepts/glossary/#wal-write-ahead-log) 
write contention.

> [!Note]
> For non-SSD disks, InfluxData recommends values in the range of `0ms`-`100ms`.

**Default**: `0s`  
**Environment variable**: `INFLUXDB_DATA_WAL_FSYNC_DELAY`

#### index-version

The type of shard index to use for new shards. The default (`inmem`) index is 
an in-memory index that is recreated at startup. To enable the Time Series 
Index (TSI) disk-based index, set the value to `tsi1`.

**Default**: `inmem`  
**Environment variable**: `INFLUXDB_DATA_INDEX_VERSION`

#### trace-logging-enabled

Enables verbose logging of additional debug information within the TSM engine 
and WAL. The trace logging provides more useful output for debugging TSM 
engine issues.

**Default**: `false`  
**Environment variable**: `INFLUXDB_DATA_TRACE_LOGGING_ENABLED`

#### query-log-enabled

Enables the logging of parsed queries before execution. The query log can be 
useful for troubleshooting, but logs any sensitive data contained within a 
query.

**Default**: `true`  
**Environment variable**: `INFLUXDB_DATA_QUERY_LOG_ENABLED`

#### strict-error-handling

When set to `false`, any query attempting to insert an unsupported value, 
for example `+/-Inf` or `NaN`, fails to insert the unsupported value silently 
and proceeds to insert any valid points in the query.

Set to `true` to provide more error checking. For example, a `SELECT INTO` 
query attempting to insert a `+/-Inf` value returns an error (rather than 
failing silently), and no points will be inserted.

**Default**: `false`  
**Environment variable**: `INFLUXDB_DATA_STRICT_ERROR_HANDLING`

#### validate-keys

Validates incoming writes to ensure measurement keys and tag keys only have 
valid Unicode characters. This setting will incur a small overhead because 
every key must be checked. This will not validate field keys.

**Default**: `false`  
**Environment variable**: `INFLUXDB_VALIDATE_KEYS`

### Settings for the TSM engine

#### cache-max-memory-size

The maximum size that a shard cache can reach before it starts rejecting writes.

Valid memory size suffixes are: `k`, `m`, or `g` (case-insensitive, 1024 = 1k). 
Values without a size suffix are in bytes.

> [!Note]
> Consider increasing this value if encountering 
> `cache maximum memory size exceeded` errors.

**Default**: `"1g"`  
**Environment variable**: `INFLUXDB_DATA_CACHE_MAX_MEMORY_SIZE`

#### cache-snapshot-memory-size

The size at which the engine will snapshot the cache and write it to a TSM file, 
freeing up memory.

Valid memory size suffixes are: `k`, `m`, or `g` (case-insensitive, 1024 = 1k). 
Values without a size suffix are in bytes.

**Default**: `"25m"`  
**Environment variable**: `INFLUXDB_DATA_CACHE_SNAPSHOT_MEMORY_SIZE`

#### cache-snapshot-write-cold-duration

The time interval at which the engine will snapshot the cache and write it to 
a new TSM file if the shard hasn't received writes or deletes.

**Default**: `"10m"`  
**Environment variable**: `INFLUXDB_DATA_CACHE_SNAPSHOT_WRITE_COLD_DURATION`

#### compact-full-write-cold-duration

The time interval at which the TSM engine will compact all TSM files in a shard 
if it hasn't received a write or delete.

**Default**: `"4h"`  
**Environment variable**: `INFLUXDB_DATA_COMPACT_FULL_WRITE_COLD_DURATION`

#### max-concurrent-compactions

The maximum number of concurrent full and level 
[compactions](/influxdb/v1/concepts/storage_engine/#compactions) that can run 
at one time. The default value of `0` results in 50% of the CPU cores being 
used at runtime for compactions. If explicitly set, the number of cores used 
for compaction is limited to the specified value. This setting does not apply 
to cache snapshotting.

For more information on the `GOMAXPROCS` environment variable, see 
[`GOMAXPROCS` environment variable](#gomaxprocs-environment-variable) on this 
page.

**Default**: `0`  
**Environment variable**: `INFLUXDB_DATA_MAX_CONCURRENT_COMPACTIONS`

#### max-concurrent-deletes {metadata="v1.11.7+"}

The maximum number of simultaneous `DELETE` calls on a shard. Default is `1` 
and should be left unchanged for most use cases.

**Default**: `1`  
**Environment variable**: `INFLUXDB_DATA_MAX_CONCURRENT_DELETES`

#### compact-throughput

The maximum number of bytes per second TSM compactions write to disk. Short 
bursts are allowed to exceed this value, as determined by 
`compact-throughput-burst`.

**Default**: `"48m"` (48 million)  
**Environment variable**: `INFLUXDB_DATA_COMPACT_THROUGHPUT`

#### compact-throughput-burst

The maximum number of bytes per second TSM compactions write to disk during 
brief bursts.

**Default**: `"48m"` (48 million)  
**Environment variable**: `INFLUXDB_DATA_COMPACT_THROUGHPUT_BURST`

#### aggressive-points-per-block {metadata="v1.12.0+"}

The number of points per block to use during aggressive compaction. There are 
certain cases where TSM files do not get fully compacted. This adjusts an 
internal parameter to help ensure these files do get fully compacted.

**Default**: `10000`  
**Environment variable**: `INFLUXDB_AGGRESSIVE_POINTS_PER_BLOCK`

#### tsm-use-madv-willneed

If `true`, the MMap Advise value `MADV_WILLNEED` advises the kernel about how 
to handle the mapped memory region in terms of input/output paging and to 
expect access to the mapped memory region in the near future, with respect to 
TSM files. 

> [!Note]
> Because this setting has been problematic on some kernels (including CentOS 
> and RHEL), the default is `false`. Changing the value to `true` might help 
> users who have slow disks in some cases.

**Default**: `false`  
**Environment variable**: `INFLUXDB_DATA_TSM_USE_MADV_WILLNEED`

### In-memory (`inmem`) index settings

#### max-series-per-database

The maximum number of [series](/influxdb/v1/concepts/glossary/#series) allowed 
per database before writes are dropped. The default setting is `1000000` (one 
million). Change the setting to `0` to allow an unlimited number of series per 
database.

If a point causes the number of series in a database to exceed 
`max-series-per-database`, InfluxDB will not write the point, and it returns a 
`500` with the following error:

```
{"error":"max series per database exceeded: <series>"}
```

> [!Note]
> Any existing databases with a series count that exceeds 
> `max-series-per-database` will continue to accept writes to existing series, 
> but writes that create a new series will fail.

**Default**: `1000000`  
**Environment variable**: `INFLUXDB_DATA_MAX_SERIES_PER_DATABASE`

#### max-values-per-tag

The maximum number of 
[tag values](/influxdb/v1/concepts/glossary/#tag-value) allowed per 
[tag key](/influxdb/v1/concepts/glossary/#tag-key). The default value is 
`100000` (one hundred thousand). Change the setting to `0` to allow an 
unlimited number of tag values per tag key. If a tag value causes the number 
of tag values of a tag key to exceed `max-values-per-tag`, then InfluxDB will 
not write the point, and it returns a `partial write` error.

> [!Note]
> Any existing tag keys with tag values that exceed `max-values-per-tag` will 
> continue to accept writes, but writes that create a new tag value will fail.

**Default**: `100000`  
**Environment variable**: `INFLUXDB_DATA_MAX_VALUES_PER_TAG`

### TSI (`tsi1`) index settings

#### max-index-log-file-size

The threshold, in bytes, when an index write-ahead log (WAL) file will compact
into an index file. Lower sizes will cause log files to be compacted more
quickly and result in lower heap usage at the expense of write throughput.
Higher sizes will be compacted less frequently, store more series in memory,
and provide higher write throughput. Valid size suffixes are `k`, `m`, or `g`
(case-insensitive, 1024 = 1k). Values without a size suffix are in bytes.

**Default**: `"1m"`  
**Environment variable**: `INFLUXDB_DATA_MAX_INDEX_LOG_FILE_SIZE`

#### series-id-set-cache-size

The size of the internal cache used in the TSI index to store previously
calculated series results. Cached results will be returned quickly from the
cache rather than needing to be recalculated when a subsequent query with a
matching tag key-value predicate is executed. Setting this value to `0` will
disable the cache, which may lead to query performance issues. This value
should only be increased if it is known that the set of regularly used tag
key-value predicates across all measurements for a database is larger than 100.
An increase in cache size may lead to an increase in heap usage.

**Default**: `100`  
**Environment variable**: `INFLUXDB_DATA_SERIES_ID_SET_CACHE_SIZE`

## Query management settings

### [coordinator]

This section contains configuration settings for query management.
For more on managing queries, see
[Query Management](/influxdb/v1/troubleshooting/query_management/).

#### write-timeout

The duration a write request waits until a "timeout" error is returned to the
caller.

**Default**: `"10s"`  
**Environment variable**: `INFLUXDB_COORDINATOR_WRITE_TIMEOUT`

#### max-concurrent-queries

The maximum number of running queries allowed on your instance.

**Default**: `0` (unlimited)  
**Environment variable**: `INFLUXDB_COORDINATOR_MAX_CONCURRENT_QUERIES`

#### query-timeout

The maximum duration that a query is allowed to execute before InfluxDB kills
the query. This setting is a [duration](#configuration-overview).

**Default**: `"0s"` (no time restrictions)  
**Environment variable**: `INFLUXDB_COORDINATOR_QUERY_TIMEOUT`

#### log-queries-after

The maximum duration that a query can run until InfluxDB logs the query with a
`Detected slow query` message. This setting is a [duration](#configuration-overview).

**Default**: `"0s"` (never logs slow queries)  
**Environment variable**: `INFLUXDB_COORDINATOR_LOG_QUERIES_AFTER`

#### max-select-point

The maximum number of [points](/influxdb/v1/concepts/glossary/#point) that a
`SELECT` statement can process.

**Default**: `0` (unlimited)  
**Environment variable**: `INFLUXDB_COORDINATOR_MAX_SELECT_POINT`

#### max-select-series

The maximum number of 
[series](/influxdb/v1/concepts/glossary/#series) that a `SELECT` statement 
can process.

> [!Note]
> The default setting (`0`) allows the `SELECT` statement to process an 
> unlimited number of series.

**Default**: `0`  
**Environment variable**: `INFLUXDB_COORDINATOR_MAX_SELECT_SERIES`

#### max-select-buckets

The maximum number of `GROUP BY time()` buckets that a query can process.

> [!Note]
> The default setting (`0`) allows a query to process an unlimited number 
> of buckets.

**Default**: `0`  
**Environment variable**: `INFLUXDB_COORDINATOR_MAX_SELECT_BUCKETS`

#### termination-query-log

Prints a list of running queries when InfluxDB receives a `SIGTERM` 
(sent when a process exceeds a container memory limit or by the `kill` 
command).

**Default**: `false`  
**Environment variable**: `INFLUXDB_COORDINATOR_TERMINATE_QUERY_LOG`

-----

## Flux query management settings

### [flux-controller] {metadata="v1.11.7+"}

The `flux-controller` settings control the behavior of Flux queries.

#### query-concurrency {metadata="v1.11.7+"}

The number of Flux queries that are allowed to execute concurrently. `0` means
unlimited.

**Default**: `0`  
**Environment variable**: `INFLUXDB_FLUX_CONTROLLER_QUERY_CONCURRENCY`

#### query-initial-memory-bytes {metadata="v1.11.7+"}

The initial number of bytes allocated for a Flux query when it is started. If
this is unset, then the `query-max-memory-bytes` is used. `0` means unlimited.

**Default**: `0`  
**Environment variable**: `INFLUXDB_FLUX_CONTROLLER_QUERY_INITIAL_MEMORY_BYTES`

#### query-max-memory-bytes {metadata="v1.11.7+"}

The maximum number of bytes (in table memory) a Flux query is allowed to use at
any given time. `0` means unlimited.

A query may not be able to use its entire quota of memory if requesting more
memory would conflict with the maximum amount of memory that the controller can
request.

**Default**: `0`  
**Environment variable**: `INFLUXDB_FLUX_CONTROLLER_QUERY_MAX_MEMORY_BYTES`

#### total-max-memory-bytes {metadata="v1.11.7+"}

The maximum amount of memory the Flux query controller is allowed to allocate
to Flux queries. `0` means unlimited.

If this is unset, then this number is `query-concurrency * query-max-memory-bytes`.
This number must be greater than or equal to
`query-concurrency * query-initial-memory-bytes` and may be less than
`query-concurrency * query-max-memory-bytes`.

**Default**: `0`  
**Environment variable**: `INFLUXDB_FLUX_CONTROLLER_TOTAL_MAX_MEMORY_BYTES`

#### query-queue-size {metadata="v1.11.7+"}

The number of Flux queries that are allowed to be queued for execution before 
new queries are rejected. `0` means unlimited.

> [!Note]
> The default value of `0` allows an unlimited number of queries to be queued.

**Default**: `0`  
**Environment variable**: `INFLUXDB_FLUX_CONTROLLER_QUERY_QUEUE_SIZE`

-----

## Retention policy settings

### [retention]

The `[retention]` settings control the enforcement of retention policies for evicting old data.

#### enabled

Set to `false` to prevent InfluxDB from enforcing retention policies.

**Default**: `true`  
**Environment variable**: `INFLUXDB_RETENTION_ENABLED`

#### check-interval

The time interval at which InfluxDB checks to enforce a retention policy.

**Default**: `"30m0s"`  
**Environment variable**: `INFLUXDB_RETENTION_CHECK_INTERVAL`

-----

## Shard precreation settings

### [shard-precreation]

The `[shard-precreation]` settings control the precreation of shards so that
shards are available before data arrive. Only shards that, after creation, will
have both a start- and end-time in the future are ever created.
Shards that would be wholly or partially in the past are never precreated.

#### enabled

Determines whether the shard precreation service is enabled.

**Default**: `true`  
**Environment variable**: `INFLUXDB_SHARD_PRECREATION_ENABLED`

#### check-interval

The time interval when the check to precreate new shards runs.

**Default**: `"10m"`  
**Environment variable**: `INFLUXDB_SHARD_PRECREATION_CHECK_INTERVAL`

#### advance-period

The maximum period in the future for which InfluxDB precreates shards. The  
`30m` default should work for most systems. Increasing this setting too far  
in the future can cause inefficiencies.

**Default**: `"30m"`  
**Environment variable**: `INFLUXDB_SHARD_PRECREATION_ADVANCE_PERIOD`

## Monitoring settings

### [monitor]

The `[monitor]` section settings control the InfluxDB
[system self-monitoring](https://github.com/influxdata/influxdb/blob/1.8/monitor/README.md).

By default, InfluxDB writes the data to the `_internal` database.
If that database does not exist, InfluxDB creates it automatically.
The `DEFAULT` retention policy on the `_internal` database is seven days.
If you want to use a retention policy other than the seven-day retention policy,
you must [create](/influxdb/v1/query_language/manage-database/#retention-policy-management) it.

#### store-enabled

Set to `false` to disable recording statistics internally. If set to `false`,
it will make it substantially more difficult to diagnose issues with your
installation.

**Default**: `true`  
**Environment variable**: `INFLUXDB_MONITOR_STORE_ENABLED`

#### store-database

The destination database for recorded statistics.

**Default**: `_internal`  
**Environment variable**: `INFLUXDB_MONITOR_STORE_DATABASE`

#### store-interval

The time interval at which InfluxDB records statistics. The default value is
every ten seconds (`10s`).

**Default**: `10s`  
**Environment variable**: `INFLUXDB_MONITOR_STORE_INTERVAL`

## HTTP endpoints settings

### [http]

The `[http]` section settings control how InfluxDB configures the HTTP endpoints.
These are the primary mechanisms for getting data into and out of InfluxDB.
Edit the settings in this section to enable HTTPS and authentication.

For details on enabling HTTPS and authentication, see
[Authentication and Authorization](/influxdb/v1/administration/authentication_and_authorization/).

#### enabled

Determines whether the HTTP endpoints are enabled. To disable access to the 
HTTP endpoints, set the value to `false`. Note that the InfluxDB 
[command line interface (CLI)](/influxdb/v1/tools/shell/) connects to the 
database using the InfluxDB API.

**Default**: `true`  
**Environment variable**: `INFLUXDB_HTTP_ENABLED`

#### flux-enabled

Determines whether the Flux query endpoint is enabled. To enable the use of 
Flux queries, set the value to `true`.

**Default**: `false`  
**Environment variable**: `INFLUXDB_HTTP_FLUX_ENABLED`

#### bind-address {#http-bind-address}

The bind address (port) used by the HTTP service.

**Default**: `":8086"`  
**Environment variable**: `INFLUXDB_HTTP_BIND_ADDRESS`

#### auth-enabled

Determines whether user authentication is enabled over HTTP and HTTPS. To 
require authentication, set the value to `true`.

**Default**: `false`  
**Environment variable**: `INFLUXDB_HTTP_AUTH_ENABLED`

#### realm

The default realm sent back when issuing a basic authentication challenge. 
The realm is the JWT realm used by the HTTP endpoints.

**Default**: `"InfluxDB"`  
**Environment variable**: `INFLUXDB_HTTP_REALM`

#### log-enabled

Determines whether HTTP request logging is enabled. To disable logging, set 
the value to `false`.

**Default**: `true`  
**Environment variable**: `INFLUXDB_HTTP_LOG_ENABLED`

#### suppress-write-log

Determines whether the HTTP write request logs should be suppressed when the 
log is enabled.

**Default**: `false`  
**Environment variable**: `INFLUXDB_HTTP_SUPPRESS_WRITE_LOG`

#### access-log-path

The path to the access log, which determines whether detailed write logging 
is enabled using `log-enabled = true`. Specifies whether HTTP request logging 
is written to the specified path when enabled. If `influxd` is unable to 
access the specified path, it will log an error and fall back to `stderr`. 
When HTTP request logging is enabled, this option specifies the path where 
log entries should be written. If unspecified, the default is to write to 
stderr, which intermingles HTTP logs with internal InfluxDB logging. If 
`influxd` is unable to access the specified path, it will log an error and 
fall back to writing the request log to `stderr`.

**Default**: `""`  
**Environment variable**: `INFLUXDB_HTTP_ACCESS_LOG_PATH`

#### access-log-status-filters

Filters which requests should be logged. Each filter is of the pattern `nnn`, 
`nnx`, or `nxx` where `n` is a number and `x` is the wildcard for any number. 
To filter all `5xx` responses, use the string `5xx`. If multiple filters are 
used, then only one has to match. The default value is no filters, with every 
request being printed.

**Default**: `[]`  
**Environment variable**: `INFLUXDB_HTTP_ACCESS_LOG_STATUS_FILTERS_x`

##### Examples

###### Set access log status filters using configuration settings

```txt
access-log-status-filters = ["4xx", "5xx"]
```

`"4xx"` is in array position `0`
`"5xx"` is in array position `1`

###### Set access log status filters using environment variables

The input values for the `access-log-status-filters` is an array.
When using environment variables, the values can be supplied as follows.

```
INFLUXDB_HTTP_ACCESS_LOG_STATUS_FILTERS_0=4xx
INFLUXDB_HTTP_ACCESS_LOG_STATUS_FILTERS_1=5xx
```

The `_n` at the end of the environment variable represents the array position of the entry.

#### write-tracing

Determines whether detailed write logging is enabled. Set to `true` to enable 
logging for the write payload. If set to `true`, this will duplicate every 
write statement in the logs and is thus not recommended for general use.

**Default**: `false`  
**Environment variable**: `INFLUXDB_HTTP_WRITE_TRACING`

#### pprof-enabled

Determines whether the `/net/http/pprof` HTTP endpoint is enabled. Useful for 
troubleshooting and monitoring.

**Default**: `true`  
**Environment variable**: `INFLUXDB_HTTP_PPROF_ENABLED`

#### pprof-auth-enabled

Enables authentication on `/debug` endpoints. If enabled, users need admin 
permissions to access the following endpoints:

- `/debug/pprof`
- `/debug/requests`
- `/debug/vars`

This setting has no effect if either 
[`auth-enabled`](#auth-enabled) or 
[`pprof-enabled`](#pprof-enabled) are set to `false`.

**Default**: `false`  
**Environment variable**: `INFLUXDB_HTTP_PPROF_AUTH_ENABLED`

#### debug-pprof-enabled

Enables the default `/pprof` endpoint and binds against `localhost:6060`. 
Useful for debugging startup performance issues.

**Default**: `false`  
**Environment variable**: `INFLUXDB_HTTP_DEBUG_PPROF_ENABLED`

#### ping-auth-enabled

Enables authentication on the `/ping`, `/metrics`, and deprecated `/status` endpoints.
This setting has no effect if [`auth-enabled`](#auth-enabled) is set to `false`.

**Default**: `false`  
**Environment variable**: `INFLUXDB_HTTP_PING_AUTH_ENABLED`

#### prom-read-auth-enabled

Enables authentication on the Prometheus remote read API. This setting has no 
effect if [`auth-enabled`](#auth-enabled) is set to `false`.

**Default**: `false`  
**Environment variable**: `INFLUXDB_HTTP_PROM_READ_AUTH_ENABLED`

#### http-headers

User-supplied [HTTP response headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers). 
Configure this section to return 
[security headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#Security) 
such as `X-Frame-Options` or `Content Security Policy` where needed.

Example:

```toml
[http.headers]
  X-Frame-Options = "DENY"
```

#### https-enabled

Determines whether HTTPS is enabled. To enable HTTPS, set the value to `true`.

**Default**: `false`  
**Environment variable**: `INFLUXDB_HTTP_HTTPS_ENABLED`

#### https-certificate

The path of the SSL certificate file to use when HTTPS is enabled.

**Default**: `"/etc/ssl/influxdb.pem"`  
**Environment variable**: `INFLUXDB_HTTP_HTTPS_CERTIFICATE`

#### https-private-key

Use a separate private key location. If only the `https-certificate` is 
specified, the `httpd` service will try to load the private key from the 
`https-certificate` file. If a separate `https-private-key` file is specified, 
the `httpd` service will load the private key from the `https-private-key` file.

**Default**: `""`  
**Environment variable**: `INFLUXDB_HTTP_HTTPS_PRIVATE_KEY`

#### shared-secret

The shared secret used to validate public API requests using JWT tokens.

**Default**: `""`  
**Environment variable**: `INFLUXDB_HTTP_SHARED_SECRET`

#### max-row-limit

The maximum number of rows that the system can return in a 
[non-chunked](/influxdb/v1/tools/api#query-string-parameters) query. The 
default setting (`0`) allows for an unlimited number of rows. If the query 
results exceed a specified value, then InfluxDB includes a `"partial":true` 
tag in the response body.

**Default**: `0`  
**Environment variable**: `INFLUXDB_HTTP_MAX_ROW_LIMIT`

#### max-connection-limit

The maximum number of connections that may be open at once. New connections 
that would exceed the limit are dropped. The default value of `0` disables 
the limit.

**Default**: `0`  
**Environment variable**: `INFLUXDB_HTTP_MAX_CONNECTION_LIMIT`

#### unix-socket-enabled

Enable HTTP service over the UNIX domain socket. To enable HTTP service over 
the UNIX domain socket, set the value to `true`.

**Default**: `false`  
**Environment variable**: `INFLUXDB_HTTP_UNIX_SOCKET_ENABLED`

#### bind-socket

The path of the UNIX domain socket.

**Default**: `"/var/run/influxdb.sock"`  
**Environment variable**: `INFLUXDB_HTTP_UNIX_BIND_SOCKET`

#### max-body-size

The maximum size, in bytes, of a client request body. When an HTTP client 
sends data that exceeds the configured maximum size, a `413 Request Entity 
Too Large` HTTP response is returned. To disable the limit, set the value 
to `0`.

**Default**: `25000000`  
**Environment variable**: `INFLUXDB_HTTP_MAX_BODY_SIZE`

#### max-concurrent-write-limit

The maximum number of writes that can be processed concurrently. To disable 
the limit, set the value to `0`.

**Default**: `0`  
**Environment variable**: `INFLUXDB_HTTP_MAX_CONCURRENT_WRITE_LIMIT`

#### max-enqueued-write-limit

The maximum number of writes queued for processing. To disable the limit, set 
the value to `0`.

**Default**: `0`  
**Environment variable**: `INFLUXDB_HTTP_MAX_ENQUEUED_WRITE_LIMIT`

#### enqueued-write-timeout

The maximum duration for a write to wait in the queue to be processed. To 
disable the limit, set this to `0` or set the `max-concurrent-write-limit` 
value to `0`.

**Default**: `0`  
**Environment variable**: `INFLUXDB_HTTP_ENQUEUED_WRITE_TIMEOUT`

-----

## Logging settings

### [logging]

Controls how the logger emits logs to the output.

#### format

Determines which log encoder to use for logs. Valid values are `auto` (default), 
`logfmt`, and `json`. With the default `auto` option, if the output is to a TTY 
device (e.g., a terminal), a more user-friendly console encoding is used. If the 
output is to files, the auto option uses the `logfmt` encoding. The `logfmt` and 
`json` options are useful for integration with external tools.

**Default**: `auto`  
**Environment variable**: `INFLUXDB_LOGGING_FORMAT`

#### level

The log level to be emitted. Valid values are `error`, `warn`, `info` (default), 
and `debug`. Logs that are equal to, or above, the specified level will be 
emitted.

**Default**: `info`  
**Environment variable**: `INFLUXDB_LOGGING_LEVEL`

#### suppress-logo

Suppresses the logo output that is printed when the program is started. The logo 
is always suppressed if `STDOUT` is not a TTY.

**Default**: `false`  
**Environment variable**: `INFLUXDB_LOGGING_SUPPRESS_LOGO`

-----

## Subscription settings

### [subscriber]

The `[subscriber]` section controls how [Kapacitor](/kapacitor/v1/) will receive data.

#### enabled

Determines whether the subscriber service is enabled. To disable the subscriber
service, set the value to `false`.

**Default**: `true`  
**Environment variable**: `INFLUXDB_SUBSCRIBER_ENABLED`

#### http-timeout

The duration that an HTTP write to a subscriber runs until it times out.

**Default**: `"30s"`  
**Environment variable**: `INFLUXDB_SUBSCRIBER_HTTP_TIMEOUT`

#### insecure-skip-verify

Determines whether to allow insecure HTTPS connections to subscribers. This is
useful when testing with self-signed certificates.

**Default**: `false`  
**Environment variable**: `INFLUXDB_SUBSCRIBER_INSECURE_SKIP_VERIFY`

#### ca-certs

The path to the PEM-encoded CA certs file. If the value is an empty string
(`""`), the default system certs will be used.

**Default**: `""`  
**Environment variable**: `INFLUXDB_SUBSCRIBER_CA_CERTS`

#### write-concurrency

The number of writer goroutines processing the write channel.

**Default**: `40`  
**Environment variable**: `INFLUXDB_SUBSCRIBER_WRITE_CONCURRENCY`

#### write-buffer-size

The number of in-flight writes buffered in the write channel.

**Default**: `1000`  
**Environment variable**: `INFLUXDB_SUBSCRIBER_WRITE_BUFFER_SIZE`

#### total-buffer-bytes {metadata="v1.11.7+"}

The total size in bytes allocated to buffering across all subscriptions. Each 
named subscription receives an even division of the total.

**Default**: `0`  
**Environment variable**: `INFLUXDB_SUBSCRIBER_TOTAL_BUFFER_BYTES`

-----

## Graphite settings

### [[graphite]]

This section controls one or many listeners for Graphite data.
For more information, see [Graphite protocol support in InfluxDB](/influxdb/v1/supported_protocols/graphite/).

#### enabled

Set to `true` to enable Graphite input.

**Default**: `false`  
**Environment variable**: `INFLUXDB_GRAPHITE_0_ENABLED`

#### database

The name of the database that you want to write to.

**Default**: `"graphite"`  
**Environment variable**: `INFLUXDB_GRAPHITE_0_DATABASE`

#### retention-policy

The relevant retention policy. An empty string is equivalent to the database's
`DEFAULT` retention policy.

**Default**: `""`  
**Environment variable**: `INFLUXDB_GRAPHITE_0_RETENTION_POLICY`

#### bind-address {#graphite-bind-address}

The default port.

**Default**: `":2003"`  
**Environment variable**: `INFLUXDB_GRAPHITE_0_BIND_ADDRESS`

#### protocol

Set to `tcp` or `udp`.

**Default**: `"tcp"`  
**Environment variable**: `INFLUXDB_GRAPHITE_PROTOCOL`

#### consistency-level

The number of nodes that must confirm the write. If the requirement is not met, 
the return value will be either `partial write` if some points in the batch fail 
or `write failure` if all points in the batch fail. For more information, see 
the Query String Parameters for Writes section in the 
[InfluxDB line protocol syntax reference](/influxdb/v1/write_protocols/write_syntax/).

**Default**: `"one"`  
**Environment variable**: `INFLUXDB_GRAPHITE_CONSISTENCY_LEVEL`

> [!Important]
> The next three settings control how batching works.
> You should have this enabled otherwise you could get dropped metrics or poor performance.
> Batching will buffer points in memory if you have many coming in.

#### batch-size

The input will flush if this many points get buffered.

**Default**: `5000`  
**Environment variable**: `INFLUXDB_GRAPHITE_BATCH_SIZE`

#### batch-pending

The number of batches that may be pending in memory.

**Default**: `10`  
**Environment variable**: `INFLUXDB_GRAPHITE_BATCH_PENDING`

#### batch-timeout

The input will flush at least this often even if it hasn't reached the 
configured batch-size.

**Default**: `"1s"`  
**Environment variable**: `INFLUXDB_GRAPHITE_BATCH_TIMEOUT`

#### udp-read-buffer

UDP read buffer size, `0` means OS default. The UDP listener will fail if set 
above the OS maximum.

**Default**: `0`  
**Environment variable**: `INFLUXDB_GRAPHITE_UDP_READ_BUFFER`

#### separator

This string joins multiple matching 'measurement' values, providing more 
control over the final measurement name.

**Default**: `"."`  
**Environment variable**: `INFLUXDB_GRAPHITE_SEPARATOR`


-----

## CollectD settings

### [[collectd]]

The `[[collectd]]` settings control the listener for `collectd` data.
For more information, see [CollectD protocol support in InfluxDB](/influxdb/v1/supported_protocols/collectd/).

#### enabled

Set to `true` to enable `collectd` writes.

**Default**: `false`  
**Environment variable**: `INFLUXDB_COLLECTD_ENABLED`

#### bind-address {#collectd-bind-address}

The port.

**Default**: `":25826"`  
**Environment variable**: `INFLUXDB_COLLECTD_BIND_ADDRESS`

#### database

The name of the database that you want to write to. This defaults to `collectd`.

**Default**: `"collectd"`  
**Environment variable**: `INFLUXDB_COLLECTD_DATABASE`

#### retention-policy

The relevant retention policy. An empty string is equivalent to the database's
`DEFAULT` retention policy.

**Default**: `""`  
**Environment variable**: `INFLUXDB_COLLECTD_RETENTION_POLICY`

#### typesdb

The collectd service supports either scanning a directory for multiple types
db files, or specifying a single db file. A sample `types.db` file can be found
[here](https://github.com/collectd/collectd/blob/master/src/types.db).

**Default**: `"/usr/local/share/collectd"`  
**Environment variable**: `INFLUXDB_COLLECTD_TYPESDB`

#### security-level

**Default**: `"none"`  
**Environment variable**: `INFLUXDB_COLLECTD_SECURITY_LEVEL`

#### auth-file

**Default**: `"/etc/collectd/auth_file"`  
**Environment variable**: `INFLUXDB_COLLECTD_AUTH_FILE`

> [!Important]
> The next three settings control how batching works.
> You should have this enabled otherwise you could get dropped metrics or poor performance.
> Batching will buffer points in memory if you have many coming in.*

#### batch-size

The input will flush if this many points get buffered.

**Default**: `5000`  
**Environment variable**: `INFLUXDB_COLLECTD_BATCH_SIZE`

#### batch-pending

The number of batches that may be pending in memory.

**Default**: `10`  
**Environment variable**: `INFLUXDB_COLLECTD_BATCH_PENDING`

#### batch-timeout

The input will flush at least this often even if it hasn't reached the 
configured batch-size.

**Default**: `"10s"`  
**Environment variable**: `INFLUXDB_COLLECTD_BATCH_TIMEOUT`

#### read-buffer

UDP read buffer size, `0` means OS default. The UDP listener will fail if set 
above the OS maximum.

**Default**: `0`  
**Environment variable**: `INFLUXDB_COLLECTD_READ_BUFFER`

#### parse-multivalue-plugin

When set to `split`, multi-value plugin data (e.g., `df free:5000,used:1000`) 
will be split into separate measurements (e.g., `(df_free, value=5000)` 
`(df_used, value=1000)`). When set to `join`, multi-value plugin data will be 
stored as a single multi-value measurement (e.g., `(df, free=5000,used=1000)`).

**Default**: `"split"`  
**Environment variable**: `INFLUXDB_COLLECTD_PARSE_MULTIVALUE_PLUGIN`

-----

## OpenTSDB settings

### [[opentsdb]]

Controls the listener for OpenTSDB data.
For more information, see [OpenTSDB protocol support in InfluxDB](/influxdb/v1/supported_protocols/opentsdb/).

#### enabled

Set to `true` to enable openTSDB writes.

**Default**: `false`  
**Environment variable**: `INFLUXDB_OPENTSDB_0_ENABLED`

#### bind-address {#opentsdb-bind-address}

The default port.

**Default**: `":4242"`  
**Environment variable**: `INFLUXDB_OPENTSDB_BIND_ADDRESS`

#### database

The name of the database that you want to write to. If the database does not  
exist, it will be created automatically when the input is initialized.

**Default**: `"opentsdb"`  
**Environment variable**: `INFLUXDB_OPENTSDB_DATABASE`

#### retention-policy

The relevant retention policy. An empty string is equivalent to the  
database's `DEFAULT` retention policy.

**Default**: `""`  
**Environment variable**: `INFLUXDB_OPENTSDB_RETENTION_POLICY`

#### consistency-level

Sets the write consistency level: `any`, `one`, `quorum`, or `all` for writes.

**Default**: `"one"`  
**Environment variable**: `INFLUXDB_OPENTSDB_CONSISTENCY_LEVEL`

#### tls-enabled

Enable TLS for openTSDB writes.

**Default**: `false`  
**Environment variable**: `INFLUXDB_OPENTSDB_TLS_ENABLED`

#### certificate

The path to the SSL certificate file to use when TLS is enabled.

**Default**: `"/etc/ssl/influxdb.pem"`  
**Environment variable**: `INFLUXDB_OPENTSDB_CERTIFICATE`

#### log-point-errors

Log an error for every malformed point.

**Default**: `true`  
**Environment variable**: `INFLUXDB_OPENTSDB_0_LOG_POINT_ERRORS`

> [!Important]
> The next three settings control how batching works.
> You should have this enabled otherwise you could get dropped metrics or poor performance.
> Only points metrics received over the telnet protocol undergo batching.*

#### batch-size

The input will flush if this many points get buffered.

**Default**: `1000`  
**Environment variable**: `INFLUXDB_OPENTSDB_BATCH_SIZE`

#### batch-pending

The number of batches that may be pending in memory.

**Default**: `5`  
**Environment variable**: `INFLUXDB_OPENTSDB_BATCH_PENDING`

#### batch-timeout

The input will flush at least this often even if it hasn't reached the 
configured batch-size.

**Default**: `"1s"`  
**Environment variable**: `INFLUXDB_OPENTSDB_BATCH_TIMEOUT`

-----

## UDP settings

### [[udp]]

The `[[udp]]` settings control the listeners for InfluxDB line protocol data using UDP.
For more information, see [UDP protocol support in InfluxDB](/influxdb/v1/supported_protocols/udp/).

#### enabled

Determines whether UDP listeners are enabled. To enable writes over UDP, set
the value to `true`.

**Default**: `false`  
**Environment variable**: `INFLUXDB_UDP_ENABLED`

#### bind-address {#udp-bind-address}

An empty string is equivalent to `0.0.0.0`.

**Default**: `":8089"`  
**Environment variable**: `INFLUXDB_UDP_BIND_ADDRESS`

#### database

The name of the database that you want to write to.

**Default**: `"udp"`  
**Environment variable**: `INFLUXDB_UDP_DATABASE`

#### retention-policy

The relevant retention policy for your data. An empty string is equivalent to
the database's `DEFAULT` retention policy.

**Default**: `""`  
**Environment variable**: `INFLUXDB_UDP_RETENTION_POLICY`

> [!Important]
> The next three settings control how batching works.
> You should have this enabled otherwise you could get dropped metrics or poor performance.
> Batching will buffer points in memory if you have many coming in.*

#### batch-size

The input will flush if this many points get buffered.

**Default**: `5000`  
**Environment variable**: `INFLUXDB_UDP_0_BATCH_SIZE`

#### batch-pending

The number of batches that may be pending in memory.

**Default**: `10`  
**Environment variable**: `INFLUXDB_UDP_0_BATCH_PENDING`

#### batch-timeout

The input will flush at least this often even if it hasn't reached the  
configured batch-size.

**Default**: `"1s"`  
**Environment variable**: `INFLUXDB_UDP_BATCH_TIMEOUT`

#### read-buffer

UDP read buffer size, `0` means OS default. The UDP listener will fail if set  
above the OS maximum.

**Default**: `0`  
**Environment variable**: `INFLUXDB_UDP_BATCH_SIZE`

#### precision

[Time precision](/influxdb/v1/query_language/spec/#durations) used when  
decoding time values. Defaults to `nanoseconds`, which is the default of the  
database.

**Default**: `""`  
**Environment variable**: `INFLUXDB_UDP_PRECISION`


-----

## Continuous queries settings

### [continuous_queries]

The `[continuous_queries]` settings control how
[continuous queries (CQs)](/influxdb/v1/concepts/glossary/#continuous-query-cq)
run within InfluxDB. Continuous queries are automated batches of queries that
execute over recent time intervals. InfluxDB executes one auto-generated query
per `GROUP BY time()` interval.

#### enabled

Set to `false` to disable CQs.

**Default**: `true`  
**Environment variable**: `INFLUXDB_CONTINUOUS_QUERIES_ENABLED`

#### log-enabled

Set to `false` to disable logging for CQ events.

**Default**: `true`  
**Environment variable**: `INFLUXDB_CONTINUOUS_QUERIES_LOG_ENABLED`

#### query-stats-enabled

When set to `true`, continuous query execution statistics are written to the  
default monitor store.

**Default**: `false`  
**Environment variable**: `INFLUXDB_CONTINUOUS_QUERIES_QUERY_STATS_ENABLED`

#### run-interval

The interval at which InfluxDB checks to see if a CQ needs to run. Set this  
option to the lowest interval at which your CQs run. For example, if your most  
frequent CQ runs every minute, set `run-interval` to `1m`.

**Default**: `"1s"`  
**Environment variable**: `INFLUXDB_CONTINUOUS_QUERIES_RUN_INTERVAL`

-----

## Transport Layer Security (TLS) settings

### [tls]

Global configuration settings for Transport Layer Security (TLS) in InfluxDB.
For more information, see [Enabling HTTPS](/influxdb/v1/administration/https_setup/).

If the TLS configuration settings is not specified,
InfluxDB supports all of the cipher suite IDs listed and all TLS versions
implemented in the [Constants section of the Go `crypto/tls` package documentation](https://golang.org/pkg/crypto/tls/#pkg-constants),
depending on the version of Go used to build InfluxDB.
Use the `SHOW DIAGNOSTICS` command to see the version of Go used to build InfluxDB.

### Recommended server configuration for "modern compatibility"

InfluxData recommends configuring your InfluxDB server's TLS settings for
"modern compatibility." This provides a higher level of security and assumes
that backward compatibility is not required. Our recommended TLS configuration
settings for `ciphers`, `min-version`, and `max-version` are based on Mozilla's
"modern compatibility" TLS server configuration described in
[Security/Server Side TLS](https://wiki.mozilla.org/Security/Server_Side_TLS#Modern_compatibility).

InfluxData's recommended TLS settings for "modern compatibility" are specified
in the following configuration settings example:

```toml
[tls]
ciphers = [
  "TLS_AES_128_GCM_SHA256",
  "TLS_AES_256_GCM_SHA384",
  "TLS_CHACHA20_POLY1305_SHA256"
]
min-version = "tls1.3"
max-version = "tls1.3"
```

> [!Important]
> The order of the cipher suite IDs in the `ciphers` setting determines which
> algorithms are selected by priority. The TLS `min-version` and the
> `max-version` settings restrict support to TLS 1.3.

#### ciphers

Specifies the set of cipher suite IDs to negotiate. If not specified, `ciphers`
supports all existing cipher suite IDs listed in the Go `crypto/tls` package.
This is consistent with the behavior within previous releases. In this example,
only the two specified cipher suite IDs would be supported.

**Default**: `["TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305", "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256"]`  
**Environment variable**: `INFLUXDB_TLS_CIPHERS`

#### min-version

Minimum version of the TLS protocol that will be negotiated. Valid values
include: `tls1.0`, `tls1.1`, `tls1.2`, and `tls1.3`. If not specified,
`min-version` is the minimum TLS version specified in the
[Go `crypto/tls` package](https://golang.org/pkg/crypto/tls/#pkg-constants).
In this example, `tls1.0` specifies the minimum version as TLS 1.0, which is
consistent with the behavior of previous InfluxDB releases.

**Default**: `"tls1.0"`  
**Environment variable**: `INFLUXDB_TLS_MIN_VERSION`

#### max-version

The maximum version of the TLS protocol that will be negotiated. Valid values 
include: `tls1.0`, `tls1.1`, `tls1.2`, and `tls1.3`. If not specified, 
`max-version` is the maximum TLS version specified in the 
[Go `crypto/tls` package](https://golang.org/pkg/crypto/tls/#pkg-constants). 
In this example, `tls1.3` specifies the maximum version as TLS 1.3, which is 
consistent with the behavior of previous InfluxDB releases.

**Default**: `tls1.3`  
**Environment variable**: `INFLUXDB_TLS_MAX_VERSION`
