---
title: InfluxDB system tables
description: >
  InfluxDB system measurements contain time series data used by and generated from the
  InfluxDB internal monitoring system.
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
InfluxDB internal monitoring system.

Each {{% product-name %}} namespace includes the following system measurements:

<!-- TOC -->

- [system.queries measurement](#systemqueries-measurement)
  - [system.queries schema](#systemqueries-schema)

## system.queries measurement

The `system.queries` measurement stores log entries for queries executed for the provided namespace (database) on the node that is currently handling queries.

```python
from influxdb_client_3 import InfluxDBClient3
client = InfluxDBClient3(token = DATABASE_TOKEN,
                          host = HOSTNAME,
                          org = '',
                          database=DATABASE_NAME)
client.query('select * from home')
reader = client.query('''
                      SELECT *
                      FROM system.queries
                      WHERE issue_time >= now() - INTERVAL '1 day'
                      AND query_text LIKE '%select * from home%'
                      ''',
                    language='sql',
                    headers=[(b"iox-debug", b"true")],
                    mode="reader")
print("# system.queries schema\n")
print(reader.schema)
```

<!--pytest-codeblocks:expected-output-->

`system.queries` has the following schema:

```python
# system.queries schema

issue_time: timestamp[ns] not null
query_type: string not null
query_text: string not null
completed_duration: duration[ns]
success: bool not null
trace_id: string
```

_When listing measurements (tables) available within a namespace, some clients and query tools may include the `queries` table in the list of namespace tables._

`system.queries` reflects a process-local, in-memory, namespace-scoped query log.
The query log isn't shared across instances within the same deployment.
While this table may be useful for debugging and monitoring queries, keep the following in mind:

- Records stored in `system.queries` are volatile.
  - Records are lost on pod restarts.
  - Queries for one namespace can evict records from another namespace.
- Data reflects the state of a specific pod answering queries for the namespace----the log view is scoped to the requesting namespace and queries aren't leaked across namespaces.
  - A query for records in `system.queries` can return different results depending on the pod the request was routed to.

**Data retention:** System data can be transient and is deleted on pod restarts.
The log size per instance is limited and the log view is scoped to the requesting namespace.

### system.queries schema

- **system.queries** _(measurement)_
  - **fields**:
      - **issue_time**: timestamp when the query was issued
      - **query_type**: type (syntax: `sql`, `flightsql`, or `influxql`) of the query
      - **query_text**: query statement text
      - **success**: execution status (boolean) of the query
      - **completed_duration**: time (duration) that the query took to complete
      - **trace_id**: trace ID for debugging and monitoring events
