---
title: Downsample data with notebooks
description: >
  Downsample data to reduce overall disk usage as data collects over time.
weight: 102
influxdb/cloud/tags:
menu:
  iinfluxdb_cloud:
    name: Downsample data with notebooks
    parent: Notebooks
---
{{% note %}}
**Notebooks is currently an early access feature.**
[Submit a request](https://w2.influxdata.com/notebooks-early-access/) for early access, and we'll send you a confirmation notebooks is available in your account.
{{% /note %}}

Downsample data to reduce the overall disk usage as data collects over time. over time.
Learn how to create a notebook that downsamples data—walk through the following example to create a notebook that does the following:

- Inputs InfluxDB Cloud demo data from the Website Monitoring Bucket
- Downsamples data by aggregating data within windows of time with a Flux script
- Outputs downsampled data to a bucket.

## Requirements

- This example uses [InfluxDB Cloud demo data](/influxdb/cloud/reference/sample-data/#influxdb-cloud-demo-data).
- Create a destination bucket to write downsampled data to. For details, see [Create a bucket](/influxdb/cloud/organizations/buckets/create-bucket/).

## Downsample data with a notebook

1. Create a new notebook (see [Create a notebook](/influxdb/cloud/notebooks/create-notebook/)).
2. Add a **Metric Selector** cell to select a bucket to query data from:
  - In the **Choose a bucket** dropdown list, select **Website Monitoring Bucket**.
  - Select the **response_time** field.
  - Select the **mean** function from the aggregate selector in the upper-right.
3. Add a **Flux Script** cell with the following script to bring in data from the previous cell and downsample it:
  ```sh
  __PREVIOUS_RESULT__
    |> aggregateWindow(fn: mean, every: 1h)
  ```
  {{% note %}}
   If the `every` duration is longer the the total time range queried, aggregateWindow will only return one value.
  {{% /note %}}
4. Add an **Output to Bucket** cell, and then select the destination bucket for your downsampled data.
5. Add a **Markdown** cell to add a note to your team about what this notebook does. For example, the cell might say, "Downsample to one value per hour so we can do week-over-week performance. Sending data to downsample bucket."
5. Click **Preview** in the upper left to verify that your notebook runs and preview the output.
6. Run your notebook:
  - Click **Run** from the **Preview** dropdown list to run the notebook and write to the output bucket a single time.
  - To write continuously, click **Export as Task** in the upper right corner of the **Output to Bucket** cell. For details about working with tasks, see [Manage tasks](/influxdb/cloud/process-data/manage-tasks/).
