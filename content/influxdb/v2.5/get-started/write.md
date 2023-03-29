---
title: Get started writing data
seotitle: Write data | Get started with InfluxDB
list_title: Write data
description: >
  Get started writing data to InfluxDB by learning about line protocol and using
  tools like the InfluxDB UI, `influx` CLI, and InfluxDB API.
menu:
  influxdb_2_5:
    name: Write data
    parent: Get started
    identifier: get-started-write-data
weight: 101
metadata: [2 / 5]
related:
  - /influxdb/v2.5/write-data/
  - /influxdb/v2.5/write-data/best-practices/
  - /influxdb/v2.5/reference/syntax/line-protocol/
  - /{{< latest "telegraf" >}}/
---

InfluxDB provides many different options for ingesting or writing data, including
the following:

- Influx user interface (UI)
- [InfluxDB HTTP API](/influxdb/v2.5/reference/api/)
- [`influx` CLI](/influxdb/v2.5/tools/influx-cli/)
- [Telegraf](/{{< latest "telegraf" >}}/)
- [InfluxDB client libraries](/influxdb/v2.5/api-guide/client-libraries/)

This tutorial walks you through the fundamental of using **line protocol** to write
data to InfluxDB. If using tools like Telegraf or InfluxDB client libraries, they will
build the line protocol for you, but it's good to understand how line protocol works.

## Line protocol

All data written to InfluxDB is written using **line protocol**, a text-based
format that lets you provide the necessary information to write a data point to InfluxDB.
_This tutorial covers the basics of line protocol, but for detailed information,
see the [Line protocol reference](/influxdb/v2.5/reference/syntax/line-protocol/)._

### Line protocol elements

Each line of line protocol contains the following elements:

{{< req type="key" >}}

- {{< req "\*" >}} **measurement**:  String that identifies the [measurement]() to store the data in.
- **tag set**: Comma-delimited list of key value pairs, each representing a tag.
  Tag keys and values are unquoted strings. _Spaces, commas, and equal characters must be escaped._
- {{< req "\*" >}} **field set**: Comma-delimited list key value pairs, each representing a field.
  Field keys are unquoted strings. _Spaces and commas must be escaped._
  Field values can be [strings](/influxdb/v2.5/reference/syntax/line-protocol/#string) (quoted),
  [floats](/influxdb/v2.5/reference/syntax/line-protocol/#float),
  [integers](/influxdb/v2.5/reference/syntax/line-protocol/#integer),
  [unsigned integers](/influxdb/v2.5/reference/syntax/line-protocol/#uinteger),
  or [booleans](/influxdb/v2.5/reference/syntax/line-protocol/#boolean).
- **timestamp**: [Unix timestamp](/influxdb/v2.5/reference/syntax/line-protocol/#unix-timestamp)
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

_For schema design recommendations, see [InfluxDB schema design](/influxdb/v2.5/write-data/best-practices/schema-design/)._

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

Data is collected hourly beginning at 2022-01-01T08:00:00Z (UTC) until 2022-01-01T20:00:00Z (UTC).
The resulting line protocol would look something like the following:

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

## Write line protocol to InfluxDB

Use the **InfluxDB UI**, **`influx` CLI**, or **InfluxDB API** to write the
line protocol above to InfluxDB.

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}

{{% tab-content %}}
<!------------------------------ BEGIN UI CONTENT ----------------------------->

1.  Visit
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

1.  If you haven't already, [download, install, and configure the `influx` CLI](/influxdb/v2.5/tools/influx-cli/).
2.  Use the [`influx write` command](/influxdb/v2.5/reference/cli/influx/write/)
    to write the [line protocol above](#home-sensor-data-line-protocol) to InfluxDB.
    
    **Provide the following**:

    - `-b, --bucket` or `--bucket-id` flag with the bucket name or ID to write do.
    - `-p, --precision` flag with the timestamp precision (`s`).
    - String-encoded line protocol.
    - [Connection and authentication credentials](/influxdb/v2.5/get-started/setup/?t=influx+CLI#configure-authentication-credentials)

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

<!------------------------------ END CLI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN API CONTENT ----------------------------->

To write data to InfluxDB using the InfluxDB HTTP API, send a request to
the InfluxDB API `/api/v2/write` endpoint using the `POST` request method.

{{< api-endpoint endpoint="http://localhost:8086/api/v2/write" method="post" >}}

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

```sh
export INFLUX_HOST=http://localhost:8086
export INFLUX_ORG=<YOUR_INFLUXDB_ORG>
export INFLUX_TOKEN=<YOUR_INFLUXDB_API_TOKEN>

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
<!------------------------------ END API CONTENT ------------------------------>
{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{< expand-wrapper >}}
{{% expand "View the written data" %}}

| _time                | _measurement | room    | _field | _value |
| :------------------- | :----------- | :------ | :----- | -----: |
| 2022-01-01T08:00:00Z | home         | Kitchen | co     |      0 |
| 2022-01-01T09:00:00Z | home         | Kitchen | co     |      0 |
| 2022-01-01T10:00:00Z | home         | Kitchen | co     |      0 |
| 2022-01-01T11:00:00Z | home         | Kitchen | co     |      0 |
| 2022-01-01T12:00:00Z | home         | Kitchen | co     |      0 |
| 2022-01-01T13:00:00Z | home         | Kitchen | co     |      1 |
| 2022-01-01T14:00:00Z | home         | Kitchen | co     |      1 |
| 2022-01-01T15:00:00Z | home         | Kitchen | co     |      3 |
| 2022-01-01T16:00:00Z | home         | Kitchen | co     |      7 |
| 2022-01-01T17:00:00Z | home         | Kitchen | co     |      9 |
| 2022-01-01T18:00:00Z | home         | Kitchen | co     |     18 |
| 2022-01-01T19:00:00Z | home         | Kitchen | co     |     22 |
| 2022-01-01T20:00:00Z | home         | Kitchen | co     |     26 |

| _time                | _measurement | room    | _field | _value |
| :------------------- | :----------- | :------ | :----- | -----: |
| 2022-01-01T08:00:00Z | home         | Kitchen | hum    |   35.9 |
| 2022-01-01T09:00:00Z | home         | Kitchen | hum    |   36.2 |
| 2022-01-01T10:00:00Z | home         | Kitchen | hum    |   36.1 |
| 2022-01-01T11:00:00Z | home         | Kitchen | hum    |     36 |
| 2022-01-01T12:00:00Z | home         | Kitchen | hum    |     36 |
| 2022-01-01T13:00:00Z | home         | Kitchen | hum    |   36.5 |
| 2022-01-01T14:00:00Z | home         | Kitchen | hum    |   36.3 |
| 2022-01-01T15:00:00Z | home         | Kitchen | hum    |   36.2 |
| 2022-01-01T16:00:00Z | home         | Kitchen | hum    |     36 |
| 2022-01-01T17:00:00Z | home         | Kitchen | hum    |     36 |
| 2022-01-01T18:00:00Z | home         | Kitchen | hum    |   36.9 |
| 2022-01-01T19:00:00Z | home         | Kitchen | hum    |   36.6 |
| 2022-01-01T20:00:00Z | home         | Kitchen | hum    |   36.5 |

| _time                | _measurement | room    | _field | _value |
| :------------------- | :----------- | :------ | :----- | -----: |
| 2022-01-01T08:00:00Z | home         | Kitchen | temp   |     21 |
| 2022-01-01T09:00:00Z | home         | Kitchen | temp   |     23 |
| 2022-01-01T10:00:00Z | home         | Kitchen | temp   |   22.7 |
| 2022-01-01T11:00:00Z | home         | Kitchen | temp   |   22.4 |
| 2022-01-01T12:00:00Z | home         | Kitchen | temp   |   22.5 |
| 2022-01-01T13:00:00Z | home         | Kitchen | temp   |   22.8 |
| 2022-01-01T14:00:00Z | home         | Kitchen | temp   |   22.8 |
| 2022-01-01T15:00:00Z | home         | Kitchen | temp   |   22.7 |
| 2022-01-01T16:00:00Z | home         | Kitchen | temp   |   22.4 |
| 2022-01-01T17:00:00Z | home         | Kitchen | temp   |   22.7 |
| 2022-01-01T18:00:00Z | home         | Kitchen | temp   |   23.3 |
| 2022-01-01T19:00:00Z | home         | Kitchen | temp   |   23.1 |
| 2022-01-01T20:00:00Z | home         | Kitchen | temp   |   22.7 |

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T08:00:00Z | home         | Living Room | co     |      0 |
| 2022-01-01T09:00:00Z | home         | Living Room | co     |      0 |
| 2022-01-01T10:00:00Z | home         | Living Room | co     |      0 |
| 2022-01-01T11:00:00Z | home         | Living Room | co     |      0 |
| 2022-01-01T12:00:00Z | home         | Living Room | co     |      0 |
| 2022-01-01T13:00:00Z | home         | Living Room | co     |      0 |
| 2022-01-01T14:00:00Z | home         | Living Room | co     |      0 |
| 2022-01-01T15:00:00Z | home         | Living Room | co     |      1 |
| 2022-01-01T16:00:00Z | home         | Living Room | co     |      4 |
| 2022-01-01T17:00:00Z | home         | Living Room | co     |      5 |
| 2022-01-01T18:00:00Z | home         | Living Room | co     |      9 |
| 2022-01-01T19:00:00Z | home         | Living Room | co     |     14 |
| 2022-01-01T20:00:00Z | home         | Living Room | co     |     17 |

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T08:00:00Z | home         | Living Room | hum    |   35.9 |
| 2022-01-01T09:00:00Z | home         | Living Room | hum    |   35.9 |
| 2022-01-01T10:00:00Z | home         | Living Room | hum    |     36 |
| 2022-01-01T11:00:00Z | home         | Living Room | hum    |     36 |
| 2022-01-01T12:00:00Z | home         | Living Room | hum    |   35.9 |
| 2022-01-01T13:00:00Z | home         | Living Room | hum    |     36 |
| 2022-01-01T14:00:00Z | home         | Living Room | hum    |   36.1 |
| 2022-01-01T15:00:00Z | home         | Living Room | hum    |   36.1 |
| 2022-01-01T16:00:00Z | home         | Living Room | hum    |     36 |
| 2022-01-01T17:00:00Z | home         | Living Room | hum    |   35.9 |
| 2022-01-01T18:00:00Z | home         | Living Room | hum    |   36.2 |
| 2022-01-01T19:00:00Z | home         | Living Room | hum    |   36.3 |
| 2022-01-01T20:00:00Z | home         | Living Room | hum    |   36.4 |

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T08:00:00Z | home         | Living Room | temp   |   21.1 |
| 2022-01-01T09:00:00Z | home         | Living Room | temp   |   21.4 |
| 2022-01-01T10:00:00Z | home         | Living Room | temp   |   21.8 |
| 2022-01-01T11:00:00Z | home         | Living Room | temp   |   22.2 |
| 2022-01-01T12:00:00Z | home         | Living Room | temp   |   22.2 |
| 2022-01-01T13:00:00Z | home         | Living Room | temp   |   22.4 |
| 2022-01-01T14:00:00Z | home         | Living Room | temp   |   22.3 |
| 2022-01-01T15:00:00Z | home         | Living Room | temp   |   22.3 |
| 2022-01-01T16:00:00Z | home         | Living Room | temp   |   22.4 |
| 2022-01-01T17:00:00Z | home         | Living Room | temp   |   22.6 |
| 2022-01-01T18:00:00Z | home         | Living Room | temp   |   22.8 |
| 2022-01-01T19:00:00Z | home         | Living Room | temp   |   22.5 |
| 2022-01-01T20:00:00Z | home         | Living Room | temp   |   22.2 |

{{% /expand %}}
{{< /expand-wrapper >}}

**Congratulations!** You have written data to InfluxDB. The method described
above is the manual way of writing data, but there are other options available:

- [Write data to InfluxDB using no-code solutions](/influxdb/v2.5/write-data/no-code/)
- [Write data to InfluxDB using developer tools](/influxdb/v2.5/write-data/developer-tools/)

With data now stored in InfluxDB, let's query it.

{{< page-nav prev="/influxdb/v2.5/get-started/setup/" next="/influxdb/v2.5/get-started/query/" keepTab=true >}}
