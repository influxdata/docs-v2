---
title: Bulk ingest
seotitle: Write bulk data to InfluxDB Cloud.
list_title: Write bulk data to InfluxDB Cloud.
weight: 105
description: >
  Write existing data to InfluxDB Cloud in bulk.
menu:
  influxdb_cloud:
    name: Bulk ingest
    parent: Write data
products: [cloud]
alias:
  - /influxdb/v2.0/write-data/bulk-ingest-cloud
---

To upload a large amount of previously existing *historical* data into InfluxDB Cloud, contact Support for assistance.
We’ll review your ingest rate limits, volume, and existing [data schema](/influxdb/cloud/reference/key-concepts/data-schema) to ensure the most efficient migration.

Given our usage-based pricing and because the API is optimized for batched writing, we do not recommend using the API to ingest bulk data.
