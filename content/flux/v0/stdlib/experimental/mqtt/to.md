---
title: mqtt.to() function
description: >
  `mqtt.to()` outputs data from a stream of tables to an MQTT broker using MQTT protocol.
menu:
  flux_v0_ref:
    name: mqtt.to
    parent: experimental/mqtt
    identifier: experimental/mqtt/to
weight: 201
flux/v0/tags: [mqtt, outputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/mqtt/mqtt.flux#L56-L73

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`mqtt.to()` outputs data from a stream of tables to an MQTT broker using MQTT protocol.



##### Function type signature

```js
(
    <-tables: stream[A],
    broker: string,
    ?clientid: string,
    ?name: string,
    ?password: string,
    ?qos: int,
    ?retain: bool,
    ?tagColumns: [string],
    ?timeColumn: string,
    ?timeout: duration,
    ?topic: string,
    ?username: string,
    ?valueColumns: [string],
) => stream[B] where A: Record, B: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### broker
({{< req >}})
MQTT broker connection string.



### topic

MQTT topic to send data to.



### qos

MQTT Quality of Service (QoS) level. Values range from `[0-2]`. Default is `0`.



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



### name

Name for the MQTT message.



### timeout

MQTT connection timeout. Default is `1s`.



### timeColumn

Column to use as time values in the output line protocol.
Default is `"_time"`.



### tagColumns

Columns to use as tag sets in the output line protocol.
Default is `[]`.



### valueColumns

Columns to use as field values in the output line protocol.
Default is `["_value"]`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Send data to an MQTT broker

```js
import "experimental/mqtt"
import "sampledata"

sampledata.float()
    |> mqtt.to(
        broker: "tcp://localhost:8883",
        topic: "example-topic",
        clientid: r.id,
        tagColumns: ["id"],
        valueColumns: ["_value"],
    )

```

