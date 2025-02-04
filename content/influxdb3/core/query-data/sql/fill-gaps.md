---
title: Fill gaps in data
seotitle: Fill gaps in data with SQL
description: >
  Use [`date_bin_gapfill`](/influxdb3/core/reference/sql/functions/time-and-date/#date_bin_gapfill)
  with [`interpolate`](/influxdb3/core/reference/sql/functions/misc/#interpolate)
  or [`locf`](/influxdb3/core/reference/sql/functions/misc/#locf) to
  fill gaps of time where no data is returned.
menu:
  influxdb3_core:
    parent: Query with SQL
weight: 206
list_code_example: |
  ```sql
  SELECT
    date_bin_gapfill(INTERVAL '30 minutes', time) as time,
    room,
    interpolate(avg(temp))
  FROM home
  WHERE
      time >= '2022-01-01T08:00:00Z'
      AND time <= '2022-01-01T10:00:00Z'
  GROUP BY 1, room
  ```
source: /shared/influxdb3-query-guides/sql/fill-gaps.md
---

<!--
The content for this page is at content/shared/influxdb3-query-guides/sql/fill-gaps.md
-->
