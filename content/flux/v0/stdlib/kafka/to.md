---
title: kafka.to() function
description: >
  `kafka.to()` sends data to [Apache Kafka](https://kafka.apache.org/) brokers.
menu:
  flux_v0_ref:
    name: kafka.to
    parent: kafka
    identifier: kafka/to
weight: 101
flux/v0/tags: [outputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/kafka/kafka.flux#L49-L61

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`kafka.to()` sends data to [Apache Kafka](https://kafka.apache.org/) brokers.



##### Function type signature

```js
(
    <-tables: stream[A],
    brokers: [string],
    topic: string,
    ?balancer: string,
    ?name: string,
    ?nameColumn: string,
    ?tagColumns: [string],
    ?timeColumn: string,
    ?valueColumns: [string],
) => stream[A] where A: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### brokers
({{< req >}})
List of Kafka brokers to send data to.



### topic
({{< req >}})
Kafka topic to send data to.



### balancer

Kafka load balancing strategy. Default is `hash`.

The load balancing strategy determines how messages are routed to partitions
available on a Kafka cluster. The following strategies are available:
- **hash**: Uses a hash of the group key to determine which Kafka
partition to route messages to. This ensures that messages generated from
rows in the table are routed to the same partition.
- **round-robin**: Equally distributes messages across all available partitions.
- **least-bytes**: Routes messages to the partition that has received the
least amount of data.

### name

Kafka metric name. Default is the value of the `nameColumn`.



### nameColumn

Column to use as the Kafka metric name.
Default is `_measurement`.



### timeColumn

Time column. Default is `_time`.



### tagColumns

List of tag columns in input data.



### valueColumns

List of value columns in input data. Default is `["_value"]`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Send data to Kafka

```js
import "kafka"
import "sampledata"

sampledata.int()
    |> kafka.to(
        brokers: ["http://127.0.0.1:9092"],
        topic: "example-topic",
        name: "example-metric-name",
        tagColumns: ["tag"],
    )

```

