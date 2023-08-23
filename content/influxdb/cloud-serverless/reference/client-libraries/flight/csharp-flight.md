---
title: C# .NET Flight client
description: The C# .NET Flight client integrates with C# .NET scripts and applications to query data stored in InfluxDB.
menu:
  influxdb_cloud_serverless:
    name: C# .NET
    parent: Arrow Flight clients
    identifier: csharp-flight-client
influxdb/cloud-serverless/tags: [C#, gRPC, SQL, Flight SQL, client libraries]
aliases:
  - /influxdb/cloud-serverless/reference/client-libraries/flight-sql/csharp-flightsql/
weight: 201
---

[Apache Arrow for C# .NET](https://github.com/apache/arrow/blob/main/csharp/README.md) integrates with C# .NET scripts and applications to query data stored in InfluxDB.

For more information, see the [C# client example on GitHub](https://github.com/apache/arrow/tree/main/csharp/examples/FlightClientExample).

{{% note %}}
#### Use InfluxDB v3 client libraries

We recommend using the [`influxdb3-csharp` C# client library](/influxdb/cloud-serverless/reference/client-libraries/v3/csharp/) for integrating InfluxDB v3 with your C# application code.

[InfluxDB v3 client libraries](/influxdb/cloud-serverless/reference/client-libraries/v3/) client libraries wrap Apache Arrow Flight clients
and provide convenient methods for [writing](/influxdb/cloud-serverless/get-started/write/#write-line-protocol-to-influxdb), [querying](/influxdb/cloud-serverless/get-started/query/#execute-an-sql-query), and processing data stored in {{% cloud-name %}}.
Client libraries can query using SQL or InfluxQL.
{{% /note %}}
