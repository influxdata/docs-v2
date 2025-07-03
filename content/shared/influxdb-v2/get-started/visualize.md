
There are many tools you can use to visualize your time series data including the
InfluxDB user interface (UI), [Chronograf](/influxdb/version/tools/chronograf/), and
[Grafana](/influxdb/version/tools/grafana/).
This tutorial walks you through using the **InfluxDB UI** to create a simple dashboard.

Dashboards are a powerful way of displaying time series data and can help to
identify trends and anomalies. A dashboard is comprised of one or more
dashboard cells. A **dashboard cell** visualizes the results of a query using
one of the available [visualization types](/influxdb/version/visualize-data/visualization-types/).

- [Create a dashboard](#create-a-dashboard)
- [Create dashboard cells](#create-dashboard-cells)
- [Create and use dashboard variables](#create-and-use-dashboard-variables)
  - [Create a custom dashboard variable](#create-a-custom-dashboard-variable)
  - [Use a custom dashboard variable](#use-a-custom-dashboard-variable)

## Create a dashboard

1.  With InfluxDB running, visit [localhost:8086](http://localhost:8086) in your
    browser to access the InfluxDB UI.
2.  Log in and select **Dashboards** in the left navigation bar.

    {{< nav-icon "dashboards" >}}

3.  Click **+ {{% caps %}}Create Dashboard{{% /caps %}}** and select **New Dashboard**.
4.  Click _**Name this Dashboard**_ and provide a name for the dashboard.
    For this tutorial, we'll use **"Getting Started Dashboard"**.

## Create dashboard cells

With your new dashboard created and named, add a new dashboard cell:

1.  Click **{{< icon "add-cell" >}} {{% caps %}}Add Cell{{% /caps %}}**.
2.  Click _**Name this Cell**_ and provide a name for the cell.
    For this tutorial, we'll use **"Room temperature"**.
3.  _(Optional)_ Select the visualization type from the visualization drop-down menu.
    There are many different [visualization types](/influxdb/version/visualize-data/visualization-types/)
    available.
    For this tutorial, use the default **Graph** visualization.
4.  Use the query time range selector to select an absolute time range that
    covers includes the time range of the
    [data written in "Get started writing to InfluxDB"](/influxdb/version/get-started/write/#view-the-written-data):
    **2022-01-01T08:00:00Z** to **2022-01-01T20:00:01Z**.

    1.  The query time range selector defaults to querying data from the last hour
        (**{{< icon "clock" >}} Past 1h**).
        Click the time range selector drop-down menu and select **Custom Time Range**.

        {{< expand-wrapper >}}
        {{% expand "View time range selector" %}}
{{< img-hd src="/img/influxdb/2-4-get-started-visualize-time-range.png" alt="InfluxDB time range selector" />}}
        {{% /expand %}}
        {{< /expand-wrapper >}}

    2.  Use the date picker to select the stop and stop date and time or manually
        enter the following start and stop times:

        - **Start**: 2022-01-01 08:00:00
        - **Stop**: 2022-01-01 20:00:01

    3. Click **{{% caps %}}Apply Time Range{{% /caps %}}**.

5.  Use the **Query Builder** to select the measurement, fields, and tags to query:

    1. In the **{{% caps %}}From{{% /caps %}}** column, select the **get-started** bucket.
    2. In the **Filter** column, select the **home** measurement.
    3. In the next **Filter** column, select the **temp** field.
    4. In the next **Filter** column, select the **room** tag and the **Kitchen** tag value.

6.  Click **{{% caps %}}Submit{{% /caps %}}** to run the query and visualize the
    results.

    {{< img-hd src="/img/influxdb/2-4-get-started-visualize-query-builder.png" alt="InfluxDB Query Builder" />}}

7. Click **{{< icon "check" >}}** to save the cell and return to the dashboard.

## Create and use dashboard variables

InfluxDB dashboard cells use **dashboard variables** to dynamically change
specific parts of cell queries.
The query builder automatically builds queries using the following
[predefined dashboard variables](/influxdb/version/visualize-data/variables/#predefined-dashboard-variables),
each controlled by selections in your dashboard:

- `v.timeRangeStart`: Start time of the queried time range specified by the time range selector.
- `v.timeRangeStop`: Stop time of the queried time range specified by the time range selector.
- `v.windowPeriod`: Window period used downsample data to one point per pixel in
  a cell visualization. The value of this variable is determined by the pixel-width of the cell.

### Create a custom dashboard variable

Let's create a custom dashboard variable that we can use to change the field
displayed by your dashboard cell.

1.  Select **Settings > Variables** in the left navigation bar.

    {{< nav-icon "settings" >}}

2.  Click **+ {{% caps %}}Create Variable{{% /caps %}}** and select **New Variable**.
3.  Name your variable. For this tutorial, name the variable, **"room"**.
4.  Select the default **Query** dashboard variable type.
    This variable type uses the results of a query to populate the list of potential
    variable values. _For information about the other dashboard variable types,
    see [Variable types](/influxdb/version/visualize-data/variables/variable-types/)._
5.  Enter the following Flux query to return all the different `room` tag values
    in your `get-started` bucket from the [Unix epoch](/influxdb/version/reference/glossary/#unix-timestamp).

    ```js
    import "influxdata/influxdb/schema"

    schema.tagValues(bucket: "get-started", tag: "room", start: time(v: 0))
    ```

6. Click **{{% caps %}}Create Variable{{% /caps %}}**.

### Use a custom dashboard variable

1.  Navigate to your **Getting Started Dashboard** by clicking **Dashboards** in
    the left navigation bar and the clicking on the name of your dashboard.

    {{< nav-icon "dashboards" >}}

2.  Click the **{{< icon "gear" >}}** on the **Room temperature** cell and select
    **{{< icon "pencil" >}} Configure**.
3.  Click **{{% caps %}}Script Editor{{% /caps %}}** to edit the Flux query
    directly.
4.  On line 5 of the Flux query, replace `"Kitchen"` with `v.room` to use the
    selected value of the `room` dashboard variable.

    ```js
    from(bucket: "get-started")
      |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
      |> filter(fn: (r) => r["_measurement"] == "home")
      |> filter(fn: (r) => r["_field"] == "temp")
      |> filter(fn: (r) => r["room"] == v.room)
      |> aggregateWindow(every: v.windowPeriod, fn: mean, createEmpty: false)
      |> yield(name: "mean")
    ```
5.  Click **{{< icon "check" >}}** to save the cell and return to the dashboard.
6.  Refresh the browser to reload the dashboard.
7.  Use the **room variable** drop-down menu to select the room to display
    recorded temperatures from.

    {{< img-hd src="/img/influxdb/2-4-get-started-visualize-variable-select.png" alt="InfluxDB dashboard variable selection" />}}

_For more information about creating custom dashboard variables, see
[Use and manage dashboard variables](/influxdb/version/visualize-data/variables/)._

{{< page-nav prev="/influxdb/version/get-started/process/" >}}

---

## Congratulations!

You have walked through the
[basics of setting up, writing, querying, processing, and visualizing](/influxdb/version/get-started/)
data with InfluxDB {{< current-version >}}.
Feel free to dive in deeper to each of these topics:

- [Write data to InfluxDB](/influxdb/version/write-data/)
- [Query data in InfluxDB](/influxdb/version/query-data/)
- [Process data with InfluxDB](/influxdb/version/process-data/)
- [Visualize data with the InfluxDB UI](/influxdb/version/visualize-data/)

