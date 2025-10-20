---
title: Use visualization tools to query data
list_title: Use visualization tools
description: >
  Use visualization tools and SQL or InfluxQL to query data stored in InfluxDB.
weight: 301
menu:
  influxdb3_cloud_dedicated:
    parent: Execute queries
    name: Use visualization tools
    identifier: query-with-visualization-tools
influxdb3/cloud-dedicated/tags: [query, sql, influxql, visualization]
metadata: [SQL, InfluxQL]
aliases:
  - /influxdb3/cloud-dedicated/query-data/influxql/execute-queries/visualization-tools/
  - /influxdb3/cloud-dedicated/query-data/sql/execute-queries/visualization-tools/
related:
  - /influxdb3/cloud-dedicated/process-data/visualize/grafana/
  - /influxdb3/cloud-dedicated/process-data/visualize/superset/
  - /influxdb3/cloud-dedicated/process-data/visualize/tableau/
---

Use visualization tools to query data stored in {{% product-name %}} with SQL.

## Query using SQL

The following visualization tools support querying InfluxDB with SQL:

- [Grafana](/influxdb3/cloud-dedicated/process-data/visualize/grafana/)
- [Power BI](/influxdb3/cloud-dedicated/process-data/visualize/powerbi/)
- [Superset](/influxdb3/cloud-dedicated/process-data/visualize/superset/)
- [Tableau](/influxdb3/cloud-dedicated/process-data/visualize/tableau/)

## Query using InfluxQL

The following visualization tools support querying InfluxDB with InfluxQL:

- [Grafana](/influxdb3/cloud-dedicated/process-data/visualize/grafana/?t=InfluxQL)
- [Chronograf](/influxdb3/cloud-dedicated/process-data/visualize/chronograf/)

> [!Warning]
> #### InfluxQL feature support
> 
> InfluxQL is being rearchitected to work with the InfluxDB 3 storage engine.
> This process is ongoing and some InfluxQL features are still being implemented.
> For information about the current implementation status of InfluxQL features,
> see [InfluxQL feature support](/influxdb3/cloud-dedicated/reference/influxql/feature-support/).
