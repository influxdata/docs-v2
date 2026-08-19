---
title: Authentication and authorization
description: >
  Reference for how Telegraf Controller verifies user identity, decides
  what each user can do, and protects API endpoints. Covers authentication
  providers, user roles, API tokens, and endpoint-level authentication.
menu:
  telegraf_controller:
    name: Authentication and authorization
    parent: Reference
weight: 106
aliases:
  - /telegraf/controller/reference/authorization/
related:
  - /telegraf/controller/authentication/
  - /telegraf/controller/users/
  - /telegraf/controller/tokens/
  - /telegraf/controller/settings/
  - /telegraf/controller/reference/api/
---

{{% product-name %}} distinguishes two security questions:

- **Authentication**: who is making this request? Verified by a sign-in
  flow (local, LDAP, or OIDC) or by a presented API token.
- **Authorization**: what is the authenticated identity allowed to do?
  Determined by the user's role and by endpoint-level access policies.

This page is the reference for both. For task-based instructions, see
[Authentication](/telegraf/controller/authentication/) and
[Manage users](/telegraf/controller/users/).

- [Authentication providers](#authentication-providers)
- [Identity model](#identity-model)
- [User roles](#user-roles)
- [API tokens](#api-tokens)
- [Endpoint authentication](#endpoint-authentication)
- [License management](#license-management)

## Authentication providers

{{% product-name %}} supports three authentication providers that can run
individually or together:

| Provider  | Availability                                                     | How users sign in                                    |
| :-------- | :--------------------------------------------------------------- | :--------------------------------------------------- |
| **Local** | Free tier                                                        | Username and password stored in {{% product-name %}} |
| **LDAP**  | [Telegraf Enterprise](/telegraf/enterprise/) | Bind against an LDAP or Active Directory server      |
| **OIDC**  | [Telegraf Enterprise](/telegraf/enterprise/) | Authorization code + PKCE flow with an OIDC provider |

Each provider is enabled at startup with a dedicated environment variable
(`AUTH_LOCAL_ENABLED`, `AUTH_LDAP_ENABLED`, `AUTH_OIDC_ENABLED`). Provider
transport settings are read once at startup and immutable until restart.
Provisioning rules and group-to-role mappings are stored in the database
and editable at runtime from the **Settings** page.

For setup instructions, see:

- [Configure local authentication](/telegraf/controller/authentication/local/)
- [Configure LDAP authentication](/telegraf/controller/authentication/ldap/)
- [Configure OIDC authentication](/telegraf/controller/authentication/oidc/)

## Identity model

Every user account carries an `authProvider` (`local`, `ldap`, or `oidc`)
and, for external providers, an `externalId` that links the account to
the identity in the source directory or identity provider:

- **Local users** have a stored password hash and are subject to the
  configured password complexity, lockout, and reset policies.
- **LDAP users** have no password hash; authentication is delegated to the
  LDAP server. The `externalId` is the user's distinguished name (DN).
- **OIDC users** have no password hash; authentication is delegated to the
  OIDC provider. The `externalId` is the `sub` claim from the ID token.

### First-time sign-in and provisioning

When an LDAP or OIDC user signs in for the first time,
{{% product-name %}} applies the provider's **provisioning strategy** to
decide whether to create a {{% product-name %}} account:

- `invite_only`: requires a matching pending invite (default).
- `domain_restricted`: admits invited users; otherwise requires an email
  domain in the allow list.
- `auto_create`: creates an account for any user the provider
  authenticates.

The provider's **default role** and **group-to-role mappings** determine
the new account's role.

For setup details, see
[Authentication](/telegraf/controller/authentication/).

### Owner account behavior

The owner is the only account that:

- Always retains a local password hash, even if its primary
  `authProvider` is `ldap` or `oidc`. The hash provides a recovery
  credential if the external provider becomes unreachable.
- Cannot be downgraded by group-to-role mappings. Owner is reserved.
- Cannot be auto-linked from an external provider. Account-takeover
  protection prevents an external sign-in from claiming the owner
  record.

Only the owner can change the LDAP and OIDC sections of the **Settings**
page (`PATCH /api/auth/settings`). Administrators can change local login
security but not external provider configuration.

## User roles

{{% product-name %}} enforces a four-tier role hierarchy. Each role
inherits the permissions of the roles below it, and higher roles unlock
additional administrative capabilities.

| Role            | Description                                                                                                          |
| :-------------- | :------------------------------------------------------------------------------------------------------------------- |
| **Owner**       | Full system access. Manages users, tokens, settings, and authentication providers. Only one owner exists at a time. Created during initial setup. |
| **Administrator** | Full system access. Same capabilities as the owner except cannot transfer ownership or modify LDAP/OIDC settings.   |
| **Manager**     | Manages configurations, agents, labels, and reporting rules. Manages own API tokens. Cannot manage users or settings.  |
| **Viewer**      | Read-only access to configurations, agents, labels, and reporting rules. Cannot manage tokens, users, or settings.     |

Only one owner can exist at a time.
The owner account is created during initial setup and cannot be deleted.
If you need to change the owner, the current owner must transfer ownership
to another user.

> [!Tip]
> To change the owner of your {{% product-name %}} instance, see
> [Transfer ownership](/telegraf/controller/users/transfer-ownership/).

## API tokens

API tokens authenticate programmatic API requests and Telegraf agent
connections to {{% product-name %}}.

Each token is scoped to the user who created it.
The token's effective permissions are restricted to the creating user's
role. A token cannot exceed the permissions of its owner.
If a user's role changes to a role with less permissions, all of that
user's existing tokens are automatically updated with restricted
permissions or revoked to match the new role.

Tokens use the `tc-apiv1_` prefix, making them easy to identify in
configuration files and scripts.

> [!Important]
> A token value is shown only once at the time of creation.
> Store it in a secure location immediately. You cannot retrieve it later.

API tokens are independent of the authentication provider that created the
underlying user account. An LDAP user, an OIDC user, and a local user all
issue tokens the same way.

## Endpoint authentication

By default, {{% product-name %}} requires authentication for API endpoints.
Operators can selectively disable authentication for individual endpoint
groups at startup:

- **Agents**: agent management endpoints
- **Configs**: configuration management endpoints
- **Labels**: label management endpoints
- **Reporting rules**: reporting rule management endpoints
- **Heartbeat**: agent heartbeat endpoints

When authentication is enabled for an endpoint group, every request to
that group must include a valid API token or an active session.

Endpoint authentication policy is independent of the user authentication
provider configuration. Disabling endpoint authentication for a group
removes the requirement to present a token or session regardless of which
provider would otherwise be used.

Endpoint authentication is controlled exclusively by the
[`--disable-auth-endpoints` CLI flag or `DISABLED_AUTH_ENDPOINTS` environment
variable](/telegraf/controller/reference/config-options/#disable-auth-endpoints),
read once at startup and immutable at runtime. To change which endpoint
groups skip authentication, update the value and restart
{{% product-name %}}.

## License management

{{% product-name %}} exposes two permission resources for the
[Telegraf Enterprise license](/telegraf/enterprise/):

| Resource | Actions | Required role | Description |
| :------- | :------ | :------------ | :---------- |
| `license` | `read`, `write` | **Owner** | View, apply, replace, and remove the license. |
| `entitlements` | `read` | Any authenticated user | View current entitlements (scale limits, enterprise feature availability) and usage. |

Only the **Owner** can apply, replace, or remove a license.

Any authenticated user, including Viewers, can call
`GET /api/license/entitlements` to read the current entitlements and usage.
This endpoint is intended for monitoring and capacity-planning scripts.
