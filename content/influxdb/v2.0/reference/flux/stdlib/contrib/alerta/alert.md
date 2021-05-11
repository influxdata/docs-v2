---
title: alerta.alert() function
description: >
  The `alerta.alert()` function sends an alert to Alerta.
menu:
  influxdb_2_0_ref:
    name: alerta.alert
    parent: Alerta
weight: 202
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

### url
({{< req >}})
Alerta URL.

_**Data type:** String_

### apiKey
({{< req >}})
Alerta API key.

_**Data type:** String_

### resource
({{< req >}})
Resource associated with the alert.

_**Data type:** String_

### event
({{< req >}})
Event name.

_**Data type:** String_

### environment
Alert environment.
Default is `""`.

_**Data type:** String_

**Valid values:**

- `""`
- `"Production"`
- `"Development"`

### severity
({{< req >}})
Event severity.
See [Alerta severities](https://docs.alerta.io/en/latest/api/alert.html#alert-severities).

_**Data type:** String_

### service
List of affected services.
Default is `[]`.

_**Data type:** Array of strings_

### group
Alerta event group.
Default is `""`.

_**Data type:** String_

### value
Event value.
Default is `""`.

_**Data type:** String_

### text
Alert text description.
Default is `""`.

_**Data type:** String_

### tags
List of event tags.
Default is `[]`.

_**Data type:** Array of strings_

### attributes
({{< req >}})
Alert attributes.

_**Data type:** Record_

### origin
Alert origin.
Default is `"InfluxDB"`.

_**Data type:** String_

### type
Event type.
Default is `""`.

_**Data type:** String_

### timestamp
time alert was generated.
Default is `now()`.

_**Data type:** Time_

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
