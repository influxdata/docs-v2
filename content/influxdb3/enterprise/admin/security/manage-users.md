---
title: Manage users and authentication
seotitle: Manage users and authentication in InfluxDB 3 Enterprise
description: >
  Enable multi-user authentication in {{% product-name %}}, bootstrap the
  initial admin, and manage user login.
menu:
  influxdb3_enterprise:
    name: Manage users
    parent: Security
weight: 201
related:
  - /influxdb3/enterprise/reference/internals/rbac/
  - /influxdb3/enterprise/admin/tokens/
  - /influxdb3/enterprise/admin/explorer-ui/
---

<!-- GA status per 3.12 product release notes; confirm with product before publishing. -->

> [!Note]
> #### User authentication is off by default
>
> Multi-user authentication and role-based access control (RBAC) are
> generally available in {{% product-name %}} 3.12, but remain **opt-in**.
> Start the server with `--user-auth-type` to turn it on. Existing `apiv3_`
> token workflows are unaffected.

Multi-user authentication lets users log in to {{% product-name %}} with
individual credentials that issue JSON Web Tokens (JWTs).
Access is governed by
[role-based access control (RBAC)](/influxdb3/enterprise/reference/internals/rbac/).
Multi-user authentication complements, but doesn't replace, `apiv3_`
[token authentication](/influxdb3/enterprise/admin/tokens/).

## Enable user authentication

User authentication is off by default (`--user-auth-type none`).
To enable it, start the server with `--user-auth-type` set to one or both
authentication methods:

```bash
# Username and password sign-in
influxdb3 serve --user-auth-type basic

# OAuth/OIDC sign-in
influxdb3 serve --user-auth-type oauth

# Both
influxdb3 serve --user-auth-type basic,oauth
```

`none` disables user authentication and can't be combined with other values.
`--user-auth-type` has no effect when the server starts with `--without-auth`.

For the complete list of authentication serve flags, see the
[`influxdb3 serve`](/influxdb3/enterprise/reference/cli/influxdb3/serve/) CLI
reference and
[configuration options](/influxdb3/enterprise/reference/config-options/#user-auth-type).

## Configure JWT signing keys

`basic` sign-in requires an RSA key pair to sign JWTs.
Provide the key ID and private key with `--jwt-key-id` and
`--jwt-private-key`. The private key **must be in PKCS#1 format**.
Generate a compatible key with the `-traditional` flag:

```bash
openssl genrsa -traditional -out jwt-private-key.pem 2048
```

```bash { placeholders="JWT_KEY_ID" }
influxdb3 serve \
  --user-auth-type basic \
  --jwt-key-id JWT_KEY_ID \
  --jwt-private-key "$(cat jwt-private-key.pem)"
```

Replace the following:

- {{% code-placeholder-key %}}`JWT_KEY_ID`{{% /code-placeholder-key %}}: an
  identifier for the key (used in the JWT `kid` header; any string you choose)

> [!Warning]
> #### Use PKCS#1 keys, not PKCS#8
>
> A PKCS#8 key (the default `openssl genrsa` output without `-traditional`)
> **silently fails** to sign tokens. Always generate the key with
> `openssl genrsa -traditional`.

If `--jwt-key-id` or `--jwt-private-key` is missing or invalid when `basic`
sign-in is requested, the server logs a warning, starts anyway, and disables
password sign-in. `oauth` sign-in and `apiv3_` token authentication are
unaffected.

JWTs expire one hour after they're issued.

## Bootstrap the initial admin

After enabling user authentication, create the initial admin user and operator
token with `influxdb3 manage init-admin`:

```bash
influxdb3 manage init-admin
```

If you enabled only `oauth` sign-in (no `--jwt-key-id` and
`--jwt-private-key`), pass the subject (`sub`) claim your identity provider
issues for that person instead of a username and password:

```bash { placeholders="OAUTH_SUBJECT" }
influxdb3 manage init-admin --oauth-id OAUTH_SUBJECT
```

Replace {{% code-placeholder-key %}}`OAUTH_SUBJECT`{{% /code-placeholder-key %}}
with the `sub` claim your identity provider issues for that person.

`init-admin` prints the operator token once. Store it securely: there's no way
to retrieve it again.

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
> the issued JWT server-side. The token remains valid until it expires
> (one hour by default).

## Upgrading to 3.12: sign in again if a token is rejected

3.12 requires each JWT's `aud` (audience) claim to match the cluster's catalog
UUID. Access tokens issued to `basic` sign-in users **before** upgrading to
3.12 don't have a matching claim and are rejected after the upgrade.

If a client has a stored refresh token, `influxdb3 auth login` and other
clients that call `POST /api/v3/authorize/refresh` obtain a new, valid access
token automatically. If refreshing fails, sign in again with
`influxdb3 auth login`.

`apiv3_` API tokens are unaffected by this change.

## Optional: Authenticate with OAuth/OIDC

To delegate authentication to an OAuth/OIDC identity provider, start the
server with `--user-auth-type oauth` (or `basic,oauth`) and set
`--oauth-issuer`, `--oauth-audience`, and `--oauth-client-id`:

```bash { placeholders="OAUTH_ISSUER_URL|OAUTH_AUDIENCE|OAUTH_CLIENT_ID" }
influxdb3 serve \
  --user-auth-type oauth \
  --oauth-issuer OAUTH_ISSUER_URL \
  --oauth-audience OAUTH_AUDIENCE \
  --oauth-client-id OAUTH_CLIENT_ID
```

Replace the following:

- {{% code-placeholder-key %}}`OAUTH_ISSUER_URL`{{% /code-placeholder-key %}}:
  the identity provider's issuer URL
- {{% code-placeholder-key %}}`OAUTH_AUDIENCE`{{% /code-placeholder-key %}}:
  the audience to validate incoming OAuth tokens against
- {{% code-placeholder-key %}}`OAUTH_CLIENT_ID`{{% /code-placeholder-key %}}:
  the OAuth client ID registered with the identity provider

`--oauth-client-id` is also required for `influxdb3 auth login --oauth` and
for browser sign-in to the
[integrated Explorer UI](/influxdb3/enterprise/admin/explorer-ui/).

For browser-based SSO through the integrated Explorer UI, also set
`--webui-public-uri`. See
[Use the integrated Explorer UI](/influxdb3/enterprise/admin/explorer-ui/#configure-sso-for-the-explorer-ui).

## Roles

{{% product-name %}} includes three built-in roles--**Admin**, **Auditor**, and
**Member**. Assign roles to users to control what they can do.
For details on each role and the permissions model, see
[Role-based access control (RBAC)](/influxdb3/enterprise/reference/internals/rbac/).
