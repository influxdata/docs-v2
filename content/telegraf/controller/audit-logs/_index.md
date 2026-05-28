---
title: Audit logs
description: >
  Telegraf Controller records security-relevant events to a tamper-evident,
  append-only audit log. Use audit logs to investigate access, detect
  unauthorized changes, and demonstrate compliance.
menu:
  telegraf_controller:
    name: Audit logs
weight: 11
cascade:
  metadata: [Telegraf Enterprise]
  related:
    - /telegraf/controller/reference/config-options/
    - /telegraf/controller/reference/authorization/
    - /telegraf/controller/telegraf-enterprise/
---

{{% product-name %}} records security-relevant events to an append-only,
tamper-evident audit log.
Use audit logs to investigate access patterns, detect unauthorized changes,
and demonstrate compliance with internal or external policies.

{{< telegraf/enterprise-feature "Audit logging" >}}

- [What gets audited](#what-gets-audited)
- [Where audit logs are stored](#where-audit-logs-are-stored)
- [Tamper detection](#tamper-detection)
- [License and permissions](#license-and-permissions)

## What gets audited

{{% product-name %}} captures the following categories of events:

- **Authentication**: user sign-in (local, LDAP, or OIDC) and sign-out.
- **Agent lifecycle**: agent registration, status transitions (such as
  moving in and out of the **not reporting** state), and agent deletion
  (manual deletions and removals driven by reporting-rule retention).

Each entry records:

- **Action**: the specific event identifier.
- **Actor**: the user, API token, or system component that triggered
  the event.
- **Source**: IP address and user-agent of the request, where applicable.
- **Outcome**: `Success`, `Failure`, or `Denied`.
- **Timestamp**: when the event occurred, in UTC.
- **Sequence number, hash, and previous hash**: used to detect tampering.

## Where audit logs are stored

{{% product-name %}} writes audit entries to per-month SQLite files in a
platform-specific data directory:

| Platform | Default location                                                                         |
| :------- | :--------------------------------------------------------------------------------------- |
| Linux    | `$XDG_STATE_HOME/telegraf-controller/` (typically `~/.local/state/telegraf-controller/`) |
| macOS    | `~/Library/Logs/telegraf-controller/`                                                    |
| Windows  | `%LOCALAPPDATA%\telegraf-controller\Log`                                                 |

Files are named `audit-YYYY-MM.log`--one per calendar month.
Each file is a SQLite database that enforces immutability through a database
trigger: attempts to delete rows are rolled back.
{{% product-name %}} keeps up to 48 months of audit files available for query.

## Tamper detection

Each entry includes a SHA-256 hash that incorporates the entry's contents
and the hash of the previous entry, forming a chain.
Sequence numbers are contiguous within and across monthly files.
Any modification, deletion, or out-of-order insertion breaks the chain.

## License and permissions

Audit logging is part of [Telegraf Enterprise](/telegraf/controller/telegraf-enterprise/)
and is unavailable in the free tier.
With a valid license:

- Audit logging is **enabled at startup only** by setting `AUDIT_ENABLED`.
  See [Enable and configure audit logging](/telegraf/controller/audit-logs/enable-configure/).
- Only the retention period is modifiable at runtime, from the **Settings**
  page.
- Only the **Owner** and **Administrator** roles can read audit log entries.
  See [View audit logs](/telegraf/controller/audit-logs/view/).

{{< children hlevel="h2" >}}
