---
title: slack.message() function
description: >
  The `slack.message()` function sends a single message to a Slack channel.
  The function works with either with the chat.postMessage API or with a Slack webhook.
aliases:
  - /influxdb/v2.0/reference/flux/functions/slack/message/
  - /influxdb/v2.0/reference/flux/stdlib/slack/message/
  - /influxdb/cloud/reference/flux/stdlib/slack/message/
menu:
  flux_0_x_ref:
    name: slack.message
    parent: slack
weight: 202
introduced: 0.41.0
---

The `slack.message()` function sends a single message to a Slack channel.
The function works with either with the [chat.postMessage API](https://api.slack.com/methods/chat.postMessage)
or with a [Slack webhook](https://api.slack.com/incoming-webhooks).

```js
import "slack"

slack.message(
  url: "https://slack.com/api/chat.postMessage",
  token: "mySuPerSecRetTokEn",
  channel: "#flux",,
  text: "This is a message from the Flux slack.message() function.",
  color: "good"
)
```

## Parameters

### url {data-type="string"}
The Slack API URL.
Defaults to `https://slack.com/api/chat.postMessage`.

{{% note %}}
If using a Slack webhook, you'll receive a Slack webhook URL when you
[create an incoming webhook](https://api.slack.com/incoming-webhooks#create_a_webhook).
{{% /note %}}

### token {data-type="string"}
The [Slack API token](https://get.slack.help/hc/en-us/articles/215770388-Create-and-regenerate-API-tokens)
used to interact with Slack.
Defaults to `""`.

{{% note %}}
A token is only required if using the Slack chat.postMessage API.
{{% /note %}}

### channel {data-type="string"}
({{< req >}}) The name of channel to post the message to.

### text {data-type="string"}
({{< req >}}) The text to display in the Slack message.

### color {data-type="string"}
({{< req >}}) The color to include with the message.

**Valid values include:**

- `good`
- `warning`
- `danger`
- Any valid RGB hex color code. For example, `#439FE0`.

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
  channel: "#system-status",
  text: "The last reported status was \"${lastReported.status}\"."
  color: "warning"
)
```
