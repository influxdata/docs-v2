---
title: alerta.alert() function
description: >
  The `alerta.alert()` function sends an alert to Alerta.
menu:
  flux_0_x_ref:
    name: alerta.alert
    parent: alerta
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/alerta/alert/
  - /influxdb/cloud/reference/flux/stdlib/contrib/alerta/alert/
introduced: 0.115.0
---

The `alerta.alert()` function sends an alert to [Alerta](https://www.alerta.io/).

```js
import "contrib/bonitoo-io/alerta"

alerta.alert(
  url: "https://alerta.io:8080/alert",
  apiKey: "0Xx00xxXx00Xxx0x0X",
  resource: "example-resource",
  event: "Example event",
  environment: "",
  severity: "critical",
  service: [],
  group: "",
  value: "",
  text: "",
  tags: [],
  attributes: {},
  origin: "InfluxDB",
  type: "",
  timestamp: now(),
)
```

## Parameters

### url {data-type="string"}
({{< req >}})
Alerta URL.

### apiKey {data-type="string"}
({{< req >}})
Alerta API key.

### resource {data-type="string"}
({{< req >}})
Resource associated with the alert.

### event {data-type="string"}
({{< req >}})
Event name.

### environment {data-type="string"}
Alert environment.
Default is `""`.

**Valid values:**

- `""`
- `"Production"`
- `"Development"`

### severity {data-type="string"}
({{< req >}})
Event severity.
See [Alerta severities](https://docs.alerta.io/en/latest/api/alert.html#alert-severities).

### service {data-type="array of strings"}
List of affected services.
Default is `[]`.

### group {data-type="string"}
Alerta event group.
Default is `""`.

### value {data-type="string"}
Event value.
Default is `""`.

### text {data-type="string"}
Alert text description.
Default is `""`.

### tags {data-type="array of strings"}
List of event tags.
Default is `[]`.

### attributes {data-type="record"}
({{< req >}})
Alert attributes.

### origin {data-type="string"}
Alert origin.
Default is `"InfluxDB"`.

### type {data-type="string"}
Event type.
Default is `""`.

### timestamp {data-type="time"}
time alert was generated.
Default is `now()`.

## Examples

##### Send the last reported value and status to Alerta
```js
import "contrib/bonitoo-io/alerta"
import "influxdata/influxdb/secrets"

apiKey = secrets.get(key: "ALERTA_API_KEY")

lastReported =
  from(bucket: "example-bucket")
    |> range(start: -1m)
    |> filter(fn: (r) =>
      r._measurement == "example-measurement" and
      r._field == "level"
    )
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
