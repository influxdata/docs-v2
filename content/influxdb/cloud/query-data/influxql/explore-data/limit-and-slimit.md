---
title: LIMIT and SLIMIT clauses
description: >
  Use the `LIMIT` and `SLIMIT` clauses to limit the number of [points](/influxdb/cloud/reference/glossary/#point) and [series](/influxdb/cloud/reference/glossary/#series) returned in queries.
menu:
  influxdb_cloud:
    name: LIMIT and SLIMIT clauses
    parent: Explore data
weight: 305
list_code_example: |
  ```sql
  SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] LIMIT <N>
  ```
---

{{< duplicate-oss >}}
