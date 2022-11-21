---
title: Time and timezone queries
list_title: Time and timezone queries
description: >
  Explore InfluxQL features used specifically for working with time. Use the `tz` (timezone) clause to return the UTC offset for the specified timezone.
menu:
  influxdb_cloud:
    name: Time and timezone
    parent: Explore data
weight: 308
list_code_example: |
  ```sql
  SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause] tz('<time_zone>')
  ```
---

{{< duplicate-oss >}}
