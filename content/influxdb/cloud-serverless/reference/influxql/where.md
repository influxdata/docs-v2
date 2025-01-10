---
title: WHERE clause
description: >
  Use the `WHERE` clause to filter data based on [fields](/influxdb/cloud-serverless/reference/glossary/#field), [tags](/influxdb/cloud-serverless/reference/glossary/#tag), and/or [timestamps](/influxdb/cloud-serverless/reference/glossary/#timestamp).
menu:
  influxdb_cloud_serverless:
    name: WHERE clause
    identifier: influxql-where-clause
    parent: influxql-reference
weight: 202
list_code_example: |
  ```sql
  SELECT_clause FROM_clause WHERE <conditional_expression> [(AND|OR) <conditional_expression> [...]]
  ```

source: /shared/influxql-v3-reference/where.md
---
