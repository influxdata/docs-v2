---
title: Perform a basic InfluxQL query
seotitle: Perform a basic InfluxQL query in InfluxDB Clustered
description: >
  A basic InfluxQL query that queries data from InfluxDB most commonly includes
  `SELECT`, `FROM`, and `WHERE` clauses.
menu:
  influxdb3_core:
    name: Basic query
    parent: Query with InfluxQL
    identifier: query-influxql-basic
weight: 202
influxdb3/core/tags: [query, influxql]
list_code_example: |
  ```sql
  SELECT temp, room FROM home WHERE time >= now() - 1d
  ```
source: /shared/influxdb3-query-guides/influxql/basic-query.md
---

<!--
The content for this page is at content/shared/influxdb3-query-guides/influxql/basic-query.md
-->
