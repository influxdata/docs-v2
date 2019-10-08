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

<!-- CONTENTS -->
<!-- - [Before you begin](#before-you-begin) -->
<!-- - [InfluxDB v2 API](#write-data-using-the-influxdb-v2-api) -->
<!-- - [influx CLI](#write-data-using-the-influx-cli) -->
<!-- - [InfluxDB UI](#write-data-in-the-influxdb-ui) -->
<!-- - [Other ways to write data to InfluxDB](#other-ways-to-write-data-to-influxdb) -->

### Before you begin

First, install InfluxDBv2 by following [these instructions](/v2.0/get-started).

### What you'll need
#### The basics

To write data to InfluxDB, you will need to have an _organization_, a _bucket_, and an _authentication token_.
(All InfluxDB write interactions require an [authentication token](/v2.0/security/tokens/).)
If you've installed using the graphical UI, you should have been guided through creating all these.

#### Data

Of course, you'll also need data.
Data is written to InfluxDB using _line protocol_ format.
Each line represents a data point.
Each point requires a [*measurement*](/v2.0/reference/line-protocol/#measurement)
and [*field set*](/v2.0/reference/line-protocol/#field-set) but can also include
a [*tag set*](/v2.0/reference/line-protocol/#tag-set) and a [*timestamp*](/v2.0/reference/line-protocol/#timestamp).

```sh
mem,host=host1 used_percent=23.43234543 1556892576842902000
cpu,host=host1 usage_user=3.8234,usage_system=4.23874 1556892726597397000
mem,host=host1 used_percent=21.83599203 1556892777007291000
```

Timestamps are essential.
If a data point does not include a timestamp when it is written, InfluxDB uses the current system time (UTC) of its host machine.)

The default precision for timestamps is in nanoseconds.
If the precision of the timestamps is anything other than nanoseconds (`ns`),
you must specify the precision in your write request.
InfluxDB accepts the following precisions:

- `ns` - Nanoseconds
- `us` - Microseconds
- `ms` - Milliseconds
- `s` - Seconds

_For more details about line protocol, see the [Line protocol reference](/v2.0/reference/line-protocol)._
<!-- Link to line protocol best practices -->

## Methods

### Write data using the InfluxDB API

Data can be written to InfluxDB using raw http requests.
Use the InfluxDB API `/write` endpoint to write data to InfluxDB.
Include the following in your request:

| Requirement          | Include by                                               |
|:-----------          |:----------                                               |
| Organization         | Use the `org` query parameter in your request URL.       |
| Bucket               | Use the `bucket` query parameter in your request URL.    |
| Precision            | Use the `precision` query parameter in your request URL. |
| Authentication token | Use the `Authorization: Token` header.                   |
| Line protocol        | Pass as plain text in your request body.                 |

Below is an example API write request using `curl`:

```sh
curl "http://localhost:9999/api/v2/write?org=YOUR_ORG&bucket=YOUR_BUCKET&precision=s" \
  --header "Authorization: Token YOURAUTHTOKEN" \
  --data-raw "mem,host=host1 used_percent=23.43234543 1556896326"
```

### Write data using the influx CLI

Use the [`influx write` command](/v2.0/reference/cli/influx/write/) to write data to InfluxDB.
Include the following in your command:

| Requirement          | Include by                                                                  |
|:-----------          |:----------                                                                  |
| Organization         | Use the `-o`,`--org`, or `--org-id` flags.                                  |
| Bucket               | Use the `-b`, `--bucket`, or `--bucket-id` flags.                           |
| Precision            | Use the the `-p`, `--precision` flag.                                       |
| Authentication token | Set the `INFLUX_TOKEN` environment variable or use the `t`, `--token` flag. |
| Line protocol        | Write a single line as a string or pass a file path prefixed with `@`.      |

To write a single data point, for example, run

```sh
influx write -b bucketName -o orgName -p s 'myMeasurement,host=myHost testField="testData" 1556896326'
```

To write data in line protocol from a file, try

```
influx write -b bucketName -o orgName -p s @/path/to/line-protocol.txt
```

### Write data in the InfluxDB UI

1. Click **Load Data** in the left navigation menu.

    {{< nav-icon "load data" >}}

2. Select **Buckets**.
3. Under the bucket you want to write data to, click **{{< icon "plus" >}} Add Data**.
4. Select from the following options:

    - [Configure Telegraf Agent](#configure-telegraf-agent)
    - [Line Protocol](#line-protocol-1)
    - [Scrape Metrics](#scrape-metrics)

    ---

    #### Configure Telegraf Agent
    1.  To configure a Telegraf agent, see [Automatically create a Telegraf configuration](/v2.0/write-data/use-telegraf/auto-config/#create-a-telegraf-configuration).

    ---

    #### Line Protocol
    1.  Select **Upload File** or **Enter Manually**.
        - **Upload File:**
          Select the time precision of your data.
          Drag and drop the line protocol file into the UI or click to select the
          file from your file manager.
        - **Enter Manually:**
          Select the time precision of your data.
          Manually enter line protocol.
    2. Click **Continue**.
       A message indicates whether data is successfully written to InfluxDB.
    3. To add more data or correct line protocol, click **Previous**.
    4. Click **Finish**.

    ---

    #### Scrape Metrics
    To scrape metrics, see [Create a scraper](/v2.0/write-data/scrape-data/manage-scrapers/create-a-scraper/#create-a-scraper-in-the-influxdb-ui).

    {{% cloud-msg %}}{{< cloud-name >}} does not support scrapers.
    {{% /cloud-msg %}}

### Other ways to write data to InfluxDB

{{< children >}}

### InfluxDB client libraries

Use language-specific client libraries to integrate with the InfluxDB v2 API.
See [Client libraries reference](/v2.0/reference/client-libraries/) for more information.
