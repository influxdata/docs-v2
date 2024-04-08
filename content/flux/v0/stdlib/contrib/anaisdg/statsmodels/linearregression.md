---
title: statsmodels.linearRegression() function
description: >
  `statsmodels.linearRegression()` performs a linear regression.
menu:
  flux_v0_ref:
    name: statsmodels.linearRegression
    parent: contrib/anaisdg/statsmodels
    identifier: contrib/anaisdg/statsmodels/linearRegression
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/anaisdg/statsmodels/linearreg.flux#L45-L93

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`statsmodels.linearRegression()` performs a linear regression.

It calculates and returns [*ŷ*](https://en.wikipedia.org/wiki/Hat_operator#Estimated_value) (`y_hat`),
and [residual sum of errors](https://en.wikipedia.org/wiki/Residual_sum_of_squares) (`rse`).
Output data includes the following columns:

- **N**: Number of points in the calculation.
- **slope**: Slope of the calculated regression.
- **sx**: Sum of x.
- **sxx**: Sum of x squared.
- **sxy**: Sum of x*y.
- **sy**: Sum of y.
- **errors**: Residual sum of squares.
  Defined by `(r.y - r.y_hat) ^ 2` in this context
- **x**: An index [1,2,3,4...n], with the assumption that the timestamps are regularly spaced.
- **y**: Field value
- **y\_hat**: Linear regression values

##### Function type signature

```js
(
    <-tables: stream[A],
) => stream[{
    B with
    y_hat: float,
    y: float,
    x: float,
    sy: H,
    sxy: G,
    sxx: F,
    sx: E,
    slope: D,
    errors: float,
    N: C,
}] where A: Record, D: Divisible + Subtractable
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Perform a linear regression on a dataset

```js
import "contrib/anaisdg/statsmodels"
import "sampledata"

sampledata.float()
    |> statsmodels.linearRegression()

```

