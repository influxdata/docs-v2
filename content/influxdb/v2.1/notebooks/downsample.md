---
title: Downsample data with notebooks
description: >
  Create a notebook to downsample data. Downsampling aggregates or summarizes data
  within specified time intervals, reducing the overall disk usage as data
  collects over time.
weight: 104
influxdb/v2.1/tags: [notebooks]
menu:
  influxdb_2_1:
    name: Downsample data
    identifier: notebooks-downsample
    parent: Notebooks
---

Create a notebook to downsample data. Downsampling aggregates or summarizes data
within specified time intervals, reducing the overall disk usage as data
collects over time.

The following example creates a notebook that queries **Coinbase bitcoin price
sample data** from the last hour, downsamples the data into ten minute summaries,
and then writes the downsampled data to an InfluxDB bucket.

1.  If you do not have an existing bucket to write the downsampled data to,
    [create a new bucket](/influxdb/v2.1/organizations/buckets/create-bucket/).
2.  [Create a new notebook](/influxdb/v2.1/notebooks/create-notebook/).
3.  Select **Past 1h** from the time range drop-down list at the top of your notebook.
4.  In the **Build a Query** cell:

    1.  In the **FROM** column under **{{% caps %}}Sample{{% /caps %}}**,
        select **Coinbase bitcoin price**.
    2.  In the next **FILTER** column, select **_measurement** from the drop-down list
        and select the **coindesk** measurement in the list of measurements.
    3.  In the next **FILTER** column, select **_field** from the drop-down list,
        and select the **price** field from the list of fields.
    4.  In the next **FILTER** column, select **code** from the drop-down list,
        and select a currency code.

5.  Click {{% icon "notebook-add-cell" %}} after your **Build a Query** cell to 
    add a new cell and select **{{% caps %}}Flux Script{{% /caps %}}**.

6.  In the Flux script cell:
    
    1.  Use `__PREVIOUS_RESULT__` to load the output of the previous notebook
        cell into the Flux script.
    2.  Use [`aggregateWindow()`](/{{< latest "flux" >}}/stdlib/universe/aggregatewindow/)
        to window data into ten minute intervals and return the average of each interval.
        Specify the following parameters:

        - **every**: Window interval _(should be less than or equal to the duration of the queried time range)_.
          For this example, use `10m`.
        - **fn**: [Aggregate](/{{< latest "flux" >}}/function-types/#aggregates)
          or [selector](/{{< latest "flux" >}}/function-types/#selectors) function
          to apply to each window.
          For this example, use `mean`.

    3.  {{% cloud-only %}}
        
        Use [`to()`](/{{< latest "flux">}}/stdlib/influxdata/influxdb/to/)
        to write the downsampled data back to an InfluxDB bucket.

        {{% /cloud-only %}}
    
    {{% oss-only %}}

    ```js
    __PREVIOUS_RESULT__
        |> aggregateWindow(every: 10m, fn: mean)
    ```
    {{% /oss-only %}}

    {{% cloud-only %}}

    ```js
    __PREVIOUS_RESULT__
        |> aggregateWindow(every: 10m, fn: mean)
        |> to(bucket: "example-bucket")
    ```
    {{% /cloud-only %}}

7.  {{% oss-only %}}
    
    Click {{% icon "notebook-add-cell" %}} after your **Flux Script** cell to 
    add a new cell and select **{{% caps %}}Output to Bucket{{% /caps %}}**.
    Select a bucket from the **{{% icon "bucket" %}} Choose a bucket**
    drop-down list. 

    {{% /oss-only %}}
    
8.  _(Optional)_ Click {{% icon "notebook-add-cell" %}} and select **Note** to
    add a note to describe your notebook, for example, 
 "Downsample Coinbase bitcoin prices into hourly averages."
9.  {{% oss-only %}}

    Click **Preview** in the upper left to verify that your notebook runs and displays the output.
    
    {{% /oss-only %}}
10. Click **Run** to run the notebook and write the downsampled data to your bucket.

## Continuously run a notebook
To continuously run your notebook, export the notebook as a task:

1.  Click {{% icon "notebook-add-cell" %}} to add a new cell, and then select
    **{{% caps %}}Task{{% /caps %}}**.
2.  Provide the following:

    - **Every**: Interval that the task should run at.
    - **Offset**: _(Optional)_ Time to wait after the defined interval to execute the task.
      This allows the task to capture late-arriving data.

3.  Click **{{% icon "export" %}} Export as Task**.
