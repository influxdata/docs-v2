---
title: Query in Data Explorer
description: >
  Query your data in the InfluxDB user interface (UI) Data Explorer.
weight: 201
menu:
  influxdb_cloud_iox:
    name: Query with Data Explorer
    parent: Execute queries
influxdb/cloud-iox/tags: [query]
---

Build, execute, and visualize your queries in InfluxDB UI's **Data Explorer**.

<!--Need a screenshot of the SQL builder with a pretty graph-->

Query using saved scripts, the SQL builder, the Flux builder, or by manually editing the query.
Choose between [visualization types](/influxdb/v2.6/visualize-data/visualization-types/) for your query.

## Query data with SQL and the Data Explorer

See [Query data](/influxdb/cloud-iox/query-data/sql/) to learn more about using SQL to query InfluxDB.

1. In the navigation menu on the left, click **Data Explorer**.

    {{< nav-icon "data-explorer" >}}

    {{% note %}}
    #### Save your work

    **Data Explorer** keeps your last change--for example, if you navigate to **Buckets**
    or signout and then come back, you'll see your SQL query and selections in **Data Explorer**.

    To store a query that you can retrieve and reuse, {{% caps %}}**Save**{{% /caps %}} your query as a script.
    {{% /note %}}

2. Activate the **SQL Sync** toggle in the **Schema Browser** pane to build your SQL query as you select [data elements]().
   - Typing within the script editor disables **SQL Sync**.
   - If you reenable **SQL Sync**, any selection changes you made in the **Schema Browser** are immediately copied to the script editor.
3. Select a **Bucket** to define your data source.
4. Select a **Measurement** from the bucket. By default, InfluxDB selects all columns (`*`) in your data.
5. To add filter conditions to your query, select from the **Fields** and **Tag Keys** lists.
   - **Fields**: filters for rows that have a non-null value for one of the selected field columns.
   - **Tag Keys**: filters for rows that have all the selected tag values.
   To learn more, see [Query specific fields and tags](/influxdb/cloud-iox/query-data/sql/basic-query/#query-specific-fields-and-tags).
6. Use the [time range dropdown](#select-time-range) to edit the time range for your query.
7. Click the **Run** button (or press `Control+Enter`) to run your query and [view the results](#view-sql-query-results).

## View SQL query results

After you **Run** your query, Data Explorer displays the results.

- Click {{< caps >}}**Table**{{< /caps >}} for a paginated tabular view of all rows and columns.
- Click {{< caps >}}**Graph**{{< /caps >}} to select visualization options.

### Visualize your SQL query

- Select an available [visualization type](/influxdb/cloud-iox/visualize-data/data-explorer/sql) from the dropdown menu:

    <!-- @TODO SQL screenshot -->
    
    <!-- {{/* img-hd src="/img/influxdb/2-0-visualizations-dropdown.png" title="Visualization dropdown" */>}} -->




## Query data with Flux and the Data Explorer

Flux is a functional data scripting language designed for querying,
analyzing, and acting on time series data.
See [Get started with Flux](/influxdb/v2.6/query-data/get-started) to learn more about Flux.

1. In the navigation menu on the left, click **Data Explorer**.

    {{< nav-icon "data-explorer" >}}

2. Activate the **Switch to old Data Explorer** toggle to display the Flux builder. By default, the Cloud IOx UI displays the Schema Browser and the SQL script editor for creating queries.

      ![Data Explorer with Flux](/img/influxdb/2-0-data-explorer.png)

3. Use the bottom panel to create a Flux query:
   - Select a bucket to define your data source or select `+ Create Bucket` to add a new bucket.
   - Edit your time range with the [time range option](#select-time-range) in the dropdown menu.
   - Add filters to narrow your data by selecting attributes or columns in the dropdown menu.
   - Select **Group** from the **Filter** dropdown menu to group data into tables. For more about how grouping data in Flux works, see [Group data](/influxdb/v2.6/query-data/flux/group-data/).    
3. Alternatively, click **Script Editor** to manually edit the query.
   To switch back to the query builder, click **Query Builder**. Note that your updates from the Script Editor will not be saved.
4. Use the **Functions** list to review the available Flux functions.
   Click a function from the list to add it to your query.
5. Click **Submit** (or press `Control+Enter`) to run your query. You can then preview your graph in the above pane.
  To cancel your query while it's running, click **Cancel**.
6. To work on multiple queries at once, click the {{< icon "plus" >}} to add another tab.
   - Click the eye icon on a tab to hide or show a query's visualization.
   - Click the name of the query in the tab to rename it.

### Visualize your query

- Select an available [visualization type](/influxdb/cloud-iox/query-data/execute-queries/data-explorer/flux/visualization-types/) from the dropdown menu:

    {{< img-hd src="/img/influxdb/2-0-visualizations-dropdown.png" title="Visualization dropdown" />}}

## Control your dashboard cell

To open the cell editor overlay, click the gear icon in the upper right of a cell and select **Configure**.
 The cell editor overlay opens.

### View raw data

Toggle the **View Raw Data** {{< icon "toggle" >}} option to see your data in table format instead of a graph. Scroll through raw data using arrows, or click page numbers to find specific tables. [Group keys](/influxdb/cloud/reference/glossary/#group-key) and [data types](/influxdb/cloud/reference/glossary/#data-type) are easily identifiable at the top of each column underneath the headings. Use this option when data can't be visualized using a visualization type. 

 {{< img-hd src="/img/influxdb/cloud-controls-view-raw-data.png" alt="View raw data" />}}

### Save as CSV

Click the CSV icon to save the cells contents as a CSV file.

### Manually refresh dashboard

Click the refresh button ({{< icon "refresh" >}}) to manually refresh the dashboard's data.

### Select time range

1. Select from the time range options in the dropdown menu.

    {{< img-hd src="/img/influxdb/2-0-controls-time-range.png" alt="Select time range" />}}

2. Select **Custom Time Range** to enter a custom time range with precision up to nanoseconds.
The default time range is 5m.

> The custom time range uses the selected timezone (local time or UTC).

### Query Builder or Script Editor

Click **Query Builder** to use the builder to create a Flux query. Click **Script Editor** to manually edit the query.

#### Keyboard shortcuts

In **Script Editor** mode, the following keyboard shortcuts are available:

| Key                            | Description                                 |
|--------------------------------|---------------------------------------------|
| `Control + /` (`⌘ + /` on Mac) | Comment/uncomment current or selected lines |
| `Control + Enter`              | Submit query                                |

## Save your query as a dashboard cell or task

- Click **Save as** in the upper right, and then:
  - To add your query to a dashboard, click **Dashboard Cell**.
  - To save your query as a task, click **Task**.
  - To save your query as a variable, click **Variable**.
