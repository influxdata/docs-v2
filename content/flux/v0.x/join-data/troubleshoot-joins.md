---
title: Troubleshoot join operations
description: >
  Learn how to troubleshoot common behaviors and errors that may occur when using
  the [`join` package](/flux/v0.x/stdlib/join).
menu:
  flux_0_x:
    name: Troubleshoot joins
    parent: Join data
weight: 105
---

Learn how to troubleshoot common behaviors and errors that may occur when using
the [`join` package](/flux/v0.x/stdlib/join).

{{% note %}}
#### Submit issues for unexplained behaviors or errors

This is a "living" document that may be updated with common issues
that users may run into when using the [`join` package](/flux/v0.x/stdlib/join)
to join data. If you have questions about a behavior or error that is not
documented here, please submit an issue on either the InfluxData Documentation
or Flux GitHub repositories:

- [Submit a documentation issue](https://github.com/influxdata/docs-v2/issues/new/choose)
- [Submit a Flux issue](https://github.com/influxdata/flux/issues/new/choose)
{{% /note %}}

- [Troubleshoot join behaviors](#troubleshoot-join-behaviors)
- [Troubleshoot join error messages](#troubleshoot-join-error-messages)

## Troubleshoot join behaviors

### Columns explicitly mapped in the join are null

In some cases, your join output may include _null_ values in
columns where you expect non-null values. This may be caused by one of the following issues:

- **The group keys of your input streams are different**

  **Issue**:
  The group keys of each input stream aren't the same.
  Functions in the `join` package use group keys to quickly identify what tables
  should be compared.

  **Solution**:
  Use [`group()`](/flux/v0.x/stdlib/universe/group/) to regroup
  your two input streams so their group keys match before attempting to join
  them together.
  
- **There are no matching _group key instances_ in your data streams**

  **Issue**: Functions in the `join` package only compare tables with matching
  [group key instances](/flux/v0.x/get-started/data-model/#example-group-key-instances).
  Input streams may have matching group keys, but there are no matching group
  key instances in your stream.

  This may happen when joining two separate fields
  queried from InfluxDB. By default, InfluxDB returns data with `_field` as part
  of the group key. If each stream contains a different field, tables in the two
  streams won't be compared because they won't have any matching _group key instances_.

  **Solution**: Use [`group()`](/flux/v0.x/stdlib/universe/group/) to remove 
  any columns from the group keys of each input stream that would prevent
  group key instances from matching.

## Troubleshoot join error messages

- [table is missing column \'\<column\>\'](#table-is-missing-column-column)
- [table is missing label \<label\>](#table-is-missing-label-label)
- [record is missing label \<label\>](#record-is-missing-label-label)

### table is missing column `'<column>'`

##### Error message
```js
cannot set join columns in left table stream: table is missing column '<column>'
```
##### Causes

- **Your `on` join predicate uses a column that doesn't exist**

  **Issue**: In the `on` predicate function, you're trying to compare a column
  that doesn't exist in one of your input streams.

  **Solution**: Ensure the columns that you're comparing in the `on` predicate
  function exist in the input streams.
  If necessary, update column names in the predicate function.

### table is missing label `<label>`

##### Error message
```js
table is missing label <label>
```

##### Causes

- **Your `on` join predicate uses a column that doesn't exist**

  **Issue**:
  In the `on` predicate function for an outer join, you're trying to use a value
  from a column that doesn't exist in the "primary" input stream
  (`left` for `join.left()` and `right` for `join.right()`).

  **Solution**: Ensure the columns that you're comparing in the `on` predicate
  function actually exist in the input streams.
  If necessary, update column names in the predicate function.

### record is missing label `<label>`

##### Error message
```js
record is missing label <label> (argument <left or right>)
```

##### Causes

- **Your `on` join predicate uses a column that doesn't exist**

  **Issue 1**: In the `on` predicate function, you're trying to compare a column
  that doesn't exist in one of your input streams.

  **Issue 2**:
  In the `on` predicate function for an outer join, you're trying to use a value
  from a column that doesn't exist in the "primary" input stream
  (`left` for `join.left()` and `right` for `join.right()`).

  **Solution**: Ensure the columns that you're comparing in the `on` predicate
  function actually exist in the input streams.
  If necessary, update column names in the predicate function.
