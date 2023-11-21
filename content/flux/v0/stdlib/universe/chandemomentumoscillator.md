---
title: chandeMomentumOscillator() function
description: >
  `chandeMomentumOscillator()` applies the technical momentum indicator developed
  by Tushar Chande to input data.
menu:
  flux_v0_ref:
    name: chandeMomentumOscillator
    parent: universe
    identifier: universe/chandeMomentumOscillator
weight: 101
flux/v0/tags: [transformations]
introduced: 0.39.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L80-L83

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`chandeMomentumOscillator()` applies the technical momentum indicator developed
by Tushar Chande to input data.

The Chande Momentum Oscillator (CMO) indicator does the following:

1. Determines the median value of the each input table and calculates the
   difference between the sum of rows with values greater than the median
   and the sum of rows with values lower than the median.
2. Divides the result of step 1 by the sum of all data movement over a given
   time period.
3. Multiplies the result of step 2 by 100 and returns a value between -100 and +100.

#### Output tables
For each input table with `x` rows, `chandeMomentumOscillator()` outputs a
table with `x - n` rows.

##### Function type signature

```js
(<-tables: stream[A], n: int, ?columns: [string]) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### n
({{< req >}})
Period or number of points to use in the calculation.



### columns

List of columns to operate on. Default is `["_value"]`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Apply the Chande Momentum Oscillator to input data

```js
import "sampledata"

sampledata.int()
    |> chandeMomentumOscillator(n: 2)

```

