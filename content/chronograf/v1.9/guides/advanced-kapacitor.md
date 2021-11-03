---
title: Advanced Kapacitor usage
description: >
  Use Kapacitor with Chronograf to manage alert history, TICKscripts, and Flux tasks.
menu:
  chronograf_1_9:
    weight: 100
    parent: Guides
related:
  - /{{< latest "kapacitor" >}}/working/flux/
---

Chronograf provides a user interface for [Kapacitor](/{{< latest "kapacitor" >}}/),
InfluxData's processing framework for creating alerts, running ETL jobs, and detecting anomalies in your data.
Learn how Kapacitor interacts with Chronograf.

- [Manage Kapacitor alerts](#manage-kapacitor-alerts)
- [Manage Kapacitor tasks](#manage-kapacitor-tasks)

## Manage Kapacitor alerts

Chronograf provides information about Kapacitor alerts on the Alert History page.
Chronograf writes Kapacitor alert data to InfluxDB as time series data.
It stores the data in the `alerts` [measurement](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#measurement)
in the `chronograf` database.
By default, this data is subject to an infinite [retention policy](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#retention-policy-rp) (RP).
If you expect to have a large number of alerts or do not want to store your alert
history forever, consider shortening the [duration](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#duration)
of the default retention policy.

### Modify the retention policy of the chronograf database

Use the Chronograf **Admin page** to modify the retention policy in the `chronograf` database.
In the Databases tab:

1.  Click **{{< icon "crown" "v2" >}} InfluxDB Admin** in the left navigation bar.
2.  Hover over the retention policy list of the `chronograf` database and click **Edit**
    next to the retention policy to update.
3.  Update the **Duration** of the retention policy.
    The minimum supported duration is one hour (`1h`) and the maximum is infinite (`INF` or `∞`).
    _See [supported duration units](/{{< latest "influxdb" "v1" >}}/query_language/spec/#duration-units)._
4.  Click **Save**.

If you set the retention policy's duration to one hour (`1h`), InfluxDB
automatically deletes any alerts that occurred before the past hour.

## Manage Kapacitor tasks

- [Manage Kapacitor TICKscripts](#manage-kapacitor-tickscripts)
- [Manage Kapacitor Flux tasks](#manage-kapacitor-flux-tasks)

### Manage Kapacitor TICKscripts

Chronograf lets you manage Kapacitor TICKscript tasks created in Kapacitor or in
Chronograf when [creating a Chronograf alert rule](/chronograf/v1.9/guides/create-alert-rules/).

To manage Kapacitor TICKscript tasks in Chronograf, click
**{{< icon "alert">}} Alerts** in the left navigation bar.
On this page, you can:

- View Kapacitor TICKscript tasks.
- View TICKscript task activity.
- Create new TICKscript tasks.
- Update TICKscript tasks.
- Enable and disable TICKscript tasks.
- Delete TICKscript tasks.

### Manage Kapacitor Flux tasks
**Kapacitor 1.6+** supports Flux tasks.
Chronograf lets you view and manage [Kapacitor Flux tasks](/{{< latest "kapacitor" >}}/working/flux/).

To manage Kapacitor Flux tasks in Chronograf, click
**{{< icon "alert">}} Alerts** in the left navigation bar.
On this page, you can:

- View Kapacitor Flux tasks.
- View Kapacitor Flux task activity.
- Enable and disable Kapacitor Flux tasks.
- Delete Kapacitor Flux tasks.
