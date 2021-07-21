---
title: Create a notebook
description: >
  Create a notebook to explore, visualize, and process your data.
weight: 102
influxdb/cloud/tags:
menu:
  influxdb_cloud:
    name: Create a notebook
    parent: Notebooks
---

1. In the navigation menu on the left, click **Notebooks**.

    {{< nav-icon "notebooks" >}}
2. Click **+Create Notebook**. 
3. Enter a name for your notebook in the **Name this notebook** field. By default, the notebook name will appear as /username/-notebook-/year/-/month/-/day and time/. 
4. Select the local or UTC timezone and a time range for your data in the upper right corner. 
5. Click the **+** icon to add one or more of the following types of cells. A **Metric Selector**, a Data Validation, and **Visualization** cell will appear by default. The Metric Selector cell is required for some of the other cells to run. 
6. Choose your bucket in the **Choose a bucket** dropdown menu to define your data source. Data types should appear within the Metric Selector. 
7. Edit your time range with the time range option in the dropdown menu. 
8. Select filters to narrow your data. 
9. Add one or more cells if applicable: 
  - Transform your data using **Transform: Flux Script**.
     - Use `__PREVIOUS_RESULT__` to build from data in the previous cell.
     - Enter a Flux script to transform your data. 
  - Downsample data with **Transform: Downsample**. 
     - Window data by time and apply an aggregate to each window to downsample data. (For more information, see [Downsample data with notebooks](/influxdb/cloud/notebooks/downsample/).)
  - Create an output with **Output: Output to Bucket** 
     - Select a bucket. 
     - Click **Preview** to see what would be written to the bucket without commiting, or click **Run** in the upper left to write a single time, or select **Export as Task** to schedule your output as a task. 
  - Enter exemplanatory notes for you or your teammates in **Pass-through: Markdown**. 
10. Select **Preview** or **Run** in the upper left dropdown menu. By default, Preview appears. 
    - Click **Preview** (or press **CTRL + Enter**) to preview the results of each cell in a raw data table without writing any data. 
    - Select **Run** to show the results of each cell and write it to the specified output bucket.
    {{% warn %}}
If your cell contains a custom script that uses any output function to write data to InfluxDB (the `to()` function) or send it to a 3rd party service, clicking **Preview** will write data.
    {{% /warn %}}
11. Click the eye icon to hide a cell.

## Cell types
Notebooks are comprised of different cells. Add one or more of the following cell types to your notebook:

- **Input: Metric Selector**:
  - Choose a bucket to define your data source.
  - Edit your time range with the time range option in the dropdown menu.
  - Add filters to narrow your data.
- **Transform: Flux Script**:
  - Use `__PREVIOUS_RESULT__` to build from data in the previous cell.
  - Enter a Flux script to transform your data.
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

The following script with bring in data from the previous cell and downsample it. 
```js
__PREVIOUS_RESULT__
  |> aggregateWindow(fn: mean, every: 1h)
```
