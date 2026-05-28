---
title: Apply a Telegraf Enterprise license
list_title: Apply a license
description: >
  Apply a Telegraf Enterprise license to Telegraf Controller using the
  LICENSE_FILE_PATH environment variable at startup or by uploading the
  license through the UI.
menu:
  telegraf_controller:
    name: Apply a license
    parent: Telegraf Enterprise
weight: 101
related:
  - /telegraf/controller/telegraf-enterprise/manage-license/
  - /telegraf/controller/telegraf-enterprise/troubleshoot/
  - /telegraf/controller/reference/config-options/
---

Apply a Telegraf Enterprise license to {{% product-name %}} either at startup
through an environment variable or at runtime through the user interface.

{{< telegraf/enterprise-upgrade >}}

- [Prerequisites](#prerequisites)
- [About the license file](#about-the-license-file)
- [Apply a license at startup](#apply-a-license-at-startup)
- [Apply a license through the user interface](#apply-a-license-through-the-user-interface)
- [Verify the license is active](#verify-the-license-is-active)
- [What happens if validation fails](#what-happens-if-validation-fails)

## Prerequisites

- A Telegraf Enterprise license file (`.jwt` or `.txt`) issued by InfluxData.
  If you don't have one, [contact InfluxData sales](https://www.influxdata.com/contact-sales/).
- For the UI method: the **Owner** role on the {{% product-name %}} instance.

## About the license file

Telegraf Enterprise licenses are signed JSON Web Tokens (JWTs). The license
file is plain text and you can open it to confirm it parses as a JWT, but you
should not edit it. Any change invalidates the cryptographic signature.

{{% product-name %}} validates licenses in both connected and
air-gapped environments.

## Apply a license at startup

Use the `LICENSE_FILE_PATH` environment variable to apply a license when
{{% product-name %}} starts. This method is recommended for automated and
infrastructure-as-code deployments.

1. **Place the license file on the {{% product-name %}} host.**

   Copy the license file to a path the {{% product-name %}} process can read,
   for example `/etc/telegraf-controller/license.jwt`.

2. **Set the `LICENSE_FILE_PATH` environment variable.**

   {{< tabs-wrapper >}}
{{% tabs %}}
[systemd](#)
[Docker](#)
[Shell](#)
{{% /tabs %}}
{{% tab-content %}}

Add an `Environment=` line to your systemd unit file (typically
`/etc/systemd/system/telegraf-controller.service`):

```ini
[Service]
Environment=LICENSE_FILE_PATH=/etc/telegraf-controller/license.jwt
```

Then reload systemd and restart the service:

```bash
sudo systemctl daemon-reload
sudo systemctl restart telegraf-controller
```

{{% /tab-content %}}
{{% tab-content %}}

Pass the environment variable and mount the license file when starting the
container:

```bash
docker run \
  -e LICENSE_FILE_PATH=/etc/telegraf-controller/license.jwt \
  -v /host/path/to/license.jwt:/etc/telegraf-controller/license.jwt:ro \
  influxdata/telegraf-controller
```

{{% /tab-content %}}
{{% tab-content %}}

Export the variable in your shell before starting {{% product-name %}}:

```bash
export LICENSE_FILE_PATH=/etc/telegraf-controller/license.jwt
telegraf_controller --no-interactive
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

3. **Start (or restart) {{% product-name %}}.**

   On startup, {{% product-name %}} reads the file, validates the license, and
   stores it in the database. Successful loads appear in the startup logs with
   the license ID.

> [!Note]
> #### `LICENSE_FILE_PATH` is read only when the database has no license
>
> If the {{% product-name %}} database already contains a license,
> `LICENSE_FILE_PATH` is ignored on subsequent restarts. To replace a license
> applied this way, either [upload a new license through the UI](#apply-a-license-through-the-user-interface)
> or [remove the existing license](/telegraf/controller/telegraf-enterprise/manage-license/#remove-a-license)
> first.

If the file is missing, unreadable, or contains an invalid license,
{{% product-name %}} starts in free-tier mode and logs the validation error.
See [Troubleshoot licensing](/telegraf/controller/telegraf-enterprise/troubleshoot/) for
the error catalog.

## Apply a license through the user interface

Use the {{% product-name %}} UI to apply or replace a license at runtime
without restarting the application. This method requires the **Owner** role.

1. Sign in to {{% product-name %}} as a user with the **Owner** role.
2. Navigate to **Settings > Enterprise**.

   <!-- TODO: screenshot of the Settings > Enterprise upload form (drop zone + paste textarea), save to /static/img/telegraf/controller-licensing-upload-form.png and replace with img-hd shortcode -->

3. Provide the license in one of two ways:
   - **Drag and drop** the `.jwt` (or `.txt`) license file into the drop zone.
   - **Paste** the JWT string into the textarea.
4. Click **Upload license**.

{{% product-name %}} validates the license immediately. On success, the page
refreshes to show the license ID, expiration date, and entitlements. No
restart is required. Enterprise features and the new scale limits take
effect for all in-flight and subsequent requests.

If validation fails, an error message describes the reason. The previously
active license (if any) remains in effect. {{% product-name %}} never downgrades
from a valid license because of a failed upload.

## Verify the license is active

**In the UI**, navigate to **Settings > Enterprise** to view the current
license details: license ID, the date the license was loaded, the expiration
date, the maximum configurations entitlement, and the maximum reporting agents
entitlement.

**From the API**, any authenticated user can call `GET /api/license/entitlements`
to see the current entitlements and usage. This is the recommended endpoint
for status checks in scripts and monitoring dashboards because it doesn't
require the Owner role.

```bash { placeholders="YOUR_TC_API_TOKEN" }
curl -H "Authorization: Bearer YOUR_TC_API_TOKEN" \
  https://telegraf_controller.example.com/api/license/entitlements
```

Replace {{% code-placeholder-key %}}`YOUR_TC_API_TOKEN`{{% /code-placeholder-key %}}
with your {{% product-name %}} API token.

Example response when a license is active:

```json
{
  "status": "valid",
  "licenseId": "Xxxx0oXx-Xx0o-00Xx-oXxX-xX0oXx0oXx0o",
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

When no license is applied, `status` is `"unlicensed"`, `enterpriseEnabled` is
`false`, and the entitlements show the free-tier limits.

## What happens if validation fails

{{% product-name %}} rejects malformed, unsigned, expired (beyond the grace
period), or otherwise invalid licenses. See
[Troubleshoot licensing](/telegraf/controller/telegraf-enterprise/troubleshoot/) for the
full catalog of validation errors and how to resolve them.
