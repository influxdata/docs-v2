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

After you've [signed up for InfluxDB Cloud](/influxdb/cloud/sign-up/), you're ready to get started:

1. Do one of the following:
   - Add [demo data](#add-demo-data).
   - Add [sample data](#add-sample-data).
   - [Use your own data](/influxdb/cloud/write-data/) to explore InfluxDB Cloud.
2. [Create a notebook](#create-a-notebook):
    1.  Clicking **Notebooks** in the navigation menu on the left.

        {{< nav-icon "books" >}}

    2. [Select metrics](#select-metrics)
    3. [Visualize data](#visualize-data)
    4. (Optional) [Process data](#process-data)
    5. (Optional) [Monitor data](#monitor-data)
    6. (Optional) [Output to a new bucket and export as a task](#output-to-a-new-bucket-and-export-as-a-task)

## Add demo data

This example uses InfluxDB Cloud's Website Monitoring demo data bucket. To add the demo data bucket:

1.  Click **Load Data** > **Buckets** in the navigation menu on the left.

    {{< nav-icon "data" >}}

2.  Click **{{< icon "plus" >}} {{< caps >}}Add Demo Data{{< /caps >}}**, and then select the **Website Monitoring** bucket.
3.  The Demo Data bucket appears in your list of buckets.

## Add sample data

{{% note %}}
The examples below use the [NOAA NDBC sample data](/influxdb/v2.0/reference/sample-data/#noaa-ndbc-data), but we provide other [sample data sets](/influxdb/cloud/reference/sample-data/#sample-datasets) as well.
{{% /note %}}

Use [sample data](/influxdb/cloud/reference/sample-data/) to quickly populate InfluxDB with sample time series data. Sample data sets delivered with Cloud are used throughout this documentation site to provide context, best practices, and clear examples for how InfluxDB Cloud features and functions work.

1. Click **Data > Bucket** and click **Create Bucket** to create a bucket and name it **noaa**.
2. Do one of the following to download sample data:
   - [Install community templates](#add-sample-data-with-community-templates)
   - [Write sample data with an InfluxDB task](#write-sample-data-with-an-influxdb-task)

### Add sample data with community templates

1. In the navigation menu on the left, click **Settings** > **Templates**.

    {{< nav-icon "settings" >}}

2. Paste the [Sample Data community template URL](https://github.com/influxdata/community-templates/blob/master/sample-data/sample-data.yml) in the **resource manifest file** field and click the **{{< caps >>}}Lookup Template{{< /caps >}}** button.

#### Sample Data community template URL

```
    https://github.com/influxdata/community-templates/blob/master/sample-data/sample-data.yml
```

The sample data template installs a task that collects sample data and dashboards to visualize the sample data.
After installing the template, sample data is downloaded and stored in the sample data bucket at regular intervals.

### Write sample data with an InfluxDB task

Use the [Flux InfluxDB sample package](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/sample/) to download and write sample data to InfluxDB.

Add the following as an [InfluxDB task](/influxdb/cloud/process-data/manage-tasks/create-task/).

```js
import "influxdata/influxdb/sample"
option task = {
  name: "Collect NOAA NDBC data"
  every: 15m,
}
sample.data(set: "noaa")
  |> to(bucket: "noaa"  )
 ```

For more information about this and other InfluxDB sample datasets, see [InfluxDB sample data](/influxdb/cloud/reference/sample-data/).

## Create a notebook

Now that we've added the sample data bucket, we're ready to create our notebook. Notebooks can build and annotate processes and data flows for your time series data, including writing to, querying from, and visualizing your data. For more information, see [Notebooks](/influxdb/cloud/notebooks/).

### Select metrics

1. In the navigation menu on the left, click **Notebooks**.

    {{< nav-icon "notebooks" >}}
2. Click **+New Notebook**. By default, a **Metric Selector** and **Visualization** cell appear. For an overview of cell types, see [Overview of notebooks](/influxdb/cloud/notebooks/overview/#notebook-cell-types).
3. Enter a name for your notebook in the **Name this notebook** field.
5. In the **Metric Selector** cell, click the **Select a bucket** dropdown and chooose the bucket you want to explore data from. A list of measurements, fields, and tags from the bucket appear.
6. Select a column value to analyze.
7. Click **Preview** to preview the raw data in a table.

### Visualize data

Next, we'll make it easier to visualize the raw data by viewing it in a graph. For more information on how to visualize data, see [here](/influxdb/cloud/visualize-data/).

By default, a visualization cell appears below your initial metric selector cell showing the mean values on a graph.

1. Use the function dropdown menu to view different functions to apply to your data. By default, the visualization is set to the mean function.
2. Use the visualization type dropdown to view different visualization types available.
For a complete list of options, see [Visualization types](/influxdb/cloud/visualize-data/visualization-types/).
3. Click the gear icon ({{< icon "gear" >}}) to edit specific settings for the visualization type, such as colors, orientation, and labels.

### Process data

A common processing task is downsampling data to view it at different levels of granularity and reduce overall data disk usage over time. The following steps use a Flux script to downsample your data to every 3 hours 30 seconds.

For more information on how to process data, see [here](/influxdb/cloud/process-data/).

1. Click **+** to add a cell, then select **Transform > Downsample**.
2. In the **Apply aggregate** field, select **mean**.
3. In the **Every Window Period** field, enter a value. For this example, we'll use `3h30s`, but any duration is supported by InfluxDB Cloud. For more information, see [duration literals](/{{< latest "flux" >}}/spec/lexical-elements/#duration-literals).
4. Click **Preview** to view the downsampled data.

### Monitor data

Get notifications every time your data crosses a threshold. Specify your alerts by time and decide how the information will be sent to you.

1. In your notebook, click **{{< icon "plus" >}}** to add a cell, then select **Output > Alert**.
2. Customize the conditions to send an alert.
3. Enter a time range to automatically check the data and enter your query offset.
4. Select an endpoint to receive an alert:
   - Slack and a Slack Channel
   - HTTP post
   - Pager Duty
5. (Optional) Personalize your message. By default, the message is “${strings.title(v: r._type)} for ${r._source_measurement} triggered at ${time(v: r._source_timestamp)}!”
6. Click **Export as Alert Task** to save your alarm.

### Output to a new bucket and export as a task

After processing, send the downsampled data to a new bucket to store and view it. You can write it to the bucket a single time, or export it as a task, which is a scheduled Flux script, for it write to the bucket continuously.

1. Click **+** to add a cell, then select an **Output to Bucket** cell.
2. In the **Choose a bucket** dropdown, choose **+Create a Bucket**.
3. Enter a name for your bucket and click **Create**.
4. Click **Run** from the **Preview** dropdown list to run the notebook and write to the output bucket a single time.
5. To write continuously, click **Export as Task** in the upper right corner of the **Output to Bucket** cell. For details about working with tasks, see [Manage tasks](/influxdb/cloud/process-data/manage-tasks/).
