---
title: opsgenie.endpoint() function
description: >
  `opsgenie.endpoint()` sends an alert message to Opsgenie using data from table rows.
menu:
  flux_v0_ref:
    name: opsgenie.endpoint
    parent: contrib/sranka/opsgenie
    identifier: contrib/sranka/opsgenie/endpoint
weight: 301
flux/v0/tags: [notification endpoints, transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/sranka/opsgenie/opsgenie.flux#L181-L209

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`opsgenie.endpoint()` sends an alert message to Opsgenie using data from table rows.

### Usage
opsgenie.endpoint is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

#### mapFn
A function that builds the record used to generate the POST request. Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns a record that must include the following fields:

- message
- alias
- description
- priority
- responders
- tags
- actions
- details
- visibleTo

For more information, see `opsgenie.sendAlert`.

##### Function type signature

```js
(
    apiKey: string,
    ?entity: string,
    ?url: string,
) => (
    mapFn: (
        r: A,
    ) => {
        B with
        visibleTo: [string],
        tags: E,
        responders: [string],
        priority: string,
        message: string,
        details: D,
        description: string,
        alias: string,
        actions: C,
    },
) => (<-tables: stream[A]) => stream[{A with _sent: string}] where D: Stringable
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### url

Opsgenie API URL. Defaults to `https://api.opsgenie.com/v2/alerts`.



### apiKey
({{< req >}})
(Required) Opsgenie API authorization key.



### entity

Alert entity used to specify the alert domain.




## Examples

### Send critical statuses to Opsgenie

```js
import "influxdata/influxdb/secrets"
import "contrib/sranka/opsgenie"

apiKey = secrets.get(key: "OPSGENIE_APIKEY")
endpoint = opsgenie.endpoint(apiKey: apiKey)

crit_statuses =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_statuses
    |> endpoint(
        mapFn: (r) =>
            ({
                message: "Great Scott!- Disk usage is: ${r.status}.",
                alias: "disk-usage-${r.status}",
                description: "",
                priority: "P3",
                responders: ["user:john@example.com", "team:itcrowd"],
                tags: [],
                entity: "my-lab",
                actions: [],
                details: "{}",
                visibleTo: [],
            }),
    )()

```

