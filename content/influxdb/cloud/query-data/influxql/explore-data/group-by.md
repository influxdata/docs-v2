---
title: GROUP BY clause
description: >
  Use the `GROUP BY` clause to group query results by one or more specified [tags](/influxdb/cloud/reference/glossary/#tag) and/or a specified time interval.
menu:
  influxdb_cloud:
    name: GROUP BY clause
    parent: Explore data
weight: 303
list_code_example: |
  ```sql
  SELECT_clause FROM_clause [WHERE_clause] GROUP BY [* | <tag_key>[,<tag_key]]
  ```
---

{{< duplicate-oss >}}
