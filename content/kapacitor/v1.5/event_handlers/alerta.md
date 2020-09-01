---
title: Alerta event handler
description: >
  The Alerta event handler allows you to send Kapacitor alerts to Alerta. This page includes configuration options and usage examples.
menu:
  kapacitor_1_5_ref:
    name: Alerta
    weight: 200
    parent: Event handlers
---

[Alerta](http://alerta.io/) is a monitoring tool used to consolidate and
deduplicate alerts from multiple sources for quick ‘at-a-glance’ visualization.
Kapacitor can be configured to send alert messages to Alerta.

## Configuration
Configuration as well as default [option](#options) values for the Alerta event
handler are set in your `kapacitor.conf`.
Below is an example configuration:

```toml
[alerta]
  enabled = true
  url = "http://127.0.0.1"
  token = "mysupersecretauthtoken"
  environment = "production"
  origin = "kapacitor"
```

#### `enabled`
Set to `true` to enable the Alerta event handler.

#### `url`
The Alerta URL.

#### `token`
Default Alerta authentication token.

#### `token-prefix`
Default token prefix.
_If you receive invalid token errors, you may need to change this to "Key"._

#### `environment`
Default Alerta environment.

#### `origin`
Default origin of alert.

## Options
The following Alerta event handler options can be set in a
[handler file](/kapacitor/v1.5/event_handlers/#create-a-topic-handler-with-a-handler-file) or when using
`.alerta()` in a TICKscript.

<span style="color: #ff9e46; font-style: italic; font-size: .8rem;">* Required</span>

| Name         | Type            | Description                                                                                                                                     |
| ----         | ----            | -----------                                                                                                                                     |
| token        | string          | Alerta authentication token. If empty uses the token from the configuration.                                                                    |
| token-prefix | string          | Alerta authentication token prefix. If empty, uses "Bearer".                                                                                    |
| resource<span style="color: #ff9e46; font-style: italic;">\*</span>     | string          | Alerta resource. Can be a template and has access to the same data as the AlertNode.Details property. Default: {{ .Name }}                      |
| event<span style="color: #ff9e46; font-style: italic;">\*</span>        | string          | Alerta event. Can be a template and has access to the same data as the idInfo property. Default: {{ .ID }}.                                     |
| environment  | string          | Alerta environment. Can be a template and has access to the same data as the AlertNode.Details property. Default is set from the configuration. |
| group        | string          | Alerta group. Can be a template and has access to the same data as the AlertNode.Details property. Default: {{ .Group }}.                       |
| value        | string          | Alerta value. Can be a template and has access to the same data as the AlertNode.Details property. Default is an empty string.                  |
| origin       | string          | Alerta origin. If empty uses the origin from the configuration.                                                                                 |
| service      | list of strings | List of effected Services.                                                                                                                      |
| timeout      | duration string | Alerta timeout. Default is 24 hours.                                                                                                            |

> **Note:** The `resource` and `event` properties are required.
> Alerta cannot be configured globally because of these required properties.

### Example: handler file
```yaml
topic: topic-name
id: handler-id
kind: alerta
options:
  token: 'mysupersecretauthtoken'
  token-prefix: 'Bearer'
  resource: '{{ .Name }}'
  event: '{{ .ID }}'
  environment: 'Production'
  group: '{{ .Group }}'
  value: 'some-value'
  origin: 'kapacitor'
  service: ['service1', 'service2']
  timeout: 24h
```

### Example: TICKscript
```js
|alert()
  // ...
  .stateChangesOnly()
  .alerta()
    .token('mysupersecretauthtoken')
    .tokenPrefix('Bearer')
    .resource('{{ .Name }}')
    .event('{{ .ID }}')
    .environment('Production')
    .group('{{ .Group }}')
    .value('some-value')
    .origin('kapacitor')
    .service('service1', 'service2')
    .timeout(24h)
```

## Using the Alerta event handler
With the Alerta event handler enabled and configured in your `kapacitor.conf`,
use the `.alerta()` attribute in your TICKscripts to send alerts to Alerta or
define an Alerta handler that subscribes to a topic and sends published alerts
to Alerta.

> To avoid posting a message every alert interval, use
> [AlertNode.StateChangesOnly](/kapacitor/v1.5/nodes/alert_node/#statechangesonly)
> so only events where the alert changed state are sent to Alerta.

The examples below use the following Alerta configuration defined in the `kapacitor.conf`:

_**Alerta settings in kapacitor.conf**_  
```toml
[alerta]
  enabled = true
  url = "http://127.0.0.1"
  token = "mysupersecretauthtoken"
  environment = "production"
  origin = "kapacitor"
```

### Send alerts to an Alerta room from a TICKscript

The following TICKscript sends the message, "Hey, check your CPU", to Alerta
whenever idle CPU usage drops below 10% using the `.alerta()` event handler and
default Alerta settings defined in the `kapacitor.conf`.

_**alerta-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .stateChangesOnly()
    .message('Hey, check your CPU')
    .alerta()
      .resource('{{ .Name }}')
      .event('{{ .ID }}')
```

### Send alerts to an Alerta room from a defined handler

The following setup sends an alert to the `cpu` topic with the message, "Hey,
check your CPU". An Alerta handler is added that subscribes to the `cpu` topic
and publishes all alert messages to Alerta using default settings defined in the
`kapacitor.conf`.

Create a TICKscript that publishes alert messages to a topic.
The TICKscript below sends an alert message to the `cpu` topic any time idle CPU
usage drops below 10%.

_**cpu\_alert.tick**_
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .stateChangesOnly()
    .message('Hey, check your CPU')
    .topic('cpu')
```

Add and enable the TICKscript:

```bash
kapacitor define cpu_alert -tick cpu_alert.tick
kapacitor enable cpu_alert
```

Create a handler file that subscribes to the `cpu` topic and uses the Alerta
event handler to send alerts to the `alerts` channel in Alerta.

_**alerta\_cpu\_handler.yaml**_
```yaml
id: alerta-cpu-alert
topic: cpu
kind: alerta
options:
  resource: '{{ .Name }}'
  event: '{{ .ID }}'
  origin: 'kapacitor'
```

Add the handler:

```bash
kapacitor define-topic-handler alerta_cpu_handler.yaml
```
