---
title: Delete a token
description: >
  Permanently delete an API token from Telegraf Controller.
menu:
  telegraf_controller:
    name: Delete a token
    parent: Manage API tokens
weight: 105
---

Deleting a token immediately removes the token so it cannot be used for authentication.
Unlike revocation, deletion removes all data associated with the token and token
history.

> [!Warning]
> #### Deleting and API token cannot be undone
>
> Deleting a token is permanent and cannot be undone. Any agents or clients
> using this token will lose access immediately.

## Delete versus revoke

{{% product-name %}} supports two ways to remove a token from active use:
**deletion** and **revocation**.

- **Deleted** tokens are permanently removed from the system.
  No record of the token is retained after deletion.
- **Revoked** tokens remain visible in the token list with a **Revoked** status.
  This provides an audit trail showing when the token was created and when it
  was disabled. Revoked tokens cannot be used for authentication.

Use revoke when you want to disable a token but maintain an audit trail.
Use delete when you want to completely remove the token and its record from the system.

For more information about revoking a token, see
[Revoke a token](/telegraf/controller/tokens/revoke/).

## Delete a token

1.  Navigate to the **API Tokens** page or open the token's detail view.
2.  Click **Delete** to initiate the deletion. If on the token detail
    page, select the **Manage** tab to reveal the **Delete** action.
3.  In the confirmation dialog, confirm that you want to permanently delete the token.

Once confirmed, the token is immediately deleted. Any agent or integration
that relies on the deleted token will no longer be able to authenticate with
{{% product-name %}}.

## Bulk delete tokens

You can delete multiple tokens at once from the **API Tokens** page.

1. On the **API Tokens** page, select the checkboxes next to each token you want to delete.
2. Click the **Delete** option in the bulk actions bar.
3. In the confirmation dialog, review the number of tokens to be deleted and confirm.

All selected tokens are permanently removed and immediately invalidated.
Verify that no active agents depend on the selected tokens before confirming the
bulk deletion.
