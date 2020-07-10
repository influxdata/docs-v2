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
[Create DBRP mappings automatically](#automatically-create-dbrp-mappings) with the `/write` compatibility endpoint or
[create DBRP mappings manually](#manually-create-and-manage-dbrp-mappings) using the `/api/v2/dbrps` API endpoint.

- [DBRP mapping behavior](#dbrp-mapping-behavior)
- [Automatically create DBRP mappings](#automatically-create-dbrp-mappings)
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
the DBRP mapping service uses the specified database and retention policy to:

1. Check for a DBRP mapping that matches the database and retention policy.
  - If a DBRP mapping exists, write data to the mapped bucket.
  - If no mapping exists, then:
2. Check to see if a bucket matching the naming convention, `<database>/<retention-policy>`, exists.
  - If a bucket with that name exists, add the DBRP mapping to the existing bucket
     and write the data to the bucket.
  - If no bucket with that name exists, then:
3. Create a new bucket using the naming convention `<database>/<retention-policy>`,
   add the DBRP mapping to the new bucket, and write the data to the bucket.

##### If no retention policy is specified:
1. Check for the specified database in the DBRP mapping service.
  - If the database exists, get the default retention policy for the specified database, and then:
  - If the database doesn't exists, add the database, set its default retention policy as `autogen`, and then:
2. Continue the [normal DBRP mapping behavior](#when-writing-data).

### When querying data
When querying data from InfluxDB 2.0 using the [`/query` compatibility endpoint](/v2.0/reference/api/influxdb-1x/query/),
the DBRP mapping service uses the specified database and retention policy to:

Check for a DBRP mapping that matches the database and retention policy.

- If a DBRP mapping exists, query data from the mapped bucket.
- If no mapping exists, return an error.

##### If no retention policy is specified:
1. Check for the specified database in the DBRP mapping service.
  - If the database doesn't exists, return an error.
  - If database exists, get the default retention policy for the specified database, and then:
2. Continue the [normal DBRP mapping behavior](#when-querying-data).

## Automatically create DBRP mappings

- [Create a new bucket and DBRP mapping](#create-a-new-bucket-and-dbrp-mapping)
- [Automatically map to existing buckets](#automatically-map-to-existing-buckets)

{{% warn %}}
Only the `/write` compatibility endpoint automatically creates DBRP mappings.
The `/query` compatibility endpoint will return an error if querying a database
and retention policy combination that is not mapped to a bucket.
{{% /warn %}}

### Create a new bucket and DBRP mapping
When using the `/write` compatibility endpoint to write data to InfluxDB 2.0
and no DBRP mapping exists for the specified database and retention policy and
no bucket exists that matches the `<database>/<retention-policy>` naming convention,
InfluxDB **creates a new bucket** using the `<database>/<retention-policy>` naming convention.

**For example:**

```sh
curl -XPOST http://localhost:9999/write?db=mydb&rp=myrp \
  -H "Authorization: Token YourAuthToken" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000000000"
```

If no DBRP mapping exists for the `mydb` and `myrp` combination **and** no bucket
exists with the name `mydb/myrp`, InfluxDB automatically creates a new bucket named
`mydb/myrp` and writes data to the new bucket.

_See [DBRP behavior when writing data](#when-writing-data)._

### Automatically map to existing buckets
When using the `/write` compatibility endpoint to write data to InfluxDB 2.0
and no DBRP mapping exists for the specified database and retention policy, but
a bucket matching the `<database>/<retention-policy>` naming convention does exist,
InfluxDB **adds a DBRP mapping for the existing bucket**.

**For example:**

```sh
curl -XPOST http://localhost:9999/write?db=mydb&rp=myrp \
  -H "Authorization: Token YourAuthToken" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000000000"
```

If no DBRP mapping exists for the `mydb` and `myrp` combination **but** there is
a `mydb/myrp` bucket, InfluxDB automatically creates the DBRP mapping and writes
data to the `mydb/myrp` bucket.

_See [DBRP behavior when writing data](#when-writing-data)._

## Manually create and manage DBRP mappings
Use the using the [`/api/v2/dbrps` API endpoint](/v2.0/api/#tag/DBRPs) to
manually create and manage DBRP mappings.

**To create a DBRP mapping, provide the following:**

- authentication token
- organization name or ID
- target bucket ID
- database to map
- retention policy to map

<!--  -->
```sh
curl -XPOST http://localhost:9999/api/v2/dbrps \
  -H "Authorization: Token YourAuthToken" \
  -H 'Content-type: application/json' \
  -d '{
        "org": "example-org",
        "bucketID": "12ab34cd56ef",
        "database": "example-db",
        "retention_policy": "example-rp",
        "default": true
      }'
```

_For more information, see the [`/api/v2/dbrps` endpoint documentation](/v2.0/api/#tag/DBRPs)._
