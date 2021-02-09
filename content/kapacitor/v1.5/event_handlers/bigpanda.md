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
  # BigPanda integration App Key
  app-key = ""
  # Authorization Bearer token for BigPanda REST API.  
  token = ""
  # BigPanda Alert API url  
  url = "https://api.bigpanda.io/data/v2/alerts"  
```
#### `enabled`

Set to `true` to enable the BigPanda event handler.

#### `token`

Set your authorization Bearer token for BigPanda REST API.  

#### `app-key`

Set your BigPanda integration App Key. To get your App Key, log in to your BigPanda account and select **Integrations** in the header toolbar, and then click the **New Integration**.
Select **Alerts REST API**, click **Integrate** button, and then **Create an App Key**.
 
#### `url`

BigPanda Alert API URL.

## Options

The following BigPanda event handler options can be set in a
[handler file](/kapacitor/v1.5/event_handlers/#create-a-topic-handler-with-a-handler-file) or when using
`.bigPanda()` in a TICKscript. 

| Name                | Type                   | Description                                                                                              |
| ----                | ----                   | -----------                                                                                              |
| appKey              | string                 | BigPanda appKey |
| primaryProperty     | string                 | BigPanda primary property |
| secondaryProperty   | string                 | BigPanda secondary property |

BigPanda uses the [primary property](https://docs.bigpanda.io/docs/primary_property) to construct the title 
and the [secondary property](https://docs.bigpanda.io/docs/secondary_property) to construct the subtitle of an incident.
See [Alert Correlation Logic](https://docs.bigpanda.io/docs/alert-correlation-logic) for more information.

By default, the handler maps the Kapacitor task and alert properties below to the BigPanda Alert or Event fields as follows:

| Value           | BigPanda Alert Field       |
| ----            | ----                       |
| `id`            | check                      |
| `message`       | description                |
| `details`       | details                    |
| `TaskName`      | task                       | 

All EventData tags and fields are appended to the BigPanda Alert as **Additional attributes**.
For more information, see [BigPanda Alert REST API](https://docs.bigpanda.io/reference#alerts).

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
    .database('telegraf')
    .retentionPolicy('autogen')
    .measurement('cpu')
    .groupBy('host')
    .where(lambda: "cpu" == 'cpu-total')
  |eval(lambda: 100.0 - "usage_idle").as('total_used')
  |window().period(10s).every(10s)
  |mean('total_used').as('total_used')
  |alert()
    .id('cpu_usage_check')
    .message('Hey {{ index .Tags "host"}} / {{ .ID }}: is high!')
    .details('https://example.com/dashboard/{{ index .Tags "host"}}')
    .info(lambda: "total_used" > 70)
    .warn(lambda: "total_used" > 80)
    .crit(lambda: "total_used" > 90)
    .stateChangesOnly()
    .bigPanda()
      .appKey('...')
```
