---
title: C# .NET Flight client
description: The C# .NET Flight client integrates with C# .NET scripts and applications to query data stored in InfluxDB.
menu:
  influxdb_clustered:
    name: C# .NET
    parent: Arrow Flight clients
    identifier: csharp-flight-client
influxdb/clustered/tags: [Flight client, C#, gRPC, SQL, Flight SQL, client libraries]
aliases:
  - /influxdb/clustered/reference/client-libraries/flight-sql/csharp-flightsql/
weight: 201
---

[Apache Arrow for C# .NET](https://github.com/apache/arrow/blob/main/csharp/README.md) integrates with C# .NET scripts and applications to query data stored in InfluxDB.

For more information, see the [C# client example on GitHub](https://github.com/apache/arrow/tree/main/csharp/examples/FlightClientExample).

{{% note %}}
#### Use InfluxDB v3 client libraries

We recommend using the [`influxdb3-csharp` C# client library](/influxdb/clustered/reference/client-libraries/v3/csharp/) for integrating InfluxDB v3 with your C# application code.

[InfluxDB v3 client libraries](/influxdb/clustered/reference/client-libraries/v3/) wrap Apache Arrow Flight clients
and provide convenient methods for [writing](/influxdb/clustered/get-started/write/#write-line-protocol-to-influxdb), [querying](/influxdb/clustered/get-started/query/#execute-an-sql-query), and processing data stored in {{% product-name %}}.
Client libraries can query using SQL or InfluxQL.
{{% /note %}}
