---
title: Create a notebook
description: >
  Create a notebook to explore, visualize, and process your data.
weight: 101
influxdb/cloud/tags:
menu:
  influxdb_cloud:
    name: Create a notebook
    parent: Notebooks
---
{{% note %}}
**Notebooks is currently an early-access feature.**
[Submit a request](https://w2.influxdata.com/notebooks-early-access/) for early access, and we'll send you a confirmation notebooks is available in your account.
{{% /note %}}

Create a notebook to explore, visualize, and process your data.

This guide walks through the basics of creating a notebook. For specific examples, see the following:

  - [Downsample data](/influxdb/cloud/notebooks/downsample/)
  - [Normalize data](/influxdb/cloud/notebooks/clean-data/)

## Create a new notebook
1. In the navigation menu on the left, click **Notebooks**.

    {{< nav-icon "notebooks" >}}
2. Click **+Create Notebook**.
3. Enter a name for your notebook in the **Name this notebook** field.
4. By default, a **Metric Selector** and **Visualization** cell appear (see [Cell types](#cell-types) below for details.)
5. Click the **+** icon to add a cell. See [Cell types](#cell-types) below for details on each type of cell.
6. Click **Preview** to preview the results of each cell in a raw data table without writing any data.
    {{% warn %}}
If your cell contains a custom script that uses any output function to write data to InfluxDB (the `to()` function) or send it to a 3rd party service, clicking **Preview** will write data.
    {{% /warn %}}
7. Click the dropdown menu next to **Preview** and select **Run** to show the results of each cell and write it to the specified output bucket.
7. Click the eye icon to hide a cell.

## Cell types
Notebooks are comprised of different cells. Add one or more of the following cell types to your notebook:

- **Input: Metric Selector**:
  - Choose a bucket to define your data source.
  - Edit your time range with the time range option in the dropdown menu.
  - Add filters to narrow your data.
- **Transform: Flux Script**:
  - Use `__PREVIOUS_RESULT__` to build from data in the previous cell.
  - Enter a Flux script to transform your data.
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
