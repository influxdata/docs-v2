Use partition templates to define the patterns used to generate partition keys.
A partition key uniquely identifies a partition and is used to name the partition
Parquet file in the [Object store](/influxdb/version/reference/internals/storage-engine/#object-store).

A partition template defines how InfluxDB groups data into partitions by specifying 1-8 _template parts_.
Each template part represents a dimension to partition data by.

- [Template part types](#template-part-types)
- [Requirements and guidelines](#requirements-and-guidelines)
- [Restrictions](#restrictions)
  - [Template part size limit](#template-part-size-limit)
  - [Partition key size limit](#partition-key-size-limit)
  - [Reserved keywords](#reserved-keywords)
  - [Reserved Characters](#reserved-characters)
- [Tag part templates](#tag-part-templates)
- [Tag bucket part templates](#tag-bucket-part-templates)
- [Time part templates](#time-part-templates)
  - [Date specifiers](#date-specifiers)

## Template part types

InfluxDB supports three types of partition template parts:

- **Tag part**: Partitions data by the unique values of an [InfluxDB tag](/influxdb/version/reference/glossary/#tag).
  For example, using `region` as a tag part creates separate partitions for each region value (us-west, us-east, eu-central).

- **Tag bucket part**: Partitions data by "buckets" of [InfluxDB tag](/influxdb/version/reference/glossary/#tag) values.
  Instead of creating a partition for every unique tag value, tag values are hashed and grouped into a specified number of buckets.
  Use this for high-cardinality tags or when the number of distinct values is unknown.

- {{< req type="key" >}} **Time part**: Partitions data by time intervals using a Rust strftime date and time format string.
  The smallest time unit in your format determines the granularity of time partitioning (yearly with `%Y`, 
  monthly with `%Y-%m`, or daily with `%Y-%m-%d`).

## Requirements and guidelines

When creating a partition template:

1. **Include exactly one time part**
   - Always specify a [time part](#time-part-templates) in your template
   - With `influxctl`, always include `--template-timeformat` with a valid format
   - Without a time part, InfluxDB won't compact partitions, impacting performance
   - If you include more than one time part, InfluxDB uses the smallest unit of time
   - Use one of the following Rust strftime date and time strings:
     
      - `%Y-%m-%d` (daily)
      - `%Y-%m` (monthly)
      - `%Y` (annually)

2. **Tag and tag bucket limitations**
   - Include up to seven [tag](#tag-part-templates) and [tag bucket](#tag-bucket-part-templates) parts
   - Don't use the same tag key in both a tag part and a tag bucket part--for example,
     if your template uses `region` as a tag part, you cannot use `region` as a tag bucket part

3. **Maximum template parts**: 8 total (1 time part + up to 7 tag and tag bucket parts)

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

Tag part templates consist of a [_tag key_](/influxdb3/cloud-dedicated/reference/glossary/#tag) to partition by.
Generated partition keys include the unique _tag value_ specific to each partition.

A partition template may include a given tag key only once in template parts 
that operate on tags (tag value and tag bucket)--for example,
if a template partitions on unique values of `tag_A`, then
you can't use `tag_A` as a tag bucket part.

## Tag bucket part templates

Tag bucket part templates consist of a [_tag key_](/influxdb3/cloud-dedicated/reference/glossary/#tag) to partition by and the
_number of "buckets" to partition tag values into_--for example:

```
customerID,500
```

Values of the `customerID` tag are bucketed into 500 distinct "buckets." 
Each bucket is identified by the remainder of the tag value hashed into a 32-bit
integer divided by the specified number of buckets:

```rust
hash(tagValue) % N
```

Generated partition keys include the unique _tag bucket identifier_ specific to
each partition.

**Supported number of tag buckets**: 1-1,000

> [!Note]
> Tag buckets should be used to partition by high cardinality tags or tags with an
> unknown number of distinct values.

A partition template may include a given tag key only once in template parts 
that operate on tags (tag value and tag bucket)--for example,
if a template partitions on unique values of `tag_A`, then
you can't use `tag_A` as a tag bucket part.

## Time part templates

Time part templates use a limited subset of the
[Rust strftime date and time formatting syntax](https://docs.rs/chrono/latest/chrono/format/strftime/index.html)
to specify time format in partition keys.
Time part templates can be daily (`%Y-%m-%d`), monthly (`%Y-%m`), or yearly (`%Y`).
InfluxDB partitions data by the smallest unit of time included in the time part
template.

InfluxDB supports only [date specifiers](#date-specifiers) in time part templates. 

### Date specifiers

Time part templates allow only the following date specifiers:

| Variable | Example      | Description                                                                                                                                                                         |
| :------: | :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   `%Y`   | `2001`       | The full proleptic Gregorian year, zero-padded to 4 digits. chrono supports years from -262144 to 262143. Note: years before 1 BCE or after 9999 CE, require an initial sign (+/-). |
|   `%m`   | `07`         | Month number (01--12), zero-padded to 2 digits.                                                                                                                                     |
|   `%d`   | `08`         | Day number (01--31), zero-padded to 2 digits.                                                                                                                                       |
