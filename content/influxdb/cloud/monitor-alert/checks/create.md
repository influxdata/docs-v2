---
title: Create checks
seotitle: Create monitoring checks in InfluxDB
description: >
  Create a check in the InfluxDB UI.
menu:
  influxdb_cloud:
    parent: Manage checks
weight: 201
related:
  - /influxdb/cloud/monitor-alert/notification-rules/
  - /influxdb/cloud/monitor-alert/notification-endpoints/
---

Create a check in the InfluxDB user interface (UI).
Checks query data and apply a status to each point based on specified conditions.

## Create a check in the InfluxDB UI
1. In the navigation menu on the left, select **Alerts**.

    {{< nav-icon "alerts" >}}

2.  Click **{{< icon "plus" >}} Create** and select the [type of check](#check-types) to create.
3.  Click **Name this check** in the top left corner and provide a unique name for the check.

#### Configure the check query
1.  Select the **bucket**, **measurement**, **field** and **tag sets** to query.
2.  If creating a threshold check, select an **aggregate function**.
    Aggregate functions aggregate data between the specified check intervals and
    return a single value for the check to process.

    In the **Aggregate functions** column, select an interval from the interval drop-down list
    (for example, "Every 5 minutes") and an aggregate function from the list of functions.

3. Click **Submit** to run the query and preview the results.
   To see the raw query results, click the **{{< icon "toggle" >}} View Raw Data** toggle.

#### Configure the check
1.  Click **2. Configure Check** near the top of the window.
2.  In the **Properties** column, configure the following:

    ##### Schedule Every
    Select the interval to run the check (for example, "Every 5 minutes").
    This interval matches the aggregate function interval for the check query.
    _Changing the interval here will update the aggregate function interval._

    ##### Offset
    Delay the execution of a task to account for any late data.
    Offset queries do not change the queried time range.

    {{% note %}}Your offset must be shorter than your [check interval](#schedule-every).
    {{% /note %}}

    ##### Tags
    Add custom tags to the query output.
    Each custom tag appends a new column to each row in the query output.
    The column label is the tag key and the column value is the tag value.

    Use custom tags to associate additional metadata with the check.
    Common metadata tags across different checks lets you easily group and organize checks.
    You can also use custom tags in [notification rules](/influxdb/cloud/monitor-alert/notification-rules/create/).

3.  In the **Status Message Template** column, enter the status message template for the check.
    Use [Flux string interpolation](/influxdb/cloud/reference/flux/language/string-interpolation/)
    to populate the message with data from the query.

    {{% note %}}
#### Flux only interpolates string values
Flux currently interpolates only string values.
Use the [string() function](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/string/)
to convert non-string values to strings.

```js
count = 12
"I currently have ${string(v: count)} cats."
```
    {{% /note %}}

    Check data is represented as a record, `r`.
    Access specific column values using dot notation: `r.columnName`.

    Use data from the following columns:

    - columns included in the query output
    - [custom tags](#tags) added to the query output
    - `_check_id`
    - `_check_name`
    - `_level`
    - `_source_measurement`
    - `_type`

    ###### Example status message template
    ```
    From ${r._check_name}:
    ${r._field} is ${r._level}.
    Its value is ${string(v: r.field_name)}.
    ```

    When a check generates a status, it stores the message in the `_message` column.

4.  Define check conditions that assign statuses to points.
    Condition options depend on your check type.

    ##### Configure a threshold check
    1.  In the **Thresholds** column, click the status name (CRIT, WARN, INFO, or OK)
        to define conditions for that specific status.
    2.  From the **When value** drop-down list, select a threshold: is above, is below,
        is inside of, is outside of.
    3.  Enter a value or values for the threshold.
        You can also use the threshold sliders in the data visualization to define threshold values.

    ##### Configure a deadman check
    1.  In the **Deadman** column, enter a duration for the deadman check in the **for** field.
        For example, `90s`, `5m`, `2h30m`, etc.
    2.  Use the **set status to** drop-down list to select a status to set on a dead series.
    3.  In the **And stop checking after** field, enter the time to stop monitoring the series.
        For example, `30m`, `2h`, `3h15m`, etc.

5. Click the green **{{< icon "check" >}}** in the top right corner to save the check.

## Clone a check
Create a new check by cloning an existing check.

1. In the **Checks** column, hover over the check you want to clone.
2. Click the **{{< icon "clone" >}}** icon, then **Clone**.
