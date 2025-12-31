---
title: Use Telegraf configurations
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

Use Telegraf Controller to centralize management of your Telegraf configurations
and keep your agents consistent across environments.
Apply the configuration by pointing your agents to the configuration URL.

- [Apply a configuration to an agent](#apply-a-configuration-to-an-agent)
- [Set dynamic values](#set-dynamic-values)
  - [Set parameter values](#set-parameter-values)
  - [Set environment variables](#set-environment-variables)
- [Auto-update agents](#auto-update-agents)
- [Use {{% product-name %}} to build commands](#use-telegraf-controller-to-build-commands)

## Apply a configuration to an agent

When starting a Telegraf agent, use a `--config` flag with the
{{% product-name %}} configuration TOML API URL—for example:

```bash
telegraf \
  --config "http://localhost:8888/api/configs/xxxxxx/toml"
```

> [!Note]
> A single Telegraf agent can use multiple configurations.
> Provide each with a distinct `--config` flag.
> Telegraf merges the configurations at runtime.

Telegraf retrieves and validates the configuration from {{% product-name %}}
and then starts the `telegraf` process using the loaded configuration.

## Set dynamic values

Telegraf and {{% product-name %}} let you
[dynamically set values in your configuration files](/telegraf/controller/configs/dynamic-values/)
using parameters, environment variables, and secrets.

- [Set parameter values](#set-parameter-values)
- [Set environment variables](#set-environment-variables)

### Set parameter values

[Configuration parameters](/telegraf/controller/configs/dynamic-values/#parameters)
use the `&{param_name[:default_value]}` syntax in TOML configurations. Use
URL-encoded query parameters in your configuration URL to define parameter
values—for example:

##### Configuration TOML with a parameter

{{% telegraf/dynamic-values %}}
```toml
[[outputs.heartbeat]]
  instance_id = "&{agent_id}"
  # ...
```
{{% /telegraf/dynamic-values %}}

##### Set the parameter value in the configuration URL

{{% code-callout "agent_id=my-agent-123" "magenta" %}}
```bash
telegraf \
  --config "http://localhost:8888/api/configs/xxxxxx/toml?agent_id=my-agent-123"
```
{{% /code-callout %}}

> [!Important]
> If you request a configuration without providing values for required
> parameters, {{% product-name %}} returns an error.

### Set environment variables

[Telegraf environment variables](/telegraf/controller/configs/dynamic-values/#environment-variables)
use the `${VAR_NAME[:-default_value]}` syntax in TOML configurations. Set
environment variable values in the Telegraf agent's environment before
starting Telegraf—for example:

##### Configuration TOML with an environment variable

{{% telegraf/dynamic-values %}}
```toml
[[inputs.http]]
  urls = ["http://localhost:8080/metrics"]

  [inputs.http.headers]
    Authorization = "Bearer ${AUTH_TOKEN}"
```
{{% /telegraf/dynamic-values %}}

##### Set the environment variable before starting Telegraf

```bash
AUTH_TOKEN=x00x0xx00xxxX0xXXx0000xxxX000x00XXxXx

telegraf \
  --config "http://localhost:8888/api/configs/xxxxxx/toml"
```

## Auto-update agents

To have agents to automatically recognize and load updates to their
configuration, include the `--config-url-watch-interval` with a duration value
that specifies how often the agent should check for updates—for example:

```bash
telegraf \
  --config https://locahost:8888/api/configs/xxxxxx/toml \
  --config-url-watch-interval 1h
```

In this example, the agent will check for configuration changes every hour and
automatically reload the configuration if the configuration has been updated.

## Use {{% product-name %}} to build commands

{{% product-name %}} provides and tool for building `telegraf` commands using
parameters, environment variables, auto-update functionality, and Telegraf
[label selectors](/telegraf/v1/configuration/#selectors-1). To use this tool:

1.  In the {{% product-name %}} web interface, select **Configurations** in the 
    navigation bar. 
2.  Click the name of the configuration you want to use.
3.  Click **Use this Configuration** to open the modal window.

    {{< img-hd src="/img/telegraf/controller-command-builder.png" alt="Build Telegraf commands with Telegraf Controller" />}}

4.  Define dynamic values and select options for your command:

    - Set environment variable values
    - Set parameter values
    - Enable automatic configuration updates and specify the check interval
    - Add label selectors to run certain plugins based on configuration labels

5.  Click **Copy Commands** to copy the contents of the codeblock to your clipboard.
    The tool provides commands for Linux, macOS, and Windows (PowerShell).

    > [!Warning]
    > Your browser by not allow the **Copy Commands** button to copy to your
    > clipboard under the following conditions:
    >
    > - You're using an IP or domain name other than `0.0.0.0` or `localhost` and
    > - You're using HTTP, not HTTPS

<!-- TODO: Provide information about downloading configs when the functionality is added -->
