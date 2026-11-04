---
title: View audit logs
list_title: View audit logs
description: >
  Query Telegraf Controller audit logs and verify their integrity through
  the audit log API. Read access requires the audit:read permission, which
  Owners and Administrators hold.
aliases:
  - /telegraf/controller/audit-logs/view/
menu:
  telegraf_controller:
    name: View audit logs
    parent: Audit logs
weight: 202
related:
  - /telegraf/controller/admin/audit-logs/enable-configure/
  - /telegraf/controller/reference/authentication-authorization/
  - /telegraf/controller/tokens/create/
---

Use the {{% product-name %}} API to query audit entries and verify that the
audit log has not been tampered with.

{{< telegraf/enterprise-feature "Audit logging" >}}

- [Prerequisites](#prerequisites)
- [Query the audit log API](#query-the-audit-log-api)
- [Response shape](#response-shape)
- [Verify integrity](#verify-integrity)

## Prerequisites

- Audit logging must be [enabled](/telegraf/controller/admin/audit-logs/enable-configure/).
- The `audit:read` permission, which the **Owner** and **Administrator**
  roles hold.
- An API token with the `audit:read` permission, issued to a user with one
  of those roles.
  See [Create an API token](/telegraf/controller/tokens/create/).
  Administrator tokens created before {{% product-name %}} 1.2.0 do not
  include `audit:read`; create a new token to read the audit log with one.
  Owner tokens with full access are unaffected.

## Query the audit log API

Send `GET` requests to `/api/audit-logger`.
The endpoint accepts the following query parameters:

| Parameter | Description                                       | Default   |
| :-------- | :------------------------------------------------ | :-------- |
| `from`    | Earliest event timestamp to return, as ISO 8601   | Unbounded |
| `to`      | Latest event timestamp to return, as ISO 8601     | Unbounded |
| `page`    | Page number for paginated results                 | `1`       |
| `limit`   | Maximum number of entries returned per page       | `9999`    |

```bash { placeholders="YOUR_TC_API_TOKEN" }
curl -H "Authorization: Bearer YOUR_TC_API_TOKEN" \
  "https://telegraf_controller.example.com/api/audit-logger?from=2026-05-01T00:00:00Z&to=2026-05-31T23:59:59Z&page=1&limit=500"
```

Replace {{% code-placeholder-key %}}`YOUR_TC_API_TOKEN`{{% /code-placeholder-key %}}
with a {{% product-name %}} API token issued to an Owner or Administrator.

## Response shape

The response is a JSON array.
Each entry includes the event, the actor, the outcome, and the
tamper-detection hash chain fields.

```json
[
  {
    "seq": 4827,
    "timestamp": "2026-05-27T18:42:11.512Z",
    "action": "user.login",
    "actorId": "01HZ8R5T4VX9YQK0M2N3P4Q5R6",
    "actorType": "User",
    "ipAddress": "10.0.4.17",
    "userAgent": "Mozilla/5.0 ...",
    "outcome": "Success",
    "hash": "f7c1...",
    "prevHash": "a309...",
    "secretId": "9f2c4b1e8a7d3c05"
  }
]
```

`actorType` is one of `User`, `Token`, or `System`.
`secretId` is the fingerprint of the key that signed the entry: the first 16
hexadecimal characters of the key's SHA-256 digest, or `123` for entries
written before a signing key was configured.
For the categories of events captured, see
[What gets audited](/telegraf/controller/admin/audit-logs/#what-gets-audited).

## Verify integrity

Send a `GET` request to `/api/audit-logger/verify` to check every retained
monthly audit file against the configured signing key.
The endpoint requires the same `audit:read` permission as the query endpoint.

```bash { placeholders="YOUR_TC_API_TOKEN" }
curl -H "Authorization: Bearer YOUR_TC_API_TOKEN" \
  "https://telegraf_controller.example.com/api/audit-logger/verify"
```

The response reports the overall result and one object per monthly file:

```json
{
  "keyConfigured": true,
  "currentKeyId": "9f2c4b1e8a7d3c05",
  "valid": true,
  "files": [
    {
      "period": "2026-05",
      "status": "valid",
      "entries": 4827,
      "firstSeq": 1,
      "lastSeq": 4827,
      "brokenAtSeq": null,
      "reason": null,
      "legacyEntries": 312,
      "unverifiedEntries": 0,
      "keyIds": ["123", "9f2c4b1e8a7d3c05"]
    }
  ]
}
```

- **keyConfigured** and **currentKeyId**: whether this node has a signing
  key, and its fingerprint.
- **valid**: `false` if any file is `broken`.
- **status**: `valid`, `broken`, or `empty` for each file.
- **brokenAtSeq** and **reason**: the first entry that fails and why:
  `signature does not match`, `does not link to the previous entry`,
  `first entry does not start from genesis`, or `sequence gap after seq N`.
- **legacyEntries**: entries signed with the built-in key before a signing
  key was configured (fingerprint `123`).
  They are checked for chain continuity, but their signatures cannot prove
  that they were not altered before the upgrade.
- **unverifiedEntries**: entries signed with a key this node does not have,
  for example a key that has since been rotated.
  Their fingerprints appear in `keyIds`.
  They do not mark the file as `broken`.
- **firstSeq**: retention removes the oldest entries, so a file can start
  after sequence `1`.
  Verification starts from the first retained entry.

{{% product-name %}} also verifies the current month's file when audit
logging starts and writes the result to the server log, for example:

```
Audit chain 2026-05 is broken at seq 1203: signature does not match
Audit chain 2026-05: 312 entries were signed with the built-in key before a key was configured
```

The first line is logged as an error, the second as a warning.
For background on how the chain is constructed, see
[Tamper detection](/telegraf/controller/admin/audit-logs/#tamper-detection).
