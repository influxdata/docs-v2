---
title: Write data to InfluxDB
list_title: Write data
description: >
  Collect and write time series data to InfluxDB Cloud and InfluxDB OSS.
weight: 2
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

Discover what you'll need to write data into InfluxDB Cloud or OSS (open source). Learn how to quickly start collecting data, and then explore ways to write data, best practices, and what we recommend if you're migrating a large amount of historical data.

- [What you'll need](#what-you-ll-need)
- [Quickly start collecting data](#quickly-start-collecting-data)
  - [Demo data for InfluxDB Cloud](#demo-data-for-influxdb-cloud)
  - [Quick Start for InfluxDB OSS](#quick-start-for-influxdb-oss)
- [Load data from sources in the InfluxDB UI](#load-data-from-sources-in-the-influxdb-user-interface-ui)
- [Use no-code solutions](/influxdb/v2.0/write-data/no-code)
- [Use developer tools](/influxdb/v2.0/write-data/developer-tools)
- [Best practices for writing data](/influxdb/v2.0/write-data/best-practices/)
- [Migrate historical data](/influxdb/v2.0/write-data/bulk-ingest-cloud/)
- [Next steps](#next-steps)

### What you'll need

To write data into InfluxDB, you need the following:

- **organization** – _See [View organizations](/influxdb/v2.0/organizations/view-orgs/#view-your-organization-id)
  for instructions on viewing your organization ID._
- **bucket** – _See [View buckets](/influxdb/v2.0/organizations/buckets/view-buckets/) for
  instructions on viewing your bucket ID._
- **authentication token** – _See [View tokens](/influxdb/v2.0/security/tokens/view-tokens/)
  for instructions on viewing your authentication token._
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

- [Demo data for InfluxDB Cloud](#demo-data-for-influxdb-cloud)
- [Quick Start for InfluxDB OSS](#quick-start-for-influxdb-oss)


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
  [Free Plan](/influxdb/v2.0/account-management/pricing-plans/#free-plan) rate limits**.
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
Use the [Data Explorer](/influxdb/v2.0/visualize-data/explore-metrics/)
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
See [Sample data](/influxdb/v2.0/reference/sample-data) for more sample InfluxDB data sets.
{{% /note %}}

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
(for example, `http://localhost:9999/metrics`), which outputs internal InfluxDB
metrics in the [Prometheus data format](https://prometheus.io/docs/instrumenting/exposition_formats/).
The scraper stores the scraped metrics in the bucket created during the
[initial setup process](/influxdb/v2.0/get-started/#set-up-influxdb).

{{% note %}}
Quick Start is only available in the last step of the setup process.
If you missed the Quick Start option, you can [manually create a scraper](/influxdb/v2.0/write-data/no-code/scrape-data/)
that scrapes data from the `/metrics` endpoint.
{{% /note %}}

---

## Load data from sources in the InfluxDB user interface (UI)

Load data from the following sources in the InfluxDB user interface (UI):

- [Client libraries](#load-data-from-a-client-library-in-the-ui)
- [Telegraf plugins](#load-data-from-a-telegraf-plugin-in-the-ui)

### Load data from a client library in the UI

1.  In the navigation menu on the left, click **Data (Load Data)** > **Sources**.
    {{< nav-icon "data" >}}
2. Do one of the following:
   - Enter a specific client library to search for in the **Search data writing methods** field.
   - Scroll down to browse available client libraries.
3. Click the client library to load data from.
4. Under **Code Sample Options**, you'll see a list of your InfluxDB [tokens](/influxdb/v2.0/reference/glossary/#token) and [buckets](/influxdb/v2.0/reference/glossary/#bucket). Select both an authentication token and a bucket to write your data to. The selected token and bucket are automatically added to scripts on the page that you can use to initialize a client and write data.
5. Click the **Copy to Clipboard** buttons under a script to easily paste the script into your terminal or save the script to reuse for automation.
6. Run the scripts on the page to do the following as needed:
   - Install the package, libraries, or client
   - Write data
   - Execute a Flux query

### Load data from a Telegraf plugin in the UI

1. In the navigation menu on the left, click **Data (Load Data)** > **Sources**.
    {{< nav-icon "data" >}}
2. Do one of the following:
   - Enter a specific Telegraf plugin to search for in the **Search data writing methods** field.
   - Scroll down to browse available plugins.
3. Click the plugin to load data from.
4. [Install Telegraf](/telegraf/v1.15/introduction/installation/).
5. Copy the default configuration script in the UI, and then add the script to your [Telegraf configurations](/influxdb/v2.0/telegraf-configs/).
7. Adjust configuration settings as needed. To find configuration settings for a specific plugin, see [Telegraf plugins](/telegraf/v1.15/plugins/).

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
