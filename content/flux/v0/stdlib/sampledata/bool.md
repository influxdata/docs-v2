---
title: sampledata.bool() function
description: >
  `sampledata.bool()` returns a sample data set with boolean values.
menu:
  flux_v0_ref:
    name: sampledata.bool
    parent: sampledata
    identifier: sampledata/bool
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/sampledata/sampledata.flux#L258-L262

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`sampledata.bool()` returns a sample data set with boolean values.



##### Function type signature

```js
(?includeNull: bool) => stream[A] where A: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### includeNull

Include null values in the returned dataset.
Default is `false`.




## Examples

### Output basic sample data with boolean values

```js
import "sampledata"

sampledata.bool()

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t1   | true    |
| 2021-01-01T00:00:10Z | t1   | true    |
| 2021-01-01T00:00:20Z | t1   | false   |
| 2021-01-01T00:00:30Z | t1   | true    |
| 2021-01-01T00:00:40Z | t1   | false   |
| 2021-01-01T00:00:50Z | t1   | false   |

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t2   | false   |
| 2021-01-01T00:00:10Z | t2   | true    |
| 2021-01-01T00:00:20Z | t2   | false   |
| 2021-01-01T00:00:30Z | t2   | true    |
| 2021-01-01T00:00:40Z | t2   | true    |
| 2021-01-01T00:00:50Z | t2   | false   |

{{% /expand %}}
{{< /expand-wrapper >}}
