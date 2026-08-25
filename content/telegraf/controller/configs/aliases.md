---
title: Manage configuration aliases
seotitle: Manage Telegraf configuration aliases with Telegraf Controller
description: >
  Use configuration aliases in Telegraf Controller to reference Telegraf
  configurations with human-readable names instead of configuration IDs and
  repoint agents to a different configuration without changing agent commands.
menu:
  telegraf_controller:
    name: Manage aliases
    parent: Manage configurations
weight: 104
related:
  - /telegraf/controller/configs/use/
  - /telegraf/controller/configs/update/
  - /telegraf/controller/tokens/use/
---

Configuration aliases are human-readable names for Telegraf configurations.
Use an alias in place of the configuration ID in both the {{% product-name %}}
user interface and the API, including the configuration URLs that agents use
to retrieve configuration TOML. Because you can transfer an alias from one
configuration to another, aliases also let you repoint agents to a different
configuration without changing agent startup commands.

## Alias naming rules

An alias must:

- be 3 to 63 characters long.
- contain only lowercase letters, digits, and hyphens.
- begin and end with a letter or digit.

Aliases are unique across your {{% product-name %}} instance, and the
namespace is shared with
[configuration group aliases](/telegraf/controller/config-groups/aliases/):
an alias points to exactly one configuration or configuration group at a
time. The names `bulk`, `duplicate`, and `many` are reserved, and strings
shaped like configuration IDs (36-character UUIDs) are not allowed.

## View aliases

1.  In the {{% product-name %}} web interface, select **Configurations** in
    the navigation bar.
2.  Click the name of the configuration.
3.  Select the **Aliases** tab.

The aliases table includes the following for each alias:

- **Alias**: the alias name.
- **Agents Using Alias**: the number of agents currently reporting with a
  configuration URL that uses the alias. Use this count to judge the impact
  of transferring or deleting an alias.

## Add an alias

1.  On the **Aliases** tab, click **{{% lucide "plus" %}} Add Alias**.
2.  Enter an alias that follows the [naming rules](#alias-naming-rules) and
    confirm.

If the alias is already assigned to another configuration,
{{% product-name %}} shows which configuration owns the alias and how many
agents use it, and offers to [transfer the alias](#transfer-an-alias) to this
configuration instead.

## Use an alias

Anywhere the {{% product-name %}} API accepts a configuration ID, you can use
an alias instead. {{% product-name %}} also provides a short URL for
retrieving configuration TOML by alias:

```text
http://localhost:8888/c/my-config-alias
```

For example, to start a Telegraf agent with an alias-based configuration URL:

```bash
telegraf \
  --config "http://localhost:8888/c/my-config-alias"
```

Alias-based URLs support the same query parameters as ID-based configuration
URLs for [substituting values](/telegraf/controller/configs/substitute-values/).
If {{% product-name %}} requires authentication on the **Configs** API,
alias-based URLs require the same API token as ID-based URLs. For details,
see [Use Telegraf configurations](/telegraf/controller/configs/use/).

## Transfer an alias

Transferring an alias reassigns it to a different configuration. Agents that
use an alias-based configuration URL with `--config-url-watch-interval` load
the newly targeted configuration on their next check, letting you roll out a
different configuration to a fleet of agents without modifying the agents.
Transfers can also move an alias between a configuration and a
[configuration group](/telegraf/controller/config-groups/aliases/#repoint-agents-from-a-configuration-to-a-group).
For details, see
[Auto-update agents](/telegraf/controller/configs/use/#auto-update-agents).

1.  On the **Aliases** tab, in the alias's row, click the
    **More button ({{% lucide "ellipsis-vertical" %}})** and select
    **{{% lucide "circle-arrow-out-up-right" %}} Transfer**.
2.  Search for and select the configuration to transfer the alias to.
3.  Click **Confirm & Transfer**.

## Delete an alias

1.  On the **Aliases** tab, in the alias's row, click the
    **More button ({{% lucide "ellipsis-vertical" %}})** and select
    **{{% lucide "trash-2" %}} Delete**.
2.  Review the confirmation and click **Confirm & Delete**.

The confirmation shows how many agents are using the alias. Agents that
retrieve their configuration by a deleted alias can no longer load the
configuration.

Deleting an alias does not affect the configuration itself. When you delete a
configuration, its aliases are deleted automatically.

## Permissions

Alias operations require permissions on the **Configs** resource:

- **Read**: view aliases
- **Write**: add, transfer, and delete aliases

For how permissions map to user roles and API tokens, see
[Authentication and authorization](/telegraf/controller/reference/authentication-authorization/).
