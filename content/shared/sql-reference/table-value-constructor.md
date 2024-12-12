The table value constructor (TVC) uses the `VALUES` keyword to specify a set of
row value expressions to construct into a table.
The TVC can be used in the `FROM` clause <!-- or `JOIN` clauses -->
to build an ad hoc table at query time.

```sql
VALUES (row_value_list)[,...n]
```

##### Arguments

- **row_value_list**:
  Comma-delimited list of column values.
  Enclose each list in parentheses and separate multiple lists with commas.
  Each list must have the same number of values and values must be in the same
  order as columns in the table.
  Each list must contain a value for each column.

## Usage

```sql
SELECT
  expression[,...n]
FROM
  (VALUES (row_value_list)[,...n]) [AS] table_name(column_name[,...n])
```

{{% note %}}
When using the TVC, the `AS` keyword is optional and implied when naming the
table and providing column names.
{{% /note %}}

## Examples

- [Select data from an ad hoc table](#select-data-from-an-ad-hoc-table)
<!-- - [Join data with an ad hoc table](#join-data-with-an-ad-hoc-table) -->

### Select data from an ad hoc table

```sql
SELECT *
FROM
  (VALUES ('2023-01-01 12:00:00'::TIMESTAMP, 1.23, 4.56),
          ('2023-01-01 13:00:00'::TIMESTAMP, 2.46, 8.1),
          ('2023-01-01 13:00:00'::TIMESTAMP, 4.81, 16.2)
  ) AS data(time, f1, f2)
```

| time                 |   f1 |   f2 |
| :------------------- | ---: | ---: |
| 2023-01-01T12:00:00Z | 1.23 | 4.56 |
| 2023-01-01T13:00:00Z | 2.46 |  8.1 |
| 2023-01-01T13:00:00Z | 4.81 | 16.2 |

<!-- ### Join data with an ad hoc table

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/version/get-started/write/#construct-line-protocol)._

```sql
SELECT
  home.time AS time,
  home.room AS room,
  roomData.id AS room_id
FROM
  home
INNER JOIN
  (VALUES ('Kitchen', 'abc123'),
          ('Living Room', 'def456'),
          ('Bedroom', 'ghi789')
  ) AS roomData(room,id)
ON home.room = roomData.room;
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}
{{% influxdb/custom-timestamps %}}

| time                 | room        | room_id |
| :------------------- | :---------- | :------ |
| 2022-01-01T08:00:00Z | Kitchen     | abc123  |
| 2022-01-01T09:00:00Z | Kitchen     | abc123  |
| 2022-01-01T10:00:00Z | Kitchen     | abc123  |
| 2022-01-01T11:00:00Z | Kitchen     | abc123  |
| 2022-01-01T12:00:00Z | Kitchen     | abc123  |
| 2022-01-01T13:00:00Z | Kitchen     | abc123  |
| 2022-01-01T14:00:00Z | Kitchen     | abc123  |
| 2022-01-01T15:00:00Z | Kitchen     | abc123  |
| 2022-01-01T16:00:00Z | Kitchen     | abc123  |
| 2022-01-01T17:00:00Z | Kitchen     | abc123  |
| 2022-01-01T18:00:00Z | Kitchen     | abc123  |
| 2022-01-01T19:00:00Z | Kitchen     | abc123  |
| 2022-01-01T20:00:00Z | Kitchen     | abc123  |
| 2022-01-01T08:00:00Z | Living Room | def456  |
| 2022-01-01T09:00:00Z | Living Room | def456  |
| 2022-01-01T10:00:00Z | Living Room | def456  |
| 2022-01-01T11:00:00Z | Living Room | def456  |
| 2022-01-01T12:00:00Z | Living Room | def456  |
| 2022-01-01T13:00:00Z | Living Room | def456  |
| 2022-01-01T14:00:00Z | Living Room | def456  |
| 2022-01-01T15:00:00Z | Living Room | def456  |
| 2022-01-01T16:00:00Z | Living Room | def456  |
| 2022-01-01T17:00:00Z | Living Room | def456  |
| 2022-01-01T18:00:00Z | Living Room | def456  |
| 2022-01-01T19:00:00Z | Living Room | def456  |
| 2022-01-01T20:00:00Z | Living Room | def456  |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{< /expand-wrapper >}} -->
