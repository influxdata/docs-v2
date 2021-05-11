---
title: bigpanda.endpoint() function
description: >
  The `bigpanda.endpoint()` function sends alerts to BigPanda using data from input rows.
menu:
  flux_0_x_ref:
    name: bigpanda.endpoint
    parent: bigpanda
weight: 202
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/bigpanda/endpoint/
  - /influxdb/cloud/reference/flux/stdlib/contrib/bigpanda/endpoint/
flux/v0.x/tags: [notification endpoints]
introduced: 0.108.0
---

The `bigpanda.endpoint()` function sends alerts to [BigPanda](https://www.bigpanda.io/)
using data from input rows.

```js
import "contrib/rhajek/bigpanda"

bigpanda.endpoint(
  url: "https://api.bigpanda.io/data/v2/alerts",
  token: "my5uP3rS3cRe7t0k3n",
  appKey: "example-app-key"
)
```

## Parameters

### url {data-type="string"}
BigPanda [alerts API URL](https://docs.bigpanda.io/reference#alerts-how-it-works).
Default is the value of the [`bigpanda.defaultURL` option](/flux/v0.x/stdlib/contrib/rhajek/bigpanda/#defaulturl).

### token {data-type="string"}
({{< req >}})
BigPanda [API Authorization token (API key)](https://docs.bigpanda.io/docs/api-key-management).

### appKey {data-type="string"}
({{< req >}})
BigPanda [App Key](https://docs.bigpanda.io/reference#integrating-monitoring-systems).

## Usage
`bigpanda.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn {data-type="function"}
A function that builds the object used to generate the POST request.
Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns an object that must include the
following fields:

- `status`
- Additional [alert parameters](https://docs.bigpanda.io/reference#alert-object)
  to send to the BigPanda alert API.

_For more information, see [`bigpanda.sendAlert()` parameters](/flux/v0.x/stdlib/contrib/rhajek/bigpanda/sendalert/#parameters)._

## Examples

##### Send critical alerts to BigPanda
```js
import "contrib/rhajek/bigpanda"
import "influxdata/influxdb/secrets"
import "json"

token = secrets.get(key: "BIGPANDA_API_KEY")
endpoint = bigpanda.endpoint(
  token: token,
  appKey: "example-app-key"
)

crit_events = from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_events
  |> endpoint(mapFn: (r) => {
    return { r with
      status: "critical",
      check: "critical-status-check",
      description: "${r._field} is critical: ${string(v: r._value)}"
      tags: json.encode(v: [{"name": "host", "value": r.host}]),
    }
  })()
```

{{% note %}}
#### Package author and maintainer
**Github:** [@rhajek](https://github.com/rhajek), [@bonitoo-io](https://github.com/bonitoo-io)
{{% /note %}}
