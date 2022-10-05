---
title: Join data with Flux
seotitle: Join data in InfluxDB with Flux
list_title: Join
description: This guide walks through joining data with Flux and outlines how it shapes your data in the process.
influxdb/v2.4/tags: [join, flux]
menu:
  influxdb_2_4:
    name: Join
    parent: Query with Flux
weight: 210
aliases:
  - /influxdb/v2.4/query-data/guides/join/
related:
  - /{{< latest "flux" >}}/join-data/
  - /{{< latest "flux" >}}/join-data/inner/
  - /{{< latest "flux" >}}/join-data/left-outer/
  - /{{< latest "flux" >}}/join-data/right-outer/
  - /{{< latest "flux" >}}/join-data/full-outer/
  - /{{< latest "flux" >}}/join-data/time/
  - /{{< latest "flux" >}}/stdlib/join/
list_query_example: join-new
---

Use the Flux [`join` package](/{{< latest "flux" >}}/stdlib/join/) to join two data sets
based on common values using the following join methods:

{{< flex >}}
{{< flex-content "quarter" >}}
  <p style="text-align:center"><strong>Inner join</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="inner small center" >}}
{{< /flex-content >}}
{{< flex-content "quarter" >}}
  <p style="text-align:center"><strong>Left outer join</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="left small center" >}}
{{< /flex-content >}}
{{< flex-content "quarter" >}}
  <p style="text-align:center"><strong>Right outer join</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="right small center" >}}
{{< /flex-content >}}
{{< flex-content "quarter" >}}
  <p style="text-align:center"><strong>Full outer join</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="full small center" >}}
{{< /flex-content >}}
{{< /flex >}}

The join package lets you join data from different data sources such as
[InfluxDB](/{{< latest "flux" >}}/query-data/influxdb/), [SQL database](/{{< latest "flux" >}}/query-data/sql/),
[CSV](/{{< latest "flux" >}}/query-data/csv/), and [others](/{{< latest "flux" >}}/query-data/).

## Use join functions to join your data

{{< tabs-wrapper >}}
{{% tabs %}}
[Inner join](#)
[Left join](#)
[Right join](#)
[Full outer join](#)
[Join on time](#)
{{% /tabs %}}

<!--------------------------------- BEGIN Inner --------------------------------->
{{% tab-content %}}

1. Import the `join` package.
2. Define the **left** and **right** data streams to join:

    - Each stream must have one or more columns with common values.
      Column labels do not need to match, but column values do.
    - Each stream should have identical [group keys](/{{< latest "flux" >}}/get-started/data-model/#group-key).

    _For more information, see [join data requirements](/{{< latest "flux" >}}/join-data/#data-requirements)._

3. Use [`join.inner()`](/{{< latest "flux" >}}/stdlib/join/inner/) to join the two streams together.
    Provide the following required parameters:

    - `left`: Stream of data representing the left side of the join.
    - `right`: Stream of data representing the right side of the join.
    - `on`: [Join predicate](/{{< latest "flux" >}}/join-data/#join-predicate-function-on).
      For example: `(l, r) => l.column == r.column`.
    - `as`: [Join output function](/{{< latest "flux" >}}/join-data/#join-output-function-as)
      that returns a record with values from each input stream.
      For example: `(l, r) => ({l with column1: r.column1, column2: r.column2})`.

```js
import "join"
import "sql"

left =
    from(bucket: "example-bucket-1")
        |> range(start: "-1h")
        |> filter(fn: (r) => r._measurement == "example-measurement")
        |> filter(fn: (r) => r._field == "example-field")

right =
    sql.from(
        driverName: "postgres",
        dataSourceName: "postgresql://username:password@localhost:5432",
        query: "SELECT * FROM example_table",
    )

join.inner(
    left: left,
    right: right,
    on: (l, r) => l.column == r.column,
    as: (l, r) => ({l with name: r.name, location: r.location}),
)
```

For more information and detailed examples, see [Perform an inner join](/{{< latest "flux" >}}/join-data/inner/)
in the Flux documentation.

{{% /tab-content %}}
<!--------------------------------- END Inner --------------------------------->

<!------------------------------ BEGIN Left outer ----------------------------->
{{% tab-content %}}

1. Import the `join` package.
2. Define the **left** and **right** data streams to join:

    - Each stream must have one or more columns with common values.
      Column labels do not need to match, but column values do.
    - Each stream should have identical [group keys](/{{< latest "flux" >}}/get-started/data-model/#group-key).

    _For more information, see [join data requirements](/{{< latest "flux" >}}/join-data/#data-requirements)._

3. Use [`join.left()`](/{{< latest "flux" >}}/stdlib/join/left/) to join the two streams together.
    Provide the following required parameters:

    - `left`: Stream of data representing the left side of the join.
    - `right`: Stream of data representing the right side of the join.
    - `on`: [Join predicate](/{{< latest "flux" >}}/join-data/#join-predicate-function-on).
      For example: `(l, r) => l.column == r.column`.
    - `as`: [Join output function](/{{< latest "flux" >}}/join-data/#join-output-function-as)
      that returns a record with values from each input stream.
      For example: `(l, r) => ({l with column1: r.column1, column2: r.column2})`.

```js
import "join"
import "sql"

left =
    from(bucket: "example-bucket-1")
        |> range(start: "-1h")
        |> filter(fn: (r) => r._measurement == "example-measurement")
        |> filter(fn: (r) => r._field == "example-field")

right =
    sql.from(
        driverName: "postgres",
        dataSourceName: "postgresql://username:password@localhost:5432",
        query: "SELECT * FROM example_table",
    )

join.left(
    left: left,
    right: right,
    on: (l, r) => l.column == r.column,
    as: (l, r) => ({l with name: r.name, location: r.location}),
)
```

For more information and detailed examples, see [Perform a left outer join](/{{< latest "flux" >}}/join-data/left-outer/)
in the Flux documentation.

{{% /tab-content %}}
<!------------------------------- END Left outer ------------------------------>

<!----------------------------- BEGIN Right outer ----------------------------->
{{% tab-content %}}

1. Import the `join` package.
2. Define the **left** and **right** data streams to join:

    - Each stream must have one or more columns with common values.
      Column labels do not need to match, but column values do.
    - Each stream should have identical [group keys](/{{< latest "flux" >}}/get-started/data-model/#group-key).

    _For more information, see [join data requirements](/{{< latest "flux" >}}/join-data/#data-requirements)._

3. Use [`join.right()`](/{{< latest "flux" >}}/stdlib/join/right/) to join the two streams together.
    Provide the following required parameters:

    - `left`: Stream of data representing the left side of the join.
    - `right`: Stream of data representing the right side of the join.
    - `on`: [Join predicate](/{{< latest "flux" >}}/join-data/#join-predicate-function-on).
      For example: `(l, r) => l.column == r.column`.
    - `as`: [Join output function](/{{< latest "flux" >}}/join-data/#join-output-function-as)
      that returns a record with values from each input stream.
      For example: `(l, r) => ({l with column1: r.column1, column2: r.column2})`.

```js
import "join"
import "sql"

left =
    from(bucket: "example-bucket-1")
        |> range(start: "-1h")
        |> filter(fn: (r) => r._measurement == "example-measurement")
        |> filter(fn: (r) => r._field == "example-field")

right =
    sql.from(
        driverName: "postgres",
        dataSourceName: "postgresql://username:password@localhost:5432",
        query: "SELECT * FROM example_table",
    )

join.right(
    left: left,
    right: right,
    on: (l, r) => l.column == r.column,
    as: (l, r) => ({l with name: r.name, location: r.location}),
)
```

For more information and detailed examples, see [Perform a right outer join](/{{< latest "flux" >}}/join-data/right-outer/)
in the Flux documentation.

{{% /tab-content %}}
<!------------------------------ END Right outer ------------------------------>

<!------------------------------ BEGIN Full outer ----------------------------->
{{% tab-content %}}
1. Import the `join` package.
2. Define the **left** and **right** data streams to join:

    - Each stream must have one or more columns with common values.
      Column labels do not need to match, but column values do.
    - Each stream should have identical [group keys](/{{< latest "flux" >}}/get-started/data-model/#group-key).

    _For more information, see [join data requirements](/{{< latest "flux" >}}/join-data/#data-requirements)._

3. Use [`join.full()`](/{{< latest "flux" >}}/stdlib/join/full/) to join the two streams together.
    Provide the following required parameters:

    - `left`: Stream of data representing the left side of the join.
    - `right`: Stream of data representing the right side of the join.
    - `on`: [Join predicate](/{{< latest "flux" >}}/join-data/#join-predicate-function-on).
      For example: `(l, r) => l.column == r.column`.
    - `as`: [Join output function](/{{< latest "flux" >}}/join-data/#join-output-function-as)
      that returns a record with values from each input stream.
      For example: `(l, r) => ({l with column1: r.column1, column2: r.column2})`.

{{% note %}}
Full outer joins must account for non-group-key columns in both `l` and `r`
records being null. Use conditional logic to check which record contains non-null
values for columns not in the group key.
For more information, see [Account for missing, non-group-key values](/{{< latest "flux" >}}/join-data/full-outer/#account-for-missing-non-group-key-values).
{{% /note %}}

```js
import "join"
import "sql"

left =
    from(bucket: "example-bucket-1")
        |> range(start: "-1h")
        |> filter(fn: (r) => r._measurement == "example-measurement")
        |> filter(fn: (r) => r._field == "example-field")

right =
    sql.from(
        driverName: "postgres",
        dataSourceName: "postgresql://username:password@localhost:5432",
        query: "SELECT * FROM example_table",
    )

join.full(
    left: left,
    right: right,
    on: (l, r) => l.id== r.id,
    as: (l, r) => {
        id = if exists l.id then l.id else r.id
        
        return {name: l.name, location: r.location, id: id}
    },
)
```

For more information and detailed examples, see [Perform a full outer join](/{{< latest "flux" >}}/join-data/full-outer/)
in the Flux documentation.

{{% /tab-content %}}
<!------------------------------- END Full outer ------------------------------>

<!----------------------------- BEGIN Join on time ---------------------------->
{{% tab-content %}}

1. Import the `join` package.
2. Define the **left** and **right** data streams to join:

    - Each stream must also have a `_time` column.
    - Each stream must have one or more columns with common values.
      Column labels do not need to match, but column values do.
    - Each stream should have identical [group keys](/{{< latest "flux" >}}/get-started/data-model/#group-key).

    _For more information, see [join data requirements](/{{< latest "flux" >}}/join-data/#data-requirements)._

3. Use [`join.time()`](/{{< latest "flux" >}}/stdlib/join/time/) to join the two streams
    together based on time values.
    Provide the following parameters:

    - `left`: ({{< req >}}) Stream of data representing the left side of the join.
    - `right`: ({{< req >}}) Stream of data representing the right side of the join.
    - `as`: ({{< req >}}) [Join output function](/{{< latest "flux" >}}/join-data/#join-output-function-as)
      that returns a record with values from each input stream.
      For example: `(l, r) => ({r with column1: l.column1, column2: l.column2})`.
    - `method`: Join method to use. Default is `inner`.

```js
import "join"
import "sql"

left =
    from(bucket: "example-bucket-1")
        |> range(start: "-1h")
        |> filter(fn: (r) => r._measurement == "example-m1")
        |> filter(fn: (r) => r._field == "example-f1")

right =
    from(bucket: "example-bucket-2")
        |> range(start: "-1h")
        |> filter(fn: (r) => r._measurement == "example-m2")
        |> filter(fn: (r) => r._field == "example-f2")

join.time(method: "left", left: left, right: right, as: (l, r) => ({l with f2: r._value}))
```

For more information and detailed examples, see [Join on time](/{{< latest "flux" >}}/join-data/time/)
in the Flux documentation.

{{% /tab-content %}}
<!--------------------------=--- END Join on time -------------=--------------->
{{< /tabs-wrapper >}}

---

## When to use union and pivot instead of join functions

We recommend using the `join` package to join streams that have mostly different
schemas or that come from two separate data sources.
If you're joining two datasets queried from InfluxDB, using
[`union()`](/{{< latest "flux" >}}/stdlib/universe/union/) and [`pivot()`](/{{< latest "flux" >}}/stdlib/universe/pivot/)
to combine the data will likely be more performant.

For example, if you need to query fields from different InfluxDB buckets and align
field values in each row based on time:

```js
f1 =
    from(bucket: "example-bucket-1")
        |> range(start: "-1h")
        |> filter(fn: (r) => r._field == "f1")
        |> drop(columns: "_measurement")

f2 =
    from(bucket: "example-bucket-2")
        |> range(start: "-1h")
        |> filter(fn: (r) => r._field == "f2")
        |> drop(columns: "_measurement")

union(tables: [f1, f2])
    |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
```
{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input
{{< flex >}}
{{% flex-content %}}
##### f1
| _time                | _field | _value |
| :------------------- | :----- | -----: |
| 2020-01-01T00:01:00Z | f1     |      1 |
| 2020-01-01T00:02:00Z | f1     |      2 |
| 2020-01-01T00:03:00Z | f1     |      1 |
| 2020-01-01T00:04:00Z | f1     |      3 |
{{% /flex-content %}}
{{% flex-content %}}
##### f2
| _time                | _field | _value |
| :------------------- | :----- | -----: |
| 2020-01-01T00:01:00Z | f2     |      5 |
| 2020-01-01T00:02:00Z | f2     |     12 |
| 2020-01-01T00:03:00Z | f2     |      8 |
| 2020-01-01T00:04:00Z | f2     |      6 |
{{% /flex-content %}}
{{< /flex >}}

#### Output
| _time                |  f1 |  f2 |
| :------------------- | --: | --: |
| 2020-01-01T00:01:00Z |   1 |   5 |
| 2020-01-01T00:02:00Z |   2 |  12 |
| 2020-01-01T00:03:00Z |   1 |   8 |
| 2020-01-01T00:04:00Z |   3 |   6 |

{{% /expand %}}
{{< /expand-wrapper >}}
