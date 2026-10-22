---
title: Monitor agents
list_title: Monitor agents
description: >
  Use the Agents page summary visualizations, search, filters, and the fleet
  summary API to monitor the health of your Telegraf fleet.
menu:
  telegraf_controller:
    name: Monitor agents
    parent: Manage agents
weight: 102
related:
  - /telegraf/controller/agents/heartbeat-data/
  - /telegraf/controller/agents/status/
  - /telegraf/controller/agents/reporting-rules/
  - /telegraf/controller/security-advisories/
---

The **Agents** page summarizes the health of your Telegraf fleet at a glance
and lets you search the agent list and filter it by status, configuration, and
reporting rule. The same data is available from the fleet summary API for
dashboards and automation.

<!-- TOC -->
- [The Agents page at a glance](#the-agents-page-at-a-glance)
- [View fleet summary details](#view-fleet-summary-details)
- [Filter the agent list](#filter-the-agent-list)
- [Search the agent list](#search-the-agent-list)
- [Refresh the list](#refresh-the-list)
- [Query the fleet summary API](#query-the-fleet-summary-api)
<!-- /TOC -->

## The Agents page at a glance

The top of the **Agents** page shows the total number of agents and a
segmented status bar with the share of agents in each status: **OK**,
**Warn**, **Fail**, **Undefined**, and **Not Reporting**. Statuses with no
agents are hidden from the bar.

For what each status means and how statuses are set, see
[Set agent statuses](/telegraf/controller/agents/status/).

## View fleet summary details

Expand **More details** below the status bar to show three summary
visualizations:

- **Fleet Health**: percentage tiles for **Healthy** agents, agents that
  **Reported < 5m** ago, and agents on the newest reported Telegraf version.
  Tiles show `—` when no agents match the current filters.
- **Telegraf Versions**: a donut chart of reported Telegraf versions. The
  chart shows up to six slices and folds the smallest shares into **Other**.
  Agents that don't report a version appear as **Unknown**.
- **Last Reported**: a histogram of when agents last reported, in the bands
  **< 5m**, **< 30m**, **< 1h**, **< 12h**, **< 24h**, and **Older**. Each
  band counts agents whose most recent heartbeat falls in that window. The
  **Older** band also includes agents that have never reported.

The summary reflects the current filters, so you can inspect the health of a
subset of the fleet, for example, all agents using one configuration.

{{< img-hd src="/img/telegraf/controller-agents-summary.png" alt="Telegraf Controller agents page with the fleet summary expanded" />}}

## Filter the agent list

Use the controls above the agent list to filter it:

- **Search** ({{% lucide "search" %}}): matches the agent's ID, hostname, IP
  address, or Telegraf version. Toggles inside the search box switch on
  regular expression and case-sensitive matching.
  See [Search the agent list](#search-the-agent-list).
- **Status**: show only agents in the selected status.
- **Configuration**: show only agents assigned a specific configuration.
- **Reporting rule**: show only agents assigned a specific reporting rule.
- **Advisory exposure**: show only agents that are **Affected**,
  **Unknown**, or **Not affected** by security advisories, or only agents
  whose highest matching severity is **Critical**, **High**, **Medium**, or
  **Low**. This filter and the **Advisories** column require a Telegraf
  Enterprise license.
  See [Find affected agents on the Agents page](/telegraf/controller/security-advisories/view/#find-affected-agents-on-the-agents-page).

Active filters appear as chips above the list, for example,
**Status: Not reporting** or **Config: web-servers**. Click the
{{% lucide "x" %}} icon on a chip to remove that filter.

## Search the agent list

Type in the search box above the agent list to find agents.
The search matches the agent's ID, hostname, IP address, or Telegraf version.
By default, the search finds the text anywhere in those fields and ignores
case. For example, `prod` matches the hostnames `prod-web-01` and `PROD-DB-02`.

Two toggles inside the search box change how the search matches:

- **Use regular expression** ({{< lucide icon="regex" bordered="true" >}}):
  treat the search text as a regular expression instead of plain text.
  For example, `^web-0[1-3]$` matches the hostnames `web-01`, `web-02`, and
  `web-03`, but not `web-04` or `prod-web-01`.
  A pattern can be up to 512 characters long.
  If the pattern is invalid, {{% product-name %}} shows the error below the
  search box.
- **Match case** ({{< lucide icon="case-sensitive" bordered="true" >}}):
  match uppercase and lowercase letters exactly as typed.
  For example, `Web` matches `Web-01` but not `web-01`.

A toggle is highlighted while it's on.
Turn both toggles off to return to the default plain-text search that ignores
case.

<!-- TODO: screenshot of the Agents page search box with "Use regular expression" turned on and a pattern entered. Save to /static/img/telegraf/controller-agents-search-modes.png and replace this comment with: {{< img-hd src="/img/telegraf/controller-agents-search-modes.png" alt="Telegraf Controller agent search with the regular expression toggle enabled" />}} -->

> [!Note]
> #### Regular expression syntax depends on the database
>
> {{% product-name %}} evaluates the pattern in its database, so the supported
> syntax depends on which database your instance uses:
>
> - **PostgreSQL**: [POSIX regular expressions](https://www.postgresql.org/docs/current/functions-matching.html#FUNCTIONS-POSIX-REGEXP)
> - **SQLite**: [Rust regular expression syntax](https://docs.rs/regex/latest/regex/#syntax)
>
> Common constructs such as anchors, character classes, alternation, and
> quantifiers behave the same in both.

The search text and both toggles are part of the page URL, so you can bookmark
or share a filtered view of the agent list.
The same search is available on the **Agents** tab of a configuration or a
[configuration group](/telegraf/controller/config-groups/use/#view-agents-using-a-group).

## Refresh the list

Click **{{% lucide "refresh-ccw" %}} Refresh** to reload the list and summary
on demand, or open the attached {{% lucide "chevron-down" %}} menu to select
an auto-refresh interval.

## Query the fleet summary API

The `GET /api/agents/summary` endpoint returns the data behind the summary
visualizations. It requires an API token with **read** permission on the
**Agents** API.

All query parameters are optional:

| Parameter       | Description                                              |
| :-------------- | :------------------------------------------------------- |
| `status`        | Agent status code to filter by                           |
| `search`        | Text to match against the agent ID, hostname, IP address, or Telegraf version |
| `regex`         | `true` to treat `search` as a regular expression         |
| `caseSensitive` | `true` to match `search` case-sensitively                |
| `config`        | Configuration ID or [alias](/telegraf/controller/configs/aliases/) |
| `group`         | Configuration group ID or alias                          |
| `reportingRule` | Reporting rule ID                                        |

The `GET /api/agents` endpoint that lists agents accepts the same `search`,
`regex`, and `caseSensitive` parameters.

<!--pytest.mark.skip-->
```bash { placeholders="API_TOKEN" }
curl "https://telegraf-controller.example.com/api/agents/summary?status=1" \
  -H "Authorization: Bearer API_TOKEN"
```

Replace {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}
with an API token that has read permission on the Agents API.

The response contains the total count, per-status counts, version
distribution, and last-reported bands:

```json
{
  "total": 42,
  "status": { "0": 35, "1": 4, "2": 3 },
  "telegrafVersion": [
    { "version": "1.39.0", "count": 30 },
    { "version": null, "count": 12 }
  ],
  "lastReported": {
    "lt5m": 30,
    "lt30m": 5,
    "lt1h": 2,
    "lt12h": 2,
    "lt24h": 1,
    "older": 2
  }
}
```

A `version` of `null` means the agent has not reported a Telegraf version.
The `older` band includes agents that have never reported.
