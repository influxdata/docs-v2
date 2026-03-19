---
title: Invite a new user
description: >
  Invite new users to Telegraf Controller by generating an invite link with
  a pre-assigned role.
menu:
  telegraf_controller:
    name: Invite a new user
    parent: Manage users
weight: 102
---

Owners and administrators can invite new users to {{% product-name %}} by
generating an invite link with a pre-assigned role and expiration.
The invited user opens the link, sets a password, and their account is
immediately active.

> [!Note]
> You must have the **Owner** or **Administrator** role to create invites.

## Create an invite

1. Navigate to the **Users** page.
2. Click the {{% icon "plus" %}} **Invite User** button.
3. Enter a **Username** for the new user (3--50 characters).
4. Enter the user's **Email** address.
5. Select a **Role** for the new user:
   - **Administrator** -- full access to all resources and user management.
   - **Manager** -- can manage configurations, agents, and labels but cannot
     manage users.
   - **Viewer** -- read-only access to all resources.
6. Set the invite **Expiration** in hours. The default is 72 hours. Valid
   values range from 1 to 720 hours (30 days).
7. Click **Create Invite**.

{{< img-hd src="/img/telegraf/controller-invite-user.png" alt="Telegraf Controller invite user form" />}}

> [!Note]
> You cannot invite a user with the **Owner** role. To make someone the owner,
> first invite them as an **Administrator**, then
> [transfer ownership](/telegraf/controller/users/transfer-ownership/).

## Share the invite link

After creating the invite, {{% product-name %}} displays a unique invite link.
Copy the link and share it with the user through your preferred communication
channel (email, chat, etc.).

The link expires after the duration you configured. Once expired, the link can
no longer be used and you must create a new invite.

## Accept an invite

The invited user completes the following steps to activate their account:

1. Open the invite link in a browser.
2. Set a password that meets the configured complexity requirements.
3. Click **Create Account**.

The account activates immediately and the user is automatically logged in with
the role assigned during the invite.

## Manage pending invites

You can view and manage all pending invites from the **Users** page.
Pending invites appear in a separate list above active users.

To revoke a pending invite before it is used:

1. Navigate to the **Users** page.
2. Locate the pending invite you want to remove.
3. Click the **Delete** button next to the invite.
4. Confirm the deletion when prompted.

Deleting a pending invite invalidates the invite link. The invited user can no
longer use it to create an account.
