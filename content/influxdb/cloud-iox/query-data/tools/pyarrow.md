---
title: Use the PyArrow library to analyze data
description: >
  Install and run [PyArrow](https://arrow.apache.org/docs/python/) to read and analyze InfluxDB query results from a bucket powered by InfluxDB IOx.
weight: 101
menu:
  influxdb_cloud_iox:
    parent: Analyze and visualize data
    name: Use PyArrow
influxdb/cloud-iox/tags: [analysis, arrow, pyarrow, python]
---

Use [PyArrow](https://arrow.apache.org/docs/python/) to read and analyze query results 
from an InfluxDB bucket powered by InfluxDB IOx.
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
For more information, see how to [get started using Python to query InfluxDB](/influxdb/cloud-iox/query-data/execute-queries/flight-sql/python/)

Installing `flightsql-dbapi` also installs the [`pyarrow`](https://arrow.apache.org/docs/python/index.html) library that provides Python bindings for Apache Arrow.

## Use PyArrow to read query results

The following example shows how to use Python with `flightsql-dbapi` and `pyarrow` to query InfluxDB and view query results.
 
1. In your editor, copy and paste the following sample code to a new file--for example, `pyarrow-example.py`:

    ```py
    # pyarrow-example.py

    from flightsql import FlightSQLClient

    # Instantiate a FlightSQLClient configured for a bucket
    client = FlightSQLClient(host='INFLUXDB_DOMAIN',
        token='INFLUX_READ_WRITE_TOKEN',
        metadata={'bucket-name': 'INFLUX_BUCKET'},
        features={'metadata-reflection': 'true'})

    # Execute the query
    query = client.execute('SELECT * FROM home')

    # Use the Flight ticket to request the Arrow data stream.
    # Return a pyarrow.flight.FlightStreamReader for streaming the results.
    reader = client.do_get(query.endpoints[0].ticket)

    # Use pyarrow to read the data stream into a pyarrow.Table
    table = reader.read_all()

    print(table)
    ```

2. Replace the following configuration values:

    - **`INFLUX_READ_WRITE_TOKEN`**: Your InfluxDB token with read permissions on the databases you want to query.
    - **`INFLUX_BUCKET`**: The name of your InfluxDB bucket.

  For more information about `FlightSQLClient`, see how to [get started querying InfluxDB with Python and flightsql-dbapi](/influxdb/cloud-iox/query-data/execute-queries/flight-sql/python/).

3. In your terminal, use the Python interpreter to run the file:

    ```sh
    python pyarrow-example.py
    ```

## Use PyArrow to analyze data

### Group and aggregate data

With a `pyarrow.Table`, you can use values in a column as _keys_ for grouping.

The following example shows how to query InfluxDB, group the table data, and then calculate an aggregate value for each group:

```py
# pyarrow-example.py

from flightsql import FlightSQLClient

client = FlightSQLClient(host='INFLUXDB_DOMAIN',
    token='INFLUX_READ_WRITE_TOKEN',
    metadata={'bucket-name': 'INFLUX_BUCKET'},
    features={'metadata-reflection': 'true'})

query = client.execute('SELECT * FROM home')

reader = client.do_get(query.endpoints[0].ticket)

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


For more detail and examples, see the [PyArrow documentation](https://arrow.apache.org/docs/python/getstarted.html) and the [Apache Arrow Python Cookbook](https://arrow.apache.org/cookbook/py/data.html).
