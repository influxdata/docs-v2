---
title: Manage Telegraf Controller labels
description: >
  Use labels to organize Telegraf configurations, agents, and
  configuration groups in Telegraf Controller and to filter lists.
menu:
  telegraf_controller:
    name: Manage labels
weight: 9
related:
  - /telegraf/controller/config-groups/manage/
---

Labels are named, colored tags that organize your {{% product-name %}}
resources.
Assign them to configurations, agents, and configuration groups, and
filter lists by them.

> [!Important]
> {{% product-name %}} labels are separate from Telegraf labels.
> {{% product-name %}} labels organize resources in
> {{% product-name %}} and have no effect on running agents.
> Telegraf labels are defined inside a Telegraf configuration and let
> [label selectors](/telegraf/v1/configuration/labels-selectors/)
> enable or disable plugins at runtime.

- [Label properties](#label-properties)
- [What you can label](#what-you-can-label)
- [Permissions](#permissions)

{{< children hlevel="h2" >}}

## Label properties

- **Name**: required, 1–100 characters, unique across all labels.
- **Description**: optional, up to 500 characters.
- **Color**: the chip color, any hex color value.

## What you can label

Labels apply to three resource types:

- **Configurations**: label configurations to filter the configuration
  list.
- **Agents**: label agents to organize the agent list.
- **Configuration groups**: label groups to filter the group list.

Deleting a label removes it from every resource it is assigned to.

## Permissions

Creating, editing, and deleting labels requires label permissions:
the Owner, Administrator, and Manager roles have full label access, and
the Viewer role can only view labels.
Assigning a label to a resource or removing one from it requires write
permission on that resource, not label permissions.
