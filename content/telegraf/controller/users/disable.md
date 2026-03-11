---
title: Disable a user
description: >
  Disable a user account to prevent login without deleting the account
  or its associated tokens.
menu:
  telegraf_controller:
    name: Disable a user
    parent: Manage users
weight: 105
---

Disabling a user prevents them from logging in without permanently deleting their account or tokens.
This is useful when you want to temporarily revoke access or are unsure whether to delete the account.

## What disabling does

When you disable a user account in {{% product-name %}}:

- The user cannot log in to the web interface.
- All active sessions are destroyed immediately.
- Existing API tokens remain in the system but cannot be used for authentication
  while the user is disabled.
- The user's data (account details, token records) is preserved.

## Disable a user

1. Navigate to the user's detail page.
2. Toggle the user's status to **Disabled** (or click the **Disable** option).
3. Confirm the action.

> [!Note]
> You cannot disable your own account or the **Owner** account.

## Re-enable a user

1. Navigate to the disabled user's detail page.
2. Toggle the user's status to **Active** (or click the **Enable** option).

Once re-enabled, the user can log in immediately with their existing credentials.
Their API tokens also become usable again.
