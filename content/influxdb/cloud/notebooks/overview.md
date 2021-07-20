---
title: Overview of notebooks
description: >
  Learn about the building blocks of a notebook. 
weight: 101
influxdb/cloud/tags:
menu:
  influxdb_cloud:
    name: Overview of notebooks
    parent: Notebooks
---

Notebooks are a way to build and annotate processes and data flows for time series data. Notebooks include different cell types and controls that help to show how data is processed.

Using notebooks, you can:

- Create documents with live code, equations, visualizations, and explanatory notes.
- Create dashboard cells or scheduled tasks.
- Clean and downsample data.
- Build runbooks.
- Document data processing steps.

{{< youtube Rs16uhxK0h8 >}}

## Notebook controls

The following options appear at the top of each notebook.

### Preview/Run mode

- Select **Preview** (or press **Control+Enter**) to display results of each cell without writing data. Helps to verify that cells return expected results before writing data.
- Select **Run** mode displays results of each cell and writes data to the selected bucket.

### Presentation mode

Presentation mode displays notebooks in full screen, hiding the left and top navigation menus so only the cells appear. This mode might be helpful, for example, for stationary screens dedicated to monitoring visualizations.

### Local or UTC timezone

Click the timezone dropdown list to select a timezone to use for the dashboard. Select either the local time (default) or UTC.

### Time range

Select from the options in the dropdown list or select **Custom Time Range** to enter a custom time range with precision up to nanoseconds.

## Cell types

Add one or more of the following cell types to your notebook:

- **Input: Metric Selector**:
Filter out your data using group keys.
- **Transform: Flux Script**:
Modify your data with Flux Script. `__PREVIOUS_RESULT__` refers to your previous inputs from the Metric Selector.
- **Transform: Downsample**:
Downsample data through aggregates.
- **Pass-through: Markdown**: 
Create explanatory notes or other information for yourself or one of your team members.
- **Pass-through: Visualization**:
Represents your data in visual formats such as graphs or charts. 
- **Output: Output to Bucket**: 
In **Preview** mode, this cell represents what would be written if the data was going to be committed to a bucket.
