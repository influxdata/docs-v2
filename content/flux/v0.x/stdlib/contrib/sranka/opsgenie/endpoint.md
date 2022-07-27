---
title: opsgenie.endpoint() function
description: >
  `opsgenie.endpoint()` sends an alert message to Opsgenie using data from table rows.
menu:
  flux_0_x_ref:
    name: opsgenie.endpoint
    parent: contrib/sranka/opsgenie
    identifier: contrib/sranka/opsgenie/endpoint
weight: 301
flux/v0.x/tags: [notification endpoints, transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/sranka/opsgenie/opsgenie.flux#L178-L206

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`opsgenie.endpoint()` sends an alert message to Opsgenie using data from table rows.



##### Function type signature

```js
(
    apiKey: string,
    ?entity: string,
    ?url: string,
) => (
    mapFn: (
        r: A,
    ) => {
        B with
        visibleTo: [string],
        tags: E,
        responders: [string],
        priority: string,
        message: string,
        details: D,
        description: string,
        alias: string,
        actions: C,
    },
) => (<-tables: stream[A]) => stream[{A with _sent: string}] where D: Stringable
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### url

Opsgenie API URL. Defaults to `https://api.opsgenie.com/v2/alerts`.



### apiKey
({{< req >}})
(Required) Opsgenie API authorization key.



### entity

Alert entity used to specify the alert domain.



