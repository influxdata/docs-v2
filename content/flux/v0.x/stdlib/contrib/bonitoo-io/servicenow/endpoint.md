---
title: servicenow.endpoint() function
description: >
  `servicenow.endpoint()` sends events to [ServiceNow](https://servicenow.com/) using data from input rows.
menu:
  flux_0_x_ref:
    name: servicenow.endpoint
    parent: contrib/bonitoo-io/servicenow
    identifier: contrib/bonitoo-io/servicenow/endpoint
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/servicenow/servicenow.flux#L194-L223

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`servicenow.endpoint()` sends events to [ServiceNow](https://servicenow.com/) using data from input rows.



##### Function type signature

```js
servicenow.endpoint = (
    password: string,
    url: string,
    username: string,
    ?source: A,
) => (
    mapFn: (
        r: B,
    ) => {
        C with
        severity: J,
        resource: I,
        node: H,
        metricType: G,
        metricName: F,
        messageKey: E,
        description: D,
    },
) => (<-tables: stream[B]) => stream[{B with _sent: string}] where J: Equatable
```

## Parameters

### url

({{< req >}})
ServiceNow web service URL.

### username

({{< req >}})
ServiceNow username to use for HTTP BASIC authentication.

### password

({{< req >}})
ServiceNow password to use for HTTP BASIC authentication.

### source


Source name. Default is `"Flux"`.

