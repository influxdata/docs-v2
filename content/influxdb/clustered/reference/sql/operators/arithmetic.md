---
title: SQL arithmetic operators
list_title: Arithmetic operators
description: >
  Arithmetic operators take two numeric values (either literals or variables)
  and perform a calculation that returns a single numeric value.
menu:
  influxdb_clustered:
    name: Arithmetic operators
    parent: Operators
weight: 301
list_code_example: |
  | Operator | Description    | Example | Result |
  | :------: | :------------- | ------- | -----: |
  |   `+`    | Addition       | `2 + 2` |    `4` |
  |   `-`    | Subtraction    | `4 - 2` |    `2` |
  |   `*`    | Multiplication | `2 * 3` |    `6` |
  |   `/`    | Division       | `6 / 3` |    `2` |
  |   `%`    | Modulo         | `7 % 2` |    `1` |
---

Arithmetic operators take two numeric values (either literals or variables)
and perform a calculation that returns a single numeric value.

| Operator | Description    |                                        |
| :------: | :------------- | :------------------------------------- |
|   `+`    | Addition       | [{{< icon "link" >}}](#addition)       |
|   `-`    | Subtraction    | [{{< icon "link" >}}](#subtraction)    |
|   `*`    | Multiplication | [{{< icon "link" >}}](#multiplication) |
|   `/`    | Division       | [{{< icon "link" >}}](#division)       |
|   `%`    | Modulo         | [{{< icon "link" >}}](#modulo)         |

## + {#addition .monospace}

The `+` operator adds two operands together and returns the sum.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 1 + 2
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| int64(1) + int64(2) |
| ------------------: |
|                   3 |

{{% /flex-content %}}
{{< /flex >}}

## - {#subtraction .monospace}

The `-` operator subtracts the right operand from the left operand and returns
the difference.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 4 - 2
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| int64(4) - int64(2) |
| ------------------: |
|                   2 |

{{% /flex-content %}}
{{< /flex >}}

## * {#multiplication .monospace}

The `*` operator multiplies two operands together and returns the product.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 2 * 3
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| int64(2) * int64(3) |
| ------------------: |
|                   6 |

{{% /flex-content %}}
{{< /flex >}}

## / {#division .monospace}

The `/` operator divides the left operand by the right operand and returns the quotient.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 6 / 3
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| int64(6) / int64(3) |
| ------------------: |
|                   2 |

{{% /flex-content %}}
{{< /flex >}}

## % {#modulo .monospace}

The `%` (modulo) operator divides the left operand by the right operand and returns the
remainder. If the left operand is not divisible by the right operand, it returns
the left operand.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 8 % 3
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(8) % Int64(3) |
| ------------------: |
|                   2 |

{{% /flex-content %}}
{{< /flex >}}

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 3 % 8
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(3) % Int64(8) |
| ------------------: |
|                   3 |

{{% /flex-content %}}
{{< /flex >}}
