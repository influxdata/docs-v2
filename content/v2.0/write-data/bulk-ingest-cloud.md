---
title: Bulk ingest
seotitle: Write bulk data to InfluxDB cloud.
list_title: Write bulk data to InfluxDB cloud.
weight: 105
description: >
  Write existing data to InfluxDB Cloud in bulk.
menu:
  v2_0:
    name: Bulk ingest
    parent: Write data
products: [cloud]
---

The InfluxDB API is the way to feed ongoing collection of data into InfluxDB.
However, you might want to upload a large amount of previously existing *historical* data into InluxDB Cloud.
Given our usage-based pricing and the fact that the API is optimized for batched writing, the API is not recommended in the case of bulk data.

Users who need to ingest bulk data chould contact support to review the limits, volume, and coordinate their efforts.
This may include running a small sample of the data into a test bucket so that a schema review can also be performed.
