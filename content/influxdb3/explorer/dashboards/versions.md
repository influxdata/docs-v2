---
title: Restore dashboards and versions
seotitle: Restore InfluxDB 3 Explorer dashboard versions and deleted dashboards
description: >
  Restore an earlier version of an InfluxDB 3 Explorer dashboard, and restore
  a deleted dashboard within 30 days.
menu:
  influxdb3_explorer:
    name: Versions and restore
    parent: Dashboards
weight: 103
metadata: [Explorer v1.12+]
related:
  - /influxdb3/explorer/dashboards/
---

## Restore an earlier version

Every change to a dashboard saves a version, and Explorer keeps the last 50.

1.  In the dashboard menu, select **Version history**.
2.  Click **View** to see a version, or **Restore** to go back to it.

A restore is saved as a new version, so you can undo it.
To describe a change in the history, add a **Version note** when you save.

If Explorer can't save a version, it keeps your change and tells you.

## Restore a deleted dashboard

Deleted dashboards stay in **Recently deleted** for 30 days.
On the **Dashboards** page, click **Recently deleted**, and then click
**Restore**.
