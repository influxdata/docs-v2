---
title: Configure OIDC authentication
list_title: OIDC authentication
description: >
  Authenticate Telegraf Controller users against an OpenID Connect identity
  provider with authorization code flow and PKCE, provision accounts from
  claims, and map provider groups to Telegraf Controller roles.
menu:
  telegraf_controller:
    name: OIDC
    parent: Authentication
weight: 103
related:
  - /telegraf/controller/authentication/
  - /telegraf/enterprise/
  - /telegraf/controller/reference/config-options/#authentication-and-security
  - /telegraf/controller/settings/
---

OIDC authentication signs users in through an OpenID Connect identity
provider using authorization code flow with PKCE. {{% product-name %}}
reads identity claims from the ID token and uses them to assign roles and
provision accounts.

{{< telegraf/enterprise-feature "OIDC authentication" >}}

- [Prerequisites](#prerequisites)
- [Register a client with your OIDC provider](#register-a-client-with-your-oidc-provider)
- [Configure OIDC at startup](#configure-oidc-at-startup)
- [Configure provisioning](#configure-provisioning)
- [Configure group-to-role mapping](#configure-group-to-role-mapping)
- [Bootstrap the owner against OIDC](#bootstrap-the-owner-against-oidc)
- [Provider examples](#provider-examples)
- [Disable OIDC](#disable-oidc)
- [Audit events](#audit-events)

## Prerequisites

- A valid [Telegraf Enterprise license](/telegraf/enterprise/)
  applied to your {{% product-name %}} instance.
- An OIDC-compliant identity provider that supports authorization code flow
  with PKCE (S256).
- A registered OIDC client in your identity provider with a redirect URI
  that ends with `/api/auth/oidc/callback`.
- Permission to modify the {{% product-name %}} startup environment.
- The **Owner** role to change OIDC settings from the **Settings** page.

> [!Important]
> #### OIDC transport settings change only at startup
>
> Issuer, client credentials, scopes, claims, and callback are read at
> startup and cannot be changed at runtime. Provisioning, default role,
> allowed domains, and group-to-role mappings are runtime-editable from the
> **Settings** page.

> [!Note]
> #### MFA and SSO are enforced by your OIDC provider
>
> {{% product-name %}} does not implement multi-factor authentication or
> single sign-on directly. Both are delegated to your OIDC provider during
> the authorization step. Users already signed into the provider get
> single sign-on automatically; users subject to an MFA policy complete
> that challenge before {{% product-name %}} receives the ID token.
> Configure MFA and SSO in your identity provider, not in
> {{% product-name %}}.

## Register a client with your OIDC provider

Before configuring {{% product-name %}}, create a client (also called an
application or integration) in your identity provider with the following
properties:

- **Flow:** Authorization code with PKCE (S256). {{% product-name %}}
  always uses PKCE and does not accept a provider that requires implicit
  or hybrid flows.
- **Redirect URI:** The base URL of your {{% product-name %}} instance
  followed by `/api/auth/oidc/callback`.
  Example: `https://controller.example.com/api/auth/oidc/callback`.
- **Scopes:** At minimum `openid`, `profile`, and `email`.
  Include any provider-specific scope required to emit a groups claim.
- **Claims:** Ensure the ID token includes a stable subject (`sub`), the
  user's email (`email`), and a groups list (default claim name
  `groups`).

Copy the client ID and client secret from the provider. You will pass them
to {{% product-name %}} in the next step.

## Configure OIDC at startup

Set the OIDC environment variables before starting {{% product-name %}}.

| Variable                          | Description                                                            | Required |
| :-------------------------------- | :--------------------------------------------------------------------- | :------- |
| `AUTH_OIDC_ENABLED`               | Set to `true` to enable OIDC authentication.                           | Yes      |
| `AUTH_OIDC_ISSUER`                | Provider's issuer URL.                                                 | Yes      |
| `AUTH_OIDC_CLIENT_ID`             | OAuth2 client identifier registered with the provider.                 | Yes      |
| `AUTH_OIDC_CLIENT_SECRET`         | OAuth2 client secret.                                                  | Yes      |
| `AUTH_OIDC_REDIRECT_URI`          | Callback URL ending with `/api/auth/oidc/callback`.                    | Yes      |
| `AUTH_OIDC_SCOPES`                | Space-separated OAuth2 scopes. `openid` is added automatically.        | No       |
| `AUTH_OIDC_USERNAME_CLAIM`        | ID-token claim used as the {{% product-name %}} username.              | No       |
| `AUTH_OIDC_GROUPS_CLAIM`          | ID-token claim that contains the user's groups.                        | No       |
| `AUTH_OIDC_DISPLAY_NAME`          | Friendly name shown on the **Sign in with...** button.                 | No       |
| `AUTH_OIDC_POST_LOGIN_REDIRECT`   | Path inside {{% product-name %}} to redirect to after sign-in.         | No       |
| `AUTH_OIDC_ALLOW_INSECURE`        | Allow `http://` issuers and callbacks. Development only.               | No       |

For the full description of each variable, including defaults, see
[Authentication and security configuration options](/telegraf/controller/reference/config-options/#authentication-and-security).

### Apply the configuration

{{< tabs-wrapper >}}
{{% tabs %}}
[systemd](#)
[Shell](#)
[Windows (Powershell)](#)
<!-- [Docker](#) -->
{{% /tabs %}}
{{% tab-content %}}

Add the OIDC variables to your systemd unit file (typically
`/etc/systemd/system/telegraf-controller.service`):

```ini
[Service]
Environment=AUTH_OIDC_ENABLED=true
Environment=AUTH_OIDC_ISSUER=https://idp.example.com
Environment=AUTH_OIDC_CLIENT_ID=telegraf-controller
Environment=AUTH_OIDC_CLIENT_SECRET=<client-secret>
Environment=AUTH_OIDC_REDIRECT_URI=https://controller.example.com/api/auth/oidc/callback
Environment=AUTH_OIDC_DISPLAY_NAME=Example IdP
```

Reload systemd and restart the service:

```bash
sudo systemctl daemon-reload
sudo systemctl restart telegraf-controller
```

{{% /tab-content %}}
{{% tab-content %}}

Export the variables, or pass equivalent flags on the command line:

```bash
export AUTH_OIDC_ENABLED=true
export AUTH_OIDC_ISSUER=https://idp.example.com
export AUTH_OIDC_CLIENT_ID=telegraf-controller
export AUTH_OIDC_CLIENT_SECRET='<client-secret>'
export AUTH_OIDC_REDIRECT_URI=https://controller.example.com/api/auth/oidc/callback
export AUTH_OIDC_DISPLAY_NAME='Example IdP'

telegraf_controller --no-interactive
```

{{% /tab-content %}}
{{% tab-content %}}

Set the variables in PowerShell, or pass equivalent flags on the command line:

```powershell
$env:AUTH_OIDC_ENABLED="true"
$env:AUTH_OIDC_ISSUER="https://idp.example.com"
$env:AUTH_OIDC_CLIENT_ID="telegraf-controller"
$env:AUTH_OIDC_CLIENT_SECRET="<client-secret>"
$env:AUTH_OIDC_REDIRECT_URI="https://controller.example.com/api/auth/oidc/callback"
$env:AUTH_OIDC_DISPLAY_NAME="Example IdP"

./telegraf_controller.exe --no-interactive
```

{{% /tab-content %}}
<!-- {{% tab-content %}} -->
<!-- BEGIN Docker example — hidden until an official
     influxdata/telegraf-controller Docker image is published.
     Restore this tab (and its button above) when the image ships.

Pass the variables when starting the container:

```bash
docker run \
  -e AUTH_OIDC_ENABLED=true \
  -e AUTH_OIDC_ISSUER=https://idp.example.com \
  -e AUTH_OIDC_CLIENT_ID=telegraf-controller \
  -e AUTH_OIDC_CLIENT_SECRET='<client-secret>' \
  -e AUTH_OIDC_REDIRECT_URI=https://controller.example.com/api/auth/oidc/callback \
  -e AUTH_OIDC_DISPLAY_NAME='Example IdP' \
  influxdata/telegraf-controller
```

END Docker example -->
<!-- {{% /tab-content %}} -->
{{< /tabs-wrapper >}}

After {{% product-name %}} starts, sign in as an owner and confirm:

- **Settings > OIDC Authentication** shows the redacted configuration and
  reports the issuer as discovered.
- The sign-in page shows a **Sign in with `<display-name>`** button.

Call the public status endpoint to confirm the provider is registered:

```bash
curl -s http://localhost:8888/api/auth/status
```

<!-- TODO: screenshot of the Settings > OIDC Authentication panel showing the redacted issuer/client ID, discovered status, and provisioning options. Save to /static/img/telegraf/controller-settings-oidc.png and replace this comment with: {{< img-hd src="/img/telegraf/controller-settings-oidc.png" alt="Telegraf Controller OIDC authentication settings" />}} -->

## Configure provisioning

Provisioning rules decide what happens the first time an OIDC user signs in.
Configure them on the **Settings > OIDC Authentication** panel.

| Setting                          | Description                                                                                            | Default        |
| :------------------------------- | :----------------------------------------------------------------------------------------------------- | :------------- |
| **Provisioning strategy**        | `invite_only`, `domain_restricted`, or `auto_create`. See [Provisioning strategies](/telegraf/controller/authentication/#provisioning-strategies). | `invite_only`  |
| **Default role**                 | Role assigned when no group mapping matches the user.                                                  | `viewer`       |
| **Allowed email domains**        | Comma-separated list, required when the strategy is `domain_restricted`.                               | _(none)_       |
| **Auto-link by verified email**  | When enabled, link an OIDC user to an existing local user whose email is verified and matches.         | Disabled       |
| **On no group match**            | `use_default_role` admits the user with the default role; `reject` denies the sign-in.                 | `use_default_role` |
| **Display name**                 | Overrides `AUTH_OIDC_DISPLAY_NAME` on the sign-in button.                                              | Env value      |
| **Groups claim**                 | Overrides `AUTH_OIDC_GROUPS_CLAIM` for incoming tokens.                                                | Env value      |

To update provisioning settings:

1. Sign in as an **Owner** or **Administrator**.
2. Navigate to the **Settings** page.
3. In the **OIDC Authentication** section, update the values.
4. Click **Save**.

The new values take effect on the next sign-in attempt.

## Configure group-to-role mapping

Group-to-role mappings translate values from the OIDC groups claim into
{{% product-name %}} roles.

1. On the **Settings** page, scroll to **OIDC Authentication >
   Group role mappings**.
2. Click **Add mapping** and provide:
   - **Provider ID**: a label that identifies the OIDC provider
     instance. Use the default `default` unless you run multiple
     providers.
   - **Group name**: the exact string the provider emits in the
     groups claim (for example `telegraf-admins`).
   - **Role**: `administrator`, `manager`, or `viewer`.
3. Click **Save**.

When a user signs in, {{% product-name %}} matches each group in the token
against the mappings and assigns the highest matching role. Users without
a matching group fall back to **Default role** or are rejected, depending
on **On no group match**.

> [!Note]
> #### Owner role is not assignable through mappings
>
> The Owner role is reserved for the bootstrap owner and accounts created
> by [Transfer ownership](/telegraf/controller/users/transfer-ownership/).
> Group mappings cannot promote a user to Owner.

## Bootstrap the owner against OIDC

You only need to bootstrap an OIDC-backed owner if you plan to disable
local authentication. Otherwise, the default local owner can administer
OIDC from the Settings page without limitation.

On first startup, set both of the following alongside the standard owner
variables:

```bash
export OWNER_AUTH_PROVIDER=oidc
export OWNER_EXTERNAL_ID='00u1a2b3c4d5e6f7g8h9'
```

| Variable                | Description                                                                                  |
| :---------------------- | :------------------------------------------------------------------------------------------- |
| `OWNER_AUTH_PROVIDER`   | Set to `oidc` to bootstrap the owner with OIDC as the primary provider.                      |
| `OWNER_EXTERNAL_ID`     | The user's subject claim (`sub`) from the OIDC provider. This must match the `sub` value in the ID token returned at sign-in. |

The owner can sign in through OIDC and also retains a local password hash
as a recovery credential. See
[Configure local authentication](/telegraf/controller/authentication/local/#disable-local-authentication)
for the disable-local procedure.

## Provider examples

The values shown for each provider are starting points. Use the redirect
URI for your own {{% product-name %}} installation and confirm that the
groups claim you choose is actually emitted by your provider.

{{% expand-wrapper %}}
{{% expand "Okta" %}}

In your Okta admin console, create a new **OIDC - Web Application**
integration with the redirect URI
`https://controller.example.com/api/auth/oidc/callback`.
Enable the **Groups** claim on the application and configure it to send the
group names you want to map to {{% product-name %}} roles.

```bash
export AUTH_OIDC_ENABLED=true
export AUTH_OIDC_ISSUER=https://example.okta.com
export AUTH_OIDC_CLIENT_ID=0oaXXXXXXXXXXXXXXXXX
export AUTH_OIDC_CLIENT_SECRET='<client-secret>'
export AUTH_OIDC_REDIRECT_URI=https://controller.example.com/api/auth/oidc/callback
export AUTH_OIDC_SCOPES='openid profile email groups'
export AUTH_OIDC_GROUPS_CLAIM=groups
export AUTH_OIDC_DISPLAY_NAME=Okta
```

{{% /expand %}}

{{% expand "Auth0" %}}

In your Auth0 dashboard, create a **Regular Web Application**, set the
allowed callback URL to
`https://controller.example.com/api/auth/oidc/callback`, and enable a
rule or action that adds a `groups` claim to ID tokens.

```bash
export AUTH_OIDC_ENABLED=true
export AUTH_OIDC_ISSUER=https://example.us.auth0.com/
export AUTH_OIDC_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXX
export AUTH_OIDC_CLIENT_SECRET='<client-secret>'
export AUTH_OIDC_REDIRECT_URI=https://controller.example.com/api/auth/oidc/callback
export AUTH_OIDC_SCOPES='openid profile email'
export AUTH_OIDC_GROUPS_CLAIM='https://controller.example.com/groups'
export AUTH_OIDC_DISPLAY_NAME=Auth0
```

Auth0 namespaces custom claims. Use the fully qualified claim name you
configure in your Auth0 action.

{{% /expand %}}

{{% expand "Keycloak" %}}

In your Keycloak realm, create a **Confidential** client with the redirect
URI `https://controller.example.com/api/auth/oidc/callback`. Add a
**Group Membership** client mapper and set the token claim name to
`groups`.

```bash
export AUTH_OIDC_ENABLED=true
export AUTH_OIDC_ISSUER=https://keycloak.example.com/realms/telegraf
export AUTH_OIDC_CLIENT_ID=telegraf-controller
export AUTH_OIDC_CLIENT_SECRET='<client-secret>'
export AUTH_OIDC_REDIRECT_URI=https://controller.example.com/api/auth/oidc/callback
export AUTH_OIDC_SCOPES='openid profile email'
export AUTH_OIDC_GROUPS_CLAIM=groups
export AUTH_OIDC_DISPLAY_NAME=Keycloak
```

{{% /expand %}}

{{% expand "Microsoft Entra ID" %}}

In the Microsoft Entra admin center, register a new application, add the
redirect URI `https://controller.example.com/api/auth/oidc/callback`, and
enable the **groups** claim on the **Token configuration** page. Choose
either security groups or directory roles as appropriate for your
deployment.

```bash
export AUTH_OIDC_ENABLED=true
export AUTH_OIDC_ISSUER=https://login.microsoftonline.com/<tenant-id>/v2.0
export AUTH_OIDC_CLIENT_ID=<application-id>
export AUTH_OIDC_CLIENT_SECRET='<client-secret>'
export AUTH_OIDC_REDIRECT_URI=https://controller.example.com/api/auth/oidc/callback
export AUTH_OIDC_SCOPES='openid profile email'
export AUTH_OIDC_GROUPS_CLAIM=groups
export AUTH_OIDC_DISPLAY_NAME='Microsoft Entra ID'
```

Microsoft Entra ID emits group object IDs by default, not display names.
Use the object IDs as group names in your {{% product-name %}} mappings,
or configure an app-roles claim and map roles instead.

{{% /expand %}}

{{% expand "Google Workspace" %}}

In Google Cloud Console, create an **OAuth 2.0 Client ID** of type
**Web application** and add
`https://controller.example.com/api/auth/oidc/callback` as an authorized
redirect URI.

```bash
export AUTH_OIDC_ENABLED=true
export AUTH_OIDC_ISSUER=https://accounts.google.com
export AUTH_OIDC_CLIENT_ID=<client-id>.apps.googleusercontent.com
export AUTH_OIDC_CLIENT_SECRET='<client-secret>'
export AUTH_OIDC_REDIRECT_URI=https://controller.example.com/api/auth/oidc/callback
export AUTH_OIDC_SCOPES='openid profile email'
export AUTH_OIDC_DISPLAY_NAME='Google Workspace'
```

Google does not emit a groups claim by default. To map Google Workspace
groups to {{% product-name %}} roles, either set provisioning strategy to
`domain_restricted` and rely on a default role, or front Google with an
identity provider that emits a groups claim (for example, Okta).

{{% /expand %}}
{{% /expand-wrapper %}}

## Disable OIDC

To disable OIDC authentication, remove `AUTH_OIDC_ENABLED` (or set it to a
value other than `true`) and restart {{% product-name %}}.

- `GET /api/auth/oidc/login` returns `403 Forbidden` after restart.
- Existing OIDC-provisioned user accounts remain in the database. They
  cannot sign in through OIDC until OIDC is re-enabled, but they continue
  to appear in the **Users** list.
- API tokens issued to OIDC users continue to work until the owning user
  is disabled or deleted.

## Audit events

OIDC sign-in and sign-out emit the following audit events. They appear in
the audit log when audit logging is enabled.

| Event           | Description                                              |
| :-------------- | :------------------------------------------------------- |
| `user.login`    | Recorded after a successful OIDC callback.               |
| `user.logout`   | Recorded when a user signs out.                          |

For details on enabling and reviewing audit events, see
[Audit logs](/telegraf/controller/audit-logs/).
