
Learn how notebooks can help to streamline and simplify your day-to-day business processes.

See an overview of [notebook concepts](/influxdb/version/tools/notebooks/overview/#notebook-concepts), [notebook controls](/influxdb/version/tools/notebooks/overview/#notebook-controls), and [notebook cell types](/influxdb/version/tools/notebooks/overview/#notebook-cell-types) also know as the basic building blocks of a notebook.

## Notebook concepts

You can think of an InfluxDB notebook as a collection of sequential data processing steps. Each step is represented by a "cell" that performs an action such as querying, visualizing, processing, or writing data to your buckets. Notebooks help you do the following:

- Create snippets of live code, equations, visualizations, and explanatory notes.
- Create alerts or scheduled tasks.
- Downsample and normalize data.
- Build runbooks to share with your teams.
- Output data to buckets.

## Notebook controls

The following options appear at the top of each notebook.

{{% show-in "v2" %}}

### Preview/Run mode

- Select **Preview** (or press **Control+Enter**) to display results of each cell without writing data. Helps to verify that cells return expected results before writing data.

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

### Run

Select {{< caps >}}Run{{< /caps >}} (or press **Control+Enter**) to display results of each cell and write data to the selected bucket.

{{% /show-in %}}

### Save Notebook (appears before first save)

Select {{< caps >}}Save Notebook{{< /caps >}} to save all notebook cells. Once you've saved the notebook, this button disappears and the notebook automatically saves as subsequent changes are made.

{{% note %}}
Saving the notebook does not save cell results. When you open a saved notebook, click {{< caps >}}**Run**{{< /caps >}} to update cell results.
{{% /note %}}

### Local or UTC timezone

Click the timezone drop-down list to select a timezone to use for the notebook. Select either the local time (default) or UTC.

### Time range

Select from the options in the dropdown list or select **Custom Time Range** to enter a custom time range with precision up to nanoseconds, and then click **{{< caps >}}Apply Time Range{{< /caps >}}**.

{{% show-in "cloud,cloud-serverless" %}}

### Share notebook

To generate a URL for the notebook, click the **{{< icon "share" >}}** icon.
For more detail, see how to [share a notebook](/influxdb/cloud/tools/notebooks/manage-notebooks/#share-a-notebook).

{{% /show-in %}}

## Notebook cell types

The following cell types are available for your notebook:
- [Data source](#data-source)
- [Visualization](#visualization)
- [Action](#action)

### Data source

At least one data source (input) cell is required in a notebook for other cells to run.

- **{{< caps >}}Query Builder{{< /caps >}}**: Build a query with the Flux query builder.
- **{{< caps >}}Flux Script{{< /caps >}}**: Enter a raw Flux script.

  Data source cells work like the **Query Builder** or **Script Editor** in Data Explorer. For more information, see how to [query data with Flux and the Data Explorer](/influxdb/version/query-data/execute-queries/data-explorer/#query-data-with-flux-and-the-data-explorer).

### Visualization

- **{{< caps >}}Table{{< /caps >}}**: View your data in a table.
- **{{< caps >}}Graph{{< /caps >}}**: View your data in a graph.
- **{{< caps >}}Note{{< /caps >}}**: Create explanatory notes or other information for yourself or your team members.

### Action

- **{{< caps >}}Alert{{< /caps >}}**: Set up alerts. See how to [monitor data and send alerts](/influxdb/version/monitor-alert/).
- **{{< caps >}}Tasks{{< /caps >}}**: Use the notebook to set up and export a task. See how to [manage tasks in InfluxDB](/influxdb/version/process-data/manage-tasks/).
