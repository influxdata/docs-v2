---
title: Flight SQL clients
description: >
  Use Flight SQL clients to connect to and query InfluxDB powered by the IOx storage engine, including InfluxDB Cloud Dedicated.
  View the list of available client libraries.
weight: 30
menu:
  influxdb_cloud_dedicated:
    name: Flight SQL clients
    parent: Client libraries
influxdb/cloud-dedicated/tags: [client libraries, Flight SQL]
---

Flight SQL clients and drivers are language-specific packages that can connect to Flight Servers
like InfluxDB powered by the IOx storage engine.
Clients provide a [`FlightClient`](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightClient.html#pyarrow.flight.FlightClient) that can query and retrieve data from InfluxDB Cloud Dedicated using gRPC and Flight SQL.
Some [InfluxDB v3 client libraries](/influxdb/cloud-dedicated/reference/client-libraries/v3) include Flight SQL clients.

For specifics about a client library, see the library's GitHub repository.

{{< children depth="999" description="true" >}}
