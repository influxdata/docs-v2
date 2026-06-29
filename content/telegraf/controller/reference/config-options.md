---
title: Telegraf Controller configuration options
description: >
  Telegraf Controller lets you customize startup behavior using command-line
  flags, environment variables, or a `.env` file.
menu:
  telegraf_controller:
    name: Configuration options
    parent: Reference
weight: 103
related:
  - /telegraf/controller/install/
  - /telegraf/controller/settings/
  - /telegraf/controller/authentication/
  - /telegraf/controller/reference/authentication-authorization/
---

{{% product-name %}} accepts configuration through environment variables and,
in many cases, equivalent command-line flags. You can also load environment
variables from a `.env` file in the working directory where you start
{{% product-name %}}.

- [Configure Telegraf Controller](#configure-telegraf-controller)
- [Configuration options](#configuration-options)

## Configure Telegraf Controller

Pass configuration options using command-line flags or environment variables.
**Command-line flags take precedence over environment variables.**

### Use a `.env` file

{{% product-name %}} loads environment variables from a `.env` file in the
working directory where you start the application. Use a `.env` file to keep
sensitive values out of shell history and to share configuration across
processes.

```bash
# .env
APP_PORT=3000
HEARTBEAT_PORT=9000
DATABASE_URL=postgresql://user:password@localhost:5432/telegraf_controller
TELEGRAF_CONTROLLER_EULA=accept
```

### Example: command flags

<!--pytest.mark.skip-->

```bash
telegraf_controller \
  --port=3000 \
  --heartbeat-port=9000 \
  --database="postgresql://user:password@localhost:5432/telegraf_controller" \
  --eula-accept \
  --no-interactive
```

### Example: environment variables

<!--pytest.mark.skip-->

```bash
export APP_PORT=3000
export HEARTBEAT_PORT=9000
export DATABASE_URL="postgresql://user:password@localhost:5432/telegraf_controller"
export TELEGRAF_CONTROLLER_EULA=accept

telegraf_controller --no-interactive
```

---

## Configuration options

- [General](#general)
  - [port](#port)
  - [heartbeat-port](#heartbeat-port)
  - [ui-port](#ui-port)
  - [database](#database)
- [TLS](#tls)
  - [ssl-cert-path](#ssl-cert-path)
  - [ssl-key-path](#ssl-key-path)
- [Database TLS](#database-tls)
  - [sslmode](#sslmode)
  - [sslrootcert](#sslrootcert)
  - [database-ca-cert](#database-ca-cert)
  - [database-ssl-no-verify](#database-ssl-no-verify)
- [Owner account](#owner-account)
  - [owner-email](#owner-email)
  - [owner-username](#owner-username)
  - [owner-password](#owner-password)
  - [reset-owner-password](#reset-owner-password)
  - [owner-auth-provider](#owner-auth-provider)
  - [owner-external-id](#owner-external-id)
- [Authentication and security](#authentication-and-security)
  - [session-secret](#session-secret)
  - [disable-auth-endpoints](#disable-auth-endpoints)
  - [Local authentication](#local-authentication)
    - [auth-local-enabled](#auth-local-enabled)
    - [login-lockout-attempts](#login-lockout-attempts)
    - [login-lockout-minutes](#login-lockout-minutes)
    - [password-complexity](#password-complexity)
  - [LDAP authentication](#ldap-authentication)
    - [auth-ldap-enabled](#auth-ldap-enabled)
    - [auth-ldap-url](#auth-ldap-url)
    - [auth-ldap-bind-dn](#auth-ldap-bind-dn)
    - [auth-ldap-bind-password](#auth-ldap-bind-password)
    - [auth-ldap-user-search-base](#auth-ldap-user-search-base)
    - [auth-ldap-user-search-filter](#auth-ldap-user-search-filter)
    - [auth-ldap-start-tls](#auth-ldap-start-tls)
    - [auth-ldap-ca-cert-path](#auth-ldap-ca-cert-path)
    - [auth-ldap-reject-unauthorized](#auth-ldap-reject-unauthorized)
    - [auth-ldap-attr-username](#auth-ldap-attr-username)
    - [auth-ldap-attr-email](#auth-ldap-attr-email)
    - [auth-ldap-attr-display-name](#auth-ldap-attr-display-name)
    - [auth-ldap-attr-groups](#auth-ldap-attr-groups)
  - [OIDC authentication](#oidc-authentication)
    - [auth-oidc-enabled](#auth-oidc-enabled)
    - [auth-oidc-issuer](#auth-oidc-issuer)
    - [auth-oidc-client-id](#auth-oidc-client-id)
    - [auth-oidc-client-secret](#auth-oidc-client-secret)
    - [auth-oidc-redirect-uri](#auth-oidc-redirect-uri)
    - [auth-oidc-scopes](#auth-oidc-scopes)
    - [auth-oidc-username-claim](#auth-oidc-username-claim)
    - [auth-oidc-groups-claim](#auth-oidc-groups-claim)
    - [auth-oidc-display-name](#auth-oidc-display-name)
    - [auth-oidc-post-login-redirect](#auth-oidc-post-login-redirect)
    - [auth-oidc-allow-insecure](#auth-oidc-allow-insecure)
- [Logging](#logging)
  - [rust-log](#rust-log)
  - [logs-dir](#logs-dir)
- [Audit logging](#audit-logging)
  - [audit-enabled](#audit-enabled)
  - [audit-log-retention](#audit-log-retention)
  - [audit-syslog-host](#audit-syslog-host)
  - [audit-syslog-port](#audit-syslog-port)
  - [audit-syslog-protocol](#audit-syslog-protocol)
  - [audit-webhook-url](#audit-webhook-url)
  - [audit-webhook-auth-header](#audit-webhook-auth-header)
  - [audit-file-path](#audit-file-path)
- [EULA and setup](#eula-and-setup)
  - [eula-accept](#eula-accept)
  - [no-interactive](#no-interactive)
- [Licensing](#licensing)
  - [license-file-path](#license-file-path)

---

### General

- [port](#port)
- [heartbeat-port](#heartbeat-port)
- [ui-port](#ui-port)
- [database](#database)

#### port

Web interface and API port.

**Default:** `8888`

| Command flag | Environment variable |
| :----------- | :------------------- |
| `--port`     | `APP_PORT`           |

---

#### heartbeat-port

Agent heartbeat service port.

**Default:** `8000`

| Command flag       | Environment variable |
| :----------------- | :------------------- |
| `--heartbeat-port` | `HEARTBEAT_PORT`     |

---

#### ui-port

Serve the web interface on a separate port from the API. By default,
{{% product-name %}} serves the web interface and the API together on
[`port`](#port). Set `ui-port` to serve the web interface on its own port.

In separate-port mode, the browser loads the web interface from `ui-port` and
calls the API on [`port`](#port), so web clients must be able to reach both
ports. {{% product-name %}} automatically allows the web interface origin to
call the API. When set, `ui-port` must differ from [`port`](#port) and
[`heartbeat-port`](#heartbeat-port).

**Default:** Not set (the web interface is served on [`port`](#port))

| Command flag | Environment variable |
| :----------- | :------------------- |
| `--ui-port`  | `UI_PORT`            |

---

#### database

Database connection URL or filesystem path. {{% product-name %}} supports
SQLite and PostgreSQL.

**Default:** `file:./sqlite.db`

```bash
# PostgreSQL
telegraf_controller --database="postgresql://user:password@localhost:5432/telegraf_controller"

# Custom SQLite path
telegraf_controller --database="/path/to/database.db"
```

| Command flag | Environment variable |
| :----------- | :------------------- |
| `--database` | `DATABASE_URL`       |

---

### TLS

Provide both a certificate and a private key to serve the
{{% product-name %}} web interface, API, and the agent heartbeat service over
HTTPS. The web interface, API, and heartbeat service share the same
certificate and key.

- [ssl-cert-path](#ssl-cert-path)
- [ssl-key-path](#ssl-key-path)

For a full walkthrough that includes configuring agents to trust the certificate,
see [Secure {{% product-name %}} with TLS](/telegraf/controller/install/secure-tls/).

> [!Note]
> #### Provide both the certificate and the key
>
> The certificate and key are required together. If you set only one of
> [`ssl-cert-path`](#ssl-cert-path) or [`ssl-key-path`](#ssl-key-path),
> {{% product-name %}} logs a warning and serves plain HTTP. When both are set,
> the certificate and key must be valid PEM files. An invalid certificate or
> key prevents the heartbeat service from starting.

#### ssl-cert-path

Path to a PEM-encoded SSL/TLS certificate. Set this together with
[`ssl-key-path`](#ssl-key-path) to enable HTTPS.

| Command flag  | Environment variable |
| :------------ | :------------------- |
| `--ssl-cert`  | `SSL_CERT_PATH`      |

---

#### ssl-key-path

Path to the PEM-encoded SSL/TLS private key that matches
[`ssl-cert-path`](#ssl-cert-path). Set this together with the certificate to
enable HTTPS.

| Command flag | Environment variable |
| :----------- | :------------------- |
| `--ssl-key`  | `SSL_KEY_PATH`       |

---

### Database TLS

When you connect {{% product-name %}} to PostgreSQL, use the following options
to encrypt the database connection and to control how
{{% product-name %}} verifies the PostgreSQL server's certificate. These
options apply only to PostgreSQL connections and have no effect when you use
SQLite.

- [sslmode](#sslmode)
- [sslrootcert](#sslrootcert)
- [database-ca-cert](#database-ca-cert)
- [database-ssl-no-verify](#database-ssl-no-verify)

#### sslmode

Set `sslmode` as a query parameter in the PostgreSQL
[`database`](#database) connection URL to control whether {{% product-name %}}
uses TLS and whether it verifies the server certificate.

```bash { callout="sslmode=verify-full" callout-color="orange"}
telegraf_controller \
  --database="postgresql://user:password@localhost:5432/telegraf_controller?sslmode=verify-full&sslrootcert=/etc/ssl/certs/ca.pem"
```

{{% product-name %}} supports the following `sslmode` values:

| `sslmode`     | Connection behavior                                              |
| :------------ | :-------------------------------------------------------------- |
| `disable`     | Connect without TLS.                                            |
| `allow`       | Use TLS if the server supports it. Equivalent to `prefer`.      |
| `prefer`      | Use TLS if the server supports it, otherwise connect without it. |
| `require`     | Require TLS, but do not verify the server certificate unless you also provide a CA certificate. |
| `verify-ca`   | Require TLS and verify the server certificate against a CA certificate. Requires a CA certificate. |
| `verify-full` | Require TLS and verify the server certificate against a CA certificate. Requires a CA certificate. |

To verify the server certificate, provide a CA certificate with
[`sslrootcert`](#sslrootcert), [`database-ca-cert`](#database-ca-cert), or
`PGSSLROOTCERT`. If you request verification but do not provide a CA
certificate, {{% product-name %}} falls back to the system trust store.

> [!Note]
> #### Client certificate authentication is not supported
>
> {{% product-name %}} does not support PostgreSQL client certificate
> authentication. {{% product-name %}} ignores the `sslcert` and `sslkey`
> connection parameters and logs a warning if you set them.

---

#### sslrootcert

Path to a PEM-encoded CA certificate used to verify the PostgreSQL server's
certificate. Set `sslrootcert` as a query parameter in the
[`database`](#database) connection URL. This is equivalent to setting
[`database-ca-cert`](#database-ca-cert). When you provide a CA certificate,
{{% product-name %}} verifies the server certificate even if
[`database-ssl-no-verify`](#database-ssl-no-verify) is set.

---

#### database-ca-cert

Path to a PEM-encoded CA certificate used to verify the PostgreSQL server's
certificate. Use this environment variable as an alternative to the
[`sslrootcert`](#sslrootcert) connection parameter. {{% product-name %}} also
accepts the standard `PGSSLROOTCERT` environment variable for the same purpose.

| Command flag | Environment variable |
| :----------- | :------------------- |
| _(none)_     | `DATABASE_CA_CERT`   |

---

#### database-ssl-no-verify

When set to `1`, `true`, or `yes`, {{% product-name %}} encrypts the
PostgreSQL connection but does not verify the server certificate.
Use this only for development or troubleshooting. If you also provide a CA
certificate, {{% product-name %}} verifies the server certificate and ignores
this setting.

**Default:** `false`

| Command flag | Environment variable     |
| :----------- | :----------------------- |
| _(none)_     | `DATABASE_SSL_NO_VERIFY` |

---

### Owner account

Use the following options to bootstrap the owner account with non-default
values on first startup of {{% product-name %}}. The owner account has full
administrative access to {{% product-name %}}.

- [owner-email](#owner-email)
- [owner-username](#owner-username)
- [owner-password](#owner-password)
- [reset-owner-password](#reset-owner-password)
- [owner-auth-provider](#owner-auth-provider)
- [owner-external-id](#owner-external-id)

> [!Note]
> #### Bootstrap-only settings
>
> On first startup, {{% product-name %}} persists `OWNER_EMAIL`,
> `OWNER_USERNAME`, `OWNER_PASSWORD`, `OWNER_AUTH_PROVIDER`, and
> `OWNER_EXTERNAL_ID` in the database; the database is the authoritative
> source thereafter. Changes to these environment variables or CLI flags
> do not affect the stored values. To change owner account details after
> bootstrap, use the {{% product-name %}} UI or API.

#### owner-email

Email address for the bootstrap owner account.

| Command flag    | Environment variable |
| :-------------- | :------------------- |
| `--owner-email` | `OWNER_EMAIL`        |

---

#### owner-username

Username for the bootstrap owner account.

| Command flag       | Environment variable |
| :----------------- | :------------------- |
| `--owner-username` | `OWNER_USERNAME`     |

---

#### owner-password

Password for the bootstrap owner account. Also used as the new password when
[`RESET_OWNER_PASSWORD`](#reset-owner-password) forces a password reset.

| Command flag       | Environment variable |
| :----------------- | :------------------- |
| `--owner-password` | `OWNER_PASSWORD`     |

---

#### reset-owner-password

When set to `true`, forces an owner password reset on the next startup using
[`OWNER_PASSWORD`](#owner-password) as the new password.

> [!Important]
> Use `RESET_OWNER_PASSWORD` only to recover from a forgotten or compromised
> owner password. Unset the variable after the password has been reset to
> avoid resetting the password on subsequent restarts.

| Command flag | Environment variable   |
| :----------- | :--------------------- |
| _(none)_     | `RESET_OWNER_PASSWORD` |

---

#### owner-auth-provider

Primary authentication provider for the bootstrap owner account.
Set this when you intend to
[disable local authentication](/telegraf/controller/authentication/local/#disable-local-authentication)
after bootstrap. The owner can still sign in with the bootstrap password
as a recovery credential.

Supported values: `local`, `ldap`, `oidc`

**Default:** `local`

| Command flag | Environment variable  |
| :----------- | :-------------------- |
| _(none)_     | `OWNER_AUTH_PROVIDER` |

---

#### owner-external-id

External identifier that links the bootstrap owner to its identity in an
external authentication provider. Required when
[`owner-auth-provider`](#owner-auth-provider) is `ldap` or `oidc`.

- For LDAP, set to the user's distinguished name (DN), for example
  `uid=alice,ou=people,dc=example,dc=com`.
- For OIDC, set to the `sub` claim from the ID token.

| Command flag | Environment variable |
| :----------- | :------------------- |
| _(none)_     | `OWNER_EXTERNAL_ID`  |

---

### Authentication and security

- [session-secret](#session-secret)
- [disable-auth-endpoints](#disable-auth-endpoints)

- [Local authentication](#local-authentication)
  - [auth-local-enabled](#auth-local-enabled)
  - [login-lockout-attempts](#login-lockout-attempts)
  - [login-lockout-minutes](#login-lockout-minutes)
  - [password-complexity](#password-complexity)

- [LDAP authentication](#ldap-authentication) _(Telegraf Enterprise)_
  - [auth-ldap-enabled](#auth-ldap-enabled)
  - [auth-ldap-url](#auth-ldap-url)
  - [auth-ldap-bind-dn](#auth-ldap-bind-dn)
  - [auth-ldap-bind-password](#auth-ldap-bind-password)
  - [auth-ldap-user-search-base](#auth-ldap-user-search-base)
  - [auth-ldap-user-search-filter](#auth-ldap-user-search-filter)
  - [auth-ldap-start-tls](#auth-ldap-start-tls)
  - [auth-ldap-ca-cert-path](#auth-ldap-ca-cert-path)
  - [auth-ldap-reject-unauthorized](#auth-ldap-reject-unauthorized)
  - [auth-ldap-attr-username](#auth-ldap-attr-username)
  - [auth-ldap-attr-email](#auth-ldap-attr-email)
  - [auth-ldap-attr-display-name](#auth-ldap-attr-display-name)
  - [auth-ldap-attr-groups](#auth-ldap-attr-groups)

- [OIDC authentication](#oidc-authentication) _(Telegraf Enterprise)_
  - [auth-oidc-enabled](#auth-oidc-enabled)
  - [auth-oidc-issuer](#auth-oidc-issuer)
  - [auth-oidc-client-id](#auth-oidc-client-id)
  - [auth-oidc-client-secret](#auth-oidc-client-secret)
  - [auth-oidc-redirect-uri](#auth-oidc-redirect-uri)
  - [auth-oidc-scopes](#auth-oidc-scopes)
  - [auth-oidc-username-claim](#auth-oidc-username-claim)
  - [auth-oidc-groups-claim](#auth-oidc-groups-claim)
  - [auth-oidc-display-name](#auth-oidc-display-name)
  - [auth-oidc-post-login-redirect](#auth-oidc-post-login-redirect)
  - [auth-oidc-allow-insecure](#auth-oidc-allow-insecure)

---

#### session-secret

Secret used to encrypt session cookies. {{% product-name %}} generates a value
automatically if you do not set one. Set an explicit value to keep existing
sessions valid across restarts.

**Default:** Generated at startup

| Command flag       | Environment variable |
| :----------------- | :------------------- |
| `--session-secret` | `SESSION_SECRET`     |

---

#### disable-auth-endpoints

Comma-separated list of API endpoint groups to skip authentication for.
Use `"*"` to disable authentication for all endpoint groups.

Valid endpoint groups:

- `agents`
- `configs`
- `labels`
- `reporting-rules`
- `heartbeat`

> [!Warning]
> {{% product-name %}} reads this value once at startup; the value is
> immutable at runtime. Anyone with network access to the listed endpoint
> groups can use them without an API token.

```bash
# Disable authentication on agents and heartbeat only
telegraf_controller --disable-auth-endpoints=agents,heartbeat

# Disable authentication on all endpoint groups
telegraf_controller --disable-auth-endpoints="*"
```

| Command flag               | Environment variable      |
| :------------------------- | :------------------------ |
| `--disable-auth-endpoints` | `DISABLED_AUTH_ENDPOINTS` |

---

#### Local authentication

Local authentication is enabled by default and is the only authentication
provider available without a
[Telegraf Enterprise](/telegraf/enterprise/) license.
The variables in this group apply only when
[`auth-local-enabled`](#auth-local-enabled) is `true`. LDAP and OIDC
providers enforce their own credential and lockout policies.

For setup details, see
[Configure local authentication](/telegraf/controller/authentication/local/).

---

#### auth-local-enabled

Enable username and password authentication using credentials stored in
{{% product-name %}}.
Read once at startup; immutable at runtime.

Set this to `false` to require sign-in through an external provider
(LDAP or OIDC). When disabled, the owner must have been bootstrapped with
[`owner-auth-provider`](#owner-auth-provider) and
[`owner-external-id`](#owner-external-id) set to the external provider.

**Default:** `true`

| Command flag | Environment variable  |
| :----------- | :-------------------- |
| _(none)_     | `AUTH_LOCAL_ENABLED`  |

For setup details, see
[Configure local authentication](/telegraf/controller/authentication/local/).

---

> [!Note]
> #### Bootstrap-only login security settings
>
> On first startup, {{% product-name %}} persists `LOGIN_LOCKOUT_ATTEMPTS`,
> `LOGIN_LOCKOUT_MINUTES`, and `PASSWORD_COMPLEXITY` in the database; the
> database is the authoritative source thereafter. Changes to these
> environment variables do not affect the stored values. To change these
> settings after bootstrap, use the {{% product-name %}} UI.

#### login-lockout-attempts

Number of failed login attempts allowed before an account is locked out.
Minimum: `1`.

**Default:** `5`

| Command flag | Environment variable     |
| :----------- | :----------------------- |
| _(none)_     | `LOGIN_LOCKOUT_ATTEMPTS` |

---

#### login-lockout-minutes

Number of minutes a locked-out account remains locked.
Minimum: `1`.

**Default:** `15`

| Command flag | Environment variable    |
| :----------- | :---------------------- |
| _(none)_     | `LOGIN_LOCKOUT_MINUTES` |

---

#### password-complexity

Password complexity level applied to all password operations, including
initial setup, password changes, password resets, and invite completion.

| Level    | Min length | Uppercase | Lowercase | Digits | Special characters |
| :------- | :--------: | :-------: | :-------: | :----: | :----------------: |
| `low`    |     8      |    No     |    No     |   No   |         No         |
| `medium` |     10     |    Yes    |    Yes    |  Yes   |         No         |
| `high`   |     12     |    Yes    |    Yes    |  Yes   |        Yes         |

**Default:** `low`

| Command flag | Environment variable  |
| :----------- | :-------------------- |
| _(none)_     | `PASSWORD_COMPLEXITY` |

---

#### LDAP authentication

LDAP authentication is a
[Telegraf Enterprise](/telegraf/enterprise/) feature.
If `AUTH_LDAP_*` variables are set on an unlicensed instance,
{{% product-name %}} starts normally, logs a warning, and leaves LDAP
inactive until a license is applied and the application is restarted.

All `AUTH_LDAP_*` variables are read once at startup and are immutable at
runtime. Provisioning rules, default role, allowed domains, and
group-to-role mappings are runtime-editable from the **Settings** page.

For setup details, see
[Configure LDAP authentication](/telegraf/controller/authentication/ldap/).

---

#### auth-ldap-enabled

Enable LDAP authentication.

**Default:** `false`

| Command flag | Environment variable |
| :----------- | :------------------- |
| _(none)_     | `AUTH_LDAP_ENABLED`  |

---

#### auth-ldap-url

LDAP server URL. Must use the `ldap://` or `ldaps://` scheme.
Required when [`auth-ldap-enabled`](#auth-ldap-enabled) is `true`.

| Command flag | Environment variable |
| :----------- | :------------------- |
| _(none)_     | `AUTH_LDAP_URL`      |

---

#### auth-ldap-bind-dn

Distinguished name (DN) of the service account that
{{% product-name %}} binds as to search for users.
Required when [`auth-ldap-enabled`](#auth-ldap-enabled) is `true`.

| Command flag | Environment variable |
| :----------- | :------------------- |
| _(none)_     | `AUTH_LDAP_BIND_DN`  |

---

#### auth-ldap-bind-password

Password for the service account specified by
[`auth-ldap-bind-dn`](#auth-ldap-bind-dn).
Required when [`auth-ldap-enabled`](#auth-ldap-enabled) is `true`.

| Command flag | Environment variable      |
| :----------- | :------------------------ |
| _(none)_     | `AUTH_LDAP_BIND_PASSWORD` |

---

#### auth-ldap-user-search-base

Base DN under which {{% product-name %}} searches for user entries
(for example, `ou=people,dc=example,dc=com`).
Required when [`auth-ldap-enabled`](#auth-ldap-enabled) is `true`.

| Command flag | Environment variable         |
| :----------- | :--------------------------- |
| _(none)_     | `AUTH_LDAP_USER_SEARCH_BASE` |

---

#### auth-ldap-user-search-filter

LDAP filter used to locate a user. The literal token `{{username}}` is
replaced with the value the user types on the sign-in page.

**Default:** `(uid={{username}})`

| Command flag | Environment variable           |
| :----------- | :----------------------------- |
| _(none)_     | `AUTH_LDAP_USER_SEARCH_FILTER` |

---

#### auth-ldap-start-tls

When `true`, upgrade an unencrypted `ldap://` connection to TLS using
StartTLS before binding. Ignored for `ldaps://` connections.

**Default:** `false`

| Command flag | Environment variable  |
| :----------- | :-------------------- |
| _(none)_     | `AUTH_LDAP_START_TLS` |

---

#### auth-ldap-ca-cert-path

Path to a PEM-encoded certificate authority used to verify the LDAP
server's TLS certificate. Use this when your LDAP server is signed by a
private CA not in the system trust store.

| Command flag | Environment variable     |
| :----------- | :----------------------- |
| _(none)_     | `AUTH_LDAP_CA_CERT_PATH` |

---

#### auth-ldap-reject-unauthorized

When `false`, accept any TLS certificate the LDAP server presents.
For development and troubleshooting only.

**Default:** `true`

| Command flag | Environment variable            |
| :----------- | :------------------------------ |
| _(none)_     | `AUTH_LDAP_REJECT_UNAUTHORIZED` |

---

#### auth-ldap-attr-username

LDAP attribute that supplies the {{% product-name %}} username for an
authenticated user.

**Default:** `sAMAccountName`

| Command flag | Environment variable      |
| :----------- | :------------------------ |
| _(none)_     | `AUTH_LDAP_ATTR_USERNAME` |

---

#### auth-ldap-attr-email

LDAP attribute that supplies the user's email address.

**Default:** `mail`

| Command flag | Environment variable   |
| :----------- | :--------------------- |
| _(none)_     | `AUTH_LDAP_ATTR_EMAIL` |

---

#### auth-ldap-attr-display-name

LDAP attribute that supplies the user's display name.

**Default:** `displayName`

| Command flag | Environment variable          |
| :----------- | :---------------------------- |
| _(none)_     | `AUTH_LDAP_ATTR_DISPLAY_NAME` |

---

#### auth-ldap-attr-groups

LDAP attribute that supplies the user's group memberships.
{{% product-name %}} matches values from this attribute against the
group-to-role mappings configured on the **Settings** page.

**Default:** `memberOf`

| Command flag | Environment variable    |
| :----------- | :---------------------- |
| _(none)_     | `AUTH_LDAP_ATTR_GROUPS` |

---

#### OIDC authentication

OIDC authentication is a
[Telegraf Enterprise](/telegraf/enterprise/) feature.
If `AUTH_OIDC_*` variables are set on an unlicensed instance,
{{% product-name %}} starts normally, logs a warning, and leaves OIDC
inactive until a license is applied and the application is restarted.

{{% product-name %}} always uses authorization code flow with PKCE
(S256). All `AUTH_OIDC_*` variables are read once at startup and are
immutable at runtime. Provisioning rules, default role, allowed domains,
and group-to-role mappings are runtime-editable from the **Settings**
page.

For setup details, see
[Configure OIDC authentication](/telegraf/controller/authentication/oidc/).

---

#### auth-oidc-enabled

Enable OIDC authentication.

**Default:** `false`

| Command flag | Environment variable |
| :----------- | :------------------- |
| _(none)_     | `AUTH_OIDC_ENABLED`  |

---

#### auth-oidc-issuer

OIDC issuer URL.
Required when [`auth-oidc-enabled`](#auth-oidc-enabled) is `true`.

| Command flag | Environment variable |
| :----------- | :------------------- |
| _(none)_     | `AUTH_OIDC_ISSUER`   |

---

#### auth-oidc-client-id

OAuth2 client identifier registered with the OIDC provider.
Required when [`auth-oidc-enabled`](#auth-oidc-enabled) is `true`.

| Command flag | Environment variable   |
| :----------- | :--------------------- |
| _(none)_     | `AUTH_OIDC_CLIENT_ID`  |

---

#### auth-oidc-client-secret

OAuth2 client secret.
Required when [`auth-oidc-enabled`](#auth-oidc-enabled) is `true`.

| Command flag | Environment variable      |
| :----------- | :------------------------ |
| _(none)_     | `AUTH_OIDC_CLIENT_SECRET` |

---

#### auth-oidc-redirect-uri

Full callback URL registered with the OIDC provider. Must end with
`/api/auth/oidc/callback`.
Required when [`auth-oidc-enabled`](#auth-oidc-enabled) is `true`.

| Command flag | Environment variable     |
| :----------- | :----------------------- |
| _(none)_     | `AUTH_OIDC_REDIRECT_URI` |

---

#### auth-oidc-scopes

Space-separated list of OAuth2 scopes to request. `openid` is added
automatically if missing.

**Default:** `openid profile email`

| Command flag | Environment variable |
| :----------- | :------------------- |
| _(none)_     | `AUTH_OIDC_SCOPES`   |

---

#### auth-oidc-username-claim

Name of the ID-token claim used as the {{% product-name %}} username.

**Default:** `preferred_username`

| Command flag | Environment variable        |
| :----------- | :-------------------------- |
| _(none)_     | `AUTH_OIDC_USERNAME_CLAIM`  |

---

#### auth-oidc-groups-claim

Name of the ID-token claim that contains the user's group memberships.
{{% product-name %}} matches values from this claim against the
group-to-role mappings configured on the **Settings** page.

**Default:** `groups`

| Command flag | Environment variable     |
| :----------- | :----------------------- |
| _(none)_     | `AUTH_OIDC_GROUPS_CLAIM` |

---

#### auth-oidc-display-name

Friendly name displayed on the **Sign in with...** button on the
sign-in page. The **Settings > OIDC Authentication** panel can override
this value at runtime.

**Default:** `SSO`

| Command flag | Environment variable     |
| :----------- | :----------------------- |
| _(none)_     | `AUTH_OIDC_DISPLAY_NAME` |

---

#### auth-oidc-post-login-redirect

Path inside {{% product-name %}} where users are sent after a successful
OIDC callback.

**Default:** `/`

| Command flag | Environment variable            |
| :----------- | :------------------------------ |
| _(none)_     | `AUTH_OIDC_POST_LOGIN_REDIRECT` |

---

#### auth-oidc-allow-insecure

When `true`, allow `http://` issuer URLs and callback URLs.
For development only. {{% product-name %}} logs a warning at startup when
this is enabled.

**Default:** `false`

| Command flag | Environment variable       |
| :----------- | :------------------------- |
| _(none)_     | `AUTH_OIDC_ALLOW_INSECURE` |

---

### Logging

- [rust-log](#rust-log)
- [logs-dir](#logs-dir)

#### rust-log

Tracing level for the Rust heartbeat server. Supports `trace`, `debug`,
`info`, `warn`, and `error`.

**Default:** `info`

| Command flag | Environment variable |
| :----------- | :------------------- |
| _(none)_     | `RUST_LOG`           |

---

#### logs-dir

Absolute path for heartbeat agent logs.

**Default:** System temp directory

| Command flag | Environment variable |
| :----------- | :------------------- |
| `--logs-dir` | `LOGS_DIR`           |

---

### Audit logging

Audit logging is a [Telegraf Enterprise](/telegraf/enterprise/)
feature. All of the following options are read at startup only; changes
after startup require a restart. For a task-based walkthrough, see
[Enable and configure audit logging](/telegraf/controller/audit-logs/enable-configure/).

- [audit-enabled](#audit-enabled)
- [audit-log-retention](#audit-log-retention)
- [audit-syslog-host](#audit-syslog-host)
- [audit-syslog-port](#audit-syslog-port)
- [audit-syslog-protocol](#audit-syslog-protocol)
- [audit-webhook-url](#audit-webhook-url)
- [audit-webhook-auth-header](#audit-webhook-auth-header)
- [audit-file-path](#audit-file-path)

#### audit-enabled

Enable audit logging on startup. Audit logging requires a Telegraf
Enterprise license to take effect.

**Default:** `false`

| Command flag      | Environment variable    |
| :---------------- | :---------------------- |
| `--audit-enabled` | `AUDIT_LOGGING_ENABLED` |

---

#### audit-log-retention

Sets the initial audit log retention period, in hours.
{{% product-name %}} persists this value to the database on first startup;
later changes to the environment variable have no effect.
Update retention after first startup from the **Settings** page.

Supported values: `720` (30 days), `2160` (90 days), `4320` (180 days),
`8760` (1 year), `17520` (2 years), or `0` (infinite).

**Default:** `2160`

| Command flag | Environment variable  |
| :----------- | :-------------------- |
| _(none)_     | `AUDIT_LOG_RETENTION` |

---

#### audit-syslog-host

Hostname or IP address of a syslog server.
When set together with [`audit-syslog-port`](#audit-syslog-port) and
[`audit-syslog-protocol`](#audit-syslog-protocol),
{{% product-name %}} forwards each audit event to the configured syslog
destination.

| Command flag          | Environment variable |
| :-------------------- | :------------------- |
| `--audit-syslog-host` | `AUDIT_SYSLOG_HOST`  |

---

#### audit-syslog-port

Port number of the syslog server. Required to enable syslog forwarding.

| Command flag          | Environment variable |
| :-------------------- | :------------------- |
| `--audit-syslog-port` | `AUDIT_SYSLOG_PORT`  |

---

#### audit-syslog-protocol

Transport protocol used to deliver audit events to the syslog server.
Required to enable syslog forwarding.

Supported values: `tcp`, `udp`

| Command flag              | Environment variable    |
| :------------------------ | :---------------------- |
| `--audit-syslog-protocol` | `AUDIT_SYSLOG_PROTOCOL` |

---

#### audit-webhook-url

URL that receives each audit event as a JSON-encoded HTTP `POST` request.
{{% product-name %}} retries each delivery up to three times with backoff
and honors `Retry-After` response headers.

| Command flag          | Environment variable |
| :-------------------- | :------------------- |
| `--audit-webhook-url` | `AUDIT_WEBHOOK_URL`  |

---

#### audit-webhook-auth-header

Optional value sent as the `Authorization` HTTP header on webhook requests.
Use it to pass a bearer token, basic-auth credential, or other shared
secret your webhook endpoint requires.

| Command flag                  | Environment variable        |
| :---------------------------- | :-------------------------- |
| `--audit-webhook-auth-header` | `AUDIT_WEBHOOK_AUTH_HEADER` |

---

#### audit-file-path

Absolute path to a local file.
When set, {{% product-name %}} appends each audit event as a single JSON
object on its own line (`.jsonl` format).
The path must be writable by the {{% product-name %}} process.

{{% product-name %}} does not rotate or trim this file.
Pair it with a system log rotator if you keep the forwarder on long term.

| Command flag        | Environment variable |
| :------------------ | :------------------- |
| `--audit-file-path` | `AUDIT_FILE_PATH`    |

---

### EULA and setup

- [eula-accept](#eula-accept)
- [no-interactive](#no-interactive)

#### eula-accept

Accept the [InfluxData End User License Agreement](/telegraf/controller/reference/eula/)
non-interactively. The `TELEGRAF_CONTROLLER_EULA` environment variable accepts
the value `accept` to indicate acceptance.

| Command flag    | Environment variable       |
| :-------------- | :------------------------- |
| `--eula-accept` | `TELEGRAF_CONTROLLER_EULA` |

---

#### no-interactive

Skip interactive prompts at startup. When `--no-interactive` is set, you must
provide owner account values and EULA acceptance through other options.

| Command flag       | Environment variable |
| :----------------- | :------------------- |
| `--no-interactive` | _(none)_             |

---

### Licensing

- [license-file-path](#license-file-path)

#### license-file-path

Path to a Telegraf Enterprise license JWT file. {{% product-name %}} reads
this file on startup, validates the license, and stores it in the database.
If the database already contains a license, this variable is ignored on
subsequent restarts.

If the file is missing, unreadable, or contains an invalid license,
{{% product-name %}} starts in unlicensed mode and logs the validation error.

See [Apply a license](/telegraf/controller/telegraf-enterprise/apply-license/) for full
guidance, including systemd examples.

| Command flag | Environment variable |
| :----------- | :------------------- |
| _(none)_     | `LICENSE_FILE_PATH`  |
