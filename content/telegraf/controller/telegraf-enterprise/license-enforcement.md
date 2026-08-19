---
title: Telegraf Enterprise license enforcement
list_title: License enforcement
description: >
  How Telegraf Controller enforces scale limits and Enterprise feature
  gating based on your license status, including expiration phases, grace
  period behavior, and response headers.
menu:
  telegraf_controller:
    name: License enforcement
    parent: Telegraf Enterprise licensing
  telegraf_enterprise:
    name: License enforcement
    weight: 23
    parent: Telegraf Controller
weight: 103
related:
  - /telegraf/controller/telegraf-enterprise/troubleshoot/
  - /telegraf/controller/authentication/
  - /telegraf/controller/reference/authentication-authorization/
---

{{% product-name %}} enforces two things based on your license status: how
many resources you can create (scale limits) and which features are available.
This page describes both kinds of enforcement and how license expiration affects
them.

{{< telegraf/enterprise-upgrade >}}

- [Scale limits](#scale-limits)
- [Enterprise feature gating](#enterprise-feature-gating)
- [License expiration lifecycle](#license-expiration-lifecycle)
- [Response headers](#response-headers)
- [Reference: JWT claims](#reference-jwt-claims)

## Scale limits

{{% product-name %}} enforces a maximum number of configurations and a
maximum number of reporting agents per instance.

| Resource | Free tier | Telegraf Enterprise |
| :------- | :-------: | :------------------ |
| Configurations | 20 | Defined by `ent_max_configs` in your license (per contract) |
| Reporting agents | 100 | Defined by `ent_max_agents` in your license (per contract) |

The free-tier values are hardcoded into the {{% product-name %}} binary and
cannot be overridden.

### What happens when a limit is reached

- "Create" endpoints (such as `POST /api/configs`) return
  `402 Payment Required` with an error body identifying the resource, the
  current count, and the limit:

  ```json
  {
    "error": "entitlement_limit_reached",
    "resource": "configs",
    "current": 20,
    "limit": 20,
    "message": "configs limit reached (20/20). Upgrade to Telegraf Enterprise for higher limits."
  }
  ```

- The corresponding create button in the {{% product-name %}} UI is disabled
  and shows a tooltip explaining the limit.
- The response includes an `X-Entitlement-Warning` header (see
  [Response headers](#response-headers)).

A warning banner appears in the UI when usage reaches 80% of a limit so
operators have advance notice before requests start being rejected.

## Enterprise feature gating

A valid Telegraf Enterprise license unlocks the following features:

- [Audit logging](/telegraf/controller/audit-logs/)
- [LDAP authentication](/telegraf/controller/authentication/ldap/)
- [OIDC authentication](/telegraf/controller/authentication/oidc/)

API endpoints that require an enterprise feature return `403 Forbidden` when
called on a free-tier instance:

```json
{
  "error": "feature_not_licensed",
  "feature": "audit_logging",
  "message": "audit_logging requires a Telegraf Enterprise license."
}
```

> [!Note]
> #### Identity provider environment variables on a free-tier instance
>
> If `AUTH_LDAP_*` or `AUTH_OIDC_*` environment variables are set on a
> free-tier instance, {{% product-name %}} starts normally and logs a
> warning that the feature requires a license. The feature stays inactive
> until a license is applied and {{% product-name %}} is restarted so the
> variables are re-read.

## License expiration lifecycle

A license moves through four stages relative to its `license_exp` (contractual
expiration) date:

| Time relative to `license_exp` | Status | Scale limits | Enterprise features | UI behavior |
| :----------------------------- | :----- | :----------- | :------------------ | :---------- |
| More than 30 days before | `valid` | Licensed | Enabled | No banner |
| 1--30 days before | `expiring` | Licensed | Enabled | Info banner with countdown |
| 0--14 days after | `expired_grace` | Licensed | Enabled | Error banner with countdown |
| 15 or more days after | `expired` | Free tier | Disabled | Error banner |

The grace period is fixed at 14 days and is not configurable. Expiration
status is re-evaluated hourly, so a status change takes effect within one
hour without requiring a restart. To switch back to a valid status sooner,
apply a renewed license through the UI. Uploads take effect immediately.

## Response headers

{{% product-name %}} adds the following headers to HTTP responses when the
corresponding condition is true. Monitor these headers in deployment health
checks to detect license-related issues before they affect users.

| Header | When it appears | Value |
| :----- | :-------------- | :---- |
| `X-License-Expiring` | License expires within 30 days | ISO 8601 expiration date |
| `X-License-Expired` | License is past expiration but still in grace | `true` |
| `X-Entitlement-Warning` | One or more entitlements at 90% or more of the limit | Comma-separated `resource current/limit` pairs, for example `configs 18/20; agents 95/100` |

## Reference: JWT claims

The following table describes the claims contained in a Telegraf Enterprise
license JWT. Claims are informational. You don't author license files
yourself, but understanding what each claim controls helps when reading
license details, scripting around licensing, or interpreting validation
errors.

| Claim | Type | Description |
| :---- | :--- | :---------- |
| `id` | string (UUID) | Unique license identifier. Use this value when contacting InfluxData support. |
| `iss` | string | Issuer. Always `InfluxData Licensing Server` for valid licenses. |
| `iat` | Unix timestamp | When the license was issued. |
| `exp` | Unix timestamp | JWT token expiration. |
| `license_exp` | Unix timestamp | Contractual license expiration. Drives the [enforcement lifecycle](#license-expiration-lifecycle). |
| `ent_max_configs` | positive integer | Maximum configurations entitlement. |
| `ent_max_agents` | positive integer | Maximum reporting agents entitlement. |
