---
title: Transfer ownership
description: >
  Transfer the Telegraf Controller owner role to another administrator.
  The owner requests the transfer and the administrator accepts it.
menu:
  telegraf_controller:
    name: Transfer ownership
    parent: Manage users
weight: 104
related:
  - /telegraf/controller/reference/authentication-authorization/
  - /telegraf/controller/reference/api/
---

The **Owner** role grants full administrative access to {{% product-name %}},
including the ability to manage all users, tokens, and settings. Only one owner
can exist at a time. The current owner can transfer ownership to any active
administrator.

An ownership transfer is a two-step handoff: the owner requests the transfer,
and the target administrator accepts it. Nothing changes until the target
accepts.

- [Prerequisites and restrictions](#prerequisites-and-restrictions)
- [How a transfer works](#how-a-transfer-works)
- [Request the transfer](#request-the-transfer)
- [Accept the transfer](#accept-the-transfer)
- [Decline or cancel a request](#decline-or-cancel-a-request)
- [What happens when the transfer is accepted](#what-happens-when-the-transfer-is-accepted)

## Prerequisites and restrictions

- Only the current **Owner** can request a transfer, and only the current
  **Owner** can cancel one.
- The target user must have the **Administrator** role and be in an active state.
- If the target user is a **Manager** or **Viewer**, you must first promote them
  to **Administrator**. See
  [Change a user's role](/telegraf/controller/users/update/#change-a-users-role).
- You cannot transfer ownership to yourself.
- The target must accept the request before it expires.
- Every transfer operation requires a signed-in session.
  API tokens cannot request, accept, decline, or cancel a transfer.
  See [Session-only endpoints](/telegraf/controller/reference/authentication-authorization/#session-only-endpoints).

## How a transfer works

1. The owner requests a transfer to an administrator.
   The request is **pending** and expires after 72 hours by default.
   Only one request can be pending at a time; a new request cancels the
   previous one.
2. The target administrator accepts or declines the request, or the owner
   cancels it.
   A request that reaches its expiry time expires on its own.
3. When the target accepts, the roles swap in a single operation.
   See [What happens when the transfer is accepted](#what-happens-when-the-transfer-is-accepted).

> [!Important]
> #### The web interface does not show pending requests
>
> In {{% product-name %}} 1.2, the web interface can only request a
> transfer. After you confirm the request, the dialog reports the transfer as
> complete and returns you to the sign-in page, but you remain the owner until
> the target accepts.
> The target accepts, declines, and the owner cancels through the
> [{{% product-name %}} API](/telegraf/controller/reference/api/), as
> described below.

## Request the transfer

1.  Navigate to the **Users** page or the target user's detail page.
2.  Choose the target **Administrator** from the list (if not already selected).
3.  Select the **{{% lucide "shield" %}} Make Owner** option. If on the user detail page, select the
    **Manage** tab to reveal the **Make Owner** option.
4.  Confirm the username of the user you want to transfer ownership to and click
    **Transfer Ownership**.

{{< img-hd src="/img/telegraf/controller-transfer-ownership.png" alt="Telegraf Controller transfer ownership confirmation" />}}

{{% product-name %}} records the request and returns you to the sign-in page.
Sign in again if you need to keep working; your role has not changed yet.
Tell the target administrator that a request is waiting for them.

To set a different expiry, request the transfer from the API instead.
`POST /api/users/transfer-owner` accepts the target's user ID and an optional
`expiresInHours` from `1` to `168`:

```json
{
  "targetUserId": "01HZ8R5T4VX9YQK0M2N3P4Q5R6",
  "expiresInHours": 24
}
```

## Accept the transfer

The target administrator accepts the request through the API from their own
signed-in session.
The easiest way is the
[interactive API reference](/telegraf/controller/reference/api/#explore-the-interactive-api-reference),
which sends requests with your browser session.

1.  Sign in to {{% product-name %}} as the target administrator and open
    `/api/docs`.
2.  Send `GET /api/users/transfer-owner/pending` to see the waiting request.
    A `404` response means no request is pending for your account.

    ```json
    {
      "id": "6f1c2a9e-3b4d-4c5e-8f70-1a2b3c4d5e6f",
      "fromUserId": "01HZ8R5T4VX9YQK0M2N3P4Q5R6",
      "fromUsername": "alice",
      "toUserId": "01J0ABCDEF1234567890GHJKLM",
      "expiresAt": "2026-05-30T18:42:11.512Z",
      "createdAt": "2026-05-27T18:42:11.512Z",
      "requiresRecoveryPassword": true
    }
    ```

3.  Send `POST /api/users/transfer-owner/accept`.
    If `requiresRecoveryPassword` is `true`, your account signs in through
    LDAP or OIDC and has no local password, so the request body must include a
    recovery password that meets the
    [password complexity requirements](/telegraf/controller/settings/#password-complexity-requirements):

    ```json { placeholders="RECOVERY_PASSWORD" }
    { "recoveryPassword": "RECOVERY_PASSWORD" }
    ```

    Replace {{% code-placeholder-key %}}`RECOVERY_PASSWORD`{{% /code-placeholder-key %}}
    with the password to use if your identity provider becomes unavailable.
    If `requiresRecoveryPassword` is `false`, send an empty JSON object.

    A `204` response means the transfer is complete.

4.  Sign out and sign in again so that your session reflects the **Owner**
    role.

The owner account always keeps a local password so that it can sign in when
an external provider is unreachable.
See [Owner account behavior](/telegraf/controller/reference/authentication-authorization/#owner-account-behavior).

## Decline or cancel a request

- **Target administrator**: send `POST /api/users/transfer-owner/decline`
  from your signed-in session to decline the request.
- **Owner**: send `DELETE /api/users/transfer-owner/pending` from your
  signed-in session to cancel the request you made.

Both return `204`. A declined, cancelled, or expired request cannot be
accepted; the owner must make a new request.

## What happens when the transfer is accepted

When the target accepts, {{% product-name %}} performs an atomic operation
that updates both accounts together:

- The current owner is demoted to **Administrator**.
- The target user is promoted to **Owner**.
- If the target supplied a recovery password, it becomes the local password of
  the new owner account.
- The former owner's API tokens are re-clamped to the **Administrator**
  role's permissions.
- The operation is atomic: all changes succeed together or none takes effect.

> [!Tip]
> #### Coordinate ownership transfers
>
> Coordinate with the target user before requesting a transfer.
> The request expires if it is not accepted in time, and both of you should
> sign in again once it completes.

> [!Warning]
> #### You cannot reclaim the Owner role yourself
>
> Once the transfer is accepted, you cannot reclaim the **Owner** role
> yourself. The new owner must transfer it back to you.
