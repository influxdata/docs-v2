---
title: Use Python with the `flightsql-dbapi` Flight SQL library to query data
seotitle: Use Python with the `flightsql-dbapi` Flight SQL library to query data stored in InfluxDB Cloud (IOx)
description: >
  Install and run Python with the `flightsql-dbapi` Flight SQL library to query data
  stored in a bucket powered by InfluxDB IOx.
weight: 101
menu:
  influxdb_cloud_iox:
    parent: Query with Flight SQL
    name: Use flightsql-dbapi with Python
    identifier: query_with_python
influxdb/cloud-iox/tags: [query, flightsql, python]
---

Use Python with the `flightsql-dbapi` Flight SQL library to query data stored in a bucket powered by InfluxDB IOx.

## Create a Python virtual environment

This guide follows the recommended practice of using Python _virtual environments_.
Virtual environments keep project dependencies self-contained and isolated from other projects and dependency versions.

To install Python and create a virtual environment, choose one of the following:

1. Follow the [Python.org instructions](https://wiki.python.org/moin/BeginnersGuide/Download)
to install a recent version of the Python programming language for your system.
    
2. Check that you can run `python` and `pip` commands.
`pip` is a package manager that is included in most Python distributions.

    In your terminal, enter the following commands:

    ```sh
    python --version
    ```
    ```sh
    pip --version
    ```

    Depending on your system, you may need to use version-specific (for example: `python3` and `pip3`) commands.

    ```sh
    python3 --version
    ```
    ```sh
    pip3 --version
    ```

    If neither `pip` nor `pip<PYTHON_VERSION>` works, follow one of the [Pypa.io Pip installation](https://pip.pypa.io/en/stable/installation/) methods for your system.

## Run code with the Python interpreter

To run sample code using Python's built-in [interpreter](https://docs.python.org/3/tutorial/interpreter.html), do the following:

  1. In your editor, save the Python code to a file (for example: `qt.py`).
  2. [Replace sample configuration values](#create-a-query-client) with your InfluxDB configuration values. 
  3. In your terminal, enter the `python<PYTHON_VERSION>` command and pass the file path:

        {{< code-tabs-wrapper >}}
    {{% code-tabs %}}
    [python](#pip)
    [conda](#conda)
    {{% /code-tabs %}}
    {{% code-tab-content %}}

    ```sh
    python3 ./qt.py
    ```

    {{% /code-tab-content %}}
    {{% code-tab-content %}}


    ```sh
    conda run python ./qt.py
    ```

    {{% /code-tab-content %}}
        {{< /code-tabs-wrapper >}}

## Install the Flight SQL Python Library

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[pip](#pip)
[conda](#conda)
{{% /code-tabs %}}
{{% code-tab-content %}}

In your terminal, use `pip` to install the `flightsql-dbapi` Flight SQL library.

```sh
pip3 install flightsql-dbapi
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

Anaconda doesn't include the `flightsql-dbapi` library.
Use the `conda run` command to invoke `pip` and install `flightsql-dbapi` for conda environments.

```sh
conda run pip install flightsql-dbapi
```

{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

The `flightsql-dbapi` library for Python provides a
[DB API 2](https://peps.python.org/pep-0249/) interface and
[SQLAlchemy](https://www.sqlalchemy.org/) dialect for
[Flight SQL](https://arrow.apache.org/docs/format/FlightSql.html).

## Query InfluxDB  

With `flightsql-dbapi` installed, you can query and analyze data stored in an InfluxDB bucket.

### Create a query client

To use `flightsql-dbapi` in your Python code, import the `FlightSQLClient` class and instantiate a client
with your InfluxDB configuration:

```py
from flightsql import FlightSQLClient

client = FlightSQLClient(host='us-east-1-1.aws.cloud2.influxdata.com',
                        token='INFLUX_READ_WRITE_TOKEN',
                        metadata={'bucket-name': 'INFLUX_BUCKET'},
                        features={'metadata-reflection': 'true'})
```

Replace the following:

- **`us-east-1-1.aws.cloud2.influxdata.com`**: your [InfluxDB host](). 
- **`INFLUX_READ_WRITE_TOKEN`**: your InfluxDB READ/WRITE token
- **`INFLUX_BUCKET`**: the name of the InfluxDB bucket that you want to query

The default for `port` is `443`.

The preceding example uses the [DB API 2](https://peps.python.org/pep-0249/) interface.
To learn more about dialects and interfaces, see the [influxdata/flightsql-dbapi README](https://github.com/influxdata/flightsql-dbapi) on GitHub.

### Execute a query

To execute a query, call the  `FlightSQLClient` `execute` method and pass an SQL query.
`execute` returns a `flight.FlightInfo` object that specifies the retrieval location for Arrow data.

#### execute() syntax

```py
execute(query: str, call_options: Optional[FlightSQLCallOptions] = None)
```

#### execute() example

    ```py
from flightsql import FlightSQLClient

client = FlightSQLClient(host='us-east-1-1.aws.cloud2.influxdata.com',
    token='INFLUX_READ_WRITE_TOKEN',
    metadata={'bucket-name': 'INFLUX_BUCKET'},
    features={'metadata-reflection': 'true'})

query = client.execute("SELECT * FROM home")

    ```

### Retrieve data from the Flight SQL query result

The `FlightSQLClient` `do_get` method uses a Flight ticket to request a stream of Arrow data
and then returns a [`pyarrow.flight.FlightStreamReader`](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightStreamReader.html) for streaming the result.

#### do_get() syntax

```py
 do_get(ticket, call_options: Optional[FlightSQLCallOptions] = None)
```

#### do_get() example

The following Python sample code executes the query, retrieves data, and then reads the contents
of the Arrow data stream:

    ```py
from flightsql import FlightSQLClient

client = FlightSQLClient(host='us-east-1-1.aws.cloud2.influxdata.com',
    token='INFLUX_READ_WRITE_TOKEN',
    metadata={'bucket-name': 'INFLUX_BUCKET'},
    features={'metadata-reflection': 'true'})

query = client.execute("SELECT * FROM home")

reader = client.do_get(query.endpoints[0].ticket)

print(reader.read_all())
    ```

The output is the result stream as a [`pyarrow.Table`](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html#pyarrow.Table).

To view the output, [run the sample in the Python interpreter](#run-code-with-the-python-interpreter).

Next, learn how to [Analyze data with Python](#analyze-data-with-python).

## Analyze data with Python

Get started using data analysis tools to work with InfluxDB query results in Python:

- [Use pyarrow]()
- [Use pandas](/influxdb/cloud-iox/query-data/execute-queries/flight-sql/pandas/)