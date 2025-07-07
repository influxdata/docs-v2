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

-----

## July 2025 Product Highlights

-----

### New Features

  * **`influxctl` Database Management:** You can now use `influxctl` to delete, undelete, and rename databases. For complete details, see the [Influxctl CLI reference](https://www.google.com/search?q=/influxdb3/cloud-dedicated/reference/cli/influxctl/).
  * **`influxctl` Table Deletion:** We've also added `influxctl` support for deleting tables.

-----

### User Interface (UI) Enhancements

  * **Simplified User Management:** The UI now includes a **users page**, making it easier to manage users and enabling self-service invitations.
  * **Component-Based Cluster Sizing:** Cluster sizing information has been revamped in terms  of cluster components to offer a clearer understanding of resource allocation and usage.

-----

### Reliability

  * **Deployment Pipeline Improvements:** We've enhanced our deployment pipeline for greater reliability and minimal downtime. 
  * **Autoscaling Private Preview:** **Autoscaling functionality** is entering Private Preview this July.
  * **Grafana Upgrade:** Grafana has been upgraded to address a recent [CVE](https://grafana.com/blog/2025/07/02/grafana-security-update-critical-severity-security-release-for-cve-2025-5959-cve-2025-6554-cve-2025-6191-and-cve-2025-6192-in-grafana-image-renderer-plugin-and-synthetic-monitoring-agent/).

-----

### Connectors

  * **`influxctl` Iceberg Integration:** For customers with Iceberg enabled, you can now use `influxctl` to enable **Iceberg integration on specific tables**.
  * **AWS Glue and Athena Iceberg Integration Private Preview:** **AWS Glue and Athena support for Iceberg integration** is entering Private Preview this July.

-----

### Performance Improvements

  * **New Disk Caching:** Customers will experience **improved performance** thanks to new disk caching capabilities.

