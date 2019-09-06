---
title: pagerduty.endpoint() function
description: >
  The `pagerduty.endpoint()` function sends a message to PagerDuty that includes output data.
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
  url: "https://events.pagerduty.com/v2/enqueue",
  token: "mySuPerSecRetTokEn"
)
```

## Parameters

### pagerdutyURL
The PagerDuty API URL.
Defaults to `https://events.pagerduty.com/v2/enqueue`.

_**Data type:** String_

### token
The [PagerDuty API token](https://support.pagerduty.com/docs/generating-api-keys#section-generating-a-general-access-rest-api-key)
used to interact with PagerDuty.
Defaults to `""`.

_**Data type:** String_

### mapFn
A function that builds the object used to generate the POST request.

{{% note %}}
_You should rarely need to override the default `mapFn` parameter.
To see the default `mapFn` value or for insight into possible overrides, view the
[`pagerduty.endpoint()` source code](https://github.com/influxdata/flux/blob/master/stdlib/pagerduty/pagerduty.flux)._
{{% /note %}}

_**Data type:** Function_

The returned object must include the following fields:

- `routingKey`
- `client`
- `client_url`
- `class`
- `group`
- `severity`
- `component`
- `source`
- `summary`
- `timestamp`

_For more information, see [`pagerduty.message()`](/v2.0/reference/flux/functions/pagerduty/message/)_

## Examples

##### Send critical statuses to a PagerDuty endpoint
```js
import "monitor"
import "pagerduty"

endpoint = pagerduty.endpoint(token: "mySuPerSecRetTokEn")

from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")
  |> map(fn: (r) => { return {r with status: r._status} })
  |> monitor.notify(endpoint: endpoint)
```
