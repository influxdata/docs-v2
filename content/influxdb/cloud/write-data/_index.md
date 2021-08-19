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

Learn how to quickly start collecting data, and then explore ways to write data, best practices, and what we recommend if you're migrating a large amount of historical data.

There are multiple options for writing data into InfluxDB.

  - [Best practices](/influxdb/cloud/write-data/best-practices/)
     - [Optimize writes](/influxdb/v2.0/write-data/best-practices/optimize-writes/)
     - [Duplicate points](/influxdb/v2.0/write-data/best-practices/duplicate-points/)
     - [InfluxDB schema design](/influxdb/v2.0/write-data/best-practices/schema-design/)
     - [Revolve high series cardinality](/influxdb/v2.0/write-data/best-practices/resolve-high-cardinality/)
  - [No-code solutions](/influxdb/cloud/write-data/no-code)
     - [Telegraf](/influxdb/v2.0/write-data/no-code/use-telegraf/)
     - [Scrape data](/influxdb/v2.0/write-data/no-code/scrape-data/)
     - [no-code third-party technologies](/influxdb/v2.0/write-data/no-code/third-party/)
  - [Developer tools](/influxdb/cloud/write-data/developer-tools)
     - [Optimize writes to InfluxDB](/influxdb/cloud/write-data/best-practices/optimize-writes/)
     - [Handle duplicate data points](/influxdb/cloud/write-data/best-practices/duplicate-points/)
     - [InfluxDB schema design](/influxdb/cloud/write-data/best-practices/schema-design/)
     - [Revolve high series cardinality](/influxdb/cloud/write-data/best-practices/resolve-high-cardinality/)
  - [Bulk ingest](/influxdb/cloud/write-data/bulk-ingest-cloud/)
  - [Load data source in UI](/influxdb/cloud/write-data/load-data/)

After you have successfully written data in InfluxDB, follow the [Next steps](#next-steps). 

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
