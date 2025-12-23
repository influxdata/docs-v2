---
title: Use Chronograf
seotitle: Use Chronograf with InfluxDB 3 Enterprise
description: >
  Chronograf is a data visualization and dashboarding tool designed to visualize data in InfluxDB 1.x.
  Learn how to use Chronograf with InfluxDB 3 Enterprise.
menu:
  influxdb3_enterprise:
    name: Use Chronograf
    parent: Visualize data
weight: 202
related:
  - /chronograf/v1/
  - /influxdb3/enterprise/query-data/influxql/
metadata: [InfluxQL only]
---

[Chronograf](/chronograf/v1/) is a data visualization and dashboarding
tool designed to visualize data in InfluxDB 1.x using the **InfluxQL** query language.
This page walks through how to use Chronograf with **{{% product-name %}}**.

## Prerequisites

- [Download and install Chronograf](/chronograf/v1/introduction/installation/#download-and-install)
- An {{% product-name %}} cluster running and accessible

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

1. In Chronograf, click **Configuration** in the left navigation bar,
   and then click **{{< icon "plus" >}} Add Connection**.
2. In the **Server Type** dropdown, select **InfluxDB 3 Enterprise**.
3. Enter your {{% product-name %}} connection credentials:

    - **Connection URL:** URL of your {{% product-name %}} cluster

      ```
      http://localhost:8181
      ```

    - **Connection Name:** Name to uniquely identify this connection configuration
    - **Database Token:** InfluxDB [database token](/influxdb3/enterprise/admin/tokens/database/)
      with read permissions on the database you want to query
    - **Default Database:** _(Optional)_ Default [database](/influxdb3/enterprise/admin/databases/)
      to use. When set, Chronograf limits queries to this database.
    - **Telegraf Database Name:** InfluxDB [database](/influxdb3/enterprise/admin/databases/)
      Chronograf uses to populate parts of the application, including the Host List page (default is `telegraf`)

4. Click **Add Connection**.
5. Select the dashboards you would like to create, and then click **Next**.
6. To configure a Kapacitor connection, provide the necessary credentials,
   and then click **Continue**. Otherwise, click **Skip**.
7. Click **Finish**.

### Configure connection via CLI

You can also configure the connection when starting Chronograf:

```sh
chronograf --influxdb-v3-support-enabled \
  --influxdb-type=influx-v3-enterprise \
  --influxdb-url=http://localhost:8181 \
  --influxdb-token=DATABASE_TOKEN \
  --influxdb-default-db=DATABASE_NAME
```

For a complete list of configuration options, see [InfluxDB 3 connection options](/chronograf/v1/administration/config-options/#influxdb-3-connection-options).

## Query data in the Data Explorer

1. In Chronograf, click **{{< icon "graph" "v2" >}} Explore** in the left navigation bar.
2. Build and submit InfluxQL queries.

> [!Note]
> #### Schema information in the Data Explorer
>
> {{% product-name %}} supports InfluxQL metaqueries, so schema information
> is available in the Data Explorer to help build queries.
> You can also use [fully qualified measurements](/influxdb3/enterprise/reference/influxql/select/#fully-qualified-measurement)
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
> [InfluxQL feature support](/influxdb3/enterprise/reference/influxql/feature-support/).

## Important notes

- [Database view is disabled](#database-view-is-disabled)
- [No administrative functionality](#no-administrative-functionality)
- [Annotations and variables](#annotations-and-variables)

### Database view is disabled

When connected to {{% product-name %}}, the database view in Chronograf is disabled.

### No administrative functionality

Chronograf cannot be used for administrative tasks in {{% product-name %}}.
For example, you **cannot** do the following:

- Define databases
- Modify retention policies
- Add users
- Kill queries

When connected to an {{% product-name %}} database, functionality in the
**{{< icon "crown" >}} InfluxDB Admin** section of Chronograf is disabled.

To complete administrative tasks, use the
[`influxdb3` CLI](/influxdb3/enterprise/reference/cli/influxdb3/).

### Annotations and variables

Annotations and dashboard variables work with {{% product-name %}} when a `chronograf` database exists and is accessible with the same database token.

When setting up variables with dynamic tag values, the backend query limits the scope of the record search with a time condition.
By default, this is `time > now() - 7d`.
Tags from records older than this limit are ignored.
To change this setting, use the `--influxdb-v3-time-condition` flag or `INFLUXDB_V3_TIME_CONDITION` environment variable.
