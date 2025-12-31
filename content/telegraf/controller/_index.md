---
title: Telegraf Controller documentation
description: >
  Documentation for Telegraf Controller, the application for managing Telegraf
  deployments at scale. Create and manage Telegraf configurations, monitor
  the health of your agents, and more.
menu:
  telegraf_controller:
    name: Telegraf Controller
weight: 1
---

**Telegraf Controller** is a centralized application for managing Telegraf
deployments at scale. Use it to define configurations once and apply them
consistently across fleets of agents. Monitor agent health and roll out updates
without manually editing individual agents.

## Key features

- Create and manage agent configurations
- Connect agents to Telegraf Controller
- Monitor the overall health of your agent deployment
- Roll out changes safely and verify agent status
- Apply custom logic to agents to identify when they are considered "not reporting"

{{< img-hd src="/img/telegraf/controller-agents-list.png" alt="Telegraf Controller agent summary" />}}

## Configuration and agent workflow

- Create and store Telegraf configurations in Telegraf Controller
- Start a Telegraf agent, pulling its configuration from Telegraf Controller,
  and have it regularly check for configuration updates.
- Agents use the [Telegraf Heartbeat output plugin](/telegraf/v1/output-plugins/heartbeat/)
  (available with Telegraf v1.37+) to report their status back to
  Telegraf Controller
- Telegraf Controller provides agent-specific and deployment-wide health
  information.
- When you update a configuration, agents see the change and load the updated
  configuration.

{{< children hlevel="h2" >}}
