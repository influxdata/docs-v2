---
title: Get started writing data
seotitle: Write data | Get started with InfluxDB
list_title: Write data
description: >
  Get started writing data to InfluxDB by learning about line protocol and using
  tools like the InfluxDB UI, `influx` CLI, and InfluxDB API.
menu:
  influxdb_cloud_serverless:
    name: Write data
    parent: Get started
    identifier: get-started-write-data
weight: 101
metadata: [2 / 3]
related:
  - /influxdb/cloud-serverless/write-data/
  - /influxdb/cloud-serverless/write-data/best-practices/
  - /influxdb/cloud-serverless/reference/syntax/line-protocol/
  - /{{< latest "telegraf" >}}/
---

This tutorial walks you through the fundamental of creating **line protocol** data and writing it to InfluxDB.

InfluxDB provides many different options for ingesting or writing data, including the following:

- Influx user interface (UI)
- InfluxDB HTTP API
- `influx` CLI
- Telegraf
- InfluxDB client libraries

If using tools like Telegraf or InfluxDB client libraries, they can
build the line protocol for you, but it's good to understand how line protocol works.

## Line protocol

All data written to InfluxDB is written using **line protocol**, a text-based
format that lets you provide the necessary information to write a data point to InfluxDB.
_This tutorial covers the basics of line protocol, but for detailed information,
see the [Line protocol reference](/influxdb/cloud-serverless/reference/syntax/line-protocol/)._

### Line protocol elements

Each line of line protocol contains the following elements:

{{< req type="key" >}}

- {{< req "\*" >}} **measurement**:  String that identifies the [measurement]() to store the data in.
- **tag set**: Comma-delimited list of key value pairs, each representing a tag.
  Tag keys and values are unquoted strings. _Spaces, commas, and equal characters must be escaped._
- {{< req "\*" >}} **field set**: Comma-delimited list of key value pairs, each representing a field.
  Field keys are unquoted strings. _Spaces and commas must be escaped._
  Field values can be [strings](/influxdb/cloud-serverless/reference/syntax/line-protocol/#string) (quoted),
  [floats](/influxdb/cloud-serverless/reference/syntax/line-protocol/#float),
  [integers](/influxdb/cloud-serverless/reference/syntax/line-protocol/#integer),
  [unsigned integers](/influxdb/cloud-serverless/reference/syntax/line-protocol/#uinteger),
  or [booleans](/influxdb/cloud-serverless/reference/syntax/line-protocol/#boolean).
- **timestamp**: [Unix timestamp](/influxdb/cloud-serverless/reference/syntax/line-protocol/#unix-timestamp)
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

_For schema design recommendations, see [InfluxDB schema design](/influxdb/cloud-serverless/write-data/best-practices/schema-design/)._

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

The following examples show how to write the 
[sample data](#home-sensor-data-line-protocol), already in line protocol format,
to an InfluxDB Cloud Serverless bucket.

{{% note %}}
All API, cURL, and client library examples in this getting started tutorial assume your InfluxDB
**host**, **organization**, **url**, and **token** are provided by
[environment variables](/influxdb/cloud-serverless/get-started/setup/?t=InfluxDB+API#configure-authentication-credentials).
{{% /note %}}

<!-- To learn more about available tools and write options, see [Write data](influxdb/cloud-serverless/write-data/).-->

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[cURL](#)
[Python](#)
[Go](#)
[Node.js](#)
{{% /tabs %}}

{{% tab-content %}}
<!------------------------------ BEGIN UI CONTENT ----------------------------->

1.  Go to
    {{% oss-only %}}[localhost:8086](http://localhost:8086){{% /oss-only %}}
    {{% cloud-only %}}[cloud2.influxdata.com](https://cloud2.influxdata.com){{% /cloud-only %}}
    in a browser to log in and access the InfluxDB UI.

2.  Navigate to **Load Data** > **Buckets** using the left navigation bar.

{{< nav-icon "load data" >}}

3.  Click **{{< icon "plus" >}} {{< caps >}}Add Data{{< /caps >}}** on the bucket
    you want to write the data to and select **Line Protocol**.
4.  Select **{{< caps >}}Enter Manually{{< /caps >}}**.
5.  {{< req "Important" >}} In the **Precision** drop-down menu above the line
    protocol text field, select **Seconds** (to match to precision of the
    timestamps in the line protocol).
6.  Copy the [line protocol above](#home-sensor-data-line-protocol) and paste it
    into the line protocol text field.
7.  Click **{{< caps >}}Write Data{{< /caps >}}**.

The UI will confirm that the data has been written successfully.

<!------------------------------- END UI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!---------------------------- BEGIN CLI CONTENT ----------------------------->

1.  If you haven't already, [download, install, and configure the `influx` CLI](/influxdb/cloud-serverless/tools/influx-cli/).
2.  Use the [`influx write` command](/influxdb/cloud-serverless/reference/cli/influx/write/)
    to write the [line protocol above](#home-sensor-data-line-protocol) to InfluxDB.
    
    **Provide the following**:

    - `-b, --bucket` or `--bucket-id` flag with the bucket name or ID to write do.
    - `-p, --precision` flag with the timestamp precision (`s`).
    - String-encoded line protocol.
    - [Connection and authentication credentials](/influxdb/cloud-serverless/get-started/setup/?t=influx+CLI#configure-authentication-credentials)

{{% influxdb/custom-timestamps %}}

```sh
influx write \
  --bucket get-started \
  --precision s "
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

<!------------------------------ END CLI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN cURL CONTENT ----------------------------->

To write data to InfluxDB using the InfluxDB HTTP API, send a request to
the InfluxDB API `/api/v2/write` endpoint using the `POST` request method.

{{< api-endpoint endpoint="http://localhost:8086/api/v2/write" method="post" api-ref="/influxdb/cloud-serverless/api/#operation/PostWrite" >}}

Include the following with your request:

- **Headers**:
  - **Authorization**: Token <INFLUX_TOKEN>
  - **Content-Type**: text/plain; charset=utf-8
  - **Accept**: application/json
- **Query parameters**:
  - **org**: InfluxDB organization name
  - **bucket**: InfluxDB bucket name
  - **precision**: timestamp precision (default is `ns`)
- **Request body**: Line protocol as plain text

The following example uses cURL and the InfluxDB API to write line protocol
to InfluxDB:

{{% influxdb/custom-timestamps %}}
```sh
curl --request POST \
"https://cloud2.influxdata.com/api/v2/write?bucket=get-started&precision=s" \
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
<!------------------------------ END cURL CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!---------------------------- BEGIN PYTHON CONTENT --------------------------->
{{% influxdb/custom-timestamps %}}

To write data to InfluxDB Cloud Serverless using Python, use the
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

3.  Install the following dependencies:

    - `pyarrow`
    - `flightsql-dbapi`
    - `pyinflux3`

    ```python
    pip install pyarrow flightsql-dbapi pyinflux3
    ```

4.  Create a file for your code--for example, `write.py`.

    ```sh
    touch write.py
    ```

5.  Inside of `write.py`, enter the following sample code:

      ```py
      from influxdb_client_3 import InfluxDBClient3

      # INFLUX_TOKEN is an environment variable you assigned to your
      # API token value.
      token = os.getenv('INFLUX_TOKEN')

      # host is the URL without protocol or trailing slash
      client = InfluxDBClient3(
          host='cloud2.influxdata.com',
          org='',
          token=token,
          database='get-started'
      )

      lines = [
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
          "home,room=Kitchen temp=22.7,hum=36.5,co=26i 1641067200"
      ]

      client.write(lines,write_precision='s')
      ```

    The sample does the following:

    1.  Imports the `InfluxDBClient3` object from the `influxdb_client_3` module.
    2.  Calls the `InfluxDBClient3()` constructor to instantiate an InfluxDB client
        configured with the following credentials:

        - **host**: InfluxDB Cloud Serverless region hostname (URL without protocol or trailing slash)
        - **org**: an empty or arbitrary string (InfluxDB ignores this parameter)
        - **token**: InfluxDB API token with write access to the target database
        - **database**: InfluxDB Cloud Serverless bucket name
    
    3.  Defines a list of line protocol strings where each string represents a data record.
    4.  Calls the `client.write()` method with the line protocol record list and write options.

        **Because the timestamps in the sample line protocol are in second
        precision, the example passes the `write_precision='s'` option
        to set the timestamp precision to seconds.**

6.  To execute the module and write line protocol to your InfluxDB Cloud Serverless
    bucket, enter the following command in your terminal:
    
      ```sh
      python write.py
      ```

{{% /influxdb/custom-timestamps %}}

<!----------------------------- END PYTHON CONTENT ---------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN GO CONTENT ------------------------------>
{{% influxdb/custom-timestamps %}}

To write data to InfluxDB Cloud Serverless using Go, use the
[influxdb-client-go module](https://github.com/influxdata/influxdb-client-go).

1.  Inside of your project directory, create a new module directory and navigate into it.

    ```sh
    mkdir influxdb_go_client && cd $_
    ```

2.  Initialize a new Go module in the directory.

    ```sh
    go mod init influxdb_go_client
    ```

3. Create a file for your code--for example, `write.go`.

    ```sh
    touch write.go
    ```

4.  Inside of `write.go`, enter the following sample code:

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

    // Write line protocol data to InfluxDB
    func dbWrite(ctx context.Context) error {

      // INFLUX_URL is an environment variable you assigned to your
      // region URL.
      url := os.Getenv("INFLUX_URL")

      // INFLUX_TOKEN is an environment variable you assigned to your
      // API token value.
      token := os.Getenv("INFLUX_TOKEN")
      client := influxdb2.NewClientWithOptions(url,
                      token,
                      influxdb2.DefaultOptions().SetPrecision(time.Second))

      // Define write API
      org := "ignored"
      bucket := "get-started"
      writeAPI := client.WriteAPIBlocking(org, bucket)

      // Define line protocol records to write.
      // Use a raw string literal (denoted by backticks)
      // to preserve backslashes and prevent interpretation
      // of escape sequences--for example, escaped spaces in tag values.
      lines := [...]string{
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

      // Iterate over the lines array and write each line
      // separately to InfluxDB

      for _, lp := range lines {
        err := writeAPI.WriteRecord(context.Background(), lp)
        if err != nil {
          log.Fatalf("Error writing line protocol: %v", err)
        }
      }

      fmt.Println("Data has been written successfully.")
      client.Close()
      return nil
    }

    // Module main function
    func main() {
      if err := dbWrite(context.Background()); err != nil {
        fmt.Fprintf(os.Stderr, "error: %v\n", err)
        os.Exit(1)
      }
    }
    ```

    The sample does the following:

    1.  Imports required packages.
      
    2.  Defines a `dbWrite()` function that does the following:
        
        1.  Calls the `influxdb2.NewClientWithOptions()` with InfluxDB URL,
            API token, and options to create client.

            **Because the timestamps in the sample line protocol are in second
            precision, the example passes `DefaultOptions.SetPrecision(time.Second)`
            for the `precision` option in order to set the timestamp precision to
            seconds.**

        2.  Calls the `writeClient.WriteAPIBlocking()` method to
            create a `writeAPI` client configured to write to the bucket
            (the method requires an `org` argument, but InfluxDB ignores it).
    
        3.  Defines an array of line protocol strings where each string
            represents a data record.
    
        4.  Iterates through the array of line protocol and calls the
            write client's `WriteRecord()` method
            to write each line of line protocol separately to InfluxDB.
    
    3.  Defines a `main` function that executes the `dbWrite` function for the module.

5.  In your terminal, enter the following command to install the packages listed
    in `imports`:

    ```sh
    go get ./...
    ```

6.  To execute the module and write the line protocol
    to your InfluxDB Cloud Serverless bucket, enter the following command:

    ```sh
    go run ./write.go
    ```
{{% /influxdb/custom-timestamps %}}
<!------------------------------- END GO CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN NODE.JS CONTENT ----------------------->
{{% influxdb/custom-timestamps %}}

To write data to InfluxDB Cloud Serverless using Node.JS, use the
[influxdb-client-js package](https://github.com/influxdata/influxdb-client-js).

1. Inside of your project directory, create an NPM or Yarn package and install 
    the `@influxdata/influxdb-client` InfluxDB v2 JavaScript client library.

    ```sh
    npm init -y && npm install --save @influxdata/influxdb-client
    ```

2. Create a file for your code--for example: `write.js`.

    ```sh
    touch write.js
    ```

3. Inside of `write.js`, enter the following sample code:

    ```js
    'use strict'
    /** @module write
    * Writes line protocol strings to InfluxDB using the Javascript client
    * library with Node.js.
    **/
    import {InfluxDB} from '@influxdata/influxdb-client';

    /** Get credentials from environment variables. **/
    const url = process.env.INFLUX_URL;
    const token = process.env.INFLUX_TOKEN;
    const org = process.env.INFLUX_ORG;

    /**
    * Instantiate the InfluxDB client with a configuration object.
    **/
    const influxDB = new InfluxDB({url, token});

    /** 
    * Define an array of line protocol strings to write.
    * Include an additional backslash to preserve backslashes
    * and prevent interpretation of escape sequences---for example,
    * escaped spaces in tag values.
    */
    const lines = [
      'home,room=Living\\ Room temp=21.1,hum=35.9,co=0i 1641024000',
      'home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000',
      'home,room=Living\\ Room temp=21.4,hum=35.9,co=0i 1641027600',
      'home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600',
      'home,room=Living\\ Room temp=21.8,hum=36.0,co=0i 1641031200',
      'home,room=Kitchen temp=22.7,hum=36.1,co=0i 1641031200',
      'home,room=Living\\ Room temp=22.2,hum=36.0,co=0i 1641034800',
      'home,room=Kitchen temp=22.4,hum=36.0,co=0i 1641034800',
      'home,room=Living\\ Room temp=22.2,hum=35.9,co=0i 1641038400',
      'home,room=Kitchen temp=22.5,hum=36.0,co=0i 1641038400',
      'home,room=Living\\ Room temp=22.4,hum=36.0,co=0i 1641042000',
      'home,room=Kitchen temp=22.8,hum=36.5,co=1i 1641042000',
      'home,room=Living\\ Room temp=22.3,hum=36.1,co=0i 1641045600',
      'home,room=Kitchen temp=22.8,hum=36.3,co=1i 1641045600',
      'home,room=Living\\ Room temp=22.3,hum=36.1,co=1i 1641049200',
      'home,room=Kitchen temp=22.7,hum=36.2,co=3i 1641049200',
      'home,room=Living\\ Room temp=22.4,hum=36.0,co=4i 1641052800',
      'home,room=Kitchen temp=22.4,hum=36.0,co=7i 1641052800',
      'home,room=Living\\ Room temp=22.6,hum=35.9,co=5i 1641056400',
      'home,room=Kitchen temp=22.7,hum=36.0,co=9i 1641056400',
      'home,room=Living\\ Room temp=22.8,hum=36.2,co=9i 1641060000',
      'home,room=Kitchen temp=23.3,hum=36.9,co=18i 1641060000',
      'home,room=Living\\ Room temp=22.5,hum=36.3,co=14i 1641063600',
      'home,room=Kitchen temp=23.1,hum=36.6,co=22i 1641063600',
      'home,room=Living\\ Room temp=22.2,hum=36.4,co=17i 1641067200',
      'home,room=Kitchen temp=22.7,hum=36.5,co=26i 1641067200',
    ];

    /**
    * Create a write client from the getWriteApi method.
    * Provide your org and bucket.
    **/
    const writeApi = influxDB.getWriteApi(org, 'get-started', 's');

    /**
    * Write line protocol to the batch
    */
    writeApi.writeRecords(lines);

    /**
    * Flush pending writes from the buffer and close the write client.
    **/
    writeApi.close().then(
      () => {
        console.log('Data has been written successfully.');
      },
      (err) => {
        console.log('Error writing line protocol');
      }
    );
    ```

    The sample does the following:

      1.  Calls the `new InfluxDB()` constructor to instantiate a client configured
           with the InfluxDB URL and API token.

      2.  Defines an array of line protocol strings where each string represents a data record.

      3.  Calls the client's `getWriteApi()` method to create a
          **write client** configured to write to the bucket
          (the method requires an `org` argument, but InfluxDB ignores it).

          **Because the timestamps in the sample line protocol are in second
            precision, the example passes `'s'` for the `precision` option in order
            to set the timestamp precision to seconds**.

      6.  Calls the write client's `writeRecords()` method with the line protocol array
          to write the records in batches to InfluxDB.

      7.  Calls the write client's `close()` method with callback functions for success and error.
          The `close()` method sends any records remaining in the buffer,
          executes callbacks, and releases resources.

4. To execute the file and write the line protocol to your InfluxDB Cloud Serverless bucket,
    enter the following command in your terminal:
   
    ```sh
    node write.js
    ```
{{% /influxdb/custom-timestamps %}}
<!------------------------------- END NODE.JS CONTENT ------------------------------>
{{% /tab-content %}}
{{< /tabs-wrapper >}}

If successful, the output is the success message; otherwise, error details and the failure message.

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

- [Write data to InfluxDB using no-code solutions](/influxdb/cloud-serverless/write-data/no-code/)
- [Write data to InfluxDB using developer tools](/influxdb/cloud-serverless/write-data/developer-tools/) -->

{{< page-nav prev="/influxdb/cloud-serverless/get-started/setup/" next="/influxdb/cloud-serverless/get-started/query/" keepTab=true >}}
