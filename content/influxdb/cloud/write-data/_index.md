---
title: Write data to InfluxDB
list_title: Write data
description: >
  Collect and write time series data to InfluxDB Cloud and InfluxDB OSS.
weight: 3
aliases:
  - /influxdb/cloud/write-data/quick-start/
  - /influxdb/cloud/write-data/sample-data/demo-data/
menu:
  influxdb_cloud:
    name: Write data
influxdb/cloud/tags: [write, line protocol]
related:
  - /influxdb/cloud/write-data/no-code/use-telegraf/
  - /influxdb/cloud/api/#tag/Write, InfluxDB API /write endpoint
  - /influxdb/cloud/reference/syntax/line-protocol
  - /influxdb/cloud/reference/syntax/annotated-csv
  - /influxdb/cloud/reference/cli/influx/write
---

Discover what you'll need to write data into InfluxDB Cloud. Learn how to quickly start collecting data, and then explore ways to write data, best practices, and what we recommend if you're migrating a large amount of historical data.

- [What you'll need](#what-youll-need)
- [Quickly start collecting data](#quickly-start-collecting-data)
  - [Demo data for InfluxDB Cloud](#demo-data-for-influxdb-cloud)
  - [Sample data](#sample-data)
- [Load data from sources in the InfluxDB UI](/influxdb/v2.0/write-data/load-data/)
- [Use no-code solutions](/influxdb/v2.0/write-data/no-code)
- [Use developer tools](/influxdb/v2.0/write-data/developer-tools)
- [Best practices for writing data](/influxdb/v2.0/write-data/best-practices/)
- [Next steps](#next-steps)

### What you'll need

To write data into InfluxDB, you need the following:

- **organization** – _See [View organizations](/influxdb/cloud/organizations/view-orgs/#view-your-organization-id)
  for instructions on viewing your organization ID._
- **bucket** – _See [View buckets](/influxdb/cloud/organizations/buckets/view-buckets/) for
  instructions on viewing your bucket ID._
- **API token** – _See [View tokens](/influxdb/cloud/security/tokens/view-tokens/)
  for instructions on viewing your API token._
- **InfluxDB Cloud region URL** – _See [InfluxDB Cloud regions](/influxdb/cloud/reference/regions/)_.

Use _line protocol_ format to write data into InfluxDB.
Each line represents a data point.
Each point requires a [*measurement*](/influxdb/cloud/reference/syntax/line-protocol/#measurement)
and [*field set*](/influxdb/cloud/reference/syntax/line-protocol/#field-set) and may also include
a [*tag set*](/influxdb/cloud/reference/syntax/line-protocol/#tag-set) and a [*timestamp*](/influxdb/cloud/reference/syntax/line-protocol/#timestamp).

Line protocol data looks like this:

```sh
mem,host=host1 used_percent=23.43234543 1556892576842902000
cpu,host=host1 usage_user=3.8234,usage_system=4.23874 1556892726597397000
mem,host=host1 used_percent=21.83599203 1556892777007291000
```

#### Timestamp precision

When writing data to InfluxDB, we [recommend including a timestamp](/influxdb/cloud/reference/syntax/line-protocol/#timestamp) with each point.
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

_For more details about line protocol, see the [Line protocol reference](/influxdb/cloud/reference/syntax/line-protocol)
and [Best practices for writing data](/influxdb/cloud/write-data/best-practices/)._

## Quickly start collecting data

Familiarize yourself with querying, visualizing, and processing data in InfluxDB Cloud by collecting data right away. The following options are available:

- [Demo data for InfluxDB Cloud](#demo-data-for-influxdb-cloud)
- [Sample data](#sample-data)

## Demo data for InfluxDB Cloud
Use **InfluxDB Cloud** demo data buckets for quick and easy access to different
types of demo data that let you explore and familiarize yourself with InfluxDB Cloud.

{{< youtube GSaByPC1Bdc >}}

- [Add a demo data bucket](#add-a-demo-data-bucket)
- [Explore demo data](#explore-demo-data)
- [View demo data dashboards](#view-demo-data-dashboards)

{{% note %}}
#### Free to use and read-only
- InfluxDB Cloud demo data buckets are **free to use** and are **_not_ subject to
  [Free Plan](/influxdb/cloud/account-management/pricing-plans/#free-plan) rate limits**.
- Demo data buckets are **read-only**. You cannot write data into demo data buckets.
{{% /note %}}

## Demo data sets
Choose from the following demo data sets:

- **Website Monitoring**  
  Explore, visualize, and monitor HTTP response metrics from InfluxData websites.


## Add a demo data bucket
1.  In the navigation menu on the left, click **Data (Load Data)** > **Buckets**.

    {{< nav-icon "data" >}}

2.  Click **{{< icon "plus" >}} Add Demo Data**, and then select the demo data bucket to add.
3.  The Demo Data bucket appears in your list of buckets.

## Explore demo data
Use the [Data Explorer](/influxdb/cloud/visualize-data/explore-metrics/)
to query and visualize data in demo data buckets.

In the navigation menu on the left, click **Explore (Data Explorer)**.

{{< nav-icon "explore" >}}

## View demo data dashboards
After adding a demo data bucket, view the pre-built dashboard specific to the demo data set:

1. In the navigation menu on the left, click **Boards (Dashboards)**.

    {{< nav-icon "dashboards" >}}

2. Click the name of the dashboard that corresponds to your demo data bucket.

{{% note %}}
#### Other sample data sets
See [Sample data](/influxdb/cloud/reference/sample-data) for more sample InfluxDB data sets.
{{% /note %}}

## Sample data
Use [sample data sets](/influxdb/cloud/reference/sample-data/#sample-datasets)
to quickly populate InfluxDB with sample time series data.

---

## Other ways to write data

There are multiple options for writing data into InfluxDB, including both no-code and developer solutions.

  - [No-code solutions](/influxdb/cloud/write-data/no-code)
  - [Developer tools](/influxdb/cloud/write-data/developer-tools)

---

## Next steps
With your data in InfluxDB, you're ready to do one or more of the following:

### Query and explore your data
Query data using Flux, the UI, and the `influx` command line interface.
See [Query data](/influxdb/cloud/query-data/).

### Process your data
Use InfluxDB tasks to process and downsample data. See [Process data](/influxdb/cloud/process-data/).

### Visualize your data
Build custom dashboards to visualize your data.
See [Visualize data](/influxdb/cloud/visualize-data/).

### Monitor your data and send alerts
Monitor your data and sends alerts based on specified logic.
See [Monitor and alert](/influxdb/cloud/monitor-alert/).
