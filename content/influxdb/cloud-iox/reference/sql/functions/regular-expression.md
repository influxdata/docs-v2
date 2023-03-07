---
title: SQL regular expression functions
list_title: Regular expression functions
description: >
  Use regular expression functions to operate on data in SQL queries.
menu:
  influxdb_cloud_iox:
    name: Regular expression
    parent: sql-functions    
weight: 308
influxdb/cloud-iox/tags: [regular expressions, sql]
---

The InfluxDB SQL implementation uses the POSIX regular expression syntax and
supports the following regular expression functions:

<!-- - [regexp_match](#regexp_match) -->
- [regexp_replace](#regexp_replace)

<!--

## regexp_match

Returns a list of regular expression matches in a string.

```sql
regexp_match(str, regexp)
```

##### Arguments

- **str**: String column or literal string to operate on.
- **regexp**: Regular expression to match against.

-->

## regexp_replace

Replaces substrings in a string that match a regular expression.

```sql
regexp_replace(str, regexp, replacement, flags)
```

##### Arguments

- **str**: String column or literal string to operate on.
- **regexp**: Regular expression to match against.
- **replacement**: Replacement string.
- **flags**: Regular expression flags that control the behavior of the
  regular expression. The following flags are supported.
  - **g**: (global) Search globally and don't return after the first match.
  - **i**: (insensitive) Ignore case when matching.

{{< expand-wrapper >}}
{{% expand "View `regexp_replace` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-iox/get-started/write/#construct-line-protocol)._

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
