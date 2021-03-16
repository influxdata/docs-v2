---
title: zenoss.endpoint() function
description: >
  The `zenoss.endpoint()` function sends events to Zenoss using data from input rows.
menu:
  influxdb_2_0_ref:
    name: zenoss.endpoint
    parent: Zenoss
weight: 202
---

The `zenoss.endpoint()` function sends events to Zenoss using data from input rows.

_**Function type:** Output_

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

### url
({{< req >}})
Zenoss [router endpoint URL](https://help.zenoss.com/zsd/RM/configuring-resource-manager/enabling-access-to-browser-interfaces/creating-and-changing-public-endpoints).

_**Data type:** String_

### username
({{< req >}})
Zenoss username to use for HTTP BASIC authentication.
Default is `""` (no authentication).

_**Data type:**  String_

### password
({{< req >}})
Zenoss password to use for HTTP BASIC authentication.
Default is `""` (no authentication).

_**Data type:** String_

### action
Zenoss [router name](https://help.zenoss.com/dev/collection-zone-and-resource-manager-apis/anatomy-of-an-api-request#AnatomyofanAPIrequest-RouterURL).
Default is `"EventsRouter"`.

_**Data type:** String_

### method
[EventsRouter method](https://help.zenoss.com/dev/collection-zone-and-resource-manager-apis/codebase/routers/router-reference/eventsrouter).
Default is `"add_event"`.

_**Data type:** String_

### type
Event type.
Default is `"rpc"`.

_**Data type:** String_

### tid
Temporary request transaction ID.
Default is `1`.

_**Data type:** Integer_

## Usage
`zenoss.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn
A function that builds the object used to generate the POST request.
Requires an `r` parameter.

_**Data type:** Function_

`mapFn` accepts a table row (`r`) and returns an object that must include the
following fields:

- `summary`
- `device`
- `component`
- `severity`
- `eventClass`
- `eventClassKey`
- `collector`
- `message`

_For more information, see [`zenoss.event()` parameters](/influxdb/v2.0/reference/flux/stdlib/contrib/zenoss/event/#parameters)._

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

{{% note %}}
#### Package author and maintainer
**Github:** [@alespour](https://github.com/alespour), [@bonitoo-io](https://github.com/bonitoo-io)  
**InfluxDB Slack:** [@Ales Pour](https://influxdata.com/slack)
{{% /note %}}
