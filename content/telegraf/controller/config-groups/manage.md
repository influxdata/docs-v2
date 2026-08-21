---
title: Create and manage configuration groups
seotitle: Create and manage Telegraf configuration groups in Telegraf Controller
description: >
  Create Telegraf configuration groups, add and reorder member
  configurations, and manage group labels and lifecycle in Telegraf
  Controller.
menu:
  telegraf_controller:
    name: Create and manage groups
    parent: Manage configuration groups
weight: 101
related:
  - /telegraf/controller/configs/create/
  - /telegraf/controller/config-groups/use/
  - /telegraf/controller/labels/
---

Create a configuration group, then manage its member configurations, order,
labels, and lifecycle from the group detail page.

## Create a configuration group

1.  In the {{% product-name %}} web interface, select
    **Configurations > Config Groups** in the navigation bar.
2.  Click **{{% lucide "plus" %}} Add Config Group**.
3.  Enter a group name and optional description.
4.  Click **{{% lucide "plus" %}} Add Configs** and select the
    configurations to include.
5.  Drag members by the **drag handle ({{% lucide "grip-vertical" %}})**
    into the order you want them rendered.
6.  Click **Create Config Group**.

## View configuration groups

The **Configuration Groups** page lists all groups with their descriptions,
member counts, labels, and the number of agents using each group. Search by
name, description, or member configuration name, sort by name or date, and
filter by label.

Click a group name to open the group detail page. The **More Details**
section shows the group ID, member count, timestamps, and the API and TOML
URLs for the group.

## Add or remove member configurations

On the group detail page, under **Configurations**:

- To add members, click **{{% lucide "plus" %}} Add Configs** and select
  configurations. Configurations already in the group are skipped.
- To remove a member, click the more icon (**{{% lucide "ellipsis-vertical" %}}**)
  on the member and select **{{% lucide "x" %}} Remove**.
  Removing a configuration from a group does not delete the configuration.

## Reorder member configurations

Members render in their listed order, which matters when later plugins
depend on earlier ones or when you want a predictable merged layout.

1.  Drag members by the **drag handle ({{% lucide "grip-vertical" %}})**
    into the order you want.
2.  Click **{{% lucide "save" %}} Save**.

Saving a new order updates the group. Agents that watch the group URL load
the reordered configuration on their next check. For details, see
[Auto-update agents](/telegraf/controller/config-groups/use/#auto-update-agents).

## Review the merged TOML

The **Merged TOML Preview** panel on the group detail page shows the
read-only result of rendering all members in order, including the source
comments that mark where each member configuration begins. Validation
issues in the merged output are listed above the preview.

{{< img-hd src="/img/telegraf/controller-config-group-detail.png" alt="Telegraf Controller configuration group detail page with merged TOML preview" />}}

## Edit the group name and description

On the group detail page, click the group name or description, enter a new
value, and confirm.

## Manage group labels

Use the **Labels** box on the group detail page to assign or remove labels.
Labels on groups work the same way as labels on configurations and agents.
For details, see [Manage labels](/telegraf/controller/labels/).

## Delete a configuration group

1.  On the group detail page, select the **Manage** tab.
2.  Click the delete option and confirm.

Deleting a group does not delete its member configurations. Aliases
assigned to the group are deleted, and agents that retrieve TOML by the
group's URL can no longer load it.
