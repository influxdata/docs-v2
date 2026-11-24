---
title: Visualize data
seotitle: Visualize data with InfluxDB 3 Explorer
description: >
  Choose how InfluxDB 3 Explorer draws a query result: the available chart
  types, the data each one needs, and how the Histogram, Heatmap, Candlestick,
  and State timeline charts work.
menu:
  influxdb3_explorer:
    name: Visualize data
weight: 5
related:
  - /influxdb3/explorer/data-explorer/
---

{{% product-name %}} draws query results as a table or chart in the
[Data Explorer](/influxdb3/explorer/data-explorer/) and on
dashboards.
Choose the chart type from **Visualization type** above the result, or in a
dashboard cell's **Visualization…** dialog.

- [Chart types](#chart-types)
- [Preview a chart type](#preview-a-chart-type)
- [How Explorer reads the result](#how-explorer-reads-the-result)
- [Histogram](#histogram)
- [Heatmap](#heatmap)
- [Candlestick](#candlestick)
- [State timeline](#state-timeline)
- [Large results](#large-results)

{{< children >}}

## Chart types

| Type | Draws | Needs |
| :--- | :---- | :---- |
| **Table** | The rows of the result | Any result |
| **Line** | Values over time | A time column and a numeric column |
| **Bar** | Values as bars | A numeric column |
| **Area** | Values over time, filled to a baseline | A time column and a numeric column |
| **Single Stat** | One value, such as the latest | A numeric column |
| **Gauge** | One value on a scale | A numeric column |
| **Pie** | Each series' share of the total | A numeric column and at least two slices above zero |
| **Scatter** | One numeric column against another | Two numeric columns |
| **Ranking** | Series sorted by value | A numeric column |
| **Histogram** _(v1.12+)_ | How values are distributed | A numeric column |
| **Heatmap** _(v1.12+)_ | Values or counts per time bucket, as colored cells | A time column and a numeric column |
| **Candlestick** _(v1.12+)_ | Open, high, low, and close values per time bucket | A time column and open, high, low, and close columns, or one value column |
| **State timeline** _(v1.12+)_ | How a state changes over time, one lane per series | A time column and a state column |

If a chart can't draw the result, it says why.

## Preview a chart type {metadata="v1.12+"}

Hover over a type in the **Visualization type** list to preview your result
as that chart.
Types that suit the result are marked **Suggested**.

<!-- IMAGE: explorer-chart-type-preview.png (see DOCS-INVENTORY.md) -->

## How Explorer reads the result

Explorer gives each column a role: **Time**, **Value** (a number to draw),
**Series** (a tag or other text column that splits rows into series), or
**Ignored**.
To change a role, use the **Data** section of
[chart options](/influxdb3/explorer/visualize-data/chart-options/#data).

## Histogram {metadata="v1.12+"}

A Histogram shows how values are distributed: it sorts each numeric column into
bins and draws how many values fall in each.
It ignores time.

**Display** options:

- **Bins** or **Bin width**. By default, Explorer picks 5 to 100 bins with
  round edges. If you set both, the width wins.
- **Log bins**: bins at 1, 2, and 5 in each decade. Values at or below zero
  are left out.
- **Cumulative**: the fraction of values at or below each bin.
- **Series**: **Overlaid** or **Stacked**.

## Heatmap {metadata="v1.12+"}

A Heatmap splits time into buckets and colors each cell by its value.
Set **Rows** to:

- **Series**: one row per series, colored by its mean in each bucket.
- **Buckets**: rows are value ranges, colored by how many values fall in each.
- **Auto** _(default)_: **Series** if the result has a series column,
  otherwise **Buckets**.

Other **Display** options are **Time bucket** (such as `5m`; by default about
200 columns), **Color** (a scheme, or **Threshold**), and
**Values in cells**.
A Heatmap shows up to 200 series.

## Candlestick {metadata="v1.12+"}

A Candlestick chart shows the open, high, low, and close values for each time
bucket, with volume bars below if the result has a volume column.
Rising candles are hollow; falling candles are filled.

Explorer finds the columns by name: `open` or `first`, `high` or `max`,
`low` or `min`, `close` or `last`, and `volume`.
If it doesn't find all four, it builds candles from one value column for each
**Time bucket**.
To pick columns yourself, set their roles in the **Data** section.

A Candlestick chart draws one series, so filter the query to one series.

## State timeline {metadata="v1.12+"}

A State timeline draws one lane per series and colors each stretch of time by
its state--for example, `ok`, `warning`, or `down`.
Explorer uses the column with the **State** role, or else the first numeric
column, or else the last text column.

**Display** options:

- **Layout**: **Timeline** merges repeated states into one segment;
  **Status history** draws one cell per row.
- **State text**: label each segment.

{{< img-hd src="/img/influxdb3/explorer-state-timeline.png" alt="Data Explorer showing a State timeline chart with one lane per machine and colored segments for each state over time." />}}

Use **Mappings** to give a state its own label or color.
A State timeline shows up to 100 lanes.

## Large results

To keep charts fast, Line, Bar, Area, Scatter, Single Stat, Gauge, Pie, and
Ranking charts downsample results with more than 1,500 rows per series or
50,000 rows in all.
Explorer splits the time range into buckets and keeps the highest and lowest
rows in each, so peaks stay visible.
The chart shows **Downsampled ·** and the bucket size.

Histogram, Heatmap, Candlestick, and State timeline charts draw up to 50,000
rows and aren't downsampled.
For larger results, Heatmap and Candlestick charts offer a query that groups by
time: click **Use this query**.
