---
title: Create a notebook
description: >
  Create a notebook to explore, visualize, and process your data.
weight: 102
influxdb/v2.1/tags: [notebooks]
menu:
  influxdb_2_1:
    name: Create a notebook
    parent: Notebooks
---
To learn how notebooks can be useful and to see an overview of different cell types available in notebooks, see [Overview of Notebooks](/influxdb/v2.1/notebooks/overview/).

1. In the navigation menu on the left, click **Notebooks**.

    {{< nav-icon "notebooks" >}}
2. Click one of the following options under **Create a Notebook**:
    - New Notebook
    - Set an Alert
    - Schedule a Task
    - Write a Flux Script
3.  Enter a name for your notebook in the **Untitled Notebook** field. 
3. Do the following at the top of the page:
   - Select your local time zone or UTC.
   - Choose a time range for your data.
4. Consider which notebook cells to add to your notebook. You need to have one input cell for other cells to run properly. The default notebook cell types included in your notebook (**Data Source**, **Visualization**, and **Action**) vary depending on the type of notebook you selected in step 2. 
5. Select your bucket in your query or Flux script, and then select the filters to narrow your data.
6. Do one of the following:
    - To view results in your cells (for example, to view your **Visualization** or **Action**) *without writing data*, click **Preview** (or press **CTRL + Enter**).
    - To view the results of each cell and write the results to the specified output bucket, click **Run**.
7. (Optional) Change your visualization settings with the dropdown menus and gear icon at the top of the **Visualization** cell.
8. (Optional) Click the **+** icon, and then add one or more of the following cell types to your notebook:

    - [Data source](#add-a-data-source-cell): to pull information into your notebook
    - [Visualization](#add-a-visualization-cell): to 
    - [Action](#add-an-action-cell): filter and apply changes to your data, for example, create an alert, process data with a task, or output data to a bucket
9. (Optional) [Convert a cell into raw Flux script](#view-and-edit-flux-script-in-a-cell) to view and edit the code.

### Add a data source cell

1. Select **Flux Script** or **Query Builder** as your input, and then select or enter the bucket to pull data from.
2. Select filters to narrow your data.
3. Select **Preview** (**CTRL + Enter**) or **Run** in the upper left dropdown menu.

### Add an action cell

1. Select one of the following action cell-types:
    - **Alert**
    - **Downsample**: Window data by time and apply an aggregate to each window to downsample data. For more information, see [Downsample data with notebooks](/influxdb/v2.1/notebooks/downsample/).
2. Select **Preview** (**CTRL + Enter**) or **Run** in the upper left dropdown menu.

{{% warn %}}
If your cell contains a custom script that uses any output function to write data to InfluxDB (for example: the `to()` function) or sends data to a third-party service, clicking Preview will write data.
{{% /warn %}}

### Add a pass-through cell

Select one of the following pass-through cell-types:

- To change visability and name of columns, select [Column Editor](#column-editor).
- Table
- Graph
- Note
For detail on available visualization types and how to use them, see [Visualization types](/influxdb/cloud/visualize-data/visualization-types/).

#### Column Editor  

- Click the toggle to hide or view your column.
- Rename your columns by hovering over the column name and pressing the pencil icon.

#### Visualization

- To change your visualization type, select a new type from the dropdown menu at the top of the cell.
- (For histogram only) To specify values, click **Select**.
- To configure the visualization, click **Configure**.
- To download results as an annotated CSV file, click the **CSV** button.
- To export to the dashboard, click **Export to Dashboard**.  

### Add an action cell

Select one of the following action cell-types:

- To recieve a notification, select [Alert](#alert) and complete the steps below.
- To write output to a bucket, select [Output to Bucket](#output-to-bucket) and complete the steps below.
- To create a task, select [Task](#task) and complete the steps below.

#### Alert

1. Enter a time range to automatically check the data and enter your query offset.
2. Customize the conditions to send an alert.
3. Select an endpoint to receive an alert:
   - Slack and a Slack Channel
   - HTTP post
   - Pager Duty
4. (Optional) Personalize your message. By default, the message is "${strings.title(v: r._type)} for ${r._source_measurement} triggered at ${time(v: r._source_timestamp)}!"
5. Click **Export as Task** to create your alert.

#### Output to bucket

1. Select a bucket.
2. Click **Preview** to see what would be written to the bucket without commiting, or click **Run** in the upper left to write, or select **Export as Task** to schedule your output as a task.

#### Task

1. Enter a time and an offset to schedule the task.
2. Click **Export as Task** to save.

### View and edit Flux script in a cell
Convert your notebook cells into raw Flux script to view and edit the code. Conversion to Flux is available for the following cell types:
  - **Inputs: Metric Selector**
  - **Transform: Column Editor** and **Downsample**

1. Click the overflow menu icon in the cell you want to view as Flux, and then select **Convert to |> Flux**. You won't be able to undo this step.
    A Flux cell appears with underlying script for the selected cell.
3. View and edit the Flux script as needed.
