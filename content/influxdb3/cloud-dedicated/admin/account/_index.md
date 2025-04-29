---
title: View account information
seotitle: View {{% product-name %}} account information
description: >
  Use the Admin UI for {{% product-name %}} to view information for your {{% product-name omit="InfluxDB " %}} account.
  Your {{% product-name %}} account is a collection of {{% product-name omit="Clustered "%}} clusters and associated resources.
menu:
  influxdb3_cloud_dedicated:
    parent: Administer InfluxDB Cloud
weight: 99
influxdb3/cloud-dedicated/tags: [clusters]
---

Use the Admin UI for {{% product-name %}} to view information for your {{% product-name omit="InfluxDB " %}} account.
Your {{% product-name %}} account is a collection of {{% product-name omit="Clustered "%}} clusters and associated resources.

- [Access the Admin UI](#access-the-admin-ui)
- [View account information](#view-account-information)
- [View cluster information](#view-cluster-information)
  - [Access operational dashboards](#access-operational-dashboards)
- [Administer management tokens](#administer-management-tokens)

## Access the Admin UI

1. To access the {{< product-name >}} Admin UI, visit the following URL in your browser:

   <pre>
   <a href="https://console.influxdata.com">https://console.influxdata.com</a>
   </pre>

2. Use the credentials provided by InfluxData to log into the Admin UI.
   If you don't have login credentials, [contact InfluxData support](https://support.influxdata.com).

## View account information

After you log in to the Admin UI, the Account Management portal displays the following information about your account:

- Account ID
- Contract status
- Contract start date
- The [list of clusters](/influxdb3/cloud-dedicated/admin/clusters/list/?t=admin-ui) associated with the account

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-account-info.png" alt="InfluxDB Cloud Dedicated Admin UI account information" />}}
