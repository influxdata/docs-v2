---
title: Use Python and the Flight SQL library to query data
seotitle: Use Python and the flightsql-dbapi Flight SQL library to query data in InfluxDB Cloud (IOx)
description: >
  Use Python and the `flightsql-dbapi` Flight SQL library to query data
  stored in a bucket powered by InfluxDB IOx.
weight: 101
menu:
  influxdb_cloud_iox:
    parent: Query with Flight SQL
    name: Use Python
    identifier: query_with_python
influxdb/cloud-iox/tags: [query, flightsql, python]
---

Use Python and the Flight SQL library to query data stored in a bucket powered by InfluxDB IOx.

## Get started using Python to query InfluxDB

This guide follows the recommended practice of using Python _virtual environments_.
If you don't want to use virtual environments and you have Python installed,
continue to [Install the Flight SQL Python Library](#install-the-flight-sql-python-library).

<!-- TOC -->

- [Get started using Python to query InfluxDB](#get-started-using-python-to-query-influxdb)
- [Create a Python virtual environment](#create-a-python-virtual-environment)
    - [Install Python](#install-python)
    - [Create a project virtual environment](#create-a-project-virtual-environment)
    - [Install Anaconda](#install-anaconda)
- [Run code with the Python interpreter](#run-code-with-the-python-interpreter)
- [Install the Flight SQL Python Library](#install-the-flight-sql-python-library)
- [Query InfluxDB](#query-influxdb)
    - [Create a query client](#create-a-query-client)
    - [Execute a query](#execute-a-query)
        - [Syntax](#syntax)
        - [Example](#example)
    - [Retrieve data from the Flight SQL query](#retrieve-data-from-the-flight-sql-query)
        - [Syntax](#syntax)
        - [Example](#example)

<!-- /TOC -->

## Create a Python virtual environment

Python [virtual environments](https://docs.python.org/3/library/venv.html) keep the Python interpreter and dependencies for your project self-contained and isolated from other projects.

To install Python and create a virtual environment, choose one of the following options:

- [Use Python venv](?t=venv#venv-install). The [`venv` module](https://docs.python.org/3/library/venv.html) comes standard in Python as of version 3.5.
- [Use Anaconda](?t=Anaconda#conda-install). [Anaconda® Distribution](https://docs.continuum.io/anaconda/) is a Python/R data science distribution that provides Python and the  **conda** package and environment manager. 

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[venv](#venv-install)
[Anaconda](#conda-install)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!-- Begin venv -->

### Install Python

1. Follow the [Python.org instructions](https://wiki.python.org/moin/BeginnersGuide/Download)
to install a recent version of the Python programming language for your system.
2. Check that you can run `python` and `pip` commands.
`pip` is a package manager included in most Python distributions.

    In your terminal, enter the following commands:

    ```sh
    python --version
    ```

    ```sh
    pip --version
    ```

    Depending on your system, you may need to use version-specific commands--for example.

    ```sh
    python3 --version
    ```

    ```sh
    pip3 --version
    ```

    If neither `pip` nor `pip<PYTHON_VERSION>` works, follow one of the [Pypa.io Pip installation](https://pip.pypa.io/en/stable/installation/) methods for your system.

### Create a project virtual environment

1. Create a directory for your Python project and change to the new directory--for example:

    ```sh
    mkdir ./PROJECT_DIRECTORY && cd ./PROJECT_DIRECTORY
    ```
1. Use the Python `venv` module to create a virtual environment--for example:
    
    ```sh
    python -m venv envs/virtualenv-1
    ```

   `venv` creates the new virtual environment directory in your project.
2. To activate the new virtual environment in your terminal, run the `source` command and pass the file path of the virtual environment `activate` script:

    ```sh
    source envs/VIRTUAL_ENVIRONMENT_NAME/bin/activate
    ```

    For example:
    ```sh
    source envs/virtualenv-1/bin/activate
    ```
<!-- End venv -->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-- Begin conda -->

### Install Anaconda

1. Follow the [Continuum.io instructions to install Anaconda](https://docs.continuum.io/anaconda/install/) for your system.
2. Check that you can run the `conda` command:

    ```sh
    conda
    ```
3. Use `conda` to create a virtual environment:
    ```sh
    conda create --prefix envs/virtualenv-1 
    ```
4. To activate the new virtual environment in your terminal, use the `conda activate` command and pass the file path of the virtual environment `activate` script:

    ```sh
    conda activate ./envs/virtualenv-1
    ```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

When activated, the virtual environment name appears at the beginning of your terminal command line--for example:

```sh
(VIRTUAL_ENVIRONMENT_NAME) $ PROJECT_DIRECTORY
```

## Run code with the Python interpreter

To run sample code using Python's built-in [interpreter](https://docs.python.org/3/tutorial/interpreter.html), do the following:

  1. In your editor, save the Python code to a file (for example: `qt.py`).
  2. [Replace sample configuration values](#create-a-query-client) with your InfluxDB configuration values. 
  3. In your terminal, enter the `python<PYTHON_VERSION>` command and pass the file path:

    ```sh
    python ./qt.py
    ```

## Install the Flight SQL Python Library

In your terminal, use `pip` to install the `flightsql-dbapi` Flight SQL library:

```sh
pip install flightsql-dbapi
```

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

#### Syntax

```py
execute(query: str, call_options: Optional[FlightSQLCallOptions] = None)
```

#### Example

```py
from flightsql import FlightSQLClient

client = FlightSQLClient(host='us-east-1-1.aws.cloud2.influxdata.com',
    token='INFLUX_READ_WRITE_TOKEN',
    metadata={'bucket-name': 'INFLUX_BUCKET'},
    features={'metadata-reflection': 'true'})

query = client.execute("SELECT * FROM home")
```

### Retrieve data from the Flight SQL query

The `FlightSQLClient` `do_get` method uses a **Flight ticket** to request a stream of Arrow data
and then returns a [`pyarrow.flight.FlightStreamReader`](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightStreamReader.html) for streaming the result.

#### Syntax

```py
 do_get(ticket, call_options: Optional[FlightSQLCallOptions] = None)
```

#### Example
<span id="retrieve-data-from-the-flight-sql-query-example" />

The following Python sample code executes the query, retrieves data, and then reads the contents
of the Arrow data stream:

```py
from flightsql import FlightSQLClient

client = FlightSQLClient(host='INFLUXDB_DOMAIN',
    token='INFLUX_READ_WRITE_TOKEN',
    metadata={'bucket-name': 'INFLUX_BUCKET'},
    features={'metadata-reflection': 'true'})

query = client.execute("SELECT * FROM home")

reader = client.do_get(query.endpoints[0].ticket)

table = reader.read_all()

print(table)
```

The output is the result stream as a [`pyarrow.Table`](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html#pyarrow.Table).

To view the output, [run the sample code in the Python interpreter](#run-code-with-the-python-interpreter).

Next, learn how to use Python tools to process InfluxDB query results:

- [Use PyArrow](/influxdb/cloud-iox/query-data/tools/pyarrow/)
- [Use pandas](/influxdb/cloud-iox/query-data/tools/pandas/)
