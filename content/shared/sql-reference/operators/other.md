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

The `AT TIME ZONE` operator takes the timestamp in the left operand and returns
an equivalent timestamp with the updated time and offset of the time zone
specified in the right operand.
If no time zone is included in the input timestamp's
[Arrow data type](/influxdb/version/reference/sql/data-types/#sql-and-arrow-data-types),
the operator assumes the time is in the time zone specified.
Time zone offsets are provided by the operating system time zone database.

```sql
SELECT time AT TIME ZONE 'America/Los_Angeles' FROM home
```

{{< expand-wrapper >}}
{{% expand "Convert a UTC timestamp to a specified timezone" %}}

```sql
SELECT
  arrow_cast('2024-01-01 00:00:00', 'Timestamp(Nanosecond, Some("UTC"))')
  AT TIME ZONE 'America/Los_Angeles' AS 'Time with TZ offset'
```

| Time with TZ offset       |
| :------------------------ |
| 2023-12-31T16:00:00-08:00 |

{{% /expand %}}
{{% expand "Add a time zone offset to a timestamp without a specified timezone" %}}

```sql
SELECT
  '2024-01-01 00:00:00' AT TIME ZONE 'America/Los_Angeles' AS 'Local time with TZ offset'
```

| Local time with TZ offset |
| :------------------------ |
| 2024-01-01T00:00:00-08:00 |

{{% /expand %}}
{{< /expand-wrapper >}}
