---
title: Time and timezone queries
list_title: Time and timezone queries
description: >
  Use the `tz` (timezone) clause to return the UTC offset for the specified timezone and explore a variety of time-related queries.
menu:
  influxdb_2_5:
    name: Time and timezone
    parent: Explore data
weight: 308
list_code_example: |
  ```sql
  SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause] tz('<time_zone>')
  ```
---

## Configuring returned timestamps

The [InfluxQL shell](/influxdb/v2.5/tools/influxql-shell/) returns timestamps in
nanosecond UNIX epoch format by default.
Specify alternative formats with the
[`precision <format>` command](/influxdb/v2.5/tools/influxql-shell/#precision).  

If you are using the [InfluxQL shell](/influxdb/v2.5/tools/influxql-shell/), use the precision helper command `precision rfc3339` to view results in human readable format.

The [InfluxDB API](/influxdb/v2.5/reference/api/influxdb-1x/) returns timestamps
in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) format by default.
Specify alternative formats with the
[`epoch` query string parameter](/influxdb/v2.5/reference/api/influxdb-1x/).

## The Time Zone clause

Use the `tz()` clause to return the UTC offset for the specified timezone.

### Syntax

```sql
SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause] tz('<time_zone>')
```

By default, InfluxDB stores and returns timestamps in UTC.
The `tz()` clause includes the UTC offset or, if applicable, the UTC Daylight Savings Time (DST) offset to the query's returned timestamps. The returned timestamps must be in `RFC3339` format for the UTC offset or UTC DST to appear.
The `time_zone` parameter follows the TZ syntax in the [Internet Assigned Numbers Authority time zone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List) and it requires single quotes.

### Examples

#### Return the UTC offset for Chicago's time zone

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:18:00Z' tz('America/Chicago')
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time | water_level |
| :-------------- | -------------------:|
| 2019-08-17T19:00:00-05:00 | 2.3520000000|
| 2019-08-17T19:06:00-05:00 | 2.3790000000|
| 2019-08-17T19:12:00-05:00 | 2.3430000000|
| 2019-08-17T19:18:00-05:00 | 2.3290000000|

The query results include the UTC offset (`-05:00`) for the `America/Chicago` time zone in the timestamps.

## Time syntax

For most `SELECT` statements, the default time range is between [`1677-09-21 00:12:43.145224194` and `2262-04-11T23:47:16.854775806Z` UTC](/influxdb/v2.5/reference/faq/#what-are-the-minimum-and-maximum-timestamps-that-influxdb-can-store).
For `SELECT` statements with a [`GROUP BY time()` clause](/influxdb/v2.5/query-data/influxql/explore-data/group-by/),
the default time range is between `1677-09-21 00:12:43.145224194` UTC and [`now()`](/influxdb/v2.5/reference/glossary/#now).
The following sections detail how to specify alternative time ranges in the `SELECT`
statement's [`WHERE` clause](/influxdb/v2.5/query-data/influxql/explore-data/where/).

Other supported features include:  
[Absolute time](#absolute-time)  
[Relative time](#relative-time)

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
clause. See the [Frequently Asked Questions](/influxdb/v2.5/reference/faq/#why-is-my-query-with-a-where-or-time-clause-returning-empty-results)
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

By default, InfluxDB assumes that all epoch timestamps are in **nanoseconds**. Include a [duration literal](/influxdb/v2.5/reference/glossary/#duration) at the end of the epoch timestamp to indicate a precision other than nanoseconds.

#### Basic arithmetic

All timestamp formats support basic arithmetic.
Add (`+`) or subtract (`-`) a time from a timestamp with a [duration literal](/influxdb/v2.5/reference/glossary/#duration).
Note that InfluxQL requires a whitespace between the `+` or `-` and the
duration literal.

### Examples

#### Specify a time range with RFC3339 date-time strings

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00.000000000Z' AND time <= '2019-08-18T00:12:00Z'
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time   |  water_level |
| :------------------ | ------------------:|
| 2019-08-18T00:00:00Z  | 2.3520000000|
| 2019-08-18T00:06:00Z  | 2.3790000000|
| 2019-08-18T00:12:00Z  | 2.3430000000|

The query returns data with timestamps between August 18, 2019 at 00:00:00.000000000 and
August 18, 2019 at 00:12:00.

Note that the single quotes around the RFC3339 date-time strings are required.

#### Specify a time range with RFC3339-like date-time strings

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18' AND time <= '2019-08-18 00:12:00'
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time   |  water_level |
| :------------------ | ------------------:|
| 2019-08-18T00:00:00Z  | 2.3520000000|
| 2019-08-18T00:06:00Z  | 2.3790000000|
| 2019-08-18T00:12:00Z  | 2.3430000000|

The query returns data with timestamps between August 18, 2019 at 00:00:00 and August 18, 2019
at 00:12:00.
The first date-time string does not include a time; InfluxDB assumes the time
is 00:00:00.

Note that the single quotes around the RFC3339-like date-time strings are
required.

#### Specify a time range with epoch timestamps

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= 1564635600000000000 AND time <= 1566190800000000000
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time   |  water_level |
| :------------------ | ------------------:|
| 2019-08-17T00:00:00Z  | 2.0640000000|
| 2019-08-17T00:06:00Z  | 2.1160000000|
| 2019-08-17T00:12:00Z  | 2.0280000000|
| 2019-08-17T00:18:00Z  | 2.1260000000|
| 2019-08-17T00:24:00Z  | 2.0410000000|
| 2019-08-17T00:30:00Z  | 2.0510000000|
| 2019-08-17T00:36:00Z  | 2.0670000000|
| 2019-08-17T00:42:00Z  | 2.0570000000|
| 2019-08-17T00:48:00Z  | 1.9910000000|
| 2019-08-17T00:54:00Z  | 2.0540000000|
| 2019-08-17T01:00:00Z  | 2.0180000000|
| 2019-08-17T01:06:00Z  | 2.0960000000|
| 2019-08-17T01:12:00Z  | 2.1000000000|
| 2019-08-17T01:18:00Z  | 2.1060000000|
| 2019-08-17T01:24:00Z  | 2.1261441460|

The query returns data with timestamps that occur between August 1, 2019
at 00:00:00 and August 19, 2019 at 00:12:00.  By default InfluxDB assumes epoch timestamps are in nanoseconds.

#### Specify a time range with second-precision epoch timestamps

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= 1566190800s AND time <= 1566191520s
```
Output:
| time   |  water_level |
| :------------------ | ------------------:|
| 2019-08-19T05:00:00Z | 3.2320000000|
| 2019-08-19T05:06:00Z | 3.2320000000|
| 2019-08-19T05:12:00Z | 3.2910000000|

The query returns data with timestamps that occur between August 19, 2019
at 00:00:00 and August 19, 2019 at 00:12:00.
The `s` duration literal at the end of the epoch timestamps indicate that the epoch timestamps are in seconds.

#### Perform basic arithmetic on an RFC3339-like date-time string

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time > '2019-09-17T21:24:00Z' + 6m
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time   |  water_level |
| :------------------ | ------------------:|
| 2019-09-17T21:36:00Z  |  5.0660000000|
| 2019-09-17T21:42:00Z  |  4.9380000000|

The query returns data with timestamps that occur at least six minutes after
September 17, 2019 at 21:24:00.
Note that the whitespace between the `+` and `6m` is required.

#### Perform basic arithmetic on an epoch timestamp

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time > 24043524m - 6m
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time   |  water_level |
| :------------------ | ------------------:|
| 2019-08-17T00:00:00Z  |   8.1200000000|
| 2019-08-17T00:00:00Z  |   2.0640000000|
| 2019-08-17T00:06:00Z  |   8.0050000000|
| 2019-08-17T00:06:00Z  |   2.1160000000|
| 2019-08-17T00:12:00Z  |   7.8870000000|
| 2019-08-17T00:12:00Z  |   2.0280000000|
| 2019-08-17T00:18:00Z  |   7.7620000000|
| 2019-08-17T00:18:00Z  |   2.1260000000|

The query returns data with timestamps that occur at least six minutes before
September 18, 2019 at 21:24:00. Note that the whitespace between the `-` and `6m` is required.  Note that the results above are partial as the dataset is large. 

## Relative time

Use [`now()`](/influxdb/v2.5/reference/glossary/#now) to query data with [timestamps](/influxdb/v2.5/reference/glossary/#timestamp) relative to the server's current timestamp.

### Syntax

```sql
SELECT_clause FROM_clause WHERE time <operator> now() [[ - | + ] <duration_literal>] [(AND|OR) now() [...]]
```

`now()` is the Unix time of the server at the time the query is executed on that server.
The whitespace between `-` or `+` and the [duration literal](/influxdb/v2.5/reference/glossary/#duration) is required.

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
> SELECT "level description" FROM "h2o_feet" WHERE time > '2019-09-17T21:18:00Z' AND time < now() + 1000d
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time   |  level description    |
| :------------------ |--------------------:|
|2019-09-17T21:24:00Z | between 3 and 6 feet |
|2019-09-17T21:30:00Z | between 3 and 6 feet |
|2019-09-17T21:36:00Z | between 3 and 6 feet |
|2019-09-17T21:42:00Z | between 3 and 6 feet |

The query returns data with timestamps that occur between September 17, 2019 at 21:18:00 and 1000 days from `now()`. The whitespace between `+` and `1000d` is required.

## Common issues with time syntax

### Using `OR` to select time multiple time intervals

InfluxDB does not support using the `OR` operator in the `WHERE` clause to specify multiple time intervals.

For more information, see [Frequently asked questions](/influxdb/v2.5/reference/faq/#why-is-my-query-with-a-where-or-time-clause-returning-empty-results).

### Querying data that occur after `now()` with a `GROUP BY time()` clause

Most `SELECT` statements have a default time range between [`1677-09-21 00:12:43.145224194` and `2262-04-11T23:47:16.854775806Z` UTC](/influxdb/v2.5/reference/faq/#what-are-the-minimum-and-maximum-timestamps-that-influxdb-can-store).
For `SELECT` statements with a [`GROUP BY time()` clause](influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-time-intervals),
the default time range is between `1677-09-21 00:12:43.145224194` UTC and [`now()`](/influxdb/v2.5/reference/glossary/#now).

To query data with timestamps that occur after `now()`, `SELECT` statements with
a `GROUP BY time()` clause must provide an alternative upper bound in the
`WHERE` clause.

<!-- #### Example

Use the [CLI](/enterprise_influxdb/v1.9/tools/influx-cli/use-influx/) to write a point to the `noaa` database that occurs after `now()`:

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
``` -->
