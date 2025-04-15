---
title: InfluxDB v2 Go client library
list_title: Go
description: >
   The InfluxDB v2 Go client library integrates with Go applications to write data to an InfluxDB Cloud Serverless bucket.
menu:
  influxdb3_cloud_serverless:
    name: Go
    parent: v2 client libraries
influxdb3/cloud-serverless/tags: [client libraries, Go]
weight: 201
prepend: |
   > [!WARNING]
   > ### Use InfluxDB 3 clients
   > 
   > The `/api/v2/query` API endpoint and associated tooling, such as InfluxDB v2 client libraries and the `influx` CLI, **can't** query an {{% product-name omit=" Clustered" %}} cluster.
   > 
   > [InfluxDB 3 client libraries](/influxdb3/{{% product-key %}}/client-libraries/v3/) are available that integrate with your code to write and query data stored in {{% product-name %}}.
   > 
   > InfluxDB 3 supports many different tools for [**writing**](/influxdb3/cloud-serverless/write-data/) and [**querying**](/influxdb3/cloud-serverless/query-data/) data.
   > [**Compare tools you can use**](/influxdb3/cloud-serverless/get-started/#tools-to-use) to interact with {{% product-name %}}.
---

The [InfluxDB Go client library](https://github.com/influxdata/influxdb-client-go)
integrates with Go applications to write data to an {{% product-name %}} bucket.

This guide presumes some familiarity with Go and InfluxDB.
If just getting started, see [Get started with InfluxDB](/influxdb3/cloud-serverless/get-started/).

## Before you begin

1. [Install Go 1.13 or later](https://golang.org/doc/install).
2. Add the client package your to your project dependencies.

    ```sh
    # Add InfluxDB Go client package to your project go.mod
    go get github.com/influxdata/influxdb-client-go/v2
    ```
3. Ensure that InfluxDB is running and you can connect to it.
   For information about what URL to use to connect to InfluxDB Cloud, see [InfluxDB URLs](/influxdb3/cloud-serverless/reference/urls/).

## Boilerplate for the InfluxDB Go Client Library  

Use the Go library to write and query data from InfluxDB.

1. In your Go program, import the necessary packages and specify the entry point of your executable program.

   ```go
   package main

   import (
       "context"
       "fmt"
       "time"

       "github.com/influxdata/influxdb-client-go/v2"
   )
   ```

2. Define variables for your InfluxDB [bucket](/influxdb3/cloud-serverless/organizations/buckets/) and [token](/influxdb3/cloud-serverless/security/tokens/).
   For `org`, pass a non-empty string (this parameter is ignored by InfluxDB, but required by the client).

   ```go
   bucket := "BUCKET_NAME"
   org := "ignored"
   token := "API_TOKEN"
   // Store the URL of your InfluxDB instance
   url := "https://{{< influxdb/host >}}"
   ```

3. Create the the InfluxDB Go client and pass in the `url` and `token` parameters.

   ```go
   client := influxdb2.NewClient(url, token)
   ```

4. Create a **write client** with the `WriteAPIBlocking` method and pass in the `org` and `bucket` parameters.

   ```go
   writeAPI := client.WriteAPIBlocking(org, bucket)
   ```

## Write data to InfluxDB with Go

Use the Go library to write data to InfluxDB.

1. Create a [point](/influxdb3/cloud-serverless/reference/glossary/#point) and write it to InfluxDB using the `WritePoint` method of the API writer struct.

2. Close the client to flush all pending writes and finish.

   ```go
   p := influxdb2.NewPoint("stat",
     map[string]string{"unit": "temperature"},
     map[string]interface{}{"avg": 24.5, "max": 45},
     time.Now())
   writeAPI.WritePoint(context.Background(), p)
   client.Close()
   ```

### Complete example write script

```go
package main

import (
      "context"
      "fmt"
      "time"

      "github.com/influxdata/influxdb-client-go/v2"
)

func main() {
    bucket := "BUCKET_NAME"
    org := "ignored"
    token := "API_TOKEN"
    // Store the URL of your InfluxDB instance
    url := "https://{{< influxdb/host >}}"
    // Create new client with default option for server url authenticate by token
    client := influxdb2.NewClient(url, token)
    // User blocking write client for writes to desired bucket
    writeAPI := client.WriteAPIBlocking(org, bucket)
    // Create point using full params constructor
    p := influxdb2.NewPoint("stat",
        map[string]string{"unit": "temperature"},
        map[string]interface{}{"avg": 24.5, "max": 45},
        time.Now())
    // Write point immediately
    writeAPI.WritePoint(context.Background(), p)
    // Ensures background processes finishes
    client.Close()
}
```
