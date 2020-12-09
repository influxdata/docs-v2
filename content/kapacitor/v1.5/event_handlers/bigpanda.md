---
title: BigPanda event handler
description: >
  The BigPanda event handler lets you to send Kapacitor alerts to BigPanda. This page includes configuration options and usage examples.
menu:
  kapacitor_1_5_ref:
    name: BigPanda
    weight: 225
    parent: Event handlers
---

[BigPanda](https://bigpanda.io/) is an event correlation and automation platform that helps organizations prevent and resolve IT outages.

## Configuration

Configuration and default [option](#options) values for the BigPanda event
handler are set in your `kapacitor.conf`.
The example below shows the default configuration:

```toml
[bigpanda]
  enabled = false
  # The BigPanda App Key
  app-key = ""
  # The Authentication token for BigPanda Alerts REST API 
  token = ""
```
#### `enabled`

Set to `true` to enable the BigPanda event handler.

#### `token`

Authorization Bearer token for BigPanda REST API.  

#### `app-key`

BigPanda integration App Key. To get your App Key, log in to your BigPanda account and select **Integrations** in the header toolbar, and then click the **New Integration**.
Select **Alerts REST API**, click **Integrate** button, and then **Create an App Key**.
 
#### `url`

Optional custom BigPanda instance address. Default is `https://api.bigpanda.io/data/v2/alerts`. 

## Options

The following BigPanda event handler options can be set in a
[handler file](/kapacitor/v1.5/event_handlers/#create-a-topic-handler-with-a-handler-file) or when using
`.bigPanda()` in a TICKscript. 

| Name       | Type                   | Description                                                                                              |
| ----       | ----                   | -----------                                                                                              |
| appKey     | string                 | BigPanda appKey |


By default, the handler maps the Kapacitor values below to the BigPanda Alert or Event fields as follows:

| Value      | BigPanda Alert Field       |
| ----       | ----        |
| alert ID   | check |
| message    | description |
| details    | details |
| alert task name  | task | 

All EventData tags are appended into BigPanda Alert as **Additional attributes**. See 
[BigPanda Alert REST API](https://docs.bigpanda.io/reference#alerts) for more information. 

### TICKscript examples

```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .id('cpu_usage')
    .crit(lambda: "usage_user" > 90)
    .stateChangesOnly()
    .message('Hey, check your CPU')
    .bigPanda()
```

```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_user" > 90)
    .id('{{ index .Tags "host"}}/usage_user')
    .message('{{ .ID }}:{{ index .Fields "usage_user" }}')
    .details('https://example.com/dashboard/{{ index .Tags "host"}}')
    .bigPanda()
    .appKey('...')
```
