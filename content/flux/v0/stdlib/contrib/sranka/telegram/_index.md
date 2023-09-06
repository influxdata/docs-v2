---
title: telegram package
description: >
  The `telegram` package provides functions for sending messages to [Telegram](https://telegram.org/)
  using the [Telegram Bot API](https://core.telegram.org/bots/api).
menu:
  flux_v0_ref:
    name: telegram 
    parent: contrib/sranka
    identifier: contrib/sranka/telegram
weight: 31
cascade:

  introduced: 0.70.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/sranka/telegram/telegram.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `telegram` package provides functions for sending messages to [Telegram](https://telegram.org/)
using the [Telegram Bot API](https://core.telegram.org/bots/api).
Import the `contrib/sranka/telegram` package:

```js
import "contrib/sranka/telegram"
```

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

## Options

```js
option telegram.defaultDisableWebPagePreview = false

option telegram.defaultParseMode = "MarkdownV2"

option telegram.defaultSilent = true

option telegram.defaultURL = "https://api.telegram.org/bot"
```
 
### defaultDisableWebPagePreview

`defaultDisableWebPagePreview` - Use Telegram web page preview by default. Default is `false`.



### defaultParseMode

`defaultParseMode` is the default [Telegram parse mode](https://core.telegram.org/bots/api#formatting-options). Default is `MarkdownV2`.



### defaultSilent

`defaultSilent` - Send silent Telegram notifications by default. Default is `true`.



### defaultURL

`defaultURL` is the default Telegram bot URL. Default is `https://api.telegram.org/bot`.




## Functions

{{< children type="functions" show="pages" >}}
