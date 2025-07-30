---
title: '{{< product-name >}} configuration options'
description: >
  InfluxDB 3 Core lets you customize your server configuration by using
  `influxdb3 serve` command options or by setting environment variables.
menu:
  influxdb3_core:
    parent: Reference
    name: Configuration options
weight: 100
---

{{< product-name >}} lets you customize your server configuration by using
`influxdb3 serve` command options or by setting environment variables.

## Configure your server

Pass configuration options to the `influxdb serve` server using either command
options or environment variables. Command options take precedence over
environment variables.

##### Example influxdb3 serve command options

<!--pytest.mark.skip-->

```sh
influxdb3 serve \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --node-id NODE_ID \
  --log-filter info \
  --max-http-request-size 20971520 \
  --aws-allow-http
```

##### Example environment variables

<!--pytest.mark.skip-->

```sh
export INFLUXDB3_OBJECT_STORE=file
export INFLUXDB3_DB_DIR=~/.influxdb3
export INFLUXDB3_WRITER_IDENTIFIER_PREFIX=my-host
export LOG_FILTER=info
export INFLUXDB3_MAX_HTTP_REQUEST_SIZE=20971520
export AWS_ALLOW_HTTP=true

influxdb3 serve
```

## Server configuration options

- [General](#general)
  - [object-store](#object-store)
  - [data-dir](#data-dir)
  - [node-id](#node-id)
  - [query-file-limit](#query-file-limit)
- [AWS](#aws)
  - [aws-access-key-id](#aws-access-key-id)
  - [aws-secret-access-key](#aws-secret-access-key)
  - [aws-default-region](#aws-default-region)
  - [aws-endpoint](#aws-endpoint)
  - [aws-session-token](#aws-session-token)
  - [aws-allow-http](#aws-allow-http)
  - [aws-skip-signature](#aws-skip-signature)
- [Google Cloud Service](#google-cloud-service)
  - [google-service-account](#google-service-account)
- [Microsoft Azure](#microsoft-azure)
  - [azure-storage-account](#azure-storage-account)
  - [azure-storage-access-key](#azure-storage-access-key)
- [Object Storage](#object-storage)
  - [bucket](#bucket)
  - [object-store-connection-limit](#object-store-connection-limit)
  - [object-store-http2-only](#object-store-http2-only)
  - [object-store-http2-max-frame-size](#object-store-http2-max-frame-size)
  - [object-store-max-retries](#object-store-max-retries)
  - [object-store-retry-timeout](#object-store-retry-timeout)
  - [object-store-cache-endpoint](#object-store-cache-endpoint)
- [Logs](#logs)
  - [log-filter](#log-filter)
  - [log-destination](#log-destination)
  - [log-format](#log-format)
  - [query-log-size](#query-log-size)
- [Traces](#traces)
  - [traces-exporter](#traces-exporter)
  - [traces-exporter-jaeger-agent-host](#traces-exporter-jaeger-agent-host)
  - [traces-exporter-jaeger-agent-port](#traces-exporter-jaeger-agent-port)
  - [traces-exporter-jaeger-service-name](#traces-exporter-jaeger-service-name)
  - [traces-exporter-jaeger-trace-context-header-name](#traces-exporter-jaeger-trace-context-header-name)
  - [traces-jaeger-debug-name](#traces-jaeger-debug-name)
  - [traces-jaeger-tags](#traces-jaeger-tags)
  - [traces-jaeger-max-msgs-per-second](#traces-jaeger-max-msgs-per-second)
- [DataFusion](#datafusion)
  - [datafusion-num-threads](#datafusion-num-threads)
  - [datafusion-runtime-type](#datafusion-runtime-type)
  - [datafusion-runtime-disable-lifo-slot](#datafusion-runtime-disable-lifo-slot)
  - [datafusion-runtime-event-interval](#datafusion-runtime-event-interval)
  - [datafusion-runtime-global-queue-interval](#datafusion-runtime-global-queue-interval)
  - [datafusion-runtime-max-blocking-threads](#datafusion-runtime-max-blocking-threads)
  - [datafusion-runtime-max-io-events-per-tick](#datafusion-runtime-max-io-events-per-tick)
  - [datafusion-runtime-thread-keep-alive](#datafusion-runtime-thread-keep-alive)
  - [datafusion-runtime-thread-priority](#datafusion-runtime-thread-priority)
  - [datafusion-max-parquet-fanout](#datafusion-max-parquet-fanout)
  - [datafusion-use-cached-parquet-loader](#datafusion-use-cached-parquet-loader)
  - [datafusion-config](#datafusion-config)
- [HTTP](#http)
  - [max-http-request-size](#max-http-request-size)
  - [http-bind](#http-bind)
  - [admin-token-recovery-http-bind](#admin-token-recovery-http-bind)
- [Memory](#memory)
  - [exec-mem-pool-bytes](#exec-mem-pool-bytes)
  - [buffer-mem-limit-mb](#buffer-mem-limit-mb)
  - [force-snapshot-mem-threshold](#force-snapshot-mem-threshold)
- [Write-Ahead Log (WAL)](#write-ahead-log-wal)
  - [wal-flush-interval](#wal-flush-interval)
  - [wal-snapshot-size](#wal-snapshot-size)
  - [wal-max-write-buffer-size](#wal-max-write-buffer-size)
  - [snapshotted-wal-files-to-keep](#snapshotted-wal-files-to-keep)
- [Compaction](#compaction)
  - [gen1-duration](#gen1-duration)
- [Caching](#caching)
  - [preemptive-cache-age](#preemptive-cache-age)
  - [parquet-mem-cache-size-mb](#parquet-mem-cache-size-mb)
  - [parquet-mem-cache-prune-percentage](#parquet-mem-cache-prune-percentage)
  - [parquet-mem-cache-prune-interval](#parquet-mem-cache-prune-interval)
  - [disable-parquet-mem-cache](#disable-parquet-mem-cache)
  - [last-cache-eviction-interval](#last-cache-eviction-interval)
  - [distinct-cache-eviction-interval](#distinct-cache-eviction-interval)
- [Processing engine](#processing-engine)
  - [plugin-dir](#plugin-dir)
  - [virtual-env-location](#virtual-env-location)
  - [package-manager](#package-manager)

---

### General

- [object-store](#object-store)
- [data-dir](#data-dir)
- [node-id](#node-id)
- [query-file-limit](#query-file-limit)

#### object-store

Specifies which object storage to use to store Parquet files.
This option supports the following values:

- `memory`
- `memory-throttled`
- `file`
- `s3`
- `google`
- `azure`

| influxdb3 serve option | Environment variable     |
| :--------------------- | :----------------------- |
| `--object-store`       | `INFLUXDB3_OBJECT_STORE` |

---

#### data-dir

For the `file` object store, defines the location {{< product-name >}} uses to store files locally.
Required when using the `file` [object store](#object-store).

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--data-dir`           | `INFLUXDB3_DB_DIR`   |

---

#### node-id

Specifies the node identifier used as a prefix in all object store file paths.
Use a unique node identifier for each host sharing the same object store
configuration--for example, the same bucket.

| influxdb3 serve option | Environment variable               |
| :--------------------- | :--------------------------------- |
| `--node-id`            | `INFLUXDB3_NODE_IDENTIFIER_PREFIX` |

---

#### query-file-limit

Limits the number of Parquet files a query can access.

**Default:** `432`

With the default `432` setting and the default [`gen1-duration`](#gen1-duration)
setting of 10 minutes, queries can access up to a 72 hours of data, but
potentially less depending on whether all data for a given 10 minute block of
time was ingested during the same period.

You can increase this limit to allow more files to be queried, but be aware of
the following side-effects:

- Degraded query performance for queries that read more Parquet files
- Increased memory usage
- Your system potentially killing the `influxdb3` process due to Out-of-Memory
  (OOM) errors
- If using object storage to store data, many GET requests to access the data
  (as many as 2 per file)

> [!Note]
> We recommend keeping the default setting and querying smaller time ranges.
> If you need to query longer time ranges or faster query performance on any query
> that accesses an hour or more of data, [InfluxDB 3 Enterprise](/influxdb3/enterprise/)
> optimizes data storage by compacting and rearranging Parquet files to achieve
> faster query performance.

| influxdb3 serve option | Environment variable         |
| :--------------------- | :--------------------------- |
| `--query-file-limit`   | `INFLUXDB3_QUERY_FILE_LIMIT` |

---

### AWS

- [aws-access-key-id](#aws-access-key-id)
- [aws-secret-access-key](#aws-secret-access-key)
- [aws-default-region](#aws-default-region)
- [aws-endpoint](#aws-endpoint)
- [aws-session-token](#aws-session-token)
- [aws-allow-http](#aws-allow-http)
- [aws-skip-signature](#aws-skip-signature)

#### aws-access-key-id

When using Amazon S3 as the object store, set this to an access key that has
permission to read from and write to the specified S3 bucket.

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--aws-access-key-id`  | `AWS_ACCESS_KEY_ID`  |

---

#### aws-secret-access-key

When using Amazon S3 as the object store, set this to the secret access key that
goes with the specified access key ID.

| influxdb3 serve option    | Environment variable    |
| :------------------------ | :---------------------- |
| `--aws-secret-access-key` | `AWS_SECRET_ACCESS_KEY` |

---

#### aws-default-region

When using Amazon S3 as the object store, set this to the region that goes with
the specified bucket if different from the fallback value.

**Default:** `us-east-1`

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--aws-default-region` | `AWS_DEFAULT_REGION` |

---

#### aws-endpoint

When using an Amazon S3 compatibility storage service, set this to the endpoint.

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--aws-endpoint`       | `AWS_ENDPOINT`       |

---

#### aws-session-token

When using Amazon S3 as an object store, set this to the session token. This is
handy when using a federated login or SSO and fetching credentials via the UI.

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--aws-session-token`  | `AWS_SESSION_TOKEN`  |

---

#### aws-allow-http

Allows unencrypted HTTP connections to AWS.

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--aws-allow-http`     | `AWS_ALLOW_HTTP`     |

---

#### aws-skip-signature

If enabled, S3 object stores do not fetch credentials and do not sign requests.

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--aws-skip-signature` | `AWS_SKIP_SIGNATURE` |

---

### Google Cloud Service

- [google-service-account](#google-service-account)

#### google-service-account

When using Google Cloud Storage as the object store, set this to the path to the
JSON file that contains the Google credentials.

| influxdb3 serve option     | Environment variable     |
| :------------------------- | :----------------------- |
| `--google-service-account` | `GOOGLE_SERVICE_ACCOUNT` |

---

### Microsoft Azure

- [azure-storage-account](#azure-storage-account)
- [azure-storage-access-key](#azure-storage-access-key)

#### azure-storage-account

When using Microsoft Azure as the object store, set this to the name you see
when navigating to **All Services > Storage accounts > `[name]`**.

| influxdb3 serve option    | Environment variable    |
| :------------------------ | :---------------------- |
| `--azure-storage-account` | `AZURE_STORAGE_ACCOUNT` |

---

#### azure-storage-access-key

When using Microsoft Azure as the object store, set this to one of the Key
values in the Storage account's **Settings > Access keys**.

| influxdb3 serve option       | Environment variable       |
| :--------------------------- | :------------------------- |
| `--azure-storage-access-key` | `AZURE_STORAGE_ACCESS_KEY` |

---

### Object Storage

- [bucket](#bucket)
- [object-store-connection-limit](#object-store-connection-limit)
- [object-store-http2-only](#object-store-http2-only)
- [object-store-http2-max-frame-size](#object-store-http2-max-frame-size)
- [object-store-max-retries](#object-store-max-retries)
- [object-store-retry-timeout](#object-store-retry-timeout)
- [object-store-cache-endpoint](#object-store-cache-endpoint)

#### bucket

Sets the name of the object storage bucket to use. Must also set
`--object-store` to a cloud object storage for this option to take effect.

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--bucket`             | `INFLUXDB3_BUCKET`   |

---

#### object-store-connection-limit

When using a network-based object store, limits the number of connections to
this value.

**Default:** `16`

| influxdb3 serve option            | Environment variable            |
| :-------------------------------- | :------------------------------ |
| `--object-store-connection-limit` | `OBJECT_STORE_CONNECTION_LIMIT` |

---

#### object-store-http2-only

Forces HTTP/2 connections to network-based object stores.

| influxdb3 serve option      | Environment variable      |
| :-------------------------- | :------------------------ |
| `--object-store-http2-only` | `OBJECT_STORE_HTTP2_ONLY` |

---

#### object-store-http2-max-frame-size

Sets the maximum frame size (in bytes/octets) for HTTP/2 connections.

| influxdb3 serve option                | Environment variable                |
| :------------------------------------ | :---------------------------------- |
| `--object-store-http2-max-frame-size` | `OBJECT_STORE_HTTP2_MAX_FRAME_SIZE` |

---

#### object-store-max-retries

Defines the maximum number of times to retry a request.

| influxdb3 serve option       | Environment variable       |
| :--------------------------- | :------------------------- |
| `--object-store-max-retries` | `OBJECT_STORE_MAX_RETRIES` |

---

#### object-store-retry-timeout

Specifies the maximum length of time from the initial request after which no
further retries are be attempted.

| influxdb3 serve option         | Environment variable         |
| :----------------------------- | :--------------------------- |
| `--object-store-retry-timeout` | `OBJECT_STORE_RETRY_TIMEOUT` |

---

#### object-store-cache-endpoint

Sets the endpoint of an S3-compatible, HTTP/2-enabled object store cache.

| influxdb3 serve option          | Environment variable          |
| :------------------------------ | :---------------------------- |
| `--object-store-cache-endpoint` | `OBJECT_STORE_CACHE_ENDPOINT` |

---

### Logs

- [log-filter](#log-filter)
- [log-destination](#log-destination)
- [log-format](#log-format)
- [query-log-size](#query-log-size)

#### log-filter

Sets the filter directive for logs.

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--log-filter`         | `LOG_FILTER`         |

---

#### log-destination

Specifies the destination for logs.

**Default:** `stdout`

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--log-destination`    | `LOG_DESTINATION`    |

---

#### log-format

Defines the message format for logs.

This option supports the following values:

- `full` _(default)_

**Default:** `full`

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--log-format`         | `LOG_FORMAT`         |

---

#### query-log-size

Defines the size of the query log. Up to this many queries remain in the
log before older queries are evicted to make room for new ones.

**Default:** `1000`

| influxdb3 serve option | Environment variable       |
| :--------------------- | :------------------------- |
| `--query-log-size`     | `INFLUXDB3_QUERY_LOG_SIZE` |

---

### Traces

- [traces-exporter](#traces-exporter)
- [traces-exporter-jaeger-agent-host](#traces-exporter-jaeger-agent-host)
- [traces-exporter-jaeger-agent-port](#traces-exporter-jaeger-agent-port)
- [traces-exporter-jaeger-service-name](#traces-exporter-jaeger-service-name)
- [traces-exporter-jaeger-trace-context-header-name](#traces-exporter-jaeger-trace-context-header-name)
- [traces-jaeger-debug-name](#traces-jaeger-debug-name)
- [traces-jaeger-tags](#traces-jaeger-tags)
- [traces-jaeger-max-msgs-per-second](#traces-jaeger-max-msgs-per-second)

#### traces-exporter

Sets the type of tracing exporter.

**Default:** `none`

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--traces-exporter`    | `TRACES_EXPORTER`    |

---

#### traces-exporter-jaeger-agent-host

Specifies the Jaeger agent network hostname for tracing.

**Default:** `0.0.0.0`

| influxdb3 serve option                | Environment variable                |
| :------------------------------------ | :---------------------------------- |
| `--traces-exporter-jaeger-agent-host` | `TRACES_EXPORTER_JAEGER_AGENT_HOST` |

---

#### traces-exporter-jaeger-agent-port

Defines the Jaeger agent network port for tracing.

**Default:** `6831`

| influxdb3 serve option                | Environment variable                |
| :------------------------------------ | :---------------------------------- |
| `--traces-exporter-jaeger-agent-port` | `TRACES_EXPORTER_JAEGER_AGENT_PORT` |

---

#### traces-exporter-jaeger-service-name

Sets the Jaeger service name for tracing.

**Default:** `iox-conductor`

| influxdb3 serve option                  | Environment variable                  |
| :-------------------------------------- | :------------------------------------ |
| `--traces-exporter-jaeger-service-name` | `TRACES_EXPORTER_JAEGER_SERVICE_NAME` |

---

#### traces-exporter-jaeger-trace-context-header-name

Specifies the header name used for passing trace context.

**Default:** `uber-trace-id`

| influxdb3 serve option                               | Environment variable                               |
| :--------------------------------------------------- | :------------------------------------------------- |
| `--traces-exporter-jaeger-trace-context-header-name` | `TRACES_EXPORTER_JAEGER_TRACE_CONTEXT_HEADER_NAME` |

---

#### traces-jaeger-debug-name

Specifies the header name used for force sampling in tracing.

**Default:** `jaeger-debug-id`

| influxdb3 serve option       | Environment variable                |
| :--------------------------- | :---------------------------------- |
| `--traces-jaeger-debug-name` | `TRACES_EXPORTER_JAEGER_DEBUG_NAME` |

---

#### traces-jaeger-tags

Defines a set of `key=value` pairs to annotate tracing spans with.

| influxdb3 serve option | Environment variable          |
| :--------------------- | :---------------------------- |
| `--traces-jaeger-tags` | `TRACES_EXPORTER_JAEGER_TAGS` |

---

#### traces-jaeger-max-msgs-per-second

Specifies the maximum number of messages sent to a Jaeger service per second.

**Default:** `1000`

| influxdb3 serve option                | Environment variable                |
| :------------------------------------ | :---------------------------------- |
| `--traces-jaeger-max-msgs-per-second` | `TRACES_JAEGER_MAX_MSGS_PER_SECOND` |

---

### DataFusion

- [datafusion-num-threads](#datafusion-num-threads)
- [datafusion-runtime-type](#datafusion-runtime-type)
- [datafusion-runtime-disable-lifo-slot](#datafusion-runtime-disable-lifo-slot)
- [datafusion-runtime-event-interval](#datafusion-runtime-event-interval)
- [datafusion-runtime-global-queue-interval](#datafusion-runtime-global-queue-interval)
- [datafusion-runtime-max-blocking-threads](#datafusion-runtime-max-blocking-threads)
- [datafusion-runtime-max-io-events-per-tick](#datafusion-runtime-max-io-events-per-tick)
- [datafusion-runtime-thread-keep-alive](#datafusion-runtime-thread-keep-alive)
- [datafusion-runtime-thread-priority](#datafusion-runtime-thread-priority)
- [datafusion-max-parquet-fanout](#datafusion-max-parquet-fanout)
- [datafusion-use-cached-parquet-loader](#datafusion-use-cached-parquet-loader)
- [datafusion-config](#datafusion-config)

#### datafusion-num-threads

Sets the maximum number of DataFusion runtime threads to use.

| influxdb3 serve option     | Environment variable               |
| :------------------------- | :--------------------------------- |
| `--datafusion-num-threads` | `INFLUXDB3_DATAFUSION_NUM_THREADS` |

---

#### datafusion-runtime-type

Specifies the DataFusion tokio runtime type.

This option supports the following values:

- `current-thread`
- `multi-thread` _(default)_
- `multi-thread-alt`

**Default:** `multi-thread`

| influxdb3 serve option      | Environment variable                |
| :-------------------------- | :---------------------------------- |
| `--datafusion-runtime-type` | `INFLUXDB3_DATAFUSION_RUNTIME_TYPE` |

---

#### datafusion-runtime-disable-lifo-slot

Disables the LIFO slot of the DataFusion runtime.

This option supports the following values:

- `true`
- `false`

| influxdb3 serve option                   | Environment variable                             |
| :--------------------------------------- | :----------------------------------------------- |
| `--datafusion-runtime-disable-lifo-slot` | `INFLUXDB3_DATAFUSION_RUNTIME_DISABLE_LIFO_SLOT` |

---

#### datafusion-runtime-event-interval

Sets the number of scheduler ticks after which the scheduler of the DataFusion
tokio runtime polls for external events--for example: timers, I/O.

| influxdb3 serve option                | Environment variable                          |
| :------------------------------------ | :-------------------------------------------- |
| `--datafusion-runtime-event-interval` | `INFLUXDB3_DATAFUSION_RUNTIME_EVENT_INTERVAL` |

---

#### datafusion-runtime-global-queue-interval

Sets the number of scheduler ticks after which the scheduler of the DataFusion
runtime polls the global task queue.

| influxdb3 serve option                       | Environment variable                                 |
| :------------------------------------------- | :--------------------------------------------------- |
| `--datafusion-runtime-global-queue-interval` | `INFLUXDB3_DATAFUSION_RUNTIME_GLOBAL_QUEUE_INTERVAL` |

---

#### datafusion-runtime-max-blocking-threads

Specifies the limit for additional threads spawned by the DataFusion runtime.

| influxdb3 serve option                      | Environment variable                                |
| :------------------------------------------ | :-------------------------------------------------- |
| `--datafusion-runtime-max-blocking-threads` | `INFLUXDB3_DATAFUSION_RUNTIME_MAX_BLOCKING_THREADS` |

---

#### datafusion-runtime-max-io-events-per-tick

Configures the maximum number of events processed per tick by the tokio
DataFusion runtime.

| influxdb3 serve option                        | Environment variable                                  |
| :-------------------------------------------- | :---------------------------------------------------- |
| `--datafusion-runtime-max-io-events-per-tick` | `INFLUXDB3_DATAFUSION_RUNTIME_MAX_IO_EVENTS_PER_TICK` |

---

#### datafusion-runtime-thread-keep-alive

Sets a custom timeout for a thread in the blocking pool of the tokio DataFusion
runtime.

| influxdb3 serve option                   | Environment variable                             |
| :--------------------------------------- | :----------------------------------------------- |
| `--datafusion-runtime-thread-keep-alive` | `INFLUXDB3_DATAFUSION_RUNTIME_THREAD_KEEP_ALIVE` |

---

#### datafusion-runtime-thread-priority

Sets the thread priority for tokio DataFusion runtime workers.

**Default:** `10`

| influxdb3 serve option                 | Environment variable                           |
| :------------------------------------- | :--------------------------------------------- |
| `--datafusion-runtime-thread-priority` | `INFLUXDB3_DATAFUSION_RUNTIME_THREAD_PRIORITY` |

---

#### datafusion-max-parquet-fanout

When multiple parquet files are required in a sorted way
(deduplication for example), specifies the maximum fanout.

**Default:** `1000`

| influxdb3 serve option            | Environment variable                      |
| :-------------------------------- | :---------------------------------------- |
| `--datafusion-max-parquet-fanout` | `INFLUXDB3_DATAFUSION_MAX_PARQUET_FANOUT` |

---

#### datafusion-use-cached-parquet-loader

Uses a cached parquet loader when reading parquet files from the object store.

| influxdb3 serve option                   | Environment variable                             |
| :--------------------------------------- | :----------------------------------------------- |
| `--datafusion-use-cached-parquet-loader` | `INFLUXDB3_DATAFUSION_USE_CACHED_PARQUET_LOADER` |

---

#### datafusion-config

Provides custom configuration to DataFusion as a comma-separated list of
`key:value` pairs.

| influxdb3 serve option | Environment variable          |
| :--------------------- | :---------------------------- |
| `--datafusion-config`  | `INFLUXDB3_DATAFUSION_CONFIG` |

---

### HTTP

- [max-http-request-size](#max-http-request-size)
- [http-bind](#http-bind)
- [admin-token-recovery-http-bind](#admin-token-recovery-http-bind)

#### max-http-request-size

Specifies the maximum size of HTTP requests.

**Default:** `10485760`

| influxdb3 serve option    | Environment variable              |
| :------------------------ | :-------------------------------- |
| `--max-http-request-size` | `INFLUXDB3_MAX_HTTP_REQUEST_SIZE` |

---

#### http-bind

Defines the address on which InfluxDB serves HTTP API requests.

**Default:** `0.0.0.0:8181`

| influxdb3 serve option | Environment variable       |
| :--------------------- | :------------------------- |
| `--http-bind`          | `INFLUXDB3_HTTP_BIND_ADDR` |

---

#### admin-token-recovery-http-bind

Enables an admin token recovery HTTP server on a separate port. This server allows regenerating lost admin tokens without existing authentication. The server automatically shuts down after a successful token regeneration.

> [!Warning]
> This option creates an unauthenticated endpoint that can regenerate admin tokens. Only use this when you have lost access to your admin token and ensure the server is only accessible from trusted networks.

**Default:** `127.0.0.1:8182` (when enabled)

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--admin-token-recovery-http-bind` | `INFLUXDB3_ADMIN_TOKEN_RECOVERY_HTTP_BIND` |

##### Example usage

```bash
# Start server with recovery endpoint
influxdb3 serve --admin-token-recovery-http-bind

# In another terminal, regenerate the admin token
influxdb3 create token --admin --regenerate --host http://127.0.0.1:8182
```

---

### Memory

- [exec-mem-pool-bytes](#exec-mem-pool-bytes)
- [buffer-mem-limit-mb](#buffer-mem-limit-mb)
- [force-snapshot-mem-threshold](#force-snapshot-mem-threshold)

#### exec-mem-pool-bytes

Specifies the size of the memory pool used during query execution, in bytes.

**Default:** `8589934592`

| influxdb3 serve option  | Environment variable            |
| :---------------------- | :------------------------------ |
| `--exec-mem-pool-bytes` | `INFLUXDB3_EXEC_MEM_POOL_BYTES` |

---

#### buffer-mem-limit-mb

Specifies the size limit of the buffered data in MB. If this limit is exceeded,
the server forces a snapshot.

**Default:** `5000`

| influxdb3 serve option  | Environment variable            |
| :---------------------- | :------------------------------ |
| `--buffer-mem-limit-mb` | `INFLUXDB3_BUFFER_MEM_LIMIT_MB` |

---

#### force-snapshot-mem-threshold

Specifies the threshold for the internal memory buffer. Supports either a
percentage (portion of available memory)of or absolute value
(total bytes)--for example: `70%` or `100000`.

**Default:** `70%`

| influxdb3 serve option           | Environment variable                     |
| :------------------------------- | :--------------------------------------- |
| `--force-snapshot-mem-threshold` | `INFLUXDB3_FORCE_SNAPSHOT_MEM_THRESHOLD` |

---

### Write-Ahead Log (WAL)

- [wal-flush-interval](#wal-flush-interval)
- [wal-snapshot-size](#wal-snapshot-size)
- [wal-max-write-buffer-size](#wal-max-write-buffer-size)
- [snapshotted-wal-files-to-keep](#snapshotted-wal-files-to-keep)

#### wal-flush-interval

Specifies the interval to flush buffered data to a WAL file. Writes that wait
for WAL confirmation take up to this interval to complete.

**Default:** `1s`

| influxdb3 serve option | Environment variable           |
| :--------------------- | :----------------------------- |
| `--wal-flush-interval` | `INFLUXDB3_WAL_FLUSH_INTERVAL` |

---

#### wal-snapshot-size

Defines the number of WAL files to attempt to remove in a snapshot. This,
multiplied by the interval, determines how often snapshots are taken.

**Default:** `600`

| influxdb3 serve option | Environment variable          |
| :--------------------- | :---------------------------- |
| `--wal-snapshot-size`  | `INFLUXDB3_WAL_SNAPSHOT_SIZE` |

---

#### wal-max-write-buffer-size

Specifies the maximum number of write requests that can be buffered before a
flush must be executed and succeed.

**Default:** `100000`

| influxdb3 serve option        | Environment variable                  |
| :---------------------------- | :------------------------------------ |
| `--wal-max-write-buffer-size` | `INFLUXDB3_WAL_MAX_WRITE_BUFFER_SIZE` |

---

#### snapshotted-wal-files-to-keep

Specifies the number of snapshotted WAL files to retain in the object store.
Flushing the WAL files does not clear the WAL files immediately; 
they are deleted when the number of snapshotted WAL files exceeds this number.

**Default:** `300`

| influxdb3 serve option            | Environment variable              |
| :-------------------------------- | :-------------------------------- |
| `--snapshotted-wal-files-to-keep` | `INFLUXDB3_NUM_WAL_FILES_TO_KEEP` |

---

### Compaction

#### gen1-duration

Specifies the duration that Parquet files are arranged into. Data timestamps
land each row into a file of this duration. Supported durations are `1m`,
`5m`, and `10m`. These files are known as "generation 1" files, which the
compactor in InfluxDB 3 Enterprise can merge into larger generations.

**Default:** `10m`

| influxdb3 serve option | Environment variable      |
| :--------------------- | :------------------------ |
| `--gen1-duration`      | `INFLUXDB3_GEN1_DURATION` |

---

### Caching

- [preemptive-cache-age](#preemptive-cache-age)
- [parquet-mem-cache-size-mb](#parquet-mem-cache-size-mb)
- [parquet-mem-cache-prune-percentage](#parquet-mem-cache-prune-percentage)
- [parquet-mem-cache-prune-interval](#parquet-mem-cache-prune-interval)
- [disable-parquet-mem-cache](#disable-parquet-mem-cache)
- [last-cache-eviction-interval](#last-cache-eviction-interval)
- [distinct-cache-eviction-interval](#distinct-cache-eviction-interval)

#### preemptive-cache-age

Specifies the interval to prefetch into the Parquet cache during compaction.

**Default:** `3d`

| influxdb3 serve option   | Environment variable             |
| :----------------------- | :------------------------------- |
| `--preemptive-cache-age` | `INFLUXDB3_PREEMPTIVE_CACHE_AGE` |

---

#### parquet-mem-cache-size-mb

Defines the size of the in-memory Parquet cache in megabytes (MB).

**Default:** `1000`

| influxdb3 serve option        | Environment variable                  |
| :---------------------------- | :------------------------------------ |
| `--parquet-mem-cache-size-mb` | `INFLUXDB3_PARQUET_MEM_CACHE_SIZE_MB` |

---

#### parquet-mem-cache-prune-percentage

Specifies the percentage of entries to prune during a prune operation on the
in-memory Parquet cache.

**Default:** `0.1`

| influxdb3 serve option                 | Environment variable                           |
| :------------------------------------- | :--------------------------------------------- |
| `--parquet-mem-cache-prune-percentage` | `INFLUXDB3_PARQUET_MEM_CACHE_PRUNE_PERCENTAGE` |

---

#### parquet-mem-cache-prune-interval

Sets the interval to check if the in-memory Parquet cache needs to be pruned.

**Default:** `1s`

| influxdb3 serve option               | Environment variable                         |
| :----------------------------------- | :------------------------------------------- |
| `--parquet-mem-cache-prune-interval` | `INFLUXDB3_PARQUET_MEM_CACHE_PRUNE_INTERVAL` |

---

#### disable-parquet-mem-cache

Disables the in-memory Parquet cache. By default, the cache is enabled.

| influxdb3 serve option        | Environment variable                  |
| :---------------------------- | :------------------------------------ |
| `--disable-parquet-mem-cache` | `INFLUXDB3_DISABLE_PARQUET_MEM_CACHE` |

---

#### last-cache-eviction-interval

Specifies the interval to evict expired entries from the Last-N-Value cache,
expressed as a human-readable time--for example: `20s`, `1m`, `1h`.

**Default:** `10s`

| influxdb3 serve option           | Environment variable                     |
| :------------------------------- | :--------------------------------------- |
| `--last-cache-eviction-interval` | `INFLUXDB3_LAST_CACHE_EVICTION_INTERVAL` |

---

#### distinct-cache-eviction-interval

Specifies the interval to evict expired entries from the distinct value cache,
expressed as a human-readable time--for example: `20s`, `1m`, `1h`.

**Default:** `10s`

| influxdb3 serve option               | Environment variable                         |
| :----------------------------------- | :------------------------------------------- |
| `--distinct-cache-eviction-interval` | `INFLUXDB3_DISTINCT_CACHE_EVICTION_INTERVAL` |

---

### Processing engine

- [plugin-dir](#plugin-dir)
- [virtual-env-location](#virtual-env-location)
- [package-manager](#package-manager)

#### plugin-dir

Specifies the local directory that contains Python plugins and their test files.

| influxdb3 serve option | Environment variable   |
| :--------------------- | :--------------------- |
| `--plugin-dir`         | `INFLUXDB3_PLUGIN_DIR` |

---

#### virtual-env-location

Specifies the location of the Python virtual environment that the processing
engine uses.

| influxdb3 serve option   | Environment variable   |
| :----------------------- | :--------------------- |
| `--virtual-env-location` | `VIRTUAL_ENV_LOCATION` |

---

#### package-manager

Specifies the Python package manager that the processing engine uses.

**Default:** `10s`

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--package-manager`    | `PACKAGE_MANAGER`    |
