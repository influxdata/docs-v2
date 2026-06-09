---
title: Authentication
description: >
  Configure how users sign in to Telegraf Controller. Choose between local
  username and password authentication, LDAP, and OIDC identity providers,
  or run multiple providers side by side.
menu:
  telegraf_controller:
    name: Authentication
weight: 8
cascade:
  related:
    - /telegraf/controller/reference/authentication-authorization/
    - /telegraf/controller/users/
    - /telegraf/controller/settings/
---

{{% product-name %}} supports three authentication providers that you can run
individually or together:

| Provider  | Availability                                                     | How users sign in                                    |
| :-------- | :--------------------------------------------------------------- | :--------------------------------------------------- |
| **Local** | Free                                                             | Username and password stored in {{% product-name %}} |
| **LDAP**  | [Telegraf Enterprise](/telegraf/enterprise/) | Bind against an LDAP or Active Directory server      |
| **OIDC**  | [Telegraf Enterprise](/telegraf/enterprise/) | Authorization code + PKCE flow with an OIDC provider |

Each provider is enabled and configured independently. You can run all three
at once and let users choose at the sign-in screen, or restrict sign-in to a
single provider.

## Choose an authentication provider

- **Use local authentication** when you don't have a central identity
  provider, or when you need a non-enterprise deployment.
- **Use LDAP** to authenticate against an existing LDAP directory or
  Active Directory and provision users from directory groups.
- **Use OIDC** to authenticate against a modern identity provider
  (Okta, Auth0, Keycloak, Microsoft Entra ID, Google Workspace, and others)
  using authorization code flow with PKCE.

> [!Note]
> #### Local authentication can be disabled
>
> If your security policy prohibits storing passwords in {{% product-name %}},
> you can disable local authentication after configuring LDAP or OIDC and
> bootstrapping an owner against that provider.
> For details, see
> [Configure local authentication](/telegraf/controller/authentication/local/#disable-local-authentication).

## Multi-factor authentication and single sign-on

{{% product-name %}} does not implement multi-factor authentication (MFA)
or single sign-on (SSO) directly. Both are delegated to the configured
identity provider:

- **Local authentication** does not support MFA or SSO. Use LDAP or OIDC
  if either is required.
- **LDAP authentication** enforces whatever MFA policy your LDAP or
  Active Directory server applies during the bind step.
- **OIDC authentication** enforces whatever MFA and SSO policies your
  OpenID Connect provider applies during the authorization step. Users
  already signed into the provider get single sign-on automatically.

To require MFA for {{% product-name %}}, configure it in your identity
provider and disable local authentication so users sign in through that
provider only.

## Configuration model

Transport-level authentication settings such as URLs, bind credentials, client
secrets, and claim or attribute names are read from environment variables (or
command-line flags) at startup and are immutable until you restart
{{% product-name %}}.

Provisioning and identity-mapping settings (provisioning strategy, default
role, allowed email domains, group-to-role mappings) are stored in the
database and editable at runtime from the **Settings** page by an owner or
administrator. The table below summarizes the split.

| Setting category                                          | Configured by                                  | Editable at runtime |
| :-------------------------------------------------------- | :--------------------------------------------- | :-----------------: |
| Enable or disable a provider                              | Environment variable                           |         No          |
| LDAP server URL, bind credentials, TLS, attribute mapping | Environment variable                           |         No          |
| OIDC issuer, client credentials, scopes, claims, callback | Environment variable                           |         No          |
| Provisioning strategy and default role                    | Settings page                                  |         Yes         |
| Allowed email domains                                     | Settings page                                  |         Yes         |
| Auto-link by verified email                               | Settings page                                  |         Yes         |
| Group-to-role mappings                                    | Settings page                                  |         Yes         |

## Provisioning strategies

When an LDAP or OIDC user signs in for the first time,
{{% product-name %}} applies the provider's **provisioning strategy** to
decide whether to create a {{% product-name %}} account for them.

| Strategy            | Behavior on first sign-in                                                                            |
| :------------------ | :--------------------------------------------------------------------------------------------------- |
| `invite_only`       | Only users with a pending invite for the matching email and provider are admitted. Default.          |
| `domain_restricted` | A pending invite admits the user; otherwise, the email must end with an allowed domain.              |
| `auto_create`       | A pending invite admits the user; otherwise, any user the provider authenticates is auto-created.    |

Each external provider has its own provisioning strategy. For example, you can run LDAP
in `invite_only` while OIDC is in `auto_create`.

## Group-to-role mapping

For LDAP and OIDC, {{% product-name %}} reads a list of groups from the
identity provider and maps them to {{% product-name %}} roles. You define
mappings on the **Settings** page as rows of `(provider, group name, role)`.

- If a user belongs to multiple mapped groups, the highest role wins.
- If a user matches no mapping, the provider's **default role** is assigned
  or sign-in is rejected, depending on the provider's
  **On no group match** setting.
- The **Owner** role is never assigned through a mapping. You can [Transfer ownership](/telegraf/controller/users/transfer-ownership/) instead.

## Owner account behavior

The owner is the only account that can change LDAP and OIDC settings and is
treated specially across providers:

- The owner always retains a local password hash, even if LDAP or OIDC is the
  account's primary provider. This guarantees a recovery path if your
  identity provider becomes unreachable.
- The owner's role cannot be downgraded by LDAP or OIDC group mappings.
- An external identity provider cannot auto-link to the owner account.
  Account-takeover protection prevents an external login from claiming the
  existing owner record.

You can bootstrap an owner against LDAP or OIDC on first startup using the
[`OWNER_AUTH_PROVIDER`](/telegraf/controller/reference/config-options/#owner-auth-provider)
and
[`OWNER_EXTERNAL_ID`](/telegraf/controller/reference/config-options/#owner-external-id)
environment variables. This is required if you intend to disable local
authentication.

{{< children hlevel="h2" >}}
