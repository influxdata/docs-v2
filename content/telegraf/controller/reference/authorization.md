---
title: Authorization
description: >
  Understand how authentication and authorization work in Telegraf Controller,
  including user roles, API tokens, and endpoint security.
menu:
  telegraf_controller:
    name: Authorization
    parent: Reference
weight: 106
related:
  - /telegraf/controller/users/
  - /telegraf/controller/tokens/
  - /telegraf/controller/settings/
---

{{% product-name %}} uses session-based authentication for the web UI and
token-based authentication for API and Telegraf agent requests.
Both mechanisms work together to control who can access the system and what
actions they can perform.

## User roles

{{% product-name %}} enforces a four-tier role hierarchy.
Each role inherits the permissions of the roles below it, and higher roles
unlock additional administrative capabilities.

| Role            | Description                                                                                                          |
| :-------------- | :------------------------------------------------------------------------------------------------------------------- |
| **Owner**       | Full system access. Manages users, tokens, and settings. Only one owner exists at a time. Created during initial setup. |
| **Administrator** | Full system access. Same capabilities as the owner except cannot transfer ownership.                                |
| **Manager**     | Manages configurations, agents, labels, and reporting rules. Manages own API tokens. Cannot manage users or settings.  |
| **Viewer**      | Read-only access to configurations, agents, labels, and reporting rules. Cannot manage tokens, users, or settings.     |

Only one owner can exist at a time.
The owner account is created during initial setup and cannot be deleted.
If you need to change the owner, the current owner must transfer ownership to
another user.

> [!Tip]
> To change the owner of your {{% product-name %}} instance, see [Transfer ownership](/telegraf/controller/users/transfer-ownership/).

## API tokens

API tokens authenticate programmatic API requests and Telegraf agent connections
to {{% product-name %}}.

Each token is scoped to the user who created it.
The token's effective permissions are restricted to the creating user's role---a
token cannot exceed the permissions of its owner.
If a user's role changes to a role with less permissions, all of that user's
existing tokens are automatically updated with restricted permissions or revoked
to match the new role.

Tokens use the `tc-apiv1_` prefix, making them easy to identify in configuration
files and scripts.

> [!Important]
> A token value is shown only once at the time of creation.
> Store it in a secure location immediately---you cannot retrieve it later.

## Endpoint authentication

By default, {{% product-name %}} requires authentication for API endpoints.
Operators can selectively disable authentication for individual endpoint groups
at startup:

- **Agents** --- agent management endpoints
- **Configs** --- configuration management endpoints
- **Labels** --- label management endpoints
- **Reporting rules** --- reporting rule management endpoints
- **Heartbeat** --- agent heartbeat endpoints

When authentication is enabled for an endpoint group, every request to that
group must include a valid API token or an active session.

Authentication policy is controlled exclusively by the
[`--disable-auth-endpoints` CLI flag or `DISABLED_AUTH_ENDPOINTS` environment
variable](/telegraf/controller/reference/config-options/#disable-auth-endpoints),
read once at startup and immutable at runtime. To change which endpoint groups
skip authentication, update the value and restart {{% product-name %}}.
