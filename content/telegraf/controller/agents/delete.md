---
title: Delete agents from Telegraf Controller
list_title: Delete agents
description: >
  Remove individual or multiple Telegraf agents from {{% product-name %}}.
menu:
  telegraf_controller:
    name: Delete agents
    parent: Manage agents
weight: 105
---

Remove individual or multiple Telegraf agents from {{% product-name %}}.

<!-- TOC -->
- [Delete a single agent](#delete-a-single-agent)
- [Delete multiple agents](#delete-multiple-agents)
- [Automatically delete agents](#automatically-delete-agents)
<!-- /TOC -->

> [!Note]
> Deleting an agent from {{% product-name %}} does not affect the running
> Telegraf instance; it only deletes the record of the agent from Telegraf
> Controller.

## Delete a single agent

1.  In **Agents**, find the agent you want to remove.
2.  Click the **More button ({{% icon "tc-more" %}})** and select
    **{{% icon "trash" %}} Delete Agent**.
3.  Confirm the deletion.

## Delete multiple agents

1.  In **Agents**, select the checkboxes for the agents you want to remove.
2.  Select **{{% icon "trash" %}} Delete Agents**.
3.  Confirm the deletion.

## Automatically delete agents

Use [reporting rules](/telegraf/controller/agents/reporting-rules) to
automatically delete agents that have not reported in a specified amount of time.

1.  [Create a reporting rule](/telegraf/controller/agents/reporting-rules/#create-a-reporting-rule)
    with auto-delete enabled.
2.  [Assign the newly created rule to agents](/telegraf/controller/agents/reporting-rules/#assign-a-reporting-rule-to-agents).

If agents assigned to the reporting rule do not report in the defined auto-delete
threshold, they are automatically deleted.
