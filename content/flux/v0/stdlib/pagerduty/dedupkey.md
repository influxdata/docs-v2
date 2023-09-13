---
title: pagerduty.dedupKey() function
description: >
  `pagerduty.dedupKey()` uses the group key of an input table to generate and store a
  deduplication key in the `_pagerdutyDedupKey`column.
  The function sorts, newline-concatenates, SHA256-hashes, and hex-encodes the
  group key to create a unique deduplication key for each input table.
menu:
  flux_v0_ref:
    name: pagerduty.dedupKey
    parent: pagerduty
    identifier: pagerduty/dedupKey
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/pagerduty/pagerduty.flux#L35-L38

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`pagerduty.dedupKey()` uses the group key of an input table to generate and store a
deduplication key in the `_pagerdutyDedupKey`column.
The function sorts, newline-concatenates, SHA256-hashes, and hex-encodes the
group key to create a unique deduplication key for each input table.



##### Function type signature

```js
(<-tables: stream[A], ?exclude: [string]) => stream[{A with _pagerdutyDedupKey: string}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### exclude

Group key columns to exclude when generating the deduplication key.
Default is ["_start", "_stop", "_level"].



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Add a PagerDuty deduplication key to output data

```js
import "pagerduty"
import "sampledata"

sampledata.int()
    |> pagerduty.dedupKey()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| _time                | _value  | *tag | _pagerdutyDedupKey                                               |
| -------------------- | ------- | ---- | ---------------------------------------------------------------- |
| 2021-01-01T00:00:00Z | -2      | t1   | 18fae60f7253ebb11c5cc79e69037f0320fec216b1be0c101a5575086a3ebd08 |
| 2021-01-01T00:00:10Z | 10      | t1   | 18fae60f7253ebb11c5cc79e69037f0320fec216b1be0c101a5575086a3ebd08 |
| 2021-01-01T00:00:20Z | 7       | t1   | 18fae60f7253ebb11c5cc79e69037f0320fec216b1be0c101a5575086a3ebd08 |
| 2021-01-01T00:00:30Z | 17      | t1   | 18fae60f7253ebb11c5cc79e69037f0320fec216b1be0c101a5575086a3ebd08 |
| 2021-01-01T00:00:40Z | 15      | t1   | 18fae60f7253ebb11c5cc79e69037f0320fec216b1be0c101a5575086a3ebd08 |
| 2021-01-01T00:00:50Z | 4       | t1   | 18fae60f7253ebb11c5cc79e69037f0320fec216b1be0c101a5575086a3ebd08 |

| _time                | _value  | *tag | _pagerdutyDedupKey                                               |
| -------------------- | ------- | ---- | ---------------------------------------------------------------- |
| 2021-01-01T00:00:00Z | 19      | t2   | e137b67e3ecac75539ab3f0c139e421433c389c7a9932a878aff5405712dc384 |
| 2021-01-01T00:00:10Z | 4       | t2   | e137b67e3ecac75539ab3f0c139e421433c389c7a9932a878aff5405712dc384 |
| 2021-01-01T00:00:20Z | -3      | t2   | e137b67e3ecac75539ab3f0c139e421433c389c7a9932a878aff5405712dc384 |
| 2021-01-01T00:00:30Z | 19      | t2   | e137b67e3ecac75539ab3f0c139e421433c389c7a9932a878aff5405712dc384 |
| 2021-01-01T00:00:40Z | 13      | t2   | e137b67e3ecac75539ab3f0c139e421433c389c7a9932a878aff5405712dc384 |
| 2021-01-01T00:00:50Z | 1       | t2   | e137b67e3ecac75539ab3f0c139e421433c389c7a9932a878aff5405712dc384 |

{{% /expand %}}
{{< /expand-wrapper >}}
