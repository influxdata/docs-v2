---
title: Explore your schema using InfluxQL
description: Useful query syntax for exploring schema in InfluxQL.
menu:
  influxdb_2_1:
    name: Explore your schema
    parent: Query with InfluxQL
    identifier: explore-schema-influxql
weight: 203
---

InfluxQL is an SQL-like query language for interacting with data in InfluxDB.
The following sections cover useful query syntax for exploring your [schema](/enterprise_influxdb/v1.9/concepts/glossary/#schema).

InfluxDB 1.x data is stored in databases and retention policies. In InfluxDB 2.x versions, data is stored in **buckets**. Because InfluxQL uses the 1.x data model, a bucket must be mapped to a database and retention policy (DBRP) before it can be queried using InfluxQL.

To learn about mapping buckets, see [Query data with InfluxQL](/influxdb/v2.1/query-data/influxql/)

Note that using the API to query with InfluxQL will return all data in JSON format.

**Sample data**

The NOAA sample data used in the follwong examples is available for download on the [Sample Data](/influxdb/v2.1/reference/sample-data/) page.

## `SHOW SERIES`

Returns a list of [series](/enterprise_influxdb/v1.9/concepts/glossary/#series) for
the specified [database](/enterprise_influxdb/v1.9/concepts/glossary/#database).

### Syntax

```sql
SHOW SERIES [ON <database_name>] [FROM_clause] [WHERE <tag_key> <operator> [ '<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

### Description of syntax

`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with the `db` query
string parameter in the [InfluxDB API](/enterprise_influxdb/v1.9/tools/api/#query-string-parameters) request.

The `FROM`, `WHERE`, `LIMIT`, and `OFFSET` clauses are optional.
The `WHERE` clause supports tag comparisons; field comparisons are not
valid for the `SHOW SERIES` query.

Supported operators in the `WHERE` clause:
`=`&emsp;&nbsp;&thinsp;equal to
`<>`&emsp;not equal to
`!=`&emsp;not equal to
`=~`&emsp;matches against
`!~`&emsp;doesn't match against

See the Data Exploration page for documentation on the
[`FROM` clause](/enterprise_influxdb/v1.9/query_language/explore-data/#the-basic-select-statement),
[`LIMIT` clause](/enterprise_influxdb/v1.9/query_language/explore-data/#the-limit-clause),
[`OFFSET` clause](/enterprise_influxdb/v1.9/query_language/explore-data/#the-offset-clause),
and on [Regular Expressions in Queries](/enterprise_influxdb/v1.9/query_language/explore-data/#regular-expressions).

### Examples

#### Run a `SHOW SERIES` query with the `ON` clause

```sql
-- Returns all series in the database
SHOW SERIES ON NOAA_water_database
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


The query's output is similar to the [line protocol](/enterprise_influxdb/v1.9/concepts/glossary/#influxdb-line-protocol) format.
Everything before the first comma is the [measurement](/enterprise_influxdb/v1.9/concepts/glossary/#measurement) name.
Everything after the first comma is either a [tag key](/enterprise_influxdb/v1.9/concepts/glossary/#tag-key) or a [tag value](/enterprise_influxdb/v1.9/concepts/glossary/#tag-value).
The `NOAA_water_database` has 5 different measurements and 13 different series.


#### Run a `SHOW SERIES` query with several clauses

```sql
> SHOW SERIES ON NOAA_water_database FROM "h2o_quality" WHERE "location" = 'coyote_creek' LIMIT 2
```

Output:

| key                                         |
| :------------------------------------------ |
|h2o_quality,location=coyote_creek,randtag=1  |
|h2o_quality,location=coyote_creek,randtag=2  |

The query returns all series in the `NOAA_water_database` database that are
associated with the `h2o_quality` measurement and the tag `location = coyote_creek`.
The `LIMIT` clause limits the number of series returned to two.

<!-- #### Run a `SHOW SERIES` query limited by time

Limit series returned within a specified shard group duration.

```sql
// Returns all series in the current shard.
> SHOW SERIES ON NOAA_water_database WHERE time > now() - 1m

key
---
average_temperature,location=coyote_creek
h2o_feet,location=coyote_creek
h2o_pH,location=coyote_creek
h2o_quality,location=coyote_creek,randtag=1
h2o_quality,location=coyote_creek,randtag=2
h2o_quality,location=coyote_creek,randtag=3
h2o_temperature,location=coyote_creek
```

The query above returns all series in the `NOAA_water_database` database in the current shard group. The `WHERE` clause limits results to series in the shard group that contain a timestamp in the last minute. Note, if a shard group duration is 7 days, results returned may be up to 7 days old.

```sql
// Returns all series in shard groups that contain a timestamp in the last 28 days.
> SHOW SERIES ON NOAA_water_database WHERE time > now() - 28d

key
---
average_temperature,location=coyote_creek
average_temperature,location=santa_monica
h2o_feet,location=coyote_creek
h2o_feet,location=santa_monica
h2o_pH,location=coyote_creek
h2o_pH,location=santa_monica
h2o_quality,location=coyote_creek,randtag=1
h2o_quality,location=coyote_creek,randtag=2
h2o_quality,location=coyote_creek,randtag=3
h2o_quality,location=santa_monica,randtag=1
h2o_quality,location=santa_monica,randtag=2
h2o_quality,location=santa_monica,randtag=3
h2o_temperature,location=coyote_creek
h2o_temperature,location=santa_monica
```

Note, if the specified shard group duration is 7 days, the query above returns series for the last 3 or 4 shards. -->

## `SHOW MEASUREMENTS`

Returns a list of [measurements](/enterprise_influxdb/v1.9/concepts/glossary/#measurement)
for the specified [database](/enterprise_influxdb/v1.9/concepts/glossary/#database).

### Syntax

```sql
SHOW MEASUREMENTS [ON <database_name>] [WITH MEASUREMENT <operator> ['<measurement_name>' | <regular_expression>]] [WHERE <tag_key> <operator> ['<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

### Description of Syntax

`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database  with the `db` query string parameter in the [InfluxDB API](/enterprise_influxdb/v1.9/tools/api/#query-string-parameters) request.

The `WITH`, `WHERE`, `LIMIT` and `OFFSET` clauses are optional.
The `WHERE` clause supports tag comparisons; field comparisons are not valid for the `SHOW MEASUREMENTS` query.

Supported operators in the `WHERE` clause:
`=`&emsp;&nbsp;&thinsp;equal to
`<>`&emsp;not equal to
`!=`&emsp;not equal to
`=~`&emsp;matches against
`!~`&emsp;doesn't match against

See the Data Exploration page for documentation on the
[`LIMIT` clause](/enterprise_influxdb/v1.9/query_language/explore-data/#the-limit-clause),
[`OFFSET` clause](/enterprise_influxdb/v1.9/query_language/explore-data/#the-offset-clause),
and on [Regular expressions in queries](/enterprise_influxdb/v1.9/query_language/explore-data/#regular-expressions).

### Examples

#### Run a `SHOW MEASUREMENTS` query with the `ON` clause

```sql
> SHOW MEASUREMENTS ON NOAA_water_database
```

Output:
| name                |
| :------------------ |
| average_temperature |
| h2o_feet            |
| h2o_pH              |
| h2o_quality         |
| h2o_temperature     |


The query returns the list of measurements in the `NOAA_water_database`
database.
The database has five measurements: `average_temperature`, `h2o_feet`,
`h2o_pH`, `h2o_quality`, and `h2o_temperature`.


#### Run a `SHOW MEASUREMENTS` query with several clauses (i)
I CANNOT GET THIS TO WORK, no matter what I try

```sql
> SHOW MEASUREMENTS ON NOAA_water_database WITH MEASUREMENT =~ /h2o.*/ LIMIT 2 OFFSET 1
```
Output:

| name        |
| :---------- |
| h2o_pH      |
| h2o_quality |

The query returns the measurements in the `NOAA_water_database` database that
start with `h2o`.
The `LIMIT` and `OFFSET` clauses limit the number of measurement names returned to
two and offset the results by one, skipping the `h2o_feet` measurement.

#### Run a `SHOW MEASUREMENTS` query with several clauses (ii)

```sql
> SHOW MEASUREMENTS ON NOAA_water_database WITH MEASUREMENT =~ /h2o.*/ WHERE "randtag"  =~ /\d/

name: measurements
name
----
h2o_quality
```

The query returns all measurements in the `NOAA_water_database` that start
with `h2o` and have values for the tag key `randtag` that include an integer.

## `SHOW TAG KEYS`

Returns a list of [tag keys](/enterprise_influxdb/v1.9/concepts/glossary/#tag-key)
associated with the specified [database](/enterprise_influxdb/v1.9/concepts/glossary/#database).

### Syntax

```sql
SHOW TAG KEYS [ON <database_name>] [FROM_clause] WITH KEY [ [<operator> "<tag_key>" | <regular_expression>] | [IN ("<tag_key1>","<tag_key2")]] [WHERE <tag_key> <operator> ['<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

### Description of syntax

`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with `db` query string parameter in the [InfluxDB API](/enterprise_influxdb/v1.9/tools/api/#query-string-parameters) request.

The `FROM` clause and the `WHERE` clause are optional.
The `WHERE` clause supports tag comparisons; field comparisons are not
valid for the `SHOW TAG KEYS` query.

Supported operators in the `WHERE` clause:
`=`&emsp;&nbsp;&thinsp;equal to
`<>`&emsp;not equal to
`!=`&emsp;not equal to
`=~`&emsp;matches against
`!~`&emsp;doesn't match against

See the Data Exploration page for documentation on the
[`FROM` clause](/enterprise_influxdb/v1.9/query_language/explore-data/#the-basic-select-statement),
[`LIMIT` clause](/enterprise_influxdb/v1.9/query_language/explore-data/#the-limit-clause),
[`OFFSET` clause](/enterprise_influxdb/v1.9/query_language/explore-data/#the-offset-clause),
and on [Regular Expressions in Queries](/enterprise_influxdb/v1.9/query_language/explore-data/#regular-expressions).

### Examples

#### Run a `SHOW TAG KEYS` query with the `ON` clause

```sql
> SHOW TAG KEYS ON "NOAA_water_database"
```
<!-- name: average_temperature
tagKey
------
location

name: h2o_feet
tagKey
------
location

name: h2o_pH
tagKey
------
location

name: h2o_quality
tagKey
------
location
randtag

name: h2o_temperature
tagKey
------
location -->

Output:
|measurement	|tagKey |
| :------------------ |:---------------|
|average_temperature	|location|
|h2o_feet	|location|
|h2o_pH	|location|
|h2o_quality	|location|
|h2o_quality	|randtag|
|h2o_temperature |location|

The query returns the list of tag keys in the `NOAA_water_database` database.
The output groups tag keys by measurement name;
it shows that every measurement has the `location` tag key and that the
`h2o_quality` measurement has an additional `randtag` tag key.

#### Run a `SHOW TAG KEYS` query without the `ON` clause

{{< tabs-wrapper >}}
{{% tabs %}}

{{% /tabs %}}
{{% tab-content %}}

Specify the database with `USE <database_name>`

```sql
> USE NOAA_water_database
Using database NOAA_water_database

> SHOW TAG KEYS

name: average_temperature
tagKey
------
location

name: h2o_feet
tagKey
------
location

name: h2o_pH
tagKey
------
location

name: h2o_quality
tagKey
------
location
randtag

name: h2o_temperature
tagKey
------
location
```

{{% /tab-content %}}

{{% tab-content %}}


{{% /tab-content %}}
{{< /tabs-wrapper >}}

#### Run a `SHOW TAG KEYS` query with several clauses

```sql
> SHOW TAG KEYS ON "NOAA_water_database" FROM "h2o_quality" LIMIT 1 OFFSET 1

name: h2o_quality
tagKey
------
randtag
```

The query returns tag keys from the `h2o_quality` measurement in the
`NOAA_water_database` database.
The `LIMIT` and `OFFSET` clauses limit the number of tag keys returned to one
and offsets the results by one.

#### Run a `SHOW TAG KEYS` query with a `WITH KEY IN` clause

```sql
> SHOW TAG KEYS ON "telegraf" WITH KEY IN ("host","region")

"measurement","tagKey"
"cpu","host"
"cpu_load_short","host"
"cpu_load_short","region"
"disk","host"
"diskio","host"
"docker","host"
"docker_container_blkio","host"
"docker_container_cpu","host"
"docker_container_mem","host"
"docker_container_status","host"
```

## `SHOW TAG VALUES`

Returns the list of [tag values](/enterprise_influxdb/v1.9/concepts/glossary/#tag-value)
for the specified [tag key(s)](/enterprise_influxdb/v1.9/concepts/glossary/#tag-key) in the database.

### Syntax

```sql
SHOW TAG VALUES [ON <database_name>][FROM_clause] WITH KEY [ [<operator> "<tag_key>" | <regular_expression>] | [IN ("<tag_key1>","<tag_key2")]] [WHERE <tag_key> <operator> ['<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

### Description of syntax

`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with the `db` query string parameter in the [InfluxDB API](/enterprise_influxdb/v1.9/tools/api/#query-string-parameters) request.

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

See the Data Exploration page for documentation on the
[`FROM` clause](/enterprise_influxdb/v1.9/query_language/explore-data/#the-basic-select-statement),
[`LIMIT` clause](/enterprise_influxdb/v1.9/query_language/explore-data/#the-limit-clause),
[`OFFSET` clause](/enterprise_influxdb/v1.9/query_language/explore-data/#the-offset-clause),
and on [Regular Expressions in Queries](/enterprise_influxdb/v1.9/query_language/explore-data/#regular-expressions).

### Examples

#### Run a `SHOW TAG VALUES` query with the `ON` clause

```sql
> SHOW TAG VALUES ON "NOAA_water_database" WITH KEY = "randtag"

name: h2o_quality
key       value
---       -----
randtag   1
randtag   2
randtag   3
```

The query returns all tag values of the `randtag` tag key in the `NOAA_water_database`
database.
`SHOW TAG VALUES` groups query results by measurement name.

#### Run a `SHOW TAG VALUES` query without the `ON` clause

{{< tabs-wrapper >}}
{{% tabs %}}

{{% /tabs %}}
{{% tab-content %}}

Specify the database with `USE <database_name>`

```sql
> SHOW TAG VALUES WITH KEY = "randtag"

name: h2o_quality
key       value
---       -----
randtag   1
randtag   2
randtag   3
```

{{% /tab-content %}}

{{% tab-content %}}


{{% /tab-content %}}
{{< /tabs-wrapper >}}

#### Run a `SHOW TAG VALUES` query with several clauses

```sql
> SHOW TAG VALUES ON "NOAA_water_database" WITH KEY IN ("location","randtag") WHERE "randtag" =~ /./ LIMIT 3

name: h2o_quality
key        value
---        -----
location   coyote_creek
location   santa_monica
randtag	   1
```

The query returns the tag values of the tag keys `location` and `randtag` for
all measurements in the `NOAA_water_database` database where `randtag` has tag values.
The `LIMIT` clause limits the number of tag values returned to three.

## `SHOW FIELD KEYS`

Returns the [field keys](/enterprise_influxdb/v1.9/concepts/glossary/#field-key) and the
[data type](/enterprise_influxdb/v1.9/write_protocols/line_protocol_reference/#data-types) of their
[field values](/enterprise_influxdb/v1.9/concepts/glossary/#field-value).

### Syntax

```sql
SHOW FIELD KEYS [ON <database_name>] [FROM <measurement_name>]
```

### Description of syntax

`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with `USE <database_name>` in the [CLI](/enterprise_influxdb/v1.9/tools/influx-cli/use-influx/) or with the `db` query
string parameter in the [InfluxDB API](/enterprise_influxdb/v1.9/tools/api/#query-string-parameters) request.

The `FROM` clause is also optional.
See the Data Exploration page for documentation on the
[`FROM` clause](/enterprise_influxdb/v1.9/query_language/explore-data/#the-basic-select-statement).

> **Note:** A field's data type [can differ](/enterprise_influxdb/v1.9/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-field-type-discrepancies-across-shards) across
[shards](/enterprise_influxdb/v1.9/concepts/glossary/#shard).
If your field has more than one type, `SHOW FIELD KEYS` returns the type that
occurs first in the following list: float, integer, string, boolean.

### Examples

#### Run a `SHOW FIELD KEYS` query with the `ON` clause

```sql
> SHOW FIELD KEYS ON "NOAA_water_database"

name: average_temperature
fieldKey            fieldType
--------            ---------
degrees             float

name: h2o_feet
fieldKey            fieldType
--------            ---------
level description   string
water_level         float

name: h2o_pH
fieldKey            fieldType
--------            ---------
pH                  float

name: h2o_quality
fieldKey            fieldType
--------            ---------
index               float

name: h2o_temperature
fieldKey            fieldType
--------            ---------
degrees             float
```

The query returns the field keys and field value data types for each
measurement in the `NOAA_water_database` database.

#### Run a `SHOW FIELD KEYS` query without the `ON` clause

{{< tabs-wrapper >}}
{{% tabs %}}

{{% /tabs %}}
{{% tab-content %}}

Specify the database with `USE <database_name>`

```sql
> USE NOAA_water_database
Using database NOAA_water_database

> SHOW FIELD KEYS

name: average_temperature
fieldKey            fieldType
--------            ---------
degrees             float

name: h2o_feet
fieldKey            fieldType
--------            ---------
level description   string
water_level         float

name: h2o_pH
fieldKey            fieldType
--------            ---------
pH                  float

name: h2o_quality
fieldKey            fieldType
--------            ---------
index               float

name: h2o_temperature
fieldKey            fieldType
--------            ---------
degrees             float
```

{{% /tab-content %}}

{{% tab-content %}}

Specify the database with the `db` query string parameter:

```bash
~# curl -G "http://localhost:8086/query?db=NOAA_water_database&pretty=true" --data-urlencode 'q=SHOW FIELD KEYS'

{
    "results": [
        {
            "statement_id": 0,
            "series": [
                {
                    "name": "average_temperature",
                    "columns": [
                        "fieldKey",
                        "fieldType"
                    ],
                    "values": [
                        [
                            "degrees",
                            "float"
                        ]
                    ]
                },
                {
                    "name": "h2o_feet",
                    "columns": [
                        "fieldKey",
                        "fieldType"
                    ],
                    "values": [
                        [
                            "level description",
                            "string"
                        ],
                        [
                            "water_level",
                            "float"
                        ]
                    ]
                },
                {
                    "name": "h2o_pH",
                    "columns": [
                        "fieldKey",
                        "fieldType"
                    ],
                    "values": [
                        [
                            "pH",
                            "float"
                        ]
                    ]
                },
                {
                    "name": "h2o_quality",
                    "columns": [
                        "fieldKey",
                        "fieldType"
                    ],
                    "values": [
                        [
                            "index",
                            "float"
                        ]
                    ]
                },
                {
                    "name": "h2o_temperature",
                    "columns": [
                        "fieldKey",
                        "fieldType"
                    ],
                    "values": [
                        [
                            "degrees",
                            "float"
                        ]
                    ]
                }
            ]
        }
    ]
}
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}


#### Run a `SHOW FIELD KEYS` query with the `FROM` clause

```sql
> SHOW FIELD KEYS ON "NOAA_water_database" FROM "h2o_feet"

name: h2o_feet
fieldKey            fieldType
--------            ---------
level description   string
water_level         float
```

The query returns the fields keys and field value data types for the `h2o_feet`
measurement in the `NOAA_water_database` database.

### Common Issues with `SHOW FIELD KEYS`

#### SHOW FIELD KEYS and field type discrepancies

Field value
[data types](/enterprise_influxdb/v1.9/write_protocols/line_protocol_reference/#data-types)
cannot differ within a [shard](/enterprise_influxdb/v1.9/concepts/glossary/#shard) but they
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

## `SHOW CARDINALITY`

`SHOW CARDINALITY` refers to the group of commands used to estimate or count exactly
the cardinality of measurements, series, tag keys, tag key values, and field keys.

For more information on the `SHOW CARDINALITY` commands,
see the [InfluxQL reference entry](/enterprise_influxdb/v1.9/query_language/spec/#show-cardinality).

### `SHOW FIELD KEY CARDINALITY`

```sql
-- show estimated cardinality of the field key set of current database
SHOW FIELD KEY CARDINALITY
-- show exact cardinality on field key set of specified database
SHOW FIELD KEY EXACT CARDINALITY ON mydb
```


<!-- ### `SHOW MEASUREMENT KEY CARDINALITY`

```sql
-- show estimated cardinality of measurement set on current database
SHOW MEASUREMENT CARDINALITY
-- show exact cardinality of measurement set on specified database
SHOW MEASUREMENT EXACT CARDINALITY ON mydb
```


### `SHOW SERIES CARDINALITY`

```sql
-- show estimated cardinality of the series on current database
SHOW SERIES CARDINALITY
-- show estimated cardinality of the series on specified database
SHOW SERIES CARDINALITY ON mydb
-- show exact series cardinality
SHOW SERIES EXACT CARDINALITY
-- show series cardinality of the series on specified database
SHOW SERIES EXACT CARDINALITY ON mydb -->
```


### `SHOW TAG KEY CARDINALITY`

```sql
-- show estimated tag key cardinality
SHOW TAG KEY CARDINALITY
-- show exact tag key cardinality
SHOW TAG KEY EXACT CARDINALITY
```


### `SHOW TAG VALUES CARDINALITY`

```sql
-- show estimated tag key values cardinality for a specified tag key
SHOW TAG VALUES CARDINALITY WITH KEY = "myTagKey"
-- show estimated tag key values cardinality for a specified tag key
SHOW TAG VALUES CARDINALITY WITH KEY = "myTagKey"
-- show exact tag key values cardinality for a specified tag key
SHOW TAG VALUES EXACT CARDINALITY WITH KEY = "myTagKey"
-- show exact tag key values cardinality for a specified tag key
SHOW TAG VALUES EXACT CARDINALITY WITH KEY = "myTagKey"
```


## Filter meta queries by time

When you filter meta queries by time, you may see results outside of your specified time. Meta query results are filtered at the shard level, so results can be approximately as granular as your shard group duration. If your time filter spans multiple shards, you'll get results from all shards with points in the specified time range. To review your shards and timestamps on points in the shard, run `SHOW SHARDS`. To learn more about shards and their duration, see [recommended shard groups durations](/enterprise_influxdb/v1.9/concepts/schema_and_data_layout/#shard-group-duration-recommendations).

The example below shows how to filter `SHOW TAG KEYS` by approximately one hour using a 1h shard group duration. To filter other meta data, replace `SHOW TAG KEYS` with `SHOW TAG VALUES`, `SHOW SERIES`, `SHOW FIELD KEYS`, and so on.

> **Note:** `SHOW MEASUREMENTS` cannot be filtered by time.

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
    ------
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
    ```
