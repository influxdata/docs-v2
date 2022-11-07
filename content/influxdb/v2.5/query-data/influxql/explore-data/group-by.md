---
title: The GROUP BY clause
list_title: GROUP BY clause
description: >
  Use the `GROUP BY` clause to group query results by one or more specified [tags](/influxdb/v2.5/reference/glossary/#tag) and/or a specified time interval.
menu:
  influxdb_2_5:
    name: GROUP BY clause
    parent: Explore data
weight: 303
list_code_example: |
  ```sql
  SELECT_clause FROM_clause [WHERE_clause] GROUP BY [* | <tag_key>[,<tag_key]]
  ```

  ```sql
  SELECT <function>(<field_key>) FROM_clause WHERE <time_range> GROUP BY time(<time_interval>),[tag_key] [fill(<fill_option>)]
  ```
---

Use the `GROUP BY` clause to group query results by one or more specified [tags](/influxdb/v2.5/reference/glossary/#tag) and/or a specified time interval.

{{% note %}}
**Note:** You cannot use `GROUP BY` to group **fields**.
{{% /note %}}

- [GROUP BY tags](#group-by-tags)
   - [Syntax and examples](#syntax)
- [GROUP BY time intervals](#group-by-time-intervals)
   - [Basic syntax and examples](#basic-group-by-time-syntax)
   - [Common issues with basic syntax](#common-issues-with-basic-syntax)
   - [Advanced syntax and examples](#advanced-group-by-time-syntax)
- [GROUP BY time intervals and fill()](#group-by-time-intervals-and-fill)
   - [Syntax and examples](#syntax-2)
   - [Common issues with fill()](#common-issues-with-fill)

## GROUP BY tags

`GROUP BY <tag>` groups query results by one or more specified [tags](/influxdb/v2.5/reference/glossary/#tag).

### Syntax

```sql
SELECT_clause FROM_clause [WHERE_clause] GROUP BY [* | <tag_key>[,<tag_key]]
```

  - `GROUP BY *` - Groups results by all [tags](/influxdb/v2.5/reference/glossary/#tag)
  - `GROUP BY <tag_key>` - Groups results by a specific tag
  - `GROUP BY <tag_key>,<tag_key>` - Groups results by more than one tag. The order of the [tag keys](/influxdb/v2.5/reference/glossary/#tag-key) is irrelevant.

If the query includes a `WHERE` clause, the `GROUP BY` clause must appear after the `WHERE` clause.

Other supported features include [Regular Expressions](/influxdb/v2.5/query-data/influxql/explore-data/regular-expressions/).

### Examples

{{< expand-wrapper >}}

{{% expand "Group query results by a single tag" %}}

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" GROUP BY "location"
```
Output:
{{% influxql/table-meta %}} 
name: h2o_feet   
tags: location=coyote_creek
{{% /influxql/table-meta %}} 

|time | mean |
| :-------------- |--------------------:|
| 1970-01-01T00:00:00Z | 5.3591424203|

{{% influxql/table-meta %}} 
name: h2o_feet  
tags: location=santa_monica
{{% /influxql/table-meta %}} 

|time | mean |
| :-------------- |----------------------:|
| 1970-01-01T00:00:00Z |3.5307120942|

The query uses the InfluxQL [MEAN() function](/influxdb/v2.5/query-data/influxql/view-functions/)
to calculate the average `water_level` for each
[tag value](/influxdb/v2.5/reference/glossary/#tag-value) of `location` in
the `h2o_feet` [measurement](/influxdb/v2.5/reference/glossary/#measurement).
InfluxDB returns results in two [series](/influxdb/v2.5/reference/glossary/#series): one for each tag value of `location`.

{{% note %}}
**Note:** In InfluxDB, [epoch 0](https://en.wikipedia.org/wiki/Unix_time) (`1970-01-01T00:00:00Z`) is often used as a null timestamp equivalent.
If you request a query that has no timestamp to return, such as an [aggregation function](/influxdb/v2.5/query-data/influxql/view-functions/aggregates/) with an unbounded time range, InfluxDB returns epoch 0 as the timestamp.
{{% /note %}}

{{% /expand %}}

{{% expand "Group query results by more than one tag" %}}

```sql
> SELECT MEAN("index") FROM "h2o_quality" GROUP BY "location","randtag"
```
Output:
{{% influxql/table-meta %}} 
name: h2o_quality  
tags: location=coyote_creek, randtag=1
{{% /influxql/table-meta %}} 

|time | mean |
| :-------------- | -------------------:|
| 1970-01-01T00:00:00Z | 50.6903376019 |

{{% influxql/table-meta %}} 
name: h2o_quality  
tags: location=coyote_creek, randtag=2
{{% /influxql/table-meta %}} 

|time | mean |
| :-------------- | -------------------:|
| 1970-01-01T00:00:00Z | 49.6618675442 |

{{% influxql/table-meta %}} 
name: h2o_quality  
tags: location=coyote_creek, randtag=3
{{% /influxql/table-meta %}} 

|time | mean |
| :-------------- | -------------------:|
| 1970-01-01T00:00:00Z | 49.3609399076 |

{{% influxql/table-meta %}} 
name: h2o_quality  
tags: location=santa_monica, randtag=1
{{% /influxql/table-meta %}}

|time | mean |
| :-------------- | -------------------:|
| 1970-01-01T00:00:00Z | 49.1327124563 |

{{% influxql/table-meta %}} 
name: h2o_quality  
tags: location=santa_monica, randtag=2
{{% /influxql/table-meta %}}

|time | mean |
| :-------------- | -------------------:|
| 1970-01-01T00:00:00Z | 50.2937984496 |

{{% influxql/table-meta %}} 
name: h2o_quality  
tags: location=santa_monica, randtag=3
{{% /influxql/table-meta %}}

|time | mean |
| :-------------- | -------------------:|
| 1970-01-01T00:00:00Z | 49.9991990388 |

The query uses the InfluxQL [MEAN() function](/influxdb/v2.5/query-data/influxql/view-functions/aggregates/#mean) to calculate the average `index` for
each combination of the `location` tag and the `randtag` tag in the
`h2o_quality` measurement.
Separate multiple tags with a comma in the `GROUP BY` clause.

{{% /expand %}}

{{% expand "Group query results by all tags" %}}

```sql
> SELECT MEAN("index") FROM "h2o_quality" GROUP BY *
```
Output:
{{% influxql/table-meta %}} 
name: h2o_quality  
tags: location=coyote_creek, randtag=1
{{% /influxql/table-meta %}} 

|time | mean |
| :-------------- | -------------------:|
| 1970-01-01T00:00:00Z | 50.6903376019 |

{{% influxql/table-meta %}} 
name: h2o_quality  
tags: location=coyote_creek, randtag=2
{{% /influxql/table-meta %}} 

|time | mean |
| :-------------- | -------------------:|
| 1970-01-01T00:00:00Z | 49.6618675442 |

{{% influxql/table-meta %}} 
name: h2o_quality  
tags: location=coyote_creek, randtag=3
{{% /influxql/table-meta %}} 

|time | mean |
| :-------------- | -------------------:|
| 1970-01-01T00:00:00Z | 49.3609399076 |

{{% influxql/table-meta %}} 
name: h2o_quality  
tags: location=santa_monica, randtag=1
{{% /influxql/table-meta %}}

|time | mean |
| :-------------- | -------------------:|
| 1970-01-01T00:00:00Z | 49.1327124563 |

{{% influxql/table-meta %}} 
name: h2o_quality  
tags: location=santa_monica, randtag=2
{{% /influxql/table-meta %}}

|time | mean |
| :-------------- | -------------------:|
| 1970-01-01T00:00:00Z | 50.2937984496 |

{{% influxql/table-meta %}} 
name: h2o_quality  
tags: location=santa_monica, randtag=3
{{% /influxql/table-meta %}}

|time | mean |
| :-------------- | -------------------:|
| 1970-01-01T00:00:00Z | 49.9991990388 |

The query uses the InfluxQL [MEAN() function](/influxdb/v2.5/query-data/influxql/view-functions/aggregates/#mean) to calculate the average `index` for every possible
[tag](influxdb/v2.5/reference/glossary/#tag) combination in the `h2o_quality`
measurement.

{{% note %}}
Note that the query results are identical to the results of the query in [Example 2](#group-query-results-by-all-tags)
where we explicitly specified the `location` and `randtag` tag keys.
This is because the `h2o_quality` measurement only has two tag keys.
{{% /note %}}

{{% /expand %}}

{{< /expand-wrapper >}}

## GROUP BY time intervals

`GROUP BY time()` queries group query results by a user-specified time interval.

### Basic GROUP BY time() syntax

#### Syntax

```sql
SELECT <function>(<field_key>) FROM_clause WHERE <time_range> GROUP BY time(<time_interval>),[tag_key] [fill(<fill_option>)]
```

Basic `GROUP BY time()` queries require an InfluxQL [function](/influxdb/v2.5/query-data/influxql/view-functions)
in the `SELECT` clause and a time range in the `WHERE` clause. 
Note that the `GROUP BY` clause must come **after** the `WHERE` clause.

##### `time(time_interval)`

The `time_interval` in the `GROUP BY time()` clause is a
[duration literal](/influxdb/v2.5/reference/glossary/#duration).
It determines how InfluxDB groups query results over time.
For example, a `time_interval` of `5m` groups query results into five-minute
time groups across the time range specified in the `WHERE` clause.

##### `fill(<fill_option>)`

`fill(<fill_option>)` is optional.
It changes the value reported for time intervals that have no data.
See [GROUP BY time intervals and `fill()`](#group-by-time-intervals-and-fill)
for more information.

**Coverage:**

Basic `GROUP BY time()` queries rely on the `time_interval` and on the InfluxDB database's
preset time boundaries to determine the raw data included in each time interval
and the timestamps returned by the query.

### Examples of basic syntax

The examples below use the following subsample of the sample data:

```sql
> SELECT "water_level","location" FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z'
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time | water_level | location |
| :-------------- | -------------------:| :------------------|
| 2019-08-18T00:00:00Z | 8.5040000000  | coyote_creek |
| 2019-08-18T00:00:00Z  | 2.3520000000 | santa_monica |
| 2019-08-18T00:06:00Z | 8.4190000000 | coyote_creek |
| 2019-08-18T00:06:00Z |  2.3790000000 | santa_monica|
| 2019-08-18T00:12:00Z | 8.3200000000 | coyote_creek |
| 2019-08-18T00:12:00Z | 2.3430000000 | santa_monica |
| 2019-08-18T00:18:00Z | 8.2250000000 | coyote_creek |
| 2019-08-18T00:18:00Z | 2.3290000000 | santa_monica |
| 2019-08-18T00:24:00Z | 8.1300000000 | coyote_creek |
| 2019-08-18T00:24:00Z | 2.2640000000 | santa_monica |
| 2019-08-18T00:30:00Z | 8.0120000000 | coyote_creek |
| 2019-08-18T00:30:00Z | 2.2670000000 | santa_monica |

{{< expand-wrapper >}}

{{% expand "Group query results into 12 minute intervals" %}}

```sql
> SELECT COUNT("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' GROUP BY time(12m)
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time   | count |
| :------------------ | :---------------------:|
| 2019-08-18T00:00:00Z | 2.0000000000|
| 2019-08-18T00:12:00Z | 2.0000000000|
| 2019-08-18T00:24:00Z | 2.0000000000|

The query uses the InfluxQL [COUNT() function](/influxdb/v2.5/query-data/influxql/view-functions/aggregates/#count) to count the number of `water_level` points with the [tag](/influxdb/v2.5/reference/glossary/#tag)
`location = coyote_creek` and it group results into 12 minute intervals.

The result for each [timestamp](/influxdb/v2.5/reference/glossary/#timestamp)
represents a single 12 minute interval.
The count for the first timestamp covers the raw data between `2019-08-18T00:00:00Z`
and up to, but not including, `2019-08-18T00:12:00Z`.
The count for the second timestamp covers the raw data between `2019-08-18T00:12:00Z`
and up to, but not including, `2019-08-18T00:24:00Z.`

{{% /expand %}}

{{% expand "Group query results into 12 minute intervals and by a tag key" %}}

```sql
> SELECT COUNT("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' GROUP BY time(12m),"location"
```
Output: 
{{% influxql/table-meta %}}
name: h2o_feet  
tags: location=coyote_creek
{{% /influxql/table-meta %}}

| time   | count |
| :------------------ | ---------------------:|
| 2019-08-18T00:00:00Z | 2.0000000000|
| 2019-08-18T00:12:00Z | 2.0000000000|
| 2019-08-18T00:24:00Z | 2.0000000000|


{{% influxql/table-meta %}}
name: h2o_feet      
tags: location=santa_monica
{{% /influxql/table-meta %}}

| time   | count |
| :------------------ | ---------------------:|
| 2019-08-18T00:00:00Z | 2.0000000000|
| 2019-08-18T00:12:00Z | 2.0000000000|
| 2019-08-18T00:24:00Z | 2.0000000000|

The query uses the InfluxQL [COUNT() function](/influxdb/v2.5/query-data/influxql/view-functions/aggregates/#count)
to count the number of `water_level` points.
It groups results by the `location` tag and into 12 minute intervals.
Note that the time interval and the tag key are separated by a comma in the
`GROUP BY` clause.

The query returns two [series](/influxdb/v2.5/reference/glossary/#series) of results: one for each
[tag value](/influxdb/v2.5/reference/glossary/#tag-value) of the `location` tag.
The result for each timestamp represents a single 12 minute interval.
The count for the first timestamp covers the raw data between `2019-08-18T00:00:00Z`
and up to, but not including, `2019-08-18T00:12:00Z`.
The count for the second timestamp covers the raw data between `2019-08-18T00:12:00Z`
and up to, but not including, `2019-08-18T00:24:00Z.`

{{% /expand %}}

{{< /expand-wrapper >}}

### Common issues with basic syntax

##### Unexpected timestamps and values in query results

With the basic syntax, InfluxDB relies on the `GROUP BY time()` interval
and on the system's preset time boundaries to determine the raw data included
in each time interval and the timestamps returned by the query.
In some cases, this can lead to unexpected results.

**Example**

Raw data:

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:18:00Z'
```

Output: 
{{% influxql/table-meta %}}
name: h2o_feet  
{{% /influxql/table-meta %}}

| time   | water_level |
| :------------------ | ---------------------:|
|2019-08-18T00:00:00Z |  8.5040000000 |
|2019-08-18T00:06:00Z |  8.4190000000 |
|2019-08-18T00:12:00Z |  8.3200000000 |
|2019-08-18T00:18:00Z |  8.2250000000 |


Query and results:

The following query covers a 12-minute time range and groups results into 12-minute time intervals, but it returns **two** results:

```sql
> SELECT COUNT("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2019-08-18T00:06:00Z' AND time < '2019-08-18T00:18:00Z' GROUP BY time(12m)
```

Output: 
{{% influxql/table-meta %}}
name: h2o_feet  
{{% /influxql/table-meta %}}

| time   | count |
| :------------------ | ---------------------:|
|2019-08-18T00:00:00Z  |  1.0000000000|
|2019-08-18T00:12:00Z  |  1.0000000000|

{{% note %}}
Note: The timestamp in the first row of data occurs before the start of the query's time range.
{{% /note %}}

Explanation:

InfluxDB uses preset round-number time boundaries for `GROUP BY` intervals that are
independent of any time conditions in the `WHERE` clause.
When it calculates the results, all returned data must occur within the query's
explicit time range but the `GROUP BY` intervals will be based on the preset
time boundaries.

The table below shows the preset time boundary, the relevant `GROUP BY time()` interval, the
points included, and the returned timestamp for each `GROUP BY time()`
interval in the results.

| Time Interval Number | Preset Time Boundary |`GROUP BY time()` Interval | Points Included | Returned Timestamp |
| :------------- | :------------- | :------------- | :------------- | :------------- |
| 1  | `time >= 2019-08-18T00:00:00Z AND time < 2019-08-18T00:12:00Z` | `time >= 2019-08-18T00:06:00Z AND time < 2019-08-18T00:12:00Z` | `8.005` | `2019-08-18T00:00:00Z` |
| 2  | `time >= 2019-08-12T00:12:00Z AND time < 2019-08-18T00:24:00Z` | `time >= 2019-08-12T00:12:00Z AND time < 2019-08-18T00:18:00Z`  | `7.887` | `2019-08-18T00:12:00Z` |

The first preset 12-minute time boundary begins at `00:00` and ends just before
`00:12`.
Only one raw point (`8.005`) falls both within the query's first `GROUP BY time()` interval and in that
first time boundary.
Note that while the returned timestamp occurs before the start of the query's time range,
the query result excludes data that occur before the query's time range.

The second preset 12-minute time boundary begins at `00:12` and ends just before
`00:24`.
Only one raw point (`7.887`) falls both within the query's second `GROUP BY time()` interval and in that
second time boundary.

The [advanced `GROUP BY time()` syntax](#advanced-group-by-time-syntax) allows users to shift
the start time of the InfluxDB database's preset time boundaries.
[Example 3](#examples-3)
in the Advanced Syntax section continues with the query shown here;
it shifts forward the preset time boundaries by six minutes such that
InfluxDB returns:

Output: 
{{% influxql/table-meta %}}
name: h2o_feet  
{{% /influxql/table-meta %}}

| time   | count |
| :------------------ | ---------------------:|
| 2019-08-18T00:06:00Z  | 2 |

### Advanced GROUP BY time() syntax

#### Syntax

```sql
SELECT <function>(<field_key>) FROM_clause WHERE <time_range> GROUP BY time(<time_interval>,<offset_interval>),[tag_key] [fill(<fill_option>)]
```

Advanced `GROUP BY time()` queries require an InfluxQL [function](/influxdb/v2.5/query-data/influxql/view-functions/)
in the `SELECT` clause and a time range in the
`WHERE` clause). Note that the `GROUP BY` clause must come after the `WHERE` clause.

##### `time(time_interval,offset_interval)`

See the [Basic GROUP BY time() Syntax](#basic-group-by-time-syntax)
for details on the `time_interval`.

The `offset_interval` is a [duration literal](/influxdb/v2.5/reference/glossary/#duration).
It shifts forward or back the InfluxDB database's preset time boundaries.
The `offset_interval` can be positive or negative.

##### `fill(<fill_option>)`

`fill(<fill_option>)` is optional.
It changes the value reported for time intervals that have no data.
See [GROUP BY time intervals and `fill()`](#group-by-time-intervals-and-fill)
for more information.

**Coverage:**

Advanced `GROUP BY time()` queries rely on the `time_interval`, the `offset_interval`
, and on the InfluxDB database's preset time boundaries to determine the raw data included in each time interval
and the timestamps returned by the query.

### Examples of advanced syntax

The examples below use the following subsample of the sample data:

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:54:00Z'
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time | water_level | 
| :-------------- | -------------------:| 
| 2019-08-18T00:00:00Z | 8.5040000000 |
| 2019-08-18T00:06:00Z | 8.4190000000 |
| 2019-08-18T00:12:00Z | 8.3200000000|
| 2019-08-18T00:18:00Z | 8.2250000000|
| 2019-08-18T00:24:00Z | 8.1300000000|
| 2019-08-18T00:30:00Z | 8.0120000000|
| 2019-08-18T00:36:00Z | 7.8940000000|
| 2019-08-18T00:42:00Z | 7.7720000000|
| 2019-08-18T00:48:00Z | 7.6380000000|
| 2019-08-18T00:54:00Z | 7.5100000000 |

{{< expand-wrapper >}}

{{% expand "Group query results into 18 minute intervals and shift the preset time boundaries forward" %}}

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2019-08-18T00:06:00Z' AND time <= '2019-08-18T00:54:00Z' GROUP BY time(18m,6m)
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time | mean | 
| :-------------- | -------------------:| 
| 2019-08-18T00:06:00Z | 8.3213333333|
| 2019-08-18T00:24:00Z | 8.0120000000|
| 2019-08-18T00:42:00Z | 7.6400000000|

The query uses the InfluxQL [MEAN() function](/influxdb/v2.5/query-data/influxql/view-functions/aggregates/#mean)
to calculate the average `water_level`, grouping results into 18 minute time intervals, and offsetting the preset time boundaries by 6 minutes.

The time boundaries and returned timestamps for the query **without** the `offset_interval` adhere to the InfluxDB database's preset time boundaries. Let's first examine the results without the offset:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2019-08-18T00:06:00Z' AND time <= '2019-08-18T00:54:00Z' GROUP BY time(18m)
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time | mean | 
| :-------------- | -------------------:| 
| 2019-08-18T00:00:00Z | 8.3695000000| 
| 2019-08-18T00:18:00Z | 8.1223333333|
| 2019-08-18T00:36:00Z | 7.7680000000|
| 2019-08-18T00:54:00Z | 7.5100000000|

The time boundaries and returned timestamps for the query **without** the
`offset_interval` adhere to the InfluxDB database's preset time boundaries:

| Time Interval Number | Preset Time Boundary |`GROUP BY time()` Interval | Points Included | Returned Timestamp |
| :------------- | :------------- | :------------- | :------------- | :------------- |
| 1  | `time >= 2019-08-18T00:00:00Z AND time < 2019-08-18T00:18:00Z` | `time >= 2019-08-18T00:06:00Z AND time < 2019-08-18T00:18:00Z` | `8.005`,`7.887` | `2019-08-18T00:00:00Z` |
| 2  | `time >= 2019-08-18T00:18:00Z AND time < 2019-08-18T00:36:00Z` | <--- same | `7.762`,`7.635`,`7.5` | `2019-08-18T00:18:00Z` |
| 3  | `time >= 2019-08-18T00:36:00Z AND time < 2019-08-18T00:54:00Z` | <--- same | `7.372`,`7.234`,`7.11` | `2019-08-18T00:36:00Z` |
| 4  | `time >= 2019-08-18T00:54:00Z AND time < 2019-08-18T01:12:00Z` | `time = 2019-08-18T00:54:00Z` | `6.982` | `2019-08-18T00:54:00Z` |

The first preset 18-minute time boundary begins at `00:00` and ends just before
`00:18`. Two raw points (`8.005` and `7.887`) fall both within the first `GROUP BY time()` interval and in that
first time boundary. While the returned timestamp occurs before the start of the query's time range,
the query result excludes data that occur before the query's time range.

The second preset 18-minute time boundary begins at `00:18` and ends just before
`00:36`. Three raw points (`7.762` and `7.635` and `7.5`) fall both within the second `GROUP BY time()` interval and in that
second time boundary. In this case, the boundary time range and the interval's time range are the same.

The fourth preset 18-minute time boundary begins at `00:54` and ends just before
`1:12:00`. One raw point (`6.982`) falls both within the fourth `GROUP BY time()` interval and in that
fourth time boundary.

The time boundaries and returned timestamps for the query **with** the `offset_interval` adhere to the offset time boundaries:

| Time Interval Number | Offset Time Boundary |`GROUP BY time()` Interval | Points Included | Returned Timestamp |
| :------------- | :------------- | :------------- | :------------- | ------------- |
| 1  | `time >= 2019-08-18T00:06:00Z AND time < 2019-08-18T00:24:00Z` | <--- same | `8.005`,`7.887`,`7.762` | `2019-08-18T00:06:00Z` |
| 2  | `time >= 2019-08-18T00:24:00Z AND time < 2019-08-18T00:42:00Z` | <--- same | `7.635`,`7.5`,`7.372` | `2019-08-18T00:24:00Z` |
| 3  | `time >= 2019-08-18T00:42:00Z AND time < 2019-08-18T01:00:00Z` | <--- same | `7.234`,`7.11`,`6.982` | `2019-08-18T00:42:00Z` |
| 4  | `time >= 2019-08-18T01:00:00Z AND time < 2019-08-18T01:18:00Z` | NA | NA | NA |

The six-minute offset interval shifts forward the preset boundary's time range
such that the boundary time ranges and the relevant `GROUP BY time()` interval time ranges are
always the same.
With the offset, each interval performs the calculation on three points, and
the timestamp returned matches both the start of the boundary time range and the
start of the `GROUP BY time()` interval time range.

Note that `offset_interval` forces the fourth time boundary to be outside
the query's time range so the query returns no results for that last interval.

{{% /expand %}}

{{% expand "Group query results into 12 minute intervals and shift the preset time boundaries back" %}}

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2019-08-18T00:06:00Z' AND time <= '2019-08-18T00:54:00Z' GROUP BY time(18m,-12m)
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time | mean | 
| :-------------- | -------------------:| 
| 2019-08-18T00:06:00Z | 8.3213333333 |
| 2019-08-18T00:24:00Z | 8.0120000000 |
| 2019-08-18T00:42:00Z | 7.6400000000 |


The query uses the InfluxQL [MEAN() function](/influxdb/v2.5/query-data/influxql/view-functions/aggregates/#mean) to calculate the average `water_level`, grouping results into 18 minute
time intervals, and offsetting the preset time boundaries by -12 minutes.

{{% note %}} 
**Note:** The query in Example 2 returns the same results as the query in Example 1, but
the query in Example 2 uses a negative `offset_interval` instead of a positive
`offset_interval`.
There are no performance differences between the two queries; feel free to choose the most
intuitive option when deciding between a positive and negative `offset_interval`.
{{% /note %}}

The time boundaries and returned timestamps for the query **without** the `offset_interval` adhere to InfluxDB database's preset time boundaries. Let's first examine the results without the offset:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2019-08-18T00:06:00Z' AND time <= '2019-08-18T00:54:00Z' GROUP BY time(18m)
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time | mean | 
| :-------------- | -------------------:| 
| 2019-08-18T00:00:00Z | 8.3695000000 |
| 2019-08-18T00:18:00Z | 8.1223333333 |
| 2019-08-18T00:36:00Z | 7.7680000000 |
| 2019-08-18T00:54:00Z | 7.5100000000 |

The time boundaries and returned timestamps for the query **without** the
`offset_interval` adhere to the InfluxDB database's preset time boundaries:

| Time Interval Number | Preset Time Boundary |`GROUP BY time()` Interval | Points Included | Returned Timestamp |
| :------------- | :------------- | :------------- | :------------- | :------------- |
| 1  | `time >= 2019-08-18T00:00:00Z AND time < 2019-08-18T00:18:00Z` | `time >= 2019-08-18T00:06:00Z AND time < 2019-08-18T00:18:00Z` | `8.005`,`7.887` | `2019-08-18T00:00:00Z` |
| 2  | `time >= 2019-08-18T00:18:00Z AND time < 2019-08-18T00:36:00Z` | <--- same | `7.762`,`7.635`,`7.5` | `2019-08-18T00:18:00Z` |
| 3  | `time >= 2019-08-18T00:36:00Z AND time < 2019-08-18T00:54:00Z` | <--- same | `7.372`,`7.234`,`7.11` | `2019-08-18T00:36:00Z` |
| 4  | `time >= 2019-08-18T00:54:00Z AND time < 2019-08-18T01:12:00Z` | `time = 2019-08-18T00:54:00Z` | `6.982` | `2019-08-18T00:54:00Z` |

The first preset 18-minute time boundary begins at `00:00` and ends just before
`00:18`.
Two raw points (`8.005` and `7.887`) fall both within the first `GROUP BY time()` interval and in that
first time boundary.
Note that while the returned timestamp occurs before the start of the query's time range,
the query result excludes data that occur before the query's time range.

The second preset 18-minute time boundary begins at `00:18` and ends just before
`00:36`.
Three raw points (`7.762` and `7.635` and `7.5`) fall both within the second `GROUP BY time()` interval and in that
second time boundary. In this case, the boundary time range and the interval's time range are the same.

The fourth preset 18-minute time boundary begins at `00:54` and ends just before
`1:12:00`.
One raw point (`6.982`) falls both within the fourth `GROUP BY time()` interval and in that
fourth time boundary.

The time boundaries and returned timestamps for the query **with** the
`offset_interval` adhere to the offset time boundaries:

| Time Interval Number | Offset Time Boundary |`GROUP BY time()` Interval | Points Included | Returned Timestamp |
| :------------- | :------------- | :------------- | :------------- | ------------- |
| 1  | `time >= 2019-08-17T23:48:00Z AND time < 2019-08-18T00:06:00Z` | NA | NA | NA |
| 2  | `time >= 2019-08-18T00:06:00Z AND time < 2019-08-18T00:24:00Z` | <--- same | `8.005`,`7.887`,`7.762` | `2019-08-18T00:06:00Z` |
| 3  | `time >= 2019-08-18T00:24:00Z AND time < 2019-08-18T00:42:00Z` | <--- same | `7.635`,`7.5`,`7.372` | `2019-08-18T00:24:00Z` |
| 4  | `time >= 2019-08-18T00:42:00Z AND time < 2019-08-18T01:00:00Z` | <--- same | `7.234`,`7.11`,`6.982` | `2019-08-18T00:42:00Z` |

The negative 12-minute offset interval shifts back the preset boundary's time range
such that the boundary time ranges and the relevant `GROUP BY time()` interval time ranges are always the
same.
With the offset, each interval performs the calculation on three points, and
the timestamp returned matches both the start of the boundary time range and the
start of the `GROUP BY time()` interval time range.

Note that `offset_interval` forces the first time boundary to be outside
the query's time range so the query returns no results for that first interval.

{{% /expand %}}

{{% expand "Group query results into 12 minute intervals and shift the preset time boundaries forward" %}}

This example is a continuation of the scenario outlined in [Common Issues with Basic Syntax](#common-issues-with-basic-syntax).

```sql
> SELECT COUNT("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2019-08-18T00:06:00Z' AND time < '2019-08-18T00:18:00Z' GROUP BY time(12m,6m)
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time | count | 
| :-------------- | -------------------:| 
| 2019-08-18T00:06:00Z  |  2.0000000000    |

The query uses the InfluxQL [COUNT() function](/influxdb/v2.5/query-data/influxql/view-functions/aggregates/#count) to count the number of `water_level` points, grouping results into 12 minute
time intervals, and offsetting the preset time boundaries by six minutes.

The time boundaries and returned timestamps for the query **without** the `offset_interval` adhere to InfluxDB database's preset time boundaries. Let's first examine the results without the offset:

```sql
> SELECT COUNT("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2019-08-18T00:06:00Z' AND time < '2019-08-18T00:18:00Z' GROUP BY time(12m)
```

Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time | count | 
| :-------------- | -------------------:| 
| 2019-08-18T00:00:00Z  | 1.0000000000
| 2019-08-18T00:12:00Z  | 1.0000000000

The time boundaries and returned timestamps for the query **without** the `offset_interval` adhere to InfluxDB database's preset time boundaries:

| Time Interval Number | Preset Time Boundary |`GROUP BY time()` Interval | Points Included | Returned Timestamp |
| :------------- | :------------- | :------------- | :------------- | :------------- |
| 1  | `time >= 2019-08-18T00:00:00Z AND time < 2019-08-18T00:12:00Z` | `time >= 2019-08-18T00:06:00Z AND time < 2019-08-18T00:12:00Z` | `8.005` | `2019-08-18T00:00:00Z` |
| 2  | `time >= 2019-08-12T00:12:00Z AND time < 2019-08-18T00:24:00Z` | `time >= 2019-08-12T00:12:00Z AND time < 2019-08-18T00:18:00Z`  | `7.887` | `2019-08-18T00:12:00Z` |

The first preset 12-minute time boundary begins at `00:00` and ends just before
`00:12`.
Only one raw point (`8.005`) falls both within the query's first `GROUP BY time()` interval and in that
first time boundary.
Note that while the returned timestamp occurs before the start of the query's time range,
the query result excludes data that occur before the query's time range.

The second preset 12-minute time boundary begins at `00:12` and ends just before
`00:24`.
Only one raw point (`7.887`) falls both within the query's second `GROUP BY time()` interval and in that
second time boundary.

The time boundaries and returned timestamps for the query **with** the
`offset_interval` adhere to the offset time boundaries:

| Time Interval Number | Offset Time Boundary |`GROUP BY time()` Interval | Points Included | Returned Timestamp |
| :------------- | :------------- | :------------- | :------------- | :------------- |
| 1  | `time >= 2019-08-18T00:06:00Z AND time < 2019-08-18T00:18:00Z` | <--- same | `8.005`,`7.887` | `2019-08-18T00:06:00Z` |
| 2  | `time >= 2019-08-18T00:18:00Z AND time < 2019-08-18T00:30:00Z` | NA | NA | NA |

The six-minute offset interval shifts forward the preset boundary's time range
such that the preset boundary time range and the relevant `GROUP BY time()` interval time range are the
same. With the offset, the query returns a single result, and the timestamp returned
matches both the start of the boundary time range and the start of the `GROUP BY time()` interval
time range.

Note that `offset_interval` forces the second time boundary to be outside
the query's time range so the query returns no results for that second interval.

{{% /expand %}}

{{< /expand-wrapper >}}

## `GROUP BY` time intervals and `fill()`

`fill()` changes the value reported for time intervals that have no data.

#### Syntax

```sql
SELECT <function>(<field_key>) FROM_clause WHERE <time_range> GROUP BY time(time_interval,[<offset_interval])[,tag_key] [fill(<fill_option>)]
```

By default, a `GROUP BY time()` interval with no data reports `null` as its
value in the output column.
`fill()` changes the value reported for time intervals that have no data.
Note that `fill()` must go at the end of the `GROUP BY` clause if you're
`GROUP(ing) BY` several things (for example, both [tags](/influxdb/v2.5/reference/glossary/#tag) and a time interval).

##### fill_option

  - Any numerical value - Reports the given numerical value for time intervals with no data.
  - `linear` - Reports the results of [linear interpolation](https://en.wikipedia.org/wiki/Linear_interpolation) for time intervals with no data.
  - `none` - Reports no timestamp and no value for time intervals with no data.
  - `null` - Reports null for time intervals with no data but returns a timestamp. This is the same as the default behavior.
  - `previous` - Reports the value from the previous time interval for time intervals with no data.

### Examples

{{< tabs-wrapper >}}
{{% tabs "even-wrap" %}}
[fill(100)](#)
[fill(linear)](#)
[fill(none)](#)
[fill(null)](#)
[fill(previous)](#)
{{% /tabs %}}
{{% tab-content %}}

Without `fill(100)`:

```sql
> SELECT MEAN("index") FROM "h2o_quality" WHERE "location"='santa_monica' AND time >= '2019-08-19T08:42:00Z' AND time <= '2019-08-19T09:30:00Z' GROUP BY time(5m) 
```
Output:
{{% influxql/table-meta %}}
Name: h2o_quality  
{{% /influxql/table-meta %}}

| time    |  mean | 
| :--------------| ------------------:| 
| 2019-08-19T08:40:00Z | 68.0000000000|
| 019-08-19T08:45:00Z | 29.0000000000|
| 2019-08-19T08:50:00Z | 47.0000000000|
| 2019-08-19T08:55:00Z | <nil>|
| 2019-08-19T09:00:00Z | 84.0000000000|
| 2019-08-19T09:05:00Z | 0.0000000000|
| 2019-08-19T09:10:00Z | 41.0000000000|
| 2019-08-19T09:15:00Z | 13.0000000000|
| 2019-08-19T09:20:00Z | 9.0000000000|
| 2019-08-19T09:25:00Z | <nil>|
| 2019-08-19T09:30:00Z  |  6.0000000000|

With `fill(100)`:
```sql
> SELECT MEAN("index") FROM "h2o_quality" WHERE "location"='santa_monica' AND time >= '2019-08-19T08:42:00Z' AND time <= '2019-08-19T09:30:00Z' GROUP BY time(5m) fill(100)
```
Output:
{{% influxql/table-meta %}}
Name: h2o_quality  
{{% /influxql/table-meta %}}

| time    |  mean | 
| :--------------| ------------------:| 
| 2019-08-19T08:40:00Z | 68.0000000000|
| 019-08-19T08:45:00Z  | 29.0000000000|
| 2019-08-19T08:50:00Z | 47.0000000000|
| 2019-08-19T08:55:00Z |100.0000000000|
| 2019-08-19T09:00:00Z | 84.0000000000|
| 2019-08-19T09:05:00Z | 0.0000000000|
| 2019-08-19T09:10:00Z | 41.0000000000|
| 2019-08-19T09:15:00Z | 13.0000000000|
| 2019-08-19T09:20:00Z | 9.0000000000|
| 2019-08-19T09:25:00Z | 100.0000000000|
| 2019-08-19T09:30:00Z | 6.0000000000|

`fill(100)` changes the value reported for the time interval with no data to `100`.

{{% /tab-content %}}

{{% tab-content %}}

Without `fill(linear)`:

```sql
> SELECT MEAN("tadpoles") FROM "pond" WHERE time >= '2019-11-11T21:00:00Z' AND time <= '2019-11-11T22:06:00Z' GROUP BY time(12m)
```
Output:
{{% influxql/table-meta %}}
Name: pond
{{% /influxql/table-meta %}}

| time   | mean |
| :------------------ | ---------------------:|
| 2019-11-11T21:00:00Z  | 1 |
| 2019-11-11T21:12:00Z |   |
| 2019-11-11T21:24:00Z |  3 |
| 2019-11-11T21:36:00Z |   |
| 2019-11-11T21:48:00Z |    |
| 2019-11-11T22:00:00Z  | 6  |

With `fill(linear)`:

```sql
> SELECT MEAN("tadpoles") FROM "pond" WHERE time >= '2019-11-11T21:00:00Z' AND time <= '2019-11-11T22:06:00Z' GROUP BY time(12m) fill(linear)
```

Output:
{{% influxql/table-meta %}}
Name: pond
{{% /influxql/table-meta %}}

| time   | mean |
| :------------------ | ---------------------:|
| 2019-11-11T21:00:00Z | 1 |
| 2019-11-11T21:12:00Z | 2 |
| 2019-11-11T21:24:00Z | 3 |
| 2019-11-11T21:36:00Z | 4 |
| 2019-11-11T21:48:00Z | 5 |
| 2019-11-11T22:00:00Z | 6 |

`fill(linear)` changes the value reported for the time interval with no data
to the results of [linear interpolation](https://en.wikipedia.org/wiki/Linear_interpolation).

{{% note %}}
**Note:** The data in Example 2 are not in the `noaa` database.
We had to create a dataset with less regular data to work with `fill(linear)`.
{{% /note %}}

{{% /tab-content %}}

{{% tab-content %}}

Without `fill(none)`:

```sql
> SELECT MEAN("index") FROM "h2o_quality" WHERE "location"='santa_monica' AND time >= '2019-08-19T08:42:00Z' AND time <= '2019-08-19T09:30:00Z' GROUP BY time(5m)
```
Output:
{{% influxql/table-meta %}}
Name: h2o_quality
{{% /influxql/table-meta %}}

| time    |  mean | 
| :--------------| ------------------:| 
| 2019-08-19T08:40:00Z | 68.0000000000|
| 019-08-19T08:45:00Z | 29.0000000000|
| 2019-08-19T08:50:00Z | 47.0000000000|
| 2019-08-19T08:55:00Z | <nil>|
| 2019-08-19T09:00:00Z | 84.0000000000|
| 2019-08-19T09:05:00Z | 0.0000000000|
| 2019-08-19T09:10:00Z | 41.0000000000|
| 2019-08-19T09:15:00Z | 13.0000000000|
| 2019-08-19T09:20:00Z | 9.0000000000|
| 2019-08-19T09:25:00Z | <nil>|
| 2019-08-19T09:30:00Z  |  6.0000000000|

With `fill(none)`:

```sql
> SELECT MEAN("index") FROM "h2o_quality" WHERE "location"='santa_monica' AND time >= '2019-08-19T08:42:00Z' AND time <= '2019-08-19T09:30:00Z' GROUP BY time(5m) fill(none)
```
Output:
{{% influxql/table-meta %}}
Name: h2o_quality
{{% /influxql/table-meta %}}

| time    |  mean | 
| :--------------| ------------------:| 
| 2019-08-19T08:40:00Z | 68.0000000000|
| 019-08-19T08:45:00Z | 29.0000000000|
| 2019-08-19T08:50:00Z | 47.0000000000|
| 2019-08-19T09:00:00Z | 84.0000000000|
| 2019-08-19T09:05:00Z | 0.0000000000|
| 2019-08-19T09:10:00Z | 41.0000000000|
| 2019-08-19T09:15:00Z | 13.0000000000|
| 2019-08-19T09:20:00Z | 9.0000000000|
| 2019-08-19T09:30:00Z  |  6.0000000000|
```

`fill(none)` reports no value and no timestamp for the time interval with no data.

{{% /tab-content %}}

{{% tab-content %}}

Without `fill(null)`:

```sql
> SELECT MEAN("index") FROM "h2o_quality" WHERE "location"='santa_monica' AND time >= '2019-08-19T08:42:00Z' AND time <= '2019-08-19T09:30:00Z' GROUP BY time(5m)
```
Output:
{{% influxql/table-meta %}}
Name: h2o_quality
{{% /influxql/table-meta %}}

| time    |  mean | 
| :--------------| ------------------:| 
| 2019-08-19T08:40:00Z | 68.0000000000|
| 019-08-19T08:45:00Z | 29.0000000000|
| 2019-08-19T08:50:00Z | 47.0000000000|
| 2019-08-19T08:55:00Z | <nil>|
| 2019-08-19T09:00:00Z | 84.0000000000|
| 2019-08-19T09:05:00Z | 0.0000000000|
| 2019-08-19T09:10:00Z | 41.0000000000|
| 2019-08-19T09:15:00Z | 13.0000000000|
| 2019-08-19T09:20:00Z | 9.0000000000|
| 2019-08-19T09:25:00Z | <nil>|
| 2019-08-19T09:30:00Z  |  6.0000000000|

With `fill(null)`:

```sql
> SELECT MEAN("index") FROM "h2o_quality" WHERE "location"='santa_monica' AND time >= '2019-08-19T08:42:00Z' AND time <= '2019-08-19T09:30:00Z' GROUP BY time(5m) fill(null)
```
Output:
{{% influxql/table-meta %}}
Name: h2o_quality
{{% /influxql/table-meta %}}

| time    |  mean | 
| :--------------| ------------------:| 
| 2019-08-19T08:40:00Z | 68.0000000000|
| 019-08-19T08:45:00Z | 29.0000000000|
| 2019-08-19T08:50:00Z | 47.0000000000|
| 2019-08-19T08:55:00Z |   null  |
| 2019-08-19T09:00:00Z | 84.0000000000|
| 2019-08-19T09:05:00Z | 0.0000000000|
| 2019-08-19T09:10:00Z | 41.0000000000|
| 2019-08-19T09:15:00Z | 13.0000000000|
| 2019-08-19T09:20:00Z | 9.0000000000|
| 2019-08-19T09:25:00Z |  null   |
| 2019-08-19T09:30:00Z  |  6.0000000000|

`fill(null)` reports `null` as the value for the time interval with no data.
That result matches the result of the query without `fill(null)`.

{{% /tab-content %}}

{{% tab-content %}}

Without `fill(previous)`:

```sql
 > SELECT MEAN("index") FROM "h2o_quality" WHERE "location"='santa_monica' AND time >= '2019-08-19T08:42:00Z' AND time <= '2019-08-19T09:30:00Z' GROUP BY time(5m) 
 ```
Output:
{{% influxql/table-meta %}}
Name: h2o_quality
{{% /influxql/table-meta %}}

| time    |  mean | 
| :--------------| ------------------:| 
| 2019-08-19T08:40:00Z | 68.0000000000|
| 019-08-19T08:45:00Z | 29.0000000000|
| 2019-08-19T08:50:00Z | 47.0000000000|
| 2019-08-19T08:55:00Z | <nil>|
| 2019-08-19T09:00:00Z | 84.0000000000|
| 2019-08-19T09:05:00Z | 0.0000000000|
| 2019-08-19T09:10:00Z | 41.0000000000|
| 2019-08-19T09:15:00Z | 13.0000000000|
| 2019-08-19T09:20:00Z | 9.0000000000|
| 2019-08-19T09:25:00Z | <nil>|

With `fill(previous)`:

```sql
 SELECT MEAN("index") FROM "h2o_quality" WHERE "location"='santa_monica' AND time >= '2019-08-19T08:42:00Z' AND time <= '2019-08-19T09:30:00Z' GROUP BY time(5m) fill(previous)
 ```
Output:
{{% influxql/table-meta %}}
Name: h2o_quality
{{% /influxql/table-meta %}}

| time    |  mean | 
| :--------------| ------------------:| 
| 2019-08-19T08:40:00Z | 68.0000000000|
| 019-08-19T08:45:00Z | 29.0000000000|
| 2019-08-19T08:50:00Z | 47.0000000000|
| 2019-08-19T08:55:00Z | 47.0000000000|
| 2019-08-19T09:00:00Z | 84.0000000000|
| 2019-08-19T09:05:00Z | 0.0000000000|
| 2019-08-19T09:10:00Z | 41.0000000000|
| 2019-08-19T09:15:00Z | 13.0000000000|
| 2019-08-19T09:20:00Z | 9.0000000000|
| 2019-08-19T09:25:00Z | 9.0000000000|

`fill(previous)` changes the value reported for the time interval with no data to `3.235`,
the value from the previous time interval.

{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Common issues with `fill()`

##### Queries with `fill()` when no data fall within the query's time range

Currently, queries ignore `fill()` if no data fall within the query's time range.
This is the expected behavior. An open
[feature request](https://github.com/influxdata/influxdb/issues/6967) on GitHub
proposes that `fill()` should force a return of values even if the query's time
range covers no data.

**Example**

The following query returns no data because `water_level` has no points within
the query's time range.
Note that `fill(800)` has no effect on the query results.

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location" = 'coyote_creek' AND time >= '2019-09-18T22:00:00Z' AND time <= '2019-09-18T22:18:00Z' GROUP BY time(12m) fill(800)
> no results
```

##### Queries with `fill(previous)` when the previous result falls outside the query's time range

`fill(previous)` doesn’t fill the result for a time interval if the previous
value is outside the query’s time range.

**Example**

The following query covers the time range between `2019-09-18T16:24:00Z` and `2019-09-18T16:54:00Z`.
Note that `fill(previous)` fills the result for `2019-09-18T16:36:00Z` with the
result from `2019-09-18T16:24:00Z`.

```sql
> SELECT MAX("water_level") FROM "h2o_feet" WHERE location = 'coyote_creek' AND time >= '2019-09-18T16:24:00Z' AND time <= '2019-09-18T16:54:00Z' GROUP BY time(12m) fill(previous)
```

Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time    |  max | 
| :--------------| ------------------:| 
| 2019-09-18T16:24:00Z  |  3.235
| 2019-09-18T16:36:00Z  | 3.235
| 2019-09-18T16:48:00Z  | 4


The next query shortens the time range in the previous query.
It now covers the time between `2019-09-18T16:36:00Z` and `2019-09-18T16:54:00Z`.
Note that `fill(previous)` doesn't fill the result for `2019-09-18T16:36:00Z` with the
result from `2019-09-18T16:24:00Z`; the result for `2019-09-18T16:24:00Z` is outside the query's
shorter time range.

```sql
> SELECT MAX("water_level") FROM "h2o_feet" WHERE location = 'coyote_creek' AND time >= '2019-09-18T16:36:00Z' AND time <= '2019-09-18T16:54:00Z' GROUP BY time(12m) fill(previous)
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time    |  max | 
| :--------------| ------------------:| 
| 2019-09-18T16:36:00Z  |  |
| 2019-09-18T16:48:00Z  | 4

##### `fill(linear)` when the previous or following result falls outside the query's time range

`fill(linear)` doesn't fill the result for a time interval with no data if the
previous result or the following result is outside the query's time range.

**Example**

The following query covers the time range between `2019-11-11T21:24:00Z` and
`2019-11-11T22:06:00Z`. Note that `fill(linear)` fills the results for the
`2019-11-11T21:36:00Z` time interval and the `2019-11-11T21:48:00Z` time interval
using the values from the `2019-11-11T21:24:00Z` time interval and the
`2019-11-11T22:00:00Z` time interval.

```sql
> SELECT MEAN("tadpoles") FROM "pond" WHERE time > '2019-11-11T21:24:00Z' AND time <= '2019-11-11T22:06:00Z' GROUP BY time(12m) fill(linear)
```
Output:
{{% influxql/table-meta %}}
Name: pond
{{% /influxql/table-meta %}}

| time    |  mean |
| :--------------| ------------------:|
| 2019-11-11T21:24:00Z | 3 |
| 2019-11-11T21:36:00Z | 4 |
| 2019-11-11T21:48:00Z | 5 |
| 2019-11-11T22:00:00Z | 6 |

The next query shortens the time range in the previous query.
It now covers the time between `2019-11-11T21:36:00Z` and `2019-11-11T22:06:00Z`.
Note that `fill()` previous doesn't fill the results for the `2019-11-11T21:36:00Z`
time interval and the `2019-11-11T21:48:00Z` time interval; the result for
`2019-11-11T21:24:00Z` is outside the query's shorter time range and InfluxDB
cannot perform the linear interpolation.

```sql
> SELECT MEAN("tadpoles") FROM "pond" WHERE time >= '2019-11-11T21:36:00Z' AND time <= '2019-11-11T22:06:00Z' GROUP BY time(12m) fill(linear)
```
Output:
{{% influxql/table-meta %}}
Name: pond
{{% /influxql/table-meta %}}

| time    |  mean |
| :--------------| ------------------:|
| 2019-11-11T21:36:00Z |   |
| 2019-11-11T21:48:00Z |  |
| 2019-11-11T22:00:00Z | 6 |

{{% note %}}
**Note:** The data in Issue 3 are not in `NOAA` database. We had to create a dataset with less regular data to work with `fill(linear)`.
{{% /note %}}
