---
title: Use Python and the Flight SQL library to query data
description: >
  Use Python and the `flightsql-dbapi` Flight SQL library to query data
  stored in InfluxDB.
weight: 101
menu:
  influxdb_cloud_dedicated:
    parent: Query with Flight SQL
    name: Use Python
    identifier: query_with_python
influxdb/cloud-dedicated/tags: [query, flightsql, python]
related:
    - /influxdb/cloud-dedicated/query-data/tools/pandas/
    - /influxdb/cloud-dedicated/query-data/tools/pyarrow/
    - /influxdb/cloud-dedicated/query-data/sql/
list_code_example: |
    ```py
    from flightsql import FlightSQLClient

    client = FlightSQLClient(host='cluster-id.influxdb.io',
        token='INFLUX_READ_WRITE_TOKEN',
        metadata={'iox-namespace-name': 'INFLUX_DATABASE'},
        features={'metadata-reflection': 'true'})

    info = client.execute("SELECT * FROM home")

    ticket = info.endpoints[0].ticket

    reader = client.do_get(ticket)
    ```
---

Use Python and the Flight SQL library to query data stored in InfluxDB.

- [Get started using Python to query InfluxDB](#get-started-using-python-to-query-influxdb)
- [Create a Python virtual environment](#create-a-python-virtual-environment)
  - [Install Python](#install-python)
  - [Create a project virtual environment](#create-a-project-virtual-environment)
  - [Install Anaconda](#install-anaconda)
- [Query InfluxDB using Flight SQL](#query-influxdb-using-flight-sql)
  - [Install the Flight SQL Python Library](#install-the-flight-sql-python-library)
  - [Create a query client](#create-a-query-client)
  - [Execute a query](#execute-a-query)
  - [Retrieve data for Flight SQL query results](#retrieve-data-for-flight-sql-query-results)

## Get started using Python to query InfluxDB

This guide follows the recommended practice of using Python _virtual environments_.
If you don't want to use virtual environments and you have Python installed,
continue to [Query InfluxDB using Flight SQL](#query-influxdb-using-flight-sql).

## Create a Python virtual environment

Python [virtual environments](https://docs.python.org/3/library/venv.html) keep the Python interpreter and dependencies for your project self-contained and isolated from other projects.

To install Python and create a virtual environment, choose one of the following options:

- [Python venv](?t=venv#venv-install): The [`venv` module](https://docs.python.org/3/library/venv.html) comes standard in Python as of version 3.5.
- [Anaconda® Distribution](?t=Anaconda#conda-install): A Python/R data science distribution that provides Python and the  **conda** package and environment manager. 

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[venv](#venv-install)
[Anaconda](#conda-install)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!-- Begin venv -->

### Install Python

1. Follow the [Python installation instructions](https://wiki.python.org/moin/BeginnersGuide/Download)
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
    mkdir ./PROJECT_DIRECTORY && cd $_
    ```

2. Use the Python `venv` module to create a virtual environment--for example:
    
    ```sh
    python -m venv envs/virtualenv-1
    ```

   `venv` creates the new virtual environment directory in your project.
   
3. To activate the new virtual environment in your terminal, run the `source` command and pass the file path of the virtual environment `activate` script:

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

1. Follow the [Anaconda installation instructions](https://docs.continuum.io/anaconda/install/) for your system.
2. Check that you can run the `conda` command:

    ```sh
    conda
    ```

3. Use `conda` to create a virtual environment--for example:

    ```sh
    conda create --prefix envs/virtualenv-1 
    ```

    `conda` creates a virtual environment in a directory named `./envs/virtualenv-1`.

4. To activate the new virtual environment, use the `conda activate` command and pass the directory path of the virtual environment:

    ```sh
    conda activate envs/VIRTUAL_ENVIRONMENT_NAME
    ```

    For example:

    ```sh
    conda activate ./envs/virtualenv-1
    ```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

When a virtual environment is activated, the name displays at the beginning of your terminal command line--for example:
  {{% code-callout "(virtualenv-1)"%}}
  ```sh
  (virtualenv-1) $ PROJECT_DIRECTORY
  ```
  {{% /code-callout %}}

## Query InfluxDB using Flight SQL

1. [Install the Flight SQL Python Library](#install-the-flight-sql-python-library)
2. [Create a query client](#create-a-query-client)
3. [Execute a query](#execute-a-query)

### Install the Flight SQL Python Library

The [`flightsql-dbapi`](https://github.com/influxdata/flightsql-dbapi) Flight SQL library for Python provides a
[DB API 2](https://peps.python.org/pep-0249/) interface and
[SQLAlchemy](https://www.sqlalchemy.org/) dialect for
[Flight SQL](https://arrow.apache.org/docs/format/FlightSql.html).
Installing `flightsql-dbapi` also installs the [`pyarrow`](https://arrow.apache.org/docs/python/index.html) library that you'll use for working with Arrow data.

In your terminal, use `pip` to install `flightsql-dbapi`:

```sh
pip install flightsql-dbapi
```

With `flightsql-dbapi` and `pyarrow` installed, you're ready to query and analyze data stored in an InfluxDB database.

### Create a query client

The following example shows how to use Python with `flightsql-dbapi`
and the _DB API 2_ interface to instantiate a Flight SQL client configured for an InfluxDB database.

1. In your editor, copy and paste the following sample code to a new file--for example, `query-example.py`:

    ```py
    # query-example.py
    
    from flightsql import FlightSQLClient

    # Instantiate a FlightSQLClient configured for your database
    client = FlightSQLClient(host='cluster-id.influxdb.io',
                            token='INFLUX_READ_WRITE_TOKEN',
                            metadata={'iox-namespace-name': 'INFLUX_DATABASE'},
                            features={'metadata-reflection': 'true'})
    ```

2. Replace the following configuration values:

    - **`INFLUX_READ_WRITE_TOKEN`**: Your InfluxDB token with read permissions on the databases you want to query.
    - **`INFLUX_DATABASE`**: The name of your InfluxDB database.

### Execute a query

To execute an SQL query, call the query client's `execute(query)` method and pass the query as a string.

#### Syntax {#execute-query-syntax}

```py
execute(query: str, call_options: Optional[FlightSQLCallOptions] = None)
```

#### Example {#execute-query-example}

```py
# query-example.py

from flightsql import FlightSQLClient

client = FlightSQLClient(host='cluster-id.influxdb.io',
    token='INFLUX_READ_WRITE_TOKEN',
    metadata={'iox-namespace-name': 'INFLUX_DATABASE'},
    features={'metadata-reflection': 'true'})

# Execute the query
info = client.execute("SELECT * FROM home")
```

The response contains a `flight.FlightInfo` object that contains metadata and an `endpoints: [...]` list. Each endpoint contains the following:

- A list of addresses where you can retrieve the data.
- A `ticket` value that identifies the data to retrieve.

Next, use the ticket to [retrieve data for Flight SQL query results](#retrieve-data-for-flight-sql-query-results)

### Retrieve data for Flight SQL query results

To retrieve Arrow data for a query result, call the client's `do_get(ticket)` method.

#### Syntax {#retrieve-data-syntax}

```py
 do_get(ticket, call_options: Optional[FlightSQLCallOptions] = None)
```

#### Example {#retrieve-data-example}

The following sample shows how to use Python with `flightsql-dbapi` and `pyarrow` to query InfluxDB and retrieve data.

```py
# query-example.py

from flightsql import FlightSQLClient

# Instantiate a FlightSQLClient configured for a database
client = FlightSQLClient(host='cluster-id.influxdb.io',
    token='INFLUX_READ_WRITE_TOKEN',
    metadata={'iox-namespace-name': 'INFLUX_DATABASE'},
    features={'metadata-reflection': 'true'})

# Execute the query to retrieve FlightInfo
info = client.execute("SELECT * FROM home")

# Extract the token for retrieving data
ticket = info.endpoints[0].ticket

# Use the ticket to request the Arrow data stream.
# Return a FlightStreamReader for streaming the results.
reader = client.do_get(ticket)

# Read all data to a pyarrow.Table
table = reader.read_all()
```

`do_get(ticket)` returns a [`pyarrow.flight.FlightStreamReader`](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightStreamReader.html) for streaming Arrow [record batches](https://arrow.apache.org/docs/python/data.html#record-batches).

To read data from the stream, call one of the following `FlightStreamReader` methods:

- `read_all()`: Read all record batches as a [`pyarrow.Table`](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html).
- `read_chunk()`: Read the next RecordBatch and metadata.
- `read_pandas()`: Read all record batches and convert them to a  [`pandas.DataFrame`](https://pandas.pydata.org/docs/reference/frame.html).

Next, learn how to use Python tools to work with time series data:

- [Use PyArrow](/influxdb/cloud-dedicated/query-data/tools/pyarrow/)
- [Use pandas](/influxdb/cloud-dedicated/query-data/tools/pandas/)
