---
title: mqtt.to() function
description: >
  The `mqtt.to()` function outputs data to an MQTT broker using MQTT protocol.
menu:
  v2_0_ref:
    name: mqtt.to
    parent: MQTT
weight: 202
draft: true
---

The `mqtt.to()` function outputs data to an MQTT broker using MQTT protocol.

_**Function type:** Output_

```js
import "mqtt"

mqtt.to(
  broker: "tcp://localhost:8883",
  topic: "example-topic",
  message: "Example message",
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
The message or payload to send to the MQTT broker.
The default payload is all output tables.

{{% note %}}
When you specify a message, the function sends only the message string to the MQTT broker.
It does not send any output tables.
{{% /note %}}

_**Data type: String**_

### qos
The [MQTT Quality of Service (QoS)](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901103) level.
Values range from `[0-2]`.
Default is `0`.

_**Data type: Integer**_

### clientid
The MQTT client ID.

_**Data type: String**_

### username
The username to send to the MQTT broker.
This is only necessary when the MQTT broker requires authentication.

_**Data type: String**_

### password
The password to send to the MQTT broker.
This is only necessary when the MQTT broker requires authentication.

_**Data type: String**_

### name
The name for the MQTT message _(Optional)_.

_**Data type: String**_

### timeout
The MQTT connection timeout.
Default is `1s`   

_**Data type: Duration**_

### timeColumn
The column to use as time values in the output line protocol.
Default is `"_time"`.  

_**Data type: String**_

### tagColumns
The columns to use as tag sets in the output line protocol.
Default is `[]`.  

_**Data type: Array of strings**_

### valueColumns
The columns to use as field values in the output line protocol.
Default is `["_value"]`.

_**Data type: Array of strings**_

## Examples

### Send data to an MQTT endpoint
```js
import "mqtt"

from(bucket: "example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) => r._measurement == "airSensor")
  |> mqtt.to(
    broker: "tcp://localhost:8883",
    topic: "air-sensors",
    clientid: "sensor-12a4",
    tagColumns: ["sensorID"],
    valueColumns: ["_value"]
  )
```
