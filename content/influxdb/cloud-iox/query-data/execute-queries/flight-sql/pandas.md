---
title: Use pandas, the Python Data Analysis Library, to query data
seotitle: Use pandas, the Python Data Analysis Library, to query data stored in InfluxDB Cloud (IOx)
description: >
  Install and run [pandas](https://pandas.pydata.org/), the Python Data Analysis Library,
  to query data stored in a bucket powered by InfluxDB IOx.
weight: 101
menu:
  influxdb_cloud_iox:
    parent: Query with Flight SQL
    name: Use pandas
    identifier: query_with_pandas
influxdb/cloud-iox/tags: [query, flightsql, pandas]
related:
  - /influxdb/cloud-iox/visualize-data/pandas/
---

Use [pandas](https://pandas.pydata.org/), the Python Data Analysis Library, to query data
stored in an InfluxDB bucket powered by InfluxDB IOx.

> **pandas** is an open source, BSD-licensed library providing high-performance,
> easy-to-use data structures and data analysis tools for the Python programming language.
>
> {{% caption %}}[pandas documentation](https://pandas.pydata.org/docs/){{% /caption %}}

<!-- TOC -->

- [Install prerequisites](#install-prerequisites)
- [Install pandas](#install-pandas)
    - [Read data with pandas](#read-data-with-pandas)
- [Query InfluxDB with pandas](#query-influxdb-with-pandas)

<!-- /TOC -->

## Install prerequisites

Follow the instructions to [install and use the `flightsql-dbapi` Flight SQL library for Python](/influxdb/cloud-iox/query-data/execute-queries/flight-sql/python.md).

## Install pandas

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[pip](#pip)
[conda](#conda)
{{% /code-tabs %}}
{{% code-tab-content %}}

In your terminal, use `pip` (or `pip3`) to install pandas:

```sh
pip3 install pandas
```
{{% /code-tab-content %}}
{{% code-tab-content %}}

In your terminal, use `conda` to install pandas:

```sh
conda install pandas
```

{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

### Read data with pandas

The following sample code executes the query and then uses pandas to return rows from the first 3 calendar days:

```py
from flightsql import FlightSQLClient

client = FlightSQLClient(host='us-east-1-1.aws.cloud2.influxdata.com',
    token='INFLUX_READ_WRITE_TOKEN',
    metadata={'bucket-name': 'INFLUX_BUCKET'},
    features={'metadata-reflection': 'true'})

# 1. Execute the query
query = client.execute('SELECT * FROM home')

# 2. Retrieve data
reader = client.do_get(query.endpoints[0].ticket)

# 3. Read all data and convert to a pandas DataFrame
df = reader.read_pandas()

# 4. Set the DataFrame index to the time column
# df = df.set_index('time')
print(df)
# 4. Sort DataFrame rows
# df = df.sort_values(by="time")

# 5. Output the first 3 days of rows from the DataFrame
# print(df.first('3D'))
```

The sample does the following:
  
1. [Executes a query](#execute-a-query).
2. [Retrieves data for the query result](#retrieve-data-from-the-flight-sql-query-result).
3. Calls the `pyarrow.flight.FlightStreamReader` [`read_pandas`](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightStreamReader.html#pyarrow.flight.FlightStreamReader.read_pandas) method that reads all
record batches as a `pyarrow.Table` and then converts the `Table` to a [`pandas.DataFrame`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html#pandas.DataFrame).
4. Calls the [`pandas.DataFrame.sort_values`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.sort_values.html) method to sort rows by the `time` column.
5. Calls the [`pandas.DataFrame.first`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.first.html) method to get rows for the first 3 calendar days (`3D`).


    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[python](#python)
[conda](#conda)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!-- Begin python content -->



<!-- End python content -->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-- Begin conda content -->

<!-- End conda content -->
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}



5.  Enter your **SQL Alchemy URI** comprised of the following:

    - **Protocol**: `datafusion+flightsql`
    - **Domain**:
      {{% cloud-only %}}[InfluxDB Cloud region domain](/influxdb/cloud-iox/reference/regions/){{% /cloud-only %}}
      {{% oss-only %}}localhost{{% /oss-only %}}
    - **Port**:
      {{% cloud-only %}}443{{% /cloud-only %}}
      {{% oss-only %}}8086 or your custom-configured bind address{{% /oss-only %}}
    
    **Query parameters**

    - **`?bucket-name`**: URL-encoded InfluxDB [bucket name](influxdb/cloud-iox/admin/buckets/view-buckets/)
    - **`?token`**: InfluxDB [API token](/influxdb/cloud-iox/get-started/setup/) with `READ` access to the specified bucket

    {{< code-callout "&lt;(domain|port|bucket-name|token)&gt;" >}}
{{< code-callout "us-east-1-1\.aws\.cloud2\.influxdata\.com|443|example-bucket|example-token" >}}
```sh
# Syntax
datafusion+flightsql://<domain>:<port>?bucket-name=<bucket-name>&token=<token>

# Example
datafusion+flightsql://us-east-1-1.aws.cloud2.influxdata.com:443?bucket-name=example-bucket&token=example-token
```
{{< /code-callout >}}
    {{< /code-callout >}}

6.  Click **Test Connection** to ensure the connection works.
7.  Click **Connect** to save the database connection.

## Query InfluxDB with pandas

With a connection to InfluxDB {{< current-version >}} established, you can begin
to query and visualize data from InfluxDB.

1.  In the pandas UI, click **SQL ▾** in the top navigation bar and select **SQL Lab**.
2.  In the left pane:
    
    1. Under **Database**, select your InfluxDB connection.
    2. Under **Schema**, select **iox**.
    3. Under **See table schema**, select the InfluxDB measurement to query.

    The measurement schema appears in the left pane:

    {{< img-hd src="/img/influxdb/cloud-iox-pandas-schema.png" alt="Select your InfluxDB schema in pandas" />}}

3.  Use the **query editor** to write an SQL query that queries data in your 
    InfluxDB bucket.
4.  Click **Run** to execute the query.

Query results appear below the query editor.

With a connection to InfluxDB {{< current-version >}} established and a query
that returns results, you're ready to [visualize data using pandas](/influxdb/cloud-iox/visualize-data/pandas/).
