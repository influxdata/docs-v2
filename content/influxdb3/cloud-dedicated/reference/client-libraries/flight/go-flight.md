---
title: Go Flight client
description: The Go Flight client integrates with Go scripts and applications to query data stored in InfluxDB.
menu:
  influxdb3_cloud_dedicated:
    name: Go
    parent: Arrow Flight clients
    identifier: go-flight-client
influxdb3/cloud-dedicated/tags: [Flight client, Go, gRPC, SQL, Flight SQL, client libraries]
related:
  - /influxdb3/cloud-dedicated/reference/client-libraries/v3/go/
aliases:
  - /influxdb3/cloud-dedicated/reference/client-libraries/flight-sql/go-flightsql/
weight: 201
---

[Apache Arrow for Go](https://pkg.go.dev/github.com/apache/arrow/go/v12) integrates with Go scripts and applications to query data stored in InfluxDB.

> [!Note]
> #### Use InfluxDB 3 client libraries
> 
> Use the [`influxdb3-go` Go client library](/influxdb3/cloud-dedicated/reference/client-libraries/v3/go/) for integrating InfluxDB 3 with your Go application code.
> 
> [InfluxDB 3 client libraries](/influxdb3/cloud-dedicated/reference/client-libraries/v3/) wrap Apache Arrow Flight clients
> and provide convenient methods for [writing](/influxdb3/cloud-dedicated/get-started/write/#write-line-protocol-to-influxdb), [querying](/influxdb3/cloud-dedicated/get-started/query/#execute-an-sql-query), and processing data stored in {{% product-name %}}.
> Client libraries can query using SQL or InfluxQL.

## Flight SQL client

### Example query using Flight SQL

The following example shows how to use the Arrow Flight SQL client for Go to query an {{% product-name %}} database:

1.  In your editor, open a new file named `query.go` and enter the following sample code:

    ```go
    package main

    import (
      "context"
      "crypto/x509"
      "encoding/json"
      "fmt"
      "os"

      "github.com/apache/arrow/go/v14/arrow/flight/flightsql"
      "google.golang.org/grpc"
      "google.golang.org/grpc/credentials"
      "google.golang.org/grpc/metadata"
    )

    func dbQuery(ctx context.Context) error {
      url := "{{< influxdb/host >}}:443"

      // INFLUX_TOKEN is an environment variable you created for your database READ token
      token := os.Getenv("INFLUX_TOKEN")
      database := "get-started"

      // Create a gRPC transport
      pool, err := x509.SystemCertPool()
      if err != nil {
        return fmt.Errorf("x509: %s", err)
      }
      transport := grpc.WithTransportCredentials(credentials.NewClientTLSFromCert(pool, ""))
      opts := []grpc.DialOption{
        transport,
      }

      // Create query client
      client, err := flightsql.NewClient(url, nil, nil, opts...)
      if err != nil {
        return fmt.Errorf("flightsql: %s", err)
      }

      ctx = metadata.AppendToOutgoingContext(ctx, "authorization", "Bearer "+token)
      ctx = metadata.AppendToOutgoingContext(ctx, "database", database)

      // Execute query
      query := `SELECT
        *
      FROM
        home
      WHERE
        time >= '2022-01-01T08:00:00Z'
        AND time <= '2022-01-01T20:00:00Z'`

      info, err := client.Execute(ctx, query)
      if err != nil {
        return fmt.Errorf("flightsql flight info: %s", err)
      }
      reader, err := client.DoGet(ctx, info.Endpoint[0].Ticket)
      if err != nil {
        return fmt.Errorf("flightsql do get: %s", err)
      }

      // Print results as JSON
      for reader.Next() {
        record := reader.Record()
        b, err := json.MarshalIndent(record, "", "  ")
        if err != nil {
          return err
        }
        fmt.Println("RECORD BATCH")
        fmt.Println(string(b))

        if err := reader.Err(); err != nil {
          return fmt.Errorf("flightsql reader: %s", err)
        }
      }

      return nil
    }

    func main() {
      if err := dbQuery(context.Background()); err != nil {
        fmt.Fprintf(os.Stderr, "error: %v\n", err)
        os.Exit(1)
      }
    }
    ```

    The sample does the following:
    
    1.  Imports the following packages:

        - `context`
        - `crypto/x509`
        - `encoding/json`
        - `fmt`
        - `os`
        - `github.com/apache/arrow/go/v14/arrow/flight/flightsql`
        - `google.golang.org/grpc`
        - `google.golang.org/grpc/credentials`
        - `google.golang.org/grpc/metadata`

    2.  Creates a `dbQuery` function that does the following:

        1.  Defines variables for InfluxDB credentials.
          
            - **`url`**: {{% product-name omit=" Clustered" %}} cluster hostname and port (`:443`) _(no protocol)_
            - **`database`**: the name of the {{% product-name %}} database to query
            - **`token`**:  a [database token](/influxdb3/cloud-dedicated/get-started/setup/#create-an-all-access-api-token) with read permission on the specified database.
          _For security reasons, we recommend setting this as an environment
          variable rather than including the raw token string._


        2.  Defines an `opts` options list that includes a gRPC transport for communicating
        with InfluxDB over the _gRPC+TLS_ protocol.
        3.  Calls the `flightsql.NewClient()` method with `url` and `opts` to create a new Flight SQL client.
        4.  Appends the following InfluxDB credentials as key-value pairs to the outgoing context:

            - **`authorization`**: Bearer <INFLUX_TOKEN>
            - **`database`**: Database name

        5.  Defines the SQL query to execute.
        6.  Calls the `client.execute()` method to send the query request.
        7.  Calls the `client.doGet()` method with the _ticket_ from the query response to retrieve result data from the endpoint.
        8.  Creates a reader to read the Arrow table returned by the endpoint and print
            the results as JSON.

    3.  Creates a `main` module function that executes the `dbQuery` function.

2.  Enter the following commands to install all the necessary packages and run the program to query {{% product-name %}}:

    ```sh
    go get ./...
    go run ./query.go
    ```

{{% influxdb/custom-timestamps %}}
{{< expand-wrapper >}}
{{% expand "View program output" %}}
```json
RECORD BATCH
[
  {
    "co": 0,
    "hum": 35.9,
    "room": "Kitchen",
    "temp": 21,
    "time": "2022-01-01 08:00:00"
  },
  {
    "co": 0,
    "hum": 36.2,
    "room": "Kitchen",
    "temp": 23,
    "time": "2022-01-01 09:00:00"
  },
  {
    "co": 0,
    "hum": 36.1,
    "room": "Kitchen",
    "temp": 22.7,
    "time": "2022-01-01 10:00:00"
  },
  {
    "co": 0,
    "hum": 36,
    "room": "Kitchen",
    "temp": 22.4,
    "time": "2022-01-01 11:00:00"
  },
  {
    "co": 0,
    "hum": 36,
    "room": "Kitchen",
    "temp": 22.5,
    "time": "2022-01-01 12:00:00"
  },
  ...
]
```
{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{< /expand-wrapper >}}

For more information, see the [Go Arrow Flight Client documentation](https://pkg.go.dev/github.com/apache/arrow/go/v14/arrow/flight#Client).
