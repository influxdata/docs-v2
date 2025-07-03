---
title: Regular expressions
list_title: Regular expressions
description: >
  Use `regular expressions` to match patterns in your data.
menu:
  influxdb_v2:
    name: Regular expressions
    identifier: influxql-regular-expressions
    parent: Explore data
weight: 313
list_code_example: |
  ```sql
  SELECT /<regular_expression_field_key>/ FROM /<regular_expression_measurement>/ WHERE [<tag_key> <operator> /<regular_expression_tag_value>/ | <field_key> <operator> /<regular_expression_field_value>/] GROUP BY /<regular_expression_tag_key>/
  ```
source: /shared/influxdb-v2/query-data/influxql/explore-data/regular-expressions.md
---

<!-- The content for this file is located at
// SOURCE content/shared/influxdb-v2/query-data/influxql/explore-data/regular-expressions.md -->
