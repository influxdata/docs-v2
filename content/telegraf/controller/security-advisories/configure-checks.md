---
title: Configure automatic advisory checks
list_title: Configure automatic advisory checks
description: >
  Control how Telegraf Controller retrieves InfluxData security advisory
  files: change the check interval, use an internal mirror, disable automatic
  checks for air-gapped deployments, run a check on demand, and read the feed
  status.
menu:
  telegraf_controller:
    name: Configure automatic checks
    parent: Security advisories
weight: 201
related:
  - /telegraf/controller/reference/config-options/
  - /telegraf/controller/admin/networking/
  - /telegraf/controller/admin/high-availability/
  - /telegraf/controller/security-advisories/import/
---

By default, {{% product-name %}} checks for new InfluxData security advisories
automatically.
Use the options on this page to tune the schedule, route checks through an
internal mirror, turn automatic checks off for air-gapped deployments, and
trigger a check on demand.

{{< telegraf/enterprise-feature "Security advisories" "are" >}}

- [Prerequisites](#prerequisites)
- [How automatic checks work](#how-automatic-checks-work)
- [Change the check interval](#change-the-check-interval)
- [Use an internal feed mirror](#use-an-internal-feed-mirror)
- [Disable automatic checks](#disable-automatic-checks)
- [Check for advisories on demand](#check-for-advisories-on-demand)
- [View feed status](#view-feed-status)

## Prerequisites

- A valid [Telegraf Enterprise license](/telegraf/enterprise/) applied to
  your {{% product-name %}} instance.
- Permission to modify the {{% product-name %}} startup environment (for
  example, the systemd unit file or environment variables), to change any of the
  advisory options.
- The **Owner** or **Administrator** role, to run a check on demand from the
  UI or API.

> [!Important]
> #### Advisory options are read at startup only
>
> {{% product-name %}} reads the `ADVISORY_*` environment variables when it
> starts. Changes take effect after a restart. These options have no
> command-line flags and no runtime settings.
> See [Security advisories options](/telegraf/controller/reference/config-options/#security-advisories).

## How automatic checks work

{{% product-name %}} retrieves two advisory files, one per product:

| Product | Default feed URL |
| :------ | :--------------- |
| Telegraf | `https://dl.influxdata.com/security-advisories/v1/telegraf.json` |
| {{% product-name %}} | `https://dl.influxdata.com/security-advisories/v1/telegraf-controller.json` |

Each check follows the same sequence for each file:

1. Download the advisory file over HTTPS.
   The request includes the `ETag` from the last successful download, so an
   unchanged file returns `304 Not Modified` and nothing else happens.
2. Download the detached signature from the same URL with `.asc` appended.
3. Verify the signature against the InfluxData public key built into
   {{% product-name %}}.
   If verification fails, the file is discarded.
4. Apply the file if its timestamp is newer than the file already applied,
   then re-evaluate every agent's exposure.

The schedule and failure handling work as follows:

- The first check runs within 30 seconds of startup.
  Later checks run every 6 hours by default.
  See [Change the check interval](#change-the-check-interval).
- If a check fails (for example, the feed is unreachable or the signature
  doesn't verify), {{% product-name %}} retries after 15 minutes, up to four
  times, and then returns to the regular interval.
  Failures are recorded in the [feed status](#view-feed-status) and never
  interrupt other operations.
- Each download times out after 15 seconds, follows at most three redirects,
  and is limited to 10 MB for the advisory file and 8 KB for the signature.
- A failure to retrieve the {{% product-name %}} advisory file is recorded in
  that feed's status but doesn't affect the Telegraf advisory file.

In a [high-availability cluster](/telegraf/controller/admin/high-availability/),
only the leader runs scheduled checks.
The applied advisory file is stored in the shared database, so every node
shows the same advisories.
Checks on demand and manual imports work from any node.

Automatic checks require outbound HTTPS access to `dl.influxdata.com`, or to
your mirror.
See [Outbound connections](/telegraf/controller/admin/networking/#outbound-connections).

## Change the check interval

Set `ADVISORY_CHECK_INTERVAL_MINUTES` to the number of minutes between checks,
from `1` to `10080` (7 days).
Values above the maximum are capped at the maximum.
Values below `1`, and values that aren't numbers, fall back to the default of
`360` (6 hours).

```sh
# Check once per day
ADVISORY_CHECK_INTERVAL_MINUTES=1440
```

## Use an internal feed mirror

If {{% product-name %}} can't reach `dl.influxdata.com` directly but can reach
an internal web server, mirror the advisory files and point
{{% product-name %}} at the mirror.

1.  On a machine with Internet access, download the advisory file and its
    signature for each product, and copy them to a web server that
    {{% product-name %}} can reach over HTTPS.
    Keep the signature next to the advisory file with the `.asc` suffix.
    {{% product-name %}} always requests the signature from the feed URL with
    `.asc` appended.

    ```sh
    curl -fsSLO https://dl.influxdata.com/security-advisories/v1/telegraf.json
    curl -fsSLO https://dl.influxdata.com/security-advisories/v1/telegraf.json.asc
    curl -fsSLO https://dl.influxdata.com/security-advisories/v1/telegraf-controller.json
    curl -fsSLO https://dl.influxdata.com/security-advisories/v1/telegraf-controller.json.asc
    ```

2.  Set the feed URLs in the {{% product-name %}} startup environment and
    restart {{% product-name %}}:

    ```sh
    ADVISORY_FEED_URL=https://mirror.example.com/advisories/telegraf.json
    ADVISORY_CONTROLLER_FEED_URL=https://mirror.example.com/advisories/telegraf-controller.json
    ```

3.  Refresh the mirror on a schedule (for example, with a cron job) so
    {{% product-name %}} picks up new advisories at its next check.

Keep the following in mind:

- Mirror URLs must start with `https://`.
  {{% product-name %}} refuses to download advisory files over plain HTTP.
- The mirror must serve the files unchanged.
  {{% product-name %}} verifies the InfluxData signature, so a modified file
  is rejected.
  You don't need to re-sign anything.
- If the mirror serves an advisory file older than the one
  {{% product-name %}} already applied (for example, after a newer file was
  imported manually), the check logs a warning and reports the feed as
  unchanged.
  Refresh the mirror to resume updates.
- Setting a feed URL to an empty string doesn't disable that feed.
  {{% product-name %}} uses the default URL instead.
  To stop retrieving advisories, [disable automatic checks](#disable-automatic-checks).

## Disable automatic checks

For air-gapped deployments, or any environment where {{% product-name %}}
shouldn't make outbound requests, set `ADVISORY_AUTO_CHECK` to `false` and
restart {{% product-name %}}.

```sh
ADVISORY_AUTO_CHECK=false
```

With automatic checks disabled:

- No scheduled checks run, and **Source** in the
  [feed status](#view-feed-status) shows **automatic checks off**.
- The **Check for advisories** button remains available on the **Security**
  page. Clicking it runs a one-time check against the configured feed URL,
  which fails if the URL is unreachable.
- Advisories still reach {{% product-name %}} through
  [manual import](/telegraf/controller/security-advisories/import/).

Any other value, including an unset variable, leaves automatic checks
enabled.

## Check for advisories on demand

Users with write permission for security advisories can trigger an immediate
check without waiting for the next scheduled run, for example after InfluxData
announces a new advisory or after you refresh a mirror.

**From the UI**, go to **Security** and click
**{{% lucide "refresh-cw" %}} Check for advisories**.
A notification reports **Advisories have been updated** when a newer file was
applied, or **No new advisories found** when the applied file is already
current.

**From the API**, send a `POST` request to
`/api/security-advisories/feed/check` with a token that has write permission
for security advisories:

```sh
curl --request POST \
  --header "Authorization: Bearer $TOKEN" \
  https://telegraf_controller.example.com/api/security-advisories/feed/check
```

The response describes the outcome for the Telegraf advisory file:

```json
{
  "outcome": "updated",
  "wouldApply": true,
  "reason": null,
  "product": "telegraf",
  "feedTimestamp": "2026-10-14T18:00:00.000Z",
  "advisoryCount": 3,
  "source": "automatic",
  "matchedAgents": 12,
  "exposureUnknown": 2
}
```

`outcome` is `updated` when a newer file was applied, or `unchanged` when the
applied file is already current.
`matchedAgents` and `exposureUnknown` report the fleet exposure after the
check.

A failed check returns one of the following errors:

| Status | `error` | Cause |
| :----- | :------ | :---- |
| `400` | `advisory_feed_invalid_signature` | The signature doesn't verify against the InfluxData public key. |
| `400` | `advisory_feed_malformed` | The downloaded file isn't a valid advisory file, is for a different product, or exceeds the size limit. |
| `409` | `advisory_check_in_progress` | Another check is already running. Wait for it to finish. |
| `502` | `advisory_feed_unreachable` | The feed couldn't be downloaded: a network error, a timeout, a non-HTTPS URL, too many redirects, or an unexpected HTTP status. |

## View feed status

On the **Security** page, expand **Feed status**
({{% lucide "chevron-down" %}}) in the overview card.
Each advisory feed shows:

- **Feed**: the product, **Telegraf** or **Telegraf Controller**.
- **Last checked**: how long ago the last check ran and its result
  (**feed updated**, **feed unchanged**, or **check failed**).
  When a check failed, the error message appears below the result.
- **Last updated**: when the currently applied advisory file was applied, in
  UTC.
- **Source**: whether the applied file came from an **Automatic** check or
  was **Imported** manually, plus **automatic checks off** when automatic
  checks are disabled.

From the API, `GET /api/security-advisories/overview` returns the same
information in the `feeds` array:

```json
{
  "feeds": [
    {
      "product": "telegraf",
      "feedTimestamp": "2026-10-14T18:00:00.000Z",
      "source": "automatic",
      "appliedAt": "2026-10-15T02:11:08.000Z",
      "advisoryCount": 3,
      "lastCheckedAt": "2026-10-20T14:11:08.000Z",
      "lastCheckOutcome": "unchanged",
      "lastCheckError": null,
      "autoCheckEnabled": true,
      "feedUrlConfigured": true
    },
    {
      "product": "telegraf_controller",
      "feedTimestamp": null,
      "source": null,
      "appliedAt": null,
      "advisoryCount": 0,
      "lastCheckedAt": "2026-10-20T14:11:09.000Z",
      "lastCheckOutcome": "unchanged",
      "lastCheckError": null,
      "autoCheckEnabled": true,
      "feedUrlConfigured": true
    }
  ]
}
```

`lastCheckOutcome` is `updated`, `unchanged`, or `failed`.
When it is `failed`, `lastCheckError` holds the error message.
