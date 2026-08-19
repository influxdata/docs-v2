---
title: Use configuration groups
seotitle: Use Telegraf configuration groups with Telegraf Controller
description: >
  Apply a Telegraf configuration group to your agents with a single URL,
  substitute values across member configurations, and keep agents up to
  date as the group changes.
menu:
  telegraf_controller:
    name: Use groups
    parent: Manage configuration groups
weight: 102
related:
  - /telegraf/controller/configs/use/
  - /telegraf/controller/configs/substitute-values/
  - /telegraf/controller/config-groups/aliases/
---

Apply a configuration group by pointing your agents to the group's TOML URL,
the same way you [apply an individual configuration](/telegraf/controller/configs/use/).

## Apply a configuration group to an agent

When starting a Telegraf agent, use a `--config` flag with the
{{% product-name %}} configuration group TOML API URL:

```bash
telegraf \
  --config "http://localhost:8888/api/config-groups/xxxxxx/toml"
```

The URL accepts the group ID or a
[group alias](/telegraf/controller/config-groups/aliases/). If the group has
an alias, you can use the shorter alias-based URL instead:

```bash
telegraf \
  --config "http://localhost:8888/c/my-group-alias"
```

To have {{% product-name %}} build the command for you, click
**Use this Config Group** on the group detail page.

If {{% product-name %}} requires authentication on the **Config Groups**
API, provide an API token with **read** permissions the same way as for
individual configurations. For details, see
[Use API tokens](/telegraf/controller/tokens/use/).

## Substitute values in group members

[Value substitution](/telegraf/controller/configs/substitute-values/) is
carried by the member configurations; a group renders whatever substitution
references its members contain:

- **Parameters**: query parameters on the group URL apply to all members.
  If any member has a required parameter without a value, the request
  returns an error listing the missing parameter names.
- **Constants**: resolved server-side across all members. Undefined
  constants cause an error listing the missing names.
- **Environment variables and secrets**: pass through unchanged and are
  resolved by the Telegraf agent, as with individual configurations.

For example, to set a parameter used by any member of the group:

```bash
telegraf \
  --config "http://localhost:8888/api/config-groups/xxxxxx/toml?agent_id=web-01"
```

## Auto-update agents

Include `--config-url-watch-interval` to have agents periodically check the
group URL for changes:

```bash
telegraf \
  --config "http://localhost:8888/api/config-groups/xxxxxx/toml" \
  --config-url-watch-interval 1h
```

The group's last-modified time reflects the group itself, its member
configurations, and any constants they reference. Adding, removing, or
reordering members, editing a member configuration, or updating a
referenced constant all cause watching agents to reload the merged
configuration on their next check.

## View agents using a group

On the group detail page, select the **Agents** tab to see the agents
reporting with this group.
