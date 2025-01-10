---
title: View partition information
description: >
  Query partition information from InfluxDB v3 system tables to view partition 
  templates and verify partitions are working as intended.
menu:
  influxdb3_cloud_dedicated:
    name: View partitions
    parent: Manage data partitioning
weight: 202
list_code_example: |
  ```sql
  SELECT * FROM system.partitions WHERE table_name = 'example-table'
  ```
related:
  - /influxdb3/cloud-dedicated/admin/query-system-data/
source: /shared/v3-distributed-admin-custom-partitions/view-partitions.md
---

<!-- 
The content of this page is at /content/shared/v3-distributed-admin-custom-partitions/view-partitions.md
-->
