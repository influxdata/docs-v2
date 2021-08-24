---
title: Get started with InfluxDB Cloud
description: >
  Get started with InfluxDB Cloud by querying and visualizing demo data in InfluxDB Notebooks.
menu:
  influxdb_cloud:
    name: Get started
aliases:
  - /influxdb/v2.0/cloud/get-started
weight: 2
influxdb/cloud/tags: [get-started, install]
---

{{% note %}}
For example purposes, we will be referencing the [NOAA water sample data](/influxdb/v2.0/reference/sample-data/#noaa-water-sample-data), but you are free to use any of our available [sample data sets](/influxdb/cloud/reference/sample-data/#sample-datasets).
{{% /note %}}

After you've [signed up for InfluxDB Cloud](/influxdb/cloud/sign-up/), you're ready to get started:
1. Create a bucket for your data and name it **noaa**. 
2. Do one of the following:
   - (Recommended) Add [sample data](#add-sample-data). Sample data sets delivered with Cloud are used throughout this documentation site to provide context, best practices, and clear examples for how InfluxDB Cloud features and functions work.
   - Use your own data to explore Cloud. See how to [write your data](/influxdb/cloud/write-data/) to Cloud.
3.  [Create a notebook](/influxdb/cloud/notebooks/create-notebook/) to build and annotate processes and data flows for your time series data, including writing to, querying from, and visualizing your data.
   Click **Books > Create Notebook** and do the following: 
     1. [Select metrics](#select-metrics)
     2. [Visualize data](#visualize-data)
     3. (Optional) [Process data](#process-data)
     4. (Optional) [Output to a new bucket and export as a task](#output-to-a-new-bucket-and-export-as-a-task)

## Add sample data

Use [sample data](/influxdb/cloud/reference/sample-data/) to quickly populate InfluxDB with sample time series data. 

Do one of the following to download sample data: 
   - [Install community templates](#add-sample-data-with-community-templates) 
   - [Download using the InfluxData UI](#add-sample-data-with-influxdata-ui)

### Add sample data with community templates 

After installing the template, sample data will be stored in the sample data bucket. 

1. Go to the [community templates respository on GitHub](https://github.com/influxdata/community-templates) and head to our [sample data documentation](/influxdata/community-templates/tree/master/sample-data). 
2. [Install the template](https://github.com/influxdata/community-templates/tree/master/sample-data#quick-install) with the instructions given. 

### Add sample data with InfluxData UI 
   
1. Go to [Sample data](/influxdb/v2.0/reference/sample-data/) and view the [NOAA water sample data](/influxdb/v2.0/reference/sample-data/#noaa-water-sample-data). 
2. Copy the `sample.data()` function listed underneath the NOAA sample dataset. 
```js
import "experimental/csv"

csv.from(url: "https://influx-testdata.s3.amazonaws.com/noaa.csv")
  |> to(bucket: "noaa", org: "example-org")
```
3. Click **Explore** in InfluxDB Cloud's left navigation menu and select your **noaa** bucket. 
4. Click **Script Editor**. 
5. Paste your `sample.data()` function. 
6. Click **Submit**. 

## Select metrics

Now that we've added the sample data bucket, we're ready to create our notebook.

1. In the navigation menu on the left, click **Notebooks**.

    {{< nav-icon "notebooks" >}}
2. Click **+Create Notebook**. By default, a **Metric Selector** and **Visualization** cell appear. For an overview of cell types, see [Overview of notebooks](/influxdb/cloud/notebooks/overview/#notebook-cell-types). 
3. Enter a name for your notebook in the **Name this notebook** field. 
5. In the **Metric Selector** cell, click the **Select a bucket** dropdown and choose **noaa**.

{{< img-hd src="/img/influxdb/cloud-controls-select-bucket.png" alt="Select bucket" />}}

    A list of measurements, fields, and tags for the noaa bucket appear.

6. For this example, click the `response_time` field.
7. Click **Preview** to preview the raw response time data in a table.

## Visualize data

Next, we'll make it easier to visualize the raw data by viewing it in a graph. For more information on how to visualize data, see [here](/influxdb/cloud/visualize-data/).

By default, a visualization cell appears below your initial metric selector cell showing the mean `response_time` values on a graph. 

1. Use the function dropdown menu to view different functions to apply to your data. For this response time data, the mean function is a good fit.
2. Use the visualization type dropdown to view different visualization types available.
For a complete list of options, see [Visualization types](/influxdb/cloud/visualize-data/visualization-types/).
3. Click the gear icon ({{< icon "gear" >}}) to edit specific settings for the visualization type, such as colors, orientation, and labels.

## Process data

A common processing task is downsampling data to view it at different levels of granularity and reduce overall data disk usage over time. The following steps use a Flux script to downsample the noaa sample data to every 12 hours.

For more information on how to process data, see [here](/influxdb/cloud/process-data/).

1. Click **+** to add a cell, then select **Transform > Downsample**.
2. In the **Apply aggregate** field, select **mean**.
3. In the **Every Window Period** field, enter a value. For this example, we'll use `12h`.
4. Click **Preview** to view the downsampled data.

## Monitor data 

## Output to a new bucket and export as a task

After processing, send the downsampled data to a new bucket to store and view it. You can write it to the bucket a single time, or export it as a task, which is a scheduled Flux script, for it write to the bucket continuously.

1. Click **+** to add a cell, then select an **Output to Bucket** cell.
2. In the **Choose a bucket** dropdown, choose **+Create a Bucket**.
3. Enter a name for your bucket, such as Website monitoring downsampled, and click **Create**.
4. Click **Run** from the **Preview** dropdown list to run the notebook and write to the output bucket a single time.
5. To write continuously, click **Export as Task** in the upper right corner of the **Output to Bucket** cell. For details about working with tasks, see [Manage tasks](/influxdb/cloud/process-data/manage-tasks/).

