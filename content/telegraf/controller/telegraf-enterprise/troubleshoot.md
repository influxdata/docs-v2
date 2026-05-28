---
title: Troubleshoot Telegraf Enterprise licensing
list_title: Troubleshoot licensing
description: >
  Diagnose and resolve common Telegraf Enterprise license issues, including
  validation errors on upload, missing licenses at startup, and unexpected
  enforcement behavior.
menu:
  telegraf_controller:
    name: Troubleshoot licensing
    parent: Telegraf Enterprise
weight: 104
related:
  - /telegraf/controller/telegraf-enterprise/apply-license/
  - /telegraf/controller/telegraf-enterprise/license-enforcement/
---

Use this page to diagnose common {{% product-name %}} Enterprise license
issues.

{{< telegraf/enterprise-upgrade >}}

- [License upload was rejected](#license-upload-was-rejected)
- [`LICENSE_FILE_PATH` is set but the license isn't loaded](#license_file_path-is-set-but-the-license-isnt-loaded)
- [Banners say "expired" but I just renewed](#banners-say-expired-but-i-just-renewed)
- [Enterprise features are still disabled after applying a license](#enterprise-features-are-still-disabled-after-applying-a-license)
- [Where to look in logs](#where-to-look-in-logs)
- [Get help](#get-help)

## License upload was rejected

When a license upload fails validation, {{% product-name %}} returns an error
describing the cause. The previously active license (if any) is retained.

{{% expand-wrapper %}}
{{% expand "`malformed JWT header`" %}}
**Cause:** The file is not a JWT, or is truncated or corrupted.

**What to do:** Re-download the license file from InfluxData and try again.
{{% /expand %}}

{{% expand "`unknown kid: <value>`" %}}
**Cause:** The license was signed with a key the {{% product-name %}} binary
doesn't recognize.

**What to do:** Check that the {{% product-name %}} build matches what the
license was issued for. Contact InfluxData if the mismatch persists.
{{% /expand %}}

{{% expand "`issuer mismatch`" %}}
**Cause:** The `iss` claim is not `InfluxData Licensing Server`.

**What to do:** The file is not a valid InfluxData license.
Re-download the file from InfluxData.
{{% /expand %}}

{{% expand "`exp is in the past`" %}}
**Cause:** The JWT itself has expired.

**What to do:** Request a renewed license from InfluxData.
{{% /expand %}}

{{% expand "`iat is in the future`" %}}
**Cause:** The license issue time is in the future relative to the
{{% product-name %}} host clock.

**What to do:** Check the host system clock. NTP misconfiguration is the typical
cause.
{{% /expand %}}

{{% expand "`license is past grace period`" %}}
**Cause:** The license expired more than 14 days ago.

**What to do:** Apply a renewed license. See
[Apply a license](/telegraf/controller/telegraf-enterprise/apply-license/).
{{% /expand %}}

{{% expand "`ent_max_configs is not a positive integer`" %}}
**Cause:** A license entitlement claim is malformed.

**What to do:** Contact InfluxData; the license needs to be reissued.
{{% /expand %}}

{{% expand "`ent_max_agents is not a positive integer`" %}}
**Cause:** A license entitlement claim is malformed.

**What to do:** Contact InfluxData; the license needs to be reissued.
{{% /expand %}}
{{% /expand-wrapper %}}

> [!Note]
> #### Failed uploads never downgrade a valid license
>
> When replacing an existing valid license, a validation failure on the new
> upload leaves the previous license active. Your enterprise features and
> scale limits are unaffected.

## `LICENSE_FILE_PATH` is set but the license isn't loaded

Work through this checklist:

- **Is the file readable by the {{% product-name %}} process?** Check file
  permissions and the user account {{% product-name %}} runs as. A
  permission-denied error on the file appears in the startup logs.
- **Does the database already contain a license?** `LICENSE_FILE_PATH` is
  consulted only when no license is stored in the database. To re-run
  bootstrap from `LICENSE_FILE_PATH`, first
  [remove the existing license](/telegraf/controller/telegraf-enterprise/manage-license/#remove-a-license)
  through the UI.
- **Check the startup logs** for the license bootstrap message. A successful
  bootstrap logs the license ID. A validation failure logs the reason. See
  [Where to look in logs](#where-to-look-in-logs).

## Banners say "expired" but I just renewed

License expiration status is re-evaluated hourly, so the status may not
reflect a renewal until the next hourly check. To pick up the new license
immediately, [apply the renewed license through the UI](/telegraf/controller/telegraf-enterprise/apply-license/#apply-a-license-through-the-user-interface)---UI
uploads take effect with no waiting.

## Enterprise features are still disabled after applying a license

Verify the license is active:

1. Open **Settings > Enterprise** and confirm the license details are
   present and the status chip shows **Valid**.
2. From the API, call `GET /api/license/entitlements` and confirm the
   response shows `"enterpriseEnabled": true`.

If both look correct but a specific authentication provider (LDAP or OIDC)
isn't working, check whether the corresponding `AUTH_LDAP_*` or `AUTH_OIDC_*`
environment variables were set before {{% product-name %}} started. These
variables are read at startup---if they were added or changed after
{{% product-name %}} started, restart {{% product-name %}} so the new values
take effect.

## Where to look in logs

License-related events are written to the {{% product-name %}} application
logs (stdout and stderr by default).

Look for log lines containing:

- `license`: license bootstrap, validation, and replacement events.
- `License bootstrap`: the message emitted when `LICENSE_FILE_PATH` is
  processed at startup. A successful load includes the license ID; a failure
  includes the validation error.
- `License upload`: the message emitted when a license is uploaded
  through the UI.
- `License expiration`: messages emitted by the hourly expiration check
  when a license transitions between lifecycle states.

## Get help

Contact [InfluxData support](https://support.influxdata.com/s/contactsupport)
for any licensing issue you can't resolve from this page. When opening a support
request, include:

- Your **license ID** (visible in **Settings > Enterprise** or in the
  `GET /api/license` response).
- The {{% product-name %}} **version**.
- The **exact validation error message** if you encountered one.
- A relevant **excerpt from the {{% product-name %}} logs** showing the
  problem.
