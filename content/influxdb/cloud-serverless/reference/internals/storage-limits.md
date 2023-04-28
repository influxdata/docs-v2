---
title: IOx storage engine limits
description: >
  The InfluxDB IOx storage enforces specific limits on the storage level.
menu:
  influxdb_cloud_serverless:
    name: IOx storage limits
    parent: InfluxDB Cloud internals
weight: 201
---

The InfluxDB IOx storage enforces specific limits on the storage level.

- [Terminology](#terminology)
- [Service-level limits](#service-level-limits)
- [Error messages](#error-messages)

## Terminology

- **namespace**: organization+bucket
- **table**: [measurement](/influxdb/cloud-serverless/reference/glossary/#measurement)
- **column**: time, tags and fields are structured as columns

## Service-level limits

The IOx storage engine enforces the following storage-level limits:

- **Maximum number of tables per namespace**: 500
- **Maximum number of columns per table**: 200

{{% note %}}
IOx storage service-level limits are configurable per _namespace_.
To adjust your service-level limits, [contact InfluxData Support](https://support.influxdata.com).
{{% /note %}}

## Error messages

### Maximum number of columns reached

```
couldn't create columns in table `table_name`; table contains
<N> existing columns, applying this write would result
in <N+> columns, limit is 200
```

This error is returned for any write request that would exceed the maximum
number of columns allowed in a table.

#### Potential solutions

- Consider storing new fields in a new measurement.
- [Contact InfluxData Support](https://support.influxdata.com) to delete any
  unnecessary data.

### Maximum number of tables reached

```
dml handler error: service limit reached: couldn't create new table; namespace contains <N> existing
tables, applying this write would result in <N+> columns, limit is 500
```

This error is returned for any write request that would exceed the maximum
number of tables allowed in a namespace.
