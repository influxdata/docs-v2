---
title: InfluxDB OSS URLs
description: >
  InfluxDB 2.0 is available both locally (OSS) or on multiple cloud providers in multiple regions (Cloud).
weight: 6
menu:
  influxdb_2_0_ref:
    name: InfluxDB URLs
---

InfluxDB 2.0 is available both locally (OSS) or on multiple cloud providers in multiple regions (Cloud).

## InfluxDB OSS URLs

For InfluxDB OSS, the default URL is the following:

{{< keep-url >}}
```
http://localhost:8086/
```

### Customize your InfluxDB OSS URL
To customize your InfluxDB host and port, use the
[`http-bind-address` configuration option](/influxdb/v2.0/reference/config-options/#http-bind-address)
when starting `influxd`.

{{< keep-url >}}
```sh
# Syntax
influxd --http-bind-address <custom-domain>:<custom-port>

# Example - Run InfluxDB at http://example.com:8080
influxd --http-bind-address example.com:8080

# Example - Run InfluxDB at http://localhost:8080
influxd --http-bind-address :8080
```

{{% note %}}
#### Configure DNS routing
You must configure DNS routing to successfully route requests to your custom hostname.
Methods for configuring DNS routing vary depending on your operating system and
network architecture and are not covered in this documentation.
{{% /note %}}
