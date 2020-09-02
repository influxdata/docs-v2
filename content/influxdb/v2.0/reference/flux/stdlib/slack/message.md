---
title: slack.message() function
description: >
  The `slack.message()` function sends a single message to a Slack channel.
  The function works with either with the chat.postMessage API or with a Slack webhook.
aliases:
  - /v2.0/reference/flux/functions/slack/message/
menu:
  influxdb_2_0_ref:
    name: slack.message
    parent: Slack
weight: 202
---

The `slack.message()` function sends a single message to a Slack channel.
The function works with either with the [chat.postMessage API](https://api.slack.com/methods/chat.postMessage)
or with a [Slack webhook](https://api.slack.com/incoming-webhooks).

_**Function type:** Output_

```js
import "slack"

slack.message(
  url: "https://slack.com/api/chat.postMessage",
  token: "mySuPerSecRetTokEn",
  username: "Fluxtastic",
  channel: "#flux",
  workspace: "",
  text: "This is a message from the Flux slack.message() function.",
  iconEmoji: "wave",
  color: "good"
)
```

## Parameters

### url
The Slack API URL.
Defaults to `https://slack.com/api/chat.postMessage`.

{{% note %}}
If using a Slack webhook, you'll receive a Slack webhook URL when you
[create an incoming webhook](https://api.slack.com/incoming-webhooks#create_a_webhook).
{{% /note %}}

_**Data type:** String_

### token
The [Slack API token](https://get.slack.help/hc/en-us/articles/215770388-Create-and-regenerate-API-tokens)
used to interact with Slack.
Defaults to `""`.

{{% note %}}
A token is only required if using the Slack chat.postMessage API.
{{% /note %}}

_**Data type:** String_

### username
The username to use when posting the message to a Slack channel. <span class="required">Required</span>

_**Data type:** String_

### channel
The name of channel to post the message to. <span class="required">Required</span>

_**Data type:** String_

### workspace
The name of the Slack workspace to use if there are multiple.
Defaults to `""`.

_**Data type:** String_

### text
The text to display in the Slack message. <span class="required">Required</span>

_**Data type:** String_

### iconEmoji
The name of emoji to use as the user avatar when posting the message to Slack.
<span class="required">Required</span>

_**Data type:** String_

{{% note %}}
#### Things to know about iconEmoji
- **Do not** enclose the name in colons `:` as you do in the Slack client.
- `iconEmoji` only appears as the user avatar when using the Slack chat.postMessage API.
{{% /note %}}

### color
The color to include with the message.
<span class="required">Required</span>

**Valid values include:**

- `good`
- `warning`
- `danger`
- Any valid RGB hex color code. For example, `#439FE0`.

_**Data type:** String_

## Examples

##### Send the last reported status to Slack
```js
import "slack"

lastReported =
  from(bucket: "example-bucket")
    |> range(start: -1m)
    |> filter(fn: (r) => r._measurement == "statuses")
    |> last()
    |> tableFind(fn: (key) => true)
    |> getRecord(idx: 0)

slack.message(
  url: "https://slack.com/api/chat.postMessage",
  token: "mySuPerSecRetTokEn",
  username: "johndoe",
  channel: "#system-status",
  text: "The last reported status was \"${lastReported.status}\"."
)
```
