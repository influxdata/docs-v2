---
title: Flux Telegram package
list_title: telegram package
description: >
  The Flux Telegram package provides functions for sending messages to
  [Telegram](https://telegram.org/) using the [Telegram Bot API](https://core.telegram.org/bots/api).
  Import the `contrib/sranka/telegram` package.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/telegram/
  - /influxdb/cloud/reference/flux/stdlib/contrib/telegram/
menu:
  flux_0_x_ref:
    name: telegram
    parent: sranka
weight: 202
v2.0/tags: [functions, teams, telegram, package]
---

The Flux Telegram package provides functions for sending messages to
[Telegram](https://telegram.org/) using the [Telegram Bot API](https://core.telegram.org/bots/api).
Import the `contrib/sranka/telegram` package:

```js
import "contrib/sranka/telegram"
```

## Options
The `contrib/sranka/telegram` package provides the following options:

```js
option telegram.defaultURL = "https://api.telegram.org/bot"
option telegram.defaultParseMode = "MarkdownV2"
option telegram.defaultDisableWebPagePreview = false
option telegram.defaultSilent = true
```

#### defaultURL
Default Telegram bot URL. Default is `https://api.telegram.org/bot`.

#### defaultParseMode
Default [Telegram parse mode](https://core.telegram.org/bots/api#formatting-options).
Default is `MarkdownV2`.

#### defaultDisableWebPagePreview
Disable Telegram web page preview by default.
Default is `false`.

#### defaultSilent
Send silent Telegram notifications by default.
Default is `true`.

## Functions

{{< children type="functions" show="pages" >}}

## Set up a Telegram bot
The **Telegram Bot API** requires a **bot token** and a **channel ID**.
To set up a Telegram bot and obtain the required bot token and channel ID:

1.  [Create a new Telegram account](https://telegram.org/) or use an existing account.
2.  [Create a Telegram bot](https://core.telegram.org/bots#creating-a-new-bot).  
    Telegram provides a **bot token** for the newly created bot.
3.  Use the **Telegram application** to create a new channel.
4.  [Add the new bot to the channel](https://stackoverflow.com/questions/33126743/how-do-i-add-my-bot-to-a-channel) as an **Administrator**.
    Ensure the bot has permissions necessary to **post messages**.
5.  Send a message to bot in the channel.
6.  Send a request to `https://api.telegram.org/bot$token/getUpdates`.

    ```sh
    curl https://api.telegram.org/bot$token/getUpdates
    ```

    Find your **channel ID** in the `id` field of the response.


{{% note %}}
#### Package author and maintainer
**Github:** [@sranka](https://github.com/sranka)  
**InfluxDB Slack:** [@sranka](https://influxdata.com/slack)
{{% /note %}}
