---
title: Use Grafana to query and visualize data
seotitle: Use Grafana to query and visualize data stored in InfluxDB
list_title: Use Grafana
description: >
  Install and run [Grafana](https://grafana.com/) to query and visualize data
  stored in InfluxDB.
weight: 201
menu:
  influxdb_cloud_serverless:
    name: Use Grafana
    parent: Visualize data
influxdb/cloud-serverless/tags: [query, visualization, Grafana]
aliases:
  - /influxdb/cloud-serverless/query-data/tools/grafana/
  - /influxdb/cloud-serverless/query-data/sql/execute-queries/grafana/
  - /influxdb/cloud-serverless/process-data/tools/grafana/
  - /influxdb/cloud-serverless/visualize-data/grafana/
---

Use [Grafana](https://grafana.com/) to query and visualize data stored in
{{% product-name %}}.
Install the [grafana-flight-sql-plugin](https://github.com/influxdata/grafana-flightsql-datasource)
to query InfluxDB with the Flight SQL protocol.

> [Grafana] enables you to query, visualize, alert on, and explore your metrics,
> logs, and traces wherever they are stored.
> [Grafana] provides you with tools to turn your time-series database (TSDB)
> data into insightful graphs and visualizations.
>
> {{% cite %}}-- [Grafana documentation](https://grafana.com/docs/grafana/latest/introduction/){{% /cite %}}

<!-- TOC -->

- [Install Grafana or login to Grafana Cloud](#install-grafana-or-login-to-grafana-cloud)
- [InfluxDB Data Source](#influxdb-data-source)
- [Create a datasource](#create-a-datasource)
    - [Map databases and retention policies to buckets](#map-databases-and-retention-policies-to-buckets)
- [Query InfluxDB with Grafana](#query-influxdb-with-grafana)
- [Build visualizations with Grafana](#build-visualizations-with-grafana)
- [FlightSQL plugin (Community)](#flightsql-plugin-community)
  - [Install](#install)
    - [Only required if using SQL](#only-required-if-using-sql)
  - [Use grafana-cli](#use-grafana-cli)
  - [Use the Grafana UI](#use-the-grafana-ui)

<!-- /TOC -->

## Install Grafana or login to Grafana Cloud

If using the open source version of **Grafana**, follow the
[Grafana installation instructions](https://grafana.com/docs/grafana/latest/setup-grafana/installation/)
to install Grafana for your operating system.
If using **Grafana Cloud**, login to your Grafana Cloud instance.

## InfluxDB Data Source
The InfluxDB Data Source plugin is included in the Grafana core distribution. The plugin can be used to query and visualize data stored in InfluxDB Cloud Serverless with both InfluxQL and SQL. 

<div style="background-color: #eef;padding:10px;border-left:5px solid #55f;">
<strong>❗ Note:</strong> If you are using Grafana OSS/Enterprise and wish to query with <strong>SQL</strong>, you must install Grafana OSS/Enterprise version <code>10.3.0</code> or later. Please check which version of Grafana you are downloading via the <a href="https://grafana.com/grafana/download">Grafana download page</a>. You may need to install a <Strong>Nightly Build</Strong> of Grafana to get the version of the data source.
</div>

## Create a datasource

Which datasource you create depends on which query language you want to use to
query {{% product-name %}}:

- To query with **SQL**, create a **InfluxDB** datasource.
- To query with **InfluxQL**, create an **InfluxDB** datasource.

{{< tabs-wrapper >}}
{{% tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /tabs %}}
{{% tab-content %}}
<!--------------------------------- BEGIN SQL --------------------------------->

1.  In your Grafana user interface (UI), navigate to **Data Sources**.
2.  Click **Add new data source**.
3.  Search for and select the **InfluxDB** plugin.
4.  Provide a name for your datasource.
5.  Under **Query Language**, select **`SQL`**.
6.  Under **HTTP**:

    - **URL**: Provide your [{{% product-name %}} region URL](/influxdb/cloud-serverless/reference/regions/)
    using the HTTPS protocol:

      ```
      https://{{< influxdb/host >}}
      ```

7.  Under **InfluxDB Details**:

    - **Database**: Provide a database name to query. Use the database name that is mapped to your InfluxBD Cloud bucket.
    - **Token**: Provide an [API token](/influxdb/cloud-serverless/admin/tokens/)
      with read access to the buckets you want to query.

8.  Click **Save & test**.

    {{< img-hd src="/img/influxdb/cloud-serverless-grafana-influxdb-datasource.png" alt="Grafana InfluxDB datasource for InfluxDB Cloud Serverless" />}}

<!---------------------------------- END SQL ---------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN INFLUXQL ------------------------------>

{{% note %}}
#### Map databases and retention policies to buckets

To query {{% product-name %}} with InfluxQL, first map database and retention policy
(DBRP) combinations to your InfluxDB Cloud buckets. For more information, see
[Map databases and retention policies to buckets](/influxdb/cloud-serverless/query-data/influxql/dbrp/).
{{% /note %}}

1.  In your Grafana user interface (UI), navigate to **Data Sources**.
2.  Click **Add new data source**.
3.  Search for and select the **InfluxDB** core plugin.
4.  Provide a name for your datasource.
5.  Under **Query Language**, select **InfluxQL**.
6.  Under **HTTP**:

    - **URL**: Provide your [{{% product-name %}} region URL](/influxdb/cloud-serverless/reference/regions/)
    using the HTTPS protocol:

      ```
      https://{{< influxdb/host >}}
      ```

7.  Under **InfluxDB Details**:

    - **Database**: Provide a database name to query. Use the database name that is mapped to your InfluxBD Cloud bucket.
    - **User**: Provide an arbitrary string.
      _This credential is ignored when querying {{% product-name %}}, but it cannot be empty._
    - **Password**: Provide an [API token](/influxdb/cloud-serverless/admin/tokens/)
      with read access to the buckets you want to query.

7.  Click **Save & test**.

    {{< img-hd src="/img/influxdb/cloud-serverless-grafana-influxdb-datasource.png" alt="Grafana InfluxDB datasource for InfluxDB Cloud Serverless" />}}

<!-------------------------------- END INFLUXQL ------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Query InfluxDB with Grafana

After you [configure and save a FlightSQL or InfluxDB datasource](#create-a-datasource),
use Grafana to build, run, and inspect queries against your InfluxDB bucket.

{{< tabs-wrapper >}}
{{% tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /tabs %}}
{{% tab-content %}}
<!--------------------------------- BEGIN SQL --------------------------------->

{{% note %}}
{{% sql/sql-schema-intro %}}
To learn more, see [Query Data](/influxdb/cloud-serverless/query-data/sql/).
{{% /note %}}

1. Click **Explore view**.
2. In the dropdown, select the saved data source that you want to query.
3. Use the SQL query form to build your query:
    - **Table**: Select the measurement that you want to query.
    - **Column**: Select one or more fields and tags to return as columns in query results.
                  In Grafana, you must specify a **time** column in the `SELECT` list.
4. *(optional)* Toggle **filter** to generate **WHERE** clause statements.
    - **WHERE**: To filter the query results, enter a conditional expression.
5. *(optional)* Toggle **group** to generate **GROUP BY** clause statements.
    - **GROUP BY**: To `GROUP BY` one or more fields or tags, select each via the dropdown list provided.
                    If you include an aggregate function in the **SELECT** list,
                    then you must include one or more of the queried columns in a `GROUP BY` or `PARTITION BY` clause.
                    SQL will return the aggregation for each group or partition.
7. *(Recommended)* Toggle **order** to generate **ORDER BY** clause statements.
    - **ORDER BY**: To sort the query results, select a time, field or tag to sort by.
                    You can sort by multiple fields or tags as well as the time column.
                    To sort in descending order, select **DESC**.

8. *(Recommended)* Change format to **Time series**.
    - Use the **Format** dropdown to change the format of the query results.
      For example, to visualize the query results as a time series, select **Time series**.

9. Click **Run query** to execute the query.

{{< img-hd src="/img/influxdb/cloud-serverless-grafana-flightsql-explore-query.png" alt="Grafana Flight SQL datasource query" />}}

<!---------------------------------- END SQL ---------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN INFLUXQL ------------------------------>

1. Click **Explore**.
2. In the dropdown, select the **InfluxDB** data source that you want to query.
3. Use the InfluxQL query form to build your query:
    - **FROM**: Select the measurement that you want to query.
    - **WHERE**: To filter the query results, enter a conditional expression.
    - **SELECT**: Select fields to query and an aggregate function to apply to each.
      The aggregate function is applied to each time interval defined in the
      `GROUP BY` clause.
    - **GROUP BY**: By default, Grafana groups data by time to downsample results
      and improve query performance.
      You can also add other tags to group by.
4. Click **Run query** to execute the query.

<!-------------------------------- END INFLUXQL ------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

To learn about query management and inspection in Grafana, see the [Grafana Explore documentation](https://grafana.com/docs/grafana/latest/explore/).

## Build visualizations with Grafana

For a comprehensive walk-through of creating visualizations with
Grafana, see the [Grafana documentation](https://grafana.com/docs/grafana/latest/).

## FlightSQL plugin (Community)

Grafana FlightSQL Data Source: A community plugin that enables you to query and visualize data from data stores with a Flight SQL endpoint enabled.

This plugin is supported by the community but is fully compatibale with InfluxDB's Flight SQL endpoint. For more information, see [Query data with Flight SQL](/influxdb/cloud-serverless/query-data/sql/).

⭐ **Developer Top Tip**: *We recommend using the official InfluxDB data source plugin for Grafana for SQL querying. However, if you are connecting to other Flight SQL-enabled data sources such as Dremio, this plugin remains an excellent choice* 

### Install

If you want to query {{% product-name %}} with **SQL**, install the
[Grafana FlightSQL plugin](https://grafana.com/grafana/plugins/influxdata-flightsql-datasource/).

{{% note %}}
#### Only required if using SQL

Installing the Grafana FlightSQL plugin is only required if using **SQL** to query
data from InfluxDB. If using **InfluxQL**, enable the
[Grafana InfluxDB core plugin](/influxdb/cloud-serverless/process-data/visualize/grafana/?t=InfluxQL#create-a-datasource).
{{% /note %}}

{{< tabs-wrapper >}}
{{% tabs %}}
[Local Grafana](#)
[Grafana Cloud](#)
{{% /tabs %}}
{{% tab-content %}}
<!---------------------------- BEGIN LOCAL GRAFANA ---------------------------->

When using the local version of Grafana, you can install the FlightSQL plugin
with the [`grafana-cli` CLI](https://grafana.com/docs/grafana/latest/cli/) or in
the Grafana user interface (UI).

- [Use grafana-cli](#use-grafana-cli)
- [Use the Grafana UI](#use-the-grafana-ui)

### Use grafana-cli

Run the following command to install the FlightSQL plugin:

```sh
grafana-cli plugins install influxdata-flightsql-datasource
```

After installing the plugin, you may need to restart your Grafana server.

### Use the Grafana UI

1. In the Grafana UI, navigate to **Configuration** > **Plugins**.
2. Search for and select the **FlightSQL** plugin.
3. Click **Install**.

<!----------------------------- END LOCAL GRAFANA ----------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!---------------------------- BEGIN GRAFANA CLOUD ---------------------------->

1. In your Grafana Cloud instance, navigate to **Administration** > **Plugins**.
2. Search for and select the **FlightSQL** plugin.
3. Click **Install via grafana.com** to navigate to the plugin page.
4. On the plugin page, click **Install plugin**.

After a moment, Grafana Cloud completes the plugin installation in your
Grafana Cloud instance.

<!----------------------------- END GRAFANA CLOUD ----------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}