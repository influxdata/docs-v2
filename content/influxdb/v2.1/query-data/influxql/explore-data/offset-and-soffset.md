---
title: The OFFSET and SOFFSET clauses
list_title: OFFSET and SOFFSET clause
description: >
  ...
menu:
  influxdb_2_1:
    name: OFFSET and SOFFSET clause
    parent: Explore data
weight: 306
---

`OFFSET` and `SOFFSET` paginates [points](/influxdb/v2.4/reference/glossary/#point) and [series](/influxdb/v2.4/reference/glossary/#series) returned.

<table style="width:100%">
  <tr>
    <td><a href="#the-offset-clause">The OFFSET clause</a></td>
    <td><a href="#the-soffset-clause">The SOFFSET clause</a></td>
  </tr>
</table>

## The `OFFSET` clause

`OFFSET <N>` paginates `N` [points](/influxdb/v2.4/reference/glossary/#point) in the query results.

### Syntax

```sql
SELECT_clause [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] LIMIT_clause OFFSET <N> [SLIMIT_clause]
```

`N` specifies the number of points to paginate. The `OFFSET clause` requires a `LIMIT clause`.

{{% note %}}
**NOTE:** InfluxDB returns no results if the `WHERE clause` includes a time range and the `OFFSET clause` would cause InfluxDB to return points with timestamps outside of that time range.
{{% /note %}}

### Examples

#### Paginate points

```sql
> SELECT "water_level","location" FROM "h2o_feet" LIMIT 3 OFFSET 3
```
Output:
| name: h2o_feet |
| :-------------- | :-------------------| :------------------|
| time | water_level | location |
| 2019-08-17T00:06:00Z | 2.1160000000 | santa_monica|
| 2019-08-17T00:12:00Z | 7.8870000000 | coyote_creek|
| 2019-08-17T00:12:00Z | 2.0280000000 | santa_monica|

The query returns the fourth, fifth, and sixth points from the `h2o_feet` [measurement](/influxdb/v2.4/reference/glossary/#measurement). If the query did not include `OFFSET 3`, it would return the first, second,
and third points from that measurement.

#### Paginate points and include several clauses

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:42:00Z' GROUP BY *,time(12m) ORDER BY time DESC LIMIT 2 OFFSET 2 SLIMIT 1
```
Output:
| name: h2o_feet | tags: location=coyote_creek |
| :------------------ | :---------------------|
| time   | mean |
| 2019-08-18T00:12:00Z | 8.2725000000 |
| 2019-08-18T00:00:00Z | 8.4615000000 |

This example is fairly involved, so here's the clause-by-clause breakdown:

  - The `SELECT clause` specifies an InfluxQL [function](/enterprise_influxdb/v1.9/query_language/functions).
  - The `FROM clause` (#the-basic-select-statement) specifies a single measurement.
  - The [`WHERE` clause](#the-where-clause) specifies the time range for the query.
  - The [`GROUP BY` clause](#the-group-by-clause) groups results by all tags  (`*`) and into 12-minute intervals.
  - The [`ORDER BY time DESC` clause](#order-by-time-desc) returns results in descending timestamp order.
  - The [`LIMIT 2` clause](#the-limit-clause) limits the number of points returned to two.
  - The `OFFSET 2` clause excludes the first two averages from the query results.
  - The [`SLIMIT 1` clause](#the-slimit-clause) limits the number of series returned to one.

Without `OFFSET 2`, the query would return the first two averages of the query results:

Output:
| name: h2o_feet | tags: location=coyote_creek |
| :------------------ | :---------------------|
| time   | mean |
| 2019-08-18T00:36:00Z | 7.8330000000 |
| 2019-08-18T00:24:00Z | 8.0710000000 |

## The `SOFFSET` clause

`SOFFSET <N>` paginates `N` [series](/influxdb/v2.4/reference/glossary/#series) in the query results.

### Syntax

```sql
SELECT_clause [INTO_clause] FROM_clause [WHERE_clause] GROUP BY *[,time(time_interval)] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] SLIMIT_clause SOFFSET <N>
```

`N` specifies the number of [series](/influxdb/v2.4/reference/glossary/#series) to paginate.
The `SOFFSET` clause requires an [`SLIMIT` clause](#the-slimit-clause).
Using the `SOFFSET` clause without an `SLIMIT` clause can cause [inconsistent
query results](https://github.com/influxdata/influxdb/issues/7578).
There is an [ongoing issue](https://github.com/influxdata/influxdb/issues/7571) that requires queries with `SLIMIT` to include `GROUP BY *`.

{{% note %}}
**NOTE:** InfluxDB returns no results if the `SOFFSET` clause paginates through more than the total number of series.
{{% /note %}}

### Examples

#### Paginate series

```sql
> SELECT "water_level" FROM "h2o_feet" GROUP BY * SLIMIT 1 SOFFSET 1
```
Output:
| name: h2o_feet | tags: location=santa_monica |
| :------------------ | :---------------------|
| time   |  water_level |
| 2019-08-17T00:00:00Z  | 2.0640000000|
| 2019-08-17T00:06:00Z  | 2.1160000000|
| 2019-08-17T00:12:00Z  | 2.0280000000|
| 2019-08-17T00:18:00Z  | 2.1260000000|
| 2019-08-17T00:24:00Z  | 2.0410000000|
| 2019-08-17T00:30:00Z  | 2.0510000000|
| 2019-08-17T00:36:00Z  | 2.0670000000|
| 2019-08-17T00:42:00Z  | 2.0570000000|

The results above are partial, as the data set is quite large. The query returns data for the series associated with the `h2o_feet`
measurement and the `location = santa_monica` tag. Without `SOFFSET 1`, the query returns data for the series associated with the `h2o_feet` measurement and the `location = coyote_creek` tag.

#### Paginate series and include all clauses

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:42:00Z' GROUP BY *,time(12m) ORDER BY time DESC LIMIT 2 OFFSET 2 SLIMIT 1 SOFFSET 1
```
Output:
| name: h2o_feet | tags: location=santa_monica |
| :------------------ | :---------------------|
| time   |  mean  |
| 2019-08-18T00:12:00Z | 2.3360000000|
| 2019-08-18T00:00:00Z | 2.3655000000|

This example is pretty involved, so here's the clause-by-clause breakdown:

  - The [`SELECT` clause](#the-basic-select-statement) specifies an InfluxQL [function](/enterprise_influxdb/v1.9/query_language/functions).
  - The [`FROM` clause](#the-basic-select-statement) specifies a single measurement.
  - The [`WHERE` clause](#the-where-clause) specifies the time range for the query.
  - The [`GROUP BY` clause](#the-group-by-clause) groups results by all tags  (`*`) and into 12-minute intervals.
  - The [`ORDER BY time DESC` clause](#order-by-time-desc) returns results in descending timestamp order.
  - The [`LIMIT 2` clause](#the-limit-clause) limits the number of points returned to two.
  - The [`OFFSET 2` clause](#the-offset-clause) excludes the first two averages from the query results.
  - The [`SLIMIT 1` clause](#the-slimit-clause) limits the number of series returned to one.
  - The `SOFFSET 1` clause paginates the series returned.

Without `SOFFSET 1`, the query would return the results for a different series:

Output:
| name: h2o_feet | tags: location=coyote_creek |
| :------------------ | :---------------------|
| time   | mean |
| 2019-08-18T00:12:00Z | 8.2725000000 |
| 2019-08-18T00:00:00Z | 8.4615000000 |

## The Time Zone clause

The `tz()` clause returns the UTC offset for the specified timezone.

### Syntax

```sql
SELECT_clause [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause] tz('<time_zone>')
```

By default, InfluxDB stores and returns timestamps in UTC.
The `tz()` clause includes the UTC offset or, if applicable, the UTC Daylight Savings Time (DST) offset to the query's returned timestamps.
The returned timestamps must be in [RFC3339 format](/enterprise_influxdb/v1.9/query_language/explore-data/#configuring-the-returned-timestamps) for the UTC offset or UTC DST to appear.
The `time_zone` parameter follows the TZ syntax in the [Internet Assigned Numbers Authority time zone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List) and it requires single quotes.

### Examples

#### Return the UTC offset for Chicago's time zone

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:18:00Z' tz('America/Chicago')

name: h2o_feet
time                       water_level
----                       -----------
2019-08-17T19:00:00-05:00  2.064
2019-08-17T19:06:00-05:00  2.116
2019-08-17T19:12:00-05:00  2.028
2019-08-17T19:18:00-05:00  2.126
```

The query results include the UTC offset (`-05:00`) for the `America/Chicago` time zone in the timestamps.

## Time syntax

For most `SELECT` statements, the default time range is between [`1677-09-21 00:12:43.145224194` and `2262-04-11T23:47:16.854775806Z` UTC](/enterprise_influxdb/v1.9/troubleshooting/frequently-asked-questions/#what-are-the-minimum-and-maximum-timestamps-that-influxdb-can-store).
For `SELECT` statements with a [`GROUP BY time()` clause](#group-by-time-intervals),
the default time range is between `1677-09-21 00:12:43.145224194` UTC and [`now()`](/enterprise_influxdb/v1.9/concepts/glossary/#now).
The following sections detail how to specify alternative time ranges in the `SELECT`
statement's [`WHERE` clause](#the-where-clause).

<table style="width:100%">
  <tr>
    <td><a href="#absolute-time">Absolute time</a></td>
    <td><a href="#relative-time">Relative time</a></td>
    <td><a href="#common-issues-with-time-syntax">Common issues with time syntax</a></td>
  </tr>
</table>

Tired of reading? Check out this InfluxQL Short:
<br>
<br>
<iframe src="https://player.vimeo.com/video/198723778?title=0&byline=0&portrait=0" width="60%" height="250px" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

## Absolute time

Specify absolute time with date-time strings and epoch time.

### Syntax

```sql
SELECT_clause FROM_clause WHERE time <operator> ['<rfc3339_date_time_string>' | '<rfc3339_like_date_time_string>' | <epoch_time>] [AND ['<rfc3339_date_time_string>' | '<rfc3339_like_date_time_string>' | <epoch_time>] [...]]
```

#### Supported operators

| Operator | Meaning                  |
|:--------:|:-------                  |
| `=`      | equal to                 |
| `<>`     | not equal to             |
| `!=`     | not equal to             |
| `>`      | greater than             |
| `>=`     | greater than or equal to |
| `<`      | less than                |
| `<=`     | less than or equal to    |

Currently, InfluxDB does not support using `OR` with absolute time in the `WHERE`
clause. See the [Frequently Asked Questions](/enterprise_influxdb/v1.9/troubleshooting/frequently-asked-questions/#why-is-my-query-with-a-where-or-time-clause-returning-empty-results)
document and the [GitHub Issue](https://github.com/influxdata/influxdb/issues/7530)
for more information.

#### `rfc3339_date_time_string`

```sql
'YYYY-MM-DDTHH:MM:SS.nnnnnnnnnZ'
```

`.nnnnnnnnn` is optional and is set to `.000000000` if not included.
The [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) date-time string requires single quotes.

#### `rfc3339_like_date_time_string`

```sql
'YYYY-MM-DD HH:MM:SS.nnnnnnnnn'
```

`HH:MM:SS.nnnnnnnnn.nnnnnnnnn` is optional and is set to `00:00:00.000000000` if not included.
The RFC3339-like date-time string requires single quotes.

#### `epoch_time`

Epoch time is the amount of time that has elapsed since 00:00:00
Coordinated Universal Time (UTC), Thursday, 1 January 1970.

By default, InfluxDB assumes that all epoch timestamps are in nanoseconds.
Include a [duration literal](/enterprise_influxdb/v1.9/query_language/spec/#durations)
at the end of the epoch timestamp to indicate a precision other than nanoseconds.

#### Basic arithmetic

All timestamp formats support basic arithmetic.
Add (`+`) or subtract (`-`) a time from a timestamp with a [duration literal](/enterprise_influxdb/v1.9/query_language/spec/#durations).
Note that InfluxQL requires a whitespace between the `+` or `-` and the
duration literal.

### Examples

#### Specify a time range with RFC3339 date-time strings

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00.000000000Z' AND time <= '2019-08-18T00:12:00Z'

name: h2o_feet
time                   water_level
----                   -----------
2019-08-18T00:00:00Z   2.064
2019-08-18T00:06:00Z   2.116
2019-08-18T00:12:00Z   2.028
```

The query returns data with timestamps between August 18, 2019 at 00:00:00.000000000 and
August 18, 2019 at 00:12:00.
The nanosecond specification in the first timestamp (`.000000000`)
is optional.

Note that the single quotes around the RFC3339 date-time strings are required.

#### Specify a time range with RFC3339-like date-time strings

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18' AND time <= '2019-08-18 00:12:00'

name: h2o_feet
time                   water_level
----                   -----------
2019-08-18T00:00:00Z   2.064
2019-08-18T00:06:00Z   2.116
2019-08-18T00:12:00Z   2.028
```

The query returns data with timestamps between August 18, 2019 at 00:00:00 and August 18, 2019
at 00:12:00.
The first date-time string does not include a time; InfluxDB assumes the time
is 00:00:00.

Note that the single quotes around the RFC3339-like date-time strings are
required.

#### Specify a time range with epoch timestamps

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= 1439856000000000000 AND time <= 1439856720000000000

name: h2o_feet
time                   water_level
----                   -----------
2019-08-18T00:00:00Z   2.064
2019-08-18T00:06:00Z   2.116
2019-08-18T00:12:00Z   2.028
```

The query returns data with timestamps that occur between August 18, 2019
at 00:00:00 and August 18, 2019 at 00:12:00.
By default InfluxDB assumes epoch timestamps are in nanoseconds.

#### Specify a time range with second-precision epoch timestamps

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= 1439856000s AND time <= 1439856720s

name: h2o_feet
time                   water_level
----                   -----------
2019-08-18T00:00:00Z   2.064
2019-08-18T00:06:00Z   2.116
2019-08-18T00:12:00Z   2.028
```

The query returns data with timestamps that occur between August 18, 2019
at 00:00:00 and August 18, 2019 at 00:12:00.
The `s` [duration literal](/enterprise_influxdb/v1.9/query_language/spec/#durations) at the
end of the epoch timestamps indicate that the epoch timestamps are in seconds.

#### Perform basic arithmetic on an RFC3339-like date-time string

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time > '2019-09-18T21:24:00Z' + 6m

name: h2o_feet
time                   water_level
----                   -----------
2019-09-18T21:36:00Z   5.066
2019-09-18T21:42:00Z   4.938
```

The query returns data with timestamps that occur at least six minutes after
September 18, 2019 at 21:24:00.
Note that the whitespace between the `+` and `6m` is required.

#### Perform basic arithmetic on an epoch timestamp

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time > 24043524m - 6m

name: h2o_feet
time                   water_level
----                   -----------
2019-09-18T21:24:00Z   5.013
2019-09-18T21:30:00Z   5.01
2019-09-18T21:36:00Z   5.066
2019-09-18T21:42:00Z   4.938
```

The query returns data with timestamps that occur at least six minutes before
September 18, 2019 at 21:24:00.
Note that the whitespace between the `-` and `6m` is required.

## Relative time

Use [`now()`](/enterprise_influxdb/v1.9/concepts/glossary/#now) to query data with [timestamps](/enterprise_influxdb/v1.9/concepts/glossary/#timestamp) relative to the server's current timestamp.

### Syntax

```sql
SELECT_clause FROM_clause WHERE time <operator> now() [[ - | + ] <duration_literal>] [(AND|OR) now() [...]]
```

`now()` is the Unix time of the server at the time the query is executed on that server.
The whitespace between `-` or `+` and the [duration literal](/enterprise_influxdb/v1.9/query_language/spec/#durations) is required.

#### Supported operators
| Operator | Meaning                  |
|:--------:|:-------                  |
| `=`      | equal to                 |
| `<>`     | not equal to             |
| `!=`     | not equal to             |
| `>`      | greater than             |
| `>=`     | greater than or equal to |
| `<`      | less than                |
| `<=`     | less than or equal to    |

#### `duration_literal`

- microseconds: `u` or `µ`
- milliseconds: `ms`
- seconds`s`
- minutes`m`
- hours:`h`
- days:`d`
- weeks:`w`

### Examples

#### Specify a time range with relative time

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time > now() - 1h
```

The query returns data with timestamps that occur within the past hour.
The whitespace between `-` and `1h` is required.

#### Specify a time range with absolute time and relative time

```sql
> SELECT "level description" FROM "h2o_feet" WHERE time > '2019-09-18T21:18:00Z' AND time < now() + 1000d

name: h2o_feet
time                   level description
----                   -----------------
2019-09-18T21:24:00Z   between 3 and 6 feet
2019-09-18T21:30:00Z   between 3 and 6 feet
2019-09-18T21:36:00Z   between 3 and 6 feet
2019-09-18T21:42:00Z   between 3 and 6 feet
```

The query returns data with timestamps that occur between September 18, 2019
at 21:18:00 and 1000 days from `now()`.
The whitespace between `+` and `1000d` is required.

## Common issues with time syntax

### Using `OR` to select time multiple time intervals

InfluxDB does not support using the `OR` operator in the `WHERE` clause to specify multiple time intervals.

For more information, see [Frequently asked questions](/enterprise_influxdb/v1.9/troubleshooting/frequently-asked-questions/#why-is-my-query-with-a-where-or-time-clause-returning-empty-results).

### Querying data that occur after `now()` with a `GROUP BY time()` clause

Most `SELECT` statements have a default time range between [`1677-09-21 00:12:43.145224194` and `2262-04-11T23:47:16.854775806Z` UTC](/enterprise_influxdb/v1.9/troubleshooting/frequently-asked-questions/#what-are-the-minimum-and-maximum-timestamps-that-influxdb-can-store).
For `SELECT` statements with a [`GROUP BY time()` clause](#group-by-time-intervals),
the default time range is between `1677-09-21 00:12:43.145224194` UTC and [`now()`](/enterprise_influxdb/v1.9/concepts/glossary/#now).

To query data with timestamps that occur after `now()`, `SELECT` statements with
a `GROUP BY time()` clause must provide an alternative upper bound in the
`WHERE` clause.

#### Example

Use the [CLI](/enterprise_influxdb/v1.9/tools/influx-cli/use-influx/) to write a point to the `NOAA_water_database` that occurs after `now()`:

```sql
> INSERT h2o_feet,location=santa_monica water_level=3.1 1587074400000000000
```

Run a `GROUP BY time()` query that covers data with timestamps between
`2019-09-18T21:30:00Z` and `now()`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location"='santa_monica' AND time >= '2019-09-18T21:30:00Z' GROUP BY time(12m) fill(none)

name: h2o_feet
time                   mean
----                   ----
2019-09-18T21:24:00Z   5.01
2019-09-18T21:36:00Z   5.002
```

Run a `GROUP BY time()` query that covers data with timestamps between
`2019-09-18T21:30:00Z` and 180 weeks from `now()`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location"='santa_monica' AND time >= '2019-09-18T21:30:00Z' AND time <= now() + 180w GROUP BY time(12m) fill(none)

name: h2o_feet
time                   mean
----                   ----
2019-09-18T21:24:00Z   5.01
2019-09-18T21:36:00Z   5.002
2020-04-16T22:00:00Z   3.1
```

Note that the `WHERE` clause must provide an alternative **upper** bound to
override the default `now()` upper bound. The following query merely resets
the lower bound to `now()` such that the query's time range is between
`now()` and `now()`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location"='santa_monica' AND time >= now() GROUP BY time(12m) fill(none)
>
```
