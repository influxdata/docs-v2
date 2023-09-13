---
title: servicenow.endpoint() function
description: >
  `servicenow.endpoint()` sends events to [ServiceNow](https://servicenow.com/) using data from input rows.
menu:
  flux_v0_ref:
    name: servicenow.endpoint
    parent: contrib/bonitoo-io/servicenow
    identifier: contrib/bonitoo-io/servicenow/endpoint
weight: 301
flux/v0.x/tags: [notification endpoints]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/servicenow/servicenow.flux#L203-L236

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`servicenow.endpoint()` sends events to [ServiceNow](https://servicenow.com/) using data from input rows.

### Usage

`servicenow.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

#### mapFn
A function that builds the object used to generate the ServiceNow API request. Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns an object that must include the following properties:

- `description`
- `severity`
- `source`
- `node`
- `metricType`
- `resource`
- `metricName`
- `messageKey`
- `additionalInfo`

For more information, see `servicenow.event()` parameters.

##### Function type signature

```js
(
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

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

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




## Examples

### Send critical events to ServiceNow

```js
import "contrib/bonitoo-io/servicenow"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "SERVICENOW_USERNAME")
password = secrets.get(key: "SERVICENOW_PASSWORD")

endpoint =
    servicenow.endpoint(
        url: "https://example-tenant.service-now.com/api/global/em/jsonv2",
        username: username,
        password: password,
    )

crit_events =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_events
    |> endpoint(
        mapFn: (r) =>
            ({
                node: r.host,
                metricType: r._measurement,
                resource: r.instance,
                metricName: r._field,
                severity: "critical",
                additionalInfo: {"devId": r.dev_id},
            }),
    )()

```

