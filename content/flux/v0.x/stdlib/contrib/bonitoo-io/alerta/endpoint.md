---
title: alerta.endpoint() function
description: >
  `alerta.endpoint()` sends alerts to Alerta using data from input rows.
menu:
  flux_0_x_ref:
    name: alerta.endpoint
    parent: contrib/bonitoo-io/alerta
    identifier: contrib/bonitoo-io/alerta/endpoint
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/alerta/alerta.flux#L189-L220

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`alerta.endpoint()` sends alerts to Alerta using data from input rows.



##### Function type signature

```js
(
    apiKey: string,
    url: string,
    ?environment: A,
    ?origin: B,
) => (
    mapFn: (
        r: C,
    ) => {
        D with
        value: t14,
        type: t13,
        timestamp: t12,
        text: t11,
        tags: t10,
        severity: J,
        service: I,
        resource: H,
        group: G,
        event: F,
        attributes: E,
    },
) => (<-tables: stream[C]) => stream[{C with _sent: string}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### url
({{< req >}})
(Required) Alerta URL.



### apiKey
({{< req >}})
(Required) Alerta API key.



### environment

Alert environment. Default is `""`.
Valid values: "Production", "Development" or empty string (default).



### origin

Alert origin. Default is `"InfluxDB"`.



