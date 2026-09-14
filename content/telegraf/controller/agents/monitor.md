---
title: Monitor agents
list_title: Monitor agents
description: >
  Use the Agents page summary visualizations, filters, and the fleet summary
  API to monitor the health of your Telegraf fleet.
menu:
  telegraf_controller:
    name: Monitor agents
    parent: Manage agents
weight: 102
related:
  - /telegraf/controller/agents/heartbeat-data/
  - /telegraf/controller/agents/status/
  - /telegraf/controller/agents/reporting-rules/
---

The **Agents** page summarizes the health of your Telegraf fleet at a glance
and lets you filter the agent list by status, configuration, and reporting
rule. The same data is available from the fleet summary API for dashboards and
automation.

<!-- TOC -->
- [The Agents page at a glance](#the-agents-page-at-a-glance)
- [View fleet summary details](#view-fleet-summary-details)
- [Filter the agent list](#filter-the-agent-list)
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

<!-- TODO: screenshot of the Agents page with the More details section expanded, showing the Fleet Health tiles, Telegraf Versions donut, and Last Reported histogram. Save to /static/img/telegraf/controller-agents-summary.png and replace this comment with: {{< img-hd src="/img/telegraf/controller-agents-summary.png" alt="Telegraf Controller agents page with the fleet summary expanded" />}} -->

## Filter the agent list

Use the controls above the agent list to filter it:

- **Search** ({{% lucide "search" %}}): matches the agent's hostname, its
  agent ID when no hostname was reported, or its IP address.
- **Status**: show only agents in the selected status.
- **Configuration**: show only agents assigned a specific configuration.
- **Reporting rule**: show only agents assigned a specific reporting rule.

Active filters appear as chips above the list, for example,
**Status: Not reporting** or **Config: web-servers**. Click the
{{% lucide "x" %}} icon on a chip to remove that filter.

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
| `search`        | Matches hostname, agent ID (when no hostname), or IP address |
| `config`        | Configuration ID or [alias](/telegraf/controller/configs/aliases/) |
| `group`         | Configuration group ID or alias                          |
| `reportingRule` | Reporting rule ID                                        |

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
