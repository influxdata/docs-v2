---
description: "Telegraf plugin for sending metrics to Quix"
menu:
  telegraf_v1_ref:
    parent: output_plugins_reference
    name: Quix
    identifier: output-quix
tags: [Quix, "output-plugins", "configuration", "cloud", "messaging"]
introduced: "v1.33.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.3/plugins/outputs/quix/README.md, Quix Plugin Source
---

# Quix Output Plugin

This plugin writes metrics to a [Quix](https://quix.io) endpoint.

Please consult Quix's [official documentation](https://quix.io/docs/) for more details on the
Quix platform architecture and concepts.

**Introduced in:** Telegraf v1.33.0
**Tags:** cloud, messaging
**OS support:** all

[quix]: https://quix.io
[docs]: https://quix.io/docs/

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Secret-store support

This plugin supports secrets from secret-stores for the `token` option.
See the [secret-store documentation](/telegraf/v1/configuration/#secret-store-secrets) for more details on how
to use them.

[SECRETSTORE]: ../../../docs/CONFIGURATION.md#secret-store-secrets

## Configuration

```toml @sample.conf
# Send metrics to a Quix data processing pipeline
[[outputs.quix]]
  ## Endpoint for providing the configuration
  # url = "https://portal-api.platform.quix.io"

  ## Workspace and topics to send the metrics to
  workspace = "your_workspace"
  topic = "your_topic"

  ## Authentication token created in Quix
  token = "your_auth_token"

  ## Amount of time allowed to complete the HTTP request for fetching the config
  # timeout = "5s"
```

The plugin requires a [SDK token](https://quix.io/docs/develop/authentication/personal-access-token.html) for authentication with Quix. You can
generate the `token` in settings under the `API and tokens` section.

Furthermore, the `workspace` parameter must be set to the `Workspace ID` or the
`Environment ID` of your Quix project. Those values can be found in settings
under the `General settings` section.

[token]: https://quix.io/docs/develop/authentication/personal-access-token.html
