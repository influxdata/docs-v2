---
title: Manage configuration group aliases
seotitle: Manage Telegraf configuration group aliases in Telegraf Controller
description: >
  Assign aliases to Telegraf configuration groups and transfer an alias from
  a single configuration to a group to migrate agents without changing agent
  commands.
menu:
  telegraf_controller:
    name: Manage group aliases
    parent: Manage configuration groups
weight: 103
related:
  - /telegraf/controller/configs/aliases/
  - /telegraf/controller/config-groups/use/
---

A configuration group alias is a human-readable name for a group. Use it in
place of the group ID in the {{% product-name %}} UI and API, including the
short `/c/` URL agents use to retrieve the group's merged TOML.

Aliases share a single namespace across configurations and configuration
groups and follow the same naming rules. For the naming rules, conflict and
transfer semantics, and short URL behavior, see
[Manage configuration aliases](/telegraf/controller/configs/aliases/).

## Manage a group's aliases

1.  In the {{% product-name %}} web interface, select **Config Groups** in
    the navigation bar.
2.  Click the name of the group.
3.  Select the **Aliases** tab.

The aliases table shows each alias and the number of agents reporting with
it. Add an alias with **{{% lucide "plus" %}} Add Alias**, and transfer or
delete an alias from its row actions, exactly as for
[configuration aliases](/telegraf/controller/configs/aliases/).

## Repoint agents from a configuration to a group

Because the alias namespace spans configurations and groups, you can
transfer an alias from a single configuration to a group. Agents that
retrieve TOML by that alias switch from the single configuration to the
group's merged configuration on their next check, without any agent-side
changes. Use this to migrate a fleet from one configuration to a composed
role profile:

1.  Build the group and
    [review its merged TOML](/telegraf/controller/config-groups/manage/#review-the-merged-toml).
2.  On the group's **Aliases** tab, add the alias that is currently
    assigned to the configuration. {{% product-name %}} reports the
    conflict, shows how many agents use the alias, and offers to transfer
    it.
3.  Confirm the transfer. Agents using the alias load the group on their
    next watch interval.

To roll back, transfer the alias back to the original configuration.
