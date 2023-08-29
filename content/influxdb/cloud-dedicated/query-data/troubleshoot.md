---
title: Troubleshoot responses and errors
description: >
  Learn how to handle responses and troubleshoot errors encountered when querying {{% cloud-name %}} with Flight+gRPC and Arrow Flight clients.
weight: 201
menu:
  influxdb_cloud_dedicated:
    name: Troubleshoot responses and errors
    parent: Query data
influxdb/cloud-dedicated/tags: [query, sql, influxql]
alt_engine:
---

Learn how to handle responses and troubleshoot errors encountered when querying {{% cloud-name %}} with Flight+gRPC and Arrow Flight clients.

<!-- TOC -->

- [InfluxDB Flight responses](#influxdb-flight-responses)
  - [Stream](#stream)
  - [Schema](#schema)
    - [Example](#example)
  - [RecordBatch](#recordbatch)
  - [InfluxDB error codes](#influxdb-error-codes)
  - [Troubleshoot errors](#troubleshoot-errors)
    - [Internal Error: Received RST_STREAM](#internal-error-received-rst_stream)
    - [Internal Error: stream terminated by RST_STREAM with NO_ERROR](#internal-error-stream-terminated-by-rst_stream-with-no_error)
    - [Invalid Argument Error: bucket <BUCKET_ID> not found](#invalid-argument-error-bucket-bucket_id-not-found)
      - [Unauthenticated: Unauthenticated](#unauthenticated-unauthenticated)
    - [Unauthenticated: read:<BUCKET_ID> is unauthorized](#unauthenticated-readbucket_id-is-unauthorized)

## InfluxDB Flight responses

{{% cloud-name %}} provides an InfluxDB-specific Arrow Flight service that uses gRPC Remote Procedure Calls (gRPC) to transport query result data in Arrow format.
Flight defines a set of [RPC methods](https://arrow.apache.org/docs/format/Flight.html#rpc-methods-and-request-patterns) for servers and clients.

<@alamb>Also Flight SQL (which basically is a set of messages on top of Flight)?

Using gRPC, a Flight client (for example, `influx3` or an InfluxDB v3 client library) calls an InfluxDB Flight RPC server method to send a request to the server.
In gRPC, every call returns a status object that contains an integer code and a string message.

InfluxDB v3 client library query methods implement the Flight [`DoGet(FlightCallOptions, Ticket)` method](https://arrow.apache.org/docs/cpp/api/flight.html#_CPPv4N5arrow6flight12FlightClient5DoGetERK17FlightCallOptionsRK6Ticket) that retrieves a single stream for the the request.
For example, if you call the `influxdb3-python` Python client library `InfluxDBClient3.query()` method, the client in turn calls the `pyarrow.flight.FlightClient.do_get()` method and passes a Flight ticket with your credentials and query to InfluxDB.

InfluxDB responds with one of the following:

- A [stream](#stream) in Arrow IPC streaming format
- An [error status code](#influxdb-error-codes) and an optional `details` field that contains the status and a message that describes the error

### Stream

After InfluxDB processes a query, it sends a stream in [Arrow IPC format](https://arrow.apache.org/docs/format/Columnar.html#serialization-and-interprocess-communication-ipc).
Flight client libraries, such as `pyarrow.flight` and the Go Arrow Flight package, implement an Arrow interface for retrieving the query result schema and data from the stream.
Each client or library may provide additional methods and options for reading the data.

If InfluxDB processes the query successfully, {{% cloud-name %}} responds with a stream that contains the following:

1. A [Schema](#schema) that applies to all record batches in the stream
2. [RecordBatch](#recordbatch) messages with query result data
3. The request status (`OK`)
4. Optional: trailing metadata

### Schema

An InfluxDB Flight response contains a [Flight schema](https://arrow.apache.org/docs/format/Columnar.html#schema-message) that describes the data type and InfluxDB column type (timestamp, tag, or field) for columns in the data set.
All data chunks, or record batches, in the stream have the same schema.
Data transformation tools can use the schema when converting Arrow data to other formats and back to Arrow.

Use the `Reader.schema` attribute to access the schema for query results in the stream.

#### Example

The following example shows how to access the schema from a [`Table`](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html#pyarrow.Table) returned by the Python client library `InfluxDBClient3.query(query)` method.

```py
# Execute the query and read all the data into a PyArrow Table.
table = client.query(
  '''SELECT co, delete, hum, room, temp, time
      FROM home
      WHERE time >= now() - INTERVAL '90 days'
      ORDER BY time'''
)
print("\n#### View Schema information\n")
print(table.schema)
```

The output is the following:

```py
#### View Schema information

co: int64
  -- field metadata --
  iox::column::type: 'iox::column_type::field::integer'
delete: string
  -- field metadata --
  iox::column::type: 'iox::column_type::tag'
hum: double
  -- field metadata --
  iox::column::type: 'iox::column_type::field::float'
room: string
  -- field metadata --
  iox::column::type: 'iox::column_type::tag'
temp: double
  -- field metadata --
  iox::column::type: 'iox::column_type::field::float'
time: timestamp[ns] not null
  -- field metadata --
  iox::column::type: 'iox::column_type::timestamp'
```

### RecordBatch

[`RecordBatch` messages](https://arrow.apache.org/docs/format/Columnar.html#recordbatch-message) in the  {{% cloud-name %}} response stream contain query result data in Arrow format.
When the Flight client receives a stream, it reads each record batch from the stream until there are no more messages to read.
The client considers the request complete when it has received all the messages.

Flight clients and InfluxDB v3 client libraries provide methods for reading record batches, or "data chunks," in a stream.
For example, the InfluxDB v3 Python client library uses the [`pyarrow.flight.FlightStreamReader`](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightStreamReader.html#pyarrow.flight.FlightStreamReader) class and provides the following reader methods:

- `all`: Read all record batches into a `pyarrow.Table`.
- `pandas`: Read all record batches into a `pandas.DataFrame`.
- `chunk`: Read the next batch and metadata, if available.
- `reader`: Convert the `FlightStreamReader` instance into a `RecordBatchReader`.

Client library classes, methods, and implementations vary for each language and client library.

### InfluxDB error codes

During a request, the gRPC client and server may each return a status--for example:

- The server fails to process the query; responds with status `internal error` and gRPC status `13`.
- The request is missing a database token; the server responds with status `unauthenticated` and gRPC status `16`.
- The server responds with a stream, but the client loses the connection due to a network failure and returns status `unavailable` (gRPC status `???`).

gRPC defines the integer [status codes](https://grpc.github.io/grpc/core/status_8h.html) and definitions for servers and clients and
Arrow Flight defines a `FlightStatusDetail` class and the [error codes](https://arrow.apache.org/docs/format/Flight.html#error-handling) that a Flight RPC service may implement.

While Flight defines the status codes available for servers, a server can choose which status to return for an RPC call.
In error responses, the status `details` field contains an error code that clients can use to determine if the error should be displayed to users (for example, if the client should retry the request).

The following table describes InfluxDB status codes and, if they can appear in gRPC requests, their corresponding gRPC and Flight codes:

| InfluxDB status code | Used for gRPC | gRPC code | Flight code      | Description                                                        |
|:---------------------|:--------------|:----------|:-----------------|:------------------------------------------------------------------|
| OK                   | ✓             | 0         | OK               |                                                                   |
| Conflict             | ✓             |           |                  |                                                                   |
| Internal             | ✓             | 13        | INTERNAL         | An error internal to the service implementation occurred.         |
| Invalid              | ✓             | 3         | INVALID_ARGUMENT | The client passed an invalid argument to the RPC (for example, invalid SQL). |
| NotFound             | ✓             | 5         | NOT_FOUND        | The requested resource (action, data stream) wasn't found.        |
| NotImplemented       | ✓             | 12        | UNIMPLEMENTED    | The RPC is not implemented.                                       |
| RequestCanceled      | ✓             | 1         | CANCELLED        | The operation was cancelled (either by the client or the server). |
| TooLarge             | ✓             |           |                  |                                                                   |
| Unauthenticated      | ✓             | 16        | UNAUTHENTICATED  | The client isn't authenticated (credentials are missing or invalid). |
| Unauthorized         | ✓             | 16        | UNAUTHORIZED     | The client doesn't have permissions for the requested operation (credentials aren't sufficient for the request). |
| Unavailable          | ✓             |           | UNAVAILABLE      | The server isn't available. May be emitted by the client for connectivity reasons.      |
| Unknown              | ✓             | 2         | UNKNOWN          | An unknown error. The default if no other error applies.          |
| UnprocessableEntity  |               |           |                  |                                                                   |
| EmptyValue           |               |           |                  |                                                                   |
| Forbidden            |               |           |                  |                                                                   |
| TooManyRequests      |               |           |                  |                                                                   |
| MethodNotAllowed     |               |           |                  |                                                                   |
| UpstreamServer       |               |           |                  |                                                                   |

<!-- Reference: influxdb_iox/service_grpc_influxrpc/src/service#InfluxCode -->

_For a list of gRPC codes that servers and clients may return, see [Status codes and their use in gRPC](https://grpc.github.io/grpc/core/md_doc_statuscodes.html) in the GRPC Core documentation._

### Troubleshoot errors

#### Internal Error: Received RST_STREAM

**Example**:

```sh
Flight returned internal error, with message: Received RST_STREAM with error code 2. gRPC client debug context: UNKNOWN:Error received from peer ipv4:34.196.233.7:443 {grpc_message:"Received RST_STREAM with error code 2"}
```

**Potential reasons**:

- The connection to the server was reset unexpectedly.
- Network issues between the client and server.
- Server might have closed the connection due to an internal error.
- The client exceeded the server's maximum number of concurrent streams.

#### Internal Error: stream terminated by RST_STREAM with NO_ERROR

**Example**:

```sh
pyarrow._flight.FlightInternalError: Flight returned internal error, with message: stream terminated by RST_STREAM with error code: NO_ERROR. gRPC client debug context: UNKNOWN:Error received from peer ipv4:3.123.149.45:443 {created_time:"2023-07-26T14:12:44.992317+02:00", grpc_status:13, grpc_message:"stream terminated by RST_STREAM with error code: NO_ERROR"}. Client context: OK
```

**Potential Reasons**:

- The server terminated the stream, but there wasn't any specific error associated with it.
- Possible network disruption, even if it's temporary.
- The server might have reached its maximum capacity or other internal limits.

#### Invalid Argument Error: bucket <BUCKET_ID> not found

**Example**:

```sh
ArrowInvalid: Flight returned invalid argument error, with message: bucket "otel5" not found. gRPC client debug context: UNKNOWN:Error received from peer ipv4:3.123.149.45:443 {grpc_message:"bucket \"otel5\" not found", grpc_status:3, created_time:"2023-08-09T16:37:30.093946+01:00"}. Client context: IOError: Server never sent a data message. Detail: Internal
```

**Potential Reasons**:

- The specified bucket doesn't exist.

##### Unauthenticated: Unauthenticated

**Example**:

```sh
Flight returned unauthenticated error, with message: unauthenticated. gRPC client debug context: UNKNOWN:Error received from peer ipv4:34.196.233.7:443 {grpc_message:"unauthenticated", grpc_status:16, created_time:"2023-08-28T15:38:33.380633-05:00"}. Client context: IOError: Server never sent a data message. Detail: Internal
```

**Potential reason**:

- Token is missing from the request.
- The specified token doesn't exist for the specified organization.

#### Unauthenticated: read:<BUCKET_ID> is unauthorized

**Example**:

```sh
Flight returned unauthenticated error, with message: read:orgs/28d1f2f565460a6c/buckets/756fa4f8c8ba6913 is unauthorized. gRPC client debug context: UNKNOWN:Error received from peer ipv4:54.174.236.48:443 {grpc_message:"read:orgs/28d1f2f565460a6c/buckets/756fa4f8c8ba6913 is unauthorized", grpc_status:16, created_time:"2023-08-28T15:42:04.462655-05:00"}. Client context: IOError: Server never sent a data message. Detail: Internal
```

**Potential reason**:

- The specified token doesn't have read permission for the specified bucket.
