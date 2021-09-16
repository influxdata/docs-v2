---
title: Sort and limit data with Flux
seotitle: Sort and limit data in InfluxDB with Flux
list_title: Sort and limit
description: >
  Use `sort()` to order records within each table by specific columns and
  `limit()` to limit the number of records in output tables to a fixed number, `n`.
influxdb/v2.0/tags: [sort, limit]
menu:
  influxdb_2_0:
    name: Sort and limit
    parent: Query with Flux
weight: 203
aliases:
  - /influxdb/v2.0/query-data/guides/sort-limit/
related:
  - /{{< latest "flux" >}}/stdlib/universe/sort
  - /{{< latest "flux" >}}/stdlib/universe/limit
list_query_example: sort_limit
---

Use [`sort()`](/{{< latest "flux" >}}/stdlib/universe/sort)
to order records within each table by specific columns and
[`limit()`](/{{< latest "flux" >}}/stdlib/universe/limit)
to limit the number of records in output tables to a fixed number, `n`.

If you're just getting started with Flux queries, check out the following:

- [Get started with Flux](/{{< latest "flux" >}}//get-started/) for a conceptual overview of Flux and parts of a Flux query.
- [Execute queries](/influxdb/v2.0/query-data/execute-queries/) to discover a variety of ways to run your queries.

##### Example sorting system uptime

The following example orders system uptime first by region, then host, then value.

```js
from(bucket:"example-bucket")
  |> range(start:-12h)
  |> filter(fn: (r) =>
    r._measurement == "system" and
    r._field == "uptime"
  )
  |> sort(columns:["region", "host", "_value"])
```

The [`limit()` function](/{{< latest "flux" >}}/stdlib/universe/limit)
limits the number of records in output tables to a fixed number, `n`.
The following example shows up to 10 records from the past hour.

```js
from(bucket:"example-bucket")
  |> range(start:-1h)
  |> limit(n:10)
```

You can use `sort()` and `limit()` together to show the top N records.
The example below returns the 10 top system uptime values sorted first by
region, then host, then value.

```js
from(bucket:"example-bucket")
  |> range(start:-12h)
  |> filter(fn: (r) =>
    r._measurement == "system" and
    r._field == "uptime"
  )
  |> sort(columns:["region", "host", "_value"])
  |> limit(n:10)
```

You now have created a Flux query that sorts and limits data.
Flux also provides the [`top()`](/{{< latest "flux" >}}/stdlib/universe/top)
and [`bottom()`](/{{< latest "flux" >}}/stdlib/universe/bottom)
functions to perform both of these functions at the same time.
