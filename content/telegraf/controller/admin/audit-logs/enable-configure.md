---
title: Enable and configure audit logging
list_title: Enable and configure audit logging
description: >
  Enable audit logging in Telegraf Controller at startup with a signing key,
  configure the retention period, and optionally forward audit events to
  syslog, a webhook, or a file.
aliases:
  - /telegraf/controller/audit-logs/enable-configure/
menu:
  telegraf_controller:
    name: Enable and configure
    parent: Audit logs
weight: 201
related:
  - /telegraf/controller/reference/config-options/
  - /telegraf/controller/telegraf-enterprise/apply-license/
---

Enable audit logging in {{% product-name %}} at startup with a signing key,
change the retention period as needed, and optionally forward events to
external destinations for long-term storage or SIEM integration.

{{< telegraf/enterprise-feature "Audit logging" >}}

- [Prerequisites](#prerequisites)
- [Enable audit logging](#enable-audit-logging)
- [Configure retention](#configure-retention)
- [Forward audit events](#forward-audit-events)
- [Disable audit logging](#disable-audit-logging)

## Prerequisites

- A valid [Telegraf Enterprise license](/telegraf/enterprise/)
  applied to your {{% product-name %}} instance.
- A signing key of at least 32 characters.
  See [Generate a signing key](#generate-a-signing-key).
- Permission to modify the {{% product-name %}} startup environment (for
  example, the systemd unit file or startup environment).
- The **Owner** or **Administrator** role to change the retention period
  from the UI.

> [!Important]
> #### Audit-logging state changes only at startup
>
> Per {{% product-name %}}'s security policy, settings that change the
> application's security boundary, including whether audit logging is
> enabled, the signing key, and where audit events are forwarded, can only be
> changed at startup.
> Retention is the only audit setting that can be modified at runtime.

## Enable audit logging

Audit logging requires two settings at startup: `AUDIT_ENABLED` set to
`true`, and a signing key of at least 32 characters that {{% product-name %}}
uses to sign each audit entry.
Provide the key in one of the following ways:

- The `AUDIT_HMAC_KEY` environment variable, which holds the key itself.
- The `AUDIT_HMAC_KEY_FILE` environment variable or the
  `--audit-hmac-key-file` command flag, which name a file that holds the key.
  {{% product-name %}} trims surrounding whitespace, so a trailing newline
  in the file is fine.

If both are set, `AUDIT_HMAC_KEY` takes precedence.
{{% product-name %}} never writes the key to disk or to the database.

### Generate a signing key

Any random string of at least 32 characters works as a key.
To generate one and store it in a file:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux/macOS](#)
[Windows (PowerShell)](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```bash
openssl rand -base64 48 > /etc/telegraf-controller/audit-key
chmod 600 /etc/telegraf-controller/audit-key
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```powershell
-join ((48..57 + 65..90 + 97..122) | Get-Random -Count 48 | ForEach-Object { [char]$_ }) |
  Set-Content -NoNewline "C:\ProgramData\TelegrafController\audit-key"
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Store the file outside the audit log data directory and restrict read
access to the account that runs {{% product-name %}}.

### Start {{% product-name %}} with audit logging enabled

{{< tabs-wrapper >}}
{{% tabs %}}
[systemd](#)
[Shell](#)
[Windows (Powershell)](#)
[Docker](#)
{{% /tabs %}}
{{% tab-content %}}

Add `AUDIT_ENABLED=true` and the key file path to your systemd unit file
(typically `/etc/systemd/system/telegraf-controller.service`):

```ini
[Service]
Environment=AUDIT_ENABLED=true
Environment=AUDIT_HMAC_KEY_FILE=/etc/telegraf-controller/audit-key
```

Reload systemd and restart the service:

```bash
sudo systemctl daemon-reload
sudo systemctl restart telegraf-controller
```

{{% /tab-content %}}
{{% tab-content %}}

Set the variables, or pass `--audit-enabled` and `--audit-hmac-key-file`
on the command line:

```bash
export AUDIT_ENABLED=true
export AUDIT_HMAC_KEY_FILE=/etc/telegraf-controller/audit-key
telegraf_controller --no-interactive
```

```bash
telegraf_controller --audit-enabled \
  --audit-hmac-key-file=/etc/telegraf-controller/audit-key \
  --no-interactive
```

{{% /tab-content %}}
{{% tab-content %}}

Set the variables in PowerShell, or pass `--audit-enabled` and
`--audit-hmac-key-file` on the command line:

```powershell
$env:AUDIT_ENABLED="true"
$env:AUDIT_HMAC_KEY_FILE="C:\ProgramData\TelegrafController\audit-key"
./telegraf_controller.exe --no-interactive
```

```powershell
./telegraf_controller.exe --audit-enabled `
  --audit-hmac-key-file="C:\ProgramData\TelegrafController\audit-key" `
  --no-interactive
```

{{% /tab-content %}}
{{% tab-content %}}

Pass `AUDIT_ENABLED=true` and mount the key file read-only when starting
the container:

```bash
docker run \
  --env AUDIT_ENABLED=true \
  --env AUDIT_HMAC_KEY_FILE=/run/secrets/audit-key \
  --volume /etc/telegraf-controller/audit-key:/run/secrets/audit-key:ro \
  influxdata/telegraf-controller:{{< latest-patch >}}
```

The container runs as the `telegraf-controller` user (UID `10001`), so the
key file must be readable by that user.
Include your standard container options, such as EULA acceptance, published
ports, and the data volume.
See [Run {{% product-name %}} in Docker](/telegraf/controller/install/docker/).

{{% /tab-content %}}
{{< /tabs-wrapper >}}

After {{% product-name %}} starts:

- The **Settings > Audit Logging** section displays as enabled.
- Audit entries begin appearing in the platform data directory described in
  [Where audit logs are stored](/telegraf/controller/admin/audit-logs/#where-audit-logs-are-stored).
- The server log reports the result of the startup chain check.
  See [Verify integrity](/telegraf/controller/admin/audit-logs/view/#verify-integrity).

{{< img-hd src="/img/telegraf/controller-settings-audit-retention.png" alt="Telegraf Controller audit log retention dropdown" />}}

### Start without a key

If `AUDIT_ENABLED` is `true` but no signing key is configured, or the key is
shorter than 32 characters, {{% product-name %}} starts with audit logging
disabled and logs the reason, for example:

```
Audit HMAC key is not configured: set AUDIT_HMAC_KEY or pass --audit-hmac-key-file; audit logging stays disabled
```

The **Settings > Audit Logging** section displays as disabled until you
restart with a key.

When you start the executable in a terminal without `--no-interactive` and
no key is configured, {{% product-name %}} prompts for the key instead:

```
Audit log signing key (at least 32 characters, empty to start without audit logging):
```

Input is hidden, and the key applies to that run only.
Press Enter without a key to start with audit logging disabled.

## Configure retention

{{% product-name %}} keeps audit entries for 90 days (2160 hours) by default
and runs a cleanup job every 12 hours that removes entries older than the
retention threshold.

Available retention values:

| Value      | Hours   |
| :--------- | :------ |
| 30 days    | `720`   |
| 3 months   | `2160`  |
| 6 months   | `4320`  |
| 1 year     | `8760`  |
| 2 years    | `17520` |
| Infinite   | `0`     |

### Change audit log retention from the Settings page

1. Sign in as an **Owner** or **Administrator**.
2. Navigate to the **Settings** page from the left navigation menu.
3. In the **Audit Logging** section, select a value from **Audit log retention**.
4. Click **Save**.

The new retention value takes effect immediately.
The next cleanup run removes any entries that fall outside the new window.

### Set the initial retention at startup

Use the `AUDIT_LOG_RETENTION` environment variable to seed the retention
period when {{% product-name %}} initializes its settings on first startup.

```bash
export AUDIT_LOG_RETENTION=8760
```

> [!Note]
> `AUDIT_LOG_RETENTION` only sets the initial value.
> After first startup, the database is authoritative.
> To update audit log retention, use the **Settings** page.

## Forward audit events

{{% product-name %}} can forward each audit event to one or more external
destinations in addition to writing it to local storage.
Forwarders are configured **at startup only** and run independently, which lets
you enable any combination of syslog, webhook, and file forwarders.

Every audit event is forwarded, including sign-in, sign-out, constant, and
agent-deletion events.
If a forwarder fails, {{% product-name %}} logs `Audit forward failed` with a
running failure count and keeps running.
The entry is still written to local storage.

### Forward to syslog

Forward audit events to a syslog server over TCP or UDP.

```bash
export AUDIT_SYSLOG_HOST=syslog.example.com
export AUDIT_SYSLOG_PORT=514
export AUDIT_SYSLOG_PROTOCOL=tcp
```

| Variable                | Description                              | Required |
| :---------------------- | :--------------------------------------- | :------- |
| `AUDIT_SYSLOG_HOST`     | Syslog server hostname or IP             | Yes      |
| `AUDIT_SYSLOG_PORT`     | Syslog server port                       | Yes      |
| `AUDIT_SYSLOG_PROTOCOL` | Transport protocol: `tcp` or `udp`       | Yes      |

### Forward to a webhook

Forward audit events as JSON `POST` requests to an HTTP webhook.

```bash
export AUDIT_WEBHOOK_URL=https://siem.example.com/ingest
export AUDIT_WEBHOOK_AUTH_HEADER="Bearer xxxxxxxxxxxx"
```

| Variable                    | Description                                            | Required |
| :-------------------------- | :----------------------------------------------------- | :------- |
| `AUDIT_WEBHOOK_URL`         | Full URL the webhook receives `POST` requests at       | Yes      |
| `AUDIT_WEBHOOK_AUTH_HEADER` | Optional value sent in the `Authorization` HTTP header | No       |

The webhook forwarder retries each event up to three times with backoff and a
10-second request timeout.
Events that return `408`, `429`, or `5xx` responses are retried; events that
return other `4xx` responses are dropped.
{{% product-name %}} honors a `Retry-After` response header when present.

### Append to a file

Append each event to a file as a single JSON object per line (`.jsonl`).

```bash
export AUDIT_FILE_PATH=/var/log/telegraf-controller/audit.jsonl
```

The path must be writable by the {{% product-name %}} process.
{{% product-name %}} does not rotate or trim this file. Pair it with a
system log rotator (such as `logrotate`) if you keep the forwarder on long
term.

## Disable audit logging

To turn audit logging off, remove `AUDIT_ENABLED` (or set it to a value
other than `true`) and restart {{% product-name %}}.
Starting without a signing key has the same effect.
The startup-only policy applies in both directions: audit logging cannot be
disabled from the UI.

Existing audit files remain on disk and continue to be readable through
[`GET /api/audit-logger`](/telegraf/controller/admin/audit-logs/view/) until they
age out of retention.
