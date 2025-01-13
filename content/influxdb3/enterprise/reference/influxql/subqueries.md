---
title: InfluxQL subqueries
description: >
  An InfluxQL subquery is a query nested in the `FROM` clause of an InfluxQL query.
  The outer query queries results returned by the inner query (subquery).
menu:
  influxdb3_enterprise:
    name: Subqueries
    identifier: influxql-subqueries
    parent: influxql-reference
weight: 207
list_code_example: |
  ```sql
  SELECT_clause FROM ( SELECT_statement ) [...]
  ```

source: /shared/influxql-v3-reference/subqueries.md
---

<!-- 
The content of this page is at /shared/influxql-v3-reference/subqueries.md
-->
