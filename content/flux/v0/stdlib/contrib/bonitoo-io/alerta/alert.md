---
title: alerta.alert() function
description: >
  `alerta.alert()` sends an alert to [Alerta](https://alerta.io/).
menu:
  flux_v0_ref:
    name: alerta.alert
    parent: contrib/bonitoo-io/alerta
    identifier: contrib/bonitoo-io/alerta/alert
weight: 301
flux/v0/tags: [single notification]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/alerta/alerta.flux#L76-L115

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`alerta.alert()` sends an alert to [Alerta](https://alerta.io/).



##### Function type signature

```js
(
    apiKey: string,
    attributes: A,
    event: B,
    resource: C,
    severity: D,
    url: string,
    ?environment: E,
    ?group: F,
    ?origin: G,
    ?service: H,
    ?tags: I,
    ?text: J,
    ?timestamp: K,
    ?type: L,
    ?value: M,
) => int
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url
({{< req >}})
(Required) Alerta URL.



### apiKey
({{< req >}})
(Required) Alerta API key.



### resource
({{< req >}})
(Required) Resource associated with the alert.



### event
({{< req >}})
(Required) Event name.



### environment

Alerta environment. Valid values: "Production", "Development" or empty string (default).



### severity
({{< req >}})
(Required) Event severity. See [Alerta severities](https://docs.alerta.io/en/latest/api/alert.html#alert-severities).



### service

List of affected services. Default is `[]`.



### group

Alerta event group. Default is `""`.



### value

Event value.  Default is `""`.



### text

Alerta text description. Default is `""`.



### tags

List of event tags. Default is `[]`.



### attributes
({{< req >}})
(Required) Alert attributes.



### origin

monitoring component.



### type

Event type. Default is `""`.



### timestamp

time alert was generated. Default is `now()`.




## Examples

### Send the last reported value and status to Alerta

```js
import "contrib/bonitoo-io/alerta"
import "influxdata/influxdb/secrets"

apiKey = secrets.get(key: "ALERTA_API_KEY")

lastReported =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "example-measurement" and r._field == "level")
        |> last()
        |> findRecord(fn: (key) => true, idx: 0)

severity = if lastReported._value > 50 then "warning" else "ok"

alerta.alert(
    url: "https://alerta.io:8080/alert",
    apiKey: apiKey,
    resource: "example-resource",
    event: "Example event",
    environment: "Production",
    severity: severity,
    service: ["example-service"],
    group: "example-group",
    value: string(v: lastReported._value),
    text: "Service is ${severity}. The last reported value was ${string(v: lastReported._value)}.",
    tags: ["ex1", "ex2"],
    attributes: {},
    origin: "InfluxDB",
    type: "exampleAlertType",
    timestamp: now(),
)

```

