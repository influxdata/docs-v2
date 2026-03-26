---
title: Manage API tokens
description: >
  Create and manage API tokens for authenticating API requests and
  Telegraf agent connections to Telegraf Controller.
menu:
  telegraf_controller:
    name: Manage API tokens
weight: 8
cascade:
  related:
    - /telegraf/controller/reference/authorization/
---

API tokens authenticate requests to the {{% product-name %}} API and Telegraf agent connections.
Use tokens to authorize Telegraf agents, heartbeat requests, and external API clients.

## Token format

All API tokens use the `tc-apiv1_` prefix, making them easy to identify in
configuration files and scripts.

The full token value is displayed only once at the time of creation and cannot be retrieved later.
Copy and store the token in a secure location immediately after creating it.

> [!Important]
> #### Raw token strings are not stored
>
> Tokens are stored as a cryptographic hash. The original value is never saved.
> If you lose a token, you must revoke it and create a new one.

## Token permissions

Each token is scoped to a specific user.
Token permissions are restricted to the permissions allowed by the user's role.
A token cannot exceed the permissions of the user it belongs to.

When you create a token, you can set custom permissions to restrict the token's
access below your full role permissions.
This lets you issue narrowly scoped tokens for specific tasks, such as a token
that can only register agents or a token limited to read-only access.

## Token states

Tokens exist in one of two states:

- **Active** -- The token can be used for authentication.
- **Revoked** -- The token is permanently disabled but the record is retained
  for auditing purposes.

Revoking a token is irreversible.
Any agent or client using a revoked token immediately loses access.

## Token visibility

Your role determines which tokens you can view and manage:

| Role              | Token visibility                  |
|:------------------|:----------------------------------|
| **Owner**         | All tokens across all users       |
| **Administrator** | All tokens across all users       |
| **Manager**       | Only their own tokens             |
| **Viewer**        | Cannot manage tokens              |

> [!Note]
> **Owner** and **Administrator** users can revoke any token in the organization,
> including tokens belonging to other users.

{{< children hlevel="h2" >}}
