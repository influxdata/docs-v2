---
title: LIMIT and SLIMIT clauses
description: >
  Use `LIMIT` to limit the number of **rows** returned per InfluxQL group.
  Use `SLIMIT` to limit the number of [series](/influxdb/cloud-serverless/reference/glossary/#series)
  returned in query results.
menu:
  influxdb_cloud_serverless:
    name: LIMIT and SLIMIT clauses
    parent: influxql-reference
weight: 206
list_code_example: |
  ```sql
  SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] LIMIT row_N SLIMIT series_N
  ```

source: /shared/influxql-v3-reference/limit-and-slimit.md
---
