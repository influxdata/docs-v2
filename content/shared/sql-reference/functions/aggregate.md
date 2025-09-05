SQL aggregate functions aggregate values in a specified column for each
group or SQL partition and return a single row per group containing the
aggregate value.

- [General aggregate functions](#general-aggregate-functions)
  - [array_agg](#array_agg)
  - [avg](#avg)
  - [bit_and](#bit_and)
  - [bit_or](#bit_or)
  - [bit_xor](#bit_xor)
  - [bool_and](#bool_and)
  - [bool_or](#bool_or)
  - [count](#count)
  - [first_value](#first_value)
  - [grouping](#grouping)
  - [last_value](#last_value)
  - [max](#max)
  - [mean](#mean)
  - [median](#median)
  - [min](#min)
  - [nth_value](#nth_value)
  - [string_agg](#string_agg)
  - [sum](#sum)
- [Statistical aggregate functions](#statistical-aggregate-functions)
  - [corr](#corr)
  - [covar](#covar)
  - [covar_pop](#covar_pop)
  - [covar_samp](#covar_samp)
  - [regr_avgx](#regr_avgx)
  - [regr_avgy](#regr_avgy)
  - [regr_count](#regr_count)
  - [regr_intercept](#regr_intercept)
  - [regr_r2](#regr_r2)
  - [regr_slope](#regr_slope)
  - [regr_sxx](#regr_sxx)
  - [regr_syy](#regr_syy)
  - [regr_sxy](#regr_sxy)
  - [stddev](#stddev)
  - [stddev_pop](#stddev_pop)
  - [stddev_samp](#stddev_samp)
  - [var](#var)
  - [var_pop](#var_pop)
  - [var_population](#var_population)
  - [var_samp](#var_samp)
  - [var_sample](#var_sample)
- [Approximate aggregate functions](#approximate-aggregate-functions)
  - [approx_distinct](#approx_distinct)
  - [approx_median](#approx_median)
  - [approx_percentile_cont](#approx_percentile_cont)
  - [approx_percentile_cont_with_weight](#approx_percentile_cont_with_weight)

---

## General aggregate functions

- [array_agg](#array_agg)
- [avg](#avg)
- [bit_and](#bit_and)
- [bit_or](#bit_or)
- [bit_xor](#bit_xor)
- [bool_and](#bool_and)
- [bool_or](#bool_or)
- [count](#count)
- [first_value](#first_value)
- [grouping](#grouping)
- [last_value](#last_value)
- [max](#max)
- [mean](#mean)
- [median](#median)
- [min](#min)
- [nth_value](#nth_value)
- [string_agg](#string_agg)
- [sum](#sum)

### array_agg

Returns an array created from the expression elements.

> [!Note]
> `array_agg` returns a `LIST` Arrow type. Use bracket notation to reference the
> index of an element in the returned array. Arrays are 1-indexed.

```sql
array_agg(expression)
```

#### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `array_agg` query example" %}}

_The following example uses the {{< influxdb3/home-sample-link >}}._

```sql
SELECT
  room,
  array_agg(temp)[3] AS '3rd_temp'
FROM home
GROUP BY room
```

| room        | 3rd_temp |
| :---------- | -------: |
| Kitchen     |     22.7 |
| Living Room |     21.8 |

{{% /expand %}}
{{< /expand-wrapper >}}

### avg

Returns the average of numeric values in the specified column.

```sql
avg(expression)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

##### Aliases

- `mean`

{{< expand-wrapper >}}
{{% expand "View `avg` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  avg(precip) AS avg_precip
FROM weather
GROUP BY location
```

| location      |           avg_precip |
| :------------ | -------------------: |
| Concord       | 0.027120658135283374 |
| Hayward       |  0.03708029197080292 |
| San Francisco |  0.03750912408759125 |

{{% /expand %}}
{{< /expand-wrapper >}}

### bit_and

Computes the bitwise `AND` of all non-null input values.

```sql
bit_and(expression)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `bit_and` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  bit_and(precip::BIGINT) AS precip_bit_and
FROM weather
GROUP BY location
```

| location      | precip_bit_and |
| :------------ | -------------: |
| Concord       |              0 |
| Hayward       |              0 |
| San Francisco |              0 |

{{% /expand %}}
{{< /expand-wrapper >}}

### bit_or

Computes the bitwise OR of all non-null input values.

```sql
bit_or(expression)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `bit_or` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  bit_or(precip::BIGINT) AS precip_bit_or
FROM weather
GROUP BY location
```

| location      | precip_bit_or |
| :------------ | ------------: |
| Concord       |             7 |
| Hayward       |             7 |
| San Francisco |             7 |

{{% /expand %}}
{{< /expand-wrapper >}}

### bit_xor

Computes the bitwise exclusive OR of all non-null input values.

```sql
bit_xor(expression)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `bit_xor` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  bit_xor(precip::BIGINT) AS precip_bit_xor
FROM weather
GROUP BY location
```

| location      | precip_bit_xor |
| :------------ | -------------: |
| Concord       |              4 |
| Hayward       |              6 |
| San Francisco |              4 |

{{% /expand %}}
{{< /expand-wrapper >}}

### bool_and

Returns `true` if _all_ non-null input values are `true`, otherwise returns `false`.

```sql
bool_and(expression)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `bool_and` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  bool_and(precip > 0) AS precip_bool_and
FROM weather
GROUP BY location
```

| location      | precip_bool_and |
| :------------ | --------------: |
| Concord       |           false |
| Hayward       |           false |
| San Francisco |           false |

{{% /expand %}}
{{< /expand-wrapper >}}

### bool_or

Returns `true` if _any_ non-null input value is `true`, otherwise returns `false`.

```sql
bool_or(expression)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `bool_or` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  bool_or(precip > 0) AS precip_bool_or
FROM weather
GROUP BY location
```

| location      | precip_bool_or |
| :------------ | -------------: |
| Concord       |           true |
| Hayward       |           true |
| San Francisco |           true |

{{% /expand %}}
{{< /expand-wrapper >}}

### count

Returns the number of rows in the specified column.

Count includes _null_ values in the total count.
To exclude _null_ values from the total count, include `<column> IS NOT NULL`
in the `WHERE` clause.

```sql
count(expression)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `count` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  count(precip) AS precip_count
FROM weather
GROUP BY location
```

| location      | precip_count |
| :------------ | -----------: |
| Concord       |         1094 |
| Hayward       |         1096 |
| San Francisco |         1096 |

{{% /expand %}}
{{< /expand-wrapper >}}

### first_value

Returns the first element in an aggregation group according to the specified ordering.
If no ordering is specified, returns an arbitrary element from the group.

```sql
first_value(expression [ORDER BY expression])
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `first_value` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  first_value(temp_max ORDER BY time) AS temp_max_first_value
FROM weather
GROUP BY location
```

| location      | temp_max_first_value |
| :------------ | -------------------: |
| Concord       |                   59 |
| Hayward       |                   57 |
| San Francisco |                   66 |

{{% /expand %}}
{{< /expand-wrapper >}}

### grouping

Returns 1 if the data is aggregated across the specified column, or 0 if it is
not aggregated in the result set.

```sql
grouping(expression)
```

##### Arguments

- **expression**: Expression to evaluate whether data is aggregated across the
  specified column. Can be a constant, column, or function.

{{< expand-wrapper >}}
{{% expand "View `grouping` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  avg(temp_max) AS avg_max_temp,
  grouping(location) AS grouping
FROM weather
GROUP BY GROUPING SETS ((location), ())
```

| location      |      avg_max_temp | grouping |
| :------------ | ----------------: | -------: |
| Concord       | 75.54379562043796 |        0 |
| Hayward       | 69.12043795620438 |        0 |
| San Francisco | 67.59945255474453 |        0 |
|               | 70.75456204379562 |        1 |

{{% /expand %}}
{{< /expand-wrapper >}}

### last_value

Returns the last element in an aggregation group according to the specified ordering.
If no ordering is specified, returns an arbitrary element from the group.

```sql
last_value(expression [ORDER BY expression])
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `last_value` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  last_value(temp_max ORDER BY time) AS temp_max_last_value
FROM weather
GROUP BY location
```

| location      | temp_max_last_value |
| :------------ | ------------------: |
| Concord       |                  59 |
| Hayward       |                  58 |
| San Francisco |                  62 |

{{% /expand %}}
{{< /expand-wrapper >}}

### max

Returns the maximum value in the specified column.

```sql
max(expression)
```

_To return both the maximum value and its associated timestamp, use
[`selector_max`](/influxdb/version/reference/sql/functions/selector/#selector_max)._

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `max` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  max(precip) AS max_precip
FROM weather
GROUP BY location
```

| location      | max_precip |
| :------------ | ---------: |
| Concord       |       4.53 |
| Hayward       |       4.34 |
| San Francisco |       4.02 |

{{% /expand %}}
{{< /expand-wrapper >}}

### mean

_Alias of [`avg`](#avg)._

### median

Returns the median value in the specified column.

```
median(expression)
```

#### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `median` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  median(temp_avg) AS median_temp_avg
FROM weather
GROUP BY location
```

| location      | median_temp_avg |
| :------------ | --------------: |
| Concord       |            61.0 |
| Hayward       |            59.0 |
| San Francisco |            58.0 |

{{% /expand %}}
{{< /expand-wrapper >}}

### min

Returns the minimum value in the specified column.

```sql
min(expression)
```

_To return both the minimum value and its associated timestamp, use
[`selector_max`](/influxdb/version/reference/sql/functions/selector/#selector_min)._

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `min` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  min(temp_min) AS min_temp_min
FROM weather
GROUP BY location
```

| location      | min_temp_min |
| :------------ | -----------: |
| Concord       |         28.0 |
| Hayward       |         32.0 |
| San Francisco |         35.0 |

{{% /expand %}}
{{< /expand-wrapper >}}

### nth_value

Returns the nth value in a group of values.

```sql
nth_value(expression, n [ORDER BY order_expression_1, ... order_expression_n])
```

##### arguments

- **expression**: The column or expression to retrieve the nth value from.
- **n**: The position (nth) of the value to retrieve, based on the ordering.
- **order_expression_1, ... order_expression_n**: Expressions to order by.
  Can be a column or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `nth_value` query example" %}}

_The following example uses the {{< influxdb3/home-sample-link >}}._

```sql
SELECT
  room,
  nth_value(temp, 3 ORDER BY time) AS "3rd_temp"
FROM
  home
GROUP BY
  room
```

| room        | 3rd_temp |
| :---------- | -------: |
| Living Room |     21.8 |
| Kitchen     |     22.7 |

{{% /expand %}}
{{< /expand-wrapper >}}

### string_agg

Concatenates the values of string expressions and places separator values between them.

```sql
string_agg(expression, delimiter)
```

##### Arguments

- **expression**: The string expression to concatenate.
  Can be a column or any valid string expression.
- **delimiter**: A literal string to use as a separator between the concatenated
  values.

{{< expand-wrapper >}}
{{% expand "View `string_agg` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT
  location,
  string_agg(temp_avg::STRING, ', ') AS string_agg
FROM 
  weather
WHERE
  time > '2020-01-01T00:00:00Z'
  AND time < '2020-01-05T00:00:00Z'
GROUP BY
  location
```

| location      | string_agg       |
| :------------ | :--------------- |
| San Francisco | 54.0, 52.0, 54.0 |
| Hayward       | 51.0, 50.0, 51.0 |
| Concord       | 53.0, 49.0, 51.0 |

{{% /expand %}}
{{< /expand-wrapper >}}

### sum

Returns the sum of all values in the specified column.

```sql
sum(expression)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `sum` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  sum(precip) AS total_precip
FROM weather
GROUP BY location
```

| location      |       total_precip |
| :------------ | -----------------: |
| Concord       | 29.670000000000012 |
| Hayward       |              40.64 |
| San Francisco | 41.110000000000014 |

{{% /expand %}}
{{< /expand-wrapper >}}


## Statistical aggregate functions

- [corr](#corr)
- [covar](#covar)
- [covar_pop](#covar_pop)
- [covar_samp](#covar_samp)
- [regr_avgx](#regr_avgx)
- [regr_avgy](#regr_avgy)
- [regr_count](#regr_count)
- [regr_intercept](#regr_intercept)
- [regr_r2](#regr_r2)
- [regr_slope](#regr_slope)
- [regr_sxx](#regr_sxx)
- [regr_syy](#regr_syy)
- [regr_sxy](#regr_sxy)
- [stddev](#stddev)
- [stddev_pop](#stddev_pop)
- [stddev_samp](#stddev_samp)
- [var](#var)
- [var_pop](#var_pop)
- [var_population](#var_population)
- [var_samp](#var_samp)
- [var_sample](#var_sample)

### corr

Returns the coefficient of correlation between two numeric values.

```sql
corr(expression1, expression2)
```

##### Arguments

- **expression1**: First column or literal value to operate on.
- **expression2**: Second column or literal value to operate on.

{{< expand-wrapper >}}
{{% expand "View `corr` query example" %}}

_The following example uses the {{< influxdb3/home-sample-link >}}._

```sql
SELECT
  room,
  corr(hum, temp) AS correlation
FROM home
GROUP BY room
```

| room        |         correlation |
| :---------- | ------------------: |
| Living Room | 0.43665270457835725 |
| Kitchen     |  0.6741766954929539 |

{{% /expand %}}
{{< /expand-wrapper >}}

### covar

Returns the covariance of a set of number pairs.

```sql
covar(expression1, expression2)
```

##### Arguments

- **expression1**: First column or literal value to operate on.
- **expression2**: Second column or literal value to operate on.

{{< expand-wrapper >}}
{{% expand "View `covar` query example" %}}

_The following example uses the {{< influxdb3/home-sample-link >}}._

```sql
SELECT
  room,
  covar(hum, temp) AS covar
FROM home
GROUP BY room
```

| room        |               covar |
| :---------- | ------------------: |
| Living Room | 0.03346153846153959 |
| Kitchen     | 0.11134615384615432 |

{{% /expand %}}
{{< /expand-wrapper >}}

### covar_pop

Returns the population covariance of a set of number pairs.

```sql
covar_pop(expression1, expression2)
```

##### Arguments

- **expression1**: First column or literal value to operate on.
- **expression2**: Second column or literal value to operate on.

{{< expand-wrapper >}}
{{% expand "View `covar_pop` query example" %}}

_The following example uses the {{< influxdb3/home-sample-link >}}._

```sql
SELECT
  room,
  covar_pop(hum, temp) AS covar_pop
FROM home
GROUP BY room
```

| room        |            covar_pop |
| :---------- | -------------------: |
| Kitchen     |  0.10278106508875783 |
| Living Room | 0.030887573964498087 |

{{% /expand %}}
{{< /expand-wrapper >}}

### covar_samp

Returns the sample covariance of a set of number pairs.

```sql
covar_samp(expression1, expression2)
```

##### Arguments

- **expression1**: First column or literal value to operate on.
- **expression2**: Second column or literal value to operate on.

{{< expand-wrapper >}}
{{% expand "View `covar_samp` query example" %}}

_The following example uses the {{< influxdb3/home-sample-link >}}._

```sql
SELECT
  room,
  covar_samp(hum, temp) AS covar_samp
FROM home
GROUP BY room
```

| room        |          covar_samp |
| :---------- | ------------------: |
| Kitchen     | 0.11134615384615432 |
| Living Room | 0.03346153846153959 |

{{% /expand %}}
{{< /expand-wrapper >}}

### regr_avgx

Computes the average of the independent variable (input), `expression_x`, for the
non-null dependent variable, `expression_y`.

```sql
regr_avgx(expression_y, expression_x)
```

##### Arguments

- **expression_y**: Dependent variable.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **expression_x**: Independent variable.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `regr_avgx` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  regr_avgx(temp_min, temp_max) AS temp_regr_avgx
FROM weather
GROUP BY location
```

| location      |    temp_regr_avgx |
| :------------ | ----------------: |
| Concord       | 75.54379562043796 |
| Hayward       | 69.14808043875686 |
| San Francisco | 67.59945255474454 |

{{% /expand %}}
{{< /expand-wrapper >}}

### regr_avgy

Computes the average of the dependent variable (output), `expression_y`, for the
non-null dependent variable, `expression_y`.

```sql
regr_avgy(expression_y, expression_x)
```

##### Arguments

- **expression_y**: Dependent variable.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **expression_x**: Independent variable.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `regr_avgy` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  regr_avgy(temp_min, temp_max) AS temp_regr_avgy
FROM weather
GROUP BY location
```

| location      |     temp_regr_avgy |
| :------------ | -----------------: |
| Concord       | 50.153284671532845 |
| Hayward       | 50.913162705667276 |
| San Francisco |  51.52372262773722 |

{{% /expand %}}
{{< /expand-wrapper >}}

### regr_count

Counts the number of non-null paired data points.

```sql
regr_count(expression_y, expression_x)
```

##### Arguments

- **expression_y**: Dependent variable.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **expression_x**: Independent variable.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `regr_count` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  regr_count(temp_min, temp_max) AS temp_regr_count
FROM weather
GROUP BY location
```

| location      | temp_regr_count |
| :------------ | --------------: |
| Concord       |            1096 |
| Hayward       |            1094 |
| San Francisco |            1096 |

{{% /expand %}}
{{< /expand-wrapper >}}

### regr_intercept

Computes the y-intercept of the linear regression line.
For the equation `(y = kx + b)`, this function returns `b`.

```sql
regr_intercept(expression_y, expression_x)
```

##### Arguments

- **expression_y**: Dependent variable.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **expression_x**: Independent variable.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `regr_intercept` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  regr_intercept(temp_min, temp_max) AS temp_regr_intercept
FROM weather
GROUP BY location
```

| location      | temp_regr_intercept |
| :------------ | ------------------: |
| Concord       |  11.636281392206769 |
| Hayward       |  12.876956842745152 |
| San Francisco |  19.125237647086607 |

{{% /expand %}}
{{< /expand-wrapper >}}

### regr_r2

Computes the square of the correlation coefficient between the independent and
dependent variables.

```sql
regr_r2(expression_y, expression_x)
```

##### Arguments

- **expression_y**: Dependent variable.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **expression_x**: Independent variable.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `regr_r2` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  regr_r2(temp_min, temp_max) AS temp_regr_r2
FROM weather
GROUP BY location
```

| location      |       temp_regr_r2 |
| :------------ | -----------------: |
| Concord       | 0.6474628308450441 |
| Hayward       | 0.5166296626320914 |
| San Francisco | 0.5032317511200297 |

{{% /expand %}}
{{< /expand-wrapper >}}

### regr_slope

Returns the slope of the linear regression line for non-null pairs in aggregate columns.
Given input column `Y` and `X`: `regr_slope(Y, X)` returns the slope
(`k` in `Y = k*X + b`) using minimal RSS fitting.

``` sql
regr_slope(expression_y, expression_x)
``` 

##### Arguments

- **expression_y**: Y expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **expression_x**: X expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `regr_slope` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  regr_slope(temp_min, temp_max) AS temp_regr_slope
FROM weather
GROUP BY location
```

| location      |    temp_regr_slope |
| :------------ | -----------------: |
| Concord       | 0.5098632252058237 |
| Hayward       | 0.5500688612261629 |
| San Francisco | 0.4792714105844738 |

{{% /expand %}}
{{< /expand-wrapper >}}

### regr_sxx

Computes the sum of squares of the independent variable.

```sql
regr_sxx(expression_y, expression_x)
```

##### Arguments

- **expression_y**: Dependent variable.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **expression_x**: Independent variable.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `regr_sxx` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  regr_sxx(temp_min, temp_max) AS temp_regr_sxx
FROM weather
GROUP BY location
```

| location      |      temp_regr_sxx |
| :------------ | -----------------: |
| Concord       | 210751.89781021897 |
| Hayward       |  99644.01096892142 |
| San Francisco |  77413.15967153282 |

{{% /expand %}}
{{< /expand-wrapper >}}

### regr_syy

Computes the sum of squares of the dependent variable.

```sql
regr_syy(expression_y, expression_x)
```

##### Arguments

- **expression_y**: Dependent variable.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **expression_x**: Independent variable.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `regr_syy` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  regr_syy(temp_min, temp_max) AS temp_regr_syy
FROM weather
GROUP BY location
```

| location      |      temp_regr_syy |
| :------------ | -----------------: |
| Concord       |  84618.24817518248 |
| Hayward       | 58358.750457038404 |
| San Francisco |  35335.38321167884 |

{{% /expand %}}
{{< /expand-wrapper >}}

### regr_sxy

Computes the sum of products of paired data points.

```sql
regr_sxy(expression_y, expression_x)
```

#### Arguments

- **expression_y**: Dependent variable.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **expression_x**: Independent variable.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `regr_sxy` query example" %}}

_The following example uses the
[NOAA Bay Area weather data](/influxdb/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT 
  location,
  regr_sxy(temp_min, temp_max) AS temp_regr_sxy
FROM weather
GROUP BY location
```

| location      |      temp_regr_sxy |
| :------------ | -----------------: |
| Concord       | 107454.64233576645 |
| Hayward       |  54811.06764168191 |
| San Francisco | 37101.914233576645 |

{{% /expand %}}
{{< /expand-wrapper >}}

### stddev

Returns the standard deviation of a set of numbers.

```sql
stddev(expression)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `stddev` query example" %}}

_The following example uses the {{< influxdb3/home-sample-link >}}._

```sql
SELECT
  room,
  stddev(co) AS stddev
FROM home
GROUP BY room
```

| room        |            stddev |
| :---------- | ----------------: |
| Living Room | 5.885662718931967 |
| Kitchen     | 9.321879418735037 |

{{% /expand %}}
{{< /expand-wrapper >}}

### stddev_pop

Returns the population standard deviation of a set of numbers.

```sql
stddev_pop(expression)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `stddev_pop` query example" %}}

_The following example uses the {{< influxdb3/home-sample-link >}}._

```sql
SELECT
  room,
  stddev_pop(co) AS stddev_pop
FROM home
GROUP BY room
```

| room        |        stddev_pop |
| :---------- | ----------------: |
| Kitchen     | 8.956172047894082 |
| Living Room | 5.654761830612032 |

{{% /expand %}}
{{< /expand-wrapper >}}

### stddev_samp

Returns the sample standard deviation of a set of numbers.

```sql
stddev_samp(expression)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `stddev_samp` query example" %}}

_The following example uses the {{< influxdb3/home-sample-link >}}._

```sql
SELECT
  room,
  stddev_samp(co) AS stddev_samp
FROM home
GROUP BY room
```

| room        |       stddev_samp |
| :---------- | ----------------: |
| Living Room | 5.885662718931967 |
| Kitchen     | 9.321879418735037 |

{{% /expand %}}
{{< /expand-wrapper >}}

### var

Returns the statistical variance of a set of numbers.

```sql
var(expression)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `var` query example" %}}

_The following example uses the {{< influxdb3/home-sample-link >}}._

```sql
SELECT
  room,
  var(co) AS var
FROM home
GROUP BY room
```

| room        |               var |
| :---------- | ----------------: |
| Living Room | 34.64102564102564 |
| Kitchen     | 86.89743589743587 |

{{% /expand %}}
{{< /expand-wrapper >}}

### var_pop

Returns the statistical population variance of a set of numbers.

```sql
var_pop(expression)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

##### Aliases

- var_population

{{< expand-wrapper >}}
{{% expand "View `var_pop` query example" %}}

_The following example uses the {{< influxdb3/home-sample-link >}}._

```sql
SELECT
  room,
  var_pop(co) AS var_pop
FROM home
GROUP BY room
```

| room        |            var_pop |
| :---------- | -----------------: |
| Living Room | 31.976331360946745 |
| Kitchen     |  80.21301775147927 |

{{% /expand %}}
{{< /expand-wrapper >}}

### var_population

_Alias of [`var_pop`](#var_pop)._

### var_samp

Returns the statistical sample variance of a set of numbers.

```sql
var_samp(expression)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

##### Aliases

- var_sample

{{< expand-wrapper >}}
{{% expand "View `var_samp` query example" %}}

_The following example uses the {{< influxdb3/home-sample-link >}}._

```sql
SELECT
  room,
  var_samp(co) AS var_samp
FROM home
GROUP BY room
```

| room        |          var_samp |
| :---------- | ----------------: |
| Kitchen     | 86.89743589743587 |
| Living Room | 34.64102564102564 |

{{% /expand %}}
{{< /expand-wrapper >}}

### var_sample

_Alias of [var_samp](#var_samp)._

## Approximate aggregate functions

- [approx_distinct](#approx_distinct)
- [approx_median](#approx_median)
- [approx_percentile_cont](#approx_percentile_cont)
- [approx_percentile_cont_with_weight](#approx_percentile_cont_with_weight)

### approx_distinct

Returns the approximate number of distinct input values calculated using the
HyperLogLog algorithm.

```sql
approx_distinct(expression)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `approx_distinct` query example" %}}

_The following example uses the {{< influxdb3/home-sample-link >}}._

```sql
SELECT
  room,
  approx_distinct(co::string) AS approx_distinct
FROM home
GROUP BY room
```

| room        | approx_distinct |
| :---------- | --------------: |
| Living Room |               7 |
| Kitchen     |               8 |

{{% /expand %}}
{{< /expand-wrapper >}}

### approx_median

Returns the approximate median (50th percentile) of input values.
It is an alias of `approx_percentile_cont(x, 0.5)`.

```sql
approx_median(expression)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `approx_median` query example" %}}

_The following example uses the {{< influxdb3/home-sample-link >}}._

```sql
SELECT
  room,
  approx_median(temp) AS approx_median
FROM home
GROUP BY room
```

| room        | approx_median |
| :---------- | ------------: |
| Kitchen     |          22.7 |
| Living Room |          22.3 |

{{% /expand %}}
{{< /expand-wrapper >}}

### approx_percentile_cont

Returns the approximate percentile of input values using the t-digest algorithm.

```sql
approx_percentile_cont(expression, percentile, centroids)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **percentile**: Percentile to compute. Must be a float value between 0 and 1 (inclusive).
- **centroids**: Number of centroids to use in the t-digest algorithm. _Default is 100_.

  If there are this number or fewer unique values, you can expect an exact result.
  A higher number of centroids results in a more accurate approximation, but
  requires more memory to compute.

{{< expand-wrapper >}}
{{% expand "View `approx_percentile_cont` query example" %}}

_The following example uses the {{< influxdb3/home-sample-link >}}._

```sql
SELECT
  room,
  approx_percentile_cont(temp, 0.99) AS "99th_percentile"
FROM home
GROUP BY room
```

| room        | 99th_percentile |
| :---------- | --------------: |
| Kitchen     |            23.3 |
| Living Room |            22.8 |

{{% /expand %}}
{{< /expand-wrapper >}}

### approx_percentile_cont_with_weight

Returns the weighted approximate percentile of input values using the
t-digest algorithm.

```sql
approx_percentile_cont_with_weight(expression, weight, percentile)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **weight**: Expression to use as weight.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **percentile**: Percentile to compute. Must be a float value between 0 and 1 (inclusive).

{{< expand-wrapper >}}
{{% expand "View `approx_percentile_cont_with_weight` query example" %}}

_The following example uses the {{< influxdb3/home-sample-link >}}._

```sql
SELECT
  room,
  approx_percentile_cont_with_weight(temp, co, 0.99) AS "co_weighted_99th_percentile"
FROM home
GROUP BY room
```

| room        | co_weighted_99th_percentile |
| :---------- | --------------------------: |
| Kitchen     |                        23.3 |
| Living Room |                        22.8 |

{{% /expand %}}
{{< /expand-wrapper >}}
