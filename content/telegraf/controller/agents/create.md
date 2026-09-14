---
title: Create agents in Telegraf Controller
list_title: Create agents
description: >
  Learn how Telegraf Controller creates agents from heartbeat plugin reports
  and how to verify new agents in the UI.
menu:
  telegraf_controller:
    name: Create agents
    parent: Manage agents
weight: 101
---

Agents represent Telegraf instances that send heartbeat data to {{% product-name %}}
through the heartbeat output plugin.
{{% product-name "short" %}} uses the heartbeat payload to create and track each agent.

<!-- TOC -->
- [How agent creation works](#how-agent-creation-works)
- [Configure agents](#configure-agents)
- [Verify a new agent](#verify-a-new-agent)
<!-- /TOC -->

## How agent creation works

- The [heartbeat output plugin](/telegraf/v1/output-plugins/heartbeat/) in
  a Telegraf configuration reports agent data back to the `/agents/heartbeat`
  endpoint of your {{% product-name %}} instance.
- The heartbeat payload includes a unique `instance_id` (also referred to as
  an "agent ID") for the agent.
- When the first heartbeat arrives for an agent, {{% product-name %}}
  automatically creates the agent record and marks it with the reported status.
  Subsequent agent heartbeats update the existing agent record.

## Configure agents

[Heartbeat output plugin](/telegraf/v1/output-plugins/heartbeat/) configuration
options determine what agent data Telegraf sends to {{% product-name %}}.
The following heartbeat plugin configuration options are available:

- **url**: _({{% req %}})_ URL of heartbeat endpoint.
- **instance_id**: _({{% req %}})_ Unique identifier for the Telegraf instance
  or agent (also known as the agent ID).
- **token**: _({{% req text="Required with auth enabled" %}})_
  {{% product-name %}} API token for the heartbeat endpoint.
  The token must have **write** permissions on the **Heartbeat** API.
- **interval**: Interval for sending heartbeat messages. Default is `1m` (every minute).
- **include**: Information to include in the heartbeat message.
  Available options are:
  - **hostname**: Hostname of the machine running Telegraf.
  - **statistics**: ({{% req text="Recommended" color="magenta" %}})
    Agent metrics including number of metrics collected and written since the
    last heartbeat, logged error and warning counts, etc.
  - **configs**: ({{% req text="Recommended" color="magenta" %}})
    Redacted list of configurations loaded by the Telegraf instance.
  - **logs**: A sample of recent Telegraf logs, shown on the agent detail
    page. See
    [Include logs with heartbeats](/telegraf/controller/agents/heartbeat-data/#include-logs-with-heartbeats).
  - **status**: The agent's self-evaluated status. See
    [Set agent statuses](/telegraf/controller/agents/status/).
- **headers**: HTTP headers to include with the heartbeat request.

### Example heartbeat output plugin

The following is an example heartbeat output plugin configuration that uses
an `agent_id` [configuration parameter](/telegraf/controller/configs/substitute-values/#parameters)
to specify the `instance_id`.

```toml { .tc-substitute-values }
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "&{agent_id}"
  token = "${TELEGRAF_CONTROLLER_TOKEN}"
  interval = "1m"
  include = ["hostname", "statistics", "configs"]

  [outputs.heartbeat.headers]
    User-Agent = "telegraf"
```

> [!Important]
> #### Authorize heartbeats using an API token
>
> If {{% product-name %}} requires authorization on the **Heartbeat** API,
> include the `token` option in your heartbeat plugin configuration.
> Provide a {{% product-name %}} token with **write** permissions on the
> **Heartbeat** API.
>
> We recommend defining the `TELEGRAF_CONTROLLER_TOKEN` environment variable
> when starting Telegraf and using it to define the token in your heartbeat
> plugin. On **Telegraf 1.38.x or earlier**, use `INFLUX_TOKEN` instead. For
> details, see [Use API tokens](/telegraf/controller/tokens/use/#for-heartbeat-requests).

### Report the agent IP address from behind a proxy

{{% product-name %}} records the IP address a heartbeat arrives from. When an
agent connects through a proxy, NAT gateway, or load balancer, that address
belongs to the intermediary, not to the agent.

To report the agent's real address, send it in the `Telegraf-Agent-IP` header
using the heartbeat plugin's `headers` option:

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "&{agent_id}"

  [outputs.heartbeat.headers]
    Telegraf-Agent-IP = "203.0.113.7"
```

{{% product-name %}} honors the header only when it is sent exactly once and
its value parses as a valid IPv4 or IPv6 address (at most 45 characters, no
zone IDs or address lists). Otherwise, it falls back to the connection's peer
address. The header name is case-insensitive.

## Verify a new agent

1. Open {{% product-name %}} and go to **Agents**.
2. Confirm the agent appears in the list with the expected `instance_id`.
3. Click the **More button ({{% lucide "ellipsis-vertical" %}})** and select
  **{{% lucide "eye" %}} View Details** to verify metadata, labels, and the reporting rule assignment.
