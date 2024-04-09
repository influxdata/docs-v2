---
title: alerta.endpoint() function
description: >
  `alerta.endpoint()` sends alerts to Alerta using data from input rows.
menu:
  flux_v0_ref:
    name: alerta.endpoint
    parent: contrib/bonitoo-io/alerta
    identifier: contrib/bonitoo-io/alerta/endpoint
weight: 301
flux/v0/tags: [notification endpoints, transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/alerta/alerta.flux#L191-L222

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`alerta.endpoint()` sends alerts to Alerta using data from input rows.

### Usage
`alerta.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

#### mapFn
A function that builds the object used to generate the POST request. Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns an object that must include the following fields:

- `resource`
- `event`
- `severity`
- `service`
- `group`
- `value`
- `text`
- `tags`
- `attributes`
- `type`
- `timestamp`

For more information, see `alerta.alert()` parameters.

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
        value: O,
        type: N,
        timestamp: M,
        text: L,
        tags: K,
        severity: J,
        service: I,
        resource: H,
        group: G,
        event: F,
        attributes: E,
    },
) => (<-tables: stream[C]) => stream[{C with _sent: string}]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### url
({{< req >}})
(Required) Alerta URL.



### apiKey
({{< req >}})
(Required) Alerta API key.



### environment

Alert environment. Default is `""`.
Valid values: "Production", "Development", or empty string (default).



### origin

Alert origin. Default is `"InfluxDB"`.




## Examples

### Send critical alerts to Alerta

```js
import "contrib/bonitoo-io/alerta"
import "influxdata/influxdb/secrets"

apiKey = secrets.get(key: "ALERTA_API_KEY")
endpoint =
    alerta.endpoint(
        url: "https://alerta.io:8080/alert",
        apiKey: apiKey,
        environment: "Production",
        origin: "InfluxDB",
    )

crit_events =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_events
    |> endpoint(
        mapFn: (r) => {
            return {r with
                resource: "example-resource",
                event: "example-event",
                severity: "critical",
                service: r.service,
                group: "example-group",
                value: r.status,
                text: "Status is critical.",
                tags: ["ex1", "ex2"],
                attributes: {},
                type: "exampleAlertType",
                timestamp: now(),
            }
        },
    )()

```

