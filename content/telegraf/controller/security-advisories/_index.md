---
title: Security advisories
seotitle: Security advisories in Telegraf Controller
description: >
  Telegraf Controller retrieves signed InfluxData security advisories for
  Telegraf and Telegraf Controller, identifies which agents in your fleet run
  affected Telegraf versions, and notifies you when a newly published advisory
  matches your fleet.
menu:
  telegraf_controller:
    name: Security advisories
    params:
      state: new
weight: 14
cascade:
  metadata: [Telegraf Enterprise]
  related:
    - /telegraf/controller/reference/config-options/
    - /telegraf/controller/agents/monitor/
    - /telegraf/enterprise/
---

{{% product-name %}} retrieves the security advisories that InfluxData
publishes for Telegraf and {{% product-name %}}, compares each advisory with
the Telegraf version that every agent reports, and shows you which agents are
affected.
Use security advisories to find vulnerable agents quickly, plan upgrades, and
confirm that a rollout removed the exposure.

{{< telegraf/enterprise-feature "Security advisories" "are" >}}

- [How advisories reach Telegraf Controller](#how-advisories-reach-telegraf-controller)
- [How advisories are matched to your fleet](#how-advisories-are-matched-to-your-fleet)
- [Where advisories appear](#where-advisories-appear)
- [License and permissions](#license-and-permissions)

## How advisories reach Telegraf Controller

InfluxData publishes advisories as a signed JSON advisory file per product:
one for Telegraf and one for {{% product-name %}}.
Each file is accompanied by a detached OpenPGP signature.
{{% product-name %}} verifies the signature against the InfluxData public key
built into the application before it applies an advisory file.
A file that fails verification is never applied.

An advisory file can reach {{% product-name %}} in two ways:

- **Automatic checks**: by default, {{% product-name %}} downloads the
  advisory files from InfluxData every 6 hours and applies any newer file.
  You can change the interval, point {{% product-name %}} at an internal
  mirror, run a check on demand, or turn automatic checks off.
  See [Configure automatic advisory checks](/telegraf/controller/security-advisories/configure-checks/).
- **Manual import**: for air-gapped deployments, download the advisory file
  and its signature on a connected machine and upload them through the
  {{% product-name %}} UI or API.
  The file is verified offline, and {{% product-name %}} rejects a file that
  is older than the one already applied unless you explicitly roll back.
  See [Import an advisory file](/telegraf/controller/security-advisories/import/).

Both paths apply the same signed file, so an air-gapped instance sees exactly
what a connected instance downloads.

## How advisories are matched to your fleet

Each advisory lists the Telegraf version ranges it affects and the version
that fixes it, along with a severity (**Critical**, **High**, **Medium**, or
**Low**) and, when available, a CVSS score and vector.

{{% product-name %}} evaluates every active advisory for Telegraf against the
Telegraf version that each agent reports in its
[heartbeat](/telegraf/controller/agents/heartbeat-data/) and assigns the agent
one of the following exposure states:

| Exposure | Meaning |
| :------- | :------ |
| **Affected** | The agent's Telegraf version falls inside an affected range of at least one active advisory. The agent is labeled with the highest severity among its matching advisories and the number of advisories that match. |
| **Not affected** | The agent reports a Telegraf version that no active advisory affects. |
| **Unknown** | The agent hasn't reported a Telegraf version, or the reported value can't be parsed as a release version (for example, a custom build string). Treat these agents as unverified. |

Exposure is evaluated against each agent's most recently reported Telegraf
version, so it updates as you upgrade agents.
Every agent that {{% product-name %}} tracks is counted, whatever its
reporting status.
Advisories that InfluxData withdraws are removed from the list and no longer
count toward exposure.

Advisories for {{% product-name %}} itself aren't matched against agents.
{{% product-name %}} compares them with the version you are running and shows
a message when the running version is affected.

<!-- TODO: the Controller self-version comparison is being added to Telegraf
  Controller (PR #890 follow-up). Verify the message wording and where it
  appears once it ships, and add it to view.md under "The Security page at a
  glance". -->

## Where advisories appear

- **Security page**: the **{{% lucide "shield-alert" %}} Security** page
  summarizes fleet exposure, shows the status of each advisory feed, and lists
  every active advisory with the number of affected agents.
- **Agents page**: an **Advisories** column shows each agent's exposure, and
  an **Advisory exposure** filter narrows the list to affected agents or to a
  severity.
- **Notification banner**: when a newly applied advisory file matches agents
  in your fleet, a banner appears on every page until a user with write
  permission acknowledges it.

See [Review advisories and affected agents](/telegraf/controller/security-advisories/view/).

## License and permissions

Security advisories are part of [Telegraf Enterprise](/telegraf/enterprise/).
Without a valid Telegraf Enterprise license, the **Security** page shows an
upgrade notice, the **Advisories** column and filter are hidden from the
**Agents** page, and the `/api/security-advisories` endpoints return
`403 Forbidden` with the feature key `security_monitoring`.
Automatic checks run only while Enterprise features are enabled.
See [Enterprise feature gating](/telegraf/controller/telegraf-enterprise/license-enforcement/#enterprise-feature-gating).

With a valid license, access is controlled by the `security-advisories`
permission resource:

| Role | Permissions |
| :--- | :---------- |
| **Owner**, **Administrator** | View advisories and affected agents, check for advisories, import advisory files, and acknowledge the notification banner. |
| **Manager**, **Viewer** | View advisories and affected agents. |

The **Security** navigation item appears for any user with read access.
[API tokens](/telegraf/controller/tokens/) inherit the permissions of the user
who created them.
See [Authentication and authorization](/telegraf/controller/reference/authentication-authorization/#security-advisories).

{{< children hlevel="h2" >}}
