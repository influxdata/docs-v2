---
title: Zenoss event handler
description: >
  The Zenoss event handler sends Kapacitor alerts to Zenoss.
  This page includes configuration options and usage examples.
menu:
  kapacitor_1_6_ref:
    name: Zenoss
    weight: 2200
    parent: Event handlers
---

[Zenoss](https://www.zenoss.com/) is a hybrid IT monitoring service for
monitoring virtual and physical IT environments.
Configure Kapacitor to send events to Zenoss.

## Configuration
Configuration as well as default [option](#options) values for the Zenoss event
handler are set in your `kapacitor.conf`.
Below is an example configuration:

```toml
[zenoss]
  enabled = true
  url = "https://tenant.zenoss.io:8080/zport/dmd/evconsole_router"
  username = ""
  password = ""
  action = "EventsRouter"
  method = "add_event"
  type = "rpc"
  tid = 1
  collector = "Kapacitor"
  severity-map = {OK = "Clear", Info = "Info", Warning = "Warning", Critical = "Critical"}
  global = false
  state-changes-only = false
```

#### enabled
Set to `true` to enable the Zenoss event handler.

#### url
Zenoss [router endpoint URL](https://help.zenoss.com/zsd/RM/configuring-resource-manager/enabling-access-to-browser-interfaces/creating-and-changing-public-endpoints).
For example: `https://tenant.zenoss.io:8080/zport/dmd/evconsole_router`.

#### username
Zenoss username to use for HTTP BASIC authentication.
For no authentication, set as an empty string (`""`).

#### password
Zenoss password to use for HTTP BASIC authentication.
For no authentication, set as an empty string (`""`).

#### action
Zenoss [router name](https://help.zenoss.com/dev/collection-zone-and-resource-manager-apis/anatomy-of-an-api-request#AnatomyofanAPIrequest-RouterURL).
For example: `"EventsRouter"`.

#### method
[EventsRouter method](https://help.zenoss.com/dev/collection-zone-and-resource-manager-apis/codebase/routers/router-reference/eventsrouter).
For example: `"add_event"`.

#### type
Event type.
For example: `"rpc"`.

#### tid
Temporary request transaction ID.
For example: `1`.

#### collector
Zenoss [collector](https://help.zenoss.com/zsd/RM/administering-resource-manager/event-management/event-fields) name.
For example: `"Kapacitor"`.

#### severity-map
Map Kapacitor alert levels to [Zenoss event severity levels](https://help.zenoss.com/zsd/RM/administering-resource-manager/event-management/event-severity-levels).

```toml
{ OK = "Clear", Info = "Info", Warning = "Warning", Critical = "Critical" }
```

#### global
If `true`, all alerts are sent to Zenoss without explicitly specifying Zenoss
in the TICKscript.

#### state-changes-only
Set all alerts in state-changes-only mode, meaning alerts will only be sent if
the alert state changes.
_Only applies if `global` is `true`._

## Options
The following Zenoss event handler options can be set in a
[handler file](/kapacitor/v1.6/event_handlers/#create-a-topic-handler-with-a-handler-file) or when using
`.zenoss()` in a TICKscript.

| Name        | Type    | Description                              |
| ----------- | ------- | ---------------------------------------- |
| action      | string  | Zenoss [router name](#action)            |
| method      | string  | Zenoss [router method](#method)          |
| type        | string  | Zenoss [event type](#type)               |
| tid         | integer | [Temporary request transaction ID](#tid) |
| summary     | string  | Event summary                            |
| device      | string  | Device related to the event              |
| component   | string  | Component related to the event           |
| evclasskey  | string  | Zenoss event class key                   |
| evclass     | string  | Zenoss event class                       |
| collector   | string  | Zenoss [collector](#collector)           |
| message     | string  | Event message                            |
| customField | map     | Custom fields to append to event         |


### Example: handler file
```yaml
id: handler-id
topic: topic-name
kind: zenoss
options:
  action: EventsRouter
  method: add_event
  type: rpc
  tid: 1
  summary: Example event summary.
  device: example-device
  component: example-component
  evclasskey: example-event-class-key
  evclass: example-event-class
  collector: Kapacitor
  message: Example event message.
  customField: 
    customField1: customValue1
    customField2: customValue2
```

### Example: TICKscript
```js
|alert()
  // ...
  .zenoss()
    .action('EventsRouter')
    .method('add_event')
    .type('rpc')
    .tid(1)
    .summary('Example event summary.')
    .device('example-device')
    .component('example-component')
    .evclasskey('example-event-class-key')
    .evclass('example-event-class')
    .collector('Kapacitor')
    .message('Example event message.')
    .customField('customField1', 'customValue1')
    .customField('customField2', 'customValue2')
```

{{% note %}}
To avoid posting a message every alert interval, use
[AlertNode.StateChangesOnly](/kapacitor/v1.6/nodes/alert_node/#statechangesonly)
so only events where the alert changed state are sent to Zenoss.
{{% /note %}}

The examples below use the following Zenoss configurations defined in the `kapacitor.conf`:

##### Zenoss settings in kapacitor.conf
```toml
[zenoss]
  enabled = true
  url = "https://tenant.zenoss.io:8080/zport/dmd/evconsole_router"
  username = ""
  password = ""
  action = "EventsRouter"
  method = "add_event"
  type = "rpc"
  tid = 1
  collector = "Kapacitor"
  severity-map = {OK = "Clear", Info = "Info", Warning = "Warning", Critical = "Critical"}
  global = false
  state-changes-only = false
```

### Send alerts to Zenoss from a TICKscript
The following TICKscript uses the `.zenoss()` event handler to send the message,
"Hey, check your CPU", to the `#alerts` Zenoss channel whenever idle CPU usage
drops below 20%.

##### zenoss-cpu-alert.tick
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .warn(lambda: "usage_idle" < 20)
    .stateChangesOnly()
    .message('Hey, check your CPU')
    .zenoss()
```

### Send alerts to Zenoss from a defined handler

The following setup sends an alert to the `cpu` topic with the message,
"Hey, check your CPU".
A Zenoss handler is added that subscribes to the `cpu` topic and publishes all
alert messages to Zenoss.

Create a TICKscript that publishes alert messages to a topic.
The TICKscript below sends an critical alert message to the `cpu` topic any time
idle CPU usage drops below 5%.

##### cpu\_alert.tick
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 5)
    .stateChangesOnly()
    .message('Hey, check your CPU')
    .topic('cpu')
```

Add and enable the TICKscript:

```bash
kapacitor define cpu_alert -tick cpu_alert.tick
kapacitor enable cpu_alert
```

Create a handler file that subscribes to the `cpu` topic and uses the Zenoss
event handler to send alerts to Zenoss.

##### zenoss\_cpu\_handler.yaml
```yaml
id: zenoss-cpu-alert
topic: cpu
kind: zenoss
options:
  summary: High CPU usage
  device: example-device
  component: example-component
  evclasskey: example-event-class-key
  evclass: example-event-class
```

Add the handler:

```bash
kapacitor define-topic-handler zenoss_cpu_handler.yaml
```
