
The {{< product-name >}} Distinct Value Cache (DVC) lets you cache distinct
values of one or more columns in a table, improving the performance of
queries that return distinct tag and field values. 

The DVC is an in-memory cache that stores distinct values for specific columns
in a table. When you create a DVC, you can specify what columns' distinct
values to cache, the maximum number of distinct value combinations to cache, and
the maximum age of cached values. A DVC is associated with a table, which can
have multiple DVCs.

{{< children type="anchored-list" >}}
- [Important things to know about the Distinct Value Cache](#important-things-to-know-about-the-distinct-value-cache)
  - [High cardinality limits](#high-cardinality-limits)
  {{% show-in "core" %}}
  - [Distinct Value Caches are flushed when the server stops](#distinct-value-caches-are-flushed-when-the-server-stops)
  {{% /show-in %}}

Consider a dataset with the following schema:

- wind_data (table)
  - tags:
    - country
      - _multiple European countries_
    - county
      - _multiple European counties_
    - city
      - _multiple European cities_
  - fields:  
    - wind_speed (float)
    - wind_direction (integer)

If you cache distinct values for `country`, `county`, and `city`, the DVC looks
similar to this:

| country        | county            | city         |
| :------------- | :---------------- | :----------- |
| Austria        | Salzburg          | Salzburg     |
| Austria        | Vienna            | Vienna       |
| Belgium        | Antwerp           | Antwerp      |
| Belgium        | West Flanders     | Bruges       |
| Czech Republic | Liberec Region    | Liberec      |
| Czech Republic | Prague            | Prague       |
| Denmark        | Capital Region    | Copenhagen   |
| Denmark        | Southern Denmark  | Odense       |
| Estonia        | Ida-Viru County   | Kohtla-Järve |
| Estonia        | Ida-Viru County   | Narva        |
| ...            | ...               | ...          |

> [!Important]
> #### Repeated values in DVC results
> 
> Distinct values may appear multiple times in a column when querying the DVC,
> but only when associated with distinct values in other columns.
> If you query a single column in the DVC, no values are repeated in the results.

> [!Note]
> #### Null column values
>
> _Null_ column values are still considered values and are cached in the DVC.
> If you write data to a table and don't provide a value for an existing column,
> the column value is cached as _null_ and treated as a distinct value.

{{< children hlevel="h2" >}}

## Important things to know about the Distinct Value Cache

DVCs are stored in memory; the larger the cache, the more memory your InfluxDB 3
node requires to maintain it. Consider the following:

- [Cache data loading](#cache-data-loading)
- [High cardinality limits](#high-cardinality-limits)
{{% show-in "core" %}}
- [Distinct Value Caches are flushed when the server stops](#distinct-value-caches-are-flushed-when-the-server-stops)
{{% /show-in %}}

## Cache data loading

On cache creation, {{% product-name %}} loads historical data into the cache.
On restart, the server automatically reloads cache data.

### High cardinality limits

“Cardinality” refers to the number of unique key column combinations in your 
cached data and essentially defines the maximum number of rows to store in your
DVC. While the InfluxDB 3 storage engine is not limited by cardinality, 
it does affect the DVC. You can define a custom maximum cardinality limit for
a DVC, but higher cardinality increases memory requirements for 
storing the DVC and can affect DVC query performance.

{{% show-in "core" %}}
### Distinct Value Caches are flushed when the server stops

Because the DVC is an in-memory cache, the cache is flushed any time the server 
stops. After a server restart, {{% product-name %}} only writes new values to
the DVC when you write data, so there may be a period of time when some values are 
unavailable in the DVC.
{{% /show-in %}}
