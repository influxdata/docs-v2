---
title: Configure InfluxDB Enterprise data nodes
description: >
  Configure InfluxDB Enterprise data node settings and environmental variables.
menu:
  enterprise_influxdb_v1:
    name: Configure data nodes
    parent: Configure
weight: 20
aliases:
  - /enterprise_influxdb/v1/administration/config-data-nodes/
---

- [Data node configuration settings](#data-node-configuration-settings)
  - [Global](#global-settings)
  - [Enterprise license [enterprise]](#enterprise-license-settings)
  - [Meta node `[meta]`](#meta-node-settings)
  - [Data `[data]`](#data-settings)
  - [Cluster `[cluster]` (includes InfluxQL query controls)](#cluster-settings)
  - [Retention `[retention]`](#retention-policy-settings)
  - [Hinted Handoff `[hinted-handoff]`](#hinted-handoff-settings)
  - [Anti-Entropy `[anti-entropy]`](#anti-entropy-ae-settings)
  - [Shard precreation `[shard-precreation]`](#shard-precreation-settings)
  - [Monitor `[monitor]`](#monitor-settings)
  - [HTTP endpoints `[http]`](#http-endpoint-settings)
  - [Logging `[logging]`](#logging-settings)
  - [Subscriber `[subscriber]`](#subscriber-settings)
  - [Graphite `[graphite]`](#graphite-settings)
  - [Collectd `[collectd]`](#collectd-settings)
  - [OpenTSDB `[opentsdb]`](#opentsdb-settings)
  - [UDP `[udp]`](#udp-settings)
  - [Continuous queries `[continuous-queries]`](#continuous-queries-settings)
  - [TLS `[tls]`](#tls-settings)
  - [Flux Query controls `[flux-controller]`](#flux-controller)

## Data node configuration settings

{{% note %}}
The system has internal defaults for every configuration file setting.
View the default settings with the `influxd config` command.
The local configuration file (`/etc/influxdb/influxdb.conf`) overrides any
internal defaults but the configuration file does not need to include
every configuration setting.
Starting with version 1.0.1, most of the settings in the local configuration
file are commented out.
All commented-out settings will be determined by the internal defaults.
{{% /note %}}

-----

## Global settings

#### reporting-disabled

Default is `false`.

Once every 24 hours InfluxDB Enterprise will report usage data to usage.influxdata.com.
The data includes a random ID, os, arch, version, the number of series and other usage data. No data from user databases is ever transmitted.
Change this option to true to disable reporting.

#### bind-address

Default is `":8088"`.

The TCP bind address used by the RPC service for inter-node communication and [backup and restore](/enterprise_influxdb/v1/administration/backup-and-restore/).

Environment variable: `INFLUXDB_BIND_ADDRESS`

#### hostname

Default is `"localhost"`.

The hostname of the [data node](/enterprise_influxdb/v1/concepts/glossary/#data-node). This must be resolvable by all other nodes in the cluster.

Environment variable: `INFLUXDB_HOSTNAME`

#### gossip-frequency

Default is `"3s"`.

How often to update the cluster with this node's internal status.

Environment variable: `INFLUXDB_GOSSIP_FREQUENCY`

#### compact-series-file {metadata="v1.11.4+"}

Default is `false`.

Determines if series files should be compacted on startup. If `true`, InfluxDB
runs [`influxd_inspect -compact-series-file`](/enterprise_influxdb/v1/tools/influx_inspect/#--compact-series-file-)
before starting the `influxd` server.

{{% note %}}
##### Series file compaction

Series files are stored in `_series` directories inside the
[InfluxDB data directory](/enterprise_influxdb/v1/concepts/file-system-layout/#data-node-file-system-layout).
Default: `/var/lib/data/<db-name>/_series`.

When compacting series files on startup:

- If any series files are corrupt, the `influx_inspect` or `influxd` processes on
  the data node may fail to start. In both cases, delete the series file
  directories before restarting the database. InfluxDB automatically
  regenerates the necessary series directories and files when restarting.
- To check if series files are corrupt before starting the database, run the
  [`influx_inspect verify-seriesfile` command](/enterprise_influxdb/v1/tools/influx_inspect/#verify-seriesfile)
  while the database is off-line.
- If series files are large (20+ gigabytes), it may be faster to delete the
  series file directories before starting the database.
{{% /note %}}


-----

## Enterprise license settings

### [enterprise]

The `[enterprise]` section contains the parameters for the meta node's registration with the [InfluxDB Enterprise License Portal](https://portal.influxdata.com/).

#### license-key

Default is `""`.

The license key created for you on [InfluxPortal](https://portal.influxdata.com). The meta node transmits the license key to [portal.influxdata.com](https://portal.influxdata.com) over port 80 or port 443 and receives a temporary JSON license file in return.
The server caches the license file locally.
The data process will only function for a limited time without a valid license file.
You must use the [`license-path` setting](#license-path) if your server cannot communicate with [https://portal.influxdata.com](https://portal.influxdata.com).

{{% warn %}}
Use the same key for all nodes in the same cluster.  
The `license-key` and `license-path` settings are
mutually exclusive and one must remain set to the empty string.
{{% /warn %}}

> **Note:** You must trigger data nodes to reload your configuration. For more information, see how to [renew or update your license key](/enterprise_influxdb/v1/administration/renew-license/).

Environment variable: `INFLUXDB_ENTERPRISE_LICENSE_KEY`

#### license-path

Default is `""`.

The local path to the permanent JSON license file that you received from InfluxData for instances that do not have access to the internet.
The data process will only function for a limited time without a valid license file.
Contact [sales@influxdb.com](mailto:sales@influxdb.com) if a license file is required.

The license file should be saved on every server in the cluster, including Meta, Data, and Enterprise nodes.
The file contains the JSON-formatted license, and must be readable by the `influxdb` user. Each server in the cluster independently verifies its license.

> **Note:** You must trigger data nodes to reload your configuration. For more information, see how to [renew or update your license key](/enterprise_influxdb/v1/administration/renew-license/).

{{% warn %}}
Use the same license file for all nodes in the same cluster.
The `license-key` and `license-path` settings are mutually exclusive and one must remain set to the empty string.
{{% /warn %}}

Environment variable: `INFLUXDB_ENTERPRISE_LICENSE_PATH`

-----

## Meta node settings

### [meta]

Settings related to how the data nodes interact with the meta nodes.

#### dir

Default is `"/var/lib/influxdb/meta"`.

The directory where the cluster metadata is stored.

> **Note:** Data nodes do require a local meta directory.

Environment variable: `INFLUXDB_META_DIR`

#### meta-tls-enabled

Default is `false`.

Whether to use TLS when connecting to meta nodes.
Set to `true` to if [`https-enabled`](#https-enabled) is set to `true`.

Environment variable: `INFLUXDB_META_META_TLS_ENABLED`

#### meta-insecure-tls

Default is `false`.

Allows insecure TLS connections to meta nodes.
This is useful when testing with self-signed certificates.

Set to `true` to allow the data node to accept self-signed certificates if [`https-enabled`](#https-enabled) is set to `true`.

Environment variable: `INFLUXDB_META_META_INSECURE_TLS`

#### meta-auth-enabled

Default is `false`.

This setting must have the same value as the meta nodes' `[meta] auth-enabled` configuration.

Set to `true` if [`auth-enabled`](#auth-enabled) is set to `true` in the meta node configuration files.
For JWT authentication, also see the [`meta-internal-shared-secret`](#meta-internal-shared-secret) configuration option.

Environment variable: `INFLUXDB_META_META_AUTH_ENABLED`

#### meta-internal-shared-secret

Default is `""`.

The shared secret used by the internal API for JWT authentication between InfluxDB nodes.
This value must be the same as the [`internal-shared-secret`](/enterprise_influxdb/v1/administration/configure/config-meta-nodes/#internal-shared-secret)
specified in the meta node configuration file.

Environment variable: `INFLUXDB_META_META_INTERNAL_SHARED_SECRET`

#### retention-autocreate

Default is `true`.

Automatically creates a default [retention policy](/enterprise_influxdb/v1/concepts/glossary/#retention-policy-rp) (RP) when the system creates a database.
The default RP (`autogen`) has an infinite duration, a shard group duration of seven days, and a replication factor set to the number of data nodes in the cluster.
The system targets the `autogen` RP when a write or query does not specify an RP.
Set this option to `false` to prevent the system from creating the `autogen` RP when the system creates a database.

Environment variable: `INFLUXDB_META_RETENTION_AUTOCREATE`

#### logging-enabled

Default is `true`.

Whether log messages are printed for the meta service.

Environment variable: `INFLUXDB_META_LOGGING_ENABLED`

#### password-hash

Default is `bcrypt`.

Configures password hashing algorithm.
Supported options are: `bcrypt` (the default), `pbkdf2-sha256`, and `pbkdf2-sha512`
This setting must have the same value as the meta node option [`meta.password-hash`](/enterprise_influxdb/v1/administration/configure/config-meta-nodes/#password-hash).

For detailed configuration information, see [`meta.password-hash`](/enterprise_influxdb/v1/administration/configure/config-meta-nodes/#password-hash).

Environment variable: `INFLUXDB_META_PASSWORD_HASH`

#### ensure-fips

Default is `false`.

When `true`, enables a FIPS-readiness check on startup.
Default is `false`.

For detailed configuration information, see [`meta.ensure-fips`](/enterprise_influxdb/v1/administration/configure/config-meta-nodes/#ensure-fips).

Environment variable: `INFLUXDB_META_ENSURE_FIPS`

-----

## Data settings

### [data]

Controls where the actual shard data for InfluxDB lives and how it is compacted from the WAL.
"dir" may need to be changed to a suitable place for your system.
The defaults should work for most systems.

#### dir

Default is `"/var/lib/influxdb/data"`.

The directory where the TSM storage engine stores TSM (read-optimized) files.

Environment variable: `INFLUXDB_DATA_DIR`

#### wal-dir

Default is `"/var/lib/influxdb/wal"`.

The directory where the TSM storage engine stores WAL (write-optimized) files.

Environment variable: `INFLUXDB_DATA_WAL_DIR`

#### trace-logging-enabled

Default is `false`.

Trace logging provides more verbose output around the TSM engine.
Turning this on can provide more useful output for debugging TSM engine issues.

Environmental variable: `INFLUXDB_DATA_TRACE_LOGGING_ENABLED`

#### query-log-enabled

Default is `true`.

Whether queries should be logged before execution.
Very useful for troubleshooting, but will log any sensitive data contained within a query.

Environment variable: `INFLUXDB_DATA_QUERY_LOG_ENABLED`

#### query-log-path

An absolute path to the query log file.
The default is `""` (queries aren't logged to a file).

Query logging supports SIGHUP-based log rotation.

The following is an example of a `logrotate` configuration:

```
/var/log/influxdb/queries.log {
        rotate 5
        daily
        compress
        missingok
        notifempty
        create 644 root root
        postrotate
                /bin/kill -HUP `pgrep -x influxd`
        endscript
}
```

#### wal-fsync-delay

Default is `"0s"`.

The amount of time that a write waits before fsyncing.
Use a duration greater than 0 to batch up multiple fsync calls.
This is useful for slower disks or when experiencing WAL write contention.
A value of `0s` fsyncs every write to the WAL.
InfluxData recommends values ranging from `0ms` to `100ms` for non-SSD disks.

Environment variable: `INFLUXDB_DATA_WAL_FSYNC_DELAY`

#### ingress-metric-by-measurement-enabled

Default is `false`.

When `true`, collect statistics of points, values and new series written per-measurement. Metrics are gathered per data node. 
These can be accessed via the `/debug/vars` endpoint and in the `_internal` database if enabled.

Environment variable: `INFLUXDB_DATA_INGRESS_METRIC_BY_MEASUREMENT_ENABLED`

#### ingress-metric-by-login-enabled

Default is `false`.

When `true`, collect statistics of points, values and new series written per-login. Metrics are gathered per data node.
These can be accessed via the `/debug/vars` endpoint and in the `_internal` database if enabled.

Environment variable: `INFLUXDB_DATA_INGRESS_METRIC_BY_LOGIN_ENABLED`

### Data settings for the TSM engine

#### cache-max-memory-size

Default is `1000000000`.

The maximum size in bytes that a shard cache can reach before it starts rejecting writes.

Consider increasing this value if encountering `cache maximum memory size exceeded` errors.

Environment variable: `INFLUXDB_DATA_CACHE_MAX_MEMORY_SIZE`

#### cache-snapshot-memory-size

Default is `26214400`.

The size in bytes at which the TSM engine will snapshot the cache and write it to a TSM file, freeing up memory.

Environment variable: `INFLUXDB_DATA_CACHE_SNAPSHOT_MEMORY_SIZE`

#### cache-snapshot-write-cold-duration

Default is `"10m"`.

The length of time at which the TSM engine will snapshot the cache and write it to a new TSM file if the shard hasn't received writes or deletes.

Environment variable: `INFLUXDB_DATA_CACHE_SNAPSHOT_WRITE_COLD_DURATION`

#### max-concurrent-compactions

Default is `0`.

The maximum number of concurrent full and level compactions that can run at one time.  
A value of `0` (unlimited compactions) results in 50% of `runtime.GOMAXPROCS(0)` used at runtime,
so when 50% of the CPUs aren't available, compactions are limited.
Any number greater than `0` limits compactions to that value.  
This setting does not apply to cache snapshotting.

Environmental variable: `INFLUXDB_DATA_CACHE_MAX_CONCURRENT_COMPACTIONS`

#### compact-throughput

Default is `50331648`.

The maximum number of bytes per seconds TSM compactions write to disk. Default is `"48m"` (48 million).
Note that short bursts are allowed to happen at a possibly larger value, set by `compact-throughput-burst`.

Environment variable: `INFLUXDB_DATA_COMPACT_THROUGHPUT`  


#### compact-throughput-burst

Default is `50331648`.

The maximum number of bytes per seconds TSM compactions write to disk during brief bursts. Default is `"48m"` (48 million).

Environment variable: `INFLUXDB_DATA_COMPACT_THROUGHPUT_BURST`  

#### compact-full-write-cold-duration

Default is `"4h"`.

The duration at which to compact all TSM and TSI files in a shard if it has not received a write or delete.

Environment variable: `INFLUXDB_DATA_COMPACT_FULL_WRITE_COLD_DURATION`

#### index-version

Default is `"inmem"`.

The type of shard index to use for new shards.
The default (`inmem`) is to use an in-memory index that is recreated at startup.
A value of `tsi1` will use a disk-based index that supports higher cardinality datasets.
Value should be enclosed in double quotes.

Environment variable: `INFLUXDB_DATA_INDEX_VERSION`

### In-memory (`inmem`) index settings

#### max-series-per-database

Default is `1000000`.

The maximum number of [series](/enterprise_influxdb/v1/concepts/glossary/#series) allowed per database before writes are dropped.
The default setting is `1000000` (one million).
Change the setting to `0` to allow an unlimited number of series per database.

If a point causes the number of series in a database to exceed
`max-series-per-database`, InfluxDB will not write the point, and it returns a
`500` with the following error:

```bash
{"error":"max series per database exceeded: <series>"}
```

> **Note:** Any existing databases with a series count that exceeds `max-series-per-database`
> will continue to accept writes to existing series, but writes that create a
> new series will fail.

Environment variable: `INFLUXDB_DATA_MAX_SERIES_PER_DATABASE`

#### max-values-per-tag

Default is `100000`.

The maximum number of [tag values](/enterprise_influxdb/v1/concepts/glossary/#tag-value) allowed per [tag key](/enterprise_influxdb/v1/concepts/glossary/#tag-key).
The default value is `100000` (one hundred thousand).
Change the setting to `0` to allow an unlimited number of tag values per tag
key.
If a tag value causes the number of tag values of a tag key to exceed
`max-values-per-tag`, then InfluxDB will not write the point, and it returns
a `partial write` error.

Any existing tag keys with tag values that exceed `max-values-per-tag`
will continue to accept writes, but writes that create a new tag value
will fail.

Environment variable: `INFLUXDB_DATA_MAX_VALUES_PER_TAG`

### TSI (`tsi1`) index settings

#### max-index-log-file-size

Default is `1048576`.

The threshold, in bytes, when an index write-ahead log (WAL) file will compact
into an index file. Lower sizes will cause log files to be compacted more
quickly and result in lower heap usage at the expense of write throughput.
Higher sizes will be compacted less frequently, store more series in-memory,
and provide higher write throughput.
Valid size suffixes are `k`, `m`, or `g` (case-insensitive, 1024 = 1k).
Values without a size suffix are in bytes.

Environment variable: `INFLUXDB_DATA_MAX_INDEX_LOG_FILE_SIZE`

#### series-id-set-cache-size

Default is `100`.

The size of the internal cache used in the TSI index to store previously
calculated series results. Cached results will be returned quickly from the cache rather
than needing to be recalculated when a subsequent query with a matching tag key-value
predicate is executed.
Setting this value to `0` will disable the cache, which may lead to query performance issues.
This value should only be increased if it is known that the set of regularly used
tag key-value predicates across all measurements for a database is larger than 100. An
increase in cache size may lead to an increase in heap usage.

Environment variable: `INFLUXDB_DATA_SERIES_ID_SET_CACHE_SIZE`

-----

## Cluster settings

### [cluster]

Settings related to how data nodes interact with each other, how data is shared across shards, and how InfluxQL queries are managed.

An InfluxDB Enterprise cluster uses remote procedure calls (RPCs) for inter-node communication.
An RPC connection pool manages the stream connections and efficiently uses system resources.
InfluxDB data nodes multiplex RPC streams over a single TCP connection to avoid the overhead of
frequently establishing and destroying TCP connections and exhausting ephemeral ports.
Typically, a data node establishes a single, persistent TCP connection to each of the other data nodes
to perform most RPC requests. In special circumstances, for example, when copying shards,
a single-use TCP connection may be used.

For information on InfluxDB `_internal` measurement statistics related to clusters, RPCs, and shards,
see [Measurements for monitoring InfluxDB Enterprise (`_internal`)](/platform/monitoring/influxdata-platform/tools/measurements-internal/#cluster-enterprise-only).

#### dial-timeout

Default is `"1s"`.

The duration for which the meta node waits for a connection to a remote data node before the meta node attempts to connect to a different remote data node.
This setting applies to queries only.

Environment variable: `INFLUXDB_CLUSTER_DIAL_TIMEOUT`

#### pool-max-idle-time

Default is `"60s"`.

The maximum time that a TCP connection to another data node remains idle in the connection pool.
When the connection is idle longer than the specified duration, the inactive connection is reaped —
retired or recycled — so that the connection pool is not filled with inactive connections. Reaping
idle connections minimizes inactive connections, decreases system load, and prevents system failure.

Environment variable: `INFLUXDB_CLUSTER_POOL_MAX_IDLE_TIME`

#### pool-max-idle-streams

Default is `100`.

The maximum number of idle RPC stream connections to retain in an idle pool between two nodes.
When a new RPC request is issued, a connection is temporarily pulled from the idle pool, used, and then returned.
If an idle pool is full and a stream connection is no longer required, the system closes the stream connection and resources become available.
The number of active streams can exceed the maximum number of idle pool connections,
but are not returned to the idle pool when released.
Creating streams are relatively inexpensive operations to perform,
so it is unlikely that changing this value will measurably improve performance between two nodes.

Environment variable: `INFLUXDB_CLUSTER_POOL_MAX_IDLE_STREAMS`

#### allow-out-of-order-writes

Default is `false`.

By default, this option is set to false and writes are processed in the order that they are received. This means if any points are in the hinted handoff (HH) queue for a shard, all incoming points must go into the HH queue.

If true, writes may process in a different order than they were received. This can reduce the time required to drain the HH queue and increase throughput during recovery.

**Do not enable if your use case involves updating points, which may cause points to be overwritten.** To overwrite an existing point, the measurement name, tag keys and values (if the point includes tags), field keys, and timestamp all have to be the same as a previous write.

For example, if you have two points with the same measurement (`cpu`), field key (`v`), and timestamp (`1234`), the following could happen:

Point 1 (`cpu v=1.0 1234`) arrives at `node1`, attempts to replicate on `node2`, and finds `node2` is down, so point 1 goes to the local HH queue. Now, `node2` comes back online and point 2 `cpu v=20. 1234` arrives at `node1`, overwrites point 1, and is written to `node2` (bypassing the HH queue). Because the point 2 arrives at `node2` before point 1, point 2 is stored before point 1.

Environment variable: `INFLUXDB_CLUSTER_ALLOW_OUT_OF_ORDER`

#### shard-reader-timeout

Default is `"0"`.

The default timeout set on shard readers.
The time in which a query connection must return its response after which the system returns an error.

Environment variable: `INFLUXDB_CLUSTER_SHARD_READER_TIMEOUT`

#### https-enabled

Default is `false`.

Determines whether data nodes use HTTPS to communicate with each other.

Environment variable: `INFLUXDB_CLUSTER_HTTPS_ENABLED`

#### https-certificate

Default is `""`.

The SSL certificate to use when HTTPS is enabled.  
The certificate should be a PEM-encoded bundle of the certificate and key.  
If it is just the certificate, a key must be specified in `https-private-key`.

Environment variable: `INFLUXDB_CLUSTER_HTTPS_CERTIFICATE`

#### https-private-key

Default is `""`.

Use a separate private key location.

Environment variable: `INFLUXDB_CLUSTER_HTTPS_PRIVATE_KEY`

#### https-insecure-tls

Default is `false`.

Whether data nodes will skip certificate validation communicating with each other over HTTPS.
This is useful when testing with self-signed certificates.

Environment variable: `INFLUXDB_CLUSTER_HTTPS_INSECURE_TLS`

#### cluster-tracing

Default is `false`.

Enables cluster trace logging.
Set to `true` to enable logging of cluster communications.
Enable this setting to verify connectivity issues between data nodes.

Environment variable: `INFLUXDB_CLUSTER_CLUSTER_TRACING`

#### write-timeout

Default is `"10s"`.

The duration a write request waits until a "timeout" error is returned to the caller. The default value is 10 seconds.

Environment variable: `INFLUXDB_CLUSTER_WRITE_TIMEOUT`

#### max-concurrent-queries

Default is `0`.

The maximum number of concurrent queries allowed to be executing at one time.  
If a query is executed and exceeds this limit, an error is returned to the caller.  
This limit can be disabled by setting it to `0`.

Environment variable: `INFLUXDB_CLUSTER_MAX_CONCURRENT_QUERIES`

#### max-concurrent-deletes

The default is `1`.

The maximum number of allowed simultaneous `DELETE` calls on a shard.

Environment variable: `INFLUXDB_CLUSTER_MAX_CONCURRENT_DELETES`

#### query-timeout

Default is `"0s"`.

The maximum time a query is allowed to execute before being killed by the system.
This limit can help prevent run away queries.  Setting the value to `0` disables the limit.

Environment variable: `INFLUXDB_CLUSTER_QUERY_TIMEOUT`

#### log-queries-after

Default is `"0s"`.

The time threshold when a query will be logged as a slow query.  
This limit can be set to help discover slow or resource intensive queries.  
Setting the value to `0` disables the slow query logging.

Environment variable: `INFLUXDB_CLUSTER_LOG_QUERIES_AFTER`

#### `log-timedout-queries = false` {metadata="v1.11+"}

Set to `true` to log queries that are killed due to exceeding the `query-timeout`.
The default setting (`false`) will not log timedout queries.

Environment variable: `INFLUXDB_CLUSTER_LOG_TIMEDOUT_QUERIES`

#### max-select-point

Default is `0`.

The maximum number of points a SELECT statement can process.  
A value of `0` will make the maximum point count unlimited.

Environment variable: `INFLUXDB_CLUSTER_MAX_SELECT_POINT`

#### max-select-series

Default is `0`.

The maximum number of series a SELECT can run.
A value of `0` will make the maximum series count unlimited.

Environment variable: `INFLUXDB_CLUSTER_MAX_SELECT_SERIES`

#### max-select-buckets

Default is `0`.

The maximum number of group by time buckets a SELECT can create.  
A value of `0` will make the maximum number of buckets unlimited.

Environment variable: `INFLUXDB_CLUSTER_MAX_SELECT_BUCKETS`

#### termination-query-log = false

Set to `true` to print all running queries to the log when a data node process receives a `SIGTERM` (for example, a k8s process exceeds the container memory limit or the process is terminated).

Environment variable: `INFLUXDB_CLUSTER_TERMINATION_QUERY_LOG`

-----

## Hinted Handoff settings

### [hinted-handoff]

Controls the hinted handoff (HH) queue, which allows data nodes to temporarily cache writes destined for another data node when that data node is unreachable.

#### batch-size

Default is `512000`.

The maximum number of bytes to write to a shard in a single request.

Environment variable: `INFLUXDB_HINTED_HANDOFF_BATCH_SIZE`

#### max-writes-pending

Default is `1024`.

The maximum number of incoming pending writes allowed in the hinted handoff queue.

Environment variable: `INFLUXDB_HINTED_HANDOFF_MAX_WRITES_PENDING`

#### dir

Default is `"/var/lib/influxdb/hh"`.

The hinted handoff directory where the durable queue will be stored on disk.

Environment variable: `INFLUXDB_HINTED_HANDOFF_DIR`

#### enabled

Default is `true`.

Set to `false` to disable hinted handoff.
Disabling hinted handoff is not recommended and can lead to data loss if another data node is unreachable for any length of time.

Environment variable: `INFLUXDB_HINTED_HANDOFF_ENABLED`

#### max-size

Default is `10737418240`.

The maximum size of the hinted handoff queue in bytes.
Each queue is for one and only one other data node in the cluster.
If there are N data nodes in the cluster, each data node may have up to N-1 hinted handoff queues.

Environment variable: `INFLUXDB_HINTED_HANDOFF_MAX_SIZE`

#### max-age

Default is `"168h0m0s"`.

The time interval that writes sit in the queue before they are purged.
The time is determined by how long the batch has been in the queue, not by the timestamps in the data.
If another data node is unreachable for more than the `max-age` it can lead to data loss.

Environment variable: `INFLUXDB_HINTED_HANDOFF_MAX_AGE`

#### retry-concurrency

Default is `20`.

The maximum number of hinted handoff blocks that the source data node attempts to write to each destination data node.
Hinted handoff blocks are sets of data that belong to the same shard and have the same destination data node.

If `retry-concurrency` is 20 and the source data node's hinted handoff has 25 blocks for destination data node A, then the source data node attempts to concurrently write 20 blocks to node A.
If `retry-concurrency` is 20 and the source data node's hinted handoff has 25 blocks for destination data node A and 30 blocks for destination data node B, then the source data node attempts to concurrently write 20 blocks to node A and 20 blocks to node B.
If the source data node successfully writes 20 blocks to a destination data node, it continues to write the remaining hinted handoff data to that destination node in sets of 20 blocks.

If the source data node successfully writes data to destination data nodes, a higher `retry-concurrency` setting can accelerate the rate at which the source data node empties its hinted handoff queue.

Note that increasing `retry-concurrency` also increases network traffic.

Environment variable: `INFLUXDB_HINTED_HANDOFF_RETRY_CONCURRENCY`

#### retry-rate-limit

Default is `0`.

The rate limit (in bytes per second) that hinted handoff retries hints. A value of `0` disables the rate limit.

Environment variable: `INFLUXDB_HINTED_HANDOFF_RETRY_RATE_LIMIT`

#### retry-interval

Default is `"1s"`.

The time period after which the hinted handoff retries a write after the write fails. There is an exponential back-off, which starts at 1 second and increases with each failure until it reaches `retry-max-interval`. Retries will then occur at the `retry-max-interval`. Once there is a successful retry, the waiting period will be reset to the `retry-interval`.

Environment variable: `INFLUXDB_HINTED_HANDOFF_RETRY_INTERVAL`

#### retry-max-interval

Default is `"200s"`.

The maximum interval after which the hinted handoff retries a write after the write fails.

Environment variable: `INFLUXDB_HINTED_HANDOFF_RETRY_MAX_INTERVAL`

#### purge-interval

Default is `"1m0s"`.

The interval at which InfluxDB checks to purge data that are above `max-age`.

Environment variable: `INFLUXDB_HINTED_HANDOFF_PURGE_INTERVAL`

-----

## Anti-Entropy (AE) settings

For information about the Anti-Entropy service, see [Anti-entropy service in InfluxDB Enterprise](/enterprise_influxdb/v1/administration/anti-entropy).

### [anti-entropy]

Controls the copying and repairing of shards to ensure that data nodes contain the shard data they are supposed to.

#### enabled

Default is `false`.

Enables the anti-entropy service.
Default value is `false`.

Environment variable: `INFLUXDB_ANTI_ENTROPY_ENABLED`

#### check-interval

Default is `"5m"`.

The interval of time when anti-entropy checks run on each data node.

Environment variable: `INFLUXDB_ANTI_ENTROPY_CHECK_INTERVAL`

#### max-fetch

Default is `10`.

The maximum number of shards that a single data node will copy or repair in parallel.

Environment variable: `INFLUXDB_ANTI_ENTROPY_MAX_FETCH`

{{% note %}}
Having `max-fetch=10` with higher numbers of shards (100+) can add significant overhead to running nodes.
The more shards you have, the lower this should be set.
If AE is enabled while lowering your `max-fetch`, initially, you'll see
higher CPU load as new shard digest files are created.
The added load drops off after shard digests are completed for existing shards.
{{% /note %}}

#### max-sync

Default is `1`.

The maximum number of concurrent sync operations that should be performed.
Modify this setting only when requested by InfluxData support.

Environment variable: `INFLUXDB_ANTI_ENTROPY_MAX_SYNC`

#### auto-repair-missing

Default is `true`.

Enables missing shards to automatically be repaired.

Environment variable: `INFLUXDB_ANTI_ENTROPY_AUTO_REPAIR_MISSING`

-----

## Retention policy settings

### [retention]

Controls the enforcement of retention policies for evicting old data.

#### enabled

Default is `true`.

Enables retention policy enforcement.
Default value is `true`.

Environment variable: `INFLUXDB_RETENTION_ENABLED`

#### check-interval

Default is `"30m0s"`.

The interval of time when retention policy enforcement checks run.

Environment variable: `INFLUXDB_RETENTION_CHECK_INTERVAL`

-----

## Shard precreation settings

### [shard-precreation]

Controls the precreation of shards, so they are available before data arrives.
Only shards that, after creation, will have both a start- and end-time in the future, will ever be created. Shards are never precreated that would be wholly or partially in the past.

#### enabled

Default is `true`.

Enables the shard precreation service.

Environment variable: `INFLUXDB_SHARD_PRECREATION_ENABLED`

#### check-interval

Default is `"10m"`.

The interval of time when the check to precreate new shards runs.

Environment variable: `INFLUXDB_SHARD_PRECREATION_CHECK_INTERVAL`

#### advance-period

Default is `"30m"`.

The default period ahead of the end time of a shard group that its successor group is created.

Environment variable: `INFLUXDB_SHARD_PRECREATION_ADVANCE_PERIOD`

-----

## Monitor settings

### [monitor]

By default, InfluxDB writes system monitoring data to the `_internal` database.
If that database does not exist, InfluxDB creates it automatically.
The `DEFAULT` retention policy on the `internal` database is seven days.
To change the default seven-day retention policy, you must [create](/enterprise_influxdb/v1/query_language/manage-database/#retention-policy-management) it.

For InfluxDB Enterprise production systems, InfluxData recommends including a dedicated InfluxDB (OSS) monitoring instance for monitoring InfluxDB Enterprise cluster nodes.

* On the dedicated InfluxDB monitoring instance, set `store-enabled = false` to avoid potential performance and storage issues.
* On each InfluxDB cluster node, install a Telegraf input plugin and Telegraf output plugin configured to report data to the dedicated InfluxDB monitoring instance.

#### store-enabled

Default is `true`.

Enables the internal storage of statistics.

Environment variable: `INFLUXDB_MONITOR_STORE_ENABLED`

#### store-database

Default is `"_internal"`.

The destination database for recorded statistics.

Environment variable: `INFLUXDB_MONITOR_STORE_DATABASE`

#### store-interval

Default is `"10s"`.

The interval at which to record statistics.

Environment variable: `INFLUXDB_MONITOR_STORE_INTERVAL`

#### remote-collect-interval

Default is `"10s"`.

The time interval to poll other data nodes' stats when aggregating cluster stats.

Environment variable: `INFLUXDB_MONITOR_REMOTE_COLLECT_INTERVAL`

-----

## HTTP endpoint settings

### [http]

Controls how the HTTP endpoints are configured. These are the primary mechanism for getting data into and out of InfluxDB.

#### enabled

Default is `true`.

Enables HTTP endpoints.

Environment variable: `INFLUXDB_HTTP_ENABLED`

#### flux-enabled

Default is `false`.

Determines whether the Flux query endpoint is enabled. To enable the use of Flux queries, set the value to `true`.

Environment variable: `INFLUXDB_HTTP_FLUX_ENABLED`

#### bind-address

Default is `":8086"`.

The bind address used by the HTTP service.

Environment variable: `INFLUXDB_HTTP_BIND_ADDRESS`

#### auth-enabled

Default is `false`.

Enables HTTP authentication.

Environment variable: `INFLUXDB_HTTP_AUTH_ENABLED`

#### realm

Default is `"InfluxDB"`.

The default realm sent back when issuing a basic authorization challenge.

Environment variable: `INFLUXDB_HTTP_REALM`

#### log-enabled

Default is `true`.

Enables HTTP request logging.

Environment variable: `INFLUXDB_HTTP_LOG_ENABLED`

#### suppress-write-log

Default is `false`.

Determines whether the HTTP write request logs should be suppressed when the log is enabled.

#### access-log-path

Default is `""`.

The path to the access log, which determines whether detailed write logging is enabled using `log-enabled = true`.
Specifies whether HTTP request logging is written to the specified path when enabled.
If `influxd` is unable to access the specified path, it will log an error and fall back to `stderr`.
When HTTP request logging is enabled, this option specifies the path where log entries should be written.
If unspecified, the default is to write to stderr, which intermingles HTTP logs with internal InfluxDB logging.
If `influxd` is unable to access the specified path, it will log an error and fall back to writing the request log to `stderr`.

Environment variable: `INFLUXDB_HTTP_ACCESS_LOG_PATH`

#### access-log-status-filters

Default is `[]`.

Filters which requests should be logged. Each filter is of the pattern `nnn`, `nnx`, or `nxx` where `n` is
a number and `x` is the wildcard for any number.
To filter all `5xx` responses, use the string `5xx`.
If multiple filters are used, then only one has to match.
The default value is no filters, with every request being printed.

Environment variable: `INFLUXDB_HTTP_ACCESS_LOG_STATUS_FILTERS_x`

##### Examples

###### Setting access log status filters using configuration settings

`access-log-status-filter = ["4xx", "5xx"]`

`"4xx"` is in array position `0`
`"5xx"` is in array position `1`

###### Setting access log status filters using environment variables

The input values for the `access-log-status-filters` is an array.
When using environment variables, the values can be supplied as follows.

`INFLUXDB_HTTP_ACCESS_LOG_STATUS_FILTERS_0=4xx`

`INFLUXDB_HTTP_ACCESS_LOG_STATUS_FILTERS_1=5xx`

The `_n` at the end of the environment variable represents the array position of the entry.

#### write-tracing

Default is `false`.

Enables detailed write logging.

Environment variable: `INFLUXDB_HTTP_WRITE_TRACING`

#### pprof-enabled

Default is `true`.

Determines whether the `/pprof` endpoint is enabled.  
This endpoint is used for troubleshooting and monitoring.

Environment variable: `INFLUXDB_HTTP_PPROF_ENABLED`

#### https-enabled

Default is `false`.

Enables HTTPS.

Environment variable: `INFLUXDB_HTTP_HTTPS_ENABLED`

#### https-certificate

Default is `"/etc/ssl/influxdb.pem"`.

The SSL certificate to use when HTTPS is enabled.  
The certificate should be a PEM-encoded bundle of the certificate and key.  
If it is just the certificate, a key must be specified in `https-private-key`.

Environment variable: `INFLUXDB_HTTP_HTTPS_CERTIFICATE`

#### https-private-key

Default is `""`.

The location of the separate private key.

Environment variable: `INFLUXDB_HTTP_HTTPS_PRIVATE_KEY`

#### shared-secret

Default is `""`.

The JWT authorization shared secret used to validate requests using JSON web tokens (JWTs).

Environment variable: `INFLUXDB_HTTP_SHARED_SECRET`

#### max-body-size

Default is `25000000`.

The maximum size, in bytes, of a client request body.
When a HTTP client sends data that exceeds the configured maximum size, a `413 Request Entity Too Large` HTTP response is returned.
To disable the limit, set the value to `0`.

Environment variable: `INFLUXDB_HTTP_MAX_BODY_SIZE`

#### max-row-limit

Default is `0`.

The default chunk size for result sets that should be chunked.
The maximum number of rows that can be returned in a non-chunked query.
The default setting of `0` allows for an unlimited number of rows.
InfluxDB includes a `"partial":true` tag in the response body if query results exceed the `max-row-limit` setting.

Environment variable: `INFLUXDB_HTTP_MAX_ROW_LIMIT`

#### max-connection-limit

Default is `0`.

The maximum number of HTTP connections that may be open at once.  
New connections that would exceed this limit are dropped.  
The default value of `0` disables the limit.

Environment variable: `INFLUXDB_HTTP_MAX_CONNECTION_LIMIT`

#### unix-socket-enabled

Default is `false`.

Enables the HTTP service over the UNIX domain socket.

Environment variable: `INFLUXDB_HTTP_UNIX_SOCKET_ENABLED`

#### bind-socket

Default is `"/var/run/influxdb.sock"`.

The path of the UNIX domain socket.

Environment variable: `INFLUXDB_HTTP_BIND_SOCKET`

#### max-concurrent-write-limit

Default is `0`.

The maximum number of writes processed concurrently.
The default value of `0` disables the limit.

Environment variable: `INFLUXDB_HTTP_MAX_CONCURRENT_WRITE_LIMIT`

#### max-enqueued-write-limit

Default is `0`.

The maximum number of writes queued for processing.
The default value of `0` disables the limit.

Environment variable: `INFLUXDB_HTTP_MAX_ENQUEUED_WRITE_LIMIT`

#### enqueued-write-timeout

Default is `0`.

The maximum duration for a write to wait in the queue to be processed.
Setting this to `0` or setting `max-concurrent-write-limit` to `0` disables the limit.

-----

## Logging settings

### [logging]

#### format

Default is `"logfmt"`.

Determines which log encoder to use for logs.
Valid options are `auto`, `logfmt`, and `json`.
A setting of `auto` will use a more a more user-friendly output format if the output terminal is a TTY, but the format is not as easily machine-readable.
When the output is a non-TTY, `auto` will use `logfmt`.

Environment variable: `INFLUXDB_LOGGING_FORMAT`

#### level

Default is `"info"`.

Determines which level of logs will be emitted.

Environment variable: `INFLUXDB_LOGGING_LEVEL`

#### suppress-logo

Default is `false`.

Suppresses the logo output that is printed when the program is started.

Environment variable: `INFLUXDB_LOGGING_SUPPRESS_LOGO`

-----

## Subscriber settings

### [subscriber]

Controls the subscriptions, which can be used to fork a copy of all data received by the InfluxDB host.

#### enabled

Default is `true`.

Determines whether the subscriber service is enabled.

Environment variable: `INFLUXDB_SUBSCRIBER_ENABLED`

#### http-timeout

Default is `"30s"`.

The default timeout for HTTP writes to subscribers.

Environment variable: `INFLUXDB_SUBSCRIBER_HTTP_TIMEOUT`

#### insecure-skip-verify

Default is `false`.

Allows insecure HTTPS connections to subscribers.
This option is useful when testing with self-signed certificates.

Environment variable: `INFLUXDB_SUBSCRIBER_INSECURE_SKIP_VERIFY`

#### ca-certs

Default is `""`.

The path to the PEM-encoded CA certs file.
If the set to the empty string (`""`), the default system certs will used.

Environment variable: `INFLUXDB_SUBSCRIBER_CA_CERTS`

#### write-concurrency

Default is `40`.

The number of writer Goroutines processing the write channel.

Environment variable: `INFLUXDB_SUBSCRIBER_WRITE_CONCURRENCY`

#### write-buffer-size

Default is `1000`.

The number of in-flight writes buffered in the write channel.

Environment variable: `INFLUXDB_SUBSCRIBER_WRITE_BUFFER_SIZE`

#### total-buffer-bytes

Default is `0`.

Total number of bytes allocated to buffering across all subscriptions.
Each named subscription receives an equal share of the total.
`0` means unlimited.
Default is `0`.

Environment variable: `INFLUXDB_SUBSCRIBER_TOTAL_BUFFER_BYTES`

-----

## Graphite settings

### [[graphite]]

This section controls one or many listeners for Graphite data.
For more information, see [Graphite protocol support in InfluxDB](/enterprise_influxdb/v1/supported_protocols/graphite/).

#### enabled

Default is `false`.

Determines whether the graphite endpoint is enabled.

These next lines control how batching works.
You should have this enabled otherwise you could get dropped metrics or poor performance.
Batching will buffer points in memory if you have many coming in.

```toml
# database = "graphite"
# retention-policy = ""
# bind-address = ":2003"
# protocol = "tcp"
# consistency-level = "one"
```

#### batch-size

Default is `5000`.

Flush if this many points get buffered.

#### batch-pending

Default is `10`.

The number of batches that may be pending in memory.

#### batch-timeout

Default is `"1s"`.

Flush at least this often even if we haven't hit buffer limit.

#### udp-read-buffer

Default is `0`.

UDP Read buffer size, `0` means OS default. UDP listener will fail if set above OS max.

#### separator

Default is `"."`.

This string joins multiple matching 'measurement' values providing more control over the final measurement name.

#### tags

Default is `["region=us-east", "zone=1c"]`.

Default tags that will be added to all metrics.  
These can be overridden at the template level or by tags extracted from metric.

#### Templates pattern

```toml
# templates = [
#   "*.app env.service.resource.measurement",
#   # Default template
#   "server.*",
# ]
```

Each template line requires a template pattern.  
It can have an optional filter before the template and separated by spaces.  
It can also have optional extra tags following the template.  
Multiple tags should be separated by commas and no spaces similar to the line protocol format.  
There can be only one default template.

-----

## CollectD settings

The `[[collectd]]` settings control the listener for `collectd` data.
For more information, see [CollectD protocol support in InfluxDB](/enterprise_influxdb/v1/supported_protocols/collectd/).

### [[collectd]]

```toml
# enabled`

Default is `false.
# bind-address = ":25826"
# database = "collectd"
# retention-policy = ""
# typesdb = "/usr/share/collectd/types.db"
```

#### security-level

Default is `""`.

The collectd security level can be "" (or "none"), "sign", or "encrypt".

#### auth-file

Default is `""`.

The path to the `collectd` authorization file.
Must be set if security level is sign or encrypt.


These next lines control how batching works.
You should have this enabled otherwise you could get dropped metrics or poor performance.
Batching will buffer points in memory if you have many coming in.

#### batch-size

Default is `5000`.

Flush if this many points get buffered.

#### batch-pending

Default is `10`.

The number of batches that may be pending in memory.

#### batch-timeout

Default is `"10s"`.

Flush at least this often even if we haven't hit buffer limit.

#### read-buffer

Default is `0`.

UDP Read buffer size, 0 means OS default. UDP listener will fail if set above OS max.

-----

## OpenTSDB settings

Controls the listener for OpenTSDB data.
For more information, see [OpenTSDB protocol support in InfluxDB](/enterprise_influxdb/v1/supported_protocols/opentsdb/).

### [[opentsdb]]

```toml
# enabled = false
# bind-address = ":4242"
# database = "opentsdb"
# retention-policy = ""
# consistency-level = "one"
# tls-enabled = false
# certificate= "/etc/ssl/influxdb.pem"
```

#### log-point-errors

Default is `true`.

Log an error for every malformed point.

#### Settings for batching

These next lines control how batching works.
You should have this enabled otherwise you could get dropped metrics or poor performance.
Only points metrics received over the telnet protocol undergo batching.

#### batch-size

Default is `1000`.

Flush if this many points get buffered.

#### batch-pending

Default is `5`.

The number of batches that may be pending in memory.

#### batch-timeout

Default is `"1s"`.

Flush at least this often even if we haven't hit buffer limit.

-----

## UDP settings

The `[[udp]]` settings control the listeners for InfluxDB line protocol data using UDP.
For more information, see [UDP protocol support in InfluxDB](/enterprise_influxdb/v1/supported_protocols/udp/).

### [[udp]]

```toml
# enabled = false
# bind-address = ":8089"
# database = "udp"
# retention-policy = ""
```

#### precision

Default is `""`.

InfluxDB precision for timestamps on received points ("" or "n", "u", "ms", "s", "m", "h")

These next lines control how batching works. You should have this enabled otherwise you could get dropped metrics or poor performance.
Batching will buffer points in memory if you have many coming in.

#### batch-size

Default is `5000`.

Flush if this many points get buffered.

#### batch-pending

Default is `10`.

The number of batches that may be pending in memory.

#### batch-timeout

Default is `"1s"`.

Will flush at least this often even if we haven't hit buffer limit.

#### read-buffer

Default is `0`.

UDP Read buffer size, 0 means OS default. UDP listener will fail if set above OS max.

-----

## Continuous queries settings

### [continuous_queries]

Controls how continuous queries are run within InfluxDB.

#### enabled

Default is `true`.

Determines whether the continuous query service is enabled.

Environment variable: `INFLUXDB_CONTINUOUS_QUERIES_ENABLED`

#### log-enabled

Default is `true`.

Controls whether queries are logged when executed by the CQ service.

Environment variable: `INFLUXDB_CONTINUOUS_QUERIES_LOG_ENABLED`

#### query-stats-enabled

Default is `false`.

Write continuous query execution statistics to the default monitor store.

Environment variable: `INFLUXDB_CONTINUOUS_QUERIES_QUERY_STATS_ENABLED`

#### run-interval

Default is `"1s"`.

The interval for how often continuous queries will be checked whether they need to run.

Environment variable: `INFLUXDB_CONTINUOUS_QUERIES_RUN_INTERVAL`

-----

## TLS settings


### [tls]

Global configuration settings for Transport Layer Security (TLS) in InfluxDB.  

If the TLS configuration settings is not specified, InfluxDB supports all of the cipher suite IDs listed and all TLS versions implemented in the [Constants section of the Go `crypto/tls` package documentation](https://golang.org/pkg/crypto/tls/#pkg-constants), depending on the version of Go used to build InfluxDB.
Use the `SHOW DIAGNOSTICS` command to see the version of Go used to build InfluxDB.

### Recommended server configuration for "modern compatibility"

InfluxData recommends configuring your InfluxDB server's TLS settings for "modern compatibility" that provides a higher level of security and assumes that backward compatibility is not required.
Our recommended TLS configuration settings for `ciphers`, `min-version`, and `max-version` are based on Mozilla's "modern compatibility" TLS server configuration described in [Security/Server Side TLS](https://wiki.mozilla.org/Security/Server_Side_TLS#Modern_compatibility).

InfluxData's recommended TLS settings for "modern compatibility" are specified in the following configuration settings example.

#### Recommended "modern compatibility" cipher settings

```toml
ciphers = [ "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305",
            "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305",
            "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
            "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
            "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
            "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384"
]

min-version = "tls1.3"

max-version = "tls1.3"

```

#### min-version

Default is `"tls1.3"`.

Minimum version of the TLS protocol that will be negotiated.
Valid values include: `tls1.0`, `tls1.1`, and `tls1.3`.
If not specified, `min-version` is the minimum TLS version specified in the [Go `crypto/tls` package](https://golang.org/pkg/crypto/tls/#pkg-constants).
In this example, `tls1.3` specifies the minimum version as TLS 1.3.

Environment variable: `INFLUXDB_TLS_MIN_VERSION`

#### max-version

Default is `"tls1.3"`.

The maximum version of the TLS protocol that will be negotiated.
Valid values include: `tls1.0`, `tls1.1`, and `tls1.3`.
If not specified, `max-version` is the maximum TLS version specified in the [Go `crypto/tls` package](https://golang.org/pkg/crypto/tls/#pkg-constants).
In this example, `tls1.3` specifies the maximum version as TLS 1.3.

Environment variable: `INFLUXDB_TLS_MAX_VERSION`

## Flux query management settings

### [flux-controller]

This section contains configuration settings for Flux query management.
For more on managing queries, see [Query Management](/enterprise_influxdb/v1/troubleshooting/query_management/).

#### query-concurrency

Number of queries allowed to execute concurrently.
`0` means unlimited.
Default is `0`.

#### query-initial-memory-bytes

Initial bytes of memory allocated for a query.
`0` means unlimited.
Default is `0`.

#### query-max-memory-bytes

Maximum total bytes of memory allowed for an individual query.
`0` means unlimited.
Default is `0`.

#### total-max-memory-bytes

Maximum total bytes of memory allowed for all running Flux queries.
`0` means unlimited.
Default is `0`.

#### query-queue-size

Maximum number of queries allowed in execution queue.
When queue limit is reached, new queries are rejected.
`0` means unlimited.
Default is `0`.
