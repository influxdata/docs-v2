---
title: Get started querying data
seotitle: Query data | Get started with InfluxDB Clustered
list_title: Query data
description: >
  Get started querying data in InfluxDB Clustered by learning about SQL and
  InfluxQL, and using tools like the influx3 CLI and InfluxDB client libraries.
menu:
  influxdb_clustered:
    name: Query data
    parent: Get started
    identifier: get-started-query-data
weight: 102
metadata: [3 / 3]
related:
  - /influxdb/clustered/query-data/
  - /influxdb/clustered/query-data/sql/
  - /influxdb/clustered/query-data/execute-queries/
  - /influxdb/clustered/reference/client-libraries/v3/
---

{{% product-name %}} supports multiple query languages:

- **SQL**: Traditional SQL powered by the [Apache Arrow DataFusion](https://arrow.apache.org/datafusion/)
  query engine. The supported SQL syntax is similar to PostgreSQL.
- **InfluxQL**: An SQL-like query language designed to query time series data stored in InfluxDB.

This tutorial walks you through the fundamentals of querying data in InfluxDB and
**focuses on using SQL** to query your time series data.
The InfluxDB SQL implementation is built using [Arrow Flight SQL](https://arrow.apache.org/docs/format/FlightSql.html),
a protocol for interacting with SQL databases using the Arrow in-memory format and the
[Flight RPC](https://arrow.apache.org/docs/format/Flight.html) framework.
It leverages the performance of [Apache Arrow](https://arrow.apache.org/) with
the simplicity of SQL.

{{% note %}}
The examples in this section of the tutorial query the
[**get-started** database](/influxdb/clustered/get-started/setup/#create-a-database) for data written in the
[Get started writing data](/influxdb/clustered/get-started/write/#write-line-protocol-to-influxdb) section.
{{% /note %}}

## Tools to execute queries

{{% product-name %}} supports many different tools for querying data, including:

{{< req type="key" text="Covered in this tutorial" color="magenta" >}}
- [`influx3` data CLI](?t=influx3+CLI#execute-an-sql-query){{< req "\*  " >}}
- [InfluxDB v3 client libraries](/influxdb/clustered/reference/client-libraries/v3/)
- [Flight clients](/influxdb/clustered/reference/client-libraries/flight/){{< req "\*  " >}}
- [Superset](/influxdb/clustered/query-data/sql/execute-queries/superset/)
- [Grafana](/influxdb/clustered/query-data/sql/execute-queries/grafana/)
- [InfluxQL with InfluxDB v1 HTTP API](/influxdb/clustered/query-data/influxql/execute-queries/influxdb-v1-api/)
- [Chronograf](/{{< latest "chronograf" >}}/)

## SQL query basics

The {{% product-name %}} SQL implementation is powered by the [Apache Arrow DataFusion](https://arrow.apache.org/datafusion/)
query engine which provides an SQL syntax similar to PostgreSQL.

{{% note %}}
This is a brief introduction to writing SQL queries for InfluxDB.
For more in-depth details, see [Query data with SQL](/influxdb/clustered/query-data/sql/).
{{% /note %}}

InfluxDB SQL queries most commonly include the following clauses:

{{< req type="key" >}}

- {{< req "\*">}} `SELECT`: Identify specific fields and tags to query from a
  measurement or use the wildcard alias (`*`) to select all fields and tags
  from a measurement.
- {{< req "\*">}} `FROM`: Identify the measurement to query.
  If coming from an SQL background, an InfluxDB measurement is the equivalent 
  of a relational table.
- `WHERE`: Only return data that meets defined conditions such as falling within
  a time range, containing specific tag values, etc.
- `GROUP BY`: Group data into SQL partitions and apply an aggregate or selector
  function to each group.

{{% influxdb/custom-timestamps %}}
```sql
-- Return the average temperature and humidity within time bounds from each room
SELECT
  avg(temp),
  avg(hum),
  room
FROM
  home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
GROUP BY
  room
```
{{% /influxdb/custom-timestamps %}}

#### Example SQL queries

##### Select all data in a measurement

```sql
SELECT * FROM home
```

##### Select all data in a measurement within time bounds

{{% influxdb/custom-timestamps %}}
```sql
SELECT
  *
FROM
  home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
```
{{% /influxdb/custom-timestamps %}}

##### Select a specific field within relative time bounds
```sql
SELECT temp FROM home WHERE time >= now() - INTERVAL '1 day'
```

##### Select specific fields and tags from a measurement
```sql
SELECT temp, room FROM home
```

##### Select data based on tag value
```sql
SELECT * FROM home WHERE room = 'Kitchen'
```

##### Select data based on tag value within time bounds

{{% influxdb/custom-timestamps %}}
```sql
SELECT
  *
FROM
  home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
  AND room = 'Living Room'
```
{{% /influxdb/custom-timestamps %}}

##### Downsample data by applying interval-based aggregates

{{% influxdb/custom-timestamps %}}
```sql
SELECT
  DATE_BIN(INTERVAL '1 hour', time, '2022-01-01T00:00:00Z'::TIMESTAMP) as _time,
  room
  selector_max(temp, time)['value'] AS 'max temp',
FROM
  home
GROUP BY
  _time,
  'max temp',
  room
ORDER BY room, _time
```
{{% /influxdb/custom-timestamps %}}

### Execute an SQL query

Get started with one of the following tools for querying data stored in an {{% product-name %}} database:

- **InfluxDB v3 client libraries**: Use language-specific (Python, Go, etc.) clients to execute queries in your terminal or custom code.
- **influx3 CLI**: Send queries from your terminal command-line.
- **Grafana**: Use the [FlightSQL Data Source plugin](https://grafana.com/grafana/plugins/influxdata-flightsql-datasource/), to query, connect, and visualize data.

For this example, use the following query to select all the data written to the
**get-started** database between
{{% influxdb/custom-timestamps-span %}}
**2022-01-01T08:00:00Z** and **2022-01-01T20:00:00Z**.
{{% /influxdb/custom-timestamps-span %}}

{{% influxdb/custom-timestamps %}}
```sql
SELECT
  *
FROM
  home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
```
{{% /influxdb/custom-timestamps %}}

{{% note %}}
Some examples in this getting started tutorial assume your InfluxDB
credentials (**URL**, **organization**, and **token**) are provided by
[environment variables](/influxdb/clustered/get-started/setup/?t=InfluxDB+API#configure-authentication-credentials).
{{% /note %}}

{{< tabs-wrapper >}}
{{% tabs %}}
[influx3 CLI](#influx3-cli)
[Python](#)
[Go](#)
[C#](#)
{{% /tabs %}}
{{% tab-content %}}
<!--------------------------- BEGIN influx3 CONTENT --------------------------->
{{% influxdb/custom-timestamps %}}

Query InfluxDB v3 using SQL and the [`influx3` CLI](https://github.com/InfluxCommunity/influxdb3-python-cli).

The following steps include setting up a Python virtual environment already
covered in [Get started writing data](/influxdb/clustered/get-started/write/?t=Python#write-line-protocol-to-influxdb).
_If your project's virtual environment is already running, skip to step 3._

1.  Setup your Python virtual environment.
    Inside of your project directory:

    ```sh
    python -m venv envs/virtual-env
    ```

2.  Activate the virtual environment.

    ```sh
    source ./envs/virtual-env/bin/activate
    ```

3.  Install the CLI package (already installed in the [Write data section](/influxdb/clustered/get-started/write/?t=Python#write-line-protocol-to-influxdb)).

    ```sh
    pip install influxdb3-python-cli
    ```

    Installing `influxdb3-python-cli` also installs the
    [`pyarrow`](https://arrow.apache.org/docs/python/index.html) library for working with Arrow data returned from queries.

4.  Create the `config.json` configuration.

    <!-- code-placeholders breaks when indented here -->
    ```sh
    influx3 config \
      --name="config-serverless" \
      --database="get-started" \
      --host="cluster-id.influxdb.io" \
      --token="DATABASE_TOKEN" \
      --org="ORG_ID"
    ```

    Replace the following:

    - **`DATABASE_TOKEN`**: a [database token](/influxdb/clustered/admin/tokens/) with
          read access to the **get-started** database
    - **`ORG_ID`**: any non-empty string (InfluxDB ignores this parameter, but the client requires it)

5.  Enter the `influx3 sql` command and your SQL query statement.

  ```sh
  influx3 sql "SELECT *
                FROM home
                WHERE time >= '2022-01-01T08:00:00Z'
                AND time <= '2022-01-01T20:00:00Z'"
  ```

`influx3` displays query results in your terminal.

{{% /influxdb/custom-timestamps %}}
<!--------------------------- END influx3 CONTENT --------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!--------------------------- BEGIN PYTHON CONTENT ---------------------------->
{{% influxdb/custom-timestamps %}}
Use the `influxdb_client_3` client library module to integrate {{< product-name >}} with your Python code.
The client library supports writing data to InfluxDB and querying data using SQL or InfluxQL.

The following steps include setting up a Python virtual environment already
covered in [Get started writing data](/influxdb/clustered/get-started/write/?t=Python#write-line-protocol-to-influxdb).
_If your project's virtual environment is already running, skip to step 3._

1.  Open a terminal in the `influxdb_py_client` module directory you created in the
    [Write data section](/influxdb/clustered/get-started/write/?t=Python#write-line-protocol-to-influxdb):

    1.  To create your Python virtual environment, enter the following command in your terminal:

        ```sh
        python -m venv envs/virtual-env
        ```

    2.  Activate the virtual environment.

        ```sh
        source ./envs/virtual-env/bin/activate
        ```

    3.  Install the following dependencies:

        {{< req type="key" text="Already installed in the [Write data section](/influxdb/clustered/get-started/write/?t=Python#write-line-protocol-to-influxdb)" color="magenta" >}}

        - [`influxdb3-python`{{< req text="\* " color="magenta" >}}](https://github.com/InfluxCommunity/influxdb3-python): Provides the InfluxDB `influxdb_client_3` Python client library module and also installs the [`pyarrow` package](https://arrow.apache.org/docs/python/index.html) for working with Arrow data returned from queries.
        - [`pandas`](https://pandas.pydata.org/): Provides `pandas` functions, modules, and data structures for analyzing and manipulating data.
        - [`tabulate`](https://pypi.org/project/tabulate/): Provides the `tabulate` function for formatting tabular data. pandas requires this module for formatting data as Markdown.

        In your terminal, enter the following command:

        ```sh
        pip install influxdb3-python pandas tabulate
        ```

    4.  In your terminal or editor, create a new file for your code--for example: `query.py`.

2.  In `query.py`, enter the following sample code:

    ```py
    from influxdb_client_3 import InfluxDBClient3
    import os

    # INFLUX_TOKEN is an environment variable you assigned to your 
    # database READ token string
    TOKEN = os.getenv('INFLUX_TOKEN')

    client = InfluxDBClient3(
        host="cluster-id.influxdb.io",
        token=TOKEN,
        database="get-started",
    )

    sql = '''
      SELECT
        *
      FROM
        home
      WHERE
        time >= '2022-01-01T08:00:00Z'
        AND time <= '2022-01-01T20:00:00Z'
    '''

    table = client.query(query=sql)
    print(reader.to_pandas().to_markdown())
    ```

{{< expand-wrapper >}}
{{% expand "<span class='req'>Important</span>: If using **Windows**, specify the **Windows** certificate path" %}}

  If using a non-POSIX-compliant operating system (such as Windows), specify the root certificate path when instantiating the client.
  The following example shows how to use the Python `certifi` package and client library options to pass the certificate path:

  1.  In your terminal, install the Python `certifi` package.

      ```sh
      pip install certifi
      ```
  
  2.  In your Python code, import `certifi` and call the `certifi.where()` method to retrieve the certificate path.
  3.  When instantiating the client, pass the `flight_client_options.tls_root_certs=<ROOT_CERT_PATH>` option with the certificate path--for example:

      ```py
      from influxdb_client_3 import InfluxDBClient3, flight_client_options
      import os
      import certifi

      TOKEN = os.getenv('INFLUX_TOKEN')

      fh = open(certifi.where(), "r")
      cert = fh.read()
      fh.close()

      client = InfluxDBClient3(
          host="cluster-id.influxdb.io",
          token=TOKEN,
          database="get-started",
          flight_client_options=flight_client_options(
              tls_root_certs=cert))
      ...
      ```
  
  For more information, see [`influxdb_client_3` query exceptions](/influxdb/clustered/reference/client-libraries/v3/python/#query-exceptions).

{{% /expand %}}
{{< /expand-wrapper >}}

  The sample code does the following:

  1.  Imports the `InfluxDBClient3` constructor from the `influxdb_client_3` module.
  
  2.  Calls the `InfluxDBClient3()` constructor method with credentials to instantiate an InfluxDB `client` with the following credentials:

      - **`host`**: {{% product-name %}} cluster URL (without `https://` protocol or trailing slash)
      - **`token`**: a [database token](/influxdb/clustered/admin/tokens/) with
        read access to the specified database.
        _Store this in a secret store or environment variable to avoid exposing the raw token string._
      - **`database`**: the name of the {{% product-name %}} database to query
  
  3.  Defines the SQL query to execute and assigns it to a `query` variable.

  4.  Calls the `client.query()` method with the SQL query.
      `query()` sends a
      Flight request to InfluxDB, queries the database, retrieves result data from the endpoint, and then returns a
      [`pyarrow.Table`](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html#pyarrow.Table)
      assigned to the `table` variable.

  5.  Calls the [`to_pandas()` method](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html#pyarrow.Table.to_pandas)
      to convert the Arrow table to a [`pandas.DataFrame`](https://arrow.apache.org/docs/python/pandas.html).

  6.  Calls the [`pandas.DataFrame.to_markdown()` method](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_markdown.html)
      to convert the DataFrame to a markdown table.

  7.  Calls the `print()` method to print the markdown table to stdout.

2.  Enter the following command to run the program and query your {{% product-name %}} cluster:

    ```sh
    python query.py
    ```

{{< expand-wrapper >}}
{{% expand "View returned markdown table" %}}

|    |   co |   hum | room        |   temp | time                |
|---:|-----:|------:|:------------|-------:|:--------------------|
|  0 |    0 |  35.9 | Kitchen     |   21   | 2022-01-01 08:00:00 |
|  1 |    0 |  36.2 | Kitchen     |   23   | 2022-01-01 09:00:00 |
|  2 |    0 |  36.1 | Kitchen     |   22.7 | 2022-01-01 10:00:00 |
|  3 |    0 |  36   | Kitchen     |   22.4 | 2022-01-01 11:00:00 |
|  4 |    0 |  36   | Kitchen     |   22.5 | 2022-01-01 12:00:00 |
|  5 |    1 |  36.5 | Kitchen     |   22.8 | 2022-01-01 13:00:00 |
|  6 |    1 |  36.3 | Kitchen     |   22.8 | 2022-01-01 14:00:00 |
|  7 |    3 |  36.2 | Kitchen     |   22.7 | 2022-01-01 15:00:00 |
|  8 |    7 |  36   | Kitchen     |   22.4 | 2022-01-01 16:00:00 |
|  9 |    9 |  36   | Kitchen     |   22.7 | 2022-01-01 17:00:00 |
| 10 |   18 |  36.9 | Kitchen     |   23.3 | 2022-01-01 18:00:00 |
| 11 |   22 |  36.6 | Kitchen     |   23.1 | 2022-01-01 19:00:00 |
| 12 |   26 |  36.5 | Kitchen     |   22.7 | 2022-01-01 20:00:00 |
| 13 |    0 |  35.9 | Living Room |   21.1 | 2022-01-01 08:00:00 |
| 14 |    0 |  35.9 | Living Room |   21.4 | 2022-01-01 09:00:00 |
| 15 |    0 |  36   | Living Room |   21.8 | 2022-01-01 10:00:00 |
| 16 |    0 |  36   | Living Room |   22.2 | 2022-01-01 11:00:00 |
| 17 |    0 |  35.9 | Living Room |   22.2 | 2022-01-01 12:00:00 |
| 18 |    0 |  36   | Living Room |   22.4 | 2022-01-01 13:00:00 |
| 19 |    0 |  36.1 | Living Room |   22.3 | 2022-01-01 14:00:00 |
| 20 |    1 |  36.1 | Living Room |   22.3 | 2022-01-01 15:00:00 |
| 21 |    4 |  36   | Living Room |   22.4 | 2022-01-01 16:00:00 |
| 22 |    5 |  35.9 | Living Room |   22.6 | 2022-01-01 17:00:00 |
| 23 |    9 |  36.2 | Living Room |   22.8 | 2022-01-01 18:00:00 |
| 24 |   14 |  36.3 | Living Room |   22.5 | 2022-01-01 19:00:00 |
| 25 |   17 |  36.4 | Living Room |   22.2 | 2022-01-01 20:00:00 |

{{% /expand %}}
{{< /expand-wrapper >}}
{{% /influxdb/custom-timestamps %}}
<!---------------------------- END PYTHON CONTENT ----------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN GO CONTENT ------------------------------>
{{% influxdb/custom-timestamps %}}
1.  In the `influxdb_go_client` directory you created in the
    [Write data section](/influxdb/clustered/get-started/write/?t=Go#write-line-protocol-to-influxdb),
    create a new file named `query.go`.

2.  In `query.go`, enter the following sample code:

    ```go
    package main

    import (
      "context"
      "fmt"
      "io"
      "os"
      "time"
      "text/tabwriter"

      "github.com/apache/arrow/go/v12/arrow"
      "github.com/InfluxCommunity/influxdb3-go/influx"
    )

    func Query() error {

      // INFLUX_TOKEN is an environment variable you created
      // for your database read token.
      token := os.Getenv("INFLUX_TOKEN")
      database := "get-started"

      // Instantiate the client.
      client, err := influx.New(influx.Configs{
        HostURL: "https://cluster-id.influxdb.io",
        AuthToken: token,
      })

      // Close the client when the function returns.
      defer func (client *influx.Client)  {
        err := client.Close()
        if err != nil {
            panic(err)
        }
      }(client)

      // Define the query.
      query := `SELECT *
        FROM home
        WHERE time >= '2022-01-02T08:00:00Z'
        AND time <= '2022-01-02T20:00:00Z'`

      // Execute the query.
      iterator, err := client.Query(context.Background(), database, query)

      if err != nil {
        panic(err)
      }

      w := tabwriter.NewWriter(io.Discard, 4, 4, 1, ' ', 0)
      w.Init(os.Stdout, 0, 8, 0, '\t', 0)
      fmt.Fprintln(w, "time\troom\ttemp\thum\tco")

      // Iterate over rows and prints column values in table format.
      for iterator.Next() {
        row := iterator.Value()
        // Use Go arrow and time packages to format unix timestamp
        // as a time with timezone layout (RFC3339).
        time := (row["time"].(arrow.Timestamp)).
          ToTime(arrow.TimeUnit(arrow.Nanosecond)).
          Format(time.RFC3339)
        fmt.Fprintf(w, "%s\t%s\t%d\t%.2f\t%.2f\n",
          time, row["room"], row["co"], row["hum"], row["temp"])
      }

      w.Flush()
      return nil
    }
    ```

    The sample code does the following:
    
    1.  Imports the following packages:

        - `context`
        - `fmt`
        - `io`
        - `os`
        - `text/tabwriter`
        - `github.com/apache/arrow/go/v12/arrow`
        - `github.com/InfluxCommunity/influxdb3-go/influx`

    2.  Defines a `Query()` function that does the following:

        1.  Instantiates `influx.Client` with InfluxDB credentials.
          
            - **`HostURL`**: your {{% product-name %}} cluster URL
            - **`AuthToken`**:  a [database token](/influxdb/clustered/admin/tokens/) with _read_  access to the specified database.
              _Store this in a secret store or environment variable to avoid exposing the raw token string._

        2.  Defines a deferred function to close the client after execution.
        3.  Defines a string variable for the SQL query.

        4.  Calls the `influx.Client.query()` method to send the query request with the database name and SQL string. The `query()` method returns an `iterator` for data in the response stream.
        5.  Iterates over rows, formats the timestamp as an[RFC3339 timestamp](/influxdb/clustered/reference/glossary/#rfc3339-timestamp), and prints the data in table format to stdout.

3.  In your editor, open the `main.go` file you created in the
    [Write data section](/influxdb/clustered/get-started/write/?t=Go#write-line-protocol-to-influxdb) and insert code to call the `Query()` function--for example:

    ```go
    package main

    func main() {	
      WriteLineProtocol()
      Query()
    }
    ```

    When the `main` package is executed, `main()` writes and queries data stored in {{% product-name %}}.

3.  In your terminal, enter the following command to install the necessary packages, build the module, and run the program:

    ```sh
    go mod tidy && go build && go run influxdb_go_client
    ```

    The program writes the data and prints the query results to the console.

{{< expand-wrapper >}}
{{% expand "View returned table" %}}
```sh
time                            room            co      hum     temp
2022-01-02 11:46:40 +0000 UTC   Kitchen         0       35.90   21.00
2022-01-02 12:46:40 +0000 UTC   Kitchen         0       36.20   23.00
2022-01-02 13:46:40 +0000 UTC   Kitchen         0       36.10   22.70
2022-01-02 14:46:40 +0000 UTC   Kitchen         0       36.00   22.40
2022-01-02 15:46:40 +0000 UTC   Kitchen         0       36.00   22.50
2022-01-02 16:46:40 +0000 UTC   Kitchen         1       36.50   22.80
2022-01-02 17:46:40 +0000 UTC   Kitchen         1       36.30   22.80
2022-01-02 18:46:40 +0000 UTC   Kitchen         3       36.20   22.70
2022-01-02 19:46:40 +0000 UTC   Kitchen         7       36.00   22.40
2022-01-02 11:46:40 +0000 UTC   Living Room     0       35.90   21.10
2022-01-02 12:46:40 +0000 UTC   Living Room     0       35.90   21.40
2022-01-02 13:46:40 +0000 UTC   Living Room     0       36.00   21.80
2022-01-02 14:46:40 +0000 UTC   Living Room     0       36.00   22.20
2022-01-02 15:46:40 +0000 UTC   Living Room     0       35.90   22.20
2022-01-02 16:46:40 +0000 UTC   Living Room     0       36.00   22.40
2022-01-02 17:46:40 +0000 UTC   Living Room     0       36.10   22.30
2022-01-02 18:46:40 +0000 UTC   Living Room     1       36.10   22.30
2022-01-02 19:46:40 +0000 UTC   Living Room     4       36.00   22.40
```
{{% /expand %}}
{{< /expand-wrapper >}}
{{% /influxdb/custom-timestamps %}}
<!------------------------------ END GO CONTENT ------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------ BEGIN C# CONTENT ----------------------------->
{{% influxdb/custom-timestamps %}}
```c#
// Query.cs

using System;
using System.Threading.Tasks;
using InfluxDB3.Client;
using InfluxDB3.Client.Query;

namespace InfluxDBv3;

public class Query
{
  /**
    * Queries an InfluxDB database using the C# .NET client
    * library.
    **/
  public static async Task QuerySQL()
  {
    /** Set InfluxDB credentials **/
    const string hostUrl = "https://cluster-id.influxdb.io";
    string? database = "get-started";

    /** INFLUX_TOKEN is an environment variable you assigned to your
      * API token value.
      **/
    string? authToken = System.Environment
        .GetEnvironmentVariable("INFLUX_TOKEN");

    /**
      * Instantiate the InfluxDB client with credentials.
      **/
    using var client = new InfluxDBClient(
        hostUrl, authToken: authToken, database: database);
  
    const string sql = @"
      SELECT time, room, temp, hum, co
      FROM home
      WHERE time >= '2022-01-02T08:00:00Z'
      AND time <= '2022-01-02T20:00:00Z'
    ";

    Console.WriteLine("{0,-30}{1,-15}{2,-15}{3,-15}{4,-15}",
        "time", "room", "temp", "hum", "co");
    
    await foreach (var row in client.Query(query: sql))
    {
      {
        /** 
          * Iterate over rows and print column values in table format.
          * Format the timestamp as sortable UTC format.
          */
        Console.WriteLine("{0,-30:u}{1,-15}{2,-15}{3,-15}{4,-15}",
            row[0], row[1], row[2], row[3], row[4]);
      }
    }
    Console.WriteLine();
  }
}
```

The sample code does the following:

1.  Imports the following classes:

    - `System`
    - `System.Threading.Tasks`;
    - `InfluxDB3.Client`;
    - `InfluxDB3.Client.Query`;

2.  Defines a `Query` class with a `QuerySQL()` method that does the following:

    1.  Calls the `new InfluxDBClient()` constructor to instantiate a client configured
           with InfluxDB credentials.
      
        - **`hostURL`**: your {{% product-name %}} cluster URL.
        - **`authToken`**: a [database token](/influxdb/clustered/admin/tokens/) with _read_  access to the specified database.
          _Store this in a secret store or environment variable to avoid exposing the raw token value._
        - **`database`**: the name of the {{% product-name %}} database to query.
    2.  Defines a string variable for the SQL query.
    3.  Calls the `InfluxDBClient.Query()` method to send the query request with the SQL string. `Query()` returns batches of rows from the response stream as a two-dimensional array--an array of rows in which each row is an array of values.
    4.  Iterates over rows and prints the data in table format to stdout.
3.  In your editor, open the `Program.cs` file you created in the
    [Write data section](/influxdb/clustered/get-started/write/?t=C%23#write-line-protocol-to-influxdb) and insert code to call the `Query()` function--for example:

      ```c#
      // Program.cs

      using System;
      using System.Threading.Tasks;

      namespace InfluxDBv3;

      public class Program
      {
        public static async Task Main()
        {
          await Write.WriteLineProtocol();
          await Query.QuerySQL();
        }
      }
      ```

4.  To execute the program and query your {{% product-name %}} cluster,
    enter the following commands in your terminal:

    ```sh
    dotnet build
    ```

    ```sh
    dotnet run
    ```

{{% /influxdb/custom-timestamps %}}
<!------------------------------ END C# CONTENT ------------------------------->

{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Query results

{{< expand-wrapper >}}
{{% expand "View query results" %}}

{{% influxdb/custom-timestamps %}}
| time                 | room        |  co |  hum | temp |
| :------------------- | :---------- | --: | ---: | ---: |
| 2022-01-01T08:00:00Z | Kitchen     |   0 | 35.9 |   21 |
| 2022-01-01T09:00:00Z | Kitchen     |   0 | 36.2 |   23 |
| 2022-01-01T10:00:00Z | Kitchen     |   0 | 36.1 | 22.7 |
| 2022-01-01T11:00:00Z | Kitchen     |   0 |   36 | 22.4 |
| 2022-01-01T12:00:00Z | Kitchen     |   0 |   36 | 22.5 |
| 2022-01-01T13:00:00Z | Kitchen     |   1 | 36.5 | 22.8 |
| 2022-01-01T14:00:00Z | Kitchen     |   1 | 36.3 | 22.8 |
| 2022-01-01T15:00:00Z | Kitchen     |   3 | 36.2 | 22.7 |
| 2022-01-01T16:00:00Z | Kitchen     |   7 |   36 | 22.4 |
| 2022-01-01T17:00:00Z | Kitchen     |   9 |   36 | 22.7 |
| 2022-01-01T18:00:00Z | Kitchen     |  18 | 36.9 | 23.3 |
| 2022-01-01T19:00:00Z | Kitchen     |  22 | 36.6 | 23.1 |
| 2022-01-01T20:00:00Z | Kitchen     |  26 | 36.5 | 22.7 |
| 2022-01-01T08:00:00Z | Living Room |   0 | 35.9 | 21.1 |
| 2022-01-01T09:00:00Z | Living Room |   0 | 35.9 | 21.4 |
| 2022-01-01T10:00:00Z | Living Room |   0 |   36 | 21.8 |
| 2022-01-01T11:00:00Z | Living Room |   0 |   36 | 22.2 |
| 2022-01-01T12:00:00Z | Living Room |   0 | 35.9 | 22.2 |
| 2022-01-01T13:00:00Z | Living Room |   0 |   36 | 22.4 |
| 2022-01-01T14:00:00Z | Living Room |   0 | 36.1 | 22.3 |
| 2022-01-01T15:00:00Z | Living Room |   1 | 36.1 | 22.3 |
| 2022-01-01T16:00:00Z | Living Room |   4 |   36 | 22.4 |
| 2022-01-01T17:00:00Z | Living Room |   5 | 35.9 | 22.6 |
| 2022-01-01T18:00:00Z | Living Room |   9 | 36.2 | 22.8 |
| 2022-01-01T19:00:00Z | Living Room |  14 | 36.3 | 22.5 |
| 2022-01-01T20:00:00Z | Living Room |  17 | 36.4 | 22.2 |
{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

**Congratulations!** You've learned the basics of querying data in InfluxDB with SQL.
For a deep dive into all the ways you can query {{% product-name %}}, see the
[Query data in InfluxDB](/influxdb/clustered/query-data/) section of documentation.

{{< page-nav prev="/influxdb/clustered/get-started/write/" keepTab=true >}}
