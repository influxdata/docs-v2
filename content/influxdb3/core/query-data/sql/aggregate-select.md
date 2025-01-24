---
title: Aggregate data with SQL
description: >
  Use aggregate and selector functions to perform aggregate operations on your
  time series data.
menu:
  influxdb3_core:
    name: Aggregate data
    parent: Query with SQL
    identifier: query-sql-aggregate
weight: 203
influxdb3/core/tags: [query, sql]
related:
  - /influxdb3/core/reference/sql/functions/aggregate/
  - /influxdb3/core/reference/sql/functions/selector/
  - /influxdb3/core/reference/sql/group-by/
list_code_example: |
  ##### Aggregate fields by groups
  ```sql
  SELECT
    mean(field1) AS mean,
    selector_first(field2)['value'] as first,
    tag1
  FROM home
  GROUP BY tag
  ```

  ##### Aggregate by time-based intervals
  ```sql
  SELECT
    DATE_BIN(INTERVAL '1 hour', time, '2022-01-01T00:00:00Z'::TIMESTAMP) AS time,
    mean(field1),
    sum(field2),
    tag1
  FROM home
  GROUP BY 1, tag1
  ```
source: /shared/influxdb3-query-guides/sql/aggregate-select.md
---

<!--
The content for this page is at content/shared/influxdb3-query-guides/sql/aggregate-select.md
-->
