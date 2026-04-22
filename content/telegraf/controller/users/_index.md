---
title: Manage users
description: >
  Manage user accounts in Telegraf Controller, including creating, updating,
  disabling, and deleting users.
menu:
  telegraf_controller:
    name: Manage users
weight: 7
cascade:
  related:
    - /telegraf/controller/reference/authorization/
---

Users are accounts that can log into the {{% product-name %}} web interface and
interact with the system based on their assigned role.
You can create, update, disable, and delete users to control who has access to
your {{% product-name %}} instance.

## User states

Each user account is in one of the following states:

- **Active** --- The user can log in and perform actions based on their assigned
  role.
- **Disabled** --- The user cannot log in. Existing API tokens remain associated
  with the account but are unusable while the user is disabled.
- **Locked** --- A temporary state triggered by too many failed login attempts.
  The lock clears automatically after the configured lockout period. See the
  [Settings](/telegraf/controller/settings/) page for configuration options.

## User roles

{{% product-name %}} supports four roles with different levels of access:

| Role              | Access level                                                        |
|:------------------|:--------------------------------------------------------------------|
| **Owner**         | Full access. Manages users, tokens, and settings.                   |
| **Administrator** | Full access except ownership transfer.                              |
| **Manager**       | Manages configs, agents, labels, reporting rules, and own tokens.   |
| **Viewer**        | Read-only access.                                                   |

For more details about roles and permissions, see
[Authorization](/telegraf/controller/reference/authorization/).

{{< children hlevel="h2" >}}
