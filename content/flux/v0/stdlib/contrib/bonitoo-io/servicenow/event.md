---
title: servicenow.event() function
description: >
  `servicenow.event()` sends an event to [ServiceNow](https://servicenow.com/).
menu:
  flux_v0_ref:
    name: servicenow.event
    parent: contrib/bonitoo-io/servicenow
    identifier: contrib/bonitoo-io/servicenow/event
weight: 301
flux/v0.x/tags: [single notification]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/servicenow/servicenow.flux#L83-L136

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`servicenow.event()` sends an event to [ServiceNow](https://servicenow.com/).

ServiceNow Event API fields are described in
[ServiceNow Create Event documentation](https://docs.servicenow.com/bundle/paris-it-operations-management/page/product/event-management/task/t_EMCreateEventManually.html).

##### Function type signature

```js
(
    description: A,
    password: string,
    severity: B,
    url: string,
    username: string,
    ?additionalInfo: C,
    ?messageKey: D,
    ?metricName: E,
    ?metricType: F,
    ?node: G,
    ?resource: H,
    ?source: I,
) => int where B: Equatable, C: Equatable
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



### description
({{< req >}})
Event description.



### severity
({{< req >}})
Severity of the event.

Supported values:
- `critical`
- `major`
- `minor`
- `warning`
- `info`
- `clear`

### source

Source name. Default is `"Flux"`.



### node

Node name or IP address related to the event.
Default is an empty string (`""`).



### metricType

Metric type related to the event (for example, `CPU`).
Default is an empty string (`""`).



### resource

Resource related to the event (for example, `CPU-1`).
Default is an empty string (`""`).



### metricName

Metric name related to the event (for example, `usage_idle`).
Default is an empty string (`""`).



### messageKey

Unique identifier of the event (for example, the InfluxDB alert ID).
Default is an empty string (`""`).
If an empty string, ServiceNow generates a value.



### additionalInfo

Additional information to include with the event.




## Examples

### Send the last reported value and incident type to ServiceNow

```js
import "contrib/bonitoo-io/servicenow"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "SERVICENOW_USERNAME")
password = secrets.get(key: "SERVICENOW_PASSWORD")

lastReported =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "cpu" and r._field == "usage_idle")
        |> last()
        |> findRecord(fn: (key) => true, idx: 0)

servicenow.event(
    url: "https://tenant.service-now.com/api/global/em/jsonv2",
    username: username,
    password: password,
    node: lastReported.host,
    metricType: lastReported._measurement,
    resource: lastReported.instance,
    metricName: lastReported._field,
    severity:
        if lastReported._value < 1.0 then
            "critical"
        else if lastReported._value < 5.0 then
            "warning"
        else
            "info",
    additionalInfo: {"devId": r.dev_id},
)

```

