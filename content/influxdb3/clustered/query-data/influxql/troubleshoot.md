---
title: Troubleshoot InfluxQL errors
description: >
  Learn how to troubleshoot and fix common InfluxQL errors.
menu:
  influxdb3_clustered:
    name: Troubleshoot errors
    parent: Query with InfluxQL
weight: 230
---

Learn how to troubleshoot and fix common InfluxQL errors.

> [!Note]
> **Disclaimer:** This document does not contain an exhaustive list of all
> possible InfluxQL errors.

- [error: database name required](#error-database-name-required)
- [error parsing query: found ..., expected identifier at ...](#error-parsing-query-found--expected-identifier-at-)
- [error parsing query: mixing aggregate and non-aggregate queries is not supported](#error-parsing-query-mixing-aggregate-and-non-aggregate-queries-is-not-supported)
- [invalid operation: time and \*influxql.VarRef are not compatible](#invalid-operation-time-and-influxqlvarref-are-not-compatible)

## error: database name required

```
error: database name required
```

### Cause

The `database name required` error occurs when certain
[`SHOW` queries](/influxdb3/clustered/reference/influxql/show/)
do not specify a [database](/influxdb3/clustered/reference/glossary/#database)
in the query or with the query request.

For example, the following `SHOW` query doesn't specify the database and assumes
the `db` is not specified in the `/query` API request:

```sql
SHOW MEASUREMENTS
```

### Solution

To resolve this error, specify a database with your query request by doing one
of the following:

{{% code-placeholders "DATABASE_(NAME|TOKEN)" %}}

- Include an `ON` clause with the `SHOW` statement that specifies the database
  to query:

  ```sql
  SHOW MEASUREMENTS ON DATABASE_NAME
  ```

- If using the [InfluxDB v1 query API](/enterprise_influxdb/v1/tools/api/#query-string-parameters),
  Include the `db` query parameter in your request:

  ```sh
  curl --get https://{{< influxdb/host >}}/query \
    --header "Authorization: Bearer DATABASE_TOKEN" \
    --data-urlencode "db=DATABASE_NAME" \
    --data-urlencode "q=SHOW MEASUREMENTS"
  ```

{{% /code-placeholders %}}

**Related:**
[InfluxQL `SHOW` statements](/influxdb3/clustered/reference/influxql/show/),
[Explore your schema with InfluxQL](/influxdb3/clustered/query-data/influxql/explore-schema/)

---

## error parsing query: found ..., expected identifier at ...

```
error parsing query: found EXAMPLE, expected identifier at line 1, char 14
```

### Causes

This error occurs when InfluxDB anticipates an identifier in a query but doesn't find it.
Identifiers are tokens that refer to database names, retention policy names,
measurement names, field keys, and tag keys.

This error is generally caused by one of the following:

- [A required identifier is missing](#a-required-identifier-is-missing)
- [A string literal is used instead of an identifier](#a-string-literal-is-used-instead-of-an-identifier)
- [An InfluxQL keyword is used as an unquoted identifier](#an-influxql-keyword-is-used-as-an-unquoted-identifier)

#### A required identifier is missing

Some InfluxQL statements and clauses require identifiers to identify databases,
measurements, tags, or fields. If the statement is missing a required identifier,
the query returns the `expected identifier` error.

For example, the following query omits the measurement name from the
[`FROM` clause](/influxdb3/clustered/reference/influxql/select/#from-clause):

```sql
SELECT * FROM WHERE color = 'blue'
```

##### Solution

Update the query to include the expected identifier in the `FROM` clause that
identifies the measurement to query:

```sql
SELECT * FROM measurement_name WHERE color = 'blue'
```

#### A string literal is used instead of an identifier

In InfluxQL, string literals are wrapped in single quotes (`''`) while character
sequences wrapped in double quotes (`""`) are parsed as identifiers. If you use
single quotes to wrap an identifier, the identifier is parsed as a string
literal and returns the `expected identifier` error.

For example, the following query wraps the measurement name in single quotes:

```sql
SELECT * FROM 'measurement-name' WHERE color = 'blue'
```

Results in the following error:

```
error parsing query: found measurement-name, expected identifier at line 1, char 14
```

##### Solution

Update single-quoted identifiers to use double quotes so they are parsed as
identifiers and not as string literals.

```sql
SELECT * FROM "measurement-name" WHERE color = 'blue'
```

#### An InfluxQL keyword is used as an unquoted identifier

[InfluxQL keyword](/influxdb3/clustered/reference/influxql/#keywords)
are character sequences reserved for specific functionality in the InfluxQL syntax.
It is possible to use a keyword as an identifier, but the identifier must be
wrapped in double quotes (`""`).

> [!Note]
> While wrapping identifiers that are InfluxQL keywords in double quotes is an
> acceptable workaround, for simplicity, you should avoid using
> [InfluxQL keywords](/influxdb3/clustered/reference/influxql/#keywords)
> as identifiers.

```sql
SELECT duration FROM runs
```

Returns the following error:

```
error parsing query: found DURATION, expected identifier, string, number, bool at line 1, char 8
```

##### Solution

Double quote [InfluxQL keywords](/influxdb3/clustered/reference/influxql/#keywords)
when used as identifiers:

```sql
SELECT "duration" FROM runs
```

**Related:**
[InfluxQL keywords](/influxdb3/clustered/reference/influxql/#keywords),
[Query Language Documentation](/enterprise_influxdb/v1/query_language/)

---

## error parsing query: mixing aggregate and non-aggregate queries is not supported

```
error parsing query: mixing aggregate and non-aggregate queries is not supported
```

### Cause

The `mixing aggregate and non-aggregate` error occurs when a `SELECT` statement
includes both an [aggregate function](/influxdb3/clustered/reference/influxql/functions/aggregates/)
and a standalone [field key](/influxdb3/clustered/reference/glossary/#field-key) or
[tag key](/influxdb3/clustered/reference/glossary/#tag-key).

Aggregate functions return a single calculated value per group and column and
there is no obvious single value to return for any un-aggregated fields or tags.

For example, the following example queries two fields from the `home`
measurement--`temp` and `hum`. However, it only applies the aggregate function,
`MEAN` to the `temp` field.

```sql
SELECT MEAN(temp), hum FROM home
```

### Solution

To fix this error, apply an aggregate or selector function to each of the queried
fields:

```sql
SELECT MEAN(temp), MAX(hum) FROM home
```

**Related:**
[InfluxQL functions](/influxdb3/clustered/reference/influxql/functions/),
[Aggregate data with InfluxQL](/influxdb3/clustered/query-data/influxql/aggregate-select/)

---

## invalid operation: time and \*influxql.VarRef are not compatible

```
invalid operation: time and *influxql.VarRef are not compatible
```

### Cause

The `time and \*influxql.VarRef are not compatible` error occurs when
date-time strings are double-quoted in a query.
Date-time strings should be formatted as string literals and wrapped in single quotes (`''`).

For example:

{{% influxdb/custom-timestamps %}}
```sql
SELECT temp
FROM home
WHERE
  time >= "2022-01-01T08:00:00Z"
  AND time <= "2022-01-01T00:20:00Z"
```
{{% /influxdb/custom-timestamps %}}

Returns the following error:

```
invalid operation: time and *influxql.VarRef are not compatible
```

### Solution

To fix the error, wrap RFC3339 timestamps in single quotes rather than double quotes.

{{% influxdb/custom-timestamps %}}
```sql
SELECT temp
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T00:20:00Z'
```
{{% /influxdb/custom-timestamps %}}

**Related:**
[Query data within time boundaries](/influxdb3/clustered/query-data/influxql/basic-query/#query-data-within-time-boundaries),
[`WHERE` clause--Time ranges](/influxdb3/clustered/reference/influxql/where/#time-ranges),
[InfluxQL time syntax](/influxdb3/clustered/reference/influxql/time-and-timezone/#time-syntax)
