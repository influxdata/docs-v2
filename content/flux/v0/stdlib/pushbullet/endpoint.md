---
title: pushbullet.endpoint() function
description: >
  `pushbullet.endpoint()` creates the endpoint for the Pushbullet API and sends a notification of type note.
menu:
  flux_v0_ref:
    name: pushbullet.endpoint
    parent: pushbullet
    identifier: pushbullet/endpoint
weight: 101
flux/v0.x/tags: [notification endpoints, transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/pushbullet/pushbullet.flux#L111-L131

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`pushbullet.endpoint()` creates the endpoint for the Pushbullet API and sends a notification of type note.

### Usage
`pushbullet.endpoint()` is a factory function that outputs another function.
The output function requires a mapFn parameter.

#### mapFn
A function that builds the record used to generate the API request.
Requires an `r` parameter.

`mapF`n accepts a table row (`r`) and returns a record that must include the
following properties (as defined in `pushbullet.pushNote()`):

- title
- text

##### Function type signature

```js
(
    ?token: A,
    ?url: string,
) => (mapFn: (r: B) => {C with title: E, text: D}) => (<-tables: stream[B]) => stream[{B with _sent: string}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url

PushBullet API endpoint URL. Default is `"https://api.pushbullet.com/v2/pushes"`.



### token

Pushbullet API token string.  Default is `""`.




## Examples

### Send push notifications to Pushbullet

```js
import "pushbullet"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "PUSHBULLET_TOKEN")

crit_statuses =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "statuses" and r.status == "crit")

crit_statuses
    |> pushbullet.endpoint(token: token)(
        mapFn: (r) =>
            ({
                title: "${r.component} is critical",
                text: "${r.component} is critical. {$r._field} is {r._value}.",
            }),
    )()

```

