Use `LIMIT` to limit the number of **rows** returned per InfluxQL group.
Use `SLIMIT` to limit the number of [series](/influxdb/version/reference/glossary/#series)
returned in query results.

- [LIMIT clause](#limit-clause)  
  - [Syntax](#limit-syntax)
  - [Examples](#limit-examples)
- [SLIMIT clause](#slimit-clause)  
  <!-- - [Syntax](#slimit-syntax) -->
  <!-- - [Examples](#slimit-examples) -->
<!-- - [Use LIMIT and SLIMIT together](#use-limit-and-slimit-together) -->
  <!-- - [Syntax](#limit-slimit-syntax) -->
  <!-- - [Examples](#limit-slimit-examples) -->

## LIMIT clause

The `LIMIT` clause limits the number of rows to return from each InfluxQL group.
If the query doesn't include a [`GROUP BY` clause](/influxdb/version/reference/influxql/group-by/),
the entire result set is considered a single group.
If a query [groups data by time](/influxdb/version/reference/influxql/group-by/#group-by-time),
limits are applied after aggregate and selector operations are applied to each
time window.

### Syntax {#limit-syntax}

```sql
SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] LIMIT N
```

#### Arguments

- **N**: Maximum number of points to return from each InfluxQL group.
  If `N` is greater than the number of points in a group, 
  all points from the group are returned.

### Examples {#limit-examples}

The following examples use the
[Get started home sensor sample data](/influxdb/version/reference/sample-data/#get-started-home-sensor-data).

{{< expand-wrapper >}}

{{% expand "Limit the number of rows returned" %}}

```sql
SELECT * FROM home LIMIT 3
```

{{% influxql/table-meta %}}
Name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 |  co |  hum | room        | temp |
| :------------------- | --: | ---: | :---------- | ---: |
| 2022-01-01T08:00:00Z |   0 | 35.9 | Kitchen     |   21 |
| 2022-01-01T08:00:00Z |   0 | 35.9 | Living Room | 21.1 |
| 2022-01-01T09:00:00Z |   0 | 36.2 | Kitchen     |   23 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Limit the number of rows returned from each InfluxQL group" %}}

```sql
SELECT
  MEAN(*)
FROM home
GROUP BY
  time(2h),
  room
LIMIT 3
```

{{% influxdb/custom-timestamps %}}
{{% influxql/table-meta %}}
name: home  
tags: room=Kitchen
{{% /influxql/table-meta %}}

| time                 | mean_co | mean_hum |          mean_temp |
| :------------------- | ------: | -------: | -----------------: |
| 2022-01-01T08:00:00Z |       0 |    36.05 |                 22 |
| 2022-01-01T10:00:00Z |       0 |    36.05 | 22.549999999999997 |
| 2022-01-01T12:00:00Z |     0.5 |    36.25 |              22.65 |

{{% influxql/table-meta %}}
name: home  
tags: room=Living Room
{{% /influxql/table-meta %}}

| time                 | mean_co | mean_hum |          mean_temp |
| :------------------- | ------: | -------: | -----------------: |
| 2022-01-01T08:00:00Z |       0 |     35.9 |              21.25 |
| 2022-01-01T10:00:00Z |       0 |       36 |                 22 |
| 2022-01-01T12:00:00Z |       0 |    35.95 | 22.299999999999997 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{< /expand-wrapper >}}

## SLIMIT clause

> [!Important]
> InfluxQL is being rearchitected to work with the InfluxDB 3 storage engine.
> This process is ongoing and some InfluxQL features, such as `SLIMIT` are still
> being implemented. For more information, see
> [InfluxQL feature support](/influxdb/version/reference/influxql/feature-support/).

<!-- The `SLIMIT` clause limits the number of [series](/influxdb/version/reference/glossary/#series)
to return in query results.

> [!Note]
> For meaningful results, queries that include the `SLIMIT` clause should also
> include the [`GROUP BY` clause](/influxdb/version/reference/influxql/group-by/) that
> [groups by tags](/influxdb/version/reference/influxql/group-by/#group-by-tags-examples).
> Without grouping data by tags, all results are treated as a single series and
> `SLIMIT` returns the full queried result set.

### Syntax {#slimit-syntax}

```sql
SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] SLIMIT N
```

If the query includes a [`LIMIT` clause](#limit-clause), the `SLIMIT` clause
must come **after** the `LIMIT` clause.
See [Use LIMIT and SLIMIT together](#use-limit-and-slimit-together).

#### Arguments

- **N**: Maximum number of series to return in query results.
  If `N` is greater than the number of series in a measurement, the query
  returns all series.

### Examples {#slimit-examples}

{{< expand-wrapper >}}

{{% expand "Limit the number of series returned" %}}

The following example uses the
[Bitcoin price sample data](/influxdb/version/reference/sample-data/#bitcoin-price-data).

```sql
SELECT * FROM bitcoin GROUP BY * SLIMIT 2
```
 
 {{% influxql/table-meta %}}
name: bitcoin  
tags: code=EUR, crypto=bitcoin, description=Euro, symbol=&euro;
{{% /influxql/table-meta %}}

| time                 |      price |
| :------------------- | ---------: |
| 2023-05-01T00:19:00Z | 28561.8722 |
| 2023-05-01T00:48:00Z |  28549.727 |
| 2023-05-01T01:31:00Z | 28506.7155 |
| 2023-05-01T02:07:00Z | 27861.4404 |
| 2023-05-01T02:26:00Z | 27864.0643 |
| ...                  |        ... |

{{% influxql/table-meta %}}
name: bitcoin  
tags: code=GBP, crypto=bitcoin, description=British Pound Sterling, symbol=&pound;
{{% /influxql/table-meta %}}

| time                 |      price |
| :------------------- | ---------: |
| 2023-05-01T00:19:00Z | 24499.4816 |
| 2023-05-01T00:48:00Z | 24489.0637 |
| 2023-05-01T01:31:00Z | 24452.1698 |
| 2023-05-01T02:07:00Z |  23898.673 |
| 2023-05-01T02:26:00Z | 23900.9237 |
| ...                  |        ... |
{{% /expand %}}

{{< /expand-wrapper >}}

## Use LIMIT and SLIMIT together

Using the `LIMIT` clause and the `SLIMIT` clause together returns the specified
maximum number of rows from the specified maximum number of series in query results.

### Syntax {#limit-slimit-syntax}

```sql
SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] LIMIT row_N SLIMIT series_N
```

In queries that include both the `LIMIT` clause and the `SLIMIT` clause,
the `LIMIT` clause must come **first**.

#### Arguments

- **row_N**: Maximum number of points to return from each InfluxQL group.
  If `row_N` is greater than the number of points in a group, 
  all points from the group are returned.
- **series_N**: Maximum number of series to return in query results.
  If `series_N` is greater than the number of series in a measurement, the query
  returns all series.

### Examples {#limit-slimit-examples}

{{< expand-wrapper >}}

{{% expand "Limit the number of rows and series returned" %}}

The following example uses the
[Bitcoin price sample data](/influxdb/version/reference/sample-data/#bitcoin-price-data).

```sql
SELECT * FROM bitcoin GROUP BY * LIMIT 3 SLIMIT 2
```

{{% influxql/table-meta %}}
name: bitcoin  
tags: code=EUR, crypto=bitcoin, description=Euro, symbol=&euro;
{{% /influxql/table-meta %}}

| time                 |      price |
| :------------------- | ---------: |
| 2023-05-01T00:19:00Z | 28561.8722 |
| 2023-05-01T00:48:00Z |  28549.727 |
| 2023-05-01T01:31:00Z | 28506.7155 |

{{% influxql/table-meta %}}
name: bitcoin  
tags: code=GBP, crypto=bitcoin, description=British Pound Sterling, symbol=&pound;
{{% /influxql/table-meta %}}

| time                 |      price |
| :------------------- | ---------: |
| 2023-05-01T00:19:00Z | 24499.4816 |
| 2023-05-01T00:48:00Z | 24489.0637 |
| 2023-05-01T01:31:00Z | 24452.1698 |

{{% /expand %}}

{{< /expand-wrapper >}} -->
