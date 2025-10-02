Use [Grafana](https://grafana.com/) to query and visualize data from 
{{% product-name %}}.

> [Grafana] enables you to query, visualize, alert on, and explore your metrics,
> logs, and traces wherever they are stored.
> [Grafana] provides you with tools to turn your time-series database (TSDB)
> data into insightful graphs and visualizations.
>
> {{% cite %}}-- [Grafana documentation](https://grafana.com/docs/grafana/latest/introduction/){{% /cite %}}

- [Install Grafana or login to Grafana Cloud](#install-grafana-or-login-to-grafana-cloud)
- [InfluxDB data source](#influxdb-data-source)
- [Before you begin](#before-you-begin)
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
Use the plugin to query and visualize data from {{< product-name >}} with
both SQL and InfluxQL.

> [!Note]
> #### Grafana 10.3+
>
> The instructions below are for **Grafana 10.3+** which introduced the newest
> version of the InfluxDB core plugin.
> The updated plugin includes **SQL support** for InfluxDB 3-based products such
> as {{< product-name >}}, and the interface dynamically adapts based on your product and query language selections .


## Before you begin

**Prerequisites:**
- Grafana 10.3 or later
- Administrator role in Grafana
- {{% product-name %}} instance and [database token](/influxdb3/version/admin/tokens/#database-tokens)

## Create an InfluxDB data source

1. In your Grafana interface, click **Connections** in the left sidebar
2. Click **Data sources**
3. Click **Add new data source**
4. Under **Time series databases**, select **InfluxDB**

The configuration form displays with four numbered sections. Section 2 (Database settings) displays different fields based on your query language selection.

5. **Name**: Enter a descriptive name for your data source
6. **URL**: Enter your {{% product-name %}} cluster URL: `https://{{< influxdb/host >}}`
7. **Product**: From the dropdown, select **InfluxDB Enterprise 3.x**
8. **Query Language**: Select **SQL** or **InfluxQL**

### Configure database settings

The fields in this section change based on your query language selection.

{{< tabs-wrapper >}}
{{% tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /tabs %}}
{{% tab-content %}}
<!--------------------------------- BEGIN SQL --------------------------------->

When you select **SQL** as the query language, configure the following:

- **Database**: Your [database](/influxdb3/version/admin/databases/) name
- **Token**: A [database token](/influxdb3/version/admin/tokens/#database-tokens) with read access to the database

    {{< img-hd src="/img/influxdb3/enterprise-v3-grafana-product-dropdown-sql.png" alt="Grafana InfluxDB data source for InfluxDB 3 that uses SQL" />}}

<!---------------------------------- END SQL ---------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN INFLUXQL ------------------------------>

When you select **InfluxQL** as the query language, configure the following:

- **Database**: Your [database](/influxdb3/version/admin/databases/) name
- **User**: Enter a username. 
- **Password**: A [database token](/influxdb3/version/admin/tokens/#database-tokens) with read access to the database
- **HTTP Method**: Select **POST** (recommended) or **GET**

    {{< img-hd src="/img/influxdb3/enterprise-v3-grafana-product-dropdown-influxql.png" alt="Grafana InfluxDB data source for InfluxDB 3 that uses InfluxQL" />}}

<!-------------------------------- END INFLUXQL ------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Query InfluxDB with Grafana

After you [configure and save an InfluxDB datasource](#create-an-influxdb-data-source),
use Grafana to build, run, and inspect queries against {{< product-name >}}.

{{< tabs-wrapper >}}
{{% tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /tabs %}}
{{% tab-content %}}
<!--------------------------------- BEGIN SQL --------------------------------->

> [!Note]
> {{% sql/sql-schema-intro %}}
> To learn more, see [Query Data](/influxdb3/version/query-data/sql/).

1.  Click **Explore**.
2.  In the dropdown, select the saved InfluxDB data source to query.
3.  Use the SQL query form to build your query:

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

4.  {{< req text="Recommended" color="green" >}}: Change format to **Time series**.

    - Use the **Format** dropdown to change the format of the query results.
      For example, to visualize the query results as a time series, select **Time series**.

5. Click **Run query** to execute the query.

<!---------------------------------- END SQL ---------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN INFLUXQL ------------------------------>

1.  Click **Explore**.
2.  In the dropdown, select the **InfluxDB** data source that you want to query.
3.  Use the InfluxQL query form to build your query:

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
