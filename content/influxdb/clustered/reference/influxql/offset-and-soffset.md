---
title: OFFSET and SOFFSET clauses
description: >
  Use `OFFSET` to specify the number of [rows](/influxdb/clustered/reference/glossary/#series)
  to skip in each InfluxQL group before returning results.
  Use `SOFFSET` to specify the number of [series](/influxdb/clustered/reference/glossary/#series)
  to skip before returning results.
menu:
  influxdb_clustered:
    name: OFFSET and SOFFSET clauses
    parent: influxql-reference
weight: 207
list_code_example: |
  ```sql
  SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] OFFSET row_N [SLIMIT_clause] SOFFSET series_N
  ```

source: /shared/influxql-v3-reference/offset-and-soffset.md
---

<!-- 
The content of this page is at /shared/influxql-v3-reference/offset-and-soffset.md
-->
