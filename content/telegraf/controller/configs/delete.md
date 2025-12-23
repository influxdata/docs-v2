---
title: Delete configurations
seotitle: Delete Telegraf configurations from Telegraf Controller
description: >
  Delete one or more Telegraf configurations from Telegraf Controller.
menu:
  telegraf_controller:
    name: Delete configurations
    parent: Manage configurations
weight: 105
---

Delete configurations you no longer use to keep Telegraf Controller organized.

> [!Warning]
> Deleting a configuration permanently removes it from Telegraf Controller.
> Export the TOML if you need a backup.

## Before you delete

You cannot delete a configuration that is currently used by actively
reporting agents.
To delete a configuration:

- Confirm no agents rely on the configuration.
- Delete agents or reassign agents to another configuration if needed.

## Delete a configuration

1. Open **Configurations** and locate the configuration you want to delete.
2. Click **Delete** for the configuration.
3. Confirm the deletion. 

## Delete multiple configurations

1. Select the configurations you want to delete.
2. Click **Delete** and confirm the action.
