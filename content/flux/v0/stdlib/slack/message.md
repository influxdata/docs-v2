---
title: slack.message() function
description: >
  `slack.message()` sends a single message to a Slack channel and returns the HTTP
  response code of the request.
menu:
  flux_v0_ref:
    name: slack.message
    parent: slack
    identifier: slack/message
weight: 101
flux/v0/tags: [single notification]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/slack/slack.flux#L87-L103

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`slack.message()` sends a single message to a Slack channel and returns the HTTP
response code of the request.

The function works with either with the `chat.postMessage` API or with a Slack webhook.

##### Function type signature

```js
(
    channel: A,
    color: string,
    text: B,
    ?token: string,
    ?url: string,
) => int
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url

Slack API URL.
Default is `https://slack.com/api/chat.postMessage`.

If using the Slack webhook API, this URL is provided in the Slack webhook setup process.

### token

Slack API token. Default is `""`.

If using the Slack Webhook API, a token is not required.

### channel
({{< req >}})
Slack channel or user to send the message to.



### text
({{< req >}})
Message text.



### color
({{< req >}})
Slack message color.

Valid values:
- good
- warning
- danger
- Any hex RGB color code


## Examples

- [Send a message to Slack using a Slack webhook](#send-a-message-to-slack-using-a-slack-webhook)
- [Send a message to Slack using chat.postMessage API](#send-a-message-to-slack-using-chatpostmessage-api)

### Send a message to Slack using a Slack webhook

```js
import "slack"

slack.message(
    url: "https://hooks.slack.com/services/EXAMPLE-WEBHOOK-URL",
    channel: "#example-channel",
    text: "Example slack message",
    color: "warning",
)

```


### Send a message to Slack using chat.postMessage API

```js
import "slack"

slack.message(
    url: "https://slack.com/api/chat.postMessage",
    token: "mySuPerSecRetTokEn",
    channel: "#example-channel",
    text: "Example slack message",
    color: "warning",
)

```

