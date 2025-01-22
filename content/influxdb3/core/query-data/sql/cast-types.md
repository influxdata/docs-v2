---
title: Cast values to different types
seotitle: Cast values to different data types in SQL
description: >
  Use the `CAST` function or double-colon `::` casting shorthand syntax to cast
  a value to a specific type.
menu:
  influxdb3_core:
    name: Cast types
    parent: Query with SQL
    identifier: query-sql-cast-types
weight: 205
influxdb3/core/tags: [query, sql]
related:
  - /influxdb3/core/reference/sql/data-types/
list_code_example: |
  ```sql
  -- CAST clause
  SELECT CAST(1234.5 AS BIGINT)

  -- Double-colon casting shorthand
  SELECT 1234.5::BIGINT
  ```
source: /shared/influxdb3-query-guides/sql/cast-types.md
---

<!--
The content for this page is at content/shared/influxdb3-query-guides/sql/cast-types.md
-->
