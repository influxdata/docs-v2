---
title: slack.endpoint() function
description: >
  The `slack.endpoint()` function sends a message to Slack that includes output data.
aliases:
  - /v2.0/reference/flux/functions/slack/endpoint/
menu:
  v2_0_ref:
    name: slack.endpoint
    parent: Slack
weight: 202
v2.0/tags: [endpoints]
---

The `slack.endpoint()` function sends a message to Slack that includes output data.

_**Function type:** Output_

```js
import "slack"

slack.endpoint(
  url: "https://slack.com/api/chat.postMessage",
  token: "mySuPerSecRetTokEn"
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

### mapFn
A function that builds the object used to generate the POST request.

{{% note %}}
_You should rarely need to override the default `mapFn` parameter.
To see the default `mapFn` value or for insight into possible overrides, view the
[`slack.endpoint()` source code](https://github.com/influxdata/flux/blob/master/stdlib/slack/slack.flux)._
{{% /note %}}

_**Data type:** Function_

The returned object must include the following fields:

- `username`
- `channel`
- `workspace`
- `text`
- `iconEmoji`
- `color`

_For more information, see [`slack.message()`](/v2.0/reference/flux/stdlib/slack/message/)_

## Examples

##### Send critical statuses to a Slack endpoint
```js
import "monitor"
import "slack"

endpoint = slack.endpoint(token: "mySuPerSecRetTokEn")

from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")
  |> map(fn: (r) => { return {r with status: r._status} })
  |> monitor.notify(endpoint: endpoint)
```
