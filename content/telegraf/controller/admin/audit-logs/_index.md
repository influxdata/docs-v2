---
title: Audit logs
description: >
  Telegraf Controller records security-relevant events to a tamper-evident,
  append-only audit log. Use audit logs to investigate access, detect
  unauthorized changes, and demonstrate compliance.
aliases:
  - /telegraf/controller/audit-logs/
menu:
  telegraf_controller:
    name: Audit logs
    parent: Administer Telegraf Controller
weight: 107
cascade:
  metadata: [Telegraf Enterprise]
  related:
    - /telegraf/controller/reference/config-options/
    - /telegraf/controller/reference/authentication-authorization/
    - /telegraf/enterprise/
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
- **Configuration lifecycle**: configuration creation, updates, and deletion,
  and [configuration version](/telegraf/controller/configs/versions/)
  operations (rollbacks, change note updates, and version pruning).
- **Configuration group lifecycle**:
  [configuration group](/telegraf/controller/config-groups/) creation,
  updates (including membership changes), and deletion.
- **Constants**: [global constant](/telegraf/controller/configs/constants/)
  creation, value updates, and deletion.
- **Security advisories**:
  [advisory file](/telegraf/controller/security-advisories/) updates applied
  automatically or imported manually, rollbacks to an older advisory file,
  and acknowledgements of the advisory notification.

Each entry records:

- **Action**: the specific event identifier.
- **Actor**: the user, API token, or system component that triggered
  the event.
- **Source**: IP address and user-agent of the request, where applicable.
- **Outcome**: `Success`, `Failure`, or `Denied`.
- **Timestamp**: when the event occurred, in UTC.
- **Sequence number, hash, previous hash, and key fingerprint**: used to
  detect tampering.

## Where audit logs are stored

{{% product-name %}} writes audit entries to per-month SQLite files in a
platform-specific data directory:

| Platform | Default location                                                                         |
| :------- | :--------------------------------------------------------------------------------------- |
| Linux    | `$XDG_STATE_HOME/telegraf-controller/` (typically `~/.local/state/telegraf-controller/`) |
| macOS    | `~/Library/Logs/telegraf-controller/`                                                    |
| Windows  | `%LOCALAPPDATA%\telegraf-controller\Log`                                                 |
| Docker   | `/var/lib/telegraf-controller/.local/state/telegraf-controller/`, inside the [data volume](/telegraf/controller/install/docker/#persist-your-data) |

Files are named `audit-YYYY-MM.log`, one per calendar month.
Each file is a SQLite database that enforces immutability through a database
trigger: attempts to delete rows are rolled back.
{{% product-name %}} keeps up to 48 months of audit files available for query.

In a [high-availability (HA) cluster](/telegraf/controller/admin/high-availability/),
audit logging is **per node**, not shared.
Each node writes its own audit files and, when queried, returns only its own
events.
To review activity across the cluster, forward each node's events to a shared
destination and aggregate them there.
See [Audit logs in a cluster](/telegraf/controller/admin/high-availability/#audit-logs-in-a-cluster).

## Tamper detection

Each entry includes an HMAC-SHA256 hash that incorporates the entry's
contents and the hash of the previous entry, forming a chain.
{{% product-name %}} computes the hash with a signing key that you configure
at startup and records a fingerprint of that key (the first 16 hexadecimal
characters of the key's SHA-256 digest) in the entry's `secretId` field.
Sequence numbers are contiguous within and across monthly files.
Any modification, deletion, or out-of-order insertion breaks the chain, and
an entry re-sealed with a different key fails signature verification.

{{% product-name %}} verifies the current month's chain when audit logging
starts and logs the result.
The `GET /api/audit-logger/verify` endpoint verifies every retained monthly
file on demand.
See [Verify integrity](/telegraf/controller/admin/audit-logs/view/#verify-integrity).

> [!Important]
> #### The signing key is the trust boundary
>
> Anyone who can read the signing key can alter entries and re-sign the
> chain.
> Keep the key outside the audit log data directory, restrict who can read
> it, and forward audit events to an external destination that the
> {{% product-name %}} host cannot modify.
> See [Forward audit events](/telegraf/controller/admin/audit-logs/enable-configure/#forward-audit-events).

Entries written by {{% product-name %}} 1.1 and earlier were signed with a
built-in key and carry the key fingerprint `123`.
Upgrading does not rewrite them.
The first entry signed with your key links to the last of those entries, so
the chain stays continuous, but verification reports them separately as
legacy entries because their signatures cannot prove that they were not
altered before the upgrade.

In a high-availability cluster, each node maintains its own hash chain and
sequence numbers, so events from different nodes merged into a single stream do
not form one valid chain.
Verify integrity per node: separate aggregated events by their originating node,
then check each node's chain on its own.
See [Audit logs in a cluster](/telegraf/controller/admin/high-availability/#audit-logs-in-a-cluster).

## License and permissions

Audit logging is part of [Telegraf Enterprise](/telegraf/enterprise/)
and is unavailable in the free tier.
With a valid license:

- Audit logging is **enabled at startup only** by setting `AUDIT_ENABLED`
  and configuring a signing key.
  See [Enable and configure audit logging](/telegraf/controller/admin/audit-logs/enable-configure/).
- Only the retention period is modifiable at runtime, from the **Settings**
  page.
- Reading audit log entries requires the `audit:read` permission, which the
  **Owner** and **Administrator** roles hold.
  See [View audit logs](/telegraf/controller/admin/audit-logs/view/).

{{< children hlevel="h2" >}}
