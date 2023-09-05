---
title: Use visualization tools to query data
list_title: Use visualization tools
description: >
  Use visualization tools and SQL or InfluxQL to query data stored in InfluxDB.
weight: 301
menu:
  influxdb_cloud_dedicated:
    parent: Execute queries
    name: Use visualization tools
    identifier: query-with-visualization-tools
influxdb/cloud-dedicated/tags: [query, sql, influxql]
metadata: [SQL, InfluxQL]
aliases:
  - /influxdb/cloud-dedicated/query-data/influxql/execute-queries/visualization-tools/
  - /influxdb/cloud-dedicated/query-data/sql/execute-queries/visualization-tools/
related:
  - /influxdb/cloud-dedicated/process-data/visualize/grafana/
  - /influxdb/cloud-dedicated/process-data/visualize/superset/
  - /influxdb/cloud-dedicated/process-data/visualize/tableau/
---

Use visualization tools to query data stored in {{% cloud-name %}} with SQL.

## Query using SQL

The following visualization tools support querying InfluxDB with SQL:

- [Grafana](/influxdb/cloud-dedicated/process-data/visualize/grafana/)
- [Superset](/influxdb/cloud-dedicated/process-data/visualize/superset/)
- [Tableau](/influxdb/cloud-dedicated/process-data/visualize/tableau/)

## Query using InfluxQL

The following visualization tools support querying InfluxDB with InfluxQL:

- [Grafana](/influxdb/cloud-dedicated/process-data/visualize/grafana/?t=InfluxQL)
- [Chronograf](/influxdb/cloud-dedicated/process-data/visualize/chronograf/)

{{% warn %}}
#### InfluxQL feature support

InfluxQL is being rearchitected to work with the InfluxDB IOx storage engine.
This process is ongoing and some InfluxQL features are still being implemented.
For information about the current implementation status of InfluxQL features,
see [InfluxQL feature support](/influxdb/cloud-dedicated/reference/influxql/feature-support/).
{{% /warn %}}