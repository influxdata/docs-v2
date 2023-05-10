---
title: InfluxDB system tables
description: >
  InfluxDB system measurements contain time series data used by and generated from the
  InfluxDB monitoring system.
menu:
  influxdb_cloud_dedicated:
    name: System tables
    parent: InfluxDB internals
weight: 103
influxdb/cloud-dedicated/tags: [tables, information schema]
related:
  - /influxdb/cloud-dedicated/reference/sql/information-schema/
---

InfluxDB system measurements contain time series data used by and generated from the
InfluxDB monitoring system.

Each InfluxDB Cloud Dedicated namespace includes the following system measurements:

- [queries](#_queries-system-measurement)

## queries system measurement

The `system.queries` measurement stores log entries for queries executed for the provided namespace (database) on the node that is currently handling queries.

The following example shows how to list queries recorded in the `system.queries` measurement:

```sql
SELECT issue_time, query_type, query_text, success FROM system.queries;
```

_When listing measurements (tables) available within a namespace, some clients and query tools may include the `queries` table in the list of namespace tables._

`system.queries` reflects a process-local, in-memory, namespace-scoped query log.
While this table may be useful for debugging and monitoring queries, keep the following in mind:

- Query entries stored in `system.queries` are volatile.
  - Records are lost on pod restarts.
  - Queries for one namespace can evict records from another namespace.
- Data reflects the state of a specific pod answering queries for the namespace.
  - A query for records in `system.queries` can return different results depending on the pod the request was routed to.

**Data retention:** Data can be transient and is deleted on pod restarts.

### queries measurement schema

- **system.queries** _(measurement)_
  - **fields**:
      - **issue_time**: timestamp when the query was issued
      - **query_type**: type (syntax: `sql`, `flightsql`, or `influxql`) of the query
      - **query_text**: query statement text
      - **success**: execution status (boolean) of the query
      - **completed_duration**: time (duration) that the query took to complete
      - **trace_id**: trace ID for debugging and monitoring events
