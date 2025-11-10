---
title: Administrative UI 
seotitle: Administrative UI for {{% product-name %}}
description: >
  The Administrative (Admin) UI for {{% product-name %}} is a browser-based, no-code way to manage your {{% product-name %}} environment and perform administrative tasks, such as creating and managing clusters, databases, and tokens.
menu:
  influxdb3_cloud_dedicated:
    parent: Reference 
weight: 105
---

The Administrative (Admin) UI for {{% product-name %}} is a browser-based, no-code way to manage your {{% product-name %}} environment and perform administrative tasks, such as creating and managing clusters, databases, and tokens.

- [Access the Admin UI](#access-the-admin-ui)
- [Navigate the Admin UI](#navigate-the-admin-ui)
- [Account and cluster management](#account-and-cluster-management)
- [Resource management](#resource-management)
  - [View cluster overview and metrics](#view-cluster-overview-and-metrics)
  - [Manage databases](#manage-databases)
  - [Manage tables](#manage-tables)
  - [Manage database tokens](#manage-database-tokens)
  - [Manage management tokens](#manage-management-tokens)
  - [Manage users](#manage-users)
- [Get help and support](#get-help-and-support)

## Access the Admin UI

Customers can access the Admin UI at [console.influxdata.com](http://console.influxdata.com) using the credentials provided by InfluxData.
If you don't have login credentials, [contact InfluxData support](https://support.influxdata.com).

## Navigate the Admin UI

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

1. Click the **Account** selector at the bottom of the sidebar
2. Search for or select an account from the list
3. The UI updates to show resources for the selected account

### Switch between clusters

1. Click the **Cluster** selector at the bottom of the sidebar
2. Search for or select a cluster from the list
3. The UI updates to show resources for the selected cluster

### View all accounts

To view all accounts across your organization:

1. Click **All Accounts** from the account switcher menu
2. View a list of all accounts with their IDs, status, type, and creation dates
3. Use the search bar to filter accounts by name or ID

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-all-accounts.png" alt="InfluxDB Cloud Dedicated Admin UI all accounts view" />}}

### View all clusters

To view all clusters across accounts:

1. Click **Overview** in the sidebar to access cluster views
2. Navigate to the clusters list to see all available clusters
3. View cluster IDs, status, creation dates, and size information
4. Use available actions to copy cluster IDs or URLs, or observe clusters in Grafana (if enabled)

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-all-clusters.png" alt="InfluxDB Cloud Dedicated Admin UI all clusters view" />}}

For more information, see:
- [View account information](/influxdb3/cloud-dedicated/admin/account/)
- [Manage clusters](/influxdb3/cloud-dedicated/admin/clusters/)

## Resource management

The Admin UI lets you manage {{% product-name %}} resources, such as databases, tables, and tokens, associated with a cluster.

### View cluster overview and metrics

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-overview.png" alt="InfluxDB Cloud Dedicated Admin UI cluster overview" />}}

The **Overview** page displays real-time cluster information and metrics:

- **Cluster Details**: View cluster name, status, creation date, cluster ID, and cluster URL
- **Cluster Size**: See CPU allocation and component vCPU distribution (Ingest, Compaction, Query, System)
- **Cluster Metrics**: Monitor CPU usage, memory usage, and ingest line protocol rate with time-series charts
- Configure the metrics time range and enable live updates for real-time monitoring

For more information, see [Manage clusters](/influxdb3/cloud-dedicated/admin/clusters/).

### Manage databases

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-databases.png" alt="InfluxDB Cloud Dedicated Admin UI databases list" />}}

Use the **Databases** page to manage databases within the selected cluster:

- Create and delete databases
- View database IDs and configuration limits
- Update retention periods
- Configure maximum tables and columns per table
- Navigate to tables associated with a database

For more information, see [Manage databases](/influxdb3/cloud-dedicated/admin/databases/).

### Manage tables

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-tables.png" alt="InfluxDB Cloud Dedicated Admin UI tables list" />}}

Use the **Tables** page to manage tables within databases:

- Select a database from the dropdown to view its tables
- View table IDs and sizes
- See database size summary
- Create new tables
- Access detailed table schema information

For more information, see [Manage tables](/influxdb3/cloud-dedicated/admin/tables/).

### Manage database tokens

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-database-tokens.png" alt="InfluxDB Cloud Dedicated Admin UI database tokens" />}}

Use the **Database Tokens** page to manage authentication tokens for database-level operations:

- Create and manage database tokens with granular permissions
- View token status, descriptions, and associated databases
- Edit permissions or revoke existing tokens
- Control access with read and write permissions for specific databases
- Toggle display of inactive tokens

For more information, see [Manage database tokens](/influxdb3/cloud-dedicated/admin/tokens/).

### Manage management tokens

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-management-tokens.png" alt="InfluxDB Cloud Dedicated Admin UI management tokens" />}}

Use the **Management Tokens** page to manage tokens for account-level administrative operations:

- Create and manage management tokens for administrative tasks
- View token status, descriptions, and creation dates
- Manage permissions for users, databases, and database tokens
- Toggle display of inactive tokens

Management tokens grant permission to perform administrative actions such as managing users, databases, and database tokens.

For more information, see [Manage management tokens](/influxdb3/cloud-dedicated/admin/tokens/).

### Manage users

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-users.png" alt="InfluxDB Cloud Dedicated Admin UI users" />}}

Use the **Users** page to manage access to your InfluxDB account:

- View all users who have accepted the user agreement and have access to the account
- Invite new users to the account
- View user roles, email addresses, and join dates
- Manage user permissions and access
- Toggle between Users and Invitations tabs

For more information, see [Manage users](/influxdb3/cloud-dedicated/admin/users/).

## Get help and support

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-help.png" alt="InfluxDB Cloud Dedicated Admin UI help menu" />}}

The **Help** menu in the sidebar provides quick access to:

- **Documentation**: Browse getting started guides, data operations, queries, visualizations, and reference documentation
- **Contact Us**: Send messages directly to InfluxData support
- **Contact Technical Support**: Open technical support tickets
- **Contact Sales Representative**: Reach out to the sales team for account and contract inquiries

Access the help menu at any time by clicking the **Help** icon in the sidebar navigation.
