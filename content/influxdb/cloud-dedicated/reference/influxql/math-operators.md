---
title: InfluxQL math operators
descriptions: >
  Use InfluxQL mathematical operators to perform mathematical operations in
  InfluxQL queries.
menu:
  influxdb_cloud_dedicated:
    name: Math operators
    parent: influxql-reference
    identifier: influxql-mathematical-operators
weight: 215
---

Use InfluxQL mathematical operators to perform mathematical operations in InfluxQL queries.
Mathematical operators follow the [standard order of operations](https://golang.org/ref/spec#Operator_precedence).
Parentheses take precedence to division and multiplication, which takes precedence to addition and subtraction.
For example `5 / 2 + 3 * 2 =  (5 / 2) + (3 * 2)` and `5 + 2 * 3 - 2 = 5 + (2 * 3) - 2`.

- [Addition](#addition)
- [Subtraction](#subtraction)
- [Multiplication](#multiplication)
- [Division](#division)
- [Modulo](#modulo)
- [Bitwise AND](#bitwise-and)
- [Bitwise OR](#bitwise-or)
- [Bitwise Exclusive-OR](#bitwise-exclusive-or)
- [Unsupported Operators](#unsupported-operators)
- [Notable behaviors of mathematical operators](#notable-behaviors-of-mathematical-operators)

## Addition

Add two numeric operands. Operands may be an identifier, constant, or literal
numeric value.

```sql
SELECT A + 5 FROM example

SELECT A + B FROM example

SELECT * FROM example WHERE A + 5 > 10

SELECT * FROM example WHERE A + B > 10
```

## Subtraction

Subtract one numeric operand from another. Operands may be an identifier,
constant, or literal numeric value.

```sql
SELECT 1 - A FROM example

SELECT B - A FROM example

SELECT * FROM example WHERE 1 - A <= 3

SELECT * FROM example WHERE B - A <= 3
```

## Multiplication

Multiply two numeric operands. Operands may be an identifier, constant, or literal
numeric value.

```sql
SELECT A * 10 FROM example

SELECT A * B FROM example

SELECT * FROM example WHERE A * 10 >= 20

SELECT * FROM example WHERE A * B >= 20
```

Multiplication distributes across other operators.

```sql
SELECT 10 * (A + B + C) FROM example

SELECT 10 * (A - B - C) FROM example

SELECT 10 * (A + B - C) FROM example
```

## Division

Divide one numeric operand by another. Operands may be an identifier, constant,
or literal numeric value.

```sql
SELECT A / 10 FROM example

SELECT A / B FROM example

SELECT * FROM example WHERE A / 10 <= 2

SELECT * FROM example WHERE A / B <= 2
```

Division distributes across other operators.

```sql
SELECT 10 / (A + B + C) FROM example

SELECT 10 / (A - B - C) FROM example

SELECT 10 / (A + B - C) FROM example
```

## Modulo

Perform a modulo operation with two numeric operands. Operands may be an
identifier, constant, or literal numeric value.

```sql
SELECT A % 2 FROM example

SELECT A % B FROM example

SELECT A FROM example WHERE A % 2 = 0

SELECT A, B FROM example WHERE A % B = 0
```

## Bitwise AND

Perform a bitwise `AND` operation on two operands _of the same type_.
Supported types are **integers** and **booleans**.
Operands may be an identifier, constant, literal integer value, or literal boolean value.

```sql
SELECT A & 255 FROM example

SELECT A & B FROM example

SELECT (A ^ true) & B FROM example

SELECT * FROM example WHERE A & 15 > 0
```

## Bitwise OR

Perform a bitwise `OR` operation on two operands _of the same type_.
Supported types are **integers** and **booleans**.
Operands may be an identifier, constant, literal integer value, or literal boolean value.

```sql
SELECT A | 5 FROM example

SELECT A | B FROM example

SELECT * FROM example WHERE "bitfield" | 12 = 12
```

## Bitwise Exclusive-OR

Perform a bitwise `Exclusive-OR` operation on two operands _of the same type_.
Supported types are **integers** and **booleans**.
Operands may be an identifier, constant, literal integer value, or literal boolean value.

```sql
SELECT A ^ 255 FROM example

SELECT A ^ B FROM example

SELECT * FROM example WHERE "bitfield" ^ 6 > 0
```

## Unsupported Operators

### Inequalities

Using any of `=`,`!=`,`<`,`>`,`<=`,`>=`,`<>` in the `SELECT` statement yields
empty results for all types.
Comparison operators can only be used in the `WHERE` clause.

### Logical Operators

Using any of `!|`,`NAND`,`XOR`,`NOR` yield a parser error.

Additionally using `AND`, `OR` in the `SELECT` clause of a query will not behave
as mathematical operators and simply yield empty results, as they are InfluxQL tokens.
However, you can apply the bitwise operators `&`, `|` and `^` to boolean values.

### Bitwise Not

There is no bitwise-not operator, because the results you expect depend on the width of your bitfield.
InfluxQL does not know how wide your bitfield is, so cannot implement a suitable
bitwise-not operator.

For example, if your bitfield is 8 bits wide, then the integer 1 represents the bits `0000 0001`.
The bitwise-not of this should return the bits `1111 1110` (that is,  the integer 254)
However, if your bitfield is 16 bits wide, then the integer 1 represents the bits `0000 0000 0000 0001`.
The bitwise-not of this should return the bits `1111 1111 1111 1110` (that is,  the integer 65534)

#### Solution

You can implement a bitwise-not operation by using the `^` (bitwise xor) operator
together with the number representing all-ones for your word-width:

For 8-bit data:

```sql
SELECT A ^ 255 FROM example
```

For 16-bit data:

```sql
SELECT A ^ 65535 FROM example
```

For 32-bit data:

```sql
SELECT A ^ 4294967295 FROM example
```

In each case, the constant you need can be calculated as `(2 ** width) - 1`.

## Notable behaviors of mathematical operators

- [Mathematical operators with wildcards and regular expressions](#mathematical-operators-with-wildcards-and-regular-expressions)
- [Mathematical operators with functions](#mathematical-operators-with-functions)

### Mathematical operators with wildcards and regular expressions

InfluxQL does not support combining mathematical operations with a wildcard (`*`)
or [regular expression](/influxdb/cloud-dedicated/query-data/influxql/regular-expressions/)
in the `SELECT` clause.
The following queries are invalid and the output is an error:

Perform a mathematical operation on a wildcard.

```sql
SELECT * + 2 FROM "nope"
-- ERR: unsupported expression with wildcard: * + 2
```

Perform a mathematical operation on a wildcard within a function.

```sql
SELECT COUNT(*) / 2 FROM "nope"
-- ERR: unsupported expression with wildcard: count(*) / 2
```

Perform a mathematical operation on a regular expression.

```sql
SELECT /A/ + 2 FROM "nope"
-- ERR: error parsing query: found +, expected FROM at line 1, char 12
```

Perform a mathematical operation on a regular expression within a function.

```sql
SELECT COUNT(/A/) + 2 FROM "nope"
-- ERR: unsupported expression with regex field: count(/A/) + 2
```

### Mathematical operators with functions

InfluxQL does not support mathematical operators inside of function calls.
Note that InfluxQL only allows functions in the `SELECT` clause.

For example, the following will work:

```sql
SELECT 10 * mean("value") FROM "cpu"
```

However, the following query will return a parse error:

```sql
SELECT mean(10 * "value") FROM "cpu"
-- Error: expected field argument in mean()
```

<!-- {{% note %}}
InfluxQL supports [subqueries](/influxdb/v2/query-data/influxql/explore-data/subqueries/) which offer similar functionality to using mathematical operators inside a function call.
{{% /note %}} -->
