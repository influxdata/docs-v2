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

- **url**: ({{% req %}}) URL of heartbeat endpoint.
- **instance_id**: ({{% req %}}) Unique identifier for the Telegraf instance or
  agent (also known as the agent ID).
- **token**: Authorization token for the heartbeat endpoint
- **interval**: Interval for sending heartbeat messages. Default is `1m` (every minute).
- **include**: Information to include in the heartbeat message.
  Available options are:
  - **hostname**: Hostname of the machine running Telegraf.
  - **statistics**: ({{% req text="Recommended" color="magenta" %}})
    Agent metrics including number of metrics collected and written since the
    last heartbeat, logged error and warning counts, etc.
  - **configs**: ({{% req text="Recommended" color="magenta" %}})
    Redacted list of configurations loaded by the Telegraf instance.
- **headers**: HTTP headers to include with the heartbeat request.

### Example heartbeat output plugin

The following is an example heartbeat output plugin configuration that uses
an `agent_id` [configuration parameter](#) to specify the `instance_id`.

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "&{agent_id}"
  interval = "1m"
  include = ["hostname", "statistics", "configs"]

  [outputs.heartbeat.headers]
    User-Agent = "telegraf"
```

## Verify a new agent

1. Open {{% product-name %}} and go to **Agents**.
2. Confirm the agent appears in the list with the expected `instance_id`.
3. Click the **More button ({{% icon "tc-more" %}})** and select
  **View Details** to verify metadata, labels, and the reporting rule assignment.
