---
title: sensu.toSensuName() function
description: >
  `sensu.toSensuName()` translates a string value to a Sensu name
  by replacing non-alphanumeric characters (`[a-zA-Z0-9_.-]`) with underscores (`_`).
menu:
  flux_v0_ref:
    name: sensu.toSensuName
    parent: contrib/sranka/sensu
    identifier: contrib/sranka/sensu/toSensuName
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/sranka/sensu/sensu.flux#L36-L36

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`sensu.toSensuName()` translates a string value to a Sensu name
by replacing non-alphanumeric characters (`[a-zA-Z0-9_.-]`) with underscores (`_`).



##### Function type signature

```js
(v: string) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### v
({{< req >}})
String to operate on.




## Examples

### Convert a string into a Sensu name

```js
import "contrib/sranka/sensu"

sensu.toSensuName(v: "Example name conversion")// Returns "Example_name_conversion"


```

