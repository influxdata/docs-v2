---
title: Time To Become Readable
description: >
  **Time To Become Readable (TTBR)** is the delay between when you write data to
  InfluxDB Cloud and when that data becomes queryable.
  TTBR is variable and is affected by many factors.
menu:
  influxdb_cloud:
    name:  Time To Become Readable
    parent: InfluxDB Cloud internals
weight: 102
influxdb/cloud/tags: [write, query]
related:
  - /influxdb/cloud/write-data/
  - /influxdb/cloud/query-data/
---

**Time To Become Readable (TTBR)** is the delay between when you write data to
InfluxDB Cloud and when that data becomes queryable.
TTBR is variable and is affected by many factors.

- [How write requests work in the InfluxDB Cloud API](#how-write-requests-work-in-the-influxdb-cloud-api)
- [Flux vs InfluxQL](#flux-vs-influxql)
- [InfluxDB Cloud TTBRs](#influxdb-cloud-ttbrs)

## How write requests work in the InfluxDB Cloud API

Whenever you send a write request to the `/api/v2/write` endpoint, the following actions occur:

1. API validates the request and queues the write.
2. If the write is queued, API responds with an HTTP 204 status code.
3. API handles the write asynchronously and reaches eventual consistency.

_For more information, see [`/api/v2/write` documentation](/influxdb/cloud/api/#post-/api/v2/write)._

{{% note %}}
The returned 204 status code does not mean that the point is queryable;
it means the write request has been added to the durable write queue
_(for more information, see
[Handle write and delete responses](/influxdb/cloud/write-data/troubleshoot/#handle-write-and-delete-responses))_.
TTBR represents the time it takes for the write request to be queued,
the write operation to be executed, **and** the data to become queryable.

For more information about status codes returned from the `/api/v1/write` endpoint
{{% /note %}}

## Flux vs InfluxQL

One of the primary factors that affects TTBR is the query language you use to
query the newly written data. InfluxQL queries use a metadata cache that stores
information about fields and series.

**If you write a point with a new field**, the new field will not be queryable
by InfluxQL until InfluxDB Cloud refreshes the metadata cache, which can take up
to 15 minutes. Flux does not rely on the metadata cache, so the newly written
data should be queryable in approximately one second.

**If you write a point with an existing field**, and the field already exists in 
the metadata cache, both InfluxQL and Flux should be able to query the new data
in approximately one second.

## InfluxDB Cloud TTBRs

| Write request to   | Flux |      InfluxQL      |
| :------------- | :--: | :----------------: |
| Existing field | ≈1s  |        ≈1s         |
| New field      | ≈1s  | ≈10m to 15m |
