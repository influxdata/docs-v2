---
title: telegram.message() function
description: >
  The `telegram.message()` function sends a single message to a Telegram channel using
  the [`sendMessage` method of the Telegram Bot API](https://core.telegram.org/bots/api#sendmessage).
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/telegram/message/
  - /influxdb/cloud/reference/flux/stdlib/contrib/telegram/message/
menu:
  flux_0_x_ref:
    name: telegram.message
    parent: telegram
weight: 201
introduced: 0.70.0
---

The `telegram.message()` function sends a single message to a Telegram channel using
the [`sendMessage` method of the Telegram Bot API](https://core.telegram.org/bots/api#sendmessage).

_**Function type:** Output_

```js
import "contrib/sranka/telegram"

telegram.message(
  url: "https://api.telegram.org/bot",
  token: "S3crEtTel3gRamT0k3n",
  channel: "-12345",
  text: "Example message text",
  parseMode: "MarkdownV2",
  disableWebPagePreview: false,
  silent: true
)
```

{{% note %}}
For information about retrieving your Telegram **bot token** and **channel ID**,
see [Set up a Telegram bot](/v2.0/reference/flux/stdlib/contrib/telegram/#set-up-a-telegram-bot).
{{% /note %}}

## Parameters

### url {data-type="string"}
URL of the Telegram bot endpoint.
Default is `https://api.telegram.org/bot`.

### token {data-type="string"}
({{< req >}})
Telegram bot token.

### channel {data-type="string"}
({{< req >}})
Telegram channel ID.

### text {data-type="string"}
Message text.

### parseMode {data-type="string"}
[Parse mode](https://core.telegram.org/bots/api#formatting-options) of the message text.
Default is `"MarkdownV2"`.

### disableWebPagePreview {data-type="bool"}
Disable preview of web links in the sent message.
Default is `false`.

### silent {data-type="bool"}
Send message [silently](https://telegram.org/blog/channels-2-0#silent-messages).
Default is `true`.

## Examples

##### Send the last reported status to Telegram
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

    telegram.message(
      token: token,
      channel: "-12345"
      text: "Disk usage is **${lastReported.status}**.",
    )
```

{{% note %}}
#### Package author and maintainer
**Github:** [@sranka](https://github.com/sranka)  
**InfluxDB Slack:** [@sranka](https://influxdata.com/slack)
{{% /note %}}
