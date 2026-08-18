---
title: Substitute values in configurations
seotitle: Substitute values in Telegraf configurations with Telegraf Controller
description: >
  Use parameters, constants, environment variables, and secrets to substitute
  values in your Telegraf configurations.
menu:
  telegraf_controller:
    name: Substitute values
    parent: Manage configurations
weight: 106
aliases:
  - /telegraf/controller/configs/dynamic-values/
---

Substitute values in your Telegraf configurations to reuse a single
configuration for multiple distinct agents or across environments.

{{% product-name %}} supports the following value substitution types:

- **Parameters** for values you want to set or override per agent.
- **Constants** for values defined once and shared across configurations.
- **Environment variables** for values provided by the running Telegraf agent.
- **Secrets** for sensitive values stored in an external secret store.

Each type is substituted in a different place:

| Type | Syntax | Substituted by | When |
| :--- | :----- | :------------- | :--- |
| [Parameter](#parameters) | `&{param_name[:default]}` | {{% product-name %}} | When the configuration is requested |
| [Constant](#constants) | `::{constant_name}` | {{% product-name %}} | When the configuration is requested |
| [Environment variable](#environment-variables) | `${VAR_NAME[:-default]}` | Telegraf agent | When the agent starts or reloads |
| [Secret](#secrets) | `@{store_id:secret_key}` | Telegraf agent | At runtime, through the secret store plugin |

{{% product-name %}} substitutes parameters and constants server-side, so the
TOML an agent receives already contains the resolved values. Environment
variables and secrets pass through {{% product-name %}} unchanged and are
resolved by the Telegraf agent itself.

## Parameters

Use parameters for values that change between agents, deployments, or environments.
Define the parameter where the configuration is easy to find, and then
reference it in plugin settings. _Configuration parameters are a feature of
{{% product-name %}} and are not part of the Telegraf project._

{{% product-name %}} substitutes parameters server-side when the configuration
is requested, using values provided as URL query parameters. The agent
receives TOML with the parameter values already in place.

> [!Important]
> #### Do not use parameters for sensitive information
>
> Do not use parameters to provide sensitive information in agent configurations.
> Parameter values are passed over the network.
> Use environment variables or secrets to provide sensitive information to agents.

Use the following syntax:

```
&{param_name[:default_value]}
```

Parameters do not require a default value. Any parameter without a default
value is considered required and must [be defined](#define-parameters) when
requesting the configuration from {{% product-name %}}.

### Use parameters in Telegraf configurations

```toml { .tc-substitute-values }
[[outputs.influxdb_v2]]
  # Parameter with a default value
  urls = ["&{db_host:https://localhost:8181}"]

[[outputs.heartbeat]]
  # Required parameter without a default value
  instance_id = "&{agent_id}"
```

The example above uses two parameters:

- `db_host` with a default value of `https://localhost:8181`
- `agent_id` ({{< req >}})

### Define parameters

Use URL-encoded query parameters to define parameter values when requesting a
configuration's TOML. The {{% product-name %}} API returns the TOML with replaced
parameters.

_For readability, the following example uses Shell variables to build the
configuration URL with query parameters for each configuration parameter:_

<!--pytest.mark.skip-->
```sh
configUrl="http://localhost:8888/api/configs/xxxxxx/toml"
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
  urls = ["https://mydomain:8181"]

[[outputs.heartbeat]]
  # Required parameter without a default value
  instance_id = "agent123"
```

## Constants

Use constants for values that are shared across configurations and do not
change per agent, for example, a common endpoint URL or organization name.
Constants are defined once in {{% product-name %}} and referenced by name.
_Constants are a feature of {{% product-name %}} and are not part of the
Telegraf project._

{{% product-name %}} substitutes constants server-side when the configuration
is requested, using the globally defined value. The agent receives TOML with
the constant values already in place.

> [!Important]
> #### Do not use constants for sensitive information
>
> Constant values are stored in plain text and inserted directly into served
> configurations. Use environment variables or secrets to provide sensitive
> information to agents.

Use the following syntax:

```
::{constant_name}
```

Constants do not support default values. If a configuration references a
constant that is not defined, {{% product-name %}} returns an error listing
the undefined constants when the configuration is requested.

### Use constants in Telegraf configurations

```toml { .tc-substitute-values }
[[outputs.influxdb_v2]]
  # Constants shared across configurations
  urls = ["::{influxdb_url}"]
  bucket = "::{default_bucket}"
```

To define and manage constants, see
[Manage global constants](/telegraf/controller/configs/constants/).

## Environment variables

Use environment variables for values that Telegraf reads from the agent
environment at runtime.
Provide a default to keep the configuration portable across environments.

The Telegraf agent substitutes environment variables from its own runtime
environment when it starts or reloads. {{% product-name %}} serves the
configuration with environment variable references unchanged.

Use the following syntax:

```sh
${VAR_NAME[:-default_value]}
```

Environment variables do not require a default value. Any environment variable
without a default value is considered required and must be defined in the
Telegraf agent's environment when using the configuration.

For more information about Telegraf environment variable syntax, see
[Telegraf configuration options—Set environment variables](/telegraf/v1/configuration/#set-environment-variables).

### Use environment variables in Telegraf configurations

```toml { .tc-substitute-values }
[[inputs.http]]
  urls = ["${API_ENDPOINT:-http://localhost:8080}/metrics"]

  [inputs.http.headers]
    Authorization = "Bearer ${AUTH_TOKEN}"
```

The example above uses two environment variables:

- `API_ENDPOINT` with a default value of `http://localhost:8080`
- `AUTH_TOKEN` ({{< req >}})

### Define environment variables at runtime

Telegraf loads environment variables from the agent runtime environment.

<!--pytest.mark.skip-->
```sh
API_ENDPOINT=https://mydomain.com/metrics
AUTH_TOKEN=x00x0xx00xxxX0xXXx0000xxxX000x00XXxXx

telegraf \
  --config "http://localhost:8888/api/configs/xxxxxx/toml"
```

## Secrets

Use secrets for credentials or tokens you do not want to store in plain text.
Secrets require a secret store and its corresponding `secretstores` plugin.

The Telegraf agent resolves secrets at runtime through the configured secret
store plugin. Secret values never pass through {{% product-name %}} and do not
appear in the served configuration TOML.

```toml { .tc-substitute-values }
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
- Use a stable `id` so references to a secret store remain consistent.
- Ensure the Telegraf agent can reach and authenticate with the secret store.
