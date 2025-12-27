---
title: Use parameterized queries with InfluxQL
description: >
  Use parameterized queries to prevent injection attacks and make queries more reusable.
weight: 404
menu:
  influxdb3_enterprise:
    name: Parameterized queries
    parent: Query with InfluxQL
    identifier: parameterized-queries-influxql
influxdb3/enterprise/tags: [query, security, influxql]
list_code_example: |
  ```sql
  SELECT * FROM home
  WHERE time >= $min_time
    AND temp >= $min_temp
    AND room = $room
  ```
source: /shared/influxdb3-query-guides/influxql/parameterized-queries.md
---

<!--
//SOURCE content/shared/influxdb3-query-guides/influxql/parameterized-queries.md
-->
