
Flux provides functions that let you explore the structure and schema of your
data stored in InfluxDB.

- [List buckets](#list-buckets)
- [List measurements](#list-measurements)
- [List field keys](#list-field-keys)
- [List tag keys](#list-tag-keys)
- [List tag values](#list-tag-values)

{{% warn %}}
Functions in the `schema` package are not supported in the [Flux REPL](/influxdb/version/tools/repl/).
{{% /warn %}}

## List buckets
Use [`buckets()`](/flux/v0/stdlib/universe/buckets/)
to list **buckets in your organization**.

```js
buckets()
```

{{< expand-wrapper >}}
{{% expand "View example `buckets()` output" %}}

`buckets()` returns a single table with the following columns:

- **organizationID**: Organization ID
- **name**: Bucket name
- **id**: Bucket ID
- **retentionPolicy**: Retention policy associated with the bucket
- **retentionPeriod**: Retention period in nanoseconds

| organizationID | name             | id      | retentionPolicy | retentionPeriod |
| :------------- | :--------------- | :------ | :-------------- | --------------: |
| XooX0x0        | _monitoring      | XooX0x1 |                 | 604800000000000 |
| XooX0x0        | _tasks           | XooX0x2 |                 | 259200000000000 |
| XooX0x0        | example-bucket-1 | XooX0x3 |                 |               0 |
| XooX0x0        | example-bucket-2 | XooX0x4 |                 |               0 |
| XooX0x0        | example-bucket-3 | XooX0x5 |                 | 172800000000000 |

{{% /expand %}}
{{< /expand-wrapper >}}

## List measurements
Use [`schema.measurements()`](/flux/v0/stdlib/influxdata/influxdb/schema/measurements)
to list **measurements in a bucket**.
_By default, this function returns results from the last 30 days._

```js
import "influxdata/influxdb/schema"

schema.measurements(bucket: "example-bucket")
```

{{< expand-wrapper >}}
{{% expand "View example `schema.measurements()` output" %}}

`schema.measurements()` returns a single table with a `_value` column.
Each row contains the name of a measurement.

| _value |
| :----- |
| m1     |
| m2     |
| m3     |
| m4     |
| m5     |

{{% /expand %}}
{{< /expand-wrapper >}}

## List field keys
Use [`schema.fieldKeys`](/flux/v0/stdlib/influxdata/influxdb/schema/fieldkeys)
to list **field keys in a bucket**.
_By default, this function returns results from the last 30 days._

```js
import "influxdata/influxdb/schema"

schema.fieldKeys(bucket: "example-bucket")
```

{{< expand-wrapper >}}
{{% expand "View example `schema.fieldKeys()` output" %}}

`schema.fieldKeys()` returns a single table with a `_value` column.
Each row contains a unique field key from the specified bucket.

| _value |
| :----- |
| field1 |
| field2 |
| field3 |
| field4 |
| field5 |

{{% /expand %}}
{{< /expand-wrapper >}}

### List fields in a measurement
Use [`schema.measurementFieldKeys`](/flux/v0/stdlib/influxdata/influxdb/schema/measurementfieldkeys)
to list **field keys in a measurement**.
_By default, this function returns results from the last 30 days._

```js
import "influxdata/influxdb/schema"

schema.measurementFieldKeys(
    bucket: "example-bucket",
    measurement: "example-measurement",
)
```

{{< expand-wrapper >}}
{{% expand "View example `schema.measurementFieldKeys()` output" %}}

`schema.measurementFieldKeys()` returns a single table with a `_value` column.
Each row contains the name of a unique field key in the specified bucket and measurement.

| _value |
| :----- |
| field1 |
| field2 |
| field3 |
| field4 |
| field5 |

{{% /expand %}}
{{< /expand-wrapper >}}

## List tag keys
Use [`schema.tagKeys()`](/flux/v0/stdlib/influxdata/influxdb/schema/tagkeys)
to list **tag keys in a bucket**.
_By default, this function returns results from the last 30 days._

```js
import "influxdata/influxdb/schema"

schema.tagKeys(bucket: "example-bucket")
```

{{< expand-wrapper >}}
{{% expand "View example `schema.tagKeys()` output" %}}

`schema.tagKeys()` returns a single table with a `_value` column.
Each row contains the a unique tag key from the specified bucket.

| _value |
| :----- |
| tag1   |
| tag2   |
| tag3   |
| tag4   |
| tag5   |

{{% /expand %}}
{{< /expand-wrapper >}}

### List tag keys in a measurement
Use [`schema.measurementTagKeys`](/flux/v0/stdlib/influxdata/influxdb/schema/measurementtagkeys)
to list **tag keys in a measurement**.
_By default, this function returns results from the last 30 days._

```js
import "influxdata/influxdb/schema"

schema.measurementTagKeys(
    bucket: "example-bucket",
    measurement: "example-measurement",
)
```

{{< expand-wrapper >}}
{{% expand "View example `schema.measurementTagKeys()` output" %}}

`schema.measurementTagKeys()` returns a single table with a `_value` column.
Each row contains a unique tag key from the specified bucket and measurement.

| _value |
| :----- |
| tag1   |
| tag2   |
| tag3   |
| tag4   |
| tag5   |

{{% /expand %}}
{{< /expand-wrapper >}}

## List tag values
Use [`schema.tagValues()`](/flux/v0/stdlib/influxdata/influxdb/schema/tagvalues)
to list **tag values for a given tag in a bucket**.
_By default, this function returns results from the last 30 days._

```js
import "influxdata/influxdb/schema"

schema.tagValues(bucket: "example-bucket", tag: "example-tag")
```

{{< expand-wrapper >}}
{{% expand "View example `schema.tagValues()` output" %}}

`schema.tagValues()` returns a single table with a `_value` column.
Each row contains a unique tag value from the specified bucket and tag key.

| _value    |
| :-------- |
| tagValue1 |
| tagValue2 |
| tagValue3 |
| tagValue4 |
| tagValue5 |

{{% /expand %}}
{{< /expand-wrapper >}}

### List tag values in a measurement
Use [`schema.measurementTagValues`](/flux/v0/stdlib/influxdata/influxdb/schema/measurementtagvalues)
to list **tag values for a given tag in a measurement**.
_By default, this function returns results from the last 30 days._

```js
import "influxdata/influxdb/schema"

schema.measurementTagValues(
    bucket: "example-bucket",
    tag: "example-tag",
    measurement: "example-measurement",
)
```

{{< expand-wrapper >}}
{{% expand "View example `schema.measurementTagValues()` output" %}}

`schema.measurementTagValues()` returns a single table with a `_value` column.
Each row contains a unique tag value from the specified bucket, measurement,
and tag key.

| _value    |
| :-------- |
| tagValue1 |
| tagValue2 |
| tagValue3 |
| tagValue4 |
| tagValue5 |

{{% /expand %}}
{{< /expand-wrapper >}}
