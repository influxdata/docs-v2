---
title: zenoss.endpoint() function
description: >
  The `zenoss.endpoint()` function sends events to Zenoss using data from input rows.
menu:
  flux_0_x_ref:
    name: zenoss.endpoint
    parent: zenoss
weight: 202
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/zenoss/endpoint/
  - /influxdb/cloud/reference/flux/stdlib/contrib/zenoss/endpoint/
flux/v0.x/tags: [transformations, notification endpoints]
introduced: 0.108.0
---

The `zenoss.endpoint()` function sends events to Zenoss using data from input rows.
Output tables include a `_sent` column that indicates whether or not the
the row's notification sent successfully (`true` or `false`).

```js
import "contrib/bonitoo-io/zenoss"

zenoss.endpoint(
  url: "https://example.zenoss.io:8080/zport/dmd/evconsole_router",
  username: "example-user",
  password: "example-password",
  action: "EventsRouter",
  method: "add_event",
  type: "rpc",
  tid: 1
)
```

## Parameters

### url {data-type="string"}
({{< req >}})
Zenoss [router endpoint URL](https://help.zenoss.com/zsd/RM/configuring-resource-manager/enabling-access-to-browser-interfaces/creating-and-changing-public-endpoints).

### username {data-type="string"}
({{< req >}})
Zenoss username to use for HTTP BASIC authentication.
Default is `""` (no authentication).

### password {data-type="string"}
({{< req >}})
Zenoss password to use for HTTP BASIC authentication.
Default is `""` (no authentication).

### action {data-type="string"}
Zenoss [router name](https://help.zenoss.com/dev/collection-zone-and-resource-manager-apis/anatomy-of-an-api-request#AnatomyofanAPIrequest-RouterURL).
Default is `"EventsRouter"`.

### method {data-type="string"}
[EventsRouter method](https://help.zenoss.com/dev/collection-zone-and-resource-manager-apis/codebase/routers/router-reference/eventsrouter).
Default is `"add_event"`.

### type {data-type="string"}
Event type.
Default is `"rpc"`.

### tid {data-type="int"}
Temporary request transaction ID.
Default is `1`.

## Usage
`zenoss.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn {data-type="function"}
A function that builds the object used to generate the POST request.
Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns an object that must include the
following properties:

- `summary`
- `device`
- `component`
- `severity`
- `eventClass`
- `eventClassKey`
- `collector`
- `message`

_For more information, see [`zenoss.event()` parameters](/flux/v0.x/stdlib/contrib/bonitoo-io/zenoss/event/#parameters)._

## Examples

##### Send critical events to Zenoss
```js
import "contrib/bonitoo-io/zenoss"
import "influxdata/influxdb/secrets"

url = "https://tenant.zenoss.io:8080/zport/dmd/evconsole_router"
username = secrets.get(key: "ZENOSS_USERNAME")
password = secrets.get(key: "ZENOSS_PASSWORD")
endpoint = zenoss.endpoint(
  url: url,
  username: username,
  password: password
)

crit_events = from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_events
  |> endpoint(mapFn: (r) => ({
      summary: "Critical event for ${r.host}",
      device: r.deviceID,
      component: r.host,
      severity: "Critical",
      eventClass: "/App",
      eventClassKey: "",
      collector: "",
      message: "${r.host} is in a critical state.",
    })
  )()
```
