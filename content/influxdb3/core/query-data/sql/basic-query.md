---
title: Perform a basic SQL query
seotitle: Perform a basic SQL query in InfluxDB 3 Core
description: >
  A basic SQL query that queries data from {{< product-name >}} most commonly
  includes   `SELECT`, `FROM`, and `WHERE` clauses.
menu:
  influxdb3_core:
    name: Basic query
    parent: Query with SQL
    identifier: query-sql-basic
weight: 202
influxdb3/core/tags: [query, sql]
list_code_example: |
  ```sql
  SELECT temp, room FROM home WHERE time >= now() - INTERVAL '1 day'
  ```
source: /shared/influxdb3-query-guides/sql/basic-query.md
---

<!--
The content for this page is at content/shared/influxdb3-query-guides/sql/basic-query.md
-->
