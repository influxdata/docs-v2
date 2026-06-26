---
title: Telegraf Enterprise
description: >
  Telegraf Enterprise combines Telegraf and Telegraf Controller with higher
  scale limits, enterprise authentication and audit logging, and an
  enterprise support contract from InfluxData for organizations running
  Telegraf at scale.
menu:
  telegraf_enterprise:
    name: Telegraf Enterprise
weight: 1
cascade:
  product: telegraf_enterprise
---

**Telegraf Enterprise** is the commercial package for organizations running
[Telegraf](/telegraf/v1/) and [Telegraf Controller](/telegraf/controller/) at
scale. It combines higher Telegraf Controller limits, enterprise authentication
and audit logging, and an enterprise support contract from InfluxData covering
both the Telegraf agent and Telegraf Controller.

<a href="{{% cta-link %}}" class="btn magenta large">Purchase Telegraf Enterprise</a>

- [What's included](#whats-included)
- [Free tier and Enterprise comparison](#free-tier-and-enterprise-comparison)
- [How licensing works](#how-licensing-works)
- [License lifecycle](#license-lifecycle)
- [How to obtain Telegraf Enterprise](#how-to-obtain-telegraf-enterprise)
- [Next steps](#next-steps)

## What's included

### Enterprise support for Telegraf and Telegraf Controller

Telegraf Enterprise includes an enterprise support contract from InfluxData
covering both the open source Telegraf agent and Telegraf Controller. For
details on support coverage and SLAs,
[contact InfluxData]({{% cta-link %}}).

### Higher scale limits in Telegraf Controller

Telegraf Enterprise raises the per-instance limits on configurations and
reporting agents that Telegraf Controller can manage. The exact limits are
defined in your license and are part of your contract. See
[Free tier and Enterprise comparison](#free-tier-and-enterprise-comparison)
for the free-tier defaults.

### Enterprise features in Telegraf Controller

A Telegraf Enterprise license unlocks the following features in
Telegraf Controller:

- **Audit logging**: Tamper-evident log of administrative actions
  performed in Telegraf Controller.
- **LDAP authentication**: Authenticate Telegraf Controller users
  against an LDAP directory.
- **OIDC authentication**: Single sign-on through OpenID Connect
  providers such as Okta, Auth0, and Microsoft Entra ID.

## Free tier and Enterprise comparison

Telegraf Controller runs in a free tier suitable for evaluation and small
deployments when no license is applied.

| | Free tier | Telegraf Enterprise |
| :--- | :--- | :--- |
| Configurations | 20 | Defined per contract |
| Reporting agents | 100 | Defined per contract |
| Audit logging | --- | Included |
| LDAP authentication | --- | Included |
| OIDC authentication | --- | Included |
| Local authentication and API tokens | Included | Included |
| User management (RBAC) | Included | Included |
| Support | Community | Enterprise support contract |

## How licensing works

Licenses are signed [JSON Web Tokens (JWTs)](https://jwt.io/) issued by
InfluxData. Telegraf Controller validates licenses in both connected and
air-gapped environments.

A Telegraf Controller instance has one active license at a time. Replacing a
license takes effect immediately, with no restart required.

Telegraf Controller accepts a license two ways:

- **At startup** using the `LICENSE_FILE_PATH` environment variable.
  Preferred for automated and infrastructure-as-code deployments.
- **At runtime** by uploading the license through the Telegraf Controller
  user interface. Preferred for interactive setup.

The **Owner** role is required to apply, replace, or remove a license. Any
authenticated user can view the current entitlements and usage.

## License lifecycle

A license moves through the following states as its expiration date approaches:

| State | When | Behavior |
| :---- | :--- | :------- |
| **Unlicensed** | No license applied | Free-tier limits apply; enterprise features are disabled. |
| **Valid** | License is active and more than 30 days from expiration | Licensed entitlements apply; enterprise features are enabled. |
| **Expiring** | License expires within 30 days | Licensed entitlements still apply; an informational banner appears in the UI. |
| **Grace Period** | License has expired but less than 15 days have elapsed | Licensed entitlements still apply; an error banner appears in the UI. |
| **Expired** | License expired 15 or more days ago | Limits revert to the free tier; enterprise features are disabled. |

For full details on what changes at each stage, including the API status
names for each state (such as `expired_grace`), see
[License enforcement](/telegraf/controller/telegraf-enterprise/license-enforcement/).

## How to obtain Telegraf Enterprise

To purchase Telegraf Enterprise or request an evaluation license,
[contact InfluxData sales]({{% cta-link %}}).
InfluxData issues a license file that you apply to your Telegraf Controller
instance.

## Next steps

If you already have a license file:

- [Apply a license to Telegraf Controller](/telegraf/controller/telegraf-enterprise/apply-license/)
- [View and update a license](/telegraf/controller/telegraf-enterprise/manage-license/)
- [Understand license enforcement](/telegraf/controller/telegraf-enterprise/license-enforcement/)
- [Troubleshoot licensing](/telegraf/controller/telegraf-enterprise/troubleshoot/)

If you're evaluating:

- [Telegraf documentation](/telegraf/v1/)
- [Telegraf Controller documentation](/telegraf/controller/)
- [Contact InfluxData sales]({{% cta-link %}})
