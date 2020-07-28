---
title: Database and retention policy mapping
description: >
  The database and retention policy (DBRP) mapping service maps InfluxDB 1.x
  database and retention policy combinations to InfluxDB 2.0 buckets.
menu:
  v2_0_ref:
    name: DBRP mapping
    parent: 1.x compatibility
weight: 302
aliases:
  - /v2.0/reference/api/influxdb-1x/dbrp/
products: [cloud]
related:
  - /v2.0/reference/api/influxdb-1x/query
  - /v2.0/reference/api/influxdb-1x/write
  - /v2.0/api/#tag/DBRPs, InfluxDB 2.0 API /dbrps endpoint
---

The InfluxDB 1.x data model includes [databases](https://docs.influxdata.com/influxdb/v1.8/concepts/glossary/#database)
and [retention policies](https://docs.influxdata.com/influxdb/v1.8/concepts/glossary/#retention-policy-rp).
InfluxDB 2.0 replaces both with [buckets](/v2.0/reference/glossary/#bucket).
To support InfluxDB 1.x query and write patterns in InfluxDB 2.0, databases and retention
policies are mapped to buckets using the **database and retention policy (DBRP) mapping service**.

The DBRP mapping service uses the **database** and **retention policy** specified in
[compatibility API](/v2.0/reference/api/influxdb-1x/) requests to route operations to a bucket.
[Create DBRP mappings automatically](#dbrp-mapping-behavior) with the `/write` compatibility endpoint or
[create DBRP mappings manually](#manually-create-and-manage-dbrp-mappings) using the `/api/v2/dbrps` API endpoint.

- [DBRP mapping behavior](#dbrp-mapping-behavior)
- [Manually create and manage DBRP mappings](#manually-create-and-manage-dbrp-mappings)

### Default retention policies
A database can have multiple retention policies with one set as default.
If no retention policy is specified in a query or write request, InfluxDB uses
the default retention policy for the specified database.

## DBRP mapping behavior

- [When writing data](#when-writing-data)
- [When querying data](#when-querying-data)

### When writing data
When writing data to InfluxDB 2.0 using the [`/write` compatibility endpoint](/v2.0/reference/api/influxdb-1x/write/),
the DBRP mapping service checks for a bucket mapped to the database and retention policy:

- If a mapped bucket is found, data is written to the bucket.
- If an unmapped bucket with a name matching:
    - **database/retention policy** exists, a DBRP mapping is added to the bucket,
      and data is written to the bucket.
    - **database** exists (without a specified retention policy), the default
      database retention policy is used, a DBRP mapping is added to the bucket,
      and data is written to the bucket.
- If no matching bucket is found, a new **database/retention-policy** bucket is
  created with a DBRP mapping, and data is written to the bucket.
  If no retention policy is specified, `autogen` is used.

    {{% note %}}
To automatically create new buckets, the authentication token used for the
write request must be an **All Access token**.
    {{% /note %}}

### When querying data
When querying data from InfluxDB 2.0 using the [`/query` compatibility endpoint](/v2.0/reference/api/influxdb-1x/query/),
the DBRP mapping service checks for the specified database and retention policy
(if no retention policy is specified, the database's default retention policy is used):

- If a mapped bucket exists, data is queried from the mapped bucket.
- If no mapped bucket exists, InfluxDB returns an error.

## Manually create and manage DBRP mappings
If you have an existing bucket that does't follow the **database/retention-policy**
naming convention, you **must** manually create a database and retention policy
mapping to query that bucket with the `/query` compatibility API.
Use the using the [`/api/v2/dbrps` API endpoint](/v2.0/api/#tag/DBRPs) to
manually create and manage DBRP mappings.

**To manually create a DBRP mapping, provide the following:**

- authentication token
- organization name or ID (organization or organization_id)
- target bucket ID (bucket_id)
- database to map
- retention policy to map

<!--  -->
```sh
curl -XPOST https://cloud2.influxdata.com/api/v2/dbrps \
  -H "Authorization: Token YourAuthToken" \
  -H 'Content-type: application/json' \
  -d '{
        "organization": "example-org",
        "bucket_id": "12ab34cd56ef",
        "database": "example-db",
        "retention_policy": "example-rp",
        "default": true
      }'
```

_For more information, see the [`/api/v2/dbrps` endpoint documentation](/v2.0/api/#tag/DBRPs)._
