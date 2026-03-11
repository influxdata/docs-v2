---
title: Reassign a token
description: >
  Reassign an API token from one user to another in Telegraf Controller.
menu:
  telegraf_controller:
    name: Reassign a token
    parent: Manage API tokens
weight: 103
---

Reassigning an API token from one user to another in Telegraf Controller lets
you transfer ownership of that token to another user without disrupting any
external clients using the token.

> [!Important]
> #### Required permissions
> 
> To reassign an API token, you must have the **Owner** or **Administrator**
> role in {{% product-name %}}.

## Reassign a token

You can reassign an individual token from one user to another directly from the
token's detail view or the tokens list.

1.  In {{% product-name %}}, navigate to the **API Tokens** page or open the
    detail page for the token you want to reassign.
2.  Click **Reassign** on the token you want to transfer. If on the token detail
    page, select the **Manage** tab to reveal the **Reassign** action.
3.  In the dialog that appears, select the target user you want to assign the
    token to.
4.  Click **Confirm** to complete the reassignment.

> [!Important]
> When you reassign a token, its permissions are automatically restricted to
> match the target user's role. For example, a token with full access reassigned
> to a Viewer becomes a read-only token.

## Bulk reassign

If you need to reassign multiple tokens at once, use the bulk reassign option.

1.  On the **API Tokens** page, select the checkboxes next to the tokens you want
    to reassign.
2.  Click the **Reassign** option in the bulk actions bar.
3.  Select the target user you want to assign the selected tokens to.
4.  Click **Confirm** to reassign all selected tokens.

The same permission restriction applies during bulk reassignment. Each token's
permissions are adjusted to align with the target user's role.

## When to reassign

Reassigning tokens lets you transfer ownership without revoking and recreating
tokens. This is useful in several common scenarios:

- **Offboarding a user**: A user is leaving the organization and their tokens
  should continue working under another account.
  Reassigning ensures active integrations are not disrupted.
- **Reorganizing responsibilities**: Team members are shifting roles or
  responsibilities and token ownership should reflect the new structure.
- **Consolidating ownership after role changes**: After updating user roles, you
  may want to consolidate tokens under a single account to simplify token management.
