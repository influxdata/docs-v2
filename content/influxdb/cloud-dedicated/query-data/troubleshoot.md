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
  - [Schema](#schema)
    - [Example](#example)
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
Using gRPC, a Flight client (for example, `influx3` or an InfluxDB v3 client library) calls an InfluxDB Flight RPC server method to send a request to the server.
In gRPC, every call returns a status object that contains an integer code and a string message.
While gRPC defines the integer [status codes](https://grpc.github.io/grpc/core/status_8h.html) and definitions for servers and clients,
a server can choose which status to return for an RPC call.
During a request, the gRPC client and server may each return a status independent of the other.

InfluxDB v3 client library query methods implement the Flight [`DoGet(FlightCallOptions, Ticket)` method](https://arrow.apache.org/docs/cpp/api/flight.html#_CPPv4N5arrow6flight12FlightClient5DoGetERK17FlightCallOptionsRK6Ticket) that retrieves a single stream for the the request.
For example, if you call the `influxdb3-python` Python client library `InfluxDBClient3.query()` method, the client in turn calls the `pyarrow.flight.FlightClient.do_get()` method and passes a Flight ticket with your credentials and query to InfluxDB.

InfluxDB v3 can respond with one of the following:

- The schema for record batches in the stream, followed by a stream of query result data (`RecordBatch`), the request status (`OK`), and optional trailing metadata
- The schema, a stream or partial stream of data, and no status (for example, in the event of a network interruption)
- An [error status code](#influxdb-error-codes) and an optional `details` field that contains the status and a message that describes the error

_To learn more about Flight RPC requests, see the [Apache Arrow Flight RPC documentation](https://arrow.apache.org/docs/format/Flight.html)_

When the Flight client receives a stream, it reads each `RecordBatch`  from the stream until there are no more messages to read, and considers the request complete when it has received all the messages.

### Schema

A Flight response can contain a schema that describes the size and columns in the query result data.
You can inspect the schema in a {{% cloud-name %}} response to find the data type and InfluxDB column type (timestamp, tag, or field) for columns in the data set.
Data transformations can use the schema when converting Arrow data to other formats and back to Arrow.

The schema has the following structure:

- 4 bytes - an optional IPC_CONTINUATION_TOKEN prefix
- 4 bytes - the byte length of the payload
- a flatbuffer message whose header is the schema

#### Example

The following example uses the `Reader` instance returned by the `InfluxDBClient3.query()` Python client library method to print the schema.

```py
print("\n#### View Schema information\n")
print(table.schema)

#### View Schema information

co: int64
  -- field metadata --
  iox::column::type: 'iox::column_type::field::integer'
delete: string
  -- field metadata --
  iox::column::type: 'iox::column_type::tag'
host: string
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

### InfluxDB error codes

In gRPC error responses, the gRPC status `details` field contains an error code that clients can use to determine if the error should be displayed to users (for example, if the client should retry the request).
Arrow Flight defines a `FlightStatusDetail` class and the [error codes](https://arrow.apache.org/docs/format/Flight.html#error-handling) that a Flight RPC service may implement.

The following table describes InfluxDB status codes and, if they can appear in gRPC requests, their corresponding gRPC and Flight codes:

| InfluxDB status code | Description          | Used for gRPC | gRPC code | Flight code      | Flight Description                                                |
|:---------------------|:---------------------|:--------------|:----------|:-----------------|:------------------------------------------------------------------|
| OK                   | success              | ✓             | 0         | OK               |                                                                   |
| Conflict             | conflict             | ✓             |           |                  |                                                                   |
| Internal             | internal error       | ✓             | 13        | INTERNAL         | An error internal to the service implementation occurred.         |
| Invalid              | invalid              | ✓             | 3         | INVALID_ARGUMENT | The client passed an invalid argument to the RPC (e.g. invalid SQL).                 |
| NotFound             | not found            | ✓             | 5         | NOT_FOUND        | The requested resource (action, data stream) wasn't found.        |
| NotImplemented       | not implemented      | ✓             | 12        | UNIMPLEMENTED    | The RPC is not implemented.                                       |
| RequestCanceled      | request canceled     | ✓             | 1         | CANCELLED        | The operation was cancelled (either by the client or the server). |
| TooLarge             | request too large    | ✓             |           |                  |                                                                   |
| Unauthorized         | unauthorized         | ✓             | 16        | UNAUTHENTICATED, UNAUTHORIZED | The client isn't authenticated or doesn't have permissions for the requested operation. |
| Unavailable          | unavailable          | ✓             |           | UNAVAILABLE      | The server isn't available. May be emitted by the client for connectivity reasons.      |
| Unknown              | internal error       | ✓             | 2         | UNKNOWN          | An unknown error. The default if no other error applies.          |
| UnprocessableEntity  | unprocessable entity |               |           |                  |                                                                   |
| EmptyValue           | empty value          |               |           |                  |                                                                   |
| Forbidden            | forbidden            |               |           |                  |                                                                   |
| TooManyRequests      | too many requests    |               |           |                  |                                                                   |
| MethodNotAllowed     | method not allowed   |               |           |                  |                                                                   |
| UpstreamServer       | upstream server      |               |           |                  |                                                                   |

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
