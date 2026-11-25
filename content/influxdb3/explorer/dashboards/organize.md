---
title: Organize dashboards
seotitle: Organize InfluxDB 3 Explorer dashboards with rows, a shared cursor, colors, and annotations
description: >
  Group InfluxDB 3 Explorer dashboard cells in rows, share the cursor across
  cells, keep series colors consistent, and mark events with annotations.
menu:
  influxdb3_explorer:
    name: Rows and annotations
    parent: Dashboards
weight: 102
metadata: [Explorer v1.12+]
related:
  - /influxdb3/explorer/dashboards/
---

- [Group cells in rows](#group-cells-in-rows)
- [Share the cursor across cells](#share-the-cursor-across-cells)
- [Color series by name](#color-series-by-name)
- [Annotate dashboards](#annotate-dashboards)

## Group cells in rows

Rows group cells under a title you can collapse.
Cells in a collapsed row don't run their queries.

1.  Click **Edit layout**, and then click **Add row**.
2.  Drag cells into the row, or use **Move to row…** in a cell's menu.
3.  Use the row header to rename, move, or delete the row.
4.  Click **Save**.

Click the arrow on a row header to collapse or expand it.
This is saved right away, without **Save**.
Save a new row before you collapse it.

## Share the cursor across cells

When you hover over a time chart, the other time charts on screen show the same
moment.
To change this, set **Shared cursor** in **Dashboard settings…** to **Off**,
**Crosshair** _(default)_, or **Crosshair and tooltip**.
Heatmap, Candlestick, and State timeline charts don't take part.

## Color series by name

Turn on **Color series by name** in **Dashboard settings…** to give each
series the same color in every cell.
Colors set on a cell still take priority.

## Annotate dashboards

Annotations mark events, such as deployments, on every time chart.
Click **Annotations** in the toolbar to show or hide them.

**Add a note by hand**:
click **Annotations** > **Add annotation**, click a chart at a moment or drag
across a range, enter the text, and click **Save**.
Shortcut: {{< keybind mac="Cmd" other="Ctrl" >}}-click or -drag on a chart.

**Add annotations from a query**:
click **Annotations** > **Manage…** > **Add source**, choose the database, and
enter a query that returns a `time` column (and optionally `end_time`, `text`,
and tags).
**Processing engine errors** adds a ready-made source for trigger errors, like
this one:

```sql
SELECT
  event_time AS time,
  log_text AS text,
  trigger_name
FROM system.processing_engine_logs
WHERE log_level = 'ERROR'
```
