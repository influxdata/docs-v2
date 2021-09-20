---
title: Migrate organization
seotitle: Migrate organization in InfluxDB
description: Replicate the state of an organization in InfluxDB
menu:
  influxdb_cloud:
    name: Migrate organization
    parent: Manage organizations
weight: 102
---

Duplicate an organization to replicate the state of an organization.
For example, copy a test organziation to a new organization.

Do the following:

1. **Migrate metadata**.

   Use [InfluxDB templates](https://docs.influxdata.com/influxdb/cloud/influxdb-templates/create/) (or stack) to replicate metadata, including resources like dashboards and buckets.

   <!-- Is there a way to copy users? -->

2. **Migrate data**.

   There are multiple ways to copy data.

   - Export query results as CSV, then write/upload the CSV into a new bucket using [`influx write`]() or via the API.
     This requires copying data to location outside of InfluxDB Cloud.
   - Write results directly to the new bucket with the Flux [`to()` function]().
     May be limited based on the size of data.
     Need authentication.
   
   {{% note %}}
   Rate limiting.
   {{% /note %}}
