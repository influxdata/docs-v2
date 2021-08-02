---
title: Go client library
seotitle: InfluxDB Go client library
list_title: Go
description: >
  Use the Go client library to interact with InfluxDB.
menu:
  influxdb_2_0:
    name: Go
    parent: Client libraries
influxdb/v2.0/tags: [client libraries, Go]
weight: 201
aliases:
  - /influxdb/v2.0/reference/api/client-libraries/go/
---

Use the [InfluxDB Go client library](https://github.com/influxdata/influxdb-client-go) to integrate InfluxDB into Go scripts and applications.

This guide presumes some familiarity with Go and InfluxDB.
If just getting started, see [Get started with InfluxDB](/influxdb/v2.0/get-started/).

## Before you begin

1. [Install Go 1.13 or later](https://golang.org/doc/install).
2. Add the client package your to your project dependencies.

    ```sh
    # Add InfluxDB Go client package to your project go.mod
    go get github.com/influxdata/influxdb-client-go
    ```
3. Ensure that InfluxDB is running and you can connect to it.
   For information about what URL to use to connect to InfluxDB OSS or InfluxDB Cloud, see [InfluxDB URLs](/influxdb/v2.0/reference/urls/).

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

2. Define variables for your InfluxDB [bucket](/influxdb/v2.0/organizations/buckets/), [organization](/influxdb/v2.0/organizations/), and [token](/influxdb/v2.0/security/tokens/).

   ```go
   bucket := "example-bucket"
   org := "example-org"
   token := "example-token"
   // Store the URL of your InfluxDB instance
   url := "http://localhost:8086"
   ```

3. Create the the InfluxDB Go client and pass in the `url` and `token` parameters.

   ```go
   client := influxdb2.NewClient(url, token)
   ```

4. Create a **write client** with the `WriteAPIBlocking` method and pass in the `org` and `bucket` parameters.

   ```go
   writeAPI := client.WriteAPIBlocking(org, bucket)
   ```

5. To query data, create an InfluxDB **query client** and pass in your InfluxDB `org`.

   ```go
   queryAPI := client.QueryAPI(org)
   ```

## Write data to InfluxDB with Go

Use the Go library to write data to InfluxDB.

1. Create a [point](/influxdb/v2.0/reference/glossary/#point) and write it to InfluxDB using the `WritePoint` method of the API writer struct.

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
func main() {
    bucket := "example-bucket"
    org := "example-org"
    token := "example-token"
    // Store the URL of your InfluxDB instance
    url := "http://localhost:8086"
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
## Query data from InfluxDB with Go
Use the Go library to query data to InfluxDB.

1. Create a Flux query and supply your `bucket` parameter.

   ```js
   from(bucket:"<bucket>")
    |> range(start: -1h)
    |> filter(fn: (r) => r._measurement == "stat")
   ```

   The query client sends the Flux query to InfluxDB and returns the results as a FluxRecord object with a table structure.

**The query client includes the following methods:**

- `Query`: Sends the Flux query to InfluxDB.
- `Next`: Iterates over the query response.
- `TableChanged`: Identifies when the group key changes.
- `Record`: Returns the last parsed FluxRecord and gives access to value and row properties.
- `Value`: Returns the actual field value.

```go
result, err := queryAPI.Query(context.Background(), `from(bucket:"<bucket>")
    |> range(start: -1h) 
    |> filter(fn: (r) => r._measurement == "stat")`)
if err == nil {
    for result.Next() {
        if result.TableChanged() {
            fmt.Printf("table: %s\n", result.TableMetadata().String())
        }
        fmt.Printf("value: %v\n", result.Record().Value())
    }
    if result.Err() != nil {
        fmt.Printf("query parsing error: %s\n", result.Err().Error())
    }
} else {
    panic(err)
}
```

**The FluxRecord object includes the following methods for accessing your data:**

- `Table()`: Returns the index of the table the record belongs to.
- `Start()`: Returns the inclusive lower time bound of all records in the current table.
- `Stop()`: Returns the exclusive upper time bound of all records in the current table.
- `Time()`: Returns the time of the record.
- `Value() `: Returns the actual field value.
- `Field()`: Returns the field name.
- `Measurement()`: Returns the measurement name of the record.
- `Values()`: Returns a map of column values.
- `ValueByKey(<your_tags>)`: Returns a value from the record for given column key.

### Complete example query script

```go
 func main() {
    // Create client
    client := influxdb2.NewClient(url, token)
    // Get query client
    queryAPI := client.QueryAPI(org)
    // Get QueryTableResult
    result, err := queryAPI.Query(context.Background(), `from(bucket:"my-bucket")|> range(start: -1h) |> filter(fn: (r) => r._measurement == "stat")`)
    if err == nil {
        // Iterate over query response
        for result.Next() {
            // Notice when group key has changed
            if result.TableChanged() {
                fmt.Printf("table: %s\n", result.TableMetadata().String())
            }
            // Access data
            fmt.Printf("value: %v\n", result.Record().Value())
        }
        // Check for an error
        if result.Err() != nil {
            fmt.Printf("query parsing error: %s\n", result.Err().Error())
        }
    } else {
        panic(err)
    }
    // Ensures background processes finishes
    client.Close()
}
```

For more information, see the [Go client README on GitHub](https://github.com/influxdata/influxdb-client-go).
