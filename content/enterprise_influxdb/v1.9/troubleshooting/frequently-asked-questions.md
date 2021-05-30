---
title: InfluxDB Enterprise frequently asked questions
description: Common issues with InfluxDB Enterprise.
aliases:
  - /enterprise_influxdb/v1.9/troubleshooting/frequently_encountered_issues/
  - /enterprise_influxdb/v1.9/troubleshooting/frequently-asked-questions/
  - /enterprise/v1.8/troubleshooting/frequently_asked_questions/
  - /enterprise_influxdb/v1.9/introduction/meta_node_installation/
menu:
  enterprise_influxdb_1_9:
    name: Frequently asked questions (FAQs)
    weight: 10
    parent: Troubleshoot
---

This page addresses frequent sources of confusion and places where InfluxDB
behaves in an unexpected way relative to other database systems.
Where applicable, it links to outstanding issues on GitHub.

**Administration**

* [How do I include a single quote in a password?](#how-do-i-include-a-single-quote-in-a-password)
* [How can I identify my version of InfluxDB?](#how-can-i-identify-my-version-of-influxdb)
* [Where can I find InfluxDB logs?](#where-can-i-find-influxdb-logs)
* [What is the relationship between shard group durations and retention policies?](#what-is-the-relationship-between-shard-group-durations-and-retention-policies)
* [Why aren't data dropped after I've altered a retention policy?](#why-arent-data-dropped-after-ive-altered-a-retention-policy)
* [Why does InfluxDB fail to parse microsecond units in the configuration file?](#why-does-influxdb-fail-to-parse-microsecond-units-in-the-configuration-file)
* [Does InfluxDB have a file system size limit?](#does-influxdb-have-a-file-system-size-limit)


**Command line interface (CLI)**

* [How do I make InfluxDB’s CLI return human readable timestamps?](#how-do-i-use-the-influxdb-cli-to-return-human-readable-timestamps)
* [How can a non-admin user `USE` a database in the InfluxDB CLI?](#how-can-a-non-admin-user-use-a-database-in-the-influxdb-cli)
* [How do I write to a non-`DEFAULT` retention policy with the InfluxDB CLI?](#how-do-i-write-to-a-non-default-retention-policy-with-the-influxdb-cli)
* [How do I cancel a long-running query?](#how-do-i-cancel-a-long-running-query)

**Data types**

* [Why can't I query Boolean field values?](#why-can-t-i-query-boolean-field-values)
* [How does InfluxDB handle field type discrepancies across shards?](#how-does-influxdb-handle-field-type-discrepancies-across-shards)
* [What are the minimum and maximum integers that InfluxDB can store?](#what-are-the-minimum-and-maximum-integers-that-influxdb-can-store)
* [What are the minimum and maximum timestamps that InfluxDB can store?](#what-are-the-minimum-and-maximum-timestamps-that-influxdb-can-store)
* [How can I tell what type of data is stored in a field?](#how-can-i-tell-what-type-of-data-is-stored-in-a-field)
* [Can I change a field's data type?](#can-i-change-a-field-s-data-type)

**InfluxQL functions**

* [How do I perform mathematical operations within a function?](#how-do-i-perform-mathematical-operations-within-a-function)
* [Why does my query return epoch 0 as the timestamp?](#why-does-my-query-return-epoch-0-as-the-timestamp)
* [Which InfluxQL functions support nesting?](#which-influxql-functions-support-nesting)

**Querying data**

* [What determines the time intervals returned by `GROUP BY time()` queries?](#what-determines-the-time-intervals-returned-by-group-by-time-queries)
* [Why do my queries return no data or partial data?](#why-do-my-queries-return-no-data-or-partial-data)
* [Why don't my `GROUP BY time()` queries return timestamps that occur after `now()`?](#why-don-t-my-group-by-time-queries-return-timestamps-that-occur-after-now)
* [Can I perform mathematical operations against timestamps?](#can-i-perform-mathematical-operations-against-timestamps)
* [Can I identify write precision from returned timestamps?](#can-i-identify-write-precision-from-returned-timestamps)
* [When should I single quote and when should I double quote in queries?](#when-should-i-single-quote-and-when-should-i-double-quote-in-queries)
* [Why am I missing data after creating a new `DEFAULT` retention policy?](#why-am-i-missing-data-after-creating-a-new-default-retention-policy)
* [Why is my query with a `WHERE OR` time clause returning empty results?](#why-is-my-query-with-a-where-or-time-clause-returning-empty-results)
* [Why does `fill(previous)` return empty results?](#why-does-fill-previous-return-empty-results)
* [Why are my `INTO` queries missing data?](#why-are-my-into-queries-missing-data)
* [How do I query data with an identical tag key and field key?](#how-do-i-query-data-with-an-identical-tag-key-and-field-key)
* [How do I query data across measurements?](#how-do-i-query-data-across-measurements)
* [Does the order of the timestamps matter?](#does-the-order-of-the-timestamps-matter)
* [How do I `SELECT` data with a tag that has no value?](#how-do-i-select-data-with-a-tag-that-has-no-value)

**Series and series cardinality**

* [Why does series cardinality matter?](#why-does-series-cardinality-matter)
* [How can I remove series from the index?](#how-can-i-remove-series-from-the-index)

**Writing data**

* [How do I write integer field values?](#how-do-i-write-integer-field-values)
* [How does InfluxDB handle duplicate points?](#how-does-influxdb-handle-duplicate-points)
* [What newline character does the InfluxDB API require?](#what-newline-character-does-the-influxdb-api-require)
* [What words and characters should I avoid when writing data to InfluxDB?](#what-words-and-characters-should-i-avoid-when-writing-data-to-influxdb)
* [When should I single quote and when should I double quote when writing data?](#when-should-i-single-quote-and-when-should-i-double-quote-when-writing-data)
* [Does the precision of the timestamp matter?](#does-the-precision-of-the-timestamp-matter)
* [What are the configuration recommendations and schema guidelines for writing sparse, historical data?](#what-are-the-configuration-recommendations-and-schema-guidelines-for-writing-sparse-historical-data)

**Log errors**

* [Where can I find InfluxDB Enterprise logs?](#where-can-i-find-influxdb-enterprise-logs)
* [Why am I seeing a `503 Service Unavailable` error in my meta node logs?](#why-am-i-seeing-a-503-service-unavailable-error-in-my-meta-node-logs)
* [Why am I seeing a `409` error in some of my data node logs?](#why-am-i-seeing-a-409-error-in-some-of-my-data-node-logs)
* [Why am I seeing `hinted handoff queue not empty` errors in my data node logs?](#why-am-i-seeing-hinted-handoff-queue-not-empty-errors-in-my-data-node-logs)
* [Why am I seeing `error writing count stats ...: partial write` errors in my data node logs?](#why-am-i-seeing-error-writing-count-stats-partial-write-errors-in-my-data-node-logs)
* [Why am I seeing `queue is full` errors in my data node logs?](#why-am-i-seeing-queue-is-full-errors-in-my-data-node-logs)
* [Why am I seeing `unable to determine if "hostname" is a meta node` when I try to add a meta node with `influxd-ctl join`?](#why-am-i-seeing-unable-to-determine-if-hostname-is-a-meta-node-when-i-try-to-add-a-meta-node-with-influxd-ctl-join)

---

## How do I include a single quote in a password?

Escape the single quote with a backslash (`\`) both when creating the password
and when sending authentication requests.

## How can I identify my version of InfluxDB?

There a number of ways to identify the version of InfluxDB that you're using:

#### Run `influxd version` in your terminal:

```bash
$ influxd version

InfluxDB ✨ v1.4.0 ✨ (git: master b7bb7e8359642b6e071735b50ae41f5eb343fd42)
```

#### `curl` the `/ping` endpoint:

```bash
$ curl -i 'http://localhost:8086/ping'

HTTP/1.1 204 No Content
Content-Type: application/json
Request-Id: 1e08aeb6-fec0-11e6-8486-000000000000
✨ X-Influxdb-Version: 1.4.x ✨
Date: Wed, 01 Mar 2017 20:46:17 GMT
```

#### Launch the InfluxDB [Command Line Interface](/enterprise_influxdb/v1.9/tools/shell/):

```bash
$ influx

Connected to http://localhost:8086✨ version 1.4.x ✨
InfluxDB shell version: 1.4.x
```

#### Check the HTTP response in your logs:

```bash
$ journalctl -u influxdb.service

Mar 01 20:49:45 rk-api influxd[29560]: [httpd] 127.0.0.1 - - [01/Mar/2017:20:49:45 +0000] "POST /query?db=&epoch=ns&q=SHOW+DATABASES HTTP/1.1" 200 151 "-" ✨ "InfluxDBShell/1.4.x" ✨ 9a4371a1-fec0-11e6-84b6-000000000000 1709
```

## Where can I find InfluxDB logs?

On System V operating systems logs are stored under `/var/log/influxdb/`.

On systemd operating systems you can access the logs using `journalctl`.
Use `journalctl -u influxdb` to view the logs in the journal or `journalctl -u influxdb > influxd.log` to print the logs to a text file. With systemd, log retention depends on your system's journald settings.

## What is the relationship between shard group durations and retention policies?

InfluxDB stores data in shard groups.
A single shard group covers a specific time interval; InfluxDB determines that time interval by looking at the `DURATION` of the relevant retention policy (RP).
The table below outlines the default relationship between the `DURATION` of an RP and the time interval of a shard group:

| RP duration  | Shard group interval  |
|---|---|
| < 2 days  | 1 hour  |
| >= 2 days and <= 6 months  | 1 day  |
| > 6 months  | 7 days  |


Users can also configure the shard group duration with the
[`CREATE RETENTION POLICY`](/enterprise_influxdb/v1.9/query_language/manage-database/#create-retention-policies-with-create-retention-policy)
and
[`ALTER RETENTION POLICY`](/enterprise_influxdb/v1.9/query_language/manage-database/#modify-retention-policies-with-alter-retention-policy)
statements.
Check your retention policy's shard group duration with the
[`SHOW RETENTION POLICIES`](/enterprise_influxdb/v1.9/query_language/explore-schema/#show-retention-policies)
statement.

## Why aren't data dropped after I've altered a retention policy?

Several factors explain why data may not be immediately dropped after a
retention policy (RP) change.

The first and most likely cause is that, by default, InfluxDB checks to enforce
an RP every 30 minutes.
You may need to wait for the next RP check for InfluxDB to drop data that are
outside the RP's new `DURATION` setting.
The 30 minute interval is
[configurable](/enterprise_influxdb/v1.9/administration/config/#check-interval-30m0s).

Second, altering both the `DURATION` and `SHARD DURATION` of an RP can result in
unexpected data retention.
InfluxDB stores data in shard groups which cover a specific RP and time
interval.
When InfluxDB enforces an RP it drops entire shard groups, not individual data
points.
InfluxDB cannot divide shard groups.

If the RP's new `DURATION` is less than the old `SHARD DURATION` and InfluxDB is
currently writing data to one of the old, longer shard groups, the system is
forced to keep all of the data in that shard group.
This occurs even if some of the data in that shard group are outside of the new
`DURATION`.
InfluxDB will drop that shard group once all of its data is outside the new
`DURATION`.
The system will then begin writing data to shard groups that have the new,
shorter `SHARD DURATION` preventing any further unexpected data retention.

## Why does InfluxDB fail to parse microsecond units in the configuration file?

The syntax for specifying microsecond duration units differs for [configuration](/enterprise_influxdb/v1.9/administration/config/) settings, writes, queries, and setting the precision in the InfluxDB [Command Line Interface](/enterprise_influxdb/v1.9/tools/shell/) (CLI).
The table below shows the supported syntax for each category:

| |  Configuration File | InfluxDB API Writes | All Queries  | CLI Precision Command |
|---|---|---|---|---|
| u  | ❌ | 👍  |  👍 |  👍  |
| us |  👍  | ❌ | ❌ |  ❌ |
|  µ  | ❌ | ❌ |  👍  | ❌ |
|  µs  | 👍  | ❌ | ❌ |  ❌ |


If a configuration option specifies the `u` or `µ` syntax, InfluxDB fails to start and reports the following error in the logs:

```
run: parse config: time: unknown unit [µ|u] in duration [<integer>µ|<integer>u]
```

## Does InfluxDB have a file system size limit?

InfluxDB works within file system size restrictions for Linux and Windows POSIX. Some storage providers and distributions have size restrictions; for example:

- Amazon EBS volume limits size to ~16TB
- Linux ext3 file system limits size ~16TB
- Linux ext4 file system limits size to ~1EB (with file size limit ~16TB)

If you anticipate growing over 16TB per volume/file system, we recommend finding a provider and distribution that supports your storage requirements.

## How do I use the InfluxDB CLI to return human readable timestamps?

When you first connect to the CLI, specify the [rfc3339](https://www.ietf.org/rfc/rfc3339.txt) precision:

```bash
influx -precision rfc3339
```

Alternatively, specify the precision once you’ve already connected to the CLI:

```bash
$ influx
Connected to http://localhost:8086 version 0.xx.x
InfluxDB shell 0.xx.x
> precision rfc3339
>
```

Check out [CLI/Shell](/enterprise_influxdb/v1.9/tools/shell/) for more useful CLI options.

## How can a non-admin user `USE` a database in the InfluxDB CLI?

In versions prior to v1.3, [non-admin users](/enterprise_influxdb/v1.9/administration/authentication_and_authorization/#user-types-and-privileges) could not execute a `USE <database_name>` query in the CLI even if they had `READ` and/or `WRITE` permissions on that database.

Starting with version 1.3, non-admin users can execute the `USE <database_name>` query for databases on which they have `READ` and/or `WRITE` permissions.
If a non-admin user attempts to `USE` a database on which the user doesn't have `READ` and/or `WRITE` permissions, the system returns an error:

```
ERR: Database <database_name> doesn't exist. Run SHOW DATABASES for a list of existing databases.
```

> **Note** that the [`SHOW DATABASES` query](/enterprise_influxdb/v1.9/query_language/explore-schema/#show-databases) returns only those databases on which the non-admin user has `READ` and/or `WRITE` permissions.

## How do I write to a non-DEFAULT retention policy with the InfluxDB CLI?

Use the syntax `INSERT INTO [<database>.]<retention_policy> <line_protocol>` to write data to a non-`DEFAULT` retention policy using the CLI.
(Specifying the database and retention policy this way is only allowed with the CLI.
Writes over HTTP must specify the database and optionally the retention policy with the `db` and `rp` query parameters.)

For example:

```
> INSERT INTO one_day mortality bool=true
Using retention policy one_day
> SELECT * FROM "mydb"."one_day"."mortality"
name: mortality
---------------
time                             bool
2016-09-13T22:29:43.229530864Z   true
```

Note that you will need to fully qualify the measurement to query data in the non-`DEFAULT` retention policy. Fully qualify the measurement with the syntax:

```
"<database>"."<retention_policy>"."<measurement>"
```

## How do I cancel a long-running query?

You can cancel a long-running interactive query from the CLI using `Ctrl+C`. To stop other long-running query that you see when using the [`SHOW QUERIES`](/influxdb/v1.3/query_language/spec/#show-queries) command,
you can use the [`KILL QUERY`](/enterprise_influxdb/v1.9/troubleshooting/query_management/#stop-currently-running-queries-with-kill-query) command to stop it.

## Why can't I query Boolean field values?

Acceptable Boolean syntax differs for data writes and data queries.

| Boolean syntax |  Writes | Queries  |
-----------------------|-----------|--------------|
|  `t`,`f` |	👍 | ❌ |
|  `T`,`F` |  👍 |  ❌ |
|  `true`,`false` | 👍  | 👍  |
|  `True`,`False` |  👍 |  👍 |
|  `TRUE`,`FALSE` |  👍 |  👍 |

For example, `SELECT * FROM "hamlet" WHERE "bool"=True` returns all points with `bool` set to `TRUE`, but `SELECT * FROM "hamlet" WHERE "bool"=T` returns nothing.

<!-- TODO: closed issue. Edit docs if necessary. -->
<!-- {{% warn %}} [GitHub Issue #3939](https://github.com/influxdb/influxdb/issues/3939) {{% /warn %}} -->

## How does InfluxDB handle field type discrepancies across shards?

Field values can be floats, integers, strings, or Booleans.
Field value types cannot differ within a
[shard](/enterprise_influxdb/v1.9/concepts/glossary/#shard), but they can [differ](/enterprise_influxdb/v1.9/write_protocols/line_protocol_reference) across shards.

### The SELECT statement

The
[`SELECT` statement](/enterprise_influxdb/v1.9/query_language/explore-data/#the-basic-select-statement)
returns all field values **if** all values have the same type.
If field value types differ across shards, InfluxDB first performs any
applicable [cast](/enterprise_influxdb/v1.9/query_language/explore-data/#cast-operations)
operations and then returns all values with the type that occurs first in the
following list: float, integer, string, Boolean.

If your data have field value type discrepancies, use the syntax
`<field_key>::<type>` to query the different data types.

#### Example

The measurement `just_my_type` has a single field called `my_field`.
`my_field` has four field values across four different shards, and each value has
a different data type (float, integer, string, and Boolean).

`SELECT *` returns only the float and integer field values.
Note that InfluxDB casts the integer value to a float in the response.
```
SELECT * FROM just_my_type

name: just_my_type
------------------
time		                	my_field
2016-06-03T15:45:00Z	  9.87034
2016-06-03T16:45:00Z	  7
```

`SELECT <field_key>::<type> [...]` returns all value types.
InfluxDB outputs each value type in its own column with incremented column names.
Where possible, InfluxDB casts field values to another type;
it casts the integer `7` to a float in the first column, and it
casts the float `9.879034` to an integer in the second column.
InfluxDB cannot cast floats or integers to strings or Booleans.
```
SELECT "my_field"::float,"my_field"::integer,"my_field"::string,"my_field"::boolean FROM just_my_type

name: just_my_type
------------------
time			               my_field	 my_field_1	 my_field_2		 my_field_3
2016-06-03T15:45:00Z	 9.87034	  9
2016-06-03T16:45:00Z	 7	        7
2016-06-03T17:45:00Z			                     a string
2016-06-03T18:45:00Z					                                true
```

### The SHOW FIELD KEYS query

`SHOW FIELD KEYS` returns every data type, across every shard, associated with
the field key.

#### Example

The measurement `just_my_type` has a single field called `my_field`.
`my_field` has four field values across four different shards, and each value has
a different data type (float, integer, string, and Boolean).
`SHOW FIELD KEYS` returns all four data types:

```sql
> SHOW FIELD KEYS

name: just_my_type
fieldKey   fieldType
--------   ---------
my_field   float
my_field   string
my_field   integer
my_field   boolean
```

## What are the minimum and maximum integers that InfluxDB can store?
InfluxDB stores all integers as signed int64 data types.
The minimum and maximum valid values for int64 are `-9023372036854775808` and `9023372036854775807`.
See [Go builtins](http://golang.org/pkg/builtin/#int64) for more information.

Values close to but within those limits may lead to unexpected results; some functions and operators convert the int64 data type to float64 during calculation which can cause overflow issues.

## What are the minimum and maximum timestamps that InfluxDB can store?
The minimum timestamp is `-9223372036854775806` or `1677-09-21T00:12:43.145224194Z`.
The maximum timestamp is `9223372036854775806` or `2262-04-11T23:47:16.854775806Z`.

Timestamps outside that range return a [parsing error](/enterprise_influxdb/v1.9/troubleshooting/errors/#unable-to-parse-time-outside-range).

## How can I tell what type of data is stored in a field?

The [`SHOW FIELD KEYS`](/enterprise_influxdb/v1.9/query_language/explore-schema/#show-field-keys) query also returns the field's type.

#### Example

```sql
> SHOW FIELD KEYS FROM all_the_types
name: all_the_types
-------------------
fieldKey  fieldType
blue      string
green     boolean
orange    integer
yellow    float
```

## Can I change a field's data type?

Currently, InfluxDB offers very limited support for changing a field's data type.

The `<field_key>::<type>` syntax supports casting field values from integers to
floats or from floats to integers.
See [Cast Operations](/enterprise_influxdb/v1.9/query_language/explore-data/#data-types-and-cast-operations)
for an example.
There is no way to cast a float or integer to a string or Boolean (or vice versa).

We list possible workarounds for changing a field's data type below.
Note that these workarounds will not update data that have already been
written to the database.

#### Write the data to a different field

The simplest workaround is to begin writing the new data type to a different field in the same
[series](/enterprise_influxdb/v1.9/concepts/glossary/#series).

#### Work the shard system

Field value types cannot differ within a
[shard](/enterprise_influxdb/v1.9/concepts/glossary/#shard) but they can differ across
shards.

Users looking to change a field's data type can use the `SHOW SHARDS` query
to identify the `end_time` of the current shard.
InfluxDB will accept writes with a different data type to an existing field if the point has a timestamp
that occurs after that `end_time`.

Note that this will not change the field's data type on prior shards.
For how this will affect your queries, please see
[How does InfluxDB handle field type discrepancies across shards](/enterprise_influxdb/v1.9/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-field-type-discrepancies-across-shards).

## How do I perform mathematical operations within a function?

Currently, InfluxDB does not support mathematical operations within functions.
We recommend using InfluxQL's [subqueries](/enterprise_influxdb/v1.9/query_language/explore-data/#subqueries)
as a workaround.

### Example

InfluxQL does not support the following syntax:

```sqk
SELECT MEAN("dogs" - "cats") from "pet_daycare"
```

Instead, use a subquery to get the same result:

```sql
> SELECT MEAN("difference") FROM (SELECT "dogs" - "cat" AS "difference" FROM "pet_daycare")
```

See the
[Data Exploration](/enterprise_influxdb/v1.9/query_language/explore-data/#subqueries)
page for more information.

## Why does my query return epoch 0 as the timestamp?

In InfluxDB, epoch 0  (`1970-01-01T00:00:00Z`)  is often used as a null timestamp equivalent.
If you request a query that has no timestamp to return, such as an aggregation function with an unbounded time range, InfluxDB returns epoch 0 as the timestamp.

## Which InfluxQL functions support nesting?

The following InfluxQL functions support nesting:

* [`COUNT()`](/enterprise_influxdb/v1.9/query_language/functions/#count) with [`DISTINCT()`](/enterprise_influxdb/v1.9/query_language/functions/#distinct)
* [`CUMULATIVE_SUM()`](/enterprise_influxdb/v1.9/query_language/functions/#cumulative-sum)
* [`DERIVATIVE()`](/enterprise_influxdb/v1.9/query_language/functions/#derivative)
* [`DIFFERENCE()`](/enterprise_influxdb/v1.9/query_language/functions/#difference)
* [`ELAPSED()`](/enterprise_influxdb/v1.9/query_language/functions/#elapsed)
* [`MOVING_AVERAGE()`](/enterprise_influxdb/v1.9/query_language/functions/#moving-average)
* [`NON_NEGATIVE_DERIVATIVE()`](/enterprise_influxdb/v1.9/query_language/functions/#non-negative-derivative)
* [`HOLT_WINTERS()`](/enterprise_influxdb/v1.9/query_language/functions/#holt-winters) and [`HOLT_WINTERS_WITH_FIT()`](/enterprise_influxdb/v1.9/query_language/functions/#holt-winters)

For information on how to use a subquery as a substitute for nested functions, see
[Data exploration](/enterprise_influxdb/v1.9/query_language/explore-data/#subqueries).

## What determines the time intervals returned by `GROUP BY time()` queries?

The time intervals returned by `GROUP BY time()` queries conform to the InfluxDB database's preset time
buckets or to the user-specified [offset interval](/enterprise_influxdb/v1.9/query_language/explore-data/#advanced-group-by-time-syntax).

#### Example

##### Preset time buckets

The following query calculates the average value of `sunflowers` between
6:15pm and 7:45pm and groups those averages into one hour intervals:

```sql
SELECT mean("sunflowers")
FROM "flower_orders"
WHERE time >= '2016-08-29T18:15:00Z' AND time <= '2016-08-29T19:45:00Z' GROUP BY time(1h)
```

The results below show how InfluxDB maintains its preset time buckets.

In this example, the 6pm hour is a preset bucket and the 7pm hour is a preset bucket.
The average for the 6pm time bucket does not include data prior to 6:15pm because of the `WHERE` time clause,
but any data included in the average for the 6pm time bucket must occur in the 6pm hour.
The same goes for the 7pm time bucket; any data included in the average for the 7pm
time bucket must occur in the 7pm hour.
The dotted lines show the points that make up each average.

Note that while the first timestamp in the results is `2016-08-29T18:00:00Z`,
the query results in that bucket do **not** include data with timestamps that occur before the start of the
`WHERE` time clause (`2016-08-29T18:15:00Z`).

Raw data:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

Results:

```sql
name: flower_orders                                name: flower_orders
—————————                                          -------------------
time                    sunflowers                 time                  mean
2016-08-29T18:00:00Z    34                         2016-08-29T18:00:00Z  22.332
                       |--|                        2016-08-29T19:00:00Z  62.75
2016-08-29T18:15:00Z   |28|
2016-08-29T18:30:00Z   |19|
2016-08-29T18:45:00Z   |20|
                       |--|
                       |--|
2016-08-29T19:00:00Z   |56|
2016-08-29T19:15:00Z   |76|
2016-08-29T19:30:00Z   |29|
2016-08-29T19:45:00Z   |90|
                       |--|
2016-08-29T20:00:00Z    70

```

##### Offset interval

The following query calculates the average value of `sunflowers` between
6:15pm and 7:45pm and groups those averages into one hour intervals.
It also offsets the InfluxDB database's preset time buckets by `15` minutes.

```sql
SELECT mean("sunflowers")
FROM "flower_orders"
WHERE time >= '2016-08-29T18:15:00Z' AND time <= '2016-08-29T19:45:00Z' GROUP BY time(1h,15m)
                                                                                         ---
                                                                                          |
                                                                                   offset interval
```

In this example, the user-specified
[offset interval](/enterprise_influxdb/v1.9/query_language/explore-data/#advanced-group-by-time-syntax)
shifts the InfluxDB database's preset time buckets forward by `15` minutes.
The average for the 6pm time bucket now includes data between 6:15pm and 7pm, and
the average for the 7pm time bucket includes data between 7:15pm and 8pm.
The dotted lines show the points that make up each average.

Note that the first timestamp in the result is `2016-08-29T18:15:00Z`
instead of `2016-08-29T18:00:00Z`.

Raw data:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

Results:

```sql
name: flower_orders                                name: flower_orders
—————————                                          -------------------
time                    sunflowers                 time                  mean
2016-08-29T18:00:00Z    34                         2016-08-29T18:15:00Z  30.75
                       |--|                        2016-08-29T19:15:00Z  65
2016-08-29T18:15:00Z   |28|
2016-08-29T18:30:00Z   |19|
2016-08-29T18:45:00Z   |20|
2016-08-29T19:00:00Z   |56|
                       |--|
                       |--|
2016-08-29T19:15:00Z   |76|
2016-08-29T19:30:00Z   |29|
2016-08-29T19:45:00Z   |90|
2016-08-29T20:00:00Z   |70|
                       |--|
```

## Why do my queries return no data or partial data?

The most common reasons why your query returns no data or partial data:

- [Querying the wrong retention policy](#querying-the-wrong-retention-policy) (no data returned)
- [No field key in the SELECT clause](#no-field-key-in-the-select-clause) (no data returned)
- [SELECT query includes `GROUP BY time()`](#select-query-includes-group-by-time) (partial data before `now()` returned)
- [Tag and field key with the same name](#tag-and-field-key-with-the-same-name)

### Querying the wrong retention policy

InfluxDB automatically queries data in a database’s `DEFAULT` retention policy](/enterprise_influxdb/v1.9/concepts/glossary/#retention-policy-rp) (RP). If your data is stored in another RP, you must specify the RP in your query to get results.

### No field key in the SELECT clause

A query requires at least one [field key](/enterprise_influxdb/v1.9/concepts/glossary/#field-key) in the `SELECT` clause. If the `SELECT` clause includes only [tag keys](/enterprise_influxdb/v1.9/concepts/glossary/#tag-key), the query returns an empty response. For more information, see [Data exploration](/enterprise_influxdb/v1.9/query_language/explore-data/#common-issues-with-the-select-statement).

### SELECT query includes `GROUP BY time()`

If your `SELECT` query includes a [`GROUP BY time()` clause](/enterprise_influxdb/v1.9/query_language/explore-data/#group-by-time-intervals), only data points between `1677-09-21 00:12:43.145224194` and [`now()`](/enterprise_influxdb/v1.9/concepts/glossary/#now) are returned. Therefore, if any of your data points occur after `now()`, specify [an alternative upper bound](/enterprise_influxdb/v1.9/query_language/explore-data/#time-syntax) in your time interval.

(By default, most [`SELECT` queries](/enterprise_influxdb/v1.9/query_language/explore-data/#the-basic-select-statement) query data with timestamps between `1677-09-21 00:12:43.145224194` and `2262-04-11T23:47:16.854775806Z` UTC.)

### Tag and field key with the same name

Avoid using the same name for a tag and field key. If you inadvertently add the same name for a tag and field key, and then query both keys together, the query results show the second key queried (tag or field) appended with `_1` (also visible as the column header in Chronograf). To query a tag or field key appended with `_1`, you **must drop** the appended `_1` **and include** the syntax `::tag` or `::field`.

#### Example

1. [Launch `influx`](/enterprise_influxdb/v1.9/tools/shell/#launch-influx).

2. Write the following points to create both a field and tag key with the same name `leaves`:

    ```bash
    # create the `leaves` tag key
    INSERT grape,leaves=species leaves=6

    #create the `leaves` field key
    INSERT grape leaves=5
    ```

3. If you view both keys, you'll notice that neither key includes `_1`:

    ```bash
    # show the `leaves` tag key
    SHOW TAG KEYS

    name: grape
    tagKey
    ------
    leaves

    # create the `leaves` field key
    SHOW FIELD KEYS

    name: grape
    fieldKey   fieldType
    ------     ---------
    leaves     float
```

4. If you query the `grape` measurement, you'll see the `leaves` tag key has an appended `_1`:

    ```bash
    # query the `grape` measurement
    SELECT * FROM <database_name>.<retention_policy>."grape"

    name: grape
    time                leaves      leaves_1
    ----                --------    ----------
    1574128162128468000 6.00        species
    1574128238044155000 5.00
    ```

5. To query a duplicate key name, you **must drop** `_1` **and include** `::tag` or `::field` after the key:

    ```bash
    # query duplicate keys using the correct syntax
    SELECT "leaves"::tag, "leaves"::field FROM <database_name>.<retention_policy>."grape"

    name: grape
    time                leaves     leaves_1
    ----                --------   ----------
    1574128162128468000 species    6.00
    1574128238044155000            5.00
    ```

    Therefore, queries that reference `leaves_1` don't return values.

{{% warn %}}**Warning:** If you inadvertently add a duplicate key name, follow the steps below to [remove a duplicate key](#remove-a-duplicate-key). Because of memory requirements, if you have large amounts of data, we recommend chunking your data (while selecting it) by a specified interval (for example, date range) to fit the allotted memory.
{{% /warn %}}

#### Remove a duplicate key

1. [Launch `influx`](/enterprise_influxdb/v1.9/tools/shell/#launch-influx).

2. Use the following queries to remove a duplicate key.

    ```sql

    /* select each field key to keep in the original measurement and send to a temporary
       measurement; then, group by the tag keys to keep (leave out the duplicate key) */

    SELECT "field_key","field_key2","field_key3"
    INTO <temporary_measurement> FROM <original_measurement>
    WHERE <date range> GROUP BY "tag_key","tag_key2","tag_key3"

    /* verify the field keys and tags keys were successfully moved to the temporary
    measurement */
    SELECT * FROM "temporary_measurement"

    /* drop original measurement (with the duplicate key) */
    DROP MEASUREMENT "original_measurement"

    /* move data from temporary measurement back to original measurement you just dropped */
    SELECT * INTO "original_measurement" FROM "temporary_measurement" GROUP BY *

    /* verify the field keys and tags keys were successfully moved back to the original
     measurement */
    SELECT * FROM "original_measurement"

    /* drop temporary measurement */
    DROP MEASUREMENT "temporary_measurement"

    ```

## Why don't my GROUP BY time() queries return timestamps that occur after now()?

Most `SELECT` statements have a default time range between [`1677-09-21 00:12:43.145224194` and `2262-04-11T23:47:16.854775806Z` UTC](#what-are-the-minimum-and-maximum-timestamps-that-influxdb-can-store).
For `SELECT` statements with a [`GROUP BY time()` clause](/enterprise_influxdb/v1.9/query_language/explore-data/#group-by-time-intervals), the default time
range is between `1677-09-21 00:12:43.145224194` UTC and [`now()`](/enterprise_influxdb/v1.9/concepts/glossary/#now).

To query data with timestamps that occur after `now()`, `SELECT` statements with
a `GROUP BY time()` clause must provide an alternative upper bound in the
[`WHERE` clause](/enterprise_influxdb/v1.9/query_language/explore-data/#the-where-clause).

In the following example, the first query covers data with timestamps between
`2015-09-18T21:30:00Z` and `now()`.
The second query covers data with timestamps between `2015-09-18T21:30:00Z` and 180 weeks from `now()`.
```
> SELECT MEAN("boards") FROM "hillvalley" WHERE time >= '2015-09-18T21:30:00Z' GROUP BY time(12m) fill(none)


> SELECT MEAN("boards") FROM "hillvalley" WHERE time >= '2015-09-18T21:30:00Z' AND time <= now() + 180w GROUP BY time(12m) fill(none)
```

Note that the `WHERE` clause must provide an alternative **upper** bound to
override the default `now()` upper bound. The following query merely resets
the lower bound to `now()` such that the query's time range is between
`now()` and `now()`:

```sql
> SELECT MEAN("boards") FROM "hillvalley" WHERE time >= now() GROUP BY time(12m) fill(none)
>
```

For for more on time syntax in queries, see [Data Exploration](/enterprise_influxdb/v1.9/query_language/explore-data/#time-syntax).

## Can I perform mathematical operations against timestamps?

Currently, it is not possible to execute mathematical operators against timestamp values in InfluxDB.
Most time calculations must be carried out by the client receiving the query results.

There is limited support for using InfluxQL functions against timestamp values.
The function [ELAPSED()](/enterprise_influxdb/v1.9/query_language/functions/#elapsed)
returns the difference between subsequent timestamps in a single field.

## Can I identify write precision from returned timestamps?

InfluxDB stores all timestamps as nanosecond values, regardless of the write precision supplied.
It is important to note that when returning query results, the database silently drops trailing zeros from timestamps which obscures the initial write precision.

In the example below, the tags `precision_supplied` and `timestamp_supplied` show the time precision and timestamp that the user provided at the write.
Because InfluxDB silently drops trailing zeros on returned timestamps, the write precision is not recognizable in the returned timestamps.

```sql
name: trails
-------------
time                  value	 precision_supplied  timestamp_supplied
1970-01-01T01:00:00Z  3      n                   3600000000000
1970-01-01T01:00:00Z  5      h                   1
1970-01-01T02:00:00Z  4      n                   7200000000000
1970-01-01T02:00:00Z  6      h                   2
```

<!-- TODO: closed issue. Edit docs if necessary. -->
<!-- {{% warn %}} [GitHub Issue #2977](https://github.com/influxdb/influxdb/issues/2977) {{% /warn %}} -->

## When should I single quote and when should I double quote in queries?

Single quote string values (for example, tag values) but do not single quote identifiers (database names, retention policy names, user names, measurement names, tag keys, and field keys).

Double quote identifiers if they start with a digit, contain characters other than `[A-z,0-9,_]`, or if they are an [InfluxQL keyword](https://github.com/influxdata/influxql/blob/master/README.md#keywords).
Double quotes are not required for identifiers if they don't fall into one of
those categories but we recommend double quoting them anyway.

Examples:

Yes: `SELECT bikes_available FROM bikes WHERE station_id='9'`

Yes: `SELECT "bikes_available" FROM "bikes" WHERE "station_id"='9'`

Yes: `SELECT MIN("avgrq-sz") AS "min_avgrq-sz" FROM telegraf`

Yes: `SELECT * from "cr@zy" where "p^e"='2'`

No: `SELECT 'bikes_available' FROM 'bikes' WHERE 'station_id'="9"`

No: `SELECT * from cr@zy where p^e='2'`

Single quote date time strings. InfluxDB returns an error (`ERR: invalid
operation: time and *influxql.VarRef are not compatible`) if you double quote
a date time string.

Examples:

Yes: `SELECT "water_level" FROM "h2o_feet" WHERE time > '2015-08-18T23:00:01.232000000Z' AND time < '2015-09-19'`

No: `SELECT "water_level" FROM "h2o_feet" WHERE time > "2015-08-18T23:00:01.232000000Z" AND time < "2015-09-19"`

See [Data Exploration](/enterprise_influxdb/v1.9/query_language/explore-data/#time-syntax) for more on time syntax in queries.

## Why am I missing data after creating a new DEFAULT retention policy?

When you create a new `DEFAULT` retention policy (RP) on a database, the data written to the old `DEFAULT` RP remain in the old RP.
Queries that do not specify an RP automatically query the new `DEFAULT` RP so the old data may appear to be missing.
To query the old data you must fully qualify the relevant data in the query.

Example:

All of the data in the measurement `fleeting` fall under the `DEFAULT` RP called `one_hour`:

```sql
> SELECT count(flounders) FROM fleeting
name: fleeting
--------------
time			               count
1970-01-01T00:00:00Z	 8
```

We [create](/enterprise_influxdb/v1.9/query_language/manage-database/#create-retention-policies-with-create-retention-policy) a new `DEFAULT` RP (`two_hour`) and perform the same query:

```sql
> SELECT count(flounders) FROM fleeting
>
```

To query the old data, we must specify the old `DEFAULT` RP by fully qualifying `fleeting`:

```sql
> SELECT count(flounders) FROM fish.one_hour.fleeting
name: fleeting
--------------
time			               count
1970-01-01T00:00:00Z	 8
```

## Why is my query with a `WHERE OR` time clause returning empty results?

Currently, InfluxDB does not support using `OR` in the `WHERE` clause to specify multiple time ranges.
InfluxDB returns an empty response if the query's `WHERE` clause uses `OR`
with time intervals.

Example:

```sql
> SELECT * FROM "absolutismus" WHERE time = '2016-07-31T20:07:00Z' OR time = '2016-07-31T23:07:17Z'
>
```

{{% warn %}} [GitHub Issue #7530](https://github.com/influxdata/influxdb/issues/7530)
{{% /warn %}}

## Why does `fill(previous)` return empty results?

`fill(previous)` doesn't fill the result for a time bucket if the previous value is outside the query's time range.

In the following example, InfluxDB doesn't fill the `2016-07-12T16:50:20Z`-`2016-07-12T16:50:30Z` time bucket with the results from the `2016-07-12T16:50:00Z`-`2016-07-12T16:50:10Z` time bucket because the query’s time range does not include the earlier time bucket.

Raw data:

```sql
> SELECT * FROM "cupcakes"
name: cupcakes
--------------
time                   chocolate
2016-07-12T16:50:00Z   3
2016-07-12T16:50:10Z   2
2016-07-12T16:50:40Z   12
2016-07-12T16:50:50Z   11
```

`GROUP BY time()` query:

```sql
> SELECT max("chocolate") FROM "cupcakes" WHERE time >= '2016-07-12T16:50:20Z' AND time <= '2016-07-12T16:51:10Z' GROUP BY time(20s) fill(previous)
name: cupcakes
--------------
time                   max
2016-07-12T16:50:20Z
2016-07-12T16:50:40Z   12
2016-07-12T16:51:00Z   12
```

While this is the expected behavior of `fill(previous)`, an [open feature request](https://github.com/influxdata/influxdb/issues/6878) on GitHub proposes that `fill(previous)` should fill results even when previous values fall outside the query’s time range.

## Why are my INTO queries missing data?

By default, `INTO` queries convert any tags in the initial data to fields in
the newly written data.
This can cause InfluxDB to overwrite [points](/enterprise_influxdb/v1.9/concepts/glossary/#point) that were previously differentiated by a tag.
Include `GROUP BY *` in all `INTO` queries to preserve tags in the newly written data.

Note that this behavior does not apply to queries that use the [`TOP()`](/enterprise_influxdb/v1.9/query_language/functions/#top) or [`BOTTOM()`](/enterprise_influxdb/v1.9/query_language/functions/#bottom) functions.
See the [`TOP()`](/enterprise_influxdb/v1.9/query_language/functions/#top-tags-and-the-into-clause) and [`BOTTOM()`](/enterprise_influxdb/v1.9/query_language/functions/#bottom-tags-and-the-into-clause) documentation for more information.

#### Example

##### Initial data

The `french_bulldogs` measurement includes the `color` tag and the `name` field.

```sql
> SELECT * FROM "french_bulldogs"
name: french_bulldogs
---------------------
time                  color  name
2016-05-25T00:05:00Z  peach  nugget
2016-05-25T00:05:00Z  grey   rumple
2016-05-25T00:10:00Z  black  prince
```

##### `INTO` query without `GROUP BY *`

An `INTO` query without a `GROUP BY *` clause turns the `color` tag into
a field in the newly written data.
In the initial data the `nugget` point and the `rumple` points are differentiated only by the `color` tag.
Once `color` becomes a field, InfluxDB assumes that the `nugget` point and the
`rumple` point are duplicate points and it overwrites the `nugget` point with
the `rumple` point.

```sql
> SELECT * INTO "all_dogs" FROM "french_bulldogs"
name: result
------------
time                  written
1970-01-01T00:00:00Z  3

> SELECT * FROM "all_dogs"
name: all_dogs
--------------
time                  color  name
2016-05-25T00:05:00Z  grey   rumple                <---- no more nugget 🐶
2016-05-25T00:10:00Z  black  prince
```

##### `INTO` query with `GROUP BY *`

An `INTO` query with a `GROUP BY *` clause preserves `color` as a tag in the newly written data.
In this case, the `nugget` point and the `rumple` point remain unique points and InfluxDB does not overwrite any data.

```sql
> SELECT "name" INTO "all_dogs" FROM "french_bulldogs" GROUP BY *
name: result
------------
time                  written
1970-01-01T00:00:00Z  3

> SELECT * FROM "all_dogs"
name: all_dogs
--------------
time                  color  name
2016-05-25T00:05:00Z  peach  nugget
2016-05-25T00:05:00Z  grey   rumple
2016-05-25T00:10:00Z  black  prince
```

## How do I query data with an identical tag key and field key?

Use the `::` syntax to specify if the key is a field key or tag key.

#### Examples

##### Sample data

```sql
> INSERT candied,almonds=true almonds=50,half_almonds=51 1465317610000000000
> INSERT candied,almonds=true almonds=55,half_almonds=56 1465317620000000000

> SELECT * FROM "candied"
name: candied
-------------
time                   almonds  almonds_1  half_almonds
2016-06-07T16:40:10Z   50       true       51
2016-06-07T16:40:20Z   55       true       56
```

##### Specify that the key is a field:

```sql
> SELECT * FROM "candied" WHERE "almonds"::field > 51
name: candied
-------------
time                   almonds  almonds_1  half_almonds
2016-06-07T16:40:20Z   55       true       56
```

##### Specify that the key is a tag:

```sql
> SELECT * FROM "candied" WHERE "almonds"::tag='true'
name: candied
-------------
time                   almonds  almonds_1  half_almonds
2016-06-07T16:40:10Z   50       true       51
2016-06-07T16:40:20Z   55       true       56
```

## How do I query data across measurements?

Currently, there is no way to perform cross-measurement math or grouping.
All data must be under a single measurement to query it together.
InfluxDB is not a relational database and mapping data across measurements is not currently a recommended [schema](/enterprise_influxdb/v1.9/concepts/glossary/#schema).
See GitHub Issue [#3552](https://github.com/influxdata/influxdb/issues/3552) for a discussion of implementing JOIN in InfluxDB.

## Does the order of the timestamps matter?

No.
Our tests indicate that there is a only a negligible difference between the times
it takes InfluxDB to complete the following queries:

```sql
SELECT ... FROM ... WHERE time > 'timestamp1' AND time < 'timestamp2'
SELECT ... FROM ... WHERE time < 'timestamp2' AND time > 'timestamp1'
```

## How do I SELECT data with a tag that has no value?

Specify an empty tag value with `''`. For example:

```sql
> SELECT * FROM "vases" WHERE priceless=''
name: vases
-----------
time                   origin   priceless
2016-07-20T18:42:00Z   8
```

## Why does series cardinality matter?

InfluxDB maintains an in-memory index of every [series](/enterprise_influxdb/v1.9/concepts/glossary/#series) in the system. As the number of unique series grows, so does the RAM usage. High [series cardinality](/enterprise_influxdb/v1.9/concepts/glossary/#series-cardinality) can lead to the operating system killing the InfluxDB process with an out of memory (OOM) exception. See [SHOW CARDINALITY](/enterprise_influxdb/v1.9/query_language/spec/#show-cardinality) to learn about the InfluxSQL commands for series cardinality.

## How can I remove series from the index?

To reduce series cardinality, series must be dropped from the index.
[`DROP DATABASE`](/enterprise_influxdb/v1.9/query_language/manage-database/#delete-a-database-with-drop-database),
[`DROP MEASUREMENT`](/enterprise_influxdb/v1.9/query_language/manage-database/#delete-measurements-with-drop-measurement), and
[`DROP SERIES`](/enterprise_influxdb/v1.9/query_language/manage-database/#drop-series-from-the-index-with-drop-series) will all remove series from the index and reduce the overall series cardinality.

> **Note:** `DROP` commands are usually CPU-intensive, as they frequently trigger a TSM compaction. Issuing `DROP` queries at a high frequency may significantly impact write and other query throughput.

## How do I write integer field values?

Add a trailing `i` to the end of the field value when writing an integer.
If you do not provide the `i`, InfluxDB will treat the field value as a float.

Writes an integer: `value=100i`
Writes a float: `value=100`

## How does InfluxDB handle duplicate points?

A point is uniquely identified by the measurement name, [tag set](/enterprise_influxdb/v1.9/concepts/glossary/#tag-set), and timestamp.
If you submit a new point with the same measurement, tag set, and timestamp as an existing point, the field set becomes the union of the old field set and the new field set, where any ties go to the new field set.
This is the intended behavior.

For example:

Old point: `cpu_load,hostname=server02,az=us_west val_1=24.5,val_2=7 1234567890000000`

New point: `cpu_load,hostname=server02,az=us_west val_1=5.24 1234567890000000`

After you submit the new point, InfluxDB overwrites `val_1` with the new field value and leaves the field `val_2` alone:

```sql
> SELECT * FROM "cpu_load" WHERE time = 1234567890000000
name: cpu_load
--------------
time                      az        hostname   val_1   val_2
1970-01-15T06:56:07.89Z   us_west   server02   5.24    7
```

To store both points:

* Introduce an arbitrary new tag to enforce uniqueness.

    Old point: `cpu_load,hostname=server02,az=us_west,uniq=1 val_1=24.5,val_2=7 1234567890000000`

    New point: `cpu_load,hostname=server02,az=us_west,uniq=2 val_1=5.24 1234567890000000`

    After writing the new point to InfluxDB:

```sql
> SELECT * FROM "cpu_load" WHERE time = 1234567890000000
name: cpu_load
--------------
time                      az        hostname   uniq   val_1   val_2
1970-01-15T06:56:07.89Z   us_west   server02   1      24.5    7
1970-01-15T06:56:07.89Z   us_west   server02   2      5.24
```

* Increment the timestamp by a nanosecond.

    Old point: `cpu_load,hostname=server02,az=us_west val_1=24.5,val_2=7 1234567890000000`

    New point: `cpu_load,hostname=server02,az=us_west val_1=5.24 1234567890000001`

    After writing the new point to InfluxDB:

```sql
> SELECT * FROM "cpu_load" WHERE time >= 1234567890000000 and time <= 1234567890000001
name: cpu_load
--------------
time                             az        hostname   val_1   val_2
1970-01-15T06:56:07.89Z          us_west   server02   24.5    7
1970-01-15T06:56:07.890000001Z   us_west   server02   5.24
```

## What newline character does the InfluxDB API require?

The InfluxDB line protocol relies on line feed (`\n`, which is ASCII `0x0A`) to indicate the end of a line and the beginning of a new line. Files or data that use a newline character other than `\n` will result in the following errors: `bad timestamp`, `unable to parse`.

Note that Windows uses carriage return and line feed (`\r\n`) as the newline character.

## What words and characters should I avoid when writing data to InfluxDB?

### InfluxQL keywords

If you use an [InfluxQL keyword](https://github.com/influxdata/influxql/blob/master/README.md#keywords) as an identifier you will need to double quote that identifier in every query.
This can lead to [non-intuitive errors](/enterprise_influxdb/v1.9/troubleshooting/errors/#error-parsing-query-found-expected-identifier-at-line-char).
Identifiers are continuous query names, database names, field keys, measurement names, retention policy names, subscription names, tag keys, and user names.

### time

The keyword `time` is a special case.
`time` can be a
[continuous query](/enterprise_influxdb/v1.9/concepts/glossary/#continuous-query-cq) name,
database name,
[measurement](/enterprise_influxdb/v1.9/concepts/glossary/#measurement) name,
[retention policy](/enterprise_influxdb/v1.9/concepts/glossary/#retention-policy-rp) name,
[subscription](/enterprise_influxdb/v1.9/concepts/glossary/#subscription) name, and
[user](/enterprise_influxdb/v1.9/concepts/glossary/#user) name.
In those cases, `time` does not require double quotes in queries.
`time` cannot be a [field key](/enterprise_influxdb/v1.9/concepts/glossary/#field-key) or
[tag key](/enterprise_influxdb/v1.9/concepts/glossary/#tag-key);
InfluxDB rejects writes with `time` as a field key or tag key and returns an error.

#### Examples

##### Write `time` as a measurement and query it

```sql
> INSERT time value=1

> SELECT * FROM time

name: time
time                            value
----                            -----
2017-02-07T18:28:27.349785384Z  1
```

`time` is a valid measurement name in InfluxDB.

##### Write `time` as a field key and attempt to query it

```sql
> INSERT mymeas time=1
ERR: {"error":"partial write: invalid field name: input field \"time\" on measurement \"mymeas\" is invalid dropped=1"}
```

`time` is not a valid field key in InfluxDB.
The system does does not write the point and returns a `400`.

##### Write `time` as a tag key and attempt to query it

```sql
> INSERT mymeas,time=1 value=1
ERR: {"error":"partial write: invalid tag key: input tag \"time\" on measurement \"mymeas\" is invalid dropped=1"}
```

`time` is not a valid tag key in InfluxDB.
The system does does not write the point and returns a `400`.

### Characters

To keep regular expressions and quoting simple, avoid using the following characters in identifiers:

`\` backslash
 `^` circumflex accent
 `$` dollar sign
 `'` single quotation mark
 `"` double quotation mark
 `=` equal sign
 `,` comma

## When should I single quote and when should I double quote when writing data?

* Avoid single quoting and double quoting identifiers when writing data via the line protocol; see the examples below for how writing identifiers with quotes can complicate queries.
Identifiers are database names, retention policy names, user names, measurement names, tag keys, and field keys.

	Write with a double-quoted measurement: `INSERT "bikes" bikes_available=3`
	Applicable query: `SELECT * FROM "\"bikes\""`

	Write with a single-quoted measurement: `INSERT 'bikes' bikes_available=3`
	Applicable query: `SELECT * FROM "\'bikes\'"`

	Write with an unquoted measurement: `INSERT bikes bikes_available=3`
	Applicable query: `SELECT * FROM "bikes"`

* Double quote field values that are strings.

	Write: `INSERT bikes happiness="level 2"`
	Applicable query: `SELECT * FROM "bikes" WHERE "happiness"='level 2'`

* Special characters should be escaped with a backslash and not placed in quotes.

	Write: `INSERT wacky va\"ue=4`
	Applicable query: `SELECT "va\"ue" FROM "wacky"`

For more information , see [Line protocol](/enterprise_influxdb/v1.9/write_protocols/).

## Does the precision of the timestamp matter?

Yes.
To maximize performance, use the coarsest possible timestamp precision when writing data to InfluxDB.

In the following two examples, the first request uses a default precision of nanoseconds while the second example sets the precision to seconds:

```bash
curl -i -XPOST "http://localhost:8086/write?db=weather" --data-binary 'temperature,location=1 value=90 1472666050000000000'

curl -i -XPOST "http://localhost:8086/write?db=weather&precision=s" --data-binary 'temperature,location=1 value=90 1472666050'
```

The tradeoff is that identical points with duplicate timestamps, more likely to occur as precision gets coarser, may overwrite other points.

## What are the configuration recommendations and schema guidelines for writing sparse, historical data?

For users who want to write sparse, historical data to InfluxDB, InfluxData recommends:

First, lengthening your [retention policy](/enterprise_influxdb/v1.9/concepts/glossary/#retention-policy-rp)‘s [shard group](/enterprise_influxdb/v1.9/concepts/glossary/#shard-group) duration to cover several years.
The default shard group duration is one week and if your data cover several hundred years – well, that’s a lot of shards!
Having an extremely high number of shards is inefficient for InfluxDB.
Increase the shard group duration for your data’s retention policy with the [`ALTER RETENTION POLICY` query](/enterprise_influxdb/v1.9/query_language/manage-database/#modify-retention-policies-with-alter-retention-policy).

Second, temporarily lowering the [`cache-snapshot-write-cold-duration` configuration setting](/enterprise_influxdb/v1.9/administration/config/#cache-snapshot-write-cold-duration-10m).
If you’re writing a lot of historical data, the default setting (`10m`) can cause the system to hold all of your data in cache for every shard.
Temporarily lowering the `cache-snapshot-write-cold-duration` setting to `10s` while you write the historical data makes the process more efficient.
## Where can I find InfluxDB Enterprise logs?

On systemd operating systems, service logs can be accessed using the `journalctl` command.

Meta: `journalctl -u influxdb-meta`

Data : `journalctl -u influxdb`

Enterprise console: `journalctl -u influx-enterprise`

The `journalctl` output can be redirected to print the logs to a text file. With systemd, log retention depends on the system's journald settings.

## Why am I seeing a `503 Service Unavailable` error in my meta node logs?

This is the expected behavior if you haven't joined the meta node to the
cluster.
The `503` errors should stop showing up in the logs once you
[join the meta node to the cluster](/enterprise_influxdb/v1.9/install-and-deploy/installation/meta_node_installation/#step-3-join-the-meta-nodes-to-the-cluster).

## Why am I seeing a `409` error in some of my data node logs?

When you create a
[Continuous Query (CQ)](/enterprise_influxdb/v1.9/concepts/glossary/#continuous-query-cq)
on your cluster, every data node will ask for the CQ lease.
Only one data node can accept the lease.
That data node will have a `200` in its logs.
All other data nodes will be denied the lease and have a `409` in their logs.
This is the expected behavior.

Log output for a data node that is denied the lease:
```
[meta-http] 2016/09/19 09:08:53 172.31.4.132 - - [19/Sep/2016:09:08:53 +0000] GET /lease?name=continuous_querier&node_id=5 HTTP/1.2 409 105 - InfluxDB Meta Client b00e4943-7e48-11e6-86a6-000000000000 380.542µs
```
Log output for the data node that accepts the lease:
```
[meta-http] 2016/09/19 09:08:54 172.31.12.27 - - [19/Sep/2016:09:08:54 +0000] GET /lease?name=continuous_querier&node_id=0 HTTP/1.2 200 105 - InfluxDB Meta Client b05a3861-7e48-11e6-86a7-000000000000 8.87547ms
```

## Why am I seeing `hinted handoff queue not empty` errors in my data node logs?

```
[write] 2016/10/18 10:35:21 write failed for shard 2382 on node 4: hinted handoff queue not empty
```

This error is informational only and does not necessarily indicate a problem in the cluster. It indicates that the node handling the write request currently has data in its local [hinted handoff](/enterprise_influxdb/v1.9/concepts/clustering/#hinted-handoff) queue for the destination node. Coordinating nodes will not attempt direct writes to other nodes until the hinted handoff queue for the destination node has fully drained. New data is instead appended to the hinted handoff queue. This helps data arrive in chronological order for consistency of graphs and alerts and also prevents unnecessary failed connection attempts between the data nodes. Until the hinted handoff queue is empty, this message will continue to display in the logs. Monitor the size of the hinted handoff queues with `ls -lRh /var/lib/influxdb/hh` to ensure that they are decreasing in size.

Note that for some [write consistency](/enterprise_influxdb/v1.9/concepts/clustering/#write-consistency) settings, InfluxDB may return a write error (500) for the write attempt, even if the points are successfully queued in hinted handoff. Some write clients may attempt to resend those points, leading to duplicate points being added to the hinted handoff queue and lengthening the time it takes for the queue to drain. If the queues are not draining, consider temporarily downgrading the write consistency setting, or pause retries on the write clients until the hinted handoff queues fully drain.

## Why am I seeing `error writing count stats ...: partial write` errors in my data node logs?

```
[stats] 2016/10/18 10:35:21 error writing count stats for FOO_grafana: partial write
```

The `_internal` database collects per-node and also cluster-wide information about the InfluxDB Enterprise cluster. The cluster metrics are replicated to other nodes using `consistency=all`. For a [write consistency](/enterprise_influxdb/v1.9/concepts/clustering/#write-consistency) of `all`, InfluxDB returns a write error (500) for the write attempt even if the points are successfully queued in hinted handoff. Thus, if there are points still in hinted handoff, the `_internal` writes will fail the consistency check and log the error, even though the data is in the durable hinted handoff queue and should eventually persist.
## Why am I seeing `queue is full` errors in my data node logs?

This error indicates that the coordinating node that received the write cannot add the incoming write to the hinted handoff queue for the destination node because it would exceed the maximum size of the queue. This error typically indicates a catastrophic condition for the cluster - one data node may have been offline or unable to accept writes for an extended duration.

The controlling configuration settings are in the `[hinted-handoff]` section of the file. `max-size` is the total size in bytes per hinted handoff queue. When `max-size` is exceeded, all new writes for that node are rejected until the queue drops below `max-size`. `max-age` is the maximum length of time a point will persist in the queue. Once this limit has been reached, points expire from the queue. The age is calculated from the write time of the point, not the timestamp of the point.

## Why am I seeing `unable to determine if "hostname" is a meta node` when I try to add a meta node with `influxd-ctl join`?

Meta nodes use the `/status` endpoint to determine the current state of another meta node. A healthy meta node that is ready to join the cluster will respond with a `200` HTTP response code and a JSON string with the following format (assuming the default ports):

`"nodeType":"meta","leader":"","httpAddr":"<hostname>:8091","raftAddr":"<hostname>:8089","peers":null}`

If you are getting an error message while attempting to `influxd-ctl join` a new meta node, it means that the JSON string returned from the `/status` endpoint is incorrect. This generally indicates that the meta node configuration file is incomplete or incorrect. Inspect the HTTP response with `curl -v "http://<hostname>:8091/status"` and make sure that the `hostname`, the `bind-address`, and the `http-bind-address` are correctly populated. Also check the `license-key` or `license-path` in the configuration file of the meta nodes. Finally, make sure that you specify the `http-bind-address` port in the join command, e.g. `influxd-ctl join hostname:8091`.
