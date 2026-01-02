---
title: Delete configurations
seotitle: Delete Telegraf configurations from Telegraf Controller
description: >
  Delete one or more Telegraf configurations from {{% product-name %}}.
menu:
  telegraf_controller:
    name: Delete configurations
    parent: Manage configurations
weight: 105
---

Delete configurations you no longer use to keep {{% product-name %}} organized.

> [!Warning]
> Deleting a configuration permanently removes it from {{% product-name %}}.
> Export the TOML if you need a backup.

## Before you delete

You cannot delete a configuration that is currently used by actively
reporting agents.
To delete a configuration:

- Confirm no agents rely on the configuration.
- Delete agents or reassign agents to another configuration if needed.

## Delete a single configuration

Delete configuration from either the configurations list page or the
configuration detail page.

### From the configurations list page

1.  In the {{% product-name %}} web interface, select **Configurations** in the 
    navigation bar.
2.  Click the **More button ({{% icon "tc-more" %}})** next to the configuration
    you want to delete and select **{{% icon "trash" %}} Delete**.
3.  Confirm the deletion.

### From the configuration detail page

1.  In the {{% product-name %}} web interface, select **Configurations** in the 
    navigation bar.
2.  Click the name of the configuration you want to delete to view the
    configuration detail page.
3.  Select the **Manage** tab.
4.  Under **Delete Configuration**, click **Delete**.
5.  Confirm the deletion.

## Delete multiple configurations

1.  In the {{% product-name %}} web interface, select **Configurations** in the 
    navigation bar.
2.  Use the select boxes to select all of the configurations you want to delete.
3.  In the bulk options menu that appears, click **{{% icon "trash" %}} Delete**.
4.  Confirm the deletion.
