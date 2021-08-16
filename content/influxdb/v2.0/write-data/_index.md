---
title: Write data to InfluxDB
list_title: Write data
description: >
  Collect and write time series data to InfluxDB Cloud and InfluxDB OSS.
weight: 4
aliases:
  - /influxdb/v2.0/write-data/quick-start/
  - /influxdb/v2.0/write-data/sample-data/demo-data/
menu:
  influxdb_2_0:
    name: Write data
influxdb/v2.0/tags: [write, line protocol]
related:
  - /influxdb/v2.0/write-data/no-code/use-telegraf/
  - /influxdb/v2.0/api/#tag/Write, InfluxDB API /write endpoint
  - /influxdb/v2.0/reference/syntax/line-protocol
  - /influxdb/v2.0/reference/syntax/annotated-csv
  - /influxdb/v2.0/reference/cli/influx/write
---

Discover what you'll need to write data into InfluxDB OSS (open source). Learn how to quickly start collecting data, and then explore ways to write data, best practices, and what we recommend if you're migrating a large amount of historical data.

- [What you'll need](#what-youll-need)
- [Quickly start collecting data](#quickly-start-collecting-data)
  - [Quick Start for InfluxDB OSS](#quick-start-for-influxdb-oss)
  - [Sample data](#sample-data)
- [Load data from sources in the InfluxDB UI](/influxdb/v2.0/write-data/load-data/)
- [Use no-code solutions](/influxdb/v2.0/write-data/no-code)
- [Use developer tools (`influx` CLI and others)](/influxdb/v2.0/write-data/developer-tools)
- [Best practices for writing data](/influxdb/v2.0/write-data/best-practices/)
- [Next steps](#next-steps)

### What you'll need

To write data into InfluxDB, you need the following:

- **organization** – _See [View organizations](/influxdb/v2.0/organizations/view-orgs/#view-your-organization-id)
  for instructions on viewing your organization ID._
- **bucket** – _See [View buckets](/influxdb/v2.0/organizations/buckets/view-buckets/) for
  instructions on viewing your bucket ID._
- **API token** – _See [View tokens](/influxdb/v2.0/security/tokens/view-tokens/)
  for instructions on viewing your API token._
- **InfluxDB URL** – _See [InfluxDB URLs](/influxdb/v2.0/reference/urls/)_.

The [InfluxDB setup process](/influxdb/v2.0/get-started/#set-up-influxdb) creates each of these.

Use _line protocol_ format to write data into InfluxDB.
Each line represents a data point.
Each point requires a [*measurement*](/influxdb/v2.0/reference/syntax/line-protocol/#measurement)
and [*field set*](/influxdb/v2.0/reference/syntax/line-protocol/#field-set) and may also include
a [*tag set*](/influxdb/v2.0/reference/syntax/line-protocol/#tag-set) and a [*timestamp*](/influxdb/v2.0/reference/syntax/line-protocol/#timestamp).

Line protocol data looks like this:

```sh
mem,host=host1 used_percent=23.43234543 1556892576842902000
cpu,host=host1 usage_user=3.8234,usage_system=4.23874 1556892726597397000
mem,host=host1 used_percent=21.83599203 1556892777007291000
```

#### Timestamp precision

When writing data to InfluxDB, we [recommend including a timestamp](/influxdb/v2.0/reference/syntax/line-protocol/#timestamp) with each point.
If a data point does not include a timestamp when it is received by the database,
InfluxDB uses the current system time (UTC) of its host machine.

The default precision for timestamps is in nanoseconds.
If the precision of the timestamps is anything other than nanoseconds (`ns`),
you must **specify the precision in your write request**.
InfluxDB accepts the following precisions:

- `ns` - Nanoseconds
- `us` - Microseconds
- `ms` - Milliseconds
- `s` - Seconds

_For more details about line protocol, see the [Line protocol reference](/influxdb/v2.0/reference/syntax/line-protocol)
and [Best practices for writing data](/influxdb/v2.0/write-data/best-practices/)._

## Quickly start collecting data

Familiarize yourself with querying, visualizing, and processing data in InfluxDB Cloud and InfluxDB OSS by collecting data right away. The following options are available:

- [Quick Start for InfluxDB OSS](#quick-start-for-influxdb-oss)
- [Sample data](#sample-data)

## Quick Start for InfluxDB OSS

Select **Quick Start** in the last step of the InfluxDB user interface's (UI)
[setup process](/influxdb/v2.0/get-started/#set-up-influxdb) to quickly start collecting data with InfluxDB.
Quick Start creates a data scraper that collects metrics from the InfluxDB `/metrics` endpoint.
The scraped data provides a robust dataset of internal InfluxDB metrics that you can query, visualize, and process.

### Use Quick Start to collect InfluxDB metrics
After [setting up InfluxDB v2.0](/influxdb/v2.0/get-started/#set-up-influxdb),
the "Let's start collecting data!" page displays options for collecting data.
Click **Quick Start**.

InfluxDB creates and configures a new [scraper](/influxdb/v2.0/write-data/no-code/scrape-data/).
The target URL points to the `/metrics` HTTP endpoint of your local InfluxDB instance
(for example, `http://localhost:8086/metrics`), which outputs internal InfluxDB
metrics in the [Prometheus data format](https://prometheus.io/docs/instrumenting/exposition_formats/).
The scraper stores the scraped metrics in the bucket created during the
[initial setup process](/influxdb/v2.0/get-started/#set-up-influxdb).

{{% note %}}
Quick Start is only available in the last step of the setup process.
If you missed the Quick Start option, you can [manually create a scraper](/influxdb/v2.0/write-data/no-code/scrape-data/)
that scrapes data from the `/metrics` endpoint.
{{% /note %}}

## Sample data
Use [sample data sets](/influxdb/v2.0/reference/sample-data/) to quickly populate
InfluxDB with sample time series data.

---

## Next steps
With your data in InfluxDB, you're ready to do one or more of the following:

### Query and explore your data
Query data using Flux, the UI, and the `influx` command line interface.
See [Query data](/influxdb/v2.0/query-data/).

### Process your data
Use InfluxDB tasks to process and downsample data. See [Process data](/influxdb/v2.0/process-data/).

### Visualize your data
Build custom dashboards to visualize your data.
See [Visualize data](/influxdb/v2.0/visualize-data/).

### Monitor your data and send alerts
Monitor your data and sends alerts based on specified logic.
See [Monitor and alert](/influxdb/v2.0/monitor-alert/).
