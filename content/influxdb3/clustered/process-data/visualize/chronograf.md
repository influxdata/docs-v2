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
metadata: [InfluxQL only]
related:
  - /influxdb3/clustered/query-data/influxql/
---

[Chronograf](/chronograf/v1/) is a data visualization and dashboarding
tool designed to visualize data in InfluxDB 1.x using the **InfluxQL** query language.
This page walks through how to use Chronograf with **{{% product-name %}}**.

## Download and install Chronograf

If you haven't already, [download and install Chronograf](/chronograf/v1/introduction/installation/#download-and-install).

## Create an InfluxDB connection

1. In Chronograf, click **Configuration** in the left navigation bar,
   and then click **{{< icon "plus" >}} Add Connection**.
2. Enter your {{% product-name %}} connection credentials:

    - **Connection URL:** {{% product-name omit=" Clustered" %}} cluster URL

      ```
      https://{{< influxdb/host >}}
      ```

    - **Connection Name:** Name to uniquely identify this connection configuration
    - **Username:** Arbitrary string _(ignored, but cannot be empty)_
    - **Password:** InfluxDB [database token](/influxdb3/clustered/admin/tokens/#database-tokens)
      with read permissions on the database you want to query
    - **Telegraf Database Name:** InfluxDB [database](/influxdb3/clustered/admin/databases/)
      Chronograf uses to populate parts of the application, including the Host List page (default is `telegraf`)
    - **Default Retention Policy:** Default [retention policy](/influxdb3/clustered/reference/glossary/#retention-policy-rp)
      _**(leave blank)**_

        > [!Note]
        > #### DBRPs map to InfluxDB databases
        > 
        > In {{% product-name %}}, databases and retention-policies (DBRPs) are no longer 
        > separate entities in the data model. Rather than having one or more retention policies,
        > an {{% product-name %}} database has a retention period, which defines the maximum
        > age of data to retain in the database.
        > InfluxQL queries still assume the 1.x DBRP convention, but with {{% product-name %}},
        > InfluxQL queries are mapped to databases using the `database-name/retention-policy`
        > naming convention. For example:
        > 
        > ```sql
        > SELECT * FROM mydb.autogen.measurement
        > ```
        > 
        > This query is routed to the {{% product-name %}} database with the name `mydb/autogen`.

3. Click **Add Connection**.
4. Select the dashboards you would like to create, and then click **Next**.
5. To configure a Kapacitor connection, provide the necessary credentials,
   and then click **Continue**. Otherwise, click **Skip**.

   <!-- <!-- _For information about using Kapacitor with {{< product-name >}} or InfluxDB OSS {{< current-version >}}, -->
   <!-- see [Use Kapacitor with InfluxDB](/influxdb/v2/tools/kapacitor/)._ -->

6. Click **Finish**.

## Query data in the Data Explorer

1. In Chronograf, click **{{< icon "graph" "v2" >}} Explore** in the left navigation bar.
2. Build and submit InfluxQL queries.

> [!Note]
> #### Schema information is not available
> 
> {{% product-name %}} currently offers limited support of InfluxQL metaqueries, so
> schema information may not be available in the Data Explorer.
> This limits the Data Explorer's query building functionality and requires you to
> build queries manually using
> [fully qualified measurements](/influxdb3/clustered/reference/influxql/select/#fully-qualified-measurement)
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

## Important notes

- [No administrative functionality](#no-administrative-functionality)
- [Limited InfluxQL feature support](#limited-influxql-feature-support)

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

### Limited InfluxQL feature support

InfluxQL is being rearchitected to work with the InfluxDB 3 storage engine.
This process is ongoing and some InfluxQL features are still being implemented.
For information about the current implementation status of InfluxQL features,
see [InfluxQL feature support](/influxdb3/clustered/reference/influxql/feature-support/).
