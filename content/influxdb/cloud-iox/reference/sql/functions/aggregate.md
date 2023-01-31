---
title: SQL aggregate functions
list_title: Aggregate functions
description: >
  Aggregate data with SQL aggregate functions.
menu:
  influxdb_cloud_iox:
    name: Aggregate
    parent: sql-functions
weight: 301
---

SQL aggregate functions aggregate values in a specified column for each
group or SQL partition and return a single row per group containing the
aggregate value.

- [General aggregate functions](#general-aggregate-functions)
  - [avg](#avg)
  - [count](#count)
  - [max](#max)
  - [min](#min)
  - [sum](#sum)
- [Statistical aggregate functions](#statistical-aggregate-functions)
- [Approximate aggregate functions](#approximate-aggregate-functions)

---

## General aggregate functions

- [avg](#avg)
- [count](#count)
- [max](#max)
- [min](#min)
- [sum](#sum)

### avg

Returns the average of numeric values in the specified column.

```sql
avg(expression)
```

##### Arguments:

- **expression**: Column to operate on.

##### Aliases:

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

##### Arguments:

- **expression**: Column to operate on.

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

_To return both the maximum value and its associated timestamp, use
[`selector_max`](/influxdb/cloud-iox/reference/sql/functions/selector/#selector_max)._

##### Arguments:

- **expression**: Column to operate on.

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

### min

Returns the minimum value in the specified column.

_To return both the minimum value and its associated timestamp, use
[`selector_max`](/influxdb/cloud-iox/reference/sql/functions/selector/#selector_min)._

##### Arguments:

- **expression**: Column to operate on.

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

##### Arguments:

- **expression**: Column to operate on.

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

##### Arguments:

- **expression1**: First column or literal value to operate on.
- **expression2**: Second column or literal value to operate on.

### covar

Returns the covariance of a set of number pairs.

```sql
covar(expression1, expression2)
```

### covar_pop

Returns the population covariance of a set of number pairs.

```sql
covar_pop(expression1, expression2)
```

### covar_samp

Returns the sample covariance of a set of number pairs.

```sql
covar_pop(expression1, expression2)
```

### stddev
### stddev_pop
### stddev_samp
### var
### var_pop
### var_samp


## Approximate aggregate functions

approx_distinct

approx_median

approx_percentile_cont

approx_percentile_cont_with_weight
