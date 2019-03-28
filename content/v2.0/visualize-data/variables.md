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
* flux doesn’t let you have unbound queries so you have to have a timeframe on a query (range function). want to keep your range fairly limited.
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

2. Select the **Variables** tab.
3. Click **+Create Variable**.
4. Enter a name for your variable.
5. Enter your variable.
6. Click **Create**.

## Import a variable
1. Click the **Organizations** icon in the navigation bar.

  {{< nav-icon "orgs" >}}

2. Select an organization from the list.
3. Select the **Variables** tab.
4. 
4. Click the **+Create Variable** dropdown menu and select **Import Variable**.
5. Select

### Export a variable

1. Click the **Organizations** icon in the navigation bar.

  {{< nav-icon "orgs" >}}

2. Select the **Variables** tab.
3.



### Update a variable's name
1. Click the **Organizations** icon in the navigation bar.

  {{< nav-icon "orgs" >}}

2. Select the **Variables** tab.
3. Hover over a variable and click the pencil icon next to the variable's name.
4. Enter an updated name for the variable a

### Delete a variable
1. Click in the **Organizations** icon in the navigation bar.

  {{< nav-icon "orgs" >}}

2. Select the **Variables** tab.
3. Hover over a variable and click **Delete**.
