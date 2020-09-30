---
title: Database and retention policy mapping
description: >
  The database and retention policy (DBRP) mapping service maps InfluxDB 1.x
  database and retention policy combinations to InfluxDB 2.0 buckets.
menu:
  influxdb_2_0_ref:
    name: DBRP mapping
    parent: 1.x compatibility
weight: 302
products: [cloud]
related:
  - /influxdb/v2.0/reference/api/influxdb-1x/query
  - /influxdb/v2.0/reference/api/influxdb-1x/write
  - /influxdb/v2.0/api/#tag/DBRPs, InfluxDB 2.0 API /dbrps endpoint
---

The InfluxDB 1.x data model includes [databases](/influxdb/v1.8/concepts/glossary/#database)
and [retention policies](/influxdb/v1.8/concepts/glossary/#retention-policy-rp).
InfluxDB 2.0 replaces both with [buckets](/influxdb/v2.0/reference/glossary/#bucket).
To support InfluxDB 1.x query and write patterns in InfluxDB 2.0, databases and retention
policies are mapped to buckets using the **database and retention policy (DBRP) mapping service**.

The DBRP mapping service uses the **database** and **retention policy** specified in
[compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/) requests to route operations to a bucket.

{{% /note %}}
To query using InfluxQL, if the data being queried was written to InfluxDB 2.0 with the 2.x `/write` API, you must manually create a DBRP mapping.
For more information, see [Manually create and manage DBRP mappings](/influxdb/v2.0/query-data/influxql/#manually-create-and-manage-dbrp-mappings).
{{% note %}}

### Default retention policies
A database can have multiple retention policies with one set as default.
If no retention policy is specified in a query or write request, InfluxDB uses
the default retention policy for the specified database.

### When writing data
When writing data to InfluxDB 2.0 using the [`/write` compatibility endpoint](/influxdb/v2.0/reference/api/influxdb-1x/write/),
the DBRP mapping service checks for a bucket mapped to the database and retention policy:

- If a mapped bucket is found, data is written to the bucket.
- If an unmapped bucket with a name matching:
    - **database/retention policy** exists, a DBRP mapping is added to the bucket,
      and data is written to the bucket.
    - **database** exists (without a specified retention policy), the default
      database retention policy is used, a DBRP mapping is added to the bucket,
      and data is written to the bucket.
- If no matching bucket is found, a new **database/retention-policy** bucket is
  automatically created with a DBRP mapping, and data is written to the bucket.
  If no retention policy is specified, `autogen` is used.

    {{% note %}}
To automatically create new buckets, the authentication token used for the
write request must be an **All Access token**.
    {{% /note %}}

### When querying data
When querying data from InfluxDB 2.0 using the [`/query` compatibility endpoint](/influxdb/v2.0/reference/api/influxdb-1x/query/),
the DBRP mapping service checks for the specified database and retention policy
(if no retention policy is specified, the database's default retention policy is used):

- If a mapped bucket exists, data is queried from the mapped bucket.
- If no mapped bucket exists, InfluxDB returns an error.
