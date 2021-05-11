---
title: pagerduty.endpoint() function
description: >
  The `pagerduty.endpoint()` function sends a message to PagerDuty that includes output data.
aliases:
  - /influxdb/v2.0/reference/flux/functions/pagerduty/endpoint/
  - /influxdb/v2.0/reference/flux/stdlib/pagerduty/endpoint/
  - /influxdb/cloud/reference/flux/stdlib/pagerduty/endpoint/
menu:
  flux_0_x_ref:
    name: pagerduty.endpoint
    parent: pagerduty
weight: 202
flux/v0.x/tags: [notification endpoints]
introduced: 0.43.0
---

The `pagerduty.endpoint()` function sends a message to PagerDuty that includes output data.

```js
import "pagerduty"

pagerduty.endpoint(
  url: "https://events.pagerduty.com/v2/enqueue"
)
```

## Parameters

### pagerdutyURL {data-type="string"}
The PagerDuty API URL.
Default is `https://events.pagerduty.com/v2/enqueue`.

## Usage
`pagerduty.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn {data-type="function"}
({{< req >}}) A function that builds the record used to generate the POST request.
Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns a record that must include the following fields:

- `routingKey`
- `client`
- `client_url`
- `class`
- `eventAction`
- `group`
- `severity`
- `component`
- `source`
- `summary`
- `timestamp`

_For more information, see [`pagerduty.sendEvent()`](/flux/v0.x/stdlib/pagerduty/sendevent/)_

## Examples

##### Send critical statuses to a PagerDuty endpoint
```js
import "pagerduty"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "PAGERDUTY_TOKEN")
toPagerDuty = pagerduty.endpoint(token: token)

crit_statuses = from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "statuses" and r.status == "crit")

crit_statuses
  |> toPagerDuty(mapFn: (r) => ({ r with
      routingKey: r.routingKey,
      client: r.client,
      clientURL: r.clientURL,
      class: r.class,
      eventAction: r.eventAction,
      group: r.group,
      severity: r.severity,
      component: r.component,
      source: r.source,
      summary: r.summary,
      timestamp: r._time,
    })
  )()
```
