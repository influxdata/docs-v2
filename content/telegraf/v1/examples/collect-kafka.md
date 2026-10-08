---
title: Collect metrics from Kafka
description: >
  Use the Telegraf kafka_consumer input plugin to consume JSON messages
  from Kafka topics, parse them into metrics, and write them to InfluxDB 3
  with delivery tracking.
menu:
  telegraf_v1:
    name: Collect metrics from Kafka
    parent: Configuration examples
weight: 106
related:
  - /telegraf/v1/input-plugins/kafka_consumer/
  - /telegraf/v1/data_formats/input/json_v2/
  - /telegraf/v1/concepts/metrics/
---

Consume JSON messages from Kafka topics as they arrive, parse them into
metrics, and write them to InfluxDB 3.
`kafka_consumer` is a service input: it listens continuously instead of
polling on the collection interval.

Given messages like the following on the `sensor-events` topic:

```json
{
    "device": "press-04",
    "line": "assembly-2",
    "temp": 76.2,
    "vibration": 0.41,
    "ts": 1709572232
}
```

## Configuration

```toml { placeholders="AUTH_TOKEN|DATABASE_NAME" }
[[inputs.kafka_consumer]]
  ## Kafka brokers.
  brokers = ["broker1:9092", "broker2:9092"]

  ## Topics to consume.
  topics = ["sensor-events"]

  ## Consumer group name. All Telegraf instances sharing this group
  ## split the topic's partitions between them.
  consumer_group = "telegraf_metrics_consumers"

  ## Where to start reading when there's no committed offset.
  offset = "oldest"

  ## Maximum messages consumed but not yet delivered to an output.
  max_undelivered_messages = 1000

  ## Parse each message as JSON.
  data_format = "json_v2"
  [[inputs.kafka_consumer.json_v2]]
    measurement_name = "sensor_events"
    timestamp_path = "ts"
    timestamp_format = "unix"
    [[inputs.kafka_consumer.json_v2.tag]]
      path = "device"
    [[inputs.kafka_consumer.json_v2.tag]]
      path = "line"
    [[inputs.kafka_consumer.json_v2.field]]
      path = "temp"
    [[inputs.kafka_consumer.json_v2.field]]
      path = "vibration"

[[outputs.influxdb_v3]]
  urls = ["http://localhost:8181"]
  token = "AUTH_TOKEN"
  database = "DATABASE_NAME"
```

Replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your InfluxDB authorization token
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the database to write to

## How it works

- **`consumer_group`** registers all Telegraf instances that share the
  group name as one consumer group.
  Kafka assigns each partition to one member, so you can scale collection
  horizontally by running more agents with the same configuration.
- **`offset = "oldest"`** starts from the beginning of the topic when no
  committed offset exists, so a new consumer group processes any backlog.
  Use `"newest"` to skip the backlog.
- **`max_undelivered_messages`** enables end-to-end delivery tracking.
  The plugin doesn't acknowledge a message back to Kafka until an output
  has written the metric, so metrics aren't lost if Telegraf stops.
  See [tracking metrics](/telegraf/v1/concepts/metrics/#tracking-metrics).
- **The `json_v2` parser** maps message keys to a measurement name, tags,
  fields, and the timestamp.
  For secured clusters, add the TLS and SASL options from the
  [plugin documentation](/telegraf/v1/input-plugins/kafka_consumer/).

## Test the configuration

Service inputs deliver data only after messages arrive.
Use `--test-wait` to keep the test running long enough to receive some:

<!--pytest.mark.skip-->

```bash
telegraf --config kafka.conf --test --test-wait 10
```

## Example output

```text
sensor_events,device=press-04,line=assembly-2 temp=76.2,vibration=0.41 1709572232000000000
sensor_events,device=press-07,line=assembly-2 temp=71.8,vibration=0.38 1709572233000000000
```

## Extend this example

- Add `topic_tag = "topic"` to record the source topic when consuming
  multiple topics.
- If messages are already in line protocol, set `data_format = "influx"`
  and drop the parser tables.
- For messages pushed over MQTT instead of Kafka, see
  [Collect data from MQTT](/telegraf/v1/examples/collect-mqtt/).
