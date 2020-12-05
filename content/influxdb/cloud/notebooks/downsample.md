---
title: Downsample data with notebooks
description:
weight: 102
influxdb/v2.0/tags:
menu:
  influxdb_2_0:
    name: Downsample data with notebooks
    parent: Notebooks
---
{{% note %}}
**Notebooks is currently an early access feature.**
[Submit a request](https://w2.influxdata.com/notebooks-early-access/ ) to be added to the queue, and we will send you a confirmation when you’ve been added to early access.
{{% /note %}}

Downsample data to reduce the overall disk usage as data collects over time. This example walks through creating a notebook that downsamples data by aggregating data within windows of time, then storing the aggregate value in a new bucket.

## Requirements

- This example uses [InfluxDB Cloud demo data](/influxdb/cloud/reference/sample-data/#influxdb-cloud-demo-data).
- Create a destination bucket to write downsampled data to. For details, see [Create a bucket](/influxdb/cloud/organizations/buckets/create-bucket/).

## Downsample data with a notebook

1. Create a new notebook (see [Create a notebook](/influxdb/cloud/notebooks/create-notebook/).
2. Add a **Metric Selector** cell to select a bucket to query data from:
  - In the **Choose a bucket** dropdown, select **Website Monitoring Bucket**.
  - Select the **response_time** field.
  - Select the **mean** function from the aggregate selector in the upper-right.
3. Add a **Flux Transformation** cell with the following script to bring in data from the previous cell and downsample it:
  ```sh
  __PREVIOUS_RESULT__
    |> aggregateWindow(fn: mean, every: 1h)
  ```
4. Add an **Output to Bucket** cell:
  - Select the destination bucket for your downsampled data.
5. Add a **Markdown** cell to add a note to your team about what this notebook does. For example, the cell might say, "Downsample to one value per hour so we can do week-over-week performance. Sending data to downsample bucket."
5. Click **Preview** in the upper left to verify that your notebook runs and preview the output.
6. Run your notebook:
  - Click **Run** to run the notebook and write to the output bucket a single time.
  - To write continuously, click **Export as Task** in the upper right corner of the **Output to Bucket** cell. For details about working with tasks, see [Manage tasks](/influxdb/cloud/process-data/manage-tasks/)
