---
title: Kapacitor event handlers
description: >
  Kapacitor event handlers provide ways to integrate Kapacitor alert messages with logging, specific URLs, and many third-party applications.
aliases:
  - /kapacitor/v1.6/working/event-handler-setup/
menu:
  kapacitor_1_6_ref:
    name: Event handlers
    weight: 50
---

Kapacitor can be integrated into a monitoring system by sending
[alert messages](/kapacitor/v1.6/nodes/alert_node/#message) to supported event
handlers. Currently, Kapacitor can send alert messages to specific log files and
specific URLs, as well as to many third party applications.

These documents outline configuration options, setup instructions,
[handler file](#create-a-topic-handler-with-a-handler-file) and [TICKscript](/kapacitor/v1.6/tick/introduction/)
syntax for officially supported Kapacitor event handlers.

{{< children type="list" >}}

## Configure event handlers

Required and default configuration options for most event handlers are
configured in your Kapacitor configuration file, `kapacitor.conf`.
_The default location for this is `/etc/kapacitor/kapacitor.conf`, but may be
different depending on your Kapacitor setup._

Many event handlers provide options that can be defined in a TICKscript or in a
handler file while some can only be configured in a handler file.
These configurable options are outlined in the documentation for each handler.

## Add and use event handlers

Enable the event handler in your `kapacitor.conf` if applicable. Once
enabled, do one of the following:

- [Create a topic handler with a handler file](#create-a-topic-handler-with-a-handler-file), and then [add the handler](#add-the-handler).
- [Use a handler in a TICKscripts](#use-a-handler-in-a-tickscript).

    {{% note %}}
**Note:** Not all event handlers can be used in TICKscripts.
    {{% /note %}}

### Create a topic handler with a handler file

An event handler file is a simple YAML or JSON file that contains information
about the handler.
Although many handlers can be added in a TICKscript, managing multiple handlers in TICKscripts can be cumbersome.
Handler files let you add and use handlers outside of TICKscripts.
For some handler types, using handler files is the only option.

The handler file contains the following:

{{< req type="key" >}}

- {{< req "\*" >}} **ID**: The unique ID
  of the handler.
- {{< req "\*" >}} **Topic**: The topic
  to which the handler subscribes.
- **Match**: A lambda expression to filter matching alerts. By default, all alerts
  match. Learn more about [match expressions](/kapacitor/v1.6/working/alerts/#match-expressions).
- {{< req "\*" >}} **Kind**: The kind of
  handler.
- **Options**: Configurable options determined by the handler kind. If none are
  provided, default values defined for the handler in the `kapacitor.conf` are used.

```yaml
id: handler-id
topic: topic-name
match: changed()
kind: slack
options:
  channel: '#oh-nos'
```

#### Add the handler

Use the Kapacitor CLI to define a new handler with a handler file:

```bash
# Syntax
kapacitor define-topic-handler <handler-file-name>

# Example
kapacitor define-topic-handler slack_cpu_handler.yaml
```

### Use a handler in a TICKscript

Many event handlers can be used directly in TICKscripts to send events.
This is generally done with handlers that send messages to third-parties. Below
is an example TICKscript that publishes CPU alerts to Slack using the `.slack()`
event handler:

```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "idle_usage" < 10)
    .message('You better check your CPU usage.')
    .slack()
```

{{% note %}}
Events are sent to handlers if the alert is in a state other than ‘OK’ or the
alert just changed to the ‘OK’ state from a non ‘OK’ state (the alert recovered).
Use the [AlertNode.StateChangesOnly](/kapacitor/v1.6/nodes/alert_node/#statechangesonly)
property to send events to handlers only if the alert state changes.
{{% /note %}}
