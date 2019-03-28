---
title: Manage variables
description:
menu:
  v2_0:
    name:
weight: 1
#enterprise_all: true
#enterprise_some: true
#cloud_all: true
#cloud_some: true
"v2.0/tags": [variables]
---

Dashboard variables allow you to alter specific components of cells' queries
without having to edit the queries, making it easy to interact with your dashboard cells and explore your data.

Variables are scoped by organization.

## Create a variable in the InfluxDB UI

* will only take the first table in the output stream
* will only use values out of the `_value` column
* generally means you’d want to group everything into a single table (use group function, default is group_by ALL)
* if the data you’re looking for is in a column other than `_value`, than you want to rename that column to `_value`
* Flux doesn’t let you have unbound queries so you have to have a timeframe on a query (range function). want to keep your range fairly limited.
* you can’t use the predefined dashboard variables: time range start, stop, window. you can’t use those because they don’t exist in the context in which the query runs. only exist within the context of a dashboard.

### Create a variable in the Data Explorer

1. Click the **Data Explorer** icon in the sidebar.

  {{< nav-icon "data-explorer" >}}

2. Click **Script Editor** on the lower right.
3. Build the query for your variable using the [Table visualization type](v2.0/visualize-data/visualization-types/#table) or enable the **View Raw Data** option.
4. Click **Save As** in the upper right.
5. In the window that appears, select **Variable**.
6. Enter a name for your variable in the **Name** field.
7. Click **Create**.

### Create a variable in the Organizations page

1. Click the **Organizations** icon in the navigation bar.

  {{< nav-icon "orgs" >}}

2. Select an organization from the list.
3. Select the **Variables** tab.
4. Click **+Create Variable**.
5. Enter a name for your variable.
6. Enter your variable.
7. Click **Create**.

## Import a variable

1. Click the **Organizations** icon in the navigation bar.

  {{< nav-icon "orgs" >}}

2. Select an organization from the list.
3. Select the **Variables** tab.
4. Click the **+Create Variable** dropdown menu and select **Import Variable**.
3. In the window that appears:
  * Select **Upload File** to drag-and-drop or select a file.
  * Select **Paste JSON** to paste in JSON.
4. Select an organization from the **Destination Organization** dropdown.
5. Click **Import JSON as Variable**.


### Export a variable

1. Click the **Organizations** icon in the navigation bar.

  {{< nav-icon "orgs" >}}

2. Select an organization from the list.
3. Select the **Variables** tab.
4. Hover over a variable in the list, then click the gear icon ({{< icon "gear" >}}) and select **Export**.
3. Review the JSON in the window that appears.
4. Select one of the following options:
  * **Download JSON**: Download the dashboard as a JSON file.
  * **Save as template**: Save the JSON as a dashboard template.
  * **Copy to Clipboard**: Copy the JSON to your clipboard.




### Update a variable

1. Click the **Organizations** icon in the navigation bar.

  {{< nav-icon "orgs" >}}

2. Select an organization from the list.  
3. Select the **Variables** tab.
4. Click on a variable's name from the list.
5. Update the variable's name and query.
6. Click **Submit**.

### Delete a variable

1. Click in the **Organizations** icon in the navigation bar.

  {{< nav-icon "orgs" >}}

2. Select an organization from the list.
3. Select the **Variables** tab.
4. Hover over a variable and click the trash can icon.
