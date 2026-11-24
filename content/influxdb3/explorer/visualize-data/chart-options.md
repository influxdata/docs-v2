---
title: Customize charts
seotitle: Customize charts in InfluxDB 3 Explorer
description: >
  Use chart options in InfluxDB 3 Explorer to set column roles, units,
  thresholds, axes, colors, legends, and per-series overrides, and to zoom,
  download, and copy chart settings.
menu:
  influxdb3_explorer:
    name: Customize charts
    parent: Visualize data
weight: 102
metadata: [Explorer v1.12+]
related:
  - /influxdb3/explorer/visualize-data/
  - /influxdb3/explorer/visualize-data/forecast/
---

Chart options control how {{% product-name %}} draws a chart: units,
thresholds, axes, colors, the legend, and settings for individual series.
They're saved with the Data Explorer tab or dashboard cell.

- [Open chart options](#open-chart-options)
- [Data](#data)
- [Display](#display)
- [Format](#format)
- [Thresholds](#thresholds)
- [Axes](#axes)
- [Colors](#colors)
- [Legend and tooltip](#legend-and-tooltip)
- [Overrides](#overrides)
- [Single Stat, Gauge, Pie, and Ranking](#single-stat-gauge-pie-and-ranking)
- [Zoom, expand, and download](#zoom-expand-and-download)
- [Copy options between cells](#copy-options-between-cells)
- [Charts saved before v1.12](#charts-saved-before-v112)

## Open chart options

- **Data Explorer**: click **Chart options** above the result.
- **Dashboard cell**: in the cell menu, select **Visualization…**, make your
  changes, and click **Save**.

Type in **Search options** to find an option.
Which sections appear depends on the chart type; the **Table** type has no
options.
Each section has a **Reset** button once you change something in it.

{{< img-hd src="/img/influxdb3/explorer-chart-options.png" alt="Line chart of CPU by host with green and orange threshold bands, next to the Chart options panel with Search options, unit and decimal settings, and thresholds." />}}

## Data

Shows each column's role: **Time**, **Value**, **Series**, or **Ignored**.
Explorer picks roles automatically (marked **Auto**); select another role to
override it.
Click **No grouping** to draw the result as one series.

## Display

For Line, Bar, Area, and Scatter charts:
**Interpolation** (**Linear**, **Smooth**, or a step), **Line width**,
**Points**, **Fill opacity**, **Missing values** (**Gap**, **Connect**, or
**Zero**), and **Stacking** (**None**, **Stacked**, or **100 %**).

For the Histogram, Heatmap, Candlestick, and State timeline options, see
[Visualize data](/influxdb3/explorer/visualize-data/).
For **Forecast**, see
[Forecast data](/influxdb3/explorer/visualize-data/forecast/#change-forecast-settings).

## Format

Choose a **Unit**--for example, **Percent (0–100)**, **Bytes (IEC)**, or
**Celsius**--or a **Custom prefix…** or **Custom suffix…**, and the number of
**Decimals**.
Units apply to axes, tooltips, legends, and single values, and carry over to
Grafana.

## Thresholds

Thresholds mark values that matter, such as CPU above 80%.

1.  Set the **Base** color for values below the first threshold.
2.  Click **Add threshold** and enter a value and color.
    Repeat as needed.
3.  Under **Values**, choose **Absolute** or **Percent of range**.
4.  For Line, Bar, Area, and Scatter charts, choose how to
    **Show thresholds as**: **Lines** or **Bands**.

To color the values themselves, set **Color by** to **Threshold** in
[Colors](#colors).

## Axes

- **Y axis**: **Min**, **Max**, **Scale** (**Linear** or **Log**),
  **Include zero**, a title, and tick labels.
- **Right y axis**: appears when an [override](#overrides) moves a series to
  the right, with its own unit, range, and scale.
- **Time axis**: a title, tick labels, **Time zone** (**Local** or **UTC**),
  and **Cover the selected time range**.

## Colors

Set **Color by** to **Palette** (**InfluxDB**, **Colorblind-safe**, or
**Legacy**), **Single**, or **Threshold**, or pick a color for each series by
name.
A series keeps its color across charts.

## Legend and tooltip

Show or hide the legend and choose its **Placement**.
Under **Values**, add **Last**, **Min**, **Max**, or **Mean** to the legend.
Set the **Tooltip** to show **All** series or a **Single** series.

Click a series in the legend to show only it;
{{< keybind mac="Cmd" other="Ctrl" >}}-click to add or remove series.

## Overrides

Overrides change individual series on Line, Bar, Area, and Scatter charts.

1.  Click **Add override**.
2.  Enter a **Series** name, or a pattern with `*`.
3.  Set a **Display name**, move the series to the **Right** axis, **Fill to**
    another series, or hide it.

If the result has a pair such as `lower` and `upper` or `p10` and `p90`,
Explorer suggests filling between them--click **Apply**.

## Single Stat, Gauge, Pie, and Ranking

These charts reduce each series to one value using a **Calculation**:
**Last** _(default)_, **First**, **Min**, **Max**, **Mean**, **Sum**, or
**Count**.
Each type has its own options--for example, a sparkline for Single Stat or the
number of slices for Pie.

## Zoom, expand, and download

- **Zoom**: drag across a time chart to zoom in; double-click to zoom out.
  Click **Reset zoom** in the time control to go back.
- **Expand**: click **Expand** on a dashboard cell to view it full screen.
- **Download**: **Download PNG** from the **More actions** menu or a cell
  menu, or **Download CSV** from a cell menu.

## Copy options between cells

In a cell menu, select **Copy options**, and then select **Paste options** in
another cell's menu.
Between different chart types, only the options both types share are copied.
The paste saves the cell.
Copied options stay in your browser, so you can paste into another dashboard.

## Charts saved before v1.12

All charts now draw straight lines by default and start Bar and Area charts at
zero.
Charts saved before v1.12 otherwise keep their earlier look and show
**This chart uses the earlier defaults.**
Click **Use the new defaults** to switch.
