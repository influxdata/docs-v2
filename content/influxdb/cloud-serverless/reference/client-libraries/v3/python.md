---
title: Python client library for InfluxDB v3
list_title: Python
description: The InfluxDB v3 `influxdb3-python` Python client library integrates with Python scripts and applications to write and query data stored in an InfluxDB Cloud Serverless bucket.
menu:
  influxdb_cloud_serverless:
    name: Python
    parent: v3 client libraries
    identifier: influxdb3-python
weight: 201
influxdb/cloud-serverless/tags: [python, gRPC, SQL, client libraries]
aliases:
  - /influxdb/cloud-serverless/reference/client-libraries/v3/pyinflux3/
related:
  - /influxdb/cloud-serverless/query-data/execute-queries/troubleshoot/
list_code_example: >
  ```py
  from influxdb_client_3 import InfluxDBClient3

  # Instantiate an InfluxDB client configured for a bucket

  client = InfluxDBClient3(
    "https://{{< influxdb/host >}}",
    database="BUCKET_NAME",
    token="API_TOKEN")

  # Execute the query and retrieve data formatted as a PyArrow Table

  table = client.query(
    '''SELECT *
      FROM home
      WHERE time >= now() - INTERVAL '90 days'
      ORDER BY time'''
  )

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

<!-- TOC -->

- [Installation](#installation)
- [Importing the module](#importing-the-module)
- [API reference](#api-reference)
- [Classes](#classes)
- [Class InfluxDBClient3](#class-influxdbclient3)
- [Class Point](#class-point)
- [Class WriteOptions](#class-writeoptions)
- [Functions](#functions)
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

```py
import influxdb_client_3
```

Import specific class methods from the module:

```py
from influxdb_client_3 import InfluxDBClient3, Point, WriteOptions
```

- [`influxdb_client_3.InfluxDBClient3`](#class-influxdbclient3): a class for interacting with InfluxDB
- [`influxdb_client_3.Point`](#class-point):a class for constructing a time series data
point
- `influxdb_client_3.WriteOptions`: a class for configuring client
write options.

## API reference

The `influxdb_client_3` module includes the following classes and functions.

<!-- TOC -->

- [Classes](#classes)
- [Functions](#functions)
- [Constants](#constants)
- [Exceptions](#exceptions)

## Classes

- [Class InfluxDBClient3](#class-influxdbclient3)
  - [InfluxDBClient3.write](#influxdbclient3write)
  - [InfluxDBClient3.write_file](#influxdbclient3write_file)
  - [InfluxDBClient3.query](#influxdbclient3query)
  - [InfluxDBClient3.close](#influxdbclient3close)
- [Class Point](#class-point)
- [Class WriteOptions](#class-writeoptions)

## Class InfluxDBClient3

Provides an interface for interacting with InfluxDB APIs for writing and querying data.

### Syntax

```py
__init__(self, host=None, org=None, database=None, token=None,
        write_client_options=None, flight_client_options=None, **kwargs)
```

Initializes and returns an `InfluxDBClient3` instance with the following:

- A singleton _write client_ configured for writing to the database (bucket).
- A singleton _Flight client_ configured for querying the database (bucket).

### Parameters

- **org** (str): The organization name (for {{% product-name %}}, set this to an empty string (`""`)).
- **database** (str): The database (bucket) to use for writing and querying.
- **write_client_options** (dict): Options to use when writing to InfluxDB.
  If `None`, writes are [synchronous](#synchronous-writing).
- **flight_client_options** (dict): Options to use when querying InfluxDB.

#### Non-batch writing

When writing data in non-batching mode, the client immediately tries to write the data, doesn't retry failed requests, and doesn't invoke response callbacks.

#### Batch writing

In batching mode, the client adds the record or records to a batch, and then schedules the batch for writing to InfluxDB.
The client writes the batch to InfluxDB after reaching `write_client_options.batch_size` or `write_client_options.flush_interval`.
If a write fails, the client reschedules the write according to the `write_client_options` retry options.
When using batching mode, you can define `success_callback`, `error_callback`, and `retry_callback` functions.

To use batching mode, pass `WriteOptions` as key-value pairs to the client `write_client_options` parameter--for example:

1.  Instantiate `WriteOptions()` with defaults or with
`WriteOptions.write_type=WriteType.batching`.

    ```py
      # Create a WriteOptions instance for batch writes with batch size, flush, and retry defaults.
      write_options = WriteOptions()
    ```

2.  Pass `write_options` from the preceding step to the `write_client_options` function.

    ```py
    wco = write_client_options(WriteOptions=write_options)
    ```

    The output is a dict with `WriteOptions`  key-value pairs.

3.  Initialize the client, setting the `write_client_options` argument to `wco` from the preceding step.

    {{< tabs-wrapper >}}
{{% code-placeholders "(BUCKET|API)_(NAME|TOKEN)" %}}
```py
from influxdb_client_3 import Point, InfluxDBClient3

points = [
    Point("home")
            .tag("room", "Kitchen")
            .field("temp", 25.3)
            .field('hum', 20.2)
            .field('co', 9),
    Point("home")
            .tag("room", "Living Room")
            .field("temp", 24.0)
            .field('hum', 20.0)
            .field('co', 5)]

with InfluxDBClient3(token="API_TOKEN",
                     host="{{< influxdb/host >}}",
                     org="", database="BUCKET_NAME",
                     write_client_options=wco) as client:

    client.write(record=points)
```
{{% /code-placeholders %}}
    {{< /tabs-wrapper >}}

#### Synchronous writing

Synchronous mode is the default mode for writing data (in batch and non-batch modes).
To specify synchronous mode, set `_write_client_options=None` or `_write_client_options.write_type=WriteType.synchronous`.

### Examples

#### Initialize a client

The following example initializes a client for writing and querying data in a {{% product-name %}} database (bucket).
When writing or querying, the client waits synchronously for the response.

{{% code-placeholders "BUCKET_(NAME|TOKEN)|API_TOKEN" %}}
```py
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(token="API_TOKEN",
                         host="{{< influxdb/host >}}",
                         database="BUCKET_NAME")
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}}: the name of your {{% product-name %}} [bucket](/influxdb/cloud-serverless/admin/buckets/)
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: an {{% product-name %}} [API token](/influxdb/cloud-serverless/admin/tokens/) with read permissions on the specified bucket

##### Initialize a client for batch writing

The following example shows how to initialize a client for batch writing data to the bucket.
When writing data, the client uses batch mode with default options and
invokes the callback function, if specified, for the response status (success, error, or retryable error).

{{% code-placeholders "BUCKET_NAME|API_TOKEN" %}}
```py
  from influxdb_client_3 import InfluxDBClient3,
                                write_client_options,
                                WriteOptions,
                                InfluxDBError

  # Define callbacks for write responses
  def success(self, data: str):
      print(f"Successfully wrote batch: data: {data}")

  def error(self, data: str, exception: InfluxDBError):
      print(f"Failed writing batch: config: {self}, data: {data},
      error: {exception}")

  def retry(self, data: str, exception: InfluxDBError):
      print(f"Failed retry writing batch: config: {self}, data: {data},
      error: {exception}")

  # Instantiate WriteOptions for batching
  write_options = WriteOptions()
  wco = write_client_options(success_callback=success,
                              error_callback=error,
                              retry_callback=retry,
                              WriteOptions=write_options)

  # Use the with...as statement to ensure the file is properly closed and resources
  # are released.
  with InfluxDBClient3(token="API_TOKEN", host="{{< influxdb/host >}}",
                      org="", database="BUCKET_NAME",
                      write_client_options=wco) as client:

      client.write_file(file='./home.csv',
        timestamp_column='time', tag_columns=["room"])
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}}: the name of your {{% product-name %}} [bucket](/influxdb/cloud-serverless/admin/buckets/)
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: an {{% product-name %}} [API token](/influxdb/cloud-serverless/admin/tokens/) with read permissions on the specified bucket

### InfluxDBClient3 instance methods

### InfluxDBClient3.write

Writes a record or a list of records to InfluxDB.

#### Syntax

```py
write(self, record=None, **kwargs)
```

#### Parameters

- **`record`**: A record or list of records to write. A record can be a `Point` object, a dict that represents a point, a line protocol string, or a `DataFrame`.
- **`database`**: The database (bucket) to write to. Default is to write to the database specified for the client.
- **`**kwargs`**: Additional write options--for example:
  - **`write_precision`**: _Optional_. Default is `"ns"`.
  Specifies the [precision](/influxdb/cloud-serverless/reference/glossary/#precision) (`"ms"`, `"s"`, `"us"`, `"ns"`) for timestamps in `record`.
  - **`write_client_options`**: _Optional_.
  Specifies callback functions and options for [batch writing](#batch-writing) mode.

#### Examples

##### Write a line protocol string

{{% influxdb/custom-timestamps %}}
{{% code-placeholders "BUCKET_NAME|API_TOKEN" %}}
```py
from influxdb_client_3 import InfluxDBClient3

points = "home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000"

client = InfluxDBClient3(token="API_TOKEN", host="{{< influxdb/host >}}",
                        database="BUCKET_NAME")

client.write(record=points, write_precision="s")
```
{{% /code-placeholders %}}
{{% /influxdb/custom-timestamps %}}

##### Write data using points

The `influxdb_client_3.Point` class provides an interface for constructing a data
point for a measurement and setting fields, tags, and the timestamp for the point.
The following example shows how to create a `Point` object, and then write the
data to InfluxDB.

```py
from influxdb_client_3 import Point, InfluxDBClient3
point = Point("home").tag("room", "Kitchen").field("temp", 72)
...
client.write(point)
```

###### Write data using a dict

`InfluxDBClient3` can serialize a dictionary object into line protocol.
If you pass a `dict` to `InfluxDBClient3.write`, the client expects the `dict` to have the
following _point_ attributes:

- **measurement** (str): the measurement name
- **tags** (dict): a dictionary of tag key-value pairs
- **fields** (dict): a dictionary of field key-value pairs
- **time**: the [timestamp](/influxdb/cloud-serverless/reference/glossary/#timestamp) for the record

The following example shows how to define a `dict` that represents a point, and then write the
data to InfluxDB.

{{% influxdb/custom-timestamps %}}
{{% code-placeholders "BUCKET_NAME|API_TOKEN" %}}
```py
from influxdb_client_3 import InfluxDBClient3
# Using point dictionary structure
points = {
          "measurement": "home",
          "tags": {"room": "Kitchen", "sensor": "K001"},
          "fields": {"temp": 72.2, "hum": 36.9, "co": 4},
          "time": 1641067200
          }

client = InfluxDBClient3(token="API_TOKEN",
                        host="{{< influxdb/host >}}",
                        database="BUCKET_NAME",
                        org="")

client.write(record=points, write_precision="s")
```
{{% /code-placeholders %}}
{{% /influxdb/custom-timestamps %}}

### InfluxDBClient3.write_file

Writes data from a file to InfluxDB.
Execution is synchronous.

#### Syntax

```py
write_file(self, file, measurement_name=None, tag_columns=[],
          timestamp_column='time', **kwargs)
```
#### Parameters

-   **`file`** (str): A path to a file containing records to write to InfluxDB.
    The filename must end with one of the following supported extensions.
    For more information about encoding and formatting data, see the documentation for each supported format:
  
    - `.feather`: [Feather](https://arrow.apache.org/docs/python/feather.html)
    - `.parquet`: [Parquet](https://arrow.apache.org/docs/python/parquet.html)
    - `.csv`: [Comma-separated values](https://arrow.apache.org/docs/python/csv.html)
    - `.json`: [JSON](https://pandas.pydata.org/docs/reference/api/pandas.read_json.html)
    - `.orc`: [ORC](https://arrow.apache.org/docs/python/orc.html)

- **`measurement_name`**: Defines the measurement name for records in the file.
  The specified value takes precedence over `measurement` and `iox::measurement` columns in the file.
  If no value is specified for the parameter, and a `measurement` column exists in the file, the `measurement` column value is used for the measurement name.
  If no value is specified for the parameter, and no `measurement` column exists, the `iox::measurement` column value is used for the measurement name.
- **`tag_columns`**: A list containing the names of tag columns.
  Columns not included in the list and not specified by another parameter are assumed to be fields.
- **`timestamp_column`**: The name of the column that contains timestamps. Default is `'time'`.
- **`database`**: The database (bucket) to write to. Default is to write to the database (bucket) specified for the client.
- **`**kwargs`**: Additional write options--for example:
  - **`write_precision`**: _Optional_. Default is `"ns"`.
  Specifies the [precision](/influxdb/cloud-serverless/reference/glossary/#precision) (`"ms"`, `"s"`, `"us"`, `"ns"`) for timestamps in `record`.
  - **`write_client_options`**: _Optional_.
  Specifies callback functions and options for [batch writing](#batch-writing) mode.

#### Examples

##### Write data from a file

The following example shows how to configure write options for batching, retries, and callbacks,
and how to write data from CSV and JSON files to InfluxDB:

{{% code-placeholders "BUCKET_NAME|API_TOKEN" %}}
```py
from influxdb_client_3 import InfluxDBClient3, write_client_options,
                              WritePrecision, WriteOptions, InfluxDBError

class BatchingCallback(object):

  # Define callbacks for write responses
  def success(self, data: str):
      print(f"Successfully wrote batch: data: {data}")

  def error(self, data: str, exception: InfluxDBError):
      print(f"Failed writing batch: config: {self}, data: {data},
      error: {exception}")

  def retry(self, data: str, exception: InfluxDBError):
      print(f"Failed retry writing batch: config: {self}, data: {data},
      error: {exception}")

# Instantiate the callbacks
callback = BatchingCallback()

write_options = WriteOptions(batch_size=500,
                            flush_interval=10_000,
                            jitter_interval=2_000,
                            retry_interval=5_000,
                            max_retries=5,
                            max_retry_delay=30_000,
                            exponential_base=2)

wco = write_client_options(success_callback=callback.success,
                          error_callback=callback.error,
                          retry_callback=callback.retry,
                          WriteOptions=write_options)

with  InfluxDBClient3(token="API_TOKEN", host="{{< influxdb/host >}}",
                      database="BUCKET_NAME",
                      write_client_options=wco) as client:

  client.write_file(file='./home.csv', timestamp_column='time',
                    tag_columns=["room"])
  
  client.write_file(file='./home.json', timestamp_column='time',
                    tag_columns=["room"], date_unit='ns')
```
{{% /code-placeholders %}}

### InfluxDBClient3.query

Sends a Flight request to execute the specified SQL or InfluxQL query.
Returns all data in the query result as an Arrow table.

#### Syntax

```py
query(self, query, language="sql", mode="all", **kwargs )
```

#### Parameters

- **`query`** (str): the SQL or InfluxQL to execute.
- **`language`** (str): the query language used in the `query` parameter--`"sql"` or `"influxql"`. Default is `"sql"`.
- **`mode`** (str): Specifies the output to return from the [`pyarrow.flight.FlightStreamReader`](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightStreamReader.html#pyarrow.flight.FlightStreamReader).
                    Default is `"all"`.
    - `all`: Read the entire contents of the stream and return it as a `pyarrow.Table`.
    - `chunk`: Read the next message (a `FlightStreamChunk`) and return `data` and `app_metadata`.
      Returns `null` if there are no more messages.
    - `pandas`: Read the contents of the stream and return it as a `pandas.DataFrame`.
    - `reader`: Convert the `FlightStreamReader` into a [`pyarrow.RecordBatchReader`](https://arrow.apache.org/docs/python/generated/pyarrow.RecordBatchReader.html#pyarrow-recordbatchreader).
    - `schema`: Return the schema for all record batches in the stream.

#### Examples

##### Query using SQL

```py
table = client.query("SELECT * FROM measurement WHERE time >= now() - INTERVAL '90 days'")
# Filter columns.
print(table.select(['room', 'temp']))
# Use PyArrow to aggregate data.
print(table.group_by('hum').aggregate([]))
```

##### Query using InfluxQL

```py
query = "SELECT * FROM measurement WHERE time >= -90d"
table = client.query(query=query, language="influxql")
# Filter columns.
print(table.select(['room', 'temp']))
```

##### Read all data from the stream and return a pandas DataFrame

```py
query = "SELECT * FROM measurement WHERE time >= now() - INTERVAL '90 days'"
pd = client.query(query=query, mode="pandas")
# Print the pandas DataFrame formatted as a Markdown table.
print(pd.to_markdown())
```

##### View the schema for all batches in the stream

```py
table = client.query('''
  SELECT *
  FROM measurement
  WHERE time >= now() - INTERVAL '90 days''''
)
# Get the schema attribute value.
print(table.schema)
```

##### Retrieve the result schema and no data

```py
query = "SELECT * FROM measurement WHERE time >= now() - INTERVAL '90 days'"
schema = client.query(query=query, mode="schema")
print(schema)
```

### InfluxDBClient3.close

Sends all remaining records from the batch to InfluxDB,
and then closes the underlying write client and Flight client to release resources.

#### Syntax

```py
close(self)
```

#### Examples

```py
client.close()
```

## Class Point

```py
influxdb_client_3.Point
```

Provides an interface for constructing a time series data
point for a measurement, and setting fields, tags, and timestamp.

The following example shows how to create a `Point`, and then write the
data to InfluxDB.

```py
point = Point("home").tag("room", "Living Room").field("temp", 72)
client.write(point)
```

## Class WriteOptions

```py
influxdb_client_3.WriteOptions
```

Options for configuring client behavior (batch size, retry, callbacks, etc.) when writing data to InfluxDB.

For client configuration examples, see [Initialize a client](#initialize-a-client).

### Syntax

```py
__init__(self, write_type: WriteType = WriteType.batching,
                 batch_size=1_000, flush_interval=1_000,
                 jitter_interval=0,
                 retry_interval=5_000,
                 max_retries=5,
                 max_retry_delay=125_000,
                 max_retry_time=180_000,
                 exponential_base=2,
                 max_close_wait=300_000,
                 write_scheduler=ThreadPoolScheduler(max_workers=1)) -> None:

```

## Functions

- [influxdb_client_3.write_client_options](#function-write_client_optionskwargs)
- [influxdb_client_3.flight_client_options](#function-flight_client_optionskwargs)

### Function write_client_options(**kwargs)

```py
influxdb_client_3.write_client_options(kwargs)
```

- Takes the following parameters:

  - `kwargs`: keyword arguments for `WriteApi`

- Returns a dictionary of write client options.

### Function flight_client_options(**kwargs)

```py
influxdb_client_3.flight_client_options(kwargs)
```

- Takes the following parameters:

  - `kwargs`: keyword arguments for `FlightClient`

- Returns a dictionary of Flight client options.

#### Examples

##### Specify the root certificate path

```py
from influxdb_client_3 import InfluxDBClient3, flight_client_options
import certifi

fh = open(certifi.where(), "r")
cert = fh.read()
fh.close()

client = InfluxDBClient3(
    token="API_TOKEN",
    host="{{< influxdb/host >}}",
    database="BUCKET_NAME",
    flight_client_options=flight_client_options(
        tls_root_certs=cert))
```

## Constants

- `influxdb_client_3.SYNCHRONOUS`: Represents synchronous write mode
- `influxdb_client_3.WritePrecision`: Enum class that represents write precision

## Exceptions

- `influxdb_client_3.InfluxDBError`: Exception class raised for InfluxDB-related errors
