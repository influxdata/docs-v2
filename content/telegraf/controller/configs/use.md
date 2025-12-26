---
title: Use configurations
seotitle: Use Telegraf configuration managed with Telegraf Controller
description: >
  Use Telegraf configuration files managed with Telegraf Controller to configure
  your running Telegraf agents.
menu:
  telegraf_controller:
    name: Use configurations
    parent: Manage configurations
weight: 104
---

Use Telegraf Controller configurations to keep your agents consistent across
environments.
Apply the configuration by pointing your agents to the configuration URL or by
exporting the TOML.

## Apply a configuration to an agent

### Retrieve the configuration from the API

1. Open **Configurations** and select the configuration you want to use.
2. Copy the configuration URL from the details view.
3. On the agent host, start Telegraf with the configuration URL.

<!--pytest.mark.skip-->
```bash
telegraf \
  --config "https://telegraf-controller.mydomain.com/api/configs/abc123/toml"
```

4. Verify the agent starts and sends metrics as expected.
5. Check agent logs for configuration or plugin errors.


- Auto-update with `--config-url-refresh-interval 1m` flag

  ```
  --config-url-refresh-interval 1m
  ```

### Download the configuration

- Provide parameter values
- Download the config to the local machine

#### Options 

- From the UI
- From the API

#### Cons of using downloaded configs

- No auto-update when the configuration is updated in {{% product-name %}}

## Use placeholder values

If your configuration uses parameters, environment variables, or secrets,
define them before you start the agent.
See [Use placeholder values in configurations](/telegraf/controller/configs/placeholder-values/)
for details.
