---
title: ServiceNow event handler
description: >
  The ServiceNow event handler lets you to send Kapacitor alerts to ServiceNow. This page includes configuration options and usage examples.
menu:
  kapacitor_1_5_ref:
    name: ServiceNow
    weight: 1500
    parent: Event handlers
---

[ServiceNow](https://www.servicenow.com/) provides service management software with a comprehensive managed workflow that supports
features such as real-time communication, collaboration, and resource sharing.
Configure Kapacitor to send alert messages to ServiceNow.

## Configuration

Configuration and default [option](#options) values for the ServiceNow event
handler are set in your `kapacitor.conf`.
The example below shows the default configuration:

```toml
[servicenow]
  # Configure ServiceNow.
  enabled = false
  # The ServiceNow URL for the target table (Alert or Event). Replace this instance with your hostname.
  url = "https://instance.service-now.com/api/now/v1/table/em_alert"
  # Default source identification.
  source = "Kapacitor"
  # Username for HTTP BASIC authentication
  username = ""
  # Password for HTTP BASIC authentication
  password = ""
```

#### `enabled`

Set to `true` to enable the ServiceNow event handler.

#### `url`

The ServiceNow instance address.

#### `source`

Default "Kapacitor" source.

#### `username`

Username to use for basic HTTP authentication.

#### `password`

Password to use for basic HTTP authentication.

## Options

The following ServiceNow event handler options can be set in a
[handler file](/kapacitor/v1.5/event_handlers/#create-a-topic-handler-with-a-handler-file) or when using
`.serviceNow()` in a TICKscript. These options set corresponding fields in the ServiceNow alert or event. For information about ServiceNow alerts, see [Manually create an alert](https://docs.servicenow.com/bundle/paris-it-operations-management/page/product/event-management/task/t_EMManuallyCreateAlert.html).

| Name       | Type                   | Description                                                                                              |
| ----       | ----                   | -----------                                                                                              |
| node       | string                 | ServiceNow node to associate with the event.                                                             |
| type       | string                 | ServiceNow type used to identify an event record from which alerts are created, for example, disk or CPU.|
| resource   |                        | Adds key values pairs to the Sensu API request.                                                          |
| metricName | string                 | Unique name that describes metrics collected for which the alert has been created.                       |
| messageKey | string                 | Unique event identifier used to identify multiple events related to the same alert. If empty, this is generated from the source, node, type, resource, and metricName field values.|
| source     | string                 | Source that generated the event.                                                                         |
| message    | string                 | Alert message.                                                                                           |
| alert ID   | string                 | Unique ID used to identify the alert.                                                                    |

{{% note %}}
All the handler options above support templates with the following variables: `ID`, `Name`, `TaskName`, `Fields`, `Tags`, same as in the `AlertNode.message`.
{{% /note %}}

By default, the handler maps the Kapacitor values below to the ServiceNow Alert or Event fields as follows:

| Value      | Field       |
| ----       | ----        |
| source     | Source      |
| message    | Description |
| alert ID   | Message key |

### TICKscript examples

```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_user" > 90)
    .stateChangesOnly()
    .message('Hey, check your CPU')
    .serviceNow()
```

```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_user" > 90)
    .message('Hey, check your CPU')
    .serviceNow()
        .node('{{ index .Tags "host" }}')
        .type('CPU')
        .resource('CPU-Total')
        .metricName('usage_user')
        .messageKey('Alert: {{ .ID }}')
```
