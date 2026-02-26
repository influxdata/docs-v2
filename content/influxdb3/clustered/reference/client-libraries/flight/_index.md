---
title: Apache Arrow Flight RPC clients
description: >
  Flight clients are language-specific drivers that can interact with Flight servers using the Arrow in-memory format and the Flight RPC framework.
  View the list of available clients.
weight: 30
menu:
  influxdb3_clustered:
    name: Arrow Flight clients
    parent: Client libraries
influxdb3/clustered/tags: [client libraries, Flight RPC, Flight SQL]
aliases:
  - /influxdb3/clustered/reference/client-libraries/flight-sql/
  - /influxdb3/clustered/reference/client-libraries/flight-sql/go-flightsql/
  - /influxdb3/clustered/reference/client-libraries/flight-sql/python-flightsql-dbapi/
---

Flight RPC and Flight SQL clients are language-specific drivers that interact with databases using the Arrow in-memory format and the Flight RPC protocol.
Apache Arrow Flight RPC and Flight SQL protocols define APIs for servers and clients.

> [!Note]
> #### Use InfluxDB 3 client libraries
> 
> Use [InfluxDB 3 client libraries](/influxdb3/clustered/reference/client-libraries/v3/) for integrating InfluxDB 3 with your application code.
> Client libraries wrap Apache Arrow Flight clients
> and provide convenient methods for [writing](/influxdb3/clustered/get-started/write/#write-line-protocol-to-influxdb), [querying](/influxdb3/clustered/get-started/query/#execute-an-sql-query), and processing data stored in {{% product-name %}}.

**Flight RPC clients** can use SQL or InfluxQL to query data stored in an {{% product-name %}} database.
Using InfluxDB 3's IOx-specific Flight RPC protocol, clients send a single `DoGet()` request to authenticate, query, and retrieve data.

**Flight SQL clients** use the [Flight SQL protocol](https://arrow.apache.org/docs/format/FlightSql.html) for querying an SQL database server.
They can use SQL to query data stored in an {{% product-name %}} database, but they can't use InfuxQL.

Clients are maintained by Apache Arrow projects or third-parties.
For specifics about a Flight client, see the client's GitHub repository.

{{< children >}}
