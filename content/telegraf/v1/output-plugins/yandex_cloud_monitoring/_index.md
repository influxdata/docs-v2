---
description: "Telegraf plugin for sending metrics to Yandex Cloud Monitoring"
menu:
  telegraf_v1_ref:
    parent: output_plugins_reference
    name: Yandex Cloud Monitoring
    identifier: output-yandex_cloud_monitoring
tags: [Yandex Cloud Monitoring, "output-plugins", "configuration", "cloud"]
introduced: "v1.17.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.3/plugins/outputs/yandex_cloud_monitoring/README.md, Yandex Cloud Monitoring Plugin Source
---

# Yandex Cloud Monitoring Output Plugin

This plugin writes metrics to the [Yandex Cloud Monitoring](https://cloud.yandex.com/services/monitoring) service.

**Introduced in:** Telegraf v1.17.0
**Tags:** cloud
**OS support:** all

[yandex]: https://cloud.yandex.com/services/monitoring

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Send aggregated metrics to Yandex.Cloud Monitoring
[[outputs.yandex_cloud_monitoring]]
  ## Timeout for HTTP writes.
  # timeout = "20s"

  ## Yandex.Cloud monitoring API endpoint. Normally should not be changed
  # endpoint_url = "https://monitoring.api.cloud.yandex.net/monitoring/v2/data/write"

  ## All user metrics should be sent with "custom" service specified. Normally should not be changed
  # service = "custom"
```

### Authentication

This plugin currently support only YC.Compute metadata based authentication.

When plugin is working inside a YC.Compute instance it will take IAM token and
Folder ID from instance metadata.

Other authentication methods will be added later.
