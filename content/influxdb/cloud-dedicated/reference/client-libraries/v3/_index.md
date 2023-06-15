---
title: InfluxDB v3 API client libraries
description: >
  InfluxDB v3 client libraries use InfluxDB HTTP APIs to write data and use [Flight SQL clients](/influxdb/cloud-dedicated/reference/client-libraries/flight-sql) to query data stored in an InfluxDB Cloud Dedicated database.
  View the list of available client libraries.
weight: 30
menu:
  influxdb_cloud_dedicated:
    name: v3 client libraries
    parent: Client libraries
influxdb/cloud-dedicated/tags: [client libraries, API, developer tools]
---

## Client libraries for InfluxDB v3

InfluxDB v3 client libraries are language-specific packages that work with
and integrate with your application to write to and query data in {{% cloud-name %}}.

InfluxDB client libraries provide configurable batch writing of data to InfluxDB HTTP APIs.
They can be used to construct line protocol data and transform data from other formats
to line protocol.

InfluxDB v3 client libraries can query InfluxDB v3 using the Arrow Flight protocol with gRPC.
Client libraries use Flight clients to execute SQL and InfluxQL queries, request
database information, and retrieve data stored in {{% cloud-name %}}.

Additional functionality may vary among client libraries and some may not be feature-complete.

For specifics about a client library, see the library's GitHub repository.
InfluxDB v3 client libraries are part of the [Influx Community](https://github.com/InfluxCommunity).

{{< children depth="999" description="true" >}}
