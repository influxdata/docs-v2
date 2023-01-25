---
title: Aggregate or apply selector functions to data
seotitle: Perform a basic SQL query in InfluxDB Cloud
description: >
  ...
menu:
  influxdb_cloud_iox:
    name: Aggregate data
    parent: Query with SQL
    identifier: query-sql-aggregate
weight: 202
influxdb/cloud-iox/tags: [query, sql]
list_code_example: |
  ##### Aggregate fields
  ```sql
  SELECT
    mean(field1) AS mean,
    selector_first(field2)['value'] as first,
    tag1
  FROM
    home
  GROUP BY
    tag
  ```

  ##### Aggregate by time-based intervals
  ```sql
  SELECT
    DATE_BIN(INTERVAL '1 hour', time, '2022-01-01T00:00:00Z'::TIMESTAMP) AS time,
    mean(field1),
    sum(field2),
    tag1
  FROM
    home
  GROUP BY
    time,
    tag1
  ```
---

<!-- PLACEHOLDER DOC -->

<!-- A SQL query that aggregates data includes the following clauses:

{{< req type="key" >}}

- {{< req "\*">}} `SELECT`: Identify specific fields and tags to query from a
  measurement or use the wild card alias (`*`) to select all fields and tags
  from a measurement.
- {{< req "\*">}} `FROM`: Identify the measurement to query.
  If coming from a SQL background, an InfluxDB measurement is the equivalent 
  of a relational table.
- `WHERE`: Only return data that meets defined conditions such as falling within
  a time range, containing specific tag values, etc.
- `GROUP BY`: Group data into SQL partitions and apply an aggregate or selector
  function to each group.

### Downsample data by applying interval-based aggregates

- `DATE_BIN` calculates windows of time based on a specified interval and updates
  the timestamp in the `time` column of each row based on the start boundary of
  the window that row's original timestamp is in.

  For example, if you use `DATE_BIN` to window data into one hour intervals,
  a row with a timestamp of `2023-01-01T12:34:56Z` will be updated with the new
  timestamp, `2023-01-01T12:00:00Z`.

```sql
SELECT
  DATE_BIN(INTERVAL '1 hour', time, '2022-01-01T00:00:00Z'::TIMESTAMP) AS time,
  mean(field1),
  sum(field2),
  tag1
FROM home
GROUP BY time, tag1
``` -->
