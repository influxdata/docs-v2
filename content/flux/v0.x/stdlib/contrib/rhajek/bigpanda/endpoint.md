---
title: bigpanda.endpoint() function
description: >
  `bigpanda.endpoint()` sends alerts to BigPanda using data from input rows.
menu:
  flux_0_x_ref:
    name: bigpanda.endpoint
    parent: contrib/rhajek/bigpanda
    identifier: contrib/rhajek/bigpanda/endpoint
weight: 301
flux/v0.x/tags: [notification endpoints, transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/rhajek/bigpanda/bigpanda.flux#L211-L232

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`bigpanda.endpoint()` sends alerts to BigPanda using data from input rows.



##### Function type signature

```js
(
    appKey: A,
    token: string,
    ?url: string,
) => (mapFn: (r: B) => {C with status: D}) => (<-tables: stream[B]) => stream[{B with _sent: string}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### url

BigPanda [alerts API URL](https://docs.bigpanda.io/reference#alerts-how-it-works).
Default is the value of the `bigpanda.defaultURL` option.



### token
({{< req >}})
BigPanda [API Authorization token (API key)](https://docs.bigpanda.io/docs/api-key-management).



### appKey
({{< req >}})
BigPanda [App Key](https://docs.bigpanda.io/reference#integrating-monitoring-systems).



