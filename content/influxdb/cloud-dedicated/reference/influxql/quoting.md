---
title: Quotation
description: >
  Single quotation marks (`'`) are used in the string literal syntax.
  Double quotation marks (`"`) are used to quote identifiers.
menu:
  influxdb_cloud_dedicated:
    name: Quotation
    identifier: influxql-quotation
    parent: influxql-reference
weight: 214
list_code_example: |
  ```sql
  -- String literal
  'I am a string'

  -- Quoted identifier
  "this-is-an-identifier"
  ```
---

InfluxQL supports both single and double quotation marks, but they each function
differently and serve different purposes.

- [Single quotes](#single-quotes)
- [Double quotes](#double-quotes)

## Single quotes

Use single quotation marks (`'`) in the
[string literal](/influxdb/cloud-dedicated/reference/influxql/#strings) and
[timestamp literal](/influxdb/cloud-dedicated/reference/influxql/#dates--times) syntax.

In the following example, the `WHERE` clause evaluates the value of the `room` tag.
Tags only contain string values, so the right operand of the predicate expression
should be a string literal.

```sql
... WHERE room = 'Kitchen'
```

## Double quotes

Use double quotation marks (`"`) to quote [identifiers](/influxdb/cloud-dedicated/reference/influxql/#identifiers).
Identifiers **must** be double-quoted in the following cases:

- The identifier contains non-word characters.
  Word characters are defined as `[a-z,A-Z,0-9,_]`.
- The identifier contains [InfluxQL keywords](/influxdb/cloud-dedicated/reference/influxql/#keywords).
- The identifier begins with a digit.

Double-quoted identifiers can also:

- Contain any Unicode character except for a new line.
- Contain escaped `"` characters (for example: `\"`).
- Include [InfluxQL keywords](/influxdb/cloud-dedicated/reference/influxql/#keywords).

**While not always necessary, we recommend that you double quote identifiers.**

{{% note %}}
InfluxQL quoting guidelines differ from
[line protocol quoting guidelines](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#quotes).
{{% /note %}}