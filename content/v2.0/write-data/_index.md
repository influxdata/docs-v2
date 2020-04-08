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

Collect and write time series data to InfluxDB using [line protocol](/v2.0/reference/syntax/line-protocol),
Telegraf, data scrapers, the InfluxDB v2 API, `influx` command line interface (CLI),
the InfluxDB user interface (UI), and client libraries.

- [What you'll need](#what-you-ll-need)
- [Ways to write data into InfluxDB](#ways-to-write-data-into-influxdb)
  - [User Interface](#user-interface)
  - [influx CLI](#influx-cli)
  - [InfluxDB API](#influxdb-api)
  - [Others](#others)

### What you'll need

To write data into InfluxDB, you need the following:

- an organization
{{% note %}}
See [View organizations](/v2.0/organizations/view-orgs/#view-your-organization-id) for instructions on viewing your organization ID.
{{% /note %}}
- a bucket
{{% note %}}
See [View buckets](/v2.0/organizations/buckets/view-buckets/) for instructions on viewing your bucket ID.
{{% /note %}}
- an [authentication token](/v2.0/security/tokens/view-tokens/)

The [InfluxDB setup process](/v2.0/get-started/#set-up-influxdb) creates each of these.

Use _line protocol_ format to write data into InfluxDB.
Each line represents a data point.
Each point requires a [*measurement*](/v2.0/reference/syntax/line-protocol/#measurement)
and [*field set*](/v2.0/reference/syntax/line-protocol/#field-set) and may also include
a [*tag set*](/v2.0/reference/syntax/line-protocol/#tag-set) and a [*timestamp*](/v2.0/reference/syntax/line-protocol/#timestamp).

Line protocol data looks like this:

```sh
mem,host=host1 used_percent=23.43234543 1556892576842902000
cpu,host=host1 usage_user=3.8234,usage_system=4.23874 1556892726597397000
mem,host=host1 used_percent=21.83599203 1556892777007291000
```

#### Timestamp precision
Timestamps are essential in InfluxDB.
If a data point does not include a timestamp when it is received by the database,
InfluxDB uses the current system time (UTC) of its host machine.

The default precision for timestamps is in nanoseconds.
If the precision of the timestamps is anything other than nanoseconds (`ns`),
you must specify the precision in your [write request](#ways-to-write-data-into-influxdb).
InfluxDB accepts the following precisions:

- `ns` - Nanoseconds
- `us` - Microseconds
- `ms` - Milliseconds
- `s` - Seconds

_For more details about line protocol, see the [Line protocol reference](/v2.0/reference/syntax/line-protocol) and [Best practices for writing data](/v2.0/write-data/best-practices/)._

## Ways to write data into InfluxDB

To write data into InfluxDB, use one of the following methods:

- [User Interface](#user-interface)
- [influx CLI](#influx-cli)
- [InfluxDB API](#influxdb-api)

### User Interface

To quickly start writing data, use the provided user interface.

1. Do one of the following:
   - _**InfluxDB 2.0 OSS**_:
     In your terminal, run `influxd` and then in your browser, go to the location
     where you're hosting the UI (by default, **localhost:9999**).
   - _**InfluxDB 2.0 Cloud**_:
     In your browser, go to https://cloud2.influxdata.com/.
2. In the navigation menu on the left, select **Data** (**Load Data**) > **Buckets**.
3. Under the bucket you want to write data to, click **{{< icon "plus" >}} Add Data**.
4. Select from the following options:

   - [Configure Telegraf Agent](#configure-telegraf-agent)
   - [Line Protocol](#line-protocol)
   - [Scrape Metrics](#scrape-metrics)

---

#### Configure Telegraf Agent

To configure a Telegraf agent, see [Automatically create a Telegraf configuration](/v2.0/write-data/use-telegraf/auto-config/#create-a-telegraf-configuration).

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
2. Click **Write Data**.
   A message indicates whether data is successfully written to InfluxDB.
3. To add more data or correct line protocol, click **Previous**.
4. Click **Finish**.

---

#### Scrape Metrics

To scrape metrics, see [Create a scraper](/v2.0/write-data/scrape-data/manage-scrapers/create-a-scraper/#create-a-scraper-in-the-influxdb-ui).

{{% cloud-msg %}}{{< cloud-name >}} does not support scrapers.
{{% /cloud-msg %}}

### influx CLI

From the command line, use the [`influx write` command](/v2.0/reference/cli/influx/write/) to write data to InfluxDB.
Include the following in your command:

| Requirement          | Include by                                                                  |
|:-----------          |:----------                                                                  |
| Organization         | Use the `-o`,`--org`, or `--org-id` flags.                                  |
| Bucket               | Use the `-b`, `--bucket`, or `--bucket-id` flags.                           |
| Precision            | Use the `-p`, `--precision` flag.                                       |
| Authentication token | Set the `INFLUX_TOKEN` environment variable or use the `t`, `--token` flag. |
| Line protocol        | Write a single line as a string or pass a file path prefixed with `@`.      |

##### Example influx write commands

To write a single data point, for example, run

```sh
influx write -b bucketName -o orgName -p s 'myMeasurement,host=myHost testField="testData" 1556896326'
```

To write data in line protocol from a file, try

```
influx write -b bucketName -o orgName -p s @/path/to/line-protocol.txt
```

### InfluxDB API

Write data to InfluxDB using an HTTP request to the InfluxDB API `/write` endpoint.
Include the following in your request:

| Requirement          | Include by                                               |
|:-----------          |:----------                                               |
| Organization         | Use the `org` query parameter in your request URL.       |
| Bucket               | Use the `bucket` query parameter in your request URL.    |
| Precision            | Use the `precision` query parameter in your request URL. |
| Authentication token | Use the `Authorization: Token` header.                   |
| Line protocol        | Pass as plain text in your request body.                 |

##### Example API write request

Below is an example API write request using `curl`.
The URL depends on the version and location of your InfluxDB 2.0 instance.

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB OSS](#)
[{{< cloud-name "short">}}](#)
{{% /tabs %}}
{{% tab-content %}}
```sh
curl -XPOST "http://localhost:9999/api/v2/write?org=YOUR_ORG&bucket=YOUR_BUCKET&precision=s" \
  --header "Authorization: Token YOURAUTHTOKEN" \
  --data-raw "mem,host=host1 used_percent=23.43234543 1556896326"
```
{{% /tab-content %}}
{{% tab-content %}}

{{% cloud-msg %}}
For the specific URL of your {{< cloud-name "short" >}} instance, see [InfluxDB Cloud URLs](/v2.0/cloud/urls/).
{{% /cloud-msg %}}

```sh
curl -XPOST "YOUR-INFLUXDB-CLOUD-URL/api/v2/write?org=YOUR_ORG&bucket=YOUR_BUCKET&precision=s" \
  --header "Authorization: Token YOURAUTHTOKEN" \
  --data-raw "mem,host=host1 used_percent=23.43234543 1556896326"
```
{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Others

{{< children >}}

### InfluxDB client libraries

Use language-specific client libraries to integrate with the InfluxDB v2 API.
See [Client libraries reference](/v2.0/reference/api/client-libraries/) for more information.
