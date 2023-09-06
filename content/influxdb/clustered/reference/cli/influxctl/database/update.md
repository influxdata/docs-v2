---
title: influxctl database update
description: >
  The `influxctl database update` command updates a database's retention period,
  tables, or columns.
menu:
  influxdb_clustered:
    parent: influxctl database
weight: 301
---

The `influxctl database update` command updates a database's retention period,
table (measurement), or column limits in InfluxDB.

## Usage

```sh
influxctl database update <DATABASE_NAME> [flags]
```

## Arguments

| Argument          | Description                    |
| :---------------- | :----------------------------- |
| **DATABASE_NAME** | Name of the database to update |

## Flags

| Flag |                      | Description                                                  |
| :--- | :------------------- | :----------------------------------------------------------- |
|      | `--retention-period` | Database retention period (default is 0s or infinite)        |
|      | `--max-tables`       | Maximum tables per database (default is 500, 0 uses default) |
|      | `--max-columns`      | Maximum columns per table (default is 250, 0 uses default)   |
| `-h` | `--help`             | Output command help                                          |

## Examples

- [Update a database's retention period](#update-a-databases-retention-period)
- [Update a database's table limit](#update-a-databases-table-limit)
- [Update a database's column limit](#update-a-databases-column-limit)

### Update a database's retention period

```sh
influxctl database update mydb --retention-period 1mo
```

{{< flex >}}
{{% flex-content %}}

##### Valid durations units

- `m`: minute
- `h`: hour
- `d`: day
- `w`: week
- `mo`: month
- `y`: year

{{% /flex-content %}}
{{% flex-content %}}

##### Example retention period values

- `0d`: infinite/none
- `3d`: 3 days
- `6w`: 6 weeks
- `1mo`: 1 month (30 days)
- `1y`: 1 year
- `30d30d`: 60 days
- `2.5d`: 60 hours

{{% /flex-content %}}
{{< /flex >}}

### Update a database's table limit

```sh
influxctl database update mydb --max-tables 300
```

### Update a database's column limit

```sh
influxctl database update mydb --max-columns 200
```
