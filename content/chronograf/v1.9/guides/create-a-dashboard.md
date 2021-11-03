---
title: Create Chronograf dashboards
description: Visualize your data with custom Chronograf dashboards.
menu:
  chronograf_1_9:
    name: Create dashboards
    weight: 30
    parent: Guides
---

Chronograf offers a complete dashboard solution for visualizing your data and monitoring your infrastructure:

- View [pre-created dashboards](/chronograf/v1.9/guides/using-precreated-dashboards) from the Host List page.
  Dashboards are available depending on which Telegraf input plugins you have enabled.
  These pre-created dashboards cannot be cloned or edited.
- Create custom dashboards from scratch by building queries in the Data Explorer, as described [below](#build-a-dashboard).
- [Export a dashboard](/chronograf/latest/administration/import-export-dashboards/#export-a-dashboard) you create.
- Import a dashboard:
    - When you want to [import an exported dashboard](/chronograf/latest/administration/import-export-dashboards/#import-a-dashboard).
    - When you want to add or update a connection in Chronograf. See [Dashboard templates](#dashboard-templates) for details.

By the end of this guide, you'll be aware of the tools available to you for creating dashboards similar to this example:

![Chronograf dashboard](/img/chronograf/1-6-g-dashboard-possibilities.png)

## Requirements

To perform the tasks in this guide, you must have a working Chronograf instance that is connected to an InfluxDB source.
Data is accessed using the Telegraf [system ](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/system) input plugins.
For more information, see [Configuring Chronograf](/chronograf/v1.9/administration/configuration).

## Build a dashboard

1.  #### Create a new dashboard
    Click **Dashboards** in the navigation bar and then click the **{{< icon "plus" >}} Create Dashboard** button.
    A new dashboard is created and ready to begin adding cells.

2.  #### Name your dashboard
    Click **Name This Dashboard** and type a new name. For example, "ChronoDash".

3.  #### Enter cell editor mode
    In the first cell, titled "Untitled Cell", click **{{< icon "plus" >}} Add Data**
    to open the cell editor mode.

    {{< img-hd src="/img/chronograf/1-9-dashboard-cell-add-data.png" alt="Add data to a Chronograf cell" />}}

4.  #### Create your query
    Click the **Add a Query** button to create an [InfluxQL](/{{< latest "influxdb" "v1" >}}/query_language/) query.
    In query editor mode, use the builder to select from your existing data and
    allow Chronograf to format the query for you.
    Alternatively, manually enter and edit a query.
    Chronograf allows you to move seamlessly between using the builder and
    manually editing the query; when possible, the interface automatically
    populates the builder with the information from your raw query.

    For our example, the query builder is used to generate a query that shows
    the average idle CPU usage grouped by host (in this case, there are three hosts).
    By default, Chronograf applies the [`MEAN()` function](/{{< latest "influxdb" "v1" >}}/query_language/functions/#mean)
    to the data, groups averages into auto-generated time intervals (`:interval:`),
    and shows data for the past hour (`:dashboardTime:`).
    Those defaults are configurable using the query builder or by manually editing the query.

    In addition, the time range (`:dashboardTime:` and `:upperDashboardTime:`) are
    [configurable on the dashboard](#configure-your-dashboard).

    ![Build your query](/img/chronograf/1-6-g-dashboard-builder.png)

5.  #### Choose your visualization type
    Chronograf supports many different [visualization types](/chronograf/v1.9/guides/visualization-types/). To choose a visualization type, click **Visualization** and select **Step-Plot Graph**.

    ![Visualization type](/img/chronograf/1-6-g-dashboard-visualization.png)

6.  #### Save your cell

    Click **Save** (the green checkmark icon) to save your cell.

    {{% note %}}
_**Note:**_ If you navigate away from this page without clicking Save, your work will not be saved.
    {{% /note %}}

## Configure your dashboard

### Customize cells

- You can change the name of the cell from "Untitled Cell" by returning to the cell editor mode, clicking on the name, and renaming it. Remember to save your changes.
- **Move** your cell around by clicking its top bar and dragging it around the page
- **Resize** your cell by clicking and dragging its bottom right corner

### Explore cell data

- **Zoom** in on your cell by clicking and dragging your mouse over the area of interest
- **Pan** over your cell data by pressing the shift key and clicking and dragging your mouse over the graph
- **Reset** your cell by double-clicking your mouse in the cell window

{{% note %}}
**Note:** These tips only apply to the line, stacked, step-plot, and line+stat
[visualization types](/chronograf/v1.9/guides/visualization-types/).
{{% /note %}}

### Configure dashboard-wide settings

- Change the dashboard's *selected time* at the top of the page - the default
  time is **Local**, which uses your browser's local time. Select **UTC** to use
  Coordinated Universal Time.

    {{% note %}}
**Note:** If your organization spans multiple time zones, we recommend using UTC
(Coordinated Universal Time) to ensure that everyone sees metrics and events for the same time.
    {{% /note %}}

- Change the dashboard's *auto-refresh interval* at the top of the page - the default interval selected is **Every 10 seconds**.

    {{% note %}}
**Note:** A dashboard's refresh rate persists in local storage, so the default
refresh rate is only used when a refresh rate isn't found in local storage.
    {{% /note %}}

    {{% note %}}
**To add custom auto-refresh intervals**, use the [`--custom-auto-refresh` configuration
option](/chronograf/v1.9/administration/config-options/#--custom-auto-refresh)
or `$CUSTOM_AUTO_REFRESH` environment variable when starting Chronograf.
    {{% /note %}}

- Modify the dashboard's *time range* at the top of the page - the default range
  is **Past 15 minutes**.

## Dashboard templates

Select from a variety of dashboard templates to import and customize based on which Telegraf plugins you have enabled, such as the following examples:

###### Kubernetes dashboard template
{{< img-hd src="/img/chronograf/1-7-protoboard-kubernetes.png" alt="Kubernetes Chronograf dashboard template" />}}

###### MySQL dashboard template
{{< img-hd src="/img/chronograf/1-7-protoboard-mysql.png" alt="MySQL Chronograf dashboard template" />}}

###### System metrics dashboard template
{{< img-hd src="/img/chronograf/1-7-protoboard-system.png" alt="System metrics Chronograf dashboard template" />}}

###### vSphere dashboard template
{{< img-hd src="/img/chronograf/1-7-protoboard-vsphere.png" alt="vSphere Chronograf dashboard template" />}}

### Import dashboard templates

1. From the Configuration page, click **Add Connection** or select an existing connection to edit it.
2. In the **InfluxDB Connection** window, enter or verify your connection details and click **Add** or **Update Connection**.
3. In the **Dashboards** window, select from the available dashboard templates to import based on which Telegraf plugins you have enabled.
    
    {{< img-hd src="/img/chronograf/1-7-protoboard-select.png" alt="Select dashboard template" />}}

4. Click **Create (x) Dashboards**.
5. Edit, clone, or configure the dashboards as needed.

## Extra Tips

### Full screen mode

View your dashboard in full screen mode by clicking on the full screen icon (**{{< icon "fullscreen" >}}**) in the top right corner of your dashboard.
To exit full screen mode, press the Esc key.

### Template variables

Dashboards support template variables.
See the [Dashboard Template Variables](/chronograf/v1.9/guides/dashboard-template-variables/) guide for more information.
