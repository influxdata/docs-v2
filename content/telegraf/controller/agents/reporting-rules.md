---
title: Define agent reporting rules
description: >
  Define reporting rules that determine when Telegraf Controller marks
  agents as not reporting and optionally automatically delete not reporting
  agents.
menu:
  telegraf_controller:
    name: Define reporting rules
    parent: Manage agents
weight: 103
---

Reporting rules define how long an agent can go without sending a heartbeat
before {{% product-name %}} changes its status to **Not Reporting**. They can
also automatically delete agents that haven't reported in a specified amount of
time.

{{% product-name %}} requires a default reporting rule. Newly created agents
are automatically assigned to the current default reporting rule.

Manage reporting rules in the **Reporting Rules** section of
{{% product-name "short" %}}, then assign them to agents from either the agent
list or an agent details page.

<!-- TOC -->
- [Create a reporting rule](#create-a-reporting-rule)
- [Update a reporting rule](#update-a-reporting-rule)
- [Delete a reporting rule](#delete-a-reporting-rule)
- [Set a default reporting rule](#set-a-default-reporting-rule)
  - [From the reporting rules list](#from-the-reporting-rules-list)
  - [From reporting rule details](#from-reporting-rule-details)
- [Assign a reporting rule to agents](#assign-a-reporting-rule-to-agents)
  - [From the agent list](#from-the-agent-list)
  - [From an agent details page](#from-an-agent-details-page)
  <!-- /TOC -->

## Create a reporting rule

1.  In Telegraf Controller, go to **Reporting Rules**.
2.  Select **+ Add Rule**.
3.  Enter the following:
    - **Description**: Reporting rule description
    - **Not Reporting Threshold**: The maximum time an agent can go without
      reporting before {{% product-name "short" %}} assigns the "Not Reporting"
      status.
    - **Auto-delete agents**: Enable to automatically delete agents that haven't
      reported in the defined auto-delete threshold.
    - **Default Rule**: Enable to make the rule the default reporting rule.
4. Save the rule.

## Update a reporting rule

1.  In **Reporting Rules**, click the **More button ({{% icon "tc-more" %}})**
    of the rule you want to update.
2.  Select **Edit**.
3.  Edit the description, not reporting threshold, auto-delete settings, or make
    the rule the default reporting rule.
4.  Save your changes.

## Delete a reporting rule

1.  In **Reporting Rules**, click the **More button ({{% icon "tc-more" %}})**
    of the rule you want to delete.
2.  Select **Delete** and confirm.

> [!Important]
>
> #### You cannot delete the default reporting rule
>
> To delete a reporting rule that is currently the default rule, first assign
> a new rule as the default reporting rule.
>
> #### Agents assigned to a deleted reporting rule
> 
> When you delete a reporting rule, any agents assigned to the deleted rule
> automatically inherit the default reporting rule.

## Set a default reporting rule

### From the reporting rules list

1.  In **Reporting Rules**, click the **More button ({{% icon "tc-more" %}})**
    of the rule you want to make the default.
2.  Select **Make Default**.

### From reporting rule details

1.  In **Reporting Rules**, click the **More button ({{% icon "tc-more" %}})**
    of the rule you want to make the default.
2.  Select **Edit**.
3.  Toggle **Default Rule** to true.
4.  Save your changes.

## Assign a reporting rule to agents

### From the agent list

1. In **Agents**, select one or more agents.
2. Select **Assign Rule**.
3. Choose a rule and assign it.

### From an agent details page

1. In **Agents**, click the **More button ({{% icon "tc-more" %}})** for an
   agent and select **View Details**.
2. In the **Reporting Rule** section, select **Change**.
3. Choose a rule and apply it.
