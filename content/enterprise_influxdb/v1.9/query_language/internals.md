---
title: InfluxQL internals reference
description: Read about the implementation of InfluxQL.
menu:
  enterprise_influxdb_1_9:
    name: InfluxQL internals
    weight: 91
    parent: InfluxQL
---


Learn about the implementation of InfluxQL to understand how
results are processed and how to create efficient queries.

## Query life cycle

1. InfluxQL query string is tokenized and then parsed into an abstract syntax
   tree (AST). This is the code representation of the query itself.

2. The AST is passed to the `QueryExecutor` which directs queries to the
   appropriate handlers. For example, queries related to meta data are executed
   by the meta service and `SELECT` statements are executed by the shards
   themselves.

3. The query engine then determines the shards that match the `SELECT`
   statement's time range. From these shards, iterators are created for each
   field in the statement.

4. Iterators are passed to the emitter which drains them and joins the resulting
   points. The emitter's job is to convert simple time/value points into the
   more complex result objects that are returned to the client.

### Understanding iterators

Iterators  provide a simple interface for looping over a set of points.
For example, this is an iterator over Float points:

```
type FloatIterator interface {
    Next() *FloatPoint
}
```

These iterators are created through the `IteratorCreator` interface:

```
type IteratorCreator interface {
    CreateIterator(opt *IteratorOptions) (Iterator, error)
}
```

The `IteratorOptions` provide arguments about field selection, time ranges,
and dimensions that the iterator creator can use when planning an iterator.
The `IteratorCreator` interface is used at many levels such as the `Shards`,
`Shard`, and `Engine`. This allows optimizations to be performed when applicable
such as returning a precomputed `COUNT()`.

Iterators aren't just for reading raw data from storage though. Iterators can be
composed so that they provided additional functionality around an input
iterator. For example, a `DistinctIterator` can compute the distinct values for
each time window for an input iterator. Or a `FillIterator` can generate
additional points that are missing from an input iterator.

This composition also lends itself well to aggregation. For example, a statement
such as this:

```sql
SELECT MEAN(value) FROM cpu GROUP BY time(10m)
```

In this case, `MEAN(value)` is a `MeanIterator` wrapping an iterator from the
underlying shards. However, if we can add an additional iterator to determine
the derivative of the mean:

```sql
SELECT DERIVATIVE(MEAN(value), 20m) FROM cpu GROUP BY time(10m)
```

### Understanding cursors

A **cursor** identifies data by shard in tuples (time, value) for a single series (measurement, tag set and field). The cursor trasverses data stored as a log-structured merge-tree and handles deduplication across levels, tombstones for deleted data, and merging the cache (Write Ahead Log). A cursor sorts the `(time, value)` tuples by time in ascending or descending order.

For example, a query that evaluates one field for 1,000 series over 3 shards constructs a minimum of 3,000 cursors (1,000 per shard).

### Auxiliary fields

Because InfluxQL allows users to use selector functions such as `FIRST()`,
`LAST()`, `MIN()`, and `MAX()`, the engine must provide a way to return related
data at the same time with the selected point.

For example, in this query:

```sql
SELECT FIRST(value), host FROM cpu GROUP BY time(1h)
```

We are selecting the first `value` that occurs every hour but we also want to
retrieve the `host` associated with that point. Since the `Point` types only
specify a single typed `Value` for efficiency, we push the `host` into the
auxiliary fields of the point. These auxiliary fields are attached to the point
until it is passed to the emitter where the fields get split off to their own
iterator.

### Built-in iterators

There are many helper iterators that let us build queries:

* Merge Iterator - This iterator combines one or more iterators into a single
  new iterator of the same type. This iterator guarantees that all points
  within a window will be output before starting the next window but does not
  provide ordering guarantees within the window. This allows for fast access
  for aggregate queries which do not need stronger sorting guarantees.

* Sorted Merge Iterator - This iterator also combines one or more iterators
  into a new iterator of the same type. However, this iterator guarantees
  time ordering of every point. This makes it slower than the `MergeIterator`
  but this ordering guarantee is required for non-aggregate queries which
  return the raw data points.

* Limit Iterator - This iterator limits the number of points per name/tag
  group. This is the implementation of the `LIMIT` & `OFFSET` syntax.

* Fill Iterator - This iterator injects extra points if they are missing from
  the input iterator. It can provide `null` points, points with the previous
  value, or points with a specific value.

* Buffered Iterator - This iterator provides the ability to "unread" a point
  back onto a buffer so it can be read again next time. This is used extensively
  to provide lookahead for windowing.

* Reduce Iterator - This iterator calls a reduction function for each point in
  a window. When the window is complete then all points for that window are
  output. This is used for simple aggregate functions such as `COUNT()`.

* Reduce Slice Iterator - This iterator collects all points for a window first
  and then passes them all to a reduction function at once. The results are
  returned from the iterator. This is used for aggregate functions such as
  `DERIVATIVE()`.

* Transform Iterator - This iterator calls a transform function for each point
  from an input iterator. This is used for executing binary expressions.

* Dedupe Iterator - This iterator only outputs unique points. It is resource
  intensive so it is only used for small queries such as meta query statements.

### Call iterators

Function calls in InfluxQL are implemented at two levels. Some calls can be
wrapped at multiple layers to improve efficiency. For example, a `COUNT()` can
be performed at the shard level and then multiple `CountIterator`s can be
wrapped with another `CountIterator` to compute the count of all shards. These
iterators can be created using `NewCallIterator()`.

Some iterators are more complex or need to be implemented at a higher level.
For example, the `DERIVATIVE()` needs to retrieve all points for a window first
before performing the calculation. This iterator is created by the engine itself
and is never requested to be created by the lower levels.
