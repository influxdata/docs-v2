---
title: Understand and troubleshoot Flight responses
description: >
  Understand responses and troubleshoot errors encountered when querying InfluxDB with Flight+gRPC and Arrow Flight clients.
weight: 401
menu:
  influxdb_cloud_dedicated:
    name: Understand Flight responses
    parent: Execute queries
influxdb/cloud-dedicated/tags: [query, sql, influxql]
---

Learn how to handle responses and troubleshoot errors encountered when querying {{% cloud-name %}} with Flight+gRPC and Arrow Flight clients.

<!-- TOC -->

- [InfluxDB Flight responses](#influxdb-flight-responses)
  - [Stream](#stream)
  - [Schema](#schema)
    - [Example](#example)
  - [RecordBatch](#recordbatch)
  - [InfluxDB status and error codes](#influxdb-status-and-error-codes)
  - [Troubleshoot errors](#troubleshoot-errors)
    - [Internal Error: Received RST_STREAM](#internal-error-received-rst_stream)
    - [Internal Error: stream terminated by RST_STREAM with NO_ERROR](#internal-error-stream-terminated-by-rst_stream-with-no_error)
    - [Invalid Argument: Invalid ticket](#invalid-argument-invalid-ticket)
    - [Unauthenticated: Unauthenticated](#unauthenticated-unauthenticated)
    - [Unauthorized: Permission denied](#unauthorized-permission-denied)
    - [FlightUnavailableError: Could not get default pem root certs](#flightunavailableerror-could-not-get-default-pem-root-certs)

## InfluxDB Flight responses

{{% cloud-name %}} provides an InfluxDB-specific Arrow Flight remote procedure calls (RPC) and Flight SQL service that uses gRPC, a high performance RPC framework, to transport data in Arrow format.
Flight defines a set of [RPC methods](https://arrow.apache.org/docs/format/Flight.html#rpc-methods-and-request-patterns) that servers and clients can use to exchange information.
Flight SQL uses Flight RPC and defines additional methods to query database metadata, execute queries, and manipulate prepared statements.
To learn more about Flight SQL, see [Introducing Apache Arrow Flight SQL: Accelerating Database Access](https://arrow.apache.org/blog/2022/02/16/introducing-arrow-flight-sql/).

To query data or retrieve information about data stored in {{% cloud-name %}}, use a Flight client to send a call to an InfluxDB Flight RPC or Flight SQL service method.
For example, if you use the [`influxdb3-python` Python client library](/influxdb/cloud-dedicated/reference/client-libraries/v3/python/) and call the `InfluxDBClient3.query()` method, the client in turn calls the `pyarrow.flight.FlightClient.do_get()` method and passes a Flight ticket containing your credentials and query to InfluxDB's Flight [`DoGet(FlightCallOptions, Ticket)` method](https://arrow.apache.org/docs/cpp/api/flight.html#_CPPv4N5arrow6flight12FlightClient5DoGetERK17FlightCallOptionsRK6Ticket).

InfluxDB responds with one of the following:

- A [stream](#stream) in Arrow IPC streaming format
- An [error status code](#influxdb-error-codes) and an optional `details` field that contains the status and a message that describes the error

### Stream

InfluxDB provides Flight RPC methods and implements server-side streaming for clients to retrieve and download data.
In a gRPC server-side streaming scenario, a client sends an RPC call in a request to a server.
Because the server can return a _stream_ of multiple responses to the client, the client request contains an identifier that the client and server use to keep track of the request and associated responses.
As the server sends responses, they are associated with the corresponding stream on the client side.

An Arrow Flight service, such as InfluxDB, sends a stream in [Arrow IPC streaming format](https://arrow.apache.org/docs/format/Columnar.html#serialization-and-interprocess-communication-ipc) that defines the structure of the stream and each response, or _message_, in the stream.

Flight client libraries, such as `pyarrow.flight` and the Go Arrow Flight package, implement an Arrow interface for retrieving the data, schema, and metadata from the stream.

After {{% cloud-name %}} successfully processes a query, it sends a stream that contains the following:

1. A [Schema](#schema) that applies to all record batches in the stream
2. [RecordBatch](#recordbatch) messages with query result data
3. The [request status](#influxdb-status-and-error-codes) (`OK`)
4. Optional: trailing metadata

### Schema

An InfluxDB Flight response stream contains a [Flight schema](https://arrow.apache.org/docs/format/Columnar.html#schema-message) that describes the data type and InfluxDB data element type (timestamp, tag, or field) for columns in the data set.
All data chunks, or record batches, in the same stream have the same schema.
Data transformation tools can use the schema when converting Arrow data to other formats and back to Arrow.

#### Example

Given the following query:

```sql
SELECT co, delete, hum, room, temp, time
  FROM home
  WHERE time >= now() - INTERVAL '90 days'
  ORDER BY time
```

The Python client library outputs the following schema representation:

```py
Schema:
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

Using PyArrow, you can access the schema through the [`FlightStreamReader.schema`](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightStreamReader.html#pyarrow.flight.FlightStreamReader) attribute.
See [`InfluxDBClient3.query()` examples](/influxdb/cloud-dedicated/reference/client-libraries/v3/python/#influxdbclient3query) for retrieving the schema.

### RecordBatch

[`RecordBatch` messages](https://arrow.apache.org/docs/format/Columnar.html#recordbatch-message) in the  {{% cloud-name %}} response stream contain query result data in Arrow format.
When the Flight client receives a stream, it reads each record batch from the stream until there are no more messages to read.
The client considers the request complete when it has received all the messages.

Flight clients and InfluxDB v3 client libraries provide methods for reading record batches, or "data chunks," from a stream.
The InfluxDB v3 Python client library uses the [`pyarrow.flight.FlightStreamReader`](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightStreamReader.html#pyarrow.flight.FlightStreamReader) class and provides the following reader methods:

- `all`: Read all record batches into a `pyarrow.Table`.
- `pandas`: Read all record batches into a `pandas.DataFrame`.
- `chunk`: Read the next batch and metadata, if available.
- `reader`: Convert the `FlightStreamReader` instance into a `RecordBatchReader`.

Flight clients implement Flight interfaces, however client library classes, methods, and implementations may differ for each language and library.

### InfluxDB status and error codes

In gRPC, every call returns a status object that contains an integer code and a string message.
During a request, the gRPC client and server may each return a status--for example:

- The server fails to process the query; responds with status `internal error` and gRPC status `13`.
- The request is missing a database token; the server responds with status `unauthenticated` and gRPC status `16`.
- The server responds with a stream, but the client loses the connection due to a network failure and returns status `unavailable`.

gRPC defines the integer [status codes](https://grpc.github.io/grpc/core/status_8h.html) and definitions for servers and clients and
Arrow Flight defines a `FlightStatusDetail` class and the [error codes](https://arrow.apache.org/docs/format/Flight.html#error-handling) that a Flight RPC service may implement.

While Flight defines the status codes available for servers, a server can choose which status to return for an RPC call.
In error responses, the status `details` field contains an error code that clients can use to determine if the error should be displayed to users (for example, if the client should retry the request).

{{< expand-wrapper >}}
{{% expand "View InfluxDB, Flight, and gRPC status codes" %}}
The following table describes InfluxDB status codes and, if they can appear in gRPC requests, their corresponding gRPC and Flight codes:

| InfluxDB status code | Used for gRPC | gRPC code | Flight code      | Description                                                        |
|:---------------------|:--------------|:----------|:-----------------|:------------------------------------------------------------------|
| OK                   | ✓             | 0         | OK               |                                                                   |
| Conflict             | ✓             |           |                  |                                                                   |
| Internal             | ✓             | 13        | INTERNAL         | An error internal to the service implementation occurred.         |
| Invalid              | ✓             | 3         | INVALID_ARGUMENT | The client passed an invalid argument to the RPC (for example, bad SQL syntax or a null value as the database name). |
| NotFound             | ✓             | 5         | NOT_FOUND        | The requested resource (action, data stream) wasn't found.        |
| NotImplemented       | ✓             | 12        | UNIMPLEMENTED    | The RPC is not implemented.                                       |
| RequestCanceled      | ✓             | 1         | CANCELLED        | The operation was cancelled (either by the client or the server). |
| TooLarge             | ✓             |           |                  |                                                                   |
| Unauthenticated      | ✓             | 16        | UNAUTHENTICATED  | The client isn't authenticated (credentials are missing or invalid). |
| Unauthorized         | ✓             | 7, 16     | UNAUTHORIZED     | The client doesn't have permissions for the requested operation (credentials aren't sufficient for the request). |
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

{{% /expand %}}
{{< /expand-wrapper >}}


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

<!-- END -->

#### Internal Error: stream terminated by RST_STREAM with NO_ERROR

**Example**:

```sh
pyarrow._flight.FlightInternalError: Flight returned internal error, with message: stream terminated by RST_STREAM with error code: NO_ERROR. gRPC client debug context: UNKNOWN:Error received from peer ipv4:3.123.149.45:443 {created_time:"2023-07-26T14:12:44.992317+02:00", grpc_status:13, grpc_message:"stream terminated by RST_STREAM with error code: NO_ERROR"}. Client context: OK
```

**Potential Reasons**:

- The server terminated the stream, but there wasn't any specific error associated with it.
- Possible network disruption, even if it's temporary.
- The server might have reached its maximum capacity or other internal limits.

<!-- END -->

#### Invalid Argument: Invalid ticket

**Example**:

```sh
pyarrow.lib.ArrowInvalid: Flight returned invalid argument error, with message: Invalid ticket. Error: Invalid ticket. gRPC client debug context: UNKNOWN:Error received from peer ipv4:54.158.68.83:443 {created_time:"2023-08-31T17:56:42.909129-05:00", grpc_status:3, grpc_message:"Invalid ticket. Error: Invalid ticket"}. Client context: IOError: Server never sent a data message. Detail: Internal
```

**Potential Reasons**:

- The request is missing the database name or some other required metadata value.
- The request contains bad query syntax.

<!-- END -->

#### Unauthenticated: Unauthenticated

**Example**:

```sh
Flight returned unauthenticated error, with message: unauthenticated. gRPC client debug context: UNKNOWN:Error received from peer ipv4:34.196.233.7:443 {grpc_message:"unauthenticated", grpc_status:16, created_time:"2023-08-28T15:38:33.380633-05:00"}. Client context: IOError: Server never sent a data message. Detail: Internal
```

**Potential reason**:

- Token is missing from the request.
- The specified token doesn't exist for the specified organization.

<!-- END -->

#### Unauthorized: Permission denied

**Example**:

```sh
pyarrow._flight.FlightUnauthorizedError: Flight returned unauthorized error, with message: Permission denied. gRPC client debug context: UNKNOWN:Error received from peer ipv4:54.158.68.83:443 {grpc_message:"Permission denied", grpc_status:7, created_time:"2023-08-31T17:51:08.271009-05:00"}. Client context: IOError: Server never sent a data message. Detail: Internal
```

**Potential reason**:

- The specified token doesn't have read permission for the specified database.

<!-- END -->

#### FlightUnavailableError: Could not get default pem root certs

**Example**:

If unable to locate a root certificate for _gRPC+TLS_, the Flight client returns errors similar to the following:

```sh
UNKNOWN:Failed to load file... filename:"/usr/share/grpc/roots.pem",
  children:[UNKNOWN:No such file or directory
...
Could not get default pem root certs...

pyarrow._flight.FlightUnavailableError: Flight returned unavailable error,
  with message: empty address list: . gRPC client debug context:
  UNKNOWN:empty address list
...
```

**Potential reason**:

- Non-POSIX-compliant systems (such as Windows) need to specify the root certificates in SslCredentialsOptions for the gRPC client, since the defaults are only configured for POSIX filesystems.
  [Specify the root certificate path](#specify-the-root-certificate-path) for the Flight gRPC client.

  For more information about gRPC SSL/TLS client-server authentication, see [Using client-side SSL/TLS](https://grpc.io/docs/guides/auth/#using-client-side-ssltls) in the [gRPC.io Authentication guide](https://grpc.io/docs/guides/auth/).
