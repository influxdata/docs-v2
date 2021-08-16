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

There are multiple options for writing data into InfluxDB.

  - [No-code solutions](/influxdb/cloud/write-data/no-code)
  - [Developer tools](/influxdb/cloud/write-data/developer-tools)
  - [Best practices](/influxdb/cloud/write-data/best-practices/)
  - [Bulk ingest](/influxdb/cloud/write-data/bulk-ingest-cloud/)
  - [Load data source in UI](/influxdb/cloud/write-data/load-data/)
  - [Delete data](/influxdb/cloud/write-data/delete-data/)

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
