---
title: View audit logs
list_title: View audit logs
description: >
  Query Telegraf Controller audit logs through the audit log API. Read
  access is restricted to Owners and Administrators.
menu:
  telegraf_controller:
    name: View audit logs
    parent: Audit logs
weight: 102
related:
  - /telegraf/controller/audit-logs/enable-configure/
  - /telegraf/controller/reference/authentication-authorization/
  - /telegraf/controller/tokens/create/
---

Use the {{% product-name %}} API to query and read audit entries.

- [Prerequisites](#prerequisites)
- [Query the audit log API](#query-the-audit-log-api)
- [Response shape](#response-shape)
- [Verify integrity](#verify-integrity)

## Prerequisites

- Audit logging must be [enabled](/telegraf/controller/audit-logs/enable-configure/).
- The **Owner** or **Administrator** role assigned to your account.
- An API token issued to a user with one of those roles.
  See [Create an API token](/telegraf/controller/tokens/create/).

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
    "prevHash": "a309..."
  }
]
```

`actorType` is one of `User`, `Token`, or `System`.
For the categories of events captured, see
[What gets audited](/telegraf/controller/audit-logs/#what-gets-audited).

## Verify integrity

The `hash` and `prevHash` fields form a SHA-256 chain across all entries.
To detect tampering, walk the result set in `seq` order and check that:

1. Each entry's `prevHash` equals the previous entry's `hash`.
2. `seq` numbers are contiguous within and across monthly files.

If either check fails, an entry has been altered, removed, or inserted out
of order.
For background on how the chain is constructed, see
[Tamper detection](/telegraf/controller/audit-logs/#tamper-detection).
