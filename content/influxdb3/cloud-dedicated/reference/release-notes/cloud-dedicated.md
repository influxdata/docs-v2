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

## July 2025 Product Highlights

### New Features

- **`influxctl` Database Management:** You can now use `influxctl` to delete, undelete, and rename databases. For complete details, see [Manage databases](/influxdb3/cloud-dedicated/admin/databases/) and the [`influxctl database` command reference](/influxdb3/cloud-dedicated/reference/cli/influxctl/database/).
- **`influxctl` Table Deletion:** We've also added `influxctl` support for deleting tables. For more information, see [Delete a table](/influxdb3/cloud-dedicated/admin/tables/delete/) and the [`influxctl table delete` command reference](/influxdb3/cloud-dedicated/reference/cli/influxctl/table/delete/).

### User Interface (UI) Enhancements

- **Simplified User Management:** The UI now includes a _users page_ lets you manage existing users and invite new users.
- **Component-Based Cluster Sizing:** Cluster sizing information has been revamped to better show cluster components and offer a clearer understanding of resource allocation and usage.

### Reliability

- **Deployment Pipeline Improvements:** We've enhanced our deployment pipeline to be more reliable and minimize downtime. 
- **Autoscaling Private Preview:** _Autoscaling functionality_ is entering Private Preview this July.
- **Grafana Upgrade:** Grafana has been upgraded to address a recent [CVE](https://grafana.com/blog/2025/07/02/grafana-security-update-critical-severity-security-release-for-cve-2025-5959-cve-2025-6554-cve-2025-6191-and-cve-2025-6192-in-grafana-image-renderer-plugin-and-synthetic-monitoring-agent/).

### Connectors

- **`influxctl` Iceberg Integration:** For customers with Iceberg enabled, you can now use `influxctl` to enable the _Iceberg integration on specific tables_.
- **AWS Glue and Athena Iceberg Integration Private Preview:** _AWS Glue and Athena support for Iceberg integration_ is entering Private Preview this July.

### Performance Improvements

- **New Disk Caching:** Customers will experience improved performance thanks to new disk caching capabilities.

