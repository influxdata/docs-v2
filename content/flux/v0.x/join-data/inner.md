---
title: Perform an inner join
list_title: Inner join
description: >
  ...
menu:
  flux_0_x:
    name: Inner join
    parent: Join data
weight: 101
related:
  - /flux/v0.x/stdlib/join/
  - /flux/v0.x/stdlib/join/inner/
---

Use [`join.inner()`](/flux/v0.x/stdlib/join/inner/) to perform an inner join of two streams of data.

Inner joins drop any rows from both input streams that do not have a matching
row in the other stream.


## Prepare your data
To join two streams of data with the `join` package, each stream must have:

- **One or more columns with common values to join on**.  
  The `on` parameter defines the **join predicate**–a predicate function
  that compares column values from each input stream to determine what rows
  from each stream should be joined together.
- **Identical [group keys](/flux/v0.x/get-started/data-model/#group-key)**.  
  Functions in the `join` package use group keys to quickly determine what tables
  from each input stream should be paired and evaluated for the join operation.
  Because of that, both input streams must have the same group key.
  This likely requires using [`group()`](/flux/v0.x/stdlib/universe/group/)
  to regroup each input stream before joining them together.