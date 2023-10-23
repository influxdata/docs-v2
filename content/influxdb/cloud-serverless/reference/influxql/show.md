---
title: InfluxQL SHOW statements
description: >
  Use InfluxQL `SHOW` statements to query schema information from a bucket.
menu:
  influxdb_cloud_serverless:
    name: SHOW statements
    identifier: influxql-show-statements
    parent: influxql-reference
weight: 207
list_code_example: |
  ```sql
  SHOW [MEASUREMENTS | FIELD KEYS | TAG KEYS | TAG VALUES]
  ```
---

Use InfluxQL `SHOW` statements to query schema information from a bucket.

- [SHOW MEASUREMENTS](#show-measurements)
- [SHOW FIELD KEYS](#show-field-keys)
- [SHOW TAG KEYS](#show-tag-keys)
- [SHOW TAG VALUES](#show-tag-values)

## SHOW MEASUREMENTS

Use the `SHOW MEASUREMENTS` statement to list measurements in a bucket.

```sql
SHOW MEASUREMENTS [with_measurement_clause] [where_clause] [limit_clause] [offset_clause]
```

#### Examples

```sql
-- Show all measurements
SHOW MEASUREMENTS

-- Show measurements where region tag = 'uswest' AND host tag = 'serverA'
SHOW MEASUREMENTS WHERE "region" = 'uswest' AND "host" = 'serverA'

-- Show measurements that start with 'h2o'
SHOW MEASUREMENTS WITH MEASUREMENT =~ /h2o.*/
```

## SHOW FIELD KEYS

Use the `SHOW FIELD KEYS` statement to list all field keys in a measurement.

```sql
SHOW FIELD KEYS [from_clause]
```

#### Examples

```sql
-- Show field keys and field value data types from all measurements
SHOW FIELD KEYS

-- Show field keys and field value data types from specified measurement
SHOW FIELD KEYS FROM "cpu"
```

## SHOW TAG KEYS

Use the `SHOW TAG KEYS` statement to list tag keys in a measurement.

```sql
SHOW TAG KEYS [from_clause] [where_clause] [limit_clause] [offset_clause]
```

#### Examples

```sql
-- Show all tag keys
SHOW TAG KEYS

-- Show all tag keys from the cpu measurement
SHOW TAG KEYS FROM "cpu"

-- Show all tag keys from the cpu measurement where the region key = 'uswest'
SHOW TAG KEYS FROM "cpu" WHERE "region" = 'uswest'

-- Show all tag keys where the host key = 'serverA'
SHOW TAG KEYS WHERE "host" = 'serverA'
```

## SHOW TAG VALUES

Use the `SHOW TAG VALUES` statement to list values of specified tags in a bucket.

```sql
SHOW TAG VALUES [from_clause] WITH KEY = <tag-expression> [where_clause] [limit_clause] [offset_clause]
```

#### Examples

```sql
-- Show all tag values across all measurements for the region tag
SHOW TAG VALUES WITH KEY = "region"

-- Show tag values from the cpu measurement for the region tag
SHOW TAG VALUES FROM "cpu" WITH KEY = "region"

-- Show tag values across all measurements for all tag keys that do not include the letter c
SHOW TAG VALUES WITH KEY !~ /.*c.*/

-- Show tag values from the cpu measurement for region & host tag keys where service = 'redis'
SHOW TAG VALUES FROM "cpu" WITH KEY IN ("region", "host") WHERE "service" = 'redis'
```
