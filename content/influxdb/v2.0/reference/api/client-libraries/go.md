---
title: Go client library
list_title: Go
description: >
  Use the Go client library to interact with InfluxDB.
menu:
  influxdb_2_0_ref:
    name: Go
    parent: Client libraries
v2.0/tags: [client libraries, Go]
aliases:
  - /v2.0/reference/api/client-libraries/go-cl-guide/
weight: 201
---

Use the [InfluxDB Go client library](https://github.com/influxdata/influxdb-client-go) to integrate InfluxDB into Go scripts and applications.

This guide presumes some familiarity with Go and InfluxDB.
If just getting started, see [Getting started with InfluxDB](/v2.0/get-started/).

## Before you begin

1. Go 1.3 or later is required. 
2. Run ```go get github.com/influxdata/influxdb-client-go``` to download the client package in your $GOPATH, followed by ```go build``to build the package. 
3. Ensure that InfluxDB is running.
   If running InfluxDB locally, visit http://localhost:9999.
   (If using InfluxDB Cloud, visit the URL of your InfluxDB Cloud UI.
   For example: https://us-west-2-1.aws.cloud2.influxdata.com.)

## Write data to InfluxDB with Go

We are going to write some data as a point using the Go library.

In your Go program, import necessary packages and specify the entry point of our executable program. 
```go
package main

import (
	"context"
	"fmt"
	"time"

	influxdb2 "github.com/influxdata/influxdb-client-go"
)
```

Next, define a few variables with the name of your [bucket](/v2.0/organizations/buckets/), [organization](/v2.0/organizations/), and [token](/v2.0/security/tokens/).

```go
bucket = "<my-bucket>"
org = "<my-org>"
token = "<my-token>"
```

In order to write data, we need to create the the InfluxDB Go Client and pass in our named parameters: `url` and `token`.

```go
client := influxdb2.NewClient("http://localhost:9999", "my-token")
```

We create a write client with the `WriteApiBlocking` method and pass in our other named parameters: `org` and `bucket`. 

```go
writeApi := client.WriteApiBlocking("my-org", "my-bucket")
```

We need three more lines for our program to write data.
Create a [point](/v2.0/reference/glossary/#point) and write it to InfluxDB using the `WritePoint` method of the API writer struct.
Close the client to flush all pending writes and finish. 

```go
p := influxdb2.NewPoint("stat",
  map[string]string{"unit": "temperature"},
  map[string]interface{}{"avg": 24.5, "max": 45},
  time.Now())
writeApi.WritePoint(context.Background(), p)
client.Close()
```

### Complete example write script
```go
 func main() {
  bucket := "<my-bucket>"
  org := "<my-org>"
  token := "<my-token>"
	// Create new client with default option for server url authenticate by token
	client := influxdb2.NewClient("http://localhost:9999", token)
	// User blocking write client for writes to desired bucket
	writeApi := client.WriteApiBlocking(org, bucket)
	// Create point using full params constructor
	p := influxdb2.NewPoint("stat",
		map[string]string{"unit": "temperature"},
		map[string]interface{}{"avg": 24.5, "max": 45},
		time.Now())
  // Write point immediately
	writeApi.WritePoint(context.Background(), p)
  //  Ensures background processes finishes
  	  client.Close()
}
```
## Query data from InfluxDB with Go

In order to query data, we to create the client and the query client, similarly to to the write example above.  

```go
  client := influxdb2.NewClient("http://localhost:9999", "my-token")
  queryApi := client.QueryApi("my-org")
```

Next, we create a flux query and supply our `bucket` parameter. 

```flux
from(bucket:"<bucket>")
|> range(start: -1h)
|> filter(fn: (r) => r._measurement == "stat"
```

We query the InfluxDB server with our flux query. The query client returns the results as a FluxRecord object with a table structure. The `Query` method takes our flux query. 
The `Next` method iterates over our query response. The `TableChanged` method notices whe the group key has changed. 
The `Record` method returns last parsed FluxRecord and gives access to value and row properties. The `Value` method returns the actual field value. 

```go
 result, err := queryApi.Query(context.Background(), `from(bucket:"<bucket>")|> range(start: -1h) |> filter(fn: (r) => r._measurement == "stat")`)
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

The FluxRecord object has the following methods for accessing your data:
- ```Table()```: Returns index of the table record belongs to.
- ```Start()```: Returns the inclusive lower time bound of all records in the current table.
- ```Stop()```: Returns the exclusive upper time bound of all records in the current table.
- ```Time()```: Returns the time of the record.
- ```Value() ```: Returns the actual field value.
- ```Field()```: Returns the field name.
- ```Measurement()```: Returns the measurement name of the record.
- ```Values()```: Returns map of the values where key is the column name.
- ```ValueByKey(<your_tags>)```: Returns value for given column key for the record.


### Complete example query script

```
 func main() {
    // Create client
    client := influxdb2.NewClient("http://localhost:9999", "my-token")
    // Get query client
    queryApi := client.QueryApi("my-org")
    // Get QueryTableResult
    result, err := queryApi.Query(context.Background(), `from(bucket:"my-bucket")|> range(start: -1h) |> filter(fn: (r) => r._measurement == "stat")`)
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