---
title: InfluxDB Cloud Dedicated data durability
description: >
  Data written to {{% product-name %}} progresses through multiple stages to ensure durability, optimized performance and storage, and efficient querying. Configuration options at each stage affect system behavior, balancing reliability and resource usage.
  {{% product-name %}} replicates all time series data in the storage tier across
  multiple availability zones within a cloud region and automatically creates backups
  that can be used to restore data in the event of a node failure or data corruption.
weight: 102
menu:
  influxdb3_cloud_dedicated:
    name: Data durability
    parent: InfluxDB internals
influxdb3/cloud-dedicated/tags: [backups, internals]
related:
  - https://docs.aws.amazon.com/AmazonS3/latest/userguide/DataDurability.html, AWS S3 Data Durabililty
  - /influxdb3/cloud-dedicated/reference/internals/storage-engine/
source: /shared/v3-distributed-internals-reference/durability.md
---

<!--// SOURCE - content/shared/v3-distributed-internals-reference/durability.md -->
