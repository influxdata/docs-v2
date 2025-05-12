---
title: influxdb3 serve
description: >
  The `influxdb3 serve` command starts the InfluxDB 3 Enterprise server.
menu:
  influxdb3_enterprise:
    parent: influxdb3
    name: influxdb3 serve
weight: 300
related:
  - /influxdb3/enterprise/reference/config-options/
---

The `influxdb3 serve` command starts the {{< product-name >}} server.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 serve [OPTIONS] \
  --node-id <NODE_IDENTIFIER_PREFIX> \
  --cluster-id <CLUSTER_IDENTIFIER_PREFIX>
```

## Required parameters

- **node-id**: A unique identifier for your server instance. Must be unique for any hosts sharing the same object store.
- **cluster-id**: A unique identifier for your cluster. Must be different from any node-id in your cluster.
- **object-store**: Determines where time series data is stored. _Default is `memory`_.
- **data-dir**: Path for local file storage (required when using `--object-store file`).

> [!NOTE]
> `--node-id` and `--cluster-id` support alphanumeric strings with optional hyphens.

## Options

| Option           |                                                      | Description                                                                                                                     |
| :--------------- | :--------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
|                  | `--aws-access-key-id`                                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-access-key-id)_                                |
|                  | `--aws-allow-http`                                   | _See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-allow-http)_                                   |
|                  | `--aws-default-region`                               | _See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-default-region)_                               |
|                  | `--aws-endpoint`                                     | _See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-endpoint)_                                     |
|                  | `--aws-secret-access-key`                            | _See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-secret-access-key)_                            |
|                  | `--aws-session-token`                                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-session-token)_                                |
|                  | `--aws-skip-signature`                               | _See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-skip-signature)_                               |
|                  | `--azure-storage-access-key`                         | _See [configuration options](/influxdb3/enterprise/reference/config-options/#azure-storage-access-key)_                         |
|                  | `--azure-storage-account`                            | _See [configuration options](/influxdb3/enterprise/reference/config-options/#azure-storage-account)_                            |
|                  | `--bucket`                                           | _See [configuration options](/influxdb3/enterprise/reference/config-options/#bucket)_                                           |
| {{< req "\*" >}} | `--cluster-id`                                       | _See [configuration options](/influxdb3/enterprise/reference/config-options/#cluster-id)_                                       |
|                  | `--compaction-gen2-duration`                         | _See [configuration options](/influxdb3/enterprise/reference/config-options/#compaction-gen2-duration)_                         |
|                  | `--compaction-max-num-files-per-plan`                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#compaction-max-num-files-per-plan)_                |
|                  | `--compaction-multipliers`                           | _See [configuration options](/influxdb3/enterprise/reference/config-options/#compaction-multipliers)_                           |
|                  | `--compaction-row-limit`                             | _See [configuration options](/influxdb3/enterprise/reference/config-options/#compaction-row-limit)_                             |
|                  | `--data-dir`                                         | _See [configuration options](/influxdb3/enterprise/reference/config-options/#data-dir)_                                         |
|                  | `--datafusion-config`                                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-config)_                                |
|                  | `--datafusion-max-parquet-fanout`                    | _See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-max-parquet-fanout)_                    |
|                  | `--datafusion-num-threads`                           | _See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-num-threads)_                           |
|                  | `--datafusion-runtime-disable-lifo-slot`             | _See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-runtime-disable-lifo-slot)_             |
|                  | `--datafusion-runtime-event-interval`                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-runtime-event-interval)_                |
|                  | `--datafusion-runtime-global-queue-interval`         | _See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-runtime-global-queue-interval)_         |
|                  | `--datafusion-runtime-max-blocking-threads`          | _See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-runtime-max-blocking-threads)_          |
|                  | `--datafusion-runtime-max-io-events-per-tick`        | _See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-runtime-max-io-events-per-tick)_        |
|                  | `--datafusion-runtime-thread-keep-alive`             | _See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-runtime-thread-keep-alive)_             |
|                  | `--datafusion-runtime-thread-priority`               | _See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-runtime-thread-priority)_               |
|                  | `--datafusion-runtime-type`                          | _See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-runtime-type)_                          |
|                  | `--datafusion-use-cached-parquet-loader`             | _See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-use-cached-parquet-loader)_             |
|                  | `--disable-parquet-mem-cache`                        | _See [configuration options](/influxdb3/enterprise/reference/config-options/#disable-parquet-mem-cache)_                        |
|                  | `--distinct-cache-eviction-interval`                 | _See [configuration options](/influxdb3/enterprise/reference/config-options/#distinct-cache-eviction-interval)_                 |
|                  | `--exec-mem-pool-bytes`                              | _See [configuration options](/influxdb3/enterprise/reference/config-options/#exec-mem-pool-bytes)_                              |
|                  | `--force-snapshot-mem-threshold`                     | _See [configuration options](/influxdb3/enterprise/reference/config-options/#force-snapshot-mem-threshold)_                     |
|                  | `--gen1-duration`                                    | _See [configuration options](/influxdb3/enterprise/reference/config-options/#gen1-duration)_                                    |
|                  | `--google-service-account`                           | _See [configuration options](/influxdb3/enterprise/reference/config-options/#google-service-account)_                           |
| `-h`             | `--help`                                             | Print help information                                                                                                          |
|                  | `--help-all`                                         | Print detailed help information                                                                                                 |
|                  | `--http-bind`                                        | _See [configuration options](/influxdb3/enterprise/reference/config-options/#http-bind)_                                        |
|                  | `--last-cache-eviction-interval`                     | _See [configuration options](/influxdb3/enterprise/reference/config-options/#last-cache-eviction-interval)_                     |
|                  | `--license-email`                                    | _See [configuration options](/influxdb3/enterprise/reference/config-options/#license-email)_                                    |
|                  | `--license-file`                                     | _See [configuration options](/influxdb3/enterprise/reference/config-options/#license-file)_                                     |
|                  | `--log-destination`                                  | _See [configuration options](/influxdb3/enterprise/reference/config-options/#log-destination)_                                  |
|                  | `--log-filter`                                       | _See [configuration options](/influxdb3/enterprise/reference/config-options/#log-filter)_                                       |
|                  | `--log-format`                                       | _See [configuration options](/influxdb3/enterprise/reference/config-options/#log-format)_                                       |
|                  | `--max-http-request-size`                            | _See [configuration options](/influxdb3/enterprise/reference/config-options/#max-http-request-size)_                            |
|                  | `--mode`                                             | _See [configuration options](/influxdb3/enterprise/reference/config-options/#mode)_                                             |
| {{< req "\*" >}} | `--node-id`                                          | _See [configuration options](/influxdb3/enterprise/reference/config-options/#node-id)_                                          |
|                  | `--object-store`                                     | _See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store)_                                     |
|                  | `--object-store-cache-endpoint`                      | _See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store-cache-endpoint)_                      |
|                  | `--object-store-connection-limit`                    | _See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store-connection-limit)_                    |
|                  | `--object-store-http2-max-frame-size`                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store-http2-max-frame-size)_                |
|                  | `--object-store-http2-only`                          | _See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store-http2-only)_                          |
|                  | `--object-store-max-retries`                         | _See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store-max-retries)_                         |
|                  | `--object-store-retry-timeout`                       | _See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store-retry-timeout)_                       |
|                  | `--package-manager`                                  | _See [configuration options](/influxdb3/enterprise/reference/config-options/#package-manager)_                                  |
|                  | `--parquet-mem-cache-prune-interval`                 | _See [configuration options](/influxdb3/enterprise/reference/config-options/#parquet-mem-cache-prune-interval)_                 |
|                  | `--parquet-mem-cache-prune-percentage`               | _See [configuration options](/influxdb3/enterprise/reference/config-options/#parquet-mem-cache-prune-percentage)_               |
|                  | `--parquet-mem-cache-query-path-duration`            | _See [configuration options](/influxdb3/enterprise/reference/config-options/#parquet-mem-cache-query-path-duration)_            |
|                  | `--parquet-mem-cache-size`                           | _See [configuration options](/influxdb3/enterprise/reference/config-options/#parquet-mem-cache-size)_                           |
|                  | `--plugin-dir`                                       | _See [configuration options](/influxdb3/enterprise/reference/config-options/#plugin-dir)_                                       |
|                  | `--preemptive-cache-age`                             | _See [configuration options](/influxdb3/enterprise/reference/config-options/#preemptive-cache-age)_                             |
|                  | `--query-file-limit`                                 | _See [configuration options](/influxdb3/enterprise/reference/config-options/#query-file-limit)_                                 |
|                  | `--query-log-size`                                   | _See [configuration options](/influxdb3/enterprise/reference/config-options/#query-log-size)_                                   |
|                  | `--replication-interval`                             | _See [configuration options](/influxdb3/enterprise/reference/config-options/#replication-interval)_                             |
|                  | `--snapshotted-wal-files-to-keep`                    | _See [configuration options](/influxdb3/enterprise/reference/config-options/#snapshotted-wal-files-to-keep)_                    |
|                  | `--traces-exporter`                                  | _See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-exporter)_                                  |
|                  | `--traces-exporter-jaeger-agent-host`                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-exporter-jaeger-agent-host)_                |
|                  | `--traces-exporter-jaeger-agent-port`                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-exporter-jaeger-agent-port)_                |
|                  | `--traces-exporter-jaeger-service-name`              | _See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-exporter-jaeger-service-name)_              |
|                  | `--traces-exporter-jaeger-trace-context-header-name` | _See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-exporter-jaeger-trace-context-header-name)_ |
|                  | `--traces-jaeger-debug-name`                         | _See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-jaeger-debug-name)_                         |
|                  | `--traces-jaeger-max-msgs-per-second`                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-jaeger-max-msgs-per-second)_                |
|                  | `--traces-jaeger-tags`                               | _See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-jaeger-tags)_                               |
| `-v`             | `--verbose`                                          | Enable verbose output                                                                                                           |
|                  | `--virtual-env-location`                             | _See [configuration options](/influxdb3/enterprise/reference/config-options/#virtual-env-location)_                             |
|                  | `--wal-flush-interval`                               | _See [configuration options](/influxdb3/enterprise/reference/config-options/#wal-flush-interval)_                               |
|                  | `--wal-max-write-buffer-size`                        | _See [configuration options](/influxdb3/enterprise/reference/config-options/#wal-max-write-buffer-size)_                        |
|                  | `--wal-snapshot-size`                                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#wal-snapshot-size)_                                |

{{< caption >}}
{{< req text="\* Required options" >}}
{{< /caption >}}

### Option environment variables

You can use environment variables to define most `influxdb3 serve` options.
For more information, see
[Configuration options](/influxdb3/enterprise/reference/config-options/).

## Examples

- [Run the InfluxDB 3 server](#run-the-influxdb-3-server)
- [Run the InfluxDB 3 server with extra verbose logging](#run-the-influxdb-3-server-with-extra-verbose-logging)
- [Run InfluxDB 3 with debug logging using LOG_FILTER](#run-influxdb-3-with-debug-logging-using-log_filter)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`my-host-01`{{% /code-placeholder-key %}}:
a unique string that identifies your {{< product-name >}} server.
- {{% code-placeholder-key %}}`my-cluster-01`{{% /code-placeholder-key %}}:
a unique string that identifies your {{< product-name >}} cluster.
The value you use must be different from `--node-id` values in the cluster.

{{% code-placeholders "my-host-01|my-cluster-01" %}}

### Run the InfluxDB 3 server

<!--pytest.mark.skip-->

```bash
influxdb3 serve \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --node-id my-host-01 \
  --cluster-id my-cluster-01
```

### Run a server in specific modes

<!--pytest.mark.skip-->

```bash
influxdb3 serve \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --node-id my-host-01 \
  --cluster-id my-cluster-01 \
  --mode ingest,query,process
```

### Run a server specifically for compacting data

<!--pytest.mark.skip-->

```bash
influxdb3 serve \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --node-id my-host-01 \
  --cluster-id my-cluster-01 \
  --mode compact 
```

### Run the InfluxDB 3 server with extra verbose logging

<!--pytest.mark.skip-->

```bash
influxdb3 serve \
  --verbose \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --node-id my-host-01 \
  --cluster-id my-cluster-01
```

### Run InfluxDB 3 with debug logging using LOG_FILTER

<!--pytest.mark.skip-->

```bash
LOG_FILTER=debug influxdb3 serve \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --node-id my-host-01 \
  --cluster-id my-cluster-01
```

{{% /code-placeholders %}}


## Troubleshooting

### Common Issues

- **Error: "cluster-id cannot match any node-id in the cluster"**  
  Ensure your `--cluster-id` value is different from all `--node-id` values in your cluster.

- **Error: "Failed to connect to object store"**  
  Verify your `--object-store` setting and ensure all required parameters for that storage type are provided.

- **Permission errors when using S3, Google Cloud, or Azure storage**  
  Check that your authentication credentials are correct and have sufficient permissions.
