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

## January 2026 Product Highlights

### New Features

- **Cluster storage observability:** Improve visibility into storage with new live storage usage views.
  - View total live database storage in the **Storage used** field on the **Cluster Details** card on the **Overview** page.
  - Track storage usage over time in the storage usage dashboard on the **Overview** page.
  - Sort live database sizes by size on the **Databases** page.

- **Query request rate dashboard:** Monitor query request success and error rates (grouped by error type) in the **Query request rate** dashboard.
- **Query log UI:** Now generally available. After you enable **query logging**, use the UI to monitor query performance, find slow-running queries, and troubleshoot failed executions. For details, see [View the query log](/influxdb3/cloud-dedicated/query-data/troubleshoot-and-optimize/query-log/).


## 2025 Product Highlights

### New Features

- **`influxctl` Database Management:** You can now use `influxctl` to delete, undelete, and rename databases. For complete details, see [Manage databases](/influxdb3/cloud-dedicated/admin/databases/) and the [`influxctl database` command reference](/influxdb3/cloud-dedicated/reference/cli/influxctl/database/).
- **`influxctl` table deletion and management:** Delete, undelete, and rename tables with `influxctl`. For details, see [Delete a table](/influxdb3/cloud-dedicated/admin/tables/delete/) and the [`influxctl table delete` command reference](/influxdb3/cloud-dedicated/reference/cli/influxctl/table/delete/).
- **Query logs:** Access query logs as an InfluxDB table (`_internal.query_log`). For details, see [View the query log](/influxdb3/cloud-dedicated/query-data/troubleshoot-and-optimize/query-log/).

### User Interface (UI) Enhancements

- **Simplified User Management:** Invite and manage users via **Admin UI > Users**. For details, see [Manage users in the Admin UI](/influxdb3/cloud-dedicated/admin/users/admin-ui/).
- **Component-Based Cluster Sizing:** Cluster sizing information has been revamped to better show cluster components and offer a clearer understanding of resource allocation and usage.
- **Schema browser:** View table schemas (including column names and data types) in the Admin UI. For details, see [List tables](/influxdb3/cloud-dedicated/admin/tables/list/).
- **Embedded observability dashboards:** Use embedded dashboards on the **Overview** page to monitor component-level and aggregated cluster metrics. For details, see [Monitor your cluster](/influxdb3/cloud-dedicated/admin/monitor-your-cluster/).

### Reliability

- **Deployment pipeline improvements:** Increase deployment reliability and minimize downtime.
- **Autoscaling (generally available):** Enable autoscaling to maintain performance and reliability during traffic spikes.

### Performance Improvements

- **New Disk Caching:** Customers will experience improved performance thanks to new disk caching capabilities.
- **Storage API performance improvements:** Reduce latency for storage APIs, including faster responses for database size and table size queries.


