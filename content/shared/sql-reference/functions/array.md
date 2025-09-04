
Use array functions to create and operate on Arrow arrays or lists in SQL queries.

- [array_any_value](#array_any_value)
- [array_append](#array_append)
- [array_cat](#array_cat)
- [array_concat](#array_concat)
- [array_contains](#array_contains)
- [array_dims](#array_dims)
- [array_distance](#array_distance)
- [array_distinct](#array_distinct)
- [array_element](#array_element)
- [array_empty](#array_empty)
- [array_except](#array_except)
- [array_extract](#array_extract)
- [array_has](#array_has)
- [array_has_all](#array_has_all)
- [array_has_any](#array_has_any)
- [array_indexof](#array_indexof)
- [array_intersect](#array_intersect)
- [array_join](#array_join)
- [array_length](#array_length)
- [array_max](#array_max)
- [array_min](#array_min)
- [array_ndims](#array_ndims)
- [array_pop_back](#array_pop_back)
- [array_pop_front](#array_pop_front)
- [array_position](#array_position)
- [array_positions](#array_positions)
- [array_prepend](#array_prepend)
- [array_push_back](#array_push_back)
- [array_push_front](#array_push_front)
- [array_remove](#array_remove)
- [array_remove_all](#array_remove_all)
- [array_remove_n](#array_remove_n)
- [array_repeat](#array_repeat)
- [array_replace](#array_replace)
- [array_replace_all](#array_replace_all)
- [array_replace_n](#array_replace_n)
- [array_resize](#array_resize)
- [array_reverse](#array_reverse)
- [array_slice](#array_slice)
- [array_sort](#array_sort)
- [array_to_string](#array_to_string)
- [array_union](#array_union)
- [arrays_overlap](#arrays_overlap)
- [cardinality](#cardinality)
- [empty](#empty)
- [flatten](#flatten)
- [generate_series](#generate_series)
- [list_any_value](#list_any_value)
- [list_append](#list_append)
- [list_cat](#list_cat)
- [list_concat](#list_concat)
- [list_contains](#list_contains)
- [list_dims](#list_dims)
- [list_distance](#list_distance)
- [list_distinct](#list_distinct)
- [list_element](#list_element)
- [list_empty](#list_empty)
- [list_except](#list_except)
- [list_extract](#list_extract)
- [list_has](#list_has)
- [list_has_all](#list_has_all)
- [list_has_any](#list_has_any)
- [list_indexof](#list_indexof)
- [list_intersect](#list_intersect)
- [list_join](#list_join)
- [list_length](#list_length)
- [list_max](#list_max)
- [list_ndims](#list_ndims)
- [list_pop_back](#list_pop_back)
- [list_pop_front](#list_pop_front)
- [list_position](#list_position)
- [list_positions](#list_positions)
- [list_prepend](#list_prepend)
- [list_push_back](#list_push_back)
- [list_push_front](#list_push_front)
- [list_remove](#list_remove)
- [list_remove_all](#list_remove_all)
- [list_remove_n](#list_remove_n)
- [list_repeat](#list_repeat)
- [list_replace](#list_replace)
- [list_replace_all](#list_replace_all)
- [list_replace_n](#list_replace_n)
- [list_resize](#list_resize)
- [list_reverse](#list_reverse)
- [list_slice](#list_slice)
- [list_sort](#list_sort)
- [list_to_string](#list_to_string)
- [list_union](#list_union)
- [make_array](#make_array)
- [make_list](#make_list)
- [range](#range)
- [string_to_array](#string_to_array)
- [string_to_list](#string_to_list)

## array_any_value

Returns the first non-null element in the array.

```sql
array_any_value(array)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.

#### Aliases

- `list_any_value`

{{< expand-wrapper >}}
{{% expand "View `array_any_value` example" %}}

```sql
SELECT array_any_value([NULL, 1, 2, 3]) AS array_any_value
```

| array_any_value |
| :-------------- |
| 1               |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_append

Appends an element to the end of an array.

```sql
array_append(array, element)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **element**: Element to append to the array.

#### Aliases

- `list_append`
- `array_push_back`
- `list_push_back`

{{< expand-wrapper >}}
{{% expand "View `array_append` example" %}}

```sql
SELECT array_append([1, 2, 3], 4) AS array_append
```

| array_append |
| :----------- |
| [1, 2, 3, 4] |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_cat

_Alias of [array_concat](#array_concat)._

## array_concat

Concatenates multiple arrays into a single array.

```sql
array_concat(array[, ..., array_n])
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **array_n**: Subsequent array column or literal array to concatenate.

#### Aliases

- `array_cat`
- `list_concat`
- `list_cat`

{{< expand-wrapper >}}
{{% expand "View `array_concat` example" %}}

```sql
SELECT array_concat([1, 2], [3, 4], [5, 6]) AS array_concat
```
| array_concat       |
| :----------------- |
| [1, 2, 3, 4, 5, 6] |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_contains

_Alias of [array_has](#array_has)._

## array_dims

Returns an array of the array's dimensions.

```sql
array_dims(array)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.

#### Aliases

- `list_dims`

{{< expand-wrapper >}}
{{% expand "View `array_dims` example" %}}

```sql
SELECT array_dims([[1, 2, 3], [4, 5, 6]]) AS array_dims
```

| array_dims(List([1,2,3,4,5,6])) |
| :------------------------------ |
| [2, 3]                          |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_distance

Returns the Euclidean distance between two input arrays of equal length.

```sql
array_distance(array1, array2)
```

### Arguments

- **array1**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **array2**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.

#### Aliases

- `list_distance`

{{< expand-wrapper >}}
{{% expand "View `array_disance` example" %}}

```sql
SELECT array_distance([1, 2], [1, 4]) AS array_distance
```

| array_distance |
| -------------: |
|            2.0 |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_distinct

Returns distinct values from the array after removing duplicates.

```sql
array_distinct(array)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.

#### Aliases

- `list_distinct`

{{< expand-wrapper >}}
{{% expand "View `array_distinct` example" %}}

```sql
SELECT array_distinct([1, 3, 2, 3, 1, 2, 4]) AS array_distinct
```

| array_distinct(List([1,2,3,4])) |
| :------------------------------ |
| [1, 2, 3, 4]                    |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_element

Extracts the element with the index n from the array.

```sql
array_element(array, index)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **index**: Index to use to extract the element from the array.

#### Aliases

- `array_extract`
- `list_element`
- `list_extract`

{{< expand-wrapper >}}
{{% expand "View `array_element` example" %}}

```sql
SELECT array_element([1, 2, 3, 4], 3) AS array_element
```

| array_element |
| ------------: |
|             3 |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_empty

_Alias of [empty](#empty)._

## array_except

Returns an array of elements that appear in the first array but not in the second.

```sql
array_except(array1, array2)
```

### Arguments

- **array1**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **array2**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.

#### Aliases

- `list_except`

{{< expand-wrapper >}}
{{% expand "View `array_except` example" %}}

```sql
SELECT array_except([1, 2, 3, 4], [5, 6, 3, 4]) AS array_except
```

| array_except |
| :----------- |
| [1, 2]       |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_extract

_Alias of [array_element](#array_element)._

## array_has

Returns `true` if the array contains the element.

```sql
array_has(array, element)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **element**: Scalar or Array expression. Can be a constant, column, or
  function, and any combination of array operators.

#### Aliases

- `list_has`
- `array_contains`
- `list_contains`

{{< expand-wrapper >}}
{{% expand "View `array_has` example" %}}

```sql
SELECT array_has([1, 2, 3], 2) AS array_has
```

| array_has |
| :-------- |
| true      |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_has_all

Returns `true` if all elements of sub-array exist in array.

```sql
array_has_all(array, sub-array)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **sub-array**: Array expression. Can be a constant, column, or function, and
  any combination of array operators.

#### Aliases

- `list_has_all`

{{< expand-wrapper >}}
{{% expand "View `array_has_all` example" %}}

```sql
SELECT array_has_all([1, 2, 3, 4], [2, 3]) AS array_has_all
```

| array_has_all |
| :------------ |
| true          |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_has_any

Returns `true` if any elements exist in both arrays.

```sql
array_has_any(array, sub-array)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **sub-array**: Array expression. Can be a constant, column, or function, and
  any combination of array operators.

#### Aliases

- `list_has_any`
- `arrays_overlap`

{{< expand-wrapper >}}
{{% expand "View `array_has_any` example" %}}

```sql
SELECT array_has_any([1, 2, 3], [3, 4]) AS array_has_any
```

| array_has_any |
| :------------ |
| true          |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_indexof

_Alias of [array_position](#array_position)._

## array_intersect

Returns an array of elements in the intersection of **array1** and **array2**.

```sql
array_intersect(array1, array2)
```

### Arguments

- **array1**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **array2**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.

#### Aliases

- `list_intersect`

{{< expand-wrapper >}}
{{% expand "View `array_intersect` example with intersecting arrays" %}}

```sql
SELECT array_intersect([1, 2, 3, 4], [5, 6, 3, 4]) AS array_intersect
```

| array_intersect |
| :-------------- |
| [3, 4]          |

{{% /expand %}}
{{% expand "View `array_intersect` example with non-intersecting arrays" %}}

```sql
SELECT array_intersect([1, 2, 3, 4], [5, 6, 7, 8]) AS array_intersect
```

| array_intersect |
| :-------------- |
| []              |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_join

_Alias of [array_to_string](#array_to_string)._

## array_length

Returns the length of the array dimension.

```sql
array_length(array, dimension)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **dimension**: Array dimension. Default is `1`.

#### Aliases

- `list_length`

{{< expand-wrapper >}}
{{% expand "View `array_length` example with single-dimension array" %}}

```sql
SELECT array_length([1, 2, 3, 4, 5]) AS array_length
```

| array_length |
| -----------: |
|            5 |

{{% /expand %}}
{{% expand "View `array_length` example with multi-dimension array" %}}

```sql
WITH vars AS (
  SELECT [
    [1, 2, 3, 4, 5],
    [5, 6, 7, 8, 9]
  ] AS example_array
)

SELECT
  array_length(example_array, 1) AS 'dim1_length',
  array_length(example_array, 2) AS 'dim2_length'
FROM vars
```

| dim1_length | dim2_length |
| ----------: | ----------: |
|           2 |           5 |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_max

Returns the maximum value in the array.

```sql
array_max(array)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.

#### Aliases

- `list_max`

{{< expand-wrapper >}}
{{% expand "View `array_max` example" %}}

```sql
SELECT array_max([3,1,4,2]) AS array_max
```

| array_max |
| --------: |
|         4 |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_min

Returns the minimum value in the array.

```sql
array_min(array)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.

{{< expand-wrapper >}}
{{% expand "View `array_min` example" %}}

```sql
SELECT array_min([3,1,4,2]) AS array_min
```

| array_min |
| --------: |
|         1 |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_ndims

Returns the number of dimensions of the array.

```sql
array_ndims(array)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.

#### Aliases

- `list_ndims`

{{< expand-wrapper >}}
{{% expand "View `array_ndims` example" %}}

```sql
SELECT array_ndims([[1, 2, 3], [4, 5, 6]]) AS array_ndims
```

| array_ndims |
| ----------: |
|           2 |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_pop_back

Returns the array without the last element.

```sql
array_pop_back(array)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.

#### Aliases

- `list_pop_back`

{{< expand-wrapper >}}
{{% expand "View `array_pop_back` example" %}}

```sql
SELECT array_pop_back([1, 2, 3]) AS array_pop_back
```

| array_pop_back |
| :------------- |
| [1, 2]         |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_pop_front

Returns the array without the first element.

```sql
array_pop_front(array)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.

#### Aliases

- `list_pop_front`

{{< expand-wrapper >}}
{{% expand "View `array_pop_front` example" %}}

```sql
SELECT array_pop_front([1, 2, 3]) AS array_pop_front
```

| array_pop_front |
| :-------------- |
| [2, 3]          |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_position

Returns the position of the first occurrence of the specified element in the
array, or _NULL_ if not found.

```sql
array_position(array, element, index)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **element**: Element to search for position in the array.
- **index**: Index at which to start searching (1-indexed). Default is `1`.

#### Aliases

- `list_position`
- `array_indexof`
- `list_indexof`

{{< expand-wrapper >}}
{{% expand "View `array_position` example" %}}

```sql
SELECT array_position([1, 2, 2, 3, 1, 4], 2) AS array_position
```

| array_position |
| -------------: |
|              2 |

{{% /expand %}}
{{% expand "View `array_position` example with index offset" %}}

```sql
SELECT array_position([1, 2, 2, 3, 1, 4], 2, 3) AS array_position
```

| array_position |
| -------------: |
|              3 |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_positions

Searches for an element in the array and returns the position or index of each
occurrence.

```sql
array_positions(array, element)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **element**: Element to search for position in the array.

#### Aliases

- `list_positions`

{{< expand-wrapper >}}
{{% expand "View `array_positions` example" %}}

```sql
SELECT array_positions(['John', 'Jane', 'James', 'John'], 'John') AS array_positions
```

| array_positions |
| :-------------- |
| [1, 4]          |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_prepend

Prepends an element to the beginning of an array.

```sql
array_prepend(element, array)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **element**: Element to prepend to the array.

#### Aliases

- `list_prepend`
- `array_push_front`
- `list_push_front`

{{< expand-wrapper >}}
{{% expand "View `array_prepend` example" %}}

```sql
SELECT array_prepend(1, [2, 3, 4]) AS array_prepend
```

| array_prepend |
| :------------ |
| [1, 2, 3, 4]  |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_push_back

_Alias of [array_append](#array_append)._

## array_push_front

_Alias of [array_prepend](#array_prepend)._

## array_remove

Removes the first element from the array equal to the given value.

```sql
array_remove(array, element)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **element**: Element to remove from the array.

#### Aliases

- `list_remove`

{{< expand-wrapper >}}
{{% expand "View `array_remove` example" %}}

```sql
SELECT array_remove([1, 2, 2, 3, 2, 1, 4], 2) AS array_remove
```

| array_remove       |
| :----------------- |
| [1, 2, 3, 2, 1, 4] |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_remove_all

Removes all elements from the array equal to the specified value.

```sql
array_remove_all(array, element)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **element**: Element to be removed from the array.

#### Aliases

- `list_remove_all`

{{< expand-wrapper >}}
{{% expand "View `array_remove_all` example" %}}

```sql
SELECT array_remove_all([1, 2, 2, 3, 2, 1, 4], 2) AS array_remove_all
```

| array_remove_all |
| :--------------- |
| [1, 3, 1, 4]     |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_remove_n

Removes the first `max` elements from the array equal to the specified value.

```sql
array_remove_n(array, element, max)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **element**: Element to remove from the array.
- **max**: Maximum number of occurrences to remove.

#### Aliases

- `list_remove_n`

{{< expand-wrapper >}}
{{% expand "View `array_remove_n` example" %}}

```sql
SELECT array_remove_n([1, 2, 2, 3, 2, 1, 4], 2, 2) AS array_remove_n
```

| array_remove_n  |
| :-------------- |
| [1, 3, 2, 1, 4] |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_repeat

Returns an array containing element `count` times.

```sql
array_repeat(element, count)
```

### Arguments

- **element**: Element expression. Can be a constant, column, or function, and
  any combination of array operators.
- **count**: Number of times to repeat the element.

#### Aliases

- `list_repeat`

{{< expand-wrapper >}}
{{% expand "View `array_repeat` example with numeric values" %}}

```sql
SELECT array_repeat(1, 3) AS array_repeat
```

| array_repeat |
| :----------- |
| [1, 1, 1]    |

{{% /expand %}}
{{% expand "View `array_repeat` example with string values" %}}

```sql
SELECT array_repeat('John', 3) AS array_repeat
```

| array_repeat |
| :----------- |
| [John, John, John] |


{{% /expand %}}
{{% expand "View `array_repeat` example with array values" %}}

```sql
SELECT array_repeat([1, 2], 2) AS array_repeat
```

| array_repeat     |
| :--------------- |
| [[1, 2], [1, 2]] |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_replace

Replaces the first occurrence of the specified element with another specified element.

```sql
array_replace(array, from, to)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **from**: Element to replace.
- **to**: Replacement element.

#### Aliases

- `list_replace`

{{< expand-wrapper >}}
{{% expand "View `array_replace` example" %}}

```sql
SELECT array_replace(['John', 'Jane', 'James', 'John'], 'John', 'Joe') AS array_replace
```

| array_replace            |
| :----------------------- |
| [Joe, Jane, James, John] |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_replace_all

Replaces all occurrences of the specified element with another specified element.

```sql
array_replace_all(array, from, to)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **from**: Element to replace.
- **to**: Replacement element.

#### Aliases

- `list_replace_all`

{{< expand-wrapper >}}
{{% expand "View `array_replace_all` example" %}}

```sql
SELECT array_replace_all(['John', 'Jane', 'James', 'John'], 'John', 'Joe') AS array_replace_all
```

| array_replace_all       |
| :---------------------- |
| [Joe, Jane, James, Joe] |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_replace_n

Replaces the first `max` occurrences of the specified element with another
specified element.

```sql
array_replace_n(array, from, to, max)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **from**: Element to replace.
- **to**: Replacement element.
- **max**: Maximum number of occurrences to replace.

#### Aliases

- `list_replace_n`

{{< expand-wrapper >}}
{{% expand "View `array_replace_n` example" %}}

```sql
SELECT array_replace_n(['John', 'Jane', 'James', 'John', 'John'], 'John', 'Joe', 2) AS array_replace_n
```

| array_replace_n               |
| :---------------------------- |
| [Joe, Jane, James, Joe, John] |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_resize

Resizes the list to contain size elements. Initializes new elements with value
or empty if value is not set.

```sql
array_resize(array, size, value)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **size**: New size of the array.
- **value**: Value to use for new elements. Default is _NULL_.

#### Aliases

- `list_resize`

{{< expand-wrapper >}}
{{% expand "View `array_resize` example" %}}

```sql
SELECT array_resize([1, 2, 3], 5, 0) AS array_resize
```

| array_resize(List([1,2,3],5,0)) |
| :------------------------------ |
| [1, 2, 3, 0, 0]                 |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_reverse

Returns the array with the order of the elements reversed.

```sql
array_reverse(array)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.

#### Aliases

- `list_reverse`

{{< expand-wrapper >}}
{{% expand "View `array_reverse` example" %}}

```sql
SELECT array_reverse([1, 2, 3, 4]) AS array_reverse
```

| array_reverse |
| :------------ |
| [4, 3, 2, 1]  |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_slice

Returns a slice of the array based on 1-indexed start and end positions.

```sql
array_slice(array, begin, end)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **begin**: Index of the first element. If negative, it counts backward from
  the end of the array.
- **end**: Index of the last element. If negative, it counts backward from the
  end of the array.
- **stride**: Stride of the array slice. The default is `1`.

#### Aliases

- `list_slice`

{{< expand-wrapper >}}
{{% expand "View `array_slice` example" %}}

```sql
SELECT array_slice([1, 2, 3, 4, 5, 6, 7, 8], 3, 6) AS array_slice
```

| array_slice  |
| :----------- |
| [3, 4, 5, 6] |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_sort

Sorts elements in an array.
If elements are numeric, it sorts elements in numerical order.
If elements are strings, it sorts elements in lexicographical order.

```sql
array_sort(array, sort_order, sort_nulls)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **sort_order**: Sort order (`'ASC'` _(default)_ or `'DESC'`).
- **sort_nulls**: Sort nulls first or last (`'NULLS FIRST'` _(default)_ or `'NULLS LAST'`).

#### Aliases

- `list_sort`

{{< expand-wrapper >}}
{{% expand "View `array_sort` example with numeric elements" %}}

```sql
SELECT array_sort([3, 1, 2]) AS array_sort
```

| array_sort |
| :--------- |
| [1, 2, 3]  |

{{% /expand %}}
{{% expand "View `array_sort` example with string elements" %}}

```sql
SELECT array_sort(['banana', 'apple', 'cherry'], 'DESC') AS array_sort
```

| array_sort              |
| :---------------------- |
| [cherry, banana, apple] |

{{% /expand %}}
{{% expand "View `array_sort` example with _NULL_ elements" %}}

```sql
SELECT
  array_sort(
    ['banana', 'apple', NULL, 'cherry', NULL],
    'ASC',
    'NULLS LAST'
  ) AS array_sort
```

| array_sort                  |
| :-------------------------- |
| [apple, banana, cherry, , ] |

{{% /expand %}}
{{< /expand-wrapper >}}

## array_to_string

Converts an array to string-based representation with a specified delimiter.

```sql
array_to_string(array, delimiter[, null_string])
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **delimiter**: Array element separator.
- **null_string**: Optional. String to replace _NULL_ values in the array.
  If not provided, _NULL_ elements are ignored.

#### Aliases

- `list_to_string`
- `array_join`
- `list_join`

{{< expand-wrapper >}}
{{% expand "View `array_to_string` example" %}}

```sql
SELECT array_to_string([1,2,3,4,5,6,7,8], ',') AS array_to_string
```

| array_to_string |
| :-------------- |
| 1,2,3,4,5,6,7,8 |

{{% /expand %}}
{{% expand "View `array_to_string` example with _NULL_ replacements" %}}

```sql
SELECT array_to_string([[1,2,3,4,5,NULL,7,8,NULL]], '-', '?') AS array_to_string
```

| array_to_string   |
| :---------------- |
| 1-2-3-4-5-?-7-8-? |

{{% /expand %}}
{{< /expand-wrapper >}}


## array_union

Returns an array of elements that are present in both arrays (all elements from
both arrays) with out duplicates.

```sql
array_union(array1, array2)
```

### Arguments

- **array1**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.
- **array2**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.

#### Aliases

- `list_union`

{{< expand-wrapper >}}
{{% expand "View `array_union` example" %}}

```sql
SELECT array_union([1, 2, 3, 4], [5, 6, 3, 4]) AS array_union
```

| array_union        |
| :----------------- |
| [1, 2, 3, 4, 5, 6] |

{{% /expand %}}
{{< /expand-wrapper >}}

## arrays_overlap

_Alias of [array_has_any](#array_has_any)._

## cardinality

Returns the total number of elements in the array.

```sql
cardinality(array)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.

{{< expand-wrapper >}}
{{% expand "View `cardinality` example" %}}

```sql
SELECT cardinality([[1, 2, 3, 4], [5, 6, 7, 8]]) AS cardinality
```

| cardinality |
| ----------: |
|           8 |

{{% /expand %}}
{{< /expand-wrapper >}}

## empty

Returns `true` for an empty array or `false` for a non-empty array.

```sql
empty(array)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.

#### Aliases

- `array_empty`
- `list_empty`

{{< expand-wrapper >}}
{{% expand "View `empty` example" %}}

```sql
SELECT empty(['apple']) AS empty
```

| empty |
| :---- |
| false |

{{% /expand %}}
{{< /expand-wrapper >}}

## flatten

Converts an array of arrays to a flat array.

- Applies to any depth of nested arrays
- Does not change arrays that are already flat

The flattened array contains all the elements from all source arrays.

```sql
flatten(array)
```

### Arguments

- **array**: Array expression. Can be a constant, column, or function, and any
  combination of array operators.

{{< expand-wrapper >}}
{{% expand "View `flatten` example" %}}

```sql
SELECT flatten([[1, 2], [3, 4]]) AS flattened
```

| flattened    |
| :----------- |
| [1, 2, 3, 4] |

{{% /expand %}}
{{< /expand-wrapper >}}

## generate_series

Returns an array with values between the specified **start** and **stop** values
generated at the specified **step**.

The range `start..stop` contains all values greater than or equal to **start**
and less than or equal to **stop** (`start <= x <= stop`).
If **start** is greater than or equal to **stop** (`start >= stop`), the
function returns an empty array.

_`generate_series` is similar to [range](#range), but includes the upper bound
(**stop**) in the output array._

```sql
generate_series(start, stop, step)
```

### Arguments

- **start**: Start of the series. Supports integers, timestamps, dates, or
  string types that can be coerced to `Date32`.
- **stop**: Upper bound of the series. Supports integers, timestamps,
  dates, or string types that can be coerced to `Date32`. The type must be the
  same as **start**.
- **step**: Increase by step (cannot be `0`). Steps less than a day are
  only supported for ranges with the `TIMESTAMP` type.

##### Related functions

[range](#range)

{{< expand-wrapper >}}
{{% expand "View `generate_series` example" %}}

```sql
SELECT generate_series(1,5) AS generate_series
```

| generate_series |
| :-------------- |
| [1, 2, 3, 4, 5] |

{{% /expand %}}
{{% expand "View `range` example with dates" %}}

```sql
SELECT
  generate_series(
    DATE '2025-03-01',
    DATE '2025-08-01',
    INTERVAL '1 month'
  ) AS generate_series
```

| generate_series                                                          |
| :----------------------------------------------------------------------- |
| [2025-03-01, 2025-04-01, 2025-05-01, 2025-06-01, 2025-07-01, 2025-08-01] |

{{% /expand %}}
{{% expand "View `generate_series` example using timestamps" %}}

```sql
SELECT
  generate_series(
    '2025-01-01T00:00:00Z'::timestamp,
    '2025-01-01T06:00:00Z'::timestamp,
    INTERVAL '2 hours'
  ) AS generate_series
```

| generate_series                                                                      |
| :----------------------------------------------------------------------------------- |
| [2025-01-01T00:00:00, 2025-01-01T02:00:00, 2025-01-01T04:00:00, 2025-01-01T06:00:00] |

{{% /expand %}}
{{< /expand-wrapper >}}


## list_any_value

_Alias of [array_any_value](#array_any_value)._

## list_append

_Alias of [array_append](#array_append)._

## list_cat

_Alias of [array_concat](#array_concat)._

## list_concat

_Alias of [array_concat](#array_concat)._

## list_contains

_Alias of [array_has](#array_has)._

## list_dims

_Alias of [array_dims](#array_dims)._

## list_distance

_Alias of [array_distance](#array_distance)._

## list_distinct

_Alias of [array_distinct](#array_distinct)._

## list_element

_Alias of [array_element](#array_element)._

## list_empty

_Alias of [empty](#empty)._

## list_except

_Alias of [array_except](#array_except)._

## list_extract

_Alias of [array_element](#array_element)._

## list_has

_Alias of [array_has](#array_has)._

## list_has_all

_Alias of [array_has_all](#array_has_all)._

## list_has_any

_Alias of [array_has_any](#array_has_any)._

## list_indexof

_Alias of [array_position](#array_position)._

## list_intersect

_Alias of [array_intersect](#array_intersect)._

## list_join

_Alias of [array_to_string](#array_to_string)._

## list_length

_Alias of [array_length](#array_length)._

## list_max

_Alias of [array_max](#array_max)._

## list_ndims

_Alias of [array_ndims](#array_ndims)._

## list_pop_back

_Alias of [array_pop_back](#array_pop_back)._

## list_pop_front

_Alias of [array_pop_front](#array_pop_front)._

## list_position

_Alias of [array_position](#array_position)._

## list_positions

_Alias of [array_positions](#array_positions)._

## list_prepend

_Alias of [array_prepend](#array_prepend)._

## list_push_back

_Alias of [array_append](#array_append)._

## list_push_front

_Alias of [array_prepend](#array_prepend)._

## list_remove

_Alias of [array_remove](#array_remove)._

## list_remove_all

_Alias of [array_remove_all](#array_remove_all)._

## list_remove_n

_Alias of [array_remove_n](#array_remove_n)._

## list_repeat

_Alias of [array_repeat](#array_repeat)._

## list_replace

_Alias of [array_replace](#array_replace)._

## list_replace_all

_Alias of [array_replace_all](#array_replace_all)._

## list_replace_n

_Alias of [array_replace_n](#array_replace_n)._

## list_resize

_Alias of [array_resize](#array_resize)._

## list_reverse

_Alias of [array_reverse](#array_reverse)._

## list_slice

_Alias of [array_slice](#array_slice)._

## list_sort

_Alias of [array_sort](#array_sort)._

## list_to_string

_Alias of [array_to_string](#array_to_string)._

## list_union

_Alias of [array_union](#array_union)._

## make_array

Returns an array using the specified input expressions.

```sql
make_array(expression1[, ..., expression_n])
```

### Arguments

- **expression_n**: Expression to include in the output array.
  Can be a constant, column, or function, and any combination of arithmetic or
  string operators.

#### Aliases

- `make_list`

{{< expand-wrapper >}}
{{% expand "View `make_array` example" %}}

```sql
SELECT make_array(1, 2, 3, 4, 5) AS make_array
```

| make_array      |
| :-------------- |
| [1, 2, 3, 4, 5] |

{{% /expand %}}
{{< /expand-wrapper >}}

## make_list

_Alias of [make_array](#make_array)._

## range

Returns an array with values between the specified **start** and **stop** values
generated at the specified **step**.

The range `start..stop` contains all values greater than or equal to **start**
and less than **stop** (`start <= x < stop`).
If **start** is greater than or equal to **stop** (`start >= stop`), the
function returns an empty array.

_`range` is similar to [generate_series](#generate_series), but does not include
the upper bound (**stop**) in the output array._

```sql
range(start, stop, step)
```

### Arguments

- **start**: Start of the series. Supports integers, timestamps, dates, or
  string types that can be coerced to `Date32`.
- **stop**: Upper bound of the series. Supports integers, timestamps,
  dates, or string types that can be coerced to `Date32`. The type must be the
  same as **start**.
- **step**: Increase by step (cannot be `0`). Steps less than a day are
  only supported for ranges with the `TIMESTAMP` type.

##### Related functions

[generate_series](#generate_series)

{{< expand-wrapper >}}
{{% expand "View `range` example" %}}

```sql
SELECT range(1, 5, 1) AS range
```
| range        |
|:-------------|
| [1, 2, 3, 4] |

{{% /expand %}}
{{% expand "View `range` example with dates" %}}

```sql
SELECT
  range(
    DATE '2025-03-01',
    DATE '2025-08-01',
    INTERVAL '1 month'
  ) AS range
```

| range                                                        |
| :----------------------------------------------------------- |
| [2025-03-01, 2025-04-01, 2025-05-01, 2025-06-01, 2025-07-01] |

{{% /expand %}}
{{% expand "View range example with timestamps" %}}

```sql
SELECT
  range(
    '2025-01-01T00:00:00Z'::timestamp,
    '2025-01-01T06:00:00Z'::timestamp,
    INTERVAL '2 hours'
  ) AS range
```

| range                                                           |
| :-------------------------------------------------------------- |
| [2025-01-01T00:00:00, 2025-01-01T02:00:00, 2025-01-01T04:00:00] |

{{% /expand %}}
{{< /expand-wrapper >}}

## string_to_array

Splits a string into an array of substrings based on a delimiter. Any substrings
matching the optional `null_str` argument are replaced with `NULL`.

```sql
string_to_array(str, delimiter[, null_str])
```

### Arguments

- **str**: String expression to split.
- **delimiter**: Delimiter string to split on.
- **null_str**: _(Optional)_ Substring values to replace with `NULL`.

#### Aliases

- `string_to_list`

{{< expand-wrapper >}}
{{% expand "View `string_to_array` example with comma-delimited list" %}}

```sql
SELECT string_to_array('abc, def, ghi', ', ') AS string_to_array
```

| string_to_array |
| :-------------- |
| [abc, def, ghi] |

{{% /expand %}}
{{% expand "View `string_to_array` example with a non-standard delimiter" %}}

```sql
SELECT string_to_array('abc##def', '##') AS string_to_array
```

| string_to_array |
| :-------------- |
| ['abc', 'def']  |

{{% /expand %}}
{{% expand "View `string_to_array` example with _NULL_ replacements" %}}

```sql
SELECT string_to_array('abc def', ' ', 'def') AS string_to_array
```

| string_to_array |
| :-------------- |
| ['abc', NULL]   |

{{% /expand %}}
{{< /expand-wrapper >}}

## string_to_list

_Alias of [string_to_array](#string_to_array)._
