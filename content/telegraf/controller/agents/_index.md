---
title: Manage Telegraf agents
seotitle: Manage Telegraf agents with Telegraf Controller
description: >
  Use {{% product-name %}} to monitor the Telegraf agents that report through
  the heartbeat output plugin, view their details, and manage reporting rules.
menu:
  telegraf_controller:
    name: Manage agents
weight: 4
---

{{% product-name %}} tracks agents that send heartbeats through the Telegraf
heartbeat output plugin.
Each heartbeat includes a unique `instance_id` (also called "agent ID") so
Controller can distinguish one agent from another.

- {{% product-name %}} automatically creates agents the first time a heartbeat
  arrives from a unique agent.
- Click the **More button ({{% icon "tc-more" %}})** in the agent list and select
  **View Details** to see information and reporting history for an agent.
- Reporting rules define how long an agent can go without sending a heartbeat
  before {{% product-name "short" %}} marks it as **Not Reporting**. They can
  also automatically delete agents that haven't reported in a specified amount
  of time.
- You can assign a reporting rule from the agent list or an agent details page.

{{< children hlevel="h2" >}}
