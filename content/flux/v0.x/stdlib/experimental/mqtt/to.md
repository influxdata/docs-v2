---
title: mqtt.to() function
description: >
  The `mqtt.to()` function outputs data to an MQTT broker using MQTT protocol.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/mqtt/to/
  - /influxdb/cloud/reference/flux/stdlib/experimental/mqtt/to/
menu:
  flux_0_x_ref:
    name: mqtt.to
    parent: mqtt
weight: 401
flux/v0.x/tags: [outputs]
introduced: 0.40.0
---

The `mqtt.to()` function outputs data to an MQTT broker using MQTT protocol.

```js
import "experimental/mqtt"

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

### broker {data-type="string"}
The MQTT broker connection string.

### topic {data-type="string"}
The MQTT topic to send data to.

### message {data-type="string"}
The message or payload to send to the MQTT broker.
The default payload is an output table.
If there are multiple output tables, it sends each table as a separate MQTT message.

{{% note %}}
When you specify a message, the function sends the message string only (no output table).
{{% /note %}}

### qos {data-type="int"}
The [MQTT Quality of Service (QoS)](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901103) level.
Values range from `[0-2]`.
Default is `0`.

### clientid {data-type="string"}
The MQTT client ID.

### username {data-type="string"}
The username to send to the MQTT broker.
Username is only required if the broker requires authentication.
If you provide a username, you must provide a [password](#password).

### password {data-type="string"}
The password to send to the MQTT broker.
Password is only required if the broker requires authentication.
If you provide a password, you must provide a [username](#username).

### name {data-type="string"}
_(Optional)_ The name for the MQTT message.

### timeout {data-type="duration"}
The MQTT connection timeout.
Default is `1s`.

### timeColumn {data-type="string"}
The column to use as time values in the output line protocol.
Default is `"_time"`.  

### tagColumns {data-type="array of strings"}
The columns to use as tag sets in the output line protocol.
Default is `[]`.  

### valueColumns {data-type="array of strings"}
The columns to use as field values in the output line protocol.
Default is `["_value"]`.

## Examples

### Send data to an MQTT endpoint
```js
import "experimental/mqtt"

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
