---
title: Get started querying data
seotitle: Query data | Get started with InfluxDB
list_title: Query data
description: >
  Get started querying data in InfluxDB by learning about SQL and InfluxQL, and
  using tools like the InfluxDB UI, `influx` CLI, InfluxDB API, and InfluxDB client libraries.
menu:
  influxdb_cloud_serverless:
    name: Query data
    parent: Get started
    identifier: get-started-query-data
weight: 102
metadata: [3 / 3]
related:
  - /influxdb/cloud-serverless/query-data/
  - /influxdb/cloud-serverless/query-data/sql/
  - /influxdb/cloud-serverless/query-data/execute-queries/
  - /influxdb/cloud-serverless/reference/client-libraries/flight-sql/
---

{{% cloud-name %}} supports multiple query languages:

- **SQL**: Traditional SQL powered by the [Apache Arrow DataFusion](https://arrow.apache.org/datafusion/)
  query engine. The supported SQL syntax is similar to PostgreSQL.
- **InfluxQL**: A SQL-like query language designed to query time series data stored in InfluxDB.

This tutorial walks you through the fundamentals of querying data in InfluxDB and
**focuses on using SQL** to query your time series data.
The InfluxDB SQL implementation is built using [Arrow Flight SQL](https://arrow.apache.org/docs/format/FlightSql.html),
a protocol for interacting with SQL databases using the Arrow in-memory format and the
[Flight RPC](https://arrow.apache.org/docs/format/Flight.html) framework.
It leverages the performance of [Apache Arrow](https://arrow.apache.org/) with
the simplicity of SQL.

{{% note %}}
The examples in this section of the tutorial query the [**get-started** bucket](/influxdb/cloud-serverless/get-started/setup/) for data written in the
[Get started writing data](/influxdb/cloud-serverless/get-started/write/#write-line-protocol-to-influxdb) section.
{{% /note %}}

## Tools to execute queries

{{% cloud-name %}} supports many different tools for querying data, including:

{{< req type="key" text="Covered in this tutorial" >}}

- [InfluxDB user interface (UI)](?t=InfluxDB+UI#execute-an-sql-query){{< req "\*  " >}}
- [`influx3` data CLI](?t=influx3+CLI#execute-an-sql-query){{< req "\*  " >}}
- [InfluxDB v3 client libraries](/influxdb/cloud-serverless/reference/client-libraries/v3/)
- [Flight SQL clients](?t=Go#execute-an-sql-query){{< req "\*  " >}}
- [Superset](/influxdb/cloud-serverless/query-data/sql/execute-queries/superset/)
- [Grafana](/influxdb/cloud-serverless/query-data/sql/execute-queries/grafana/)
- [Chronograf](/{{< latest "Chronograf" >}}/)
- [InfluxDB HTTP API](?t=InfluxDB+API#execute-an-sql-query){{< req "\*  " >}}
- [`influx` CLI](?t=influx+CLI#execute-an-sql-query){{< req "\*  " >}}

## SQL query basics

The {{% cloud-name %}} SQL implementation is powered by the [Apache Arrow DataFusion](https://arrow.apache.org/datafusion/)
query engine which provides a SQL syntax similar to PostgreSQL.

{{% note %}}
This is a brief introduction to writing SQL queries for InfluxDB.
For more in-depth details, see [Query data with SQL](/influxdb/cloud-serverless/query-data/sql/).
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
```sql
SELECT
  *
FROM
  home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
```

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

##### Downsample data by applying interval-based aggregates
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

### Execute an SQL query

Get started with one of the following tools for querying data stored in an {{% cloud-name %}} bucket:

- **InfluxDB UI**: View your schema, build queries using the query editor, and generate data visualizations.
- **InfluxDB v3 client libraries**: Use language-specific (Python, Go, etc.) clients to execute queries in your terminal or custom code.
- **influx3 CLI**: Send queries from your terminal command-line.
- **Grafana**: Query InfluxDB v3 with the [FlightSQL Data Source plugin](https://grafana.com/grafana/plugins/influxdata-flightsql-datasource/) and connect and visualize data.

For this example, use the following query to select all the data written to the
**get-started** bucket between
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
All API, cURL, and client library examples in this getting started tutorial assume your InfluxDB
**host**, **organization**, **url**, and **token** are provided by
[environment variables](/influxdb/cloud-serverless/get-started/setup/?t=InfluxDB+API#configure-authentication-credentials).
{{% /note %}}

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#influxdb-ui)
[influx3 CLI](#influx3-cli)
[Python](#)
[Go](#)
[influx CLI](#influx-cli)
[InfluxDB API](#influxdb-http-api)
{{% /tabs %}}

{{% tab-content %}}
<!--------------------------- BEGIN UI CONTENT --------------------------->

1.  Go to
    {{% oss-only %}}[localhost:8086](http://localhost:8086){{% /oss-only %}}
    {{% cloud-only %}}[cloud2.influxdata.com](https://cloud2.influxdata.com){{% /cloud-only %}}
    in a browser to log in and access the InfluxDB UI.

2.  In the side navigation  menu, click **Data Explorer**.

{{< nav-icon "data-explorer" "v4" >}}

3.  In the schema browser on the left, select the **get-started** bucket from the
    **bucket** drop-down menu.
    The displayed measurements and fields are read-only and are meant to show
    you the schema of data stored in the selected bucket.

4.  Enter the SQL query in the text editor.

5.  Click **{{< icon "play" >}} {{% caps %}}Run{{% /caps %}}**.

Results are displayed under the query editor.

See [Query in the Data Explorer](/influxdb/cloud-serverless/query-data/execute-queries/data-explorer/) to learn more.

<!---------------------------- END UI CONTENT ---------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!--------------------------- BEGIN influx3 CONTENT --------------------------->
{{% influxdb/custom-timestamps %}}

Query InfluxDB v3 using SQL and the [`influx3` CLI](https://github.com/InfluxCommunity/influxdb3-python-cli).

The following steps include setting up a Python virtual environment already
covered in [Get started writing data](/influxdb/cloud-serverless/get-started/write/?t=Python#write-line-protocol-to-influxdb).
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

3.  Install the CLI package (already installed in the [Write data section](/influxdb/cloud-serverless/get-started/write/?t=Python#write-line-protocol-to-influxdb)).

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
      --host="cloud2.influxdata.com" \
      --token="API_TOKEN" \
      --org="ORG_ID"
      ```

      Replace the following:

      - **`API_TOKEN`**: an InfluxDB [API token](/influxdb/cloud-serverless/get-started/setup/#create-an-all-access-api-token) with _read_ access to the **get-started** bucket
      - **`ORG_ID`**: an InfluxDB [organization ID](/influxdb/cloud-serverless/admin/organizations/)

5. Enter the `influx3 sql` command and your SQL query statement.

  ```sh
  influx3 sql "SELECT *
                FROM home
                WHERE time >= '2022-01-01T08:00:00Z'
                AND time <= '2022-01-01T20:00:00Z'"
  ```

`influx3` displays query results in your terminal.

For more information about the `influx3` CLI, see the [`InfluxCommunity/
influxdb3-python-cli
`](https://github.com/InfluxCommunity/influxdb3-python-cli) community repository on GitHub.
 {{% /influxdb/custom-timestamps %}}
<!--------------------------- END influx3 CONTENT --------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!--------------------------- BEGIN PYTHON CONTENT ---------------------------->
 {{% influxdb/custom-timestamps %}}
Use the `influxdb_client_3` client library module to integrate {{< cloud-name >}} with your Python code.
The client library supports writing data to InfluxDB and querying data using SQL or InfluxQL.

The following steps include setting up a Python virtual environment already
covered in [Get started writing data](/influxdb/cloud-serverless/get-started/write/?t=Python#write-line-protocol-to-influxdb).
_If your project's virtual environment is already running, skip to step 3._

1.  Open a terminal in the `influxdb_py_client` module directory you created in the
    [Write data section](/influxdb/cloud-serverless/get-started/write/?t=Python#write-line-protocol-to-influxdb):

    1.  To create your Python virtual environment, enter the following command in your terminal:

        ```sh
        python -m venv envs/virtual-env
        ```

    2.  Activate the virtual environment.

        ```sh
        source ./envs/virtual-env/bin/activate
        ```

    3.  Install the following dependencies:

        {{< req type="key" text="Already installed in the [Write data section](/influxdb/cloud-serverless/get-started/write/?t=Python#write-line-protocol-to-influxdb)" color="magenta" >}}

        - [`influxdb3-python`{{< req text="\* " color="magenta" >}}](https://github.com/InfluxCommunity/influxdb3-python): Provides the InfluxDB `influxdb_client_3` Python client library module and also installs the [`pyarrow` package](https://arrow.apache.org/docs/python/index.html) for working with Arrow data returned from queries.
        - [`pandas`](https://pandas.pydata.org/): Provides `pandas` functions, modules, and data structures for analyzing and manipulating data.
        - [`tabulate`](https://pypi.org/project/tabulate/): Provides the `tabulate` function for formatting tabular data.

        In your terminal, enter the following command:

        ```sh
        pip install influxdb3-python pandas tabulate
        ```

    4. In your terminal or editor, create a new file for your code--for example: `query.py`.

2.  In `query.py`, enter the following sample code:

    ```py
    from influxdb_client_3 import InfluxDBClient3
    import os

    # INFLUX_TOKEN is an environment variable you assigned to your API token string
    TOKEN = os.getenv('INFLUX_TOKEN')

    client = InfluxDBClient3(
        host="cloud2.influxdata.com",
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

    The sample code does the following:

    1.  Imports the `InfluxDBClient3` constructor from the `influxdb_client_3` module.
    
    2.  Calls the `InfluxDBClient3()` constructor method with credentials to instantiate an InfluxDB `client` with the following credentials:

        - **host**: {{% cloud-name %}} region hostname (URL without protocol or trailing slash)
        - **token**:  an [API token](/influxdb/cloud-serverless/admin/tokens/) with _read_ access to the specified bucket.
          _For security reasons, we recommend setting this as an environment
          variable rather than including the raw token string._
        - **database**: the name of the {{% cloud-name %}} bucket to query
    
    3.  Defines the SQL query to execute and assigns it to a `query` variable.

    4.  Calls the `client.query()` method with the SQL query.
        `query()` sends a
        Flight request to InfluxDB, queries the database, retrieves result data from the endpoint, and then returns a
        [pyarrow.Table](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html#pyarrow.Table)
        assigned to the `table` variable.
    
    5.  Calls the [`to_pandas()` method](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html#pyarrow.Table.to_pandas)
        to convert the Arrow table to a [pandas DataFrame](https://arrow.apache.org/docs/python/pandas.html).

    6.  Calls the [`pandas.DataFrame.to_markdown()` method](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_markdown.html)
        to convert the DataFrame to a markdown table.

    7.  Calls the `print()` method to print the markdown table to stdout.

6. In your terminal, enter the following command to run the program and query {{% cloud-name %}}:

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
    [Write data section](/influxdb/cloud-serverless/get-started/write/?t=Go#write-line-protocol-to-influxdb),
    create a new file named `query.go`.

2.  In `query.go`, enter the following sample code:

    ```go
    package main

    import (
      "context"
      "crypto/x509"
      "encoding/json"
      "fmt"
      "os"

      "github.com/apache/arrow/go/v12/arrow/flight/flightsql"
      "google.golang.org/grpc"
      "google.golang.org/grpc/credentials"
      "google.golang.org/grpc/metadata"
    )

    func dbQuery(ctx context.Context) error {
      url := "cloud2.influxdata.com:443"

      // INFLUX_TOKEN is an environment variable you created for your API token
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

    The sample code does the following:
    
    1.  Imports the following packages:

        - `context`
        - `crypto/x509`
        - `encoding/json`
        - `fmt`
        - `os`
        - `github.com/apache/arrow/go/v12/arrow/flight/flightsql`
        - `google.golang.org/grpc`
        - `google.golang.org/grpc/credentials`
        - `google.golang.org/grpc/metadata`

    2.  Creates a `dbQuery` function that does the following:

        1.  Defines variables for InfluxDB credentials.
          
            - **url**: {{% cloud-name %}} region hostname and port (`:443`) _(no protocol)_
            - **token**:  an [API token](/influxdb/cloud-serverless/get-started/setup/#create-an-all-access-api-token) with _read_  access to the specified bucket.
          _For security reasons, we recommend setting this as an environment
          variable rather than including the raw token string._
            - **database**: the name of the {{% cloud-name %}} bucket to query

        2.  Defines an `opts` options list that includes a gRPC transport for communicating
        with {{% cloud-name %}} over the _gRPC+TLS_ protocol.

        3.  Calls the `flightsql.NewClient()` method with `url` and `opts` to create a new Flight SQL client.

        4.  Appends the following InfluxDB credentials as key-value pairs to the outgoing context:

            - **authorization**: Bearer <INFLUX_TOKEN>
            - **database-name**: Bucket name

        5.  Define the SQL query to execute.

        6.  Calls the `client.execute()` method to send the query request.
        7.  Calls the `client.doGet()` method with the _ticket_ from the query response to retrieve result data from the endpoint.
        8.  Creates a reader to read the Arrow table returned by the endpoint and print
            the results as JSON.

    3.  Creates a `main` module function that executes the `dbQuery` function.

3. In your terminal, enter the following command to install all the necessary packages and run the program to query {{% cloud-name %}}.

```sh
go get ./...
go run ./query.go
```

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
  {
    "co": 1,
    "hum": 36.5,
    "room": "Kitchen",
    "temp": 22.8,
    "time": "2022-01-01 13:00:00"
  },
  {
    "co": 1,
    "hum": 36.3,
    "room": "Kitchen",
    "temp": 22.8,
    "time": "2022-01-01 14:00:00"
  },
  {
    "co": 3,
    "hum": 36.2,
    "room": "Kitchen",
    "temp": 22.7,
    "time": "2022-01-01 15:00:00"
  },
  {
    "co": 7,
    "hum": 36,
    "room": "Kitchen",
    "temp": 22.4,
    "time": "2022-01-01 16:00:00"
  },
  {
    "co": 9,
    "hum": 36,
    "room": "Kitchen",
    "temp": 22.7,
    "time": "2022-01-01 17:00:00"
  },
  {
    "co": 18,
    "hum": 36.9,
    "room": "Kitchen",
    "temp": 23.3,
    "time": "2022-01-01 18:00:00"
  },
  {
    "co": 22,
    "hum": 36.6,
    "room": "Kitchen",
    "temp": 23.1,
    "time": "2022-01-01 19:00:00"
  },
  {
    "co": 26,
    "hum": 36.5,
    "room": "Kitchen",
    "temp": 22.7,
    "time": "2022-01-01 20:00:00"
  },
  {
    "co": 0,
    "hum": 35.9,
    "room": "Living Room",
    "temp": 21.1,
    "time": "2022-01-01 08:00:00"
  },
  {
    "co": 0,
    "hum": 35.9,
    "room": "Living Room",
    "temp": 21.4,
    "time": "2022-01-01 09:00:00"
  },
  {
    "co": 0,
    "hum": 36,
    "room": "Living Room",
    "temp": 21.8,
    "time": "2022-01-01 10:00:00"
  },
  {
    "co": 0,
    "hum": 36,
    "room": "Living Room",
    "temp": 22.2,
    "time": "2022-01-01 11:00:00"
  },
  {
    "co": 0,
    "hum": 35.9,
    "room": "Living Room",
    "temp": 22.2,
    "time": "2022-01-01 12:00:00"
  },
  {
    "co": 0,
    "hum": 36,
    "room": "Living Room",
    "temp": 22.4,
    "time": "2022-01-01 13:00:00"
  },
  {
    "co": 0,
    "hum": 36.1,
    "room": "Living Room",
    "temp": 22.3,
    "time": "2022-01-01 14:00:00"
  },
  {
    "co": 1,
    "hum": 36.1,
    "room": "Living Room",
    "temp": 22.3,
    "time": "2022-01-01 15:00:00"
  },
  {
    "co": 4,
    "hum": 36,
    "room": "Living Room",
    "temp": 22.4,
    "time": "2022-01-01 16:00:00"
  },
  {
    "co": 5,
    "hum": 35.9,
    "room": "Living Room",
    "temp": 22.6,
    "time": "2022-01-01 17:00:00"
  },
  {
    "co": 9,
    "hum": 36.2,
    "room": "Living Room",
    "temp": 22.8,
    "time": "2022-01-01 18:00:00"
  },
  {
    "co": 14,
    "hum": 36.3,
    "room": "Living Room",
    "temp": 22.5,
    "time": "2022-01-01 19:00:00"
  },
  {
    "co": 17,
    "hum": 36.4,
    "room": "Living Room",
    "temp": 22.2,
    "time": "2022-01-01 20:00:00"
  }
]
```
{{% /expand %}}
{{< /expand-wrapper >}}
 {{% /influxdb/custom-timestamps %}}
<!------------------------------ END GO CONTENT ------------------------------->
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
For a deep dive into all the ways you can query {{% cloud-name %}}, see the
[Query data in InfluxDB](/influxdb/cloud-serverless/query-data/) section of documentation.

{{< page-nav prev="/influxdb/cloud-serverless/get-started/write/" keepTab=true >}}
