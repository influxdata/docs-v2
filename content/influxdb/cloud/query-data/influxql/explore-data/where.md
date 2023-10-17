---
title: The WHERE clause
list_title: WHERE clause
description: >
  Use the `WHERE` clause to filter data based on [fields](/influxdb/cloud/reference/glossary/#field), [tags](/influxdb/cloud/reference/glossary/#tag), and/or [timestamps](/influxdb/cloud/reference/glossary/#timestamp).
menu:
  influxdb_cloud:
    name: WHERE clause
    parent: Explore data
weight: 302
list_code_example: |
  ```sql
  SELECT_clause FROM_clause WHERE <conditional_expression> [(AND|OR) <conditional_expression> [...]]
  ```
---

{{< duplicate-oss >}}
