---
title: Python Flight SQL DBAPI client
description: The Python `flightsql-dbapi` library uses SQL and the Flight SQL protocol to query data stored in an InfluxDB Cloud Serverless bucket. 
menu:
  influxdb3_cloud_serverless:
    name: Python Flight SQL
    parent: Arrow Flight clients
    identifier: python-flightsql-client
influxdb3/cloud-serverless/tags: [Flight client, Python, SQL, Flight SQL]
weight: 201
---

The [Python `flightsql-dbapi` Flight SQL DBAPI library](https://github.com/influxdata/flightsql-dbapi) integrates with Python applications using SQL to query data stored in an {{% product-name %}} bucket. The `flightsql-dbapi` library uses the [Flight SQL protocol](https://arrow.apache.org/docs/format/FlightSql.html) to query and retrieve data.

> [!Note]
> #### Use InfluxDB 3 client libraries
> 
> We recommend using the [`influxdb3-python` Python client library](/influxdb3/cloud-serverless/reference/client-libraries/v3/python/) for integrating InfluxDB 3 with your Python application code.
> 
> [InfluxDB 3 client libraries](/influxdb3/cloud-serverless/reference/client-libraries/v3/) wrap Apache Arrow Flight clients
> and provide convenient methods for [writing](/influxdb3/cloud-serverless/get-started/write/#write-line-protocol-to-influxdb), [querying](/influxdb3/cloud-serverless/get-started/query/#execute-an-sql-query), and processing data stored in {{% product-name %}}.
> Client libraries can query using SQL or InfluxQL.

## Installation

The [`flightsql-dbapi`](https://github.com/influxdata/flightsql-dbapi) Flight SQL library for Python provides a
[DB API 2](https://peps.python.org/pep-0249/) interface and
[SQLAlchemy](https://www.sqlalchemy.org/) dialect for
[Flight SQL](https://arrow.apache.org/docs/format/FlightSql.html).
Installing `flightsql-dbapi` also installs the [`pyarrow`](https://arrow.apache.org/docs/python/index.html) library that you'll use for working with Arrow data.

In your terminal, use `pip` to install `flightsql-dbapi`:

```sh
pip install flightsql-dbapi
```

## Importing the module

The `flightsql-dbapi` package provides the `flightsql` module. From the module, import the `FlightSQLClient` class method:

```py
from flightsql import FlightSQLClient
```

- `flightsql.FlightSQLClient` class: an interface for [initializing
a client](#initialization) and interacting with a Flight SQL server.

## API reference

- [Class FlightSQLClient](#class-flightsqlclient)
  - [Syntax](#syntax)
- [Initialize a client](#initialize-a-client)
  - [Instance methods](#instance-methods)
  - [FlightSQLClient.execute](#flightsqlclientexecute)
    - [Syntax {#execute-query-syntax}](#syntax-execute-query-syntax)
    - [Example {#execute-query-example}](#example-execute-query-example)
  - [FlightSQLClient.do_get](#flightsqlclientdo_get)
    - [Syntax {#retrieve-data-syntax}](#syntax-retrieve-data-syntax)
    - [Example {#retrieve-data-example}](#example-retrieve-data-example)

## Class FlightSQLClient

Provides an interface for [initializing
a client](#initialize-a-client) and interacting with a Flight SQL server.

### Syntax

```py
__init__(self, host=None, token=None, metadata=None, features=None)
```

Initializes and returns a `FlightSQLClient` instance for interacting with the server.

## Initialize a client

The following example shows how to use Python with `flightsql-dbapi`
and the _DB API 2_ interface to instantiate a Flight SQL client configured for an InfluxDB database.

{{% code-placeholders "BUCKET_NAME|API_TOKEN" %}}
```py   
from flightsql import FlightSQLClient

# Instantiate a FlightSQLClient configured for a database
client = FlightSQLClient(host='{{< influxdb/host >}}',
                        token='API_TOKEN',
                        metadata={'database': 'BUCKET_NAME'},
                        features={'metadata-reflection': 'true'})
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: an {{% product-name %}} [API token](/influxdb3/cloud-serverless/admin/tokens/) with read permissions on the buckets you want to query
- {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}}: the name of your {{% product-name %}} [bucket](/influxdb3/cloud-serverless/admin/buckets/)

### Instance methods

### FlightSQLClient.execute

Sends a Flight SQL RPC request to execute the specified SQL Query.

#### Syntax {#execute-query-syntax}

```py
execute(query: str, call_options: Optional[FlightSQLCallOptions] = None)
```

#### Example {#execute-query-example}

```py
# Execute the query
info = client.execute("SELECT * FROM home")
```

The response contains a `flight.FlightInfo` object that contains metadata and an `endpoints: [...]` list. Each endpoint contains the following:

- A list of addresses where you can retrieve query result data.
- A `ticket` value that identifies the data to [retrieve](#retrieve-data-example).

### FlightSQLClient.do_get

Passes a Flight ticket (obtained from a `FlightSQLClient.execute` response) and retrieves Arrow data identified by the ticket.
Returns a `pyarrow.flight.FlightStreamReader` for streaming the data.

#### Syntax {#retrieve-data-syntax}

```py
 do_get(ticket, call_options: Optional[FlightSQLCallOptions] = None)
```

#### Example {#retrieve-data-example}

The following sample shows how to use Python with `flightsql-dbapi` and `pyarrow` to query InfluxDB and retrieve data.

```py
from flightsql import FlightSQLClient

# Instantiate a FlightSQLClient configured for a database
client = FlightSQLClient(host='{{< influxdb/host >}}',
    token='API_TOKEN',
    metadata={'database': 'BUCKET_NAME'},
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

print(table)
```

`do_get(ticket)` returns a [`pyarrow.flight.FlightStreamReader`](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightStreamReader.html) for streaming Arrow [record batches](https://arrow.apache.org/docs/python/data.html#record-batches).

To read data from the stream, call one of the following `FlightStreamReader` methods:

- `read_all()`: Read all record batches as a [`pyarrow.Table`](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html).
- `read_chunk()`: Read the next RecordBatch and metadata.
- `read_pandas()`: Read all record batches and convert them to a  [`pandas.DataFrame`](https://pandas.pydata.org/docs/reference/frame.html).
