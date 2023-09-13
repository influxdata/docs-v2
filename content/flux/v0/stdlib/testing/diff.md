---
title: testing.diff() function
description: >
  `testing.diff()` produces a diff between two streams.
menu:
  flux_v0_ref:
    name: testing.diff
    parent: testing
    identifier: testing/diff
weight: 101
flux/v0.x/tags: [tests]
introduced: 0.18.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/testing/testing.flux#L144-L155

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`testing.diff()` produces a diff between two streams.

The function matches tables from each stream based on group keys.
For each matched table, it produces a diff.
Any added or removed rows are added to the table as a row.
An additional string column with the name diff is created and contains a
`-` if the row was present in the `got` table and not in the `want` table or
`+` if the opposite is true.

`diff()` function emits at least one row if the tables are
different and no rows if the tables are the same.
The exact diff produced may change.
`diff()` can be used to perform in-line diffs in a query.

##### Function type signature

```js
(
    <-got: stream[A],
    want: stream[A],
    ?epsilon: B,
    ?nansEqual: C,
    ?verbose: D,
) => stream[{A with _diff: string}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### got

Stream containing data to test. Default is piped-forward data (`<-`).



### want
({{< req >}})
Stream that contains data to test against.



### epsilon

Specify how far apart two float values can be, but still considered equal. Defaults to 0.000000001.



### verbose

Include detailed differences in output. Default is `false`.



### nansEqual

Consider `NaN` float values equal. Default is `false`.




## Examples

- [Output a diff between two streams of tables](#output-a-diff-between-two-streams-of-tables)
- [Return a diff between a stream of tables an the expected output](#return-a-diff-between-a-stream-of-tables-an-the-expected-output)

### Output a diff between two streams of tables

```js
import "sampledata"
import "testing"

want = sampledata.int()
got =
    sampledata.int()
        |> map(fn: (r) => ({r with _value: if r._value > 15 then r._value + 1 else r._value}))

testing.diff(got: got, want: want)

```

{{< expand-wrapper >}}
{{% expand "View example input" %}}

#### Input data

| _diff  | *tag | _time                | _value  |
| ------ | ---- | -------------------- | ------- |
|        | t1   | 2021-01-01T00:00:00Z | -2      |
|        | t1   | 2021-01-01T00:00:10Z | 10      |
|        | t1   | 2021-01-01T00:00:20Z | 7       |
| -      | t1   | 2021-01-01T00:00:30Z | 17      |
| +      | t1   | 2021-01-01T00:00:30Z | 18      |
|        | t1   | 2021-01-01T00:00:40Z | 15      |
|        | t1   | 2021-01-01T00:00:50Z | 4       |

| _diff  | *tag | _time                | _value  |
| ------ | ---- | -------------------- | ------- |
| -      | t2   | 2021-01-01T00:00:00Z | 19      |
| +      | t2   | 2021-01-01T00:00:00Z | 20      |
|        | t2   | 2021-01-01T00:00:10Z | 4       |
|        | t2   | 2021-01-01T00:00:20Z | -3      |
| -      | t2   | 2021-01-01T00:00:30Z | 19      |
| +      | t2   | 2021-01-01T00:00:30Z | 20      |
|        | t2   | 2021-01-01T00:00:40Z | 13      |
|        | t2   | 2021-01-01T00:00:50Z | 1       |

{{% /expand %}}
{{< /expand-wrapper >}}

### Return a diff between a stream of tables an the expected output

```js
import "testing"

want = from(bucket: "backup-example-bucket") |> range(start: -5m)

from(bucket: "example-bucket")
    |> range(start: -5m)
    |> testing.diff(want: want)

```

