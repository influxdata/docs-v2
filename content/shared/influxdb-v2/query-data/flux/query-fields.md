
Use [`filter()`](/flux/v0/stdlib/universe/filter/)
to query data based on fields, tags, or any other column value.
`filter()` performs operations similar to the `SELECT` statement and the `WHERE`
clause in InfluxQL and other SQL-like query languages.

## The filter() function
`filter()` has an `fn` parameter that expects a [predicate function](/influxdb/version/reference/glossary/#predicate-function),
an anonymous function comprised of one or more [predicate expressions](/influxdb/version/reference/glossary/#predicate-expression).
The predicate function evaluates each input row.
Rows that evaluate to `true` are **included** in the output data.
Rows that evaluate to `false` are **excluded** from the output data.

```js
// ...
    |> filter(fn: (r) => r._measurement == "example-measurement-name" )
```

The `fn` predicate function requires an `r` argument, which represents each row
as `filter()` iterates over input data.
Key-value pairs in the row record represent columns and their values.
Use [dot notation or bracket notation](/flux/v0/data-types/composite/record/#reference-values-in-a-record) 
to reference specific column values in the predicate function.
Use [logical operators](/flux/v0/spec/operators/#logical-operators)
to chain multiple predicate expressions together.

```js
// Row record
r = {foo: "bar", baz: "quz"}

// Example predicate function
(r) => r.foo == "bar" and r["baz"] == "quz"

// Evaluation results
(r) => true and true
```

## Filter by fields and tags
The combination of [`from()`](/flux/v0/stdlib/influxdata/influxdb/from),
[`range()`](/flux/v0/stdlib/universe/range),
and `filter()` represent the most basic Flux query:

1. Use `from()` to define your [bucket](/influxdb/version/reference/glossary/#bucket).
2. Use `range()` to limit query results by time.
3. Use `filter()` to identify what rows of data to output.

```js
from(bucket: "example-bucket")
    |> range(start: -1h)
    |> filter(fn: (r) => r._measurement == "example-measurement-name" and r.mytagname == "example-tag-value")
    |> filter(fn: (r) => r._field == "example-field-name")
```
