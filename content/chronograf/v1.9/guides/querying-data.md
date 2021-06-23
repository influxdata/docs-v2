---
title: Explore data in Chronograf
description: Query and visualize data in the Data Explorer.
menu:
  chronograf_1_9:
    name: Explore data in Chronograf
    weight: 130
    parent: Guides
---

Explore and visualize your data in the **Data Explorer**. For both InfluxQL and Flux, Chronograf allows you to move seamlessly between using the builder or templates and manually editing the query; when possible, the interface automatically populates the builder with the information from your raw query. Choose between [visualization types](/chronograf/v1.9/guides/visualization-types/) for your query.

To open the **Data Explorer**, click the **Explore** icon in the navigation bar:

<img src="/img/chronograf/1-7-data-explorer-icon.png" style="width:100%; max-width:400px; margin:2em 0; display: block;">

## Select local time or UTC (Coordinated Universal Time)

- In the upper-right corner of the page, select the time to view metrics and events by clicking one of the following:
  - **UTC** for Coordinated Universal Time
  - **Local** for the local time reported by your browser

{{% note %}}
**Note:** If your organization spans multiple time zones, we recommend using UTC (Coordinated Universal Time) to ensure that everyone sees metrics and events for the same time.
{{% /note %}}

## Explore data with InfluxQL

InfluxQL is a SQL-like query language you can use to interact with data in InfluxDB. For detailed tutorials and reference material, see our [InfluxQL documentation](/{{< latest "influxdb" "v1" >}}/query_language/).

{{% note %}}
#### Limited InfluxQL support in InfluxDB Cloud and OSS 2.x
Chronograf interacts with **InfluxDB Cloud** and **InfluxDB OSS 2.x** through the
[v1 compatibility API](/influxdb/cloud/reference/api/influxdb-1x/).
The v1 compatibility API provides limited InfluxQL support.
For more information, see [InfluxQL support](/influxdb/cloud/query-data/influxql/#influxql-support).
{{% /note %}}

1. Open the Data Explorer and click **Add a Query**.
2. To the right of the source dropdown above the graph placeholder, select **InfluxQL** as the source type.
3. Use the builder to select from your existing data and allow Chronograf to format the query for you. Alternatively, manually enter and edit a query.
4. You can also select from the dropdown list of **Metaquery Templates** that manage databases, retention policies, users, and more.
   _See [Metaquery templates](#metaquery-templates)._
5. To display the templated values in the query, click **Show template values**.
6. Click **Submit Query**.

## Explore data with Flux

Flux is InfluxData's new functional data scripting language designed for querying, analyzing, and acting on time series data. To learn more about Flux, see [Getting started with Flux](/{{< latest "influxdb" "v2" >}}/query-data/get-started).

1. Open the Data Explorer and click **Add a Query**.
2. To the right of the source dropdown above the graph placeholder, select **Flux** as the source type.
 The **Schema**, **Functions**, and **Script** panes appear.
3. Use the **Schema** pane to explore your available data. Click the **+** sign next to a bucket name to expand its content.
4. Use the **Functions** pane to view details about the available Flux functions.
5. Use the **Script** pane to enter your Flux query.

    * To get started with your query, click the **Script Wizard**. In the wizard, you can select a bucket, measurement, fields and an aggregate.

      <img src="/img/chronograf/1-7-flux-script-wizard.png" style="width:100%; max-width:400px; margin:2em 0; display:block;">

    For example, if you make the above selections, the wizard inserts the following script:

    ```js
    from(bucket: "telegraf/autogen")
      |> range(start: dashboardTime)
      |> filter(fn: (r) => r._measurement == "cpu" and (r._field == "usage_system"))
      |> window(every: autoInterval)
      |> toFloat()
      |> percentile(percentile: 0.95)
      |> group(except: ["_time", "_start", "_stop", "_value"])
    ```
    * Alternatively, you can enter your entire script manually.

6. Click **Run Script** in the top bar of the **Script** pane. You can then preview your graph in the above pane.

## Visualize your query

Select the **Visualization** tab at the top of the **Data Explorer**. For details about all of the available visualization options, see [Visualization types in Chronograf](/chronograf/v1.9/guides/visualization-types/).

## Add queries to dashboards

To add your query and graph to a dashboard:

1. Click **Send to Dashboard** in the upper right.
2. In the **Target Dashboard(s)** dropdown, select at least one existing dashboard to send the cell to, or select **Send to a New Dashboard**.
3. Enter a name for the new cell and, if you created a new dashboard, the new dashboard.
4. If using an **InfluxQL** data source and you have multiple queries in the Data Explorer,
select which queries to send:
    - **Active Query**: Send the currently viewed query.
    - **All Queries**: Send all queries.
5. Click **Send to Dashboard(s)**.

## Metaquery templates
Metaquery templates provide templated InfluxQL queries manage databases, retention policies, users, and more.
Choose from the following options in the **Metaquery Templates** dropdown list:

###### Manage databases
- [Show Databases](/{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-databases)
- [Create Database](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#create-database)
- [Drop Database](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#delete-a-database-with-drop-database)

###### Measurements, Tags, and Fields
- [Show Measurements](/{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-measurements)
- [Show Tag Keys](/{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-tag-keys)
- [Show Tag Values](/{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-tag-values)
- [Show Field Keys](/{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-field-keys)

###### Cardinality
- [Show Field Key Cardinality](/{{< latest "influxdb" "v1" >}}/query_language/spec/#show-field-key-cardinality)
- [Show Measurement Cardinality](/{{< latest "influxdb" "v1" >}}/query_language/spec/#show-measurement-cardinality)
- [Show Series Cardinality](/{{< latest "influxdb" "v1" >}}/query_language/spec/#show-series-cardinality)
- [Show Tag Key Cardinality](/{{< latest "influxdb" "v1" >}}/query_language/spec/#show-tag-key-cardinality)
- [Show Tag Values Cardinality](/{{< latest "influxdb" "v1" >}}/query_language/spec/#show-tag-values-cardinality)

###### Manage retention policies
- [Show Retention Polices](/{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-retention-policies)
- [Create Retention Policy](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#create-retention-policies-with-create-retention-policy)
- [Drop Retention Policy](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#delete-retention-policies-with-drop-retention-policy)

###### Manage continuous queries
- [Show Continuous Queries](/{{< latest "influxdb" "v1" >}}/query_language/continuous_queries/#listing-continuous-queries)
- [Create Continuous Query](/{{< latest "influxdb" "v1" >}}/query_language/continuous_queries/#syntax)
- [Drop Continuous Query](/{{< latest "influxdb" "v1" >}}/query_language/continuous_queries/#deleting-continuous-queries)

###### Manage users and permissions
- [Show Users](/{{< latest "influxdb" "v1" >}}/query_language/spec/#show-users)
- [Show Grants](/{{< latest "influxdb" "v1" >}}/query_language/spec/#show-grants)
- [Create User](/{{< latest "influxdb" "v1" >}}/query_language/spec/#create-user)
- [Create Admin User](/{{< latest "influxdb" "v1" >}}/administration/authentication_and_authorization/#admin-user-management)
- [Drop User](/{{< latest "influxdb" "v1" >}}/query_language/spec/#drop-user)

###### Delete data
- [Drop Measurement](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#delete-measurements-with-drop-measurement)
- [Drop Series](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#drop-series-from-the-index-with-drop-series)
- [Delete](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#delete-series-with-delete)

###### Analyze queries
- [Explain](/{{< latest "influxdb" "v1" >}}/query_language/spec/#explain)
- [Explain Analyze](/{{< latest "influxdb" "v1" >}}/query_language/spec/#explain-analyze)

###### Inspect InfluxDB internal metrics
- [Show Stats](/{{< latest "influxdb" "v1" >}}/query_language/spec/#show-stats)
- [Show Diagnostics](/{{< latest "influxdb" "v1" >}}/query_language/spec/#show-diagnostics)
- [Show Subscriptions](/{{< latest "influxdb" "v1" >}}/query_language/spec/#show-subscriptions)
- [Show Queries](/{{< latest "influxdb" "v1" >}}/troubleshooting/query_management/#list-currently-running-queries-with-show-queries)
- [Show Shards](/{{< latest "influxdb" "v1" >}}/query_language/spec/#show-shards)
- [Show Shard Groups](/{{< latest "influxdb" "v1" >}}/query_language/spec/#show-shard-groups)
