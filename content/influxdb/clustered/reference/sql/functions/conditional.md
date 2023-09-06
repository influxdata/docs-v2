---
title: SQL conditional functions
list_title: Conditional functions
description: >
  Use conditional functions to conditionally handle null values in SQL queries.
menu:
  influxdb_clustered:
    name: Conditional
    parent: sql-functions    
weight: 306
---

The InfluxDB SQL implementation supports the following conditional functions for
conditionally handling _null_ values:

- [coalesce](#coalesce)
- [nullif](#nullif)

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
