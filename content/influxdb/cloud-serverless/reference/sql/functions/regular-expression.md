---
title: SQL regular expression functions
list_title: Regular expression functions
description: >
  Use regular expression functions to operate on data in SQL queries.
menu:
  influxdb_cloud_serverless:
    name: Regular expression
    parent: sql-functions    
weight: 308
influxdb/cloud-serverless/tags: [regular expressions, sql]
---

The InfluxDB SQL implementation uses the POSIX regular expression syntax and
supports the following regular expression functions:

- [regexp_match](#regexp_match)
- [regexp_replace](#regexp_replace)

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
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

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
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

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
