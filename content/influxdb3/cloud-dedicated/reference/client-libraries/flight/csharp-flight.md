---
title: C# .NET Flight client
description: The C# .NET Flight client integrates with C# .NET scripts and applications to query data stored in InfluxDB.
menu:
  influxdb3_cloud_dedicated:
    name: C# .NET
    parent: Arrow Flight clients
    identifier: csharp-flight-client
influxdb3/cloud-dedicated/tags: [C#, gRPC, SQL, Flight SQL, client libraries]
aliases:
  - /influxdb3/cloud-dedicated/reference/client-libraries/flight-sql/csharp-flightsql/
weight: 201
---

[Apache Arrow for C# .NET](https://github.com/apache/arrow/blob/main/csharp/README.md) integrates with C# .NET scripts and applications to query data stored in InfluxDB.

For more information, see the [C# client example on GitHub](https://github.com/apache/arrow/tree/main/csharp/examples/FlightClientExample).

> [!Note]
> #### Use InfluxDB 3 client libraries
> 
> Use the [`influxdb3-csharp` C# client library](/influxdb3/cloud-dedicated/reference/client-libraries/v3/csharp/) for integrating InfluxDB 3 with your C# application code.
> 
> [InfluxDB 3 client libraries](/influxdb3/cloud-dedicated/reference/client-libraries/v3/) wrap Apache Arrow Flight clients
> and provide convenient methods for [writing](/influxdb3/cloud-dedicated/get-started/write/#write-line-protocol-to-influxdb), [querying](/influxdb3/cloud-dedicated/get-started/query/#execute-an-sql-query), and processing data stored in {{% product-name %}}.
> Client libraries can query using SQL or InfluxQL.
