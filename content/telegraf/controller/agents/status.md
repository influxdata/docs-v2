---
title: Set agent statuses
description: >
  Understand how {{% product-name %}} receives and displays agent statuses from
  the heartbeat output plugin.
menu:
  telegraf_controller:
    name: Set agent statuses
    parent: Manage agents
weight: 104
---

Agent statuses come from the Telegraf heartbeat output plugin and are sent with
each heartbeat request.
The plugin reports an `ok` status.

> [!Note]
> A future Telegraf release will let you configure logic that sets the status value.
{{% product-name %}} also applies reporting rules to detect stale agents.
If an agent does not send a heartbeat within the rule's threshold, Controller
marks the agent as **Not Reporting** until it resumes sending heartbeats.

## View an agent's status

1.  In {{% product-name %}}, go to **Agents**.
2.  Check the **Status** column for each agent.
3.  To see more details, click the **More button ({{% icon "tc-more" %}})** and
    select **View Details**.
4.  The details page shows the reported status, reporting rule assignment, and
    the time of the last heartbeat.
