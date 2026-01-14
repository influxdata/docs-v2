---
title: Use Chronograf
seotitle: Use Chronograf with InfluxDB Clustered
description: >
  Chronograf is a data visualization and dashboarding tool designed to visualize data in InfluxDB 1.x.
  Learn how to use Chronograf with InfluxDB Clustered.
menu:
  influxdb3_clustered:
    name: Use Chronograf
    parent: Visualize data
weight: 202
aliases:
  - /influxdb3/clustered/visualize-data/chronograf/
related:
  - /chronograf/v1/
  - /influxdb3/clustered/query-data/influxql/
metadata: [InfluxQL only]
---

[Chronograf](/chronograf/v1/) is a data visualization and dashboarding
tool designed to visualize data in InfluxDB 1.x using the **InfluxQL** query language.
This page walks through how to use Chronograf with **{{% product-name %}}**.

## Prerequisites

- [Download and install Chronograf](/chronograf/v1/introduction/installation/#download-and-install)
- An {{% product-name %}} cluster with:
  - A [database](/influxdb3/clustered/admin/databases/) to query
  - A [database token](/influxdb3/clustered/admin/tokens/#database-tokens) with read permissions

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

    ![Chronograf connections landing page](/img/chronograf/1-6-connection-landing-page.png)

3. In the **Server Type** dropdown, select **InfluxDB Clustered**.

    <img src="/img/chronograf/v1-influxdb3/server-type-dropdown.png" style="width:100%; max-width:798px;" alt="Chronograf Server Type dropdown"/>

4. Enter your {{% product-name %}} connection credentials:

    - **Connection URL:** {{% product-name omit=" Clustered" %}} cluster URL

      ```
      https://{{< influxdb/host >}}
      ```

    - **Connection Name:** Name to uniquely identify this connection configuration
    - **Management Token:** _(Optional)_ A [management token](/influxdb3/clustered/admin/tokens/management/)
      for administrative operations
    - **Database Token:** InfluxDB [database token](/influxdb3/clustered/admin/tokens/#database-tokens)
      with read permissions on the database you want to query
    - **Default Database:** _(Optional)_ Default [database](/influxdb3/clustered/admin/databases/)
      to use. When set, Chronograf limits queries to this database.
    - **Telegraf Database Name:** InfluxDB [database](/influxdb3/clustered/admin/databases/)
      Chronograf uses to populate parts of the application, including the Host List page (default is `telegraf`)
    - **Unsafe SSL:** Enable to skip SSL certificate verification for self-signed certificates

    <img src="/img/chronograf/v1-influxdb3/clustered-connection.png" style="width:100%; max-width:798px;" alt="Chronograf InfluxDB Clustered connection configuration"/>

5. Click **Add Connection**.
6. Select the dashboards you would like to create, and then click **Next**.
7. To configure a Kapacitor connection, provide the necessary credentials,
   and then click **Continue**. Otherwise, click **Skip**.
8. Click **Finish**.

### Configure connection via CLI

You can also configure the connection when starting Chronograf:

```sh
chronograf --influxdb-v3-support-enabled \
  --influxdb-type=influx-v3-clustered \
  --influxdb-url=https://{{< influxdb/host >}} \
  --influxdb-token=DATABASE_TOKEN \
  --influxdb-mgmt-token=MANAGEMENT_TOKEN \
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
> You can also use [fully qualified measurements](/influxdb3/clustered/reference/influxql/select/#fully-qualified-measurement)
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
> [InfluxQL feature support](/influxdb3/clustered/reference/influxql/feature-support/).

> [!Note]
> #### DBRPs map to InfluxDB databases
>
> In {{% product-name %}}, databases and retention policies (DBRPs) are no longer
> separate entities in the data model.
> Rather than having one or more retention policies, an {{% product-name %}} database
> has a retention period that defines the maximum age of data to retain.
>
> InfluxQL queries still use the 1.x DBRP convention, but queries are routed to
> databases using the `database-name/retention-policy` naming pattern.
> For example, the following query routes to the {{% product-name %}} database
> named `mydb/autogen`:
>
> ```sql
> SELECT * FROM mydb.autogen.measurement
> ```

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

When connected to an {{% product-name %}} database, functionality in the
**{{< icon "crown" >}} InfluxDB Admin** section of Chronograf is disabled.

To complete [administrative tasks](/influxdb3/clustered/admin/), use the
[influxctl CLI](/influxdb3/clustered/reference/cli/influxctl/).

### Annotations and variables

Annotations and dashboard variables work with {{% product-name %}} when a `chronograf` database exists and is accessible with the same database token.

When setting up variables with dynamic tag values, the backend query limits the scope of the record search with a time condition.
By default, this is `time > now() - 7d`.
Tags from records older than this limit are ignored.
To change this setting, use the `--influxdb-v3-time-condition` flag or `INFLUXDB_V3_TIME_CONDITION` environment variable.
