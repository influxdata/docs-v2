---
description: "Telegraf plugin for sending metrics to SignalFx"
menu:
  telegraf_v1_ref:
    parent: output_plugins_reference
    name: SignalFx
    identifier: output-signalfx
tags: [SignalFx, "output-plugins", "configuration", "applications"]
introduced: "v1.18.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.1/plugins/outputs/signalfx/README.md, SignalFx Plugin Source
---

# SignalFx Output Plugin

This plugin writes metrics to [SignalFx](https://docs.signalfx.com/en/latest/).

**Introduced in:** Telegraf v1.18.0
**Tags:** applications
**OS support:** all

[docs]: https://docs.signalfx.com/en/latest/

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Secret-store support

This plugin supports secrets from secret-stores for the `access_token` option.
See the [secret-store documentation](/telegraf/v1/configuration/#secret-store-secrets) for more details on how
to use them.

[SECRETSTORE]: ../../../docs/CONFIGURATION.md#secret-store-secrets

## Configuration

```toml @sample.conf
# Send metrics and events to SignalFx
[[outputs.signalfx]]
  ## SignalFx Org Access Token
  access_token = "my-secret-token"

  ## The SignalFx realm that your organization resides in
  signalfx_realm = "us9"  # Required if ingest_url is not set

  ## You can optionally provide a custom ingest url instead of the
  ## signalfx_realm option above if you are using a gateway or proxy
  ## instance.  This option takes precedence over signalfx_realm.
  ingest_url = "https://my-custom-ingest/"

  ## Event typed metrics are omitted by default,
  ## If you require an event typed metric you must specify the
  ## metric name in the following list.
  included_event_names = ["plugin.metric_name"]
```
