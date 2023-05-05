---
title: Get started querying data
seotitle: Query data | Get started with InfluxDB Cloud Dedicated
list_title: Query data
description: >
  Get started querying data in InfluxDB Cloud Dedicated by learning about SQL and
  InfluxQL and using tools like InfluxDB client libraries and Flight SQL clients.
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
---

InfluxDB Cloud Dedicated supports multiple query languages:

- **SQL**: Traditional SQL powered by the [Apache Arrow DataFusion](https://arrow.apache.org/datafusion/)
  query engine. The supported SQL syntax is similar to PostgreSQL.
- **InfluxQL**: A SQL-like query language designed to query time series data from
  InfluxDB.

This tutorial walks you through the fundamentals of querying data in InfluxDB and
**focuses on using SQL** to query your time series data.
The InfluxDB SQL implementation is built using [Arrow Flight SQL](https://arrow.apache.org/docs/format/FlightSql.html),
a protocol for interacting with SQL databases using the Arrow in-memory format and the
[Flight RPC](https://arrow.apache.org/docs/format/Flight.html) framework.
It leverages the performance of [Apache Arrow](https://arrow.apache.org/) with
the simplicity of SQL.

{{% note %}}
The examples in this section of the tutorial query the
[**get-started** database](/influxdb/cloud-dedicated/get-started/setup/#create-a-database) for data written in the
[Get started writing data](/influxdb/cloud-dedicated/get-started/write/#write-line-protocol-to-influxdb) section.
{{% /note %}}

## Tools to execute queries

InfluxDB Cloud Dedicated supports many different tools for querying data, including:

{{< req type="key" text="Covered in this tutorial" color="magenta" >}}

- [Flight SQL clients](){{< req text="\*  " color="magenta" >}}
- [InfluxDB client libraries](){{< req text="\*  " color="magenta" >}}
- [InfluxDB v1 HTTP API](?t=InfluxDB+API#execute-a-sql-query)
- [Superset](https://superset.apache.org/)
- [Grafana](/influxdb/cloud-dedicated/query-data/tools/grafana/)
- [Chronograf](/{{< latest "Chronograf" >}}/)

## SQL query basics

InfluxDB Cloud's SQL implementation is powered by the [Apache Arrow DataFusion](https://arrow.apache.org/datafusion/)
query engine which provides a SQL syntax similar to PostgreSQL.

{{% note %}}
This is a brief introduction to writing SQL queries for InfluxDB.
For more in-depth details, see [Query data with SQL](/influxdb/cloud-dedicated/query-data/sql/).
{{% /note %}}

InfluxDB SQL queries most commonly include the following clauses:

{{< req type="key" >}}

- {{< req "\*">}} `SELECT`: Identify specific fields and tags to query from a
  measurement or use the wild card alias (`*`) to select all fields and tags
  from a measurement.
- {{< req "\*">}} `FROM`: Identify the measurement to query.
  If coming from a SQL background, an InfluxDB measurement is the equivalent 
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

##### Example SQL queries

{{< expand-wrapper >}}
{{% expand "Select all data in a measurement" %}}
```sql
SELECT * FROM measurement
```
{{% /expand %}}

{{% expand "Select all data in a measurement within time bounds" %}}
```sql
SELECT
  *
FROM
  home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
```
{{% /expand %}}

{{% expand "Select a specific field within relative time bounds" %}}
```sql
SELECT temp FROM home WHERE time >= now() - INTERVAL '1 day'
```
{{% /expand %}}

{{% expand "Select specific fields and tags from a measurement" %}}
```sql
SELECT temp, room FROM home
```
{{% /expand %}}

{{% expand "Select data based on tag value" %}}
```sql
SELECT * FROM home WHERE room = 'Kitchen'
```
{{% /expand %}}

{{% expand "Select data based on tag value within time bounds" %}}
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
{{% /expand %}}

{{% expand "Downsample data by applying interval-based aggregates" %}}
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
{{% /expand %}}
{{< /expand-wrapper >}}

### Execute a SQL query

Use the **InfluxDB UI**, **`influx` CLI**, or **InfluxDB API** to execute SQL queries.
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

{{< tabs-wrapper >}}
{{% tabs %}}
[Python](#)
[Go](#)
{{% /tabs %}}

{{% tab-content %}}
<!--------------------------- BEGIN PYTHON CONTENT ---------------------------->

To query data from InfluxDB Cloud Dedicated using Python, use the
[`pyinflux3` module](https://github.com/InfluxCommunity/pyinflux3).
The following steps include setting up a Python virtual environment already
covered in [Get started writing data](/influxdb/cloud-dedicated/get-started/write/?t=Python#write-line-protocol-to-influxdb).
_If your project's virtual environment is already running, skip to step 3._

1.  Setup your Python virtual environment.
    Inside of your project directory:

    ```sh
    python -m venv envs/virtual-env
    ```

2. Activate the virtual environment.

    ```sh
    source ./envs/virtual-env/bin/activate
    ```

3. Install the following dependencies:

    {{< req type="key" text="Already installed in the [Write data section](/influxdb/cloud-dedicated/get-started/write/?t=Python#write-line-protocol-to-influxdb)" color="magenta" >}}

    - `pyarrow` {{< req text="\*" color="magenta" >}}
    - `flightsql-dbapi` {{< req text="\*" color="magenta" >}}
    - `pyinflux3` {{< req text="\*" color="magenta" >}}
    - `pandas`
    - `tabulate` _(to return formatted tables)_

    ```sh
    pip install pandas tabulate
    ```

4.  Build your python script to query your InfluxDB database.
    _These can be structured as a Python script or executed in a `python` shell._

    1.  Import the `InfluxDBClient3` constructor from the `influxdb_client_3` module.
    
    2.  Use the `InfluxDBClient3` constructor to instantiate an InfluxDB Client.
        The example below assigns it to the `client` variable.
        Provide the following credentials:

        - **host**: InfluxDB Cloud Dedicated cluster URL (without protocol or trailing slash)
        - **token**: Database token with read access to the specified database
        - **database**: Database name to query
    
    3.  Provide the SQL query to execute. In the example below, it's assigned
        to the `query`variable.
    
    4.  Use the `client.query` method to query data in the **get-started**
        database and return an Arrow table. Assign the return value to the
        `table` variable. Provide the following:
        
        - **sql_query** SQL query string to execute
    
    5.  Use [`read_all`](https://docs.python.org/3/library/telnetlib.html#telnetlib.Telnet.read_all)
        to read the data from InfluxDB and return an Arrow table.

    6.  Use [`to_pandas`](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html#pyarrow.Table.to_pandas)
        to convert the Arrow table to a pandas DataFrame.

    7.  Use [`to_markdown`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_markdown.html)
        to convert the DataFrame to a markdown table.

    8.  Use `print` to print out the markdown table.

{{% influxdb/custom-timestamps %}}

```py
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(
    host="cluster-id.influxdb.io",
    token="DATABASE_TOKEN",
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

table = client.query(sql_query=sql)
reader = table.read_all()
print(reader.to_pandas().to_markdown())
```

{{% /influxdb/custom-timestamps %}}

{{< expand-wrapper >}}
{{% expand "View returned markdown table" %}}
{{% influxdb/custom-timestamps %}}

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

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{< /expand-wrapper >}}

<!---------------------------- END PYTHON CONTENT ----------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN GO CONTENT ------------------------------>

1.  In the `influxdb_go_client` directory you created in the
    [Write data section](/influxdb/cloud-dedicated/get-started/write/?t=Go#write-line-protocol-to-influxdb),
    create a new file named `query.go`.

2.  In `query.go`:
    
    1.  Import the following packages:

        - `context`
        - `crypto/x509`
        - `encoding/json`
        - `fmt`
        - `os`
        - `github.com/apache/arrow/go/v12/arrow/flight/flightsql`
        - `google.golang.org/grpc`
        - `google.golang.org/grpc/credentials`
        - `google.golang.org/grpc/metadata`

    2.  Create a `dbQuery` function. In `dbQuery, define the following
        variables:

        - **url**: InfluxDB Cloud Dedicated cluster URL _(no protocol, include port `443`)_
        - **token**: [Database token](/influxdb/cloud-dedicated/admin/tokens/) with
          read access to the **get-started** database.
          _For security reasons, we recommend setting this as an environment
          variable rather than including the raw token string._
        - **database**: Database name to query

    3.  In the `dbQuery` function, create a gRPC transport to use to communicate
        with your InfluxDB Cloud Dedicated cluster over the gRPC protocol.

    4.  Use `flightsql.NewClient` to create a new Flight SQL client.

    5.  Append the following key-value pairs to the outgoing context:

        - **authorization**: Bearer <INFLUX_TOKEN>
        - **database-name**: Database name
    
    6.  Define the query to execute.

    7.  Create a reader to read the Arrow table returned by the query and print
        the results as JSON.

    8.  Create a `main` function that executes the `dbQuery` function.

{{% influxdb/custom-timestamps %}}

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
	url := "cluster-id.influxdb.io:443"
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

{{% /influxdb/custom-timestamps %}}

Install all the necessary packages and run the program to write the line
protocol to your InfluxDB Cloud Dedicated cluster.

```sh
go get ./...
go run ./query.go
```

{{< expand-wrapper >}}
{{% expand "View program output" %}}
{{% influxdb/custom-timestamps %}}

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

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{< /expand-wrapper >}}

<!------------------------------ END GO CONTENT ------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

**Congratulations!** You've learned the basics of querying data in InfluxDB
Cloud Dedicated with SQL.
For a deep dive into all the ways you can query InfluxDB, see the
[Query data in InfluxDB](/influxdb/cloud-dedicated/query-data/) section of documentation.

{{< page-nav prev="/influxdb/cloud-dedicated/get-started/write/" keepTab=true >}}