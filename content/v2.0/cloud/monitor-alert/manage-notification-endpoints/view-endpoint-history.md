---
title: View notification endpoint history
seotitle: View notification endpoint details and history in the InfluxDB.
description: >
  View notification endpoint details and history in the InfluxDB UI.
menu:
  v2_0:
    name: View endpoint history
    parent: Manage notification endpoints
weight: 202
v2.0/tags: [monitor, notifications]
---

View notification endpoint details and history in the InfluxDB user interface (UI).

- [View notification endpoints](#view-notification-endpoints)
- [View notification endpoint details](#view-notification-endpoint-details)
- [View history notification endpoint history](#view-notification-endpoint-history), including statues and notifications sent to the endpoint

## View notification endpoints

- Click **Monitoring & Alerting** in the InfluxDB UI sidebar.

    {{< nav-icon "alerts" >}}

    In the **Notification Endpoints** column, view existing notification endpoints.

## View notification endpoint details

1. Click **Monitoring & Alerting** in the InfluxDB UI sidebar.
2. In the **Notification Endpoints** column, click the name of the notification endpoint you want to view.
3. View the notification endpoint destination, name, and information to connect to the endpoint.

## View notification endpoint history

1. Click **Monitoring & Alerting** in the InfluxDB UI sidebar.
2. In the **Notification Endpoints** column, hover over the notification endpoint, click the **{{< icon "view" >}}** icon, then **View History**. 
The Check Statuses History page displays:

 - Statuses generated for the selected notification endpoint
 - Notifications sent to the selected notification endpoint
