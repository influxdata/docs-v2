---
title: sensu.endpoint() function
description: >
  `sensu.endpoint()` sends an event
  to the [Sensu Events API](https://docs.sensu.io/sensu-go/latest/api/events/#create-a-new-event)
  using data from table rows.
menu:
  flux_0_x_ref:
    name: sensu.endpoint
    parent: contrib/sranka/sensu
    identifier: contrib/sranka/sensu/endpoint
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/sranka/sensu/sensu.flux#L201-L231

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`sensu.endpoint()` sends an event
to the [Sensu Events API](https://docs.sensu.io/sensu-go/latest/api/events/#create-a-new-event)
using data from table rows.
Output tables include a `_sent` column that indicates whether the
the row's notification was sent successfully (`true` or `false`).



##### Function type signature

```js
(
    apiKey: string,
    url: string,
    ?entityName: string,
    ?handlers: A,
    ?namespace: string,
) => (
    mapFn: (r: B) => {C with text: E, status: D, checkName: string},
) => (<-tables: stream[B]) => stream[{B with _sent: string}] where D: Equatable
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### url
({{< req >}})
Base URL of [Sensu API](https://docs.sensu.io/sensu-go/latest/migrate/#architecture)
*without a trailing slash*.
Example: `http://localhost:8080`.



### apiKey
({{< req >}})
Sensu [API Key](https://docs.sensu.io/sensu-go/latest/operations/control-access/).



### handlers

[Sensu handlers](https://docs.sensu.io/sensu-go/latest/reference/handlers/) to execute.
Default is `[]`.



### namespace

[Sensu namespace](https://docs.sensu.io/sensu-go/latest/reference/rbac/).
Default is `default`.



### entityName

Event source.
Default is `influxdb`.

Use alphanumeric characters, underscores (`_`), periods (`.`), and hyphens (`-`).
All other characters are replaced with an underscore.

