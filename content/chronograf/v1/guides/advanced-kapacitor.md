---
title: Advanced Kapacitor usage
description: >
  Use Kapacitor with Chronograf to manage alert history, TICKscripts, and Flux tasks.
menu:
  chronograf_v1:
    weight: 100
    parent: Guides
related:
  - /kapacitor/v1/introduction/getting-started/
  - /kapacitor/v1/working/kapa-and-chrono/
  - /kapacitor/v1/working/flux/

---

Chronograf provides a user interface for [Kapacitor](/kapacitor/v1/),
InfluxData's processing framework for creating alerts, running ETL jobs, and detecting anomalies in your data.
Learn how Kapacitor interacts with Chronograf.

- [Manage Kapacitor alerts](#manage-kapacitor-alerts)
- [Manage Kapacitor tasks](#manage-kapacitor-tasks)

## Manage Kapacitor alerts

Chronograf provides information about Kapacitor alerts on the Alert History page.
Chronograf writes Kapacitor alert data to InfluxDB as time series data.
It stores the data in the `alerts` [measurement](/influxdb/v1/concepts/glossary/#measurement)
in the `chronograf` database.
By default, this data is subject to an infinite [retention policy](/influxdb/v1/concepts/glossary/#retention-policy-rp) (RP).
If you expect to have a large number of alerts or do not want to store your alert
history forever, consider shortening the [duration](/influxdb/v1/concepts/glossary/#duration)
of the default retention policy.

### Modify the retention policy of the chronograf database

Use the Chronograf **Admin page** to modify the retention policy in the `chronograf` database.
In the Databases tab:

1.  Click **{{< icon "crown" "v2" >}} InfluxDB Admin** in the left navigation bar.
2.  Hover over the retention policy list of the `chronograf` database and click **Edit**
    next to the retention policy to update.
3.  Update the **Duration** of the retention policy.
    The minimum supported duration is one hour (`1h`) and the maximum is infinite (`INF` or `∞`).
    _See [supported duration units](/influxdb/v1/query_language/spec/#duration-units)._
4.  Click **Save**.


If you set the retention policy's duration to one hour (`1h`), InfluxDB
automatically deletes any alerts that occurred before the past hour.

## Manage Kapacitor tasks

- [Manage Kapacitor TICKscripts](#manage-kapacitor-tickscripts)
- [Manage Kapacitor Flux tasks](#manage-kapacitor-flux-tasks)

### Manage Kapacitor TICKscripts

Chronograf lets you view and manage all Kapacitor TICKscripts for a selected Kapacitor subscription using the **TICKscripts** page.  

1. To manage Kapacitor TICKscripts in Chronograf, click
**{{< icon "alert" "v2">}} Alerting** in the left navigation bar and select **TICKscripts**. 
Do one or more of the following:

    - View Kapacitor TICKscript tasks. You can view up to 100 TICKscripts at a time. If you have more than 100 TICKscripts, the list will be paginated at the bottom of the page. You can also filter your TICKscripts by name.  
    - View TICKscript task type.
    - Enable and disable TICKscript tasks.
    - Create new TICKscript tasks. 
    - Update TICKscript tasks.
    - Rename a TICKscript. Note, renaming a TICKscript updates the `var name` variable within the TICKscript.
    - Delete TICKscript tasks.
    - Create alerts using the Alert Rule Builder.  See [Configure Chronograf alert rules](/chronograf/v1/guides/create-alert-rules/#configure-chronograf-alert-rules).

2. Click **Exit** when finished.

### Manage Kapacitor Flux tasks
**Kapacitor 1.6+** supports Flux tasks.
Chronograf lets you view and manage Flux tasks for a selected Kapacitor subscription using the **Flux Tasks** page.  

To manage Kapacitor Flux tasks in Chronograf, click
**{{< icon "alert" "v2">}} Alerting** in the left navigation bar and select the **Flux Tasks** option. Do one or more of the following:

  - View and filter Kapacitor Flux tasks by name.
  - View Kapacitor Flux task activity.
  - Enable and disable Kapacitor Flux tasks.
  - Delete Kapacitor Flux tasks.

For more information on Flux tasks and Kapacitor see [Use Flux tasks with Kapacitor](/kapacitor/v1/working/flux/).