---
title: Enable Flux
description: Instructions for enabling Flux in your InfluxDB configuration.
menu:
  influxdb_1_7:
    name: Enable Flux
    parent: Flux
    weight: 1
---

Flux is packaged with **InfluxDB v1.7+** and does not require any additional installation,
however it is **disabled by default and needs to be enabled**.

## Enable Flux
Enable Flux by setting the `flux-enabled` option to `true` under the `[http]` section of your `influxdb.conf`:

###### influxdb.conf
```toml
# ...

[http]

  # ...

  flux-enabled = true

  # ...
```

> The default location of your `influxdb.conf` depends on your operating system.
> More information is available in the [Configuring InfluxDB](/influxdb/v1.7/administration/config/#using-the-configuration-file) guide.

When InfluxDB starts, the Flux daemon starts as well and data can be queried using Flux.
