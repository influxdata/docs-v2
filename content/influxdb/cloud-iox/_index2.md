---
title: Query data with SQL
description: >
  Query InfluxDB using SQL.
menu:
  influxdb_cloud_iox:
    name: Query data with SQL
weight: 101
---

## Getting started with SQL

InfluxDB Cloud backed by InfluxDB IOx uses the [Apache Arrow DataFusion](https://arrow.apache.org/datafusion/) query engine which provides SQL syntax similar to PostgreSQL. 

When working with InfluxDB's implementation of SQL, `buckets` are databases, `measurments` are tables and `tags`, `fields` and `timestamps` are the euqivalent to columns. 

If we execute a `SHOW columns` command on a measurment, the results show all the column names in the measurement and information about each column, such as column name, data type, etc.

```sql
-- Basic syntax
SHOW columns 
FROM <measurement>

-- Example using sample data

SHOW columns 
FROM "h2o_feet"
```

Results:

| column_name       | data_type                   | is_nullable | table_catalog | table_name | table_schema |
| :---------------- | --------------------------- | ----------- | ------------- | ---------- | ------------ |
| level description | Utf8                        | YES         | public        | h2o_feet   | iox          |
| location          | Dictionary(Int32, Utf8)     | YES         | public        | h2o_feet   | iox          |
| time              | Timestamp(Nanosecond, None) | NO          | public        | h2o_feet   | iox          |
| water_level       | Float64                     | YES         | public        | h2o_feet   | iox          |

## SQL and the InfluxDB UI

The queries and results throughout SQL documenation were written and run using the InfluxDB UI.  

To use the UI do the following:

1. In the navigation menu on the left, click **Data Explorer**.

    {{< nav-icon "data-explorer" >}}

2. In the **Schema Browser** panel on the left, select a bucket from the dropdown menu to define your data source.

3. Next, select a measurement to query from in the dropdown menu.  You will see a list of fields and tags that belong to each measurment. 

4. Use the **Script editor** to manually create SQL scripts. Simply click in the editor to start writing a query. 

5. Alternatively, turn on **SQL Sync** to get basic precreated SQL queries.  Click on fields and tags under the measurement dropdown menu to automatically add them to your query.

6. You can select a time range using the dropdown menu under the script editor, or add one manually. 

7. Click **Run** to execute a query.  

8. You can download the results to a CSV file by clicking on **CSV** under the script editor.

