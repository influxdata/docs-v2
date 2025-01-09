Use partition templates to define the patterns used to generate partition keys.
A partition key uniquely identifies a partition and is used to name the partition
Parquet file in the [Object store](/influxdb/cloud-dedicated/reference/internals/storage-engine/#object-store).

A partition template consists of 1-8 _template parts_---dimensions to partition data by.
Three types of template parts exist:

- **tag**: An [InfluxDB tag](/influxdb/cloud-dedicated/reference/glossary/#tag)
  to partition by.
- **tag bucket**: An [InfluxDB tag](/influxdb/cloud-dedicated/reference/glossary/#tag)
  and number of "buckets" to group tag values into. Data is partitioned by the
  tag bucket rather than each distinct tag value.
- {{< req type="key" >}} **time**: A Rust strftime date and time string that specifies the time interval
  to partition data by. The smallest unit of time included in the time part
  template is the interval used to partition data.

{{% note %}}
A partition template must include 1 [time part](#time-part-templates)
and can include up to 7 total [tag](#tag-part-templates) and [tag bucket](#tag-bucket-part-templates) parts.
{{% /note %}}

<!-- TOC -->
- [Restrictions](#restrictions)
  - [Template part size limit](#template-part-size-limit)
  - [Reserved keywords](#reserved-keywords)
  - [Reserved Characters](#reserved-characters)
- [Tag part templates](#tag-part-templates)
- [Tag bucket part templates](#tag-bucket-part-templates)
- [Time part templates](#time-part-templates)
<!-- /TOC -->

## Restrictions

### Template part size limit

Each template part is limited to 200 bytes in length.
Anything longer will be truncated at 200 bytes and appended with `#`.

### Partition key size limit

With the truncation of template parts, the maximum length of a partition key is
1,607 bytes (1.57 KiB).

### Reserved keywords

The following reserved keywords cannot be used in partition templates:

- `time`

### Reserved Characters

If used in template parts, non-ASCII characters and the following reserved
characters must be [percent encoded](https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding):

- `|`: Partition key part delimiter
- `!`: Null or missing partition key part
- `^`: Empty string partition key part
- `#`: Key part truncation marker
- `%`: Required for unambiguous reversal of percent encoding

## Tag part templates

Tag part templates consist of a _tag key_ to partition by.
Generated partition keys include the unique _tag value_ specific to each partition.

A partition template may include a given tag key only once in template parts 
that operate on tags (tag value and tag bucket)--for example:

If a template partitions on unique values of `tag_A`, then
you can't use `tag_A` as a tag bucket part.

## Tag bucket part templates

Tag bucket part templates consist of a _tag key_ to partition by and the
_number of "buckets" to partition tag values into_--for example:

```
customerID,500
```

Values of the `customerID` tag are bucketed into 500 distinct "buckets." 
Each bucket is identified by the remainder of the tag value hashed into a 32bit
integer divided by the specified number of buckets:

```rust
hash(tagValue) % N
```

Generated partition keys include the unique _tag bucket identifier_ specific to
each partition.

**Supported number of tag buckets**: 1-1,000

{{% note %}}
Tag buckets should be used to partition by high cardinality tags or tags with an
unknown number of distinct values.
{{% /note %}}

A partition template may include a given tag key only once in template parts 
that operate on tags (tag value and tag bucket)--for example:

If a template partitions on unique values of `tag_A`, then
you can't use `tag_A` as a tag bucket part.

## Time part templates

Time part templates use a limited subset of the
[Rust strftime date and time formatting syntax](https://docs.rs/chrono/latest/chrono/format/strftime/index.html)
to specify time format in partition keys.
Time part templates can be daily (`%Y-%m-%d`), monthly (`%Y-%m`), or yearly (`%Y`).
InfluxDB uses the smallest unit of time included in the time part template as
the partition interval.

InfluxDB supports only [date specifiers](#date-specifiers) in time part templates. 

### Date specifiers

Time part templates allow only the following date specifiers:

| Variable | Example      | Description                                                                                                                                                                         |
| :------: | :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   `%Y`   | `2001`       | The full proleptic Gregorian year, zero-padded to 4 digits. chrono supports years from -262144 to 262143. Note: years before 1 BCE or after 9999 CE, require an initial sign (+/-). |
|   `%m`   | `07`         | Month number (01--12), zero-padded to 2 digits.                                                                                                                                     |
|   `%d`   | `08`         | Day number (01--31), zero-padded to 2 digits.                                                                                                                                       |
