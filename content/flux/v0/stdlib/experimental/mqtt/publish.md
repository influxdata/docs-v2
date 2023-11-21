---
title: mqtt.publish() function
description: >
  `mqtt.publish()` sends data to an MQTT broker using MQTT protocol.
menu:
  flux_v0_ref:
    name: mqtt.publish
    parent: experimental/mqtt
    identifier: experimental/mqtt/publish
weight: 201
flux/v0/tags: [mqtt]
introduced: 0.133.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/mqtt/mqtt.flux#L124-L134

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`mqtt.publish()` sends data to an MQTT broker using MQTT protocol.



##### Function type signature

```js
(
    broker: string,
    message: string,
    topic: string,
    ?clientid: string,
    ?password: string,
    ?qos: int,
    ?retain: bool,
    ?timeout: duration,
    ?username: string,
) => bool
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### broker
({{< req >}})
MQTT broker connection string.



### topic
({{< req >}})
MQTT topic to send data to.



### message
({{< req >}})
Message to send to the MQTT broker.



### qos

MQTT Quality of Service (QoS) level. Values range from `[0-2]`.
Default is `0`.



### retain

MQTT retain flag. Default is `false`.



### clientid

MQTT client ID.



### username

Username to send to the MQTT broker.

Username is only required if the broker requires authentication.
If you provide a username, you must provide a password.

### password

Password to send to the MQTT broker.

Password is only required if the broker requires authentication.
If you provide a password, you must provide a username.

### timeout

MQTT connection timeout. Default is `1s`.




## Examples

- [Send a message to an MQTT endpoint](#send-a-message-to-an-mqtt-endpoint)
- [Send a message to an MQTT endpoint using input data](#send-a-message-to-an-mqtt-endpoint-using-input-data)

### Send a message to an MQTT endpoint

```js
import "experimental/mqtt"

mqtt.publish(
    broker: "tcp://localhost:8883",
    topic: "alerts",
    message: "wake up",
    clientid: "alert-watcher",
    retain: true,
)

```


### Send a message to an MQTT endpoint using input data

```js
import "experimental/mqtt"
import "sampledata"

sampledata.float()
    |> map(
        fn: (r) =>
            ({r with sent:
                    mqtt.publish(
                        broker: "tcp://localhost:8883",
                        topic: "sampledata/${r.id}",
                        message: string(v: r._value),
                        clientid: "sensor-12a4",
                    ),
            }),
    )

```

