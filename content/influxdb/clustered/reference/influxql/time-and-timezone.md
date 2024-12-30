---
title: Time and time zones
description: >
  Explore InfluxQL features used specifically for working with time.
  Use the `tz` (time zone) clause to return the UTC offset for the specified
  time zone.
menu:
  influxdb_clustered:
    name: Time and time zones
    parent: influxql-reference
weight: 208
list_code_example: |
  ```sql
  SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause] tz('<time_zone>')
  ```

source: /shared/influxql-v3-reference/time-and-timezone.md
---

<!-- 
The content of this page is at /shared/influxql-v3-reference/time-and-timezone.md
-->
