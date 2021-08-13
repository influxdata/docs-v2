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
To learn how notebooks can be useful and to see an overview of different cell types available in notebooks, see [Overview of Notebooks](/influxdb/cloud/notebooks/overview/).

1. In the navigation menu on the left, click **Notebooks**.

    {{< nav-icon "notebooks" >}}
2. Click **+Create Notebook**, and then enter a name for your notebook in the **Name this notebook** field. By default, the notebook name appears as `<username>-notebook-<year>-<month>-<day and time>`.
3. Do the following at the top of the page:
   - Select your local time zone or UTC.
   - Choose a time range for your data.
4. Consider which notebook cells to add to your notebook. You need to have one input cell for other cells to run properly. By default, each notebook includes **Metric Selector**, **Data Validation**, and **Visualization** cells.
5. Select your bucket in **Metric Selector** and then select the filters to narrow your data.
6. Do one of the following:
    - To view results in your cells (for example, **Data Validation** and **Visualization**) *without writing data*, click **Preview** (or press **CTRL + Enter**).
    - To view the results of each cell and write the results to the specified output bucket, click **Run**.
7. (Optional) Change your visualization settings with the dropdown menus and gear icon at the top of the **Visualization** cell.
8. (Optional) Click the **+** icon, and then add one or more of the following cell types to your notebook:

    - [Input](#add-an-input-cell): to pull information into your notebook
    - [Transform](#add-a-transform-cell): to filter and apply changes to your data
    - [Pass-through](#add-a-pass-through-cell): to visualize and add notes to your data
    - [Output](#add-an-output-cell): to write data to a bucket, preview output before writing, or schedule an output task
9. (Optional) [Convert a cell into raw Flux script](#view-and-edit-flux-script-in-a-cell) to view and edit the code.

### Add an input cell

1. Select **Metric Builder** or **Query Builder** as your input, and then select the bucket to pull data from.
2. Select filters to narrow your data.
3. Select **Preview** (**CTRL + Enter**) or **Run** in the upper left dropdown menu.

### Add a transform cell

1. Select one of the following transform cell-types:
    - **Flux Script**: Use `__PREVIOUS_RESULT__` to build from data in the previous cell, enter a Flux script to transform your data.
    - **Downsample**: Window data by time and apply an aggregate to each window to downsample data. For more information, see [Downsample data with notebooks](/influxdb/cloud/notebooks/downsample/).
2. Select **Preview** (**CTRL + Enter**) or **Run** in the upper left dropdown menu.

{{% warn %}}
If your cell contains a custom script that uses any output function to write data to InfluxDB (for example: the to() function) or send it to a third party service, clicking Preview will write data.
{{% /warn %}}

### Add a pass-through cell

Select one of the following pass-through cell-types:

- To change visability and name of columns, select [Column Editor](#column-editor).
- To create a visualization of your data, select [Visualization](#visualization). For details on available visualization types and how to use them, see [Visualization types](/influxdb/cloud/visualize-data/visualization-types/).
- To enter explanatory notes, select [Markdown](#markdown).

#### Column Editor  

- Click the toggle to hide or view your column.
- Rename your columns by hovering over the column name and pressing the pencil icon.

#### Visualization

- To change your visualization type, click the second dropdown menu at the top of the cell.
- (For histogram only) To specify values, click **Select**.
- To configure the visualization, click **Configure**.
- To download results as an annotated CSV file, click the **CSV** button.
- To export to the dashboard, click **Export to Dashboard**.  

#### Markdown

- Type in notes as needed.

### Add an output cell

Select one of the following output cell-types:

- To recieve an alert, select [Notification](#notification) and complete the steps below.
- To write output to a bucket, select [Output to Bucket](#output-to-bucket) and complete the steps below.
- To create a task, select [Schedule](#schedule) and complete the steps below.

#### Notification

1. Enter a time range to automatically check the data and enter your query offset.
2. Customize the conditions to send an alert.
3. Select an endpoint to receive an alert:
   - Slack and a Slack Channel
   - HTTP post
   - Pager Duty
4. (Optional) Personalize your message. By default, the message is "Notification Rule: ${ r._notification_rule_name } triggered by check: ${ r._check_name }: ${ r._message }."
5. Click **Export as Task** to create your alarm.

#### Output to bucket

1. Select a bucket.
2. Click **Preview** to see what would be written to the bucket without commiting, or click **Run** in the upper left to write, or select **Export as Task** to schedule your output as a task.

#### Schedule

1. Enter a time and an offset to schedule the task.
2. Click **Export as Task** to save.

### View and edit Flux script in a cell
Convert your notebook cells into raw Flux script to view and edit the code. Conversion to Flux is available for the following cell types:
  - **Inputs: Metric Selector**
  - **Transform: Column Editor** and **Downsample**

1. Click the overflow menu icon in the cell you want to view as Flux, and then select **Convert to |> Flux**. You won't be able to undo this step.
    A Flux cell appears with underlying script for the selected cell.
3. View and edit the Flux script as needed.
