---
title: Manage users and authentication
seotitle: Manage users and authentication in InfluxDB 3 Enterprise
description: >
  Enable multi-user authentication in {{% product-name %}}, bootstrap the
  initial admin, and manage user login. User authentication is a preview feature.
menu:
  influxdb3_enterprise:
    name: Manage users
    parent: Security
weight: 201
related:
  - /influxdb3/enterprise/reference/internals/rbac/
  - /influxdb3/enterprise/admin/tokens/
---

> [!Note]
> #### User authentication is a preview feature
>
> Multi-user authentication is available as a preview in {{% product-name %}}
> 3.10 and is **off by default**. Existing `apiv3_` token workflows are
> unaffected. The following known limitations apply:
>
> - `influxdb3 auth logout` removes local credentials but does **not** revoke the
>   issued JWT server-side.
> - A non-admin user can currently create tokens with broader permissions than their assigned role.
> - Role-based permissions are limited and still being finalized. Only the
>   **Admin** role (or an admin token) currently has full access. The **Auditor**
>   and **Member** roles grant less access than their names suggest. Use an admin
>   token for user and role management.

Multi-user authentication lets users log in to {{% product-name %}} with
individual credentials that issue JSON Web Tokens (JWTs), with access governed by
[role-based access control (RBAC)](/influxdb3/enterprise/reference/internals/rbac/).
It complements--but doesn't replace--`apiv3_`
[token authentication](/influxdb3/enterprise/admin/tokens/).

## Enable user authentication

User authentication is off by default (`--without-user-auth true`).
To enable it, start the server with `--without-user-auth false`:

```bash
influxdb3 serve --without-user-auth false
```

For the complete list of authentication serve flags, see the
[`influxdb3 serve`](/influxdb3/enterprise/reference/cli/influxdb3/serve/) CLI
reference.

## Configure JWT signing keys

User authentication signs JWTs with an RSA private key that **must be in PKCS#1 format**. Generate a compatible key with the `-traditional` flag:

```bash
openssl genrsa -traditional -out jwt-private-key.pem 2048
```

> [!Warning]
> #### Use PKCS#1 keys, not PKCS#8
>
> A PKCS#8 key (the default `openssl genrsa` output without `-traditional`)
> **silently fails** to sign tokens. Always generate the key with
> `openssl genrsa -traditional`.

## Bootstrap the initial admin

After enabling user authentication, create the initial admin user and operator
token with `influxdb3 manage init-admin`:

```bash
influxdb3 manage init-admin
```

For complete syntax, see the
[`influxdb3 manage`](/influxdb3/enterprise/reference/cli/influxdb3/manage/) CLI
reference.

## Log in and out

Users authenticate with `influxdb3 auth login` and end their session with
`influxdb3 auth logout`:

```bash
influxdb3 auth login
```

Credentials are stored at `~/.influxdb3/credentials.json` and refreshed
automatically.

> [!Note]
> `influxdb3 auth logout` removes the local credentials but does **not** revoke
> the issued JWT server-side. The token remains valid until it expires.

## Optional: Authenticate with OAuth/OIDC

You can optionally delegate authentication to an OAuth/OIDC identity provider
using the `--oauth-*` serve flags (for example, `--oauth-issuer`,
`--oauth-client-id`). See the
[`influxdb3 serve`](/influxdb3/enterprise/reference/cli/influxdb3/serve/) CLI
reference for the full set of OAuth flags.

## Roles

{{% product-name %}} includes three built-in roles--**Admin**, **Auditor**, and
**Member**. Assign roles to users to control what they can do.
For details on each role and the permissions model, see
[Role-based access control (RBAC)](/influxdb3/enterprise/reference/internals/rbac/).

> [!Note]
> Authoring custom roles is not available in InfluxDB 3.10. Use the built-in roles.
