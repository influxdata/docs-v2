---
title: Normalize data with notebooks
description: >
  Clean, standardize, or normalize you data to make it easier to compare with other measurements.
weight: 104
influxdb/cloud/tags:
menu:
  influxdb_cloud:
    name: Normalize data with notebooks
    parent: Notebooks
---
{{% note %}}
**Notebooks is currently an early-access feature.**
[Submit a request](https://w2.influxdata.com/notebooks-early-access/) for early access, and we'll send you a confirmation notebooks is available in your account.
{{% /note %}}

Learn how to create a notebook that normalizes data. Walk through the following example to create a notebook that does the following:

- Inputs sample data from NOAA
- Normalizes sample data with a Flux script
- Outputs normalized data to a bucket

## Requirements
- This example uses [NOAA water database data](/influxdb/v2.0/reference/sample-data/#noaa-water-sample-data). Note that using this data counts towards your total usage.  
- Create a destination bucket to write normalized data to. For details, see [Create a bucket](/influxdb/cloud/organizations/buckets/create-bucket/).

## Normalize data with a notebook
1. Create a new notebook (see [Create a notebook](/influxdb/cloud/notebooks/create-notebook/)).
2. Add a **Metric Selector** cell to select a bucket to query data from:
  - In the **Choose a bucket** dropdown, select your NOAA bucket.
  - Select the **h2o_temperature** field.
  - Select the **mean** function from the aggregate selector in the upper-right.
3. Add a **Flux Transformation** cell with the following script to bring in data from the previous cell and normalize it:
  ```sh
  __PREVIOUS_RESULT__
    |> map(fn: (r) => ({ r with _value: float(v: r._value) / 10.0 }))
  ```
4. Add an **Output to Bucket** cell:
  - Select the destination bucket for your normalized data.
5. Add a **Markdown** cell to add a note to your team about what this notebook does. For example, the cell might say, "This notebook makes `h20_temperature` easier to view alongside `water_level`."
5. Click **Preview** in the upper left to verify that your notebook runs and preview the output.
6. Run your notebook:
  - Click **Run** to run the notebook and write to the output bucket a single time.
  - To write continuously, click **Export as Task** in the upper right corner of the **Output to Bucket** cell. For details about working with tasks, see [Manage tasks](/influxdb/cloud/process-data/manage-tasks/).
