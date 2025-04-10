---
title: Dual write to InfluxDB OSS and InfluxDB Clustered
description: >
  Configure Telegraf to write data to both InfluxDB OSS and InfluxDB Clustered simultaneously.
menu:
  influxdb3_clustered:
    name: Dual write to OSS & Clustered
    parent: Use Telegraf
weight: 203
alt_links:
  cloud: /influxdb/cloud/write-data/no-code/use-telegraf/dual-write/
---

If you want to back up your data in two places, or if you're migrating from InfluxDB OSS to {{< product-name >}},
you may want to set up Telegraf to dual write.

Use Telegraf to write to both InfluxDB OSS and {{< product-name >}} simultaneously.

The sample configuration below uses:
  - The [InfluxDB v2 output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/influxdb_v2) twice: first pointing to the OSS instance and then to the {{< product-name omit="Clustered" >}} cluster.
  - Two different tokens, one for OSS and one for Clustered. You'll need to configure both tokens as environment variables (see how to [Configure authentication credentials as environment variables](/influxdb3/clustered/get-started/setup/#configure-authentication-credentials)).

Use the configuration below to write your data to both OSS and Clustered instances simultaneously.

## Sample configuration

```toml
# Include any other input, processor, or aggregator plugins that you want to include in your configuration.

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
  organization = "ORG_NAME_OSS"

  ## Destination bucket to write to.
  bucket = "BUCKET_NAME_OSS"

# Send data to InfluxDB cluster
 [[outputs.influxdb_v2]]
  ## The URLs of the InfluxDB instance.

  urls = ["https://{{< influxdb/host >}}"]

  ## Cloud token for authentication.
  token = "${INFLUX_TOKEN}"

  ## For InfluxDB Clustered, set organization to an empty string.
  organization = ""

  ## Destination bucket to write into.
  bucket = "DATABASE_NAME"
  ```
