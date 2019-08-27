---
title: mqtt.to() function
description: >
  The `mqtt.to()` function outputs data to an MQTT broker using MQTT protocol.
menu:
  v2_0_ref:
    name: mqtt.to
    parent: MQTT
weight: 202
---

The `mqtt.to()` function outputs data to an MQTT broker using MQTT protocol.

_**Function type:** Output_

```js
import "mqtt"

mqtt.to(
  broker: "tcp://localhost:8883",
  topic: "example-topic",
  message: "",
  qos: 0,
  clientid: "flux-mqtt",
  username: "username",
  password: "password",
  name: "name-example",
  timeout: 1s,
  timeColumn: "_time",
  tagColumns: ["tag1", "tag2"],
  valueColumns: ["_value"]
)
```

## Parameters

### broker
The MQTT broker connection string.

_**Data type: String**_

### topic
The MQTT topic to send data to.

_**Data type: String**_

### message
placeholder

_**Data type: String**_

### qos
The [MQTT Quality of Service (QoS)](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901103) level.
Values range from `[0-2]`.

_**Data type: Integer**_

### clientid
The MQTT client ID.

_**Data type: String**_

### username
The username to send to the MQTT Broker.

_**Data type: String**_

### password
The password to send to the MQTT Broker.

_**Data type: String**_

### name
placeholder

_**Data type: String**_

### timeout
placeholder
Defaults to `1s`   

_**Data type: Duration**_

### timeColumn
placeholder
Defaults to `"_time"`.  

_**Data type: String**_

### tagColumns
placeholder
Defaults to `[]`.  

_**Data type: Array of strings**_

### valueColumns
placeholder
Defaults to `["_value"]`.

_**Data type: Array of strings**_


## Examples

### Send data to an MQTT endpoint
```js
import "mqtt"

// ...
```
