---
title: Import an advisory file
list_title: Import an advisory file
description: >
  Download the signed InfluxData advisory file and its signature on a
  connected machine and import them into an air-gapped Telegraf Controller
  through the UI or API.
menu:
  telegraf_controller:
    name: Import an advisory file
    parent: Security advisories
weight: 202
related:
  - /telegraf/controller/security-advisories/configure-checks/
  - /telegraf/controller/admin/audit-logs/
---

If {{% product-name %}} can't reach the InfluxData advisory feed, import the
advisory file manually.
Download the signed advisory file and its detached signature on any machine
with Internet access, transfer them to a machine that can reach
{{% product-name %}}, and upload both through the UI or API.
{{% product-name %}} verifies the signature offline before it applies the
file, so a manual import is as trustworthy as an automatic check.

{{< telegraf/enterprise-feature "Security advisories" "are" >}}

- [Prerequisites](#prerequisites)
- [Download the advisory file and signature](#download-the-advisory-file-and-signature)
- [Import from the UI](#import-from-the-ui)
- [Import from the API](#import-from-the-api)
- [Roll back to an older advisory file](#roll-back-to-an-older-advisory-file)
- [Verification and audit](#verification-and-audit)

## Prerequisites

- A valid [Telegraf Enterprise license](/telegraf/enterprise/) applied to
  your {{% product-name %}} instance.
- The **Owner** or **Administrator** role, which carries write permission for
  security advisories.
- The advisory file (`.json`) and its signature (`.asc`) for the product you
  want to update.
  Both files are required, and each product's file is imported separately.

## Download the advisory file and signature

Download the current advisory file and its signature for each product.
The signature belongs to exactly one version of the advisory file, so always
download the two files together.

**Telegraf**

<a class="btn download" href="https://dl.influxdata.com/security-advisories/v1/telegraf.json" download>Telegraf advisory file</a>
<a class="btn download" href="https://dl.influxdata.com/security-advisories/v1/telegraf.json.asc" download>Telegraf advisory signature</a>

**{{% product-name %}}**

<a class="btn download" href="https://dl.influxdata.com/security-advisories/v1/telegraf-controller.json" download>Telegraf Controller advisory file</a>
<a class="btn download" href="https://dl.influxdata.com/security-advisories/v1/telegraf-controller.json.asc" download>Telegraf Controller advisory signature</a>

To download the files from a terminal instead, use the `curl` commands in
[Use an internal feed mirror](/telegraf/controller/security-advisories/configure-checks/#use-an-internal-feed-mirror).

> [!Note]
> The file names don't matter to {{% product-name %}}.
> If your browser renames a download, the import still works as long as you
> upload the advisory file and the signature that was published with it.

## Import from the UI

1.  Go to **Security** and click
    **{{% lucide "upload" %}} Import advisory file**.
2.  Under **Advisory file**, click **Choose file** and select the `.json`
    advisory file.
3.  Under **Signature**, click **Choose file** and select the matching `.asc`
    file.
4.  Click **Import**.

{{< img-hd src="/img/telegraf/controller-advisories-import-dialog.png" alt="Import advisory file dialog in Telegraf Controller" />}}

{{% product-name %}} verifies the signature, parses the file, and compares
its timestamp with the file already applied:

- If the file is newer, it's applied immediately and every agent's exposure
  is re-evaluated.
  A notification reports the result, for example
  **Advisory file imported: 3 advisories, 12 affected agents**.
- If the file is already applied, the notification reports
  **This advisory file is already applied** and nothing changes.
- If the file is older than the one already applied, the import is rejected
  and a **Roll back to this older advisory file** checkbox appears.
  See [Roll back to an older advisory file](#roll-back-to-an-older-advisory-file).
- If the signature doesn't verify or the file is malformed, the dialog shows
  the error and nothing is applied.

## Import from the API

Send a `POST` request to `/api/security-advisories/feed/import` with both
files base64-encoded in a JSON body.
Base64 encoding delivers the files to signature verification byte for byte.

| Field | Type | Description |
| :---- | :--- | :---------- |
| `feedBase64` | string | The base64-encoded advisory file. Required. |
| `signatureBase64` | string | The base64-encoded `.asc` signature. Required. |
| `allowRollback` | boolean | Apply the file even if it's older than the applied file. Default is `false`. |
| `dryRun` | boolean | Report what the import would do without applying the file. Default is `false`. |

The following example builds the request body from the two files and imports
them:

```sh
printf '{"feedBase64":"%s","signatureBase64":"%s","allowRollback":false,"dryRun":false}' \
  "$(base64 < telegraf.json | tr -d '\n')" \
  "$(base64 < telegraf.json.asc | tr -d '\n')" \
  > import.json

curl --request POST \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/json" \
  --data-binary @import.json \
  https://telegraf_controller.example.com/api/security-advisories/feed/import
```

A successful import returns the outcome and the resulting fleet exposure:

```json
{
  "outcome": "updated",
  "wouldApply": true,
  "reason": null,
  "product": "telegraf",
  "feedTimestamp": "2026-10-14T18:00:00.000Z",
  "advisoryCount": 3,
  "source": "imported",
  "matchedAgents": 12,
  "exposureUnknown": 2
}
```

| `outcome` | Meaning |
| :-------- | :------ |
| `updated` | The file was applied. |
| `unchanged` | The file is already applied. Nothing changed. |
| `preview` | The request set `dryRun` to `true`. `wouldApply` reports whether the file would be applied, and `reason` is `stale` when the file is older than the applied file. |

A preview is useful for checking a file before you apply it.
It verifies the signature, parses the file, and reports the number of
advisories and the agents that would be affected, without changing anything.

A failed import returns one of the following errors:

| Status | `error` | Cause |
| :----- | :------ | :---- |
| `400` | `advisory_feed_invalid_signature` | The signature doesn't verify against the InfluxData public key, or it doesn't belong to this advisory file. |
| `400` | `advisory_feed_malformed` | The file isn't a valid advisory file, or a file exceeds its size limit. |
| `409` | `advisory_feed_stale` | The file is older than the applied file and `allowRollback` is `false`. |

The advisory file is limited to 10 MB and the signature to 8 KB.
The request body, including base64 overhead, is limited to 16 MB.

## Roll back to an older advisory file

{{% product-name %}} rejects an advisory file whose timestamp is older than
the applied file.
This prevents an outdated file from silently replacing newer advisories.
If you need to revert deliberately, for example because a newer file was
applied by mistake, roll back explicitly:

- **From the UI**: when the import is rejected as stale, select
  **Roll back to this older advisory file** and click **Import** again.
- **From the API**: set `allowRollback` to `true`.

A rollback is recorded in the audit log as `advisory.feed.rollback` followed
by `advisory.feed.imported`.
If automatic checks are enabled, the next check that finds a newer file at
the feed URL applies it again.

## Verification and audit

Every import is verified with the InfluxData public key built into
{{% product-name %}}.
There is nothing to install or trust manually, and a file whose signature
doesn't match is rejected before it's applied.

When [audit logging](/telegraf/controller/admin/audit-logs/) is enabled,
{{% product-name %}} records the following events for advisory files:

- `advisory.feed.imported`: a manual import that applied a file, with the
  actor, product, feed timestamp, and advisory count.
  A rejected import (invalid signature or malformed file) is recorded with a
  **Failure** outcome.
- `advisory.feed.rollback`: an import that replaced a newer file with an
  older one.
- `advisory.feed.applied`: an automatic check that applied a newer file.
- `advisory.feed.acknowledged`: a user acknowledged the advisory notification
  banner.
