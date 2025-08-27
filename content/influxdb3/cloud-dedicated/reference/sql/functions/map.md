---
title: SQL map functions
list_title: Map functions
description: >
  Use map functions to create and operate on Arrow maps in SQL queries.
menu:
  influxdb3_cloud_dedicated:
    name: Map
    parent: sql-functions    
weight: 310

# source: /shared/sql-reference/functions/map.md
---

<!-- 
The content of this page is at
// SOURCE content/shared/sql-reference/functions/map.md
-->

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

#### Example

```sql
SELECT map_extract(MAP {'a': 1, 'b': NULL, 'c': 3}, 'a');
----
[1]

SELECT map_extract(MAP {1: 'one', 2: 'two'}, 2);
----
['two']

SELECT map_extract(MAP {'x': 10, 'y': NULL, 'z': 30}, 'y');
----
[]
```

#### Aliases

- element_at

## map_keys

Returns a list of all keys in the map.

```sql
map_keys(map)
```

### Arguments

- **map**: Map expression. Can be a constant, column, or function, and any combination of map operators.

#### Example

```sql
SELECT map_keys(MAP {'a': 1, 'b': NULL, 'c': 3});
----
[a, b, c]

SELECT map_keys(map([100, 5], [42, 43]));
----
[100, 5]
```

## map_values

Returns a list of all values in the map.

```sql
map_values(map)
```

### Arguments

- **map**: Map expression. Can be a constant, column, or function, and any combination of map operators.

#### Example

```sql
SELECT map_values(MAP {'a': 1, 'b': NULL, 'c': 3});
----
[1, , 3]

SELECT map_values(map([100, 5], [42, 43]));
----
[42, 43]
```
