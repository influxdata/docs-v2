---
title: InfluxDB 3 API client libraries
description: >
  InfluxDB 3 client libraries use InfluxDB HTTP APIs to write data and use [Flight clients](/influxdb3/cloud-serverless/reference/client-libraries/flight-sql) to execute SQL and InfluxQL queries.
  View the list of available client libraries.
weight: 30
menu:
  influxdb3_cloud_serverless:
    name: v3 client libraries
    parent: Client libraries
influxdb3/cloud-serverless/tags: [client libraries, API, developer tools]
---

## Client libraries for InfluxDB 3

InfluxDB 3 client libraries are language-specific packages that work with
and integrate with your application to write to and query data in {{% product-name %}}.
InfluxData and the user community maintain client libraries for developers who want to take advantage of:

- Idioms for InfluxDB requests, responses, and errors.
- Common patterns in a familiar programming language.
- Faster development and less boilerplate code.

InfluxDB client libraries provide configurable batch writing of data to InfluxDB HTTP APIs.
They can be used to construct line protocol data and transform data from other formats
to line protocol.

InfluxDB 3 client libraries can query InfluxDB 3 using InfluxDB 3's IOx-specific Arrow Flight protocol with gRPC.
Client libraries use Flight clients to execute SQL and InfluxQL queries, request
database information, and retrieve data stored in {{% product-name %}}.

Additional features may vary among client libraries.

For specifics about a client library, see the library's GitHub repository.
InfluxDB 3 client libraries are part of the [Influx Community](https://github.com/InfluxCommunity).

{{< children depth="999" description="true" >}}
