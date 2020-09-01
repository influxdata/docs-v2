---
title: Pushover event handler
description: >
  The Pushover event handler allows you to send Kapacitor alerts to Pushover. This page includes configuration options and usage examples.
menu:
  kapacitor_1_5_ref:
    name: Pushover
    weight: 1300
    parent: Event handlers
---

[Pushover](https://pushover.net/) is a service that sends instant push
notifications to phone and tablets.
Kapacitor can be configured to send alert messages to Pushover.

## Configuration
Configuration as well as default [option](#options) values for the Pushover
event handler are set in your `kapacitor.conf`.
Below is an example configuration:

```toml
[pushover]
  enabled = true
  token = "mysupersecrettoken"
  user-key = "myuserkey"
  url = "https://api.pushover.net/1/messages.json"
```

#### `enabled`
Set to `true` to enable the Pushover event handler.

#### `token`
Your Pushover API token.

#### `user-key`
Your Pushover USER_TOKEN.

#### `url`
The URL for the Pushover API. _**This should not need to be changed.**_

## Options
The following Pushover event handler options can be set in a
[handler file](/kapacitor/v1.5/event_handlers/#create-a-topic-handler-with-a-handler-file) or when using
`.pushover()` in a TICKscript.

| Name      | Type   | Description                                                                                                             |
| ----      | ----   | -----------                                                                                                             |
| device    | string | Specific list of users' devices rather than all of a users' devices. Multiple device names may be separated by a comma. |
| title     | string | The message title. By default, the app's name is used.                                                                  |
| url       | string | A supplementary URL to show with the message.                                                                           |
| url-title | string | A title for a supplementary URL, otherwise just the URL is shown.                                                       |
| sound     | string | The name of one of the sounds supported by the device clients to override the user's default sound choice.              |


### Example: handler file
```yaml
id: handler-id
topic: topic-name
kind: pushover
options:
  device: device1, device2, device3
  title: Alert from Kapacitor
  url: http://example.com
  url-title: This is an example title
  sound: siren
```

### Example: TICKscript
```js
|alert()
  // ...
  .pushover()
    .device('device1, device2, device3')
    .title('Alert from Kapacitor')
    .URL('http://example.com')
    .URLTitle('This is an example title')
    .sound('siren')
```

### Pushover Priority Levels
Pushover expects priority levels with each alert.
Kapacitor alert levels are mapped to the following priority levels:

| Alert Level  | Priority Level     |
| -----------  | --------------     |
| **OK**       | -2 priority level. |
| **Info**     | -1 priority level. |
| **Warning**  | 0 priority level.  |
| **Critical** | 1 priority level.  |

## Pushover Setup
[Register your application with Pushover](https://pushover.net/apps/build) to
get a Pushover token.
Include the token in the `[pushover]` configuration section of your `kapacitor.conf`.

## Using the Pushover event handler
With the Pushover event handler enabled and configured in your `kapacitor.conf`,
use the `.pushover()` attribute in your TICKscripts to send alerts to Pushover
or define a Pushover handler that subscribes to a topic and sends published
alerts to Pushover.

### Send alerts to Pushover from a TICKscript

The following TICKscript sends the message, "Hey, check your CPU", to Pushover
whenever idle CPU usage drops below 10% using the `.pushover()` event handler.

_**pushover-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .message('Hey, check your CPU')
    .pushover()
      .title('Alert from Kapacitor')
      .sound('siren')      
```

### Send alerts to Pushover from a defined handler

The following setup sends an alert to the `cpu` topic with the message, "Hey,
check your CPU".
A Pushover handler is added that subscribes to the `cpu` topic and publishes all
alert messages to Pushover.

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
    .message('Hey, check your CPU')
    .topic('cpu')
```

Add and enable the TICKscript:

```bash
kapacitor define cpu_alert -tick cpu_alert.tick
kapacitor enable cpu_alert
```

Create a handler file that subscribes to the `cpu` topic and uses the Pushover
event handler to send alerts to Pushover.

_**pushover\_cpu\_handler.yaml**_
```yaml
id: pushover-cpu-alert
topic: cpu
kind: pushover
options:
  title: Alert from Kapacitor
  sound: siren
```

Add the handler:

```bash
kapacitor define-topic-handler pushover_cpu_handler.yaml
```
