Use the [InfluxDB Go client library](https://github.com/influxdata/influxdb-client-go) to write data to an {{% product-name %}} database.

This guide presumes some familiarity with Go and InfluxDB.
If just getting started, see [Get started with InfluxDB](/influxdb3/version/get-started/).

## Before you begin

1. [Install Go 1.13 or later](https://golang.org/doc/install).
2. Add the client package your to your project dependencies.

    ```sh
    # Add InfluxDB Go client package to your project go.mod
    go get github.com/influxdata/influxdb-client-go/v2
    ```
3. Ensure that InfluxDB is running and you can connect to it.
   For information about what URL to use to connect to your {{% product-name omit=" Clustered" %}} cluster, contact your InfluxData account representative.

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

2. Define variables for your InfluxDB [database](/influxdb3/version/admin/databases/) (bucket), organization (required, but ignored), and [database token](/influxdb3/version/admin/tokens/#database-tokens).

   ```go
   bucket := "DATABASE_NAME"
   org := "ignored"
   token := "DATABASE_TOKEN"
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

1. Create a [point](/influxdb3/version/reference/glossary/#point) and write it to InfluxDB using the `WritePoint` method of the API writer struct.

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
    bucket := "DATABASE_NAME"
    org := "ignored"
    token := "DATABASE_TOKEN"
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
