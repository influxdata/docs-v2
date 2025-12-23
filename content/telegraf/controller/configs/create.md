---
title: Create configurations
seotitle: Create Telegraf configurations with Telegraf Controller
description: >
  Use Telegraf Controller to create Telegraf TOML configuration files.
menu:
  telegraf_controller:
    name: Create configurations
    parent: Manage configurations
weight: 101
---

Create a configuration to define how Telegraf collects, processes, and writes
metrics.
Telegraf Controller stores the configuration as TOML that you can use across
agents.

## Before you begin

- You have access to Telegraf Controller and permission to manage configurations.
- You know which input and output plugins you plan to use and their settings.
- If you plan to use secrets, you have access to a supported secret store.

## Create a configuration

1. Open **Configurations** and click **Create configuration**.
2. Enter a name and optional description, add labels, and click **Create**.
3. Configure global settings such as collection interval, flush interval,
   buffer limits, and parameters.
4. Add input plugins and configure their required settings.
5. Add output plugins and configure destinations and authentication.
6. Optional: add processors, aggregators, and secret stores as needed.
7. Review the TOML preview and resolve any validation errors.
8. Click **Save**.

## Next steps

- Use [placeholder values](/telegraf/controller/configs/placeholder-values/)
  to keep configurations portable across environments.
- [Apply the configuration](/telegraf/controller/configs/use/) to your
  Telegraf agents.
