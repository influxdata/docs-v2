---
title: InfluxDB Clustered data durability
description: >
  Data written to {{% product-name %}} progresses through multiple stages to ensure durability, optimized performance and storage, and efficient querying. Configuration options at each stage affect system behavior, balancing reliability and resource usage.
weight: 102
menu:
  influxdb3_clustered:
    name: Data durability
    parent: InfluxDB internals
influxdb3/clustered/tags: [backups, internals]
related:
  - https://docs.aws.amazon.com/AmazonS3/latest/userguide/DataDurability.html, AWS S3 Data Durabililty
  - /influxdb3/clustered/reference/internals/storage-engine/
source: /shared/v3-distributed-internals-reference/durability.md
---

<!--// SOURCE - content/shared/v3-distributed-internals-reference/durability.md -->