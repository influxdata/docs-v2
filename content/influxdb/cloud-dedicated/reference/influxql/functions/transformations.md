---
title: InfluxQL transformation functions
list_title: Tranfsormation functions
description: >
  Use transformation functions modify and return values in each row of queried data.
menu:
  influxdb_cloud_dedicated:
    name: Transformations
    parent: influxql-functions
weight: 205
---

InfluxQL transformation functions modify and return values in each row of queried data.

- [ABS()](#abs)
- [ACOS()](#acos)
- [ASIN()](#asin)
- [ATAN()](#atan)
- [ATAN2()](#atan2)
- [CEIL()](#ceil)
- [COS()](#cos)
- [CUMULATIVE_SUM()](#cumulative_sum)
- [DERIVATIVE()](#derivative)
- [DIFFERENCE()](#difference)
- [ELAPSED()](#elapsed)
- [EXP()](#exp)
- [FLOOR()](#floor)
- [LN()](#ln)
- [LOG()](#log)
- [LOG2()](#log2)
- [LOG10()](#log10)
- [MOVING_AVERAGE()](#moving_average)
- [NON_NEGATIVE_DERIVATIVE()](#non_negative_derivative)
- [NON_NEGATIVE_DIFFERENCE()](#non_negative_difference)
- [POW()](#pow)
- [ROUND()](#round)
- [SIN()](#sin)
- [SQRT()](#sqrt)
- [TAN()](#tan)

{{% note %}}
#### Missing InfluxQL functions

Some InfluxQL functions are in the process of being rearchitected to work with
the InfluxDB 3.0 storage engine. If a function you need is not here, check the
[InfluxQL feature support page](/influxdb/cloud-dedicated/reference/influxql/feature-support/#function-support)
for more information.
{{% /note %}}

## Notable behaviors of transformation functions

#### Must use aggregate or selector functions when grouping by time

Most transformation functions support `GROUP BY` clauses that group by tags,
but do not directly support `GROUP BY` clauses that group by time.
To use transformation functions with with a `GROUP BY time()` clause, apply
an [aggregate](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates/)
or [selector](/influxdb/cloud-dedicated/reference/influxql/functions/selectors/)
function to the **field_expression** argument.
The transformation operates on the result of the aggregate or selector operation.

---

## ABS()

Returns the absolute value of the field value. 

```sql
ABS(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, or wildcard (`*`).
  Supports numeric field types.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `ABS()` to a field" %}}

```sql
SELECT
  a,
  ABS(a)
FROM numbers
LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                  a |               abs |
| :------------------- | -----------------: | ----------------: |
| 2023-01-01T00:00:00Z |   0.33909108671076 |  0.33909108671076 |
| 2023-01-01T00:01:00Z | -0.774984088561186 | 0.774984088561186 |
| 2023-01-01T00:02:00Z | -0.921037167720451 | 0.921037167720451 |
| 2023-01-01T00:03:00Z |  -0.73880754843378 |  0.73880754843378 |
| 2023-01-01T00:04:00Z | -0.905980032168252 | 0.905980032168252 |
| 2023-01-01T00:05:00Z | -0.891164752631417 | 0.891164752631417 |

{{% /expand %}}

{{% expand "Apply `ABS()` to each field" %}}

```sql
SELECT ABS(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |             abs_a |              abs_b |
| :------------------- | ----------------: | -----------------: |
| 2023-01-01T00:00:00Z |  0.33909108671076 |  0.163643058925645 |
| 2023-01-01T00:01:00Z | 0.774984088561186 |  0.137034364053949 |
| 2023-01-01T00:02:00Z | 0.921037167720451 |  0.482943221384294 |
| 2023-01-01T00:03:00Z |  0.73880754843378 | 0.0729732928756677 |
| 2023-01-01T00:04:00Z | 0.905980032168252 |   1.77857552719844 |
| 2023-01-01T00:05:00Z | 0.891164752631417 |  0.741147445214238 |

{{% /expand %}}

{{% expand "Apply `ABS()` to time windows (grouped by time)" %}}

```sql
SELECT
  ABS(MEAN(a))
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                  abs |
| :------------------- | -------------------: |
| 2023-01-01T00:00:00Z |   0.4345725888930678 |
| 2023-01-01T00:10:00Z |  0.12861008519618367 |
| 2023-01-01T00:20:00Z | 0.030168160597251192 |
| 2023-01-01T00:30:00Z |  0.02928699660831855 |
| 2023-01-01T00:40:00Z |  0.02211434600834538 |
| 2023-01-01T00:50:00Z |  0.15530468657783394 |

{{% /expand %}}
{{< /expand-wrapper >}}

## ACOS()

Returns the arccosine (in radians) of the field value.
Field values must be between -1 and 1.

```sql
ACOS(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, or wildcard (`*`).
  Supports numeric field types.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `ACOS()` to a field" %}}

```sql
SELECT
  a,
  ACOS(a)
FROM numbers
LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                  a |               acos |
| :------------------- | -----------------: | -----------------: |
| 2023-01-01T00:00:00Z |   0.33909108671076 | 1.2248457522250173 |
| 2023-01-01T00:01:00Z | -0.774984088561186 |    2.4574862443115 |
| 2023-01-01T00:02:00Z | -0.921037167720451 |  2.741531473732281 |
| 2023-01-01T00:03:00Z |  -0.73880754843378 | 2.4020955294179256 |
| 2023-01-01T00:04:00Z | -0.905980032168252 | 2.7044854502651114 |
| 2023-01-01T00:05:00Z | -0.891164752631417 |    2.6707024029338 |

{{% /expand %}}

{{% expand "Apply `ACOS()` to each field" %}}

```sql
SELECT ACOS(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |             acos_a |             acos_b |
| :------------------- | -----------------: | -----------------: |
| 2023-01-01T00:00:00Z | 1.2248457522250173 | 1.7351786975993897 |
| 2023-01-01T00:01:00Z |    2.4574862443115 |  1.433329416131427 |
| 2023-01-01T00:02:00Z |  2.741531473732281 |  2.074809114132046 |
| 2023-01-01T00:03:00Z | 2.4020955294179256 | 1.6438345403920092 |
| 2023-01-01T00:04:00Z | 2.7044854502651114 |                    |
| 2023-01-01T00:05:00Z |    2.6707024029338 | 0.7360183965088304 |

{{% /expand %}}

{{% expand "Apply `ACOS()` to time windows (grouped by time)" %}}

```sql
SELECT
  ACOS(MEAN(a))
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |               acos |
| :------------------- | -----------------: |
| 2023-01-01T00:00:00Z | 2.0203599837582877 |
| 2023-01-01T00:10:00Z |  1.441829029328407 |
| 2023-01-01T00:20:00Z | 1.5406235882252437 |
| 2023-01-01T00:30:00Z | 1.5415051418561052 |
| 2023-01-01T00:40:00Z | 1.5486801779072885 |
| 2023-01-01T00:50:00Z |   1.41486045205998 |

{{% /expand %}}
{{< /expand-wrapper >}}

## ASIN()

Returns the arcsine (in radians) of the field value.
Field values must be between -1 and 1.

```sql
ASIN(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, or wildcard (`*`).
  Supports numeric field types.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `ASIN()` to a field" %}}

```sql
SELECT
  a,
  ASIN(a)
FROM numbers
LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                  a |                asin |
| :------------------- | -----------------: | ------------------: |
| 2023-01-01T00:00:00Z |   0.33909108671076 | 0.34595057456987915 |
| 2023-01-01T00:01:00Z | -0.774984088561186 | -0.8866899175166036 |
| 2023-01-01T00:02:00Z | -0.921037167720451 | -1.1707351469373848 |
| 2023-01-01T00:03:00Z |  -0.73880754843378 | -0.8312992026230288 |
| 2023-01-01T00:04:00Z | -0.905980032168252 |  -1.133689123470215 |
| 2023-01-01T00:05:00Z | -0.891164752631417 | -1.0999060761389035 |

{{% /expand %}}

{{% expand "Apply `ASIN()` to each field" %}}

```sql
SELECT ASIN(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |              asin_a |               asin_b |
| :------------------- | ------------------: | -------------------: |
| 2023-01-01T00:00:00Z | 0.34595057456987915 |  -0.1643823708044932 |
| 2023-01-01T00:01:00Z | -0.8866899175166036 |   0.1374669106634696 |
| 2023-01-01T00:02:00Z | -1.1707351469373848 |  -0.5040127873371497 |
| 2023-01-01T00:03:00Z | -0.8312992026230288 | -0.07303821359711259 |
| 2023-01-01T00:04:00Z |  -1.133689123470215 |                      |
| 2023-01-01T00:05:00Z | -1.0999060761389035 |   0.8347779302860662 |

{{% /expand %}}

{{% expand "Apply `ASIN()` to time windows (grouped by time)" %}}

```sql
SELECT
  ASIN(MEAN(a))
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                 asin |
| :------------------- | -------------------: |
| 2023-01-01T00:00:00Z | -0.44956365696339134 |
| 2023-01-01T00:10:00Z |   0.1289672974664895 |
| 2023-01-01T00:20:00Z | 0.030172738569652847 |
| 2023-01-01T00:30:00Z | 0.029291184938791334 |
| 2023-01-01T00:40:00Z | 0.022116148887608062 |
| 2023-01-01T00:50:00Z |  0.15593587473491674 |

{{% /expand %}}
{{< /expand-wrapper >}}
 
## ATAN()

Returns the arctangent (in radians) of the field value.

```sql
ATAN(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, or wildcard (`*`).
  Supports numeric field types.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `ATAN()` to a field" %}}

```sql
SELECT
  a,
  ATAN(a)
FROM numbers
LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                  a |                atan |
| :------------------- | -----------------: | ------------------: |
| 2023-01-01T00:00:00Z |   0.33909108671076 | 0.32692355076199897 |
| 2023-01-01T00:01:00Z | -0.774984088561186 |  -0.659300127490126 |
| 2023-01-01T00:02:00Z | -0.921037167720451 | -0.7443170183837121 |
| 2023-01-01T00:03:00Z |  -0.73880754843378 | -0.6362993731936669 |
| 2023-01-01T00:04:00Z | -0.905980032168252 | -0.7361091800814261 |
| 2023-01-01T00:05:00Z | -0.891164752631417 |  -0.727912249468035 |

{{% /expand %}}

{{% expand "Apply `ATAN()` to each field" %}}

```sql
SELECT ATAN(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |              atan_a |               atan_b |
| :------------------- | ------------------: | -------------------: |
| 2023-01-01T00:00:00Z | 0.32692355076199897 |  -0.1622053541422186 |
| 2023-01-01T00:01:00Z |  -0.659300127490126 |  0.13618613793696105 |
| 2023-01-01T00:02:00Z | -0.7443170183837121 |  -0.4499093121666581 |
| 2023-01-01T00:03:00Z | -0.6362993731936669 | -0.07284417510130452 |
| 2023-01-01T00:04:00Z | -0.7361091800814261 |   1.0585985450688151 |
| 2023-01-01T00:05:00Z |  -0.727912249468035 |   0.6378113578294793 |

{{% /expand %}}

{{% expand "Apply `ATAN()` to time windows (grouped by time)" %}}

```sql
SELECT
  ATAN(MEAN(a))
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                 atan |
| :------------------- | -------------------: |
| 2023-01-01T00:00:00Z |  -0.4099506966510045 |
| 2023-01-01T00:10:00Z |   0.1279079463727065 |
| 2023-01-01T00:20:00Z | 0.030159013397288013 |
| 2023-01-01T00:30:00Z |  0.02927862748761639 |
| 2023-01-01T00:40:00Z | 0.022110742100818606 |
| 2023-01-01T00:50:00Z |  0.15407382461141705 |

{{% /expand %}}
{{< /expand-wrapper >}}

## ATAN2()

Returns the the arctangent of `y/x` in radians.

```sql
ATAN2(expression_y, expression_x)
```

#### Arguments

- **expression_y**: Expression to identify the `y` numeric value or one or more
  fields to operate on.
  Can be a number literal, [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, or wildcard (`*`).
  Supports numeric field types.
- **expression_x**: Expression to identify the `x` numeric value or one or more
  fields to operate on.
  Can be a number literal, [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, or wildcard (`*`).
  Supports numeric field types.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `ATAN2()` to a field divided by another field" %}}

```sql
SELECT ATAN2(a, b) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                atan2 |
| :------------------- | -------------------: |
| 2023-01-01T00:00:00Z |   2.0204217911794937 |
| 2023-01-01T00:01:00Z |   -1.395783190047229 |
| 2023-01-01T00:02:00Z |   -2.053731408859953 |
| 2023-01-01T00:03:00Z |   -1.669248713922653 |
| 2023-01-01T00:04:00Z | -0.47112754043763505 |
| 2023-01-01T00:05:00Z |  -0.8770454978291377 |

{{% /expand %}}

{{% expand "Apply `ATAN2()` to each field divided by a numeric value" %}}

```sql
SELECT ATAN2(*, 2) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |              atan2_a |               atan2_b |
| :------------------- | -------------------: | --------------------: |
| 2023-01-01T00:00:00Z |  0.16794843225523703 |   -0.0816396675119722 |
| 2023-01-01T00:01:00Z | -0.36967737169970566 |   0.06841026268126137 |
| 2023-01-01T00:02:00Z |  -0.4315666721698651 |   -0.2369359777533473 |
| 2023-01-01T00:03:00Z | -0.35385538623378937 | -0.036470468100670846 |
| 2023-01-01T00:04:00Z |  -0.4253376417906667 |    0.7268651162204586 |
| 2023-01-01T00:05:00Z | -0.41917415992493756 |   0.35488446257957357 |

{{% /expand %}}

{{% expand "Apply `ATAN2()` to time windows (grouped by time)" %}}

```sql
SELECT
  ATAN2(MEAN(a), MEAN(b))
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |              atan2 |
| :------------------- | -----------------: |
| 2023-01-01T00:00:00Z | -1.278967897411707 |
| 2023-01-01T00:10:00Z | 2.3520553840586773 |
| 2023-01-01T00:20:00Z |  2.226497789888965 |
| 2023-01-01T00:30:00Z | 3.0977773783018656 |
| 2023-01-01T00:40:00Z | 2.9285769547942677 |
| 2023-01-01T00:50:00Z | 0.9505419744107901 |

{{% /expand %}}
{{< /expand-wrapper >}}

## CEIL()

Returns the subsequent value rounded up to the nearest integer.

```sql
CEIL(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, or wildcard (`*`).
  Supports numeric field types.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `CEIL()` to a field" %}}

```sql
SELECT
  b,
  CEIL(b)
FROM numbers
LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                   b | ceil |
| :------------------- | ------------------: | ---: |
| 2023-01-01T00:00:00Z |  -0.163643058925645 |   -0 |
| 2023-01-01T00:01:00Z |   0.137034364053949 |    1 |
| 2023-01-01T00:02:00Z |  -0.482943221384294 |   -0 |
| 2023-01-01T00:03:00Z | -0.0729732928756677 |   -0 |
| 2023-01-01T00:04:00Z |    1.77857552719844 |    2 |
| 2023-01-01T00:05:00Z |   0.741147445214238 |    1 |

{{% /expand %}}

{{% expand "Apply `CEIL()` to each field" %}}

```sql
SELECT CEIL(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 | ceil_a | ceil_b |
| :------------------- | -----: | -----: |
| 2023-01-01T00:00:00Z |      1 |     -0 |
| 2023-01-01T00:01:00Z |     -0 |      1 |
| 2023-01-01T00:02:00Z |     -0 |     -0 |
| 2023-01-01T00:03:00Z |     -0 |     -0 |
| 2023-01-01T00:04:00Z |     -0 |      2 |
| 2023-01-01T00:05:00Z |     -0 |      1 |

{{% /expand %}}

{{% expand "Apply `CEIL()` to time windows (grouped by time)" %}}

```sql
SELECT
  CEIL(MEAN(b))
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 | ceil |
| :------------------- | ---: |
| 2023-01-01T00:00:00Z |    1 |
| 2023-01-01T00:10:00Z |   -0 |
| 2023-01-01T00:20:00Z |   -0 |
| 2023-01-01T00:30:00Z |   -0 |
| 2023-01-01T00:40:00Z |   -0 |
| 2023-01-01T00:50:00Z |    1 |

{{% /expand %}}
{{< /expand-wrapper >}}

## COS()

Returns the cosine of the field value.

```sql
COS(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, or wildcard (`*`).
  Supports numeric field types.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `COS()` to a field" %}}

```sql
SELECT
  b,
  COS(b)
FROM numbers
LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                   b |                  cos |
| :------------------- | ------------------: | -------------------: |
| 2023-01-01T00:00:00Z |  -0.163643058925645 |   0.9866403278718959 |
| 2023-01-01T00:01:00Z |   0.137034364053949 |   0.9906254752128878 |
| 2023-01-01T00:02:00Z |  -0.482943221384294 |   0.8856319645801471 |
| 2023-01-01T00:03:00Z | -0.0729732928756677 |   0.9973386305831397 |
| 2023-01-01T00:04:00Z |    1.77857552719844 | -0.20628737691395405 |
| 2023-01-01T00:05:00Z |   0.741147445214238 |   0.7376943643170851 |

{{% /expand %}}

{{% expand "Apply `COS()` to each field" %}}

```sql
SELECT COS(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |              cos_a |                cos_b |
| :------------------- | -----------------: | -------------------: |
| 2023-01-01T00:00:00Z | 0.9430573869206459 |   0.9866403278718959 |
| 2023-01-01T00:01:00Z | 0.7144321674550146 |   0.9906254752128878 |
| 2023-01-01T00:02:00Z | 0.6049946586273094 |   0.8856319645801471 |
| 2023-01-01T00:03:00Z | 0.7392720891861374 |   0.9973386305831397 |
| 2023-01-01T00:04:00Z |  0.616914561474936 | -0.20628737691395405 |
| 2023-01-01T00:05:00Z | 0.6285065034701617 |   0.7376943643170851 |

{{% /expand %}}

{{% expand "Apply `COS()` to time windows (grouped by time)" %}}

```sql
SELECT
  COS(MEAN(b))
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                cos |
| :------------------- | -----------------: |
| 2023-01-01T00:00:00Z | 0.9914907269510592 |
| 2023-01-01T00:10:00Z | 0.9918765457796455 |
| 2023-01-01T00:20:00Z | 0.9997307399250498 |
| 2023-01-01T00:30:00Z | 0.7850670342365872 |
| 2023-01-01T00:40:00Z | 0.9947779847618986 |
| 2023-01-01T00:50:00Z | 0.9938532355205111 |

{{% /expand %}}
{{< /expand-wrapper >}}

## CUMULATIVE_SUM()

Returns the running total of subsequent [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).

```sql
CUMULATIVE_SUM(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports numeric field types.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `CUMULATIVE_SUM()` to a field" %}}

```sql
SELECT CUMULATIVE_SUM(b) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |       cumulative_sum |
| :------------------- | -------------------: |
| 2023-01-01T00:00:00Z |   -0.163643058925645 |
| 2023-01-01T00:01:00Z | -0.02660869487169601 |
| 2023-01-01T00:02:00Z |  -0.5095519162559901 |
| 2023-01-01T00:03:00Z |  -0.5825252091316577 |
| 2023-01-01T00:04:00Z |   1.1960503180667823 |
| 2023-01-01T00:05:00Z |   1.9371977632810204 |

{{% /expand %}}

{{% expand "Apply `CUMULATIVE_SUM()` to each field" %}}

```sql
SELECT CUMULATIVE_SUM(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |     cumulative_sum_a |     cumulative_sum_b |
| :------------------- | -------------------: | -------------------: |
| 2023-01-01T00:00:00Z |     0.33909108671076 |   -0.163643058925645 |
| 2023-01-01T00:01:00Z | -0.43589300185042595 | -0.02660869487169601 |
| 2023-01-01T00:02:00Z |  -1.3569301695708769 |  -0.5095519162559901 |
| 2023-01-01T00:03:00Z |   -2.095737718004657 |  -0.5825252091316577 |
| 2023-01-01T00:04:00Z |   -3.001717750172909 |   1.1960503180667823 |
| 2023-01-01T00:05:00Z |   -3.892882502804326 |   1.9371977632810204 |

{{% /expand %}}

{{% expand "Apply `CUMULATIVE_SUM()` to field keys that match a regular expression" %}}

```sql
SELECT CUMULATIVE_SUM(/[ab]/) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |     cumulative_sum_a |     cumulative_sum_b |
| :------------------- | -------------------: | -------------------: |
| 2023-01-01T00:00:00Z |     0.33909108671076 |   -0.163643058925645 |
| 2023-01-01T00:01:00Z | -0.43589300185042595 | -0.02660869487169601 |
| 2023-01-01T00:02:00Z |  -1.3569301695708769 |  -0.5095519162559901 |
| 2023-01-01T00:03:00Z |   -2.095737718004657 |  -0.5825252091316577 |
| 2023-01-01T00:04:00Z |   -3.001717750172909 |   1.1960503180667823 |
| 2023-01-01T00:05:00Z |   -3.892882502804326 |   1.9371977632810204 |

{{% /expand %}}

{{% expand "Apply `CUMULATIVE_SUM()` to time windows (grouped by time)" %}}

```sql
SELECT
  CUMULATIVE_SUM(SUM(b))
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |       cumulative_sum |
| :------------------- | -------------------: |
| 2023-01-01T00:00:00Z |   1.3054783385851743 |
| 2023-01-01T00:10:00Z | 0.029980276948385454 |
| 2023-01-01T00:20:00Z | -0.20208529969578404 |
| 2023-01-01T00:30:00Z |   -6.882005145666267 |
| 2023-01-01T00:40:00Z |   -7.904410787756402 |
| 2023-01-01T00:50:00Z |   -6.795080184131271 |

{{% /expand %}}
{{< /expand-wrapper >}}

## DERIVATIVE()

Returns the rate of change between subsequent [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value)
per `unit`.

```sql
SELECT DERIVATIVE(field_expression[, unit])
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports numeric field types.
- **unit**: Unit of time to use to calculate the rate of change.
  Supports [duration literals](/influxdb/cloud-dedicated/reference/influxql/#durations).
  _Default is `1s` (per second)_.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Related functions

- [NON_NEGATIVE_DERIVATIVE()](#non_negative_derivative)

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `DERIVATIVE()` to a field to calculate the per second change" %}}

```sql
SELECT DERIVATIVE(b) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |            derivative |
| :------------------- | --------------------: |
| 2023-01-01T00:01:00Z |  0.005011290382993233 |
| 2023-01-01T00:02:00Z |  -0.01033295975730405 |
| 2023-01-01T00:03:00Z |  0.006832832141810439 |
| 2023-01-01T00:04:00Z |   0.03085914700123513 |
| 2023-01-01T00:05:00Z | -0.017290468033070033 |
| 2023-01-01T00:06:00Z | -0.007557890705063634 |

{{% /expand %}}

{{% expand "Apply `DERIVATIVE()` to a field to calculate the per 5 minute change" %}}

```sql
SELECT DERIVATIVE(b, 5m) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |          derivative |
| :------------------- | ------------------: |
| 2023-01-01T00:01:00Z |  1.5033871148979698 |
| 2023-01-01T00:02:00Z | -3.0998879271912148 |
| 2023-01-01T00:03:00Z |  2.0498496425431316 |
| 2023-01-01T00:04:00Z |   9.257744100370537 |
| 2023-01-01T00:05:00Z |  -5.187140409921009 |
| 2023-01-01T00:06:00Z |   -2.26736721151909 |

{{% /expand %}}

{{% expand "Apply `DERIVATIVE()` to each field" %}}

```sql
SELECT DERIVATIVE(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |           derivative_a |          derivative_b |
| :------------------- | ---------------------: | --------------------: |
| 2023-01-01T00:01:00Z |  -0.018567919587865765 |  0.005011290382993233 |
| 2023-01-01T00:02:00Z | -0.0024342179859877505 |  -0.01033295975730405 |
| 2023-01-01T00:03:00Z |  0.0030371603214445152 |  0.006832832141810439 |
| 2023-01-01T00:04:00Z | -0.0027862080622411984 |   0.03085914700123513 |
| 2023-01-01T00:05:00Z | 0.00024692132561391543 | -0.017290468033070033 |
| 2023-01-01T00:06:00Z |   0.016704951104985283 | -0.007557890705063634 |

{{% /expand %}}

{{% expand "Apply `DERIVATIVE()` to field keys that match a regular expression" %}}

```sql
SELECT DERIVATIVE(/[ab]/) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |           derivative_a |          derivative_b |
| :------------------- | ---------------------: | --------------------: |
| 2023-01-01T00:01:00Z |  -0.018567919587865765 |  0.005011290382993233 |
| 2023-01-01T00:02:00Z | -0.0024342179859877505 |  -0.01033295975730405 |
| 2023-01-01T00:03:00Z |  0.0030371603214445152 |  0.006832832141810439 |
| 2023-01-01T00:04:00Z | -0.0027862080622411984 |   0.03085914700123513 |
| 2023-01-01T00:05:00Z | 0.00024692132561391543 | -0.017290468033070033 |
| 2023-01-01T00:06:00Z |   0.016704951104985283 | -0.007557890705063634 |

{{% /expand %}}

{{% expand "Apply `DERIVATIVE()` to time windows (grouped by time)" %}}

```sql
SELECT
  DERIVATIVE(MEAN(b), 1m)
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |            derivative |
| :------------------- | --------------------: |
| 2023-01-01T00:10:00Z | -0.025809764002219633 |
| 2023-01-01T00:20:00Z |  0.010434324849926194 |
| 2023-01-01T00:30:00Z |  -0.06447854269326314 |
| 2023-01-01T00:40:00Z |   0.05657514203880348 |
| 2023-01-01T00:50:00Z |  0.021317362457152655 |

{{% /expand %}}
{{< /expand-wrapper >}}

## DIFFERENCE()

Returns the result of subtraction between subsequent [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).

```sql
DIFFERENCE(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports numeric field types.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Related functions

- [NON_NEGATIVE_DIFFERENCE()](#non_negative_difference)

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `DIFFERENCE()` to a field" %}}

```sql
SELECT DIFFERENCE(b) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |           difference |
| :------------------- | -------------------: |
| 2023-01-01T00:01:00Z |    0.300677422979594 |
| 2023-01-01T00:02:00Z |   -0.619977585438243 |
| 2023-01-01T00:03:00Z |  0.40996992850862635 |
| 2023-01-01T00:04:00Z |   1.8515488200741077 |
| 2023-01-01T00:05:00Z |  -1.0374280819842019 |
| 2023-01-01T00:06:00Z | -0.45347344230381803 |

{{% /expand %}}

{{% expand "Apply `DIFFERENCE()` to each field" %}}

```sql
SELECT DIFFERENCE(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |         difference_a |         difference_b |
| :------------------- | -------------------: | -------------------: |
| 2023-01-01T00:01:00Z |   -1.114075175271946 |    0.300677422979594 |
| 2023-01-01T00:02:00Z | -0.14605307915926502 |   -0.619977585438243 |
| 2023-01-01T00:03:00Z |  0.18222961928667092 |  0.40996992850862635 |
| 2023-01-01T00:04:00Z |  -0.1671724837344719 |   1.8515488200741077 |
| 2023-01-01T00:05:00Z | 0.014815279536834924 |  -1.0374280819842019 |
| 2023-01-01T00:06:00Z |    1.002297066299117 | -0.45347344230381803 |

{{% /expand %}}

{{% expand "Apply `DIFFERENCE()` to field keys that match a regular expression" %}}

```sql
SELECT DIFFERENCE(/[ab]/) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |         difference_a |         difference_b |
| :------------------- | -------------------: | -------------------: |
| 2023-01-01T00:01:00Z |   -1.114075175271946 |    0.300677422979594 |
| 2023-01-01T00:02:00Z | -0.14605307915926502 |   -0.619977585438243 |
| 2023-01-01T00:03:00Z |  0.18222961928667092 |  0.40996992850862635 |
| 2023-01-01T00:04:00Z |  -0.1671724837344719 |   1.8515488200741077 |
| 2023-01-01T00:05:00Z | 0.014815279536834924 |  -1.0374280819842019 |
| 2023-01-01T00:06:00Z |    1.002297066299117 | -0.45347344230381803 |

{{% /expand %}}

{{% expand "Apply `DIFFERENCE()` to time windows (grouped by time)" %}}

```sql
SELECT
  DIFFERENCE(MEAN(b))
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |          difference |
| :------------------- | ------------------: |
| 2023-01-01T00:10:00Z | -0.2580976400221963 |
| 2023-01-01T00:20:00Z | 0.10434324849926194 |
| 2023-01-01T00:30:00Z | -0.6447854269326314 |
| 2023-01-01T00:40:00Z |  0.5657514203880348 |
| 2023-01-01T00:50:00Z | 0.21317362457152655 |

{{% /expand %}}
{{< /expand-wrapper >}}

## ELAPSED()

Returns the difference between subsequent [field value's](/influxdb/cloud-dedicated/reference/glossary/#field-value) 
timestamps in a specified `unit` of time.

```sql
ELAPSED(field_expression[, unit ])
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports all field types.
- **unit**: Unit of time to return the elapsed time in.
  Supports [duration literals](/influxdb/cloud-dedicated/reference/influxql/#durations).
  _Default is `1ns` (nanoseconds)_.

#### Notable behaviors

- If the `unit` is greater than the elapsed time between points, `ELAPSED()`
  returns `0`.
- `ELAPSED()` supports the `GROUP BY time()` clause but the query results aren't very useful.
  An `ELAPSED()` query with a nested function and a `GROUP BY time()` clause
  returns the interval specified in the `GROUP BY time()` clause.

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `ELAPSED()` to a field and return elapsed time in nanoseconds" %}}

```sql
SELECT ELAPSED(b) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |     elapsed |
| :------------------- | ----------: |
| 2023-01-01T00:01:00Z | 60000000000 |
| 2023-01-01T00:02:00Z | 60000000000 |
| 2023-01-01T00:03:00Z | 60000000000 |
| 2023-01-01T00:04:00Z | 60000000000 |
| 2023-01-01T00:05:00Z | 60000000000 |
| 2023-01-01T00:06:00Z | 60000000000 |

{{% /expand %}}

{{% expand "Apply `ELAPSED()` to a field and return elapsed time in seconds" %}}

```sql
SELECT ELAPSED(b, 1s) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 | elapsed |
| :------------------- | ------: |
| 2023-01-01T00:01:00Z |      60 |
| 2023-01-01T00:02:00Z |      60 |
| 2023-01-01T00:03:00Z |      60 |
| 2023-01-01T00:04:00Z |      60 |
| 2023-01-01T00:05:00Z |      60 |
| 2023-01-01T00:06:00Z |      60 |

{{% /expand %}}

{{% expand "Apply `ELAPSED()` to each field" %}}

```sql
SELECT ELAPSED(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |   elapsed_a |   elapsed_b |
| :------------------- | ----------: | ----------: |
| 2023-01-01T00:01:00Z | 60000000000 | 60000000000 |
| 2023-01-01T00:02:00Z | 60000000000 | 60000000000 |
| 2023-01-01T00:03:00Z | 60000000000 | 60000000000 |
| 2023-01-01T00:04:00Z | 60000000000 | 60000000000 |
| 2023-01-01T00:05:00Z | 60000000000 | 60000000000 |
| 2023-01-01T00:06:00Z | 60000000000 | 60000000000 |

{{% /expand %}}

{{% expand "Apply `ELAPSED()` to field keys that match a regular expression" %}}

```sql
SELECT ELAPSED(/[ab]/, 1s) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 | elapsed_a | elapsed_b |
| :------------------- | --------: | --------: |
| 2023-01-01T00:01:00Z |        60 |        60 |
| 2023-01-01T00:02:00Z |        60 |        60 |
| 2023-01-01T00:03:00Z |        60 |        60 |
| 2023-01-01T00:04:00Z |        60 |        60 |
| 2023-01-01T00:05:00Z |        60 |        60 |
| 2023-01-01T00:06:00Z |        60 |        60 |

{{% /expand %}}
{{< /expand-wrapper >}}

## EXP()

Returns the exponential of the field value.

```sql
EXP(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, or wildcard (`*`).
  Supports numeric field types.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `EXP()` to a field" %}}

```sql
SELECT
  a,
  EXP(a)
FROM numbers
LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                  a |                 exp |
| :------------------- | -----------------: | ------------------: |
| 2023-01-01T00:00:00Z |   0.33909108671076 |  1.4036711951820788 |
| 2023-01-01T00:01:00Z | -0.774984088561186 |   0.460711111517308 |
| 2023-01-01T00:02:00Z | -0.921037167720451 | 0.39810592427186076 |
| 2023-01-01T00:03:00Z |  -0.73880754843378 |  0.4776831901055915 |
| 2023-01-01T00:04:00Z | -0.905980032168252 | 0.40414561525252984 |
| 2023-01-01T00:05:00Z | -0.891164752631417 |  0.4101777188333968 |

{{% /expand %}}

{{% expand "Apply `EXP()` to each field" %}}

```sql
SELECT EXP(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |               exp_a |              exp_b |
| :------------------- | ------------------: | -----------------: |
| 2023-01-01T00:00:00Z |  1.4036711951820788 | 0.8490450268435884 |
| 2023-01-01T00:01:00Z |   0.460711111517308 |   1.14686755886191 |
| 2023-01-01T00:02:00Z | 0.39810592427186076 | 0.6169648527893578 |
| 2023-01-01T00:03:00Z |  0.4776831901055915 |  0.929625657322271 |
| 2023-01-01T00:04:00Z | 0.40414561525252984 |  5.921415512753404 |
| 2023-01-01T00:05:00Z |  0.4101777188333968 |   2.09834186598405 |

{{% /expand %}}

{{% expand "Apply `EXP()` to time windows (grouped by time)" %}}

```sql
SELECT
  EXP(MEAN(a))
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                exp |
| :------------------- | -----------------: |
| 2023-01-01T00:00:00Z | 0.6475413743155294 |
| 2023-01-01T00:10:00Z |  1.137246608416461 |
| 2023-01-01T00:20:00Z |  1.030627830373793 |
| 2023-01-01T00:30:00Z |  1.029720078241656 |
| 2023-01-01T00:40:00Z | 1.0223606806499268 |
| 2023-01-01T00:50:00Z | 1.1680137850180072 |

{{% /expand %}}
{{< /expand-wrapper >}}

## FLOOR()

Returns the subsequent value rounded down to the nearest integer.

```sql
FLOOR(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, or wildcard (`*`).
  Supports numeric field types.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `FLOOR()` to a field" %}}

```sql
SELECT
  b,
  FLOOR(b)
FROM numbers
LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                   b | floor |
| :------------------- | ------------------: | ----: |
| 2023-01-01T00:00:00Z |  -0.163643058925645 |    -1 |
| 2023-01-01T00:01:00Z |   0.137034364053949 |     0 |
| 2023-01-01T00:02:00Z |  -0.482943221384294 |    -1 |
| 2023-01-01T00:03:00Z | -0.0729732928756677 |    -1 |
| 2023-01-01T00:04:00Z |    1.77857552719844 |     1 |
| 2023-01-01T00:05:00Z |   0.741147445214238 |     0 |

{{% /expand %}}

{{% expand "Apply `FLOOR()` to each field" %}}

```sql
SELECT FLOOR(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 | floor_a | floor_b |
| :------------------- | ------: | ------: |
| 2023-01-01T00:00:00Z |       0 |      -1 |
| 2023-01-01T00:01:00Z |      -1 |       0 |
| 2023-01-01T00:02:00Z |      -1 |      -1 |
| 2023-01-01T00:03:00Z |      -1 |      -1 |
| 2023-01-01T00:04:00Z |      -1 |       1 |
| 2023-01-01T00:05:00Z |      -1 |       0 |

{{% /expand %}}

{{% expand "Apply `FLOOR()` to time windows (grouped by time)" %}}

```sql
SELECT
  FLOOR(SUM(a))
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 | floor |
| :------------------- | ----: |
| 2023-01-01T00:00:00Z |    -5 |
| 2023-01-01T00:10:00Z |     1 |
| 2023-01-01T00:20:00Z |     0 |
| 2023-01-01T00:30:00Z |     0 |
| 2023-01-01T00:40:00Z |     0 |
| 2023-01-01T00:50:00Z |     1 |

{{% /expand %}}
{{< /expand-wrapper >}}

## LN()

Returns the natural logarithm of the field value.
Field values must be greater than or equal to 0.

```sql
LN(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, or wildcard (`*`).
  Supports numeric field types.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `LN()` to a field" %}}

```sql
SELECT
  b,
  LN(b)
FROM numbers
LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                   b |                  ln |
| :------------------- | ------------------: | ------------------: |
| 2023-01-01T00:00:00Z |  -0.163643058925645 |                     |
| 2023-01-01T00:01:00Z |   0.137034364053949 |   -1.98752355209665 |
| 2023-01-01T00:02:00Z |  -0.482943221384294 |                     |
| 2023-01-01T00:03:00Z | -0.0729732928756677 |                     |
| 2023-01-01T00:04:00Z |    1.77857552719844 |  0.5758127783016702 |
| 2023-01-01T00:05:00Z |   0.741147445214238 | -0.2995556920844895 |

{{% /expand %}}

{{% expand "Apply `LN()` to each field" %}}

```sql
SELECT LN(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                ln_a |                ln_b |
| :------------------- | ------------------: | ------------------: |
| 2023-01-01T00:00:00Z | -1.0814865153308908 |                     |
| 2023-01-01T00:01:00Z |                     |   -1.98752355209665 |
| 2023-01-01T00:02:00Z |                     |                     |
| 2023-01-01T00:03:00Z |                     |                     |
| 2023-01-01T00:04:00Z |                     |  0.5758127783016702 |
| 2023-01-01T00:05:00Z |                     | -0.2995556920844895 |

{{% /expand %}}

{{% expand "Apply `LN()` to time windows (grouped by time)" %}}

```sql
SELECT
  LN(SUM(a))
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                  ln |
| :------------------- | ------------------: |
| 2023-01-01T00:00:00Z |                     |
| 2023-01-01T00:10:00Z | 0.25161504572793725 |
| 2023-01-01T00:20:00Z | -1.1983831026157092 |
| 2023-01-01T00:30:00Z | -1.2280265702380913 |
| 2023-01-01T00:40:00Z | -1.5089436474159283 |
| 2023-01-01T00:50:00Z |  0.4402187212890264 |

{{% /expand %}}
{{< /expand-wrapper >}}

## LOG()

Returns the logarithm of the field value with base `b`.
Field values must be greater than or equal to 0.

```sql
LOG(field_expression, b)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, or wildcard (`*`).
  Supports numeric field types.
- **b**: Logarithm base to use in the operation.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `LOG()` to a field with a base of 3" %}}

```sql
SELECT
  b,
  LOG(b, 3)
FROM numbers
LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                   b |                 log |
| :------------------- | ------------------: | ------------------: |
| 2023-01-01T00:00:00Z |  -0.163643058925645 |                     |
| 2023-01-01T00:01:00Z |   0.137034364053949 | -1.8091219009630797 |
| 2023-01-01T00:02:00Z |  -0.482943221384294 |                     |
| 2023-01-01T00:03:00Z | -0.0729732928756677 |                     |
| 2023-01-01T00:04:00Z |    1.77857552719844 |  0.5241273780031629 |
| 2023-01-01T00:05:00Z |   0.741147445214238 | -0.2726673414946528 |

{{% /expand %}}

{{% expand "Apply `LOG()` to each field with a base of 5" %}}

```sql
SELECT LOG(*, 5) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |               log_a |                log_b |
| :------------------- | ------------------: | -------------------: |
| 2023-01-01T00:00:00Z | -0.6719653532302217 |                      |
| 2023-01-01T00:01:00Z |                     |  -1.2349178161776593 |
| 2023-01-01T00:02:00Z |                     |                      |
| 2023-01-01T00:03:00Z |                     |                      |
| 2023-01-01T00:04:00Z |                     |   0.3577725949246566 |
| 2023-01-01T00:05:00Z |                     | -0.18612441633827553 |

{{% /expand %}}

{{% expand "Apply `LOG()` to time windows (grouped by time)" %}}

```sql
SELECT
  LOG(SUM(a), 10)
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                 log |
| :------------------- | ------------------: |
| 2023-01-01T00:00:00Z |                     |
| 2023-01-01T00:10:00Z | 0.10927502592347751 |
| 2023-01-01T00:20:00Z | -0.5204511686721008 |
| 2023-01-01T00:30:00Z | -0.5333251630849791 |
| 2023-01-01T00:40:00Z | -0.6553258995757036 |
| 2023-01-01T00:50:00Z |  0.1911845614863297 |

{{% /expand %}}
{{< /expand-wrapper >}}

## LOG2()

Returns the logarithm of the field value to the base 2.
Field values must be greater than or equal to 0.

```sql
LOG2(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, or wildcard (`*`).
  Supports numeric field types.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `LOG2()` to a field" %}}

```sql
SELECT
  b,
  LOG2(b)
FROM numbers
LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                   b |                log2 |
| :------------------- | ------------------: | ------------------: |
| 2023-01-01T00:00:00Z |  -0.163643058925645 |                     |
| 2023-01-01T00:01:00Z |   0.137034364053949 | -2.8673903722598544 |
| 2023-01-01T00:02:00Z |  -0.482943221384294 |                     |
| 2023-01-01T00:03:00Z | -0.0729732928756677 |                     |
| 2023-01-01T00:04:00Z |    1.77857552719844 |  0.8307222397363156 |
| 2023-01-01T00:05:00Z |   0.741147445214238 | -0.4321675114403543 |

{{% /expand %}}

{{% expand "Apply `LOG2()` to each field" %}}

```sql
SELECT LOG2(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |             log2_a |              log2_b |
| :------------------- | -----------------: | ------------------: |
| 2023-01-01T00:00:00Z | -1.560255232456162 |                     |
| 2023-01-01T00:01:00Z |                    | -2.8673903722598544 |
| 2023-01-01T00:02:00Z |                    |                     |
| 2023-01-01T00:03:00Z |                    |                     |
| 2023-01-01T00:04:00Z |                    |  0.8307222397363156 |
| 2023-01-01T00:05:00Z |                    | -0.4321675114403543 |

{{% /expand %}}

{{% expand "Apply `LOG2()` to time windows (grouped by time)" %}}

```sql
SELECT
  LOG2(SUM(a))
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                log2 |
| :------------------- | ------------------: |
| 2023-01-01T00:00:00Z |                     |
| 2023-01-01T00:10:00Z | 0.36300377868474476 |
| 2023-01-01T00:20:00Z | -1.7289013592288134 |
| 2023-01-01T00:30:00Z | -1.7716678429623767 |
| 2023-01-01T00:40:00Z | -2.1769455171078644 |
| 2023-01-01T00:50:00Z |  0.6351013661101591 |

{{% /expand %}}
{{< /expand-wrapper >}}

## LOG10()

Returns the logarithm of the field value to the base 10.
Field values must be greater than or equal to 0.

```sql
LOG10(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, or wildcard (`*`).
  Supports numeric field types.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `LOG10()` to a field" %}}

```sql
SELECT
  b,
  LOG10(b)
FROM numbers
LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                   b |               log10 |
| :------------------- | ------------------: | ------------------: |
| 2023-01-01T00:00:00Z |  -0.163643058925645 |                     |
| 2023-01-01T00:01:00Z |   0.137034364053949 | -0.8631705113283253 |
| 2023-01-01T00:02:00Z |  -0.482943221384294 |                     |
| 2023-01-01T00:03:00Z | -0.0729732928756677 |                     |
| 2023-01-01T00:04:00Z |    1.77857552719844 | 0.25007231222579585 |
| 2023-01-01T00:05:00Z |   0.741147445214238 | -0.1300953840950034 |

{{% /expand %}}

{{% expand "Apply `LOG10()` to each field" %}}

```sql
SELECT LOG10(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |              log10_a |             log10_b |
| :------------------- | -------------------: | ------------------: |
| 2023-01-01T00:00:00Z | -0.46968362586098245 |                     |
| 2023-01-01T00:01:00Z |                      | -0.8631705113283253 |
| 2023-01-01T00:02:00Z |                      |                     |
| 2023-01-01T00:03:00Z |                      |                     |
| 2023-01-01T00:04:00Z |                      | 0.25007231222579585 |
| 2023-01-01T00:05:00Z |                      | -0.1300953840950034 |

{{% /expand %}}

{{% expand "Apply `LOG10()` to time windows (grouped by time)" %}}

```sql
SELECT
  LOG10(SUM(a))
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |               log10 |
| :------------------- | ------------------: |
| 2023-01-01T00:00:00Z |                     |
| 2023-01-01T00:10:00Z | 0.10927502592347751 |
| 2023-01-01T00:20:00Z |  -0.520451168672101 |
| 2023-01-01T00:30:00Z | -0.5333251630849791 |
| 2023-01-01T00:40:00Z | -0.6553258995757036 |
| 2023-01-01T00:50:00Z | 0.19118456148632973 |

{{% /expand %}}
{{< /expand-wrapper >}}

## MOVING_AVERAGE()

Returns the rolling average across a window of subsequent [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).

```sql
MOVING_AVERAGE(field_expression, N)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports all field types.
- **N**: Number of field values to use when calculating the moving average.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `MOVING_AVERAGE()` to a field" %}}

```sql
SELECT MOVING_AVERAGE(a, 3) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |      moving_average |
| :------------------- | ------------------: |
| 2023-01-01T00:02:00Z | -0.4523100565236256 |
| 2023-01-01T00:03:00Z | -0.8116096015718056 |
| 2023-01-01T00:04:00Z | -0.8552749161074944 |
| 2023-01-01T00:05:00Z | -0.8453174444111498 |
| 2023-01-01T00:06:00Z | -0.5620041570439896 |
| 2023-01-01T00:07:00Z | -0.3569778402485757 |

{{% /expand %}}

{{% expand "Apply `MOVING_AVERAGE()` to each field" %}}

```sql
SELECT MOVING_AVERAGE(*, 3) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |    moving_average_a |     moving_average_b |
| :------------------- | ------------------: | -------------------: |
| 2023-01-01T00:02:00Z | -0.4523100565236256 | -0.16985063875199669 |
| 2023-01-01T00:03:00Z | -0.8116096015718056 | -0.13962738340200423 |
| 2023-01-01T00:04:00Z | -0.8552749161074944 |  0.40755300431282615 |
| 2023-01-01T00:05:00Z | -0.8453174444111498 |    0.815583226512337 |
| 2023-01-01T00:06:00Z | -0.5620041570439896 |   0.9357989917743662 |
| 2023-01-01T00:07:00Z | -0.3569778402485757 |  0.15985821845558748 |

{{% /expand %}}

{{% expand "Apply `MOVING_AVERAGE()` to field keys that match a regular expression" %}}

```sql
SELECT MOVING_AVERAGE(/[ab]/, 3) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |    moving_average_a |     moving_average_b |
| :------------------- | ------------------: | -------------------: |
| 2023-01-01T00:02:00Z | -0.4523100565236256 | -0.16985063875199669 |
| 2023-01-01T00:03:00Z | -0.8116096015718056 | -0.13962738340200423 |
| 2023-01-01T00:04:00Z | -0.8552749161074944 |  0.40755300431282615 |
| 2023-01-01T00:05:00Z | -0.8453174444111498 |    0.815583226512337 |
| 2023-01-01T00:06:00Z | -0.5620041570439896 |   0.9357989917743662 |
| 2023-01-01T00:07:00Z | -0.3569778402485757 |  0.15985821845558748 |

{{% /expand %}}

{{% expand "Apply `MOVING_AVERAGE()` to time windows (grouped by time)" %}}

```sql
SELECT
  MOVING_AVERAGE(SUM(a), 3)
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |      moving_average |
| :------------------- | ------------------: |
| 2023-01-01T00:20:00Z | -0.9193144769987766 |
| 2023-01-01T00:30:00Z |   0.626884141339178 |
| 2023-01-01T00:40:00Z | 0.27189834404638374 |
| 2023-01-01T00:50:00Z |  0.6890200973149928 |

{{% /expand %}}
{{< /expand-wrapper >}}

## NON_NEGATIVE_DERIVATIVE()

Returns only non-negative rate of change between subsequent
[field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).
Negative rates of change return _null_.

```sql
NON_NEGATIVE_DERIVATIVE(field_expression[, unit])
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports numeric field types.
- **unit**: Unit of time to use to calculate the rate of change.
  Supports [duration literals](/influxdb/cloud-dedicated/reference/influxql/#durations).
  _Default is `1s` (per second)_.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Related functions

- [DERIVATIVE()](#derivative)

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `NON_NEGATIVE_DERIVATIVE()` to a field to calculate the per second change" %}}

```sql
SELECT NON_NEGATIVE_DERIVATIVE(b) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 | non_negative_derivative |
| :------------------- | ----------------------: |
| 2023-01-01T00:01:00Z |    0.005011290382993233 |
| 2023-01-01T00:03:00Z |    0.006832832141810439 |
| 2023-01-01T00:04:00Z |     0.03085914700123513 |
| 2023-01-01T00:08:00Z |      0.0227877053636946 |
| 2023-01-01T00:10:00Z |    0.001676063810538834 |
| 2023-01-01T00:11:00Z |    0.014999637478226817 |

{{% /expand %}}

{{% expand "Apply `NON_NEGATIVE_DERIVATIVE()` to a field to calculate the per 5 minute change" %}}

```sql
SELECT NON_NEGATIVE_DERIVATIVE(b, 5m) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 | non_negative_derivative |
| :------------------- | ----------------------: |
| 2023-01-01T00:01:00Z |      1.5033871148979698 |
| 2023-01-01T00:03:00Z |      2.0498496425431316 |
| 2023-01-01T00:04:00Z |       9.257744100370537 |
| 2023-01-01T00:08:00Z |       6.836311609108379 |
| 2023-01-01T00:10:00Z |      0.5028191431616502 |
| 2023-01-01T00:11:00Z |       4.499891243468045 |

{{% /expand %}}

{{% expand "Apply `NON_NEGATIVE_DERIVATIVE()` to each field" %}}

```sql
SELECT NON_NEGATIVE_DERIVATIVE(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 | non_negative_derivative_a | non_negative_derivative_b |
| :------------------- | ------------------------: | ------------------------: |
| 2023-01-01T00:01:00Z |                           |      0.005011290382993233 |
| 2023-01-01T00:03:00Z |     0.0030371603214445152 |      0.006832832141810439 |
| 2023-01-01T00:04:00Z |                           |       0.03085914700123513 |
| 2023-01-01T00:05:00Z |    0.00024692132561391543 |                           |
| 2023-01-01T00:06:00Z |      0.016704951104985283 |                           |
| 2023-01-01T00:08:00Z |                           |        0.0227877053636946 |
| 2023-01-01T00:09:00Z |      0.018437240876186967 |                           |
| 2023-01-01T00:10:00Z |                           |      0.001676063810538834 |
| 2023-01-01T00:11:00Z |                           |      0.014999637478226817 |
| 2023-01-01T00:13:00Z |      0.006694752202850366 |                           |
| 2023-01-01T00:14:00Z |      0.011836797386191167 |                           |

{{% /expand %}}

{{% expand "Apply `NON_NEGATIVE_DERIVATIVE()` to field keys that match a regular expression" %}}

```sql
SELECT NON_NEGATIVE_DERIVATIVE(/[ab]/) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 | non_negative_derivative_a | non_negative_derivative_b |
| :------------------- | ------------------------: | ------------------------: |
| 2023-01-01T00:01:00Z |                           |      0.005011290382993233 |
| 2023-01-01T00:03:00Z |     0.0030371603214445152 |      0.006832832141810439 |
| 2023-01-01T00:04:00Z |                           |       0.03085914700123513 |
| 2023-01-01T00:05:00Z |    0.00024692132561391543 |                           |
| 2023-01-01T00:06:00Z |      0.016704951104985283 |                           |
| 2023-01-01T00:08:00Z |                           |        0.0227877053636946 |
| 2023-01-01T00:09:00Z |      0.018437240876186967 |                           |
| 2023-01-01T00:10:00Z |                           |      0.001676063810538834 |
| 2023-01-01T00:11:00Z |                           |      0.014999637478226817 |
| 2023-01-01T00:13:00Z |      0.006694752202850366 |                           |
| 2023-01-01T00:14:00Z |      0.011836797386191167 |                           |

{{% /expand %}}

{{% expand "Apply `NON_NEGATIVE_DERIVATIVE()` to time windows (grouped by time)" %}}

```sql
SELECT
  NON_NEGATIVE_DERIVATIVE(MEAN(b), 1m)
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 | non_negative_derivative |
| :------------------- | ----------------------: |
| 2023-01-01T00:20:00Z |    0.010434324849926194 |
| 2023-01-01T00:40:00Z |     0.05657514203880348 |
| 2023-01-01T00:50:00Z |    0.021317362457152655 |

{{% /expand %}}
{{< /expand-wrapper >}}

## NON_NEGATIVE_DIFFERENCE()

Returns only non-negative result of subtraction between subsequent
[field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).
Negative differences return _null_.

```sql
NON_NEGATIVE_DIFFERENCE(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports numeric field types.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Related functions

- [DIFFERENCE()](#difference)

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `NON_NEGATIVE_DIFFERENCE()` to a field" %}}

```sql
SELECT NON_NEGATIVE_DIFFERENCE(b) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 | non_negative_difference |
| :------------------- | ----------------------: |
| 2023-01-01T00:01:00Z |       0.300677422979594 |
| 2023-01-01T00:03:00Z |     0.40996992850862635 |
| 2023-01-01T00:04:00Z |      1.8515488200741077 |
| 2023-01-01T00:08:00Z |       1.367262321821676 |
| 2023-01-01T00:10:00Z |     0.10056382863233004 |
| 2023-01-01T00:11:00Z |       0.899978248693609 |

{{% /expand %}}

{{% expand "Apply `NON_NEGATIVE_DIFFERENCE()` to each field" %}}

```sql
SELECT NON_NEGATIVE_DIFFERENCE(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 | non_negative_difference_a | non_negative_difference_b |
| :------------------- | ------------------------: | ------------------------: |
| 2023-01-01T00:01:00Z |                           |         0.300677422979594 |
| 2023-01-01T00:03:00Z |       0.18222961928667092 |       0.40996992850862635 |
| 2023-01-01T00:04:00Z |                           |        1.8515488200741077 |
| 2023-01-01T00:05:00Z |      0.014815279536834924 |                           |
| 2023-01-01T00:06:00Z |         1.002297066299117 |                           |
| 2023-01-01T00:08:00Z |                           |         1.367262321821676 |
| 2023-01-01T00:09:00Z |         1.106234452571218 |                           |
| 2023-01-01T00:10:00Z |                           |       0.10056382863233004 |
| 2023-01-01T00:11:00Z |                           |         0.899978248693609 |
| 2023-01-01T00:13:00Z |         0.401685132171022 |                           |
| 2023-01-01T00:14:00Z |          0.71020784317147 |                           |

{{% /expand %}}

{{% expand "Apply `NON_NEGATIVE_DIFFERENCE()` to field keys that match a regular expression" %}}

```sql
SELECT NON_NEGATIVE_DIFFERENCE(/[ab]/) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 | non_negative_difference_a | non_negative_difference_b |
| :------------------- | ------------------------: | ------------------------: |
| 2023-01-01T00:01:00Z |                           |         0.300677422979594 |
| 2023-01-01T00:03:00Z |       0.18222961928667092 |       0.40996992850862635 |
| 2023-01-01T00:04:00Z |                           |        1.8515488200741077 |
| 2023-01-01T00:05:00Z |      0.014815279536834924 |                           |
| 2023-01-01T00:06:00Z |         1.002297066299117 |                           |
| 2023-01-01T00:08:00Z |                           |         1.367262321821676 |
| 2023-01-01T00:09:00Z |         1.106234452571218 |                           |
| 2023-01-01T00:10:00Z |                           |       0.10056382863233004 |
| 2023-01-01T00:11:00Z |                           |         0.899978248693609 |
| 2023-01-01T00:13:00Z |         0.401685132171022 |                           |
| 2023-01-01T00:14:00Z |          0.71020784317147 |                           |

{{% /expand %}}

{{% expand "Apply `NON_NEGATIVE_DIFFERENCE()` to time windows (grouped by time)" %}}

```sql
SELECT
  NON_NEGATIVE_DIFFERENCE(MEAN(b))
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 | non_negative_difference |
| :------------------- | ----------------------: |
| 2023-01-01T00:20:00Z |     0.10434324849926194 |
| 2023-01-01T00:40:00Z |      0.5657514203880348 |
| 2023-01-01T00:50:00Z |     0.21317362457152655 |

{{% /expand %}}
{{< /expand-wrapper >}}

## POW()

Returns the field value to the power of `x`.

```sql
POW(field_expression, x)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, or wildcard (`*`).
  Supports numeric field types.
- **x**: Power to raise to.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `POW()` to a field with a power of 3" %}}

```sql
SELECT
  b,
  POW(b, 3)
FROM numbers
LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                   b |                    pow |
| :------------------- | ------------------: | ---------------------: |
| 2023-01-01T00:00:00Z |  -0.163643058925645 |  -0.004382205777325515 |
| 2023-01-01T00:01:00Z |   0.137034364053949 |   0.002573288422171338 |
| 2023-01-01T00:02:00Z |  -0.482943221384294 |    -0.1126388541916811 |
| 2023-01-01T00:03:00Z | -0.0729732928756677 | -0.0003885901893904874 |
| 2023-01-01T00:04:00Z |    1.77857552719844 |      5.626222933751733 |
| 2023-01-01T00:05:00Z |   0.741147445214238 |     0.4071119474284653 |

{{% /expand %}}

{{% expand "Apply `POW()` to each field with a power of 5" %}}

```sql
SELECT POW(*, 5) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                pow_a |                    pow_b |
| :------------------- | -------------------: | -----------------------: |
| 2023-01-01T00:00:00Z | 0.004483135555212479 |  -0.00011735131084020357 |
| 2023-01-01T00:01:00Z |  -0.2795528536239978 |  0.000048322282876973225 |
| 2023-01-01T00:02:00Z |  -0.6628050073932118 |    -0.026271227986693114 |
| 2023-01-01T00:03:00Z | -0.22011853819169455 | -0.000002069282189962477 |
| 2023-01-01T00:04:00Z |  -0.6103699296012646 |       17.797604890097084 |
| 2023-01-01T00:05:00Z |  -0.5620694808926487 |      0.22362640363833164 |

{{% /expand %}}

{{% expand "Apply `POW()` to time windows (grouped by time)" %}}

```sql
SELECT
  POW(SUM(a), 10)
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                      pow |
| :------------------- | -----------------------: |
| 2023-01-01T00:00:00Z |        2402278.159218532 |
| 2023-01-01T00:10:00Z |       12.380844221267186 |
| 2023-01-01T00:20:00Z |  0.000006244365466732681 |
| 2023-01-01T00:30:00Z | 0.0000046424621235691315 |
| 2023-01-01T00:40:00Z |    2.7973126174031977e-7 |
| 2023-01-01T00:50:00Z |         81.6292140233699 |

{{% /expand %}}
{{< /expand-wrapper >}}

## ROUND()

Returns a field value rounded to the nearest integer.

```sql
ROUND(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, or wildcard (`*`).
  Supports numeric field types.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `ROUND()` to a field" %}}

```sql
SELECT
  b,
  ROUND(b)
FROM numbers
LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                   b | round |
| :------------------- | ------------------: | ----: |
| 2023-01-01T00:00:00Z |  -0.163643058925645 |    -0 |
| 2023-01-01T00:01:00Z |   0.137034364053949 |     0 |
| 2023-01-01T00:02:00Z |  -0.482943221384294 |    -0 |
| 2023-01-01T00:03:00Z | -0.0729732928756677 |    -0 |
| 2023-01-01T00:04:00Z |    1.77857552719844 |     2 |
| 2023-01-01T00:05:00Z |   0.741147445214238 |     1 |

{{% /expand %}}

{{% expand "Apply `ROUND()` to each field" %}}

```sql
SELECT ROUND(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 | round_a | round_b |
| :------------------- | ------: | ------: |
| 2023-01-01T00:00:00Z |       0 |      -0 |
| 2023-01-01T00:01:00Z |      -1 |       0 |
| 2023-01-01T00:02:00Z |      -1 |      -0 |
| 2023-01-01T00:03:00Z |      -1 |      -0 |
| 2023-01-01T00:04:00Z |      -1 |       2 |
| 2023-01-01T00:05:00Z |      -1 |       1 |

{{% /expand %}}

{{% expand "Apply `ROUND()` to time windows (grouped by time)" %}}

```sql
SELECT
  ROUND(SUM(a))
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 | round |
| :------------------- | ----: |
| 2023-01-01T00:00:00Z |    -4 |
| 2023-01-01T00:10:00Z |     1 |
| 2023-01-01T00:20:00Z |     0 |
| 2023-01-01T00:30:00Z |     0 |
| 2023-01-01T00:40:00Z |     0 |
| 2023-01-01T00:50:00Z |     2 |

{{% /expand %}}
{{< /expand-wrapper >}}

## SIN()

Returns the sine of a field value.

```sql
SIN(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, or wildcard (`*`).
  Supports numeric field types.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `SIN()` to a field" %}}

```sql
SELECT
  b,
  SIN(b)
FROM numbers
LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                   b |                 sin |
| :------------------- | ------------------: | ------------------: |
| 2023-01-01T00:00:00Z |  -0.163643058925645 | -0.1629136686003898 |
| 2023-01-01T00:01:00Z |   0.137034364053949 | 0.13660588515594851 |
| 2023-01-01T00:02:00Z |  -0.482943221384294 | -0.4643877941052164 |
| 2023-01-01T00:03:00Z | -0.0729732928756677 | -0.0729085450859347 |
| 2023-01-01T00:04:00Z |    1.77857552719844 |  0.9784914502058565 |
| 2023-01-01T00:05:00Z |   0.741147445214238 |  0.6751348197618099 |

{{% /expand %}}

{{% expand "Apply `SIN()` to each field" %}}

```sql
SELECT SIN(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |               sin_a |               sin_b |
| :------------------- | ------------------: | ------------------: |
| 2023-01-01T00:00:00Z |  0.3326300722640741 | -0.1629136686003898 |
| 2023-01-01T00:01:00Z | -0.6997047077914582 | 0.13660588515594851 |
| 2023-01-01T00:02:00Z | -0.7962295291135749 | -0.4643877941052164 |
| 2023-01-01T00:03:00Z |  -0.673406844448706 | -0.0729085450859347 |
| 2023-01-01T00:04:00Z | -0.7870301289278495 |  0.9784914502058565 |
| 2023-01-01T00:05:00Z | -0.7778043295686337 |  0.6751348197618099 |

{{% /expand %}}

{{% expand "Apply `SIN()` to time windows (grouped by time)" %}}

```sql
SELECT
  SIN(SUM(a))
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                 sin |
| :------------------- | ------------------: |
| 2023-01-01T00:00:00Z |   0.933528830283535 |
| 2023-01-01T00:10:00Z |  0.9597472276784815 |
| 2023-01-01T00:20:00Z | 0.29712628761434723 |
| 2023-01-01T00:30:00Z |  0.2887011711003489 |
| 2023-01-01T00:40:00Z | 0.21934537994884437 |
| 2023-01-01T00:50:00Z |  0.9998424824522808 |

{{% /expand %}}
{{< /expand-wrapper >}}

## SQRT()

Returns the square root of a field value.
Field values must be greater than or equal to 0.
Negative field values return null.

```sql
SQRT(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, or wildcard (`*`).
  Supports numeric field types.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `SQRT()` to a field" %}}

```sql
SELECT
  b,
  SQRT(b)
FROM numbers
LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                   b |               sqrt |
| :------------------- | ------------------: | -----------------: |
| 2023-01-01T00:00:00Z |  -0.163643058925645 |                    |
| 2023-01-01T00:01:00Z |   0.137034364053949 |  0.370181528515334 |
| 2023-01-01T00:02:00Z |  -0.482943221384294 |                    |
| 2023-01-01T00:03:00Z | -0.0729732928756677 |                    |
| 2023-01-01T00:04:00Z |    1.77857552719844 | 1.3336324558132349 |
| 2023-01-01T00:05:00Z |   0.741147445214238 |  0.860899207349059 |

{{% /expand %}}

{{% expand "Apply `SQRT()` to each field" %}}

```sql
SELECT SQRT(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |             sqrt_a |             sqrt_b |
| :------------------- | -----------------: | -----------------: |
| 2023-01-01T00:00:00Z | 0.5823152811928947 |                    |
| 2023-01-01T00:01:00Z |                    |  0.370181528515334 |
| 2023-01-01T00:02:00Z |                    |                    |
| 2023-01-01T00:03:00Z |                    |                    |
| 2023-01-01T00:04:00Z |                    | 1.3336324558132349 |
| 2023-01-01T00:05:00Z |                    |  0.860899207349059 |

{{% /expand %}}

{{% expand "Apply `SQRT()` to time windows (grouped by time)" %}}

```sql
SELECT
  SQRT(SUM(a))
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |               sqrt |
| :------------------- | -----------------: |
| 2023-01-01T00:00:00Z |                    |
| 2023-01-01T00:10:00Z |  1.134063865909604 |
| 2023-01-01T00:20:00Z | 0.5492555015405052 |
| 2023-01-01T00:30:00Z | 0.5411746169982342 |
| 2023-01-01T00:40:00Z | 0.4702589287652642 |
| 2023-01-01T00:50:00Z | 1.2462130097934059 |

{{% /expand %}}
{{< /expand-wrapper >}}

## TAN()

Returns the tangent of the field value.

```sql
TAN(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, or wildcard (`*`).
  Supports numeric field types.

#### Notable behaviors

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

The following examples use the
[Random numbers sample data](/influxdb/cloud-dedicated/reference/sample-data/#random-numbers-sample-data).

{{< expand-wrapper >}}
{{% expand "Apply `TAN()` to a field" %}}

```sql
SELECT
  b,
  TAN(b)
FROM numbers
LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                   b |                  tan |
| :------------------- | ------------------: | -------------------: |
| 2023-01-01T00:00:00Z |  -0.163643058925645 | -0.16511961248511045 |
| 2023-01-01T00:01:00Z |   0.137034364053949 |  0.13789861917955581 |
| 2023-01-01T00:02:00Z |  -0.482943221384294 |  -0.5243575352718546 |
| 2023-01-01T00:03:00Z | -0.0729732928756677 | -0.07310309943905952 |
| 2023-01-01T00:04:00Z |    1.77857552719844 |   -4.743341375725582 |
| 2023-01-01T00:05:00Z |   0.741147445214238 |   0.9151958486043346 |

{{% /expand %}}

{{% expand "Apply `TAN()` to each field" %}}

```sql
SELECT TAN(*) FROM numbers LIMIT 6
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |               tan_a |                tan_b |
| :------------------- | ------------------: | -------------------: |
| 2023-01-01T00:00:00Z |  0.3527145610408791 | -0.16511961248511045 |
| 2023-01-01T00:01:00Z | -0.9793857830953787 |  0.13789861917955581 |
| 2023-01-01T00:02:00Z | -1.3160934857179802 |  -0.5243575352718546 |
| 2023-01-01T00:03:00Z | -0.9109052733075013 | -0.07310309943905952 |
| 2023-01-01T00:04:00Z | -1.2757522322802637 |   -4.743341375725582 |
| 2023-01-01T00:05:00Z | -1.2375438046768912 |   0.9151958486043346 |

{{% /expand %}}

{{% expand "Apply `TAN()` to time windows (grouped by time)" %}}

```sql
SELECT
  TAN(SUM(a))
FROM numbers
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-01-01T01:00:00Z'
GROUP BY time(10m)
```

{{% influxql/table-meta %}}
name: numbers
{{% /influxql/table-meta %}}

| time                 |                 tan |
| :------------------- | ------------------: |
| 2023-01-01T00:00:00Z |  -2.603968631156288 |
| 2023-01-01T00:10:00Z |  3.4171098358131733 |
| 2023-01-01T00:20:00Z | 0.31117972731464494 |
| 2023-01-01T00:30:00Z | 0.30154101138968664 |
| 2023-01-01T00:40:00Z | 0.22482036866737865 |
| 2023-01-01T00:50:00Z |    56.3338223288096 |

{{% /expand %}}
{{< /expand-wrapper >}}
