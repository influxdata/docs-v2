---
title: Dual write to InfluxDB OSS and InfluxDB Cloud
description: Write data to both OSS and Cloud simultaneously.
menu:
  influxdb_2_1:
    parent: Telegraf (agent)
weight: 201
---

Write to both InfluxDB OSS and InfluxDB Cloud with Telegraf.

You might want to set up dual write if you want a backup of your data in two places, or if you're migrating from OSS to Cloud.

The sample configuration below uses the [InfluxDB v2 output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/influxdb_v2) twice: first pointing to the OSS instance and then to the cloud instance.

## Sample configuration

```
[[inputs.cpu]]
[[inputs.mem]]

## Any other inputs, processors, aggregators that you want to include into your config.
## Without any namepass, tagpass filters, or settings changes, your data should get identically written to the two outputs below.

# Send data to InfluxDB OSS v2
[[outputs.influxdb_v2]]
  ## The URLs of the InfluxDB cluster nodes.
  ##
  ## Multiple URLs can be specified for a single cluster, only ONE of the
  ## urls will be written to each interval.
  ## urls exp: http://127.0.0.1:9999
  urls = ["http://localhost:8086"]

  ## Token for authentication.
  token = "$INFLUX_TOKEN"

  ## Organization is the name of the organization you want to write to. It must already exist.
  organization = "influxdata"

  ## Destination bucket to write into.
  bucket = "telegraf"

# Send data to InfluxDB Cloud - AWS West cloud instance
 [[outputs.influxdb_v2]]
  ## The URLs of the InfluxDB Cloud cluster nodes.

  urls = ["https://us-west-2-1.aws.cloud2.influxdata.com"]

  ## Token for authentication.
  token = "$INFLUX_TOKEN"

  ## Organization is the name of the organization you want to write to. It must already exist.
  organization = "swang@influxdata.com"

  ## Destination bucket to write into.
  bucket = "telegraf"
  ```
