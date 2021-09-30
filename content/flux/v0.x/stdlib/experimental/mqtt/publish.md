---
title: mqtt.publish() function
description: >
  The `mqtt.publish()` function outputs data to an MQTT broker using MQTT protocol.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/mqtt/publish/
  - /influxdb/cloud/reference/flux/stdlib/experimental/mqtt/publish/
menu:
  flux_0_x_ref:
    name: mqtt.publish
    parent: mqtt
weight: 401
flux/v0.x/tags: [outputs]
introduced: 0.133.0
---

The `mqtt.publish()` function outputs data to an MQTT broker using MQTT protocol.

```js
import "experimental/mqtt"

mqtt.publish(
  broker: "tcp://localhost:8883",
  topic: "example-topic",
  message: "Example message",
  clientid: "flux-mqtt",
  username: "username",
  password: "password"
)
```

## Parameters

### broker {data-type="string"}
The MQTT broker connection string.

### topic {data-type="string"}
The MQTT topic to send data to.

### message {data-type="string"}
The message to send to the MQTT broker.

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

### timeout {data-type="duration"}
The MQTT connection timeout.
Default is `1s`.

## Examples

### Send arbitrary message to an MQTT endpoint
```js
import "experimental/mqtt"

mqtt.publish(
  broker: "tcp://localhost:8883",
  topic: "alerts",
  message: "wake up",
  clientid: "alert-watcher"
)
```

### Send data related message to an MQTT endpoint
```js
import "experimental/mqtt"

from(bucket: "example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) => r._measurement == "airSensor")
  |> last()
  |> map(fn: (r) => ({
    r with
      sent: mqtt.publish(
        broker: "tcp://localhost:8883",
        topic: "air-sensors/last/${r.sensorID}",
        message: string(v: r._value),
        clientid: "sensor-12a4"
      )
  }))
```
