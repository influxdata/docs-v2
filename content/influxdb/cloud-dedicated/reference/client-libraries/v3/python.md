---
title: Python client library for InfluxDB v3
list_title: Python
description: The InfluxDB v3 `influxdb3-python` Python client library integrates with Python scripts and applications to write and query data stored in an InfluxDB Cloud Dedicated database.
menu:
  influxdb_cloud_dedicated:
    name: Python
    parent: v3 client libraries
    identifier: influxdb3-python
influxdb/cloud-dedicated/tags: [Flight API, python, gRPC, SQL, client libraries]
metadata: [influxdb3-python v0.5.0]
weight: 201
aliases:
  - /influxdb/cloud-dedicated/reference/client-libraries/v3/pyinflux3/
related:
  - /influxdb/cloud-dedicated/query-data/execute-queries/troubleshoot/
list_code_example: >
  
  ```python
  Example: Writing and querying data
  
  # The following example demonstrates how to write sensor data into influxDB 
  
  # and retrieve data from the last 90 days for analysis. 

  
  # Write sensor data in batches from a CSV file
    client.write_file(file='./data/home-sensor-data.csv', timestamp_column='time',
                      tag_columns=["room"])

  # Execute a query and retrieve data formatted as a PyArrow Table
    table = client.query(
      '''SELECT *
         FROM home
         WHERE time >= now() - INTERVAL '90 days'
         ORDER BY time''')
    
    # This script assumes the client object is correctly configured with your database name, token, and host URL. 
    # After the script runs, the table variable contains the data formatted as a PyArrow table.

    ```
    
---

The InfluxDB v3 [`influxdb3-python` Python client library](https://github.com/InfluxCommunity/influxdb3-python)
integrates {{% product-name %}} write and query operations with Python scripts and applications. 

InfluxDB client libraries provide configurable batch writing of data to {{% product-name %}}.
Client libraries can be used to construct line protocol data, transform data from other formats
to line protocol, and batch write line protocol data to InfluxDB HTTP APIs.

InfluxDB v3 client libraries can query {{% product-name %}} using SQL or InfluxQL.
The `influxdb3-python` Python client library wraps the Apache Arrow `pyarrow.flight` client
in a convenient InfluxDB v3 interface for executing SQL and InfluxQL queries, requesting
server metadata, and retrieving data from {{% product-name %}} using the Flight protocol with gRPC.

{{% note %}}
Code samples in this page use the [Get started home sensor sample data](/influxdb/cloud-dedicated/reference/sample-data/#get-started-home-sensor-data).
{{% /note %}}

- [Installation](#installation)
- [Importing the module](#importing-the-module)
- [API reference](#api-reference)
- [Classes](#classes)
- [Class InfluxDBClient3](#class-influxdbclient3)
  - [Parameters](#parameters)
  - [Writing modes](#writing-modes)
  - [InfluxDBClient3 instance methods](#influxdbclient3-instance-methods)
  - [InfluxDBClient3.write](#influxdbclient3write)
  - [InfluxDBClient3.write_file](#influxdbclient3write_file)
  - [InfluxDBClient3.query](#influxdbclient3query)
  - [InfluxDBClient3.close](#influxdbclient3close)
- [Class Point](#class-point)
- [Class WriteOptions](#class-writeoptions)
  - [Parameters](#parameters-4)
- [Functions](#functions)
  - [Function write_client_options(\*\*kwargs)](#function-write_client_optionskwargs)
  - [Function flight_client_options(\*\*kwargs)](#function-flight_client_optionskwargs)
- [Constants](#constants)
- [Exceptions](#exceptions)

## Installation

Install the client library and dependencies using `pip`:

```bash
pip install influxdb3-python
```

## Importing the module

The `influxdb3-python` client library package provides the `influxdb_client_3`
module.

Import the module:

```python
import influxdb_client_3
```

Import specific class methods from the module:

```python
from influxdb_client_3 import InfluxDBClient3, Point, WriteOptions
```

- [`influxdb_client_3.InfluxDBClient3`](#class-influxdbclient3): a class for interacting with InfluxDB
- [`influxdb_client_3.Point`](#class-point): a class for constructing a time series data
  point
- `influxdb_client_3.WriteOptions`: a class for configuring client
  write options

## API reference

The `influxdb_client_3` module includes the following classes and functions.

- [Classes](#classes)
- [Functions](#functions)
- [Constants](#constants)
- [Exceptions](#exceptions)

## Classes

- [Class InfluxDBClient3](#class-influxdbclient3)
  - [Parameters](#parameters)
  - [Writing modes](#writing-modes)
  - [InfluxDBClient3 instance methods](#influxdbclient3-instance-methods)
  - [InfluxDBClient3.write](#influxdbclient3write)
  - [InfluxDBClient3.write_file](#influxdbclient3write_file)
  - [InfluxDBClient3.query](#influxdbclient3query)
  - [InfluxDBClient3.close](#influxdbclient3close)
- [Class Point](#class-point)
- [Class WriteOptions](#class-writeoptions)
  - [Parameters](#parameters-4)

## Class InfluxDBClient3

Provides an interface for interacting with InfluxDB APIs for writing and querying data.

The `InfluxDBClient3` constructor initializes and returns a client instance with the following:

- A singleton _write client_ configured for writing to the database.
- A singleton _Flight client_ configured for querying the database.

### Parameters

- **`host`** (string): The host URL of the InfluxDB instance.
- **`database`** (string): The database to use for writing and querying.
- **`token`** (string): A database token with read/write permissions.
- _Optional_ **`write_client_options`** (dict): Options to use when writing to InfluxDB.
  If `None`, writes are [synchronous](#synchronous-writing).
- _Optional_ **`flight_client_options`** (dict): Options to use when querying InfluxDB.

### Writing modes

When writing data, the client uses one of the following modes:

- [Synchronous writing](#synchronous-writing)
- [Batch writing](#batch-writing)
- Asynchronous writing: Deprecated

#### Synchronous writing

Default. When no `write_client_options` are provided during the initialization of `InfluxDBClient3`, writes are synchronous.
When writing data in synchronous mode, the client immediately tries to write the provided data to InfluxDB, doesn't retry failed requests, and doesn't invoke response callbacks.

##### Example: initialize a client with synchronous (non-batch) defaults

The following example initializes a client for writing and querying data in an {{% product-name %}} database.
Given that `write_client_options` isn't specified, the client uses the default [synchronous writing](#synchronous-writing) mode.

{{% code-placeholders "DATABASE_(NAME|TOKEN)" %}}

<!-- Import for tests and hide from users.
```python
import os
```
<!--pytest-codeblocks:cont-->



```python
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(host=f"{{< influxdb/host >}}",
                        database=f"DATABASE_NAME",
                        token=f"DATABASE_TOKEN")
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of your {{% product-name %}} [database](/influxdb/cloud-dedicated/admin/databases/)
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  an {{% product-name %}} [database token](/influxdb/cloud-dedicated/admin/tokens/#database-tokens)
  with read/write permissions on the specified database

To explicitly specify synchronous mode, create a client with `write_options=SYNCHRONOUS`--for example:

{{% code-placeholders "DATABASE_(NAME|TOKEN)" %}}

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import InfluxDBClient3, write_client_options, SYNCHRONOUS

wco = write_client_options(write_options=SYNCHRONOUS)

client = InfluxDBClient3(host=f"{{< influxdb/host >}}",
                        database=f"DATABASE_NAME",
                        token=f"DATABASE_TOKEN",
                        write_client_options=wco,
                        flight_client_options=None)
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of your {{% product-name %}} [database](/influxdb/cloud-dedicated/admin/databases/)
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  an {{% product-name %}} [database token](/influxdb/cloud-dedicated/admin/tokens/#database-tokens)
  with write permissions on the specified database

#### Batch writing

Batch writing is particularly useful for efficient bulk data operations.
Options include setting batch size, flush intervals, retry intervals, and more.

Batch writing groups multiple writes into a single request to InfluxDB.
In batching mode, the client adds the record or records to a batch, and then schedules the batch for writing to InfluxDB.
The client writes the batch to InfluxDB after reaching `write_client_options.batch_size` or `write_client_options.flush_interval`.
If a write fails, the client reschedules the write according to the `write_client_options` retry options.

##### Configuring write client options

Use `WriteOptions` and `write_client_options` to configure batch writing and response handling for the client:

1. Instantiate `WriteOptions`. To use batch defaults, call the constructor without specifying parameters.
2. Call `write_client_options` and use the `write_options` parameter to specify the `WriteOptions` instance from the preceding step.
   Specify callback parameters (success, error, and retry) to invoke functions on success or error.
3. Instantiate `InfluxDBClient3` and use the `write_client_options` parameter to specify the `dict` output from the preceding step.

##### Example: initialize a client using batch defaults and callbacks

The following example shows how to use batch mode with defaults and
specify callback functions for the response status (success, error, or retryable error).

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import(InfluxDBClient3,
                              write_client_options,
                              WriteOptions,
                              InfluxDBError)

status = None

# Define callbacks for write responses
def success(self, data: str):
    status = "Success writing batch: data: {data}"
    assert status.startswith('Success'), f"Expected {status} to be success"

def error(self, data: str, err: InfluxDBError):
    status = f"Error writing batch: config: {self}, data: {data}, error: {err}"
    assert status.startswith('Success'), f"Expected {status} to be success"


def retry(self, data: str, err: InfluxDBError):
    status = f"Retry error writing batch: config: {self}, data: {data}, error: {err}"
    assert status.startswith('Success'), f"Expected {status} to be success"

# Instantiate WriteOptions for batching
write_options = WriteOptions()
wco = write_client_options(success_callback=success,
                            error_callback=error,
                            retry_callback=retry,
                            write_options=write_options)

# Use the with...as statement to ensure the file is properly closed and resources
# are released.
with InfluxDBClient3(host=f"{{< influxdb/host >}}",
                     database=f"DATABASE_NAME",
                     token=f"DATABASE_TOKEN",
                     write_client_options=wco) as client:

    client.write_file(file='./data/home-sensor-data.csv',
      timestamp_column='time', tag_columns=["room"], write_precision='s')
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of your {{% product-name %}} [database](/influxdb/cloud-dedicated/admin/databases/)
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  an {{% product-name %}} [database token](/influxdb/cloud-dedicated/admin/tokens/#database-tokens)
  with write permissions on the specified database

### InfluxDBClient3 instance methods

### InfluxDBClient3.write

Writes a record or a list of records to InfluxDB.

#### Parameters

- **`record`** (_record_ or list): A record or list of records to write. A record can be a `Point` object, a dict that represents a point, a line protocol string, or a `DataFrame`.
- **`database`** (string): The database to write to. Default is to write to the database specified for the client.
- **`**kwargs`\*\*: Additional write options--for example:
  - **`write_precision`** (string): _Optional_. Default is `"ns"`.
    Specifies the [precision](/influxdb/cloud-dedicated/reference/glossary/#precision) (`"ms"`, `"s"`, `"us"`, `"ns"`) for timestamps in `record`.
  - **`write_client_options`** (dict): _Optional_.
    Specifies callback functions and options for [batch writing](#batch-writing) mode.
    To generate the `dict`, use the [`write_client_options` function](#function-write_client_optionskwargs).

#### Example: write a line protocol string

{{% influxdb/custom-timestamps %}}
{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import InfluxDBClient3

point = "home,room=Living\\ Room temp=21.1,hum=35.9,co=0i 1641024000"

client = InfluxDBClient3(host=f"{{< influxdb/host >}}",
                         database=f"DATABASE_NAME",
                         token=f"DATABASE_TOKEN")

client.write(record=point, write_precision="s")
```

The following sample code executes an SQL query to retrieve the point:

<!--pytest-codeblocks:cont-->

```python
# Execute an SQL query
table = client.query(query='''SELECT room
                            FROM home
                            WHERE temp=21.1
                              AND time=from_unixtime(1641024000)''')
# table is a pyarrow.Table
room = table[0][0]
assert f"{room}" == 'Living Room', f"Expected {room} to be Living Room"
```

{{% /code-placeholders %}}
{{% /influxdb/custom-timestamps %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of your {{% product-name %}} [database](/influxdb/cloud-dedicated/admin/databases/)
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  an {{% product-name %}} [database token](/influxdb/cloud-dedicated/admin/tokens/#database-tokens)
  with write permissions on the specified database

#### Example: write data using points

The `influxdb_client_3.Point` class provides an interface for constructing a data
point for a measurement and setting fields, tags, and the timestamp for the point.
The following example shows how to create a `Point` object, and then write the
data to InfluxDB.

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import Point, InfluxDBClient3

point = Point("home").tag("room", "Kitchen").field("temp", 21.5).field("hum", .25)
client = InfluxDBClient3(host=f"{{< influxdb/host >}}",
                         database=f"DATABASE_NAME",
                         token=f"DATABASE_TOKEN")
client.write(point)
```

<!--pytest-codeblocks:cont-->

The following sample code executes an InfluxQL query to retrieve the written data:

```python
# Execute an InfluxQL query
table = client.query(query='''SELECT DISTINCT(temp) as val
                              FROM home
                              WHERE temp > 21.0
                              AND time >= now() - 10m''', language="influxql")
# table is a pyarrow.Table
df = table.to_pandas()
assert 21.5 in df['val'].values, f"Expected value in {df['val']}"
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of your {{% product-name %}} [database](/influxdb/cloud-dedicated/admin/databases/)
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  an {{% product-name %}} [database token](/influxdb/cloud-dedicated/admin/tokens/#database-tokens)
  with write permissions on the specified database

##### Example: write data using a dict

`InfluxDBClient3` can serialize a dictionary object into line protocol.
If you pass a `dict` to `InfluxDBClient3.write`, the client expects the `dict` to have the
following _point_ attributes:

- **measurement** (string): the measurement name
- **tags** (dict): a dictionary of tag key-value pairs
- **fields** (dict): a dictionary of field key-value pairs
- **time**: the [timestamp](/influxdb/cloud-dedicated/reference/glossary/#timestamp) for the record

The following example shows how to define a `dict` that represents a point, and then write the
data to InfluxDB.

{{% influxdb/custom-timestamps %}}
{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import InfluxDBClient3

# Using point dictionary structure
points = {
          "measurement": "home",
          "tags": {"room": "Kitchen", "sensor": "K001"},
          "fields": {"temp": 72.2, "hum": 36.9, "co": 4},
          "time": 1641067200
          }

client = InfluxDBClient3(host=f"{{< influxdb/host >}}",
                         database=f"DATABASE_NAME",
                         token=f"DATABASE_TOKEN")

client.write(record=points, write_precision="s")
```

{{% /code-placeholders %}}
{{% /influxdb/custom-timestamps %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of your {{% product-name %}} [database](/influxdb/cloud-dedicated/admin/databases/)
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  an {{% product-name %}} [database token](/influxdb/cloud-dedicated/admin/tokens/#database-tokens)
  with write permissions on the specified database

### InfluxDBClient3.write_file

Writes data from a file to InfluxDB.
Execution is synchronous.

#### Parameters

- **`file`** (string): A path to a file containing records to write to InfluxDB.
  The filename must end with one of the following supported extensions.
  For more information about encoding and formatting data, see the documentation for each supported format:

  - `.feather`: [Feather](https://arrow.apache.org/docs/python/feather.html)
  - `.parquet`: [Parquet](https://arrow.apache.org/docs/python/parquet.html)
  - `.csv`: [Comma-separated values](https://arrow.apache.org/docs/python/csv.html)
  - `.json`: [JSON](https://pandas.pydata.org/docs/reference/api/pandas.read_json.html)
  - `.orc`: [ORC](https://arrow.apache.org/docs/python/orc.html)

- **`measurement_name`** (string): Defines the measurement name for records in the file.
  The specified value takes precedence over `measurement` and `iox::measurement` columns in the file.
  If no value is specified for the parameter, and a `measurement` column exists in the file, the `measurement` column value is used for the measurement name.
  If no value is specified for the parameter, and no `measurement` column exists, the `iox::measurement` column value is used for the measurement name.
- **`tag_columns`** (list): Tag column names.
  Columns not included in the list and not specified by another parameter are assumed to be fields.
- **`timestamp_column`** (string): The name of the column that contains timestamps. Default is `'time'`.
- **`database`** (`str`): The database to write to. Default is to write to the database specified for the client.
- **`file_parser_options`** (callable): A function for providing additional arguments to the file parser.
- **`**kwargs`**: Additional options to pass to the `WriteAPI`--for example:
  - **`write_precision`** (string): _Optional_. Default is `"ns"`.
    Specifies the [precision](/influxdb/cloud-dedicated/reference/glossary/#precision) (`"ms"`, `"s"`, `"us"`, `"ns"`) for timestamps in `record`.
  - **`write_client_options`** (dict): _Optional_.
    Specifies callback functions and options for [batch writing](#batch-writing) mode.
    To generate the `dict`, use the [`write_client_options` function](#function-write_client_optionskwargs).

#### Example: use batch options when writing file data

The following example shows how to specify customized write options for batching, retries, and response callbacks,
and how to write data from CSV and JSON files to InfluxDB:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import(InfluxDBClient3, write_client_options,
                              WritePrecision, WriteOptions, InfluxDBError)

# Define the result object
result = {
    'config': None,
    'status': None,
    'data': None,
    'error': None
}

# Define callbacks for write responses
def success_callback(self, data: str):
    result['config'] = self
    result['status'] = 'success'
    result['data'] = data

    assert result['data'] != None, f"Expected {result['data']}"
    print("Successfully wrote data: {result['data']}")

def error_callback(self, data: str, exception: InfluxDBError):
    result['config'] = self
    result['status'] = 'error'
    result['data'] = data
    result['error'] = exception

    assert result['status'] == "success", f"Expected {result['error']} to be success for {result['config']}"

def retry_callback(self, data: str, exception: InfluxDBError):
    result['config'] = self
    result['status'] = 'retry_error'
    result['data'] = data
    result['error'] = exception

    assert result['status'] == "success", f"Expected {result['status']} to be success for {result['config']}"

write_options = WriteOptions(batch_size=500,
                            flush_interval=10_000,
                            jitter_interval=2_000,
                            retry_interval=5_000,
                            max_retries=5,
                            max_retry_delay=30_000,
                            exponential_base=2)


wco = write_client_options(success_callback=success_callback,
                          error_callback=error_callback,
                          retry_callback=retry_callback,
                          write_options=write_options)

with InfluxDBClient3(host=f"{{< influxdb/host >}}",
                         database=f"DATABASE_NAME",
                         token=f"DATABASE_TOKEN",
                      write_client_options=wco) as client:

  client.write_file(file='./data/home-sensor-data.csv', timestamp_column='time',
                    tag_columns=["room"], write_precision='s')

  client.write_file(file='./data/home-sensor-data.json', timestamp_column='time',
                    tag_columns=["room"], write_precision='s')
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of your {{% product-name %}} [database](/influxdb/cloud-dedicated/admin/databases/)
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  an {{% product-name %}} [database token](/influxdb/cloud-dedicated/admin/tokens/#database-tokens)
  with write permissions on the specified database

### InfluxDBClient3.query

Sends a Flight request to execute the specified SQL or InfluxQL query.
Returns all data in the query result as an Arrow table ([`pyarrow.Table`](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html) instance).

#### Parameters

- **`query`** (string): the SQL or InfluxQL to execute.
- **`language`** (string): the query language used in the `query` parameter--`"sql"` or `"influxql"`. Default is `"sql"`.
- **`mode`** (string): Specifies the output to return from the [`pyarrow.flight.FlightStreamReader`](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightStreamReader.html#pyarrow.flight.FlightStreamReader).
  Default is `"all"`.
  - `all`: Read the entire contents of the stream and return it as a [`pyarrow.Table`](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html).
  - `chunk`: Read the next message (a `FlightStreamChunk`) and return `data` and `app_metadata`.
    Returns `null` if there are no more messages.
  - `pandas`: Read the contents of the stream and return it as a [`pandas.DataFrame`](https://pandas.pydata.org/pandas-docs/stable/reference/frame.html).
  - `reader`: Convert the `FlightStreamReader` into a [`pyarrow.RecordBatchReader`](https://arrow.apache.org/docs/python/generated/pyarrow.RecordBatchReader.html#pyarrow-recordbatchreader).
  - `schema`: Return the schema for all record batches in the stream.
- **`**kwargs`**: [`FlightCallOptions`](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightCallOptions.html#pyarrow.flight.FlightCallOptions)

#### Example: query using SQL

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(host=f"{{< influxdb/host >}}",
                         database=f"DATABASE_NAME",
                         token=f"DATABASE_TOKEN")

table = client.query("SELECT * from home WHERE time >= now() - INTERVAL '90 days'")

# Filter columns.
print(table.select(['room', 'temp']))

# Use PyArrow to aggregate data.
print(table.group_by('hum').aggregate([]))
```

{{% /code-placeholders %}}

In the examples, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of your {{% product-name %}} [database](/influxdb/cloud-dedicated/admin/databases/)
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  an {{% product-name %}} [database token](/influxdb/cloud-dedicated/admin/tokens/#database-tokens)
  with read permission on the specified database

#### Example: query using InfluxQL

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(host=f"{{< influxdb/host >}}",
                         database=f"DATABASE_NAME",
                         token=f"DATABASE_TOKEN")
query = "SELECT * from home WHERE time >= -90d"
table = client.query(query=query, language="influxql")

# Filter columns.
print(table.select(['room', 'temp']))
```

{{% /code-placeholders %}}

##### Example: read all data from the stream and return a pandas DataFrame

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(host=f"{{< influxdb/host >}}",
                         database=f"DATABASE_NAME",
                         token=f"DATABASE_TOKEN")
query = "SELECT * from home WHERE time >= now() - INTERVAL '90 days'"
pd = client.query(query=query, mode="pandas")
# Print the pandas DataFrame formatted as a Markdown table.
print(pd.to_markdown())
```

{{% /code-placeholders %}}

##### Example: view the schema for all batches in the stream

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(host=f"{{< influxdb/host >}}",
                         database=f"DATABASE_NAME",
                         token=f"DATABASE_TOKEN")
table = client.query("""SELECT *
                        from home
                        WHERE time >= now() - INTERVAL '90 days'""")

# View the table schema.
print(table.schema)
```

{{% /code-placeholders %}}

##### Example: retrieve the result schema and no data

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(host=f"{{< influxdb/host >}}",
                         database=f"DATABASE_NAME",
                         token=f"DATABASE_TOKEN")
query = "SELECT * from home WHERE time >= now() - INTERVAL '90 days'"
schema = client.query(query=query, mode="schema")
print(schema)
```

{{% /code-placeholders %}}

##### Specify a timeout

Pass `timeout=<number of seconds>` for [`FlightCallOptions`](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightCallOptions.html#pyarrow.flight.FlightCallOptions) to use a custom timeout.

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(host=f"{{< influxdb/host >}}",
                         database=f"DATABASE_NAME",
                         token=f"DATABASE_TOKEN")
query = "SELECT * from home WHERE time >= now() - INTERVAL '90 days'"
client.query(query=query, timeout=5)
```

{{% /code-placeholders %}}

### InfluxDBClient3.close

Sends all remaining records from the batch to InfluxDB,
and then closes the underlying write client and Flight client to release resources.

#### Example: close a client

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(host=f"{{< influxdb/host >}}",
                         database=f"DATABASE_NAME",
                         token=f"DATABASE_TOKEN")
client.close()
```

{{% /code-placeholders %}}

## Class Point

Provides an interface for constructing a time series data
point for a measurement, and setting fields, tags, and timestamp.

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import Point
point = Point("home").tag("room", "Living Room").field("temp", 72)
```

See how to [write data using points](#example-write-data-using-points).

## Class WriteOptions

Provides an interface for constructing options that customize batch writing behavior, such as batch size and retry.

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import WriteOptions

write_options = WriteOptions(batch_size=500,
                             flush_interval=10_000,
                             jitter_interval=2_000,
                             retry_interval=5_000,
                             max_retries=5,
                             max_retry_delay=30_000,
                             exponential_base=2)
```

See how to [use batch options for writing data](#example-use-batch-options-when-writing-file-data).

### Parameters

- **`batch_size`**: Default is `1000`.
- **`flush_interval`**: Default is `1000`.
- **`jitter_interval`**: Default is `0`.
- **`retry_interval`**: Default is `5000`.
- **`max_retries`**: Default is `5`.
- **`max_retry_delay`**: Default is `125000`.
- **`max_retry_time`**: Default is `180000`.
- **`exponential_base`**: Default is `2`.
- **`max_close_wait`**: Default is `300000`.
- **`write_scheduler`**: Default is `ThreadPoolScheduler(max_workers=1)`.

## Functions

- [influxdb_client_3.write_client_options](#function-write_client_optionskwargs)
- [influxdb_client_3.flight_client_options](#function-flight_client_optionskwargs)

### Function write_client_options(\*\*kwargs)

Returns a `dict` with the specified write client options.

#### Parameters

The function takes the following keyword arguments:

- **`write_options`** ([`WriteOptions`](#class-writeoptions)): Specifies whether the client writes data using synchronous mode or batching mode. If using batching mode, the client uses the specified batching options.
- **`point_settings`** (dict): Default tags that the client will add to each point when writing the data to InfluxDB.
- **`success_callback`** (callable): If using batching mode, a function to call after data is written successfully to InfluxDB (HTTP status `204`)
- **`error_callback`** (callable): if using batching mode, a function to call if data is not written successfully (the response has a non-`204` HTTP status)
- **`retry_callback`** (callable): if using batching mode, a function to call if the request is a retry (using batching mode) and data is not written successfully

#### Example: instantiate options for batch writing

```python
from influxdb_client_3 import write_client_options, WriteOptions
from influxdb_client_3.write_client.client.write_api import WriteType

def success():
  print("Success")
def error():
  print("Error")
def retry():
  print("Retry error")

write_options = WriteOptions()
wco = write_client_options(success_callback=success,
                            error_callback=error,
                            retry_callback=retry,
                            write_options=write_options)

assert wco['success_callback']
assert wco['error_callback']
assert wco['retry_callback']
assert wco['write_options'].write_type == WriteType.batching
```

#### Example: instantiate options for synchronous writing

```python
from influxdb_client_3 import write_client_options, SYNCHRONOUS
from influxdb_client_3.write_client.client.write_api import WriteType

wco = write_client_options(write_options=SYNCHRONOUS)

assert wco['write_options'].write_type == WriteType.synchronous
```

### Function flight_client_options(\*\*kwargs)

Returns a `dict` with the specified [FlightClient](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightClient.html) parameters.

#### Parameters

- `kwargs`: keyword arguments for [`pyarrow.flight.FlightClient`](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightClient.html) parameters

#### Example: specify the root certificate path

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import InfluxDBClient3, flight_client_options
import certifi

fh = open(certifi.where(), "r")
cert = fh.read()
fh.close()

client = InfluxDBClient3(host=f"{{< influxdb/host >}}",
                         database=f"DATABASE_NAME",
                         token=f"DATABASE_TOKEN",
    fco=flight_client_options(tls_root_certs=cert))
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of your {{% product-name %}} [database](/influxdb/cloud-dedicated/admin/databases/)
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  an {{% product-name %}} [database token](/influxdb/cloud-dedicated/admin/tokens/#database-tokens)
  with read permission on the specified database

## Constants

- `influxdb_client_3.SYNCHRONOUS`: Represents synchronous write mode
- `influxdb_client_3.WritePrecision`: Enum class that represents write precision

## Exceptions

- `influxdb_client_3.InfluxDBError`: Exception class raised for InfluxDB-related errors
