Use [Grafana](https://grafana.com/) or [Grafana Cloud](https://grafana.com/products/cloud/)
to query and visualize data from {{% product-name %}}.

> [!Note]
> {{< influxdb-version-detector >}}

> [Grafana] enables you to query, visualize, alert on, and explore your metrics,
> logs, and traces wherever they are stored.
> [Grafana] provides you with tools to turn your time-series database (TSDB)
> data into insightful graphs and visualizations.
>
> {{% cite %}}-- [Grafana documentation](https://grafana.com/docs/grafana/latest/introduction/){{% /cite %}}

- [Install Grafana or log in to Grafana Cloud](#install-grafana-or-log-in-to-grafana-cloud)
- [InfluxDB data source](#influxdb-data-source)
- [Before you begin](#before-you-begin)
- [Create an InfluxDB data source](#create-an-influxdb-data-source)
- [Query and visualize data](#query-and-visualize-data)

## Install Grafana or log in to Grafana Cloud

1. [Sign up for Grafana Cloud](https://grafana.com/products/cloud/) or follow the
   [Grafana installation instructions](https://grafana.com/docs/grafana/latest/setup-grafana/installation/)
   to install Grafana for your operating system.
2. If running Grafana locally, enable the `newInfluxDSConfigPageDesign` feature flag to use the latest InfluxDB data source plugin.

   {{< expand-wrapper >}}
   {{% expand "Option 1: Configuration file (recommended)" %}}

   Add the following to your `grafana.ini` configuration file:

   ```ini
   [feature_toggles]
   enable = newInfluxDSConfigPageDesign
   ```

   Configuration file locations:
   - **Linux**: `/etc/grafana/grafana.ini`
   - **macOS (Homebrew)**: `/opt/homebrew/etc/grafana/grafana.ini`
   - **Windows**: `<GRAFANA_INSTALL_DIR>\conf\grafana.ini`

   {{% /expand %}}

   {{% expand "Option 2: Command line" %}}

   Enable the feature flag when starting Grafana:

   {{< code-tabs-wrapper >}}
   {{% code-tabs %}}
   [Linux](#)
   [macOS (Homebrew)](#)
   [Windows](#)
   {{% /code-tabs %}}
   {{% code-tab-content %}}

   ```sh
   grafana-server --config /etc/grafana/grafana.ini \
     cfg:default.feature_toggles.enable=newInfluxDSConfigPageDesign
   ```

   {{% /code-tab-content %}}
   {{% code-tab-content %}}

   ```sh
   /opt/homebrew/opt/grafana/bin/grafana server \
     --config /opt/homebrew/etc/grafana/grafana.ini \
     --homepath /opt/homebrew/opt/grafana/share/grafana \
     --packaging=brew \
     cfg:default.paths.logs=/opt/homebrew/var/log/grafana \
     cfg:default.paths.data=/opt/homebrew/var/lib/grafana \
     cfg:default.paths.plugins=/opt/homebrew/var/lib/grafana/plugins \
     cfg:default.feature_toggles.enable=newInfluxDSConfigPageDesign
   ```

   {{% /code-tab-content %}}
   {{% code-tab-content %}}

   ```powershell
   grafana-server.exe --config <GRAFANA_INSTALL_DIR>\conf\grafana.ini `
     cfg:default.feature_toggles.enable=newInfluxDSConfigPageDesign
   ```

   {{% /code-tab-content %}}
   {{< /code-tabs-wrapper >}}

   {{% /expand %}}
   {{< /expand-wrapper >}}

   For more information, see [Configure feature toggles](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/feature-toggles/) in the Grafana documentation.

3. Visit your **Grafana Cloud user interface** (UI) or, if running Grafana locally,
   [start Grafana](https://grafana.com/docs/grafana/latest/installation/) and visit
   <http://localhost:3000> in your browser.

{{% show-in "core,enterprise,clustered" %}}
> [!Note]
> #### Using Grafana Cloud with a local InfluxDB instance
>
> If you need to keep your database local, consider running Grafana locally instead of using Grafana Cloud,
> as this avoids the need to expose your database to the internet.
>
> To use InfluxDB running on your private network with Grafana Cloud, you must configure a
> [private data source for Grafana Cloud](https://grafana.com/docs/grafana-cloud/data-sources/private-data-sources/).
{{% /show-in %}}

## InfluxDB data source

The InfluxDB data source plugin is included in the Grafana core distribution.
Use the plugin to query and visualize data from {{< product-name >}} with
both SQL and InfluxQL.

> [!Note]
> #### Grafana 12.2+
>
> The instructions below are for **Grafana 12.2+** with the `newInfluxDSConfigPageDesign`
> feature flag enabled. This introduces the newest version of the InfluxDB core plugin.
> The updated plugin includes **SQL support** for InfluxDB 3-based products such
> as {{< product-name >}}, and the interface dynamically adapts based on your
> product and query language selection in [URL and authentication](#configure-url-and-authentication).

## Before you begin

**Prerequisites:**
- Grafana 12.2 or later
- Administrator role in Grafana
- {{% show-in "cloud-serverless" %}}An [API token](/influxdb3/version/admin/tokens/) with read access to the bucket{{% /show-in %}}{{% show-in "cloud-dedicated,clustered" %}}A [database token](/influxdb3/version/admin/tokens/#database-tokens) with read access to the database{{% /show-in %}}{{% show-in "core,enterprise" %}}Your {{% token-link "admin" "database" %}} with read access to the database{{% /show-in %}}

### Quick reference: {{< product-name >}} configuration

| Configuration | Value |
|:------------- |:----- |
| **Product selection** | {{% hide-in "core,enterprise" %}}**{{% product-name %}}**{{% /hide-in %}}{{% show-in "core" %}}**InfluxDB Enterprise 3.x** _(currently, no **Core** menu option)_{{% /show-in %}}{{% show-in "enterprise" %}}**InfluxDB Enterprise 3.x**{{% /show-in %}} |
| **URL** | {{% show-in "cloud-dedicated,clustered" %}} Cluster URL{{% /show-in %}}{{% show-in "cloud-serverless" %}} [Region URL](/influxdb3/cloud-serverless/reference/regions/)--for example, `https://us-west-2-1.aws.cloud2.influxdata.com`{{% /show-in %}}{{% show-in "core,enterprise" %}}Server URL{{% /show-in %}}{{% hide-in "cloud-serverless" %}}--for example, `https://{{< influxdb/host >}}`{{% /hide-in %}} |
| **Query languages** | SQL (requires HTTP/2), InfluxQL |
| **Authentication** | {{% show-in "cloud-serverless" %}}Required (API token){{% /show-in %}}{{% show-in "core" %}}Admin token (if authentication is enabled){{% /show-in %}}{{% show-in "enterprise" %}}Admin or database token (if authentication is enabled){{% /show-in %}}{{% show-in "cloud-dedicated,clustered" %}}Required (database token){{% /show-in %}} |
| **Database/Bucket** | {{% show-in "cloud-serverless" %}}Bucket name{{% /show-in %}}{{% hide-in "cloud-serverless" %}}Database name{{% /hide-in %}} |

## Create an InfluxDB data source

1. In your Grafana interface, click **Connections** in the left sidebar.
2. Click **Data sources**.
3. Click **Add new data source**.
4. Search for and select **InfluxDB**. The InfluxDB data source configuration page displays.
5. In the **Settings** tab, enter a **Name** for your data source.

### Configure URL and authentication

In the **URL and authentication** section, configure the following:

- **URL**: Your {{% product-name %}}{{% show-in "cloud-dedicated,clustered" %}} cluster URL{{% /show-in %}}{{% show-in "cloud-serverless" %}} [region URL](/influxdb3/cloud-serverless/reference/regions/)--for example, `https://us-west-2-1.aws.cloud2.influxdata.com`{{% /show-in %}}{{% show-in "core,enterprise" %}} server URL{{% /show-in %}}{{% hide-in "cloud-serverless" %}}--for example, `https://{{< influxdb/host >}}`{{% /hide-in %}}
- **Product**: From the dropdown, select {{% hide-in "core,enterprise" %}}**{{% product-name %}}**{{% /hide-in %}}{{% show-in "core" %}}**InfluxDB Enterprise 3.x** _(currently, no **Core** menu option)_{{% /show-in %}}{{% show-in "core,enterprise" %}}**InfluxDB Enterprise 3.x**{{% /show-in %}}
- **Query Language**: Select **SQL** or **InfluxQL**
- _(Optional)_ **Advanced HTTP Settings**, **Auth**, and **TLS/SSL Settings** as needed for your environment

### Configure database settings

The fields in this section change based on your query language selection in [URL and authentication](#configure-url-authentication).

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

- **Token**: {{% show-in "cloud-serverless" %}}An [API token](/influxdb3/version/admin/tokens/) with read access to the bucket{{% /show-in %}}{{% show-in "cloud-dedicated,clustered" %}}A [database token](/influxdb3/version/admin/tokens/#database-tokens) with read access to the database{{% /show-in %}}{{% show-in "core,enterprise" %}}Your {{% token-link "admin" "database" %}} with read access to the database{{% /show-in %}}

{{% show-in "cloud-serverless" %}}{{< img-hd src="/img/grafana/influxdb3-cloud-serverless-grafana-sql.png" alt="SQL configuration for {{% product-name %}}" />}}{{% /show-in %}}
{{% show-in "cloud-dedicated" %}}{{< img-hd src="/img/grafana/influxdb3-cloud-dedicated-grafana-sql.png" alt="SQL configuration for {{% product-name %}}" />}}{{% /show-in %}}
{{% show-in "clustered" %}}{{< img-hd src="/img/grafana/influxdb3-clustered-grafana-sql.png" alt="SQL configuration for {{% product-name %}}" />}}{{% /show-in %}}
{{% show-in "core" %}}{{< img-hd src="/img/grafana/influxdb3-core-grafana-sql.png" alt="SQL configuration for {{% product-name %}}" />}}{{% /show-in %}}
{{% show-in "enterprise" %}}{{< img-hd src="/img/grafana/influxdb3-enterprise-grafana-sql.png" alt="SQL configuration for {{% product-name %}}" />}}{{% /show-in %}}

{{% show-in "core,enterprise,clustered" %}}
#### Use SQL without TLS/SSL
If using SQL to query {{% product-name %}} without TLS/SSL, enable the 
**Insecure Connection** option in your InfluxDB datasource configuration:

1. Under **Database settings**, enable **Advanced Database Settings**.
2. Enable **Insecure Connection**.

{{% img-hd src="/img/grafana/grafana-sql-insecure-connection.png" alt="Query InfluxDB using SQL without TLS/SSL" /%}}
{{% /show-in %}}

> [!Important]
> #### Grafana queries through a proxy require HTTP/2
>
> For SQL queries, Grafana uses the Flight SQL protocol (gRPC) to query {{% product-name %}}, which requires **HTTP/2**.
> If you query {{% product-name %}} through a proxy (such as HAProxy, nginx, or a load balancer),
> verify that your proxy is configured to support HTTP/2.
> Without HTTP/2 support, SQL queries through Grafana will fail to connect.
>
> InfluxQL queries use HTTP/1.1 and are not affected by this requirement.

Click **Save & test**. Grafana attempts to connect to {{% product-name %}} and returns the result of the test.

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

- **User**: A username (can be any non-empty value).

- **Password**: {{% show-in "cloud-serverless" %}}Your [API token](/influxdb3/version/admin/tokens/) with read access to the bucket.{{% /show-in %}}{{% hide-in "cloud-serverless" %}}Your [database token](/influxdb3/version/admin/tokens/#database-tokens) with read access to the database.{{% /hide-in %}}

- **HTTP Method**: Select **POST** (recommended) or **GET**

{{% show-in "cloud-serverless" %}}{{< img-hd src="/img/grafana/influxdb3-cloud-serverless-grafana-influxql.png" alt="InfluxQL configuration for {{% product-name %}} with DBRP warning" />}}{{% /show-in %}}
{{% show-in "cloud-dedicated" %}}{{< img-hd src="/img/grafana/influxdb3-cloud-dedicated-grafana-influxql.png" alt="InfluxQL configuration for {{% product-name %}} with DBRP warning" />}}{{% /show-in %}}
{{% show-in "clustered" %}}{{< img-hd src="/img/grafana/influxdb3-clustered-grafana-influxql.png" alt="InfluxQL configuration for {{% product-name %}} with DBRP warning" />}}{{% /show-in %}}
{{% show-in "core" %}}{{< img-hd src="/img/grafana/influxdb3-core-grafana-influxql.png" alt="SQL configuration for {{% product-name %}}" />}}{{% /show-in %}}
{{% show-in "enterprise" %}}{{< img-hd src="/img/grafana/influxdb3-enterprise-grafana-influxql.png" alt="InfluxQL configuration for {{% product-name %}} with DBRP warning" />}}{{% /show-in %}}

Click **Save & test**. Grafana attempts to connect to {{% product-name %}} and returns the result of the test.

<!-------------------------------- END INFLUXQL ------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Query and visualize data

With your InfluxDB connection configured, use Grafana to query and visualize time series data.

### Query InfluxDB with Grafana

After you [configure and save an InfluxDB datasource](#create-an-influxdb-data-source),
use Grafana to build, run, and inspect queries against {{% show-in "cloud-serverless" %}}your InfluxDB bucket{{% /show-in %}}{{% hide-in "cloud-serverless" %}}{{% product-name %}}{{% /hide-in %}}.

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
    - **Table**: Select the table (measurement) to query.
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

With your InfluxDB connection configured, use Grafana to query and visualize time series data.

### Build visualizations with Grafana

For a comprehensive walk-through of creating visualizations with
Grafana, see the [Grafana documentation](https://grafana.com/docs/grafana/latest/).

### Query inspection in Grafana

To learn more about query management and inspection in Grafana, see the
[Grafana Explore documentation](https://grafana.com/docs/grafana/latest/explore/).
