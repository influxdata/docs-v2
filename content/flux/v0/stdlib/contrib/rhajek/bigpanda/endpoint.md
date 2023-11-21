---
title: bigpanda.endpoint() function
description: >
  `bigpanda.endpoint()` sends alerts to BigPanda using data from input rows.
menu:
  flux_v0_ref:
    name: bigpanda.endpoint
    parent: contrib/rhajek/bigpanda
    identifier: contrib/rhajek/bigpanda/endpoint
weight: 301
flux/v0/tags: [notification endpoints, transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/rhajek/bigpanda/bigpanda.flux#L214-L235

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`bigpanda.endpoint()` sends alerts to BigPanda using data from input rows.

### Usage
`bigpanda.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

#### mapFn
A function that builds the object used to generate the POST request. Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns an object that must include the following fields:

- `status`
- Additional [alert parameters](https://docs.bigpanda.io/reference#alert-object) to send to the BigPanda alert API.

_For more information, see `bigpanda.sendAlert()` parameters._

##### Function type signature

```js
(
    appKey: A,
    token: string,
    ?url: string,
) => (mapFn: (r: B) => {C with status: D}) => (<-tables: stream[B]) => stream[{B with _sent: string}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

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




## Examples

### Send critical alerts to BigPanda

```js
import "influxdata/influxdb/secrets"
import "json"

token = secrets.get(key: "BIGPANDA_API_KEY")
endpoint = bigpanda.endpoint(token: token, appKey: "example-app-key")

crit_events =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_events
    |> endpoint(
        mapFn: (r) => {
            return {r with status: "critical",
                check: "critical-status-check",
                description: "${r._field} is critical: ${string(v: r._value)}",
                tags: json.encode(v: [{"name": "host", "value": r.host}]),
            }
        },
    )()

```

