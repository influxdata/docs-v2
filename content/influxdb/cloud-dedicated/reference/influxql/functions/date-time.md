---
title: InfluxQL date and time functions
list_title: Date and time functions
description: >
  Use InfluxQL date and time functions to perform time-related operations.
menu:
  influxdb_cloud_dedicated:
    name: Date and time
    parent: influxql-functions
weight: 206
---

Use InfluxQL date and time functions to perform time-related operations.

- [now()](#now)
<!-- - [tz()](#tz) -->

## now()

Returns the current system time (UTC).
_Supported only in the [`WHERE` clause](/influxdb/cloud-dedicated/reference/influxql/where/)._

```sql
now()
```

<!-- ## tz()

Applies a timezone offset to timestamps in query results.
Offsets include any seasonal offset such as Daylight Savings Time (DST) or
British Summer Time (BST).
_Supported only in the [time zone clause](/influxdb/cloud-dedicated/reference/influxql/time-and-timezone/#time-zone-clause)._

```sql
tz(time_zone)
```

#### Arguments

- **time_zone**: Timezone string literal to adjust times to.
  Uses timezone names defined in the
  [Internet Assigned Numbers Authority time zone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List).

#### Examples {#tz-examples}

{{< expand-wrapper >}}

{{% expand "Return the UTC offset for Chicago's time zone" %}}

The following example uses the
[Get started home sensor sample dataset](/influxdb/cloud-dedicated/reference/sample-data/#get-started-home-sensor-data).

{{% influxdb/custom-timestamps %}}

```sql
SELECT *
FROM home
WHERE
  room = 'Kitchen'
  AND time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T12:00:00Z'
tz('America/Chicago')
```

{{% influxql/table-meta %}} 
name: home
{{% /influxql/table-meta %}} 

| time                      |  co |  hum | room    | temp |
| :------------------------ | --: | ---: | :------ | ---: |
| 2022-01-01T02:00:00-06:00 |   0 | 35.9 | Kitchen |   21 |
| 2022-01-01T03:00:00-06:00 |   0 | 36.2 | Kitchen |   23 |
| 2022-01-01T04:00:00-06:00 |   0 | 36.1 | Kitchen | 22.7 |
| 2022-01-01T05:00:00-06:00 |   0 |   36 | Kitchen | 22.4 |
| 2022-01-01T06:00:00-06:00 |   0 |   36 | Kitchen | 22.5 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{< /expand-wrapper >}} -->
