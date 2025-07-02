---
title: InfluxDB 3 Enterprise configuration options
description: >
  InfluxDB 3 Enterprise lets you customize your server configuration by using
  `influxdb3 serve` command options or by setting environment variables.
menu:
  influxdb3_enterprise:
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

##### Example `influxdb3 serve` command options

<!--pytest.mark.skip-->

```sh
influxdb3 serve \
  --node-id node0 \
  --cluster-id cluster0 \
  --license-email example@email.com \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --log-filter info
```

##### Example environment variables

<!--pytest.mark.skip-->

```sh
export INFLUXDB3_ENTERPRISE_LICENSE_EMAIL=example@email.com
export INFLUXDB3_OBJECT_STORE=file
export INFLUXDB3_DB_DIR=~/.influxdb3
export LOG_FILTER=info

influxdb3 serve
```

## Server configuration options

- [General](#general)
  - [cluster-id](#cluster-id)
  - [data-dir](#data-dir)
  - [license-email](#license-email)
  - [license-file](#license-file)
  - [mode](#mode)
  - [node-id](#node-id)
  - [node-id-from-env](#node-id-from-env)
  - [object-store](#object-store)
  - [tls-key](#tls-key)
  - [tls-cert](#tls-cert)
  - [tls-minimum-versions](#tls-minimum-version)
  - [without-auth](#without-auth)
  - [disable-authz](#disable-authz)
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
- [Memory](#memory)
  - [exec-mem-pool-bytes](#exec-mem-pool-bytes)
  - [force-snapshot-mem-threshold](#force-snapshot-mem-threshold)
- [Write-Ahead Log (WAL)](#write-ahead-log-wal)
  - [wal-flush-interval](#wal-flush-interval)
  - [wal-snapshot-size](#wal-snapshot-size)
  - [wal-max-write-buffer-size](#wal-max-write-buffer-size)
  - [snapshotted-wal-files-to-keep](#snapshotted-wal-files-to-keep)
- [Compaction](#compaction)
  - [compaction-row-limit](#compaction-row-limit)
  - [compaction-max-num-files-per-plan](#compaction-max-num-files-per-plan)
  - [compaction-gen2-duration](#compaction-gen2-duration)
  - [compaction-multipliers](#compaction-multipliers)
  - [gen1-duration](#gen1-duration)
- [Caching](#caching)
  - [preemptive-cache-age](#preemptive-cache-age)
  - [parquet-mem-cache-size](#parquet-mem-cache-size)
  - [parquet-mem-cache-prune-percentage](#parquet-mem-cache-prune-percentage)
  - [parquet-mem-cache-prune-interval](#parquet-mem-cache-prune-interval)
  - [parquet-mem-cache-query-path-duration](#parquet-mem-cache-query-path-duration)
  - [disable-parquet-mem-cache](#disable-parquet-mem-cache)
  - [last-cache-eviction-interval](#last-cache-eviction-interval)
  - [last-value-cache-disable-from-history](#last-value-cache-disable-from-history)
  - [distinct-cache-eviction-interval](#distinct-cache-eviction-interval)
  - [distinct-value-cache-disable-from-history](#distinct-value-cache-disable-from-history)
  - [query-file-limit](#query-file-limit)
- [Processing Engine](#processing-engine)
  - [plugin-dir](#plugin-dir)
  - [virtual-env-location](#virtual-env-location)
  - [package-manager](#package-manager)
  
---

### General

- [cluster-id](#cluster-id)
- [data-dir](#data-dir)
- [license-email](#license-email)
- [license-file](#license-file)
- [mode](#mode)
- [node-id](#node-id)
- [object-store](#object-store)
- [query-file-limit](#query-file-limit)

#### cluster-id

Specifies the cluster identifier that prefixes the object store path for the Enterprise Catalog. 
This value must be different than the [`--node-id`](#node-id) value.

| influxdb3 serve option | Environment variable               |
| :--------------------- | :--------------------------------- |
| `--cluster-id`         | `INFLUXDB3_ENTERPRISE_CLUSTER_ID`  |

---

#### data-dir

For the `file` object store, defines the location {{< product-name >}} uses to store files locally.
Required when using the `file` [object store](#object-store).

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--data-dir`           | `INFLUXDB3_DB_DIR`   |

---

#### license-email

Specifies the email address to associate with your {{< product-name >}} license
and automatically responds to the interactive email prompt when the server starts.
This option is mutually exclusive with [license-file](#license-file).

| influxdb3 serve option | Environment variable                 |
| :--------------------- | :----------------------------------- |
| `--license-email`      | `INFLUXDB3_ENTERPRISE_LICENSE_EMAIL` |

---

#### license-file

Specifies the path to a license file for {{< product-name >}}. When provided, the license
file's contents are used instead of requesting a new license.
This option is mutually exclusive with [license-email](#license-email).

| influxdb3 serve option | Environment variable                 |
| :--------------------- | :----------------------------------- |
| `--license-file`       | `INFLUXDB3_ENTERPRISE_LICENSE_FILE`  |

---

#### mode

Sets the mode to start the server in.

This option supports the following values:

- `all` _(default)_: Enables all server modes
- `ingest`: Enables only data ingest capabilities
- `query`: Enables only query capabilities
- `compact`: Enables only compaction processes
- `process`: Enables only data processing capabilities

You can specify multiple modes using a comma-delimited list (for example, `ingest,query`).

**Default:** `all`

| influxdb3 serve option | Environment variable        |
| :--------------------- | :-------------------------- |
| `--mode`               | `INFLUXDB3_ENTERPRISE_MODE` |

---

#### node-id

Specifies the node identifier used as a prefix in all object store file paths.
This should be unique for any hosts sharing the same object store
configuration--for example, the same bucket.

| influxdb3 serve option | Environment variable               |
| :--------------------- | :--------------------------------- |
| `--node-id`            | `INFLUXDB3_NODE_IDENTIFIER_PREFIX` |


#### node-id-from-env

Specifies the node identifier used as a prefix in all object store file paths.
Takes the name of an environment variable as an argument and uses the value of that environment variable as the node identifier.
This option cannot be used with the `--node-id` option.

| influxdb3 serve option | Environment variable                 |
| :--------------------- | :----------------------------------- |
| `--node-id-from-env`   | `INFLUXDB3_NODE_IDENTIFIER_FROM_ENV` |

##### Example using --node-id-from-env

```bash
export DATABASE_NODE=node0 && influxdb3 serve \
  --node-id-from-env DATABASE_NODE \
  --cluster-id cluster0 \
  --object-store file \
  --data-dir ~/.influxdb3/data
```

---

#### object-store

Specifies which object storage to use to store Parquet files.
This option supports the following values:

- `memory`: Effectively no object persistence
- `memory-throttled`: Like `memory` but with latency and throughput that somewhat resembles a cloud object store
- `file`: Stores objects in the local filesystem (must also set `--data-dir`)
- `s3`: Amazon S3 (must also set `--bucket`, `--aws-access-key-id`, `--aws-secret-access-key`, and possibly `--aws-default-region`)
- `google`: Google Cloud Storage (must also set `--bucket` and `--google-service-account`)
- `azure`: Microsoft Azure blob storage (must also set `--bucket`, `--azure-storage-account`, and `--azure-storage-access-key`)

| influxdb3 serve option | Environment variable     |
| :--------------------- | :----------------------- |
| `--object-store`       | `INFLUXDB3_OBJECT_STORE` |

---

#### tls-key

The path to a key file for TLS to be enabled.

| influxdb3 serve option | Environment variable   |
| :--------------------- | :--------------------- |
| `--tls-key`            | `INFLUXDB3_TLS_KEY`    |

---

#### tls-cert

The path to a cert file for TLS to be enabled.

| influxdb3 serve option | Environment variable   |
| :--------------------- | :--------------------- |
| `--tls-cert`           | `INFLUXDB3_TLS_CERT`   |

---

#### tls-minimum-version

The minimum version for TLS. 
Valid values are `tls-1.2` or `tls-1.3`.
Default is `tls-1.2`.

| influxdb3 serve option  | Environment variable     |
| :---------------------- | :----------------------- |
| `--tls-minimum-version` | `INFLUXDB3_TLS_MINIMUM_VERSION` |

---

#### without-auth

Disables authentication for all server actions (CLI commands and API requests).
The server processes all requests without requiring tokens or authentication.

---

#### disable-authz

Optionally disable authz by passing in a comma separated list of resources. 
Valid values are `health`, `ping`, and `metrics`.

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

### Memory

- [exec-mem-pool-bytes](#exec-mem-pool-bytes)
- [buffer-mem-limit-mb](#buffer-mem-limit-mb)
- [force-snapshot-mem-threshold](#force-snapshot-mem-threshold)

#### exec-mem-pool-bytes

Specifies the size of memory pool used during query execution.
Can be given as absolute value in bytes or as a percentage of the total available memory--for
example: `8000000000` or `10%`).

**Default:** `20%`

| influxdb3 serve option  | Environment variable            |
| :---------------------- | :------------------------------ |
| `--exec-mem-pool-bytes` | `INFLUXDB3_EXEC_MEM_POOL_BYTES` |

---

#### force-snapshot-mem-threshold
<span id="buffer-mem-limit-mb" />

Specifies the threshold for the internal memory buffer. Supports either a
percentage (portion of available memory) or absolute value in MB--for example: `70%` or `1000`.

**Default:** `50%`

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

- [compaction-row-limit](#compaction-row-limit)
- [compaction-max-num-files-per-plan](#compaction-max-num-files-per-plan)
- [compaction-gen2-duration](#compaction-gen2-duration)
- [compaction-multipliers](#compaction-multipliers)
- [compaction-cleanup-wait](#compaction-cleanup-wait)
- [gen1-duration](#gen1-duration)

#### compaction-row-limit

Specifies the soft limit for the number of rows per file that the compactor
writes. The compactor may write more rows than this limit.

**Default:** `1000000`

| influxdb3 serve option   | Environment variable                        |
| :----------------------- | :------------------------------------------ |
| `--compaction-row-limit` | `INFLUXDB3_ENTERPRISE_COMPACTION_ROW_LIMIT` |

---

#### compaction-max-num-files-per-plan

Sets the maximum number of files included in any compaction plan.

**Default:** `500`

| influxdb3 serve option                | Environment variable                                     |
| :------------------------------------ | :------------------------------------------------------- |
| `--compaction-max-num-files-per-plan` | `INFLUXDB3_ENTERPRISE_COMPACTION_MAX_NUM_FILES_PER_PLAN` |

---

#### compaction-gen2-duration

Specifies the duration of the first level of compaction (gen2). Later levels of
compaction are multiples of this duration. This value should be equal to or
greater than the gen1 duration.

**Default:** `20m`

| influxdb3 serve option       | Environment variable                            |
| :--------------------------- | :---------------------------------------------- |
| `--compaction-gen2-duration` | `INFLUXDB3_ENTERPRISE_COMPACTION_GEN2_DURATION` |

---

#### compaction-multipliers

Specifies a comma-separated list of multiples defining the duration of each
level of compaction. The number of elements in the list determines the number of
compaction levels. The first element specifies the duration of the first level
(gen3); subsequent levels are multiples of the previous level.

**Default:** `3,4,6,5`

| influxdb3 serve option     | Environment variable                          |
| :------------------------- | :-------------------------------------------- |
| `--compaction-multipliers` | `INFLUXDB3_ENTERPRISE_COMPACTION_MULTIPLIERS` |

---

#### compaction-cleanup-wait

Specifies the amount of time that the compactor waits after finishing a compaction run
to delete files marked as needing deletion during that compaction run.

**Default:** `10m`

| influxdb3 serve option      | Environment variable                           |
| :-------------------------- | :--------------------------------------------- |
| `--compaction-cleanup-wait` | `INFLUXDB3_ENTERPRISE_COMPACTION_CLEANUP_WAIT` |

---

#### gen1-duration

Specifies the duration that Parquet files are arranged into. Data timestamps
land each row into a file of this duration. Supported durations are `1m`,
`5m`, and `10m`. These files are known as "generation 1" files, which the
compactor can merge into larger generations.

**Default:** `10m`

| influxdb3 serve option | Environment variable      |
| :--------------------- | :------------------------ |
| `--gen1-duration`      | `INFLUXDB3_GEN1_DURATION` |

---

### Caching

- [preemptive-cache-age](#preemptive-cache-age)
- [parquet-mem-cache-size](#parquet-mem-cache-size)
- [parquet-mem-cache-prune-percentage](#parquet-mem-cache-prune-percentage)
- [parquet-mem-cache-prune-interval](#parquet-mem-cache-prune-interval)
- [disable-parquet-mem-cache](#disable-parquet-mem-cache)
- [parquet-mem-cache-query-path-duration](#parquet-mem-cache-query-path-duration)
- [last-cache-eviction-interval](#last-cache-eviction-interval)
- [distinct-cache-eviction-interval](#distinct-cache-eviction-interval)

#### preemptive-cache-age

Specifies the interval to prefetch into the Parquet cache during compaction.

**Default:** `3d`

| influxdb3 serve option   | Environment variable             |
| :----------------------- | :------------------------------- |
| `--preemptive-cache-age` | `INFLUXDB3_PREEMPTIVE_CACHE_AGE` |

---

#### parquet-mem-cache-size
<span id="parquet-mem-cache-size-mb" />

Specifies the size of the in-memory Parquet cache in megabytes or percentage of total available memory.

**Default:** `20%`

| influxdb3 serve option      | Environment variable                |
| :-------------------------- | :---------------------------------- |
| `--parquet-mem-cache-size`  | `INFLUXDB3_PARQUET_MEM_CACHE_SIZE`  |

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

#### parquet-mem-cache-query-path-duration

A [duration](/influxdb3/enterprise/reference/glossary/#duration) that specifies
the time window for caching recent Parquet files in memory. Default is `5h`.

Only files containing data with a timestamp between `now` and `now - duration`
are cached when accessed during queries--for example, with the default `5h` setting:

- Current time: `2024-06-10 15:00:00`
- Cache window: Last 5 hours (`2024-06-10 10:00:00` to now)

If a query requests data from `2024-06-09` (old) and `2024-06-10 14:00` (recent):

- **Cached**: Parquet files with data from `2024-06-10 14:00` (within 5-hour window)
- **Not cached**: Parquet files with data from `2024-06-09` (outside 5-hour window)

| influxdb3 serve option        | Environment variable                  |
| :---------------------------- | :------------------------------------ |
| `--parquet-mem-cache-query-path-duration` | `INFLUXDB3_PARQUET_MEM_CACHE_QUERY_PATH_DURATION` |

---

#### disable-parquet-mem-cache

Disables the in-memory Parquet cache. By default, the cache is enabled.

| influxdb3 serve option        | Environment variable                  |
| :---------------------------- | :------------------------------------ |
| `--disable-parquet-mem-cache` | `INFLUXDB3_DISABLE_PARQUET_MEM_CACHE` |

---

#### last-cache-eviction-interval

Specifies the interval to evict expired entries from the Last-N-Value cache,
expressed as a human-readable duration--for example: `20s`, `1m`, `1h`.

**Default:** `10s`

| influxdb3 serve option           | Environment variable                     |
| :------------------------------- | :--------------------------------------- |
| `--last-cache-eviction-interval` | `INFLUXDB3_LAST_CACHE_EVICTION_INTERVAL` |

---

#### last-value-cache-disable-from-history

Disables populating the last-N-value cache from historical data.
If disabled, the cache is still populated with data from the write-ahead log (WAL).

| influxdb3 serve option                    | Environment variable                              |
| :---------------------------------------- | :------------------------------------------------ |
| `--last-value-cache-disable-from-history` | `INFLUXDB3_LAST_VALUE_CACHE_DISABLE_FROM_HISTORY` |

---

#### distinct-cache-eviction-interval

Specifies the interval to evict expired entries from the distinct value cache,
expressed as a human-readable duration--for example: `20s`, `1m`, `1h`.

**Default:** `10s`

| influxdb3 serve option               | Environment variable                         |
| :----------------------------------- | :------------------------------------------- |
| `--distinct-cache-eviction-interval` | `INFLUXDB3_DISTINCT_CACHE_EVICTION_INTERVAL` |

---

#### distinct-value-cache-disable-from-history

Disables populating the distinct value cache from historical data.
If disabled, the cache is still populated with data from the write-ahead log (WAL).

| influxdb3 serve option                        | Environment variable                                  |
| :-------------------------------------------- | :---------------------------------------------------- |
| `--distinct-value-cache-disable-from-history` | `INFLUXDB3_DISTINCT_VALUE_CACHE_DISABLE_FROM_HISTORY` |
---

#### query-file-limit

Limits the number of Parquet files a query can access.
If a query attempts to read more than this limit, {{% product-name %}} returns an error.

| influxdb3 serve option | Environment variable         |
| :--------------------- | :--------------------------- |
| `--query-file-limit`   | `INFLUXDB3_QUERY_FILE_LIMIT` |

---

### Processing Engine

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
| `--virtual-env-location` | `VIRTUAL_ENV`          |

---

#### package-manager

Specifies the Python package manager that the processing engine uses.

This option supports the following values:

- `discover` _(default)_: Automatically discover available package manager
- `pip`: Use pip package manager
- `uv`: Use uv package manager

**Default:** `discover`

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--package-manager`    | `PACKAGE_MANAGER`    |
