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
that users may run into when using the [`join` package](/flux/v0.x/stdlib/join).
If you have questions about a behavior or error that is not documented here,
please submit an issue to either the InfluxData Documentation or Flux GitHub repositories:

- [Submit a documentation issue](https://github.com/influxdata/docs-v2/issues/new/choose)
- [Submit a Flux issue](https://github.com/influxdata/flux/issues/new/choose)
{{% /note %}}

- [Troubleshoot join behaviors](#troubleshoot-join-behaviors)
- [Troubleshoot join error messages](#troubleshoot-join-error-messages)

## Troubleshoot join behaviors

### Columns explicitly mapped in the join are null

In some cases, your join output may include _null_ values in
columns where you expect non-null values. This may be caused by one of the following issues:

---

{{< flex class="troubleshoot-row" >}}
{{% flex-content %}}
#### Cause {#cause-b1}

**The group keys of each input stream aren't the same.**
Functions in the `join` package use group keys to quickly identify what tables
should be compared.
{{% /flex-content %}}
{{% flex-content %}}
#### Solution {#solution-b1}

Use [`group()`](/flux/v0.x/stdlib/universe/group/) to regroup
your two input streams so their group keys match before attempting to join
them together.
{{% /flex-content %}}
{{< /flex >}}

---

{{< flex >}}
{{% flex-content %}}
#### Cause {#cause-b2}

**There are no matching _group key instances_ in your data streams**.
Functions in the `join` package only compare tables with matching
[group key instances](/flux/v0.x/get-started/data-model/#example-group-key-instances).
Input streams may have matching group keys, but there are no matching group
key instances in your stream.

This may happen when joining two separate fields
queried from InfluxDB. By default, InfluxDB returns data with `_field` as part
of the group key. If each stream contains a different field, tables in the two
streams won't be compared because they won't have any matching _group key instances_.
{{% /flex-content %}}

{{% flex-content %}}
#### Solution {#solution-b2}

Use [`group()`](/flux/v0.x/stdlib/universe/group/) to remove 
any columns from the group keys of each input stream that would prevent
group key instances from matching.
{{% /flex-content %}}
{{< /flex >}}

---

## Troubleshoot join error messages

- [table is missing column \'\<column\>\'](#table-is-missing-column-column)
- [table is missing label \<label\>](#table-is-missing-label-label)
- [record is missing label \<label\>](#record-is-missing-label-label)
- [cannot join on an empty table](#cannot-join-on-an-empty-table)

### table is missing column `'<column>'`

##### Error message
```js
cannot set join columns in left table stream: table is missing column '<column>'
```

{{< flex >}}
{{% flex-content %}}
#### Cause {#cause-e1}

**Your `on` join predicate uses a column that doesn't exist**.
In the `on` predicate function, you're trying to compare a column
that doesn't exist in one of your input streams.
{{% /flex-content %}}
{{% flex-content %}}
#### Solution {#solution-e1}

Ensure the columns that you're comparing in the `on` predicate
function exist in the input streams.
If necessary, update column names in the predicate function.
{{% /flex-content %}}
{{< /flex >}}

---

### table is missing label `<label>`

##### Error message
```js
table is missing label <label>
```

{{< flex >}}
{{% flex-content %}}
#### Cause {#cause-e2}

**Your `on` join predicate uses a column that doesn't exist**.
In the `on` predicate function for an outer join, you're trying to use a value
from a column that doesn't exist in the "primary" input stream
(`left` for `join.left()` and `right` for `join.right()`).
{{% /flex-content %}}
{{% flex-content %}}
#### Solution {#solution-e2}

Ensure the columns that you're comparing in the `on` predicate
function actually exist in the input streams.
If necessary, update column names in the predicate function.
{{% /flex-content %}}
{{< /flex >}}

---

### record is missing label `<label>`

##### Error message
```js
record is missing label <label> (argument <left or right>)
```

{{< flex >}}
{{% flex-content %}}
#### Cause {#cause-e3}

**Your `on` join predicate uses a column that doesn't exist**.
In the `on` predicate function, you're trying to compare a column
that doesn't exist in one of your input streams.
{{% /flex-content %}}
{{% flex-content %}}
#### Solution {#solution-e3}

Ensure the columns that you're comparing in the `on` predicate
function actually exist in the input streams.
If necessary, update column names in the predicate function.
{{% /flex-content %}}
{{< /flex >}}

---

{{< flex >}}
{{% flex-content %}}
#### Cause {#cause-e4}

**Your `as` output schema function uses a column that doesn't exist**.
If using an **outer join**, the `as` is trying to use a value
from a column that doesn't exist in the "primary" input stream
(`left` for `join.left()` and `right` for `join.right()`).
{{% /flex-content %}}
{{% flex-content %}}
#### Solution {#solution-e4}

Ensure the columns that you're using in the `as` output function to assign
values to the output actually exist in the input streams.
{{% /flex-content %}}
{{< /flex >}}

---

### cannot join on an empty table

##### Error message
```js
error preparing <left or right> side of join: cannot join on an empty table
```

{{< flex >}}
{{% flex-content %}}
#### Cause {#cause-e3}

**One of your input streams is an empty stream of tables**.
Functions in the join package error when one or both of the input
streams are empty.
{{% /flex-content %}}
{{% flex-content %}}
#### Solution {#solution-e3}

Use [`array.from()`](/flux/v0.x/stdlib/array/from/) and
[`union()`](/flux/v0.x/stdlib/universe/union/) to insert a dummy table into each
stream that you filter out after the join operation.
The dummy table needs to include all group key columns of the stream it is unioned with.

{{% /flex-content %}}
{{< /flex >}}
