---
title: Delete a user
description: >
  Permanently delete a user account and all associated API tokens from
  Telegraf Controller.
menu:
  telegraf_controller:
    name: Delete a user
    parent: Manage users
weight: 106
---

> [!Warning]
> #### Deleting a user cannot be undone
>
> Deleting a user is permanent and cannot be undone.
> All of the user's API tokens are also deleted.

## What deletion removes

When you delete a user from {{% product-name %}}, the following are permanently
removed:

- User account and credentials
- All API tokens owned by the user
- All active sessions

## Delete a user

1.  In the {{% product-name %}} UI, navigate to **Users** and click the user you
    want to delete to open their detail page.
2.  Click **Delete User**.
3.  In the confirmation dialog, confirm the deletion.

The user is immediately removed and can no longer authenticate with
{{% product-name %}}.

## Restrictions

- You cannot delete your own account.
- You cannot delete the owner — you must
  [transfer ownership](/telegraf/controller/users/transfer-ownership/) first.
- Only the owner can delete administrator accounts.

> [!Tip]
> If you're unsure whether to delete a user, consider
> [disabling them](/telegraf/controller/users/disable/) first.
> Disabled accounts can be re-enabled later.
