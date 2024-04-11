---
title: experimental.diff() function
description: >
  `experimental.diff()` takes two table streams as input and produces a diff.
menu:
  flux_v0_ref:
    name: experimental.diff
    parent: experimental
    identifier: experimental/diff
weight: 101

introduced: 0.175.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L1420-L1420

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.diff()` takes two table streams as input and produces a diff.

`experimental.diff()` compares tables with the same group key.
If compared tables are different, the function returns a table for that group key with one or more rows.
If there are no differences, the function does not return a table for that group key.

**Note:** `experimental.diff()` cannot tell the difference between an empty table and a non-existent table.

**Important:** The output format of the diff is not considered stable and the algorithm used to produce the diff may change.
The only guarantees are those mentioned above.

##### Function type signature

```js
(<-got: stream[A], want: stream[A]) => stream[{A with _diff: string}]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### want
({{< req >}})
Input stream for the `-` side of the diff.



### got

Input stream for the `+` side of the diff.




## Examples

- [Output a diff between two streams of tables](#output-a-diff-between-two-streams-of-tables)
- [Return a diff between a stream of tables and the expected output](#return-a-diff-between-a-stream-of-tables-and-the-expected-output)

### Output a diff between two streams of tables

```js
import "sampledata"
import "experimental"

want = sampledata.int()
got =
    sampledata.int()
        |> map(fn: (r) => ({r with _value: if r._value > 15 then r._value + 1 else r._value}))

experimental.diff(got: got, want: want)

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

### Return a diff between a stream of tables and the expected output

```js
import "experimental"

want = from(bucket: "backup-example-bucket") |> range(start: -5m)

from(bucket: "example-bucket")
    |> range(start: -5m)
    |> experimental.diff(want: want)

```

