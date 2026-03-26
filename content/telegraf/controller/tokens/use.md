---
title: Use API tokens
description: >
  Use API tokens to authenticate Telegraf agents, heartbeat requests,
  and external API clients with Telegraf Controller.
menu:
  telegraf_controller:
    name: Use tokens
    parent: Manage API tokens
weight: 102
---

API tokens authenticate requests to {{% product-name %}}.
Use tokens to connect Telegraf agents, authorize heartbeat reporting, and
integrate external API clients.

## With Telegraf agents

Configure your Telegraf agent to include an API token when retrieving
configurations and reporting heartbeats to {{% product-name %}}.

Telegraf agents require API tokens with the following permissions:

- **Configs**: Read
- **Heartbeat**: Write

### Use the INFLUX_TOKEN environment variable

When retrieving a configuration from a URL, Telegraf only sends an `Authorization`
when it detects the `INFLUX_TOKEN` environment variable. To authorize Telegraf
to retrieve a configuration from {{% product-name %}}, define the `INFLUX_TOKEN`
environment variable:

<!--pytest.mark.skip-->
```bash { placeholders="YOUR_TC_API_TOKEN" }
export INFLUX_TOKEN=YOUR_TC_API_TOKEN

telegraf \
  --config "http://telegraf_controller.example.com/api/configs/xxxxxx/toml
```

Replace {{% code-placeholder-key %}}`YOUR_TC_API_TOKEN`{{% /code-placeholder-key %}}
with your {{% product-name %}} API token.

### For heartbeat requests

Telegraf uses the [Heartbeat output plugin](/telegraf/v1/output-plugins/heartbeat/)
to send heartbeats to {{% product-name %}}.
Use the `INFLUX_TOKEN` environment variable to define the `token` option in your
heartbeat plugin configuration.
Telegraf uses the environment variable value defined when starting Telegraf.

```toml { .tc-dynamic-values }
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "&{agent_id}"
  interval = "1m"
  include = ["hostname", "statistics", "configs"]
  token = "${INFLUX_TOKEN}"
```

When authentication is required for the heartbeat endpoint, agents must include
a valid token with each heartbeat request.
If a heartbeat request is missing a token or includes an invalid token,
{{% product-name %}} rejects the request and the agent's status is not updated.

## With external API clients

Include the token in the `Authorization` header when making API requests to
{{% product-name %}}:

```
Authorization: Bearer tc-apiv1_<token>
```

The token's permissions determine which API endpoints and operations are accessible.
Requests made with a token that lacks the required permissions are rejected with an authorization error.

> [!Note]
> If authentication is disabled for an endpoint group in **Settings**, requests to those endpoints do not require a token.
> See [Settings](/telegraf/controller/settings/#require-authentication-per-endpoint) for details on configuring authentication requirements per endpoint.
