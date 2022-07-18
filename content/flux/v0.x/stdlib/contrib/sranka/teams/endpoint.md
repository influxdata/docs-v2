---
title: teams.endpoint() function
description: >
  `teams.endpoint()` sends a message to a Microsoft Teams channel using data from table rows.
menu:
  flux_0_x_ref:
    name: teams.endpoint
    parent: contrib/sranka/teams
    identifier: contrib/sranka/teams/endpoint
weight: 301
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/teams/endpoint/
  - /influxdb/cloud/reference/flux/stdlib/contrib/teams/endpoint/
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/sranka/teams/teams.flux#L126-L146

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`teams.endpoint()` sends a message to a Microsoft Teams channel using data from table rows.



##### Function type signature

```js
(
    url: string,
) => (
    mapFn: (r: A) => {B with title: C, text: string, summary: string},
) => (<-tables: stream[A]) => stream[{A with _sent: string}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### url
({{< req >}})
Incoming webhook URL.



