---
title: Variables
description: This is just an example post to show the format of new 2.0 posts
menu:
  v2_0:
    name: Example post
weight: 1
#enterprise_all: true
enterprise_some: true
cloud_all: true
#cloud_some: true
draft: true
"v2.0/tags": [influxdb]
---

Dashboard variables allow you to alter specific components of cells' queries
without having to edit the queries, making it easy to interact with your dashboard cells and explore your data.

## Manage variables

Template variables are used in cell queries and titles when creating dashboards.
Within the query, variables are referenced by surrounding the variable name with colons (`:`).


** insert example here**

Variables are scoped by organization.

### Create a variable
1. Click in the **Organizations** icon in the navigation bar.

  {{< nav-icon "orgs" >}}

2. Select the **Variables** tab.
3. Click **+Create Variable**.
4. Enter a name for your variable.
5. Enter your variable.
6. Click **Create**.

### Import a variable
1. Click in the **Organizations** icon in the navigation bar.

  {{< nav-icon "orgs" >}}

2. Select the **Variables** tab.
3. Click the **+Create Variable** dropdown menu and select **Import Variable**.
4. ?? Nothing happens


### Update a variable's name
1. Click in the **Organizations** icon in the navigation bar.

  {{< nav-icon "orgs" >}}

2. Select the **Variables** tab.
3. Hover over a variable and click the pencil icon next to the variable's name.
4. Enter an updated name for the variable a

### Delete a variable
1. Click in the **Organizations** icon in the navigation bar.

  {{< nav-icon "orgs" >}}

2. Select the **Variables** tab.
3. Hover over a variable and click **Delete**.


## Predefined template variables
Chronograf includes predefined template variables controlled by elements in the Chrongraf UI.
These template variables can be used in any of your cells' queries.

[`:dashboardTime:`](#dashboardtime)  
[`:upperDashboardTime:`](#upperdashboardtime)  
[`:interval:`](#interval)

### dashboardTime
The `:dashboardTime:` template variable is controlled by the "time" dropdown in your Chronograf dashboard.

<img src="/img/chronograf/v1.7/template-vars-time-dropdown.png" style="width:100%;max-width:549px;" alt="Dashboard time selector"/>

If using relative times, it represents the time offset specified in the dropdown (-5m, -15m, -30m, etc.) and assumes time is relative to "now".
If using absolute times defined by the date picker, `:dashboardTime:` is populated with lower threshold.

```sql
SELECT "usage_system" AS "System CPU Usage"
FROM "telegraf".."cpu"
WHERE time > :dashboardTime:
```

> In order to use the date picker to specify a particular time range in the past
> which does not include "now", the query should be constructed using `:dashboardTime:`
> as the lower limit and [`:upperDashboardTime:`](#upperdashboardtime) as the upper limit.

### upperDashboardTime
The `:upperDashboardTime:` template variable is defined by the upper time limit specified using the date picker.

<img src="/img/chronograf/v1.7/template-vars-date-picker.png" style="width:100%;max-width:762px;" alt="Dashboard date picker"/>

It will inherit `now()` when using relative time frames or the upper time limit when using absolute timeframes.

```sql
SELECT "usage_system" AS "System CPU Usage"
FROM "telegraf".."cpu"
WHERE time > :dashboardTime: AND time < :upperDashboardTime:
```

### interval
The `:interval:` template variable is defined by the interval dropdown in the Chronograf dashboard.

<img src="/img/chronograf/v1.7/template-vars-interval-dropdown.png" style="width:100%;max-width:549px;" alt="Dashboard interval selector"/>

In cell queries, it should be used in the `GROUP BY time()` clause that accompanies aggregate functions:

```sql
SELECT mean("usage_system") AS "Average System CPU Usage"
FROM "telegraf".."cpu"
WHERE time > :dashboardtime:
GROUP BY time(:interval:)
```


## Create custom template variables
Template variables are essentially an array of potential values used to populate parts of your cells' queries.
Chronograf lets you create custom template variables powered by meta queries or CSV uploads that return an array of possible values.

To create a template variable:

1. Click on **Template Variables** at the top of your dashboard, then **+ Add Variable**.
2. Provide a name for the variable.
3. Select the [variable type](#template-variable-types).
   The type defines the method for retrieving the array of possible values.
4. View the list of potential values and select a default.
   If using the CSV or Map types, upload or input the CSV with the desired values in the appropriate format then select a default value.
5. Click **Create**.

![Create a template variable](/img/chronograf/v1.7/template-vars-create.gif)

Once created, the template variable can be used in any of your cell's queries or titles
and a dropdown for the variable will be included at the top of your dashboard.


```
