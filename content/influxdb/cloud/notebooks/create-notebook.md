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

Create a notebook to explore, visualize, and process your data.

This guide walks through the basics of creating a notebook. For specific examples, see the following:

  - [Downsample data](/influxdb/cloud/notebooks/downsample/)
  - [Normalize data](/influxdb/cloud/notebooks/clean-data/)

## Create a new notebook
1. In the navigation menu on the left, click **Notebooks**.

    {{< nav-icon "notebooks" >}}
2. Click **+Create Notebook**.
3. Enter a name for your notebook in the **Name this notebook** field.
4. By default, a **Metric Selector** and **Visualization** cell appear (see [Cell types](/influxdb/cloud/notebooks/notebooks-overview/#cell-types) for details.)
5. Click the **+** icon to add a cell. See [Cell types](/influxdb/cloud/notebooks/notebooks-overview/#cell-types) for details on each type of cell.
6. Click **Preview** to preview the results of each cell in a raw data table without writing any data.
    {{% warn %}}
If your cell contains a custom script that uses any output function to write data to InfluxDB (the `to()` function) or send it to a 3rd party service, clicking **Preview** will write data.
    {{% /warn %}}
7. Click the dropdown menu next to **Preview** and select **Run** to show the results of each cell and write it to the specified output bucket.
8. Click the eye icon to hide a cell.

## View and edit Flux script in a notebook
Convert your notebook cells into raw Flux script to view and edit it as code.

1. In the navigation menu on the left, click **Notebooks** and click on your notebook to open it.

    {{< nav-icon "notebooks" >}}
2. Click the log icon under the cells you want to view as Flux.
3. Click the log icon again to confirm. You won't be able to undo this step.
4. A Flux cell appears with underlying script for the above cells. View and edit the Flux script as needed.
