---
title: Telegraf Enterprise
description: >
  Telegraf Enterprise combines Telegraf Controller with higher scale limits,
  enterprise authentication and audit logging, and an enterprise support
  contract for organizations running Telegraf at scale.
menu:
  telegraf_controller:
    name: Telegraf Enterprise
weight: 10
related:
  - /telegraf/controller/licensing/
  - /telegraf/controller/licensing/apply-license/
---

Telegraf Enterprise is the premium offering for organizations running
Telegraf at scale. It combines {{% product-name %}} with higher scale limits,
enterprise authentication and audit logging, and an enterprise support
contract from InfluxData.

- [What's included](#whats-included)
- [Free tier and Enterprise comparison](#free-tier-and-enterprise-comparison)
- [How to obtain Telegraf Enterprise](#how-to-obtain-telegraf-enterprise)
- [Next steps](#next-steps)

## What's included

### Higher scale limits

Telegraf Enterprise raises the per-instance limits on configurations and
reporting agents that {{% product-name %}} can manage. The exact limits are
defined in your license and are negotiated as part of your contract. See
[Free tier and Enterprise comparison](#free-tier-and-enterprise-comparison)
for the free-tier defaults.

### Enterprise features

A Telegraf Enterprise license unlocks the following features in
{{% product-name %}}:

- **Audit logging** --- Tamper-evident log of administrative actions
  performed in {{% product-name %}}.
- **LDAP authentication** --- Authenticate {{% product-name %}} users
  against an LDAP directory.
- **OIDC authentication** --- Single sign-on through OpenID Connect
  providers such as Okta, Auth0, and Microsoft Entra ID.

### Enterprise support contract

Telegraf Enterprise includes a support contract from InfluxData covering
both {{% product-name %}} and Telegraf itself. For details on support
coverage and SLAs, [contact InfluxData](https://www.influxdata.com/contact-sales/).

## Free tier and Enterprise comparison

{{% product-name %}} runs in a free tier suitable for evaluation and small
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

## How to obtain Telegraf Enterprise

To purchase Telegraf Enterprise or request an evaluation license,
[contact InfluxData sales](https://www.influxdata.com/contact-sales/).
InfluxData issues a license file that you apply to your {{% product-name %}}
instance.

## Next steps

If you already have a license file:

- [Apply a license to Telegraf Controller](/telegraf/controller/licensing/apply-license/)
- [Manage your license](/telegraf/controller/licensing/)
- [Understand license enforcement](/telegraf/controller/licensing/license-enforcement/)
