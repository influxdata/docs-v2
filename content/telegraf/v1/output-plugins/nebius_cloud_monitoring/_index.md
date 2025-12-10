---
description: "Telegraf plugin for sending metrics to Nebius Cloud Monitoring"
menu:
  telegraf_v1_ref:
    parent: output_plugins_reference
    name: Nebius Cloud Monitoring
    identifier: output-nebius_cloud_monitoring
tags: [Nebius Cloud Monitoring, "output-plugins", "configuration", "cloud", "datastore"]
introduced: "v1.27.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.0/plugins/outputs/nebius_cloud_monitoring/README.md, Nebius Cloud Monitoring Plugin Source
---

# Nebius Cloud Monitoring Output Plugin

This plugin writes metrics to the [Nebuis Cloud Monitoring](https://nebius.com/il/services/monitoring) service.

**Introduced in:** Telegraf v1.27.0
**Tags:** cloud, datastore
**OS support:** all

[nebius]: https://nebius.com/il/services/monitoring

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Send aggregated metrics to Nebius.Cloud Monitoring
[[outputs.nebius_cloud_monitoring]]
  ## Timeout for HTTP writes.
  # timeout = "20s"

  ## Nebius.Cloud monitoring API endpoint. Normally should not be changed
  # endpoint = "https://monitoring.api.il.nebius.cloud/monitoring/v2/data/write"
```

### Authentication

This plugin currently only supports Compute metadata based authentication
in Nebius Cloud Platform.

When plugin is working inside a Compute instance it will take IAM token and
Folder ID from instance metadata. In this plugin we use [Google Cloud notation]
This internal metadata endpoint is only accessible for VMs from the cloud.

[Google Cloud notation]: https://nebius.com/il/docs/compute/operations/vm-info/get-info#gce-metadata

### Reserved Labels

Nebius Monitoring backend using json format to receive the metrics:

```json
{
  "name": "metric_name",
  "labels": {
    "key": "value",
    "foo": "bar"
  },
  "ts": "2023-06-06T11:10:50Z",
  "value": 0
}
```

But key of label cannot be `name` because it's reserved for `metric_name`.

So this payload:

```json
{
  "name": "systemd_units_load_code",
  "labels": {
    "active": "active",
    "host": "vm",
    "load": "loaded",
    "name": "accounts-daemon.service",
    "sub": "running"
  },
  "ts": "2023-06-06T11:10:50Z",
  "value": 0
}
```

will be replaced with:

```json
{
  "name": "systemd_units_load_code",
  "labels": {
    "active": "active",
    "host": "vm",
    "load": "loaded",
    "_name": "accounts-daemon.service",
    "sub": "running"
  },
  "ts": "2023-06-06T11:10:50Z",
  "value": 0
}
```
