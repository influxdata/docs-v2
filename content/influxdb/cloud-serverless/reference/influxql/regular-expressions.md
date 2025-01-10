---
title: Regular expressions
list_title: Regular expressions
description: >
  Use `regular expressions` to match patterns in your data.
menu:
  influxdb_cloud_serverless:
    name: Regular expressions
    identifier: influxql-regular-expressions
    parent: influxql-reference
weight: 213
list_code_example: |
  ```sql
  SELECT /<regular_expression_field_key>/ FROM /<regular_expression_measurement>/ WHERE [<tag_key> <operator> /<regular_expression_tag_value>/ | <field_key> <operator> /<regular_expression_field_value>/] GROUP BY /<regular_expression_tag_key>/
  ```

source: /shared/influxql-v3-reference/regular-expressions.md
---
