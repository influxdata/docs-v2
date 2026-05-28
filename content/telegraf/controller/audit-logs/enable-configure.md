---
title: Enable and configure audit logging
list_title: Enable and configure audit logging
description: >
  Enable audit logging in Telegraf Controller at startup, configure the
  retention period, and optionally forward audit events to syslog, a
  webhook, or a file.
menu:
  telegraf_controller:
    name: Enable and configure
    parent: Audit logs
weight: 101
related:
  - /telegraf/controller/reference/config-options/
  - /telegraf/controller/telegraf-enterprise/apply-license/
---

Enable audit logging in {{% product-name %}} at startup, change the
retention period as needed, and optionally forward events to external
destinations for long-term storage or SIEM integration.

- [Prerequisites](#prerequisites)
- [Enable audit logging](#enable-audit-logging)
- [Configure retention](#configure-retention)
- [Forward audit events](#forward-audit-events)
- [Disable audit logging](#disable-audit-logging)

## Prerequisites

- A valid [Telegraf Enterprise license](/telegraf/controller/telegraf-enterprise/)
  applied to your {{% product-name %}} instance.
- Permission to modify the {{% product-name %}} startup environment (for
  example, the systemd unit file or Docker run command).
- The **Owner** or **Administrator** role to change the retention period
  from the UI.

> [!Important]
> #### Audit-logging state changes only at startup
>
> Per {{% product-name %}}'s security policy, settings that change the
> application's security boundary, including whether audit logging is
> enabled and where audit events are forwarded, can only be changed at startup.
> Retention is the only audit setting that can be modified at runtime.

## Enable audit logging

Set `AUDIT_ENABLED` to `true` before starting {{% product-name %}}.

{{< tabs-wrapper >}}
{{% tabs %}}
[systemd](#)
[Docker](#)
[Shell](#)
{{% /tabs %}}
{{% tab-content %}}

Add `AUDIT_ENABLED=true` to your systemd unit file (typically
`/etc/systemd/system/telegraf-controller.service`):

```ini
[Service]
Environment=AUDIT_ENABLED=true
```

Reload systemd and restart the service:

```bash
sudo systemctl daemon-reload
sudo systemctl restart telegraf-controller
```

{{% /tab-content %}}
{{% tab-content %}}

Pass `AUDIT_ENABLED=true` when starting the container:

```bash
docker run \
  -e AUDIT_ENABLED=true \
  influxdata/telegraf-controller
```

{{% /tab-content %}}
{{% tab-content %}}

Set the variable, or pass `--audit-enabled` on the command line:

```bash
export AUDIT_ENABLED=true
telegraf_controller --no-interactive
```

```bash
telegraf_controller --audit-enabled --no-interactive
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

After {{% product-name %}} starts:

- The **Settings > Audit Logging** section displays as enabled.
- Audit entries begin appearing in the platform data directory described in
  [Where audit logs are stored](/telegraf/controller/audit-logs/#where-audit-logs-are-stored).

<!-- TODO: screenshot of the Settings > Audit Logging section rendering as enabled (header, status indicator, and retention dropdown visible). Save to /static/img/telegraf/controller-settings-audit-enabled.png and replace this comment with: {{< img-hd src="/img/telegraf/controller-settings-audit-enabled.png" alt="Telegraf Controller Settings page showing Audit Logging enabled" />}} -->

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

<!-- TODO: screenshot of the Settings > Audit Logging section with the Audit log retention dropdown expanded, showing the 30 days / 3 months / 6 months / 1 year / 2 years / Infinite options. Save to /static/img/telegraf/controller-settings-audit-retention.png and replace this comment with: {{< img-hd src="/img/telegraf/controller-settings-audit-retention.png" alt="Telegraf Controller audit log retention dropdown" />}} -->

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
> After first startup, the database is authoritative --- update retention
> from the **Settings** page.

## Forward audit events

{{% product-name %}} can forward each audit event to one or more external
destinations in addition to writing it to local storage.
Forwarders are configured **at startup only** and run independently --- you
can enable any combination of syslog, webhook, and file forwarders.

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
{{% product-name %}} does not rotate or trim this file --- pair it with a
system log rotator (such as `logrotate`) if you keep the forwarder on long
term.

## Disable audit logging

To turn audit logging off, remove `AUDIT_ENABLED` (or set it to a value
other than `true`) and restart {{% product-name %}}.
The startup-only policy applies in both directions: audit logging cannot be
disabled from the UI.

Existing audit files remain on disk and continue to be readable through
[`GET /api/audit-logger`](/telegraf/controller/audit-logs/view/) until they
age out of retention.
