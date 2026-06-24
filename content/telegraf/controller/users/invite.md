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
3. Select an **Authentication provider** for the new user. The selector
   appears only when more than one provider is enabled. Default is
   **Local**. See
   [Invite an external provider user](#invite-an-external-provider-user)
   for the LDAP and OIDC flows.
4. Enter a **Username** for the new user (3--50 characters).
5. Enter the user's **Email** address.
6. Select a **Role** for the new user:
   - **Administrator** -- full access to all resources and user management.
   - **Manager** -- can manage configurations, agents, and labels but cannot
     manage users.
   - **Viewer** -- read-only access to all resources.
7. Set the invite **Expiration** in hours. The default is 72 hours. Valid
   values range from 1 to 720 hours (30 days).
8. Click **Create Invite**.

{{< img-hd src="/img/telegraf/controller-invite-user.png" alt="Telegraf Controller invite user form" />}}

> [!Note]
> You cannot invite a user with the **Owner** role. To make someone the owner,
> first invite them as an **Administrator**, then
> [transfer ownership](/telegraf/controller/users/transfer-ownership/).

## Invite an external provider user

When LDAP or OIDC authentication is enabled, you can pre-authorize an
external user by selecting their provider in the **Authentication
provider** dropdown when creating the invite.

- The invite matches on **email + provider**. The user must sign in
  through the selected provider with an email that matches the invite.
- LDAP and OIDC invites do not require a password step; the external
  provider authenticates the user.
- Use invites when the provider's
  [provisioning strategy](/telegraf/controller/authentication/#provisioning-strategies)
  is `invite_only`, or when you want to pre-assign a role that overrides
  the provider's default role.

For provider setup, see
[Authentication](/telegraf/controller/authentication/).

## Share the invite link

After creating the invite, {{% product-name %}} displays a unique invite link.
Copy the link and share it with the user through your preferred communication
channel (email, chat, etc.).

The link expires after the duration you configured. Once expired, the link can
no longer be used and you must create a new invite.

## Accept an invite

### Accept a local invite

The invited user completes the following steps to activate a local account:

1. Open the invite link in a browser.
2. Set a password that meets the configured complexity requirements.
3. Click **Create Account**.

The account activates immediately and the user is automatically logged in with
the role assigned during the invite.

### Accept an LDAP or OIDC invite

When the invite is tied to LDAP or OIDC, the invited user signs in through
their identity provider instead of choosing a password:

1. Open the invite link in a browser.
2. Click the **LDAP** or **Sign in with `<display-name>`** button.
3. Complete the provider's sign-in flow.

The account activates the first time the user signs in successfully with
an email address that matches the invite.

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
