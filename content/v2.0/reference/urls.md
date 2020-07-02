---
title: InfluxDB 2.0 URLs
description: >
  InfluxDB 2.0 is available both locally (OSS) or on multiple cloud providers in multiple regions (Cloud).
aliases:
    - /v2.0/cloud/urls/
weight: 6
menu:
  v2_0_ref:
    name: InfluxDB URLs
---

InfluxDB 2.0 is available both locally (OSS) or on multiple cloud providers in multiple regions (Cloud).

## InfluxDB Cloud URLs

Each region has a unique InfluxDB Cloud URL and API endpoint.
Use the URLs below to interact with your InfluxDB Cloud instances with the
[InfluxDB API](/v2.0/reference/api/), [InfluxDB client libraries](/v2.0/reference/api/client-libraries/),
[`influx` CLI](/v2.0/reference/cli/influx/), or [Telegraf](/v2.0/write-data/use-telegraf/).

{{< cloud_regions >}}

## InfluxDB OSS URLs

For InfluxDB OSS, the default URL is the following:

{{< keep-url >}}
```
http://localhost:9999/
```

### Customize your InfluxDB OSS URL
To customize your InfluxDB host and port, use the
[`http-bind-address` configuration option](/v2.0/reference/config-options/#http-bind-address)
when starting `influxd`.

```sh
# Syntax
influxd --http-bind-adress <custom-domain>:<custom-port>

# Example - Run InfluxDB at http://example.com:8080
influxd --http-bind-address example.com:8080

# Example - Run InfluxDB at http://localhost:8080
influxd --http-bind-address :8080
```

{{% note %}}
#### Configure DNS Routing
You must configure DNS routing to successfully route requests to your custom hostname.
Methods for configuring DNS routing vary depending on your operating system and
network architecture and are not covered in this documentation.
{{% /note %}}
