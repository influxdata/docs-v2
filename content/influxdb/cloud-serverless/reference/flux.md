---
title: Flux reference documentation
description: >
  Learn the Flux syntax and structure used to query InfluxDB.
menu:
  influxdb_cloud_serverless:
    name: Flux reference
    parent: Reference
weight: 103
---

All Flux reference material is provided in the Flux documentation:

<a class="btn" href="/flux/v0.x/">View the Flux documentation</a>

## Flux with the InfluxDB IOx storage engine

When querying data from an InfluxDB bucket powered by InfluxDB IOx, use the following
input functions:

- [`iox.from()`](/flux/v0.x/stdlib/experimental/iox/from/): alternative to
  [`from()`](/flux/v0.x/stdlib/influxdata/influxdb/from/).
- [`iox.sql()`](/flux/v0.x/stdlib/experimental/iox/sql/): execute a SQL query
  with Flux.

Both IOx-based input functions return pivoted data with a column for each field
in the output. To unpivot the data:

1.  Group by tag columns.
2.  Rename the `time` column to `_time`.
3.  Use [`experimental.unpivot()`](/flux/v0.x/stdlib/experimental/unpivot/) to
    unpivot the data. All columns not in the group key (other than `_time`) are
    treated as fields.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[iox.from()](#)
[iox.sql()](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```js
import "experimental"
import "experimental/iox"

iox.from(bucket: "example-bucket", measurement: "example-measurement")
    |> range(start: -1d)
    |> group(columns: ["tag1", "tag2". "tag3"])
    |> rename(columns: {time: "_time_"})
    |> experimental.unpivot()
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```js
import "experimental"
import "experimental/iox"

query = "SELECT * FROM \"example-measurement\" WHERE time >= now() - INTERVAL '1 day'"

iox.sql(bucket: "example-bucket", query: query)
    |> group(columns: ["tag1", "tag2". "tag3"])
    |> rename(columns: {time: "_time_"})
    |> experimental.unpivot()
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% warn %}}
#### Flux performance with InfluxDB IOx

When querying data from an InfluxDB bucket powered by InfluxDB IOx, using `iox.from()`
is **less performant** than querying a TSM-powered bucket with `from()`.
For better Flux query performance, use `iox.sql()`.
{{% /warn %}}
