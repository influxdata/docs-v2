---
title: Collect data from MQTT
description: >
  Use the Telegraf mqtt_consumer input plugin to subscribe to MQTT topics,
  extract tags from topic paths, parse payloads, and write the data to
  InfluxDB 3.
menu:
  telegraf_v1:
    name: Collect data from MQTT
    parent: Configuration examples
weight: 107
related:
  - /telegraf/v1/input-plugins/mqtt_consumer/
  - /telegraf/v1/data_formats/input/value/
  - /telegraf/v1/data_formats/input/json_v2/
---

Subscribe to MQTT topics, turn topic paths into tags, parse the payload,
and write the results to InfluxDB 3.
This pattern fits IoT deployments where many devices publish readings to a
structured topic tree.

This example assumes devices publish a bare numeric reading to topics
shaped like:

```text
sensors/<line>/<device>/temperature    payload: 76.2
```

## Configuration

```toml { placeholders="AUTH_TOKEN|DATABASE_NAME" }
[[inputs.mqtt_consumer]]
  ## MQTT broker.
  servers = ["tcp://broker.example.com:1883"]

  ## Subscribe to all temperature readings in the topic tree.
  topics = ["sensors/+/+/temperature"]

  ## Deliver each message at least once and resume missed messages
  ## after a disconnect.
  qos = 1
  persistent_session = true
  client_id = "telegraf-plant-01"

  ## Credentials for the broker.
  username = "telegraf"
  password = "example-password"

  ## Parse the payload as a single float value.
  data_format = "value"
  data_type = "float"

  ## Extract the measurement name and tags from the topic path.
  [[inputs.mqtt_consumer.topic_parsing]]
    topic = "sensors/+/+/temperature"
    measurement = "_/_/_/measurement"
    tags = "_/line/device/_"

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

- **`topics`** uses MQTT wildcards: `+` matches one topic level and `#`
  matches any number of levels.
  This subscription receives temperature readings from every line and
  device.
- **`qos = 1` with `persistent_session`** makes the broker hold messages
  published while Telegraf is offline and deliver them on reconnect.
  A stable `client_id` is required for the session to persist.
- **The `value` parser** reads the bare numeric payload as a float field
  named `value`.
- **`topic_parsing`** maps topic segments by position:
  - `measurement = "_/_/_/measurement"` uses the fourth segment
    (`temperature`) as the measurement name.
  - `tags = "_/line/device/_"` stores the second and third segments as
    the `line` and `device` tags.
  - `_` marks segments to ignore.
  The full topic is also stored in the `topic` tag by default.
- Like all message-queue inputs, `mqtt_consumer` is a service input with
  delivery tracking: messages are acknowledged to the broker only after
  an output writes them.

## Test the configuration

Service inputs deliver data only after messages arrive.
Use `--test-wait` to keep the test running long enough to receive some:

<!--pytest.mark.skip-->

```bash
telegraf --config mqtt.conf --test --test-wait 10
```

## Example output

```text
temperature,device=press-04,line=line-a,topic=sensors/line-a/press-04/temperature value=76.2 1709572232000000000
temperature,device=cnc-11,line=line-b,topic=sensors/line-b/cnc-11/temperature value=71.8 1709572233000000000
```

## Parse JSON payloads

If your devices publish JSON instead of bare values, replace the parser
configuration:

```toml
  data_format = "json_v2"
  [[inputs.mqtt_consumer.json_v2]]
    measurement_name = "sensors"
    [[inputs.mqtt_consumer.json_v2.field]]
      path = "temp"
    [[inputs.mqtt_consumer.json_v2.field]]
      path = "humidity"
```

Devices that report Unix-style timestamps in a local timezone can use the
`timestamp_tz` formats.
See [Parse timestamps](/telegraf/v1/configure_plugins/input_plugins/parse-data/#unix-timestamps).

## Extend this example

- For industrial equipment publishing Sparkplug B or OPC UA data, see
  [Collect industrial data from OPC UA](/telegraf/v1/examples/collect-opcua/).
- To combine per-topic single values into one multi-field metric, use the
  [merge aggregator](/telegraf/v1/configure_plugins/aggregator_processor/#merge-fields-from-related-metrics)
  or the [pivot processor](/telegraf/v1/processor-plugins/pivot/).
