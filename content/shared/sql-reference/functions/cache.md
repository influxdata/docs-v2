
The {{< product-name >}} SQL implementation supports the following functions
that return data from {{< product-name >}} caches.

- [distinct_cache](#distinct_cache)
- [last_cache](#last_cache)

## distinct_cache

Returns data from an {{< product-name >}} distinct value cache.

```sql
distinct_cache(table_name, cache_name)
```

### Arguments

- **table_name**: Name of the table associated with the distinct value cache
  _(formatted as a string literal)_.
- **datatype**: Name of the distinct value cache to query 
  _(formatted as a string literal)_.

{{< expand-wrapper >}}
{{% expand "View `distinct_cache` query example" %}}

```sql
SELECT * FROM distinct_cache('example_table', 'exampleCacheName')
```

{{% /expand %}}
{{< /expand-wrapper >}}

## last_cache

Returns data from an {{< product-name >}} last value cache.

```sql
last_cache(table_name, cache_name)
```

### Arguments

- **table_name**: Name of the table associated with the last value cache
  _(formatted as a string literal)_.
- **datatype**: Name of the last value cache to query 
  _(formatted as a string literal)_.

{{< expand-wrapper >}}
{{% expand "View `last_cache` query example" %}}

```sql
SELECT * FROM last_cache('example_table', 'exampleCacheName')
```

{{% /expand %}}
{{< /expand-wrapper >}}
