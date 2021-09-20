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

There are two parts to this:

- migrate data
- migrate metadata

## Migrate data

There are multiple ways to copy data so the guide should outline the different approaches and when to use them.

- Export query results as CSV, then write/upload the CSV into a new bucket using the CLI or curl.
  Most flexible. Requires copying data to location outside of InfluxDB Cloud.
- Write results directly to the new bucket with Flux to().
  May be limited based on the size of data. May encounter auth complexity copying data across organizations.

(Rate limits)

## Migrate metadata

https://docs.influxdata.com/influxdb/cloud/influxdb-templates/create/

The guide should also cover the use of InfluxDB templates (or stack) to replicate
metadata (dashboards, buckets, etc) before copying the data, i.e. creating a complete
copy of both metadata+data. Can link to the relevant template documentation.

There is no way to copy users?
