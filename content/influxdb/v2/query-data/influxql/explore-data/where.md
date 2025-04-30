---
title: The WHERE clause
list_title: WHERE clause
description: >
  Use the `WHERE` clause to filter data based on [fields](/influxdb/v2/reference/glossary/#field), [tags](/influxdb/v2/reference/glossary/#tag), and/or [timestamps](/influxdb/v2/reference/glossary/#timestamp).
menu:
  influxdb_v2:
    name: WHERE clause
    parent: Explore data
weight: 302
list_code_example: |
  ```sql
  SELECT_clause FROM_clause WHERE <conditional_expression> [(AND|OR) <conditional_expression> [...]]
  ```
source: /shared/influxdb-v2/query-data/influxql/explore-data/where.md
---

<!-- The content for this file is located at
// SOURCE content/shared/influxdb-v2/query-data/influxql/explore-data/where.md -->
