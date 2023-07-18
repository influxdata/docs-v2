---
title: Python client library for InfluxDB v3
list_title: Python
description: The InfluxDB v3 `influxdb3-python` Python client library integrates with Python scripts and applications to write and query data stored in an InfluxDB Cloud Dedicated database.
external_url: https://github.com/InfluxCommunity/influxdb3-python
menu:
  influxdb_cloud_dedicated:
    name: Python
    parent: v3 client libraries
    identifier: influxdb3-python
influxdb/cloud-dedicated/tags: [python, gRPC, SQL, Flight SQL, client libraries]
weight: 201
aliases:
  - /influxdb/cloud-dedicated/reference/client-libraries/v3/pyinflux3/
---

The InfluxDB v3 [`influxdb3-python` Python client library](https://github.com/InfluxCommunity/influxdb3-python)
integrates {{% cloud-name %}} write and query operations with Python scripts and applications.

InfluxDB client libraries provide configurable batch writing of data to {{% cloud-name %}}.
Client libraries can be used to construct line protocol data, transform data from other formats
to line protocol, and batch write line protocol data to InfluxDB HTTP APIs.

InfluxDB v3 client libraries can query {{% cloud-name %}} using SQL or InfluxQL.
The `influxdb3-python` Python client library wraps the Apache Arrow `pyarrow.flight` client 
in a convenient InfluxDB v3 interface for executing SQL and InfluxQL queries, requesting
server metadata, and retrieving data from {{% cloud-name %}} using the Flight protocol with gRPC.

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

- [`influxdb_client_3.InfluxDBClient3` class](#class-influxdbclient3): an interface for [initializing
a client](#initialization) and interacting with InfluxDB
- `influxdb_client_3.Point` class: an interface for constructing a time series data
point
- `influxdb_client_3.WriteOptions` class: an interface for configuring
write options `influxdb_client_3.InfluxDBClient3` for the client.

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
        _write_client_options=None, _flight_client_options=None, **kwargs)
```

Initializes and returns an `InfluxDBClient3` instance with the following:

- A singleton _write client_ configured for writing to the database.
- A singleton _Flight client_ configured for querying the database.

### Attributes

- **org** (str): The organization name (for {{% cloud-name %}}, set this to an empty string (`""`)).
- **database** (str): The database to use for writing and querying.
- **_write_client_options** (dict): Options to use when writing to InfluxDB.
  If `None`, writes are [synchronous](#synchronous-writing).
- **_flight_client_options** (dict): Options to use when querying InfluxDB.

#### Batch writing

In batching mode, the client adds the record or records to a batch, and then schedules the batch for writing to InfluxDB.
The client writes the batch to InfluxDB after reaching `_write_client_options.batch_size` or `_write_client_options.flush_interval`.
If a write fails, the client reschedules the write according to the `_write_client_options` retry options.

To use batching mode, pass an instance of `WriteOptions` for the `InfluxDBClient3._write_client_options` argument--for example:

1.  Instantiate `WriteOptions()` with defaults or with
`WriteOptions.write_type=WriteType.batching`.

    ```py
      # Batching with all batch size, flush, and retry defaults
      write_options = WriteOptions()
    ```

2.  Call the a `write_client_options` function to create an options object that uses `write_options` from the preceding step.

    ```py
    wco = write_client_options(WriteOptions=write_options)
    ```

3. Initialize the client, setting the `_write_client_options` argument to the `wco` object from the preceding step.

    {{< tabs-wrapper >}}
{{% code-placeholders "DATABASE_(NAME|TOKEN)" %}}
```py
with InfluxDBClient3(token="DATABASE_TOKEN", host="cluster-id.influxdb.io",
                    org="", database="DATABASE_NAME",
                    _write_client_options=wco) as client:

    client.write(record=points)
```
{{% /code-placeholders %}}
    {{< /tabs-wrapper >}}
#### Synchronous writing

In synchronous mode, the client sends write requests immediately (not batched)
and doesn't retry failed writes.

To use synchronous mode, set `_write_client_options=None` or `_write_client_options.write_type=WriteType.synchronous`.

### Examples

##### Initialize a client

The following example initializes a client for writing and querying the database.
Given `_write_client_options=None`, the client will use synchronous mode when writing data.

{{% code-placeholders "DATABASE_(NAME|TOKEN)" %}}
```py
client = InfluxDBClient3(token="DATABASE_TOKEN",
                         host="cluster-id.influxdb.io",
                         org="",
                         database="DATABASE_NAME")
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: an {{% cloud-name %}} [database token](/influxdb/cloud-dedicated/admin/tokens/) with read permissions on the databases you want to query
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of your {{% cloud-name %}} [database](/influxdb/cloud-dedicated/admin/databases/)

##### Initialize a client for batch writing

The following example shows how to initialize a client for writing and querying the database.
When writing data, the client will use batch mode with default options and will
invoke the callback function for the response.

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```py
  import influxdb_client_3 as InfluxDBClient3
  from influxdb_client_3 import write_client_options, WriteOptions, InfluxDBError

  points = [Point("home").tag("room", "Kitchen").field("temp", 25.3),
            Point("home").tag("room", "Living Room").field("temp", 18.4)]

  # Define callbacks for write responses
  def success(self, conf: (str, str, str)):
      """BATCH WRITE SUCCESS."""
      print(f"Wrote batch: {conf}")

  def error(self, conf: (str, str, str), exception: InfluxDBError):
      """BATCH WRITE FAILURE."""
      print(f"Cannot write batch: {conf}, due to: {exception}")

  def retry(self, conf: (str, str, str), exception: InfluxDBError):
      """BATCH WRITE RETRY"""
      print(f"Retryable error occurs for batch: {conf}, retry: {exception}")

  # Instantiate WriteOptions for batching
  write_options = WriteOptions()
  wco = write_client_options(success_callback=success,
                              error_callback=error,
                              retry_callback=retry,
                              WriteOptions=write_options)

  with InfluxDBClient3(token="DATABASE_TOKEN", host="cluster-id.influxdb.io",
                      org="", database="DATABASE_NAME",
      _write_client_options=wco) as client:

      client.write(record=points)
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  Your InfluxDB token with READ permissions on the databases you want to query.
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  The name of your InfluxDB database.

### Instance methods

<!-- TOC -->
- [InfluxDBClient3.write](#influxdbclient3write)
- [InfluxDBClient3.write_file](#influxdbclient3write_file)
- [InfluxDBClient3.query](#influxdbclient3query)
- [InfluxDBClient3.close](#influxdbclient3close)

### InfluxDBClient3.write

Writes a record or a list of records to InfluxDB.
A record can be a `Point` object, a dict that represents a point, a line protocol string, or a `DataFrame`.

The client can write using [_batching_ mode](#batch-writing) or [_synchronous_ mode](#synchronous-writing).

##### Attributes

- **`write_precision=`**: `"ms"`, `"s"`, `"us"`, `"ns"`. Default is `"ns"`.

#### Syntax

```py
write(self, record=None, **kwargs)
```

#### Examples

##### Write a line protocol string

{{% influxdb/custom-timestamps %}}
{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```py
points = "home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000"

client = InfluxDBClient3(token="DATABASE_TOKEN", host="cluster-id.influxdb.io",
                        database="DATABASE_NAME", org="")

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
point = Point("home").tag("room", "Kitchen").field("temp", 72)
client.write(point)
```

###### Write data using a dict

`InfluxDBClient3` can serialize a dictionary object into line protocol.
If you pass a `dict` to `InfluxDBClient3.write`, the client expects the `dict` to have the
following _point_ data structure:

- **measurement** (str): the measurement name
- **tags** (dict): a dictionary of tag key-value pairs
- **fields** (dict): a dictionary of field key-value pairs
- **time**: the [timestamp](/influxdb/cloud-dedicated/reference/glossary/#timestamp) for the record

The following example shows how to define a `dict` that represents a point, and then write the
data to InfluxDB.

{{% influxdb/custom-timestamps %}}
{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```py
  # Using point dictionary structure
  points = {
            "measurement": "home",
            "tags": {"room": "Kitchen", "sensor": "K001"},
            "fields": {"temp": 72.2, "hum": 36.9, "co": 4},
            "time": 1641067200
            }
  
  client = InfluxDBClient3(token="DATABASE_TOKEN",
                          host="cluster-id.influxdb.io",
                          database="DATABASE_NAME",
                          org="")
  
  client.write(record=points, write_precision="s")
```
{{% /code-placeholders %}}
{{% /influxdb/custom-timestamps %}}

### InfluxDBClient3.write_file

Writes data from a file to InfluxDB.

The client can write using [_batching_ mode](#batch-writing) or [_synchronous_ mode](#synchronous-writing).

#### Syntax

```py
write_file(self, file, measurement_name=None, tag_columns=[],
          timestamp_column='time', **kwargs)
```
##### Attributes

-   **`file`**: A file containing records to write to InfluxDB. 
    The following file formats and file name extensions are supported.
    The file name must end with one of the supported extensions.
    For more information about encoding and formatting data, see the documentation for each supported format.
  
    | Supported format                                                           | File name extension |
    |:---------------------------------------------------------------------------|:--------------------|
    | [Feather](https://arrow.apache.org/docs/python/feather.html)               | `.feather`          |
    | [Parquet](https://arrow.apache.org/docs/python/parquet.html)               | `.parquet`          |
    | [Comma-separated values](https://arrow.apache.org/docs/python/csv.html)    | `.csv`              |
    | [JSON](https://pandas.pydata.org/docs/reference/api/pandas.read_json.html) | `.json`             |
    | [ORC](https://arrow.apache.org/docs/python/orc.html)                       | `.orc`              |  
- **`measurement_name`**: Defines the measurement name for records in the file.
  The specified value takes precedence over `measurement` and `iox::measurement` columns in the file.
  If no value is specified for the parameter, and a `measurement` column exists in the file, the `measurement` column value is used for the measurement name.
  If no value is specified for the parameter, and no `measurement` column exists, the `iox::measurement` column value is used for the measurement name.
- **`tag_columns`**: A list containing the names of tag columns.
  Columns not included in the list and not specified by another parameter are assumed to be fields.
- **`timestamp_column`**: The name of the column that contains timestamps. Default is `'time'`.

#### Examples

##### Write data from a file

The following example shows how to configure write options for batching, retries, and callbacks,
and how to write data from CSV and JSON files to InfluxDB:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```py
from influxdb_client_3 import InfluxDBClient3, write_client_options,
                              WritePrecision, WriteOptions, InfluxDBError

class BatchingCallback(object):

  # Define callbacks for write responses
  def success(self, conf: (str, str, str)):
      """BATCH WRITE SUCCESS."""
      print(f"Wrote batch: {conf}")

  def error(self, conf: (str, str, str), exception: InfluxDBError):
      """BATCH WRITE FAILURE."""
      print(f"Cannot write batch: {conf}, due to: {exception}")

  def retry(self, conf: (str, str, str), exception: InfluxDBError):
      """BATCH WRITE RETRY"""
      print(f"Retryable error occurs for batch: {conf}, retry: {exception}")

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
                          WriteOptions=write_options 
                        )

with  InfluxDBClient3(token="DATABASE_TOKEN", host="cluster-id.influxdb.io",
                      org="", database="DATABASE_NAME",
                      _write_client_options=wco) as client:

  client.write_file(file='./out.csv', timestamp_column='time',
                    tag_columns=["provider", "machineID"])
  
  client.write_file(file='./out.json', timestamp_column='time',
                    tag_columns=["provider", "machineID"], date_unit='ns')
```
{{% /code-placeholders %}}

### InfluxDBClient3.query

Sends a Flight request to execute the specified SQL or InfluxQL query.
Returns all data in the query result as an Arrow table.

#### Syntax

```py
query(self, query, language="sql")
```

#### Examples

##### Query using SQL

```py
query = "select * from measurement"
reader = client.query(query=query, language="sql")
table = reader.read_all()
print(table.to_pandas().to_markdown())
```

##### Query using InfluxQL

```py
query = "select * from measurement"
reader = client.query(query=query, language="influxql")
table = reader.read_all()
print(table.to_pandas().to_markdown())
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

A timeseries data point.

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

- `influxdb_client_3.write_client_options(**kwargs)`
  Returns a dictionary of write client options.

- `influxdb_client_3.flight_client_options(**kwargs)`
  Returns a dictionary of flight client options.

## Constants

- `influxdb_client_3.SYNCHRONOUS`: Represents synchronous write mode.
- `influxdb_client_3.WritePrecision`: Enum class representing write precision options.

## Exceptions

- `influxdb_client_3.InfluxDBError`: Exception raised for InfluxDB-related errors.
