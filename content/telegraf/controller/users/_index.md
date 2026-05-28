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
    - /telegraf/controller/authentication/
    - /telegraf/controller/reference/authentication-authorization/
---

Users are accounts that can log into the {{% product-name %}} web interface and
interact with the system based on their assigned role.
You can create, update, disable, and delete users to control who has access to
your {{% product-name %}} instance.

## Authentication providers

Every user account is tied to one authentication provider:

- **Local users** sign in with a username and password stored in
  {{% product-name %}}. Owners and administrators can create local users
  through [invites](/telegraf/controller/users/invite/) and can manage
  their passwords from the **Users** page.
- **LDAP users** sign in with their LDAP credentials. Accounts are
  provisioned automatically the first time a user signs in, according to
  the LDAP provider's
  [provisioning strategy](/telegraf/controller/authentication/#provisioning-strategies)
  and [group-to-role mappings](/telegraf/controller/authentication/#group-to-role-mapping).
- **OIDC users** sign in through an OpenID Connect identity provider.
  Accounts are provisioned automatically the first time a user signs in,
  according to the OIDC provider's
  [provisioning strategy](/telegraf/controller/authentication/#provisioning-strategies)
  and [group-to-role mappings](/telegraf/controller/authentication/#group-to-role-mapping).

LDAP and OIDC require a
[Telegraf Enterprise](/telegraf/controller/telegraf-enterprise/) license.
For setup instructions, see
[Authentication](/telegraf/controller/authentication/).

## User states

Each user account is in one of the following states:

- **Active**: The user can log in and perform actions based on their assigned
  role.
- **Disabled**: The user cannot log in. Existing API tokens remain associated
  with the account but are unusable while the user is disabled.
- **Locked**: A temporary state triggered by too many failed login attempts.
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
[Authentication and authorization](/telegraf/controller/reference/authentication-authorization/).

{{< children hlevel="h2" >}}
