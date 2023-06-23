---
title: Flight SQL clients
description: >
  Flight SQL clients are language-specific drivers that can interact with SQL databases using the Arrow in-memory format and the Flight RPC framework.
  View the list of available clients.
weight: 30
menu:
  influxdb_cloud_dedicated:
    name: Flight SQL clients
    parent: Client libraries
influxdb/cloud-dedicated/tags: [Golang, Python, client libraries, Flight SQL]
aliases:
  - /influxdb/cloud-dedicated/reference/client-libraries/flight-sql/go-flightsql/
  - /influxdb/cloud-dedicated/reference/client-libraries/flight-sql/python-flightsql-dbapi/
---

Flight and Flight SQL clients are language-specific drivers that interact with SQL databases using the Arrow in-memory format and the Flight RPC framework.
Clients provide a [`FlightClient`](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightClient.html#pyarrow.flight.FlightClient) that can query and retrieve data from InfluxDB v3 using gRPC and Flight.

Flight clients are maintained by Apache Arrow projects or third-parties.
For specifics about a Flight client, see the client's GitHub repository.

{{% note %}}
[InfluxDB v3 client libraries](/influxdb/cloud-dedicated/reference/client-libraries/v3/) use Flight clients
and offer additional convenience for writing, querying, and retrieving data stored in {{% cloud-name %}}.
{{% /note %}}

## C# (csharp)

- [Apache Arrow C# FlightClient](https://github.com/apache/arrow/tree/main/csharp/examples/FlightClientExample)

## Go
- [Apache Arrow Go Flight SQL client](https://pkg.go.dev/github.com/apache/arrow/go/v12/arrow/flight/flightsql#Client)

## Java
- [Apache Arrow Java FlightClient](https://arrow.apache.org/docs/java/reference/org/apache/arrow/flight/FlightClient.html)

## Python
- [Apache Arrow PyArrow FlightClient](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightClient.html#pyarrow.flight.FlightClient)
- [InfluxData flightsql-dbapi](https://github.com/influxdata/flightsql-dbapi)




