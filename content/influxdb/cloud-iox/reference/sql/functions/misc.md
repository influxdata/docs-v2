---
title: Miscellaneous SQL functions
list_title: Miscellaneous functions
description: >
  Use miscellaneous SQL functions to perform a variety of operations in SQL queries.
menu:
  influxdb_cloud_iox:
    name: Miscellaneous
    parent: sql-functions
weight: 310
---

The InfluxDB SQL implementation supports the following miscellaneous functions
for performing a variety of operations:

- [arrow_typeof](#arrow_typeof)
<!-- - [struct](#struct) -->

## arrow_typeof

Returns the underlying [Arrow type]() of the the expression:

```sql
arrow_typeof(expression)
```

##### Arguments

- **expression**: Column or literal value to evaluate.

{{< expand-wrapper >}}
{{% expand "View `arrow_typeof` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-iox/get-started/write/#construct-line-protocol)._

```sql
SELECT
  arrow_typeof(time) AS time,
  arrow_typeof(room) AS room,
  arrow_typeof(temp) AS temp,
  arrow_typeof(co) AS co
FROM home
LIMIT 1
```

| time                        | room                    | temp    | co    |
| :-------------------------- | :---------------------- | :------ | :---- |
| Timestamp(Nanosecond, None) | Dictionary(Int32, Utf8) | Float64 | Int64 |

{{% /expand %}}
{{< /expand-wrapper >}}

<!--
## struct

Returns an Arrow struct using the specified input expressions.
Fields in the returned struct use the `cN` naming convention.
For example: `c0`, `c1`, `c2`, etc.

```sql
struct(expression1[, ..., expression_n])
```

##### Arguments

- **expression_n**: Column or literal value to include in the output struct.

{{< expand-wrapper >}}
{{% expand "View `struct` example" %}}

```sql
struct('A', 'B', 3, 4)
-- Returns {c0: A, c1: B, c3: 3, c4: 4}
```
{{% /expand %}}
{{< /expand-wrapper >}}
-->
