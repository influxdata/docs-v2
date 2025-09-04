
Use map functions to create and operate on Arrow maps in SQL queries.

- [element_at](#element_at)
- [make_map](#make_map)
- [map](#map)
- [map_extract](#map_extract)
- [map_keys](#map_keys)
- [map_values](#map_values)
<!-- - [map_entries](#map_entries) -->

## element_at

_Alias of [map_extract](#map_extract)._

## make_map

Returns an Arrow map with the specified key-value pair.

```sql
make_map(key, value)
```

### Arguments

- **key**: Expression to use for the key.
  Can be a constant, column, function, or any combination of arithmetic or
  string operators.
- **value**: Expression to use for the value.
  Can be a constant, column, function, or any combination of arithmetic or
  string operators.

{{< expand-wrapper >}}
{{% expand "View `make_map` query example" %}}

_The following example uses the
{{% influxdb3/home-sample-link %}}._

```sql
SELECT
  make_map(room, temp) AS make_map
FROM
  home
LIMIT 4
```

| make_map            |
| :------------------ |
| {Kitchen: 22.4}     |
| {Living Room: 22.2} |
| {Kitchen: 22.7}     |
| {Living Room: 22.2} |

{{% /expand %}}
{{< /expand-wrapper >}}

## map

Returns an Arrow map with the specified key-value pairs.
Keys are mapped to values by their positions in each respective list.
Each _key_ must be unique and non-null.

```sql
map(key_list, value_list)
```

### Arguments

- **key_list**: List of keys to use in the map.
  Each key must be unique and non-null.
- **value_list**: List of values to map to the corresponding keys.

{{< expand-wrapper >}}
{{% expand "View `map` query example" %}}

```sql
SELECT
  map(
    [400, 401, 402, 403, 404],
    ['Bad Request', 'Unauthorized', 'Payment Required', 'Forbidden', 'Not Found']
  ) AS map
```

| map                                                                                          |
| :------------------------------------------------------------------------------------------- |
| {400: Bad Request, 401: Unauthorized, 402: Payment Required, 403: Forbidden, 404: Not Found} |

{{% /expand %}}
{{% expand "View `map` query example with alternate syntax" %}}

```sql
SELECT
  map {
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found'
  } AS map
```

| map                                                                                          |
| :------------------------------------------------------------------------------------------- |
| {400: Bad Request, 401: Unauthorized, 402: Payment Required, 403: Forbidden, 404: Not Found} |

{{% /expand %}}
{{< /expand-wrapper >}}


<!-- ## map_entries

Returns a list of all entries in a map.

```sql
map_entries(map)
```

### Arguments

- **map**: Map expression. Can be a constant, column, or function, and any
  combination of map operators.

{{< expand-wrapper >}}
{{% expand "View `map` query example" %}}

```sql
SELECT
  map_entries(
    map(
      [400, 401, 404],
      ['Bad Request', 'Unauthorized', 'Not Found']
    )
  ) AS map_entries
```
| map_entries                                                                                                 |
| :---------------------------------------------------------------------------------------------------------- |
| [{'key': 400, 'value': Bad Request}, {'key': 401, 'value': Unauthorized}, {'key': 404, 'value': Not Found}] |

{{% /expand %}}
{{< /expand-wrapper >}} -->

## map_extract

Returns a list containing the value for the given key or an empty list if the
key is not present in the map.

```sql
map_extract(map, key)
```

### Arguments

- **map**: Map expression. Can be a constant, column, or function, and any
  combination of map operators.
- **key**: Key to extract from the map. Can be a constant, column, or function,
  any combination of arithmetic or string operators, or a named expression of
  the previously listed.

#### Aliases

- `element_at`

##### Related functions

[get_field](/influxdb3/version/reference/sql/functions/misc/#get_field)

{{< expand-wrapper >}}
{{% expand "View `map_extract` query example" %}}

The following example uses the
[NOAA Bay Area weather sample data](/influxdb3/version/reference/sample-data/#noaa-bay-area-weather-data)
to perform the a query that:

- Defines a set of constants that includes a map that assigns integers to days
  of the week.
- Queries the weather sample data and use `date_part` to extract an integer
  representing the day of the week of the row's `time` value.
- Uses `map_extract` and the output of `date_part` to return an array containing
  the name of the data of the week.
- Uses bracket notation (`[i]`) to reference an element by index in the returned
  list (lists are 1-indexed).

```sql
WITH constants AS (
  SELECT map(
    [0, 1, 2, 3, 4, 5, 6],
    ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  ) AS days_of_week
)
SELECT 
  weather.time,
  map_extract(c.days_of_week, date_part('dow', time))[1] AS day_of_week
FROM
  weather,
  constants AS c
ORDER BY
  weather.time
LIMIT 6
```

| time                | day_of_week |
| :------------------ | :---------- |
| 2020-01-01T00:00:00 | Wednesday   |
| 2020-01-01T00:00:00 | Wednesday   |
| 2020-01-01T00:00:00 | Wednesday   |
| 2020-01-02T00:00:00 | Thursday    |
| 2020-01-02T00:00:00 | Thursday    |
| 2020-01-02T00:00:00 | Thursday    |

{{% /expand %}}
{{< /expand-wrapper >}}

## map_keys

Returns a list of all keys in the map.

```sql
map_keys(map)
```

### Arguments

- **map**: Map expression. Can be a constant, column, or function, and any
combination of map operators.

##### Related functions

[get_field](/influxdb3/version/reference/sql/functions/misc/#get_field)

{{< expand-wrapper >}}
{{% expand "View `map_keys` query example" %}}

```sql
SELECT map_keys(map {'a': 1, 'b': NULL, 'c': 3}) AS map_keys
```

| map_keys  |
| :-------- |
| [a, b, c] |

{{% /expand %}}
{{< /expand-wrapper >}}

## map_values

Returns a list of all values in the map.

```sql
map_values(map)
```

### Arguments

- **map**: Map expression. Can be a constant, column, or function, and any combination of map operators.

{{< expand-wrapper >}}
{{% expand "View `map_values` query example" %}}

```sql
SELECT map_values(map {'a': 1, 'b': NULL, 'c': 3}) AS map_values
```

| map_values |
| :--------- |
| [1, , 3]   |

{{% /expand %}}
{{< /expand-wrapper >}}
