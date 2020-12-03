---
title: Delete predicate syntax
list_title: Delete predicate
description: >
  The InfluxDB `/api/v2/delete` endpoint uses an InfluxQL-like predicate syntax
  to determine what data points to delete.
menu:
  influxdb_2_0_ref:
    parent: Syntax
    name: Delete predicate
weight: 104
influxdb/v2.0/tags: [syntax, delete]
related:
  - /influxdb/v2.0/write-data/delete-data/
  - /influxdb/v2.0/reference/cli/influx/delete/
---

The InfluxDB `/api/v2/delete` endpoint uses an InfluxQL-like predicate syntax to
determine what data [points](/influxdb/v2.0/reference/glossary/#point) to delete.
InfluxDB uses the delete predicate to evaluate the [series keys](/influxdb/v2.0/reference/glossary/#series-key)
of points in the time range specified in the delete request.
Points with series keys that evaluate to `true` for the given predicate are deleted.
Points with series keys that evaluate to `false` are preserved.

A delete predicate is comprised of one or more [predicate expressions](/influxdb/v2.0/reference/glossary/#predicate-expression).
The left operand of the predicate expression is the column name.
The right operand is the column value.
Operands are compared using [comparison operators](#comparison-operators).
Use [logical operators](#logical-operators) to combine two or more predicate expressions.

##### Example delete predicate
```sql
key1="value1" AND key2="value"
```
{{% note %}}
Predicate expressions can use any column or tag except `_time` or `_value`.
{{% /note %}}

## Logical operators
Logical operators join two or more predicate expressions.

| Operator | Description                                                                  |
|:-------- |:-----------                                                                  |
| `AND`    | Both left and right operands must be `true` for the expression to be `true`. |

## Comparison operators
Comparison operators compare left and right operands and return `true` or `false`.

| Operator | Description  | Example        | Result |
|:-------- |:-----------  |:-------:       |:------:|
| `=`      | Equal to     | `"abc"="abc"`  | `true` |

## Delete predicate examples

### Delete points with a specific measurement
The following will delete points in the `sensorData` measurement:

```sql
_measurement="sensorData"
```

### Delete points with a specific field
The following will delete points with the `temperature` field:

```sql
_field="temperature"
```

### Delete points with a specific tag set
The following will delete points from the `prod-1.4` host in the `us-west` region:

```sql
host="prod-1.4" AND region="us-west"
```

## Limitations
The delete predicate syntax has the following limitations.

- Delete predicates do not support regular expressions.
- Delete predicates do not support the `OR` logical operator.
- Delete predicates only support equality (`=`), not inequality (`!=`).
- Delete predicates can use any column or tag except `_time` or `_value`.
