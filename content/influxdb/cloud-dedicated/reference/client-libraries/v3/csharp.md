---
title: C# .NET client library for InfluxDB v3
list_title: C# .NET
description: >
  The InfluxDB v3 `influxdb3-csharp` C# .NET client library integrates with C# .NET scripts and applications to write and query data stored in an InfluxDB Cloud Dedicated database.
external_url: https://github.com/InfluxCommunity/influxdb3-csharp
menu:
  influxdb_cloud_dedicated:
    name: C# .NET
    parent: v3 client libraries
    identifier: influxdb3-csharp
influxdb/cloud-dedicated/tags: [C#, gRPC, SQL, Flight SQL, client libraries]
weight: 201
list_code_example: >
  ```csharp
  
  // This example demonstrates how to use the InfluxDB v3 C# .NET client library

  // to write sensor data to an InfluxDB database and query data from the last 90 days.
  
  using System;
  
  using System.Threading.Tasks;
  
  using InfluxDB3.Client;
  
  using InfluxDB3.Client.Api.Domain;

  
  class Program
  {
      static async Task Main(string[] args)
      {
          // Initialize the InfluxDB client
          var client = new InfluxDBClient("https://your-influxdb-url", "your-auth-token", "your-organization-id", "your-database-name");

          try
          {
              // Write sensor data to the database
              await WriteSensorData(client);

              // Query data from the last 90 days
              await QuerySensorData(client);
          }
          finally
          {
              // Dispose the client to release resources
              client.Dispose();
          }
      }

      private static async Task WriteSensorData(InfluxDBClient client)
      {
          // Create a point with tags, fields, and a timestamp
          var point = new Point
          {
              Measurement = "home",
              Tags = { { "room", "living_room" } },
              Fields = { { "temperature", 23.5 } },
              Timestamp = DateTime.UtcNow
          };

          // Write the point to the database
          await client.WritePointAsync(point);
          Console.WriteLine("Data successfully written to InfluxDB.");
      }

      private static async Task QuerySensorData(InfluxDBClient client)
      {
          // Define the Flux query
          var query = @"
              from(bucket: ""your-database-name"")
                  |> range(start: -90d)
                  |> filter(fn: (r) => r._measurement == ""home"")";

          // Execute the query
          var result = await client.QueryAsync(query);

          // Print the results
          Console.WriteLine("Queried data:");
          foreach (var record in result)
          {
              Console.WriteLine($"{record.Timestamp}: {record.Values["_value"]}");
          }
      }
  }

---

The InfluxDB v3 [`influxdb3-csharp` C# .NET client library](https://github.com/InfluxCommunity/influxdb3-csharp) integrates with C# .NET scripts and applications
to write and query data stored in an {{% product-name %}} database.

The documentation for this client library is available on GitHub.

<a href="https://github.com/InfluxCommunity/influxdb3-csharp" target="_blank" class="btn github">InfluxDB v3 C# .NET client library</a>
