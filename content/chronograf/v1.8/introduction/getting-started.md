---
title: Get started with Chronograf
description: >
  Overview of data visualization, alerting, and infrastructure monitoring features available in Chronograf.
aliases:
    - /{{< latest "chronograf" >}}/introduction/getting-started/
    - /chronograf/v1.8/introduction/getting_started/
menu:
  chronograf_1_8:
    name: Get started
    weight: 30
    parent: Introduction
---

## Overview
Chronograf allows you to quickly see data you have stored in InfluxDB so you can build robust queries and alerts. After your administrator has set up Chronograf as described in [Installing Chronograf](/{{< latest "chronograf" >}}/introduction/installation), get started with key features using the guides below.

### Data visualization
* Investigate your data by building queries using the [Data Explorer](/{{< latest "chronograf" >}}/guides/querying-data/).
* Use [pre-created dashboards](/{{< latest "chronograf" >}}/guides/using-precreated-dashboards/) to monitor your application data or [create your own dashboards](/{{< latest "chronograf" >}}/guides/create-a-dashboard/).
* Customize dashboards using [template variables](/{{< latest "chronograf" >}}/guides/dashboard-template-variables/).

### Alerting
* [Create alert rules](/{{< latest "chronograf" >}}/guides/create-alert-rules/) to generate threshold, relative, and deadman alerts on your data.
* [View all active alerts](/{{< latest "chronograf" >}}/guides/create-alert-rules/#step-2-view-the-alerts) on an alert dashboard.
* Use [alert endpoints](/{{< latest "chronograf" >}}/guides/configuring-alert-endpoints/) in Chronograf to send alert messages to specific URLs and applications.

### Infrastructure monitoring
* [View all hosts](/{{< latest "chronograf" >}}/guides/monitoring-influxenterprise-clusters/#step-4-explore-the-monitoring-data-in-chronograf) and their statuses in your infrastructure.
* [Use pre-created dashboards](/{{< latest "chronograf" >}}/guides/using-precreated-dashboards/) to monitor your applications.
