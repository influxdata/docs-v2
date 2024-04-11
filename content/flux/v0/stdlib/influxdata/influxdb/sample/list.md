---
title: sample.list() function
description: >
  `sample.list()` outputs information about available InfluxDB sample datasets.
menu:
  flux_v0_ref:
    name: sample.list
    parent: influxdata/influxdb/sample
    identifier: influxdata/influxdb/sample/list
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/sample/sample.flux#L133-L144

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`sample.list()` outputs information about available InfluxDB sample datasets.



##### Function type signature

```js
(
    
) => stream[{
    url: string,
    type: string,
    size: string,
    name: string,
    description: string,
}]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}


## Examples

### List available InfluxDB sample datasets

```js
import "influxdata/influxdb/sample"

sample.list()

```

