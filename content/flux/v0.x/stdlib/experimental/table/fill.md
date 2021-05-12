---
title: table.fill() function
description: >
  The `table.fill()` function adds a single row to empty tables in a stream of tables.
  Columns in the group key are filled with the column value defined in the group key.
  Columns not in the group key are filled with a null value.
menu:
  flux_0_x_ref:
    name: table.fill
    parent: table-exp
weight: 401
flux/v0.x/tags: [transformations, fill]
---

The `table.fill()` function adds a single row to empty tables in a stream of tables.
Columns that are in the group key are filled with the column value defined in the group key.
Columns not in the group key are filled with a null value.

```js
import "experimental/table"

table.fill()
```

## Examples

##### Query
```js
import "experimental/table"

data
  |> table.fill()
```

{{< flex >}}
{{% flex-content %}}
##### Input data

<p class="table-group-key">Group key = [host: "host1", _field: "f1"]</p>

| host  | _field | time | _value |
| :---- | :----- | :--- | -----: |
| host1 | f1     | 0001 |    2.8 |
| host1 | f1     | 0002 |    3.2 |
| host1 | f1     | 0003 |    3.3 |

<p class="table-group-key">Group key = [host: "host2", _field: "f1"]</p>

| host | _field | time | _value |
| :--- | :----- | :--- | -----: |

<p class="table-group-key">Group key = [host: "host3", _field: "f1"]</p>

| host  | _field | time | _value |
| :---- | :----- | :--- | -----: |
| host3 | f1     | 0001 |    1.4 |
| host3 | f1     | 0002 |    1.5 |
| host3 | f1     | 0003 |    2.7 |
{{% /flex-content %}}
{{% flex-content %}}
##### Output data

<p class="table-group-key">Group key = [host: "host1", _field: "f1"]</p>

| host  | _field | time | _value |
| :---- | :----- | :--- | -----: |
| host1 | f1     | 0001 |    2.8 |
| host1 | f1     | 0002 |    3.2 |
| host1 | f1     | 0003 |    3.3 |

<p class="table-group-key">Group key = [host: "host2", _field: "f1"]</p>

| host  | _field | time | _value |
| :---- | :----- | :--- | -----: |
| host2 | f1     |      |        |

<p class="table-group-key">Group key = [host: "host3", _field: "f1"]</p>

| host  | _field | time | _value |
| :---- | :----- | :--- | -----: |
| host3 | f1     | 0001 |    1.4 |
| host3 | f1     | 0002 |    1.5 |
| host3 | f1     | 0003 |    2.7 |
{{% /flex-content %}}
{{< /flex >}}
