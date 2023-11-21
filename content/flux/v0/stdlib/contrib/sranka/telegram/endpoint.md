---
title: telegram.endpoint() function
description: >
  `telegram.endpoint()` sends a message to a Telegram channel using data from table rows.
menu:
  flux_v0_ref:
    name: telegram.endpoint
    parent: contrib/sranka/telegram
    identifier: contrib/sranka/telegram/endpoint
weight: 301
flux/v0/tags: [notification endpoints, transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/sranka/telegram/telegram.flux#L168-L196

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`telegram.endpoint()` sends a message to a Telegram channel using data from table rows.

### Usage

`telegram.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

#### `mapFn`
A function that builds the object used to generate the POST request. Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns an object that must include the following fields:

- `channel`
- `text`
- `silent`

For more information, see `telegram.message()` parameters.

See `telegram.message` parameters for more information.

##### Function type signature

```js
(
    token: string,
    ?disableWebPagePreview: A,
    ?parseMode: B,
    ?url: string,
) => (
    mapFn: (r: C) => {D with text: G, silent: F, channel: E},
) => (<-tables: stream[C]) => stream[{C with _sent: string}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url

URL of the Telegram bot endpoint. Default is `https://api.telegram.org/bot`.



### token
({{< req >}})
Telegram bot token.



### parseMode

[Parse mode](https://core.telegram.org/bots/api#formatting-options)
of the message text.
Default is `MarkdownV2`.



### disableWebPagePreview

Disable preview of web links in the sent message.
Default is false.




## Examples

### Send critical statuses to a Telegram channel

```js
import "influxdata/influxdb/secrets"
import "contrib/sranka/telegram"

token = secrets.get(key: "TELEGRAM_TOKEN")
endpoint = telegram.endpoint(token: token)

crit_statuses =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_statuses
    |> endpoint(
        mapFn: (r) => ({channel: "-12345", text: "Disk usage is **${r.status}**.", silent: true}),
    )()

```

