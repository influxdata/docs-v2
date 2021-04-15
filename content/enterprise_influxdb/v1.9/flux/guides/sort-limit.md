---
title: Sort and limit data with Flux
seotitle: Sort and limit data in InfluxDB with Flux
list_title: Sort and limit
description: >
  Use the `sort()`function to order records within each table by specific columns and the
  `limit()` function to limit the number of records in output tables to a fixed number, `n`.
menu:
  enterprise_influxdb_1_9:
    name: Sort and limit
    parent: Query with Flux
weight: 3
list_query_example: sort_limit
canonical: /{{< latest "influxdb" "v2" >}}/query-data/flux/sort-limit/
v2: /influxdb/v2.0/query-data/flux/sort-limit/
---

Use the [`sort()`function](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/sort)
to order records within each table by specific columns and the
[`limit()` function](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/limit)
to limit the number of records in output tables to a fixed number, `n`.

If you're just getting started with Flux queries, check out the following:

- [Get started with Flux](/influxdb/v1.8/flux/get-started/) for a conceptual overview of Flux and parts of a Flux query.
- [Execute queries](/influxdb/v1.8/flux/guides/execute-queries/) to discover a variety of ways to run your queries.

##### Example sorting system uptime

The following example orders system uptime first by region, then host, then value.

```js
from(bucket:"db/rp")
  |> range(start:-12h)
  |> filter(fn: (r) =>
    r._measurement == "system" and
    r._field == "uptime"
  )
  |> sort(columns:["region", "host", "_value"])
```

The [`limit()` function](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/limit)
limits the number of records in output tables to a fixed number, `n`.
The following example shows up to 10 records from the past hour.

```js
from(bucket:"db/rp")
  |> range(start:-1h)
  |> limit(n:10)
```

You can use `sort()` and `limit()` together to show the top N records.
The example below returns the 10 top system uptime values sorted first by
region, then host, then value.

```js
from(bucket:"db/rp")
  |> range(start:-12h)
  |> filter(fn: (r) =>
    r._measurement == "system" and
    r._field == "uptime"
  )
  |> sort(columns:["region", "host", "_value"])
  |> limit(n:10)
```

You now have created a Flux query that sorts and limits data.
Flux also provides the [`top()`](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/selectors/top)
and [`bottom()`](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/selectors/bottom)
functions to perform both of these functions at the same time.
