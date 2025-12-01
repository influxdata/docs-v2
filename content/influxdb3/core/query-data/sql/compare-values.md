---
title: Compare values in SQL queries
seotitle: Compare values across rows in SQL queries
description: >
  Use SQL window functions to compare values across different rows in your
  time series data. Learn how to calculate differences, percentage changes,
  and compare values at specific time intervals.
menu:
  influxdb3_core:
    name: Compare values
    parent: Query with SQL
    identifier: query-sql-compare-values
weight: 205
influxdb3/core/tags: [query, sql, window functions]
related:
  - /influxdb3/core/reference/sql/functions/window/
  - /influxdb3/core/query-data/sql/aggregate-select/
list_code_example: |
  ##### Calculate difference from previous value
  ```sql
  SELECT
    time,
    room,
    temp,
    temp - LAG(temp) OVER (
      PARTITION BY room
      ORDER BY time
    ) AS temp_change
  FROM home
  ORDER BY room, time
  ```
source: /shared/influxdb3-query-guides/sql/compare-values.md
---

<!--
//SOURCE content/shared/influxdb3-query-guides/sql/compare-values.md
-->
