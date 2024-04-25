---
title: Other SQL operators
list_title: Other operators
description: >
  SQL supports other miscellaneous operators that perform various operations.
menu:
  influxdb_cloud_serverless:
    name: Other operators
    parent: Operators
weight: 305
list_code_example: |
  |    Operator    | Meaning                  | Example                                 | Result        |
  | :------------: | :----------------------- | :-------------------------------------- | :------------ |
  |     `\|\|`     | Concatenate strings      | `'Hello' \|\| ' world'`                 | `Hello world` |
  | `AT TIME ZONE` | Apply a time zone offset | _[View example](/influxdb/cloud-serverless/reference/sql/operators/other/#at-time-zone)_ |               |
---

SQL supports miscellaneous operators that perform various operations.

| Operator | Meaning             |                                             |
| :------: | :------------------ | :------------------------------------------ |
|  `\|\|`  | Concatenate strings | [{{< icon "link" >}}](#concatenate-strings) |

## || {#concatenate-strings}

The `||` operator concatenates two string operands into a single string.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 'Hello' || ' world' AS "Concatenated"
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Concatenated |
| :----------- |
| Hello world  |

{{% /flex-content %}}
{{< /flex >}}

## AT TIME ZONE

The `AT TIME ZONE` operator applies the offset of the specified time zone to a 
timestamp type and returns an updated UTC timestamp. Time zone offsets are
provided by the the operating system time zone database.

{{% note %}}
Timestamp types in InfluxDB always represent a UTC time. The returned timestamp
is a UTC timestamp adjusted for the offset of the specified time zone.
{{% /note %}}

```sql
SELECT
  '2024-01-01 00:00:00'::TIMESTAMP AT TIME ZONE 'America/Los_Angeles' AS 'UTC with TZ offset'
```

| UTC with TZ offset       |
| :----------------------- |
| 2024-01-01T08:00:00.000Z |
