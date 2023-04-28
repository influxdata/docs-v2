---
title: Dual write to InfluxDB OSS and InfluxDB Cloud
description: >
  Configure Telegraf to write data to both InfluxDB OSS and InfluxDB Cloud Serverless simultaneously.
menu:
  influxdb_cloud_serverless:
    name: Dual write to OSS & Cloud
    parent: Use Telegraf
weight: 203
alt_engine: /influxdb/cloud/write-data/no-code/use-telegraf/dual-write/
---

If you want to back up your data in two places, or if you're migrating from OSS to Cloud, you may want to set up dual write.

Use Telegraf to write to both InfluxDB OSS and InfluxDB Cloud Serverless simultaneously.

The sample configuration below uses:
  - The [InfluxDB v2 output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/influxdb_v2) twice: first pointing to the OSS instance and then to the cloud instance.
  - Two different tokens, one for OSS and one for Cloud. You'll need to configure both tokens as environment variables (see [Configure your token as an environment variable](/influxdb/v2.6/write-data/no-code/use-telegraf/auto-config/#configure-your-token-as-an-environment-variable).

Use the configuration below to write your data to both OSS and Cloud instances simultaneously.

## Sample configuration

```toml
[[inputs.cpu]]
[[inputs.mem]]

## Any other inputs, processors, aggregators that you want to include in your configuration.

# Send data to InfluxDB OSS v2
[[outputs.influxdb_v2]]
  ## The URLs of the InfluxDB instance.
  ##
  ## Multiple URLs can be specified for a single cluster, only ONE of the
  ## urls will be written to each interval.
  ## urls exp: http://127.0.0.1:9999
  urls = ["http://localhost:8086"]

  ## OSS token for authentication.
  token = "${INFLUX_TOKEN_OSS}"

  ## Organization is the name of the organization you want to write to. It must already exist.
  organization = "influxdata"

  ## Destination bucket to write to.
  bucket = "telegraf"

# Send data to InfluxDB Cloud - AWS West cloud instance
 [[outputs.influxdb_v2]]
  ## The URLs of the InfluxDB Cloud instance.

  urls = ["https://us-west-2-1.aws.cloud2.influxdata.com"]

  ## Cloud token for authentication.
  token = "${INFLUX_TOKEN_CLOUD}"

  ## Organization is the name of the organization you want to write to. It must already exist.
  organization = "example@domain.com"

  ## Destination bucket to write into.
  bucket = "telegraf"
  ```
