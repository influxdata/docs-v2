---
title: influxdb3 serve
description: >
  The `influxdb3 serve` command starts the InfluxDB 3 Enterprise server.
menu:
  influxdb3_enterprise:
    parent: influxdb3
    name: influxdb3 serve
weight: 300
aliases:
  - /influxdb3/enterprise/reference/clis/influxdb3/serve/
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

> [!NOTE]
> `--node-id` and `--cluster-id` support alphanumeric strings with optional hyphens.

> [!Important]
> #### Global configuration options
> Some configuration options (like [`--num-io-threads`](/influxdb3/enterprise/reference/config-options/#num-io-threads)) are **global** and must be specified **before** the `serve` command:
>
> ```bash
> influxdb3 --num-io-threads=8 serve --node-id=node0 --cluster-id=cluster0 --verbose
> ```
>
> See [Global configuration options](/influxdb3/enterprise/reference/config-options/#global-configuration-options) for the complete list.

## Options

<!--docs:exclude
--serve-invocation-method: internal implementation detail
--test-mode: hidden test flag, not for production use
-->

| Option           |                                                      | Description                                                                                                                     |
| :--------------- | :--------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
|                  | `--admin-token-recovery-http-bind`                   | _See [configuration options](/influxdb3/enterprise/reference/config-options/#admin-token-recovery-http-bind)_                   |
|                  | `--admin-token-recovery-tcp-listener-file-path`      | _See [configuration options](/influxdb3/enterprise/reference/config-options/#admin-token-recovery-tcp-listener-file-path)_      |
|                  | `--admin-token-file`                                 | _See [configuration options](/influxdb3/enterprise/reference/config-options/#admin-token-file)_                                 |
|                  | `--aws-access-key-id`                                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-access-key-id)_                                |
|                  | `--aws-allow-http`                                   | _See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-allow-http)_                                   |
|                  | `--aws-credentials-file`                             | _See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-credentials-file)_                             |
|                  | `--aws-default-region`                               | _See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-default-region)_                               |
|                  | `--aws-endpoint`                                     | _See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-endpoint)_                                     |
|                  | `--aws-secret-access-key`                            | _See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-secret-access-key)_                            |
|                  | `--aws-session-token`                                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-session-token)_                                |
|                  | `--aws-skip-signature`                               | _See [configuration options](/influxdb3/enterprise/reference/config-options/#aws-skip-signature)_                               |
|                  | `--azure-allow-http`                                 | _See [configuration options](/influxdb3/enterprise/reference/config-options/#azure-allow-http)_                                 |
|                  | `--azure-endpoint`                                   | _See [configuration options](/influxdb3/enterprise/reference/config-options/#azure-endpoint)_                                   |
|                  | `--azure-storage-access-key`                         | _See [configuration options](/influxdb3/enterprise/reference/config-options/#azure-storage-access-key)_                         |
|                  | `--azure-storage-account`                            | _See [configuration options](/influxdb3/enterprise/reference/config-options/#azure-storage-account)_                            |
|                  | `--bucket`                                           | _See [configuration options](/influxdb3/enterprise/reference/config-options/#bucket)_                                           |
|                  | `--catalog-sync-interval`                            | _See [configuration options](/influxdb3/enterprise/reference/config-options/#catalog-sync-interval)_                            |
|                  | `--cluster-id`                                       | _See [configuration options](/influxdb3/enterprise/reference/config-options/#cluster-id)_                                       |
|                  | `--compaction-check-interval`                        | _See [configuration options](/influxdb3/enterprise/reference/config-options/#compaction-check-interval)_                        |
|                  | `--compaction-cleanup-wait`                          | _See [configuration options](/influxdb3/enterprise/reference/config-options/#compaction-cleanup-wait)_                          |
|                  | `--compaction-gen2-duration`                         | _See [configuration options](/influxdb3/enterprise/reference/config-options/#compaction-gen2-duration)_                         |
|                  | `--compaction-max-num-files-per-plan`                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#compaction-max-num-files-per-plan)_                |
|                  | `--compaction-multipliers`                           | _See [configuration options](/influxdb3/enterprise/reference/config-options/#compaction-multipliers)_                           |
|                  | `--compaction-row-limit`                             | _See [configuration options](/influxdb3/enterprise/reference/config-options/#compaction-row-limit)_                             |
|                  | `--conn-info` | _See [configuration options](/influxdb3/enterprise/reference/config-options/#conn-info)_ |
|                  | `--data-dir`                                         | _See [configuration options](/influxdb3/enterprise/reference/config-options/#data-dir)_                                         |
|                  | <span id="datafusion-config"></span>`--datafusion-config`                                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-config)_                                |
|                  | `--datafusion-max-parquet-fanout`                    | _See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-max-parquet-fanout)_                    |
|                  | `--datafusion-num-threads`                           | _See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-num-threads)_                           |
|                  | `--datafusion-runtime-disable-lifo-slot`             | Development-only Tokio runtime configuration                                                                                    |
|                  | `--datafusion-runtime-event-interval`                | Development-only Tokio runtime configuration                                                                                    |
|                  | `--datafusion-runtime-global-queue-interval`         | Development-only Tokio runtime configuration                                                                                    |
|                  | `--datafusion-runtime-max-blocking-threads`          | Development-only Tokio runtime configuration                                                                                    |
|                  | `--datafusion-runtime-max-io-events-per-tick`        | Development-only Tokio runtime configuration                                                                                    |
|                  | `--datafusion-runtime-thread-keep-alive`             | Development-only Tokio runtime configuration                                                                                    |
|                  | `--datafusion-runtime-thread-priority`               | Development-only Tokio runtime configuration                                                                                    |
|                  | `--datafusion-runtime-type`                          | Development-only Tokio runtime configuration                                                                                    |
|                  | `--datafusion-use-cached-parquet-loader`             | _See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-use-cached-parquet-loader)_             |
|                  | `--delete-grace-period`                              | _See [configuration options](/influxdb3/enterprise/reference/config-options/#delete-grace-period)_                              |
|                  | `--disable-authz`                                    | _See [configuration options](/influxdb3/enterprise/reference/config-options/#disable-authz)_                                    |
|                  | `--disable-file-cache`                        | _See [configuration options](/influxdb3/enterprise/reference/config-options/#disable-file-cache)_                        |
|                  | `--distinct-cache-eviction-interval`                 | _See [configuration options](/influxdb3/enterprise/reference/config-options/#distinct-cache-eviction-interval)_                 |
|                  | `--distinct-value-cache-disable-from-history`        | _See [configuration options](/influxdb3/enterprise/reference/config-options/#distinct-value-cache-disable-from-history)_        |
|                  | `--exec-mem-pool-size`                              | _See [configuration options](/influxdb3/enterprise/reference/config-options/#exec-mem-pool-size)_                              |
|                  | `--force-snapshot-mem-threshold`                     | _See [configuration options](/influxdb3/enterprise/reference/config-options/#force-snapshot-mem-threshold)_                     |
|                  | `--gen1-duration`                                    | _See [configuration options](/influxdb3/enterprise/reference/config-options/#gen1-duration)_                                    |
|                  | `--gen1-lookback-duration`                           | _See [configuration options](/influxdb3/enterprise/reference/config-options/#gen1-lookback-duration)_                           |
|                  | `--google-service-account`                           | _See [configuration options](/influxdb3/enterprise/reference/config-options/#google-service-account)_                           |
|                  | `--hard-delete-default-duration`                     | _See [configuration options](/influxdb3/enterprise/reference/config-options/#hard-delete-default-duration)_                     |
| `-h`             | `--help`                                             | Print help information                                                                                                          |
|                  | `--help-all`                                         | Print detailed help information                                                                                                 |
|                  | <span id="http-bind"></span>`--http-bind`                                        | _See [configuration options](/influxdb3/enterprise/reference/config-options/#http-bind)_                                        |
|                  | `--jwt-default-ttl-seconds` | _See [configuration options](/influxdb3/enterprise/reference/config-options/#jwt-default-ttl-seconds)_ |
|                  | `--jwt-issuer` | _See [configuration options](/influxdb3/enterprise/reference/config-options/#jwt-issuer)_ |
|                  | `--jwt-key-id` | _See [configuration options](/influxdb3/enterprise/reference/config-options/#jwt-key-id)_ |
|                  | `--jwt-private-key` | _See [configuration options](/influxdb3/enterprise/reference/config-options/#jwt-private-key)_ |
|                  | `--last-cache-eviction-interval`                     | _See [configuration options](/influxdb3/enterprise/reference/config-options/#last-cache-eviction-interval)_                     |
|                  | `--last-value-cache-disable-from-history`            | _See [configuration options](/influxdb3/enterprise/reference/config-options/#last-value-cache-disable-from-history)_            |
|                  | `--license-email`                                    | _See [configuration options](/influxdb3/enterprise/reference/config-options/#license-email)_                                    |
|                  | `--license-file`                                     | _See [configuration options](/influxdb3/enterprise/reference/config-options/#license-file)_                                     |
|                  | `--log-destination`                                  | _See [configuration options](/influxdb3/enterprise/reference/config-options/#log-destination)_                                  |
|                  | `--log-filter`                                       | _See [configuration options](/influxdb3/enterprise/reference/config-options/#log-filter)_                                       |
|                  | `--log-format`                                       | _See [configuration options](/influxdb3/enterprise/reference/config-options/#log-format)_                                       |
|                  | `--max-concurrent-queries` | _See [configuration options](/influxdb3/enterprise/reference/config-options/#max-concurrent-queries)_ |
|                  | <span id="max-http-request-size"></span>`--max-http-request-size`                            | _See [configuration options](/influxdb3/enterprise/reference/config-options/#max-http-request-size)_                            |
|                  | `--mode`                                             | _See [configuration options](/influxdb3/enterprise/reference/config-options/#mode)_                                             |
|                  | `--node-id`                                          | _See [configuration options](/influxdb3/enterprise/reference/config-options/#node-id)_                                          |
|                  | `--node-id-from-env`                                 | _See [configuration options](/influxdb3/enterprise/reference/config-options/#node-id-from-env)_                                 |
|                  | `--num-cores`                                        | _See [configuration options](/influxdb3/enterprise/reference/config-options/#num-cores)_                                        |
|                  | `--num-datafusion-threads`                           | _See [configuration options](/influxdb3/enterprise/reference/config-options/#datafusion-num-threads)_                           |
|                  | `--num-database-limit`                               | _See [configuration options](/influxdb3/enterprise/reference/config-options/#num-database-limit)_                               |
|                  | `--num-table-limit`                                  | _See [configuration options](/influxdb3/enterprise/reference/config-options/#num-table-limit)_                                  |
|                  | `--num-total-columns-per-table-limit`                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#num-total-columns-per-table-limit)_                |
|                  | `--oauth-audience` | _See [configuration options](/influxdb3/enterprise/reference/config-options/#oauth-audience)_ |
|                  | `--oauth-client-id` | _See [configuration options](/influxdb3/enterprise/reference/config-options/#oauth-client-id)_ |
|                  | `--oauth-issuer` | _See [configuration options](/influxdb3/enterprise/reference/config-options/#oauth-issuer)_ |
|                  | `--oauth-scopes` | _See [configuration options](/influxdb3/enterprise/reference/config-options/#oauth-scopes)_ |
|                  | `--object-store`                                     | _See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store)_                                     |
|                  | `--object-store-cache-endpoint`                      | _See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store-cache-endpoint)_                      |
|                  | <span id="object-store-connection-limit"></span>`--object-store-connection-limit`                    | _See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store-connection-limit)_                    |
|                  | `--object-store-http2-max-frame-size`                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store-http2-max-frame-size)_                |
|                  | <span id="object-store-http2-only"></span>`--object-store-http2-only`                          | _See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store-http2-only)_                          |
|                  | <span id="object-store-max-retries"></span>`--object-store-max-retries`                         | _See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store-max-retries)_                         |
|                  | `--object-store-retry-timeout`                       | _See [configuration options](/influxdb3/enterprise/reference/config-options/#object-store-retry-timeout)_                       |
|                  | `--package-manager`                                  | _See [configuration options](/influxdb3/enterprise/reference/config-options/#package-manager)_                                  |
|                  | `--parquet-mem-cache-prune-interval`                 | _See [configuration options](/influxdb3/enterprise/reference/config-options/#parquet-mem-cache-prune-interval)_                 |
|                  | `--parquet-mem-cache-prune-percentage`               | _See [configuration options](/influxdb3/enterprise/reference/config-options/#parquet-mem-cache-prune-percentage)_               |
|                  | `--file-cache-recency`            | _See [configuration options](/influxdb3/enterprise/reference/config-options/#file-cache-recency)_            |
|                  | `--file-cache-size`                           | _See [configuration options](/influxdb3/enterprise/reference/config-options/#file-cache-size)_                           |
|                  | `--permission-tokens-file`                           | _See [configuration options](/influxdb3/enterprise/reference/config-options/#permission-tokens-file)_                           |
|                  | `--plugin-dir`                                       | _See [configuration options](/influxdb3/enterprise/reference/config-options/#plugin-dir)_                                       |
|                  | `--plugin-dir-only` | _See [configuration options](/influxdb3/enterprise/reference/config-options/#plugin-dir-only)_ |
|                  | `--preemptive-cache-age`                             | _See [configuration options](/influxdb3/enterprise/reference/config-options/#preemptive-cache-age)_                             |
|                  | `--query-file-limit`                                 | _See [configuration options](/influxdb3/enterprise/reference/config-options/#query-file-limit)_                                 |
|                  | `--query-log-max-entries`                                   | _See [configuration options](/influxdb3/enterprise/reference/config-options/#query-log-max-entries)_                                   |
|                  | `--rbac-authoring-disabled` | _See [configuration options](/influxdb3/enterprise/reference/config-options/#rbac-authoring-disabled)_ |
|                  | `--replication-interval`                             | _See [configuration options](/influxdb3/enterprise/reference/config-options/#replication-interval)_                             |
|                  | `--restrict-plugin-triggers-to` | _See [configuration options](/influxdb3/enterprise/reference/config-options/#restrict-plugin-triggers-to)_ |
|                  | `--retention-check-interval`                         | _See [configuration options](/influxdb3/enterprise/reference/config-options/#retention-check-interval)_                         |
|                  | `--snapshotted-wal-files-to-keep`                    | _See [configuration options](/influxdb3/enterprise/reference/config-options/#snapshotted-wal-files-to-keep)_                    |
|                  | `--table-index-cache-concurrency-limit`              | _See [configuration options](/influxdb3/enterprise/reference/config-options/#table-index-cache-concurrency-limit)_              |
|                  | `--table-index-cache-max-entries`                    | _See [configuration options](/influxdb3/enterprise/reference/config-options/#table-index-cache-max-entries)_                    |
|                  | `--tcp-listener-file-path`                           | _See [configuration options](/influxdb3/enterprise/reference/config-options/#tcp-listener-file-path)_                           |
|                  | `--disable-telemetry-upload`                         | _See [configuration options](/influxdb3/enterprise/reference/config-options/#disable-telemetry-upload)_                         |
|                  | `--telemetry-endpoint`                               | _See [configuration options](/influxdb3/enterprise/reference/config-options/#telemetry-endpoint)_                               |
|                  | `--tls-cert`                                         | _See [configuration options](/influxdb3/enterprise/reference/config-options/#tls-cert)_                                         |
|                  | `--tls-key`                                          | _See [configuration options](/influxdb3/enterprise/reference/config-options/#tls-key)_                                          |
|                  | `--tls-minimum-version`                              | _See [configuration options](/influxdb3/enterprise/reference/config-options/#tls-minimum-version)_                              |
|                  | `--traces-exporter`                                  | _See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-exporter)_                                  |
|                  | `--traces-exporter-jaeger-agent-host`                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-exporter-jaeger-agent-host)_                |
|                  | `--traces-exporter-jaeger-agent-port`                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-exporter-jaeger-agent-port)_                |
|                  | `--traces-exporter-jaeger-service-name`              | _See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-exporter-jaeger-service-name)_              |
|                  | `--traces-exporter-jaeger-trace-context-header-name` | _See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-exporter-jaeger-trace-context-header-name)_ |
|                  | `--traces-jaeger-debug-name`                         | _See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-jaeger-debug-name)_                         |
|                  | `--traces-jaeger-max-msgs-per-second`                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-jaeger-max-msgs-per-second)_                |
|                  | `--traces-jaeger-tags`                               | _See [configuration options](/influxdb3/enterprise/reference/config-options/#traces-jaeger-tags)_                               |
|                  | `--upgrade-pacha-tree`                               | Migrate existing Parquet data to the upgraded storage engine (the default for new clusters). Replaces the deprecated `--use-pacha-tree`. _See [configuration options](/influxdb3/enterprise/reference/config-options/#upgrade-pacha-tree)._ |
|                  | `--virtual-env-location`                             | _See [configuration options](/influxdb3/enterprise/reference/config-options/#virtual-env-location)_                             |
|                  | `--wait-for-running-ingester`                        | _See [configuration options](/influxdb3/enterprise/reference/config-options/#wait-for-running-ingester)_                        |
|                  | `--wal-flush-interval`                               | _See [configuration options](/influxdb3/enterprise/reference/config-options/#wal-flush-interval)_                               |
|                  | `--wal-max-buffered-writes`                        | _See [configuration options](/influxdb3/enterprise/reference/config-options/#wal-max-buffered-writes)_                        |
|                  | `--wal-replay-concurrency-limit`                     | _See [configuration options](/influxdb3/enterprise/reference/config-options/#wal-replay-concurrency-limit)_                     |
|                  | `--wal-replay-fail-on-error`                         | _See [configuration options](/influxdb3/enterprise/reference/config-options/#wal-replay-fail-on-error)_                         |
|                  | `--wal-files-per-snapshot`                                | _See [configuration options](/influxdb3/enterprise/reference/config-options/#wal-files-per-snapshot)_                                |
|                  | `--without-auth`                                     | _See [configuration options](/influxdb3/enterprise/reference/config-options/#without-auth)_                                     |
|                  | `--without-user-auth` | _See [configuration options](/influxdb3/enterprise/reference/config-options/#without-user-auth)_ |

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
INFLUXDB3_NODE_ID=my-node influxdb3
```

> [!Important]
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
- [Run InfluxDB 3 with debug logging using LOG_FILTER](#run-influxdb-3-with-debug-logging-using-log_filter)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`my-host-01`{{% /code-placeholder-key %}}:
a unique string that identifies your {{< product-name >}} server.
- {{% code-placeholder-key %}}`my-cluster-01`{{% /code-placeholder-key %}}:
a unique string that identifies your {{< product-name >}} cluster.
The value you use must be different from `--node-id` values in the cluster.

### Run the InfluxDB 3 server

<!--pytest.mark.skip-->

```bash { placeholders="my-host-01|my-cluster-01" }
influxdb3 serve \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --node-id my-host-01 \
  --cluster-id my-cluster-01
```

### Run a server in specific modes

<!--pytest.mark.skip-->

```bash { placeholders="my-host-01|my-cluster-01" }
influxdb3 serve \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --node-id my-host-01 \
  --cluster-id my-cluster-01 \
  --plugin-dir ~/.influxdb3/plugins \
  --mode ingest,query,process
```

### Run a server specifically for compacting data

<!--pytest.mark.skip-->

```bash { placeholders="my-host-01|my-cluster-01" }
influxdb3 serve \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --node-id my-host-01 \
  --cluster-id my-cluster-01 \
  --mode compact 
```

### Run the InfluxDB 3 server with extra verbose logging

<!--pytest.mark.skip-->

```bash { placeholders="my-host-01|my-cluster-01" }
influxdb3 serve \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --node-id my-host-01 \
  --cluster-id my-cluster-01
  --verbose
```

### Run InfluxDB 3 with debug logging using LOG_FILTER

<!--pytest.mark.skip-->

```bash { placeholders="my-host-01|my-cluster-01" }
LOG_FILTER=debug influxdb3 serve \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --node-id my-host-01 \
  --cluster-id my-cluster-01
```


## Troubleshooting

### Common Issues

- **Error: "cluster-id cannot match any node-id in the cluster"**  
  Ensure your `--cluster-id` value is different from all `--node-id` values in your cluster.

- **Error: "Failed to connect to object store"**  
  Verify your `--object-store` setting and ensure all required parameters for that storage type are provided.

- **Permission errors when using S3, Google Cloud, or Azure storage**  
  Check that your authentication credentials are correct and have sufficient permissions.
