---
title: Query data in the Data Explorer
seotitle: Query data in the InfluxDB 3 Explorer Data Explorer
description: >
  Use the Data Explorer in InfluxDB 3 Explorer to write and run SQL and
  InfluxQL queries, browse the schema, view results as a table or chart, and
  arrange the editor, result, and side panels.
menu:
  influxdb3_explorer:
    name: Data Explorer
weight: 4
metadata: [Explorer v1.12+]
related:
  - /influxdb3/explorer/get-started/#query-data-from-influxdb, Get started: Query data
  - /influxdb3/explorer/visualize-data/
---

Use the **Data Explorer** to write and run queries, browse your schema, and see
results as a table or chart.
Navigate to **Query Data** > **Data Explorer**.

<!-- IMAGE: explorer-data-explorer-overview.png (see DOCS-INVENTORY.md) -->

- [Write and run a query](#write-and-run-a-query)
- [Use the schema panel](#use-the-schema-panel)
- [View the result](#view-the-result)
- [Use the side panels](#use-the-side-panels)
- [Change the view](#change-the-view)
- [Work with tabs](#work-with-tabs)
- [Convert Flux to SQL](#convert-flux-to-sql)

## Write and run a query

1.  Choose **SQL** or **InfluxQL** in the toolbar.
    (**Flux to SQL** and **Ask AI** are there too, unless AI is
    [turned off](/influxdb3/explorer/install/docker/#turn-off-ai-features).)
2.  Write the query and choose a time range.
3.  Click **Run**, or press {{< keybind mac="Cmd+Enter" other="Ctrl+Enter" >}}.

With several statements in the editor, **Run** runs the one under the cursor.
Select text to run only that (**Run selection**).

## Use the schema panel

The schema panel lists the selected database's tables and columns.
Drag its edge to resize it, or click **Collapse Schema** to shrink it to a
rail.

Hover over a column to **Insert** its name, start a **New query**,
[**Forecast**](/influxdb3/explorer/visualize-data/forecast/) it, or narrow the
query to it (**only**).
On SQL tabs, select columns to add them to the query.

## View the result

Above the result, choose a **Visualization type**, open **Chart options**,
turn on **Chart and table** to see both, **Export** the data, or
**Save to Dashboard**.

{{< img-hd src="/img/influxdb3/explorer-data-explorer-chart-and-table.png" alt="Data Explorer with the schema panel collapsed, a SQL query, a line chart of CPU by host, and the result table beside it." />}}

While a query runs, or if it fails, the previous result stays in view.

## Use the side panels

Open **Chart options**, **History**, **Saved queries**, or
**Code snippets** from the rail on the right.
History has two lists: **Queries** you ran and **Errors**.

## Change the view

Use the buttons above the rail to show **Editor only**,
**Editor and result** _(default)_, or **Result only**.
Press <kbd>Esc</kbd> to return to both.

## Work with tabs

Each tab keeps its own query, time range, and chart.
Click **New tab** to add one, double-click a tab to rename it, or right-click
it for more options.

## Convert Flux to SQL

On a **Flux to SQL** tab, paste a Flux query, click **Convert**, and then
**Run**.
Converting sends the Flux query to an InfluxData service at
`console.influxdata.com`.
