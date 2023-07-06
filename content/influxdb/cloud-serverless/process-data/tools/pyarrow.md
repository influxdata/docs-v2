---
title: Use the PyArrow library to analyze data
list_title: PyArrow
description: >
  Use [PyArrow](https://arrow.apache.org/docs/python/) to read and analyze
  InfluxDB query results from InfluxDB Cloud Serverless.
weight: 101
menu:
  influxdb_cloud_serverless:
    parent: Analyze and visualize data
    name: Use PyArrow
    identifier: analyze-with-pyarrow
influxdb/cloud-serverless/tags: [analysis, arrow, pyarrow, python]
aliases:
  - /influxdb/cloud-serverless/visualize-data/pyarrow/
related:
  - /influxdb/cloud-serverless/process-data/tools/pandas/
  - /influxdb/cloud-serverless/query-data/sql/
list_code_example: |
  ```py
  ...
  table = reader.read_all()
  table.group_by('room').aggregate([('temp', 'mean')])
  ```
---

Use [PyArrow](https://arrow.apache.org/docs/python/) to read and analyze query results 
from a InfluxDB Cloud Serverless.
The PyArrow library provides efficient computation, aggregation, serialization, and conversion of Arrow format data.

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

The examples in this guide assume using a Python virtual environment and the Flight SQL library for Python.
For more information, see how to [get started using Python to query InfluxDB](/influxdb/cloud-serverless/query-data/sql/execute-queries/python/)

Installing `flightsql-dbapi` also installs the [`pyarrow`](https://arrow.apache.org/docs/python/index.html) library that provides Python bindings for Apache Arrow.

## Use PyArrow to read query results

The following example shows how to use Python with `flightsql-dbapi` and `pyarrow` to query InfluxDB and view Arrow data as a PyArrow `Table`.
 
1. In your editor, copy and paste the following sample code to a new file--for example, `pyarrow-example.py`:

    ```py
    # pyarrow-example.py

    from flightsql import FlightSQLClient

    # Instantiate a FlightSQLClient configured for a bucket
    client = FlightSQLClient(host='cloud2.influxdata.com',
        token='INFLUX_READ_WRITE_TOKEN',
        metadata={'database': 'BUCKET_NAME'},
        features={'metadata-reflection': 'true'})

    # Execute the query to retrieve FlightInfo
    info = client.execute('SELECT * FROM home')

    # Use the ticket to request the Arrow data stream.
    # Return a FlightStreamReader for streaming the results.
    reader = client.do_get(info.endpoints[0].ticket)

    # Read all data to a pyarrow.Table
    table = reader.read_all()

    print(table)
    ```

2. Replace the following configuration values:

    - **`INFLUX_READ_WRITE_TOKEN`**: An InfluxDB token with _read_ permission to the bucket.
    - **`BUCKET_NAME`**: The name of the InfluxDB bucket to query.


3. In your terminal, use the Python interpreter to run the file:

    ```sh
    python pyarrow-example.py
    ```

The `FlightStreamReader.read_all()` method reads all Arrow record batches in the stream as a [`pyarrow.Table`](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html).

Next, [use PyArrow to analyze data](#use-pyarrow-to-analyze-data).

## Use PyArrow to analyze data

### Group and aggregate data

With a `pyarrow.Table`, you can use values in a column as _keys_ for grouping.

The following example shows how to query InfluxDB, group the table data, and then calculate an aggregate value for each group:

```py
# pyarrow-example.py

from flightsql import FlightSQLClient

client = FlightSQLClient(host='cloud2.influxdata.com',
    token='INFLUX_READ_WRITE_TOKEN',
    metadata={'database': 'BUCKET_NAME'},
    features={'metadata-reflection': 'true'})

info = client.execute('SELECT * FROM home')

reader = client.do_get(info.endpoints[0].ticket)

table = reader.read_all()

# Use PyArrow to aggregate data
print(table.group_by('room').aggregate([('temp', 'mean')]))
```

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

Replace the following:

- **`INFLUX_READ_WRITE_TOKEN`**: An InfluxDB token with _read_ permission to the bucket.
- **`BUCKET_NAME`**: The name of the InfluxDB bucket to query.

For more detail and examples, see the [PyArrow documentation](https://arrow.apache.org/docs/python/getstarted.html) and the [Apache Arrow Python Cookbook](https://arrow.apache.org/cookbook/py/data.html).
