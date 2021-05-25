---
title: Overview of notebooks
description: >
  Familiarize yourself with notebook controls and cell types.
weight: 101
influxdb/cloud/tags:
menu:
  influxdb_cloud:
    name: Overview of notebooks
    parent: Notebooks
---

Notebooks allow you to explore, visualize, and process your data in one place.

This overview details available cell types and controls. For details on creating notebooks, see [Create a notebook](/influxdb/cloud/notebooks/create-notebook).

## Cell types
Notebooks are comprised of different cells. Add one or more of the following cell types to your notebook:

- **Input: Metric Selector**:
  - Choose a bucket to define your data source.
  - Edit your time range with the time range option in the dropdown menu.
  - Add filters to narrow your data.
- **Transform: Flux Script**:
  - Use `__PREVIOUS_RESULT__` to build from data in the previous cell.
  - Enter a Flux script to transform your data.
  {{% note %}}
  You can also convert any of the other cell types into raw Flux script. For details, see [Create a notebook](/influxdb/cloud/notebooks/create-notebook/view-and-edit-flux-script-in-a-notebook).
  {{% /note %}}
- **Transform: Downsample**:
  - Window data by time and apply an aggregate to each window to downsample data.
  - For more information, see [Downsample data with notebooks](/influxdb/cloud/notebooks/downsample/).
- **Pass-through: Markdown**: Enter explanatory notes or other information for yourself or one of your team members in Markdown.
- **Pass-through: Visualization**:
  - Create a visualization of your data. For details on available visualization types and how to use them, see [Visualization types](/influxdb/cloud/visualize-data/visualization-types/).
  - Click **Export to Dashboard** in the upper right to send your cell to a new or existing dashboard.
- **Output: Output to Bucket**: Write data to a bucket. Click **Run** in the upper left to write a single time, or select **Export as Task** to schedule your output as a task.

## Notebook controls
The following options appear in the upper right of each notebook.

### Presentation mode
Toggle the **Presentation** option to enter presentation mode. Use presentation mode to view notebooks in full screen, hiding the left and top navigation menus so only the cells appear. This mode might be helpful, for example, for stationary screens dedicated to monitoring visualizations.

### Time range
Select from the options in the dropdown list or select **Custom Time Range** to enter a custom time range with precision up to nanoseconds.

### Timezone
Click the timezone dropdown list to select a timezone to use for the dashboard. Select either the local time (default) or UTC.
