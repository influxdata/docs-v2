---
title: telegram.endpoint() function
description: >
  The `telegram.endpoint()` function sends a message to a Telegram channel
  using data from table rows.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/telegram/endpoint/
  - /influxdb/cloud/reference/flux/stdlib/contrib/telegram/endpoint/
menu:
  flux_0_x_ref:
    name: telegram.endpoint
    parent: telegram
weight: 201
introduced: 0.70.0
flux/v0.x/tags: [notification endpoints]
---

The `telegram.endpoint()` function sends a message to a Telegram channel
using data from table rows.

```js
import "contrib/sranka/telegram"

telegram.endpoint(
  url: "https://api.telegram.org/bot",
  token: "S3crEtTel3gRamT0k3n",
  parseMode: "MarkdownV2",
  disableWebPagePreview: false,
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

### parseMode {data-type="string"}
[Parse mode](https://core.telegram.org/bots/api#formatting-options) of the message text.
Default is `"MarkdownV2"`.

### disableWebPagePreview {data-type="bool"}
Disable preview of web links in the sent message.
Default is `false`.

## Usage
`telegram.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn {data-type="function"}
A function that builds the object used to generate the POST request.
Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns an object that must include the
following fields:

- `channel`
- `text`
- `silent`

_For more information, see [`telegram.message()` parameters](/v2.0/reference/flux/stdlib/contrib/telegram/message/#parameters)._

## Examples

##### Send critical statuses to a Telegram channel
```js
import "influxdata/influxdb/secrets"
import "contrib/sranka/telegram"

token = secrets.get(key: "TELEGRAM_TOKEN")
endpoint = telegram.endpoint(token: token)

crit_statuses = from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_statuses
  |> endpoint(mapFn: (r) => ({
      channel: "-12345",
      text: "Disk usage is **${r.status}**.",
      silent: true
    })
  )()
```

{{% note %}}
#### Package author and maintainer
**Github:** [@sranka](https://github.com/sranka)  
**InfluxDB Slack:** [@sranka](https://influxdata.com/slack)
{{% /note %}}
