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

Learn about the building blocks of a notebook, how notebooks can help show how data is processed, and discover some common use cases.

To use different notebook cell types, controls, and uses to process data, see:
- [Notebook concepts](/influxdb/v2.1/notebooks/overview/#notebook-concepts)
- [Notebook controls](/influxdb/v2.1/notebooks/overview/#notebook-controls)
- [Notebook cell types](/influxdb/v2.1/notebooks/overview/#notebook-cell-types)

## Notebook concepts

{{< youtube Rs16uhxK0h8 >}}

Using notebooks, you can:

- Create documents with live code, equations, visualizations, and explanatory notes.
- Create dashboard cells or scheduled tasks.
- Clean and downsample data.
- Build runbooks.
- Document data processing steps.

## Notebook controls

The following options appear at the top of each notebook.

### Preview/Run mode

- Select **Preview** (or press **Control+Enter**) to display results of each cell without writing data. Helps to verify that cells return expected results before writing data.
- Select **Run** mode displays results of each cell and writes data to the selected bucket.

### Presentation mode

Display notebooks in full screen with Presentation mode, hiding the left and top navigation menus so only the cells appear. This mode might be helpful, for example, for stationary screens dedicated to monitoring visualizations.

### Local or UTC timezone

Click the timezone dropdown list to select a timezone to use for the dashboard. Select either the local time (default) or UTC.

### Time range

Select from the options in the dropdown list or select **Custom Time Range** to enter a custom time range with precision up to nanoseconds.

## Notebook cell types

The following cell types are available for your notebook:
- [Inputs](#inputs)
- [Transform](#transform)
- [Pass-through](#pass-through)
- [Output](#output)

### Inputs

At least one input cell is required in a notebook for other cells to run.

- **Flux Script**: Input your data using a Flux script.
- **Query Builder**: Input your data using a query.

### Visualization

- **Table**: View your data in a table.
- **Graph**:  View your data in a graph.
- **Note**:  Create explanatory notes or other information for yourself or one of your team members.

### Pass-through

- **Column Editor**: Modify column visibility and naming.
- **Markdown**: Create explanatory notes or other information for yourself or one of your team members.
- **Visualization**: Represents your data in visual formats such as graphs or charts.

### Output

- **Notification**: Set up alerts.
- **Output to Bucket**: In **Preview** mode, this cell represents what would be written if the data was going to be committed to a bucket.
- **Output: Schedule**: Run tasks at specific times.
