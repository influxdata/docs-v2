---
title: Use Go to query data
seotitle: Use Go and SQL or InfluxQL to query data
list_title: Use Go
description: >
  Use the `influxdb3-go` Go package and SQL or InfluxQL to query data stored in InfluxDB.
  Execute queries and retrieve data over the Flight+gRPC protocol, and then process data using common Go tools.
weight: 401
menu:
  influxdb_cloud_serverless:
    parent: Use client libraries
    name: Use Go
    identifier: query-with-go
metadata: [InfluxQL, SQL]
influxdb/cloud-serverless/tags: [Flight client, query, flight, go, sql, influxql]
related:
    - /influxdb/cloud-serverless/reference/client-libraries/v3/go/
    - /influxdb/cloud-serverless/reference/sql/
    - /influxdb/cloud-serverless/reference/client-libraries/flight/
list_code_example: |
    ```go
    import (
      "context"
      "github.com/InfluxCommunity/influxdb3-go/influxdb3/v1"
    )

    func Query() error {
        client, err := influxdb3.New(influxdb3.ClientConfig{
            Host:       "https://cloud2.influxdata.com",
            Token:      "DATABASE_TOKEN",
            Database:   "DATABASE_NAME",
        })

        defer func(client *influxdb3.Client) {
            err := client.Close()
            if err != nil {
                panic(err)
            }
        }(client)

        query := `SELECT *
            FROM home
            WHERE time >= '2022-01-02T08:00:00Z'
            AND time <= '2022-01-02T20:00:00Z'`

        iterator, err := client.Query(context.Background(), query)
        ...
    }
    ```
---

Use the InfluxDB `influxdb3-go` Go client library package and SQL or InfluxQL to query data stored in InfluxDB.
Execute queries and retrieve data over the Flight+gRPC protocol, and then process data using common Go tools.

<!-- TOC -->

- [Get started using Go to query InfluxDB](#get-started-using-go-to-query-influxdb)
  - [Install Go](#install-go)
  - [Create a Go module directory](#create-a-go-module-directory)
  - [Install dependencies](#install-dependencies)
  - [Execute a query](#execute-a-query)
    - [Query using SQL](#query-using-sql)
    - [Query using InfluxQL](#query-using-influxql)
  - [Run the example](#run-the-example)

<!-- /TOC -->

## Get started using Go to query InfluxDB

The following example shows how to use Go with the `influxdb3-go`
module to create a client and query an {{% product-name %}} database.

### Install Go

Follow the [Go download and installation instructions](https://go.dev/doc/install)
to install a recent version of the Go programming language for your system.

### Create a Go module directory

1.  Inside of your project directory, create a new module directory and navigate into it.

    ```sh
    mkdir influxdb_go_client && cd $_
    ```

2.  Enter the following command to initialize a new Go module:

    ```sh
    go mod init influxdb_go_client
    ```

### Install dependencies

In your terminal, enter the following command to download and install the client library:

```sh
go get github.com/InfluxCommunity/influxdb3-go
```

- [`influxdb3-go`](https://github.com/InfluxCommunity/influxdb3-go) {{< req text="\* " color="magenta" >}}: Provides the `influxdb3` package and also installs the [Apache `arrow` module](https://arrow.apache.org/docs/python/index.html) for working with Arrow data returned from queries.

With the dependencies installed, you're ready to query and
analyze data stored in an InfluxDB database.

### Execute a query

The following examples show how to create an [InfluxDB client](/influxdb/cloud-serverless/reference/client-libraries/v3/go/#function-new), use client query methods to select all fields in a measurement, and then access query result data and metadata.

In your `influxdb_go_client` module directory, create a file named `query.go` and enter one of the following samples to query using SQL or InfluxQL.

Replace the following configuration values in the sample code:

- {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}}: the name of the InfluxDB [bucket](/influxdb/cloud-serverless/admin/buckets/) to query
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: an InfluxDB [API token](/influxdb/cloud-serverless/admin/tokens/) with _read_ permission on the specified bucket


{{% tabs-wrapper %}}
{{% tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /tabs %}}
{{% tab-content %}}
<!---- BEGIN SQL EXAMPLE --->
{{% influxdb/custom-timestamps %}}

#### Query using SQL

{{% code-placeholders "BUCKET_NAME|API_TOKEN" %}}
```go
// query.go
package main

import (
    "context"
    "fmt"
    "io"
    "os"
    "text/tabwriter"
    "time"

    "github.com/InfluxCommunity/influxdb3-go/influxdb3/v1"
)

func Query() error {

    // Instantiate the client.
    client, err := influxdb3.New(influxdb3.ClientConfig{
        Host:       "https://{{< influxdb/host >}}",
        Token:      "API_TOKEN",
        Database:   "BUCKET_NAME",
    })

    defer func(client *influxdb3.Client) {
        err := client.Close()
        if err != nil {
            panic(err)
        }
    }(client)

    query := `SELECT *
        FROM home
        WHERE time >= '2022-01-02T08:00:00Z'
        AND time <= '2022-01-02T20:00:00Z'`

    // Example 1: Query data and then read the schema and all data in the result stream.
    iterator, err := client.Query(context.Background(), query)

    fmt.Fprintln(os.Stdout, "Read all data in the stream:")
    data, err := iterator.Raw().Reader.Read()
    fmt.Fprintln(os.Stdout, data)

    if err != nil {
        panic(err)
    }

    // Example 2: Query data, view the result schema, and then process result data by row.
    iterator2, err = client.Query(context.Background(), query)
    fmt.Fprintln(os.Stdout, "View the query result schema:")
    schema := iterator2.Raw().Reader.Schema()
    fmt.Fprintln(os.Stdout, schema)

    w := tabwriter.NewWriter(io.Discard, 4, 4, 1, ' ', 0)
    w.Init(os.Stdout, 0, 8, 0, '\t', 0)

    fmt.Fprintln(w, "Process each row as key-value pairs:")
    for iterator2.Next() {
        row := iterator2.Value()
        // Use Go time package to format unix timestamp
        // as a time with timezone layout (RFC3339)
        time := (row["time"].(time.Time)).
            Format(time.RFC3339)
        fmt.Fprintf(w, "%s\t%s\t%d\t%.1f\t%.1f\n",
            time, row["room"], row["co"], row["hum"], row["temp"])
    }
    w.Flush()
}

```
{{% /code-placeholders %}}
{{% /influxdb/custom-timestamps %}}

The sample code does the following:

1.  Defines a `main` package for your module and imports packages you'll use in your code.
2.  Defines a `Query()` function.
3.  Instantiates the `influxdb3` client with InfluxDB credentials and assigns it to a `client` variable.
4.  Defines a deferred function that closes the client when `Query()` has finished executing.
5.  Defines an SQL query to execute.
6.  Calls the client's `Query(ctx context.Context, query string)` method and passes the SQL string as the `query` argument.
    `Query()` returns the following:
    - `*influxdb3.QueryIterator`: A custom iterator for reading data from the query result stream.
    - `error`: A Flight request error.

<!---- END SQL EXAMPLE ---->
{{% /tab-content %}}
{{% tab-content %}}
<!---- BEGIN INFLUXQL EXAMPLE ---->
{{% influxdb/custom-timestamps %}}

#### Query using InfluxQL

{{% code-placeholders "BUCKET_NAME|API_TOKEN" %}}
```go
// query.go

package main

import (
    "context"
    "fmt"
    "io"
    "os"
    "text/tabwriter"
    "time"

    "github.com/InfluxCommunity/influxdb3-go/influxdb3/v1"
)

func InfluxQL() error {

    // Instantiate the client.
    client, err := influxdb3.New(influxdb3.ClientConfig{
        Host:       "https://{{< influxdb/host >}}",
        Token:      "API_TOKEN",
        Database:   "BUCKET_NAME",
    })

    defer func(client *influxdb3.Client) {
        err := client.Close()
        if err != nil {
            panic(err)
        }
    }(client)

    query := `SELECT *
        FROM home
        WHERE time >= 1641124000s
        AND time <= 1641124000s + 8h`
    
    queryOptions := influxdb3.QueryOptions{
        QueryType: influxdb3.InfluxQL,
    }

    // Example 1: Query data and then read the schema and all data in the result stream.
    iterator, err := client.QueryWithOptions(context.Background(), &queryOptions, query)

    fmt.Fprintln(os.Stdout, "Read all data in the stream:")
    data, err := iterator.Raw().Reader.Read()
    fmt.Fprintln(os.Stdout, data)

    if err != nil {
        panic(err)
    }
    
    // Example 2: Query data, view the result schema, and then process result data row by row.
    iterator2, err = client.QueryWithOptions(context.Background(), &queryOptions, query)

    fmt.Fprintln(os.Stdout, "View the query result schema:")
    schema := iterator2.Raw().Reader.Schema()
    fmt.Fprintln(os.Stdout, schema)

    w := tabwriter.NewWriter(io.Discard, 4, 4, 1, ' ', 0)
    w.Init(os.Stdout, 0, 8, 0, '\t', 0)

    fmt.Fprintln(w, "Process each row as key-value pairs:")
    for iterator2.Next() {
        row := iterator2.Value()
        // Use Go time package to format unix timestamp
        // as a time with timezone layout (RFC3339)
        time := (row["time"].(time.Time)).
            Format(time.RFC3339)
        fmt.Fprintf(w, "%s\t%s\t%d\t%.1f\t%.1f\n",
            time, row["room"], row["co"], row["hum"], row["temp"])
    }
    w.Flush()
}
```
{{% /code-placeholders %}}
{{% /influxdb/custom-timestamps %}}

The sample code does the following:

1.  Defines a `main` package for your module and imports packages you'll use in your code.
2.  Defines a `Query()` function.
3.  Instantiates the `influxdb3` client with InfluxDB credentials and assigns it to a `client` variable.
4.  Defines a deferred function that closes the client when `Query()` has finished executing.
5.  Defines an InfluxQL query to execute.
6.  Calls the following client method:

    [`QueryWithOptions(ctx context.Context, options *QueryOptions, query string)`](https://github.com/InfluxCommunity/influxdb3-go/blob/9225231e68ac1b90e8519e7d5d12706e66758041/influxdb3/query.go#L90)

    and passes the following arguments:
    
    - **options**: A `QueryOptions` struct with the `QueryType` property set to `influxdb3.InfluxQL`.
    - **query**: A string. The SQL or InfluxQL query to execute.
    `QueryWithOptions` returns the following:
        - `*influxdb3.QueryIterator`: A custom iterator that provides access to query result data and metadata.
        - `error`: A Flight request error.
<!---- END INFLUXQL EXAMPLE ---->
{{% /tab-content %}}
{{% /tabs-wrapper %}}

### Run the example

1.  In your `influxdb_go_client` module directory, create a file named `main.go`.
2.  In `main.go`, enter the following sample code to define a `main()` executable function that calls the `Query()` function:

    ```go
    package main

    func main() {    
      Query()
    }
    ```

3.  In your terminal, enter the following command to install the necessary packages, build the module, and run the program:

    ```sh
    go build && go run influxdb_go_client
    ```

    The program executes the `main()` function that writes the data and prints the query results to the console.

