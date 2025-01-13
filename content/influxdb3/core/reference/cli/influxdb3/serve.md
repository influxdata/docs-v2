---
title: influxdb3 serve
description: >
  The `influxdb3 serve` command starts the InfluxDB 3 Core server.
menu:
  influxdb3_core:
    parent: influxdb3
    name: influxdb3 serve
weight: 300
---

The `influxdb3 serve` command starts the {{< product-name >}} server.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 serve [OPTIONS] --writer-id <HOST_IDENTIFIER_PREFIX>
```

## Options

| Option           |                                                      | Description                                                                                                               |
| :--------------- | :--------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
|                  | `--object-store`                                     | _See [configuration options](/influxdb3/core/reference/config-options/#object-store)_                                     |
|                  | `--bucket`                                           | _See [configuration options](/influxdb3/core/reference/config-options/#bucket)_                                           |
|                  | `--data-dir`                                         | _See [configuration options](/influxdb3/core/reference/config-options/#data-dir)_                                         |
|                  | `--aws-access-key-id`                                | _See [configuration options](/influxdb3/core/reference/config-options/#aws-access-key-id)_                                |
|                  | `--aws-secret-access-key`                            | _See [configuration options](/influxdb3/core/reference/config-options/#aws-secret-access-key)_                            |
|                  | `--aws-default-region`                               | _See [configuration options](/influxdb3/core/reference/config-options/#aws-default-region)_                               |
|                  | `--aws-endpoint`                                     | _See [configuration options](/influxdb3/core/reference/config-options/#aws-endpoint)_                                     |
|                  | `--aws-session-token`                                | _See [configuration options](/influxdb3/core/reference/config-options/#aws-session-token)_                                |
|                  | `--aws-allow-http`                                   | _See [configuration options](/influxdb3/core/reference/config-options/#aws-allow-http)_                                   |
|                  | `--aws-skip-signature`                               | _See [configuration options](/influxdb3/core/reference/config-options/#aws-skip-signature)_                               |
|                  | `--google-service-account`                           | _See [configuration options](/influxdb3/core/reference/config-options/#google-service-account)_                           |
|                  | `--azure-storage-account`                            | _See [configuration options](/influxdb3/core/reference/config-options/#azure-storage-account)_                            |
|                  | `--azure-storage-access-key`                         | _See [configuration options](/influxdb3/core/reference/config-options/#azure-storage-access-key)_                         |
|                  | `--object-store-connection-limit`                    | _See [configuration options](/influxdb3/core/reference/config-options/#object-store-connection-limit)_                    |
|                  | `--object-store-http2-only`                          | _See [configuration options](/influxdb3/core/reference/config-options/#object-store-http2-only)_                          |
|                  | `--object-store-http2-max-frame-size`                | _See [configuration options](/influxdb3/core/reference/config-options/#object-store-http2-max-frame-size)_                |
|                  | `--object-store-max-retries`                         | _See [configuration options](/influxdb3/core/reference/config-options/#object-store-max-retries)_                         |
|                  | `--object-store-retry-timeout`                       | _See [configuration options](/influxdb3/core/reference/config-options/#object-store-retry-timeout)_                       |
|                  | `--object-store-cache-endpoint`                      | _See [configuration options](/influxdb3/core/reference/config-options/#object-store-cache-endpoint)_                      |
| `-h`             | `--help`                                             | Print help information                                                                                                    |
|                  | `--log-filter`                                       | _See [configuration options](/influxdb3/core/reference/config-options/#log-filter)_                                       |
| `-v`             | `--verbose`                                          | Enable verbose output                                                                                                     |
|                  | `--log-destination`                                  | _See [configuration options](/influxdb3/core/reference/config-options/#log-destination)_                                  |
|                  | `--log-format`                                       | _See [configuration options](/influxdb3/core/reference/config-options/#log-format)_                                       |
|                  | `--traces-exporter`                                  | _See [configuration options](/influxdb3/core/reference/config-options/#traces-exporter)_                                  |
|                  | `--traces-exporter-jaeger-agent-host`                | _See [configuration options](/influxdb3/core/reference/config-options/#traces-exporter-jaeger-agent-host)_                |
|                  | `--traces-exporter-jaeger-agent-port`                | _See [configuration options](/influxdb3/core/reference/config-options/#traces-exporter-jaeger-agent-port)_                |
|                  | `--traces-exporter-jaeger-service-name`              | _See [configuration options](/influxdb3/core/reference/config-options/#traces-exporter-jaeger-service-name)_              |
|                  | `--traces-exporter-jaeger-trace-context-header-name` | _See [configuration options](/influxdb3/core/reference/config-options/#traces-exporter-jaeger-trace-context-header-name)_ |
|                  | `--traces-jaeger-debug-name`                         | _See [configuration options](/influxdb3/core/reference/config-options/#traces-jaeger-debug-name)_                         |
|                  | `--traces-jaeger-tags`                               | _See [configuration options](/influxdb3/core/reference/config-options/#traces-jaeger-tags)_                               |
|                  | `--traces-jaeger-max-msgs-per-second`                | _See [configuration options](/influxdb3/core/reference/config-options/#traces-jaeger-max-msgs-per-second)_                |
|                  | `--datafusion-num-threads`                           | _See [configuration options](/influxdb3/core/reference/config-options/#datafusion-num-threads)_                           |
|                  | `--datafusion-runtime-type`                          | _See [configuration options](/influxdb3/core/reference/config-options/#datafusion-runtime-type)_                          |
|                  | `--datafusion-runtime-disable-lifo-slot`             | _See [configuration options](/influxdb3/core/reference/config-options/#datafusion-runtime-disable-lifo-slot)_             |
|                  | `--datafusion-runtime-event-interval`                | _See [configuration options](/influxdb3/core/reference/config-options/#datafusion-runtime-event-interval)_                |
|                  | `--datafusion-runtime-global-queue-interval`         | _See [configuration options](/influxdb3/core/reference/config-options/#datafusion-runtime-global-queue-interval)_         |
|                  | `--datafusion-runtime-max-blocking-threads`          | _See [configuration options](/influxdb3/core/reference/config-options/#datafusion-runtime-max-blocking-threads)_          |
|                  | `--datafusion-runtime-max-io-events-per-tick`        | _See [configuration options](/influxdb3/core/reference/config-options/#datafusion-runtime-max-io-events-per-tick)_        |
|                  | `--datafusion-runtime-thread-keep-alive`             | _See [configuration options](/influxdb3/core/reference/config-options/#datafusion-runtime-thread-keep-alive)_             |
|                  | `--datafusion-runtime-thread-priority`               | _See [configuration options](/influxdb3/core/reference/config-options/#datafusion-runtime-thread-priority)_               |
|                  | `--datafusion-max-parquet-fanout`                    | _See [configuration options](/influxdb3/core/reference/config-options/#datafusion-max-parquet-fanout)_                    |
|                  | `--datafusion-use-cached-parquet-loader`             | _See [configuration options](/influxdb3/core/reference/config-options/#datafusion-use-cached-parquet-loader)_             |
|                  | `--datafusion-config`                                | _See [configuration options](/influxdb3/core/reference/config-options/#datafusion-config)_                                |
|                  | `--max-http-request-size`                            | _See [configuration options](/influxdb3/core/reference/config-options/#max-http-request-size)_                            |
|                  | `--http-bind`                                        | _See [configuration options](/influxdb3/core/reference/config-options/#http-bind)_                                        |
|                  | `--ram-pool-data-bytes`                              | _See [configuration options](/influxdb3/core/reference/config-options/#ram-pool-data-bytes)_                              |
|                  | `--exec-mem-pool-bytes`                              | _See [configuration options](/influxdb3/core/reference/config-options/#exec-mem-pool-bytes)_                              |
|                  | `--bearer-token`                                     | _See [configuration options](/influxdb3/core/reference/config-options/#bearer-token)_                                     |
|                  | `--gen1-duration`                                    | _See [configuration options](/influxdb3/core/reference/config-options/#gen1-duration)_                                    |
|                  | `--wal-flush-interval`                               | _See [configuration options](/influxdb3/core/reference/config-options/#wal-flush-interval)_                               |
|                  | `--wal-snapshot-size`                                | _See [configuration options](/influxdb3/core/reference/config-options/#wal-snapshot-size)_                                |
|                  | `--wal-max-write-buffer-size`                        | _See [configuration options](/influxdb3/core/reference/config-options/#wal-max-write-buffer-size)_                        |
|                  | `--snapshotted-wal-files-to-keep`                    | _See [configuration options](/influxdb3/core/reference/config-options/#snapshotted-wal-files-to-keep)_                    |
|                  | `--query-log-size`                                   | _See [configuration options](/influxdb3/core/reference/config-options/#query-log-size)_                                   |
|                  | `--buffer-mem-limit-mb`                              | _See [configuration options](/influxdb3/core/reference/config-options/#buffer-mem-limit-mb)_                              |
| {{< req "\*" >}} | `--writer-id`                                        | _See [configuration options](/influxdb3/core/reference/config-options/#writer-id)_                                        |
|                  | `--parquet-mem-cache-size-mb`                        | _See [configuration options](/influxdb3/core/reference/config-options/#parquet-mem-cache-size-mb)_                        |
|                  | `--parquet-mem-cache-prune-percentage`               | _See [configuration options](/influxdb3/core/reference/config-options/#parquet-mem-cache-prune-percentage)_               |
|                  | `--parquet-mem-cache-prune-interval`                 | _See [configuration options](/influxdb3/core/reference/config-options/#parquet-mem-cache-prune-interval)_                 |
|                  | `--disable-parquet-mem-cache`                        | _See [configuration options](/influxdb3/core/reference/config-options/#disable-parquet-mem-cache)_                        |
|                  | `--last-cache-eviction-interval`                     | _See [configuration options](/influxdb3/core/reference/config-options/#last-cache-eviction-interval)_                     |
|                  | `--distinct-cache-eviction-interval`                 | _See [configuration options](/influxdb3/core/reference/config-options/#distinct-cache-eviction-interval)_                 |
|                  | `--plugin-dir`                                       | _See [configuration options](/influxdb3/core/reference/config-options/#plugin-dir)_                                       |
|                  | `--force-snapshot-mem-threshold`                     | _See [configuration options](/influxdb3/core/reference/config-options/#force-snapshot-mem-threshold)_                     |

{{< caption >}}
{{< req text="\* Required options" >}}
{{< /caption >}}

### Option environment variables

You can use environment variables to define most `influxdb3 serve` options.
For more information, see
[Configuration options](/influxdb3/core/reference/config-options/).

## Examples

- [Run the InfluxDB 3 server](#run-the-influxdb-3-server)
- [Run the InfluxDB 3 server with extra verbose logging](#run-the-influxdb-3-server-with-extra-verbose-logging)
- [Run InfluxDB 3 with debug logging using LOG_FILTER](#run-influxdb-3-with-debug-logging-using-log_filter)

In the examples below, replace
{{% code-placeholder-key %}}`MY_HOST_ID`{{% /code-placeholder-key %}}:
with a unique identifier for your {{< product-name >}} server.

{{% code-placeholders "MY_HOST_ID" %}}

### Run the InfluxDB 3 server

<!--pytest.mark.skip-->

```bash
influxdb3 serve \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --writer-id MY_HOST_ID
```

### Run the InfluxDB 3 server with extra verbose logging

<!--pytest.mark.skip-->

```bash
influxdb3 serve \
  --verbose \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --writer-id MY_HOST_ID
```

### Run InfluxDB 3 with debug logging using LOG_FILTER

<!--pytest.mark.skip-->

```bash
LOG_FILTER=debug influxdb3 serve \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --writer-id MY_HOST_ID
```

{{% /code-placeholders %}}