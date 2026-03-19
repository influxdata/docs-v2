---
title: Create an API token
description: >
  Create a new API token for authenticating with the Telegraf Controller API.
menu:
  telegraf_controller:
    name: Create a token
    parent: Manage API tokens
weight: 101
---

Create a new API token to authenticate requests to the {{% product-name %}} API.
Tokens let you grant scoped access to external tools, scripts, and services without sharing your login credentials.

> [!Important]
> #### Required permissions
>
> You must have an **Owner**, **Administrator**, or **Manager** role assigned to
> your account.

## Create a token

1.  Navigate to the **API Tokens** page.
2.  Click **Create Token**.
3.  Enter a **Description** for the token that identifies where or how the token
    will be used.
4.  _(Optional)_ Set an **Expiration** date.
    Tokens without an expiration date remain active indefinitely.
5.  _(Optional)_ Set **Custom permissions** to restrict the token's access below
    your role's full permissions.
    See [Custom permissions](#custom-permissions) for details.
6.  Click **Create**.

{{< img-hd src="/img/telegraf/controller-create-token.png" alt="Telegraf Controller create token form" />}}

> [!Important]
> #### Copy and store your token
>
> Copy your API token immediately after creation.
> The full token value is only displayed once and cannot be retrieved later.

## Custom permissions

When you set custom permissions on a token, {{% product-name %}} intersects
those permissions with your role's existing permissions.
This means you can use custom permissions to narrow a token's access, but you
cannot create a token with more access than your role allows.

For example, if you have the **Manager** role, you cannot create a token with
user management permissions.
The resulting token will only include the permissions that overlap with what
your role grants.

Custom permissions are useful when you want to issue a token for a specific task,
such as read-only access to configurations, without exposing the full scope of
your role.

## If you lose a token

If you lose or forget a token value, you cannot recover it.
Revoke the lost token and create a new one to restore access.

For instructions on revoking a token, see [Revoke an API token](/telegraf/controller/tokens/revoke/).
