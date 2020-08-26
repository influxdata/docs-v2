---
title: Bulk ingest
seotitle: Write bulk data to InfluxDB Cloud.
list_title: Write bulk data to InfluxDB Cloud.
weight: 105
description: >
  Write existing data to InfluxDB Cloud in bulk.
menu:
  v2_0:
    name: Bulk ingest
    parent: Write data
products: [cloud]
---

You might want to upload a large amount of previously existing *historical* data into InluxDB Cloud.
Given our usage-based pricing and the fact that the API is optimized for batched writing, the API is not recommended in the case of bulk data.

To migrate a large amount of existing historical data to Cloud, contact Support for assistance.
We’ll review your ingest rate limits, volume, and existing [data schema](/v2.0/reference/key-concepts/data-schema) to ensure the most efficient migration.

