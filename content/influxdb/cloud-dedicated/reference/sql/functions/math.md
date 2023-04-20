---
title: SQL math functions
list_title: Math functions
description: >
  Use math functions to perform mathematical operations in SQL queries.
menu:
  influxdb_cloud_dedicated:
    name: Math
    parent: sql-functions    
weight: 306
---

The InfluxDB SQL implementation supports the following math functions for
performing mathematic operations:

- [abs](#abs)
- [acos](#acos)
- [asin](#asin)
- [atan](#atan)
- [atan2](#atan2)
- [ceil](#ceil)
- [cos](#cos)
- [exp](#exp)
- [floor](#floor)
- [ln](#ln)
- [log10](#log10)
- [log2](#log2)
- [power](#power)
- [random](#random)
- [round](#round)
- [signum](#signum)
- [sin](#sin)
- [sqrt](#sqrt)
- [tan](#tan)
- [trunc](#trunc)

## abs

Returns the absolute value of a number.

```sql
abs(numeric_expression)
```

##### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `abs` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT abs(temp) AS abs FROM home LIMIT 3
```

|  abs |
| ---: |
|   21 |
|   23 |
| 22.7 |

{{% /expand %}}
{{< /expand-wrapper >}}

## acos

Returns the arc cosine or inverse cosine of a number.

```sql
acos(numeric_expression)
```

##### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `acos` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT acos(temp * .01) AS acos FROM home LIMIT 3
```

|               acos |
| -----------------: |
|  1.359221367036801 |
| 1.3387186439321834 |
| 1.3418001704498232 |

{{% /expand %}}
{{< /expand-wrapper >}}

## asin

Returns the arc sine or inverse sine of a number.

```sql
asin(numeric_expression)
```

##### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `asin` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT asin(temp * .01) AS asin FROM home LIMIT 3
```

|                asin |
| ------------------: |
|  0.2115749597580956 |
| 0.23207768286271319 |
| 0.22899615634507337 |

{{% /expand %}}
{{< /expand-wrapper >}}

## atan

Returns the arc tangent or inverse tangent of a number.

```sql
atan(numeric_expression)
```

##### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `atan` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT atan(temp * .01) AS atan FROM home LIMIT 3
```

|                atan |
| ------------------: |
|   0.206992194219821 |
| 0.22606838799388393 |
| 0.22321725383717603 |

{{% /expand %}}
{{< /expand-wrapper >}}

## atan2

Returns the arc tangent or inverse tangent of `expression_y / expression_x`.

```sql
atan2(expression_y, expression_x)
```

##### Arguments

- **expression_y**: First numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **expression_x**: Second numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `atan2` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT atan2(temp, hum) AS atan2 FROM home LIMIT 3
```

|              atan2 |
| -----------------: |
| 0.5292859396993504 |
| 0.5660139100632452 |
| 0.5613335864315844 |

{{% /expand %}}
{{< /expand-wrapper >}}

## ceil

Returns the nearest integer greater than or equal to a number.

```sql
ceil(numeric_expression)
```

##### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `ceil` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT ceil(temp) AS ceil FROM home LIMIT 3
```

| ceil |
| ---: |
|   21 |
|   23 |
|   23 |

{{% /expand %}}
{{< /expand-wrapper >}}

## cos

Returns the cosine of a number.

```sql
cos(numeric_expression)
```

##### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `cos` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT cos(temp) AS cos FROM home LIMIT 3
```

|                 cos |
| ------------------: |
| -0.5477292602242684 |
| -0.5328330203333975 |
| -0.7591100556583898 |

{{% /expand %}}
{{< /expand-wrapper >}}

## exp

Returns the base-e exponential of a number.

```sql
exp(numeric_expression)
```

##### Arguments

- **numeric_expression**: Numeric expression to use as the exponent.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `exp` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT exp(temp) AS exp FROM home LIMIT 3
```

|                exp |
| -----------------: |
| 1318815734.4832146 |
|  9744803446.248903 |
|  7219127949.943179 |

{{% /expand %}}
{{< /expand-wrapper >}}

## floor

Returns the nearest integer less than or equal to a number.

```sql
floor(numeric_expression)
```

##### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `floor` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT floor(temp) AS floor FROM home LIMIT 3
```

| floor |
| ----: |
|    21 |
|    23 |
|    22 |

{{% /expand %}}
{{< /expand-wrapper >}}

## ln

Returns the natural logarithm of a number.

```sql
ln(numeric_expression)
```

##### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `ln` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT ln(temp) AS ln FROM home LIMIT 3
```

|                 ln |
| -----------------: |
|  3.044522437723423 |
| 3.1354942159291497 |
|  3.122364924487357 |

{{% /expand %}}
{{< /expand-wrapper >}}

## log10

Returns the base-10 logarithm of a number.

```sql
log10(numeric_expression)
```

##### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `log10` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT log10(temp) AS log10 FROM home LIMIT 3
```

|              log10 |
| -----------------: |
| 1.3222192947339193 |
| 1.3617278360175928 |
| 1.3560258571931227 |

{{% /expand %}}
{{< /expand-wrapper >}}

## log2

Returns the base-2 logarithm or a number.

```sql
log2(numeric_expression)
```

##### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `log2` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT log2(temp) AS log2 FROM home LIMIT 3
```

|              log2 |
| ----------------: |
| 4.392317422778761 |
| 4.523561956057013 |
| 4.504620392403552 |

{{% /expand %}}
{{< /expand-wrapper >}}

## power

Returns a base number raised to the power of an exponent.

```sql
power(base, exponent)
```

##### Arguments

- **power**: Base numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **exponent**: Exponent numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `power` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT power(temp, hum * .1) AS power FROM home LIMIT 3
```

|              power |
| -----------------: |
| 55817.099910217476 |
|  85007.01501569824 |
|  78569.38332452129 |

{{% /expand %}}
{{< /expand-wrapper >}}

## random

Returns a random float value between 0 and 1.
The random seed is unique to each row.

```sql
random()
```

{{< expand-wrapper >}}
{{% expand "View `random` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT temp * random() AS random FROM home LIMIT 3
```

{{% note %}}
Due to the nature of the function, your results will not match the results below.
{{% /note %}}

|             random |
| -----------------: |
| 0.5030770374815072 |
| 12.938847036567514 |
| 2.8204596545385385 |

{{% /expand %}}
{{< /expand-wrapper >}}

## round

Rounds a number to the nearest integer.

```sql
round(numeric_expression)
```

##### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `round` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT round(temp) AS round FROM home LIMIT 3
```

| round |
| ----: |
|    21 |
|    23 |
|    23 |

{{% /expand %}}
{{< /expand-wrapper >}}

## signum

Returns the sign of a number.
Negative numbers return `-1`.
Zero and positive numbers return `1`.

```sql
signum(numeric_expression)
```

##### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `signum` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT signum(temp - 23) AS signum FROM home LIMIT 3
```

| signum |
| -----: |
|     -1 |
|      1 |
|     -1 |

{{% /expand %}}
{{< /expand-wrapper >}}

## sin

Returns the sine of a number.

```sql
sin(numeric_expression)
```

##### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `sin` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT sin(temp) AS sin FROM home LIMIT 3
```

|                 sin |
| ------------------: |
|  0.8366556385360561 |
| -0.8462204041751706 |
| -0.6509623056662469 |

{{% /expand %}}
{{< /expand-wrapper >}}

## sqrt

Returns the square root of a number.

```sql
sqrt(numeric_expression)
```

##### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `sqrt` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT sqrt(temp) AS sqrt FROM home LIMIT 3
```

|              sqrt |
| ----------------: |
|  4.58257569495584 |
| 4.795831523312719 |
| 4.764451699828638 |

{{% /expand %}}
{{< /expand-wrapper >}}

## tan

Returns the tangent of a number.

```sql
tan(numeric_expression)
```

##### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `tan` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT tan(temp) AS tan FROM home LIMIT 3
```

|                 tan |
| ------------------: |
| -1.5274985276366035 |
|  1.5881530833912738 |
|  0.8575335036257101 |

{{% /expand %}}
{{< /expand-wrapper >}}

## trunc

Truncates a number toward zero (at the decimal point).

```sql
trunc(numeric_expression)
```

##### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `trunc` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT trunc(temp) AS trunc FROM home LIMIT 3
```

| trunc |
| ----: |
|    21 |
|    23 |
|    22 |

{{% /expand %}}
{{< /expand-wrapper >}}
