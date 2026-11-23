---
title: Create an API token
description: >
  Create a new API token for authenticating with the Telegraf Controller API.
menu:
  telegraf_controller:
    name: Create a token
    parent: Manage API tokens
weight: 101
related:
  - /telegraf/controller/reference/permissions/
  - /telegraf/controller/reference/authentication-authorization/
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
2.  Click **{{% lucide "plus" %}} Create API Token**.
    The **Create API Token** page opens.
3.  In the **Details** card, enter a **Description** that identifies where or
    how the token will be used.
    Each token needs a different description.
4.  _(Optional)_ Change the **Expiration**.
    The default is **30 days**.
    Select **Never** to keep the token active until you revoke it, or
    **Custom** to enter a number of minutes, hours, days, or years.
5.  _(Optional)_ To supply your own token value instead of generating one,
    expand **Provide your own token string** and enter a value that meets the
    [token requirements](/telegraf/controller/tokens/preshared/#token-requirements).
    See [Use pre-shared tokens](/telegraf/controller/tokens/preshared/).
    This section isn't shown when pre-shared tokens are
    [disabled](/telegraf/controller/tokens/preshared/#disable-pre-shared-tokens)
    on the instance.
6.  In the **Permissions** card, select a **Permissions Preset** or check the
    actions the token may perform on each resource.
    See [Custom permissions](#custom-permissions).
7.  Click **Create Token**.

<!-- TODO: screenshot of the Create API Token page showing the Details and Permissions cards (the previous image at this path shows the former dialog). Save to /static/img/telegraf/controller-create-token.png and replace this comment with: {{< img-hd src="/img/telegraf/controller-create-token.png" alt="Telegraf Controller Create API Token page" />}} -->

After the token is created, the page shows the token value once:

- Click **{{% lucide "copy" %}} Copy Token** to copy the value.
- Click **Back to Tokens** to return to the token list, or **View Token** to
  open the new token's detail page.

> [!Important]
> #### Copy and store your token
>
> Copy your API token immediately after creation.
> The full token value is only displayed once and cannot be retrieved later.

## Custom permissions

The **Permissions** card lists the resources your role can access, with a
checkbox for each action the resource supports: **Read**, **Write**, and
**Delete**.
**All** checks every action in the row.

- Select a **Permissions Preset** to fill the grid: **Telegraf Agent**,
  **Read-Only**, or, for Owners and Administrators, **Full Access**.
  Changing any box switches the preset back to **Custom**.
- Actions your role can't perform are disabled, and resources your role has no
  access to aren't listed.

{{% product-name %}} intersects the requested permissions with your role's
permissions.
You can use custom permissions to narrow a token's access, but you cannot
create a token with more access than your role allows.
For example, if you have the **Manager** role, you cannot create a token with
user management permissions.

Custom permissions are useful when you want to issue a token for a specific task,
such as read-only access to configurations, without exposing the full scope of
your role.

For the syntax of the permission string the grid builds, the full list of
resources and actions, and how requested permissions are restricted, see
[Permissions](/telegraf/controller/reference/permissions/).

## If you lose a token

If you lose or forget a token value, you cannot recover it.
Revoke the lost token and create a new one to restore access.

For instructions on revoking a token, see [Revoke an API token](/telegraf/controller/tokens/revoke/).
