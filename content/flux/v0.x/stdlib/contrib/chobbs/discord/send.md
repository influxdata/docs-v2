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
    parent: discord
weight: 202
flux/v0.x/tags: [single notification]
introduced: 0.69.0
---

The `discord.send()` function sends a single message to a Discord channel using
a [Discord webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks&amp?page=3).

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

### webhookToken {data-type="string"}
Discord [webhook token](https://discord.com/developers/docs/resources/webhook).

### webhookID {data-type="string"}
Discord [webhook ID](https://discord.com/developers/docs/resources/webhook).

### username {data-type="string"}
Override the Discord webhook's default username.

### content {data-type="string"}
Message to send to Discord (2000 character limit).

### avatar_url {data-type="string"}
Override the Discord webhook's default avatar.

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
