---
title: Use placeholder values in configurations
seotitle: Use placeholder values in Telegraf configurations with Telegraf Controller
description: >
  Use parameters, environment variables, and secrets as placeholder values in
  your Telegraf configurations.
menu:
  telegraf_controller:
    name: Use placeholder values
    parent: Manage configurations
weight: 103
---

Use placeholder values to reuse a single configuration for multiple distinct
agents or across environments.
Placeholders let you separate specific values from the core plugin configuration.

Telegraf Controller supports the following placeholder types:

- **Parameters** for values you want to set or override per agent or configuration.
- **Environment variables** for values provided by the running Telegraf agent.
- **Secrets** for sensitive values stored in an external secret store.

## Parameters

Use parameters for values that change between agents, deployments, or environments.
Define the parameter where the configuration is easy to find, and then
reference it in plugin settings. _Configuration parameters are a feature of
{{% product-name %}} and are not part of the Telegraf project._

> [!Important]
> #### Do not use parameters for sensitive information
>
> Do not use parameters to provide sensitive information in agent configurations.
> Parameter values are passed over the network.
> Use environment variables or secrets to provide sensitive information to agents.

Use the following syntax:

```
&{PARAM_NAME:default_value}
```

- Parameters without a default value are required

### Use parameters in Telegraf configurations

```toml
[[outputs.influxdb_v2]]
  # Parameter with a default value
  urls = ["&{db_host:https://localhost:8181}"]

[[outputs.heartbeat]]
  # Required parameter without a default value
  instance_id = "&{agent_id}"
```

### Define parameters

Use URL-encoded query parameters to define parameter values when requesting a
configuration's TOML. The {{% product-name %}} API returns the TOML with replaced
parameters.

_For readability, the following example uses Shell variables to build the
configuration URL with query parameters for each configuration parameter:_

<!--pytest.mark.skip-->
```sh
configUrl="https://telegraf-controller.mydomain.com/api/configs/abc123/"
params="?db_host=https%3A%2F%2Fmydomain%3A8181"
params+="&agent_id=agent123"
configUrl+=$params

telegraf \
  --config $configUrl
```

If requesting the [example configuration](#use-parameters-in-telegraf-configurations)
above, Telegraf would load the following TOML configuration:

```toml
[[outputs.influxdb_v2]]
  # Parameter with a default value
  urls = ["https://mydomain:8181}"]

[[outputs.heartbeat]]
  # Required parameter without a default value
  instance_id = "agent123"
```

## Environment Variables

Use environment variables for values that Telegraf reads from the agent
environment at runtime.
Provide a default to keep the configuration portable across environments.

Use the following syntax:

```toml
# Reference an environment variable
${VAR_NAME}

# Reference an environment variable with a default
${VAR_NAME:-default_value}
```

For more information about Telegraf environment variable syntax, see
[Telegraf configuration options—Set environment variables](/telegraf/v1/configuration/#set-environment-variables).

### Use environment variables in Telegraf configurations

```toml
[[inputs.http]]
  urls = ["${API_ENDPOINT:-http://localhost:8080}/metrics"]

  [inputs.http.headers]
    Authorization = "Bearer ${AUTH_TOKEN}"
```

### Define environment variables at runtime

Telegraf loads environment variables from the agent runtime environment.

<!--pytest.mark.skip-->
```sh
API_ENDPOINT=https://mydomain.com/metrics
AUTH_TOKEN=x00x0xx00xxxX0xXXx0000xxxX000x00XXxXx

telegraf \
  --config "https://telegraf-controller.mydomain.com/api/configs/abc123/"
```

## Secrets

Use secrets for credentials or tokens you do not want to store in plain text.
Secrets require a secret store and its corresponding `secretstores` plugin.

```toml
# Configure a secret store plugin
[[secretstores.vault]]
  id = "my_vault"
  address = "my_vault:8200"
  token_file = "/path/to/auth/token"
  # ...

# Use secrets from the configured secret store
[[outputs.influxdb_v2]]
  host = "my_influxdb.com:8181"
  token = "@{my_vault:influx_token}"
```

For more information about Telegraf secrets and secret stores, see
[Telegraf configuration options—Secret stores](/telegraf/v1/configuration/#secret-stores).

When using secrets:

- Configure the secret store plugin in the same configuration.
- Use a stable `id` so references remain consistent.
- Ensure the Telegraf agent can reach the secret store and authenticate.
