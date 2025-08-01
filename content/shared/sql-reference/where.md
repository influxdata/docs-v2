Use the `WHERE` clause to filter results based on fields, tags, or timestamps.

- [Syntax](#syntax)
- [Examples](#examples)

## Syntax

```sql
SELECT_clause FROM_clause WHERE <conditional_expression> [(AND|OR) <conditional_expression> [...]]
```

> [!Note]
> **Note:** Unlike InfluxQL, SQL **supports** `OR` in the `WHERE` clause to
> specify multiple conditions, including time ranges.

## Examples

Note that single quotes are required for string literals in the `WHERE` clause. 

### Filter data based on field values

```sql
SELECT * 
FROM "h2o_feet" 
WHERE "water_level" >= 9.78
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}

The query returns data from the `h2o_feet` measurement with `water_level` field values
that are greater than or equal to 9.78.

| level description         | location     | time                     | water_level |
| :------------------------ | :----------- | :----------------------- | :---------- |
| at or greater than 9 feet | coyote_creek | 2019-09-01T23:06:00.000Z | 9.8         |
| at or greater than 9 feet | coyote_creek | 2019-09-01T23:12:00.000Z | 9.829       |
| at or greater than 9 feet | coyote_creek | 2019-09-01T23:18:00.000Z | 9.862       |
| at or greater than 9 feet | coyote_creek | 2019-09-01T23:24:00.000Z | 9.892       |
| at or greater than 9 feet | coyote_creek | 2019-09-01T23:30:00.000Z | 9.902       |
| at or greater than 9 feet | coyote_creek | 2019-09-01T23:36:00.000Z | 9.898       |

{{% /expand %}}
{{< /expand-wrapper >}}


### Filter data based on specific tag and field values

```sql
SELECT * 
FROM "h2o_feet" 
WHERE "location" = 'santa_monica' and "level description" = 'below 3 feet' 
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}

The query returns all data from the `h2o_feet` measurement with the `location` tag key, `santa_monica`,
and a `level description` field value that equals `below 3 feet`.

| level description | location     | time                     | water_level |
| :---------------- | :----------- | :----------------------- | :---------- |
| below 3 feet      | santa_monica | 2019-09-01T00:00:00.000Z | 1.529       |
| below 3 feet      | santa_monica | 2019-09-01T00:06:00.000Z | 1.444       |
| below 3 feet      | santa_monica | 2019-09-01T00:12:00.000Z | 1.335       |
| below 3 feet      | santa_monica | 2019-09-01T00:18:00.000Z | 1.345       |
| below 3 feet      | santa_monica | 2019-09-01T00:24:00.000Z | 1.27        |

{{% /expand %}}
{{< /expand-wrapper >}}

###  Filter data within a specific time period

```sql
SELECT *
FROM h2o_feet 
WHERE "location" = 'santa_monica'
AND "time" >= '2019-08-19T12:00:00Z' AND "time" <= '2019-08-19T13:00:00Z'
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}

The query returns results with timestamps greater than or equal to `08-19-2019T12:00:00Z` and
less than or equal to  `08-19-2019T13:00:00Z`.

| level description | location     | time                     | water_level |
| :---------------- | :----------- | :----------------------- | :---------- |
| below 3 feet      | santa_monica | 2019-08-19T12:00:00.000Z | 2.533       |
| below 3 feet      | santa_monica | 2019-08-19T12:06:00.000Z | 2.543       |
| below 3 feet      | santa_monica | 2019-08-19T12:12:00.000Z | 2.385       |
| below 3 feet      | santa_monica | 2019-08-19T12:18:00.000Z | 2.362       |
| below 3 feet      | santa_monica | 2019-08-19T12:24:00.000Z | 2.405       |
| below 3 feet      | santa_monica | 2019-08-19T12:30:00.000Z | 2.398       |

{{% /expand %}}
{{< /expand-wrapper >}}

### Filter data by dynamic date ranges

Use date and time functions to filter data by relative time periods that automatically update.

#### Get data from yesterday

```sql
SELECT *
FROM h2o_feet 
WHERE "location" = 'santa_monica'
  AND time >= DATE_TRUNC('day', NOW() - INTERVAL '1 day') 
  AND time < DATE_TRUNC('day', NOW())
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}

This query filters data to include only records from the previous calendar day:

- `NOW() - INTERVAL '1 day'` calculates yesterday's timestamp
- `DATE_TRUNC('day', ...)` truncates to the start of that day (00:00:00)
- The range spans from yesterday at 00:00:00 to today at 00:00:00

| level description | location     | time                     | water_level |
| :---------------- | :----------- | :----------------------- | :---------- |
| below 3 feet      | santa_monica | 2019-08-18T12:00:00.000Z | 2.533       |
| below 3 feet      | santa_monica | 2019-08-18T12:06:00.000Z | 2.543       |
| below 3 feet      | santa_monica | 2019-08-18T12:12:00.000Z | 2.385       |
| below 3 feet      | santa_monica | 2019-08-18T12:18:00.000Z | 2.362       |
| below 3 feet      | santa_monica | 2019-08-18T12:24:00.000Z | 2.405       |
| below 3 feet      | santa_monica | 2019-08-18T12:30:00.000Z | 2.398       |

{{% /expand %}}
{{< /expand-wrapper >}}

#### Get data from the last 24 hours

```sql
SELECT *
FROM h2o_feet 
WHERE time >= NOW() - INTERVAL '1 day'
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}

This query returns data from exactly 24 hours before the current time. Unlike the "yesterday" example, this creates a rolling 24-hour window that moves with the current time.

| level description | location     | time                     | water_level |
| :---------------- | :----------- | :----------------------- | :---------- |
| below 3 feet      | santa_monica | 2019-08-18T18:00:00.000Z | 2.120       |
| below 3 feet      | santa_monica | 2019-08-18T18:06:00.000Z | 2.028       |
| below 3 feet      | santa_monica | 2019-08-18T18:12:00.000Z | 1.982       |
| below 3 feet      | santa_monica | 2019-08-19T06:00:00.000Z | 1.825       |
| below 3 feet      | santa_monica | 2019-08-19T06:06:00.000Z | 1.753       |
| below 3 feet      | santa_monica | 2019-08-19T06:12:00.000Z | 1.691       |

{{% /expand %}}
{{< /expand-wrapper >}}

#### Get data from the current week

```sql
SELECT *
FROM h2o_feet 
WHERE time >= DATE_TRUNC('week', NOW())
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}

This query returns all data from the start of the current week (Monday at 00:00:00) to the current time. The DATE_TRUNC('week', NOW()) function truncates the current timestamp to the beginning of the week.

| level description | location     | time                     | water_level |
| :---------------- | :----------- | :----------------------- | :---------- |
| below 3 feet      | santa_monica | 2019-08-12T00:00:00.000Z | 2.064       |
| below 3 feet      | santa_monica | 2019-08-14T09:30:00.000Z | 2.116       |
| below 3 feet      | santa_monica | 2019-08-16T15:45:00.000Z | 1.952       |
| below 3 feet      | santa_monica | 2019-08-18T12:00:00.000Z | 2.533       |
| below 3 feet      | santa_monica | 2019-08-18T18:00:00.000Z | 2.385       |
| below 3 feet      | santa_monica | 2019-08-19T10:30:00.000Z | 1.691       |

{{% /expand %}}
{{< /expand-wrapper >}}

### Filter data using the OR operator

```sql
SELECT *
FROM "h2o_feet"
WHERE "level description" = 'less than 3 feet' OR "water_level" < 2.5
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}

The query returns results with a `level description` field value equal to `less than 3 feet` or a `water_level` field value less than 2.5.

| level description | location     | time                     | water_level |
| :---------------- | :----------- | :----------------------- | :---------- |
| below 3 feet      | coyote_creek | 2019-08-25T10:06:00.000Z | 2.398       |
| below 3 feet      | coyote_creek | 2019-08-25T10:12:00.000Z | 2.234       |
| below 3 feet      | coyote_creek | 2019-08-25T10:18:00.000Z | 2.064       |
| below 3 feet      | coyote_creek | 2019-08-25T10:24:00.000Z | 1.893       |

{{% /expand %}}
{{< /expand-wrapper >}}
