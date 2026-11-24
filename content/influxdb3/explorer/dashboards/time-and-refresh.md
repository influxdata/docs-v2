---
title: Set dashboard time and refresh
seotitle: Set the time range and refresh of InfluxDB 3 Explorer dashboards
description: >
  Set the time range of an InfluxDB 3 Explorer dashboard, share a view by link,
  refresh it automatically, give a cell its own time, compare to an earlier
  period, and control the interval charts aggregate to.
menu:
  influxdb3_explorer:
    name: Time and refresh
    parent: Dashboards
weight: 101
metadata: [Explorer v1.12+]
related:
  - /influxdb3/explorer/dashboards/
  - /influxdb3/explorer/data-explorer/
---

- [Set the time range](#set-the-time-range)
- [Share a view](#share-a-view)
- [Refresh a dashboard](#refresh-a-dashboard)
- [Give a cell its own time](#give-a-cell-its-own-time)
- [Compare to the previous period](#compare-to-the-previous-period)
- [Set the interval](#set-the-interval)

## Set the time range

Dashboards and the Data Explorer share one time control.
Use **Earlier** and **Later** to step through time, and **Zoom in** and
**Zoom out** to narrow or widen the range.
Click the range to pick a quick range or type your own:

| Type | Example |
| :--- | :------ |
| An offset from now | `now-6h` (units: `s`, `m`, `h`, `d`, `w`) |
| A rounded time | `now-1d/d` (start of yesterday) |
| A duration | `13h` (the last 13 hours) |
| An absolute time | `2026-10-08 09:00` |

{{< img-hd src="/img/influxdb3/explorer-dashboard-time-range.png" alt="Dashboard with the Time range picker open, a typed range of now-12h to now, a list of quick ranges, and a Local or UTC time zone switch." />}}

**Time zone** (**Local** or **UTC**) applies across Explorer.
You can also drag across a chart to zoom, and double-click to zoom out.

On a dashboard, **Default (the query's own filter)** lets each cell use the
time filter in its query.
InfluxDB 3 Core offers ranges up to 72 hours.

## Share a view

A dashboard's URL holds its time range, time zone, refresh, interval, and
comparison, so a link shows others what you see.
Changing the view doesn't change the dashboard for anyone else.

- **Copy link** (dashboard menu) copies the range as absolute times.
  Turn on **Keep relative** to share a relative range, such as the last 6 hours.
- **Set as default** saves the current range, refresh, and interval as what
  everyone sees when they open the dashboard.

## Refresh a dashboard

Click **Refresh** to rerun the cells' queries.
To refresh automatically, click the arrow next to it and choose an interval,
or **Auto** to match the time range (for example, every minute for the last
hour).

To save work on InfluxDB, Explorer pauses auto-refresh in hidden tabs and
queries only cells that are on screen.
A refresh doesn't pick up changes others made to the dashboard; reload the page
for that.

## Give a cell its own time

In the cell menu, select **Cell settings…**, and choose one of the following:

- **Follow dashboard** _(default)_
- **Relative range**: its own window ending now, such as the last 24 hours.
- **Shift by**: the dashboard's window moved back, such as one day.
- **Ignore dashboard time**: run the query as written.

The cell shows a chip such as **Last 24 h** or **Shifted 1 d**.

## Compare to the previous period

Click **Compare** in the toolbar and choose **Previous period**,
**Previous day**, **Previous week**, or a **Custom shift**.
Every time series chart on the dashboard draws the earlier period behind the
current one, and Single Stat cells show the change.
Cells with their own time or a forecast are left out.

{{< img-hd src="/img/influxdb3/explorer-dashboard-rows-compare.png" alt="Dashboard comparing the last six hours with the previous day: dashed previous-day lines behind the CPU and memory charts, a collapsed row, and an open row." />}}

Compare needs a time range (not **Default**) and isn't saved or exported.

## Set the interval

The interval is the bucket width charts aggregate to, shown in the toolbar as,
for example, **Interval: Auto (1 min)**.
Explorer picks it from the time range; choose one from the menu to pin it.

Use it in queries with `$__interval` or `$__dateBin(column)`:

```sql
SELECT
  $__dateBin(time) AS time,
  host,
  avg(usage_user) AS cpu
FROM cpu
GROUP BY 1, host
ORDER BY 1
```

These macros need a dashboard time range.
