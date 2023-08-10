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
- [Install the FlightSQL plugin](#install-the-flightsql-plugin)
  - [Use grafana-cli](#use-grafana-cli)
  - [Use the Grafana UI](#use-the-grafana-ui)
- [Create a datasource](#create-a-datasource)
- [Query InfluxDB with Grafana](#query-influxdb-with-grafana)
- [Build visualizations with Grafana](#build-visualizations-with-grafana)

<!-- /TOC -->

## Install Grafana or login to Grafana Cloud

If using the open source version of **Grafana**, follow the
[Grafana installation instructions](https://grafana.com/docs/grafana/latest/setup-grafana/installation/)
to install Grafana for your operating system.
If using **Grafana Cloud**, login to your Grafana Cloud instance.

## Install the FlightSQL plugin

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

## Create a datasource

Which datasource you create depends on which query language you want to use to
query {{% product-name %}}:

- To query with **SQL**, create a **FlightSQL** datasource.
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
3.  Search for and select the **FlightSQL** plugin.
4.  Provide a name for your datasource.
5.  Add your connection credentials:

    - **Host**: Provide the host and port of your Flight SQL client.
      For {{% product-name %}}, this is your
      [{{% product-name %}} region domain](/influxdb/cloud-serverless/reference/regions/)
      and port 443. For example:

      ```
      us-east-1-1.aws.cloud2.influxdata.com:443
      ```

    - **AuthType**: Select **token**.
    - **Token**: Provide an InfluxDB [API token](/influxdb/cloud-serverless/get-started/setup/#create-an-all-access-api-token) with read access to the buckets
      you want to query.
    - **Require TLS/SSL**: Enable this toggle.

6.  Add connection **MetaData**.
    {{% product-name %}} requires _one_ of the following key-value pairs:
    
    - **Key**: `database`, **Value**: Bucket name
    - **Key**: `bucket-id`, **Value**: Bucket ID

7.  Click **Save & test**.

    {{< img-hd src="/img/influxdb/cloud-serverless-grafana-flightsql-datasource.png" alt="Grafana Flight SQL datasource" />}}

    If successful, click **Explore** to begin querying InfluxDB with Flight SQL and Grafana.

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

    - **Database**: Provide a default database (bucket) name to query.
    - **User**: Provide an arbitrary string.
      _This credential is ingored when querying {{% product-name %}}, but it cannot be empty._
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

1. Click **Explore**.
2. In the dropdown, select the saved data source that you want to query.
3. Use the SQL query form to build your query:
    - **FROM**: Select the measurement that you want to query.
    - **SELECT**: Select one or more fields and tags to return as columns in query results.
                  In Grafana, you must specify a **time** column in the `SELECT` list.
    - **WHERE**: To filter the query results, enter a conditional expression.
    - **GROUP BY**: To `GROUP BY` one or more fields or tags, enter them as a comma-delimited list.
                    If you include an aggregate function in the **SELECT** list,
                    then you must include one or more of the queried columns in a `GROUP BY` or `PARTITION BY` clause.
                    SQL will return the aggregation for each group or partition.
4. Click **Run query** to execute the query.

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
