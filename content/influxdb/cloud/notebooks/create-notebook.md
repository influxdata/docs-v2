---
title: Create a notebook
description: >
  Create a notebook to explore, visualize, and process your data.
weight: 102
influxdb/cloud/tags:
menu:
  influxdb_cloud:
    name: Create a notebook
    parent: Notebooks
---

1. In the navigation menu on the left, click **Notebooks**.

    {{< nav-icon "notebooks" >}}
2. Click **+Create Notebook**, then enter a name for your notebook in the **Name this notebook** field. By default, the notebook name appears as `<username>-notebook-<year>-<month>-<day and time>`. The notebook includes the following three cell types by default: **Metric Selector**, **Data Validation**, and **Visualization**. For more information about cell types, see [Overview of Notebooks](/influxdb/cloud/notebooks/overview/). 
3. Do the following at the top of the page: 
   - Select your local time zone or UTC. 
   - Choose a time range for your data. 
4. Click the **+** icon, and then add or more cells to your notebook:  

{{< tabs-wrapper >}}
{{% tabs %}}
[Input](#)
[Transform](#)
[Pass-through](#)
[Output](#)
 
<!-------------------------------- BEGIN Input -------------------------------->
{{% tab-content %}}

- Input cells are required for some other cells to run. 
- Select **Metric Builder** or **Query Builder** as your input, and then select your bucket to define your data source. Next, select filters to narrow your data.
- Select **Preview** or **Run** in the upper left dropdown menu. By default, Preview appears. 
  - Click **Preview** (or press **CTRL + Enter**) to preview the results of each cell in a raw data table without writing any data. 
  - Select **Run** to show the results of each cell and write it to the specified output bucket.

{{% /tab-content %}}
<!--------------------------------- END Input --------------------------------->
 
<!-------------------------------- BEGIN Transform-------------------------------->
{{% tab-content %}}

- Select one of the following transform cell-types: 
  - **Flux Script**: Use `__PREVIOUS_RESULT__` to build from data in the previous cell, enter a Flux script to transform your data. 
  - **Downsample**: Window data by time and apply an aggregate to each window to downsample data. (For more information, see [Downsample data with notebooks](/influxdb/cloud/notebooks/downsample/).)
- Select **Preview** or **Run** in the upper left dropdown menu. By default, Preview appears. 
  - Click **Preview** (or press **CTRL + Enter**) to preview the results of each cell in a raw data table without writing any data. 
  - Select **Run** to show the results of each cell and write it to the specified output bucket.

   {{% warn %}}
If your cell contains a custom script that uses any output function to write data to InfluxDB (the `to()` function) or send it to a 3rd party service, clicking **Preview** will write data.
    {{% /warn %}}
 
{{% /tab-content %}}
<!--------------------------------- END Transform--------------------------------->
 
<!------------------------------- BEGIN Pass-through------------------------------->
{{% tab-content %}}
 
- Select one of the following pass-through cell-types: 
  - **Column Editor**: Handle column visability and naming and requires an input cell to run. 
  - **Markdown**: Enter explanatory notes. 
  - **Visualization**: Create a visualization of your data and requires an input cell to run. For details on available visualization types and how to use them, see [Visualization types](/influxdb/cloud/visualize-data/visualization-types/).
 
{{% /tab-content %}}
<!-------------------------------- END Pass-through-------------------------------->
 
<!-------------------------------- BEGIN Output------------------------------->
{{% tab-content %}}
 
Select one of the following output cell-types: 

- To recieve an alert, select **Notification** and complete the steps below. 
- To write output to a bucket, select **Output to Bucket** and complete the steps below. 
- To create a task, select **Schedule** and complete the steps below. 

**Notification**

1. Enter a time range to automatically check the data and enter your query offset. 
2. Customize the conditions to send an alarm. 
3. Choose one of the following to recieve your alarms: 
   - Slack and a Slack Channel 
   - HTTP post 
   - Pager Duty
4. (Optional) Personalize your alarm message. By default, the message is "Notification Rule: ${ r._notification_rule_name } triggered by check: ${ r._check_name }: ${ r._message }." 
5. Click **Export as Task** to create your alarm. 

**Output to Bucket**

1. Select a bucket. 
2. Click **Preview** to see what would be written to the bucket without commiting, or click **Run** in the upper left to write, or select **Export as Task** to schedule your output as a task. 

**Schedule**

1. Enter a time and an offset to schedule the task. 
2. Click **Export as Task** to save. 
 
{{% /tab-content %}}
<!--------------------------------- END Output-------------------------------->

- The **Validate the data** cell can not be found in the cell selection. To view your input data in a raw data table format through the default cell, click **Preview** or **Run** on an input cell. 


 
 


