---
title: Use visualization tools to query data
list_title: Use visualization tools
description: >
  Use visualization tools and SQL or InfluxQL to query data stored in InfluxDB.
weight: 301
menu:
  influxdb_clustered:
    parent: Execute queries
    name: Use visualization tools
    identifier: query-with-visualization-tools
influxdb/clustered/tags: [query, sql, influxql]
metadata: [SQL, InfluxQL]
aliases:
  - /influxdb/clustered/query-data/influxql/execute-queries/visualization-tools/
  - /influxdb/clustered/query-data/sql/execute-queries/visualization-tools/
related:
  - /influxdb/clustered/process-data/visualize/grafana/
  - /influxdb/clustered/process-data/visualize/superset/
  - /influxdb/clustered/process-data/visualize/tableau/
---

Use visualization tools to query data stored in {{% product-name %}} with SQL.

## Query using SQL

The following visualization tools support querying InfluxDB with SQL:

- [Grafana](/influxdb/clustered/process-data/visualize/grafana/)
- [Superset](/influxdb/clustered/process-data/visualize/superset/)
- [Tableau](/influxdb/clustered/process-data/visualize/tableau/)

## Query using InfluxQL

The following visualization tools support querying InfluxDB with InfluxQL:

- [Grafana](/influxdb/clustered/process-data/visualize/grafana/?t=InfluxQL)
- [Chronograf](/influxdb/clustered/process-data/visualize/chronograf/)

{{% warn %}}
#### InfluxQL feature support

InfluxQL is being rearchitected to work with the InfluxDB v3 storage engine.
This process is ongoing and some InfluxQL features are still being implemented.
For information about the current implementation status of InfluxQL features,
see [InfluxQL feature support](/influxdb/clustered/reference/influxql/feature-support/).
{{% /warn %}}