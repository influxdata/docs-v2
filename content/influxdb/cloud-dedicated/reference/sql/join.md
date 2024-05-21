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

Use the `JOIN` clause to join to data from different tables together.

## Syntax

```sql
SELECT_clause FROM <left_join_item>
[INNER | LEFT [OUTER] | RIGHT [OUTER] | FULL [OUTER]] JOIN <right_join_items> ON <join_predicate>
[WHERE_clause] [GROUP_BY_clause] [HAVING_clause] [ORDER_BY_clause]
```

The table specified in the `FROM` clause is the "left" side of the join.
The tables specified in the JOIN clause are the "right" side of the join.

## Join types

The following joins types are supported:

{{< flex >}}
{{< flex-content "quarter" >}}
  <p style="text-align:center"><strong>Inner join</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="inner small center" >}}
{{< /flex-content >}}
{{< flex-content "quarter" >}}
  <p style="text-align:center"><strong>Left outer join</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="left small center" >}}
{{< /flex-content >}}
{{< flex-content "quarter" >}}
  <p style="text-align:center"><strong>Right outer join</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="right small center" >}}
{{< /flex-content >}}
{{< flex-content "quarter" >}}
  <p style="text-align:center"><strong>Full outer join</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="full small center" >}}
{{< /flex-content >}}
{{< /flex >}}

