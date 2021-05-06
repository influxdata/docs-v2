---
title: alerta.endpoint() function
description: >
  The `alerta.endpoint()` function sends alerts to Alerta using data from input rows.
menu:
  influxdb_2_0_ref:
    name: alerta.endpoint
    parent: Alerta
weight: 202
---

The `alerta.endpoint()` function sends alerts to [Alerta](https://alerta.io/)
using data from input rows.

_**Function type:** Output_

```js
import "contrib/bonitoo-io/alerta"

alerta.endpoint(
  url: "https://alerta.io:8080/alert,
  apiKey: "0Xx00xxXx00Xxx0x0X",
  environment: "",
  origin: "InfluxDB"
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

### environment
Alert environment.
Default is `""`.

_**Data type:** String_

**Valid values:**

- `""`
- `"Production"`
- `"Development"`

### origin
Alert origin.
Default is `"InfluxDB"`.

_**Data type:** String_

## Usage
`alerta.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn
A function that builds the object used to generate the POST request.
Requires an `r` parameter.

_**Data type:** Function_

`mapFn` accepts a table row (`r`) and returns an object that must include the
following fields:

- `resource`
- `event`
- `severity`
- `service`
- `group`
- `value`
- `text`
- `tags`
- `attributes`
- `type`
- `timestamp`

_For more information, see [`alerta.alert()` parameters](/influxdb/v2.0/reference/flux/stdlib/contrib/alerta/alert/#parameters)._

## Examples

##### Send critical alerts to Alerta
```js
import "contrib/bonitoo-io/alerta"
import "influxdata/influxdb/secrets"

apiKey = secrets.get(key: "ALERTA_API_KEY")
endpoint = alerta.endpoint(
  url: "https://alerta.io:8080/alert",
  apiKey: apiKey,
  environment: "Production",
  origin: "InfluxDB"
)

crit_events = from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_events
  |> endpoint(mapFn: (r) => {
    return { r with
      resource: "example-resource",
      event: "example-event",
      severity: "critical",
      service: r.service,
      group: "example-group",
      value: r.status,
      text: "Status is critical.",
      tags: ["ex1", "ex2"],
      attributes: {},
      type: "exampleAlertType",
      timestamp: now(),
    }
  })()
```
