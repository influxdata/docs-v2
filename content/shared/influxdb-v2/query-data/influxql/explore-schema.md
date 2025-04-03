
Use InfluxQL to explore the schema of your time series data.
Use the following InfluxQL commands to explore your schema:

- [SHOW SERIES](#show-series)
- [SHOW MEASUREMENTS](#show-measurements)
- [SHOW TAG KEYS](#show-tag-keys)
- [SHOW TAG VALUES](#show-tag-values)
- [SHOW FIELD KEYS](#show-field-keys)
- [SHOW FIELD KEY CARDINALITY](#show-field-key-cardinality)
- [SHOW TAG KEY CARDINALITY](#show-tag-key-cardinality)

{{% note %}}
Command examples use the [NOAA water sample data](/influxdb/version/reference/sample-data/#noaa-water-sample-data).
{{% /note %}}

## SHOW SERIES

Return a list of [series](/influxdb/version/reference/glossary/#series) for
the specified [database](/influxdb/version/reference/glossary/#database).

### Syntax

```sql
SHOW SERIES [ON <database_name>] [FROM_clause] [WHERE <tag_key> <operator> [ '<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

- `ON <database_name>` is optional.
  If the query does not include `ON <database_name>`, you must specify the
  database with the `db` query string parameter in the
  [InfluxDB API](/influxdb/version/reference/api/influxdb-1x/) request.
- `FROM`, `WHERE`, `LIMIT`, and `OFFSET` clauses are optional.
- The `WHERE` clause in `SHOW SERIES` supports tag comparisons but not field comparisons.

  **Supported operators in the `WHERE` clause**:
  
  - `=`: equal to
  - `<>`: not equal to
  - `!=`: not equal to
  - `=~`: matches against
  - `!~`: doesn't match against

See [Explore data using InfluxQL](/influxdb/version/query-data/influxql/explore-data/) for documentation on the
[`FROM` clause](/influxdb/version/query-data/influxql/explore-data/select/#from-clause),
[`LIMIT` clause](/influxdb/version/query-data/influxql/explore-data/limit-and-slimit/),
[`OFFSET` clause](/influxdb/version/query-data/influxql/explore-data/offset-and-soffset/),
and [Regular Expressions](/influxdb/version/query-data/influxql/explore-data/regular-expressions/).

### Examples

#### Run SHOW SERIES with the ON clause

```sql
SHOW SERIES ON noaa
```

**Output:**

The query returns all series in the `noaa` database.
The query's output is similar to the [line protocol](/influxdb/version/reference/syntax/line-protocol/) format.
Everything before the first comma is the [measurement](/influxdb/version/reference/glossary/#measurement) name.
Everything after the first comma is either a [tag key](/influxdb/version/reference/glossary/#tag-key) or a [tag value](/influxdb/version/reference/glossary/#tag-value).
The `noaa` database has 5 different measurements and 13 different series.

| key                                         |
| :------------------------------------------ |
| average_temperature,location=coyote_creek   |
| average_temperature,location=santa_monica   |
| h2o_feet,location=coyote_creek              |
| h2o_feet,location=santa_monica              |
| h2o_pH,location=coyote_creek                |
| h2o_pH,location=santa_monica                |
| h2o_quality,location=coyote_creek,randtag=1 |
| h2o_quality,location=coyote_creek,randtag=2 |
| h2o_quality,location=coyote_creek,randtag=3 |
| h2o_quality,location=santa_monica,randtag=1 |
| h2o_quality,location=santa_monica,randtag=2 |
| h2o_quality,location=santa_monica,randtag=3 |
| h2o_temperature,location=coyote_creek       |

#### Run SHOW SERIES with several clauses

```sql
SHOW SERIES ON noaa FROM "h2o_quality" WHERE "location" = 'coyote_creek' LIMIT 2
```

**Output:**

The query returns all series in the `noaa` database that are
associated with the `h2o_quality` measurement and the tag `location = coyote_creek`.
The `LIMIT` clause limits the number of series returned to two.

| key                                         |
| :------------------------------------------ |
|h2o_quality,location=coyote_creek,randtag=1  |
|h2o_quality,location=coyote_creek,randtag=2  |

## SHOW MEASUREMENTS

Returns a list of [measurements](/influxdb/version/reference/glossary/#measurement)
for the specified [database](/influxdb/version/reference/glossary/#database).

### Syntax

```sql
SHOW MEASUREMENTS [ON <database_name>] [WITH MEASUREMENT <operator> ['<measurement_name>' | <regular_expression>]] [WHERE <tag_key> <operator> ['<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

- `ON <database_name>` is optional.
  If the query does not include `ON <database_name>`, you must specify the
  database  with the `db` query string parameter in the
  [InfluxDB API](/influxdb/version/reference/api/influxdb-1x/) request.

- The `WITH`, `WHERE`, `LIMIT` and `OFFSET` clauses are optional.
- The `WHERE` in `SHOW MEASUREMENTS` supports tag comparisons, but not field comparisons.

  **Supported operators in the `WHERE` clause:**

  - `=` : equal to
  - `<>`: not equal to
  - `!=`: not equal to
  - `=~`: matches against
  - `!~`: doesn't match against

See [Explore data using InfluxQL](/influxdb/version/query-data/influxql/explore-data/) for documentation on the
[`FROM` clause](/influxdb/version/query-data/influxql/explore-data/select/#from-clause),
[`LIMIT` clause](/influxdb/version/query-data/influxql/explore-data/limit-and-slimit/),
[`OFFSET` clause](/influxdb/version/query-data/influxql/explore-data/offset-and-soffset/),
and [Regular Expressions](/influxdb/version/query-data/influxql/explore-data/regular-expressions/).

### Examples

#### Run SHOW MEASUREMENTS with the ON clause

```sql
SHOW MEASUREMENTS ON noaa
```

**Output:**

The query returns the list of measurements in the `noaa` database.
The database has five measurements: `average_temperature`, `h2o_feet`, `h2o_pH`,
`h2o_quality`, and `h2o_temperature`.

| name                |
| :------------------ |
| average_temperature |
| h2o_feet            |
| h2o_pH              |
| h2o_quality         |
| h2o_temperature     |


#### Run SHOW MEASUREMENTS with several clauses (i)

```sql
SHOW MEASUREMENTS ON noaa WITH MEASUREMENT =~ /h2o.*/ LIMIT 2 OFFSET 1
```

**Output:**

The query returns the measurements in the `noaa` database that start with `h2o`.
The `LIMIT` and `OFFSET` clauses limit the number of measurement names returned to
two and offset the results by one, skipping the `h2o_feet` measurement.

| name        |
| :---------- |
| h2o_pH      |
| h2o_quality |

#### Run SHOW MEASUREMENTS with several clauses (ii)

```sql
SHOW MEASUREMENTS ON noaa WITH MEASUREMENT =~ /h2o.*/ WHERE "randtag"  =~ /\d/
```

The query returns all measurements in the `noaa` that start with `h2o` and have
values for the tag key `randtag` that include an integer.

| name        |
| :---------- |
| h2o_quality |

## SHOW TAG KEYS

Returns a list of [tag keys](/influxdb/version/reference/glossary/#tag-key)
associated with the specified [database](/influxdb/version/reference/glossary/#database).

### Syntax

```sql
SHOW TAG KEYS [ON <database_name>] [FROM_clause] WITH KEY [ [<operator> "<tag_key>" | <regular_expression>] | [IN ("<tag_key1>","<tag_key2>")]] [WHERE <tag_key> <operator> ['<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

- `ON <database_name>` is optional.
  If the query does not include `ON <database_name>`, you must specify the
  database with `db` query string parameter in the [InfluxDB API](/influxdb/version/reference/api/influxdb-1x/) request.
- The `FROM` clause and the `WHERE` clause are optional.
- The `WHERE` clause in `SHOW TAG KEYS` supports tag comparisons, but not field comparisons.

    **Supported operators in the `WHERE` clause:**

    - `=` : equal to
    - `<>`: not equal to
    - `!=`: not equal to
    - `=~`: matches against
    - `!~`: doesn't match against

See [Explore data using InfluxQL](/influxdb/version/query-data/influxql/explore-data/) for documentation on the
[`FROM` clause](/influxdb/version/query-data/influxql/explore-data/select/#from-clause),
[`LIMIT` clause](/influxdb/version/query-data/influxql/explore-data/limit-and-slimit/),
[`OFFSET` clause](/influxdb/version/query-data/influxql/explore-data/offset-and-soffset/),
and [Regular Expressions](/influxdb/version/query-data/influxql/explore-data/regular-expressions/).

### Examples

#### Run SHOW TAG KEYS with the ON clause

```sql
SHOW TAG KEYS ON noaa
```

**Output:**

The query returns the list of tag keys in the `noaa` database.
The output groups tag keys by measurement name;
it shows that every measurement has the `location` tag key and that the
`h2o_quality` measurement has an additional `randtag` tag key.

| name                | tagKey   |
| :------------------ | :------- |
| average_temperature | location |
| h2o_feet            | location |
| h2o_pH              | location |
| h2o_quality         | location |
| h2o_quality         | randtag  |
| h2o_temperature     | location |


#### Run SHOW TAG KEYS with several clauses

```sql
SHOW TAG KEYS ON noaa FROM "h2o_quality" LIMIT 1 OFFSET 1
```

**Output:**

The query returns tag keys from the `h2o_quality` measurement in the `noaa` database.
The `LIMIT` and `OFFSET` clauses limit the number of tag keys returned to one
and offsets the results by one.

| name        | tagKey  |
| :---------- | :------ |
| h2o_quality | randtag |

#### Run SHOW TAG KEYS with a WITH KEY IN clause

```sql
SHOW TAG KEYS ON noaa WITH KEY IN ("location") 
```

**Output:**

| measurement         | tagKey   |
| :------------------ | :------- |
| average_temperature | location |
| h2o_feet            | location |
| h2o_pH              | location |
| h2o_quality         | location |
| h2o_quality         | randtag  |
| h2o_temperature     | location |


## SHOW TAG VALUES

Returns the list of [tag values](/influxdb/version/reference/glossary/#tag-value)
for the specified [tag key(s)](/influxdb/version/reference/glossary/#tag-key) in the database.

### Syntax

```sql
SHOW TAG VALUES [ON <database_name>][FROM_clause] WITH KEY [ [<operator> "<tag_key>" | <regular_expression>] | [IN ("<tag_key1>","<tag_key2>")]] [WHERE <tag_key> <operator> ['<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

- `ON <database_name>` is optional.
  If the query does not include `ON <database_name>`, you must specify the
  database with the `db` query string parameter in the [InfluxDB API](/influxdb/version/reference/api/influxdb-1x/) request.
- The `WITH` clause is required.
  It supports specifying a single tag key, a regular expression, and multiple tag keys.
- The `FROM`, `WHERE`, `LIMIT`, and `OFFSET` clauses are optional.
- The `WHERE` clause in `SHOW TAG KEYS` supports tag comparisons, but not field comparisons.

  **Supported operators in the `WITH` and `WHERE` clauses:**

  - `=` : equal to
  - `<>`: not equal to
  - `!=`: not equal to
  - `=~`: matches against
  - `!~`: doesn't match against

See [Explore data using InfluxQL](/influxdb/version/query-data/influxql/explore-data/) for documentation on the
[`FROM` clause](/influxdb/version/query-data/influxql/explore-data/select/#from-clause),
[`LIMIT` clause](/influxdb/version/query-data/influxql/explore-data/limit-and-slimit/),
[`OFFSET` clause](/influxdb/version/query-data/influxql/explore-data/offset-and-soffset/),
and [Regular Expressions](/influxdb/version/query-data/influxql/explore-data/regular-expressions/).

### Examples

#### Run SHOW TAG VALUES with the ON clause

```sql
SHOW TAG VALUES ON noaa WITH KEY = "randtag"
```

**Output:**

The query returns all tag values of the `randtag` tag key in the `noaa` database.
`SHOW TAG VALUES` groups query results by measurement name.

{{% influxql/table-meta %}}
name: h2o_quality
{{% /influxql/table-meta %}}

| key     | value |
| :------ | ----: |
| randtag | 1     |
| randtag | 2     |
| randtag | 3     |

#### Run a `SHOW TAG VALUES` query with several clauses

```sql
SHOW TAG VALUES ON noaa WITH KEY IN ("location","randtag") WHERE "randtag" =~ /./ LIMIT 3
```

**Output:**

The query returns the tag values of the tag keys `location` and `randtag` for
all measurements in the `noaa` database where `randtag` has tag values.
The `LIMIT` clause limits the number of tag values returned to three.

{{% influxql/table-meta %}}
name: h2o_quality
{{% /influxql/table-meta %}}

| key      |        value |
| :------- | -----------: |
| location | coyote_creek |
| location | santa_monica |
| randtag  |            1 |

## SHOW FIELD KEYS

Returns the [field keys](/influxdb/version/reference/glossary/#field-key) and the
[data type](/influxdb/version/reference/glossary/#data-type) of their
[field values](/influxdb/version/reference/glossary/#field-value).

### Syntax

```sql
SHOW FIELD KEYS [ON <database_name>] [FROM <measurement_name>]
```

- `ON <database_name>` is optional.
  If the query does not include `ON <database_name>`, you must specify the
  database with `USE <database_name>` when using the [InfluxQL shell](/influxdb/version/tools/influxql-shell/)
  or with the `db` query string parameter in the
  [InfluxDB 1.x compatibility API](/influxdb/version/reference/api/influxdb-1x/) request.
- The `FROM` clause is optional.
  See the Data Exploration page for documentation on the
[`  FROM` clause](/influxdb/version/query-data/influxql/explore-data/select/#from-clause).

{{% note %}}
**Note:** A field's data type [can differ](/influxdb/version/reference/faq/#how-does-influxdb-handle-field-type-discrepancies-across-shards) across
[shards](/influxdb/version/reference/glossary/#shard).
If your field has more than one type, `SHOW FIELD KEYS` returns the type that
occurs first in the following list: float, integer, string, boolean.
{{% /note %}}

### Examples

#### Run SHOW FIELD KEYS with the ON clause

```sql
SHOW FIELD KEYS ON noaa
```

**Output:**

The query returns the field keys and field value data types for each
measurement in the `noaa` database.

| name                | fieldKey          | fieldType |
| :------------------ | :---------------- | :-------- |
| average_temperature | degrees           | float     |
| h2o_feet            | level description | string    |
| h2o_feet            | water_level       | float     |
| h2o_pH              | pH                | float     |
| h2o_quality         | index             | float     |
| hh2o_temperature    | degrees           | float     |

#### Run SHOW FIELD KEYS with the FROM clause

```sql
SHOW FIELD KEYS ON noaa FROM h2o_feet
```

**Output:**

The query returns the fields keys and field value data types for the `h2o_feet`
measurement in the `noaa` database. 

| name     | fieldKey          | fieldType |
| :------- | :---------------- | :-------- |
| h2o_feet | level description | string    |
| h2o_feet | water_level       | float     |

### Common Issues with SHOW FIELD KEYS

#### SHOW FIELD KEYS and field type discrepancies

Field value [data types](/influxdb/version/reference/glossary/#data-type)
cannot differ within a [shard](/influxdb/version/reference/glossary/#shard) but they
can differ across shards.
`SHOW FIELD KEYS` returns every data type, across every shard, associated with
the field key. 

##### Example

The `all_the_types` field stores four different data types:

```sql
SHOW FIELD KEYS
```

{{% influxql/table-meta %}}
name: mymeas
{{% /influxql/table-meta %}}

| fieldKey      | fieldType |
| :------------ | :-------- |
| all_the_types | integer   |
| all_the_types | float     |
| all_the_types | string    |
| all_the_types | boolean   |

Note that `SHOW FIELD KEYS` handles field type discrepancies differently from
`SELECT` statements.
For more information, see the
[How does InfluxDB handle field type discrepancies across shards?](/enterprise_influxdb/v1/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-field-type-discrepancies-across-shards). 

## SHOW FIELD KEY CARDINALITY

Cardinality is the product of all unique databases, retention policies, measurements, field keys and tag values in your Influx instance. Managing cardinality is important, as high cardinality leads to greater resource usage.

```sql
-- show estimated cardinality of the field key set of current database
SHOW FIELD KEY CARDINALITY
-- show exact cardinality on field key set of specified database
SHOW FIELD KEY EXACT CARDINALITY ON noaa
```

## SHOW TAG KEY CARDINALITY

```sql
-- show estimated tag key cardinality
SHOW TAG KEY CARDINALITY
-- show exact tag key cardinality
SHOW TAG KEY EXACT CARDINALITY
```

<!-- 
### SHOW TAG VALUES CARDINALITY

```sql
SHOW TAG VALUES EXACT CARDINALITY WITH KEY = "myTagKey"
-- show exact tag key values cardinality for a specified tag key
SHOW TAG VALUES EXACT CARDINALITY WITH KEY = "myTagKey" -->

<!-- ### Filter meta queries by time

When you filter meta queries by time, you may see results outside of your specified time. Meta query results are filtered at the shard level, so results can be approximately as granular as your shard group duration. If your time filter spans multiple shards, you'll get results from all shards with points in the specified time range. To review your shards and timestamps on points in the shard, run `SHOW SHARDS`. To learn more about shards and their duration, see [recommended shard groups durations](/influxdb/version/reference/internals/shards/#shard-group-duration).

The example below shows how to filter `SHOW TAG KEYS` by approximately one hour using a 1h shard group duration. To filter other meta data, replace `SHOW TAG KEYS` with `SHOW TAG VALUES`, `SHOW SERIES`, `SHOW FIELD KEYS`, and so on.

{{% note %}}
**Note:** `SHOW MEASUREMENTS` cannot be filtered by time.
{{% /note %}}

#### Example filtering `SHOW TAG KEYS` by time

1. Specify a shard duration on a new database or [alter an existing shard duration](/enterprise_influxdb/v1/query_language/manage-database/#modify-retention-policies-with-alter-retention-policy). To specify a 1h shard duration when creating a new database, run the following command:

    ```sh
    > CREATE database mydb with duration 7d REPLICATION 1 SHARD DURATION 1h name myRP;
    ```

    > **Note:** The minimum shard duration is 1h.

2. Verify the shard duration has the correct time interval (precision) by running the `SHOW SHARDS` command. The example below shows a shard duration with an hour precision.

    ```sh
    > SHOW SHARDS
    name: mydb
    id database retention_policy shard_group start_time end_time expiry_time owners
    -- -------- ---------------- ----------- ---------- -------- ----------- ------
    > precision h
    ```  

3. (Optional) Insert sample tag keys. This step is for demonstration purposes. If you already have tag keys (or other meta data) to search for, skip this step.

    ```sh
    // Insert a sample tag called "test_key" into the "test" measurement, and then check the timestamp:
    > INSERT test,test_key=hello value=1

    > select * from test
    name: test
    time test_key value
    ---- -------- -----
    434820 hello 1

    // Add new tag keys with timestamps one, two, and three hours earlier:

    > INSERT test,test_key_1=hello value=1 434819
    > INSERT test,test_key_2=hello value=1 434819
    > INSERT test,test_key_3_=hello value=1 434818
    > INSERT test,test_key_4=hello value=1 434817
    > INSERT test,test_key_5_=hello value=1 434817
    ```

4. To find tag keys within a shard duration, run one of the following commands:

    `SHOW TAG KEYS ON database-name <WHERE time clause>` OR

    `SELECT * FROM measurement <WHERE time clause>`

    The examples below use test data from step 3.
    ```sh
    //Using data from Step 3, show tag keys between now and an hour ago
    > SHOW TAG KEYS ON mydb where time > now() -1h and time < now()
    name: test
    tagKey
    ------
    test_key
    test_key_1
    test_key_2

    // Find tag keys between one and two hours ago
    > SHOW TAG KEYS ON mydb where > time > now() -2h and time < now()-1h
    name: test
    tagKey
    ------
    test_key_1
    test_key_2
    test_key_3

    // Find tag keys between two and three hours ago
    > SHOW TAG KEYS ON mydb where > time > now() -3h and time < now()-2h
    name: test
    tagKey
    ------select statement
    test_key_3
    test_key_4
    test_key_5

    // For a specified measurement, find tag keys in a given shard by specifying the time boundaries of the shard
    SELECT * FROM test WHERE time >= '2019-08-09T00:00:00Z' and time < '2019-08-09T10:00:00Z'
    name: test
    time test_key_4 test_key_5 value
    ---- ------------ ------------ -----
    434817 hello 1
    434817 hello 1

    // For a specified database, find tag keys in a given shard by specifying the time boundaries of the shard
    > SHOW TAG KEYS ON mydb WHERE time >= '2019-08-09T00:00:00Z' and time < '2019-08-09T10:00:00Z'
    name: test
    tagKey
    ------
    test_key_4
    test_key_5
    ```  -->
