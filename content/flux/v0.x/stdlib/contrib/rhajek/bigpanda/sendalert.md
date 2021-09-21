---
title: bigpanda.sendAlert() function
description: >
  The `bigpanda.sendAlert()` function sends an alert to BigPanda.
menu:
  flux_0_x_ref:
    name: bigpanda.sendAlert
    parent: bigpanda
weight: 202
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/bigpanda/sendAlert/
  - /influxdb/cloud/reference/flux/stdlib/contrib/bigpanda/sendAlert/
introduced: 0.108.0
---

The `bigpanda.sendAlert()` function sends an alert to [BigPanda](https://www.bigpanda.io/).

```js
import "contrib/rhajek/bigpanda"

bigpanda.sendAlert(
  url: "https://api.bigpanda.io/data/v2/alerts",
  token: "my5uP3rS3cRe7t0k3n",
  appKey: "example-app-key",
  status: "critical",
  rec: {},
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

### status {data-type="string"}
({{< req >}})
BigPanda [alert status](https://docs.bigpanda.io/reference#alerts).

**Supported statuses:**

- `ok`
- `critical`
- `warning`
- `acknowledged`

### rec {data-type="record"}
({{< req >}})
Additional [alert parameters](https://docs.bigpanda.io/reference#alert-object)
to send to the BigPanda alert API.

## Examples

##### Send the last reported value and status to BigPanda
```js
import "contrib/rhajek/bigpanda"
import "influxdata/influxdb/secrets"
import "json"

token = secrets.get(key: "BIGPANDA_API_KEY")

lastReported =
  from(bucket: "example-bucket")
    |> range(start: -1m)
    |> filter(fn: (r) =>
      r._measurement == "example-measurement" and
      r._field == "level"
    )
    |> last()
    |> findRecord(fn: (key) => true, idx: 0)

bigpanda.sendAlert(
  token: token,
  appKey: "example-app-key",
  status: bigpanda.statusFromLevel(level: "${lastReported.status}"),
  rec: {
    tags: json.encode(v: [{"name": "host", "value": "my-host"}]),
    check: "my-check",
    description: "${lastReported._field} is ${lastReported.status}: ${string(v: lastReported._value)}"
  }
)
```
