---
description: "Telegraf plugin for collecting metrics from Azure Queue Storage"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: Azure Queue Storage
    identifier: input-azure_storage_queue
tags: [Azure Queue Storage, "input-plugins", "configuration", "cloud"]
introduced: "v1.13.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.3/plugins/inputs/azure_storage_queue/README.md, Azure Queue Storage Plugin Source
---

# Azure Queue Storage Input Plugin

This plugin gathers queue sizes from the [Azure Queue Storage](https://learn.microsoft.com/en-us/azure/storage/queues)
service, storing a large numbers of messages.

**Introduced in:** Telegraf v1.13.0
**Tags:** cloud
**OS support:** all

[azure_queues]: https://learn.microsoft.com/en-us/azure/storage/queues

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Gather Azure Storage Queue metrics
[[inputs.azure_storage_queue]]
  ## Azure Storage Account name and shared access key (required)
  account_name = "mystorageaccount"
  account_key = "storageaccountaccesskey"

  ## Disable peeking age of oldest message (faster)
  # peek_oldest_message_age = true
```

## Metrics

- azure_storage_queues
  - tags:
    - queue
    - account
  - fields:
    - size (integer, count)
    - oldest_message_age_ns (integer, nanoseconds) Age of message at the head
      of the queue. Requires `peek_oldest_message_age` to be configured
      to `true`.

## Example Output

```text
azure_storage_queues,queue=myqueue,account=mystorageaccount oldest_message_age=799714900i,size=7i 1565970503000000000
azure_storage_queues,queue=myemptyqueue,account=mystorageaccount size=0i 1565970502000000000
```
