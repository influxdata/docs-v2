---
title: Create a Telegraf configuration
seotitle: Create Telegraf configurations with Telegraf Controller
description: >
  Use Telegraf Controller to create Telegraf TOML configuration files.
  Upload existing configurations, write raw TOML in the Code Editor, or use
  the Telegraf Builder visual interface to manage and configure plugins.
menu:
  telegraf_controller:
    name: Create a configuration
    parent: Manage configurations
weight: 101
related:
  - /telegraf/controller/configs/dynamic-values/
---

Create a configuration to define how Telegraf collects, processes, and writes
metrics. Telegraf Controller stores the configuration as TOML that you can use
across agents. Upload existing configurations, write raw TOML in the Code
Editor, or use the Telegraf Builder visual interface to manage and configure
plugins.

## Create a configuration

1.  In the {{% product-name %}} web interface, select **Configurations** in the 
    navigation bar. 
2.  Click **{{% icon "plus" %}} Add Config**.
3.  Enter a configuration name and optional description.
4.  Use the {{% product-name %}} [Code Editor](#use-the-code-editor) or
    [Telegraf Builder](#use-the-telegraf-builder) to provide or build the
    Telegraf configuration TOML.
5.  Click **Create Configuration**.

### Use the Code Editor

The {{% product-name %}} **Code Editor** is an in-browser TOML editor that lets
you upload or manually write Telegraf configuration TOML.

_For detailed information about using the Code Editor, see
[Use the Code Editor](/telegraf/controller/configs/ui/code-editor)._

{{< img-hd src="/img/telegraf/controller-code-editor.png" alt="Telegraf Controller Code Editor" />}}

### Use the Telegraf Builder

The **Telegraf Builder** is a visual interface for adding and configuring
Telegraf plugins in a Telegraf configuration.

_For detailed information about using the Telegraf Builder, see
[Use the Telegraf Builder](/telegraf/controller/configs/ui/telegraf-builder)._

{{< img-hd src="/img/telegraf/controller-telegraf-builder.png" alt="Telegraf Builder in Telegraf Controller" />}}

> [!Warning]
> #### The Telegraf Builder does not support all Telegraf plugins
> 
> Support for additional Telegraf plugins is being added to the
> Telegraf Builder. Use plugins that are not currently supported by the
> builder, but add and edit them with the Code Editor.

## Heartbeat output plugin {note="Telegraf 1.37+"}

When adding a configuration, {{% product-name %}} prepopulates the
configuration with a [Telegraf heartbeat output plugin](/telegraf/v1/output-plugins/heartbeat/).
This plugin reports agent information back to the {{% product-name %}} heartbeat
API and lets you monitor the health of your deployed Telegraf agents.

```toml
[[outputs.heartbeat]]
url = "http://localhost:8000/agents/heartbeat"
instance_id = "&{agent_id}"
interval = "1m"
include = ["hostname", "statistics", "configs"]
```

To monitor agents with {{% product-name %}}, include a heartbeat plugin in
your Telegraf configurations.

## Next steps

- Use [dynamic values](/telegraf/controller/configs/dynamic-values/)
  to keep configurations portable across environments.
- [Apply the configuration](/telegraf/controller/configs/use/) to your
  Telegraf agents.
