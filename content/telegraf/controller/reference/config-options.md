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
  - /telegraf/controller/reference/authorization/
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
  - [database](#database)
- [TLS](#tls)
  - [ssl-cert-path](#ssl-cert-path)
  - [ssl-key-path](#ssl-key-path)
- [Owner account](#owner-account)
  - [owner-email](#owner-email)
  - [owner-username](#owner-username)
  - [owner-password](#owner-password)
  - [reset-owner-password](#reset-owner-password)
- [Authentication and security](#authentication-and-security)
  - [session-secret](#session-secret)
  - [login-lockout-attempts](#login-lockout-attempts)
  - [login-lockout-minutes](#login-lockout-minutes)
  - [password-complexity](#password-complexity)
  - [disable-auth-endpoints](#disable-auth-endpoints)
- [Logging](#logging)
  - [rust-log](#rust-log)
  - [logs-dir](#logs-dir)
- [EULA and setup](#eula-and-setup)
  - [eula-accept](#eula-accept)
  - [no-interactive](#no-interactive)

---

### General

- [port](#port)
- [heartbeat-port](#heartbeat-port)
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

- [ssl-cert-path](#ssl-cert-path)
- [ssl-key-path](#ssl-key-path)

#### ssl-cert-path

Path to the SSL/TLS certificate file. Required to enable HTTPS for the web
interface and API.

| Command flag | Environment variable |
| :----------- | :------------------- |
| _(none)_     | `SSL_CERT_PATH`      |

---

#### ssl-key-path

Path to the SSL/TLS private key file. Required to enable HTTPS for the web
interface and API.

| Command flag | Environment variable |
| :----------- | :------------------- |
| _(none)_     | `SSL_KEY_PATH`       |

---

### Owner account

Use the following options to bootstrap the owner account with non-default
values on first startup of {{% product-name %}}. The owner account has full
administrative access to {{% product-name %}}.

- [owner-email](#owner-email)
- [owner-username](#owner-username)
- [owner-password](#owner-password)
- [reset-owner-password](#reset-owner-password)

> [!Note]
> #### Bootstrap-only settings
>
> On first startup, {{% product-name %}} persists `OWNER_EMAIL`,
> `OWNER_USERNAME`, and `OWNER_PASSWORD` in the database; the database is the
> authoritative source thereafter. Changes to these environment variables or
> CLI flags do not affect the stored values. To change owner account details
> after bootstrap, use the {{% product-name %}} UI or API.

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

### Authentication and security

- [session-secret](#session-secret)
- [login-lockout-attempts](#login-lockout-attempts)
- [login-lockout-minutes](#login-lockout-minutes)
- [password-complexity](#password-complexity)
- [disable-auth-endpoints](#disable-auth-endpoints)

#### session-secret

Secret used to encrypt session cookies. {{% product-name %}} generates a value
automatically if you do not set one. Set an explicit value to keep existing
sessions valid across restarts.

**Default:** Generated at startup

| Command flag       | Environment variable |
| :----------------- | :------------------- |
| `--session-secret` | `SESSION_SECRET`     |

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
