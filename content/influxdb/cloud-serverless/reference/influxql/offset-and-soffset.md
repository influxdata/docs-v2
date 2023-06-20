---
title: OFFSET and SOFFSET clauses
description: >
  Use `OFFSET` to specify the number of [rows](/influxdb/cloud-serverless/reference/glossary/#series)
  to skip in each InfluxQL group before returning results.
  Use `SOFFSET` to specify the number of [series](/influxdb/cloud-serverless/reference/glossary/#series)
  to skip before returning results.
menu:
  influxdb_cloud_serverless:
    name: OFFSET and SOFFSET clauses
    parent: influxql-reference
weight: 207
list_code_example: |
  ```sql
  SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] OFFSET row_N [SLIMIT_clause] SOFFSET series_N
  ```
---

Use `OFFSET` to specify the number of [rows](/influxdb/cloud-serverless/reference/glossary/#series)
to skip in each InfluxQL group before returning results.
Use `SOFFSET` to specify the number of [series](/influxdb/cloud-serverless/reference/glossary/#series)
to skip before returning results.

  - [OFFSET clause](#offset-clause)
     - [Syntax](#offset-syntax)
     - [Notable OFFSET clause behaviors](#notable-offset-clause-behaviors)
     - [Examples](#offset-examples)
  - [SOFFSET clause](#soffset-clause)
     <!-- - [Syntax](#soffset-syntax) -->
     <!-- - [Notable SOFFSET clause behaviors](#notable-soffset-clause-behaviors) -->
     <!-- - [Examples](#soffset-examples) -->

## `OFFSET` clause

The `OFFSET` clause skips `N` rows in each InfluxQL group before returning results.
Offsets honor row limits specified in the
[`LIMIT` clause](/influxdb/cloud-serverless/reference/influxql/limit-and-slimit/#limit-clause)
and display the limited number of rows after the specified offset.
Use `LIMIT` and `OFFSET` together to paginate query results.

### Syntax {#offset-syntax}

```sql
SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] OFFSET N [SLIMIT_clause] [SOFFSET_clause]
```

#### Arguments 

- **N**: Number of rows to skip in each InfluxQL group before returning results. 

### Notable OFFSET clause behaviors

- If there is no `LIMIT` clause in a query with an `OFFSET` clause, the query
  returns a single row per InfluxQL group at the specified offset.
- If the query doesn't include a [`GROUP BY` clause](/influxdb/cloud-serverless/reference/influxql/group-by/),
  the entire result set is considered a single group and is returned in full.
- If a query [groups data by time](/influxdb/cloud-serverless/reference/influxql/group-by/#group-by-time),
  the offset is applied after aggregate and selector operations are applied to each
  time window.
- If the [`WHERE` clause](/influxdb/cloud-serverless/reference/influxql/where/)
  includes a time range and the `OFFSET` clause causes InfluxQL to return points
  with timestamps outside of that time range, InfluxQL returns no results.

### Examples {#offset-examples}

The following examples use the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

{{< expand-wrapper >}}

{{% expand "Return the nth row" %}}

```sql
SELECT * FROM home OFFSET 3
```

{{% influxql/table-meta %}}
Name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 |  co |  hum | room        | temp |
| :------------------- | --: | ---: | :---------- | ---: |
| 2022-01-01T09:00:00Z |   0 | 35.9 | Living Room | 21.4 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Paginate results by 3 and return the 2nd page of results" %}}

```sql
SELECT * FROM home WHERE room = 'Kitchen' LIMIT 3 OFFSET 3
```

{{% influxql/table-meta %}}
Name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 |  co |  hum | room    | temp |
| :------------------- | --: | ---: | :------ | ---: |
| 2022-01-01T11:00:00Z |   0 |   36 | Kitchen | 22.4 |
| 2022-01-01T12:00:00Z |   0 |   36 | Kitchen | 22.5 |
| 2022-01-01T13:00:00Z |   1 | 36.5 | Kitchen | 22.8 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Paginate results from each series by 3 and return the 2nd page of each series" %}}

```sql
SELECT * FROM home GROUP BY * LIMIT 3 OFFSET 3
```

{{% influxdb/custom-timestamps %}}

{{% influxql/table-meta %}}
name: home  
tags: room=Kitchen
{{% /influxql/table-meta %}}

| time                 |  co |  hum | temp |
| :------------------- | --: | ---: | ---: |
| 2022-01-01T11:00:00Z |   0 |   36 | 22.4 |
| 2022-01-01T12:00:00Z |   0 |   36 | 22.5 |
| 2022-01-01T13:00:00Z |   1 | 36.5 | 22.8 |

{{% influxql/table-meta %}}
name: home  
tags: room=Living Room
{{% /influxql/table-meta %}}

| time                 |  co |  hum | temp |
| :------------------- | --: | ---: | ---: |
| 2022-01-01T11:00:00Z |   0 |   36 | 22.2 |
| 2022-01-01T12:00:00Z |   0 | 35.9 | 22.2 |
| 2022-01-01T13:00:00Z |   0 |   36 | 22.4 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{< /expand-wrapper >}}

## `SOFFSET` clause

{{% warn %}}
InfluxQL is being rearchitected to work with the InfluxDB IOx storage engine.
This process is ongoing and some InfluxQL features, such as `SOFFSET` are still
being implemented. For more information, see
[InfluxQL feature support](/influxdb/cloud-serverless/reference/influxql/feature-support/).
{{% /warn %}}

<!-- The `SOFFSET` clause skips `N` [series](/influxdb/cloud-serverless/reference/glossary/#series)
before returning results.
Offsets honor series limits specified in the
[`SLIMIT` clause](/influxdb/cloud-serverless/reference/influxql/limit-and-slimit/#slimit-clause)
and display the limited number of series after the specified offset.
Use `SLIMIT` and `SOFFSET` together to paginate grouped query results.

The `SOFFSET` clause requires these other clauses:

- [`SLIMIT` clause](/influxdb/cloud-serverless/reference/influxql/limit-and-slimit/#slimit-clause)
- [`GROUP BY` clause](/influxdb/cloud-serverless/reference/influxql/group-by/) that
  [groups by tags](/influxdb/cloud-serverless/reference/influxql/group-by/#group-by-tags-examples)

### Syntax {#soffset-syntax}

```sql
SELECT_clause FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] SLIMIT_clause SOFFSET N
```

#### Arguments 

- **N**: Number of [series](/influxdb/cloud-serverless/reference/glossary/#series)
  to skip before returning results. 

{{% note %}}
**Note:**

{{% /note %}}

### Notable SOFFSET clause behaviors

- If there is no `SLIMIT` clause in a query with an `SOFFSET` clause, the query
  returns no results.
- If the query doesn't include a [`GROUP BY` clause](/influxdb/cloud-serverless/reference/influxql/group-by/),
  the query returns no results.
- If the `SOFFSET` clause skips more than the total number of series, the query
  returns no results.

### Examples {#soffset-examples}

The following examples use the
[Bitcoin price sample data](/influxdb/cloud-serverless/reference/sample-data/#bitcoin-price-data).

{{< expand-wrapper >}}

{{% expand "Return the 2nd series" %}}

```sql
SELECT * FROM bitcoin GROUP BY * SLIMIT 1 SOFFSET 1
```

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

{{% expand "Paginate series by 2 and return the 2nd page of results" %}}

```sql
SELECT * FROM bitcoin GROUP BY * 2 SOFFSET 2
```

{{% note %}}
Because the **Bitcoin price sample data** contains only 3 series, when paginating
by 2, the 2nd "page" contains only one series.
{{% /note %}}

{{% influxql/table-meta %}}
name: bitcoin  
tags: code=USD, crypto=bitcoin, description=United States Dollar, symbol=&#36;
{{% /influxql/table-meta %}}

| time                 |      price |
| :------------------- | ---------: |
| 2023-05-01T00:19:00Z | 29319.9092 |
| 2023-05-01T00:48:00Z | 29307.4416 |
| 2023-05-01T01:31:00Z | 29263.2886 |
| 2023-05-01T02:07:00Z | 28600.8878 |
| 2023-05-01T02:26:00Z | 28603.5813 |
| ...                  |        ... |

{{% /expand %}}

{{< /expand-wrapper >}} -->
