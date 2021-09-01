---
title: Flux Slack package
list_title: Slack package
description: >
  The Flux Slack package provides functions for sending data to Slack.
  Import the `slack` package.
aliases:
  - /influxdb/v2.0/reference/flux/functions/slack/
  - /influxdb/v2.0/reference/flux/stdlib/slack/
  - /influxdb/cloud/reference/flux/stdlib/slack/
menu:
  flux_0_x_ref:
    name: slack
    parent: Standard library
weight: 11
flux/v0.x/tags: [functions, slack, package]
---

The Flux `slack` package provides functions for sending data to Slack.
Import the `slack` package:

```js
import "slack"
```

## Options
The `slack` package provides the following options:

```js
import "slack"

option slack.defaultURL = "https://slack.com/api/chat.postMessage"
```

### defaultURL {data-type="string"}
Default Slack API URL.
Default is `https://slack.com/api/chat.postMessage`.

## Functions
{{< children type="functions" show="pages" >}}
