---
title: Flight SQL clients
description: >
  Flight SQL clients are language-specific drivers that can interact with SQL databases using the Arrow in-memory format and the Flight RPC framework.
  View the list of available clients.
weight: 30
menu:
  influxdb_cloud_serverless:
    name: Flight SQL clients
    parent: Client libraries
influxdb/cloud-serverless/tags: [client libraries, Flight SQL]
---

Flight SQL clients are language-specific drivers that can interact with SQL databases using the Arrow in-memory format and the Flight RPC framework.
Clients provide a [`FlightClient`](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightClient.html#pyarrow.flight.FlightClient) that can query and retrieve data from InfluxDB v3 using gRPC and Flight SQL.
Some [InfluxDB v3 client libraries](/influxdb/cloud-serverless/reference/client-libraries/v3) include Flight SQL clients.

For specifics about a client library, see the library's GitHub repository.

{{< children depth="999" description="true" >}}
