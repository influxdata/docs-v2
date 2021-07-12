---
title: Downsample data with notebooks
description: >
  Downsample data to reduce overall disk usage as data collects over time.
weight: 104
influxdb/cloud/tags:
menu:
  influxdb_cloud:
    name: Downsample data with notebooks
    parent: Notebooks
---

Downsample data to reduce the overall disk usage as data collects over time.
Learn how to create a notebook that downsamples data—walk through the following example to create a notebook that does the following:

- Inputs InfluxDB Cloud demo data from the Website Monitoring Bucket
- Downsamples data by aggregating data within windows of time with a Flux script
- Outputs downsampled data to a bucket

{{< youtube 0lS7n47kZog >}}

## Requirements

- This example uses [InfluxDB Cloud demo data](/influxdb/cloud/reference/sample-data/#influxdb-cloud-demo-data).
- Create a destination bucket to write downsampled data to. For details, see [Create a bucket](/influxdb/cloud/organizations/buckets/create-bucket/).

## Downsample data with a notebook

1. Create a new notebook (see [Create a notebook](/influxdb/cloud/notebooks/create-notebook/)).
2. Add a **Metric Selector** cell to select a bucket to query data from:
  - In the **Choose a bucket** dropdown list, select **Website Monitoring Bucket**.
  - Select the **response_time** field.
  - Select the **mean** function from the aggregate selector in the upper-right.
3. Add a **Downsample** cell to bring in data from the previous cell and downsample it.
  - Select an aggregate function from the **Apply aggregate** dropdown menu.
  - Enter a window period. 
4. Add an **Output to Bucket** cell, and then select the destination bucket for your downsampled data.
5. Add a **Markdown** cell to add a note to your team about what this notebook does. For example, the cell might say, "Downsample to one value per hour so we can do week-over-week performance. Sending data to downsample bucket."
6. Click **Preview** in the upper left to verify that your notebook runs and preview the output.
7. Run your notebook:
  - Click **Run** from the **Preview** dropdown list to run the notebook and write to the output bucket a single time.
  - To write continuously, click **Export as Task** in the upper right corner of the **Output to Bucket** cell. For details about working with tasks, see [Manage tasks](/influxdb/cloud/process-data/manage-tasks/).
