---
title: Manage your Telegraf Controller license
list_title: Manage your license
description: >
  Apply, view, replace, and remove the Telegraf Enterprise license that
  unlocks higher scale limits and enterprise features in Telegraf Controller.
menu:
  telegraf_controller:
    name: Manage your license
weight: 11
related:
  - /telegraf/controller/telegraf-enterprise/
---

{{% product-name %}} uses a license system to unlock the higher scale limits
and enterprise features included with [Telegraf Enterprise](/telegraf/controller/telegraf-enterprise/).
Without a license, {{% product-name %}} runs in a free tier suitable for
evaluation and small deployments.

## How licensing works

Licenses are signed [JSON Web Tokens (JWTs)](https://jwt.io/) issued by
InfluxData. {{% product-name %}} validates licenses locally using a signing
key built into the {{% product-name %}} binary, so no network call to
InfluxData is required and licensing works in air-gapped deployments.

A {{% product-name %}} instance has at most one active license at a time.
Replacing a license takes effect immediately, with no restart required.

{{% product-name %}} accepts a license two ways:

- **At startup** using the `LICENSE_FILE_PATH` environment variable.
  Preferred for automated and infrastructure-as-code deployments.
- **At runtime** by uploading the license through the {{% product-name %}}
  user interface. Preferred for interactive setup.

The **Owner** role is required to apply, replace, or remove a license. Any
authenticated user can view the current entitlements and usage.

## License lifecycle

A license moves through the following states as its expiration date approaches:

```
unlicensed  →  valid  →  expiring  →  grace period  →  expired
                          (30 days)    (14 days)
```

| State | When | Behavior |
| :---- | :--- | :------- |
| **unlicensed** | No license applied | Free-tier limits apply; enterprise features are disabled. |
| **valid** | License is active and more than 30 days from expiration | Licensed entitlements apply; enterprise features are enabled. |
| **expiring** | License expires within 30 days | Licensed entitlements still apply; an informational banner appears in the UI. |
| **grace period** | License has expired but less than 15 days have elapsed | Licensed entitlements still apply; an error banner appears in the UI. |
| **expired** | License expired 15 or more days ago | Limits revert to the free tier; enterprise features are disabled. |

For full details on what changes at each stage, see
[License enforcement](/telegraf/controller/licensing/license-enforcement/).

{{< children hlevel="h2" >}}
