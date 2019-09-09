---
title: Update checks
seotitle: Update monitoring checks in InfluxDB
description: >
  Update, rename, enable or disable checks in the InfluxDB UI.
menu:
  v2_0:
    parent: Manage checks
weight: 203
v2.0/tags: [monitor, checks, notifications]
---

Update checks in the InfluxDB user interface (UI).
Common updates include:

- [Update check queries and logic](#update-check-queries-and-logic)
- [Enable or disable a check](#enable-or-disable-a-check)
- [Rename a check](#rename-a-check)
- [Add or update a check description](#add-or-update-a-check-description)
- [Add a label to a check](#add-a-label-to-a-check)

To update checks, click **Monitoring & Alerting** in the InfluxDB UI sidebar.

{{< nav-icon "alerts" >}}


## Update check queries and logic
1.  In the **Checks** column, click the name of the check you want to update.
    The check builder appears.
2. To edit the check query, click **1. Query** at the top of the check builder window.
3. To edit the check logic, click **2. Check** at the top of the check builder window.

_For details about using the check builder, see [Create checks](/v2.0/monitor-alert/checks/create/)._

## Enable or disable a check
In the **Checks** column, click the {{< icon "toggle" >}} toggle next to a check
to enable or disable it.

## Rename a check
1.  In the **Checks** column, hover over the name of the check you want to update.
2.  Click the **{{< icon "edit" >}}** icon that appears next to the check name.
2.  Enter a new name and click out of the name field or press enter to save.

_You can also rename a check in the [check builder](#update-check-queries-and-logic)._

## Add or update a check description
1.  In the **Checks** column, hover over the check description you want to update.
2.  Click the **{{< icon "edit" >}}** icon that appears next to the description.
2.  Enter a new description and click out of the name field or press enter to save.

## Add a label to a check
1.  In the **Checks** column, click **Add a label** next to the check you want to add a label to.
    The **Add Labels** box opens.
2.  To add an existing label, select the label from the list.
3.  To create and add a new label:
    - In the search field, enter the name of the new label. The **Create Label** box opens.
    - In the **Description** field, enter an optional description for the label.
    - Select a color for the label.
    - Click **Create Label**.
4.  To remove a label, hover over the label under to a rule and click **{{< icon "x" >}}**.
