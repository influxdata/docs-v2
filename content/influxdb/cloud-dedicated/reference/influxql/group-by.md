---
title: GROUP BY clause
description: >
  Use the `GROUP BY` clause to group data by one or more specified
  [tags](/influxdb/cloud-dedicated/reference/glossary/#tag) or into specified time intervals.
menu:
  influxdb_cloud_dedicated:
    name: GROUP BY clause
    identifier: influxql-group-by
    parent: influxql-reference
weight: 203
list_code_example: |
  ```sql
  SELECT_clause FROM_clause [WHERE_clause] GROUP BY group_expression[, ..., group_expression_n]
  ```
---

Use the `GROUP BY` clause to group data by one or more specified
[tags](/influxdb/cloud-dedicated/reference/glossary/#tag) or into specified time intervals.
`GROUP BY` requires an [aggregate](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates/)
or [selector](/influxdb/cloud-dedicated/reference/influxql/functions/selectors/)
function in the `SELECT` statement.

- [Syntax](#syntax)
  - [GROUP BY tags examples](#group-by-tags-examples)
- [GROUP BY time](#group-by-time)
  - [GROUP by time and fill gaps](#group-by-time-and-fill-gaps)
  - [GROUP BY time examples](#group-by-time-examples)
- [Notable behaviors of the GROUP BY clause](#notable-behaviors-of-the-group-by-clause)
  - [Cannot group by fields](#cannot-group-by-fields)
  - [Tag order does not matter](#tag-order-does-not-matter)
  - [Grouping by tag and no time range return unexpected timestamps](#grouping-by-tag-and-no-time-range-return-unexpected-timestamps)
  - [Data grouped by time may return unexpected timestamps](#data-grouped-by-time-may-return-unexpected-timestamps)
  - [Fill with no data in the queried time range](#fill-with-no-data-in-the-queried-time-range)
  - [Fill with previous if no previous value exists](#fill-with-previous-if-no-previous-value-exists)
  - [Fill with linear interpolation if there are not two values to interpolate between](#fill-with-linear-interpolation-if-there-are-not-two-values-to-interpolate-between)

## Syntax

```sql
SELECT_clause FROM_clause [WHERE_clause] GROUP BY group_expression[, ..., group_expression_n]
```

- **group_expression**: Expression to identify tags or time intervals to group by.
  Can be a [tag key](/influxdb/cloud-dedicated/reference/glossary/#tag-key),
  constant, [regular expression](/influxdb/cloud-dedicated/reference/influxql/regular-expressions/),
  wildcard (`*`), or [function](/influxdb/cloud-dedicated/reference/influxql/functions/).

#### GROUP BY clause behaviors

- `GROUP BY tag_key` - Groups data by a specific tag
- `GROUP BY tag_key1, tag_key2` - Groups data by more than one tag
- `GROUP BY *` - Groups data by all [tags](/influxdb/v2.7/reference/glossary/#tag)
- `GROUP BY /regex/` - Groups data by tag keys that match the regular expression
- `GROUP BY time()` - Groups data into time intervals (windows)

{{% note %}}
If a query includes `WHERE` and `GROUP BY`, the `GROUP BY` clause must appear after
the `WHERE` clause.
{{% /note %}}

### GROUP BY tags examples

{{< expand-wrapper >}}

{{% expand "Group data by a single tag" %}}

```sql
SELECT MEAN(*) FROM bitcoin GROUP BY code
```

{{% influxql/table-meta %}}
name: bitcoin  
tags: code=EUR
{{% /influxql/table-meta %}}

| time                 |         mean_price |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z | 27328.848667840004 |

{{% influxql/table-meta %}}
name: bitcoin  
tags: code=GBP
{{% /influxql/table-meta %}}

| time                 |         mean_price |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z | 23441.832453919982 |

{{% influxql/table-meta %}}
name: bitcoin 
tags: code=USD
{{% /influxql/table-meta %}}

| time                 |         mean_price |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z | 28054.160950480004 |

{{% /expand %}}

{{% expand "Group data by more than one tag" %}}

```sql
SELECT MEAN(*) FROM bitcoin GROUP BY code, description
```

{{% influxql/table-meta %}}
name: bitcoin  
tags: code=EUR, description=Euro
{{% /influxql/table-meta %}}

| time                 |         mean_price |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z | 27328.848667840004 |

{{% influxql/table-meta %}}
name: bitcoin 
tags: code=GBP, description=British Pound Sterling
{{% /influxql/table-meta %}}

| time                 |         mean_price |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z | 23441.832453919982 |

{{% influxql/table-meta %}}
name: bitcoin  
tags: code=USD, description=United States Dollar
{{% /influxql/table-meta %}}

| time                 |         mean_price |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z | 28054.160950480004 |

{{% /expand %}}

{{% expand "Group data by all tags" %}}

```sql
SELECT MEAN(*) FROM bitcoin GROUP BY *
```

{{% influxql/table-meta %}}
name: bitcoin  
tags: code=EUR, crypto=bitcoin, description=Euro, symbol=&euro;
{{% /influxql/table-meta %}}

| time                 |         mean_price |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z | 27328.848667840004 |

{{% influxql/table-meta %}}
name: bitcoin  
tags: code=GBP, crypto=bitcoin, description=British Pound Sterling, symbol=&pound;
{{% /influxql/table-meta %}}

| time                 |         mean_price |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z | 23441.832453919982 |

{{% influxql/table-meta %}}
name: bitcoin  
tags: code=USD, crypto=bitcoin, description=United States Dollar, symbol=&#36;
{{% /influxql/table-meta %}}

| time                 |         mean_price |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z | 28054.160950480004 |

{{% /expand %}}

{{% expand "Group data by tag keys that match a regular expression" %}}

```sql
SELECT MEAN(*) FROM bitcoin GROUP BY /^[cd]/
```

{{% influxql/table-meta %}}
name: bitcoin  
tags: code=EUR, crypto=bitcoin, description=Euro
{{% /influxql/table-meta %}}

| time                 |         mean_price |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z | 27328.848667840004 |

{{% influxql/table-meta %}}
name: bitcoin  
tags: code=GBP, crypto=bitcoin, description=British Pound Sterling
{{% /influxql/table-meta %}}

| time                 |         mean_price |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z | 23441.832453919982 |

{{% influxql/table-meta %}}
name: bitcoin  
tags: code=USD, crypto=bitcoin, description=United States Dollar
{{% /influxql/table-meta %}}

| time                 |         mean_price |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z | 28054.160950480004 |

{{% /expand %}}

{{< /expand-wrapper >}}

## GROUP BY time

`GROUP BY time()` groups data by into specified time intervals, also known as "windows",
and applies the [aggregate](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates/)
and [selector](/influxdb/cloud-dedicated/reference/influxql/functions/selectors/)
functions in the `SELECT` clause to each interval.
Use the [`time()` function](/influxdb/cloud-dedicated/reference/influxql/functions/date-time/#time)
to specify the time interval to group by.

```sql
SELECT_clause FROM_clause WHERE <time_range> GROUP BY time(time_interval[, offset])[, group_expression (...)] [fill(behavior)]
```

`GROUP BY time()` intervals use preset round-number time boundaries that
are independent of time conditions in the [`WHERE` clause](/influxdb/cloud-dedicated/reference/influxql/where/).
**Output data uses window start boundaries as the aggregate timestamps.**
Use the `offset` argument of the `time()` function to shift time boundaries forward or
backward in time.

### GROUP by time and fill gaps

When grouping by time, if a window in the queried time range does not contain data,
results return a row for the empty window containing the timestamp of the empty
window and _null_ values for each queried field.
Use the [`fill()` function](/influxdb/cloud-dedicated/reference/influxql/functions/misc/#fill)
_at the end of the `GROUP BY` clause_ to replace _null_ field values.
If no `FILL` clause is included, the default behavior is `fill(null)`.

`fill()` provides the following behaviors for filling values:

- **numeric literal**: Replaces null values with the specified numeric literal.
- **linear**: Uses linear interpolation between existing values to replace null values.
- **none**: Removes rows with null field values.
- **null**: Keeps null values and associated timestamps.
- **previous**: Replaces null values with the most recent non-null value.

_See the [`fill()` documentation](/influxdb/cloud-dedicated/reference/influxql/functions/misc/#fill)
for detailed examples._

### GROUP BY time examples

{{< expand-wrapper >}}

{{% expand "Group and aggregate query results into 1 hour windows" %}}

```sql
SELECT
  MEAN(price)
FROM bitcoin
WHERE
  code = 'USD'
  AND time >= '2023-05-01T00:00:00Z'
  AND time < '2023-05-15T00:00:00Z'
GROUP BY time(1h)
```

{{% influxql/table-meta %}}
name: bitcoin
{{% /influxql/table-meta %}}

| time                 |               mean |
| :------------------- | -----------------: |
| 2023-05-01T00:00:00Z |        24494.27265 |
| 2023-05-01T01:00:00Z |         24452.1698 |
| 2023-05-01T02:00:00Z | 23902.666124999996 |
| 2023-05-01T03:00:00Z | 23875.211349999998 |
| 2023-05-01T04:00:00Z |         23855.6441 |
| ...                  |                ... |


{{% /expand %}}

{{% expand "Group and aggregate query results into 1 week intervals by tag" %}}

```sql
SELECT
  MEAN(price)
FROM bitcoin
WHERE
  time >= '2023-05-01T00:00:00Z'
  AND time < '2023-05-15T00:00:00Z'
GROUP BY time(1w), code
```

{{% influxql/table-meta %}}
name: bitcoin  
tags: code=EUR
{{% /influxql/table-meta %}}

| time                 |               mean |
| :------------------- | -----------------: |
| 2023-04-27T00:00:00Z |  27681.21808576779 |
| 2023-05-04T00:00:00Z | 27829.413580354256 |
| 2023-05-11T00:00:00Z |  26210.24799033149 |

{{% influxql/table-meta %}}
name: bitcoin  
tags: code=GBP
{{% /influxql/table-meta %}}

| time                 |               mean |
| :------------------- | -----------------: |
| 2023-04-27T00:00:00Z | 23744.083925842704 |
| 2023-05-04T00:00:00Z | 23871.201395652173 |
| 2023-05-11T00:00:00Z |  22482.33174723755 |

{{% influxql/table-meta %}}
name: bitcoin  
tags: code=USD
{{% /influxql/table-meta %}}

| time                 |               mean |
| :------------------- | -----------------: |
| 2023-04-27T00:00:00Z |  28415.88231123595 |
| 2023-05-04T00:00:00Z | 28568.010941384844 |
| 2023-05-11T00:00:00Z |  26905.87242099449 |

{{% /expand %}}
{{< /expand-wrapper >}}

###### GROUP BY time with offset

{{< expand-wrapper >}}
{{% expand "Group and aggregate query results into 1 hour intervals and offset time boundaries by +15 minutes" %}}

```sql
SELECT
  MEAN(price)
FROM bitcoin
WHERE
  code = 'USD'
  AND time >= '2023-05-01T00:00:00Z'
  AND time < '2023-05-02T00:00:00Z'
GROUP BY time(1h, 15m)
```

{{% influxql/table-meta %}} 
name: bitcoin
{{% /influxql/table-meta %}}

| time                 |               mean |
| :------------------- | -----------------: |
| 2023-04-30T23:15:00Z |                    |
| 2023-05-01T00:15:00Z |         29313.6754 |
| 2023-05-01T01:15:00Z |         28932.0882 |
| 2023-05-01T02:15:00Z | 28596.375225000003 |
| 2023-05-01T03:15:00Z |       28578.915075 |
| ...                  |                ... |

_Note that `offset` forces the first time boundary to be outside
the queried time range so the query returns no results for that first interval._

{{% /expand %}}

{{% expand "Group and aggregate query results into 1 hour intervals and offset time boundaries by -15 minutes" %}}

```sql
SELECT
  MEAN(price)
FROM bitcoin
WHERE
  code = 'USD'
  AND time >= '2023-05-01T00:00:00Z'
  AND time < '2023-05-02T00:00:00Z'
GROUP BY time(1h, -15m)
```
{{% influxql/table-meta %}} 
name: bitcoin
{{% /influxql/table-meta %}} 

| time                 |               mean |
| :------------------- | -----------------: |
| 2023-04-30T23:45:00Z |         29319.9092 |
| 2023-05-01T00:45:00Z |         29285.3651 |
| 2023-05-01T01:45:00Z | 28607.202666666668 |
| 2023-05-01T02:45:00Z |       28576.056175 |
| 2023-05-01T03:45:00Z |        28566.96315 |
| ...                  |                ... |

{{% /expand %}}
{{< /expand-wrapper >}}

###### GROUP BY time and fill gaps

{{< expand-wrapper >}}
{{% expand "Group and aggregate query results into 30 minute intervals and fill gaps with `0`" %}}

```sql
SELECT
  MEAN(price)
FROM bitcoin
WHERE
  code = 'USD'
  AND time >= '2023-05-01T00:00:00Z'
  AND time < '2023-05-01T02:00:00Z'
GROUP BY
  time(30m)
  fill(0)
```

{{% influxql/table-meta %}} 
name: bitcoin
{{% /influxql/table-meta %}}

| time                 | mean       |
| -------------------- | ---------- |
| 2023-05-01T00:00:00Z | 29319.9092 |
| 2023-05-01T00:30:00Z | 29307.4416 |
| 2023-05-01T01:00:00Z | 0          |
| 2023-05-01T01:30:00Z | 29263.2886 |

{{% /expand %}}

{{% expand "Group and aggregate query results into 30 minute intervals and fill gaps using linear interpolation" %}}

```sql
SELECT
  MEAN(price)
FROM bitcoin
WHERE
  code = 'USD'
  AND time >= '2023-05-01T00:00:00Z'
  AND time < '2023-05-01T02:00:00Z'
GROUP BY
  time(30m)
  fill(linear)
```

{{% influxql/table-meta %}} 
name: bitcoin
{{% /influxql/table-meta %}}

| time                 | mean       |
| -------------------- | ---------- |
| 2023-05-01T00:00:00Z | 29319.9092 |
| 2023-05-01T00:30:00Z | 29307.4416 |
| 2023-05-01T01:00:00Z | 29285.3651 |
| 2023-05-01T01:30:00Z | 29263.2886 |

{{% /expand %}}

{{% expand "Group and aggregate query results into 30 minute intervals and fill gaps with previous values" %}}

```sql
SELECT
  MEAN(price)
FROM bitcoin
WHERE
  code = 'USD'
  AND time >= '2023-05-01T00:00:00Z'
  AND time < '2023-05-01T02:00:00Z'
GROUP BY
  time(30m)
  fill(previous)
```

{{% influxql/table-meta %}} 
name: bitcoin
{{% /influxql/table-meta %}}

| time                 | mean       |
| -------------------- | ---------- |
| 2023-05-01T00:00:00Z | 29319.9092 |
| 2023-05-01T00:30:00Z | 29307.4416 |
| 2023-05-01T01:00:00Z | 29307.4416 |
| 2023-05-01T01:30:00Z | 29263.2886 |

{{% /expand %}}

{{< /expand-wrapper >}}

## Notable behaviors of the GROUP BY clause

### Cannot group by fields

InfluxQL does not support grouping data by **fields**.

### Tag order does not matter

The order that tags are listed in the `GROUP BY` clause does not affect how
data is grouped.

### Grouping by tag and no time range returns unexpected timestamps

When grouping by tags and no time range is specified in the
[`WHERE` clause](/influxdb/cloud-dedicated/reference/influxql/where/), results
use the [Unix epoch](/influxdb/cloud-dedicated/reference/glossary/#unix-epoch) as the default timestamp for the aggregate timestamp.
For example:

```sql
SELECT mean(temp) FROM home GROUP BY room
```

{{% influxql/table-meta %}}
name: home  
tags: room=Kitchen
{{% /influxql/table-meta %}}

| time                 |               mean |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z | 22.623076923076926 |

{{% influxql/table-meta %}}
name: home  
tags: room=Living Room
{{% /influxql/table-meta %}}

| time                 |              mean |
| :------------------- | ----------------: |
| 1970-01-01T00:00:00Z | 22.16923076923077 |

### Data grouped by time may return unexpected timestamps

Because `GROUP BY time()` intervals use preset round-number time boundaries that
are independent of time conditions in the [`WHERE` clause](/influxdb/cloud-dedicated/reference/influxql/where/),
results may include timestamps outside of the queried time range.
Results represent only data with timestamps in the specified time range, but
output timestamps are determined by by the preset time boundaries.

The following example groups data by 1-hour intervals, but the time range defined
in the `WHERE` clause covers only part of a window:

```sql
SELECT MEAN(field)
FROM example 
WHERE
  time >= '2022-01-01T00:30:00Z'
  AND time <= '2022-01-01T01:30:00Z'
GROUP BY time(1h)
```

{{% note %}}
**Note**: The timestamp in the first row of query results data occurs before the start of
the queried time range.
[See why](#why-do-these-results-include-timestamps-outside-of-the-queried-time-range).
{{% /note %}}

{{% influxdb/custom-timestamps %}}
{{< flex >}}
{{% flex-content %}}
#### Example data

| time                 | field |
| :------------------- | ----: |
| 2022-01-01T00:00:00Z |     8 |
| 2022-01-01T00:15:00Z |     4 |
| 2022-01-01T00:30:00Z |     0 |
| 2022-01-01T00:45:00Z |     8 |
| 2022-01-01T01:00:00Z |     5 |
| 2022-01-01T01:15:00Z |     0 |
| 2022-01-01T01:30:00Z |     8 |
| 2022-01-01T01:45:00Z |     8 |
| 2022-01-01T02:00:00Z |     9 |
| 2022-01-01T02:15:00Z |     6 |
| 2022-01-01T02:30:00Z |     3 |
| 2022-01-01T02:45:00Z |     0 |

{{% /flex-content %}}
{{% flex-content %}}

#### Query results

| time                 | field |
| :------------------- | ----: |
| 2022-01-01T00:00:00Z |     4 |
| 2022-01-01T01:00:00Z |  5.25 |
| 2022-01-01T02:00:00Z |     6 |

{{% /flex-content %}}
{{< /flex >}}
{{% /influxdb/custom-timestamps %}}

{{< expand-wrapper >}}
{{% expand "Why do these results include timestamps outside of the queried time range?" %}}

`GROUP BY time()` creates windows with predefined time boundaries based on the
specified interval. These boundaries are not determined by the queried time
range, however, aggregate values in query results are calculated using only
values that are in the queried time range.

{{< html-diagram/influxql-windows >}}

{{% /expand %}}
{{< /expand-wrapper >}}

### Fill with no data in the queried time range

Queries ignore `fill()` if no data exists in the queried time range.
This is the expected behavior.

### Fill with previous if no previous value exists

`fill(previous)` doesn’t fill null values if there is no previous value in
the queried time range.

### Fill with linear interpolation if there are not two values to interpolate between

`fill(linear)` doesn't fill null values if there are no values before or after
the null value in the queried time range.
