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
- [Before you begin](#before-you-begin)
- [Create an InfluxDB data source](#create-an-influxdb-data-source)
- [Query InfluxDB with Grafana](#query-influxdb-with-grafana)
- [Build visualizations with Grafana](#build-visualizations-with-grafana)

## Install Grafana or login to Grafana Cloud

If using the open source version of **Grafana**, follow the
[Grafana installation instructions](https://grafana.com/docs/grafana/latest/setup-grafana/installation/)
to install Grafana for your operating system.
If using **Grafana Cloud**, log in to your Grafana Cloud instance.

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
> as {{< product-name >}}, and the interface dynamically adapts based on your product and query language selections.

## Before you begin

**Prerequisites:**
- Grafana 10.3 or later
- Administrator role in Grafana
- {{% show-in "cloud-serverless" %}}InfluxDB Cloud Serverless account and [API token](/influxdb3/version/admin/tokens/){{% /show-in %}}{{% hide-in "cloud-serverless" %}}{{% product-name omit=" Clustered" %}} instance and [database token](/influxdb3/version/admin/tokens/#database-tokens){{% /hide-in %}}

## Create an InfluxDB data source

1. In your Grafana interface, click **Connections** in the left sidebar
2. Click **Data sources**
3. Click **Add new data source**
4. Under **Time series databases**, click **InfluxDB**

The configuration form displays with four numbered sections. Section 2 (Database settings) displays different fields based on your query language selection.

5. **Name**: Enter a descriptive name for your data source
6. **URL**: Enter your {{% product-name %}} cluster URL: `https://{{< influxdb/host >}}`
7. **Product**: From the dropdown, select **InfluxDB Enterprise 3.x**
8. **Query Language**: Select **SQL** or **InfluxQL**

### Configure basic settings

The fields in this section change based on your query language selection.

{{< tabs-wrapper >}}
{{% tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /tabs %}}
{{% tab-content %}}
<!--------------------------------- BEGIN SQL --------------------------------->

#### SQL configuration

When you select **SQL** as the query language, configure the following fields:

- **Database**: {{% show-in "cloud-serverless" %}}Your [bucket](/influxdb3/version/admin/buckets/) name. In {{< product-name >}}, buckets function as databases.{{% /show-in %}}{{% hide-in "cloud-serverless" %}}Your [database](/influxdb3/version/admin/databases/) name.{{% /hide-in %}}

- **Token**: {{% show-in "cloud-serverless" %}}An [API token](/influxdb3/version/admin/tokens/) with read access to the bucket.{{% /show-in %}}{{% hide-in "cloud-serverless" %}}A [database token](/influxdb3/version/admin/tokens/#database-tokens) with read access to the database.{{% /hide-in %}}

{{% show-in "cloud-serverless" %}}{{< img-hd src="/img/influxdb3/cloud-serverless-grafana-product-dropdown-sql.png" alt="SQL configuration for InfluxDB Cloud Serverless" />}}{{% /show-in %}}
{{% show-in "cloud-dedicated" %}}{{< img-hd src="/img/influxdb3/cloud-dedicated-grafana-product-dropdown-sql.png" alt="SQL configuration for InfluxDB Cloud Dedicated" />}}{{% /show-in %}}
{{% show-in "clustered" %}}{{< img-hd src="/img/influxdb3/cluster-grafana-product-dropdown-sql.png" alt="SQL configuration for InfluxDB Clustered" />}}{{% /show-in %}}

<!---------------------------------- END SQL ---------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN INFLUXQL ------------------------------>

#### InfluxQL configuration

{{% show-in "cloud-serverless" %}}
> [!Important]
> #### DBRP mapping required
> 
> To query {{% product-name %}} with InfluxQL, you must first map database and 
> retention policy (DBRP) combinations to your InfluxDB Cloud buckets. The 
> configuration form displays a warning if DBRP mapping is not configured.
>
> For more information, see [Map databases and retention policies to buckets](/influxdb3/version/query-data/influxql/dbrp/).
{{% /show-in %}}

When you select **InfluxQL** as the query language, configure the following fields:

- **Database**: {{% show-in "cloud-serverless" %}}The database name mapped to your InfluxDB bucket.{{% /show-in %}}{{% hide-in "cloud-serverless" %}}Your [database](/influxdb3/version/admin/databases/) name.{{% /hide-in %}}

- **User**: An arbitrary string. This field is required but the value is ignored by {{% product-name %}}.

- **Password**: {{% show-in "cloud-serverless" %}}Your [API token](/influxdb3/version/admin/tokens/) with read access to the bucket.{{% /show-in %}}{{% hide-in "cloud-serverless" %}}Your [database token](/influxdb3/version/admin/tokens/#database-tokens) with read access to the database.{{% /hide-in %}}

- **HTTP Method**: Select **POST** (recommended) or **GET**

{{% show-in "cloud-serverless" %}}{{< img-hd src="/img/influxdb3/cloud-serverless-grafana-product-dropdown-influxql.png" alt="InfluxQL configuration for InfluxDB Cloud Serverless with DBRP warning" />}}{{% /show-in %}}
{{% show-in "cloud-dedicated" %}}{{< img-hd src="/img/influxdb3/cloud-dedicated-grafana-product-dropdown-influxql.png" alt="InfluxQL configuration for InfluxDB Cloud Dedicated" />}}{{% /show-in %}}
{{% show-in "clustered" %}}{{< img-hd src="/img/influxdb3/cluster-grafana-product-dropdown-influxql.png" alt="InfluxQL configuration for InfluxDB Clustered" />}}{{% /show-in %}}

<!-------------------------------- END INFLUXQL ------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}


### test the connection

1. Click **Save & test**
2. Verify that the "Data source is working" message appears

If the connection test fails, verify your URL, credentials, and network connectivity.

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
> To learn more, see [Query Data](/influxdb3/version/query-data/sql/).

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