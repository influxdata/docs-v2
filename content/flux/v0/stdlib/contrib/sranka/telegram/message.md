---
title: telegram.message() function
description: >
  `telegram.message()` sends a single message to a Telegram channel
  using the [`sendMessage`](https://core.telegram.org/bots/api#sendmessage) method of the Telegram Bot API.
menu:
  flux_v0_ref:
    name: telegram.message
    parent: contrib/sranka/telegram
    identifier: contrib/sranka/telegram/message
weight: 301
flux/v0.x/tags: [single notification]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/sranka/telegram/telegram.flux#L90-L111

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`telegram.message()` sends a single message to a Telegram channel
using the [`sendMessage`](https://core.telegram.org/bots/api#sendmessage) method of the Telegram Bot API.



##### Function type signature

```js
(
    channel: A,
    text: B,
    token: string,
    ?disableWebPagePreview: C,
    ?parseMode: D,
    ?silent: E,
    ?url: string,
) => int
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url

URL of the Telegram bot endpoint. Default is `https://api.telegram.org/bot`.



### token
({{< req >}})
Telegram bot token.



### channel
({{< req >}})
Telegram channel ID.



### text
({{< req >}})
Message text.



### parseMode

[Parse mode](https://core.telegram.org/bots/api#formatting-options)
of the message text.
Default is `MarkdownV2`.



### disableWebPagePreview

Disable preview of web links in the sent message.
Default is `false`.



### silent

Send message [silently](https://telegram.org/blog/channels-2-0#silent-messages).
Default is `true`.




## Examples

### Send the last reported status to Telegram

```js
import "influxdata/influxdb/secrets"
import "contrib/sranka/telegram"

token = secrets.get(key: "TELEGRAM_TOKEN")

lastReported =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "statuses")
        |> last()
        |> findRecord(fn: (key) => true, idx: 0)

telegram.message(token: token, channel: "-12345", text: "Disk usage is **${lastReported.status}**.")

```

