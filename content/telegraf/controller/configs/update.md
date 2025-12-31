---
title: Update a Telegraf configuration
seotitle: Update a Telegraf configuration with Telegraf Controller
description: >
  Use Telegraf Controller to update Telegraf TOML configuration files.
menu:
  telegraf_controller:
    name: Update a configuration
    parent: Manage configurations
weight: 102
---

Update a configuration to change plugin settings, parameters, and agent-level
options.

## Update a configuration

1.  In the {{% product-name %}} web interface, select **Configurations** in the 
    navigation bar.
2.  Click the name of the configuration you want to edit or click the
    **More button ({{% icon "tc-more" %}})** and select
    **{{% icon "eye" %}} View/Edit**.
3.  Update global settings, labels, parameters, and plugin settings as needed.
4.  Review the TOML preview and resolve any validation errors.
5.  Click **Save**.

### Update configuration name and description

1.  In the {{% product-name %}} web interface, select **Configurations** in the 
    navigation bar.
2.  Click the name of the configuration you want to edit or click the
    **More button ({{% icon "tc-more" %}})** and select
    **{{% icon "eye" %}} View/Edit**.
3.  Under **Configuration Information**, click the text under **Name** or under
    **Description**. The name or description will load into a form field.
4.  Provide a new name or description and click **{{% icon "check" %}}**.

## Auto-update agents

For agents to automatically recognize and load updates to their
configuration, include the `--config-url-watch-interval` with a duration value
that specifies how often the agent should check for updates—for example:

```bash
telegraf \
  --config https://locahost:8888/api/configs/xxxxxx/toml \
  --config-url-watch-interval 1h
```

In this example, the agent will check for configuration changes every hour and
automatically reload the configuration if the configuration has been updated.
