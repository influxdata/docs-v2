---
title: bigpanda.endpoint() function
description: >
  The `bigpanda.endpoint()` function sends alerts to BigPanda using data from input rows.
menu:
  influxdb_2_0_ref:
    name: bigpanda.endpoint
    parent: BigPanda
weight: 202
---

The `bigpanda.endpoint()` function sends alerts to [BigPanda](https://www.bigpanda.io/)
using data from input rows.

_**Function type:** Output_

```js
import "contrib/rhajek/bigpanda"

bigpanda.endpoint(
  url: "https://api.bigpanda.io/data/v2/alerts",
  token: "my5uP3rS3cRe7t0k3n",
  appKey: "example-app-key"
)
```

## Parameters

### url
BigPanda [alerts API URL](https://docs.bigpanda.io/reference#alerts-how-it-works).
Default is the value of the [`bigpanda.defaultURL` option](/influxdb/v2.0/reference/flux/stdlib/contrib/bigpanda/#defaulturl).

_**Data type:** String_

### token
({{< req >}})
BigPanda [API Authorization token (API key)](https://docs.bigpanda.io/docs/api-key-management).

_**Data type:** String_

### appKey
({{< req >}})
BigPanda [App Key](https://docs.bigpanda.io/reference#integrating-monitoring-systems).

_**Data type:** String_

## Usage
`bigpanda.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn
A function that builds the object used to generate the POST request.
Requires an `r` parameter.

_**Data type:** Function_

`mapFn` accepts a table row (`r`) and returns an object that must include the
following fields:

- `status`
- Additional [alert parameters](https://docs.bigpanda.io/reference#alert-object)
  to send to the BigPanda alert API.

_For more information, see [`bigpanda.sendAlert()` parameters](/influxdb/v2.0/reference/flux/stdlib/contrib/bigpanda/sendalert/#parameters)._

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
