---
title: SQL bitwise operators
list_title: Bitwise operators
description: >
  Bitwise operators perform bitwise operations on bit patterns or binary numerals.
menu:
  influxdb_cloud_dedicated:
    name: Bitwise operators
    parent: Operators
weight: 304
list_code_example: |
  | Operator | Meaning             | Example  | Result |
  | :------: | :------------------ | :------- | -----: |
  |   `&`    | Bitwise and         | `5 & 3`  |    `1` |
  |   `\|`   | Bitwise or          | `5 \| 3` |    `7` |
  |   `^`    | Bitwise xor         | `5 ^ 3`  |    `6` |
  |   `>>`   | Bitwise shift right | `5 >> 3` |    `0` |
  |   `<<`   | Bitwise shift left  | `5 << 3` |   `40` |
---

Bitwise operators perform bitwise operations on bit patterns or binary numerals.

## & {#bitwise-and .monospace}

The `&` (bitwise AND) operator compares each bit of the left operand to the
corresponding bit of the right operand.
If both bits are 1, the corresponding result bit is set to 1.
Otherwise, the corresponding result bit is set to 0.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 5 & 3
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(5) & Int64(3) |
| ------------------: |
|                   1 |

{{% /flex-content %}}
{{< /flex >}}

## \| {#bitwise-or .monospace}

The `|` (bitwise OR or inclusive OR) operator compares each bit of the left
operand to the corresponding bit of the second operand.
If either bit is 1, the corresponding result bit is set to 1.
Otherwise, the corresponding result bit is set to 0.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 5 | 3
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(5) \| Int64(3) |
| -------------------: |
|                    7 |          

{{% /flex-content %}}
{{< /flex >}}

## ^ {#bitwise-xor .monospace}

The `^` (bitwise XOR or exclusive OR) operator compares each bit of the left
operand to the corresponding bit of the right operand.
If the bit in one of the operands is 0 and the bit in the other operand is 1,
the corresponding result bit is set to 1.
Otherwise, the corresponding result bit is set to 0.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 5 ^ 3
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(5) BIT_XOR Int64(3) |
| ------------------------: |
|                         6 |

{{% /flex-content %}}
{{< /flex >}}

## \>\> {#bitwise-shift-right .monospace}

The `>>` (bitwise shift right) operator shifts the bits in the left operand to
the right by the number of positions specified in the right operand.
For unsigned numbers, bit positions vacated by the shift operation are filled with 0.
For signed numbers, the sign bit is used to fill the vacated bit positions.
If the number is positive, the bit position is filled with 0.
If the number is negative, the bit position is filled with 1.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 5 >> 3
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(5) \>\> Int64(3) |
| ---------------------: |
|                      0 |

{{% /flex-content %}}
{{< /flex >}}

## \<\< {#bitwise-shift-left  .monospace}

The `<<` (bitwise shift left) operator shifts the bits in the left operand to
the left by the number of positions specified in the right operand.
Bit positions vacated by the shift operation are filled with 0.
Bits that shift off the end are discarded, including the sign bit.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 5 << 3
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(5) \<\< Int64(3) |
| ---------------------: |
|                     40 |

{{% /flex-content %}}
{{< /flex >}}
