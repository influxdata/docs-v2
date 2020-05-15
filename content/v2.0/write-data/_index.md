---
title: Write data to InfluxDB
list_title: Write data
description: >
  Collect and write time series data to InfluxDB using line protocol, Telegraf, data scrapers,
  the InfluxDB v2 API, `influx` CLI, the InfluxDB UI, and client libraries.
weight: 2
menu:
  v2_0:
    name: Write data
v2.0/tags: [write, line protocol]
related:
  - /v2.0/write-data/use-telegraf/
  - /v2.0/api/#tag/Write, InfluxDB API /write endpoint
  - /v2.0/reference/syntax/line-protocol
  - /v2.0/reference/syntax/annotated-csv
  - /v2.0/reference/cli/influx/write
---

Collect and write time series data to InfluxDB using [line protocol](/v2.0/reference/syntax/line-protocol),
Telegraf, data scrapers, the InfluxDB v2 API, `influx` command line interface (CLI),
the InfluxDB user interface (UI), client libraries, and third-party technologies.

- [What you'll need](#what-you-ll-need)
- [Ways to write data into InfluxDB](#ways-to-write-data-into-influxdb)
  - [User Interface](#user-interface)
  - [influx CLI](#influx-cli)
  - [InfluxDB API](#influxdb-api)
  - [Third-party technologies (with native line protocol support)](#third-party-technologies)
  - [Other ways to write data](#other-ways-to-write-data)
- [Next steps](#next-steps)

### What you'll need

To write data into InfluxDB, you need the following:

- **organization** – _See [View organizations](/v2.0/organizations/view-orgs/#view-your-organization-id)
  for instructions on viewing your organization ID._
- **bucket** – _See [View buckets](/v2.0/organizations/buckets/view-buckets/) for
  instructions on viewing your bucket ID._
- **authentication token** – _See [View tokens](/v2.0/security/tokens/view-tokens/)
  for instructions on viewing your authentication token._

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

When writing data to InfluxDB, we [recommend including a timestamp](/v2.0/reference/syntax/line-protocol/#timestamp) with each point.
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

_For more details about line protocol, see the [Line protocol reference](/v2.0/reference/syntax/line-protocol)
and [Best practices for writing data](/v2.0/write-data/best-practices/)._

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

{{% cloud %}}{{< cloud-name >}} does not support scrapers.
{{% /cloud %}}

### influx CLI

From the command line, use the [`influx write` command](/v2.0/reference/cli/influx/write/) to write data to InfluxDB.
Include the following in your command:

| Requirement          | Include by                                                                                         |
|:-----------          |:----------                                                                                         |
| Organization         | Use the `-o`,`--org`, or `--org-id` flags.                                                         |
| Bucket               | Use the `-b`, `--bucket`, or `--bucket-id` flags.                                                  |
| Precision            | Use the `-p`, `--precision` flag.                                                                  |
| Authentication token | Set the `INFLUX_TOKEN` environment variable or use the `t`, `--token` flag.                        |
| Data                 | Write data using **line protocol** or **annotated CSV**. Pass a file with the `-f`, `--file` flag. |

_See [Line protocol](/v2.0/reference/syntax/line-protocol/) and [Annotated CSV](/v2.0/reference/syntax/annotated-csv)_

#### Example influx write commands

##### Write a single line of line protocol
```sh
influx write \
  -b bucketName \
  -o orgName \
  -p s \
  'myMeasurement,host=myHost testField="testData" 1556896326'
```

##### Write line protocol from a file
```sh
influx write \
  -b bucketName \
  -o orgName \
  -p s \
  --format=lp
  -f /path/to/line-protocol.txt
```

##### Write annotated CSV from a file
```sh
influx write \
  -b bucketName \
  -o orgName \
  -p s \
  --format=csv
  -f /path/to/data.csv
```

### InfluxDB API

Write data to InfluxDB using an HTTP request to the InfluxDB API `/write` endpoint.
Use the `POST` request method and include the following in your request:

| Requirement          | Include by                                               |
|:-----------          |:----------                                               |
| Organization         | Use the `org` query parameter in your request URL.       |
| Bucket               | Use the `bucket` query parameter in your request URL.    |
| Precision            | Use the `precision` query parameter in your request URL. |
| Authentication token | Use the `Authorization: Token` header.                   |
| Line protocol        | Pass as plain text in your request body.                 |

#### Example API write request

Below is an example API write request using `curl`.
The URL depends on the version and location of your InfluxDB 2.0 instance _(see [InfluxDB URLs](/v2.0/reference/urls/))_.

To compress data when writing to InfluxDB, set the `Content-Encoding` header to `gzip`.
Compressing write requests reduces network bandwidth, but increases server-side load.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Uncompressed](#)
[Compressed](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
curl -XPOST "http://localhost:9999/api/v2/write?org=YOUR_ORG&bucket=YOUR_BUCKET&precision=s" \
  --header "Authorization: Token YOURAUTHTOKEN" \
  --data-raw "
mem,host=host1 used_percent=23.43234543 1556896326
mem,host=host2 used_percent=26.81522361 1556896326
mem,host=host1 used_percent=22.52984738 1556896336
mem,host=host2 used_percent=27.18294630 1556896336
"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
curl -XPOST "http://localhost:9999/api/v2/write?org=YOUR_ORG&bucket=YOUR_BUCKET&precision=s" \
  --header "Authorization: Token YOURAUTHTOKEN" \
  --header "Content-Encoding: gzip" \
  --data-raw "
mem,host=host1 used_percent=23.43234543 1556896326
mem,host=host2 used_percent=26.81522361 1556896326
mem,host=host1 used_percent=22.52984738 1556896336
mem,host=host2 used_percent=27.18294630 1556896336
"
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

_For information about **InfluxDB API response codes**, see
[InfluxDB API Write documentation](/v2.0/api/#operation/PostWrite)._

### Third-party technologies

A number of third-party technologies can be configured to send line protocol directly to InfluxDB.

If you're using any of the following technologies, check out the handy links below to configure these technologies to write data to InfluxDB (**no additional software to download or install**):

- (Write metrics only) [Vector 0.9 or later](#configure-vector)

- [Apache NiFi 1.8 or later](#configure-apache-nifi)

- [OpenHAB 3.0 or later](#configure-openhab)

- [Apache JMeter 5.2 or later](#configure-apache-jmeter)

- [FluentD 1.x or later](#configure-fluentd)

#### Configure Vector

1. On the Vector.dev docs site, see the [InfluxDB Metrics Sink](https://vector.dev/docs/reference/sinks/influxdb_metrics/) page.
2. Under **Configuration**, click **v2** to view configuration settings.
3. Scroll down to [How It Works](https://vector.dev/docs/reference/sinks/influxdb_metrics/#how-it-works) for more detail.

#### Configure Apache NiFi

See the _[InfluxDB Processors for Apache NiFi Readme](https://github.com/influxdata/nifi-influxdb-bundle#influxdb-processors-for-apache-nifi)_ for details.

#### Configure OpenHAB

See the _[InfluxDB Persistence Readme](https://github.com/openhab/openhab-addons/tree/master/bundles/org.openhab.persistence.influxdb)_ for details.

#### Configure Apache JMeter

<!-- after doc updates are made, we can simplify to: See the _[Apache JMeter User's Manual - JMeter configuration](https://jmeter.apache.org/usermanual/realtime-results.html#jmeter-configuration)_ for details. -->

To configure Apache JMeter, complete the following steps in InfluxDB and JMeter.

##### In InfluxDB

1. [Find the name of your organization](https://v2.docs.influxdata.com/v2.0/organizations/view-orgs/) (needed to create a bucket and token).
2. [Create a bucket using the influx CLI](https://v2.docs.influxdata.com/v2.0/organizations/buckets/create-bucket/#create-a-bucket-using-the-influx-cli) and name it `jmeter`.
3. [Create a token](https://v2.docs.influxdata.com/v2.0/security/tokens/create-token/).

##### In JMeter

1. Create a [Backend Listener](https://jmeter.apache.org/usermanual/component_reference.html#Backend_Listener) using the _InfluxDBBackendListenerClient_ implementation.
2. In the **Backend Listener implementation** field, enter _org.apache.jmeter.visualizers.backend.influxdb.influxdbBackendListenerClient_
3. Under **Parameters**, specify the following:
   - **influxdbMetricsSender**: _org.apache.jmeter.visualizers.backend.influxdb.HttpMetricsSender_
   - **influxdbUrl**: _http://localhost:9999/api/v2/write?org=my-org&bucket=jmeter_ (include the bucket and org you created in InfluxDB)
   - **application**: _InfluxDB2_
   - **influxdbToken**: _my-token_ (include the token you created in InfluxDB)
   - Include additional parameters as needed.
4. Click **Add** to add the _InfluxDBBackendListenerClient_ implementation.

#### Configure FluentD 

See the _[influxdb-plugin-fluent Readme](https://github.com/influxdata/influxdb-plugin-fluent)_ for details.

## Other ways to write data

{{< children >}}

### InfluxDB client libraries

Use language-specific client libraries to integrate with the InfluxDB v2 API.
See [Client libraries reference](/v2.0/reference/api/client-libraries/) for more information.

---

## Next steps
With your data in InfluxDB, you're ready to do one or more of the following:

### Query and explore your data
Query data using Flux, the UI, and the `influx` command line interface.
See [Query data](/v2.0/query-data/).

### Process your data
Use InfluxDB tasks to process and downsample data. See [Process data](/v2.0/process-data/).

### Visualize your data
Build custom dashboards to visualize your data.
See [Visualize data](/v2.0/visualize-data/).

### Monitor your data and send alerts
Monitor your data and sends alerts based on specified logic.
See [Monitor and alert](/v2.0/monitor-alert/).
