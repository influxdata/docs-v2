---
title: Manage configuration groups
seotitle: Manage Telegraf configuration groups with Telegraf Controller
description: >
  Group multiple Telegraf configurations into an ordered configuration group
  that agents retrieve from a single URL. Groups compose by reference, so
  updating a member configuration updates every group that includes it.
menu:
  telegraf_controller:
    name: Manage configuration groups
weight: 4
---

Configuration groups bundle multiple Telegraf configurations into an ordered
unit that agents retrieve in a single request. Instead of assigning each
agent its own stack of individual configurations, you assign the group.

Groups compose by reference, not by copy: a configuration can belong to
multiple groups, and editing a configuration propagates the change to every
group that includes it. This is what makes groups work as role profiles.
Build one base configuration with the system inputs every host runs, then
compose it with the configurations specific to a web server or a database
host. Tune the base configuration once and every role updates; there is no
drift between the web profile's copy and the database profile's copy,
because there are no copies. Groups also work as templates: a group that is
proven in production becomes the starting point for the next site or
deployment.

## How group TOML is rendered

When an agent or user requests a group's TOML, {{% product-name %}} renders
each member configuration in its listed order and concatenates the results
into a single TOML document. Each member's section begins with a comment
that identifies the source configuration, so you can trace any plugin in the
merged output back to the configuration it came from.

Because members are rendered at request time:

- Changes to a member configuration appear in the group's TOML immediately.
- Deleting a configuration removes it from every group that includes it.
- An empty group is valid and renders an empty configuration.

Groups cannot contain other groups; members are always individual
configurations.

{{< children hlevel="h2" >}}

## Permissions

Configuration group operations require permissions on the
**Config Groups** resource:

- **Read**: view groups and retrieve group TOML.
- **Write**: create groups, edit group details, and manage members, labels,
  and aliases.
- **Delete**: delete groups.

For how permissions map to user roles and API tokens, see
[Authentication and authorization](/telegraf/controller/reference/authentication-authorization/).
