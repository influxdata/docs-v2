---
title: Manage global constants
seotitle: Manage global constants with Telegraf Controller
description: >
  Define global constants in Telegraf Controller and reference them in
  Telegraf configurations. Telegraf Controller substitutes constant values
  server-side when serving configuration TOML.
menu:
  telegraf_controller:
    name: Manage constants
    parent: Manage configurations
weight: 106
related:
  - /telegraf/controller/configs/substitute-values/
  - /telegraf/controller/configs/use/
  - /telegraf/controller/configs/ui/code-editor/
---

Global constants are name-value pairs defined once in {{% product-name %}}
and referenced by name in configuration TOML using the `::{constant_name}`
syntax. {{% product-name %}} substitutes the constant values server-side when
serving a configuration, so agents receive TOML with the values already in
place. Use constants for values shared across configurations, for example, a
common endpoint URL or organization name.

For how constants compare to parameters, environment variables, and secrets,
see [Substitute values in configurations](/telegraf/controller/configs/substitute-values/).

> [!Important]
> #### Do not use constants for sensitive information
>
> Constant values are stored in plain text and inserted directly into served
> configurations. Use environment variables or secrets to provide sensitive
> information to agents.

## Constant naming and value rules

A constant name must:

- start with a letter or underscore.
- contain only letters, digits, and underscores.
- be 128 characters or fewer.

Constant names are unique across your {{% product-name %}} instance and
cannot be changed after the constant is created. To rename a constant, create
a new constant and update the configurations that reference the old one.

A constant value:

- can be up to 65,536 characters long.
- cannot contain double quotes or line breaks.
- is inserted into configuration TOML exactly as written, so the value must be
  valid in the TOML context where the constant is referenced.

## View constants

1.  In the {{% product-name %}} web interface, select
    **Configurations** > **Constants** in the navigation bar.

The **Global Constants** page includes the following for each constant:

- **Constant**: the constant name.
- **Value**: the constant value.
- **Configs**: the number of configurations that reference the constant.
  Click the count to view the configurations.

## Add a constant

1.  On the **Global Constants** page, click
    **{{% lucide "plus" %}} Add Constant**.
2.  Enter a name that follows the
    [naming rules](#constant-naming-and-value-rules) and a value.
3.  Click **Add Constant**.

## Update a constant's value

1.  On the **Global Constants** page, click the
    **More button ({{% lucide "ellipsis-vertical" %}})** in the constant's
    row and select **{{% lucide "eye" %}} View/Edit**.
2.  Enter a new value. The constant name cannot be changed.
3.  Click **Update Constant**.

Updating a constant value registers a change in every configuration that
references the constant. Agents that watch for configuration changes with
`--config-url-watch-interval` reload the affected configurations on their
next check. For details, see
[Auto-update agents](/telegraf/controller/configs/use/#auto-update-agents).

## View configurations that use a constant

The **Configs** column on the **Global Constants** page shows how many
configurations reference each constant. To see which configurations they are,
click the count, or select **{{% lucide "eye" %}} View/Edit** from the
constant's actions menu and expand the usage list. Each entry links to the
configuration.

## Delete a constant

1.  On the **Global Constants** page, click the
    **More button ({{% lucide "ellipsis-vertical" %}})** in the constant's
    row and select **{{% lucide "trash-2" %}} Delete**.
2.  Confirm the deletion.

A constant that is referenced by one or more configurations cannot be
deleted. {{% product-name %}} returns an error listing the configurations
that use the constant; remove the references first, then delete the constant.

## Undefined constants

If a configuration references a constant that is not defined:

- The [Code Editor](/telegraf/controller/configs/ui/code-editor/) flags the
  undefined constant while you edit.
- When an agent requests the configuration, {{% product-name %}} returns an
  error listing the undefined constant names instead of serving the TOML.

Define the missing constants, or remove the references, to restore the
configuration.

## Permissions

Constant operations require permissions on the **Constants** resource:

- **Read**: view constants and their usage.
- **Write**: add constants and update constant values.
- **Delete**: delete constants.

For how permissions map to user roles and API tokens, see
[Authentication and authorization](/telegraf/controller/reference/authentication-authorization/).

## Constants API

Manage constants programmatically using the {{% product-name %}} API.
Constant endpoints are available under `/api/constants`. For the full API
reference, see [Telegraf Controller API](/telegraf/controller/reference/api/).
