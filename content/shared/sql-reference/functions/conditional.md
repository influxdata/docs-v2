The {{< product-name >}} SQL implementation supports the following conditional
functions for conditionally handling _null_ values:

- [coalesce](#coalesce)
- greatest
- [ifnull](#ifnull)
- least
- [nullif](#nullif)
- [nvl](#nvl)
- [nvl2](#nvl2)

<!-- Will come with next DataFusion upgrade
- [greatest](#greatest)
- [least](#least)
-->

## coalesce

Returns the first of its arguments that is not _null_.
Returns _null_ if all arguments are _null_.
This function is often used to substitute a default value for _null_ values.

```sql
coalesce(expression1[, ..., expression_n])
```

##### Arguments

- **expression1, expression_n**:
  Expression to use if previous expressions are _null_.
  Can be a constant, column, or function, and any combination of arithmetic operators.
  Pass as many expression arguments as necessary.

{{< expand-wrapper >}}
{{% expand "View `coalesce` query example" %}}

```sql
SELECT
  val1,
  val2,
  val3,
  coalesce(val1, val2, val3, 'quz') AS coalesce
FROM
  (values ('foo', 'bar', 'baz'),
          (NULL, 'bar', 'baz'),
          (NULL, NULL, 'baz'),
          (NULL, NULL, NULL)
  ) data(val1, val2, val3)
```

| val1 | val2 | val3 | coalesce |
| :--: | :--: | :--: | :------: |
| foo  | bar  | baz  |   foo    |
|      | bar  | baz  |   bar    |
|      |      | baz  |   baz    |
|      |      |      |   quz    |

{{% /expand %}}
{{< /expand-wrapper >}}


## greatest

Returns the greatest value in a list of expressions.
Returns _null_ if all expressions are _null_.

```sql
greatest(expression1[, ..., expression_n])
```

##### Arguments

- **expression1, expression_n**: Expressions to compare and return the greatest value.
  Can be a constant, column, or function, and any combination of arithmetic operators.
  Pass as many expression arguments as necessary.

{{< expand-wrapper >}}
{{% expand "View `greatest` query example" %}}

_The following example uses the
[Random numbers sample dataset](/influxdb/version/reference/sample-data/#random-numbers-sample-data)._

```sql
SELECT time, greatest(a, b) AS greatest FROM numbers LIMIT 4
```

| time                |           greatest |
| :------------------ | -----------------: |
| 2023-01-01T01:20:00 | -0.515490223280789 |
| 2023-01-01T01:21:00 |  0.803201312042983 |
| 2023-01-01T01:22:00 |  0.970938142399892 |
| 2023-01-01T01:23:00 | 0.0493748366311344 |

{{% /expand %}}
{{< /expand-wrapper >}}

## ifnull

_Alias of [nvl](#nvl)._


## least

Returns the least value in a list of expressions.
Returns _null_ if all expressions are _null_.

```sql
least(expression1[, ..., expression_n])
```

##### Arguments

- **expression1, expression_n**: Expressions to compare and return the least value.
  Can be a constant, column, or function, and any combination of arithmetic operators.
  Pass as many expression arguments as necessary.

{{< expand-wrapper >}}
{{% expand "View `least` query example" %}}

_The following example uses the
[Random numbers sample dataset](/influxdb/version/reference/sample-data/#random-numbers-sample-data)._

```sql
SELECT time, least(a, b) AS least FROM numbers LIMIT 4
```

| time                |              least |
| :------------------ | -----------------: |
| 2023-01-01T00:10:00 |  -1.08759833527982 |
| 2023-01-01T00:11:00 | -0.187620086586211 |
| 2023-01-01T00:12:00 |  -0.81371037157091 |
| 2023-01-01T00:13:00 | -0.339781659874945 |

{{% /expand %}}
{{< /expand-wrapper >}}

## nullif

Returns _null_ if _expression1_ equals _expression2_; otherwise it returns _expression1_.
This can be used to perform the inverse operation of [`coalesce`](#coalesce).

```sql
nullif(expression1, expression2)
```

##### Arguments

- **expression1**: Expression to compare and return if equal to expression2.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **expression2**: Expression to compare to expression1.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `nullif` query example" %}}

```sql
SELECT
  value,
  nullif(value, 'baz') AS nullif
FROM
  (values ('foo'),
          ('bar'),
          ('baz')
  ) data(value)
```

| value | nullif |
| :---- | :----- |
| foo   | foo    |
| bar   | bar    |
| baz   |        |

{{% /expand %}}
{{< /expand-wrapper >}}

## nvl

Returns _expression2_ if _expression1_ is _null_; otherwise it returns _expression1_.

```sql
nvl(expression1, expression2)
```

##### Arguments

- **expression1**: Return this expression if not _null_.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **expression2**: Return this expression if _expression1_ is _null_.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `nvl` query example" %}}

```sql
SELECT
  value,
  nvl(value, 'baz') AS nvl
FROM
  (values ('foo'),
          ('bar'),
          (NULL)
  ) data(value)
```

| value | nvl |
| :---- | :-- |
| foo   | foo |
| bar   | bar |
|       | baz |

{{% /expand %}}
{{< /expand-wrapper >}}

## nvl2

Returns _expression2_ if _expression1_ is **not** _null_; otherwise it returns _expression3_.

```sql
nvl2(expression1, expression2, expression3)
```

##### Arguments

- **expression1**: First expression to test for _null_.
  Can be a constant, column, or function, and any combination of operators.
- **expression2**: Second expression to return if _expression1_ is not _null_.
  Can be a constant, column, or function, and any combination of operators.
- **expression3**: Expression to return if _expression1_ is _null_.
  Can be a constant, column, or function, and any combination of operators.

{{< expand-wrapper >}}
{{% expand "View `nvl2` query example" %}}

```sql
SELECT
  val1,
  val2,
  val3,
  nvl2(val1, val2, val3) AS nvl2
FROM
  (values ('foo', 'bar', 'baz'),
          (NULL, 'bar', 'baz'),
          (NULL, NULL, 'baz'),
  ) data(val1, val2, val3)
```

| val1 | val2 | val3 | nvl2 |
| :--: | :--: | :--: | :--: |
| foo  | bar  | baz  | bar  |
|      | bar  | baz  | baz  |
|      |      | baz  | baz  |

{{% /expand %}}
{{< /expand-wrapper >}}
