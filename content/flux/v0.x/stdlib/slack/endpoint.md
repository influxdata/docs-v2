---
title: slack.endpoint() function
description: >
  The `slack.endpoint()` function sends a message to Slack that includes output data.
aliases:
  - /influxdb/v2.0/reference/flux/functions/slack/endpoint/
  - /influxdb/v2.0/reference/flux/stdlib/slack/endpoint/
  - /influxdb/cloud/reference/flux/stdlib/slack/endpoint/
menu:
  flux_0_x_ref:
    name: slack.endpoint
    parent: slack
weight: 202
flux/v0.x/tags: [transformations, notification endpoints]
introduced: 0.41.0
---

The `slack.endpoint()` function sends a message to Slack that includes output data.
Output tables include a `_sent` column that indicates whether the
the row's notification was sent successfully (`true` or `false`).

```js
import "slack"

slack.endpoint(
  url: "https://slack.com/api/chat.postMessage",
  token: "mySuPerSecRetTokEn"
)
```

## Parameters

### url {data-type="string"}
The Slack API URL.
Default is `https://slack.com/api/chat.postMessage`.

{{% note %}}
If using a Slack webhook, you'll receive a Slack webhook URL when you
[create an incoming webhook](https://api.slack.com/incoming-webhooks#create_a_webhook).
{{% /note %}}

### token {data-type="string"}
The [Slack API token](https://get.slack.help/hc/en-us/articles/215770388-Create-and-regenerate-API-tokens)
used to interact with Slack.
Default is `""`.

{{% note %}}
A token is only required if using the Slack chat.postMessage API.
{{% /note %}}

## Usage
`slack.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn {data-type="function"}
({{< req >}}) A function that builds the record used to generate the POST request.
Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns a record that must include the following properties:

- `channel`
- `text`
- `color`

_For more information, see [`slack.message()`](/flux/v0.x/stdlib/slack/message/)_

## Examples

##### Send critical statuses to a Slack endpoint
```js
import "slack"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "SLACK_TOKEN")
toSlack = slack.endpoint(token: token)

crit_statuses = from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "statuses" and r.status == "crit")

crit_statuses
  |> toSlack(mapFn: (r) => ({
      channel: "Alerts",
      text: r._message,
      color: "danger",
    })
  )()
```
