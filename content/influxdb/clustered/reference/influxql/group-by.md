---
title: GROUP BY clause
description: >
  Use the `GROUP BY` clause to group data by one or more specified
  [tags](/influxdb/clustered/reference/glossary/#tag) or into specified time intervals.
menu:
  influxdb_clustered:
    name: GROUP BY clause
    identifier: influxql-group-by
    parent: influxql-reference
weight: 203
list_code_example: |
  ```sql
  SELECT_clause FROM_clause [WHERE_clause] GROUP BY group_expression[, ..., group_expression_n]
  ```

source: /shared/influxql-v3-reference/group-by.md
---
