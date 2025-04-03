---
title: OFFSET and SOFFSET clauses
description: >
  Use the `OFFSET` and `SOFFSET` clauses to paginate [points](/influxdb/cloud/reference/glossary/#point) and [series](/influxdb/cloud/reference/glossary/#series).
menu:
  influxdb_cloud:
    name: OFFSET and SOFFSET clauses
    parent: Explore data
weight: 306
list_code_example: |
  ```sql
  SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] LIMIT_clause OFFSET <N> [SLIMIT_clause]
  ```
source: /shared/influxdb-v2/query-data/influxql/explore-data/offset-and-soffset.md
---

<!-- The content of this file is at 
// SOURCE content/shared/influxdb-v2/query-data/influxql/explore-data/offset-and-soffset.md-->
