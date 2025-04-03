
Create a notebook to explore, visualize, and process your data.
Learn how to add and configure cells to customize your notebook.
To learn the benefits and concepts of notebooks, see
[Overview of Notebooks](/influxdb/version/tools/notebooks/overview/).

- [Create a notebook from a preset](#create-a-notebook-from-a-preset)
- [Use data source cells](#use-data-source-cells)
- [Use visualization cells](#use-visualization-cells)
- [Add a data source cell](#add-a-data-source-cell)
- [Add a validation cell](#add-a-validation-cell)
- [Add a visualization cell](#add-a-visualization-cell)

## Create a notebook from a preset

To create a new notebook, do the following:

1. In the navigation menu on the left, click **Notebooks**.

    {{< nav-icon "notebooks" >}}
2. In the **Notebooks** page, select one of the following options under **Create a Notebook**:
    - **New Notebook**: includes a [query builder cell](#add-a-data-source-cell), a [validation cell](#add-a-validation-cell), and a [visualization cell](#add-a-visualization-cell).
    - **Set an Alert**: includes a [query builder cell](#add-a-data-source-cell), a [validation cell](#add-a-validation-cell), a [visualization cell](#add-a-visualization-cell), and an [alert builder cell](#add-an-action-cell).
    - **Schedule a Task**: includes a [Flux Script editor cell](#add-a-data-source-cell), a [validation cell](#add-a-validation-cell), and a [task schedule cell](#add-an-action-cell).
    - **Write a Flux Script**: includes a [Flux script editor cell](#add-a-data-source-cell), and a [validation cell](#add-a-validation-cell).

3.  Enter a name for your notebook in the **Untitled Notebook** field.
4. Do the following at the top of the page:
   - Select your local time zone or UTC.
   - Choose a time [range](/flux/v0/stdlib/universe/range/) for your data.
5. Your notebook should have a **Data Source** cell as the first cell. **Data Source** cells provide data to subsequent cells. The presets (listed in step 2) include either a **Query Builder** or a **Flux Script** as the first cell.
6. To define your data source query, do one of the following:
   - If your notebook uses a **Query Builder** cell, select your bucket and any additional filters for your query.
   - If your notebook uses a **Flux Script** cell, enter or paste a [Flux script](/influxdb/version/query-data/flux/).
{{% show-in "v2" %}}
7. Select and click **Preview** (or press **CTRL + Enter**) under the notebook title.
    InfluxDB displays query results in **Validate the Data** and **Visualize the Result** *without writing data or running actions*.
{{% /show-in %}}
8. (Optional) Change your visualization settings with the drop-down menu and the {{< icon "gear" >}} **Configure** button at the top of the **Visualize the Result** cell.
9. (Optional) Toggle the **Presentation** switch to display visualization cells and hide all other cells.
10. (Optional) Configure notebook actions {{% show-in "v2" %}}(**Alert**, **Task**, or **Output to Bucket**){{% /show-in %}}{{% show-in "cloud,cloud-serverless" %}}(**Alert** or **Task**){{% /show-in %}}.
11. (Optional) To run your notebook actions, select and click **Run** under the notebook title.
12. (Optional) To add a new cell, follow the steps for one of the cell types:

    - [Add a data source cell](#add-a-data-source-cell)
    - [Add a validation cell](#add-a-validation-cell)
    - [Add a visualization cell](#add-a-visualization-cell)
    - [Add an action cell](#add-an-action-cell)
13. (Optional) [Convert a query builder cell into raw Flux script](#convert-a-query-builder-to-flux) to view and edit the code.

## Use Data Source cells

### Convert a Query Builder to Flux
To edit the raw Flux script of a **Query Builder** cell, convert the cell to Flux.

{{% warn %}}
You can't convert a **Flux Script** editor cell to a **Query Builder** cell.
Once you convert a **Query Builder** cell to a **Flux Script** editor cell, you can't convert it back.
{{% /warn %}}

1. Click the {{% icon "more" %}} icon in the **Query Builder** cell you want to edit as Flux, and then select **Convert to |> Flux**.
You won't be able to undo this step.

   A **Flux Script** editor cell containing the raw Flux script replaces the **Query Builder** cell.

2. View and edit the Flux script as needed.

## Use visualization cells

- To change your [visualization type](/influxdb/version/visualize-data/visualization-types/), select a new type from the drop-down list at the top of the cell.
- (For histogram only) To specify values, click **Select**.
- To configure the visualization, click **Configure**.
- To download results as an annotated CSV file, click the **CSV** button.
- To export to the dashboard, click **Export to Dashboard**.

## Add a data source cell

Add a [data source cell](/influxdb/version/tools/notebooks/overview/#data-source) to pull information into your notebook.

To add a data source cell, do the following:
1. Click {{< icon "notebook-add-cell" >}}.
2. Select **{{< caps >}}Flux Script{{< /caps >}}** or **{{< caps >}}Query Builder{{< /caps >}}** as your input, and then select or enter the bucket to pull data from.
3. Select filters to narrow your data.
4. Select {{% show-in "v2" %}}**Preview** (**CTRL + Enter**) or {{% /show-in %}}**Run** in the upper left drop-down list.

## Add a validation cell

A validation cell uses the **Table** [visualization type](/influxdb/version/visualize-data/visualization-types/) to display query results from a data source cell.

To add a **Table** visualization cell, do the following:

1. Click {{< icon "notebook-add-cell" >}}.
2. Under **Visualization**, click **{{< caps >}}Table{{< /caps >}}**.

## Add a visualization cell

Add a visualization cell to render query results as a [Visualization type](/influxdb/version/visualize-data/visualization-types/).

To add a Table visualization cell, do the following:

1. Click {{< icon "notebook-add-cell" >}}.
2. Under **Visualization**, select one of the following visualization cell-types:

   - **{{< caps >}}Table{{< /caps >}}**: Display data in tabular format.
   - **{{< caps >}}Graph{{< /caps >}}**: Visualize data using InfluxDB visualizations.
   - **{{< caps >}}Note{{< /caps >}}**: Use Markdown to add notes or other information to your notebook.

To modify a visualization cell, see [use visualization cells](#use-visualization-cells).
For detail on available visualization types and how to use them, see [Visualization types](/influxdb/version/visualize-data/visualization-types/).

## Add an action cell

Add an [action cell](/influxdb/version/tools/notebooks/overview/#action) to create an [alert](/influxdb/version/monitor-alert/)
{{% show-in "cloud,cloud-serverless" %}}or{{% /show-in %}}{{% show-in "v2" %}},{{% /show-in %}} process data with a [task](/influxdb/version/process-data/manage-tasks/)
{{% show-in "v2" %}}, or output data to a bucket{{% /show-in %}}.

{{% show-in "v2" %}}

{{% warn %}}
If your cell contains a custom script that uses any output function to write data to InfluxDB (for example: the `to()` function) or sends data to a third-party service, clicking Preview will write data.
{{% /warn %}}

{{% /show-in %}}

- [Add an Alert cell](#add-an-alert-cell)
- {{% show-in "v2" %}}[Add an Output to Bucket cell](#add-an-output-to-bucket-cell){{% /show-in %}}
- [Add a Task cell](#add-a-task-cell)

### Add an Alert cell

To add an [alert](/influxdb/version/monitor-alert/) to your notebook, do the following:

1. Enter a time range to automatically check the data and enter your query offset.
2. Customize the conditions to send an alert.
3. Select an endpoint to receive an alert:
   - Slack and a Slack Channel
   - HTTP post
   - PagerDuty
4. (Optional) Personalize your message. By default, the message is:
   ```
   ${strings.title(v: r._type)} for ${r._source_measurement} triggered at ${time(v: r._source_timestamp)}!
   ```
5. Click **{{< caps >}}Test Alert{{< /caps >}}** to send a test message to your configured **Endpoint**. The test will not schedule the new alert.
6. Click **{{< icon "export" >}} {{< caps >}}Export Alert Task{{< /caps >}}** to create your alert.

{{% show-in "v2" %}}

### Add an Output to Bucket cell

To write **Data Source** results to a bucket, do the following:

1. Click {{% icon "notebook-add-cell" %}}.
2. Click **{{< caps >}}Output to Bucket{{< /caps >}}**.
3. In the **{{< icon "bucket" >}} Choose a bucket** drop-down list, select or create a bucket.
4. Click **Preview** to view the query result in validation cells.
5. Select and click **Run** in the upper left to write the query result to the bucket.

{{% /show-in %}}

### Add a Task cell

To add a [task](/influxdb/version/process-data/manage-tasks/) to your notebook, do the following:

1. Click {{% icon "notebook-add-cell" %}}.
2. Click **{{< caps >}}Task{{< /caps >}}**.
3. Enter a time and an offset to schedule the task.
4. Click **{{< icon "task" >}} {{< caps >}}Export as Task{{< /caps >}}** to save.
