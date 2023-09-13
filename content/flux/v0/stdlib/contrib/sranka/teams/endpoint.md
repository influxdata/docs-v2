---
title: teams.endpoint() function
description: >
  `teams.endpoint()` sends a message to a Microsoft Teams channel using data from table rows.
menu:
  flux_v0_ref:
    name: teams.endpoint
    parent: contrib/sranka/teams
    identifier: contrib/sranka/teams/endpoint
weight: 301
flux/v0.x/tags: [notification endpoints, transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/sranka/teams/teams.flux#L128-L149

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`teams.endpoint()` sends a message to a Microsoft Teams channel using data from table rows.

### Usage
`teams.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

#### mapFn
A function that builds the object used to generate the POST request. Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns an object that must include the following fields:

- `title`
- `text`
- `summary`

For more information, see `teams.message` parameters.

##### Function type signature

```js
(
    url: string,
) => (
    mapFn: (r: A) => {B with title: C, text: string, summary: string},
) => (<-tables: stream[A]) => stream[{A with _sent: string}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url
({{< req >}})
Incoming webhook URL.




## Examples

### Send critical statuses to a Microsoft Teams channel

```js
import "contrib/sranka/teams"

url = "https://outlook.office.com/webhook/example-webhook"
endpoint = teams.endpoint(url: url)

crit_statuses =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_statuses
    |> endpoint(
        mapFn: (r) =>
            ({
                title: "Disk Usage",
                text: "Disk usage is: **${r.status}**.",
                summary: "Disk usage is ${r.status}",
            }),
    )()

```

