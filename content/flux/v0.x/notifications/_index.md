---
title: Send notifications with Flux
description: >
  Send notifications to external services including Slack, PagerDuty, Discord,
  SMTP providers, and others.
menu:
  flux_0_x:
    name: Send notifications
weight: 8
flux/v0.x/tags: [notifications]
---

Use Flux to send notifications to external services including Slack, PagerDuty,
Discord, SMTP providers, and others.

{{< children >}}

## Notification packages
Each notification-related package includes the following:

- One or more functions to send a single notification.
- An `endpoint` function that, in practice, iterates over a stream of tables and
  sends a notification for each input row.

## Notification conventions
Three primary conventions exist for sending notifications with Flux:

- [One-off notification convention](#one-off-notification-convention)
- [Map notification convention](#map-notfication-convention)
- [Endpoint notification convention](#endpoint-notification-convention)

### One-off notification convention
The one-off convention uses a [single notification function](/flux/v0.x/function-types/#single-notification-functions)
to send a notification to an external service.
Parameters in the single notification function provide the necessary credentials
and data to interact with the external API and create the notification.

The example below does the following:

1.  Imports the `slack` package.
2.  Defines a `p` record with scalar values.
3.  Uses [`slack.message()`](/flux/v0.x/stdlib/slack/message/) to send a message
    to Slack using data from the `p` record.

```js
import "slack"

p = {fname: "John", lname: "Doe" age: 42}

slack.message(
    url: "https://slack.com/api/chat.postMessage",
    token: "mySuPerSecRetSlackTokEn",
    channel: "#my-channel",
    text: "*${p.fname} ${p.lname}* is *${r._value}* at ${r._time}."
    color: "warning"
)
```

### Map notification convention
The map convention uses [`map()`](/flux/v0.x/stdlib/universe/map/) to iterate over all input rows.
For each input row, `map()` executes a [single notification function](/flux/v0.x/function-types/#single-notification-functions)
and populates a column with the output of the single notification function.

The example below does the following:

1.  Imports the `sampledata` package for basic sample data.
2.  Imports the `slack` package.
3.  Defines a `data` variable with the `sampledata.float()` dataset filtered to
    return rows with values above 15.0.
4.  Uses `map()` to iterate over each input row, append a new `sent` column, and
    populate the `sent` column with the output of [`slack.message()`](/flux/v0.x/stdlib/slack/message/).
    Row data is used to populate parameters in `slack.message()`.

**This example sends four notifications to Slack**, one for each row with a `_value`
above 15.0 and appends the HTTP status code of the message request to each row.

```js
import "sampledata"
import "slack"

data = sampledata.float()
  |> filter(fn: (r) => r._value > 15.0)

data 
  |> map(fn: (r) => ({
      r with sent: slack.message(
          url: "https://slack.com/api/chat.postMessage",
          token: "mySuPerSecRetSlackTokEn",
          channel: "#my-channel",
          text: "Oh no! *${r.tag}* had a value of *${r._value}* at ${r._time}."
          color: "warning"
      )
  }))
```

{{< expand-wrapper >}}
{{% expand "View example input and output data" %}}
{{< flex >}}
{{% flex-content %}}
#### Input data
| _time                                             | tag | _value |
| :------------------------------------------------ | :-- | -----: |
| {{% nowrap %}}2021-01-01T00:00:30Z{{% /nowrap %}} | t1  |  17.53 |
| {{% nowrap %}}2021-01-01T00:00:40Z{{% /nowrap %}} | t1  |  15.23 |

| _time                                             | tag | _value |
| :------------------------------------------------ | :-- | -----: |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} | t2  |  19.85 |
| {{% nowrap %}}2021-01-01T00:00:30Z{{% /nowrap %}} | t2  |  19.77 |
{{% /flex-content %}}
{{% flex-content %}}
#### Output data
| _time                                             | tag | _value | sent |
| :------------------------------------------------ | :-- | -----: | :--- |
| {{% nowrap %}}2021-01-01T00:00:30Z{{% /nowrap %}} | t1  |  17.53 | 200  |
| {{% nowrap %}}2021-01-01T00:00:40Z{{% /nowrap %}} | t1  |  15.23 | 200  |

| _time                                             | tag | _value | sent |
| :------------------------------------------------ | :-- | -----: | :--- |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} | t2  |  19.85 | 200  |
| {{% nowrap %}}2021-01-01T00:00:30Z{{% /nowrap %}} | t2  |  19.77 | 200  |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

### Endpoint notification convention
The endpoint convention uses [notification endpoint functions](/flux/v0.x/function-types/#notification-endpoints) 
to iterate over all input rows and send a notification for each row.

{{% note %}}
The endpoint convention is designed specifically for the
[InfluxDB checks and notification system](/{{< latest "influxdb" >}}/monitor-alert/),
but behaves essentially the same as the [map convention](#map-notification-convention).
{{% /note %}}

`*.endpoint()` function parameters are typically connection credentials required
to connect to the external service.
The `endpoint()` function returns another function with a single `mapFn`
parameter used to produce a [record](/flux/v0.x/data-types/composite/record/)
that maps row data to fields required by the external service's API.
This function also returns a function that iterates over each input row,
sends a notification using the record produced by the `mapFn` parameter,
and then appends a `_sent` column to each row with a boolean value indicating if
the notification attempt was successful.

The example below does the following:

1.  Imports the `sampledata` package for basic sample data.
2.  Imports the `slack` package.
3.  Defines an `endpoint` variable using `slack.endpoint()` and the connection
    credentials required by the function.
4.  Defines a `data` variable with the `sampledata.float()` dataset filtered to
    return rows with values above 15.0.
5.  Uses the `endpoint` variable to iterate over input rows and send a notification
    for each.
    
    1.  The function defined in the `mapFn` parameter returns a record with the
        other data required by the Slack API.
    2.  `()` executes the function returned by `endpoint() => (mapFn)`

**This example sends four notifications to Slack**, one notification for each row with a
`_value` above 15.0, and appends a boolean value indicating the success of
the notification request.

```js
import "sampledata"
import "slack"

endpoint = slack.endpoint(
  url: "https://slack.com/api/chat.postMessage",
  token: "mySuPerSecRetSlackTokEn"
)

data = sampledata.float()
  |> filter(fn: (r) => r._value > 15.0)

data 
  |> endpoint(mapFn: (r) => ({
    channel: "#my-channel",
    text: "Oh no! *${r.tag}* had a value of *${r._value}* at ${r._time}.",
    color: "warning"
  }))()
```

{{< expand-wrapper >}}
{{% expand "View example input and output data" %}}
{{< flex >}}
{{% flex-content %}}
#### Input data
| _time                                             | tag | _value |
| :------------------------------------------------ | :-- | -----: |
| {{% nowrap %}}2021-01-01T00:00:30Z{{% /nowrap %}} | t1  |  17.53 |
| {{% nowrap %}}2021-01-01T00:00:40Z{{% /nowrap %}} | t1  |  15.23 |

| _time                                             | tag | _value |
| :------------------------------------------------ | :-- | -----: |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} | t2  |  19.85 |
| {{% nowrap %}}2021-01-01T00:00:30Z{{% /nowrap %}} | t2  |  19.77 |
{{% /flex-content %}}
{{% flex-content %}}
#### Output data
| _time                                             | tag | _value | _sent |
| :------------------------------------------------ | :-- | -----: | :---- |
| {{% nowrap %}}2021-01-01T00:00:30Z{{% /nowrap %}} | t1  |  17.53 | true  |
| {{% nowrap %}}2021-01-01T00:00:40Z{{% /nowrap %}} | t1  |  15.23 | true  |

| _time                                             | tag | _value | _sent |
| :------------------------------------------------ | :-- | -----: | :---- |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} | t2  |  19.85 | true  |
| {{% nowrap %}}2021-01-01T00:00:30Z{{% /nowrap %}} | t2  |  19.77 | true  |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}