---
title: Configuring InfluxDB OSS
menu:
  influxdb_1_6:
    name: Configuring InfluxDB
    weight: 10
    parent: Administration
---

The InfluxDB OSS configuration file contains configuration settings specific to a local node.

#### Content

* [Configuration overview](#configuration-overview)
* [Environment variables](#environment-variables)
  * [InfluxDB environment variables (`INFLUXDB_*`)](#influxdb-environment-variables-influxdb)
  * [`GOMAXPROCS` environment variable](#gomaxprocs-environment-variable)
* [Using the configuration file](#using-the-configuration-file)
* [Configuration file settings](#configuration-file-settings)
  * [Global settings](#global-settings)
  * [Metastore settings `[meta]`](#metastore-settings-meta)
  * [Data settings `[data]`](#data-settings-data)
  * [Query management settings `[coordinator]`](#query-management-settings-coordinator)
  * [Retention policy settings `[retention]`](#retention-policy-settings-retention)
  * [Shard precreation settings `[shard-precreation]`](#shard-precreation-settings-shard-precreation)
  * [Monitoring settings `[monitor]`](#monitoring-settings-monitor)
  * [HTTP endpoint settings `[http]`](#http-endpoint-settings-http)
  * [Subscription settings `[subscriber]`](#subscription-settings-subscriber)
  * [Graphite settings `[[graphite]]`](#graphite-settings-graphite)
  * [CollectD settings `[[collectd]]`](#collectd-settings-collectd)
  * [OpenTSB settings `[[opentsdb]]`](#opentsdb-settings-opentsdb)
  * [UDP settings `[[udp]]`](#udp-settings-udp)
  * [Continuous queries settings `[continuous_queries]`](#continuous-queries-settings-continuous-queries)
  * [Transport Layer Security (TLS) settings `[tls]`](#transport-layer-security-tls-settings-tls)

## Configuration overview

InfluxDB is configured using the configuration file (`influxdb.conf`) and environment variables.
If you do not uncomment a configuration option, the system uses its default setting.
The configuration settings in this document are set to their default settings.

Configuration settings that specify a duration support the following duration units:

- `ns`&nbsp;&nbsp;&emsp;&emsp;&emsp;&nbsp;&thinsp;&thinsp;nanoseconds
- `us` or `µs`&emsp;microseconds
- `ms`&nbsp;&nbsp;&emsp;&emsp;&emsp;&nbsp;&thinsp;&thinsp;milliseconds
- `s`&nbsp;&emsp;&emsp;&emsp;&emsp;&nbsp;seconds
- `m`&nbsp;&emsp;&emsp;&emsp;&emsp;&nbsp;minutes
- `h`&nbsp;&emsp;&emsp;&emsp;&emsp;&nbsp;hours
- `d`&nbsp;&emsp;&emsp;&emsp;&emsp;&nbsp;days
- `w`&nbsp;&emsp;&emsp;&emsp;&emsp;&nbsp;weeks

>**Note:** Configuration file settings are documented here for the latest official release - the [sample configuration file on GitHub](https://github.com/influxdb/influxdb/blob/1.6/etc/config.sample.toml) might be slightly newer.

## Environment variables

All of the configuration settings in the configuration file can be specified either in the configuration file or in an environment variable.
The environment variable overrides the equivalent option in the configuration
file.
If a configuration option is not specified in either the configuration file or in an environment variable, InfluxDB uses its internal default configuration.

> ***Note:*** If an environment variable has already been set, the equivalent configuration setting in the configuration file is ignored.

### InfluxDB environment variables (`INFLUXDB_*`)

The InfluxDB environment variables are documented below with the corresponding configuration file settings. All of the InfluxDB-specific environment variables are prefixed with `INFLUXDB_`.


### `GOMAXPROCS` environment variable

> ***Note:*** The GOMAXPROCS environment variable cannot be set using the InfluxDB configuration file settings, like other environment variables.


The `GOMAXPROCS` [Go language environment variable](https://golang.org/pkg/runtime/#hdr-Environment_Variables) can be used to set the maximum number of CPUs that can execute simultaneously.


The default value of `GOMAXPROCS` is the number of CPUs (whatever your operating system considers to be a CPU) that are visible to the program *on startup.* For a 32-core machine, the `GOMAXPROCS` value would be `32`.
You can override this value to be less than the maximum value, which can be useful in cases where you are running the InfluxDB along with other processes on the same machine and want to ensure that the database doesn't completely starve those processes.

> ***Note:***
> Setting `GOMAXPROCS=1` will eliminate all parallelization.


## Using the configuration file

The InfluxDB system has internal defaults for all of the settings in the configuration file. To view the default configuration settings, use the `influxd config` command.

The local InfluxDB configuration file is located here:

- Linux: `/etc/influxdb/influxdb.conf`
- macOS: `/usr/local/etc/influxdb.conf`

Settings that are commented out are set to the internal system defaults. Uncommented settings override the internal defaults.
Note that the local configuration file does not need to include every configuration setting.

There are two ways to launch InfluxDB with your configuration file:

* Point the process to the configuration file by using the `-config`
  option. For example:

    ```bash
    influxd -config /etc/influxdb/influxdb.conf
    ```
* Set the environment variable `INFLUXDB_CONFIG_PATH` to the path of your
  configuration file and start the process.
  For example:

    ```
    echo $INFLUXDB_CONFIG_PATH
    /etc/influxdb/influxdb.conf

    influxd
    ```

InfluxDB first checks for the `-config` option and then for the environment
variable.


## Configuration file settings

> **Note:**
> To set or override settings in a config section that allows multiple
> configurations (any section with `[[double_brackets]]` in the header supports
> multiple configurations), the desired configuration must be specified by ordinal
> number.
> For example, for the first set of `[[graphite]]` environment variables,
> prefix the configuration setting name in the environment variable with the
> relevant position number (in this case: `0`):
>
    INFLUXDB_GRAPHITE_0_BATCH_PENDING
    INFLUXDB_GRAPHITE_0_BATCH_SIZE
    INFLUXDB_GRAPHITE_0_BATCH_TIMEOUT
    INFLUXDB_GRAPHITE_0_BIND_ADDRESS
    INFLUXDB_GRAPHITE_0_CONSISTENCY_LEVEL
    INFLUXDB_GRAPHITE_0_DATABASE
    INFLUXDB_GRAPHITE_0_ENABLED
    INFLUXDB_GRAPHITE_0_PROTOCOL
    INFLUXDB_GRAPHITE_0_RETENTION_POLICY
    INFLUXDB_GRAPHITE_0_SEPARATOR
    INFLUXDB_GRAPHITE_0_TAGS
    INFLUXDB_GRAPHITE_0_TEMPLATES
    INFLUXDB_GRAPHITE_0_UDP_READ_BUFFER
>
>For the Nth Graphite configuration in the configuration file, the relevant
>environment variables would be of the form `INFLUXDB_GRAPHITE_(N-1)_BATCH_PENDING`.
>For each section of the configuration file the numbering restarts at zero.


## Global settings

### `reporting-disabled = false`

InfluxData uses voluntarily reported data from running InfluxDB nodes
primarily to track the adoption rates of different InfluxDB versions.
This data helps InfluxData support the continuing development of
InfluxDB.

The `reporting-disabled` option toggles
the reporting of data every 24 hours to `usage.influxdata.com`.
Each report includes a randomly-generated identifier, OS, architecture,
InfluxDB version, and the
number of [databases](/influxdb/v1.6/concepts/glossary/#database),
[measurements](/influxdb/v1.6/concepts/glossary/#measurement), and
unique [series](/influxdb/v1.6/concepts/glossary/#series).  Setting
this option to `true` will disable reporting.

>**Note:** No data from user databases is ever transmitted.

Environment variable: `INFLUXDB_REPORTING_DISABLED`

### `bind-address = "127.0.0.1:8088"`

The bind address to use for the RPC service for [backup and restore](/influxdb/v1.6/administration/backup_and_restore/).

Environment variable: `INFLUXDB_BIND_ADDRESS`

## Metastore settings `[meta]`

This section controls parameters for InfluxDB's metastore,
which stores information on users, databases, retention policies, shards, and continuous queries.

### `dir = "/var/lib/influxdb/meta"`

The `meta` directory.
Files in the `meta` directory include `meta.db`, the InfluxDB metastore file.

>**Note:** The default directory for macOS installations is `/Users/<username>/.influxdb/meta`

Environment variable: `INFLUXDB_META_DIR`

### `retention-autocreate = true`

Retention policy auto-creation automatically creates the [`DEFAULT` retention policy](/influxdb/v1.6/concepts/glossary/#retention-policy-rp) `autogen` when a database is created.
The retention policy `autogen` has an infinite duration and is also set as the
database's `DEFAULT` retention policy, which is used when a write or query does
not specify a retention policy.
Disable this setting to prevent the creation of this retention policy when creating databases.

Environment variable: `INFLUXDB_META_RETENTION_AUTOCREATE`

### `logging-enabled = true`

Meta logging toggles the logging of messages from the meta service.

Environment variable: `INFLUXDB_META_LOGGING_ENABLED`

## Data settings `[data]`

The `[data]` settings control where the actual shard data for InfluxDB lives and how it is flushed from the WAL. `dir` may need to be changed to a suitable place for your system, but the WAL settings are an advanced configuration. The defaults should work for most systems.

### `dir = "/var/lib/influxdb/data"`

The directory where InfluxDB stores the data.
This directory may be changed.

>**Note:** The default directory for macOS installations is `/Users/<username>/.influxdb/data`.

Environment variable: `INFLUXDB_DATA_DIR`

### `index-version = "inmem"`

The type of shard index to use for new shards.
The default (`inmem`) index is an in-memory index that is recreated at startup.

To enable the Time Series Index (TSI) disk-based index, set the value to `tsi1`.

Environment variable: `INFLUXDB_DATA_INDEX_VERSION`

### `wal-dir = "/var/lib/influxdb/wal"`

The WAL directory is the location of the [write ahead log](/influxdb/v1.6/concepts/glossary/#wal-write-ahead-log).

>**Note:** The default WAL directory for macOS installations is `/Users/<username>/.influxdb/wal`.

Environment variable: `INFLUXDB_DATA_WAL_DIR`


### `wal-fsync-delay = "0s"`

The amount of time that a write waits before fsyncing. Use a duration greater than `0` to batch up multiple fsync calls.
This is useful for slower disks or when experiencing [WAL](/influxdb/v1.6/concepts/glossary/#wal-write-ahead-log) write contention.
A value of `0s` fsyncs every write to the WAL.
We recommend values in the range of `0ms`-`100ms` for non-SSD disks.

Environment variable: `INFLUXDB_DATA_WAL_FSYNC_DELAY`

### `trace-logging-enabled = false`

Toggles logging of additional debug information within the TSM engine and WAL.

Environment variable: `INFLUXDB_DATA_TRACE_LOGGING_ENABLED`

### `query-log-enabled = true`

The query log enabled setting toggles the logging of parsed queries before execution.
Very useful for troubleshooting, but will log any sensitive data contained within a query.

Environment variable: `INFLUXDB_DATA_QUERY_LOG_ENABLED`

### `cache-max-memory-size = 1073741824`

The cache maximum memory size is the maximum size that a shard cache can reach before it starts rejecting writes.

Valid memory size suffixes are: k, m, or g (case-insensitive, 1024 = 1k).
Values without a size suffix are in bytes.

Environment variable: `INFLUXDB_DATA_CACHE_MAX_MEMORY_SIZE`

### `cache-snapshot-memory-size = 26214400`

The cache snapshot memory size is the size at which the engine will snapshot the cache and write it to a TSM file, freeing up memory.

Valid memory size suffixes are: k, m, or g (case-insensitive, 1024 = 1k).
Values without a size suffix are in bytes.


Environment variable: `INFLUXDB_DATA_CACHE_SNAPSHOT_MEMORY_SIZE`

### `cache-snapshot-write-cold-duration = "10m"`

The cache snapshot write cold duration is the length of time at which the engine will snapshot the cache and write it to a new TSM file if the shard hasn't received writes or deletes.

Environment variable: `INFLUXDB_DATA_CACHE_SNAPSHOT_WRITE_COLD_DURATION`

### `compact-full-write-cold-duration = "4h"`

The compact full write cold duration is the duration at which the engine will compact all TSM files in a shard if it hasn't received a write or delete.

Environment variable: `INFLUXDB_DATA_COMPACT_FULL_WRITE_COLD_DURATION`

### `max-concurrent-compactions = 0`

The maximum number of concurrent full and level [compactions](/influxdb/v1.6/concepts/storage_engine/#compactions) that can run at one time.
The default value of `0` results in 50% of the CPU cores being used at runtime for compactions.
If explicitly set, the number of cores used for compaction is limited to the specified value.
This setting does not apply to cache snapshotting. For more information on GOMAXPROCS environment variable, see the [`GOMAXPROCS` environment variable](#gomaxprocs-environment-variable) section on this page.

Environment variable: `INFLUXDB_DATA_MAX_CONCURRENT_COMPACTIONS`

### `max-series-per-database = 1000000`

The maximum number of [series](/influxdb/v1.6/concepts/glossary/#series) allowed
per database.
The default setting is one million.
Change the setting to `0` to allow an unlimited number of series per database.

If a point causes the number of series in a database to exceed
`max-series-per-database` InfluxDB will not write the point, and it returns a
`500` with the following error:

```
{"error":"max series per database exceeded: <series>"}
```

> **Note:** Any existing databases with a series count that exceeds `max-series-per-database`
> will continue to accept writes to existing series, but writes that create a
> new series will fail.

Environment variable: `INFLUXDB_DATA_MAX_SERIES_PER_DATABASE`

### `max-values-per-tag = 100000`

The maximum number of [tag values](/influxdb/v1.6/concepts/glossary/#tag-value)
allowed per [tag key](/influxdb/v1.6/concepts/glossary/#tag-key).
The default setting is `100000`.
Change the setting to `0` to allow an unlimited number of tag values per tag
key.
If a tag value causes the number of tag values of a tag key to exceed
`max-values-per-tag` InfluxDB will not write the point, and it returns
a `partial write` error.

Any existing tag keys with tag values that exceed `max-values-per-tag`
will continue to accept writes, but writes that create a new tag value
will fail.

Environment variable: `INFLUXDB_DATA_MAX_VALUES_PER_TAG`

### `tsm-use-madv-willneed = false`

If `true`, then the MMap Advise value `MADV_WILLNEED` advises the kernel about how to handle the mapped memory region in terms of input/output paging and to expect access to the mapped memory region in the near future, with respect to TSM files. Because this setting has been problematic on some kernels (including CentOS and RHEL ), the default is `false`.
Changing the value to `true` might help users who have slow disks in some cases.

Environment variable: `INFLUXDB_TSM_USE_MADV_WILLNEED`

## Query management settings `[coordinator]`

This section contains configuration settings for query management.
For more on managing queries, see [Query Management](/influxdb/v1.6/troubleshooting/query_management/).

### `write-timeout = "10s"`

The time within which a write request must complete on the cluster.

Environment variable: `INFLUXDB_COORDINATOR_WRITE_TIMEOUT`

### `max-concurrent-queries = 0`

The maximum number of running queries allowed on your instance.
The default setting (`0`) allows for an unlimited number of queries.

Environment variable: `INFLUXDB_COORDINATOR_MAX_CONCURRENT_QUERIES`

### `query-timeout = "0s"`

The maximum time for which a query can run on your instance before InfluxDB
kills the query.
The default setting (`0`) allows queries to run with no time restrictions.
This setting is a [duration](#configuration-overview).

Environment variable: `INFLUXDB_COORDINATOR_QUERY_TIMEOUT`

### `log-queries-after = "0s"`

The maximum time a query can run after which InfluxDB logs the query with a
`Detected slow query` message.
The default setting (`"0"`) will never tell InfluxDB to log the query.
This setting is a
[duration](#configuration-overview).

Environment variable: `INFLUXDB_COORDINATOR_LOG_QUERIES_AFTER`

### `max-select-point = 0`

The maximum number of [points](/influxdb/v1.6/concepts/glossary/#point) that a
`SELECT` statement can process.
The default setting (`0`) allows the `SELECT` statement to process an unlimited
number of points.

Environment variable: `INFLUXDB_COORDINATOR_MAX_SELECT_POINT`

### `max-select-series = 0`

The maximum number of [series](/influxdb/v1.6/concepts/glossary/#series) that a
`SELECT` statement can process.
The default setting (`0`) allows the `SELECT` statement to process an unlimited
number of series.

Environment variable: `INFLUXDB_COORDINATOR_MAX_SELECT_SERIES`

### `max-select-buckets = 0`

The maximum number of `GROUP BY time()` buckets that a query can process.
The default setting (`0`) allows a query to process an unlimited number of
buckets.

Environment variable: `INFLUXDB_COORDINATOR_MAX_SELECT_BUCKETS`

## Retention policy settings `[retention]`

The `[retention]` settings control the enforcement of retention policies for evicting old data.

### `enabled = true`

Set to `false` to prevent InfluxDB from enforcing retention policies.

Environment variable: `INFLUXDB_RETENTION_ENABLED`

### `check-interval = "30m0s"`

The rate at which InfluxDB checks to enforce a retention policy.

Environment variable: `INFLUXDB_RETENTION_CHECK_INTERVAL`

## Shard precreation settings [shard-precreation]

The `[shard-precreation]` settings control the precreation of shards so that shards are available before data arrive.
Only shards that, after creation, will have both a start- and end-time in the future are ever created.
Shards that would be wholly or partially in the past are never precreated.

### `enabled = true`

Environment variable: `INFLUXDB_SHARD_PRECREATION_ENABLED`

### `check-interval = "10m"`

Environment variable: `INFLUXDB_SHARD_PRECREATION_CHECK_INTERVAL`

### `advance-period = "30m"`

The maximum period in the future for which InfluxDB precreates shards.
The `30m` default should work for most systems.
Increasing this setting too far in the future can cause inefficiencies.

Environment variable: `INFLUXDB_SHARD_PRECREATION_ADVANCE_PERIOD`

## Monitoring settings `[monitor]`

This section controls InfluxDB's [system self-monitoring](https://github.com/influxdata/influxdb/blob/1.6/monitor/README.md).

By default, InfluxDB writes the data to the `_internal` database.
If that database does not exist, InfluxDB creates it automatically.
The `DEFAULT` retention policy on the `_internal` database is seven days.
If you want to use a retention policy other than the seven-day retention policy, you must [create](/influxdb/v1.6/query_language/database_management/#retention-policy-management) it.

### `store-enabled = true`

Set to `false` to disable recording statistics internally.
If set to `false` it will make it substantially more difficult to diagnose issues with your installation.

Environment variable: `INFLUXDB_MONITOR_STORE_ENABLED`

### `store-database = "_internal"`

The destination database for recorded statistics.

Environment variable: `INFLUXDB_MONITOR_STORE_DATABASE`

### `store-interval = "10s"`

The interval at which InfluxDB records statistics.

Environment variable: `INFLUXDB_MONITOR_STORE_INTERVAL`

## HTTP endpoint settings `[http]`

The `[http]` settings control how InfluxDB configures the HTTP endpoints.
These are the primary mechanisms for getting data into and out of InfluxDB.
Edit the settings in this section to enable HTTPS and authentication.
See [Authentication and Authorization](/influxdb/v1.6/administration/authentication_and_authorization/).

### `enabled = true`

Determines whether HTTP endpoint is enabled. Set to `false` to disable HTTP. Note that the InfluxDB [command line interface (CLI)](/influxdb/v1.6/tools/shell/) connects to the database using the HTTP API.

Environment variable: `INFLUXDB_HTTP_ENABLED`

### `bind-address = ":8086"`

The bind address (port) used by the HTTP service.

Environment variable: `INFLUXDB_HTTP_BIND_ADDRESS`

### `auth-enabled = false`

Determines whether user authentication is enabled over HTTP/HTTPS. Set to `true` to require authentication.

Environment variable: `INFLUXDB_HTTP_AUTH_ENABLED`

### `realm = "InfluxDB"`

The default realm sent back when issuing a basic auth challenge. Realm is the JWT realm used by the HTTP endpoint.

Environment variable: `INFLUXDB_HTTP_REALM`

### `log-enabled = true`

Determines whether HTTP request logging is enabled. Set to `false` to disable logging.

Environment variable: `INFLUXDB_HTTP_LOG_ENABLED`

### `access-log-path = ""`

Determines whether detailed write logging is enabled.
Specifies whether HTTP request logging is written to the specified path when enabled.
If `influxd` is unable to access the specified path, it will log an error and fall back to `stderr`.
When HTTP request logging is enabled, this option specifies the path where log entries should be written.
If unspecified, the default is to write to stderr, which intermingles HTTP logs with internal InfluxDB logging.
If `influxd` is unable to access the specified path, it will log an error and fall back to writing the request log to `stderr`.

Environment variable: `INFLUXDB_ACCESS_LOG_PATH`

### `write-tracing = false`

Determines whether detailed write logging is enabled.
Set to `true` to enable logging for the write payload.
If set to `true`, this will duplicate every write statement in the logs and is thus not recommended for general use.

Environment variable: `INFLUXDB_HTTP_WRITE_TRACING`

### `pprof-enabled = true`

Enable the `/net/http/pprof` endpoint. Useful for troubleshooting and monitoring.

Environment variable: `INFLUXDB_HTTP_PPROF_ENABLED`

### `debug-pprof-enabled = false`

Enable the default `/net/http/pprof` endpoint and bind against `localhost:6060`. Useful for debugging startup performance issues.

### `https-enabled = false`

Determines whether HTTPS is enabled. Set to `true` to enable HTTPS.

Environment variable: `INFLUXDB_HTTP_HTTPS_ENABLED`

### `https-certificate = "/etc/ssl/influxdb.pem"`

The path of the SSL certificate file to use when HTTPS is enabled.

Environment variable: `INFLUXDB_HTTP_HTTPS_CERTIFICATE`

### `https-private-key = ""`

Use a separate private key location.
If only the `https-certificate` is specified, the `httpd` service will try to load the private key from the `https-certificate` file.
If a separate `https-private-key` file is specified, the `httpd` service will load the private key from the `https-private-key` file.

Environment variable: `INFLUXDB_HTTP_HTTPS_PRIVATE_KEY`

### `shared-secret = ""`

The shared secret used for JWT signing.

Environment variable: `INFLUXDB_HTTP_SHARED_SECRET`

### `max-row-limit = 0`

Limits the number of rows that the system can return in a [non-chunked](/influxdb/v1.6/tools/api/#query-string-parameters) query.
The default setting (`0`) allows for an unlimited number of rows.
InfluxDB includes a `"partial":true` tag in the response body if query results exceed the `max-row-limit` setting.

Environment variable: `INFLUXDB_HTTP_MAX_ROW_LIMIT`

### `max-connection-limit = 0`

Limit the number of connections for the HTTP service.  `0` is unlimited.

Environment variable: `INFLUXDB_HTTP_MAX_CONNECTION_LIMIT`

### `unix-socket-enabled = false`

Enable HTTP service over UNIX domain socket. Set to `true` to enable HTTP service over UNIX domain socket.

Environment variable: `INFLUXDB_HTTP_UNIX_SOCKET_ENABLED`

### `bind-socket = "/var/run/influxdb.sock"`

The path of the UNIX domain socket.

Environment variable: `INFLUXDB_HTTP_UNIX_BIND_SOCKET`

### `max-body-size = 25000000`

Specifies the maximum size (in bytes) of a client request body.
When a client sends data that exceeds the configured maximum size, a `413 Request Entity Too Large` HTTP response is returned. Setting this value to `0` disables the limit.

Environment variable: `INFLUXDB_HTTP_MAX_BODY_SIZE`

### `max-concurrent-write-limit = 0`

The maximum number of writes processed concurrently.
Setting this to `0` disables the limit.

Environment variable: `INFLUXDB_HTTP_MAX_CONCURRRENT_WRITE_LIMIT`

### max-enqueued-write-limit = 0

The maximum number of writes queued for processing.
Setting this to `0` disables the limit.

Environment variable: `INFLUXDB_HTTP_MAX_ENQUEUED_WRITE_LIMIT`

### enqueued-write-timeout = 0
The maximum duration for a write to wait in the queue to be processed.
Setting this to `0` or setting `max-concurrent-write-limit` to `0` disables the limit.

Environment variable: `INFLUXDB_HTTP_ENQUEUED_WRITE_TIMEOUT`

## IFQL settings `[ifql]`

Configures the ifql RPC API.

### `enabled = true`

Determines whether the RPC service is enabled.

Environment variable: `INFLUXDB_IFQL_ENABLED`

### `log-enabled = true`

Determines whether additional logging is enabled.

Environment variable: `INFLUXDB_IFQL_LOG_ENABLED`

### `bind-address = ":8082"`

The bind address used by the IFQL RPC service.

Environment variable: `INFLUXDB_IFQL_BIND_ADDRESS`

## Logging settings `[logging]`

Controls how the logger emits logs to the output.

### `format = "auto"`

Determines which log encoder to use for logs.
Available options are `auto`, `logfmt`, and `json`. With the default `auto` option, if the output is to a TTY device (e.g., a terminal), a more user-friendly console encoding is used. If the output is to files, the auto option uses the `logfmt` encoding. The `logfmt` and `json` options are useful for integration with external tools.

Environment variable: `INFLUXDB_LOGGING_FORMAT`

### `level = "info"`

Sets the log level to be emitted. Valid logging level values are `error`, `warn`, `info`(default), and `debug`. Logs that are equal to, or above, the specified level will be emitted.

Environment variable: `INFLUXDB_LOGGING_LEVEL`

### `suppress-logo = false`

Suppresses the logo output that is printed when the program is started.
The logo is always suppressed if `STDOUT` is not a TTY.

Environment variable: `INFLUXDB_LOGGING_SUPPRESS_LOGO`

## Subscription settings `[subscriber]`

This section controls how [Kapacitor](/kapacitor/v1.4/) will receive data.

### `enabled = true`

Set to `false` to disable the subscriber service.

Environment variable: `INFLUXDB_SUBSCRIBER_ENABLED`

### `http-timeout = "30s"`

Controls how long an http request for the subscriber service will run before it times out.

Environment variable: `INFLUXDB_SUBSCRIBER_HTTP_TIMEOUT`

### `insecure-skip-verify = false`

Allows insecure HTTPS connections to subscribers.
This is useful when testing with self-signed certificates.

Environment variable: `INFLUXDB_SUBSCRIBER_INSECURE_SKIP_VERIFY`

### `ca-certs = ""`

The path to the PEM encoded CA certs file.
If the empty string, the default system certs will be used.

Environment variable: `INFLUXDB_SUBSCRIBER_CA_CERTS`

### `write-concurrency = 40`

The number of writer goroutines processing the write channel.

Environment variable: `INFLUXDB_SUBSCRIBER_WRITE_CONCURRENCY`

### `write-buffer-size = 1000`

The number of in-flight writes buffered in the write channel.

Environment variable: `INFLUXDB_SUBSCRIBER_WRITE_BUFFER_SIZE`

## Graphite settings `[[graphite]]`

This section controls one or many listeners for Graphite data.
See the [README](https://github.com/influxdb/influxdb/blob/1.6/services/graphite/README.md) on GitHub for more information.

### `enabled = false`

Set to `true` to enable Graphite input.

Environment variable: `INFLUXDB_GRAPHITE_0_ENABLED`

### `database = "graphite"`

The name of the database that you want to write to.

Environment variable: `INFLUXDB_GRAPHITE_0_DATABASE`

### `retention-policy = ""`

The relevant retention policy.
An empty string is equivalent to the database's `DEFAULT` retention policy.

Environment variable: `INFLUXDB_GRAPHITE_0_RETENTION_POLICY`

### `bind-address = ":2003"`

The default port.

Environment variable: `INFLUXDB_GRAPHITE_0_BIND_ADDRESS`

### `protocol = "tcp"`

Set to `tcp` or `udp`.

Environment variable: `INFLUXDB_GRAPHITE_PROTOCOL`

### `consistency-level = "one"`

The number of nodes that must confirm the write.
If the requirement is not met the return value will be either `partial write` if some points in the batch fail or `write failure` if all points in the batch fail.
For more information, see the Query String Parameters for Writes section in the [Line Protocol Syntax Reference ](/influxdb/v1.6/write_protocols/write_syntax/).

Environment variable: `INFLUXDB_GRAPHITE_CONSISTENCY_LEVEL`

*The next three settings control how batching works.
You should have this enabled otherwise you could get dropped metrics or poor performance.
Batching will buffer points in memory if you have many coming in.*

### `batch-size = 5000`

The input will flush if this many points get buffered.

Environment variable: `INFLUXDB_GRAPHITE_BATCH_SIZE`

### `batch-pending = 10`

The number of batches that may be pending in memory.

Environment variable: `INFLUXDB_GRAPHITE_BATCH_PENDING`

### `batch-timeout = "1s"`

The input will flush at least this often even if it hasn't reached the configured batch-size.

Environment variable: `INFLUXDB_GRAPHITE_BATCH_TIMEOUT`

### `udp-read-buffer = 0`

UDP Read buffer size, 0 means OS default.
UDP listener will fail if set above OS max.

Environment variable: `INFLUXDB_GRAPHITE_UDP_READ_BUFFER`

### `separator = "."`

This string joins multiple matching 'measurement' values providing more control over the final measurement name.

Environment variable: `INFLUXDB_GRAPHITE_SEPARATOR`

## CollectD settings `[[collectd]]`

The `[[collectd]]` settings control the listener for `collectd` data. See the
[README](https://github.com/influxdata/influxdb/tree/master/services/collectd)
on Github for more information.

### `enabled = false`

Set to `true` to enable collectd writes.

Environment variable: `INFLUXDB_COLLECTD_ENABLED`

### `bind-address = ":25826"`

The port.

Environment variable: `INFLUXDB_COLLECTD_BIND_ADDRESS`

### `database = "collectd"`

The name of the database that you want to write to.
This defaults to `collectd`.

Environment variable: `INFLUXDB_COLLECTD_DATABASE`

### `retention-policy = ""`

The relevant retention policy.
An empty string is equivalent to the database's `DEFAULT` retention policy.

Environment variable: `INFLUXDB_COLLECTD_RETENTION_POLICY`

### `typesdb = "/usr/local/share/collectd"`

The collectd service supports either scanning a directory for multiple types
db files, or specifying a single db file.
A sample `types.db` file
can be found
[here](https://github.com/collectd/collectd/blob/master/src/types.db).

Environment variable: `INFLUXDB_COLLECTD_TYPESDB`

### `security-level = "none"`

Environment variable: `INFLUXDB_COLLECTD_SECURITY_LEVEL`

### `auth-file = "/etc/collectd/auth_file"`

Environment variable: `INFLUXDB_COLLECTD_AUTH_FILE`

*The next three settings control how batching works.
You should have this enabled otherwise you could get dropped metrics or poor performance.
Batching will buffer points in memory if you have many coming in.*

### `batch-size = 5000`

The input will flush if this many points get buffered.

Environment variable: `INFLUXDB_COLLECTD_BATCH_SIZE`

### `batch-pending = 10`

The number of batches that may be pending in memory.

Environment variable: `INFLUXDB_COLLECTD_BATCH_PENDING`

### `batch-timeout = "10s"`

The input will flush at least this often even if it hasn't reached the configured batch-size.

Environment variable: `INFLUXDB_COLLECTD_BATCH_TIMEOUT`

### `read-buffer = 0`

UDP Read buffer size, 0 means OS default.
UDP listener will fail if set above OS max.

Environment variable: `INFLUXDB_COLLECTD_READ_BUFFER`

### `parse-multivalue-plugin = "split"`

When set to `split`, multi-value plugin data (e.g. df free:5000,used:1000) will be split into separate measurements (e.g., (df_free, value=5000) (df_used, value=1000)).  When set to `join`, multi-value plugin will be stored as a single multi-value measurement (e.g., (df, free=5000,used=1000)). Defaults to `split`.

## OpenTSDB settings `[[opentsdb]]`

Controls the listener for OpenTSDB data.
See the [README](https://github.com/influxdb/influxdb/blob/1.6/services/opentsdb/README.md) on GitHub for more information.

### `enabled = false`

Set to `true` to enable openTSDB writes.

Environment variable: `INFLUXDB_OPENTSDB_0_ENABLED`

### `bind-address = ":4242"`

The default port.

Environment variable: `INFLUXDB_OPENTSDB_BIND_ADDRESS`

### `database = "opentsdb"`

The name of the database that you want to write to.
If the database does not exist, it will be created automatically when the input is initialized.

Environment variable: `INFLUXDB_OPENTSDB_DATABASE`

### `retention-policy = ""`

The relevant retention policy.
An empty string is equivalent to the database's `DEFAULT` retention policy.

Environment variable: `INFLUXDB_OPENTSDB_RETENTION_POLICY`

### `consistency-level = "one"`

Sets the write consistency level: `any`, `one`, `quorum`, or `all` for writes.

Environment variable: `INFLUXDB_OPENTSDB_CONSISTENCY_LEVEL`

### `tls-enabled = false`

Environment variable: `INFLUXDB_OPENTSDB_TLS_ENABLED`

### `certificate = "/etc/ssl/influxdb.pem"`

Environment variable: `INFLUXDB_OPENTSDB_CERTIFICATE`

### `log-point-errors = true`

Log an error for every malformed point.

Environment variable: `INFLUXDB_OPENTSDB_0_LOG_POINT_ERRORS`

*The next three settings control how batching works.
You should have this enabled otherwise you could get dropped metrics or poor performance.
Only points metrics received over the telnet protocol undergo batching.*

### `batch-size = 1000`

The input will flush if this many points get buffered.

Environment variable: `INFLUXDB_OPENTSDB_BATCH_SIZE`

### `batch-pending = 5`

The number of batches that may be pending in memory.

Environment variable: `INFLUXDB_OPENTSDB_BATCH_PENDING`

### `batch-timeout = "1s"`

The input will flush at least this often even if it hasn't reached the configured batch-size.

Environment variable: `INFLUXDB_OPENTSDB_BATCH_TIMEOUT`

## UDP settings [[udp]]

The `udp` settings control the listeners for InfluxDB line protocol data using UDP.
See the [UDP page](/influxdb/v1.6/write_protocols/udp/) for more information.

### `enabled = false`

Set to `true` to enable writes over UDP.

Environment variable: `INFLUXDB_UDP_ENABLED`

### `bind-address = ":8089"`

An empty string is equivalent to `0.0.0.0`.

Environment variable: `INFLUXDB_UDP_BIND_ADDRESS`

### `database = "udp"`

The name of the database that you want to write to.

Environment variable: `INFLUXDB_UDP_DATABASE`

### `retention-policy = ""`

The relevant retention policy for your data.
An empty string is equivalent to the database's `DEFAULT` retention policy.

Environment variable: `INFLUXDB_UDP_RETENTION_POLICY`

*The next three settings control how batching works.
You should have this enabled otherwise you could get dropped metrics or poor performance.
Batching will buffer points in memory if you have many coming in.*

### `batch-size = 5000`

The input will flush if this many points get buffered.

Environment variable: `INFLUXDB_UDP_0_BATCH_SIZE`

### `batch-pending = 10`

The number of batches that may be pending in memory.

Environment variable: `INFLUXDB_UDP_0_BATCH_PENDING`

### `batch-timeout = "1s"`

The input will flush at least this often even if it hasn't reached the configured batch-size.

Environment variable: `INFLUXDB_UDP_BATCH_TIMEOUT`

### `read-buffer = 0`

UDP read buffer size, 0 means OS default.
UDP listener will fail if set above OS max.

Environment variable: `INFLUXDB_UDP_BATCH_SIZE`

### `precision = ""`

[Time precision](/influxdb/v1.6/query_language/spec/#durations) used when decoding time values.  Defaults to `nanoseconds` which is the default of the database.

Environment variable: `INFLUXDB_UDP_PRECISION`

## Continuous queries settings `[continuous_queries]`

The `[continuous_queries]` settings control how [continuous queries (CQs)](/influxdb/v1.6/concepts/glossary/#continuous-query-cq) run within InfluxDB.
Continuous queries are automated batches of queries that execute over recent time intervals.
InfluxDB executes one auto-generated query per `GROUP BY time()` interval.

### `enabled = true`

Set to `false` to disable CQs.

Environment variable: `INFLUXDB_CONTINUOUS_QUERIES_ENABLED`

### `log-enabled = true`

Set to `false` to disable logging for CQ events.

Environment variable: `INFLUXDB_CONTINUOUS_QUERIES_LOG_ENABLED`

### `query-stats-enabled = false`

When set to true, continuous query execution statistics are written to the default monitor store.

Environment variable: `INFLUXDB_CONTINUOUS_QUERIES_QUERY_STATS_ENABLED`

### `run-interval = "1s"`

The interval at which InfluxDB checks to see if a CQ needs to run. Set this option to the lowest interval at which your CQs run. For example, if your most frequent CQ runs every minute, set `run-interval` to `1m`.

Environment variable: `INFLUXDB_CONTINUOUS_QUERIES_RUN_INTERVAL`


## Transport Layer Security (TLS) settings `[tls]`

Global configuration settings for Transport Layer Security (TLS) in InfluxDB.  

If the TLS configuration settings is not specified, InfluxDB supports all of the cipher suite IDs listed and all TLS versions implemented in the [Constants section of the Go `crypto/tls` package documentation](https://golang.org/pkg/crypto/tls/#pkg-constants), depending on the version of Go used to build InfluxDB.
Use the `SHOW DIAGNOSTICS` command to see the version of Go used to build InfluxDB.

### Recommended server configuration for "modern compatibility"

InfluxData recommends configuring your InfluxDB server's TLS settings for "modern compatibility" that provides a higher level of security and assumes that backward compatibility is not required.
Our recommended TLS configuration settings for `ciphers`, `min-version`, and `max-version` are based on Mozilla's "modern compatibility" TLS server configuration described in [Security/Server Side TLS](https://wiki.mozilla.org/Security/Server_Side_TLS#Modern_compatibility).

InfluxData's recommended TLS settings for "modern compatibility" are specified in the following configuration settings example.

####

```
ciphers = [ "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305",
            "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305",
            "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
            "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
            "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
            "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384"
]

min-version = "tls1.2"

max-version = "tls1.2"

```
> **Important:*** The order of the cipher suite IDs in the `ciphers` setting determines which algorithms are selected by priority. The TLS `min-version` and the `max-version` settings restrict support to TLS 1.2.

### `ciphers = [ "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305", "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256", ]`

Specifies the set of cipher suite IDs to negotiate. If not specified, `ciphers` supports all existing cipher suite IDs listed in the Go `crypto/tls` package. This is consistent with the behavior within previous releases. In this example, only the two specified cipher suite IDs would be supported.

Environment variable: `INFLUXDB_TLS_CIPHERS`

### `min-version = "tls1.0"`

Minimum version of the TLS protocol that will be negotiated. Valid values include: `tls1.0`, `tls1.1`, and `tls1.2`. If not specified, `min-version` is the minimum TLS version specified in the [Go `crypto/tls` package](https://golang.org/pkg/crypto/tls/#pkg-constants). In this example, `tls1.0` specifies the minimum version as TLS 1.0, which is consistent with the behavior of previous InfluxDB releases.

Environment variable: `INFLUXDB_TLS_MIN_VERSION`

### `max-version = "tls1.2"`

Maximum version of the TLS protocol that will be negotiated. Valid values include: `tls1.0`, `tls1.1`, and `tls1.2`. If not specified, `max-version` is the maximum TLS version specified in the [Go `crypto/tls` package](https://golang.org/pkg/crypto/tls/#pkg-constants). In this example, `tls1.2` specifies the maximum version as TLS 1.2, which is consistent with the behavior of previous InfluxDB releases.

Environment variable: `INFLUXDB_TLS_MAX_VERSION`
