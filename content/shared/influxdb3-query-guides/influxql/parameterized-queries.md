
Parameterized queries in {{% product-name %}} let you dynamically and safely change values in a query.
If your application code allows user input to customize values or expressions in a query, use a parameterized query to make sure untrusted input is processed strictly as data and not executed as code.

Parameterized queries:

- help prevent injection attacks, which can occur if input is executed as code
- help make queries more reusable

> [!Note]
> #### Prevent injection attacks
>
> For more information on security and query parameterization,
> see the [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/> SQL_Injection_Prevention_Cheat_Sheet.html#defense-option-1-prepared-statements-with-parameterized-queries).

In InfluxDB 3, a parameterized query is an InfluxQL or SQL query that contains one or more named parameter placeholders–variables that represent input data.

- [Use parameters in `WHERE` expressions](#use-parameters-in-where-expressions)
- [Parameter data types](#parameter-data-types)
  - [Data type examples](#data-type-examples)
  - [Time expressions](#time-expressions)
  - [Not compatible with parameters](#not-compatible-with-parameters)
- [Parameterize an SQL query](#parameterize-an-sql-query)
- [Execute parameterized InfluxQL queries](#execute-parameterized-influxql-queries)
{{% show-in "core,enterprise" %}}
  - [Use the HTTP API](#use-the-http-api)
{{% /show-in %}}
  - [Use InfluxDB Flight RPC clients](#use-influxdb-flight-rpc-clients)
- [Client support for parameterized queries](#client-support-for-parameterized-queries)
- [Not supported](#not-supported)

> [!Note]
>
> #### Parameters only supported in `WHERE` expressions
>
> InfluxDB 3 supports parameters in `WHERE` clause **predicate expressions**.
> Parameter values must be one of the [allowed parameter data types](#parameter-data-types).
>
> If you use parameters in other expressions or clauses,
> such as function arguments, `SELECT`, or `GROUP BY`, then your query might not work as you expect.

## Use parameters in `WHERE` expressions

You can use parameters in `WHERE` clause **predicate expressions**-–for example, the following query contains a `$temp` parameter:

```sql
SELECT * FROM measurement WHERE temp > $temp
```

When executing a query, you specify parameter name-value pairs.
The value that you assign to a parameter must be one of the [parameter data types](#parameter-data-types).

```go
{"temp": 22.0}
```

The InfluxDB Querier parses the query text with the parameter placeholders, and then generates query plans that replace the placeholders with the values that you provide.
This separation of query structure from input data ensures that input is treated as one of the allowed [data types](#parameter-data-types) and not as executable code.

## Parameter data types

A parameter value can be one of the following data types:

- Null
- Boolean
- Unsigned integer (`u_int64`)
- Integer (`int64`)
- Double (`float64`)
- String

### Data type examples

```js
{
  "string": "Living Room",
  "double": 3.14,
  "unsigned_integer": 1234,
  "integer": -1234,
  "boolean": false,
  "null": Null,
}
```

### Time expressions

To parameterize time bounds, substitute a parameter for a timestamp literal--for example:

```sql
SELECT *
FROM home
WHERE time >= $min_time
```

For the parameter value, specify the timestamp literal as a string--for example:

{{% influxdb/custom-timestamps %}}

```go
// Assign a timestamp string literal to the min_time parameter.
parameters := influxdb3.QueryParameters{
    "min_time": "2022-01-01 00:00:00.00",
}
```

{{% /influxdb/custom-timestamps %}}

InfluxDB executes the query as the following:

{{% influxdb/custom-timestamps %}}

```sql
SELECT *
FROM home
WHERE time >= '2022-01-01 00:00:00.00'
```

{{% /influxdb/custom-timestamps %}}

### Not compatible with parameters

If you use parameters for the following, your query might not work as you expect:

- In clauses other than `WHERE`, such as `SELECT` or `GROUP BY`
- As function arguments, such as `avg($temp)`
- In place of identifiers, such as column or table names
- In place of duration literals, such as `time > now() - $min_duration`

## Parameterize an SQL query

> [!Note]
> #### Sample data
> 
> The following examples use the {{< influxdb3/home-sample-link >}}.
> To run the example queries and return results,
> [write the sample data](/influxdb3/version/reference/sample-data/#write-the-home-sensor-data-to-influxdb)
> to your {{% product-name %}} database before running the example queries.

To use a parameterized query, do the following:

1. In your query text, use the `$parameter` syntax to reference a parameter name--for example,
the following query contains `$room` and `$min_temp` parameter placeholders:

   ```sql
   SELECT *
   FROM home
   WHERE time > now() - 7d
   AND temp >= $min_temp
   AND room = $room
   ```

2. Provide a value for each parameter name.
   If you don't assign a value for a parameter, InfluxDB returns an error.
   The syntax for providing parameter values depends on the client you use--for example:

   <!-- I expect to add more client examples soon -->

   {{< code-tabs-wrapper >}}
   {{% code-tabs %}}
   [Go](#)
   {{% /code-tabs %}}
   {{% code-tab-content %}}
   <!------------------------ BEGIN GO ------------------------------------------->
   ```go
   // Define a QueryParameters struct--a map of parameters to input values.
   parameters := influxdb3.QueryParameters{
       "room": "Kitchen",
       "min_temp": 20.0,
   }
   ```
   <!-------------------------- END GO ------------------------------------------->
   {{% /code-tab-content %}}
   {{< /code-tabs-wrapper >}}

After InfluxDB receives your request and parses the query, it executes the query as

```sql
SELECT *
FROM home
WHERE time > now() - 7d
AND temp >= 20.0
AND room = 'Kitchen'
```

## Execute parameterized InfluxQL queries

> [!Note]
> #### Sample data
>
> The following examples use the {{< influxdb3/home-sample-link >}}.
> To run the example queries and return results,
> [write the sample data](/influxdb3/version/reference/sample-data/#write-the-home-sensor-data-to-influxdb)
> to your {{% product-name %}} database before running the example queries.

{{% show-in "core,enterprise" %}}

### Use the HTTP API

{{% product-name %}} provides the `/api/v3/query_influxql` HTTP API endpoint for executing InfluxQL queries with parameters.

{{% api-endpoint method="POST" endpoint="/api/v3/query_influxql" api-ref="/influxdb3/version/api/v3/#operation/PostExecuteQueryInfluxQL" %}}

Send a JSON object that contains `db` (database), `q` (query), and `params` (parameter name-value pairs) properties in the request body.

The following example sends a parameterized InfluxQL query to the `/api/v3/query_influxql` endpoint:

{{% influxdb/custom-timestamps %}}

```bash {placeholders="DATABASE_NAME|AUTH_TOKEN"}
curl "http://localhost:8181/api/v3/query_influxql" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "q": "SELECT * FROM home WHERE time >= $min_time AND temp >= $min_temp AND room = $room",
    "params": {
      "min_time": "2022-01-01T08:00:00Z",
      "min_temp": 22.0,
      "room": "Kitchen"
    }
  }'
```

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to query
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with permission to query the specified database{{% /show-in %}}

{{% /influxdb/custom-timestamps %}}

The response body contains query results in JSON format:

{{% influxdb/custom-timestamps %}}

```json
[
  {"iox::measurement":"home","time":"2022-01-01T09:00:00","co":0,"hum":36.2,"room":"Kitchen","temp":23.0},
  {"iox::measurement":"home","time":"2022-01-01T10:00:00","co":0,"hum":36.1,"room":"Kitchen","temp":22.7},
  {"iox::measurement":"home","time":"2022-01-01T11:00:00","co":0,"hum":36.0,"room":"Kitchen","temp":22.4},
  {"iox::measurement":"home","time":"2022-01-01T12:00:00","co":0,"hum":36.0,"room":"Kitchen","temp":22.5}
]
```

{{% /influxdb/custom-timestamps %}}

{{% /show-in %}}

### Use InfluxDB Flight RPC clients

Using the InfluxDB 3 native Flight RPC protocol and supported clients, you can send a parameterized query and a list of parameter name-value pairs.
InfluxDB Flight clients that support parameterized queries pass the parameter name-value pairs in a Flight ticket `params` field.

The following examples show how to use client libraries to execute parameterized InfluxQL queries:

<!-- Using code-tabs because I expect to add more client examples soon -->

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Go](#)
{{% /code-tabs %}}

{{% code-tab-content %}}

```go
import (
    "context"
    "fmt"
    "io"
    "os"
    "text/tabwriter"
    "time"
    "github.com/InfluxCommunity/influxdb3-go/v2/influxdb3"
)

func Query(query string, parameters influxdb3.QueryParameters,
 options influxdb3.QueryOptions) error {
    url := os.Getenv("INFLUX_HOST")
    token := os.Getenv("INFLUX_TOKEN")
    database := os.Getenv("INFLUX_DATABASE")

    // Instantiate the influxdb3 client.
    client, err := influxdb3.New(influxdb3.ClientConfig{
        Host:     url,
        Token:    token,
        Database: database,
    })

    if err != nil {
        panic(err)
    }

    // Ensure the client is closed after the Query function finishes.
    defer func(client *influxdb3.Client) {
        err := client.Close()
        if err != nil {
            panic(err)
        }
    }(client)

    // Call the client's QueryWithParameters function.
    // Provide the query, parameters, and the InfluxQL QueryType option.
    iterator, err := client.QueryWithParameters(context.Background(), query,
    parameters, influxdb3.WithQueryType(options.QueryType))

    // Create a buffer for storing rows as you process them.
    w := tabwriter.NewWriter(io.Discard, 4, 4, 1, ' ', 0)
    w.Init(os.Stdout, 0, 8, 0, '\t', 0)

    fmt.Fprintf(w, "time\troom\tco\thum\ttemp\n")

    // Format and write each row to the buffer.
    // Process each row as key-value pairs.
    for iterator.Next() {
        row := iterator.Value()
        // Use Go time package to format unix timestamp
        // as a time with timezone layout (RFC3339 format)
        time := (row["time"].(time.Time)).
                Format(time.RFC3339)

        fmt.Fprintf(w, "%s\t%s\t%d\t%.1f\t%.1f\n",
            time, row["room"], row["co"], row["hum"], row["temp"])
    }
    w.Flush()

    return nil
}

func main() {
    // Use the $placeholder syntax in a query to reference parameter placeholders
    // for input data.
    // The following InfluxQL query contains the placeholders $room and $min_temp.
    query := `
        SELECT *
        FROM home
        WHERE time > now() - 7d
        AND temp >= $min_temp
        AND room = $room`

    // Define a QueryParameters struct--a map of placeholder names to input values.
    parameters := influxdb3.QueryParameters{
        "room": "Kitchen",
        "min_temp": 20.0,
    }

    Query(query, parameters, influxdb3.QueryOptions{
        QueryType: influxdb3.InfluxQL,
    })
}
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Client support for parameterized queries

- Not all [InfluxDB 3 Flight clients](/influxdb3/version/reference/client-libraries/v3/) support parameterized queries.
- InfluxDB doesn't currently support parameterized queries or DataFusion prepared statements for Flight SQL or Flight SQL clients.
- InfluxDB 3 SQL and InfluxQL parameterized queries aren’t supported in InfluxDB v1 and v2 clients.

## Not supported

Currently, parameterized queries in {{% product-name %}} don't provide the following:

- support for DataFusion prepared statements
- query caching, optimization, or performance benefits
