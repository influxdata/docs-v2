---
title: pagerduty.endpoint() function
description: >
  The `pagerduty.endpoint()` function sends a message to PagerDuty that includes output data.
aliases:
  - /v2.0/reference/flux/functions/pagerduty/endpoint/
menu:
  v2_0_ref:
    name: pagerduty.endpoint
    parent: PagerDuty
weight: 202
v2.0/tags: [endpoints]
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
A function that builds the object used to generate the POST request.
Requires an `r` parameter.

_**Data type:** Function_

The returned object must include the following fields:

- `routingKey`
- `client`
- `client_url`
- `class`
- `dedupKey`
- `eventAction`
- `group`
- `severity`
- `component`
- `source`
- `summary`
- `timestamp`

_For more information, see [`pagerduty.sendEvent()`](/v2.0/reference/flux/stdlib/pagerduty/sendevent/)_

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
  |> e(mapFn: (r) => {
      obj = mapFn(r: r)      
      return {r with _sent: string(v: 2 == (sendEvent(pagerdutyURL: url,
        routingKey: obj.routingKey,
        client: obj.client,
        clientURL: obj.clientURL,
        dedupKey: r._pagerdutyDedupKey,
        class: obj.class,
        eventAction: obj.eventAction,
        group: obj.group,
        severity: obj.severity,
        component: obj.component,
        source: obj.source,
        summary: obj.summary,
        timestamp: obj.timestamp,
      ) / 100))}
    })
  })()
```
