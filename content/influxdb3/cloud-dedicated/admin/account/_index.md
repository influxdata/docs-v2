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

The Admin UI provides access to account information through the **All Accounts** page:

1. Click the **Account** selector at the bottom of the sidebar navigation
2. Select **All Accounts** from the menu
3. View a table with all accounts across your organization

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-all-accounts.png" alt="InfluxDB Cloud Dedicated Admin UI all accounts view" />}}

The All Accounts page displays the following information for each account:

- **Name**: The account name
- **Account ID**: Unique identifier for the account
- **Status**: Current account status (Active, Cancelled, etc.)
- **Type**: Account type
- **Created At**: The date the account was created

Use the search bar to filter accounts by name or ID, and access additional actions through the menu on each row.

### Switch between accounts

To switch to a specific account and view its resources:

1. Click the **Account** selector at the bottom of the sidebar navigation
2. Search for or select an account from the list
3. The UI updates to show resources (clusters, databases, tokens, users) for the selected account
