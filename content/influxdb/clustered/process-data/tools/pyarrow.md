---
title: Use the PyArrow library to analyze data
list_title: PyArrow
description: >
  Use [PyArrow](https://arrow.apache.org/docs/python/) to read and analyze InfluxDB query results.
weight: 201
menu:
  influxdb_clustered:
    parent: Use data analysis tools
    name: Use PyArrow
    identifier: analyze_with_pyarrow
influxdb/clustered/tags: [analysis, arrow, pyarrow, python]
related:
  - /influxdb/clustered/process-data/tools/pandas/
  - /influxdb/clustered/query-data/sql/
  - /influxdb/clustered/query-data/sql/execute-queries/python/
aliases:
  - /influxdb/clustered/visualize-data/pyarrow/
list_code_example: |
  ```py
  ...
  table = client.query(
          '''SELECT *
            FROM home
            WHERE time >= now() - INTERVAL '90 days'
            ORDER BY time'''
        )
  table.group_by('room').aggregate([('temp', 'mean')])
  ```
---

Use [PyArrow](https://arrow.apache.org/docs/python/) to read and analyze query
results from {{% product-name %}}.
The PyArrow library provides efficient computation, aggregation, serialization,
and conversion of Arrow format data.

> Apache Arrow is a development platform for in-memory analytics. It contains a set of technologies that enable
> big data systems to store, process and move data fast.
>
> The Arrow Python bindings (also named “PyArrow”) have first-class integration with NumPy, pandas, and built-in Python objects. They are based on the C++ implementation of Arrow.
> {{% caption %}}[PyArrow documentation](https://arrow.apache.org/docs/python/index.html){{% /caption %}}

<!-- TOC -->

- [Install prerequisites](#install-prerequisites)
- [Use PyArrow to read query results](#use-pyarrow-to-read-query-results)
- [Use PyArrow to analyze data](#use-pyarrow-to-analyze-data)
  - [Group and aggregate data](#group-and-aggregate-data)

<!-- /TOC -->

## Install prerequisites

The examples in this guide assume using a Python virtual environment and the InfluxDB v3 [`influxdb3-python` Python client library](/influxdb/clustered/reference/client-libraries/v3/python/).
For more information, see how to [get started using Python to query InfluxDB](/influxdb/clustered/query-data/execute-queries/flight-sql/python/).

Installing `influxdb3-python` also installs the [`pyarrow`](https://arrow.apache.org/docs/python/index.html) library that provides Python bindings for Apache Arrow.

## Use PyArrow to read query results

The following example shows how to use `influxdb3-python` and `pyarrow` to query InfluxDB and view Arrow data as a PyArrow `Table`.
 
1.  In your editor, copy and paste the following sample code to a new file--for example, `pyarrow-example.py`:

    {{% tabs-wrapper %}}
{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```py
# pyarrow-example.py

from influxdb_client_3 import InfluxDBClient3
import pandas

def querySQL():
  
  # Instantiate an InfluxDB client configured for a database
  client = InfluxDBClient3(
    "https://cluster-id.influxdb.io",
    database="DATABASE_NAME",
    token="DATABASE_TOKEN")

  # Execute the query to retrieve all record batches in the stream formatted as a PyArrow Table.
  table = client.query(
    '''SELECT *
      FROM home
      WHERE time >= now() - INTERVAL '90 days'
      ORDER BY time'''
  )

  client.close()

print(querySQL())
```
{{% /code-placeholders %}}
  {{% /tabs-wrapper %}}

2.  Replace the following configuration values:

    - {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: An InfluxDB [token](/influxdb/clustered/admin/tokens/) with read permissions on the databases you want to query.
    - {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: The name of the InfluxDB [database](/influxdb/clustered/admin/databases/) to query.

3. In your terminal, use the Python interpreter to run the file:

    ```sh
    python pyarrow-example.py
    ```

The `InfluxDBClient3.query()` method sends the query request, and then returns a [`pyarrow.Table`](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html) that contains all the Arrow record batches from the response stream. 

Next, [use PyArrow to analyze data](#use-pyarrow-to-analyze-data).

## Use PyArrow to analyze data

### Group and aggregate data

With a `pyarrow.Table`, you can use values in a column as _keys_ for grouping.

The following example shows how to query InfluxDB, and then use PyArrow to group the table data and calculate an aggregate value for each group:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```py
# pyarrow-example.py

from influxdb_client_3 import InfluxDBClient3
import pandas

def querySQL():
  
  # Instantiate an InfluxDB client configured for a database
  client = InfluxDBClient3(
    "https://cluster-id.influxdb.io",
    database="DATABASE_NAME",
    token="DATABASE_TOKEN")

  # Execute the query to retrieve data 
  # formatted as a PyArrow Table
  table = client.query(
    '''SELECT *
      FROM home
      WHERE time >= now() - INTERVAL '90 days'
      ORDER BY time'''
  )

  client.close()

  return table

table = querySQL()

# Use PyArrow to aggregate data
print(table.group_by('room').aggregate([('temp', 'mean')]))
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: An InfluxDB [token](/influxdb/clustered/admin/tokens/) with read permissions on the databases you want to query.
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: The name of the InfluxDB [database](/influxdb/clustered/admin/tokens/) to query.

{{< expand-wrapper >}}
{{% expand "View example results" %}}
```arrow
pyarrow.Table
temp_mean: double
room: string
----
temp_mean: [[22.581987577639747,22.10807453416151]]
room: [["Kitchen","Living Room"]]
```
{{% /expand %}}
{{< /expand-wrapper >}}

For more detail and examples, see the [PyArrow documentation](https://arrow.apache.org/docs/python/getstarted.html) and the [Apache Arrow Python Cookbook](https://arrow.apache.org/cookbook/py/data.html).
