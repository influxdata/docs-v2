---
title: Manually upgrade from InfluxDB 1.x to 2.0
list_title: Manually upgrade from 1.x to 2.0
description: >
  To manually upgrade from InfluxDB 1.x to InfluxDB 2.0, migrate data, create
  1.x-compatible authorizations, and create database and retention policy
  (DBRP) mappings.
menu:
  influxdb_2_0:
    parent: InfluxDB 1.x to 2.0
    name: Manually upgrade
weight: 11
related:
  - /influxdb/v2.0/upgrade/v1-to-v2/
  - /influxdb/v2.0/upgrade/v1-to-v2/migrate-cqs/
---

To manually upgrade from InfluxDB 1.x to InfluxDB 2.0:

1. [Install InfluxDB 2.0](#install-influxdb-20)
2. [Migrate custom configuration settings](#migrate-custom-configuration-settings)
3. [Create authorizations](#create-authorizations)
4. [Create DBRP mappings](#create-dbrp-mapping)
5. [Migrate time series data](#migrate-time-series-data)
6. [Migrate continuous queries](#migrate-continuous-queries)

## Install InfluxDB 2.0
[Download, install, and set up InfluxDB 2.0](/influxdb/v2.0/get-started/).

## Migrate custom configuration settings
If you're using custom configuration settings in your InfluxDB 1.x instance,
apply those same custom settings to InfluxDB 2.0 using `influxd` flags,
environment variables, or a 2.0 configuration file.
For more information about configuring InfluxDB 2.0, see [Configuration options](/influxdb/v2.0/reference/config-options/).

{{< expand-wrapper >}}
{{% expand "View configuration option parity" %}}

| 1.x configuration option           | 2.0 configuration option                                                                                                          |
|:--------------                     |:------------------------ |
| **[data]**                         |                                                                                                                                   |
| dir                                | [engine-path](/influxdb/v2.0/reference/config-options/#engine-path)                                                               |
| wal-dir                            | [engine-path](/influxdb/v2.0/reference/config-options/#engine-path)                                                               |
| wal-fsync-delay                    | [storage-wal-fsync-delay](/influxdb/v2.0/reference/config-options/#storage-wal-fsync-delay)                                       |
| index-version                      |                                                                                                                                   |
| trace-logging-enabled              |                                                                                                                                   |
| query-log-enabled                  |                                                                                                                                   |
| strict-error-handling              |                                                                                                                                   |
| validate-keys                      | [storage-validate-keys](/influxdb/v2.0/reference/config-options/#storage-validate-keys)                                           |
| cache-max-memory-size              | [storage-cache-max-memory-size](/influxdb/v2.0/reference/config-options/#storage-cache-max-memory-size)                           |
| cache-snapshot-memory-size         | [storage-cache-snapshot-memory-size](/influxdb/v2.0/reference/config-options/#storage-cache-snapshot-memory-size)                 |
| cache-snapshot-write-cold-duration | [storage-cache-snapshot-write-cold-duration](/influxdb/v2.0/reference/config-options/#storage-cache-snapshot-write-cold-duration) |
| compact-full-write-cold-duration   | [storage-compact-full-write-cold-duration](/influxdb/v2.0/reference/config-options/#storage-compact-full-write-cold-duration)     |
| max-concurrent-compactions         | [storage-max-concurrent-compactions](/influxdb/v2.0/reference/config-options/#storage-max-concurrent-compactions)                 |
| compact-throughput                 |                                                                                                                                   |
| compact-throughput-burst           | [storage-compact-throughput-burst](/influxdb/v2.0/reference/config-options/#storage-compact-throughput-burst)                     |
| tsm-use-madv-willneed              | [storage-tsm-use-madv-willneed](/influxdb/v2.0/reference/config-options/#storage-tsm-use-madv-willneed)                           |
| max-series-per-database            |                                                                                                                                   |
| max-values-per-tag                 |                                                                                                                                   |
| max-index-log-file-size            | [storage-max-index-log-file-size](/influxdb/v2.0/reference/config-options/#storage-max-index-log-file-size)                       |
| series-id-set-cache-size           | [storage-series-id-set-cache-size](/influxdb/v2.0/reference/config-options/#storage-series-id-set-cache-size)                     |
|                                    |                                                                                                                                   |
| **[retention]**                    |                                                                                                                                   |
| check-interval                     | [storage-retention-check-interval](/influxdb/v2.0/reference/config-options/#storage-retention-check-interval)                     |
|                                    |                                                                                                                                   |
| **[shard-precreation]**            |                                                                                                                                   |
| check-interval                     | [storage-shard-precreator-check-interval](/influxdb/v2.0/reference/config-options/#storage-shard-precreator-check-interval)       |
| advance-period                     | [storage-shard-precreator-advance-period](/influxdb/v2.0/reference/config-options/#storage-shard-precreator-advance-period)       |
|                                    |                                                                                                                                   |
| **[http]**                         |                                                                                                                                   |
| flux-enabled                       |                                                                                                                                   |
| flux-log-enabled                   |                                                                                                                                   |
| bind-address                       | [http-bind-address](/influxdb/v2.0/reference/config-options/#http-bind-address)                                                   |
| auth-enabled                       |                                                                                                                                   |
| realm                              |                                                                                                                                   |
| log-enabled                        |                                                                                                                                   |
| suppress-write-log                 |                                                                                                                                   |
| access-log-path                    |                                                                                                                                   |
| access-log-status-filters          |                                                                                                                                   |
| write-tracing                      |                                                                                                                                   |
| pprof-enabled                      |                                                                                                                                   |
| pprof-auth-enabled                 |                                                                                                                                   |
| debug-pprof-enabled                |                                                                                                                                   |
| ping-auth-enabled                  |                                                                                                                                   |
| https-enabled                      |                                                                                                                                   |
| https-certificate                  | [tls-cert](/influxdb/v2.0/reference/config-options/#tls-cert)                                                                     |
| https-private-key                  | [tls-key](/influxdb/v2.0/reference/config-options/#tls-key)                                                                       |
| shared-secret                      |                                                                                                                                   |
| max-row-limit                      |                                                                                                                                   |
| max-connection-limit               |                                                                                                                                   |
| unix-socket-enabled                |                                                                                                                                   |
| bind-socket                        |                                                                                                                                   |
| max-body-size                      |                                                                                                                                   |
| max-concurrent-write-limit         |                                                                                                                                   |
| max-enqueued-write-limit           |                                                                                                                                   |
| enqueued-write-timeout             |                                                                                                                                   |
|                                    |                                                                                                                                   |
| **[logging]**                      |                                                                                                                                   |
| format                             |                                                                                                                                   |
| level                              | [log-level](/influxdb/v2.0/reference/config-options/#log-level)                                                                   |
| suppress-logo                      |                                                                                                                                   |
|                                    |                                                                                                                                   |
| **[tls]**                          |                                                                                                                                   |
| ciphers                            | [tls-strict-ciphers](/influxdb/v2.0/reference/config-options/#tls-strict-ciphers)                                                 |
| min-version                        | [tls-min-version](/influxdb/v2.0/reference/config-options/#tls-min-version)                                                       |
| max-version                        |                                                                                                                                   |

{{% note %}}
#### 1.x configuration groups not in 2.0
The following 1.x configuration groups **do not** apply to InfluxDB 2.0:

- meta
- coordinator
- monitor
- subscriber
- graphite
- collectd
- opentsdb
- udp
- continuous_queries
{{% /note %}}
{{% /expand %}}
{{< /expand-wrapper >}}

With custom configuration settings in place, **restart `influxd`**.

## Create authorizations
InfluxDB 2.0 requires authentication and provides two methods for authenticating requests:

- [Token authentication](#token-authentication)
- [1.x compatible authorizations](#1x-compatible-authorizations)

### Token authentication
Use InfluxDB [2.0 token authentication](/influxdb/v2.0/security/tokens/)

##### Recommended if:
- Your 1.x instances **does not have authentication enabled**.

### 1.x compatible authorizations
InfluxDB 2.0 provides a [1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/)
that lets you authenticate using a username and password as in InfluxDB 1.x.
If authentication is enabled in your InfluxDB 1.x instance,
[create a 1.x-compatible authorization](#create-a-1x-compatible-authorization)
to allow external clients to connect to your InfluxDB 2.0 instance without any change.

##### Recommended if:
- Your 1.x instances **has authentication enabled**.
- You're using InfluxDB 1.x clients or client libraries.

{{% note %}}
1.x compatibility authorizations are _separate from_ the credentials used to log
into the InfluxDB user interface.
{{% /note %}}

#### Create a 1.x-compatible authorization
Use the [`influx v1 auth create` command](/influxdb/v2.0/reference/cli/influx/v1/auth/create/)
to grant read/write permissions to specific buckets.
Provide the following:

- a list of [bucket IDs](/influxdb/v2.0/organizations/buckets/view-buckets/) for which to grant read or write permissions
- new v1 auth username
- new v1 auth password _(when prompted)_

```sh
influx v1 auth create \
  --read-bucket 00xX00o0X001 \
  --write-bucket 00xX00o0X001 \
  --username example-user
```

#### View existing v1 authorizations
Use the [`influx v1 auth list`](/influxdb/v2.0/reference/cli/influx/v1/auth/list/)
to list existing InfluxDB v1 compatible authorizations.
To verify 1.x users were successfully migrated to 2.0, run [`influx v1 auth list`](/influxdb/v2.0/reference/cli/influx/v1/auth/list/).

```sh
influx v1 auth list
```

## Create DBRP mapping
InfluxDB DBRP mappings associate database and retention policy pairs
with InfluxDB 2.0 [buckets](/influxdb/v2.0/reference/glossary/#bucket).

1. [Create buckets in InfluxDB 2.0](/influxdb/v2.0/organizations/buckets/).
   We recommend creating a bucket for each unique 1.x database and retention
   policy combination using the following convention:

    ```sh
    # Convention
    db-name/rp-name

    # Example
    telegraf/autogen
    ```

#### Create a DBRP mapping
Use the [`influx v1 dbrp create` command](/influxdb/v2.0/reference/cli/influx/v1/dbrp/create/)
command to create a DBRP mapping.
Provide the following:

- database name
- retention policy
- [bucket ID](/influxdb/v2.0/organizations/buckets/view-buckets/)

```sh
influx v1 dbrp create \
  --db example-db \
  --rp example-rp \
  --bucket-id 00xX00o0X001 \
  --default
```

_For more information about DBRP mapping, see [Database and retention policy mapping](/influxdb/v2.0/reference/api/influxdb-1x/dbrp/)._

#### View existing DBRP mappings
Use the [`influx v1 dbrp list`](/influxdb/v2.0/reference/cli/influx/v1/dbrp/list/) to list existing DBRP mappings.

```sh
influx v1 dbrp list
```


## Migrate time series data
1. Use the **InfluxDB 1.x** [`influx_inspect export` command](/{{< latest "influxdb" "v1" >}}/tools/influx_inspect/#export)
   to export time series data as line protocol.
   Include the `-lponly` flag to exclude comments and the data definition
   language (DDL) from the output file.

   _We recommend exporting each database and retention policy combination separately
   to easily write data to the appropriate InfluxDB 2.0 bucket._

    ```sh
    # Syntax
    influx_inspect export \
      -database <database-name> \
      -retention <retention-policy-name> \
      -out <output-file-path> \
      -lponly

    # Example
    influx_inspect export \
      -database example-db \
      -retention example-rp \
      -out /path/to/example-db_example-rp.lp \
      -lponly
    ```

2. Write the exported line protocol to an InfluxDB 2.0 bucket.
   The following example uses the **InfluxDB 2.0** [`influx write` command](/influxdb/v2.0/reference/cli/influx/write/)
   to write exported to InfluxDB 2.0:

    ```sh
    # Syntax
    influx write \
      --bucket <bucket-name> \
      --file <path-to-line-protocol-file>

    # Example
    influx write \
      --bucket example-db/example-rp \
      --file /path/to/example-db_example-rp.lp
    ```

    Repeat this process for each bucket.
    _For other ways to write line protocol to InfluxDB 2.0, see [Write data](/influxdb/v2.0/write-data/)._

## Migrate continuous queries
For information about migrating InfluxDB 1.x continuous queries to InfluxDB 2.0 tasks,
see [Migrate continuous queries to tasks](/influxdb/v2.0/upgrade/v1-to-v2/migrate-cqs/).
