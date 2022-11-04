---
title: Explore your schema using InfluxQL
description: Useful query syntax for exploring schema in InfluxQL.
menu:
  influxdb_2_4:
    name: Explore your schema
    parent: Query with InfluxQL
    identifier: explore-schema-influxql
weight: 202
---

To explore your schema using InfluxQL, do the following:

1. If you haven't already, verify or set up DBRP mappings. To do this, see [Query data with InfluxQL](/influxdb/v2.4/query-data/influxql/).

2. Next, check out **NOAA** [water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data) in the `noaa` database, which is used in examples.

3. Use the following InfluxQL commands to explore your schema:
   - [SHOW SERIES](#show-series)
   - [SHOW MEASUREMENTS](#show-measurements)
   - [SHOW TAG KEYS](#show-tag-keys)
   - [SHOW TAG VALUES](#show-tag-values)
   - [SHOW FIELD KEYS](#show-field-keys) (includes examples to find field/tag key cardinality)

   Commands include **syntax** and **examples**.
   {{% note %}}

#### Examples use the InfluxQL shell

Examples show how to run commands using the [InfluxQL shell](/influxdb/v2.4/tools/influxql-shell/). You can also query with InfluxQL using the [InfluxDB 1.x compatibility API](/influxdb/v2.4/reference/api/influxdb-1x/) by sending a `GET` request to the `/query` endpoint and including the command in the URL parameter `q`. Note, using the API returns results in JSON format.

For information about how to use either the InfluxQL shell or the InfluxDB API, see how to [Query a mapped bucket with InfluxQL](/influxdb/v2.4/query-data/influxql/#query-a-mapped-bucket-with-influxql).
   {{% /note %}}

## `SHOW SERIES`

Returns a list of [series](/influxdb/v2.4/reference/glossary/#series) for
the specified [database](/influxdb/v2.4/reference/glossary/#database).

### Syntax

```sql
SHOW SERIES [ON <database_name>] [FROM_clause] [WHERE <tag_key> <operator> [ '<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

### Description of syntax

`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with the `db` query
string parameter in the [InfluxDB API](/influxdb/v2.4/reference/api/influxdb-1x/) request.

The `FROM`, `WHERE`, `LIMIT`, and `OFFSET` clauses are optional.
The `WHERE` clause supports tag comparisons; field comparisons are not
valid for the `SHOW SERIES` query.

Supported operators in the `WHERE` clause:
`=`&emsp;&nbsp;&thinsp;equal to
`<>`&emsp;not equal to
`!=`&emsp;not equal to
`=~`&emsp;matches against
`!~`&emsp;doesn't match against

See [Explore data using InfluxQL](/influxdb/v2.4/query-data/influxql/explore-data/) for documentation on the
[`FROM` clause](/influxdb/v2.4/query-data/influxql/explore-data/select/#from-clause),
[`LIMIT` clause](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/),
[`OFFSET` clause](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/),
and [Regular Expressions](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/).

### Examples

#### Run a `SHOW SERIES` query with the `ON` clause

```sql
SHOW SERIES ON noaa
```
Output:
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

The query returns all series in the `noaa` database. The query's output is similar to the [line protocol](/influxdb/v2.4/reference/syntax/line-protocol/) format.
Everything before the first comma is the [measurement](/influxdb/v2.4/reference/glossary/#measurement) name.
Everything after the first comma is either a [tag key](/influxdb/v2.4/reference/glossary/#tag-key) or a [tag value](/influxdb/v2.4/reference/glossary/#tag-value).
The `noaa` has 5 different measurements and 13 different series.

#### Run a `SHOW SERIES` query with several clauses

```sql
> SHOW SERIES ON noaa FROM "h2o_quality" WHERE "location" = 'coyote_creek' LIMIT 2
```

Output:
| key                                         |
| :------------------------------------------ |
|h2o_quality,location=coyote_creek,randtag=1  |
|h2o_quality,location=coyote_creek,randtag=2  |

The query returns all series in the `noaa` database that are
associated with the `h2o_quality` measurement and the tag `location = coyote_creek`.
The `LIMIT` clause limits the number of series returned to two.

## `SHOW MEASUREMENTS`

Returns a list of [measurements](/influxdb/v2.4/reference/glossary/#measurement)
for the specified [database](/influxdb/v2.4/reference/glossary/#database).

### Syntax

```sql
SHOW MEASUREMENTS [ON <database_name>] [WITH MEASUREMENT <operator> ['<measurement_name>' | <regular_expression>]] [WHERE <tag_key> <operator> ['<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

### Description of Syntax

`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database  with the `db` query string parameter in the [InfluxDB API](/influxdb/v2.4/reference/api/influxdb-1x/) request.

The `WITH`, `WHERE`, `LIMIT` and `OFFSET` clauses are optional.
The `WHERE` clause supports tag comparisons; field comparisons are not valid for the `SHOW MEASUREMENTS` query.

Supported operators in the `WHERE` clause:
`=`&emsp;&nbsp;&thinsp;equal to
`<>`&emsp;not equal to
`!=`&emsp;not equal to
`=~`&emsp;matches against
`!~`&emsp;doesn't match against

See [Explore data using InfluxQL](/influxdb/v2.4/query-data/influxql/explore-data/) for documentation on the
[`FROM` clause](/influxdb/v2.4/query-data/influxql/explore-data/select/#from-clause),
[`LIMIT` clause](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/),
[`OFFSET` clause](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/),
and [Regular Expressions](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/).

### Examples

#### Run a `SHOW MEASUREMENTS` query with the `ON` clause

```sql
> SHOW MEASUREMENTS ON noaa
```

Output:
| name                |
| :------------------ |
| average_temperature |
| h2o_feet            |
| h2o_pH              |
| h2o_quality         |
| h2o_temperature     |


The query returns the list of measurements in the `noaa`
database.
The database has five measurements: `average_temperature`, `h2o_feet`,
`h2o_pH`, `h2o_quality`, and `h2o_temperature`.

#### Run a `SHOW MEASUREMENTS` query with several clauses (i)

```sql
> SHOW MEASUREMENTS ON noaa WITH MEASUREMENT =~ /h2o.*/ LIMIT 2 OFFSET 1
```
Output:

| name        |
| :---------- |
| h2o_pH      |
| h2o_quality |

The query returns the measurements in the `noaa` database that
start with `h2o`.
The `LIMIT` and `OFFSET` clauses limit the number of measurement names returned to
two and offset the results by one, skipping the `h2o_feet` measurement.

#### Run a `SHOW MEASUREMENTS` query with several clauses (ii)

```sql
> SHOW MEASUREMENTS ON noaa WITH MEASUREMENT =~ /h2o.*/ WHERE "randtag"  =~ /\d/

name: measurements
name
----
h2o_quality
```

The query returns all measurements in the `noaa` that start
with `h2o` and have values for the tag key `randtag` that include an integer.

## `SHOW TAG KEYS`

Returns a list of [tag keys](/influxdb/v2.4/reference/glossary/#tag-key)
associated with the specified [database](/influxdb/v2.4/reference/glossary/#database).

### Syntax

```sql
SHOW TAG KEYS [ON <database_name>] [FROM_clause] WITH KEY [ [<operator> "<tag_key>" | <regular_expression>] | [IN ("<tag_key1>","<tag_key2")]] [WHERE <tag_key> <operator> ['<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

### Description of syntax

`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with `db` query string parameter in the [InfluxDB API](/influxdb/v2.4/reference/api/influxdb-1x/) request.

The `FROM` clause and the `WHERE` clause are optional.
The `WHERE` clause supports tag comparisons; field comparisons are not
valid for the `SHOW TAG KEYS` query.

Supported operators in the `WHERE` clause:
`=`&emsp;&nbsp;&thinsp;equal to
`<>`&emsp;not equal to
`!=`&emsp;not equal to
`=~`&emsp;matches against
`!~`&emsp;doesn't match against

See [Explore data using InfluxQL](/influxdb/v2.4/query-data/influxql/explore-data/) for documentation on the
[`FROM` clause](/influxdb/v2.4/query-data/influxql/explore-data/select/#from-clause),
[`LIMIT` clause](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/),
[`OFFSET` clause](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/),
and [Regular Expressions](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/).

### Examples

#### Run a `SHOW TAG KEYS` query with the `ON` clause

```sql
> SHOW TAG KEYS ON noaa
```

Output:
|name	|tagKey |
| :------------------ |:---------------|
|average_temperature	|location|
|h2o_feet	|location|
|h2o_pH	|location|
|h2o_quality	|location|
|h2o_quality	|randtag|
|h2o_temperature |location|

The query returns the list of tag keys in the `noaa` database.
The output groups tag keys by measurement name;
it shows that every measurement has the `location` tag key and that the
`h2o_quality` measurement has an additional `randtag` tag key.

#### Run a `SHOW TAG KEYS` query with several clauses

```sql
> SHOW TAG KEYS ON noaa FROM "h2o_quality" LIMIT 1 OFFSET 1

```

Output:
|name	|tagKey |
| :------------------ |:---------------|
|h2o_quality	|randtag|


The query returns tag keys from the `h2o_quality` measurement in the
`noaa` database.
The `LIMIT` and `OFFSET` clauses limit the number of tag keys returned to one
and offsets the results by one.

#### Run a `SHOW TAG KEYS` query with a `WITH KEY IN` clause

```sql
> SHOW TAG KEYS ON noaa WITH KEY IN ("location") 
```

Output:
|measurement	    |tagKey|
| :------------------ |:---------------|
|average_temperature	    |location|
|h2o_feet	|location|
|h2o_pH	 |location|
|h2o_quality	|location|
|h2o_quality	|randtag|
|h2o_temperature	|location|


## `SHOW TAG VALUES`

Returns the list of [tag values](/influxdb/v2.4/reference/glossary/#tag-value)
for the specified [tag key(s)](/influxdb/v2.4/reference/glossary/#tag-key) in the database.

### Syntax

```sql
SHOW TAG VALUES [ON <database_name>][FROM_clause] WITH KEY [ [<operator> "<tag_key>" | <regular_expression>] | [IN ("<tag_key1>","<tag_key2")]] [WHERE <tag_key> <operator> ['<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

### Description of syntax

`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with the `db` query string parameter in the [InfluxDB API](/influxdb/v2.4/reference/api/influxdb-1x/) request.

The `WITH` clause is required.
It supports specifying a single tag key, a regular expression, and multiple tag keys.

The `FROM`, `WHERE`, `LIMIT`, and `OFFSET` clauses are optional.
The `WHERE` clause supports tag comparisons; field comparisons are not
valid for the `SHOW TAG KEYS` query.

Supported operators in the `WITH` and `WHERE` clauses:
`=`&emsp;&nbsp;&thinsp;equal to
`<>`&emsp;not equal to
`!=`&emsp;not equal to
`=~`&emsp;matches against
`!~`&emsp;doesn't match against

See [Explore data using InfluxQL](/influxdb/v2.4/query-data/influxql/explore-data/) for documentation on the
[`FROM` clause](/influxdb/v2.4/query-data/influxql/explore-data/select/#from-clause),
[`LIMIT` clause](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/),
[`OFFSET` clause](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/),
and [Regular Expressions](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/).

### Examples

#### Run a `SHOW TAG VALUES` query with the `ON` clause

```sql
> SHOW TAG VALUES ON noaa WITH KEY = "randtag"

```
Output:

name: h2o_quality
| :-----------|:-------|
|randtag	|1|
|randtag	|2|
|randtag	|3|

The query returns all tag values of the `randtag` tag key in the `noaa`
database.
`SHOW TAG VALUES` groups query results by measurement name.

#### Run a `SHOW TAG VALUES` query with several clauses

```sql
> SHOW TAG VALUES ON noaa WITH KEY IN ("location","randtag") WHERE "randtag" =~ /./ LIMIT 3
```
Output:

name: h2o_quality
| :-----------|:-------|
|key        |value
|location   |coyote_creek
|location   |santa_monica
|randtag	|   1

The query returns the tag values of the tag keys `location` and `randtag` for
all measurements in the `noaa` database where `randtag` has tag values.
The `LIMIT` clause limits the number of tag values returned to three.

## `SHOW FIELD KEYS`

Returns the [field keys](/influxdb/v2.4/reference/glossary/#field-key) and the
[data type](/influxdb/v2.4/reference/glossary/#data-type) of their
[field values](/influxdb/v2.4/reference/glossary/#field-value).

### Syntax

```sql
SHOW FIELD KEYS [ON <database_name>] [FROM <measurement_name>]
```

### Description of syntax

`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with `USE <database_name>` when using the [InfluxQL shell](/influxdb/v2.4/tools/influxql-shell/) or with the `db` query string parameter in the [InfluxDB 1.x compatibility API](/influxdb/v2.4/reference/api/influxdb-1x/) request.

The `FROM` clause is also optional.
See the Data Exploration page for documentation on the
[`FROM` clause](/influxdb/v2.4/query-data/influxql/explore-data/select/#from-clause).

{{% note %}}
**Note:** A field's data type [can differ](/influxdb/v2.4/reference/faq/#how-does-influxdb-handle-field-type-discrepancies-across-shards) across
[shards](/influxdb/v2.4/reference/glossary/#shard).
If your field has more than one type, `SHOW FIELD KEYS` returns the type that
occurs first in the following list: float, integer, string, boolean.
{{% /note %}}

### Examples

#### Run a `SHOW FIELD KEYS` query with the `ON` clause

```sql
> SHOW FIELD KEYS ON noaa
```
Output:
|name	    |fieldKey |fieldType|
| :--------------|:--------------|:------------|
| average_temperature| degrees |float|
| h2o_feet | level description |string|
| h2o_feet| water_level |float|
| h2o_pH |pH |float|
| h2o_quality| index  |float|
| hh2o_temperature | degrees |float|

The query returns the field keys and field value data types for each
measurement in the `noaa` database.

#### Run a `SHOW FIELD KEYS` query with the `FROM` clause

```sql
> SHOW FIELD KEYS ON noaa FROM h2o_feet
```
Output:
|name	    |fieldKey |fieldType|
| :--------------|:--------------|:------------|
| h2o_feet |level description | string|
| h2o_feet | water_level| float|

The query returns the fields keys and field value data types for the `h2o_feet`
measurement in the `noaa` database. 

 ### Common Issues with `SHOW FIELD KEYS`

#### SHOW FIELD KEYS and field type discrepancies

Field value
[data types](/influxdb/v2.4/reference/glossary/#data-type)
cannot differ within a [shard](/influxdb/v2.4/reference/glossary/#shard) but they
can differ across shards.
`SHOW FIELD KEYS` returns every data type, across every shard, associated with
the field key. 

##### Example

The `all_the_types` field stores four different data types:

```sql
> SHOW FIELD KEYS

name: mymeas
fieldKey        fieldType
--------        ---------
all_the_types   integer
all_the_types   float
all_the_types   string
all_the_types   boolean
```

Note that `SHOW FIELD KEYS` handles field type discrepancies differently from
`SELECT` statements.
For more information, see the
[How does InfluxDB handle field type discrepancies across shards?](/enterprise_influxdb/v1.9/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-field-type-discrepancies-across-shards). 

### `SHOW FIELD KEY CARDINALITY`

Cardinality is the product of all unique databases, retention policies, measurements, field keys and tag values in your Influx instance.  Managing cardinality is important, as high cardinality leads to greater resource usage.

```sql
-- show estimated cardinality of the field key set of current database
SHOW FIELD KEY CARDINALITY
-- show exact cardinality on field key set of specified database
SHOW FIELD KEY EXACT CARDINALITY ON mydb
```

### `SHOW TAG KEY CARDINALITY`

```sql
-- show estimated tag key cardinality
SHOW TAG KEY CARDINALITY
-- show exact tag key cardinality
SHOW TAG KEY EXACT CARDINALITY
```
<!-- 
### `SHOW TAG VALUES CARDINALITY`

```sql
SHOW TAG VALUES EXACT CARDINALITY WITH KEY = "myTagKey"
-- show exact tag key values cardinality for a specified tag key
SHOW TAG VALUES EXACT CARDINALITY WITH KEY = "myTagKey" -->

<!-- ### Filter meta queries by time

When you filter meta queries by time, you may see results outside of your specified time. Meta query results are filtered at the shard level, so results can be approximately as granular as your shard group duration. If your time filter spans multiple shards, you'll get results from all shards with points in the specified time range. To review your shards and timestamps on points in the shard, run `SHOW SHARDS`. To learn more about shards and their duration, see [recommended shard groups durations](/influxdb/v2.4/reference/internals/shards/#shard-group-duration).

The example below shows how to filter `SHOW TAG KEYS` by approximately one hour using a 1h shard group duration. To filter other meta data, replace `SHOW TAG KEYS` with `SHOW TAG VALUES`, `SHOW SERIES`, `SHOW FIELD KEYS`, and so on.

{{% note %}}
**Note:** `SHOW MEASUREMENTS` cannot be filtered by time.
{{% /note %}}

#### Example filtering `SHOW TAG KEYS` by time

1. Specify a shard duration on a new database or [alter an existing shard duration](/enterprise_influxdb/v1.9/query_language/manage-database/#modify-retention-policies-with-alter-retention-policy). To specify a 1h shard duration when creating a new database, run the following command:

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
    > SELECT * FROM test WHERE time >= '2019-08-09T00:00:00Z' and time < '2019-08-09T10:00:00Z'
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
