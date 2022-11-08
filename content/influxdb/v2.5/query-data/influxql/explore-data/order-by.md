---
title: Use the ORDER BY clause
list_title: ORDER BY clause
description: >
  Use the `ORDER BY` clause to sort data in ascending or descending order.
menu:
  influxdb_2_5:
    name: ORDER BY clause
    parent: Explore data
weight: 304
list_code_example: |
  ```sql
  SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] ORDER BY time DESC
  ```
---

Use the `ORDER BY` clause to sort data. 

- [Syntax](#syntax)
- [Examples](#examples)

## ORDER BY time DESC

By default, InfluxDB returns results in ascending time order; the first [point](/influxdb/v2.5/reference/glossary/#point)
returned has the oldest [timestamp](influxdb/v2.5/reference/glossary/#timestamp) and
the last point returned has the most recent timestamp.
`ORDER BY time DESC` reverses that order such that InfluxDB returns the points
with the most recent timestamps first.

### Syntax

```sql
SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] ORDER BY time DESC
```

`ORDER by time DESC` must appear after the `GROUP BY` clause if the query includes a `GROUP BY` clause.
`ORDER by time DESC` must appear after the `WHERE` clause if the query includes a `WHERE` clause and no `GROUP BY` clause.

### Examples

{{< expand-wrapper >}}

{{% expand "Return the newest points first" %}}

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' ORDER BY time DESC
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time   | water_level |
| :-------------- | ------------------:|
| 2019-09-17T21:42:00Z | 4.9380000000|
| 2019-09-17T21:36:00Z | 5.0660000000|
| 2019-09-17T21:30:00Z | 5.0100000000|
| 2019-09-17T21:24:00Z | 5.0130000000|
| 2019-09-17T21:18:00Z | 5.0720000000|

The query returns the points with the most recent timestamps from the
`h2o_feet` [measurement](/influxdb/v2.5/reference/glossary/#measurement) first.
Without `ORDER by time DESC`, the query would return the following output:

Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time   | water_level |
| :-------------- | ------------------:|
| 2019-08-17T00:00:00Z | 2.0640000000|
| 2019-08-17T00:06:00Z | 2.1160000000|
| 2019-08-17T00:12:00Z | 2.0280000000|
| 2019-08-17T00:18:00Z | 2.1260000000|

{{% /expand %}}

{{% expand "Return the newest points first and include a GROUP BY time() clause" %}}

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:42:00Z' GROUP BY time(12m) ORDER BY time DESC
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time   | mean |
| :-------------- | ------------------:|
| 2019-08-18T00:36:00Z | 4.9712860355|
| 2019-08-18T00:24:00Z | 5.1682500000|
| 2019-08-18T00:12:00Z | 5.3042500000|
| 2019-08-18T00:00:00Z | 5.4135000000|

The query uses the InfluxQL [MEAN() function](/influxdb/v2.5/query-data/influxql/view-functions/aggregates/#mean)
and a time interval in the [GROUP BY clause](/influxdb/v2.5/query-data/influxql/explore-data/group-by/)
to calculate the average `water_level` for each twelve-minute
interval in the query's time range.
[`ORDER BY time DESC`](/influxdb/v2.5/query-data/influxql/explore-data/order-by/#order-by-time-desc) returns the most recent 12-minute time intervals
first.

Without `ORDER BY time DESC`, the query would return the following output:

Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time   | mean |
| :-------------- | ------------------:|
| 2019-08-18T00:00:00Z | 5.4135000000|
| 2019-08-18T00:12:00Z | 5.3042500000|
| 2019-08-18T00:24:00Z | 5.1682500000|
| 2019-08-18T00:36:00Z | 4.9712860355|

{{% /expand %}}

{{< /expand-wrapper >}}
