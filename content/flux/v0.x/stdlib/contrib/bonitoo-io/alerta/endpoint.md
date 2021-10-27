---
title: alerta.endpoint() function
description: >
  The `alerta.endpoint()` function sends alerts to Alerta using data from input rows.
menu:
  flux_0_x_ref:
    name: alerta.endpoint
    parent: alerta
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/alerta/endpoint/
  - /influxdb/cloud/reference/flux/stdlib/contrib/alerta/endpoint/
flux/v0.x/tags: [transformations, notification endpoints]
introduced: 0.115.0
---

The `alerta.endpoint()` function sends alerts to [Alerta](https://alerta.io/)
using data from each input row.
Output tables include a `_sent` column that indicates whether the
the row's notification was sent successfully (`true` or `false`).

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

### url {data-type="string"}
({{< req >}})
Alerta URL.

### apiKey {data-type="string"}
({{< req >}})
Alerta API key.

### environment {data-type="string"}
Alert environment.
Default is `""`.

**Valid values:**

- `""`
- `"Production"`
- `"Development"`

### origin {data-type="string"}
Alert origin.
Default is `"InfluxDB"`.

## Usage
`alerta.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn {data-type="function"}
A function that builds the object used to generate the POST request.
Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns an object that must include the
following properties:

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

_For more information, see [`alerta.alert()` parameters](/flux/v0.x/stdlib/contrib/bonitoo-io/alerta/alert/#parameters)._

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
