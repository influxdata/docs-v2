---
title: Get started writing data
seotitle: Write data | Get started with InfluxDB Cloud Dedicated
list_title: Write data
description: >
  Get started writing data to InfluxDB Cloud Dedicated by learning about line protocol
  and using tools like the InfluxDB API and Telegraf.
menu:
  influxdb_cloud_dedicated:
    name: Write data
    parent: Get started
    identifier: get-started-write-data
weight: 101
metadata: [2 / 3]
related:
  - /influxdb/cloud-dedicated/write-data/
  - /influxdb/cloud-dedicated/write-data/best-practices/
  - /influxdb/cloud-dedicated/reference/syntax/line-protocol/
  - /{{< latest "telegraf" >}}/
---

InfluxDB provides many different options for ingesting or writing data, including
the following:

- [InfluxDB HTTP API (v1 and v2)](/influxdb/cloud-serverless/reference/api/)
- [`influx` CLI (v1 and v2)](/influxdb/cloud-dedicated/reference/cli/influx/)
- [Telegraf](/{{< latest "telegraf" >}}/)
- [InfluxDB client libraries](/influxdb/cloud-dedicated/api-guide/client-libraries/)
- etc.

This tutorial walks you through the fundamental of using **line protocol** to write
data to InfluxDB. If using tools like Telegraf or InfluxDB client libraries, they can
build the line protocol for you, but it's good to understand how line protocol works.

## Line protocol

All data written to InfluxDB is written using **line protocol**, a text-based
format that lets you provide the necessary information to write a data point to InfluxDB.
_This tutorial covers the basics of line protocol, but for detailed information,
see the [Line protocol reference](/influxdb/cloud-dedicated/reference/syntax/line-protocol/)._

### Line protocol elements

Each line of line protocol contains the following elements:

{{< req type="key" >}}

- {{< req "\*" >}} **measurement**:  String that identifies the [measurement]() to store the data in.
- **tag set**: Comma-delimited list of key value pairs, each representing a tag.
  Tag keys and values are unquoted strings. _Spaces, commas, and equal characters must be escaped._
- {{< req "\*" >}} **field set**: Comma-delimited list of key value pairs, each representing a field.
  Field keys are unquoted strings. _Spaces and commas must be escaped._
  Field values can be [strings](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#string) (quoted),
  [floats](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#float),
  [integers](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#integer),
  [unsigned integers](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#uinteger),
  or [booleans](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#boolean).
- **timestamp**: [Unix timestamp](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#unix-timestamp)
  associated with the data. InfluxDB supports up to nanosecond precision.
  _If the precision of the timestamp is not in nanoseconds, you must specify the
  precision when writing the data to InfluxDB._

#### Line protocol element parsing

- **measurement**: Everything before the _first unescaped comma before the first whitespace_.
- **tag set**: Key-value pairs between the _first unescaped comma_ and the _first unescaped whitespace_.
- **field set**: Key-value pairs between the _first and second unescaped whitespaces_.
- **timestamp**: Integer value after the _second unescaped whitespace_.
- Lines are separated by the newline character (`\n`).
  Line protocol is whitespace sensitive.

---

{{< influxdb/line-protocol >}}

---

_For schema design recommendations, see [InfluxDB schema design](/influxdb/cloud-iox/write-data/best-practices/schema-design/)._

## Construct line protocol

With a basic understanding of line protocol, you can now construct line protocol
and write data to InfluxDB.
Consider a use case where you collect data from sensors in your home.
Each sensor collects temperature, humidity, and carbon monoxide readings.
To collect this data, use the following schema:

- **measurement**: `home` 
  - **tags**
    - `room`: Living Room or Kitchen
  - **fields**
    - `temp`: temperature in °C (float)
    - `hum`: percent humidity (float)
    - `co`: carbon monoxide in parts per million (integer)
  - **timestamp**: Unix timestamp in _second_ precision

Data is collected hourly beginning at 
{{% influxdb/custom-timestamps-span %}}**2022-01-01T08:00:00Z (UTC)** until **2022-01-01T20:00:00Z (UTC)**{{% /influxdb/custom-timestamps-span %}}.
The resulting line protocol would look something like the following:

{{% influxdb/custom-timestamps %}}

##### Home sensor data line protocol

```sh
home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1641027600
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600
home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1641031200
home,room=Kitchen temp=22.7,hum=36.1,co=0i 1641031200
home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1641034800
home,room=Kitchen temp=22.4,hum=36.0,co=0i 1641034800
home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1641038400
home,room=Kitchen temp=22.5,hum=36.0,co=0i 1641038400
home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1641042000
home,room=Kitchen temp=22.8,hum=36.5,co=1i 1641042000
home,room=Living\ Room temp=22.3,hum=36.1,co=0i 1641045600
home,room=Kitchen temp=22.8,hum=36.3,co=1i 1641045600
home,room=Living\ Room temp=22.3,hum=36.1,co=1i 1641049200
home,room=Kitchen temp=22.7,hum=36.2,co=3i 1641049200
home,room=Living\ Room temp=22.4,hum=36.0,co=4i 1641052800
home,room=Kitchen temp=22.4,hum=36.0,co=7i 1641052800
home,room=Living\ Room temp=22.6,hum=35.9,co=5i 1641056400
home,room=Kitchen temp=22.7,hum=36.0,co=9i 1641056400
home,room=Living\ Room temp=22.8,hum=36.2,co=9i 1641060000
home,room=Kitchen temp=23.3,hum=36.9,co=18i 1641060000
home,room=Living\ Room temp=22.5,hum=36.3,co=14i 1641063600
home,room=Kitchen temp=23.1,hum=36.6,co=22i 1641063600
home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1641067200
home,room=Kitchen temp=22.7,hum=36.5,co=26i 1641067200
```

{{% /influxdb/custom-timestamps %}}

## Write line protocol to InfluxDB

Use the **InfluxDB v2 HTTP API** or **InfluxDB client libraries** to write the
line protocol above to InfluxDB.
The following examples show how to use the **Python** and **Go** client libraries to write line protocol.

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB API](#)
[Python](#)
[Go](#)
{{% /tabs %}}

{{% tab-content %}}
<!----------------------------- BEGIN API CONTENT ----------------------------->

To write data to InfluxDB Cloud Dedicated using the InfluxDB v2 HTTP API, send a
request to the InfluxDB API `/api/v2/write` endpoint using the `POST` request method.

{{< api-endpoint endpoint="https://cluster-id.influxdb.io/api/v2/write" method="post" api-ref="/influxdb/cloud-iox/api/#operation/PostWrite" >}}

Include the following with your request:

- **Headers**:
  - **Authorization**: Token <INFLUX_TOKEN>
  - **Content-Type**: text/plain; charset=utf-8
  - **Accept**: application/json
- **Query parameters**:
  - **org**: _This parameter is ignored and can be an arbitrary string_
  - **bucket**: InfluxDB database name
  - **precision**: Timestamp precision (default is `ns`)
- **Request body**: Line protocol as plain text

The following example uses cURL and the InfluxDB v2 API to write line protocol
to InfluxDB Cloud dedicated:

{{% influxdb/custom-timestamps %}}
```sh
export INFLUX_HOST=https://cluster-id.influxdb.io
export INFLUX_ORG=ignored
export INFLUX_TOKEN=DATABASE_TOKEN

curl --request POST \
"$INFLUX_HOST/api/v2/write?org=$INFLUX_ORG&bucket=get-started&precision=s" \
  --header "Authorization: Token $INFLUX_TOKEN" \
  --header "Content-Type: text/plain; charset=utf-8" \
  --header "Accept: application/json" \
  --data-binary "
home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1641027600
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600
home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1641031200
home,room=Kitchen temp=22.7,hum=36.1,co=0i 1641031200
home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1641034800
home,room=Kitchen temp=22.4,hum=36.0,co=0i 1641034800
home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1641038400
home,room=Kitchen temp=22.5,hum=36.0,co=0i 1641038400
home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1641042000
home,room=Kitchen temp=22.8,hum=36.5,co=1i 1641042000
home,room=Living\ Room temp=22.3,hum=36.1,co=0i 1641045600
home,room=Kitchen temp=22.8,hum=36.3,co=1i 1641045600
home,room=Living\ Room temp=22.3,hum=36.1,co=1i 1641049200
home,room=Kitchen temp=22.7,hum=36.2,co=3i 1641049200
home,room=Living\ Room temp=22.4,hum=36.0,co=4i 1641052800
home,room=Kitchen temp=22.4,hum=36.0,co=7i 1641052800
home,room=Living\ Room temp=22.6,hum=35.9,co=5i 1641056400
home,room=Kitchen temp=22.7,hum=36.0,co=9i 1641056400
home,room=Living\ Room temp=22.8,hum=36.2,co=9i 1641060000
home,room=Kitchen temp=23.3,hum=36.9,co=18i 1641060000
home,room=Living\ Room temp=22.5,hum=36.3,co=14i 1641063600
home,room=Kitchen temp=23.1,hum=36.6,co=22i 1641063600
home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1641067200
home,room=Kitchen temp=22.7,hum=36.5,co=26i 1641067200
"
```
{{% /influxdb/custom-timestamps %}}
<!------------------------------ END API CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!---------------------------- BEGIN PYTHON CONTENT --------------------------->

To write data to InfluxDB Cloud Dedicated using Python, use the
[`pyinflux3` module](https://github.com/InfluxCommunity/pyinflux3).
The following steps include setting up a Python virtual environment to scope
dependencies to your current project.

1.  Setup your Python virtual environment.
    Inside of your project directory:

    ```sh
    python -m venv envs/virtual-env
    ```

2. Activate the virtual environment.

    ```sh
    source ./envs/virtual-env/bin/activate
    ```

3.  Load the following dependencies:

    - `pyarrow`
    - `flightsql-dbapi`
    - `pypinflux3`

    ```python
    pip install pyarrow flightsql-dbapi pyinflux3
    ```

4.  Build your python script to write the [line protocol above](#home-sensor-data-line-protocol)
    to InfluxDB. _These can be structured as a Python script or executed in a `python` shell._

    1.  Import the `InfluxDBClient3` object from the `influxdb_client_3` module.
    2.  Use the `InfluxDBClient3` constructor to instantiate an InfluxDB Client.
        The example below assigns it to the `client` variable.
        Provide the following credentials:

        - **host**: InfluxDB Cloud Dedicated cluster URL (without protocol or trailing slash)
        - **org**: _Leave as an empty string_
        - **token**: Database token with write access to the target database
        - **database**: Database name to write to
    
    3.  Use the `client.write` method to write the line protocol to the **get-started**
        database. Provide the following:
        
        - **Line protocol** as an array of strings where each element is an individual
          line of line protocol.
        - **`write_precision` option** to specify the timestamp precision as 
          seconds (`s`).

{{% influxdb/custom-timestamps %}}

```py
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(
    host="cluster-id.influxdb.io",
    org="",
    token="DATABASE_TOKEN",
    database="get-started"
)

client.write([
    "home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000",
    "home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000",
    "home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1641027600",
    "home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600",
    "home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1641031200",
    "home,room=Kitchen temp=22.7,hum=36.1,co=0i 1641031200",
    "home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1641034800",
    "home,room=Kitchen temp=22.4,hum=36.0,co=0i 1641034800",
    "home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1641038400",
    "home,room=Kitchen temp=22.5,hum=36.0,co=0i 1641038400",
    "home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1641042000",
    "home,room=Kitchen temp=22.8,hum=36.5,co=1i 1641042000",
    "home,room=Living\ Room temp=22.3,hum=36.1,co=0i 1641045600",
    "home,room=Kitchen temp=22.8,hum=36.3,co=1i 1641045600",
    "home,room=Living\ Room temp=22.3,hum=36.1,co=1i 1641049200",
    "home,room=Kitchen temp=22.7,hum=36.2,co=3i 1641049200",
    "home,room=Living\ Room temp=22.4,hum=36.0,co=4i 1641052800",
    "home,room=Kitchen temp=22.4,hum=36.0,co=7i 1641052800",
    "home,room=Living\ Room temp=22.6,hum=35.9,co=5i 1641056400",
    "home,room=Kitchen temp=22.7,hum=36.0,co=9i 1641056400",
    "home,room=Living\ Room temp=22.8,hum=36.2,co=9i 1641060000",
    "home,room=Kitchen temp=23.3,hum=36.9,co=18i 1641060000",
    "home,room=Living\ Room temp=22.5,hum=36.3,co=14i 1641063600",
    "home,room=Kitchen temp=23.1,hum=36.6,co=22i 1641063600",
    "home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1641067200",
    "home,room=Kitchen temp=22.7,hum=36.5,co=26i 1641067200"],
    write_precision='s'
)
```

{{% /influxdb/custom-timestamps %}}

<!----------------------------- END PYTHON CONTENT ---------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN GO CONTENT ------------------------------>

To write data to InfluxDB Cloud Dedicated using Go, use the
[influxdb-client-go module](https://github.com/influxdata/influxdb-client-go).

1.  Create a new go module in your project directory.

    1. Create a new module directory and navigate into it.
    2. Initialize a new Go module in the current working directory.
    3. Create a `write.go` file.

    ```sh
    mkdir influxdb_go_client && cd $_
    go mod init influxdb_go_client
    touch write.go
    ```

2.  Inside of `main.go` instantiate an InfluxDB write client to write the
    [line protocol above](#home-sensor-data-line-protocol) to InfluxDB.

    1.  Import the following packages

        - `context`
        - `fmt`
        - `log`
        - `os`
        - `time`
        - `github.com/influxdata/influxdb-client-go/v2` aliased as `influxdb2`
    
    2.  Create a `dbWrite` function.
    3.  In the `dbWrite` function, use `influxdb2.NewClientWithOptions` to
        create a `writeClient` that accepts write options.
        The write client requires the following credentials:
        
        - **url**: InfluxDB Cloud Dedicated cluster URL
        - **token**: [Database token](/influxdb/cloud-dedicated/admin/tokens/)
          with write access to the **get-started** database.
          _For security reasons, we recommend setting this as an environment
          variable rather than including the raw token string._

        Because the timestamps in the line protocol are in second
        precision, **use `SetPrecision(time.Second)` to define the write precision option**.
    
    4.  Use `writeClient.WriteAPIBlocking` to define a `writeAPI`.
        The write API requires the following credentials:

        - **org**: _Provide an arbitrary string. This credential is ignored._
        - **bucket**: InfluxDB database name.
    
    5.  Define an array of line protocol strings where each element is a single
        line of line protocol.
    
    6.  Iterate through the array of line protocol and use `writeAPI.WriteRecord`
        to write each line of line protocol to InfluxDB.
    
    7.  Define a `main` function that executes the `dbWrite` function.

{{% influxdb/custom-timestamps %}}

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
)

func dbWrite(ctx context.Context) error {
	// Create write client
	url := "https://cluster-id.influxdb.io"
	token := os.Getenv("INFLUX_TOKEN")
	writeClient := influxdb2.NewClientWithOptions(url, token, influxdb2.DefaultOptions().SetPrecision(time.Second))

	// Define write API
	org := "ignored"
	bucket := "DATABASE_NAME"
	writeAPI := writeClient.WriteAPIBlocking(org, bucket)

	line := [...]string{
		`home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000`,
		`home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000`,
		`home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1641027600`,
		`home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600`,
		`home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1641031200`,
		`home,room=Kitchen temp=22.7,hum=36.1,co=0i 1641031200`,
		`home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1641034800`,
		`home,room=Kitchen temp=22.4,hum=36.0,co=0i 1641034800`,
		`home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1641038400`,
		`home,room=Kitchen temp=22.5,hum=36.0,co=0i 1641038400`,
		`home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1641042000`,
		`home,room=Kitchen temp=22.8,hum=36.5,co=1i 1641042000`,
		`home,room=Living\ Room temp=22.3,hum=36.1,co=0i 1641045600`,
		`home,room=Kitchen temp=22.8,hum=36.3,co=1i 1641045600`,
		`home,room=Living\ Room temp=22.3,hum=36.1,co=1i 1641049200`,
		`home,room=Kitchen temp=22.7,hum=36.2,co=3i 1641049200`,
		`home,room=Living\ Room temp=22.4,hum=36.0,co=4i 1641052800`,
		`home,room=Kitchen temp=22.4,hum=36.0,co=7i 1641052800`,
		`home,room=Living\ Room temp=22.6,hum=35.9,co=5i 1641056400`,
		`home,room=Kitchen temp=22.7,hum=36.0,co=9i 1641056400`,
		`home,room=Living\ Room temp=22.8,hum=36.2,co=9i 1641060000`,
		`home,room=Kitchen temp=23.3,hum=36.9,co=18i 1641060000`,
		`home,room=Living\ Room temp=22.5,hum=36.3,co=14i 1641063600`,
		`home,room=Kitchen temp=23.1,hum=36.6,co=22i 1641063600`,
		`home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1641067200`,
		`home,room=Kitchen temp=22.7,hum=36.5,co=26i 1641067200`,
	}

	for _, lp := range line {
		err := writeAPI.WriteRecord(context.Background(), lp)
		if err != nil {
			log.Fatalf("Error writing line protocol: %v", err)
		}
	}

	fmt.Println("Data has been written successfully.")
	writeClient.Close()
	return nil
}

func main() {
	if err := dbWrite(context.Background()); err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}
}
```

Replace the following:

- **`DATABASE_NAME`**: your InfluxDB Cloud Dedicated database
- **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with sufficient permissions to the database

Install all the necessary packages and run the program to write the line
protocol to your InfluxDB Cloud Dedicated cluster.

```sh
go get ./...
go run ./write.go
```

{{% /influxdb/custom-timestamps %}}

<!------------------------------- END GO CONTENT ------------------------------>
{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{< expand-wrapper >}}
{{% expand "View the written data" %}}

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

**Congratulations!** You have written data to InfluxDB.
With data now stored in InfluxDB, let's query it.

<!-- The method described
above is the manual way of writing data, but there are other options available:

- [Write data to InfluxDB using no-code solutions](/influxdb/cloud-iox/write-data/no-code/)
- [Write data to InfluxDB using developer tools](/influxdb/cloud-iox/write-data/developer-tools/) -->

{{< page-nav prev="/influxdb/cloud-dedicated/get-started/setup/" next="/influxdb/cloud-dedicated/get-started/query/" keepTab=true >}}
