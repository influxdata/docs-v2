---
title: Write data with output plugins
description: |
  Output plugins define where Telegraf delivers the collected metrics.
menu:
  telegraf_v1:
     name: Output plugins
     weight: 20
     parent: Configure plugins
related:
  - /telegraf/v1/output-plugins/
  - /telegraf/v1/data_formats/output/
---

Output plugins define where Telegraf delivers collected metrics.
Send metrics to InfluxDB or to a variety of other datastores, services, and
message queues, including Graphite, OpenTSDB, Datadog, Kafka, MQTT, and NSQ.

For a complete list of output plugins and links to their detailed configuration
options, see [output plugins](/telegraf/v1/output-plugins/).

## Output plugins and data formats

Output plugins control *where* metrics go.
Many output plugins also support *data formats* (serializers) that control how
metrics are formatted before writing.

Configure a serializer using the `data_format` option in your output plugin:

```toml
[[outputs.http]]
  url = "http://example.com/metrics"
  data_format = "json"
```

Some output plugins (like `influxdb_v2` or `prometheus_client`) use a fixed
format and don't support `data_format`.
Others (like `file`, `http`, `kafka`) support multiple serializers.

For available serializers and their options, see
[output data formats](/telegraf/v1/data_formats/output/).
