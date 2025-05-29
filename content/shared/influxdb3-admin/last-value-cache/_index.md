
The {{< product-name >}} Last Value Cache (LVC) lets you cache the most recent
values for specific fields in a table, improving the performance of queries that
return the most recent value of a field for specific series or the last N values
of a field.

The LVC is an in-memory cache that stores the last N number of values for
specific fields of series in a table. When you create an LVC, you can specify
what fields to cache, what tags to use to identify each series, and the
number of values to cache for each unique series.
An LVC is associated with a table, which can have multiple LVCs.

Caches import historical data when first created and reload data on restart.

{{< children type="anchored-list" >}}
- [Important things to know about the Last Value Cache](#important-things-to-know-about-the-last-value-cache)
  - [High cardinality key columns](#high-cardinality-key-columns)
  - [Value count](#value-count)
  {{% show-in "core" %}}
  - [Last Value Caches are flushed when the server stops](#last-value-caches-are-flushed-when-the-server-stops)
  {{% /show-in %}}
  - [Defining value columns](#defining-value-columns)

Consider a dataset with the following schema (similar to the
[home sensor sample dataset](/influxdb3/version/reference/sample-data/#home-sensor-data)):

- home (table)  
  - tags:  
    - room  
      - kitchen  
      - living room  
    - wall  
      - north  
      - east  
      - south  
  - fields:  
    - co (integer)  
    - temp (float)  
    - hum (float)  

If you cache the last value for each field per room and wall, the LVC looks
similar to this:

{{% influxdb/custom-timestamps %}}

| room        | wall  |  co |  hum | temp | time                 |
| :---------- | :---- | --: | ---: | ---: | :------------------- |
| Kitchen     | east  |  26 | 36.5 | 22.7 | 2022-01-01T20:00:00Z |
| Living Room | north |  17 | 36.4 | 22.2 | 2022-01-01T20:00:00Z |
| Living Room | south |  16 | 36.3 | 22.1 | 2022-01-01T20:00:00Z |

If you cache the last four values of each field per room and wall, the LVC looks
similar to the following:

| room        | wall  |  co |  hum | temp | time                |
| :---------- | :---- | --: | ---: | ---: | :------------------ |
| Kitchen     | east  |  26 | 36.5 | 22.7 | 2022-01-01T20:00:00Z |
| Kitchen     | east  |   9 | 36.0 | 22.7 | 2022-01-01T17:00:00Z |
| Kitchen     | east  |   3 | 36.2 | 22.7 | 2022-01-01T15:00:00Z |
| Kitchen     | east  |   0 | 36.1 | 22.7 | 2022-01-01T10:00:00Z |
| Living Room | north |  17 | 36.4 | 22.2 | 2022-01-01T20:00:00Z |
| Living Room | north |   5 | 35.9 | 22.6 | 2022-01-01T17:00:00Z |
| Living Room | north |   1 | 36.1 | 22.3 | 2022-01-01T15:00:00Z |
| Living Room | north |   0 | 36.0 | 21.8 | 2022-01-01T10:00:00Z |
| Living Room | south |  16 | 36.3 | 22.1 | 2022-01-01T20:00:00Z |
| Living Room | south |   4 | 35.8 | 22.5 | 2022-01-01T17:00:00Z |
| Living Room | south |   0 | 36.0 | 22.3 | 2022-01-01T15:00:00Z |
| Living Room | south |   0 | 35.9 | 21.8 | 2022-01-01T10:00:00Z |

{{% /influxdb/custom-timestamps %}}

> [!Note]
> #### Null column values
>
> _Null_ column values are still considered values and are cached in the LVC.
> If you write data to a table and don't provide a value for an existing column,
> the column value is cached as _null_.

{{< children hlevel="h2" >}}

## Important things to know about the Last Value Cache

LVCs are stored in memory; the larger the cache, the more memory your InfluxDB 3 node requires to
maintain it. Consider the following:

- [High cardinality key columns](#high-cardinality-key-columns)
- [Value count](#value-count)
{{% show-in "core" %}}
- [Last Value Caches are flushed when the server stops](#last-value-caches-are-flushed-when-the-server-stops)
{{% /show-in %}}lue-columns)

### High cardinality key columns

“Cardinality” refers to the number of unique key column combinations in your 
cached data. While the InfluxDB 3 storage engine is not limited by cardinality, 
it does affect the LVC. Higher cardinality increases memory requirements for 
storing the LVC and can affect LVC query performance. We recommend the 
following:

- Only use tags important to your query workload as key columns in the LVC. 
  Caching unnecessary tags or fields as key columns results in higher 
  cardinality without any benefit.
- Avoid including high-cardinality key columns in your LVC.
- Don’t include multiple high-cardinality key columns in your LVC.

To estimate total key column cardinality in an LVC, use the 
following equation:

```txt
num_uniq_col_val_N [× num_uniq_col_val_N …] = key_column_cardinality
```

### Value count

By increasing the number of values to store in the LVC, you increase the number 
of rows stored in the cache and the amount of memory required to store them. Be 
judicious with the number of values to store. This count is per unique key 
column combination. If you include two tags as key columns, one with three 
unique values and the other with 10, you could have up to 30 unique key column 
combinations. If you want to keep the last 10 values, you could potentially 
have 300+ rows in the cache.

To get an idea of the number of rows required to cache the specified number of 
values, use the following equation:

```txt
key_column_cardinality × count = number_of_rows
```

{{% show-in "core" %}}
### Last Value Caches are flushed when the server stops

Because the LVC is an in-memory cache, the cache is flushed any time the server 
stops. After a server restart, {{% product-name %}} only writes new values to the LVC when 
you write data, so there may be a period of time when some values are 
unavailable in the LVC.
{{% /show-in %}}

### Defining value columns

When creating an LVC, if you include the `--value-columns` options to specify 
which fields to cache as value columns, any new fields added in the future will 
not be added to the cache.

However, if you omit the `--value-columns` option, all columns other than those
specified as `--key-columns` are cached as value columns, including columns that
are added later.
