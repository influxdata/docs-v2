---
title: SQL regular expression functions
list_title: Regular expression functions
description: >
  Use regular expression functions to operate on data in SQL queries.
menu:
  influxdb_cloud_dedicated:
    name: Regular expression
    parent: sql-functions    
weight: 308
influxdb/cloud-dedicated/tags: [regular expressions, sql]
---

The InfluxDB SQL implementation uses the
[PCRE-like](https://en.wikibooks.org/wiki/Regular_Expressions/Perl-Compatible_Regular_Expressions)
regular expression [syntax](https://docs.rs/regex/latest/regex/#syntax)
(excluding some features such as look-around and back-references) and supports
the following regular expression functions:

- [regexp_like](#regexp_like)
- [regexp_match](#regexp_match)
- [regexp_replace](#regexp_replace)

## regexp_like

True if a regular expression has at least one match in a string;
false otherwise.

```sql
regexp_like(str, regexp[, flags])
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.
- **regexp**: Regular expression to test against the string expression.
  Can be a constant, column, or function.
- **flags**: Optional regular expression flags that control the behavior of the
  regular expression. The following flags are supported:
  - **i**: (insensitive) Ignore case when matching.
  - **m**: (multi-line) `^` and `$` match the beginning and end of a line, respectively.
  - **s**: (single-line) `.` matches newline (`\n`).
  - **R**: (CRLF) When multi-line mode is enabled, `\r\n` is used to delimit lines.
  - **U**: (ungreedy) Swap the meaning of `x*` and `x*?`.

{{< expand-wrapper >}}
{{% expand "View `regexp_replace` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  regexp_like(room::STRING, 'R', 'i') AS regexp_like
FROM home
```

| room        | regexp_like |
| :---------- | :---------- |
| Kitchen     | false       |
| Living Room | true        |

{{% /expand %}}
{{< /expand-wrapper >}}

## regexp_match

Returns a list of regular expression matches in a string.

```sql
regexp_match(str, regexp, flags)
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.
- **regexp**: Regular expression to match against.
  Can be a constant, column, or function.
- **flags**: Regular expression flags that control the behavior of the
  regular expression. The following flags are supported.
  - **i**: (insensitive) Ignore case when matching.

{{< expand-wrapper >}}
{{% expand "View `regexp_replace` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

{{% note %}}
`regexp_match` returns a _list_ Arrow type, which is not supported by InfluxDB.
Use _bracket notation_ to reference a value in the list.
Lists use 1-based indexing.
{{% /note %}}

```sql
SELECT DISTINCT
  room,
  regexp_match(room::STRING, '.{3}')[1] AS regexp_match
FROM home
```

| room        | regexp_match |
| :---------- | :----------- |
| Kitchen     | Kit          |
| Living Room | Liv          |

{{% /expand %}}
{{< /expand-wrapper >}}

## regexp_replace

Replaces substrings in a string that match a regular expression.

```sql
regexp_replace(str, regexp, replacement, flags)
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.
- **regexp**: Regular expression to match against.
  Can be a constant, column, or function.
- **replacement**: Replacement string expression.
  Can be a constant, column, or function, and any combination of string operators.
- **flags**: Regular expression flags that control the behavior of the
  regular expression. The following flags are supported.
  - **g**: (global) Search globally and don't return after the first match.
  - **i**: (insensitive) Ignore case when matching.

{{< expand-wrapper >}}
{{% expand "View `regexp_replace` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  regexp_replace(room::STRING, '\sRoom', '', 'gi') AS regexp_replace
FROM home
```

| room        | regexp_replace |
| :---------- | :------------- |
| Kitchen     | Kitchen        |
| Living Room | Living         |

{{% /expand %}}
{{< /expand-wrapper >}}
