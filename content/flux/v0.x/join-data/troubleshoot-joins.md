---
title: Troubleshoot join operations
description: >
  ...
menu:
  flux_0_x:
    name: Troubleshoot joins
    parent: Join data
weight: 105
---

## Behaviors

- Columns explicitly mapped in the join are all _null_.
    - This likely means the group keys of your input streams do not match.
      The group keys of each input stream needs to be the same when using the `join`
      package to join data. Each join function only compares table in the two
      input streams whose [group key instances match](#).

## Error messages

```
cannot set join columns in left table stream: table is missing column 'station'
```

In the `on` predicate function, you're trying to compare a column that doesn't
exist in the primary join stream specified stream.

```
table is missing label <label>
```

In an outer join, you're trying to use a value from a column that doesn't exist
in the "weighted" stream (`left` for `join.left()` and `right` for `join.right()`).


```
record is missing label <label> (argument <left or right>)
```

In the `on` predicate function, you're trying to evaluate a column that does exist
in the specified argument.

In an outer join, you're trying to use a value from a column that doesn't exist
in the "un-weighted" stream (`right` for `join.left()` and `left` for `join.right()`).
