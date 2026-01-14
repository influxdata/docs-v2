---
title: Use Chronograf
seotitle: Use Chronograf with InfluxDB Cloud Serverless
description: >
  Chronograf is a data visualization and dashboarding tool designed to visualize data in InfluxDB 1.x.
  Learn how to use Chronograf with InfluxDB Cloud Serverless.
menu:
  influxdb3_cloud_serverless:
    name: Use Chronograf
    parent: Visualize data
weight: 202
aliases:
  - /influxdb3/cloud-serverless/visualize-data/chronograf/
related:
  - /chronograf/v1/
  - /influxdb3/cloud-serverless/query-data/influxql/
metadata: [InfluxQL only]
---

[Chronograf](/chronograf/v1/) is a data visualization and dashboarding
tool designed to visualize data in InfluxDB 1.x using the **InfluxQL** query language.
This page walks through how to use Chronograf with **{{% product-name %}}**.

## Prerequisites

- [Download and install Chronograf](/chronograf/v1/introduction/installation/#download-and-install)
- An {{% product-name %}} account with:
  - A [bucket](/influxdb3/cloud-serverless/admin/buckets/) to query
  - An [API token](/influxdb3/cloud-serverless/admin/tokens/) with read permissions

## Enable InfluxDB 3 support

To connect Chronograf to {{% product-name %}}, start Chronograf with InfluxDB 3 support enabled using one of the following methods:

{{< tabs-wrapper >}}
{{% tabs %}}
[CLI flag](#)
[Environment variable](#)
{{% /tabs %}}
{{% tab-content %}}
```sh
chronograf --influxdb-v3-support-enabled
```
{{% /tab-content %}}
{{% tab-content %}}
```sh
export INFLUXDB_V3_SUPPORT_ENABLED=true
chronograf
```
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Create an InfluxDB connection

1. Open Chronograf and click **Configuration** (wrench icon) in the navigation menu.
2. Click **Add Connection**.

    {{< img-hd src="/img/chronograf/1-6-connection-landing-page.png" alt="Chronograf connections landing page" />}}

3. In the **Server Type** dropdown, select **InfluxDB Cloud Serverless**.

    {{< img-hd src="/img/chronograf/v1-influxdb3/server-type-dropdown.png" alt="Chronograf Server Type dropdown" />}}

4. Enter your {{% product-name %}} connection credentials:

    - **Connection URL:** [{{% product-name %}} region URL](/influxdb3/cloud-serverless/reference/regions/)

      ```
      https://{{< influxdb/host >}}
      ```

    - **Connection Name:** Name to uniquely identify this connection configuration
    - **Database Token:** InfluxDB [API token](/influxdb3/cloud-serverless/admin/tokens/)
      with read permissions on the bucket you want to query
    - **Telegraf Database Name:** InfluxDB [bucket](/influxdb3/cloud-serverless/admin/buckets/)
      Chronograf uses to populate parts of the application, including the Host List page (default is `telegraf`)
    - **Unsafe SSL:** Enable to skip SSL certificate verification for self-signed certificates

    {{< img-hd src="/img/chronograf/v1-influxdb3/cloud-serverless-connection.png" alt="Chronograf InfluxDB Cloud Serverless connection configuration" />}}

5. Click **Add Connection**.
6. Select the dashboards you would like to create, and then click **Next**.
7. To configure a Kapacitor connection, provide the necessary credentials,
   and then click **Continue**. Otherwise, click **Skip**.
8. Click **Finish**.

### Configure connection via CLI

You can also configure the connection when starting Chronograf:

```sh
chronograf --influxdb-v3-support-enabled \
  --influxdb-type=influx-v3-serverless \
  --influxdb-url=https://{{< influxdb/host >}} \
  --influxdb-token=API_TOKEN \
  --influxdb-default-db=BUCKET_NAME
```

For a complete list of configuration options, see [InfluxDB 3 connection options](/chronograf/v1/administration/config-options/#influxdb-3-connection-options).

## Query data in the Data Explorer

1. In Chronograf, click **{{< icon "graph" "v2" >}} Explore** in the left navigation bar.
2. Build and submit InfluxQL queries.

> [!Note]
> #### DBRPs map to InfluxDB buckets
>
> In {{% product-name %}}, database and retention-policy (DBRP) combinations
> are mapped to buckets using the `database-name/retention-policy` naming convention
> or using manually created DBRP mappings.
> **DBRP mappings are required to query InfluxDB Cloud using InfluxQL.**
>
> For information, see [Create DBRP mappings](/influxdb3/cloud-serverless/query-data/influxql/dbrp/).
>
> You can use [fully qualified measurements](/influxdb3/cloud-serverless/reference/influxql/select/#fully-qualified-measurement)
> in the `FROM` clause. For example:
>
> ```sql
> -- Fully qualified measurement
> SELECT * FROM "db-name"."rp-name"."measurement-name"
>
> -- Fully qualified measurement shorthand (use the default retention policy)
> SELECT * FROM "db-name".."measurement-name"
> ```
>
> For more information about available InfluxQL functionality, see
> [InfluxQL feature support](/influxdb3/cloud-serverless/reference/influxql/feature-support/).

## Important notes

- [Database view is read-only](#database-view-is-read-only)
- [No administrative functionality](#no-administrative-functionality)
- [Annotations and variables](#annotations-and-variables)

### Database view is read-only

When connected to {{% product-name %}}, the database view in Chronograf is read-only.

### No administrative functionality

Chronograf cannot be used for administrative tasks in {{% product-name %}}.
For example, you **cannot** do the following:

- Define databases
- Modify retention policies
- Add users
- Kill queries

When connected to an {{% product-name %}} bucket, functionality in the
**{{< icon "crown" >}} InfluxDB Admin** section of Chronograf is disabled.

To complete administrative tasks, use the following:

- **InfluxDB user interface (UI)**
- [InfluxDB CLI](/influxdb3/cloud-serverless/reference/cli/influx/)

### Annotations and variables

Annotations and dashboard variables work with {{% product-name %}} when a `chronograf` bucket exists and is accessible with the same API token.

When setting up variables with dynamic tag values, the backend query limits the scope of the record search with a time condition.
By default, this is `time > now() - 7d`.
Tags from records older than this limit are ignored.
To change this setting, use the `--influxdb-v3-time-condition` flag or `INFLUXDB_V3_TIME_CONDITION` environment variable.
