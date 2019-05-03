---
title: Write data to InfluxDB
description: >
  placeholder
weight: 100
menu:
  v2_0:
    name: Write data
    parent: Collect data
v2.0/tags: [write, line protocol]
---

Write time series data to InfluxDB using [Line Protocol](/v2.0/reference/line-protocol)
and the InfluxDB v2 API, the `influx` command line interface (CLI), or the InfluxDB
user interface (UI).

- [Write requirements](#write-requirements)
- [Write data using the InfluxDB v2 API](#write-data-using-the-influxdb-v2-api)
- [Write data using the influx CLI](#write-data-using-the-influx-cli)
- [Write data in the InfluxDB UI](#write-data-in-the-influxdb-ui)

## Write requirements
InfluxDB requires the following to write data.

### Organization
The organization in which to write data.
Use your organization name or ID.

### Bucket
The bucket in which to write data.
Use the bucket name or ID.
The bucket must belong to the specified organization.

### Precision
_Optional_ – If the precision of the timestamps in your [Line Protocol](#line-protocol)
is anything other than nanoseconds (ns), specify the precision.
InfluxDB accepts the following precisions:

- `ns` - Nanoseconds
- `us` - Microseconds
- `ms` - Milliseconds
- `s` - Seconds

### Authentication token
All requests to the InfluxDB API require an [authentication token](http://localhost:1313/v2.0/security/tokens/).

### Line protocol
Line Protocol InfluxDB's text-based format for writing data points.
Each line in Line Protocol represents a data point.
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

_See the [Line Protocol reference](/v2.0/reference/line-protocol) for detailed information about writing Line Protocol._  
<!-- Link to line protocol best practices -->

## Write data using the InfluxDB v2 API
Use the InfluxDB API `/write` endpoint to write data to InfluxDB.
Include [write requirements](#write-requirements) in your request:

| Requirement          | Inclusion method                                         |
|:-----------          |:----------------                                         |
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
Include the [write requirements](#write-requirements) in your command:

| Requirement          | Inclusion method                                                            |
|:-----------          |:----------------                                                            |
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
1. Click on the **Settings** icon in the left navigation menu.

    {{< nav-icon "settings" >}}

2. Select the **Buckets** tab.
3. Hover over the bucket into which you want to write data and click **{{< icon "plus" >}} Add Data**.
4. Select **Line Protocol**.
   _You can also [use Telegraf](/v2.0/collect-data/use-telegraf/) or
   [scrape data](/v2.0/collect-data/scrape-data/)._
5. Select **Upload File** or **Enter Manually**.

    - **Upload File:**
      Select the time precision of your data.
      Drag and drop the Line Protocol file into the UI or click to select the
      file from your file manager.
    - **Enter Manually:**
      Select the time precision of your data.
      Manually enter Line Protocol.

6. Click **Continue**.
7. You will receive a success or failure message depending on whether or not the data was written.
8. Click **Previous** to return to the previous dialog and add more data or correct
   errors in the Line Protocol.
9. Click **Finish** to close the window.
