---
title: bigpanda.sendAlert() function
description: >
  `bigpanda.sendAlert()` sends an alert to [BigPanda](https://www.bigpanda.io/).
menu:
  flux_v0_ref:
    name: bigpanda.sendAlert
    parent: contrib/rhajek/bigpanda
    identifier: contrib/rhajek/bigpanda/sendAlert
weight: 301
flux/v0/tags: [single notification]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/rhajek/bigpanda/bigpanda.flux#L142-L157

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`bigpanda.sendAlert()` sends an alert to [BigPanda](https://www.bigpanda.io/).



##### Function type signature

```js
(
    appKey: A,
    rec: B,
    status: C,
    token: string,
    url: string,
) => int
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### url
({{< req >}})
BigPanda [alerts API URL](https://docs.bigpanda.io/reference#alerts-how-it-works).
Default is the value of the `bigpanda.defaultURL` option.



### token
({{< req >}})
BigPanda [API Authorization token (API key)](https://docs.bigpanda.io/docs/api-key-management).



### appKey
({{< req >}})
BigPanda [App Key](https://docs.bigpanda.io/reference#integrating-monitoring-systems).



### status
({{< req >}})
BigPanda [alert status](https://docs.bigpanda.io/reference#alerts).

Supported statuses:
- `ok`
- `critical`
- `warning`
- `acknowledged`

### rec
({{< req >}})
Additional [alert parameters](https://docs.bigpanda.io/reference#alert-object) to send to the BigPanda alert API.




## Examples

### Send the last reported value and status to BigPanda

```js
import "contrib/rhajek/bigpanda"
import "influxdata/influxdb/secrets"
import "json"

token = secrets.get(key: "BIGPANDA_API_KEY")

lastReported =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "example-measurement" and r._field == "level")
        |> last()
        |> findRecord(fn: (key) => true, idx: 0)

bigpanda.sendAlert(
    token: token,
    appKey: "example-app-key",
    status: bigpanda.statusFromLevel(level: "${lastReported.status}"),
    rec: {
        tags: json.encode(v: [{"name": "host", "value": "my-host"}]),
        check: "my-check",
        description: "${lastReported._field} is ${lastReported.status}: ${string(
                v: lastReported._value,
            )}",
    },
)

```

