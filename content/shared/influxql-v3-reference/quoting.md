InfluxQL supports both single and double quotation marks, but they each function
differently and serve different purposes.

- [Single quotes](#single-quotes)
- [Double quotes](#double-quotes)

## Single quotes

Use single quotation marks (`'`) in the
[string literal](/influxdb/version/reference/influxql/#strings) and
[timestamp literal](/influxdb/version/reference/influxql/#dates--times) syntax.

In the following example, the `WHERE` clause evaluates the value of the `room` tag.
Tags only contain string values, so the right operand of the predicate expression
should be a string literal.

```sql
... WHERE room = 'Kitchen'
```

## Double quotes

Use double quotation marks (`"`) to quote [identifiers](/influxdb/version/reference/influxql/#identifiers).
Identifiers **must** be double-quoted in the following cases:

- The identifier contains non-word characters.
  Word characters are defined as `[a-z,A-Z,0-9,_]`.
- The identifier is case-sensitive.
- The identifier contains [InfluxQL keywords](/influxdb/version/reference/influxql/#keywords).
- The identifier begins with a digit.

Double-quoted identifiers can also:

- Contain any Unicode character except for a new line.
- Contain escaped `"` characters (for example: `\"`).
- Include [InfluxQL keywords](/influxdb/version/reference/influxql/#keywords).

**While not always necessary, we recommend that you double quote identifiers.**

> [!Important]
> InfluxQL quoting guidelines differ from
> [line protocol quoting guidelines](/influxdb/version/reference/syntax/line-protocol/#quotes).
