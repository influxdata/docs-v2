---
title: Database and retention policy mapping
description: >
  The database and retention policy (DBRP) mapping service maps InfluxDB 1.x
  database and retention policy combinations to InfluxDB Cloud and InfluxDB OSS 2.0 buckets.
menu:
  influxdb_2_0_ref:
    name: DBRP mapping
    parent: 1.x compatibility
weight: 302
related:
  - /influxdb/v2.0/reference/api/influxdb-1x/query
  - /influxdb/v2.0/reference/api/influxdb-1x/write
  - /influxdb/v2.0/api/#tag/DBRPs, InfluxDB v2 API /dbrps endpoint
---

The InfluxDB 1.x data model includes [databases](/influxdb/v1.8/concepts/glossary/#database)
and [retention policies](/influxdb/v1.8/concepts/glossary/#retention-policy-rp).
InfluxDB OSS 2.0 replaces both with [buckets](/influxdb/v2.0/reference/glossary/#bucket).
To support InfluxDB 1.x query and write patterns in InfluxDB OSS 2.0, databases and retention
policies are mapped to buckets using the **database and retention policy (DBRP) mapping service**.

The DBRP mapping service uses the **database** and **retention policy** specified in
[1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/) requests to route operations to a bucket.

{{% note %}}
To query data in InfluxQL that was written using the 2.x `/write` API,
you must **manually create a DBRP mapping** to map a bucket to a database and retention policy.
For more information, see [Map unmapped buckets](/influxdb/v2.0/query-data/influxql/#map-unmapped-buckets).
{{% /note %}}

### Default retention policies

A database can have multiple retention policies with one set as default.
If no retention policy is specified in a query or write request, InfluxDB uses
the default retention policy for the specified database.

### When writing data

When writing data using the
[`/write` compatibility endpoint](/influxdb/v2.0/reference/api/influxdb-1x/write/),
the DBRP mapping service checks for a bucket mapped to the database and retention policy:

- If a mapped bucket is found, data is written to the bucket.
- If an unmapped bucket, InfluxDB returns an error.
  See how to [Map unmapped buckets](/influxdb/v2.0/query-data/influxql/#map-unmapped-buckets).

### When querying data

When querying data from InfluxDB Cloud and InfluxDB OSS 2.0 using the
[`/query` compatibility endpoint](/influxdb/v2.0/reference/api/influxdb-1x/query/),
the DBRP mapping service checks for the specified database and retention policy
(if no retention policy is specified, the database's default retention policy is used):

- If a mapped bucket exists, data is queried from the mapped bucket.
- If no mapped bucket exists, InfluxDB returns an error. See how to [Map unmapped buckets](/influxdb/v2.0/query-data/influxql/#map-unmapped-buckets).

_For more information on the DBRP mapping API, see the [`/api/v2/dbrps` endpoint documentation](/influxdb/v2.0/api/#tag/DBRPs)._
