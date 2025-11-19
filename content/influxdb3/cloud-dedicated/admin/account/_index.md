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

- [Access and Navigate the Admin UI](#access-and-navigate-the-admin-ui)
- [Account and cluster management](#account-and-cluster-management)
- [Get help and support](#get-help-and-support)

## Access and Navigate the Admin UI

Access the InfluxDB Cloud Dedicated Admin UI at [console.influxdata.com](https://console.influxdata.com).
If you don't have login credentials, [contact InfluxData support](https://support.influxdata.com).

The Admin UI features a collapsible sidebar navigation that provides quick access to all administrative functions:

- **Overview**: View cluster details, metrics, and operational status
- **Databases**: Create and manage databases
- **Tables**: View and manage tables within databases
- **Database Tokens**: Create and manage authentication tokens for database operations
- **Management Tokens**: Create and manage tokens for account-level administrative tasks
- **Users**: View and manage user access and invitations
- **Help**: Access documentation, contact support, or reach sales representatives

## Account and cluster management

The Admin UI uses a hierarchical navigation system with account and cluster selection at the bottom of the sidebar:

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-account-switcher.png" alt="InfluxDB Cloud Dedicated Admin UI account and cluster switcher" />}}

### Switch between accounts

1. Click the **Account** selector at the bottom of the sidebar.
2. Search for or select an account from the list.
3. The UI updates to show resources for the selected account.

### Switch between clusters

1. Click the **Cluster** selector at the bottom of the sidebar.
2. Search for or select a cluster from the list.
3. The UI updates to show resources for the selected cluster.

### View all accounts

To view all accounts across your organization:

1. Click **All Accounts** from the account switcher menu.
2. View a list of all accounts with their IDs, status, type, and creation dates.
3. Use the search bar to filter accounts by name or ID.

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-all-accounts.png" alt="InfluxDB Cloud Dedicated Admin UI all accounts view" />}}

### View all clusters

To view all clusters in the account:

1. Click **All Clusters** from the cluster switcher menu.
2. Navigate to the clusters list to see all available clusters.
3. View cluster IDs, status, creation dates, and size information.
4. Use available actions to copy cluster IDs or URLs, or observe clusters in Grafana (if enabled).

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-all-clusters.png" alt="InfluxDB Cloud Dedicated Admin UI all clusters view" />}}

For more information about managing clusters, see [Manage clusters](/influxdb3/cloud-dedicated/admin/clusters/).

## Get help and support

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-help.png" alt="InfluxDB Cloud Dedicated Admin UI help menu" />}}

The **Help** menu in the sidebar provides quick access to:

- **Documentation**: Browse getting started guides, data operations, queries, visualizations, and reference documentation
- **Contact Us**: Send messages directly to InfluxData support
- **Contact Technical Support**: Open technical support tickets
- **Contact Sales Representative**: Reach out to the sales team for account and contract inquiries

Access the help menu at any time by clicking the **Help** icon in the sidebar navigation.
