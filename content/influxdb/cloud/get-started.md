---
title: Get started with InfluxDB Cloud
description: Get started
menu:
  influxdb_2_0:
    name: Get started
weight: 2
influxdb/v2.0/tags: [get-started, install]
---

After you've signed up for and installed InfluxData, you're ready to start writing, querying, and visualizing data.

Get started working with demo data in InfluxDB Cloud using notebooks using this guide.

## Add demo data

This example uses InfluxDB Cloud's Website Monitoring demo data bucket. To add the demo data bucket:

1.  In the navigation menu on the left, click **Data (Load Data)** > **Buckets**.

    {{< nav-icon "data" >}}

2.  Click **{{< icon "plus" >}} Add Demo Data**, and then select the **Website Monitoring** bucket.
3.  The Demo Data bucket appears in your list of buckets.

## Select metrics

Now that we've added the demo data bucket, we're ready to create our notebook. The first notebook cell selects the bucket and metrics we'll work with.

1. In the navigation menu on the left, click **Notebooks**.

    {{< nav-icon "notebooks" >}}
2. Click **+Create Notebook**.
3. Enter a name for your notebook in the **Name this notebook** field.
4. By default, a **Metric Selector** and **Visualization** cell appear (see [Cell types](#cell-types) below for details.)
5. In the **Metric Selector** cell, click the **Select a bucket** dropdown and choose **Website Monitoring Bucket**.

{{< img-hd src="/img/influxdb/gs_select_bucket.png" alt="Select bucket" />}}

A list of measurements, fields, and tags for the Website Monitoring bucket appear.

6. For this example, click the `response_time` field.
7. Click **Preview** to preview the raw response time data in a table.

{{< img-hd src="/img/influxdb/gs_select_bucket.png" alt="Preview table" />}}


## Visualize data

Next, we'll make it easier to visualize the raw data by viewing it in a graph.

1. By default, a visualization cell appears below your initial metric selector cell showing the mean `response_time` values on a graph:
{{< img-hd src="/img/influxdb/gs_response_time_mean.png" alt="Mean response time graph" />}}
2. Use the function dropdown menu to view different functions to apply to your data. For this response time data, the mean function is a good fit.
3. Use the visualization type dropdown to view different visualization types available.
For a complete list of options, see [Visualization types](/influxdb/cloud/visualize-data/visualization-types/).
4. Click the gear icon ({{< icon "gear" >}}) to edit specific settings for the visualization type, such as colors, orientation, and labels.

## Process data

A common processing task is downsampling data to view it at different levels of granularity and reduce overall data disk usage over time. The following steps use a Flux script to downsample the website monitoring sample data to every 12 hours.

1. Click **+** to add a cell, then select **Transform > Downsample**.
2. In the **Apply aggregate** field, select **mean**.
3. In the **Every Window Period** field, enter a value. For this example, we'll use `12h`.
4. Click **Preview** to view the downsampled data.

## Output to a new bucket and export as a task

After processing, send the downsampled data to a new bucket to store and view it. You can write it to the bucket a single time, or export it as a task, which is a scheduled Flux script, for it write to the bucket continuously.

1. Click **+** to add a cell, then select an **Output to Bucket** cell.
2. In the **Choose a bucket** dropdown, choose **+Create a Bucket**.
3. Enter a name for your bucket, such as Website monitoring downsampled, and click **Create**.
4. To write downsampled data to your new bucket:
  - Click **Run** from the **Preview** dropdown list to run the notebook and write to the output bucket a single time.
  - To write continuously, click **Export as Task** in the upper right corner of the **Output to Bucket** cell. For details about working with tasks, see [Manage tasks](/influxdb/cloud/process-data/manage-tasks/).
