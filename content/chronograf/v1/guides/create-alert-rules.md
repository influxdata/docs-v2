---
title: Create Chronograf alert rules
description: >
  Trigger alerts by building Kapacitor alert rules in the Chronograf user interface (UI).
aliases:
  - /chronograf/v1/guides/create-a-kapacitor-alert/
menu:
  chronograf_v1:
    name: Create alert rules
    weight: 60
    parent: Guides
---


Chronograf provides a user interface for [Kapacitor](/kapacitor/v1/), InfluxData's processing framework for creating alerts, ETL jobs (running extract, transform, load), and detecting anomalies in your data.
Chronograf alert rules correspond to Kapacitor tasks that trigger alerts whenever certain conditions are met.
Behind the scenes, these tasks are stored as [TICKscripts](/kapacitor/v1/tick/) that can be edited manually or through Chronograf.
Common alerting use cases that can be managed using Chronograf include:

* Thresholds with static ceilings, floors, and ranges.
* Relative thresholds based on unit or percentage changes.
* Deadman switches.

Complex alerts and other tasks can be defined directly in Kapacitor as TICKscripts, but can be viewed and managed within Chronograf.
To learn about managing Kapacitor TICKscripts in Chronograf, see [Manage Kapacitor TICKscripts](/chronograf/v1/guides/advanced-kapacitor/#manage-kapacitor-tickscripts).

## Requirements

[Get started with Chronograf](/chronograf/v1/introduction/getting-started/) offers step-by-step instructions for each of the following requirements:

* Download and install the entire TICKstack (Telegraf, InfluxDB, Chronograf, and Kapacitor).
* [Create a Kapacitor connection in Chronograf](/chronograf/v1/introduction/installation/#connect-chronograf-to-kapacitor).

## Manage Chronograf alert rules

Chronograf lets you create and manage Kapacitor alert rules. To manage alert rules:

1. Click on  **{{< icon "alert" "v2">}} Alerting** in the left navigation bar and select **Alert Rules**.
2. Do one of the following:
    - [Create an alert rule](#create-an-alert-rule)
    - [View alert history](#view-alert-history)
    - [Enable and disable alert rules](#enable-and-disable-alert-rules)
    - [Delete alert rules](#delete-alert-rules)

To create and manage alert rules in Chronograf, click on
**{{< icon "alert" "v2">}} Alerting** in the left navigation bar and select **Alert Rules**.
Do one of the following:

  - View alert rules.
  - Enable and disable alert rules.
  - Delete alert rules.
  - Create new alert rules using the **Alert Rule Builder**.

## Create an alert rule

From the **Alert Rules** page in Chronograf:

1. Click **+ Build Alert Rule**. 

1. Name the alert rule.

2. Choose the alert type:
    -  `Threshold` - alert if data crosses a boundary.
    -  `Relative` - alert if data changes relative to data in a different time range.
    -  `Deadman` - alert if InfluxDB receives no relevant data for a specified time duration.

3. Select the time series data to use in the alert rule.
    - Navigate through databases, measurements, tags, and fields to select all relevant data.

4. Define the rule conditions. Condition options are determined by the alert type.

5. Select and configure the alert handler.
    - The alert handler determines where the system sends the alert (the event handler).
    - Chronograf supports several event handlers and each handler has unique configurable options.
    - Multiple alert handlers can be added to send alerts to multiple endpoints.

6. Configure the alert message.
    - The alert message is the text that accompanies an alert.
    - Alert messages are templates that have access to alert data.
    - Available templates appear below the message text field.
    - As you type your alert message, clicking the data templates will insert them at the end of whatever text has been entered.

7. Click **Save Rule**.

## Enable and disable alert rules

To enable and disable alerts, click on **{{< icon "alert" "v2">}} Alerting** in the left navigation bar and select **Alert Rules**.

  - To enable an alert rule, locate the alert rule and click the box **Task Enabled**. A blue dot shows the task is enabled. A message appears to confirm the rule was successfully enabled. 
  - To disable an alert rule, click the box **Task Enabled**. The blue dot disappears and a message confirms the alert was successfully disabled. 

## Delete alert rules

To delete an alert, click on **{{< icon "alert" "v2">}} Alerting** in the left navigation bar and select **Alert Rules**.

1. Locate the alert you want to delete, and then hover over the "Task Enabled" box. A **Delete** button appears to the right.  
3. Click **Delete** to delete the rule. 

**Note:** Deleting a rule cannot be undone, and removes the rule permanently. 

## View alert history

Chronograf lets you view your alert history on the **Alert History** page.

To view a history of your alerts, click on
**{{< icon "alert" "v2">}} Alerting** in the left navigation bar and select **Alert History**. 
Do one of the following:

  - View a history of all triggered alerts.
  - Filter alert history by type.  
  - View alert history for a specified time range.  
