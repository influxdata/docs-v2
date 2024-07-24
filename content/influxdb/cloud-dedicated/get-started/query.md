---
title: Get started querying data
seotitle: Query data | Get started with InfluxDB Cloud Dedicated
list_title: Query data
description: >
  Get started querying data in InfluxDB Cloud Dedicated by learning about SQL and
  InfluxQL, and using tools like the influx3 CLI and InfluxDB client libraries.
menu:
  influxdb_cloud_dedicated:
    name: Query data
    parent: Get started
    identifier: get-started-query-data
weight: 102
metadata: [3 / 3]
related:
  - /influxdb/cloud-dedicated/query-data/
  - /influxdb/cloud-dedicated/query-data/sql/
  - /influxdb/cloud-dedicated/query-data/execute-queries/
  - /influxdb/cloud-dedicated/reference/client-libraries/v3/
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
[**get-started** database](/influxdb/cloud-dedicated/get-started/setup/#create-a-database)
for data written in the
[Get started writing data](/influxdb/cloud-dedicated/get-started/write/#write-line-protocol-to-influxdb)
section.
{{% /note %}}

## Tools to execute queries

{{% product-name %}} supports many different tools for querying data, including:

{{< req type="key" text="Covered in this tutorial" color="magenta" >}}
- [`influxctl` CLI](#execute-an-sql-query){{< req text="\*  " color="magenta" >}}
- [`influx3` data CLI](?t=influx3+CLI#execute-an-sql-query){{< req text="\*  " color="magenta" >}}
- [InfluxDB v3 client libraries](/influxdb/cloud-dedicated/reference/client-libraries/v3/){{< req text="\*  " color="magenta" >}}
- [Flight clients](/influxdb/cloud-dedicated/reference/client-libraries/flight/)
- [Superset](/influxdb/cloud-dedicated/query-data/sql/execute-queries/superset/)
- [Grafana](/influxdb/cloud-dedicated/query-data/sql/execute-queries/grafana/)
- [InfluxQL with InfluxDB v1 HTTP API](/influxdb/cloud-dedicated/query-data/execute-queries/influxdb-v1-api/)
- [Chronograf](/chronograf/v1/)

{{% warn %}}

#### /api/v2/query not supported

The `/api/v2/query` API endpoint and associated tooling, such as the `influx` CLI and InfluxDB v2 client libraries, **aren’t** supported in {{% product-name %}}.

{{% /warn %}}

## SQL query basics

The {{% product-name %}} SQL implementation is powered by the [Apache Arrow DataFusion](https://arrow.apache.org/datafusion/)
query engine which provides an SQL syntax similar to PostgreSQL.

{{% note %}}
This is a brief introduction to writing SQL queries for InfluxDB.
For more in-depth details, see [Query data with SQL](/influxdb/cloud-dedicated/query-data/sql/).
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
  room,
  selector_max(temp, time)['value'] AS 'max temp'
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

- **`influxctl` CLI**: Query data from your command-line using the
  [`influxctl` CLI](/influxdb/cloud-dedicated/reference/cli/influxctl/).
- **`influx3` CLI**: Query data from your terminal command-line using the
  Python-based [`influx3` CLI](https://github.com/InfluxCommunity/influxdb3-python).
- **InfluxDB v3 client libraries**: Use language-specific (Python, Go, etc.) clients to execute queries in your terminal or custom code.
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

<!--setup-test
```sh
curl --silent \
  "https://{{< influxdb/host >}}/write?db=get-started&precision=s" \
  --header "Authorization: Bearer DATABASE_TOKEN" \
  --header "Content-type: text/plain; charset=utf-8" \
  --header "Accept: application/json" \
  --data-binary "
home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1719907200
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1719907200
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1719910800
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1719910800
home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1719914400
home,room=Kitchen temp=22.7,hum=36.1,co=0i 1719914400
home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1719918000
home,room=Kitchen temp=22.4,hum=36.0,co=0i 1719918000
home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1719921600
home,room=Kitchen temp=22.5,hum=36.0,co=0i 1719921600
home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1719925200
home,room=Kitchen temp=22.8,hum=36.5,co=1i 1719925200
home,room=Living\ Room temp=22.3,hum=36.1,co=0i 1719928800
home,room=Kitchen temp=22.8,hum=36.3,co=1i 1719928800
home,room=Living\ Room temp=22.3,hum=36.1,co=1i 1719932400
home,room=Kitchen temp=22.7,hum=36.2,co=3i 1719932400
home,room=Living\ Room temp=22.4,hum=36.0,co=4i 1719936000
home,room=Kitchen temp=22.4,hum=36.0,co=7i 1719936000
home,room=Living\ Room temp=22.6,hum=35.9,co=5i 1719939600
home,room=Kitchen temp=22.7,hum=36.0,co=9i 1719939600
home,room=Living\ Room temp=22.8,hum=36.2,co=9i 1719943200
home,room=Kitchen temp=23.3,hum=36.9,co=18i 1719943200
home,room=Living\ Room temp=22.5,hum=36.3,co=14i 1719946800
home,room=Kitchen temp=23.1,hum=36.6,co=22i 1719946800
home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1719950400
home,room=Kitchen temp=22.7,hum=36.5,co=26i 1719950400
"
```
-->

{{% note %}}
Some examples in this getting started tutorial assume your InfluxDB
credentials (**URL** and **token**) are provided by
[environment variables](/influxdb/cloud-dedicated/get-started/setup/?t=InfluxDB+API#configure-authentication-credentials).
{{% /note %}}

{{< tabs-wrapper >}}
{{% tabs %}}
[influxctl CLI](#)
[influx3 CLI](#)
[Python](#)
[Go](#)
[Node.js](#)
[C#](#)
[Java](#)
{{% /tabs %}}
{{% tab-content %}}
<!-------------------------- BEGIN influxctl CONTENT -------------------------->

Use the [`influxctl query` command](/influxdb/cloud-dedicated/reference/cli/influxctl/query/)
to query the [home sensor sample data](#home-sensor-data-line-protocol) in your
{{< product-name omit=" Clustered" >}} cluster.
Provide the following:

- Database name to query using the `--database` flag
- Database token using the `--token` flag (use the `INFLUX_TOKEN` environment variable created in
  [Get started--Set up {{< product-name >}}](/influxdb/cloud-dedicated/get-started/setup/#configure-authentication-credentials))
- SQL query

{{% influxdb/custom-timestamps %}}
{{% code-placeholders "get-started" %}}

```sh
influxctl query \
  --database get-started \
  --token $INFLUX_TOKEN \
  "SELECT
    *
    FROM
      home
    WHERE
      time >= '2022-01-01T08:00:00Z'
      AND time <= '2022-01-01T20:00:00Z'"
```

{{% /code-placeholders %}}
{{% /influxdb/custom-timestamps %}}

{{% note %}}
#### Query using stored credentials

Optionally, you can configure `database` and `token` query credentials in your `influxctl`
[connection profile](/influxdb/clustered/reference/cli/influxctl/#create-a-configuration-file).

The `--database` and `--token` command line flags override credentials in your
configuration file.
{{% /note %}}

<!--------------------------- END influxctl CONTENT --------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!--------------------------- BEGIN influx3 CONTENT --------------------------->
{{% influxdb/custom-timestamps %}}

Query InfluxDB v3 using SQL and the [`influx3` CLI](https://github.com/InfluxCommunity/influxdb3-python-cli).

The following steps include setting up a Python virtual environment already
covered in [Get started writing data](/influxdb/cloud-dedicated/get-started/write/?t=Python#write-line-protocol-to-influxdb).
_If your project's virtual environment is already running, skip to step 3._

1.  Create a directory for your project and change into it:

    ```bash
    mkdir -p influx3-query-example && cd influx3-query-example 
    ```

2.  To create and activate a Python virtual environment, run the following command:

    <!--pytest-codeblocks:cont-->

    ```bash
    python -m venv envs/virtual-env && . envs/virtual-env/bin/activate
    ```

3.  Install the CLI package (already installed in the [Write data section](/influxdb/cloud-dedicated/get-started/write/?t=Python#write-line-protocol-to-influxdb)).

    <!--pytest-codeblocks:cont-->

    ```bash
    pip install influxdb3-python-cli
    ```

    Installing `influxdb3-python-cli` also installs the
    [`pyarrow`](https://arrow.apache.org/docs/python/index.html) library for working with Arrow data returned from queries.

4.  Create the `config.json` configuration.

    <!--pytest-codeblocks:cont-->

    ```sh
    influx3 config create \
      --name="config-dedicated" \
      --database="get-started" \
      --host="{{< influxdb/host >}}" \
      --token="DATABASE_TOKEN" \
      --org="ORG_ID"
    ```

    Replace the following:

    - **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/#database-tokens)
      with read access to the **get-started** database
    - **`ORG_ID`**: any non-empty string (InfluxDB ignores this parameter, but the client requires it)

5.  Enter the `influx3 sql` command and your SQL query statement.

    <!--pytest-codeblocks:cont-->

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
covered in [Get started writing data](/influxdb/cloud-dedicated/get-started/write/?t=Python#write-line-protocol-to-influxdb).
_If your project's virtual environment is already running, skip to step 3._

1.  Open a terminal in the `influxdb_py_client` module directory you created in the
    [Write data section](/influxdb/cloud-dedicated/get-started/write/?t=Python#write-line-protocol-to-influxdb):

    1.  To create and activate your Python virtual environment, enter the following command in your terminal:

        <!-- Run for tests and hide from users.

        ```sh
        mkdir -p influxdb_py_client && cd influxdb_py_client 
        ```
        -->

        <!--pytest-codeblocks:cont-->

        ```sh
        python -m venv envs/virtual-env && . ./envs/virtual-env/bin/activate
        ```

    2.  Install the following dependencies:

        {{< req type="key" text="Already installed in the [Write data section](/influxdb/cloud-dedicated/get-started/write/?t=Python#write-line-protocol-to-influxdb)" color="magenta" >}}

        - [`influxdb3-python`{{< req text="\* " color="magenta" >}}](https://github.com/InfluxCommunity/influxdb3-python): Provides the InfluxDB `influxdb_client_3` Python client library module and also installs the [`pyarrow` package](https://arrow.apache.org/docs/python/index.html) for working with Arrow data returned from queries.
        - [`pandas`](https://pandas.pydata.org/): Provides `pandas` functions, modules, and data structures for analyzing and manipulating data.
        - [`tabulate`](https://pypi.org/project/tabulate/): Provides the `tabulate` function for formatting tabular data. pandas requires this module for formatting data as Markdown.

        In your terminal, enter the following command:

        <!--pytest-codeblocks:cont-->

        ```sh
        pip install influxdb3-python pandas tabulate
        ```

    3.  In your terminal or editor, create a new file for your code--for example: `query.py`.

2.  In `query.py`, enter the following sample code:

    <!-- Import for tests and hide from users.
    ```python
    import os
    ```
    -->

    <!--pytest-codeblocks:cont-->

    ```python
    from influxdb_client_3 import InfluxDBClient3

    client = InfluxDBClient3(
        host=f"{{< influxdb/host >}}",
        token=f"DATABASE_TOKEN",
        database=f"get-started",
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
    assert table.num_rows > 0, "Expect query to return data."
    assert table['room'], f"Expect ${table} to have room column."
    print(table.to_pandas().to_markdown())
    ```

{{< expand-wrapper >}}
{{% expand "<span class='req'>Important</span>: If using **Windows**, specify the **Windows** certificate path" %}}

  When instantiating the client, Python looks for SSL/TLS certificate authority
  (CA) certificates for verifying the server's authenticity.
  If using a non-POSIX-compliant operating system (such as Windows), you need to
  specify a certificate bundle path that Python can access on your system.

  The following example shows how to use the
  [Python `certifi` package](https://certifiio.readthedocs.io/en/latest/) and
  client library options to provide a bundle of trusted certificates to the
  Python Flight client:

  1.  In your terminal, install the Python `certifi` package.

      ```sh
      pip install certifi
      ```
  
  2.  In your Python code, import `certifi` and call the `certifi.where()` method to retrieve the certificate path.
  3.  When instantiating the client, pass the `flight_client_options.tls_root_certs=<ROOT_CERT_PATH>` option with the certificate path--for example:

      ```python
      from influxdb_client_3 import InfluxDBClient3, flight_client_options
      import os
      import certifi

      fh = open(certifi.where(), "r")
      cert = fh.read()
      fh.close()

      client = InfluxDBClient3(
          host=f"{{< influxdb/host >}}",
          token=f"DATABASE_TOKEN",
          database=f"get-started",
          flight_client_options=flight_client_options(
              tls_root_certs=cert))
      ```
  
  For more information, see [`influxdb_client_3` query exceptions](/influxdb/cloud-dedicated/reference/client-libraries/v3/python/#query-exceptions).

{{% /expand %}}
{{< /expand-wrapper >}}

  The sample code does the following:

  1.  Imports the `InfluxDBClient3` constructor from the `influxdb_client_3` module.
  
  2.  Calls the `InfluxDBClient3()` constructor method with credentials to instantiate an InfluxDB `client` with the following credentials:

      - **`host`**: {{% product-name omit=" Clustered" %}} cluster URL
        (without `https://` protocol or trailing slash)
      - **`token`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/#database-tokens)
        with read access to the specified database.
        _Store this in a secret store or environment variable to avoid exposing
        the raw token string._
      - **`database`**: the name of the {{% product-name %}} database to query
  
  1.  Defines the SQL query to execute and assigns it to a `query` variable.

  2.  Calls the `client.query()` method with the SQL query.
      `query()` sends a
      Flight request to InfluxDB, queries the database, retrieves result data from the endpoint, and then returns a
      [`pyarrow.Table`](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html#pyarrow.Table)
      assigned to the `table` variable.

  3.  Calls the [`to_pandas()` method](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html#pyarrow.Table.to_pandas)
      to convert the Arrow table to a [`pandas.DataFrame`](https://arrow.apache.org/docs/python/pandas.html).

  4.  Calls the [`pandas.DataFrame.to_markdown()` method](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_markdown.html)
      to convert the DataFrame to a markdown table.

  5.  Calls the `print()` method to print the markdown table to stdout.

1.  Enter the following command to run the program and query your {{% product-name omit=" Clustered" %}} cluster:

    <!--pytest.mark.skip-->

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
    [Write data section](/influxdb/cloud-dedicated/get-started/write/?t=Go#write-line-protocol-to-influxdb),
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

      "github.com/apache/arrow/go/v13/arrow"
      "github.com/InfluxCommunity/influxdb3-go/influxdb3"
    )

    func Query() error {

      // INFLUX_TOKEN is an environment variable you created
      // for your database read token.
      token := os.Getenv("INFLUX_TOKEN")

      // Instantiate the client.
      client, err := influxdb3.New(influxdb3.ClientConfig{
        Host:     "https://{{< influxdb/host >}}",
        Token:    token,
        Database: "get-started",
      })

      // Close the client when the function returns.
      defer func(client *influxdb3.Client) {
        err := client.Close()
        if err != nil {
          panic(err)
        }
      }(client)

      // Define the query.
      query := `SELECT *
        FROM home
        WHERE time >= '2022-01-01T08:00:00Z'
        AND time <= '2022-01-01T20:00:00Z'`

      // Execute the query.
      iterator, err := client.Query(context.Background(), query)

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
        fmt.Fprintf(w, "%s\t%s\t%d\t%.1f\t%.1f\n",
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
        - `github.com/apache/arrow/go/v13/arrow`
        - `github.com/InfluxCommunity/influxdb3-go/influxdb3`

    2.  Defines a `Query()` function that does the following:

        1.  Instantiates `influx.Client` with the following parameters for InfluxDB credentials:
          
            - **`Host`**: your {{% product-name omit=" Clustered" %}} cluster URL
            - **`Database`**: the name of your {{% product-name %}} database
            - **`Token`**:  a [database token](/influxdb/cloud-dedicated/admin/tokens/#database-tokens)
              with read permission on the specified database.
              _Store this in a secret store or environment variable to avoid
              exposing the raw token string._

        2.  Defines a deferred function to close the client after execution.
        3.  Defines a string variable for the SQL query.

        4.  Calls the `influxdb3.Client.Query(sql string)` method and passes the
            SQL string to query InfluxDB.
            The `Query(sql string)` method returns an `iterator` for data in the
            response stream.
        5.  Iterates over rows, formats the timestamp as an
            [RFC3339 timestamp](/influxdb/cloud-dedicated/reference/glossary/#rfc3339-timestamp),
            and prints the data in table format to stdout.

3.  In your editor, open the `main.go` file you created in the
    [Write data section](/influxdb/cloud-dedicated/get-started/write/?t=Go#write-line-protocol-to-influxdb) and insert code to call the `Query()` function--for example:

    ```go
    package main

    func main() {	
      WriteLineProtocol()
      Query()
    }
    ```

4.  In your terminal, enter the following command to install the necessary
    packages, build the module, and run the program:

    <!--pytest.mark.skip-->

    ```sh
    go mod tidy && go run influxdb_go_client
    ```

    The program executes the `main()` function that writes the data and prints the query results to the console.

{{% /influxdb/custom-timestamps %}}
<!------------------------------ END GO CONTENT ------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
{{% influxdb/custom-timestamps %}}
<!---------------------------- BEGIN NODE.JS CONTENT --------------------------->

_This tutorial assumes you installed Node.js and npm, and created an `influxdb_js_client` npm project as described in the [Write data section](/influxdb/cloud-dedicated/get-started/write/?t=Nodejs)._

1.  In your terminal or editor, change to the `influxdb_js_client` directory you created in the
    [Write data section](/influxdb/cloud-dedicated/get-started/write/?t=Nodejs).
2.  If you haven't already, install the `@influxdata/influxdb3-client` JavaScript client library as a dependency to your project:

    <!--pytest.mark.skip-->

    ```sh
    npm install --save @influxdata/influxdb3-client
    ```
3.  Create a file named `query.mjs`. The `.mjs` extension tells the Node.js interpreter that you're using [ES6 module syntax](https://nodejs.org/api/esm.html#modules-ecmascript-modules).
4.  Inside of `query.mjs`, enter the following sample code:

    ```js
    // query.mjs
    import {InfluxDBClient} from '@influxdata/influxdb3-client'
    import {tableFromArrays} from 'apache-arrow';

    /**
    * Set InfluxDB credentials.
    */
    const host = "https://{{< influxdb/host >}}";
    const database = 'get-started';
    /**
    * INFLUX_TOKEN is an environment variable you assigned to your
    * database READ token value.
    */
    const token = process.env.INFLUX_TOKEN;

    /**
    * Query InfluxDB with SQL using the JavaScript client library.
    */
    export async function querySQL() {
      /**
      * Instantiate an InfluxDBClient
      */
      const client = new InfluxDBClient({host, token})
      const sql = `
      SELECT *
      FROM home
      WHERE time >= '2022-01-01T08:00:00Z'
        AND time <= '2022-01-01T20:00:00Z'
      `

      const data = {time: [], room: [], co: [], hum: [], temp: []};
      const result = client.query(query, database);

      for await (const row of result) {
        data.time.push(new Date(row._time))
        data.room.push(row.room)
        data.co.push(row.co);
        data.hum.push(row.hum);
        data.temp.push(row.temp);
      }

      console.table([...tableFromArrays(data)])

      client.close()
    }

    ```

    The sample code does the following:

    1.  Imports the following:
        - `InfluxDBClient` class
        - `tableFromArrays` function
    2.  Calls `new InfluxDBClient()` and passes a `ClientOptions` object to instantiate a client configured
        with InfluxDB credentials.

        - **`host`**: your {{% product-name omit=" Clustered" %}} cluster URL
        - **`token`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/#database-tokens)
          with read permission on the database you want to query.
          _Store this in a secret store or environment variable to avoid exposing
          the raw token string._

      1.  Defines a string variable (`sql`) for the SQL query.
      2.  Defines an object (`data`) with column names for keys and array values for storing row data.
      3.  Calls the `InfluxDBClient.query()` method with the following arguments:

          - **`sql`**: the query to execute
          - **`database`**: the name of the {{% product-name %}} database to query
          
          `query()` returns a stream of row vectors.
      4.  Iterates over rows and adds the column data to the arrays in `data`.
      5.  Passes `data` to the Arrow `tableFromArrays()` function to format the arrays as a table, and then passes the result to the `console.table()` method to output a highlighted table in the terminal.
5.  Inside of `index.mjs` (created in the [Write data section](/influxdb/cloud-dedicated/get-started/write/?t=Nodejs)), enter the following sample code to import the modules and call the functions:

    ```js
    // index.mjs
    import { writeLineProtocol } from "./write.mjs";
    import { querySQL } from "./query.mjs";

    /**
    * Execute the client functions.
    */
    async function main() {
      /** Write line protocol data to InfluxDB. */
      await writeLineProtocol();
      /** Query data from InfluxDB using SQL. */
      await querySQL();
    }

    main();
    ```

6.  In your terminal, execute `index.mjs` to write to and query {{% product-name %}}:

    <!--pytest.mark.skip-->

    ```sh
    node index.mjs
    ```
<!---------------------------- END NODE.JS CONTENT --------------------------->
{{% /influxdb/custom-timestamps %}}
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------ BEGIN C# CONTENT ----------------------------->
{{% influxdb/custom-timestamps %}}

1.  In the `influxdb_csharp_client` directory you created in the
    [Write data section](/influxdb/cloud-dedicated/get-started/write/?t=C%23),
    create a new file named `Query.cs`.

2.  In `Query.cs`, enter the following sample code:

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
        /** INFLUX_TOKEN is an environment variable you assigned to your
          * database READ token value.
          **/
        string? token = System.Environment
            .GetEnvironmentVariable("INFLUX_TOKEN");

        /**
          * Instantiate the InfluxDB client with credentials.
          **/
        using var client = new InfluxDBClient(
            "https://{{< influxdb/host >}}", token: token, database: database);
      
        const string sql = @"
          SELECT time, room, temp, hum, co
          FROM home
          WHERE time >= '2022-01-01T08:00:00Z'
          AND time <= '2022-01-01T20:00:00Z'
        ";

        Console.WriteLine("{0,-30}{1,-15}{2,-15}{3,-15}{4,-15}",
            "time", "room", "co", "hum", "temp");
        
        await foreach (var row in client.Query(query: sql))
        {
          {
            /** 
              * Iterate over rows and print column values in table format.
              * Format the timestamp as sortable UTC format.
              */
            Console.WriteLine("{0,-30:u}{1,-15}{4,-15}{3,-15}{2,-15}",
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
          
            - **`host`**: your {{% product-name omit=" Clustered" %}} cluster URL.
            - **`database`**: the name of the {{% product-name %}} database to query
            - **`token`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/#database-tokens)
              with read permission on the specified database.
              _Store this in a secret store or environment variable to avoid exposing the raw token string._
        2.  Defines a string variable for the SQL query.
        3.  Calls the `InfluxDBClient.Query()` method to send the query request with the SQL string.
            `Query()` returns batches of rows from the response stream as a two-dimensional array--an array of rows in which each row is an array of values.
        4.  Iterates over rows and prints the data in table format to stdout.
3.  In your editor, open the `Program.cs` file you created in the
    [Write data section](/influxdb/cloud-dedicated/get-started/write/?t=C%23#write-line-protocol-to-influxdb) and insert code to call the `Query()` function--for example:

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

4.  To build and execute the program and query {{% product-name %}},
    enter the following commands in your terminal:

    <!--pytest.mark.skip-->

    ```sh
    dotnet run
    ```
{{% /influxdb/custom-timestamps %}}
<!------------------------------ END C# CONTENT ------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------ BEGIN JAVA CONTENT ------------------------------->
{{% influxdb/custom-timestamps %}}

_This tutorial assumes using Maven version 3.9, Java version >= 15, and an `influxdb_java_client` Maven project created in the [Write data section](/influxdb/cloud-dedicated/get-started/write/?t=Java)._

1.  In your terminal or editor, change to the `influxdb_java_client` directory you created in the
    [Write data section](/influxdb/cloud-dedicated/get-started/write/?t=Java).
2.  Inside of the `src/main/java/com/influxdbv3` directory, create a new file named `Query.java`.
3.  In `Query.java`, enter the following sample code:

    ```java
    // Query.java
    package com.influxdbv3;

    import com.influxdb.v3.client.InfluxDBClient;
    import java.util.stream.Stream;

    /**
      * Queries an InfluxDB database using the Java client
      * library.
      **/
    public final class Query {

        private Query() {
            //not called
        }

        /**
        * @throws Exception
        */
        public static void querySQL() throws Exception {
            /**
            * Query using SQL.
            */

            /** Set InfluxDB credentials. **/
            final String host = "https://{{< influxdb/host >}}";
            final String database = "get-started";

            /** INFLUX_TOKEN is an environment variable you assigned to your
              * database READ token value.
              **/
            final char[] token = (System.getenv("INFLUX_TOKEN")).
            toCharArray();

            try (InfluxDBClient client = InfluxDBClient.getInstance(host,
            token, database)) {
                String sql =
                    """
                    SELECT time, room, temp, hum, co
                    FROM home
                    WHERE time >= '2022-01-01T08:00:00Z'
                    AND time <= '2022-01-01T20:00:00Z'""";

                String layoutHead = "| %-16s | %-12s | %-6s | %-6s | %-6s |%n";
                System.out.printf(
                "--------------------------------------------------------%n");
                System.out.printf(layoutHead,
                "time", "room", "co", "hum", "temp");
                System.out.printf(
                "--------------------------------------------------------%n");
                String layout = "| %-16s | %-12s | %-6s | %.1f | %.1f |%n";

                try (Stream<Object[]> stream = client.query(sql)) {
                    stream.forEach(row -> 
                      System.out.printf(layout,
                      row[0], row[1], row[4], row[3], row[2])
                    );
                }
            }
        }
    }
    ```

    The sample code does the following:

    1.  Assigns the `com.influxdbv3` package name (the Maven **groupId**).
    2.  Imports the following classes:

        - `com.influxdb.v3.client.InfluxDBClient`
        - `java.util.stream.Stream`

    3.  Defines a `Query` class with a `querySQL()` method that does the following:

        1.  Calls `InfluxDBClient.getInstance()` to instantiate a client configured
            with InfluxDB credentials.

            - **`host`**: your {{% product-name omit=" Clustered" %}} cluster URL
            - **`database`**: the name of the {{% product-name %}} database to write to
            - **`token`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/#database-tokens)
              with read permission on the specified database.
              _Store this in a secret store or environment variable to avoid exposing the raw token string._
        2.  Defines a string variable (`sql`) for the SQL query.
        3.  Defines a Markdown table format layout for headings and data rows.
        4.  Calls the `InfluxDBClient.query()` method to send the query request with the SQL string.
            `query()` returns a stream of rows.
        5.  Iterates over rows and prints the data in the specified layout to stdout.

4.  In your editor, open the `src/main/java/com/influxdbv3/App.java` file and replace its contents with the following sample code:

    ```java
    // App.java

    package com.influxdbv3;

    /**
    * Execute the client functions.
    *
    */
    public class App {

        /**
        * @param args
        * @throws Exception
        */
        public static void main(final String[] args) throws Exception {
            // Write data to InfluxDB v3.
            Write.writeLineProtocol();
            // Run the SQL query.
            Query.querySQL();
        }
    }
    ```

    - The `App`, `Write`, and `Query` classes belong to the `com.influxdbv3` package (your project **groupId**).
    - `App` defines a `main()` function that calls `Write.writeLineProtocol()` and `Query.querySQL()`.
4.  In your terminal or editor, use Maven to install dependencies and compile the project code--for example:

    <!--pytest.mark.skip-->

    ```sh
    mvn compile
    ```

5.  Set the `--add-opens=java.base/java.nio=ALL-UNNAMED` Java option for your environment.
    The Apache Arrow Flight library requires this setting for access to the [java.nio API package](https://docs.oracle.com/en/java/javase/20/docs/api/java.base/java/nio/package-summary.html).

    For example, enter the following command in your terminal:

    **Linux/MacOS**

    ```sh
    export MAVEN_OPTS="--add-opens=java.base/java.nio=ALL-UNNAMED"
    ```

    **Windows PowerShell**

    ```powershell
    $env:MAVEN_OPTS="--add-opens=java.base/java.nio=ALL-UNNAMED"
    ```

6. To run the app to write to and query {{% product-name %}}, execute `App.main()`--for example, using Maven:

    <!--pytest.mark.skip-->

    ```sh
    mvn exec:java -Dexec.mainClass="com.influxdbv3.App"
    ```

{{% /influxdb/custom-timestamps %}}
<!------------------------------ END JAVA CONTENT ------------------------------->
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
[Query data in InfluxDB](/influxdb/cloud-dedicated/query-data/) section of documentation.

{{< page-nav prev="/influxdb/cloud-dedicated/get-started/write/" keepTab=true >}}
