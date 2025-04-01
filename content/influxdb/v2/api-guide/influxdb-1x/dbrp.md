---
title: Database and retention policy mapping
description: >
  The database and retention policy (DBRP) mapping service maps InfluxDB 1.x
  database and retention policy combinations to InfluxDB Cloud and InfluxDB OSS 2.x buckets.
menu:
  influxdb_v2:
    name: DBRP mapping
    parent: v1 compatibility
weight: 302
related:
  - /influxdb/v2/reference/api/influxdb-1x/query
  - /influxdb/v2/reference/api/influxdb-1x/write
  - /influxdb/v2/api/#tag/DBRPs, InfluxDB v2 API /dbrps endpoint
  - /influxdb/v2/query-data/influxql/
aliases:
  - /influxdb/v2/reference/api/influxdb-1x/dbrp/
---

The InfluxDB 1.x data model includes [databases](/influxdb/v1/concepts/glossary/#database)
and [retention policies](/influxdb/v1/concepts/glossary/#retention-policy-rp).
InfluxDB {{< current-version >}} replaces databases and retention policies with
[buckets](/influxdb/v2/reference/glossary/#bucket).
To support InfluxDB 1.x query and write patterns in InfluxDB {{< current-version >}},
databases and retention policies are mapped to buckets using the
**database and retention policy (DBRP) mapping service**.

The DBRP mapping service uses the **database** and **retention policy** specified in
[1.x compatibility API](/influxdb/v2/reference/api/influxdb-1x/) requests to route operations to a bucket.

{{% show-in "cloud,cloud-serverless" %}}

{{% note %}}
To query data in InfluxQL that was written using the `api/v2/write` API,
you must **manually create a DBRP mapping** to map a bucket to a database and retention policy.
For more information, see [Create DBRP mappings](/influxdb/v2/query-data/influxql/dbrp/#create-dbrp-mappings).
{{% /note %}}

{{% /show-in %}}

### Default retention policies

A database can have multiple retention policies with one set as default.
If no retention policy is specified in a query or write request, InfluxDB uses
the default retention policy for the specified database.
Use the `influx` CLI or the InfluxDB API to set a retention policy as the
default retention policy for a database.

{{% show-in "v2" %}}

### When creating a bucket

When you [create a bucket](/influxdb/v2/admin/buckets/create-bucket/),
InfluxDB {{< current-version >}} automatically creates a "virtual" DBRP mapping.
Virtual DBRP mappings are those that are created on your behalf.

- **If your bucket name includes a forward slash (`/`)**, the virtual DBRP mapping
  uses everything before the forward slash as the database name and everything
  after the forward slash as the retention policy name.
  If the database does not already have a default retention policy, the parsed
  retention policy is set as the default.
- **If your bucket name does not include a forward slash (`/`)**, the virtual DBRP
  mapping uses the bucket name as the database and `autogen` as the retention
  policy. The `autogen` retention policy is set as the default retention policy.

{{% /show-in %}}

### When writing data

{{% show-in "v2" %}}

When writing data using the
[`/write` compatibility endpoint](/influxdb/v2/reference/api/influxdb-1x/write/),
the DBRP mapping service uses the database and retention policy specified
in the request to write the data to the appropriate bucket.

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

When writing data using the
[`/write` compatibility endpoint](/influxdb/v2/reference/api/influxdb-1x/write/),
the DBRP mapping service checks for a bucket mapped to the database and retention policy:

- If a mapped bucket is found, data is written to the bucket.
- If an unmapped bucket with a name matching:

    - `database/retention policy` exists, a DBRP mapping is added to the bucket,
      and data is written to the bucket.
    - `database` exists (without a specified retention policy), the default
      database retention policy is used, a DBRP mapping is added to the bucket,
      and data is written to the bucket.

{{% /show-in %}}

### When querying data

{{% show-in "v2" %}}

When querying data from InfluxDB {{< current-version >}}
using the [`/query` compatibility endpoint](/influxdb/v2/reference/api/influxdb-1x/query/),
the DBRP mapping service uses the database and retention policy specified in the
request to query data from the appropriate bucket.
If no retention policy is specified, the database's default retention policy is used.

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

When querying data from InfluxDB {{< current-version >}}
using the [`/query` compatibility endpoint](/influxdb/v2/reference/api/influxdb-1x/query/),
the DBRP mapping service checks for the specified database and retention policy
(if no retention policy is specified, the database's default retention policy is used):

- If a mapped bucket exists, data is queried from the mapped bucket.
- If no mapped bucket exists, InfluxDB returns an error.
  See how to [Create DBRP mappings](/influxdb/v2/query-data/influxql/dbrp/#create-dbrp-mappings).

_For more information on the DBRP mapping API, see the [`/api/v2/dbrps` endpoint documentation](/influxdb/v2/api/#tag/DBRPs)._

{{% /show-in %}}

{{% note %}}
#### A DBRP combination can only be mapped to a single bucket
Each unique DBRP combination can only be mapped to a single bucket.
If you map a DBRP combination that is already mapped to another bucket,
it will overwrite the existing DBRP mapping.
{{% /note %}}
