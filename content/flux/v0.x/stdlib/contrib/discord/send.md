---
title: discord.send() function
description: >
  The `discord.send()` function sends a single message to a Discord channel using
  a [Discord webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks&amp?page=3).
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/discord/send/
  - /influxdb/cloud/reference/flux/stdlib/contrib/discord/send/
menu:
  flux_0_x_ref:
    name: discord.send
    parent: Discord
weight: 202
introduced: 0.69.0
---

The `discord.send()` function sends a single message to a Discord channel using
a [Discord webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks&amp?page=3).

_**Function type:** Output_

```js
import "contrib/chobbs/discord"

discord.send(
  webhookToken: "mySuPerSecRetTokEn",
  webhookID: "123456789",
  username: "username",
  content: "This is an example message",
  avatar_url: "https://example.com/avatar_pic.jpg"
)
```

## Parameters

### webhookToken
Discord [webhook token](https://discord.com/developers/docs/resources/webhook).

_**Data type:** String_

### webhookID
Discord [webhook ID](https://discord.com/developers/docs/resources/webhook).

_**Data type:** String_

### username
Override the Discord webhook's default username.

_**Data type:** String_

### content
Message to send to Discord (2000 character limit).

_**Data type:** String_

### avatar_url
Override the Discord webhook's default avatar.

_**Data type:** String_

## Examples

##### Send the last reported status to Discord
```js
import "contrib/chobbs/discord"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "DISCORD_TOKEN")

lastReported =
  from(bucket: "example-bucket")
    |> range(start: -1m)
    |> filter(fn: (r) => r._measurement == "statuses")
    |> last()
    |> findRecord(fn: (key) => true, idx: 0)

discord.send(
  webhookToken:token,
  webhookID: "1234567890",
  username: "chobbs",
  content: "The current status is \"${lastReported.status}\".",
  avatar_url: "https://staff-photos.net/pic.jpg"
)
```

{{% note %}}
#### Package author and maintainer
**Github:** [@chobbs](https://github.com/chobbs)  
**InfluxDB Slack:** [@craig](https://influxdata.com/slack)  
{{% /note %}}
