---
title: Get started with Flux
description: >
  Get started with Flux by learning important concepts of the Flux language.
menu:
  flux_0_x:
    name: Get started
weight: 1
---

Flux is a **functional data scripting** language designed to unify the processes
of querying, processing, analyzing, and acting on data into a single syntax.

## Flux from a high level
To understand how Flux works from a high level, consider the process of treating
and purifying water.

1.  Water is pulled from a large reservoir.
2.  The amount of water drawn is limited by demand.
3.  The water is piped through a series of stations that modify the water in some way
    (remove sediment, purify, treat with additives, etc.).
4.  The processed water is delivered to the end user in a state that is consumable.

<div class="flux-water-diagram"></div>

## Basic Flux query
As in the water treatment process above, a basic Flux script or query does the following:

1. Retrieves a limited amount of data from a potentially large data set.
2. Filters data based on time or column values.
3. Shapes and processes the data to transform it into the desired result.
4. Returns the result to the user.

The following examples represent basic Flux queries that return data from a data source
(InfluxDB, CSV, and PostgreSQL).

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
    query:"SELECT * FROM TestTable"
  )
  |> filter(fn: (r) => r.UserID == "123ABC456DEF")
  |> mean(column: "purchase_total")
  |> yield(name: "_results")
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Each example includes the following:

1. A `from()` function to retrieve data from the data source.
2. `range()`, `filter()`, or both to filter data based on column values.
3. A `mean()` function to calculate the average of values returned from the data source.
4. A `yield()` function to yield results to the user.

Flux is designed to retrieve data from data source and send it through a
processing pipeline that shapes the data into something usable by the user.

### Pipe-forward operator
In Flux script, functions are "chained" together using the **pipe-forward operator** (`|>`).
This operator takes the output of one function and pipes it forward as input for the next function.
Using the metaphor [above](#flux-from-a-high-level), the pipe-forward operator
is that pipe the carries water or data through the entire pipeline.

{{< page-nav next="/flux/v0.x/get-started/data-model/" >}}
