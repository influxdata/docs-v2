---
title: Explore your schema with InfluxQL
description: >
  Use InfluxQL `SHOW` statements to return information about your data schema.
menu:
  influxdb3_core:
    name: Explore your schema
    parent: Query with InfluxQL
    identifier: query-influxql-schema
weight: 201
influxdb3/core/tags: [query, influxql]
related:
  - /influxdb3/core/reference/influxql/show/
list_code_example: |
  ##### List measurements
  ```sql
  SHOW MEASUREMENTS
  ```

  ##### List field keys in a measurement
  ```sql
  SHOW FIELD KEYS FROM "measurement"
  ```

  ##### List tag keys in a measurement
  ```sql
  SHOW TAG KEYS FROM "measurement"
  ```

  ##### List tag values for a specific tag key
  ```sql
  SHOW TAG VALUES FROM "measurement" WITH KEY = "tag-key" WHERE time > now() - 1d
  ```
source: /shared/influxdb3-query-guides/influxql/explore-schema.md
---

<!--
The content for this page is at content/shared/influxdb3-query-guides/influxql/explore-schema.md
-->
