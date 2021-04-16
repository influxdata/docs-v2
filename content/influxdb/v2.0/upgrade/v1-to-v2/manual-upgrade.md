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
3. [Create DBRP mappings](#create-dbrp-mappings)
4. [Create authorizations](#create-authorizations)
5. [Migrate time series data](#migrate-time-series-data)
6. [Migrate continuous queries](#migrate-continuous-queries)

## Install InfluxDB 2.0
[Download, install, and set up InfluxDB 2.0](/influxdb/v2.0/get-started/).

{{% note %}}
#### Required 2.x credentials
All InfluxDB 2.0 `influx` CLI examples below assume the required **host**,
**organization**, and **authentication token** credentials are provided by your
[`influx` CLI configuration](/influxdb/v2.0/reference/cli/influx/#provide-required-authentication-credentials).
{{% /note %}}

## Migrate custom configuration settings
If you're using custom configuration settings in your InfluxDB 1.x instance, do the following:

1.  Compare 1.x and 2.0 configuration settings:

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

2.  Apply your 1.x custom settings to the comparable InfluxDB 2.0 settings using
   `influxd` flags, environment variables, or a 2.0 configuration file.
    For more information about configuring InfluxDB 2.0, see
    [Configuration options](/influxdb/v2.0/reference/config-options/).
3.  **Restart `influxd`**.

## Create DBRP mappings
InfluxDB database and retention policy (DBRP) mappings associate database and
retention policy combinations with InfluxDB 2.0 [buckets](/influxdb/v2.0/reference/glossary/#bucket).
These mappings allow InfluxDB 1.x clients to successfully query and write to
InfluxDB 2.0 buckets while using the 1.x DBRP convention.

_For more information about DBRP mapping, see
[Database and retention policy mapping](/influxdb/v2.0/reference/api/influxdb-1x/dbrp/)._

**To map a DBRP combination to an InfluxDB 2.0 bucket:**

1.  **Create a bucket**  
    [Create an InfluxDB 2.0 bucket](/influxdb/v2.0/organizations/buckets/create-bucket/).
    We recommend creating a bucket for each unique 1.x database and retention
    policy combination using the following naming convention:

    ```sh
    # Naming convention
    db-name/rp-name

    # Example
    telegraf/autogen
    ```

2.  **Create a DBRP mapping**  
    Use the [`influx v1 dbrp create` command](/influxdb/v2.0/reference/cli/influx/v1/dbrp/create/)
    to create a DBRP mapping.
    Provide the following:

    - database name
    - retention policy name _(not retention period)_
    - [bucket ID](/influxdb/v2.0/organizations/buckets/view-buckets/)
    - _(optional)_ `--default` flag if you want the retention policy to be the default retention
      policy for the specified database

    {{< code-tabs-wrapper >}}
    {{% code-tabs %}}
[DB with one RP](#)
[DB with multiple RPs](#)
    {{% /code-tabs %}}
    {{% code-tab-content %}}
```sh
influx v1 dbrp create \
  --db example-db \
  --rp example-rp \
  --bucket-id 00xX00o0X001 \
  --default
```
    {{% /code-tab-content %}}
    {{% code-tab-content %}}
```sh
# Create telegraf/autogen DBRP mapping with autogen
# as the default RP for the telegraf DB

influx v1 dbrp create \
  --db telegraf \
  --rp autogen \
  --bucket-id 00xX00o0X001 \
  --default

# Create telegraf/downsampled-daily DBRP mapping that
# writes to a different bucket

influx v1 dbrp create \
  --db telegraf \
  --rp downsampled-daily \
  --bucket-id 00xX00o0X002
```
    {{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

3.  **Confirm the DBRP mapping was created**  
    Use the [`influx v1 dbrp list`](/influxdb/v2.0/reference/cli/influx/v1/dbrp/list/) to list existing DBRP mappings.

    ```sh
    influx v1 dbrp list
    ```

For information about managing DBRP mappings, see the
[`influx v1 dbrp` command documentation](/influxdb/v2.0/reference/cli/influx/v1/dbrp/).

## Create authorizations
InfluxDB 2.0 requires authentication and provides two authentication methods:

- [Token authentication](#token-authentication)
- [1.x compatible authorizations](#1x-compatible-authorizations)

### Token authentication
Use [InfluxDB 2.0 token authentication](/influxdb/v2.0/security/tokens/) to
authenticate requests to InfluxDB 2.0.

##### Recommended if:
- Your 1.x instance **does not have authentication enabled**.

{{% note %}}
#### Use tokens with basic authentication
To use tokens with InfluxDB clients that require an InfluxDB username and password,
provide an arbitrary user name and pass the token as the password.
{{% /note %}}

### 1.x-compatible authorizations
InfluxDB 2.0 provides a [1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/)
that lets you authenticate using a username and password as in InfluxDB 1.x.
If authentication is enabled in your InfluxDB 1.x instance,
[create a 1.x-compatible authorization](#create-a-1x-compatible-authorization)
with the same username and password as your InfluxDB 1.x instance to allow
external clients to connect to your InfluxDB 2.0 instance without any change.

##### Recommended if:
- Your 1.x instance **has authentication enabled**.
- You're using **InfluxDB 1.x clients or client libraries** configured with
  InfluxDB usernames and passwords.

{{% note %}}
1.x compatibility authorizations are separate from credentials used to log
into the InfluxDB 2.0 user interface (UI).
{{% /note %}}

#### Create a 1.x-compatible authorization
Use the InfluxDB 2.0 [`influx v1 auth create` command](/influxdb/v2.0/reference/cli/influx/v1/auth/create/)
to create a 1.x-compatible authorization that grants read/write permissions to specific 2.0 buckets.
Provide the following:

- list of [bucket IDs](/influxdb/v2.0/organizations/buckets/view-buckets/) to
  grant read or write permissions to
- new v1 auth username
- new v1 auth password _(when prompted)_

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Single bucket](#)
[Mutiple buckets](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
influx v1 auth create \
  --read-bucket 00xX00o0X001 \
  --write-bucket 00xX00o0X001 \
  --username example-user
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
influx v1 auth create \
  --read-bucket 00xX00o0X001 \
  --read-bucket 00xX00o0X002 \
  --write-bucket 00xX00o0X001 \
  --write-bucket 00xX00o0X002 \
  --username example-user
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

For information about managing 1.x compatible authorizations, see the
[`influx v1 auth` command documentation](/influxdb/v2.0/reference/cli/influx/v1/auth/).

## Migrate time series data
To migrate time series data from your InfluxDB 1.x instance to InfluxDB 2.0:

1. Use the **InfluxDB 1.x** [`influx_inspect export` command](/{{< latest "influxdb" "v1" >}}/tools/influx_inspect/#export)
   to export time series data as line protocol.
   Include the `-lponly` flag to exclude comments and the data definition
   language (DDL) from the output file.

   _We recommend exporting each DBRP combination separately to easily write data
   to a corresponding InfluxDB 2.0 bucket._

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

2. Use the **InfluxDB 2.0** [`influx write` command](/influxdb/v2.0/reference/cli/influx/write/)
   to write the exported line protocol to InfluxDB 2.0.

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

## Migrate continuous queries
For information about migrating InfluxDB 1.x continuous queries to InfluxDB 2.0 tasks,
see [Migrate continuous queries to tasks](/influxdb/v2.0/upgrade/v1-to-v2/migrate-cqs/).
