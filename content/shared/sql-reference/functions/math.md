The {{< product-name >}} SQL implementation supports the following math functions for
performing mathematic operations:

- [abs](#abs)
- [acos](#acos)
- [acosh](#acosh)
- [asin](#asin)
- [asinh](#asinh)
- [atan](#atan)
- [atanh](#atanh)
- [atan2](#atan2)
- [cbrt](#cbrt)
- [ceil](#ceil)
- [cos](#cos)
- [cosh](#cosh)
- [cot](#cot)
- [degrees](#degrees)
- [exp](#exp)
- [factorial](#factorial)
- [floor](#floor)
- [gcd](#gcd)
- [isnan](#isnan)
- [iszero](#iszero)
- [lcm](#lcm)
- [ln](#ln)
- [log](#log)
- [log10](#log10)
- [log2](#log2)
- [nanvl](#nanvl)
- [pi](#pi)
- [power](#power)
- [pow](#pow)
- [radians](#radians)
- [random](#random)
- [round](#round)
- [signum](#signum)
- [sin](#sin)
- [sinh](#sinh)
- [sqrt](#sqrt)
- [tan](#tan)
- [tanh](#tanh)
- [trunc](#trunc)

## abs

Returns the absolute value of a number.

```sql
abs(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `abs` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

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

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `acos` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

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

## acosh

Returns the area hyperbolic cosine or inverse hyperbolic cosine of a number.

```sql
acosh(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `acosh` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

```sql
SELECT acosh(temp) AS acosh FROM home LIMIT 3
```

|              acosh |
| -----------------: |
|  3.737102242198924 |
| 3.8281684713331012 |
| 3.8150265878962055 |

{{% /expand %}}
{{< /expand-wrapper >}}

## asin

Returns the arc sine or inverse sine of a number.

```sql
asin(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `asin` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

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

## asinh

Returns the area hyperbolic sine or inverse hyperbolic sine of a number.

```sql
asinh(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `asinh` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

```sql
SELECT asinh(temp) AS asinh FROM home LIMIT 3
```

|              asinh |
| -----------------: |
| 3.7382360302615427 |
| 3.8291136516208812 |
| 3.8159969160459988 |

{{% /expand %}}
{{< /expand-wrapper >}}

## atan

Returns the arc tangent or inverse tangent of a number.

```sql
atan(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `atan` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

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

## atanh

Returns the area hyperbolic tangent or inverse hyperbolic tangent of a number.

```sql
atanh(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `atanh` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

```sql
SELECT atanh(temp * .01) AS atanh FROM home LIMIT 3
```

|               atanh |
| ------------------: |
| 0.21317134656485978 |
|  0.2341894667593668 |
| 0.23102419806174476 |

{{% /expand %}}
{{< /expand-wrapper >}}

## atan2

Returns the arc tangent or inverse tangent of `expression_y / expression_x`.

```sql
atan2(expression_y, expression_x)
```

### Arguments

- **expression_y**: First numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **expression_x**: Second numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `atan2` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

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

## cbrt

Returns the cube root of a number.

```sql
cbrt(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `cbrt` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

```sql
SELECT cbrt(temp) AS cbrt FROM home LIMIT 3
```

|               cbrt |
| -----------------: |
| 2.7589241763811208 |
|  2.843866979851566 |
|  2.831448188528187 |

{{% /expand %}}
{{< /expand-wrapper >}}

## ceil

Returns the nearest integer greater than or equal to a number.

```sql
ceil(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `ceil` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

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

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `cos` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

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

## cosh

Returns the hyperbolic cosine of a number.

```sql
cosh(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `cosh` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

```sql
SELECT cosh(temp) AS cosh FROM home LIMIT 3
```

|               cosh |
| -----------------: |
|  659407867.2416073 |
|  4872401723.124452 |
| 3609563974.9715896 |

{{% /expand %}}
{{< /expand-wrapper >}}

## cot

Returns the cotangent of a number.

```sql
cot(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of operators.

{{< expand-wrapper >}}
{{% expand "View `cot` query example" %}}

_The following example uses the
[Random numbers sample dataset](/influxdb/version/reference/sample-data/#random-numbers-sample-data)._

```sql
SELECT cot(a) AS cot FROM numbers LIMIT 3
```

|                cot |
| -----------------: |
| 2.9293528483724423 |
|  3.705570308335524 |
| -3.314652247498361 |

{{% /expand %}}
{{< /expand-wrapper >}}

## degrees

Converts radians to degrees.

```sql
degrees(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `degrees` query example" %}}

_The following example uses the
[Random numbers sample dataset](/influxdb/version/reference/sample-data/#random-numbers-sample-data)._

```sql
SELECT degrees(a) AS degrees FROM numbers LIMIT 3
```

|             degrees |
| ------------------: |
|  19.428488139031185 |
| -44.403317464348774 |
| -52.771542485064785 |

{{% /expand %}}
{{< /expand-wrapper >}}

## exp

Returns the base-e exponential of a number.

```sql
exp(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to use as the exponent.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `exp` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

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

## factorial

Returns 1 if value is less than 2.

```sql
factorial(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Must be an integer (`BIGINT`).
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `factorial` query example" %}}

_The following example uses the
[Random numbers sample dataset](/influxdb/version/reference/sample-data/#random-numbers-sample-data)._

```sql
SELECT factorial((b + 2)::BIGINT) AS factorial FROM numbers LIMIT 3
```

| factorial |
| --------: |
|         1 |
|         2 |
|         1 |

{{% /expand %}}
{{< /expand-wrapper >}}

## floor

Returns the nearest integer less than or equal to a number.

```sql
floor(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `floor` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

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

## gcd

Returns the greatest common divisor of `expression_x` and `expression_y`.
Returns `0` if both inputs are zero.

```sql
gcd(expression_x, expression_y)
```

### Arguments

- **expression_x**: First numeric expression to operate on.
  Must be an integer (`BIGINT`).
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **expression_y**: Second numeric expression to operate on.
  Must be an integer (`BIGINT`).
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `gcd` query example" %}}

_The following example uses the
[Random numbers sample dataset](/influxdb/version/reference/sample-data/#random-numbers-sample-data)._

```sql
SELECT gcd((a * 5)::BIGINT, (b * 5)::BIGINT) AS gcd FROM numbers LIMIT 3
```

| gcd |
| --------: |
|         1 |
|         3 |
|         2 |

{{% /expand %}}
{{< /expand-wrapper >}}

## isnan

Returns `true` if a given number is ±NaN, otherwise returns `false`.

```sql
isnan(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Must be a float (`DOUBLE`).
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `isnan` query example" %}}

_The following example uses the
[Table value constructor](/influxdb/version/reference/sql/table-value-constructor/)
to simulate sample data._

```sql
SELECT isnan(a)
FROM
  (VALUES (4.56),
          ('NaN'::DOUBLE),
          (16.2)
  ) AS data(a)
```

| isnan |
| ----: |
| false |
|  true |
| false |

{{% /expand %}}
{{< /expand-wrapper >}}

## iszero

Returns `true` if the given number is ±0.0, otherwise returns `false`.

```sql
iszero(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `iszero` query example" %}}

_The following example uses the
[Table value constructor](/influxdb/version/reference/sql/table-value-constructor/)
to simulate sample data._

```sql
SELECT iszero(a)
FROM
  (VALUES (0),
          (1),
          (2)
  ) AS data(a)
```

| iszero |
| -----: |
|   true |
|  false |
|  false |

{{% /expand %}}
{{< /expand-wrapper >}}

## lcm

Returns the least common multiple of `expression_x` and `expression_y`.
Returns `0` if either input is zero.

```sql
lcm(expression_x, expression_y)
```

### Arguments

- **expression_x**: First numeric expression to operate on.
  Must be an integer (`BIGINT`).
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **expression_y**: Second numeric expression to operate on.
  Must be an integer (`BIGINT`).
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `lcm` query example" %}}

_The following example uses the
[Random numbers sample dataset](/influxdb/version/reference/sample-data/#random-numbers-sample-data)._

```sql
SELECT lcm((a * 10)::BIGINT, (b * 10)::BIGINT) AS lcm FROM numbers LIMIT 3
```

| lcm |
| --: |
|   3 |
|   7 |
|  36 |

{{% /expand %}}
{{< /expand-wrapper >}}

## ln

Returns the natural logarithm of a number.

```sql
ln(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `ln` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

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

## log

Returns the base-x logarithm of a number.

```
log([base, ]numeric_expression)
```

#### Arguments

- **base**: Base numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
  Default is `10`.
- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `log` query example" %}}

_The following example uses the sample data set provided in the 
{{ influxdb3/home-sample-link }}._

```sql
SELECT
  temp,
  log(2, temp) AS temp_log2,
  log(4, temp) AS temp_log4,
  log(temp) AS temp_log10
FROM home
LIMIT 3
```

| temp |         temp_log2 |          temp_log4 |         temp_log10 |
| :--- | ----------------: | -----------------: | -----------------: |
| 21   | 4.392317422778761 | 2.1961587113893803 |  1.322219294733919 |
| 23   | 4.523561956057013 | 2.2617809780285065 | 1.3617278360175928 |
| 22.7 | 4.504620392403553 | 2.2523101962017766 | 1.3560258571931225 |

{{% /expand %}}
{{< /expand-wrapper >}}

## log10

Returns the base-10 logarithm of a number.

```sql
log10(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `log10` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

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

Returns the base-2 logarithm of a number.

```sql
log2(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `log2` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

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

## nanvl

Returns the first argument if it’s not `±NaN`.
Otherwise returns the second argument.

```sql
nanvl(expression_x, expression_y)
```

### Arguments

- **expression_x**: Numeric expression to return if it’s not `NaN`.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **expression_y**: Numeric expression to return if the first expression is `NaN`.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `nanvl` query example" %}}

_The following example uses the
[Table value constructor](/influxdb/version/reference/sql/table-value-constructor/)
to simulate sample data._

```sql
SELECT nanvl(a, 0.0) AS nanvl
FROM
  (VALUES (4.56),
          ('NaN'::DOUBLE),
          (16.2)
  ) AS data(a)
```

| nanvl |
| ----: |
|  4.56 |
|     0 |
|  16.2 |

{{% /expand %}}
{{< /expand-wrapper >}}

## pi

Returns an approximate value of π.

```sql
pi()
```

{{< expand-wrapper >}}
{{% expand "View `pi` query example" %}}

```sql
SELECT pi() AS pi
```

| pi                |
| :---------------- |
| 3.141592653589793 |

{{% /expand %}}
{{< /expand-wrapper >}}

## power

Returns a base expression raised to the power of an exponent.

```sql
power(base, exponent)
```

##### Aliases

- `pow`

### Arguments

- **base**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **exponent**: Exponent numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `power` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

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

## `pow`

_Alias of [power](#power)._

## radians

Converts degrees to radians.

```sql
radians(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `radians` query example" %}}

_The following example uses the
[Random numbers sample dataset](/influxdb/version/reference/sample-data/#random-numbers-sample-data)._

```sql
SELECT radians(b) AS radians FROM numbers LIMIT 3
```

|               radians |
| --------------------: |
|   -0.0028561101762876 |
| 0.0023917008411179744 |
| -0.008428949313343818 |

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

_The following example uses the {{ influxdb3/home-sample-link }}._

```sql
SELECT temp * random() AS random FROM home LIMIT 3
```

> [!Note]
> Due to the nature of the function, your results will not match the results below.

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

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `round` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

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

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `signum` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

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

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `sin` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

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

## sinh

Returns the hyperbolic sine of a number.

```sql
sinh(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `sinh ` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

```sql
SELECT sinh(temp) AS sinh FROM home LIMIT 3
```

|               sinh |
| -----------------: |
|  659407867.2416073 |
|  4872401723.124452 |
| 3609563974.9715896 |

{{% /expand %}}
{{< /expand-wrapper >}}

## sqrt

Returns the square root of a number.

```sql
sqrt(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `sqrt` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

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

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `tan` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

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

## tanh

Returns the hyperbolic tangent of a number.

```sql
tanh(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `tanh` query example" %}}

_The following example uses the
[Random numbers sample dataset](/influxdb/version/reference/sample-data/#random-numbers-sample-data)._

```sql
SELECT tanh(a) AS tanh FROM numbers LIMIT 3
```

|                tanh |
| ------------------: |
| 0.32666571332086836 |
| -0.6498182711525403 |
| -0.7263877015335474 |

{{% /expand %}}
{{< /expand-wrapper >}}

## trunc

Truncates a number toward zero (at the decimal point).

```sql
trunc(numeric_expression)
```

### Arguments

- **numeric_expression**: Numeric expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `trunc` query example" %}}

_The following example uses the {{ influxdb3/home-sample-link }}._

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
