---
title: Work with dynamic types
seotitle: Work with Flux dynamic types
list_title: Dynamic types
description: >
  A **dynamic** type is a wrapper for data whose type is not known until runtime.
  Dynamic types help when working with data from external sources (like JSON) 
  that support types that do not have an equivalent Flux type.
menu:
  flux_v0:
    name: Dynamic types
    parent: Work with Flux types
weight: 101
flux/v0/tags: [dynamic types, data types]
---

A **dynamic** type is a wrapper for data whose type is not known until runtime.
Dynamic types help when working with data from external sources (like JSON) 
that support types that do not have an equivalent Flux type.

- [Parse JSON into Flux types](#parse-json-into-flux-types)
- [Dynamic type syntax](#dynamic-type-syntax)
- [Reference values in a dynamic type](#reference-values-in-a-dynamic-type)
- [Operate on dynamic types](#operate-on-dynamic-types)

{{% note %}}
#### Dynamic types are not supported in tables

**Dynamic types are not supported in Flux tables.**
To include a dynamic value in a Flux table, you must
[cast the dynamic type to a Flux basic type](#basic-types).
For a full example of casting dynamic types to basic types and including them
in a table, see [Include dynamic types in a table](#include-dynamic-types-in-a-table).
{{% /note %}}

## Parse JSON into Flux types

The primary (but not exclusive) use case for dynamic types is converting JSON
data into native Flux types; specifically Flux [arrays](/flux/v0/data-types/composite/array/)
and [records](/flux/v0/data-types/composite/record/).

Because of strict typing rules in Flux, JSON data doesn't always gracefully parse
into native Flux types.
The most common reason is that Flux arrays require all children to be the same type.
JSON arrays allow elements to be different types.

With Flux records (the corollary of a JSON object), the properties in the record
are part of the record's type.
If you have a JSON array of objects where the objects' schemas are different,
the array cannot be parsed as a Flux array because the types of the records in
the array do not match.

{{< expand-wrapper >}}
{{% expand "View examples of JSON arrays that cannot be directly parsed into Flux arrays" %}}

#### Array of scalar values

The following array is a valid JSON array, but an invalid Flux array because
each element in the array is a different type.

```json
["three", 2, true]
```

#### Array of objects

The following array is a valid JSON array, but an invalid Flux array.
The schemas of the objects in the array do not match, so when converted to Flux
records, their types do not match and the array is invalid.

```json
[
    {"first-name": "John", "last-name": "Doe", "age": 42},
    {"first-name": "Jane", "last-name": "Doe"},
    {"first-name": "James", "last-name": "Doe", "age": 15}
]
```

{{% /expand %}}
{{< /expand-wrapper >}}

The dynamic type provides a way to resolve the differences between JSON and Flux types.

## Dynamic type syntax

Flux does not provide a literal syntax for dynamic types.
To cast a value to a dynamic type:

1.  Import the [`experimental/dynamic` package](/flux/v0/stdlib/experimental/dynamic/).
2.  Use [`dynamic.dynamic()`](/flux/v0/stdlib/experimental/dynamic/dynamic/) to
    convert a value to a dynamic type.

```js
import "experimental/dynamic"

dynamic.dynamic(v: "Example string")

// Returns dynamic(Example string)
```

## Reference values in a dynamic type

Use bracket and dot notation to reference values in dynamic records and arrays.
Use the `exists` operator to check if a dynamic type contains a non-null value.

- [Reference values in a dynamic record](#reference-values-in-a-dynamic-record)
- [Reference values in a dynamic array](#reference-values-in-a-dynamic-array)
- [Ensure a dynamic type contains a non-null value](#ensure-a-dynamic-type-contains-a-non-null-value)

### Reference values in a dynamic record

```js
import "experimental/dynamic"

record = {one: 1, two: 2, three: 3}
dynamicRecord = dynamic.dynamic(v: record)

dynamicRecord.one
// Returns dynamic(1)

dynamicRecord["two"]
// Returns dynamic(2)
```

### Reference values in a dynamic array

```js
import "experimental/dynamic"

arr = ["a", "b", "c"]
dynamicArr = dynamic.asArray(v: dynamic.dynamic(v: arr))

dynamicArr[0]
// Returns dynamic(a)
```

### Ensure a dynamic type contains a non-null value

Use the `exists` operator to check if a dynamic type contains a non-null value.
If you attempt to access members of a null dynamic value, Flux returns an error.
`exists` lets you guard against errors caused by attempting to access members in
null dynamic values.

{{< expand-wrapper >}}
{{% expand "View examples of using `exists` to check for non-null dynamic types" %}}

```js
import "experimental/dynamic"
import "internal/debug"

dynamicRecord = dynamic.dynamic(v: {one: 1, two: 2, three: 3})
dynamicNull = dynamic.dynamic(v: debug.null())

exists dynamicRecord
// Returns true

exists dynamicNull
// Returns false
```

##### Accessing members of dynamic types
```js
dynamicRecord.one
// Returns dynamic(1)

dynamicRecord.four
// Returns dynamic(<null>)

dynamicNull.one
// Error: cannot access property "one" on value of type invalid
```

{{% /expand %}}
{{< /expand-wrapper >}}

## Operate on dynamic types

- [Convert dynamic types to Flux types](#convert-dynamic-types-to-flux-types)
  - [Basic types](#basic-types)
  - [Composite types](#composite-types)

- [Include dynamic types in a table](#include-dynamic-types-in-a-table)
- [Convert a JSON array to a Flux table](#convert-a-json-array-to-a-flux-table)
- [Encode a dynamic type as JSON](#encode-a-dynamic-type-as-json)
  - [Encode a dynamic record as JSON](#encode-a-dynamic-record-as-json)
  - [Encode a dynamic array of different basic types as JSON](#encode-a-dynamic-array-of-different-basic-types-as-json)

### Convert dynamic types to Flux types

#### Basic types

{{< tabs-wrapper >}}
{{% tabs %}}
[String](#)
[Integer](#)
[UInteger](#)
[Float](#)
[Boolean](#)
[Duration](#)
[Time](#)
[Bytes](#)
[Regexp](#)
{{% /tabs %}}

{{% tab-content %}}

Use [`string()`](/flux/v0/stdlib/universe/string/) to convert a dynamic type to a string.
`string()` returns the string representation of the dynamic value.

```js
import "experimental/dynamic"

dynamicValue = dynamic.dynamic(v: "string")

string(v: dynamicValue)
// Returns "string"
```

{{% /tab-content %}}
{{% tab-content %}}

Use [`int()`](/flux/v0/stdlib/universe/int/) to convert a dynamic type to an integer.
`int()` returns the [integer equivalent](/flux/v0/data-types/basic/int/#convert-data-types-to-integers)
of the dynamic value.

```js
import "experimental/dynamic"

dynamicValue = dynamic.dynamic(v: "12")

int(v: dynamicValue)
// Returns 12
```

{{% /tab-content %}}
{{% tab-content %}}

Use [`uint()`](/flux/v0/stdlib/universe/uint/) to convert a dynamic type to an unsigned integer (UInteger).
`uint()` returns the [UInteger equivalent](/flux/v0/data-types/basic/uint/#convert-data-types-to-uintegers)
of the dynamic value.

```js
import "experimental/dynamic"

dynamicValue = dynamic.dynamic(v: "12")

uint(v: dynamicValue)
// Returns 12
```

{{% /tab-content %}}
{{% tab-content %}}

Use [`float()`](/flux/v0/stdlib/universe/float/) to convert a dynamic type to a floating point value.
`float()` returns the [float equivalent](/flux/v0/data-types/basic/float/#convert-data-types-to-floats)
of the dynamic value.

```js
import "experimental/dynamic"

dynamicValue = dynamic.dynamic(v: "12.1")

float(v: dynamicValue)
// Returns 12.1
```

{{% /tab-content %}}
{{% tab-content %}}

Use [`bool()`](/flux/v0/stdlib/universe/bool/) to convert a dynamic type to a boolean value.
`bool()` returns the [boolean equivalent](/flux/v0/data-types/basic/bool/#convert-data-types-to-booleans)
of the dynamic value.

```js
import "experimental/dynamic"

dynamicValue = dynamic.dynamic(v: "true")

bool(v: dynamicValue)
// Returns true
```

{{% /tab-content %}}
{{% tab-content %}}

Use [`duration()`](/flux/v0/stdlib/universe/duration/) to convert a dynamic type to a duration value.
`duration()` returns the [duration equivalent](/flux/v0/data-types/basic/duration/#convert-data-types-to-durations)
of the dynamic value.

```js
import "experimental/dynamic"

dynamicValue = dynamic.dynamic(v: 3000000000)

duration(v: dynamicValue)
// Returns 3s
```

{{% /tab-content %}}
{{% tab-content %}}

Use [`time()`](/flux/v0/stdlib/universe/time/) to convert a dynamic type to a time value.
`time()` returns the [time equivalent](/flux/v0/data-types/basic/time/#convert-data-types-to-time)
of the dynamic value.

```js
import "experimental/dynamic"

dynamicValue = dynamic.dynamic(v: 1640995200000000000)

time(v: dynamicValue)
// Returns 2022-01-01T00:00:00.000000000Z
```

{{% /tab-content %}}
{{% tab-content %}}

Use [`bytes()`](/flux/v0/stdlib/universe/bytes/) to convert a dynamic type to a byte-encoded string.
`bytes()` returns the [bytes equivalent](/flux/v0/data-types/basic/bytes/#convert-data-types-to-bytes)
of the dynamic value.

```js
import "experimental/dynamic"

dynamicValue = dynamic.dynamic(v: "Hello world!")

bytes(v: dynamicValue)
// Returns 0x48656c6c6f20776f726c6421
```
{{% /tab-content %}}
{{% tab-content %}}

1.  Use [`string()`](/flux/v0/stdlib/universe/string/) to convert a dynamic type to a string.
2.  Import the [`regexp` package](/flux/v0/stdlib/regexp/) and use
    [`regexp.compile()`](/flux/v0/stdlib/regexp/compile/) to convert the string
    value to a regular expression type.

```js
import "experimental/dynamic"
import "regexp"

dynamicValue = dynamic.dynamic(v: "^[abc][123]{1,}")
stringValue = string(v: dynamicValue)

regexp.compile(v: stringValue)
// Returns /^[abc][123]{1,}/
```
{{% /tab-content %}}
{{< /tabs-wrapper >}}

#### Composite types

Dynamic composite types will almost always come from working with a byte-encoded
JSON string. All the examples below assume this.

{{< tabs-wrapper >}}
{{% tabs "medium" %}}
[Array](#)
[Record](#)
{{% /tabs %}}
{{% tab-content %}}

**To convert a JSON array to a Flux array:**

1. Import the following packages:
    
    - [array](/flux/v0/stdlib/array/)
    - [experimental/dynamic](/flux/v0/stdlib/experimental/dynamic/)

2.  Use [`dynamic.jsonParse()`](/flux/v0/stdlib/experimental/dynamic/jsonparse/)
    to parse a byte-encoded JSON string into a dynamic type.
3.  Use [`dynamic.asArray()`](/flux/v0/stdlib/experimental/dynamic/asarray/)
    to convert the dynamic-typed array into an array of dynamic types.
4.  Use [`array.map()`](/flux/v0/stdlib/array/map/) to iterate over each element
    in the array and explicitly [cast dynamic types to basic types](#basic-types).

{{< expand-wrapper >}}
{{% expand "View example with an array of scalar values" %}}

##### JSON array of scalar values

```json
["3", 2, true]
```

##### Convert a JSON array of scalar values to a Flux array

```js
import "array"
import "experimental/dynamic"

json = jsonBytes // Byte-encoded JSON above
parsed = dynamic.jsonParse(data: json)

parsed
    |> dynamic.asArray()
    |> array.map(fn: (x) => int(v: x))

// Returns [3, 2, 1]
```
{{% /expand %}}

{{% expand "View example with an array of JSON objects" %}}

##### JSON array of objects

```json
[
    {"first-name": "John", "last-name": "Doe", "age": 42},
    {"first-name": "Jane", "last-name": "Doe"},
    {"first-name": "James", "last-name": "Doe", "age": 15}
]
```

##### Convert a JSON array of objects to a Flux array

```js
import "array"
import "experimental/dynamic"

json = jsonBytes // Byte-encoded JSON above
parsed = dynamic.jsonParse(data: json)

parsed
    |> dynamic.asArray()
    |> array.map(
        fn: (x) => ({
            fname: string(v: x["first-name"]),
            lname: string(v: x["last-name"]),
            age: int(v: x.age)
        }),
    )

// Returns [
//     {age: 42, fname: John, lname: Doe},
//     {age: <null>, fname: Jane, lname: Doe},
//     {age: 15, fname: James, lname: Doe}
// ]
```
{{% /expand %}}
{{< /expand-wrapper >}}

{{% /tab-content %}}
{{% tab-content %}}

**To convert a JSON object to a Flux record:**

1.  Import the [`experimental/dynamic` package](/flux/v0/stdlib/experimental/dynamic/)
2.  Use [`dynamic.jsonParse()`](/flux/v0/stdlib/experimental/dynamic/jsonparse/)
    to parse a byte-encoded JSON string into a dynamic type.
3.  Define a new record and [cast each property of the dynamic type to a basic type](#basic-types).

##### JSON object

```json
{"first-name": "John", "last-name": "Doe", "age": 42}
```

##### Convert a JSON object to a Flux record

```js
import "experimental/dynamic"

json = jsonBytes // Byte-encoded JSON above
parsed = dynamic.jsonParse(data: json)

newRecord = {
    fname: string(v: parsed["first-name"]),
    lname: string(v: parsed["last-name"]),
    age: int(v: parsed.age)
}

// newRecord returns {age: 42, fname: John, lname: Doe}
```
{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Check the type of a value inside of a dynamic type

Use [`dynamic.isType()`](/flux/v0/stdlib/experimental/dynamic/istype/) to check
the type of a value inside of a dynamic type.

The following example uses the [`http/requests` package](/flux/v0/stdlib/http/requests/)
and the [Fruityvice API](https://www.fruityvice.com/) to return information about
apples as a JSON object.

{{< expand-wrapper >}}
{{% expand "View the returned JSON object" %}}

```json
{
    "genus": "Malus",
    "name": "Apple",
    "id": 6,
    "family": "Rosaceae",
    "order": "Rosales",
    "nutritions": {
        "carbohydrates": 11.4,
        "protein": 0.3,
        "fat": 0.4,
        "calories": 52,
        "sugar": 10.3
    }
}
```

{{% /expand %}}
{{< /expand-wrapper >}}

```js
import "experimental/dynamic"

response = requests.get(url: "https://www.fruityvice.com/api/fruit/apple")
parsed = dynamic.jsonParse(data: response.body)

dynamic.isType(v: parsed.genus, type: "string")
// Returns true

dynamic.isType(v: parsed.nutritions, type: "array")
// Returns false

dynamic.isType(v: parsed.nutritions, type: "object")
// Returns true
```

### Include dynamic types in a table

**Dynamic types are not supported in Flux tables.**
To include a dynamic value in a Flux table,
[cast the dynamic type to a Flux basic type](#basic-types).

The following example uses [`array.from()`](/flux/v0/stdlib/array/from/) to 
build and ad hoc table using dynamic types.
Each dynamic type must be cast to a Flux basic type when defining the row record.

```js
import "array"
import "experimental/dynamic"

dynamicString = dynamic.dynamic(v: "one")
dynamicInt = dynamic.dynamic(v: 1)
dynamicFloat = dynamic.dynamic(v: 1.0)
dynamicBool = dynamic.dynamic(v: true)

array.from(
    rows: [
        {
            string: string(v: dynamicString),
            int: int(v: dynamicInt),
            float: float(v: dynamicFloat),
            bool: bool(v: dynamicBool),
        },
    ],
)
```

{{< expand-wrapper >}}
{{% expand "View output table" %}}

| string | int | float | bool |
| :----- | --: | ----: | :--- |
| one    | 1   | 1.0   | true |

{{% /expand %}}
{{< /expand-wrapper >}}

### Convert a JSON array to a Flux table

1.  Import the following packages:

    - [array](/flux/v0/stdlib/array/)
    - [experimental/dynamic](/flux/v0/stdlib/experimental/dynamic/)

2.  Use [`dynamic.jsonParse()`](/flux/v0/stdlib/experimental/dynamic/jsonparse/)
    to parse the the JSON response body returned from `requests.get()` into a
    Flux dynamic type.
    Define a variable to capture the parsed JSON.
    The example below uses the `parsed` variable.

3.  Use [`dynamic.asArray()`](/flux/v0/stdlib/experimental/dynamic/asarray/)
    to convert the dynamic type returned by `dynamic.jsonParse()` to a dynamic
    array. Define a variable to capture the dynamic array.
    The example below uses the `fruit` variable.

4.  Use [`array.map()`](/flux/v0/stdlib/array/map/) to do the following:

    - Iterate over each dynamic record in the dynamic array and flatten nested records.
      Flux tables do not support nested [records](/flux/v0/data-types/composite/record/)
      (the corollary of a JSON object). 
    - Explicitly [cast dynamic values in each dynamic record to a Flux basic type](#basic-types).

The following example uses the [`http/requests` package](/flux/v0/stdlib/http/requests/)
and the [Fruityvice API](https://www.fruityvice.com/) to return information about
various fruit as JSON and then structure the returned data as a Flux table.


```js
import "array"
import "experimental/dynamic"
import "http/requests"

response = requests.get(url: "https://www.fruityvice.com/api/fruit/all")
parsed = dynamic.jsonParse(data: response.body)
fruit = dynamic.asArray(v: parsed)

fruit_flat =
    fruit
        |> array.map(
            fn: (x) =>
                ({
                    name: string(v: x.name),
                    cals: int(v: x.nutritions.calories),
                    carbs: float(v: x.nutritions.carbohydrates),
                    fat: float(v: x.nutritions.fat),
                    protein: float(v: x.nutritions.protein),
                    sugar: float(v: x.nutritions.sugar),
                }),
        )

array.from(rows: fruit_flat)
```

{{< expand-wrapper >}}
{{% expand "View output table" %}}

| name         | cals | carbs |   fat | protein | sugar |
| :----------- | ---: | ----: | ----: | ------: | ----: |
| Apple        |   52 |  11.4 |   0.4 |     0.3 |  10.3 |
| Apricot      |   15 |   3.9 |   0.1 |     0.5 |   3.2 |
| Avocado      |  160 |  8.53 | 14.66 |       2 |  0.66 |
| Banana       |   96 |    22 |   0.2 |       1 |  17.2 |
| Blackberry   |   40 |     9 |   0.4 |     1.3 |   4.5 |
| Blueberry    |   29 |   5.5 |   0.4 |       0 |   5.4 |
| Cherry       |   50 |    12 |   0.3 |       1 |     8 |
| Dragonfruit  |   60 |     9 |   1.5 |       9 |     8 |
| Durian       |  147 |  27.1 |   5.3 |     1.5 |  6.75 |
| Feijoa       |   44 |     8 |   0.4 |     0.6 |     3 |
| Fig          |   74 |    19 |   0.3 |     0.8 |    16 |
| Gooseberry   |   44 |    10 |   0.6 |     0.9 |     0 |
| Grape        |   69 |  18.1 |  0.16 |    0.72 |    16 |
| Grapes       |   69 |  18.1 |  0.16 |    0.72 | 15.48 |
| GreenApple   |   21 |   3.1 |   0.1 |     0.4 |   6.4 |
| Guava        |   68 |    14 |     1 |     2.6 |     9 |
| Kiwi         |   61 |    15 |   0.5 |     1.1 |     9 |
| Kiwifruit    |   61 |  14.6 |   0.5 |    1.14 |   8.9 |
| Lemon        |   29 |     9 |   0.3 |     1.1 |   2.5 |
| Lime         |   25 |   8.4 |   0.1 |     0.3 |   1.7 |
| Lingonberry  |   50 |  11.3 |  0.34 |    0.75 |  5.74 |
| Lychee       |   66 |    17 |  0.44 |     0.8 |    15 |
| Mango        |   60 |    15 |  0.38 |    0.82 |  13.7 |
| Melon        |   34 |     8 |     0 |       0 |     8 |
| Morus        |   43 |   9.8 |  0.39 |    1.44 |   8.1 |
| Orange       |   43 |   8.3 |   0.2 |       1 |   8.2 |
| Papaya       |   43 |    11 |   0.4 |       0 |     1 |
| Passionfruit |   97 |  22.4 |   0.7 |     2.2 |  11.2 |
| Pear         |   57 |    15 |   0.1 |     0.4 |    10 |
| Persimmon    |   81 |    18 |     0 |       0 |    18 |
| Pineapple    |   50 | 13.12 |  0.12 |    0.54 |  9.85 |
| Pitahaya     |   36 |     7 |   0.4 |       1 |     3 |
| Plum         |   46 |  11.4 |  0.28 |     0.7 |  9.92 |
| Pomegranate  |   83 |  18.7 |   1.2 |     1.7 |  13.7 |
| Raspberry    |   53 |    12 |   0.7 |     1.2 |   4.4 |
| Strawberry   |   29 |   5.5 |   0.4 |     0.8 |   5.4 |
| Tangerine    |   45 |   8.3 |   0.4 |       0 |   9.1 |
| Tomato       |   74 |   3.9 |   0.2 |     0.9 |   2.6 |
| Watermelon   |   30 |     8 |   0.2 |     0.6 |     6 |

{{% /expand %}}
{{< /expand-wrapper >}}

### Encode a dynamic type as JSON

#### Encode a dynamic record as JSON

1.  Import the `experimental/dynamic` package.
2.  Use [`dynamic.dynamic()`](/flux/v0/stdlib/experimental/dynamic/dynamic/)
    to convert the record to a dynamic type.
3.  Use [`dynamic.jsonEncode()`](/flux/v0/stdlib/experimental/dynamic/jsonencode/)
    to convert the dynamic record into a byte-encoded JSON string.

```js
import "experimental/dynamic"

dynamicRecord = dynamic.dynamic(v: {one: 1, two: 2, three: 3})

dynamic.jsonEncode(v: dynamicRecord)

// Returns the following byte-encoded JSON string:
// {"one":1,"three":3,"two":2}
```

#### Encode a dynamic array of different basic types as JSON

Build a dynamic array where each element is a different basic type.
This might be necessary if you're send JSON data to an API that expects an array
of values where each value is a different type.
Values in a Flux array must be the same type, so you must build a dynamic array
of dynamic types:

1.  Import the `experimental/dynamic` package.
2.  Use [`dynamic.dynamic()`](/flux/v0/stdlib/experimental/dynamic/dynamic/)\
    to convert the array to a dynamic type.
3.  Use `dynamic.dynamic()` to convert all values in the array to dynamic types.
4.  Use [`dynamic.jsonEncode()`](/flux/v0/stdlib/experimental/dynamic/jsonencode/)
    to convert the dynamic array into a byte-encoded JSON string.

```js
import "experimental/dynamic"

arr =
    dynamic.dynamic(
        v: [
            dynamic.dynamic(v: "three"),
            dynamic.dynamic(v: 2),
            dynamic.dynamic(v: true)
        ],
    )

dynamic.jsonEncode(v: arr)

// Returns the following byte-encoded JSON string:
// ["three", 2, true]
```
