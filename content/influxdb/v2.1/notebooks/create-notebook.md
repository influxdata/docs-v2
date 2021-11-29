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

1. In the navigation menu on the left, click **Books** or **Notebooks**.

    {{< nav-icon "notebooks" >}}
2. In the **Notebooks** page, click one of the following options under **Create a Notebook**:
    - **New Notebook**: includes a query builder cell, a validate cell, and a [visualize cell](#add-a-visualization-cell).
    - **Set an Alert**: includes a [query builder cell](#add-a-data-source-cell), a validate cell, a visualize cell, and an [alert builder cell](#add-an-action-cell).
    - **Schedule a Task**: includes a Flux script editor cell, a validate cell, and a [task schedule cell](#add-an-action-cell).
    - **Write a Flux Script**: includes a Flux script editor cell, and a validate cell.

3.  Enter a name for your notebook in the **Untitled Notebook** field.
3. Do the following at the top of the page:
   - Select your local time zone or UTC.
   - Choose a time [range](/{{% latest "flux" %}}/stdlib/universe/range/) for your data.
4. Your notebook should have a **Data Source** cell as the first cell. It provides data to subsequent cells. The presets (listed in step 2) include either a **Query Builder** or a **Flux Script** as the first cell.
5. To define your data source query, do one of the following:
   - If your notebook uses a **Query Builder** cell, select your bucket and any additional filters for your query.
   - If your notebook uses a **Flux Script** cell, enter or paste a [Flux script](/influxdb/v2.1/query-data/flux/).
6. Select and click **Preview** (or press **CTRL + Enter**) under the notebook title.
   InfluxDB displays query results in **Validate the Data** and **Visualize the Result** *without writing data or running actions*.
7. (Optional) Change your visualization settings with the dropdown menu and the {{< icon "gear" >}} **Configure** button at the top of the **Visualize the Result** cell.
8. (Optional) Toggle the **Presentation** switch to display visualization cells and hide all other cells.
7. (Optional) Configure notebook actions (**Alert**, **Task**, or **Output to Bucket**).
7. (Optional) To run your notebook actions, select and click **Run** under the notebook title.
8. (Optional) To add a new cell, follow the steps for one of the cell types:

    - [Add a data source cell](#add-a-data-source-cell)
    - [Add a validation cell](#add-a-validation-cell)
    - [Add a visualization cell](#add-a-visualization-cell)
    - [Add an action cell](#add-an-action-cell):
9. (Optional) [Convert a cell into raw Flux script](#view-and-edit-flux-script-in-a-cell) to view and edit the code.

### Add a data source cell

Add a data source cell to pull information into your notebook.
InfluxDB provides the following data source cells:
- **Query Builder** cell
- **Flux Script** cell

1. Select **Flux Script** or **Query Builder** as your input, and then select or enter the bucket to pull data from.
2. Select filters to narrow your data.
3. Select **Preview** (**CTRL + Enter**) or **Run** in the upper left dropdown menu.

### Add a validation cell

Add a **Validate the Data** cell to display raw query results from a data source cell.

### Add a visualization cell

Add a **Visualize the Result** cell to render query results as a [Visualization type](/influxdb/cloud/visualize-data/visualization-types/).

Select one of the following visualization cell-types:

- Table
- Graph
- Note

To modify a visualization cell, see [use a visualization cell](use-a-visualization-cell).
For detail on available visualization types and how to use them, see [Visualization types](/influxdb/cloud/visualize-data/visualization-types/).

### Use a visualization cell

- To change your visualization type, select a new type from the dropdown menu at the top of the cell.
- (For histogram only) To specify values, click **Select**.
- To configure the visualization, click **Configure**.
- To download results as an annotated CSV file, click the **CSV** button.
- To export to the dashboard, click **Export to Dashboard**.  

### Add an action cell

Add an action cell to filter and apply changes to your data, for example, create an alert, process data with a task, or output data to a bucket.

{{% warn %}}
If your cell contains a custom script that uses any output function to write data to InfluxDB (for example: the `to()` function) or sends data to a third-party service, clicking Preview will write data.
{{% /warn %}}

- [Add an Alert cell](#add-an-alert-cell)
- [Add an Output to Bucket cell](#add-an-output-to-bucket-cell)
- [Add a Task cell](#add-a-task-cell)

#### Add an Alert cell

To create an alert and receive a notification, do the following:

1. Enter a time range to automatically check the data and enter your query offset.
2. Customize the conditions to send an alert.
3. Select an endpoint to receive an alert:
   - Slack and a Slack Channel
   - HTTP post
   - Pager Duty
4. (Optional) Personalize your message. By default, the message is
   ```
   ${strings.title(v: r._type)} for ${r._source_measurement} triggered at ${time(v: r._source_timestamp)}!
   ```
5. Click **Test Alert** to send a test message to your configured **Endpoint**. The test will not schedule the new alert.
6. Click **Export Alert Task** to create your alert.

#### Add an Output to Bucket cell

To write output to a bucket, do the following:

1. Immediately after (below) a **Validate the Data** cell, click the {{< icon "notebook-add-cell" >}} (e.g., the output cell won't work if it follows a visualization cell).
1. In the dropdown menu, select or create a bucket.
2. Click **Preview** to view the query result in validation cells.
3. Select and click **Run** in the upper left to write the query result to the bucket.

#### Add a Task cell
To create a task,
1. Enter a time and an offset to schedule the task.
2. Click **Export as Task** to save.

### View and edit Flux script in a cell
Convert your notebook cells into raw Flux script to view and edit the code. Conversion to Flux is available for the following cell types:
  - **Inputs: Metric Selector**
  - **Transform: Column Editor** and **Downsample**

1. Click the overflow menu icon in the cell you want to view as Flux, and then select **Convert to |> Flux**. You won't be able to undo this step.
    A Flux cell appears with underlying script for the selected cell.
2. View and edit the Flux script as needed.
