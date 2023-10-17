---
title: SELECT statement
list_title: SELECT statement
description: >
  Use the `SELECT` statement to query data from a particular [measurement](/influxdb/cloud/reference/glossary/#measurement) or measurements.
menu:
  influxdb_cloud:
    name: SELECT statement
    parent: Explore data
weight: 301
list_code_example: |
  ```sql
  SELECT <field_key>[,<field_key>,<tag_key>] FROM <measurement_name>[,<measurement_name>]
  ```
---

{{< duplicate-oss >}}
