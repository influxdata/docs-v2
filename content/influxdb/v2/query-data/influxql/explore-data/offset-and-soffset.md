---
title: OFFSET and SOFFSET clauses
description: >
  Use the `OFFSET` and `SOFFSET` clauses to paginate [points](/influxdb/v2/reference/glossary/#point) and [series](/influxdb/v2/reference/glossary/#series).
menu:
  influxdb_v2:
    name: OFFSET and SOFFSET clauses
    parent: Explore data
weight: 306
list_code_example: |
  ```sql
  SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] LIMIT_clause OFFSET <N> [SLIMIT_clause]
  ```
source: /shared/influxdb-v2/query-data/influxql/explore-data/offset-and-soffset.md
---

<!-- The content for this file is located at
// SOURCE content/shared/influxdb-v2/query-data/influxql/explore-data/offset-and-soffset.md -->
