
Use InfluxQL mathematical operators to perform mathematical operations in queries.
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
- [Common Issues with Mathematical Operators](#common-issues-with-mathematical-operators)

## Addition

Perform addition with a constant.

```sql
SELECT "A" + 5 FROM "add"
```
```sql
SELECT * FROM "add" WHERE "A" + 5 > 10
```

Perform addition on two fields.

```sql
SELECT "A" + "B" FROM "add"
```
```sql
SELECT * FROM "add" WHERE "A" + "B" >= 10
```

## Subtraction

Perform subtraction with a constant.

```sql
SELECT 1 - "A" FROM "sub"
```
```sql
SELECT * FROM "sub" WHERE 1 - "A" <= 3
```

Perform subtraction with two fields.

```sql
SELECT "A" - "B" FROM "sub"
```
```sql
SELECT * FROM "sub" WHERE "A" - "B" <= 1
```

## Multiplication

Perform multiplication with a constant.

```sql
SELECT 10 * "A" FROM "mult"
```
```sql
SELECT * FROM "mult" WHERE "A" * 10 >= 20
```

Perform multiplication with two fields.

```sql
SELECT "A" * "B" * "C" FROM "mult"
```
```sql
SELECT * FROM "mult" WHERE "A" * "B" <= 80
```

Multiplication distributes across other operators.

```sql
SELECT 10 * ("A" + "B" + "C") FROM "mult"
```

```sql
SELECT 10 * ("A" - "B" - "C") FROM "mult"
```

```sql
SELECT 10 * ("A" + "B" - "C") FROM "mult"
```

## Division
Perform division with a constant.

```sql
SELECT 10 / "A" FROM "div"
```
```sql
SELECT * FROM "div" WHERE "A" / 10 <= 2
```

Perform division with two fields.

```sql
SELECT "A" / "B" FROM "div"
```
```sql
SELECT * FROM "div" WHERE "A" / "B" >= 10
```

Division distributes across other operators.

```sql
SELECT 10 / ("A" + "B" + "C") FROM "mult"
```

## Modulo

Perform modulo arithmetic with a constant.

```sql
SELECT "B" % 2 FROM "modulo"
```

```sql
SELECT "B" FROM "modulo" WHERE "B" % 2 = 0
```

Perform modulo arithmetic on two fields.

```sql
SELECT "A" % "B" FROM "modulo"
```

```sql
SELECT "A" FROM "modulo" WHERE "A" % "B" = 0
```

## Bitwise AND

You can use this operator with any integers or Booleans, whether they are fields or constants.
It does not work with float or string datatypes, and you cannot mix integers and Booleans.

```sql
SELECT "A" & 255 FROM "bitfields"
```

```sql
SELECT "A" & "B" FROM "bitfields"
```

```sql
SELECT * FROM "data" WHERE "bitfield" & 15 > 0
```

```sql
SELECT "A" & "B" FROM "booleans"
```

```sql
SELECT ("A" ^ true) & "B" FROM "booleans"
```

## Bitwise OR

You can use this operator with any integers or Booleans, whether they are fields or constants.
It does not work with float or string datatypes, and you cannot mix integers and Booleans.

```sql
SELECT "A" | 5 FROM "bitfields"
```

```sql
SELECT "A" | "B" FROM "bitfields"
```

```sql
SELECT * FROM "data" WHERE "bitfield" | 12 = 12
```

## Bitwise Exclusive-OR

You can use this operator with any integers or Booleans, whether they are fields or constants.
It does not work with float or string datatypes, and you cannot mix integers and Booleans.

```sql
SELECT "A" ^ 255 FROM "bitfields"
```

```sql
SELECT "A" ^ "B" FROM "bitfields"
```

```sql
SELECT * FROM "data" WHERE "bitfield" ^ 6 > 0
```

## Unsupported Operators

### Inequalities

Using any of `=`,`!=`,`<`,`>`,`<=`,`>=`,`<>` in the `SELECT` statement yields empty results for all types.
Comparison operators can only be used in the `WHERE` clause.

### Logical Operators

Using any of `!|`,`NAND`,`XOR`,`NOR` yield a parser error.

Additionally using `AND`, `OR` in the `SELECT` clause of a query will not behave
as mathematical operators and simply yield empty results, as they are tokens in InfluxQL.
However, you can apply the bitwise operators `&`, `|` and `^` to boolean data.

### Bitwise Not

There is no bitwise-not operator, because the results you expect depend on the width of your bitfield.
InfluxQL does not know how wide your bitfield is, so cannot implement a suitable bitwise-not operator.

For example, if your bitfield is 8 bits wide, then to you the integer 1 represents the bits `0000 0001`.
The bitwise-not of this should return the bits `1111 1110`, i.e. the integer 254.

However, if your bitfield is 16 bits wide, then the integer 1 represents the bits `0000 0000 0000 0001`.
The bitwise-not of this should return the bits `1111 1111 1111 1110`, i.e. the integer 65534.

#### Solution

You can implement a bitwise-not operation by using the `^` (bitwise xor) operator
together with the number representing all-ones for your word-width:

For 8-bit data:

```sql
SELECT "A" ^ 255 FROM "data"
```

For 16-bit data:

```sql
SELECT "A" ^ 65535 FROM "data"
```

For 32-bit data:

```sql
SELECT "A" ^ 4294967295 FROM "data"
```

In each case the constant you need can be calculated as `(2 ** width) - 1`.

## Common Issues with Mathematical Operators

- [Mathematical operators with wildcards and regular expressions](#mathematical-operators-with-wildcards-and-regular-expressions)
- [Mathematical operators with functions](#mathematical-operators-with-functions)

### Mathematical operators with wildcards and regular expressions

InfluxDB does not support combining mathematical operations with a wildcard (`*`) or [regular expression](/influxdb/version/query-data/influxql/explore-data/regular-expressions/) in the `SELECT` clause.
The following queries are invalid and the system returns an error:

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

The use of mathematical operators inside of function calls is currently unsupported.
Note that InfluxDB only allows functions in the `SELECT` clause.

For example, the following will work:

```sql
SELECT 10 * mean("value") FROM "cpu"
```

However, the following query will return a parse error:

```sql
SELECT mean(10 * "value") FROM "cpu"
-- Error: expected field argument in mean()
```

{{% note %}}
InfluxQL supports [subqueries](/influxdb/version/query-data/influxql/explore-data/subqueries/) which offer similar functionality to using mathematical operators inside a function call.
{{% /note %}}
