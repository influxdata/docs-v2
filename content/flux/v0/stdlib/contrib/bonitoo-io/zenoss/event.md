---
title: zenoss.event() function
description: >
  `zenoss.event()` sends an event to [Zenoss](https://www.zenoss.com/).
menu:
  flux_v0_ref:
    name: zenoss.event
    parent: contrib/bonitoo-io/zenoss
    identifier: contrib/bonitoo-io/zenoss/event
weight: 301
flux/v0/tags: [single notification]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/zenoss/zenoss.flux#L90-L140

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`zenoss.event()` sends an event to [Zenoss](https://www.zenoss.com/).



##### Function type signature

```js
(
    severity: A,
    url: string,
    ?action: B,
    ?apiKey: C,
    ?collector: D,
    ?component: E,
    ?device: F,
    ?eventClass: G,
    ?eventClassKey: H,
    ?message: I,
    ?method: J,
    ?password: string,
    ?summary: K,
    ?tid: L,
    ?type: M,
    ?username: string,
) => int where C: Equatable
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### url
({{< req >}})
Zenoss [router endpoint URL](https://help.zenoss.com/zsd/RM/configuring-resource-manager/enabling-access-to-browser-interfaces/creating-and-changing-public-endpoints).



### username

Zenoss username to use for HTTP BASIC authentication.
Default is `""` (no authentication).



### password

Zenoss password to use for HTTP BASIC authentication.
Default is `""` (no authentication).



### apiKey

Zenoss cloud API key.
Default is `""` (no API key).



### action

Zenoss router name.
Default is "EventsRouter".



### method

[EventsRouter method](https://help.zenoss.com/dev/collection-zone-and-resource-manager-apis/codebase/routers/router-reference/eventsrouter).
Default is "add_event".



### type

Event type.
Default is "rpc".



### tid

Temporary request transaction ID.
Default is `1`.



### summary

Event summary.
Default is `""`.



### device

Related device.
Default is `""`.



### component

Related component.
Default is `""`.



### severity
({{< req >}})
[Event severity level](https://help.zenoss.com/zsd/RM/administering-resource-manager/event-management/event-severity-levels).

**Supported values**:
- Critical
- Warning
- Info
- Clear

### eventClass

[Event class](https://help.zenoss.com/zsd/RM/administering-resource-manager/event-management/understanding-event-classes).
Default is `""`.



### eventClassKey

Event [class key](https://help.zenoss.com/zsd/RM/administering-resource-manager/event-management/event-fields).
Default is `""`.



### collector

Zenoss [collector](https://help.zenoss.com/zsd/RM/administering-resource-manager/event-management/event-fields).
Default is `""`.



### message

Related message.
Default is `""`.




## Examples

### Send the last reported value and severity to Zenoss

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
        if lastReported._value < 1.0 then
            "Critical"
        else if lastReported._value < 5.0 then
            "Warning"
        else if lastReported._value < 20.0 then
            "Info"
        else
            "Clear",
)

```

