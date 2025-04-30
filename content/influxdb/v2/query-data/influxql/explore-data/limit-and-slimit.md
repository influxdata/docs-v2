---
title: LIMIT and SLIMIT clauses
description: >
  Use the `LIMIT` and `SLIMIT` clauses to limit the number of [points](/influxdb/v2/reference/glossary/#point) and [series](/influxdb/v2/reference/glossary/#series) returned in queries.
menu:
  influxdb_v2:
    name: LIMIT and SLIMIT clauses
    parent: Explore data
weight: 305
list_code_example: |
  ```sql
  SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] LIMIT <N>
  ```
source: /shared/influxdb-v2/query-data/influxql/explore-data/limit-and-slimit.md
---

<!-- The content for this file is located at
// SOURCE content/shared/influxdb-v2/query-data/influxql/explore-data/limit-and-slimit.md -->
