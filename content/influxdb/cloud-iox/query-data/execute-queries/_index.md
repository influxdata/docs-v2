---
title: Execute queries
seotitle: Different ways to query InfluxDB
description: There are multiple ways to query data from InfluxDB including the InfluxDB UI, CLI, and API.
weight: 103
menu:
  influxdb_cloud_iox:
    name: Execute queries
    parent: Query data
influxdb/cloud-iox/tags: [query]
---

There are multiple ways to execute queries with InfluxDB. Choose from the following options:

{{< children >}}

- Execute queries
  - SQL
    - InfluxDB UI
    - Flight SQL protocol and clients
      - Grafana
      - Superset
      - Pandas
    - API and CLI
      - iox.sql in Flux
  - Flux
    - InfluxDB UI
    - API
    - CLI
  - InfluxQL (Coming)
    - API
    - CLI (v1 shell)
    - v1 Clients
      - Client libraries
      - Chronograf
      - Grafana

Out of scope:
- gRPC

Here are some existing relevant docs:

- https://docs.influxdata.com/influxdb/cloud-iox/get-started/query/
- https://docs.influxdata.com/influxdb/cloud-iox/visualize-data/grafana/
- https://docs.influxdata.com/influxdb/cloud-iox/visualize-data/superset/
- https://docs.influxdata.com/influxdb/cloud-iox/query-data/flux-sql/