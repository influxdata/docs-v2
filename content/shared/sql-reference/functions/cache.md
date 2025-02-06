
The {{< product-name >}} SQL implementation supports the following functions
that return data from {{< product-name >}} caches.

- [distinct_value](#distinct_value)
- [last_value](#last_value)

## distinct_value

Returns data from an {{< product-name >}} distinct value cache.

```sql
distinct_value(table_name, cache_name)
```

#### Arguments

- **table_name**: Name of the table associated with the distinct value cache
  _(formatted as a string literal)_.
- **datatype**: Name of the the distinct value cache to query 
  _(formatted as a string literal)_.

{{< expand-wrapper >}}
{{% expand "View `distinct_value` query example" %}}

```sql
SELECT * FROM distinct_value('example_table', 'exampleCacheName')
```

{{% /expand %}}
{{< /expand-wrapper >}}

## last_value

Returns data from an {{< product-name >}} last value cache.

```sql
last_value(table_name, cache_name)
```

#### Arguments

- **table_name**: Name of the table associated with the last value cache
  _(formatted as a string literal)_.
- **datatype**: Name of the the last value cache to query 
  _(formatted as a string literal)_.

{{< expand-wrapper >}}
{{% expand "View `last_value` query example" %}}

```sql
SELECT * FROM last_value('example_table', 'exampleCacheName')
```

{{% /expand %}}
{{< /expand-wrapper >}}
