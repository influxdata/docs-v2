---
title: Configure local authentication
list_title: Local authentication
description: >
  Bootstrap the owner account, tune login security, and optionally disable
  local username and password authentication in Telegraf Controller.
menu:
  telegraf_controller:
    name: Local
    parent: Authentication
weight: 101
related:
  - /telegraf/controller/users/
  - /telegraf/controller/settings/
  - /telegraf/controller/reference/config-options/#authentication-and-security
---

Local authentication signs users in with a username and password stored in
the {{% product-name %}} database. It is enabled by default on every
installation and is the only provider available in the free tier.

- [Prerequisites](#prerequisites)
- [Enable local authentication](#enable-local-authentication)
- [Bootstrap the owner account](#bootstrap-the-owner-account)
- [Configure login security](#configure-login-security)
- [Disable local authentication](#disable-local-authentication)
- [Audit events](#audit-events)

## Prerequisites

- Permission to modify the {{% product-name %}} startup environment (for
  example, the systemd unit file or Docker run command) when changing
  startup-only settings.
- The **Owner** or **Administrator** role to change login security from the
  UI.
- To disable local authentication, a configured
  [LDAP](/telegraf/controller/authentication/ldap/) or
  [OIDC](/telegraf/controller/authentication/oidc/) provider and a
  Telegraf Enterprise license.

## Enable local authentication

Local authentication is enabled by default.
The `AUTH_LOCAL_ENABLED` environment variable controls whether it is active
and is read once at startup.

To confirm the current state, sign in as an owner or administrator and check
that the **Local** option appears on the sign-in page.
You can also call the public status endpoint:

```bash
curl -s http://localhost:8888/api/auth/status
```

The response includes a list of enabled providers. `local` appears when
local authentication is enabled.

To explicitly enable local authentication after it has been disabled, set
`AUTH_LOCAL_ENABLED=true` and restart {{% product-name %}}.

## Bootstrap the owner account

On first startup, {{% product-name %}} creates the owner account using the
values you provide through environment variables or interactive prompts.
If no owner exists when {{% product-name %}} starts and `--no-interactive`
is set, you must supply the bootstrap values:

| Variable          | Description                                |
| :---------------- | :----------------------------------------- |
| `OWNER_USERNAME`  | Username for the owner account.            |
| `OWNER_PASSWORD`  | Password for the owner account.            |
| `OWNER_EMAIL`     | Email address for the owner account.      |

```bash
export OWNER_USERNAME=admin
export OWNER_EMAIL=admin@example.com
export OWNER_PASSWORD='ChangeMeOnFirstLogin!'

telegraf_controller --no-interactive
```

> [!Note]
> #### Bootstrap-only settings
>
> {{% product-name %}} persists `OWNER_USERNAME`, `OWNER_EMAIL`, and
> `OWNER_PASSWORD` to the database on first startup. The database is the
> source of truth thereafter; changes to these environment variables do not
> affect the stored owner.

### Bootstrap the owner against an external provider

If you plan to
[disable local authentication](#disable-local-authentication), set the
owner's primary provider at the same time you bootstrap the account:

```bash
export OWNER_AUTH_PROVIDER=oidc
export OWNER_EXTERNAL_ID=00u1a2b3c4d5e6f7g8h9
```

- `OWNER_AUTH_PROVIDER` accepts `local` (default), `ldap`, or `oidc`.
- `OWNER_EXTERNAL_ID` is the identifier the external provider uses for the
  user, such as the LDAP distinguished name (DN) or the OIDC `sub` claim.

The owner always retains a local password hash, even when bootstrapped
against an external provider, so you can sign in directly if the provider
becomes unreachable.

For full provider setup, see
[Configure LDAP authentication](/telegraf/controller/authentication/ldap/#bootstrap-the-owner-against-ldap)
or
[Configure OIDC authentication](/telegraf/controller/authentication/oidc/#bootstrap-the-owner-against-oidc).

### Reset the owner password

To recover from a forgotten or compromised owner password, set
`RESET_OWNER_PASSWORD=true` together with a new `OWNER_PASSWORD` value and
restart {{% product-name %}}.

```bash
export RESET_OWNER_PASSWORD=true
export OWNER_PASSWORD='NewOwnerPassword!'

telegraf_controller --no-interactive
```

> [!Important]
> Unset `RESET_OWNER_PASSWORD` after the password has been reset to avoid
> overwriting the password on each restart.

## Configure login security

Three settings govern local sign-in behavior:

| Setting                         | Default | Where to change                                                                    |
| :------------------------------ | :-----: | :--------------------------------------------------------------------------------- |
| Failed-attempt lockout count    |   `5`   | Settings page or `LOGIN_LOCKOUT_ATTEMPTS`                                          |
| Lockout duration (in minutes)   |  `15`   | Settings page or `LOGIN_LOCKOUT_MINUTES`                                           |
| Password complexity level       |  `low`  | Settings page or `PASSWORD_COMPLEXITY`                                             |

Use the **Settings** page after first startup. Environment variables seed
the initial values when {{% product-name %}} initializes its settings.
For step-by-step instructions and the password complexity matrix, see
[Manage settings](/telegraf/controller/settings/#login-security).

These settings only apply to local authentication. LDAP and OIDC providers
enforce their own credential policies.

> [!Note]
> #### MFA and SSO are not available with local authentication
>
> Local authentication signs users in with a username and password only.
> For multi-factor authentication or single sign-on, use
> [LDAP](/telegraf/controller/authentication/ldap/) or
> [OIDC](/telegraf/controller/authentication/oidc/), where
> {{% product-name %}} delegates to the identity provider's MFA and SSO
> policy.

## Disable local authentication

Disable local authentication only after you have configured a working
external provider and bootstrapped an owner that can sign in through it.
The procedure below is irreversible without another restart.

### Prerequisites for disabling

- An active Telegraf Enterprise license.
- A configured [LDAP](/telegraf/controller/authentication/ldap/) or
  [OIDC](/telegraf/controller/authentication/oidc/) provider that
  successfully signs users in.
- An owner whose `authProvider` is the external provider, bootstrapped with
  `OWNER_AUTH_PROVIDER` and `OWNER_EXTERNAL_ID` on first startup.
- A {{% product-name %}} restart is required to apply the change.

### Disable local authentication

Set `AUTH_LOCAL_ENABLED` to `false` and restart {{% product-name %}}.

{{< tabs-wrapper >}}
{{% tabs %}}
[systemd](#)
[Docker](#)
[Shell](#)
{{% /tabs %}}
{{% tab-content %}}

Add the variable to your systemd unit file (typically
`/etc/systemd/system/telegraf-controller.service`):

```ini
[Service]
Environment=AUTH_LOCAL_ENABLED=false
```

Reload systemd and restart the service:

```bash
sudo systemctl daemon-reload
sudo systemctl restart telegraf-controller
```

{{% /tab-content %}}
{{% tab-content %}}

Pass the variable when starting the container:

```bash
docker run \
  -e AUTH_LOCAL_ENABLED=false \
  -e AUTH_OIDC_ENABLED=true \
  -e AUTH_OIDC_ISSUER=https://idp.example.com \
  influxdata/telegraf-controller
```

{{% /tab-content %}}
{{% tab-content %}}

Export the variable or pass it on the command line:

```bash
export AUTH_LOCAL_ENABLED=false
telegraf_controller --no-interactive
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

After restart:

- The sign-in page no longer offers the **Local** option.
- `POST /api/auth/login/local` returns `403 Forbidden`.
- `POST /api/auth/setup` returns `403 Forbidden`. Bootstrap an alternate
  owner only through the external provider.
- The owner can still authenticate through the external provider as long as
  it remains healthy.

> [!Warning]
> #### Local is your recovery path
>
> If you disable local authentication and your external provider becomes
> unreachable, you lose interactive sign-in access until the provider
> recovers. Keep `AUTH_LOCAL_ENABLED=true` if you do not have an
> alternative recovery procedure.

### Re-enable local authentication

Set `AUTH_LOCAL_ENABLED=true` and restart {{% product-name %}}.
The owner can then sign in with their stored password hash.

## Audit events

Local sign-in and sign-out emit the following audit events. They appear in
the audit log when audit logging is enabled.

| Event           | Description                                              |
| :-------------- | :------------------------------------------------------- |
| `user.login`    | Recorded after a successful local sign-in.               |
| `user.logout`   | Recorded when a user signs out.                          |

For details on enabling and reviewing audit events, see
[Audit logs](/telegraf/controller/audit-logs/).
