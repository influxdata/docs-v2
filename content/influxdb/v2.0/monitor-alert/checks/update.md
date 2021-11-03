---
title: Update checks
seotitle: Update monitoring checks in InfluxDB
description: >
  Update, rename, enable or disable checks in the InfluxDB UI.
menu:
  influxdb_2_0:
    parent: Manage checks
weight: 203
related:
  - /influxdb/v2.0/monitor-alert/notification-rules/
  - /influxdb/v2.0/monitor-alert/notification-endpoints/
---

Update checks in the InfluxDB user interface (UI).
Common updates include:

- [Update check queries and logic](#update-check-queries-and-logic)
- [Enable or disable a check](#enable-or-disable-a-check)
- [Rename a check](#rename-a-check)
- [Add or update a check description](#add-or-update-a-check-description)
- [Add a label to a check](#add-a-label-to-a-check)

To update checks, select **Alerts** in the navigation menu on the left.

{{< nav-icon "alerts" >}}


## Update check queries and logic
1. Click the name of the check you want to update. The check builder appears.
2. To edit the check query, click **1. Define Query** at the top of the check builder window.
3. To edit the check logic, click **2. Configure Check** at the top of the check builder window.

_For details about using the check builder, see [Create checks](/influxdb/v2.0/monitor-alert/checks/create/)._

## Enable or disable a check
Click the {{< icon "toggle" "v2" >}} toggle next to a check to enable or disable it.

## Rename a check
1.  Hover over the name of the check you want to update.
2.  Click the **{{< icon "edit" "v2" >}}** icon that appears next to the check name.
2.  Enter a new name and click out of the name field or press enter to save.

_You can also rename a check in the [check builder](#update-check-queries-and-logic)._

## Add or update a check description
1.  Hover over the check description you want to update.
2.  Click the **{{< icon "edit" "v2" >}}** icon that appears next to the description.
2.  Enter a new description and click out of the name field or press enter to save.

## Add a label to a check
1.  Click **Add a label** next to the check you want to add a label to.
    The **Add Labels** box opens.
2.  To add an existing label, select the label from the list.
3.  To create and add a new label:
    - In the search field, enter the name of the new label. The **Create Label** box opens.
    - In the **Description** field, enter an optional description for the label.
    - Select a color for the label.
    - Click **Create Label**.
4.  To remove a label, hover over the label under to a rule and click **{{< icon "x" "v2" >}}**.
