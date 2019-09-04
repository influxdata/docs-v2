---
title: Write data to InfluxDB
list_title: Write data
description: >
  Collect and write time series data to InfluxDB using line protocol, Telegraf, data scrapers,
  the InfluxDB v2 API, `influx` CLI, the InfluxDB UI, and client libaries.
weight: 2
menu:
  v2_0:
    name: Write data
v2.0/tags: [write, line protocol]
---

Collect and write time series data to InfluxDB using [line protocol](/v2.0/reference/line-protocol),
Telegraf, data scrapers, the InfluxDB v2 API, `influx` command line interface (CLI),
the InfluxDB user interface (UI), and client libraries.

- [Requirements to write data](#requirements-to-write-data)
- [InfluxDB v2 API](#write-data-using-the-influxdb-v2-api)
- [influx CLI](#write-data-using-the-influx-cli)
- [InfluxDB UI](#write-data-in-the-influxdb-ui)
- [Other ways to write data to InfluxDB](#other-ways-to-write-data-to-influxdb)

## Requirements to write data
To write data to InfluxDB, you must have an organization, bucket, authentication token,
and data formatted in line protocol.

### Organization
The organization in which to write data.
Use your organization name or ID.

### Bucket
The bucket in which to write data.
Use the bucket name or ID.
The bucket must belong to the specified organization.

### Precision
The precision of timestamps provided in the line protocol.
Default timestamp precision is in nanoseconds.

If the precision of the timestamps is anything other than nanoseconds (ns),
you must specify the precision in your write request.
InfluxDB accepts the following precisions:

- `ns` - Nanoseconds
- `us` - Microseconds
- `ms` - Milliseconds
- `s` - Seconds

### Authentication token
All InfluxDB write interactions require an [authentication token](http://localhost:1313/v2.0/security/tokens/).

### Line protocol
Use line protocol to write data points to InfluxDB.
Each line represents a data point.
Each point requires a [measurement](/v2.0/reference/line-protocol/#measurement)
and [field set](/v2.0/reference/line-protocol/#field-set) but can also include
a [tag set](/v2.0/reference/line-protocol/#tag-set) and a [timestamp](/v2.0/reference/line-protocol/#timestamp).

{{% note %}}
_If a data point does not include a timestamp, InfluxDB uses the system time (UTC)
of its host machine when it receives the data point._
{{% /note %}}

##### Example line protocol
```sh
mem,host=host1 used_percent=23.43234543 1556892576842902000
cpu,host=host1 usage_user=3.8234,usage_system=4.23874 1556892726597397000
mem,host=host1 used_percent=21.83599203 1556892777007291000
```

_For details about line protocol, see the [Line protocol reference](/v2.0/reference/line-protocol) ._  
<!-- Link to line protocol best practices -->

## Write data using the InfluxDB v2 API
Use the InfluxDB API `/write` endpoint to write data to InfluxDB.
Include the following in your request:

| Requirement          | Include by                                               |
|:-----------          |:----------                                               |
| Organization         | Use the `org` query parameter in your request URL.       |
| Bucket               | Use the `bucket` query parameter in your request URL.    |
| Precision            | Use the `precision` query parameter in your request URL. |
| Authentication token | Use the `Authorization: Token` header.                   |
| Line protocol        | Pass as plain text in your request body.                 |

###### Example API write request
```sh
curl "http://localhost:9999/api/v2/write?org=YOUR_ORG&bucket=YOUR_BUCKET&precision=s" \
  --header "Authorization: Token YOURAUTHTOKEN" \
  --data-raw "mem,host=host1 used_percent=23.43234543 1556896326"
```

## Write data using the influx CLI
Use the [`influx write` command](/v2.0/reference/cli/influx/write/) to write data to InfluxDB.
Include the following in your command:

| Requirement          | Include by                                                                  |
|:-----------          |:----------                                                                  |
| Organization         | Use the `-o`,`--org`, or `--org-id` flags.                                  |
| Bucket               | Use the `-b`, `--bucket`, or `--bucket-id` flags.                           |
| Precision            | Use the the `-p`, `--precision` flag.                                       |
| Authentication token | Set the `INFLUX_TOKEN` environment variable or use the `t`, `--token` flag. |
| Line protocol        | Write a single line as a string or pass a file path prefixed with `@`.      |


##### Example influx write commands
```sh
# Write a single data point
influx write -b bucketName -o orgName -p s 'myMeasurement,host=myHost testField="testData" 1556896326'

# Write line protocol from a file
influx write -b bucketName -o orgName -p s @/path/to/line-protocol.txt
```

## Write data in the InfluxDB UI
1. Click **Load Data** in the left navigation menu.

    {{< nav-icon "load data" >}}

2. Select **Buckets**.
3. Hover over the bucket to write data to and click **{{< icon "plus" >}} Add Data**.
4. Select **Line Protocol**.
   _You can also [use Telegraf](/v2.0/write-data/use-telegraf/) or
   [scrape data](/v2.0/write-data/scrape-data/)._
5. Select **Upload File** or **Enter Manually**.

    - **Upload File:**
      Select the time precision of your data.
      Drag and drop the line protocol file into the UI or click to select the
      file from your file manager.
    - **Enter Manually:**
      Select the time precision of your data.
      Manually enter line protocol.

6. Click **Continue**.
   A message indicates whether data is successfully written to InfluxDB.
7. To add more data or correct line protocol, click **Previous**.
8. Click **Finish**.

## Other ways to write data to InfluxDB

{{< children >}}

### InfluxDB client libraries
Use language-specific client libraries to integrate with the InfluxDB v2 API.
See [Client libraries reference](/v2.0/reference/client-libraries/) for more information.
