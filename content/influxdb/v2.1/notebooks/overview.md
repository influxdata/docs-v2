---
title: Overview of notebooks
description: >
  Learn about the building blocks of a notebook.
weight: 101
influxdb/v2.1/tags: [notebooks]
menu:
  influxdb_2_1:
    name: Overview of notebooks
    parent: Notebooks
---

Learn how notebooks can help to streamline and simplify your day-to-day business processes.

See an overview of [notebook concepts](/influxdb/v2.1/notebooks/overview/#notebook-concepts), [notebook controls](/influxdb/v2.1/notebooks/overview/#notebook-controls), and [notebook cell types](/influxdb/v2.1/notebooks/overview/#notebook-cell-types) also know as the basic building blocks of a notebook.

## Notebook concepts

You can think of an InfluxDB notebook as template that contains cells (building blocks) to define how to query, visualize, process, and write data to your buckets. Notebooks help you do the following:

- Create snippets of live code, equations, visualizations, and explanatory notes.
- Create alerts or scheduled tasks.
- Downsample and normalize data.
- Build runbooks to share with your teams.
- Output data to buckets.

## Notebook controls

The following options appear at the top of each notebook.

### Run

Select {{< caps >}}Run{{< /caps >}} (or press **Control+Enter**) to display results of each cell and write data to the selected bucket.

### Save Notebook

Select {{< caps >}}Save Notebook{{< /caps >}} to save all notebook cells.

{{% note %}}
Saving the notebook does not save cell results. When you open a saved notebook, click {{< caps >}}**Run**{{< /caps >}} to update cell results. {{% /note %}}

### Local or UTC timezone

Click the timezone dropdown list to select a timezone to use for the notebook. Select either the local time (default) or UTC.

### Time range

Select from the options in the dropdown list or select **Custom Time Range** to enter a custom time range with precision up to nanoseconds, and then click {{< caps >}}Apply Time Range{{< /caps >}}.

## Notebook cell types

The following cell types are available for your notebook:
- [Data source](#data-source)
- [Visualization](#visualization)
- [Action](#action)

### Data source

At least one data source (input) cell is required in a notebook for other cells to run.

- {{< caps >}}Query Builder{{< /caps >}}: Input your data using a query.
- {{< caps >}}Flux Script{{< /caps >}}: Input your data using a Flux script.

  Data source cells work like the **Query Builder** or **Script Editor** in Data Explorer. For more information, see how to [query data with Flux and the Data Explorer](/influxdb/v2.1/query-data/execute-queries/data-explorer/#query-data-with-flux-and-the-data-explorer).

### Visualization

- {{< caps >}}Table{{< /caps >}}: View your data in a table.
- {{< caps >}}Graph{{< /caps >}}: View your data in a graph.
- {{< caps >}}Note{{< /caps >}}: Create explanatory notes or other information for yourself or one of your team members.

### Action

- {{< caps >}}Alert{{< /caps >}}: Set up alerts. See how to [monitor data and send alerts](/influxdb/v2.1/monitor-alert/).
- {{< caps >}}Tasks{{< /caps >}}: Set up tasks. See how to [manage tasks in InfluxDB](/influxdb/v2.1/process-data/manage-tasks/).
When an action is processed, the alert or task results are written to the specified bucket as applicable.
