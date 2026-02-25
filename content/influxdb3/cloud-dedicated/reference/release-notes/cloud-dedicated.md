---
title: Cloud Dedicated product updates
seotitle: InfluxDB Cloud Dedicated product updates
description: >
  Updates for {{% product-name %}}.
menu:
  influxdb3_cloud_dedicated:
    name: Cloud Dedicated 
    identifier: cloud-dedicated-product-updates 
    parent: Release notes
weight: 202
---

##  2025 Product Highlights

### New Features

- **`influxctl` Database Management:** You can now use `influxctl` to delete, undelete, and rename databases. For complete details, see [Manage databases](/influxdb3/cloud-dedicated/admin/databases/) and the [`influxctl database` command reference](/influxdb3/cloud-dedicated/reference/cli/influxctl/database/).
- **`influxctl` Table Deletion:** We've also added `influxctl` support for delete, undelete and rename tables. For more information, see [Delete a table](/influxdb3/cloud-dedicated/admin/tables/delete/) and the [`influxctl table delete` command reference](/influxdb3/cloud-dedicated/reference/cli/influxctl/table/delete/).
- **Query logs:** Query logs are in generally available for all Cloud Dedicated customers as an InfluxDB table in the `_internal` namespace for the `query_log` table. For information about using the query log, see [View the query log](/influxdb3/cloud-dedicated/query-data/troubleshoot-and-optimize/query-log/).

### User Interface (UI) Enhancements

- **Simplified User Management:** The UI now includes a _users page_ that lets you manage existing users and invite new users.
- **Component-Based Cluster Sizing:** Cluster sizing information has been revamped to better show cluster components and offer a clearer understanding of resource allocation and usage.
- **Schema browser:** You can now view table schema in the Admin UI, including column names and types.
- **Embedded observability dashboards:** Embedded dashboards displaying component-level and aggregated metrics for clusters are available in the overview page.

### Reliability

- **Deployment Pipeline Improvements:** We've enhanced our deployment pipeline to be more reliable and minimize downtime. 
- **Autoscaling General Availability:** _Autoscaling functionality_ is now generally available for all Cloud Dedicated customers, providing improved performance and reliability during traffic spikes.

### Performance Improvements

- **New Disk Caching:** Customers will experience improved performance thanks to new disk caching capabilities.
- **Storage API performance improvements**: We've made several improvements to the performance of storage APIs, including faster responses for database size and table size queries.


## January 2026 Product Highlights

### New features

- **Cluster storage observability:** To provide more visibility into storage, clusters now expose several views of live storage usage.
  - The **Cluster Details** card on the **Overview** page includes a **Storage used** field that shows total live database storage.
  - The **Overview** page now includes a dashboard of storage usage over time.
  - The **Databases** page shows live database sizes sortable by size. 
  
- **Query request rate dashboard:** Customers can view error (broken down by error type) and success rates for query requests in the **Query request rate** dashboard.
- **Query log UI:** A new Query log UI is generally available to customers who have enabled query logging. For information about using the query log, see [View the query log](/influxdb3/cloud-dedicated/query-data/troubleshoot-and-optimize/query-log/).

