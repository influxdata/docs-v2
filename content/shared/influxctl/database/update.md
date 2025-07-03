
The `influxctl database update` command updates a database's retention period,
table (measurement), or column limits in InfluxDB.

## Usage

<!-- pytest.mark.skip -->

```sh
influxctl database update [flags] <DATABASE_NAME>
```

## Arguments

| Argument          | Description                    |
| :---------------- | :----------------------------- |
| **DATABASE_NAME** | Name of the database to update |

## Flags

| Flag |                      | Description                                                                                                      |
| :--- | :------------------- | :--------------------------------------------------------------------------------------------------------------- |
|      | `--retention-period` | [Database retention period ](/influxdb3/version/admin/databases/#retention-periods)(default is `0s` or infinite) |
|      | `--max-tables`       | [Maximum tables per database](/influxdb3/version/admin/databases/#table-limit) (default is 500, 0 uses default)  |
|      | `--max-columns`      | [Maximum columns per table](/influxdb3/version/admin/databases/#column-limit) (default is 250, 0 uses default)   |
| `-h` | `--help`             | Output command help                                                                                              |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/version/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

- [Update a database's retention period](#update-a-databases-retention-period)
- [Update a database's table limit](#update-a-databases-table-limit)
- [Update a database's column limit](#update-a-databases-column-limit)

### Update a database's retention period

```sh
influxctl database update --retention-period 1mo mydb
```

{{< flex >}}
{{% flex-content "half" %}}

##### Valid durations units

- `m`: minute
- `h`: hour
- `d`: day
- `w`: week
- `mo`: month
- `y`: year

{{% /flex-content %}}
{{% flex-content "half" %}}

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
influxctl database update --max-tables 300 mydb
```

### Update a database's column limit

```sh
influxctl database update --max-columns 200 mydb
```
