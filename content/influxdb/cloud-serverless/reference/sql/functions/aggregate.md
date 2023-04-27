---
title: SQL aggregate functions
list_title: Aggregate functions
description: >
  Aggregate data with SQL aggregate functions.
menu:
  influxdb_cloud_serverless:
    name: Aggregate
    parent: sql-functions
weight: 301
related:
  - /influxdb/cloud-serverless/query-data/sql/aggregate-select/
---

SQL aggregate functions aggregate values in a specified column for each
group or SQL partition and return a single row per group containing the
aggregate value.

- [General aggregate functions](#general-aggregate-functions)
  - [array_agg](#array_agg)
  - [avg](#avg)
  - [count](#count)
  - [max](#max)
  - [mean](#mean)
  - [median](#median)
  - [min](#min)
  - [sum](#sum)
- [Statistical aggregate functions](#statistical-aggregate-functions)
  - [corr](#corr)
  - [covar](#covar)
  - [covar_pop](#covar_pop)
  - [covar_samp](#covar_samp)
  - [stddev](#stddev)
  - [stddev_pop](#stddev_pop)
  - [stddev_samp](#stddev_samp)
  - [var](#var)
  - [var_pop](#var_pop)
  - [var_samp](#var_samp)
- [Approximate aggregate functions](#approximate-aggregate-functions)
  - [approx_distinct](#approx_distinct)
  - [approx_median](#approx_median)
  - [approx_percentile_cont](#approx_percentile_cont)
  - [approx_percentile_cont_with_weight](#approx_percentile_cont_with_weight)

---

## General aggregate functions

- [array_agg](#array_agg)
- [avg](#avg)
- [count](#count)
- [max](#max)
- [mean](#mean)
- [median](#median)
- [min](#min)
- [sum](#sum)

### array_agg

Returns an array created from the expression elements.

{{% note %}}
`array_agg` returns a `LIST` arrow type which is not supported by InfluxDB.
To use with InfluxDB, use bracket notation to reference the index of an element
in the returned array. Arrays are 1-indexed.
{{% /note %}}

```sql
array_agg(expression)
```

#### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `array_agg` query example" %}}

_The following example uses the sample data set provided in the 
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

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

```sql
SELECT 
  location,
  avg(water_level) AS water_level_avg
FROM h2o_feet
GROUP BY location
```

| location     |    water_level_avg |
| :----------- | -----------------: |
| coyote_creek |  5.359142420303919 |
| santa_monica | 3.5307120942458843 |

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

```sql
SELECT 
  location,
  count(water_level) AS water_level_count
FROM h2o_feet
GROUP BY location
```

| location     | water_level_count |
| :----------- | ----------------: |
| coyote_creek |              7604 |
| santa_monica |              7654 |

{{% /expand %}}
{{< /expand-wrapper >}}

### max

Returns the maximum value in the specified column.

```sql
max(expression)
```

_To return both the maximum value and its associated timestamp, use
[`selector_max`](/influxdb/cloud-serverless/reference/sql/functions/selector/#selector_max)._

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `max` query example" %}}

```sql
SELECT 
  location,
  max(water_level) AS water_level_max
FROM h2o_feet
GROUP BY location
```

| location     | water_level_max |
| :----------- | --------------: |
| santa_monica |           7.205 |
| coyote_creek |           9.964 |

{{% /expand %}}
{{< /expand-wrapper >}}

### mean

_Alias of [avg](#avg)._

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

```sql
SELECT 
  location,
  median(water_level) AS water_level_max
FROM h2o_feet
GROUP BY location
```

| location     | water_level_median |
| :----------- | -----------------: |
| coyote_creek |             5.4645 |
| santa_monica |              3.471 |

{{% /expand %}}
{{< /expand-wrapper >}}

### min

Returns the minimum value in the specified column.

```sql
min(expression)
```

_To return both the minimum value and its associated timestamp, use
[`selector_max`](/influxdb/cloud-serverless/reference/sql/functions/selector/#selector_min)._

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `min` query example" %}}

```sql
SELECT 
  location,
  min(water_level) AS water_level_min
FROM h2o_feet
GROUP BY location
```

| location     | water_level_min |
| :----------- | --------------: |
| coyote_creek |           -0.61 |
| santa_monica |          -0.243 |

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

```sql
SELECT 
  location,
  sum(water_level) AS water_level_sum
FROM h2o_feet
GROUP BY location
```

| location     |    water_level_sum |
| :----------- | -----------------: |
| santa_monica |    27024.070369358 |
| coyote_creek | 40750.918963991004 |

{{% /expand %}}
{{< /expand-wrapper >}}


## Statistical aggregate functions

- [corr](#corr)
- [covar](#covar)
- [covar_pop](#covar_pop)
- [covar_samp](#covar_samp)
- [stddev](#stddev)
- [stddev_pop](#stddev_pop)
- [stddev_samp](#stddev_samp)
- [var](#var)
- [var_pop](#var_pop)
- [var_samp](#var_samp)

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

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

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

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

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

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

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

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

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

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

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

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

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

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

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

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

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

{{< expand-wrapper >}}
{{% expand "View `var_pop` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

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

### var_samp

Returns the statistical sample variance of a set of numbers.

```sql
var_samp(expression)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `var_samp` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

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

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

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

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

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

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

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

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

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
