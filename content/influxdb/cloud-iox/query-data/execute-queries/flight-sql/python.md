---
title: Use Python and the Flight SQL library to query data
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
list_code_example: |
    ```py
    from flightsql import FlightSQLClient

    client = FlightSQLClient(host='INFLUXDB_DOMAIN',
        token='INFLUX_READ_WRITE_TOKEN',
        metadata={'bucket-name': 'INFLUX_BUCKET'},
        features={'metadata-reflection': 'true'})

    query = client.execute("SELECT * FROM home")

    ticket = query.endpoints[0].ticket

    reader = client.do_get(ticket)

    reader.read_all()
    ```
---

Use Python and the Flight SQL library to query data stored in a bucket powered by InfluxDB IOx.

<!-- TOC -->

- [Get started using Python to query InfluxDB](#get-started-using-python-to-query-influxdb)
- [Create a Python virtual environment](#create-a-python-virtual-environment)
  - [Install Python](#install-python)
  - [Create a project virtual environment](#create-a-project-virtual-environment)
  - [Install Anaconda](#install-anaconda)
- [Query InfluxDB using Flight SQL](#query-influxdb-using-flight-sql)
  - [Install the Flight SQL Python Library](#install-the-flight-sql-python-library)
  - [Create a query client](#create-a-query-client)
  - [Execute a query](#execute-a-query)
    - [Syntax](#syntax)
    - [Example](#example)
  - [Retrieve data from the Flight SQL query](#retrieve-data-from-the-flight-sql-query)
    - [Syntax](#syntax)
    - [Example {#retrieve-data-from-the-flight-sql-query-example}](#example-retrieve-data-from-the-flight-sql-query-example)

<!-- /TOC -->

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

3. Use `conda` to create a virtual environment:

    ```sh
    conda create --prefix envs/virtualenv-1 
    ```

5. To activate the new virtual environment in your terminal, use the `conda activate` command and pass the file path of the virtual environment `activate` script:

    ```sh
    conda activate ./envs/virtualenv-1
    ```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

When activated, the virtual environment name appears at the beginning of your terminal command line--for example:
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

In your terminal, use `pip` to install the `flightsql-dbapi` Flight SQL library for Python:

```sh
pip install flightsql-dbapi
```

- [`flightsql-dbapi`](https://github.com/influxdata/flightsql-dbapi) provides a
[DB API 2](https://peps.python.org/pep-0249/) interface and
[SQLAlchemy](https://www.sqlalchemy.org/) dialect for
[Flight SQL](https://arrow.apache.org/docs/format/FlightSql.html).
- Installing `flightsql-dbapi` also installs the [`pyarrow`](https://arrow.apache.org/docs/python/index.html) library that you'll use later.

With `flightsql-dbapi` and `pyarrow` installed, you're ready to query and analyze data stored in an InfluxDB bucket.

### Create a query client

The following example shows how to use Python with `flightsql-dbapi`
and the _DB API 2_ interface to instantiate a Flight SQL client configured for an InfluxDB bucket.

1. In your editor, copy and paste the following sample code to a new file--for example, `query-example.py`:

    ```py
    # query-example.py
    
    from flightsql import FlightSQLClient

    # Instantiate a FlightSQLClient configured for your bucket
    client = FlightSQLClient(host='cloud2.influxdata.com',
                            token='INFLUX_READ_WRITE_TOKEN',
                            metadata={'bucket-name': 'INFLUX_BUCKET'},
                            features={'metadata-reflection': 'true'})
    ```

2. Replace the following configuration values:

    - **`INFLUX_READ_WRITE_TOKEN`**: Your InfluxDB token with read permissions on the databases you want to query.
    - **`INFLUX_BUCKET`**: The name of your InfluxDB bucket.

### Execute a query

To execute an SQL query, call the  `FlightSQLClient.execute` method with the query as a string.

#### Syntax

```py
execute(query: str, call_options: Optional[FlightSQLCallOptions] = None)
```

#### Example

```py
# query-example.py

from flightsql import FlightSQLClient

client = FlightSQLClient(host='us-east-1-1.aws.cloud2.influxdata.com',
    token='INFLUX_READ_WRITE_TOKEN',
    metadata={'bucket-name': 'INFLUX_BUCKET'},
    features={'metadata-reflection': 'true'})

# Execute the query
query = client.execute("SELECT * FROM home")
```

The response contains a `flight.FlightInfo` object.
The object's `endpoint.ticket` property contains a _Flight ticket_ value--the retrieval location for the Arrow data.

For example:

```py
ticket = query.endpoints[0].ticket
```

### Retrieve data from the Flight SQL query

To retrieve the Arrow data, call the `FlightSQLClient.do_get` method with the Flight ticket (`ticket`).

#### Syntax

```py
 do_get(ticket, call_options: Optional[FlightSQLCallOptions] = None)
```

#### Example {#retrieve-data-from-the-flight-sql-query-example}

The following example shows how to use Python with `flightsql-dbapi` and `pyarrow` to query InfluxDB and get a stream reader for Arrow data.

```py
# query-example.py

from flightsql import FlightSQLClient

client = FlightSQLClient(host='INFLUXDB_DOMAIN',
    token='INFLUX_READ_WRITE_TOKEN',
    metadata={'bucket-name': 'INFLUX_BUCKET'},
    features={'metadata-reflection': 'true'})

query = client.execute("SELECT * FROM home")

# Get the data location ticket from the response
ticket = query.endpoints[0].ticket

# Use the ticket to request the Arrow data stream.
reader = client.do_get(ticket)
```

`FlightSQLClient.do_get` returns a [`pyarrow.flight.FlightStreamReader`](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightStreamReader.html) for streaming the Arrow data.
To read the data, call one of the following `pyarrow.flight.FlightStreamReader` methods:

- `read_all`: Read the entire contents of the stream as a [`pyarrow.Table`](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html).
- `read_chunk`: Read the next RecordBatch and metadata.
- `read_pandas`: Read the entire contents of the stream and convert it to a [`pandas.DataFrame`](https://pandas.pydata.org/docs/reference/frame.html).

The following example calls `read_all`:

    ```py
    # query-example.py

    from flightsql import FlightSQLClient

    client = FlightSQLClient(host='INFLUXDB_DOMAIN',
        token='INFLUX_READ_WRITE_TOKEN',
        metadata={'bucket-name': 'INFLUX_BUCKET'},
        features={'metadata-reflection': 'true'})

    query = client.execute("SELECT * FROM home")

    ticket = query.endpoints[0].ticket

    reader = client.do_get(ticket)

    print(reader.read_all())
    ```

```sh
pandas query-example.py
```

The output is the result stream as a [`pyarrow.Table`](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html#pyarrow.Table).

Next, learn how to use Python tools to analyze InfluxDB query results:

- [Use PyArrow](/influxdb/cloud-iox/query-data/tools/pyarrow/)
- [Use pandas](/influxdb/cloud-iox/query-data/tools/pandas/)
