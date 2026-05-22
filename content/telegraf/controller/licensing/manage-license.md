---
title: View and update a Telegraf Enterprise license
list_title: View and update a license
description: >
  View the current Telegraf Enterprise license details, check entitlements
  and usage, replace an expiring license, or remove the license to revert
  to the free tier.
menu:
  telegraf_controller:
    name: View and update a license
    parent: Manage your license
weight: 112
related:
  - /telegraf/controller/licensing/apply-license/
  - /telegraf/controller/licensing/license-enforcement/
---

After a Telegraf Enterprise license is applied to {{% product-name %}}, use
the user interface or API to inspect the license, monitor entitlements and
usage, replace the license at renewal, or remove the license to revert to the
free tier.

- [View the current license](#view-the-current-license)
- [View entitlements and usage](#view-entitlements-and-usage)
- [Replace a license](#replace-a-license)
- [Remove a license](#remove-a-license)

## View the current license

**In the UI**, navigate to **Settings → Enterprise** to view:

- **License ID** --- the unique identifier for your license. Include this
  value when contacting InfluxData support.
- **Loaded** --- the date and time the license was first applied to this
  {{% product-name %}} instance.
- **Updated** --- the date and time the license was last replaced.
- **Expires** --- the contractual expiration date, with a status chip
  indicating current state (valid, expiring, or expired).
- **Max configurations** --- the configurations entitlement from the license.
- **Max reporting agents** --- the reporting agents entitlement from the
  license.

<!-- TODO: screenshot of the license details card on Settings → Enterprise, save to /static/img/telegraf/controller-licensing-details-card.png and replace with img-hd shortcode -->

**From the API**, an Owner can call `GET /api/license` to retrieve the same
information for scripted checks:

```bash
curl -H "Authorization: Bearer $TC_API_TOKEN" \
  https://controller.example.com/api/license
```

Example response:

```json
{
  "status": "valid",
  "licenseId": "2ba3cecd-4e19-44f2-8fcf-e744e516ad8d",
  "issuedAt": "2024-01-15T10:00:00Z",
  "expiresAt": "2026-12-31T00:00:00Z",
  "maxConfigs": 100000,
  "maxAgents": 18000,
  "loadedAt": "2024-06-01T14:30:00Z"
}
```

If no license is applied, `GET /api/license` returns `404 Not Found`.

## View entitlements and usage

Any authenticated user can call `GET /api/license/entitlements` to see the
effective entitlements alongside current usage. This endpoint is the right
choice for monitoring dashboards and capacity-planning scripts because it
doesn't require the Owner role and works on both licensed and unlicensed
instances.

```bash
curl -H "Authorization: Bearer $TC_API_TOKEN" \
  https://controller.example.com/api/license/entitlements
```

Example response on a licensed instance:

```json
{
  "status": "valid",
  "licenseId": "2ba3cecd-4e19-44f2-8fcf-e744e516ad8d",
  "expiresAt": "2026-12-31T00:00:00Z",
  "enterpriseEnabled": true,
  "entitlements": {
    "maxConfigs": 100000,
    "maxAgents": 18000
  },
  "usage": {
    "configs": 47,
    "agents": 183
  }
}
```

Example response on an unlicensed instance:

```json
{
  "status": "unlicensed",
  "licenseId": null,
  "expiresAt": null,
  "enterpriseEnabled": false,
  "entitlements": {
    "maxConfigs": 20,
    "maxAgents": 100
  },
  "usage": {
    "configs": 8,
    "agents": 12
  }
}
```

## Replace a license

To apply a renewed or upgraded license, upload the new license file through
**Settings → Enterprise** exactly the same way you
[applied the first one](/telegraf/controller/licensing/apply-license/#apply-a-license-through-the-user-interface).
{{% product-name %}} validates the new license and replaces the existing one
in place. The new entitlements take effect immediately with no restart.

> [!Important]
> #### Failed uploads never downgrade a valid license
>
> If the new license fails validation, {{% product-name %}} retains the
> previously active license and returns an error describing the validation
> failure. Your enterprise features and scale limits are unaffected. See
> [Troubleshoot licensing](/telegraf/controller/licensing/troubleshoot/) for
> the error catalog.

## Remove a license

Removing a license reverts {{% product-name %}} to the free tier. Only the
**Owner** can remove a license.

1. Navigate to **Settings → Enterprise**.
2. Click **Remove license**.
3. Confirm the action in the dialog.

   <!-- TODO: screenshot of the remove license confirmation dialog, save to /static/img/telegraf/controller-licensing-remove-confirm.png and replace with img-hd shortcode -->

The change takes effect immediately, with no restart required.

After removal:

- **Scale limits revert to the free tier**: 20 configurations and 100
  reporting agents.
- **Enterprise features are disabled**: audit logging, LDAP authentication,
  and OIDC authentication stop accepting new requests.
- **Existing resources above the free-tier limit are preserved** but cannot
  grow. Create requests for configurations or agent registrations are
  rejected with `402 Payment Required` until usage drops below the free-tier
  limit.
- **Existing IdP-authenticated sessions remain valid** until they expire on
  their own. New LDAP or OIDC logins are blocked.

To restore enterprise features and licensed entitlements, apply a license
again. See [Apply a license](/telegraf/controller/licensing/apply-license/).
