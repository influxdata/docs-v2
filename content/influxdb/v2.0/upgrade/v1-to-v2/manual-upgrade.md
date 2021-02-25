---
title: Manually upgrade from 1.x to InfluxDB 2.0
description: >
  Manually upgrade from 1.x to InfluxDB 2.0
menu:
  influxdb_2_0:
    parent: InfluxDB 1.x to 2.0
    name: Manually upgrade
weight: 11
---

To manually upgrade from InfluxDB 1.x to InfluxDB 2.0, the following tasks are required (at minimum):

- [Migrate data](#migrate-data)
- [Create authorizations](#create-authorization-token)
- [Create DBRP mappings](#create-dbrp-mapping)

{{% note %}}
To automatically upgrade from InfluxDB 1.x to InfluxDB 2.0, use the [`influx upgrade` command](/influxdb/v2.0/upgrade/v1-to-v2/).
{{% /note %}}

## Create authorizations
InfluxDB 2.0 requires authorization.
If you do not have authorization enabled in 1.x, you will need to enable some kind of authorization
either username and password, or [token](https://docs.influxdata.com/influxdb/cloud/reference/glossary/#token)-based authorization.

Token-based authorization is the standard method in InfluxDB 2.0.
We recommend using this method if possible.

However, the [v1 compatibility API]() provides a wrapper for using username and password so that users can continue to use 1.x clients and libraries
(that expect basic auth) with InfluxDB 2.0

InfluxDB OSS 2.0 provides a 1.x compatible authentication API that lets you
authenticate with a username and password like InfluxDB 1.x
We call such authorizations _v1 compatibility authorizations_.
(Compatibility authorizations are _separate from_ the credentials used to log into the InfluxDB user interface.)

<!-- a v1 auth setup -- how to add a v1 auth username/password combo -->


<!-- Note: influx v1 requires an authentication token -->

#### Create a v1 compatibility authorization
Use the [`influx v1 auth create` command](/influxdb/v2.0/reference/cli/influx/v1/auth/create/)
to grant read/write permissions to specific buckets.
Provide the following:

- a list of [bucket IDs](/influxdb/v2.0/organizations/buckets/view-buckets/) for which to grant read or write permissions
- a new username
- a new password _(when prompted)_

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

#### View existing DBRP mappings
Use the [`influx v1 dbrp list`](/influxdb/v2.0/reference/cli/influx/v1/dbrp/list/) to list existing DBRP mappings.

```sh
influx v1 dbrp list
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

## Migrate data
{{% warn %}}
Before doing any data migration,
stop your running InfluxDB 1.x instance and make a backup copy of all 1.x data:
```sh
cp -R .influxdb/ .influxdb_bak/
```
{{% /warn %}}

To migrate all data, use the `influxd upgrade` tool.
<!-- Is there a way to use `influxd upgrade` for time series data only, and ignore other resources/configs? -->

To selectively migrate data, use the v1 [`influx_inspect export`](/influxdb/v1.8/tools/influx_inspect/#export) command to export data as line protocol.
Then write the exported line protocol to InfluxDB 2.0.

## Other actions
See also [Migrate continuous queries to tasks](/influxdb/v2.0/upgrade/v1-to-v2/migrate-cqs/).
