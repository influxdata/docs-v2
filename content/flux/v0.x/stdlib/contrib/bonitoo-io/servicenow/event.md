---
title: servicenow.event() function
description: >
  The `servicenow.event()` function sends an event to ServiceNow.
menu:
  flux_0_x_ref:
    name: servicenow.event
    parent: servicenow
weight: 202
flux/v0.x/tags: [single notification]
---

The `servicenow.event()` function sends an event to [ServiceNow](https://servicenow.com).

```js
import "contrib/bonitoo-io/servicenow"

servicenow.event(
    url: "https://example-tenant.service-now.com/api/global/em/jsonv2",
    username: "example-username",
    password: "example-password",
    description: "Example event description.",
    severity: "minor",
    source: "",
    node: "",
    metricType: "",
    resource: "",
    metricName: "",
    messageKey: "",
    additionalInfo: {}
)
```

## Parameters

_ServiceNow Event API fields are described in [ServiceNow Create Event documentation](https://docs.servicenow.com/bundle/paris-it-operations-management/page/product/event-management/task/t_EMCreateEventManually.html)._

### url {data-type="string"}
({{< req >}})
ServiceNow web service URL.

### username {data-type=" string"}
({{< req >}})
ServiceNow username to use for HTTP BASIC authentication.

### password {data-type="string"}
({{< req >}})
ServiceNow password to use for HTTP BASIC authentication.

### description {data-type="string"}
({{< req >}})
Event description.

### severity {data-type="string"}
({{< req >}})
Severity of the event.

**Supported values:**

- `critical`
- `major`
- `minor`
- `warning`
- `info`
- `clear`

### source {data-type="string"}
Source name.
Default is `"Flux"`.

### node {data-type="string"}
Node name or IP address related to the event.
Default is an empty string (`""`).

### metricType {data-type="string"}
Metric type related to the event (for example, `CPU`).
Default is an empty string (`""`).

### resource {data-type="string"}
Resource related to the event (for example, `CPU-1`).
Default is an empty string (`""`).

### metricName {data-type="string"}
Metric name related to the event (for example, `usage_idle`).
Default is an empty string (`""`).

### messageKey {data-type="string"}
Unique identifier of the event (for example, the InfluxDB alert ID).
Default is an empty string (`""`).
If an empty string, ServiceNow generates a value.

### additionalInfo {data-type="record"}
Additional information to include with the event.

## Examples

##### Send the last reported value and incident type to ServiceNow
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
        if lastReported._value < 1.0 then "critical"
        else if lastReported._value < 5.0 then "warning"
        else "info",
    additionalInfo: {"devId": r.dev_id}
)
```
