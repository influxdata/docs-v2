---
description: "Telegraf plugin for sending metrics to Quix"
menu:
  telegraf_v1_ref:
    parent: output_plugins_reference
    name: Quix
    identifier: output-quix
tags: [Quix, "output-plugins", "configuration"]
related:
  - /telegraf/v1/configure_plugins/
---

# Quix Output Plugin

This plugin writes metrics to a [Quix](https://quix.io) endpoint.

Please consult Quix's [official documentation](https://quix.io/docs/) for more details on the
Quix platform architecture and concepts.

**introduces in:** Telegraf v1.33.0
**tags:** cloud, messaging
**supported OS:** all

[quix]: https://quix.io
[docs]: https://quix.io/docs/

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

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
