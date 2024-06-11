---
title: JOIN clause
description: > 
    Use the `JOIN` clause to join to data from different tables together.
menu:
  influxdb_cloud_dedicated:
    name: JOIN clause
    parent: SQL reference
weight: 202
---

Use the `JOIN` clause to join to data from different tables together based on
logical relationships.

## Syntax

```sql
SELECT_clause
FROM <left_join_items>
[INNER | LEFT [OUTER] | RIGHT [OUTER] | FULL [OUTER]] JOIN <right_join_items>
ON <join_condition>
[WHERE_clause]
[GROUP_BY_clause]
[HAVING_clause]
[ORDER_BY_clause]
```

### Arguments

- **left_join_items**: One or more tables specified in the `FROM` clause that
  represent the left side of the join.
- **right_join_items**: One or more tables specified in the `JOIN` clause that
  represent the right side of the join.
- **join_condition**: A predicate expression in the `ON` clause that uses the
  `=` (equal to) comparison operator to compare column values from the left side
  of the join to column values on the right side of the join. Rows with values
  that match the defined predicate are joined using the specified
  [join type](#join-types).

## Join types

The following joins types are supported:

{{< flex >}}
{{< flex-content "quarter" >}}
  <p style="text-align:center"><strong>INNER JOIN</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="inner small center" >}}
{{< /flex-content >}}
{{< flex-content "quarter" >}}
  <p style="text-align:center"><strong>LEFT [OUTER] JOIN</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="left small center" >}}
{{< /flex-content >}}
{{< flex-content "quarter" >}}
  <p style="text-align:center"><strong>RIGHT [OUTER] JOIN</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="right small center" >}}
{{< /flex-content >}}
{{< flex-content "quarter" >}}
  <p style="text-align:center"><strong>FULL [OUTER] JOIN</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="full small center" >}}
{{< /flex-content >}}
{{< /flex >}}

### INNER JOIN



### LEFT [OUTER] JOIN

### RIGHT [OUTER] JOIN

### FULL [OUTER] JOIN

