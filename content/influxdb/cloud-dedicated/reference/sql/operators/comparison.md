---
title: SQL comparison operators
list_title: Comparison operators
description: >
  Comparison operators evaluate the relationship between the left and right
  operands and returns `true` or `false`.
menu:
  influxdb_cloud_dedicated:
    name: Comparison operators
    parent: Operators
weight: 302
list_code_example: |
  | Operator | Meaning                                                  | Example           |
  | :------: | :------------------------------------------------------- | :---------------- |
  |   `=`    | Equal to                                                 | `123 = 123`       |
  |   `<>`   | Not equal to                                             | `123 <> 456`      |
  |   `!=`   | Not equal to                                             | `123 != 456`      |
  |   `>`    | Greater than                                             | `3 > 2`           |
  |   `>=`   | Greater than or equal to                                 | `3 >= 2`          |
  |   `<`    | Less than                                                | `1 < 2`           |
  |   `<=`   | Less than or equal to                                    | `1 <= 2`          |
  |   `~`    | Matches a regular expression                             | `'abc' ~ 'a.*'`   |
  |   `~*`   | Matches a regular expression _(case-insensitive)_        | `'Abc' ~* 'A.*'`  |
  |   `!~`   | Does not match a regular expression                      | `'abc' !~ 'd.*'`  |
  |  `!~*`   | Does not match a regular expression _(case-insensitive)_ | `'Abc' !~* 'a.*'` |
---

Comparison operators evaluate the relationship between the left and right
operands and returns `true` or `false`.

## = {#equal-to .monospace}

The `=` operator compares the left and right operands and, if equal, returns `true`.
Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 123 = 123
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(123) = Int64(123) |
| :---------------------- |
| true                    |

{{% /flex-content %}}
{{< /flex >}}

## !=, <> {#not-equal-to .monospace}

The `!=` and `<>` operators compare the left and right operands and, if not equal,
returns `true`. Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 123 != 456
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(123) != Int64(456) |
| :----------------------- |
| true                     |

{{% /flex-content %}}
{{< /flex >}}

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 123 <> 456
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(123) != Int64(456) |
| :----------------------- |
| true                     |

{{% /flex-content %}}
{{< /flex >}}

## > {#greater-than .monospace}

The `>` operator compares the left and right operands and, if the left operand
is greater than the right operand, returns `true`.
Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 3 > 2
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(3) > Int64(2) |
| :------------------ |
| true                |

{{% /flex-content %}}
{{< /flex >}}

## >= {#greater-than-or-equal .monospace}

The `>=` operator compares the left and right operands and, if the left operand
is greater than or equal to the right operand, returns `true`.
Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 3 >= 2
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(3) >= Int64(2) |
| :------------------- |
| true                 |

{{% /flex-content %}}
{{< /flex >}}

## < {#less-than .monospace}

The `<` operator compares the left and right operands and, if the left operand
is less than the right operand, returns `true`.
Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 1 < 2
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int641(1) < Int64(2) |
| :------------------- |
| true                 |

{{% /flex-content %}}
{{< /flex >}}

## <= {#less-than-or-equal .monospace}

The `<=` operator compares the left and right operands and, if the left operand
is less than or equal to the right operand, returns `true`.
Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 1 <= 2
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int641(1) <= Int64(2) |
| :-------------------- |
| true                  |

{{% /flex-content %}}
{{< /flex >}}

## ~ {#regexp-match .monospace}

The `~` operator compares the left string operand to the right regular expression
operand and, if it matches (case-sensitive), returns `true`.
Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 'abc' ~ 'a.*'
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Utf8("abc") ~ Utf8("a.*") |
| :------------------------ |
| true                      |

{{% /flex-content %}}
{{< /flex >}}

## ~* {#regexp-match-case-insensitive .monospace}

The `~*` operator compares the left string operand to the right regular expression
operand and, if it matches (case-insensitive), returns `true`.
Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 'Abc' ~* 'A.*'
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Utf8("Abc") ~* Utf8("A.*") |
| :------------------------- |
| true                       |

{{% /flex-content %}}
{{< /flex >}}

## !~ {#regexp-nomatch .monospace}

The `!~` operator compares the left string operand to the right regular expression
operand and, if it does not match (case-sensitive), returns `true`.
Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 'abc' !~ 'd.*'
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Utf8("abc") !~ Utf8("d.*") |
| :------------------------- |
| true                       |

{{% /flex-content %}}
{{< /flex >}}

## !~* {#regexp-nomatch-case-insensitive .monospace}

The `!~*` operator compares the left string operand to the right regular expression
operand and, if it does not match (case-insensitive), returns `true`.
Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 'Abc' !~* 'a.*'
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Utf8("Abc") !~* Utf8("a.*") |
| :-------------------------- |
| false                       |

{{% /flex-content %}}
{{< /flex >}}
