---
title: slack.endpoint() function
description: >
  `slack.endpoint()` returns a function that can be used to send a message to Slack per input row.
menu:
  flux_v0_ref:
    name: slack.endpoint
    parent: slack
    identifier: slack/endpoint
weight: 101
flux/v0.x/tags: [notification endpoints, transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/slack/slack.flux#L152-L173

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`slack.endpoint()` returns a function that can be used to send a message to Slack per input row.

Each output row includes a `_sent` column that indicates if the message for
that row was sent successfully.

### Usage
`slack.endpoint()` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

#### mapFn
A function that builds the record used to generate the POST request.

`mapFn` accepts a table row (`r`) and returns a record that must include the
following properties:

- channel
- color
- text

##### Function type signature

```js
(
    ?token: string,
    ?url: string,
) => (
    mapFn: (r: A) => {B with text: D, color: string, channel: C},
) => (<-tables: stream[A]) => stream[{A with _sent: string}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url

Slack API URL. Default is  `https://slack.com/api/chat.postMessage`.

If using the Slack webhook API, this URL is provided ine Slack webhook setup process.

### token

Slack API token. Default is `""`.

If using the Slack Webhook API, a token is not required.


## Examples

### Send status alerts to a Slack endpoint

```js
import "sampledata"
import "slack"

data =
    sampledata.int()
        |> map(fn: (r) => ({r with status: if r._value > 15 then "alert" else "ok"}))
        |> filter(fn: (r) => r.status == "alert")

data
    |> slack.endpoint(token: "mY5uP3rSeCr37T0kEN")(
        mapFn: (r) => ({channel: "Alerts", text: r._message, color: "danger"}),
    )()

```

