---
title: servicenow.endpoint() function
description: >
  The `servicenow.endpoint()` function sends events to [ServiceNow](https://servicenow.com)
  using data from input rows.
menu:
  flux_0_x_ref:
    name: servicenow.endpoint
    parent: servicenow
weight: 202
flux/v0.x/tags: [notification endpoints]
---

The `servicenow.endpoint()` function sends events to [ServiceNow](https://servicenow.com)
using data from input rows.

```js
import "contrib/bonitoo-io/servicenow"

servicenow.endpoint(
    url: "https://example-tenant.service-now.com/api/global/em/jsonv2",
    username: "example-username",
    password: "example-password"
)
```

## Parameters

### url {data-type="string"}
({{< req >}})
ServiceNow web service URL.

### username {data-type=" string"}
({{< req >}})
ServiceNow username to use for HTTP BASIC authentication.

### password {data-type="string"}
({{< req >}})
ServiceNow password to use for HTTP BASIC authentication.

## Usage
`servicenow.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn {data-type="function"}
A function that builds the object used to generate the ServiceNow API request.
Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns an object that must include the
following properties:

- `description`
- `severity`
- `source`
- `node`
- `metricType`
- `resource`
- `metricName`
- `messageKey`
- `additionalInfo`

_For more information, see [`servicenow.event()` parameters](/flux/v0.x/stdlib/contrib/bonitoo-io/servicenow/event/#parameters)._

## Examples

##### Send critical events to ServiceNow
```js
import "contrib/bonitoo-io/servicenow"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "SERVICENOW_USERNAME")
password = secrets.get(key: "SERVICENOW_PASSWORD")

endpoint = servicenow.endpoint(
    url: "https://example-tenant.service-now.com/api/global/em/jsonv2",
    username: username,
    password: password
)


crit_events = from(bucket: "example-bucket")
    |> range(start: -1m)
    |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_events
    |> endpoint(mapFn: (r) => ({
        node: r.host,
        metricType: r._measurement,
        resource: r.instance,
        metricName: r._field,
        severity: "critical",
        additionalInfo: { "devId": r.dev_id }
      })
    )()
```
