The InfluxDB 3 [`influxdb3-go` Go client library](https://github.com/InfluxCommunity/influxdb3-go) integrates with Go scripts and applications
to write and query data stored in an {{% product-name %}} database.

## Installation

```sh
go get github.com/InfluxCommunity/influxdb3-go/v2
```

## Importing the package

The `influxdb3-go` client library module provides the `influxdb3` package.

Import the package:

```go
import (
    "github.com/InfluxCommunity/influxdb3-go/v2/influxdb3"
)
```

## API reference

<!-- The `influxdb_client_3` module includes the following functions: -->

### Function `New`

Create a client to interact with InfluxDB.

#### Syntax

```go
New(config ClientConfig)
```

Initializes and returns a `influxdb3.Client` instance with the following:

- Configuration and functions for writing to the database.
- A `*flight.Client` and functions for querying the database.

#### Parameters

- **`config`**: A `ClientConfig` struct with the following configuration properties:

  - **`Host`** (string): the {{% product-name %}} server URL
  - **`Token`** (string): a database token string
  - **`Database`** (string): the database to use for writing and querying.
  - **`Organization`** (string): _Optional_. The organization name or ID.
  - **`HTTPClient`** (`*http.Client`): _Optional_. Specifies a custom HTTP client, TLS configuration, or timeout to use.
  - **`WriteOptions`** (`*WriteOptions`): _Optional_. Options passed to the write client for writing to the database.
  - **`Headers`** (`http.Header`): _Optional_. Headers to include in all requests.

#### Examples

##### Create an InfluxDB client

{{% code-placeholders "DATABASE_(NAME|TOKEN)" %}}
```go
package main

import (
    "github.com/InfluxCommunity/influxdb3-go/v2/influxdb3"
)

func main() {
    client, err := influxdb3.New(influxdb3.ClientConfig{
        Host:       "https://{{< influxdb/host >}}",
        Token:      "DATABASE_TOKEN",
        Database:   "DATABASE_NAME",
    })

    defer func(client *influxdb3.Client) {
        err := client.Close()
        if err != nil {
            panic(err)
        }
    }(client)

    if(err != nil) {
        panic(err)
    }
}
```
{{% /code-placeholders %}}

Replace the following configuration values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the InfluxDB [database](/influxdb3/version/admin/databases/) to query
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  an InfluxDB [database token](/influxdb3/version/admin/tokens/#database-tokens)
  with _read_ permission on the specified database

## Class influxdb3.Client

### Function `Client.Query()`

Query data from InfluxDB 3 using SQL.

#### Syntax

```go
client.Query(ctx context.Context, query string)
```

Sends a Flight query request with SQL to InfluxDB.

Returns the following:

- A custom iterator (*QueryIterator) for accessing query result data and metadata.
- An error, if any.

#### Parameters

- **`ctx`** (`context.Context`): the context to use for the request
- **`query`** (string): the SQL query to execute.

#### Examples

##### Query using SQL

```go
query := `SELECT *
  FROM home
  WHERE time >= '2022-01-02T08:00:00Z'
  AND time <= '2022-01-02T20:00:00Z'`

iterator, err := client.Query(context.Background(), query)
```

### Function `Client.QueryWithOptions()`

Query data from InfluxDB 3 with query options such as **query type** for querying with InfluxQL.

#### Syntax

```go
client.QueryWithOptions(ctx context.Context, options *QueryOptions, query string)
```

Sends a query request with the specified query options to InfluxDB.

Returns the following:

- A custom iterator (*QueryIterator) for accessing query result data and metadata.
- An error, if any.

#### Parameters

- **`ctx`** (`context.Context`): the context to use for the request
- **`options`**: query options (query type, optional database)
- **`query`** (string): the SQL or InfluxQL query to execute.

#### Examples

##### Query using InfluxQL

```go
query := `SELECT *
  FROM home
  WHERE time >= 1641124000s
  AND time <= 1641124000s + 8h`
queryOptions := influxdb3.QueryOptions{QueryType: influxdb3.InfluxQL}
iterator, err := client.QueryWithOptions(context.Background(), &queryOptions, query)
```
