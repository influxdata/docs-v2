---
title: View agent heartbeat data
list_title: View heartbeat data
description: >
  View heartbeat statistics and reported logs for a Telegraf agent, configure
  what agents include in heartbeats, and retrieve heartbeat data with the API.
menu:
  telegraf_controller:
    name: View heartbeat data
    parent: Manage agents
weight: 103
related:
  - /telegraf/controller/agents/monitor/
  - /telegraf/controller/agents/create/
  - /telegraf/controller/tokens/use/
---

Each agent heartbeat can carry runtime statistics and a sample of recent
Telegraf logs. {{% product-name %}} stores this data in its database and
displays it on the agent detail page, so you can inspect an agent's recent
behavior without shell access to the host running Telegraf.

<!-- TOC -->
- [The agent detail page](#the-agent-detail-page)
- [Heartbeat statistics](#heartbeat-statistics)
- [Reported logs](#reported-logs)
- [Include statistics with heartbeats](#include-statistics-with-heartbeats)
- [Include logs with heartbeats](#include-logs-with-heartbeats)
- [Retrieve heartbeat data with the API](#retrieve-heartbeat-data-with-the-api)
- [How heartbeat data is stored](#how-heartbeat-data-is-stored)
<!-- /TOC -->

## The agent detail page

To open an agent's detail page, go to **Agents**, click the
**More button ({{% lucide "ellipsis-vertical" %}})** on an agent row, and
select **{{% lucide "eye" %}} View Details**. The page shows:

- **Heartbeat Data**: the agent's status, when it last reported, its Telegraf
  version, and its recent [heartbeat statistics](#heartbeat-statistics).
- **Agent Metadata**: labels, creation time, hostname, and reported IP
  address.
- **Reporting Rule**: the assigned
  [reporting rule](/telegraf/controller/agents/reporting-rules/) and its
  thresholds, with a **Change** button to assign a different rule.
- **Agent Configurations**: managed configurations linked to their
  configuration pages, and external configurations with copyable paths.
- **Reported Logs**: a collapsible section with the agent's most recently
  [reported logs](#reported-logs).

Click **{{% lucide "refresh-ccw" %}} Refresh** in the page header to reload
all of it.

<!-- TODO: screenshot of the agent detail page showing the Heartbeat Data card with sparklines and the Reported Logs section expanded. Save to /static/img/telegraf/controller-agent-heartbeat-data.png and replace this comment with: {{< img-hd src="/img/telegraf/controller-agent-heartbeat-data.png" alt="Telegraf Controller agent detail page with heartbeat data and reported logs" />}} -->

## Heartbeat statistics

The **Heartbeat Data** card shows three counters from the agent's latest
heartbeat: **Errors** and **Warnings** logged, and **Metrics** written since
the previous heartbeat. Hover the {{% lucide "info" %}} icon next to each
counter for its definition.

Each counter includes a bar chart of up to the 24 most recent heartbeats.
Hover a bar for the count it represents and the window it covers. A gap in
the chart marks a missing heartbeat: {{% product-name %}} infers the agent's
heartbeat interval from its recent history and renders a gap when the time
between two heartbeats significantly exceeds it.

If the agent doesn't send statistics, the card shows a notice instead. To fix
it, see [Include statistics with heartbeats](#include-statistics-with-heartbeats).

## Reported logs

The **Reported Logs** section shows a sample of Telegraf logs carried by the
agent's latest heartbeat. When the sample is smaller than what the agent
reported, the caption shows how many entries are displayed out of the
reported total.

The table lists each entry's **Time**, **Level** (colored by severity),
**Source**, and **Message**. Click a row to expand the full message and the
entry's attributes. A `(truncated)` marker means the message exceeded the
[stored message size limit](#how-heartbeat-data-is-stored).

Click **{{% lucide "download" %}} Download JSON** to save the displayed
entries as a JSON file.

If the agent doesn't send logs, the section shows a notice instead. To fix
it, see [Include logs with heartbeats](#include-logs-with-heartbeats).

## Include statistics with heartbeats

To send runtime statistics with each heartbeat, add `statistics` to the
`include` option of the agent's
[heartbeat output plugin](/telegraf/controller/agents/create/#configure-agents):

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "my-agent"
  include = ["hostname", "statistics", "configs"]
```

## Include logs with heartbeats

To send a sample of recent Telegraf logs with each heartbeat, add `logs` to
the `include` option. Optionally tune the sample with the
`[outputs.heartbeat.logs]` subtable:

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "my-agent"
  include = ["hostname", "statistics", "configs", "logs"]

  [outputs.heartbeat.logs]
    limit = 100
    level = "warn"
```

- **limit**: maximum number of log entries to send per heartbeat.
- **level**: minimum severity to include: `error`, `warn`, `info`, `debug`,
  or `trace`.

## Retrieve heartbeat data with the API

Both endpoints identify the agent by its reported agent ID (the heartbeat
plugin's `instance_id`) and require an API token with **read** permission on
the **Heartbeat** API.

### Latest heartbeat

`GET /api/heartbeat/agent/:agentId/latest-heartbeat` returns the most recent
heartbeat snapshot, or `null` if none exists: when it was received, the
reported statistics, how many log entries the agent reported and
{{% product-name %}} stored, and the stored entries themselves.

<!--pytest.mark.skip-->
```bash { placeholders="API_TOKEN|AGENT_ID" }
curl "https://telegraf-controller.example.com/api/heartbeat/agent/AGENT_ID/latest-heartbeat" \
  -H "Authorization: Bearer API_TOKEN"
```

### Statistics history

`GET /api/heartbeat/agent/:agentId/logs` returns the per-heartbeat statistics
series that backs the detail page's bar charts, oldest first. Each record
carries a timestamp and the error, warning, and metric counts for that
heartbeat.

| Parameter | Description                                             |
| :-------- | :------------------------------------------------------ |
| `from`    | Start of the time range, in epoch milliseconds          |
| `to`      | End of the time range, in epoch milliseconds            |
| `limit`   | Maximum records to return: 1–5000. Default: `200`       |

<!--pytest.mark.skip-->
```bash { placeholders="API_TOKEN|AGENT_ID" }
curl "https://telegraf-controller.example.com/api/heartbeat/agent/AGENT_ID/logs?limit=500" \
  -H "Authorization: Bearer API_TOKEN"
```

Replace the following:

- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: an
  API token with read permission on the Heartbeat API
- {{% code-placeholder-key %}}`AGENT_ID`{{% /code-placeholder-key %}}: the
  agent's reported agent ID

> [!Note]
> Despite its path, the statistics history endpoint returns per-heartbeat
> counts, not log text. Log entries are available only from the latest
> heartbeat snapshot.

## How heartbeat data is stored

{{% product-name %}} stores heartbeat data in its database with fixed limits:

- Each heartbeat stores up to 200 log entries within a 64 KiB budget.
  When an agent reports more, entries are kept by severity (`error` first)
  and then by recency.
- A stored log message is capped at 8 KiB (marked `(truncated)` in the UI)
  and an entry's attributes at 2 KiB.
- Only the latest heartbeat's log entries are retained. Older heartbeat
  records keep their statistics only.
- Statistics records older than 24 hours are deleted, except each agent's
  most recent record.

> [!Important]
> #### The logs-dir option was removed
>
> Earlier versions of {{% product-name %}} wrote agent logs to files in a
> directory set with `--logs-dir` / `LOGS_DIR`. The database now stores this
> data and the option no longer exists. Passing it has no effect.
