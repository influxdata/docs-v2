---
title: Use the PyArrow library to analyze data
seotitle: Use the PyArrow library to read and analyze InfluxDB query results from a bucket powered by InfluxDB IOx.
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
The PyArrow library provides for efficient computation, aggregation, serialization, and conversion of Arrow format data.

> Apache Arrow is a development platform for in-memory analytics. It contains a set of technologies that enable
> big data systems to store, process and move data fast.
>
> The Arrow Python bindings (also named “PyArrow”) have first-class integration with NumPy, pandas, and built-in Python objects. They are based on the C++ implementation of Arrow.
> {{% caption %}}[PyArrow documentation](https://arrow.apache.org/docs/python/index.html){{% /caption %}}

<!-- TOC -->

- [Install prerequisites](#install-prerequisites)
- [Install pyarrow](#install-pyarrow)
- [Use PyArrow to read query result data](#use-pyarrow-to-read-query-result-data)
- [Use PyArrow to analyze data](#use-pyarrow-to-analyze-data)
    - [Group and aggregate data](#group-and-aggregate-data)

<!-- /TOC -->

## Install prerequisites

The examples in this guide assume using a Python virtual environment and the Flight SQL library for Python.
For more information, see how to [get started using Python to query InfluxDB](/influxdb/cloud-iox/query-data/execute-queries/flight-sql/python/)

## Install pyarrow

In order to read query results in Apache Arrow format and then convert them to pandas, you need to
install and import the `pyarrow` bindings:

- In your terminal, use `pip` to install `pyarrow` in your [Python virtual environment](/influxdb/cloud-iox/query-data/execute-queries/flight-sql/python/#create-a-project-virtual-environment):

```sh
pip install pyarrow
```

- In your code, add an `import` statement for `pyarrow`:

```py
import pyarrow
```

## Use PyArrow to read query result data

The following Python sample code executes the query, retrieves data, and then reads the contents
of the Arrow data stream.
For more information about `FlightSQLClient`, see how to [get started querying InfluxDB with Python and flightsql-dbapi](/influxdb/cloud-iox/query-data/execute-queries/flight-sql/python/).

```py
from flightsql import FlightSQLClient
import pyarrow

client = FlightSQLClient(host='INFLUXDB_DOMAIN',
    token='INFLUX_READ_WRITE_TOKEN',
    metadata={'bucket-name': 'INFLUX_BUCKET'},
    features={'metadata-reflection': 'true'})

query = client.execute('SELECT * FROM home')

reader = client.do_get(query.endpoints[0].ticket)

table = reader.read_all()
```

See how to [run the sample code in the Python interpreter](/influxdb/cloud-iox/query-data/execute-queries/flight-sql/python/#run-code-with-the-python-interpreter).

## Use PyArrow to analyze data

### Group and aggregate data

```py
...
table = reader.read_all()
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

See how to [run the sample code in the Python interpreter](/influxdb/cloud-iox/query-data/execute-queries/flight-sql/python/#run-code-with-the-python-interpreter).

For more detail and examples, see the [Apache Arrow and PyArrow documentation](https://arrow.apache.org/docs/python/getstarted.html).
