---
title: Use Python to query data
seotitle: Use Python and SQL or InfluxQL to query data
list_title: Use Python
description: >
  Use the `influxdb_client_3` Python module and SQL or InfluxQL to query data stored in InfluxDB.
  Execute queries and retrieve data over the Flight+gRPC protocol, and then process data using common Python tools.
weight: 401
menu:
  influxdb3_cloud_serverless:
    parent: Use client libraries
    name: Use Python
    identifier: query-with-python-sql
influxdb3/cloud-serverless/tags: [Flight client, query, flight, python, sql, influxql]
metadata: [SQL, InfluxQL]
aliases:
    - /influxdb3/cloud-serverless/query-data/execute-queries/flight-sql/python/
    - /influxdb3/cloud-serverless/query-data/execute-queries/influxql/python/
    - /influxdb3/cloud-serverless/query-data/execute-queries/sql/python/
    - /influxdb3/cloud-serverless/query-data/tools/python/
related:
    - /influxdb3/cloud-serverless/reference/client-libraries/v3/python/
    - /influxdb3/cloud-serverless/process-data/tools/pandas/
    - /influxdb3/cloud-serverless/process-data/tools/pyarrow/
    - /influxdb3/cloud-serverless/query-data/influxql/
    - /influxdb3/cloud-serverless/query-data/sql/
    - /influxdb3/cloud-serverless/reference/influxql/
    - /influxdb3/cloud-serverless/reference/sql/
    - /influxdb3/cloud-serverless/query-data/execute-queries/troubleshoot/
    - /influxdb3/cloud-serverless/query-data/troubleshoot-and-optimize/query-timeout-best-practices/

list_code_example: |
    ```py
    from influxdb_client_3 import InfluxDBClient3

    # Instantiate an InfluxDB client
    client = InfluxDBClient3(
        host='{{< influxdb/host >}}',
        token='DATABASE_TOKEN',
        database='DATABASE_NAME'
    )

    # Execute the query and return an Arrow table
    table = client.query(
        query="SELECT * FROM home",
        language="sql"
    )

    # Return query results as a markdown table
    print(table.to_pandas().to_markdown())
    ```
---

Use the InfluxDB `influxdb_client_3` Python client library module and SQL or InfluxQL to query data stored in InfluxDB.
Execute queries and retrieve data over the Flight+gRPC protocol, and then process data using common Python tools.

- [Get started using Python to query InfluxDB](#get-started-using-python-to-query-influxdb)
- [Create a Python virtual environment](#create-a-python-virtual-environment)
  - [Install Python](#install-python)
  - [Create a project virtual environment](#venv-install)
  - [Install Anaconda](?t=Anaconda#conda-install)
- [Query InfluxDB](#query-influxdb)
  - [Install the influxdb3-python library](#install-the-influxdb3-python-library)
  - [Create an InfluxDB client](#create-an-influxdb-client)
  - [Execute a query](#execute-a-query)

## Get started using Python to query InfluxDB

This guide assumes the following prerequisites:

- an {{% product-name %}} [bucket](/influxdb3/cloud-serverless/admin/buckets/) with data to query
- an [API token](/influxdb3/cloud-serverless/admin/tokens/) with _read_ access to the database

To learn how to set up InfluxDB and write data, see the [Setup instructions](/influxdb3/cloud-serverless/get-started/setup/) in the Get Started tutorial.

## Create a Python virtual environment

This guide follows the recommended practice of using Python _virtual environments_.
If you don't want to use virtual environments and you have Python installed,
continue to [Query InfluxDB](#query-influxdb).
Python [virtual environments](https://docs.python.org/3/library/venv.html) keep
the Python interpreter and dependencies for your project self-contained and isolated from other projects.

To install Python and create a virtual environment, choose one of the following options:

- [Python venv](?t=venv#venv-install): The [`venv` module](https://docs.python.org/3/library/venv.html) comes standard in Python as of version 3.5.
- [Anaconda® Distribution](?t=Anaconda#conda-install): A Python/R data science distribution that provides Python and the  **conda** package and environment manager. 

    {{< tabs-wrapper >}}
{{% tabs "small" %}}
[venv]()
[Anaconda]()
{{% /tabs %}}
{{% tab-content %}}
<!--------------------------------- Begin venv -------------------------------->

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

### Create a project virtual environment {#venv-install}

1. Create a directory for your Python project and change to the new directory--for example:

    ```sh
    mkdir ./PROJECT_DIRECTORY && cd $_
    ```

2. Use the Python `venv` module to create a virtual environment--for example:
    
    ```sh
    python -m venv envs/virtualenv-1
    ```

   `venv` creates the new virtual environment directory in your project.
   
3. To activate the new virtual environment in your terminal, run the `source` command and pass the path of the virtual environment `activate` script:

    ```sh
    source envs/VIRTUAL_ENVIRONMENT_NAME/bin/activate
    ```

    For example:
    
    ```sh
    source envs/virtualenv-1/bin/activate
    ```
<!---------------------------------- End venv --------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!-------------------------------- Begin conda -------------------------------->

### Install Anaconda {#conda-install}

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

<!--------------------------------- END conda --------------------------------->
{{% /tab-content %}}
    {{< /tabs-wrapper >}}

When a virtual environment is activated, the name displays at the beginning of your terminal command line--for example:
  
{{% code-callout "(virtualenv-1)"%}}
```sh
(virtualenv-1) $ PROJECT_DIRECTORY
```
{{% /code-callout %}}

## Query InfluxDB

1. [Install the influxdb3-python library](#install-the-influxdb3-python-library)
2. [Create an InfluxDB client](#create-an-influxdb-client)
3. [Execute a query](#execute-a-query)

### Install the influxdb3-python library

The `influxdb3-python` package provides the `influxdb_client_3` module for integrating {{% product-name %}} with your Python code.
The module supports writing data to InfluxDB and querying data using SQL or InfluxQL.

Install the following dependencies:

{{% req type="key" text="Already installed in the [Write data section](/influxdb3/cloud-serverless/get-started/write/?t=Python#write-line-protocol-to-influxdb)" color="magenta" %}}

- `influxdb3-python` {{< req text="\* " color="magenta" >}}: Provides the `influxdb_client_3` module and also installs the [`pyarrow` package](https://arrow.apache.org/docs/python/index.html) for working with Arrow data returned from queries.
- `pandas`: Provides [pandas modules](https://pandas.pydata.org/) for analyzing and manipulating data.
- `tabulate`: Provides the [`tabulate` function](https://pypi.org/project/tabulate/) for formatting tabular data.

Enter the following command in your terminal:

```sh
pip install influxdb3-python pandas tabulate
```

With `influxdb3-python` and `pyarrow` installed, you're ready to query and
analyze data stored in an InfluxDB database.

### Create an InfluxDB client

The following example shows how to use Python with the `influxdb_client_3`
module to instantiate a client configured for an {{% product-name %}} bucket.

In your editor, copy and paste the following sample code to a new file--for
example, `query-example.py`.

{{% code-placeholders "(BUCKET|ORG|API)_(NAME|TOKEN)" %}}
```py
# query-example.py

from influxdb_client_3 import InfluxDBClient3

# Instantiate an InfluxDBClient3 client configured for your bucket
client = InfluxDBClient3(
    host='{{< influxdb/host >}}',
    token='API_TOKEN',
    database='BUCKET_NAME',
    timeout=30  # Set default timeout to 30 seconds for serverless
)
```
{{% /code-placeholders %}}

{{< expand-wrapper >}}
{{% expand "<span class='req'>Important</span>: If using **Windows**, specify the **Windows** certificate path" %}}

If using a non-POSIX-compliant operating system (such as Windows), specify the root certificate path when instantiating the client.

1.  In your terminal, install the Python `certifi` package.

    ```sh
    pip install certifi
    ```

2.  In your Python code, import `certifi` and call the `certifi.where()` method to retrieve the certificate path.
3.  When instantiating the client, pass the `flight_client_options.tls_root_certs=<ROOT_CERT_PATH>` option with the certificate path.

The following code sample shows how to use the Python `certifi` package and client library options to pass the certificate path:

{{% code-placeholders "BUCKET_NAME|API_TOKEN" %}}
{{< code-callout "flight_client_options|tls_root_certs|(cert\b)" >}}
```py
from influxdb_client_3 import InfluxDBClient3, flight_client_options
import certifi

fh = open(certifi.where(), "r")
cert = fh.read()
fh.close()

client = InfluxDBClient3(
host="{{< influxdb/host >}}",
token='API_TOKEN',
database='BUCKET_NAME',
flight_client_options=flight_client_options(
tls_root_certs=cert))
...
```
{{< /code-callout >}}
{{% /code-placeholders %}}

For more information, see [`influxdb_client_3` query exceptions](/influxdb3/cloud-serverless/reference/client-libraries/v3/python/#query-exceptions).

{{% /expand %}}
{{< /expand-wrapper >}}

Replace the following configuration values:

- **`database`**: the name of the [{{% product-name %}} bucket](/influxdb3/cloud-serverless/admin/buckets/) to query
- **`token`**:  an [API token](/influxdb3/cloud-serverless/admin/tokens/) with _read_ access to the specified bucket.
  _Store this in a secret store or environment variable to avoid exposing the raw token string._

### Execute a query

To execute a query, call the following client method:

[`query(query,language)` method](/influxdb3/cloud-serverless/reference/client-libraries/v3/python/#influxdbclient3query)

and specify the following arguments:

- **query**: A string. The SQL or InfluxQL query to execute.
- **language**: A string (`"sql"` or `"influxql"`). The `query` language.

#### Example {#execute-query-example}

The following example shows how to use SQL or InfluxQL to select all fields in a measurement, and then use PyArrow functions to extract metadata and aggregate data.

{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!---- BEGIN SQL EXAMPLE --->
{{% influxdb/custom-timestamps %}}
{{% code-placeholders "(BUCKET|API)_(NAME|TOKEN)" %}}
```py
# query-example.py

from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(
    host='{{< influxdb/host >}}',
    token='API_TOKEN',
    database='BUCKET_NAME'
)

# Execute the query and return an Arrow table
table = client.query(
    query="SELECT * FROM home",
    language="sql",
    timeout=10  # Override default timeout for simple queries (10 seconds)
)

print("\n#### View Schema information\n")
print(table.schema)
print(table.schema.names)
print(table.schema.types)
print(table.field('room').type)
print(table.schema.field('time').metadata)

print("\n#### View column types (timestamp, tag, and field) and data types\n")
print(table.schema.field('time').metadata[b'iox::column::type'])
print(table.schema.field('room').metadata[b'iox::column::type'])
print(table.schema.field('temp').metadata[b'iox::column::type'])

print("\n#### Use PyArrow to read the specified columns\n")
print(table.column('temp'))
print(table.select(['room', 'temp']))
print(table.select(['time', 'room', 'temp']))

print("\n#### Use PyArrow compute functions to aggregate data\n")
print(table.group_by('hum').aggregate([]))
print(table.group_by('room').aggregate([('temp', 'mean')]))
```
{{% /code-placeholders %}}
{{% /influxdb/custom-timestamps %}}
<!---- END SQL EXAMPLE ---->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!---- BEGIN INFLUXQL EXAMPLE ---->
{{% code-placeholders "(BUCKET|API)_(NAME|TOKEN)" %}}
```py
# query-example.py

from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(
    host='{{< influxdb/host >}}',
    token='DATABASE_TOKEN',
    database='DATABASE_NAME'
)

# Execute the query and return an Arrow table
table = client.query(
    query="SELECT * FROM home",
    language="influxql",
    timeout=10  # Override default timeout for simple queries (10 seconds)
)

print("\n#### View Schema information\n")
print(table.schema)
print(table.schema.names)
print(table.schema.types)
print(table.field('room').type)
print(table.schema.field('time').metadata)

print("\n#### View column types (timestamp, tag, and field) and data types\n")
print(table.schema.field('time').metadata[b'iox::column::type'])
print(table.schema.field('room').metadata[b'iox::column::type'])
print(table.schema.field('temp').metadata[b'iox::column::type'])

print("\n#### Use PyArrow to read the specified columns\n")
print(table.column('temp'))
print(table.select(['room', 'temp']))
print(table.select(['time', 'room', 'temp']))

print("\n#### Use PyArrow compute functions to aggregate data\n")
print(table.group_by('hum').aggregate([]))
print(table.group_by('room').aggregate([('temp', 'mean')]))
```
{{% /code-placeholders %}}
<!---- END INFLUXQL EXAMPLE ---->
{{% /code-tab-content %}}
{{% /code-tabs-wrapper %}}

Replace the following configuration values:

- **`database`**: the name of the [{{% product-name %}} bucket](/influxdb3/cloud-serverless/admin/buckets/) to query
- **`token`**:  an [API token](/influxdb3/cloud-serverless/admin/tokens/) with _read_ access to the specified bucket.
  _Store this in a secret store or environment variable to avoid exposing the raw token string._

Next, learn how to use Python tools to work with time series data:

- [Use PyArrow](/influxdb3/cloud-serverless/process-data/tools/pyarrow/)
- [Use pandas](/influxdb3/cloud-serverless/process-data/tools/pandas/)
