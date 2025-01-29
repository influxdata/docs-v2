---
title: Use Telegraf to dual write to InfluxDB
description: >
  Configure Telegraf to write data to multiple InfluxDB instances or clusters
  simultaneously.
menu:
  influxdb3_core:
    name: Dual write to InfluxDB
    parent: Use Telegraf
weight: 203
alt_links:
  cloud: /influxdb/cloud/write-data/no-code/use-telegraf/dual-write/
---

If you want to write your data to two different instances or clusters of InfluxDB,
use Telegraf to write data to multiple InfluxDB targets.
This method, known as "dual writing," is useful if you need to back up your data
in two places, or if you're migrating from other version of InfluxDB to
{{< product-name >}}.

Use Telegraf to write to both {{< product-name >}} and InfluxDB instances or 
clusters simultaneously.

The sample configuration below uses:

  - The [InfluxDB v2 output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/influxdb_v2)
    twice--the first pointing to {{< product-name >}} and the other to an
    InfluxDB v2 OSS instance.
  - Two different tokens--one for InfluxDB v2 OSS and one for Clustered.
    Configure both tokens as environment variables and use string interpolation
    in your Telegraf configuration file to reference each environment variable.

    > [!Note]
    > While in alpha, {{< product-name >}} does not require an authorization token.
    > For the `token` option, provide an empty or arbitrary token string.

The example configuration below writes to both {{% product-name %}} and
InfluxDB v2 OSS simultaneously.

## Sample configuration

```toml
# Include any other input, processor, or aggregator plugins that you want to
# include in your configuration.

# Send data to {{% product-name %}}
[[outputs.influxdb_v2]]
  ## The {{% product-name %}} URL
  urls = ["http://{{< influxdb/host >}}"]
  ## {{% product-name %}} authorization token
  token = "${INFLUX_TOKEN}"
  ## For {{% product-name %}}, set organization to an empty string
  organization = ""
  ## Destination database to write into
  bucket = "DATABASE_NAME"

# Send data to InfluxDB v2 OSS
[[outputs.influxdb_v2]]
  ## The InfluxDB v2 OSS URL
  urls = ["http://localhost:8086"]
  ## OSS token for authentication
  token = "${INFLUX_TOKEN_OSS}"
  ## Organization is the name of the organization you want to write to.
  organization = "ORG_NAME_OSS"
  ## Destination bucket to write to
  bucket = "BUCKET_NAME_OSS"
```

Telegraf lets you dual write data to any version of InfluxDB using the
[`influxdb` (InfluxDB v1)](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb/README.md)
and [`influxdb_v2` output plugins](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb_v2/README.md).
A single Telegraf agent sends identical data sets to all target outputs.
You cannot filter data based on the output.

> [!Note]
> InfluxDB v1 does _not_ support the unsigned integer data type.
> You can only write unsigned integer field values to InfluxDB v2- and 3-based
> products.
