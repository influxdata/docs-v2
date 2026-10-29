---
title: Transfer ownership
description: >
  Transfer the Telegraf Controller owner role to another administrator.
  The owner sends a request and the administrator accepts it.
menu:
  telegraf_controller:
    name: Transfer ownership
    parent: Manage users
weight: 104
related:
  - /telegraf/controller/reference/authentication-authorization/
  - /telegraf/controller/admin/audit-logs/
  - /telegraf/controller/reference/api/
---

The **Owner** role grants full administrative access to {{% product-name %}},
including the ability to manage all users, tokens, and settings. Only one owner
can exist at a time. The current owner can transfer ownership to any active
administrator.

An ownership transfer is a two-step handoff: the owner sends a request, and
the target administrator accepts it. Nothing changes until the target
accepts.

- [Prerequisites and restrictions](#prerequisites-and-restrictions)
- [How a transfer works](#how-a-transfer-works)
- [Request the transfer](#request-the-transfer)
- [Accept the transfer](#accept-the-transfer)
- [Decline or cancel a request](#decline-or-cancel-a-request)
- [What happens when the transfer is accepted](#what-happens-when-the-transfer-is-accepted)
- [Use the API](#use-the-api)

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

1. The owner sends a transfer request to an administrator.
   The request is **pending** and expires after three days.
   Only one request can be pending at a time. A new request replaces the
   previous one.
2. The target administrator accepts or declines the request, or the owner
   cancels it.
   A request that reaches its expiry time expires on its own.
3. When the target accepts, the roles swap in a single operation.
   See [What happens when the transfer is accepted](#what-happens-when-the-transfer-is-accepted).

Both sides can see the request in the web interface while it is pending:
the owner on the **Users** page, and the target in a banner on every page and
on their **Account** page.
With [audit logging](/telegraf/controller/admin/audit-logs/) enabled,
{{% product-name %}} records each step.

## Request the transfer

1.  Navigate to the **Users** page or the target user's detail page.
2.  Choose the target **Administrator** from the list (if not already selected).
3.  Select the **{{% lucide "shield" %}} Make Owner** option. If on the user detail page, select the
    **Manage** tab to reveal the **Make Owner** option.
4.  Review what the request does, type the username of the user you want to
    transfer ownership to, and click **Transfer Ownership**.

{{< img-hd src="/img/telegraf/controller-transfer-ownership.png" alt="Telegraf Controller transfer ownership confirmation" />}}

The dialog confirms that the request was sent and when it expires.
You remain the owner until the target accepts.
While the request is pending, the **Users** page shows a
**Pending Ownership Transfer** section with the target's name and the expiry
time, and the target's **Make Owner** option becomes **Cancel Request**.

## Accept the transfer

While a request is waiting for you, every page shows a banner that names the
owner who sent it and when it expires.

1.  Sign in to {{% product-name %}} as the target administrator.
2.  Click **Review request** in the banner, or open your **Account** page
    from the account menu.
3.  In the **Pending ownership transfer** card, click **Accept**.
4.  In the **Accept Ownership** dialog, confirm the handoff.
    If your account signs in through LDAP or OIDC and has no local password,
    the dialog also asks for a recovery password: enter it in
    **Recovery password** and **Confirm recovery password**.
    The password must meet the
    [password complexity requirements](/telegraf/controller/settings/#password-complexity-requirements).
5.  Click **Accept Ownership**.

{{< img-hd src="/img/telegraf/controller-account-pending-ownership-transfer.png" alt="Telegraf Controller Account page with a pending ownership transfer" />}}

You are now the owner. The change applies immediately: your **Account** page
shows the **Owner** role and the navigation updates without signing in again.

> [!Note]
> #### Why a recovery password is required
>
> The owner account always keeps a local password so that it can sign in
> when an external identity provider is unreachable.
> The recovery password you set becomes that local password.
> See [Owner account behavior](/telegraf/controller/reference/authentication-authorization/#owner-account-behavior).

If the request was cancelled, expired, or the sender is no longer the owner
when you accept, the dialog shows the error and nothing changes.

## Decline or cancel a request

- **Target administrator**: on your **Account** page, click **Decline** in the
  **Pending ownership transfer** card and confirm.
  The owner can send a new request later.
- **Owner**: cancel the request from any of the following places, then
  confirm with **Cancel request**:
  - The **Pending Ownership Transfer** section on the **Users** page.
  - The **{{% lucide "ban" %}} Cancel Request** button on the target user's
    **Manage** tab.
  - The **{{% lucide "shield-off" %}} Cancel Ownership Request** option in
    the target user's row menu.

A declined, cancelled, or expired request cannot be accepted; the owner must
send a new request.

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

Nobody is signed out.
The new owner's browser updates as soon as the request is accepted, and the
former owner's browser picks up the new role within a minute.

> [!Tip]
> #### Coordinate ownership transfers
>
> Coordinate with the target user before sending a request.
> The request expires after three days if it is not accepted.

> [!Warning]
> #### You cannot reclaim the Owner role yourself
>
> Once the transfer is accepted, you cannot reclaim the **Owner** role
> yourself. The new owner must transfer it back to you.

## Use the API

The same operations are available from the API for scripted use.
Every route requires a signed-in session, not an API token.

| Route | Who | Description |
| :---- | :-- | :---------- |
| `POST /api/users/transfer-owner` | Owner | Send a request. The body takes `targetUserId` and an optional `expiresInHours` from `1` to `168` (default `72`). Returns the request `id`, `expiresAt`, and `status`. |
| `GET /api/users/transfer-owner/pending` | Owner or target | Return the pending request that involves you, including `fromUsername`, `toUsername`, `expiresAt`, and `requiresRecoveryPassword`. Returns `404` when nothing is pending. |
| `POST /api/users/transfer-owner/accept` | Target | Accept the request. Include `recoveryPassword` in the body when `requiresRecoveryPassword` is `true`. |
| `POST /api/users/transfer-owner/decline` | Target | Decline the request. |
| `DELETE /api/users/transfer-owner/pending` | Owner | Cancel the request. |

For example, to send a request that expires in 24 hours:

```json
{
  "targetUserId": "01HZ8R5T4VX9YQK0M2N3P4Q5R6",
  "expiresInHours": 24
}
```

The [interactive API reference](/telegraf/controller/reference/api/#explore-the-interactive-api-reference)
sends requests with your browser session, so you can use it for any of these
routes.
