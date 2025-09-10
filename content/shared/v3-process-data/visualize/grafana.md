Use [Grafana](https://grafana.com/) to query and visualize data stored in
{{% product-name %}}.

> [Grafana] enables you to query, visualize, alert on, and explore your metrics,
> logs, and traces wherever they are stored.
> [Grafana] provides you with tools to turn your time-series database (TSDB)
> data into insightful graphs and visualizations.
>
> {{% cite %}}-- [Grafana documentation](https://grafana.com/docs/grafana/latest/introduction/){{% /cite %}}

- [Install Grafana or login to Grafana Cloud](#install-grafana-or-login-to-grafana-cloud)
- [InfluxDB data source](#influxdb-data-source)
- [Create an InfluxDB data source](#create-an-influxdb-data-source)
- [Query InfluxDB with Grafana](#query-influxdb-with-grafana)
- [Build visualizations with Grafana](#build-visualizations-with-grafana)

## Install Grafana or login to Grafana Cloud

If using the open source version of **Grafana**, follow the
[Grafana installation instructions](https://grafana.com/docs/grafana/latest/setup-grafana/installation/)
to install Grafana for your operating system.
If using **Grafana Cloud**, login to your Grafana Cloud instance.

## InfluxDB data source

The InfluxDB data source plugin is included in the Grafana core distribution.
Use the plugin to query and visualize data stored in {{< product-name >}} with
both InfluxQL and SQL. 

> [!Note]
> #### Grafana 10.3+
> 
> The instructions below are for **Grafana 10.3+** which introduced the newest
> version of the InfluxDB core plugin.
> The updated plugin includes **SQL support** for InfluxDB 3-based products such
> as {{< product-name >}}.

## Create an InfluxDB data source

Which data source you create depends on which query language you want to use to
query {{% product-name %}}:

1.  In your Grafana user interface (UI), navigate to **Data Sources**.
2.  Click **Add new data source**.
3.  Search for and select the **InfluxDB** plugin.
4.  Provide a name for your data source.
5.  Under **Query Language**, select either **SQL** or **InfluxQL**:

{{< tabs-wrapper >}}
{{% tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /tabs %}}
{{% tab-content %}}
<!--------------------------------- BEGIN SQL --------------------------------->

When creating an InfluxDB data source that uses SQL to query data:

1.  Under **HTTP**:

    - **URL**: Provide your {{% show-in "cloud-serverless" %}}[{{< product-name >}} region URL](/influxdb3/version/reference/regions/){{% /show-in %}}
      {{% hide-in "cloud-serverless" %}}{{% product-name omit=" Clustered" %}} cluster URL{{% /hide-in %}} using the HTTPS protocol:

      ```
      https://{{< influxdb/host >}}
      ```
2.  Under **InfluxDB Details**:

    - **Database**: Provide a default {{% show-in "cloud-serverless" %}}[bucket](/influxdb3/version/admin/buckets/) name to query. In {{< product-name >}}, a bucket functions as a database.{{% /show-in %}}{{% hide-in "cloud-serverless" %}}[database](/influxdb3/version/admin/databases/) name to query.{{% /hide-in %}}
    - **Token**: Provide {{% show-in "cloud-serverless" %}}an [API token](/influxdb3/version/admin/tokens/) with read access to the buckets you want to query.{{% /show-in %}}{{% hide-in "cloud-serverless" %}}a [database token](/influxdb3/version/admin/tokens/#database-tokens) with read access to the databases you want to query.{{% /hide-in %}}
3.  Click **Save & test**.

{{% show-in "cloud-serverless" %}}{{< img-hd src="/img/influxdb3/cloud-serverless-grafana-influxdb-data-source-sql.png" alt="Grafana InfluxDB data source for InfluxDB Cloud Serverless that uses SQL" />}}{{% /show-in %}}
{{% show-in "cloud-dedicated" %}}{{< img-hd src="/img/influxdb/cloud-dedicated-grafana-influxdb-data-source-sql.png" alt="Grafana InfluxDB data source for InfluxDB Cloud Dedicated that uses SQL" />}}{{% /show-in %}}
{{% show-in "clustered" %}}{{< img-hd src="/img/influxdb3/clustered-grafana-influxdb-data-source-sql.png" alt="Grafana InfluxDB data source for InfluxDB Clustered that uses SQL" />}}{{% /show-in %}}

<!---------------------------------- END SQL ---------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN INFLUXQL ------------------------------>

When creating an InfluxDB data source that uses InfluxQL to query data:

{{% show-in "cloud-serverless" %}}
> [!Note]
> #### Map databases and retention policies to buckets
> 
> To query {{% product-name %}} with InfluxQL, first map database and retention policy
> (DBRP) combinations to your InfluxDB Cloud buckets. For more information, see
> [Map databases and retention policies to buckets](/influxdb3/version/query-data/influxql/dbrp/).
{{% /show-in %}}

1.  Under **HTTP**:

    - **URL**: Provide your {{% show-in "cloud-serverless" %}}[{{< product-name >}} region URL](/influxdb3/version/reference/regions/){{% /show-in %}}{{% hide-in "cloud-serverless" %}}{{% product-name omit=" Clustered" %}} cluster URL{{% /hide-in %}}
    using the HTTPS protocol:

      ```
      https://{{< influxdb/host >}}
      ```
2.  Under **InfluxDB Details**:

    - **Database**: Provide a {{% show-in "cloud-serverless" %}}database name to query.
      Use the database name that is mapped to your InfluxDB bucket{{% /show-in %}}{{% hide-in "cloud-serverless" %}}default [database](/influxdb3/version/admin/databases/) name to query{{% /hide-in %}}.
    - **User**: Provide an arbitrary string.
      _This credential is ignored when querying {{% product-name %}}, but it cannot be empty._
    - **Password**: Provide {{% show-in "cloud-serverless" %}}an [API token](/influxdb3/version/admin/tokens/) with read access to the buckets you want to query{{% /show-in %}}{{% hide-in "cloud-serverless" %}}a [database token](/influxdb3/version/admin/tokens/#database-tokens) with read access to the databases you want to query{{% /hide-in %}}.
    - **HTTP Method**: Choose one of the available HTTP request methods to use when querying data:

        - **POST** ({{< req text="Recommended" >}})
        - **GET**
3.  Click **Save & test**.

{{% show-in "cloud-dedicated" %}}{{< img-hd src="/img/influxdb/cloud-dedicated-grafana-influxdb-data-source-influxql.png" alt="Grafana InfluxDB data source for InfluxDB Cloud Dedicated using InfluxQL" />}}{{% /show-in %}}
{{% show-in "cloud-serverless" %}}{{< img-hd src="/img/influxdb3/cloud-serverless-grafana-influxdb-data-source-influxql.png" alt="Grafana InfluxDB data source for InfluxDB Cloud Serverless using InfluxQL" />}}{{% /show-in %}}
{{% show-in "clustered" %}}{{< img-hd src="/img/influxdb3/clustered-grafana-influxdb-data-source-influxql.png" alt="Grafana InfluxDB data source for InfluxDB Clustered using InfluxQL" />}}{{% /show-in %}}

<!-------------------------------- END INFLUXQL ------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Query InfluxDB with Grafana

After you [configure and save an InfluxDB datasource](#create-an-influxdb-data-source),
use Grafana to build, run, and inspect queries against your InfluxDB {{% show-in "cloud-serverless" %}}bucket{{% /show-in %}}{{% hide-in "cloud-serverless" %}}database{{% /hide-in %}}.

{{< tabs-wrapper >}}
{{% tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /tabs %}}
{{% tab-content %}}
<!--------------------------------- BEGIN SQL --------------------------------->

> [!Note]
> {{% sql/sql-schema-intro %}}
{{% show-in "cloud-serverless" %}}
> To learn more, see [Query Data](/influxdb3/version/query-data/sql/).
{{% /show-in %}}
{{% show-in "cloud-dedicated" %}}
> To learn more, see [Query Data](/influxdb3/version/query-data/sql/).
{{% /show-in %}}
{{% show-in "clustered" %}}
> To learn more, see [Query Data](/influxdb3/version/query-data/sql/).
{{% /show-in %}}

1. Click **Explore**.
2. In the dropdown, select the saved InfluxDB data source to query.
3. Use the SQL query form to build your query:
    - **Table**: Select the measurement to query.
    - **Column**: Select one or more fields and tags to return as columns in query results.
      
      With SQL, select the `time` column to include timestamps with the data.
      Grafana relies on the `time` column to correctly graph time series data.
    
    - _**Optional:**_ Toggle **filter** to generate **WHERE** clause statements.
      - **WHERE**: Configure condition expressions to include in the `WHERE` clause.

    - _**Optional:**_ Toggle **group** to generate **GROUP BY** clause statements.

      - **GROUP BY**: Select columns to group by.
        If you include an aggregation function in the **SELECT** list,
        you must group by one or more of the queried columns.
        SQL returns the aggregation for each group.

    - {{< req text="Recommended" color="green" >}}:
      Toggle **order** to generate **ORDER BY** clause statements.

      - **ORDER BY**: Select columns to sort by.
        You can sort by time and multiple fields or tags.
        To sort in descending order, select **DESC**.

4. {{< req text="Recommended" color="green" >}}: Change format to **Time series**.
    - Use the **Format** dropdown to change the format of the query results.
      For example, to visualize the query results as a time series, select **Time series**.

5. Click **Run query** to execute the query.

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

{{< youtube "rSsouoNsNDs" >}}

To learn about query management and inspection in Grafana, see the
[Grafana Explore documentation](https://grafana.com/docs/grafana/latest/explore/).

## Build visualizations with Grafana

For a comprehensive walk-through of creating visualizations with
Grafana, see the [Grafana documentation](https://grafana.com/docs/grafana/latest/).