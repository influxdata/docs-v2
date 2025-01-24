---
title: Aggregate data with InfluxQL
seotitle: Aggregate or apply selector functions to data with InfluxQL
description: >
  Use InfluxQL aggregate and selector functions to perform aggregate operations
  on your time series data.
menu:
  influxdb3_enterprise:
    name: Aggregate data
    parent: Query with InfluxQL
    identifier: query-influxql-aggregate
weight: 203
influxdb3/enterprise/tags: [query, influxql]
related:
  - /influxdb3/enterprise/reference/influxql/functions/aggregates/
  - /influxdb3/enterprise/reference/influxql/functions/selectors/
list_code_example: |
  ##### Aggregate fields by groups
  ```sql
  SELECT
    MEAN(temp) AS mean,
    FIRST(hum) as first,
  FROM home
  GROUP BY tag
  ```

  ##### Aggregate by time-based intervals
  ```sql
  SELECT
    MEAN(temp),
    sum(hum),
  FROM home
  WHERE time >= now() - 24h
  GROUP BY time(1h),room
  ```
source: /shared/influxdb3-query-guides/influxql/aggregate-select.md
---

<!--
The content for this page is at content/shared/influxdb3-query-guides/influxql/aggregate-select.md
-->
