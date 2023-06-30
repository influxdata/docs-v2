---
title: Delete data
description: >
  Use measurements, tags, and timestamp columns to avoid querying unwanted data.
menu:
  influxdb_cloud_serverless:
    name: Delete data
    parent: Write data
weight: 107
influxdb/cloud-serverless/tags: [delete]
---

The InfluxDB `/api/v2/delete` API endpoint has been disabled for InfluxDB
Cloud Serverless organizations.
Currently, you can't delete data from an InfluxDB Cloud Serverless bucket.

To avoid querying expired or unwanted data, use tags and timestamps for filtering.

When writing data:

  - [Use a new measurement name when your schema changes](/influxdb/cloud-serverless/write-data/best-practices/schema-design/#measurement-schemas-should-be-homogenous).
  - [Include a tag](/influxdb/cloud-serverless/write-data/best-practices/schema-design/#tags-versus-fields) or tags for versioning your data.

When querying:

  - [Filter for tag values](/influxdb/cloud-serverless/query-data/sql/basic-query/#query-fields-based-on-tag-values) in your version tags.
  - [Use time boundaries](/influxdb/cloud-serverless/query-data/sql/basic-query/#query-data-within-time-boundaries) that exclude old data.

_To delete a bucket and **all** its data, use the [InfluxDB `/api/v2/buckets` API endpoint](/influxdb/cloud-serverless/api/#operation/DeleteBucketsID)._
