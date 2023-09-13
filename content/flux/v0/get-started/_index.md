---
title: Get started with Flux
description: >
  Get started with Flux by learning important concepts of the Flux language.
menu:
  flux_v0:
    name: Get started
weight: 1
related:
  - /resources/videos/purpose-of-flux/
---

Flux is a **functional data scripting** language designed to unify querying,
processing, analyzing, and acting on data into a single syntax.

## Flux overview
To understand how Flux works conceptually, consider the process of treating water.
Water is pulled from a source, limited by demand, piped through a series of stations
to modify (remove sediment, purify, and so on), and delivered in a consumable state.

<div class="flux-water-diagram"></div>

## Basic Flux query
Like treating water, a Flux query does the following:

1. Retrieves a specified amount of data from a source.
2. Filters data based on time or column values.
3. Processes and shapes data into expected results.
4. Returns the result.

To see how to retrieve data from a source, select the data source: InfluxDB, CSV, or PostgreSQL.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[InfluxDB](#)
[CSV](#)
[PostgreSQL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
from(bucket: "example-bucket")
    |> range(start: -1d)
    |> filter(fn: (r) => r._measurement == "example-measurement")
    |> mean()
    |> yield(name: "_results")
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
import "csv"

csv.from(file: "path/to/example/data.csv")
    |> range(start: -1d)
    |> filter(fn: (r) => r._measurement == "example-measurement")
    |> mean()
    |> yield(name: "_results")
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
import "sql"

sql.from(
    driverName: "postgres",
    dataSourceName: "postgresql://user:password@localhost",
    query: "SELECT * FROM TestTable",
)
    |> filter(fn: (r) => r.UserID == "123ABC456DEF")
    |> mean(column: "purchase_total")
    |> yield(name: "_results")
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Each example includes the following functions (in the order listed):

- [`from()`](/flux/v0/stdlib/influxdata/influxdb/from/) to retrieve data from the data source.
- [Pipe-forward operator (`|>`)](/flux/v0/get-started/syntax-basics/#pipe-forward-operator)
  to send the output of each function to the next function as input.
- [`range()`](/flux/v0/stdlib/universe/range/), [`filter()`](/flux/v0/stdlib/universe/filter/),
  or both to filter data based on column values.
- [`mean()`](/flux/v0/stdlib/universe/mean/) to calculate the average of values
  returned from the data source.
- [`yield()`](/flux/v0/stdlib/universe/yield/) to yield results to the user.

_For detailed information about basic Flux queries,
see [Flux query basics](/flux/v0/get-started/query-basics/)._

For an introduction to Flux and how it works with time series data, watch the following video:

{{< youtube QwOJttyg858 >}}

{{< page-nav next="/flux/v0/get-started/data-model/" >}}