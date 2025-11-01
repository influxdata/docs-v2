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
influxdb3 serve [OPTIONS]
```

## Required Parameters

- **node-id**: A unique identifier for your server instance. Must be unique for any hosts sharing the same object store.
- **cluster-id**: A unique identifier for your cluster. Must be different from any node-id in your cluster.
- **object-store**: Determines where time series data is stored.
- Other object store parameters depending on the selected `object-store` type.

> \[!NOTE]
> `--node-id` and `--cluster-id` support alphanumeric strings with optional hyphens.

> \[!Important]
>
> #### Global configuration options
>
> Some configuration options (like [`--num-io-threads`](/influxdb3/enterprise/reference/config-options/#num-io-threads)) are **global** and must be specified **before** the `serve` command:
>
> ```bash
> influxdb3 --num-io-threads=8 serve --node-id=node0 --cluster-id=cluster0 --verbose
> ```
>
> See [Global configuration options](/influxdb3/enterprise/reference/config-options/#global-configuration-options) for the complete list.

## Options

| Option |                                                      | Description                                                                                                                     |
| :----- | :--------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
|        | `--admin-token-recovery-http-bind`                   | *See [configuration options](/influxdb3/enterprise/reference/config-options/#admin-token-recovery-http-bind)*                   |
|        | `--admin-token-recovery-tcp-listener-file-path`      | *See [configuration options](/influxdb3/enterprise/reference/config-options/#admin-token-recovery-tcp-listener-file-path)*      |
|        | `--admin-token-file`                                 | *See [configuration options](/influxdb3/enterprise/reference/config-options/#admin-token-file)*                                 |
|        | `--aws-access-key-id`                                | *See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-access-key-id)*                                |
|        | `--aws-allow-http`                                   | *See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-allow-http)*                                   |
|        | `--aws-credentials-file`                             | *See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-credentials-file)*                             |
|        | `--aws-default-region`                               | *See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-default-region)*                               |
|        | `--aws-endpoint`                                     | *See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-endpoint)*                                     |
|        | `--aws-secret-access-key`                            | *See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-secret-access-key)*                            |
|        | `--aws-session-token`                                | *See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-session-token)*                                |
|        | `--aws-skip-signature`                               | *See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-skip-signature)*                               |
|        | `--azure-allow-http`                                 | *See [configuration options](/influxdb3/enterprise/reference/config-options/#azure-allow-http)*                                 |
|        | `--azure-endpoint`                                   | *See [configuration options](/influxdb3/enterprise/reference/config-options/##azure-endpoint)*                                  |
|        | `--azure-storage-access-key`                         | *See [configuration options](/influxdb3/enterprise/reference/config-options/#azure-storage-access-key)*                         |
|        | `--azure-storage-account`                            | *See [configuration options](/influxdb3/enterprise/reference/config-options/#azure-storage-account)*                            |
|        | `--bucket`                                           | *See [configuration options](/influxdb3/enterprise/reference/config-options/#bucket)*                                           |
|        | `--catalog-sync-interval`                            | *See [configuration options](/influxdb3/enterprise/reference/config-options/#catalog-sync-interval)*                            |
|        | `--cluster-id`                                       | *See [configuration options](/influxdb3/enterprise/reference/config-options/#cluster-id)*                                       |
|        | `--compaction-check-interval`                        | *See [configuration options](/influxdb3/enterprise/reference/config-options/#compaction-check-interval)*                        |
|        | `--compaction-cleanup-wait`                          | *See [configuration options](/influxdb3/enterprise/reference/config-options/#compaction-cleanup-wait)*                          |
|        | `--compaction-gen2-duration`                         | *See [configuration options](/influxdb3/enterprise/reference/config-options/#compaction-gen2-duration)*                         |
|        | `--compaction-max-num-files-per-plan`                | *See [configuration options](/influxdb3/enterprise/reference/config-options/#compaction-max-num-files-per-plan)*                |
|        | `--compaction-multipliers`                           | *See [configuration options](/influxdb3/enterprise/reference/config-options/#compaction-multipliers)*                           |
|        | `--compaction-row-limit`                             | *See [configuration options](/influxdb3/enterprise/reference/config-options/#compaction-row-limit)*                             |
|        | `--data-dir`                                         | *See [configuration options](/influxdb3/enterprise/reference/config-options/#data-dir)*                                         |
|        | `--datafusion-config`                                | *See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-config)*                                |
|        | `--datafusion-max-parquet-fanout`                    | *See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-max-parquet-fanout)*                    |
|        | `--datafusion-num-threads`                           | *See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-num-threads)*                           |
|        | `--datafusion-runtime-disable-lifo-slot`             | *See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-runtime-disable-lifo-slot)*             |
|        | `--datafusion-runtime-event-interval`                | *See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-runtime-event-interval)*                |
|        | `--datafusion-runtime-global-queue-interval`         | *See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-runtime-global-queue-interval)*         |
|        | `--datafusion-runtime-max-blocking-threads`          | *See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-runtime-max-blocking-threads)*          |
|        | `--datafusion-runtime-max-io-events-per-tick`        | *See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-runtime-max-io-events-per-tick)*        |
|        | `--datafusion-runtime-thread-keep-alive`             | *See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-runtime-thread-keep-alive)*             |
|        | `--datafusion-runtime-thread-priority`               | *See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-runtime-thread-priority)*               |
|        | `--datafusion-runtime-type`                          | *See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-runtime-type)*                          |
|        | `--datafusion-use-cached-parquet-loader`             | *See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-use-cached-parquet-loader)*             |
|        | `--delete-grace-period`                              | *See [configuration options](/influxdb3/enterprise/reference/config-options/#delete-grace-period)*                              |
|        | `--disable-authz`                                    | *See [configuration options](/influxdb3/enterprise/reference/config-options/#disable-authz)*                                    |
|        | `--disable-parquet-mem-cache`                        | *See [configuration options](/influxdb3/enterprise/reference/config-options/#disable-parquet-mem-cache)*                        |
|        | `--distinct-cache-eviction-interval`                 | *See [configuration options](/influxdb3/enterprise/reference/config-options/#distinct-cache-eviction-interval)*                 |
|        | `--distinct-value-cache-disable-from-history`        | *See [configuration options](/influxdb3/enterprise/reference/config-options/#distinct-value-cache-disable-from-history)*        |
|        | `--exec-mem-pool-bytes`                              | *See [configuration options](/influxdb3/enterprise/reference/config-options/#exec-mem-pool-bytes)*                              |
|        | `--force-snapshot-mem-threshold`                     | *See [configuration options](/influxdb3/enterprise/reference/config-options/#force-snapshot-mem-threshold)*                     |
|        | `--gen1-duration`                                    | *See [configuration options](/influxdb3/enterprise/reference/config-options/#gen1-duration)*                                    |
|        | `--gen1-lookback-duration`                           | *See [configuration options](/influxdb3/enterprise/reference/config-options/#gen1-lookback-duration)*                           |
|        | `--google-service-account`                           | *See [configuration options](/influxdb3/enterprise/reference/config-options/#google-service-account)*                           |
|        | `--hard-delete-default-duration`                     | *See [configuration options](/influxdb3/enterprise/reference/config-options/#hard-delete-default-duration)*                     |
| `-h`   | `--help`                                             | Print help information                                                                                                          |
|        | `--help-all`                                         | Print detailed help information                                                                                                 |
|        | `--http-bind`                                        | *See [configuration options](/influxdb3/enterprise/reference/config-options/#http-bind)*                                        |
|        | `--last-cache-eviction-interval`                     | *See [configuration options](/influxdb3/enterprise/reference/config-options/#last-cache-eviction-interval)*                     |
|        | `--last-value-cache-disable-from-history`            | *See [configuration options](/influxdb3/enterprise/reference/config-options/#last-value-cache-disable-from-history)*            |
|        | `--license-email`                                    | *See [configuration options](/influxdb3/enterprise/reference/config-options/#license-email)*                                    |
|        | `--license-file`                                     | *See [configuration options](/influxdb3/enterprise/reference/config-options/#license-file)*                                     |
|        | `--log-destination`                                  | *See [configuration options](/influxdb3/enterprise/reference/config-options/#log-destination)*                                  |
|        | `--log-filter`                                       | *See [configuration options](/influxdb3/enterprise/reference/config-options/#log-filter)*                                       |
|        | `--log-format`                                       | *See [configuration options](/influxdb3/enterprise/reference/config-options/#log-format)*                                       |
|        | `--max-http-request-size`                            | *See [configuration options](/influxdb3/enterprise/reference/config-options/#max-http-request-size)*                            |
|        | `--mode`                                             | *See [configuration options](/influxdb3/enterprise/reference/config-options/#mode)*                                             |
|        | `--node-id`                                          | *See [configuration options](/influxdb3/enterprise/reference/config-options/#node-id)*                                          |
|        | `--node-id-from-env`                                 | *See [configuration options](/influxdb3/enterprise/reference/config-options/#node-id-from-env)*                                 |
|        | `--num-cores`                                        | *See [configuration options](/influxdb3/enterprise/reference/config-options/#num-cores)*                                        |
|        | `--num-datafusion-threads`                           | *See [configuration options](/influxdb3/enterprise/reference/config-options/#num-datafusion-threads)*                           |
|        | `--num-database-limit`                               | *See [configuration options](/influxdb3/enterprise/reference/config-options/#num-database-limit)*                               |
|        | `--num-table-limit`                                  | *See [configuration options](/influxdb3/enterprise/reference/config-options/#num-table-limit)*                                  |
|        | `--num-total-columns-per-table-limit`                | *See [configuration options](/influxdb3/enterprise/reference/config-options/#num-total-columns-per-table-limit)*                |
|        | `--object-store`                                     | *See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store)*                                     |
|        | `--object-store-cache-endpoint`                      | *See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store-cache-endpoint)*                      |
|        | `--object-store-connection-limit`                    | *See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store-connection-limit)*                    |
|        | `--object-store-http2-max-frame-size`                | *See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store-http2-max-frame-size)*                |
|        | `--object-store-http2-only`                          | *See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store-http2-only)*                          |
|        | `--object-store-max-retries`                         | *See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store-max-retries)*                         |
|        | `--object-store-retry-timeout`                       | *See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store-retry-timeout)*                       |
|        | `--package-manager`                                  | *See [configuration options](/influxdb3/enterprise/reference/config-options/#package-manager)*                                  |
|        | `--parquet-mem-cache-prune-interval`                 | *See [configuration options](/influxdb3/enterprise/reference/config-options/#parquet-mem-cache-prune-interval)*                 |
|        | `--parquet-mem-cache-prune-percentage`               | *See [configuration options](/influxdb3/enterprise/reference/config-options/#parquet-mem-cache-prune-percentage)*               |
|        | `--parquet-mem-cache-query-path-duration`            | *See [configuration options](/influxdb3/enterprise/reference/config-options/#parquet-mem-cache-query-path-duration)*            |
|        | `--parquet-mem-cache-size`                           | *See [configuration options](/influxdb3/enterprise/reference/config-options/#parquet-mem-cache-size)*                           |
|        | `--permission-tokens-file`                           | *See [configuration options](/influxdb3/enterprise/reference/config-options/#permission-tokens-file)*                           |
|        | `--plugin-dir`                                       | *See [configuration options](/influxdb3/enterprise/reference/config-options/#plugin-dir)*                                       |
|        | `--preemptive-cache-age`                             | *See [configuration options](/influxdb3/enterprise/reference/config-options/#preemptive-cache-age)*                             |
|        | `--query-file-limit`                                 | *See [configuration options](/influxdb3/enterprise/reference/config-options/#query-file-limit)*                                 |
|        | `--query-log-size`                                   | *See [configuration options](/influxdb3/enterprise/reference/config-options/#query-log-size)*                                   |
|        | `--replication-interval`                             | *See [configuration options](/influxdb3/enterprise/reference/config-options/#replication-interval)*                             |
|        | `--retention-check-interval`                         | *See [configuration options](/influxdb3/enterprise/reference/config-options/#retention-check-interval)*                         |
|        | `--snapshotted-wal-files-to-keep`                    | *See [configuration options](/influxdb3/enterprise/reference/config-options/#snapshotted-wal-files-to-keep)*                    |
|        | `--table-index-cache-concurrency-limit`              | *See [configuration options](/influxdb3/enterprise/reference/config-options/#table-index-cache-concurrency-limit)*              |
|        | `--table-index-cache-max-entries`                    | *See [configuration options](/influxdb3/enterprise/reference/config-options/#table-index-cache-max-entries)*                    |
|        | `--tcp-listener-file-path`                           | *See [configuration options](/influxdb3/enterprise/reference/config-options/#tcp-listener-file-path)*                           |
|        | `--telemetry-disable-upload`                         | *See [configuration options](/influxdb3/enterprise/reference/config-options/#telemetry-disable-upload)*                         |
|        | `--telemetry-endpoint`                               | *See [configuration options](/influxdb3/enterprise/reference/config-options/#telemetry-endpoint)*                               |
|        | `--tls-cert`                                         | *See [configuration options](/influxdb3/enterprise/reference/config-options/#tls-cert)*                                         |
|        | `--tls-key`                                          | *See [configuration options](/influxdb3/enterprise/reference/config-options/#tls-key)*                                          |
|        | `--tls-minimum-version`                              | *See [configuration options](/influxdb3/enterprise/reference/config-options/#tls-minimum-version)*                              |
|        | `--traces-exporter`                                  | *See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-exporter)*                                  |
|        | `--traces-exporter-jaeger-agent-host`                | *See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-exporter-jaeger-agent-host)*                |
|        | `--traces-exporter-jaeger-agent-port`                | *See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-exporter-jaeger-agent-port)*                |
|        | `--traces-exporter-jaeger-service-name`              | *See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-exporter-jaeger-service-name)*              |
|        | `--traces-exporter-jaeger-trace-context-header-name` | *See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-exporter-jaeger-trace-context-header-name)* |
|        | `--traces-jaeger-debug-name`                         | *See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-jaeger-debug-name)*                         |
|        | `--traces-jaeger-max-msgs-per-second`                | *See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-jaeger-max-msgs-per-second)*                |
|        | `--traces-jaeger-tags`                               | *See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-jaeger-tags)*                               |
|        | `--use-pacha-tree`                                   | *See [configuration options](/influxdb3/enterprise/reference/config-options/#use-pacha-tree)*                                   |
|        | `--virtual-env-location`                             | *See [configuration options](/influxdb3/enterprise/reference/config-options/#virtual-env-location)*                             |
|        | `--wait-for-running-ingestor`                        | *See [configuration options](/influxdb3/enterprise/reference/config-options/#wait-for-running-ingestor)*                        |
|        | `--wal-flush-interval`                               | *See [configuration options](/influxdb3/enterprise/reference/config-options/#wal-flush-interval)*                               |
|        | `--wal-max-write-buffer-size`                        | *See [configuration options](/influxdb3/enterprise/reference/config-options/#wal-max-write-buffer-size)*                        |
|        | `--wal-replay-concurrency-limit`                     | *See [configuration options](/influxdb3/enterprise/reference/config-options/#wal-replay-concurrency-limit)*                     |
|        | `--wal-replay-fail-on-error`                         | *See [configuration options](/influxdb3/enterprise/reference/config-options/#wal-replay-fail-on-error)*                         |
|        | `--wal-snapshot-size`                                | *See [configuration options](/influxdb3/enterprise/reference/config-options/#wal-snapshot-size)*                                |
|        | `--without-auth`                                     | *See [configuration options](/influxdb3/enterprise/reference/config-options/#without-auth)*                                     |

### Option environment variables

You can use environment variables to define most `influxdb3 serve` options.
For more information, see
[Configuration options](/influxdb3/enterprise/reference/config-options/).

## Quick-Start Mode

For development, testing, and home use, you can start {{< product-name >}} by running `influxdb3` without the `serve` subcommand or any configuration parameters. The system automatically generates required values:

- **`node-id`**: `{hostname}-node` (fallback: `primary-node`)
- **`cluster-id`**: `{hostname}-cluster` (fallback: `primary-cluster`)
- **`object-store`**: `file`
- **`data-dir`**: `~/.influxdb`

The system displays warning messages showing the auto-generated identifiers:

```
Using auto-generated node id: mylaptop-node. For production deployments, explicitly set --node-id
Using auto-generated cluster id: mylaptop-cluster. For production deployments, explicitly set --cluster-id
```

### Quick-start examples

<!--pytest.mark.skip-->

```bash
# Zero-config startup
influxdb3

# Override specific defaults
influxdb3 --object-store memory

# Use environment variables to override defaults
INFLUXDB3_NODE_IDENTIFIER_PREFIX=my-node influxdb3
```

> \[!Important]
>
> #### Production deployments
>
> Quick-start mode is designed for development and testing environments.
> For production deployments, use explicit configuration with the `serve` subcommand
> and specify all required parameters as shown in the [Examples](#examples) below.

**Configuration precedence**: CLI flags > environment variables > auto-generated defaults

For more information about quick-start mode, see [Get started](/influxdb3/enterprise/get-started/setup/#quick-start-mode-development).

## Examples

- [Run the InfluxDB 3 server](#run-the-influxdb-3-server)
- [Run the InfluxDB 3 server with extra verbose logging](#run-the-influxdb-3-server-with-extra-verbose-logging)
- [Run InfluxDB 3 with debug logging using LOG\_FILTER](#run-influxdb-3-with-debug-logging-using-log_filter)

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
  --object-store file \
  --data-dir ~/.influxdb3 \
  --node-id my-host-01 \
  --cluster-id my-cluster-01
  --verbose
```

### Run InfluxDB 3 with debug logging using LOG\_FILTER

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

- **Error: "cluster-id cannot match any node-id in the cluster"**\
  Ensure your `--cluster-id` value is different from all `--node-id` values in your cluster.

- **Error: "Failed to connect to object store"**\
  Verify your `--object-store` setting and ensure all required parameters for that storage type are provided.

- **Permission errors when using S3, Google Cloud, or Azure storage**\
  Check that your authentication credentials are correct and have sufficient permissions.
