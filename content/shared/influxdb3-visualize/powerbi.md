Use [Microsoft Power BI Desktop](https://powerbi.microsoft.com/) with the
This guide includes Windows (64‑bit) installation steps for the Arrow Flight SQL ODBC driver and the InfluxDB 3 Power BI connector.  

> Microsoft Power BI is a collection of software services, apps, and connectors
> that work together to turn your unrelated sources of data into coherent,
> visually immersive, and interactive insights.
>
> {{% cite %}}-- [Microsoft Power BI documentation](https://learn.microsoft.com/en-us/power-bi/fundamentals/power-bi-overview){{% /cite %}}

> [!Important]
> These instructions are for Power BI Desktop only; it uses a custom connector.

1. [Prerequisites](#prerequisites)
2. [Install the Arrow Flight SQL ODBC driver](#install-the-arrow-flight-sql-odbc-driver)
3. [Install the Power BI connector](#install-the-power-bi-connector)
4. [Enable the connector in Power BI](#enable-the-connector-in-power-bi)
5. [Connect Power BI to InfluxDB](#connect-power-bi-to-influxdb)
6. [Query and visualize data](#query-and-visualize-data)

## Prerequisites

- **Windows operating system**: The custom connector requires Windows
  (macOS users can use virtualization software like [Parallels](https://www.parallels.com/))
- **Power BI Desktop**: [Download and install Power BI Desktop](https://powerbi.microsoft.com/desktop/)
  (A free trial is available)
- **{{% product-name %}}**: A running instance with data to query
- **Database token**: Your {{% show-in "cloud-dedicated, clustered" %}}{{% token-link "database" %}}{{% /show-in %}}{{% show-in "cloud-serverless" %}}{{% token-link %}}{{% /show-in %}}{{% show-in "core, enterprise" %}}{{% token-link "admin" "database" %}}{{% /show-in %}}{{% show-in "enterprise" %}} with query permissions for the target database{{% /show-in %}}

## Install the Arrow Flight SQL ODBC driver

The InfluxDB 3 custom connector for Power BI requires the Arrow Flight SQL ODBC driver.
Install the driver before installing the Power BI connector.

<a class="btn" href="https://docs.influxdata.com/downloads/apache-arrow-flight-sql-odbc-1.0.0-win64.msi">Download the Arrow Flight SQL ODBC driver</a>

1. Run the downloaded `.msi` installer.
2. Follow the installation wizard using default settings.
3. Complete the installation.

#### Verify driver installation

1. Open the Windows application [ODBC Data Source Administrator (64-bit)](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/open-the-odbc-data-source-administrator).
1. Open the [ODBC Data Source Administrator (64-bit) Windows component](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/open-the-odbc-data-source-administrator)
2. Navigate to the **Drivers** tab
3. Verify **Arrow Flight SQL ODBC Driver** appears in the list.

## Install the Power BI connector

After installing the ODBC driver, download and install the InfluxDB 3 custom connector for Power BI Desktop.

<a class="btn" href="https://docs.influxdata.com/downloads/InfluxDB.pqx">Download the InfluxDB 3 Power BI connector</a>

### Move the connector to the custom connectors directory

1. Create the custom connectors folder if it doesn't exist:

   ```powershell
   mkdir "$env:USERPROFILE\Documents\Power BI Desktop\Custom Connectors"
   ```

2. Move the connector file to the custom connectors folder:

   {{% code-placeholders "YOUR\_USER" %}}

   ```powershell
   Move-Item "C:\Users\YOUR_USER\Downloads\InfluxDB.pqx" `
     "$env:USERPROFILE\Documents\Power BI Desktop\Custom Connectors\"
   ```

   {{% /code-placeholders %}}

   Replace the following:

   - {{% code-placeholder-key %}}`YOUR_USER`{{% /code-placeholder-key %}}: Your Windows username

## Enable the connector in Power BI

To use custom connectors, you must adjust Power BI Desktop's security settings:

1. Open Power BI Desktop
2. Select **File** > **Options and settings** > **Options**
3. Navigate to **Security** under **GLOBAL**
4. Under **Data Extensions**, select **(Not Recommended) Allow any extension to
   load without validation or warning**
5. Click **OK**
6. **Restart Power BI Desktop** for the changes to take effect

> \[!Warning]
>
> #### Security considerations
>
> Enabling uncertified extensions allows any custom connector to load.
> Only enable this setting if you trust the connectors you're installing.

## Connect Power BI to InfluxDB

After installing the connector and restarting Power BI Desktop:

1. Open **Power BI Desktop**

2. Click **Get Data** > **More**

3. Search for **InfluxDB 3** and select it

4. Click **Connect**

5. In the **InfluxDB 3** connection dialog, configure the following:

   - **Server**: Your {{% product-name %}} URL without the port, (for example,
     {{% show-in "cloud-serverless" %}}`https://us-west-2-1.aws.cloud2.influxdata.com`{{% /show-in %}}{{% show-in "cloud-dedicated" %}}`https://cluster-id.a.influxdb.io`{{% /show-in %}}{{% show-in "clustered" %}}`https://cluster-host.com`{{% /show-in %}}{{% show-in "enterprise,core" %}}`http://localhost`{{% /show-in %}})
   - **Database**: Your database name
   - **Port**: Your server port (for example, {{% show-in "cloud-serverless,cloud-dedicated,clustered" %}}`443` (HTTPS){{% /show-in %}}{{% show-in "enterprise,core" %}}`8181` (default){{% /show-in %}})
   - **Native Query** (optional): Enter a SQL query to limit the data loaded

6. Select **DirectQuery** as the **Data Connectivity mode**

7. Click **OK**

8. When prompted for credentials:
   - Select **Basic** authentication
   - **Username**: Leave blank or enter any value
   - **Password**: Enter your {{% show-in "cloud-dedicated, clustered" %}}{{% token-link "database" %}}{{% /show-in %}}{{% show-in "cloud-serverless" %}}{{% token-link %}}{{% /show-in %}}{{% show-in "core, enterprise" %}}{{% token-link "admin" "database" %}}{{% /show-in %}}{{% show-in "enterprise" %}} with query permissions for the target database{{% /show-in %}}

9. Click **Connect**

10. Preview your data and click **Load**

> [!Important]
>
> #### Limit query size for optimal performance
>
> {{% product-name %}} can handle high throughput and dimensional data.
> To ensure Power BI can successfully process data, limit query size by:
>
> - Using a `LIMIT` clause
> - Specifying time ranges with `WHERE time >= ...`
> - Filtering by specific columns or tags

## Query and visualize data

### Use Native Queries

When connecting to InfluxDB 3, you can use the **Native Query** option to
execute custom SQL queries:

1. In the connection dialog, enable **Native Query**

2. Enter your query in the provided field:

   ```sql
   SELECT
     time,
     temp,
     room
   FROM
     home
   WHERE
     time >= now() - INTERVAL '7 days'
   ORDER BY
     time DESC
   LIMIT 1000
   ```

3. Select **DirectQuery** as the connectivity mode

4. Click **OK** to load the data

### Create visualizations

After loading data, Power BI displays your dataset in the **Fields** pane.

#### View data in a table

1. In the **Visualizations** pane, select the **Table** visualization
2. In the **Fields** pane, select the columns to display:
   - **time**: Timestamp column
   - **room**: Tag column
   - **temp**: Field column
3. By default, Power BI summarizes numeric fields.
   To display raw values:
   - Select the field in the **Fields** or **Visualizations** pane
   - Go to the **Modeling** tab
   - Change **Default Summarization** to **Don't Summarize**

#### Create time series visualizations

1. In the **Visualizations** pane, select a visualization type
   (for example, **Line chart**)
2. Drag fields to the appropriate areas:
   - **X-axis**: `time` field
   - **Y-axis**: Measurement fields (for example, `temp`)
   - **Legend**: Tag fields (for example, `room`)
3. Use the **Filters** pane to apply additional filters
4. Configure visualization properties in the **Format** pane
5. Save your report

### Time series best practices

- Always include time range filters in your queries to limit data volume
- Use the `time` column for time-based visualizations
- Apply Power BI's date hierarchy features with the `time` column
- Select only the columns you need to improve query performance
- Use the `LIMIT` clause to restrict the number of rows returned

## Troubleshooting

### Driver not found

If Power BI or other applications can't find the Arrow Flight SQL ODBC driver:

1. Open the [ODBC Data Source Administrator (64-bit) Windows component](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/open-the-odbc-data-source-administrator)
2. Navigate to the **Drivers** tab
3. Verify **Arrow Flight SQL ODBC Driver** appears in the list
4. If not listed, reinstall the driver

### Connector not found

If Power BI Desktop doesn't show the InfluxDB 3 connector:

- Verify the `.pqx` file is in the correct location:
  `Documents\Power BI Desktop\Custom Connectors\`
- Ensure you enabled custom connectors in Power BI security settings
- Restart Power BI Desktop after copying the connector file

### Connection errors

If you encounter connection errors:

- Verify your {{% product-name %}} instance is running and accessible
- Check that the host URL and port are correct:
  - Local instances typically use `http://localhost:8181`
  - {{% show-in "cloud-serverless,cloud-dedicated" %}}{{% product-name %}} instances use cluster-specific URLs with port `443`{{% /show-in %}}
- Ensure `UseEncryption` is configured correctly for your connection type
- Verify network connectivity and firewall rules allow connections on the specified port
- Ensure your token has query permissions for the specified database

### Authentication errors

If authentication fails:

- Verify your database token is valid and not expired
- Ensure the token is specified correctly (in the **Password** field for Power BI)
- {{% show-in "enterprise" %}}Verify the token has query permissions for the target database{{% /show-in %}}
- Check that the token was copied correctly without extra spaces or characters
- Leave the **Username** field blank or enter any value

### Query errors

If queries fail or return errors:

- Verify SQL syntax is correct for InfluxDB SQL
- Check that referenced tables (measurements) exist in the database
- Ensure column names match your schema
- Review the [SQL reference](/influxdb3/version/reference/sql/) for supported features
- For large result sets, consider adding `LIMIT` clauses

### Query performance

For better query performance:

- Always use `WHERE` clauses to filter data before loading
- Include time range filters (for example, `WHERE time >= now() - INTERVAL '7 days'`) to limit the data scanned
- Select only the columns you need
- Use the `LIMIT` clause to restrict result size
- Consider using **DirectQuery** mode instead of **Import** for large datasets
- Monitor query execution for optimization opportunities
