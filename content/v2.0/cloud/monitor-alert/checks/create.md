---
title: Create checks
seotitle: Create monitoring checks in InfluxDB
description: >
  Create a check in the InfluxDB UI.
menu:
  v2_0:
    parent: Manage checks
weight: 201
v2.0/tags: [monitor, checks, notifications]
---

Create a check in the InfluxDB user interface (UI).

## Create a check
1. To create a check in the InfluxDB UI, click **Monitoring & Alerting** in the sidebar.

    {{< nav-icon "alerts" >}}

2. In the top right corner of the **Checks** column, click **{{< icon "plus" >}} Create**.
   The check builder will appear.

3. Click **Name this check** in the top left corner of the check builder and provide
   a unique name for the check.

A check consists of two parts – a query and check logic.
The check builder provides separate views for configuring each.

{{< img-hd src="/img/2-0-monitor-check-builder-view-toggle.png" alt="Check builder view toggle" />}}

### Configure the query
The check query determines the specific dataset to monitor.
Each query requires a bucket, measurement, field, and an aggregate function.
You can narrow results further with tags, but they are not required.

{{% note %}}
The aggregate function uses data points recorded between check intervals to
calculate and return a single value for the check to process.
{{% /note %}}

1. In the **Query view**, select the bucket, measurement, field and any desired tag sets to query.
2. In the **Aggregate functions** column, select an interval from the interval dropdown
   (for example, "Every 5 minutes") and an aggregate function from the list of functions.
3. Click **Submit** to run the query and preview the results in the visualization pane.
   To see the raw query results, click the the **View Raw Data** toggle.

### Configure the check logic
A check adds a status to each data point based on defined conditions.
The status is stored in the `_level` column.
The following statuses or levels are available:

- `crit`
- `warn`
- `info`
- `note`

1.  In the **Properties** column, configure the following:

    ##### Schedule Every
    Schedule every sets the interval at which the check runs.
    _This and the aggregate function interval will always be the same._

    ##### Offset
    The offset delays the execution of a check to account for any late data.
    Although the query is delayed, it does not change the queried time range.

    {{% note %}}Your offset must be shorter than your [check interval](#schedule-every) or the check will not run.
    {{% /note %}}

    ##### Tags
    Add custom tags to the query output.
    These tags are unique to each check.

2.  In the **Status Message Template** column, configure the status message for the check.
    Use [Flux string interpolation](/v2.0/reference/flux/language/string-interpolation/)
    to populate the message with data from the query.
    Check data is represented as an object, `r`.
    Access specific column values using dot notation: `r.columnName`.

    Each check has access to data from the following columns:

    - all columns included in the query output
    - any [custom tags](#tags) added the query output
    - `_check_id`
    - `_check_name`
    - `_level`
    - `_source_measurement`
    - `_type`

3.  In the **Conditions** column, define the logic that assigns a status or level to data.
    There are two types of checks:

    #### Threshold
    A threshold check assigns a status based on a value being above, below,
    inside, or outside of defined thresholds.

    1.  Click a status to configure thresholds.
    2.  Use the dropdown to configure the kind of threshold to use.

        - is above
        - is below
        - is inside of
        - is outside of

    3.  Depending on the kind of threshold you select, one or two fields appear on the next line.
        Enter threshold values in each field or use the threshold sliders that appear
        in the data visualization to define threshold values.
    4.  Repeat for each status you want the check to assigns.
        You do not need to define logic for all statuses; only those you wish to use.

    #### Deadman
    A deadman check assigns a status to data when a series or group has not
    reported in a specified amount of time.

    1.  In the first field, enter a duration for the deadman check.
        Any series that have not reported within the specified duration are considered dead.
    2.  Use the dropdown to select a status to assign to a dead series.
    3.  In the last field, enter a duration after which if a series does not begin reporting again,
        the check no longer looks for that series.

After configuring your check query and logic, click the green **{{< icon "check" >}}**
in the top right corner to save the check.

## Clone a check
Create a new check by cloning an existing check.

1. In the **Checks** column, hover over the check you want to clone.
2. Click the **{{< icon "clone" >}}** icon, then **Clone**.
