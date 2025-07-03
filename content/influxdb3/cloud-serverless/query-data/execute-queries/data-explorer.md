---
title: Use the InfluxDB Data Explorer to query data
description: >
  Query your data in the InfluxDB user interface (UI) Data Explorer.
weight: 201
menu:
   influxdb3_cloud_serverless:
      name: Use the Data Explorer
      parent: Execute queries
influxdb3/cloud-serverless/tags: [query]
aliases:
  - /influxdb3/cloud-serverless/query-data/execute-queries/sql/data-explorer/
related:
  - /influxdb3/cloud-serverless/query-data/sql/
  - /influxdb3/cloud-serverless/query-data/flux-sql/
metadata: [SQL]
---

Build, execute, and visualize SQL queries in the InfluxDB UI **Data Explorer**.

<!--Need a screenshot of the SQL builder with a pretty graph-->

Query using saved scripts, the SQL builder, or by manually editing the query.
Choose between **visualization types** for your query.

## Query data with SQL and the Data Explorer

1. In the navigation menu on the left, click **Data Explorer**.

    {{< nav-icon "data-explorer" >}}

2. Activate the **SQL Sync** toggle in the **Schema Browser** pane to build your SQL query as you select [fields and tag values](/influxdb3/cloud-serverless/write-data/best-practices/schema-design/#influxdb-data-structure).
   - Typing within the script editor disables **SQL Sync**.
   - If you reenable **SQL Sync**, any selection changes you made in the **Schema Browser** are copied to the script editor.
3. Select a **Bucket** to define your data source.
4. Select a **Measurement** from the bucket.
   Data Explorer inserts a `SELECT` statement to retrieve all columns in the selected measurement:

   ```sql
   SELECT *
   FROM home
   ```
5. To add filter conditions to your query, select from the **Fields** and **Tag Keys** lists.
   - **Fields**: filters for rows that have a non-null value for at least one of the selected field columns.
   - **Tag Keys**: filters for rows that have all the selected tag values.
   To learn more, see [Query specific fields and tags](/influxdb3/cloud-serverless/query-data/sql/basic-query/#query-specific-fields-and-tags).
6. Use the [time range dropdown](#select-time-range) to edit the time range for your query.
7. Use the script editor to customize your query--for example, to specify what tags and fields to retrieve:

   ```sql
   SELECT temp, time
   FROM home
   ```
7. Click the **Run** button (or press `Control+Enter`) to run your query and [view the results](#view-sql-query-results).

See [Query data](/influxdb3/cloud-serverless/query-data/sql/) to learn more about building SQL queries.

> [!Note]
> 
> #### Save your work
> 
> **Data Explorer** keeps your last change--for example, if you navigate to **Buckets**
> or signout and then come back, you'll see your SQL query and selections in **Data Explorer**.
> 
> To store a query that you can retrieve and reuse, {{% caps %}}**Save**{{% /caps %}} your query as a *script*.

## View SQL query results

After you **Run** your query, Data Explorer displays the results.

- Click {{< caps >}}Table{{< /caps >}} for a paginated tabular view of all rows and columns.
- Click {{< caps >}}Graph{{< /caps >}} to select a *visualization type* and options.
- Click {{< caps >}}CSV{{< /caps >}} to download query results in a comma-delimited file.
