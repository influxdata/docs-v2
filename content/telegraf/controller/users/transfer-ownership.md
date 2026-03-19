---
title: Transfer ownership
description: >
  Transfer the Telegraf Controller owner role to another administrator.
menu:
  telegraf_controller:
    name: Transfer ownership
    parent: Manage users
weight: 104
---

The **Owner** role grants full administrative access to {{% product-name %}},
including the ability to manage all users, tokens, and settings. Only one owner
can exist at a time. The current owner can transfer ownership to any active
administrator.

## Prerequisites and restrictions

- Only the current **Owner** can transfer ownership.
- The target user must have the **Administrator** role and be in an active state.
- If the target user is a **Manager** or **Viewer**, you must first promote them
  to **Administrator**. See
  [Change a user's role](/telegraf/controller/users/update/#change-a-users-role).
- You cannot transfer ownership to yourself.

## Transfer the owner role

1.  Navigate to the **Users** page or the target user's detail page.
2.  Choose the target **Administrator** from the list (if not already selected).
3.  Select the **Make Owner** option. If on the user detail page, select the
    **Manage** tab to reveal the **Make Owner** option.
4.  Confirm the username of the user you want to transfer ownership to and click
    **Transfer Ownership**.

{{< img-hd src="/img/telegraf/controller-transfer-ownership.png" alt="Telegraf Controller transfer ownership confirmation" />}}

## What happens during transfer

When you confirm the transfer, {{% product-name %}} performs an atomic operation
that updates both accounts simultaneously:

- The current owner is demoted to **Administrator**.
- The target user is promoted to **Owner**.
- Both users' sessions are destroyed -- both must log in again.
- The operation is atomic: both changes succeed together or neither takes effect.

> [!Tip]
> #### Coordinate ownership transfers
>
> Coordinate with the target user before transferring ownership. Both accounts
> are logged out immediately after the transfer completes.

> [!Warning]
> #### You cannot reclaim the Owner role yourself
>
> Once transferred, you cannot reclaim the **Owner** role yourself. The new
> owner must transfer it back to you.
