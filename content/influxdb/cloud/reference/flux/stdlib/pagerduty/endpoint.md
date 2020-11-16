---
title: pagerduty.endpoint() function
description: >
  The `pagerduty.endpoint()` function sends a message to PagerDuty that includes output data.
aliases:
  - /influxdb/cloud/reference/flux/functions/pagerduty/endpoint/
menu:
  influxdb_cloud_ref:
    name: pagerduty.endpoint
    parent: PagerDuty
weight: 202
influxdb/v2.0/tags: [endpoints]
---

The `pagerduty.endpoint()` function sends a message to PagerDuty that includes output data.

_**Function type:** Output_

```js
import "pagerduty"

pagerduty.endpoint(
  url: "https://events.pagerduty.com/v2/enqueue"
)
```

## Parameters

### pagerdutyURL
The PagerDuty API URL.
Defaults to `https://events.pagerduty.com/v2/enqueue`.

_**Data type:** String_

## Usage
`pagerduty.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn
A function that builds the record used to generate the POST request.
Requires an `r` parameter.

_**Data type:** Function_

The returned record must include the following fields:

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

_For more information, see [`pagerduty.sendEvent()`](/influxdb/cloud/reference/flux/stdlib/pagerduty/sendevent/)_

## Examples

##### Send critical statuses to a PagerDuty endpoint
```js
import "pagerduty"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "PAGERDUTY_TOKEN")
e = pagerduty.endpoint(token: token)

crit_statuses = from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_statuses
  |> e(mapFn: (r) => ({ r with
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
