---
title: zenoss.event() function
description: >
  The `zenoss.event()` function sends an event to Zenoss.
menu:
  flux_0_x_ref:
    name: zenoss.event
    parent: zenoss
weight: 202
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/zenoss/event/
  - /influxdb/cloud/reference/flux/stdlib/contrib/zenoss/event/
introduced: 0.108.0
---

The `zenoss.event()` function sends an event to [Zenoss](https://www.zenoss.com/).

```js
import "contrib/bonitoo-io/zenoss"

zenoss.event(
  url: "https://example.zenoss.io:8080/zport/dmd/evconsole_router",
  username: "example-user",
  password: "example-password",
  action: "EventsRouter",
  method: "add_event",
  type: "rpc",
  tid: 1,
  summary: "",
  device: "",
  component: "",
  severity: "Critical",
  eventClass: "",
  eventClassKey: "",
  collector: "",
  message: ""
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

### summary {data-type="string"}
Event summary.
Default is `""`.

### device {data-type="string"}
Related device.
Default is `""`.

### component {data-type="string"}
Related component.
Default is `""`.

### severity {data-type="string"}
({{< req >}})
[Event severity level](https://help.zenoss.com/zsd/RM/administering-resource-manager/event-management/event-severity-levels).

**Supported values:**

- Critical
- Warning
- Info
- Clear

### eventClass {data-type="string"}
[Event class](https://help.zenoss.com/zsd/RM/administering-resource-manager/event-management/understanding-event-classes).
Default is `""`.

### eventClassKey {data-type="string"}
Event [class key](https://help.zenoss.com/zsd/RM/administering-resource-manager/event-management/event-fields).
Default is `""`.

### collector {data-type="string"}
Zenoss [collector](https://help.zenoss.com/zsd/RM/administering-resource-manager/event-management/event-fields).
Default is `""`.

### message {data-type="string"}
Related message.
Default is `""`.

## Examples

##### Send the last reported value and severity to Zenoss
```js
import "contrib/bonitoo-io/zenoss"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "ZENOSS_USERNAME")
password = secrets.get(key: "ZENOSS_PASSWORD")

lastReported =
  from(bucket: "example-bucket")
    |> range(start: -1m)
    |> filter(fn: (r) => r._measurement == "cpu" and r._field == "usage_idle")
    |> last()
    |> findRecord(fn: (key) => true, idx: 0)

zenoss.event(
    url: "https://tenant.zenoss.io:8080/zport/dmd/evconsole_router",
    username: username,
    username: password,
    device: lastReported.host,
    component: "CPU",
    eventClass: "/App",
    severity:
      if lastReported._value < 1.0 then "Critical"
      else if lastReported._value < 5.0 then "Warning"
      else if lastReported._value < 20.0 then "Info"
      else "Clear"
)
```
{{% note %}}
#### Package author and maintainer
**Github:** [@alespour](https://github.com/alespour), [@bonitoo-io](https://github.com/bonitoo-io)  
**InfluxDB Slack:** [@Ales Pour](https://influxdata.com/slack)
{{% /note %}}
