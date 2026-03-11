---
title: Revoke a token
description: >
  Revoke an API token to immediately prevent its use while keeping
  the token record for auditing.
menu:
  telegraf_controller:
    name: Revoke a token
    parent: Manage API tokens
weight: 104
---

Revoking a token immediately prevents it from being used for authentication
while keeping the token record in the system for auditing purposes.
Unlike deletion, revocation preserves a full history of the token, including
when it was created and when it was disabled.

## Revoke versus delete

{{% product-name %}} supports two ways to remove a token from active use:
**revocation** and **deletion**.

- **Revoked** tokens remain visible in the token list with a **Revoked** status.
  This provides an audit trail showing when the token was created and when it
  was disabled. Revoked tokens cannot be used for authentication.
- **Deleted** tokens are permanently removed from the system.
  No record of the token is retained after deletion.

Use revoke when you want to disable a token but maintain an audit trail.
Use delete when you want to completely remove the token and its record from the system.

For more information about deleting a token, see
[Delete a token](/telegraf/controller/tokens/delete/).

## Revoke a token

1.  Navigate to the **API Tokens** page, or open the token's detail view.
2.  Click **Revoke**. If on the token detail page, select the **Manage** tab to
    reveal the **Revoke** action.
3.  Confirm the revocation in the dialog.

The token status changes to **Revoked** and any requests that use the token are
immediately rejected.

> [!Note]
> #### You cannot reactivate a revoked token
>
> Revocation is permanent. You cannot re-activate a revoked token.
> If you need to restore access, create a new token.
> See [Create a token](/telegraf/controller/tokens/create/).

## Bulk revoke

To revoke multiple tokens at once:

1. On the **API Tokens** page, select the tokens you want to revoke.
2. Click **Revoke** in the bulk actions bar.
3. Confirm the revocation in the dialog.

All selected tokens are immediately revoked and can no longer be used for
authentication.
