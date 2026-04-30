---
title: Update users
description: >
  Reset user passwords, change user roles, and manage user accounts in
  Telegraf Controller.
menu:
  telegraf_controller:
    name: Update users
    parent: Manage users
weight: 103
related:
  - /telegraf/controller/reference/config-options/
  - /telegraf/controller/reference/authorization/
---

Owners and administrators can reset passwords and change roles for other users in {{% product-name %}}.
These actions help maintain account security and ensure users have the appropriate level of access.

## Reset a user's password

When a user forgets their password or needs a credential refresh, you can
generate a time-limited reset link for them.

> [!Note]
> You must have the **Owner** or **Administrator** role to reset passwords.
> Only the **Owner** can reset **Administrator** passwords.

### Generate a password reset link

1. Navigate to the user's detail page.
2. Click **Reset Password**.
3. Set the link expiration. The default is 24 hours, but you can configure it from 1 to 720 hours.
4. Click **Generate Link** to create the reset link.
5. Copy the generated reset link and share it with the user through a secure channel.

### Complete a password reset

After receiving a reset link, the user completes the following steps:

1. Open the reset link in a browser.
2. Enter a new password that meets the complexity requirements.
3. Click **Submit** to save the new password.

> [!Note]
> The user is not automatically logged in after resetting their password.
> They must log in with their new credentials.

### Emergency owner password reset

If the owner account is locked out or the owner has forgotten their password,
you can reset it using environment variables.

1. Set the following environment variables:
   - [`RESET_OWNER_PASSWORD=true`](/telegraf/controller/reference/config-options/#reset-owner-password)
   - [`OWNER_PASSWORD`](/telegraf/controller/reference/config-options/#owner-password) to the desired new password
2. Restart the {{% product-name %}} application.
3. Log in with the new password.
4. Remove the `RESET_OWNER_PASSWORD` and `OWNER_PASSWORD` environment variables.

> [!Warning]
> Remove `RESET_OWNER_PASSWORD` and `OWNER_PASSWORD` environment variables after successfully logging in. Leaving them set causes the password to reset on every application restart.

## Change a user's role

You can promote or demote users by changing their assigned role.

> [!Note]
> You must have the **Owner** or **Administrator** role to change a user's role.
> Only the **Owner** can change a user's role to **Administrator**.

1. Navigate to the user's detail page.
2. Select the user's new role.
3. Confirm the change when prompted.

The following restrictions apply to role changes:

- You cannot assign the **Owner** role directly. To make a user the owner, 
  the current owner must [transfer ownership](/telegraf/controller/users/transfer-ownership/).

> [!Important]
> #### Side effects of changing a user's role
>
> - The user's API tokens are reclamped to match the new role's permissions.
>   If the new role cannot manage tokens (such as **Viewer**), all active tokens
>   are revoked.
> - The user's active sessions are destroyed. They must log in again to continue
>   using {{% product-name %}}.
