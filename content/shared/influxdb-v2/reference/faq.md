
##### Account management {href="account-management-1"}
- [How do I reset my password?](#how-do-i-reset-my-password)
{{% show-in "cloud,cloud-serverless" %}}- [How do I switch between InfluxDB Cloud accounts?](#how-do-i-switch-between-influxdb-cloud-accounts){{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

##### Billing and usage {href="billing-and-usage-1"}
- [How do I manage payment methods?](#how-do-i-manage-payment-methods)
- [Who do I contact for billing issues?](#who-do-i-contact-for-billing-issues)
- [How do I view data my data usage?](#how-do-i-view-data-my-data-usage)
- [How do I increase my organization's rate limits and quotas?](#how-do-i-increase-my-organizations-rate-limits-and-quotas)

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

##### InfluxDB Cloud service health {href="influxdb-cloud-service-health-1"}
- [Where can I see the current status of InfluxDB Cloud?](#where-can-i-see-the-current-status-of-influxdb-cloud)

{{% /show-in %}}

{{% show-in "v2" %}}

##### InfluxDB service health {href="influxdb-service-health-1"}
- [Where can I see the current status of my InfluxDB instance?](#where-can-i-see-the-current-status-of-my-influxdb-instance)

{{% /show-in %}}

##### Security {href="security-1"}
- [What different types of API tokens exist?](#what-different-types-of-api-tokens-exist)
- [Can I use InfluxDB with authentication disabled?](#can-i-use-influxdb-with-authentication-disabled)
{{% show-in "cloud,cloud-serverless" %}}- [Can you change the permission level of members in your organization?](#can-you-change-the-permission-level-of-members-in-your-organization){{% /show-in %}}

##### Administration {href="administration-1"}
{{% show-in "v2" %}}- [How can I identify my InfluxDB version?](#how-can-i-identify-my-influxdb-version){{% /show-in %}}
- [How can I identify the version of Flux I'm using in InfluxDB?](#how-can-i-identify-the-version-of-flux-im-using-in-influxdb)
{{% show-in "v2" %}}- [Where can I find InfluxDB logs?](#where-can-i-find-influxdb-logs){{% /show-in %}}
{{% show-in "v2" %}}- [What is the relationship between shard group durations and retention periods?](#what-is-the-relationship-between-shard-group-durations-and-retention-periods){{% /show-in %}}
- [Why isn't data dropped after I update a bucket's retention period?](#why-isnt-data-dropped-after-i-update-a-buckets-retention-period)

##### Data types {href="data-types-1"}
- [What are the minimum and maximum integers that InfluxDB can store?](#what-are-the-minimum-and-maximum-integers-that-influxdb-can-store)
- [What are the minimum and maximum timestamps that InfluxDB can store?](#what-are-the-minimum-and-maximum-timestamps-that-influxdb-can-store)
- [Can I change a field's data type?](#can-i-change-a-fields-data-type)
{{% show-in "v2" %}}- [How does InfluxDB handle field type discrepancies across shards?](#how-does-influxdb-handle-field-type-discrepancies-across-shards){{% /show-in %}}

##### Writing data {href="writing-data"}
- [How do I write integer and unsigned integer field values?](#how-do-i-write-integer-and-unsigned-integer-field-values)
- [How does InfluxDB handle duplicate points?](#how-does-influxdb-handle-duplicate-points)
- [What newline character does the InfluxDB write API require?](#what-newline-character-does-the-influxdb-write-api-require)
- [When should I single quote and when should I double quote when writing data?](#when-should-i-single-quote-and-when-should-i-double-quote-when-writing-data)
- [Does the precision of the timestamp matter?](#does-the-precision-of-the-timestamp-matter)
{{% show-in "v2" %}}- [What are the configuration recommendations and schema guidelines for writing sparse, historical data?](#what-are-the-configuration-recommendations-and-schema-guidelines-for-writing-sparse-historical-data){{% /show-in %}}

##### Querying data {href="querying-data-1"}
- [Flux](#flux)
    - [How do I structure fields as columns (like InfluxQL)?](#how-do-i-structure-fields-as-columns-like-influxql)
    - [How can I derive a state from multiple field values?](#how-can-i-derive-a-state-from-multiple-field-values)
- [InfluxQL](#influxql)
    {{% show-in "cloud,cloud-serverless" %}}- [How do I use InfluxQL with InfluxDB Cloud?](#how-do-i-use-influxql-with-influxdb-cloud){{% /show-in %}}
    {{% show-in "v2" %}}- [How do I use InfluxQL with InfluxDB v2.x?](#how-do-i-use-influxql-with-influxdb-v2x){{% /show-in %}}
    - [How do I perform mathematical operations in an InfluxQL function?](#how-do-i-perform-mathematical-operations-in-an-influxql-function)
    - [Why does my query return epoch 0 as the timestamp?](#why-does-my-query-return-epoch-0-as-the-timestamp)
    - [Which InfluxQL functions support nesting?](#which-influxql-functions-support-nesting)
    - [What determines the time intervals returned by `GROUP BY time()` queries?](#what-determines-the-time-intervals-returned-by-group-by-time-queries)
    - [Why do my queries return no data or partial data?](#why-do-my-queries-return-no-data-or-partial-data)
    - [Why don't my `GROUP BY time()` queries return timestamps that occur after `now()`?](#why-dont-my-group-by-time-queries-return-timestamps-that-occur-after-now)
    - [Can I perform mathematical operations against timestamps?](#can-i-perform-mathematical-operations-against-timestamps)
    - [Can I identify write precision from returned timestamps?](#can-i-identify-write-precision-from-returned-timestamps)
    - [When should I use single quote versus double quotes in a query?](#when-should-i-use-single-quote-versus-double-quotes-in-a-query)
    - [Why is my query with a `WHERE OR` time clause returning empty results?](#why-is-my-query-with-a-where-or-time-clause-returning-empty-results)
    - [Why does `fill(previous)` return empty results?](#why-does-fillprevious-return-empty-results)
    - [How do I query data with an identical tag key and field key?](#how-do-i-query-data-with-an-identical-tag-key-and-field-key)
    - [How do I query data across measurements?](#how-do-i-query-data-across-measurements)
    - [Does the order timestamps in a query matter?](#does-the-order-timestamps-in-a-query-matter)
    - [How do I query data by a tag with a null value?](#how-do-i-query-data-by-a-tag-with-a-null-value)
{{% show-in "cloud,cloud-serverless" %}}- [Why am I getting the error, "total duration of queries in the last 30s exceeds limit of 25m0s"?](#why-am-i-getting-the-error-total-duration-of-queries-in-the-last-30s-exceeds-limit-of-25m0s){{% /show-in %}}

##### Deleting data {href="deleting-data"}
- [Can I delete a field?](#can-i-delete-a-field)
- [Can I delete a measurement?](#can-i-delete-a-measurement)
- [Can I delete multiple measurements at the same time?](#can-i-delete-multiple-measurements-at-the-same-time)
- [Do I need to verify that data is deleted?](#do-i-need-to-verify-that-data-is-deleted)

##### InfluxDB tasks {href="influxdb-tasks-1"}
- [How does retrying a task affect relative time ranges?](#how-does-retrying-a-task-affect-relative-time-ranges)

##### Series and series cardinality {href="series-and-series-cardinality-1"}
- [What is series cardinality?](#what-is-series-cardinality)
- [Why does series cardinality matter?](#why-does-series-cardinality-matter)
{{% show-in "v2" %}}- [How do I remove series from the index?](#how-do-i-remove-series-from-the-index){{% /show-in %}}

---

## Account management

#### How do I reset my password?

{{% show-in "cloud,cloud-serverless" %}}

Use the **Forgot Password** link on the InfluxDB Cloud login page to update your
password. For more information, see
[Change your password](/influxdb/cloud/account-management/change-password/).

{{% /show-in %}}

{{% show-in "v2" %}}

Use the [`influx` CLI](/influxdb/version/reference/cli/influx/) and the
[`influx user password` command](/influxdb/version/reference/cli/influx/user/password/)
command to update a user's password.
For more information, see
[Change your password](/influxdb/version/admin/users/change-password/).

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

#### How do I switch between InfluxDB Cloud accounts?
Use the **Switch Accounts** functionality in your InfluxDB Cloud account settings
to switch between InfluxDB Cloud accounts.
For more information, see [Switch InfluxDB Cloud accounts](/influxdb/cloud/account-management/switch-account/).

---

## Billing and usage

#### How do I manage payment methods?
- If you subscribed to InfluxDB Cloud through InfluxData, you can manage payment
  methods in the [Billing section](https://cloud2.influxdata.com/me/billing) of
  your InfluxDB Cloud account.
- If you subscribed to InfluxDB Cloud through a cloud provider marketplace
  (**AWS Marketplace**,  **Azure Marketplace**, or **GCP Marketplace**),
  use your cloud provider's billing administration to manage payment methods.
  
For more information, see [Manage InfluxDB Cloud billing](/influxdb/cloud/account-management/billing/).

#### Who do I contact for billing issues?
For billing issues, please [contact InfluxData support](https://support.influxdata.com/s/contactsupport).

#### How do I view data my data usage?
To view your InfluxDB Cloud organization's data usage, view the [Usage page](https://cloud2.influxdata.com/me/usage)
in the InfluxDB Cloud user interface. For more information, see
[View InfluxDB Cloud data usage](/influxdb/cloud/account-management/data-usage/).

#### How do I increase my organization's rate limits and quotas?
- If using the InfluxDB Cloud [Free Plan](/influxdb/cloud/account-management/pricing-plans/#free-plan),
  for increased rate limits and quotas, upgrade to a
  [Usage-Based](/influxdb/cloud/account-management/pricing-plans/#usage-based-plan)
  or [Annual Plan](/influxdb/cloud/account-management/pricing-plans/#annual-plan).
- If using a **Usage-Based** or **Annual** Plan, [contact InfluxData support](https://support.influxdata.com/s/contactsupport)
  and request rate limit and quota adjustments.

{{% /show-in %}}

---

{{% show-in "cloud,cloud-serverless" %}}

## InfluxDB Cloud service health

#### Where can I see the current status of InfluxDB Cloud?
InfluxDB Cloud regions and underlying services are monitored at all times.
To see the current status of InfluxDB Cloud, view the [InfluxDB Cloud status page](https://status.influxdata.com).
To receive outage alerts and updates, subscribe to our status page.

{{% /show-in %}}

{{% show-in "v2" %}}

## InfluxDB service health

#### Where can I see the current status of my InfluxDB instance?
InfluxDB {{< current-version >}} provides different ways to monitor its status:

- The [`/health` API endpoint](/influxdb/version/api/#tag/Health) returns a JSON
  body with a summary of the current status of your InfluxDB instance.

{{% expand-wrapper %}}
{{% expand "View example health summary" %}}
```
{
    "name": "influxdb",
    "message": "ready for queries and writes",
    "status": "pass",
    "checks": [],
    "version": "{{< latest-patch >}}",
    "commit": "xx00x0x000"
}
```
{{% /expand %}}
{{% /expand-wrapper %}}

- The [`/metrics` API endpoint](/influxdb/version/api/#tag/Metrics) provides internal
  InfluxDB metrics in Prometheus exposition format. Use [Telegraf](/telegraf/v1/),
  [InfluxDB scrapers](/influxdb/version/write-data/no-code/scrape-data/), or the Flux
  [`prometheus.scrape()` function](/flux/v0/stdlib/experimental/prometheus/scrape/)
  to scrape these metrics and store them in InfluxDB where you can monitor and
  alert on any anomalies.

  You can also use the [InfluxDB Open Source (OSS) Metrics template](https://github.com/influxdata/community-templates/tree/master/influxdb2_oss_metrics)
  quickly setup InfluxDB OSS monitoring.

  For more information, see [Monitor InfluxDB OSS using a template](/influxdb/version/monitor-alert/templates/monitor/)

{{% /show-in %}}

---

## Security

#### What different types of API tokens exist?
InfluxDB {{< current-version >}} supports the following token types:

{{% show-in "v2" %}}- Operator tokens{{% /show-in %}}
- All Access tokens
{{% show-in "cloud,cloud-serverless" %}}- Custom tokens{{% /show-in %}}
{{% show-in "v2" %}}- Read/Write tokens{{% /show-in %}}

For more information about each token type, see [Manage API tokens](/influxdb/version/admin/tokens/).

#### Can I use InfluxDB with authentication disabled?
InfluxDB {{< current-version >}} enforces security best practices by requiring
API requests to be authenticated. Authentication cannot be disabled.

{{% show-in "cloud,cloud-serverless" %}}

#### Can you change the permission level of members in your organization?
InfluxDB Cloud has only one permission level for users: Owner.
With Owner permissions, a user can delete resources and other users from your organization.
Take care when inviting a user.

{{% /show-in %}}

---

## Administration

{{% show-in "v2" %}}

#### How can I identify my InfluxDB version?

Use one of the following methods to identify the version of InfluxDB OSS you're using:

- **Use the InfluxDB UI**:
  - On the user login page
  - In the right column of the main landing page

- **Use the `influxd version` command**

    ```bash
    $ influxd version

    InfluxDB {{< latest-patch >}} (git: x0x000xx0x) build_date: YYYY-MM-DDThh:mm:ssZ
    ```

- **Use the `/health` API endpoint**.

    The following example uses [`jq`](https://stedolan.github.io/jq/) to process the
    JSON body returned from the `/health` API endpoint and extract the InfluxDB version.
    You don't have to process the JSON with `jq`. For an example of the JSON 
    returned by the `/health` endpoint, see [View example health summary](#view-example-health-summary).

    ```bash
    $ curl -s http://localhost:8086/health | jq -r '.version'

    {{< latest-patch >}}
    ```

{{% /show-in %}}

#### How can I identify the version of Flux I'm using in InfluxDB?
For information about what versions of Flux are packaged with official InfluxDB
releases, see [Flux versions in InfluxDB](/flux/v0/influxdb-versions/).

If using a custom build, use the following query to return the current version
of Flux being used:

```js
import "array"
import "runtime"

array.from(rows: [{version: runtime.version()}])
```

For more information, see [Query the Flux version](/influxdb/cloud/query-data/flux/flux-version/).

{{% show-in "v2" %}}

#### Where can I find InfluxDB logs?
All InfluxDB logs are output by the `influxd` service.
To store logs to a file, pipe the output of `influxd` to a file. For example:

```
influxd 2>~/path/to/influxd-errors.log
```

#### What is the relationship between shard group durations and retention periods?
InfluxDB buckets store data in shard groups.
A single shard group covers a specific time interval.
InfluxDB determines that time interval by using the retention period of the bucket.
The table below outlines the default relationship between the bucket retention
period and the time interval of a shard group:

| Bucket retention period     | Default shard group duration |
| :-------------------------- | ---------------------------: |
| less than 2 days            |                           1h |
| between 2 days and 6 months |                           1d |
| greater than 6 months       |                           7d |

For more information, see [InfluxDB Shards and shard groups](/influxdb/version/reference/internals/shards/).

{{% /show-in %}}

#### Why isn't data dropped after I update a bucket's retention period?
Below are reasons why data may not be dropped immediately after updating
the retention period of a bucket:

- **The retention enforcement service runs {{% show-in "cloud,cloud-serverless" %}}hourly{{% /show-in %}}{{% show-in "v2" %}}every 30 minutes (by default){{% /show-in %}}**.
  You may need to wait for the next retention enforcement cycle to run.

{{% show-in "v2" %}}- 

  **InfluxDB drops shard groups, not individual points**.
  Shard groups cover a specific time interval assigned to the shard group on creation.
  The retention service will only delete a shard group when the entire time
  range covered by the shard group is beyond the bucket retention period.

  If the bucket's new retention period is less than the old shard group duration
  and InfluxDB is currently writing data to the old, longer shard group, the
  the retention service will not drop old shard group until its assigned
  interval is fully expired.

  {{% /show-in %}}

For more information, see [Data retention](/influxdb/version/reference/internals/data-retention/).

<!-{{% show-in "cloud,cloud-serverless" %}}- 

#### How do I get a backup of my data?

{{% /show-in %}} -->

---

## Data types

#### What are the minimum and maximum integers that InfluxDB can store?
InfluxDB stores all integers as signed 64bit integers.

**Minimum integer**: `-9223372036854775808`  
**Maximum integer**: `9223372036854775807`  

Values close to but within those limits may lead to unexpected behavior.
Some query operations convert 64bit integers to 64bit float values 
which can cause overflow issues.

#### What are the minimum and maximum timestamps that InfluxDB can store?
InfluxDB uses 64bit integers to represent Unix nanosecond timestamps.

**Minimum timestamp**: `-9223372036854775806` or `1677-09-21T00:12:43.145224194Z`  
**Maximum timestamp**:  `9223372036854775806` or `2262-04-11T23:47:16.854775806Z`  

Timestamps outside that range return a parsing error.

#### Can I change a field's data type?
[Flux type-conversion functions](/flux/v0/function-types/#type-conversions) let
you change a fields data type at query time.
However, you cannot change the type of a field on disk.
Below are some possible workarounds:

- **Copy a field to a new field as a different type.**
    The example below does the following:
  
    - Queries the `example-string-field`.
    - Converts field values to booleans.
    - Changes the field name to `example-boolean-field`.
    - Writes the new field to the source bucket.

    ```javascript
    from(bucket: "example-bucket")
        |> range(start: -30d)
        |> filter(fn: (r) => r._measurement == "exampled-measurement")
        |> filter(fn: (r) => r._field == "example-string-field")
        |> toBool()
        |> set(key: "_field", value: "example-boolean-field")
        |> to(bucket: "example-bucket")
    ```

- **Copy a field to a new bucket as a different type.**
    The example below does the following:
  
    - Queries the `example-int-field` from the `example-bucket-1` bucket.
    - Converts field values to float values.
    - Changes the field name to `example-float-field`.
    - Writes the new field to the `example-bucket-2` bucket.

    ```javascript
    from(bucket: "example-bucket-1")
        |> range(start: -30d)
        |> filter(fn: (r) => r._measurement == "exampled-measurement")
        |> filter(fn: (r) => r._field == "example-int-field")
        |> toFloat()
        |> set(key: "_field", value: "example-float-field")
        |> to(bucket: "example-bucket-2")
    ```

#### How does InfluxDB handle field type discrepancies across shards?

Field values can be floats, integers, strings, or Booleans.
Field value types cannot differ within a
[shard](/enterprise_influxdb/v1/concepts/glossary/#shard), but they can [differ](/enterprise_influxdb/v1/write_protocols/line_protocol_reference) across shards.

The
[`SELECT` statement](/enterprise_influxdb/v1/query_language/explore-data/#the-basic-select-statement)
returns all field values **if** all values have the same type.
If field value types differ across shards, InfluxDB first performs any
applicable [cast](/enterprise_influxdb/v1/query_language/explore-data/#cast-operations)
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
```sql
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
```sql
SELECT "my_field"::float,"my_field"::integer,"my_field"::string,"my_field"::boolean FROM just_my_type

name: just_my_type
------------------
time			               my_field	 my_field_1	 my_field_2		 my_field_3
2016-06-03T15:45:00Z	 9.87034	  9
2016-06-03T16:45:00Z	 7	        7
2016-06-03T17:45:00Z			                     a string
2016-06-03T18:45:00Z					                                true
```

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

---

## Writing data

#### How do I write integer and unsigned integer field values?

In line protocol, identify **integers** with a trailing `i` and **unsigned integers**
with a trailing `u`. Without these, numeric field values are parsed as floats.

```sh
# Integer
value=100i

# Unsigned integer
value=100u

# Float
value=100
```

#### How does InfluxDB handle duplicate points?

InfluxDB uniquely identifies a point by its **measurement**, **tag set**, and **timestamp**.
If you submit a new point with the same measurement, tag set, and timestamp as
an existing point, InfluxDB unions the old field with the new field set, and
any ties go to the new field set.

For more information, see [Handle duplicate data points](/influxdb/version/write-data/best-practices/duplicate-points/).

#### What newline character does the InfluxDB write API require?

InfluxDB line protocol relies on line feed (`\n`, which is ASCII `0x0A`) to
indicate the end of one line and the beginning of a new line.
Files or data that use a newline character other than `\n` will result in errors
similar to `bad timestamp` or `unable to parse`.

{{% note %}}
##### Windows newlines
Windows uses carriage return and line feed (`\r\n`) as the newline character which
will result in an error if you manually write line protocol on a Windows machine.
Strip out any carriage returns (`\r`) before submitting the line protocol to the
InfluxDB write API.
{{% /note %}}

#### When should I single quote and when should I double quote when writing data?

Line protocol quote usage guidelines are provided in the
[line protocol documentation](/influxdb/cloud/reference/syntax/line-protocol/#quotes).

#### Does the precision of the timestamp matter?

Yes. Timestamp precision affects ingest performance.
The more precise the timestamp, the longer it takes to write the point.
To maximize performance, use the coarsest possible timestamp precision when
writing data to InfluxDB. However, if too coarse, you risk writing points from
the same series with the same timestamp, which would be treated as
[duplicate points](/influxdb/version/write-data/best-practices/duplicate-points/).

{{% show-in "v2" %}}

#### What are the configuration recommendations and schema guidelines for writing sparse, historical data?

For sparse historical data, we recommend:

- **Use a longer [shard group duration](/influxdb/version/reference/internals/shards/#shard-group-duration)
  on the bucket you're writing historical data to.**
  Historical shard group durations can and should cover several years.
  If your historical data spans many years, but your bucket's shard group duration
  is 1 week, InfluxDB will create many shards, negatively affecting overall performance.

- **Temporarily lower the
  [`storage-cache-snapshot-write-cold-duration` configuration setting](/influxdb/version/reference/config-options/#storage-cache-snapshot-write-cold-duration)
  while ingesting historical data**.
  The default setting (`10m`) can cause the system cache all of your data for every shard.
  Temporarily lowering the `storage-cache-snapshot-write-cold-duration` setting
  to `10s` while you write the historical data makes the process more efficient.

{{% /show-in %}}

---

## Querying data

### Flux

#### How do I structure fields as columns (like InfluxQL)?
A `SELECT` statement in InfluxQL returns data with a column for each queried tag and field.
The Flux [`from()`](/flux/v0/stdlib/influxdata/influxdb/from/) function returns
data with a column for each tag as well as a `_field` column that contains the
field key. Each field is grouped into a different table.

To structure each field as a column, use either [`pivot()`](/flux/v0/stdlib/universe/pivot/)
or [`schema.fieldsAsCols()`](/flux/v0/stdlib/influxdata/influxdb/schema/fieldsascols/).

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[pivot()](#)
[schema.fieldsAsCols](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
exampleData
    |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
import "influxdata/influxdb/schema"

exampleData
    |> schema.fieldsAsCols()
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

###### Example data returned by from()
| _measurement | sensor_id | location  | _field | _time                | _value |
| :----------- | :-------- | :-------- | :----- | :------------------- | -----: |
| machine      | abc123    | station20 | temp   | 2022-01-01T00:00:00Z |  150.1 |
| machine      | abc123    | station20 | temp   | 2022-01-01T00:00:10Z |  152.8 |
| machine      | abc123    | station20 | temp   | 2022-01-01T00:00:20Z |  153.3 |

| _measurement | sensor_id | location  | _field | _time                | _value |
| :----------- | :-------- | :-------- | :----- | :------------------- | -----: |
| machine      | abc123    | station20 | flow   | 2022-01-01T00:00:00Z |   12.2 |
| machine      | abc123    | station20 | flow   | 2022-01-01T00:00:10Z |   14.9 |
| machine      | abc123    | station20 | flow   | 2022-01-01T00:00:20Z |   16.1 |

###### Example pivoted data
| _measurement | sensor_id | location  | _time                |  temp | flow |
| :----------- | :-------- | :-------- | :------------------- | ----: | ---: |
| machine      | abc123    | station20 | 2022-01-01T00:00:00Z | 150.1 | 12.2 |
| machine      | abc123    | station20 | 2022-01-01T00:00:10Z | 152.8 | 14.9 |
| machine      | abc123    | station20 | 2022-01-01T00:00:20Z | 153.3 | 16.1 |

#### How can I derive a state from multiple field values?
To compare multiple field values and derive a state:

1.  Query all fields necessary to derive a state.
1.  Use `pivot()` or `schema.fieldsAsCols()` to pivot fields into columns.
2.  Use `map()` to iterate over each input row assign a new column value based
    on values in the field columns.
    
    The `fn` parameter of `map()` defines a
    functions that outputs a record for each input row. Use conditional
    logic to assign a state.

```js
from(bucket: "example-bucket")
    |> range(start: -1h)
    |> filter(fn: (r) => r._measurement == "example-measurement")
    |> filter(fn: (r) => r._field == "field1" or r._field == "field2")
    |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
    |> map(
        fn: (r) =>
            ({r with state:
                    if r.field1 > 90 and r.field2 < 10 then
                        "critical"
                    else if r.field1 > 70 and r.field2 < 30 then
                        "warning"
                    else if r.field1 > 40 and r.field2 < 60 then
                        "info"
                    else
                        "ok",
            }),
    )
```

### InfluxQL

{{% show-in "cloud,cloud-serverless" %}}

#### How do I use InfluxQL with InfluxDB Cloud?

{{% /show-in %}}

{{% show-in "v2" %}}

#### How do I use InfluxQL with InfluxDB v2.x?

{{% /show-in %}}

Using InfluxQL with InfluxDB {{< current-version >}} is made possible by the
[1.x compatibility API](/influxdb/version/reference/api/influxdb-1x/) which replicates
the `/query` endpoint from InfluxDB 1.x. This allows all InfluxDB 1.x-compatible
clients to work with InfluxDB {{< current-version >}}. However, InfluxQL relies
on a database and retention policy data model doesn't exist in InfluxDB
{{< current-version >}}, but has been replaced by [buckets](/influxdb/version/reference/glossary/#bucket).

InfluxDB {{< current-version >}} lets you map unique database and retention 
policy combinations used in InfluxQL to specific buckets using DBRP mappings.

For detailed instructions on using InfluxQL with InfluxDB {{< current-version >}}
and configuring DBRP mapping, see [Query with InfluxQL](/influxdb/version/query-data/influxql/).

#### How do I perform mathematical operations in an InfluxQL function?
InfluxQL does not support mathematical operations within functions.
Use a [subquery](/influxdb/v1/query_language/explore-data/#subqueries) to perform
the mathematical calculation.

For example, InfluxQL does not support the following syntax:

```sql
SELECT MEAN("dogs" - "cats") from "pet_daycare"
```

Instead, use a subquery to get the same result:

```sql
SELECT MEAN("difference") FROM (SELECT "dogs" - "cat" AS "difference" FROM "pet_daycare")
```

#### Why does my query return epoch 0 as the timestamp?
In InfluxQL, epoch 0 (`1970-01-01T00:00:00Z`) is often used as a null timestamp equivalent.
If you request a query that has no timestamp to return, such as an aggregation
function with an unbounded time range, InfluxDB returns epoch 0 as the timestamp.

#### Which InfluxQL functions support nesting?
The following InfluxQL functions support nesting:

- [`COUNT()`](/influxdb/v1/query_language/functions/#count) with [`DISTINCT()`](/influxdb/v1/query_language/functions/#distinct)
- [`CUMULATIVE_SUM()`](/influxdb/v1/query_language/functions/#cumulative-sum)
- [`DERIVATIVE()`](/influxdb/v1/query_language/functions/#derivative)
- [`DIFFERENCE()`](/influxdb/v1/query_language/functions/#difference)
- [`ELAPSED()`](/influxdb/v1/query_language/functions/#elapsed)
- [`MOVING_AVERAGE()`](/influxdb/v1/query_language/functions/#moving-average)
- [`NON_NEGATIVE_DERIVATIVE()`](/influxdb/v1/query_language/functions/#non-negative-derivative)
- [`HOLT_WINTERS()`](/influxdb/v1/query_language/functions/#holt-winters) and [`HOLT_WINTERS_WITH_FIT()`](/influxdb/v1/query_language/functions/#holt-winters)

For information on how to use subqueries as substitutes for nested functions, see
[InfluxQL data exploration](/influxdb/v1/query_language/explore-data/#subqueries).

#### What determines the time intervals returned by `GROUP BY time()` queries?
The time intervals returned by `GROUP BY time()` queries conform to the InfluxDB
database's preset time windows or to the user-specified
[offset interval](/influxdb/v1/query_language/explore-data/#advanced-group-by-time-syntax).

###### Preset time windows
For example, the following query calculates the average value of `sunflowers` between
6:15pm and 7:45pm and groups those averages into one hour intervals:

```sql
SELECT mean("sunflowers")
FROM "flower_orders"
WHERE time >= '2016-08-29T18:15:00Z' AND time <= '2016-08-29T19:45:00Z' GROUP BY time(1h)
```

InfluxQL uses the duration specified in the `GROUP BY time()` clause to partition
data based on time. Preset time window boundaries fall on the duration unit specified.

For example:

| GROUP BY time() duration | Resulting window boundaries                    |
| :----------------------- | :--------------------------------------------- |
| 1s                       | 00:00:00 - 00:00:01, 00:00:01 - 00:00:02, etc. |
| 1m                       | 00:00:00 - 00:01:00, 00:01:00 - 00:02:00, etc. |
| 5m                       | 00:00:00 - 00:05:00, 00:05:00 - 00:10:00, etc. |
| 1h                       | 00:00:00 - 01:00:00, 01:00:00 - 02:00:00, etc. |

Although window boundaries may fall outside of the queried time range, only
points within the queried time range are used in the calculation for each window.

###### Offset time windows
As another example, the following query calculates the average value of
`sunflowers` between 6:15pm and 7:45pm and groups those averages into one hour intervals.
It offsets the InfluxDB database's preset time windows by `15` minutes.

```sql
SELECT mean("sunflowers")
FROM "flower_orders"
WHERE time >= '2016-08-29T18:15:00Z' AND time <= '2016-08-29T19:45:00Z' GROUP BY time(1h,15m)
                                                                                         ---
                                                                                          |
                                                                                   offset interval
```

InfluxQL uses the duration and offset specified in the `GROUP BY time()` clause to partition
data based on time. Time boundaries begin at the specified offset.

For example:

| GROUP BY time() duration and offset | Resulting window boundaries                    |
| :---------------------------------- | :--------------------------------------------- |
| 1m,30s                              | 00:30:00 - 01:30:00, 01:30:00 - 02:30:00, etc. |
| 5m,15s                              | 00:00:15 - 00:05:15, 00:05:15 - 00:10:15, etc. |
| 1h,20m                              | 00:20:00 - 01:20:00, 01:20:00 - 02:20:00, etc. |

#### Why do my queries return no data or partial data?

The most common reasons why your query returns no data or partial data:

- [Querying the wrong retention policy](#querying-the-wrong-retention-policy) (no data returned)
- [No field key in the SELECT clause](#no-field-key-in-the-select-clause) (no data returned)
- [SELECT query includes `GROUP BY time()`](#select-query-includes-group-by-time) (partial data before `now()` returned)
- [Tag and field key with the same name](#tag-and-field-key-with-the-same-name)

##### Querying the wrong retention policy

InfluxDB automatically queries data in a database’s default retention policy
(configured as part of a [DBRP mapping](/influxdb/version/query-data/influxql/)).
If your data is associated another retention policy, you must specify the correct
retention policy to get results.

##### No field key in the SELECT clause

An InfluxQL query requires at least one **field key** in the `SELECT` clause.
If the `SELECT` clause includes only **tag keys**, the query returns an empty response.
For more information, see
[InfluxQL Data exploration](/influxdb/v1/query_language/explore-data/#common-issues-with-the-select-statement).

##### SELECT query includes `GROUP BY time()`

If your `SELECT` query includes a [`GROUP BY time()` clause](/influxdb/v1/query_language/explore-data/#group-by-time-intervals),
only data points between `1677-09-21 00:12:43.145224194` and
[`now()`](/influxdb/v1/concepts/glossary/#now) are returned.
If any of your data points occur after `now()`, specify
[an alternative upper bound](/influxdb/v1/query_language/explore-data/#time-syntax)
in your time interval.

##### Tag and field key with the same name

Avoid using the same name for a tag and field key.
If you inadvertently add the same name for a tag and field key, and then query
both together, the query results show the second key queried (tag or field)
appended with `_1`. To query a tag or field key appended with `_1`,
you **must drop** the appended `_1` **and include** the syntax `::tag` or `::field`.
For example:

```sql
-- Query duplicate keys using the correct syntax
SELECT "leaves"::tag, "leaves"::field FROM db.rp."grape"

name: grape
time                leaves     leaves_1
----                --------   ----------
1574128162128468000 species    6.00
1574128238044155000            5.00
```

#### Why don't my `GROUP BY time()` queries return timestamps that occur after `now()`?

`SELECT` statements without a time range defined in the `WHERE` clause have a
default time range of `1677-09-21 00:12:43.145224194` to `2262-04-11T23:47:16.854775806Z` UTC.
For `SELECT` statements that don't specify a time range but have a
[`GROUP BY time()` clause](/influxdb/v1/query_language/explore-data/#group-by-time-intervals),
the default time range is `1677-09-21 00:12:43.145224194` UTC to [`now()`](/influxdb/version/reference/glossary/#now).

To query data with timestamps that occur after `now()`, `SELECT` statements with
a `GROUP BY time()` clause must provide an alternative **upper** bound in the
[`WHERE` clause](/influxdb/version/query-data/influxql/explore-data/where/).
For example:

```sql
SELECT MEAN("boards") FROM "hillvalley"
WHERE time >= '2022-01-01T00:00:00Z' AND time <= now() + 10d
GROUP BY time(12m) fill(none)
```

Note that the `WHERE` clause must provide an alternative **upper** bound to
override the default `now()` upper bound. The following query merely resets
the lower bound to `now()` such that the query's time range is between
`now()` and `now()`:

```sql
SELECT MEAN("boards") FROM "hillvalley"
WHERE time >= now()
GROUP BY time(12m) fill(none)
```

For for more on time syntax in queries, see [InfluxQL data Exploration](/influxdb/v1/query_language/explore-data/#time-syntax).

#### Can I perform mathematical operations against timestamps?

InfluxQL does not support mathematical operators against timestamp values.
Most time calculations must be carried out by the client receiving the query results.

There is limited support for using InfluxQL functions against timestamp values.
The [ELAPSED()](/influxdb/v1/query_language/functions/#elapsed)
function returns the difference between subsequent timestamps in a single field.

#### Can I identify write precision from returned timestamps?

InfluxDB stores all timestamps as nanosecond values, regardless of the write precision supplied.
InfluxQL silently drops trailing zeros from timestamps which obscures the initial write precision.
Because InfluxDB silently drops trailing zeros on returned timestamps, the write
precision is not recognizable in the returned timestamps.

#### When should I use single quote versus double quotes in a query?

Follow these general rules for quotes in InfluxQL queries:

###### Single quotes
- Use to quote literal string values, like tag values.
- Do **not** use on identifiers like database names, retention policy names,
  user names, measurement names, tag keys, and field keys.
- Use on date-time strings.

###### Double quotes
- Use on identifiers that start with a digit, contain characters other than `[A-z,0-9,_]`,
  or that are an [InfluxQL keyword](/influxdb/v1/query_language/spec/#keywords).
  We generally recommend using double quotes on all identifiers, even if they
  don't meet these criteria.
- Do **not** use on date-time strings.


```sql
-- Correctly quote usage

SELECT bikes_available FROM bikes WHERE station_id='9'

SELECT "bikes_available" FROM "bikes" WHERE "station_id"='9'

SELECT MIN("avgrq-sz") AS "min_avgrq-sz" FROM telegraf

SELECT * from "cr@zy" where "p^e"='2'

SELECT "water_level" FROM "h2o_feet" WHERE time > '2015-08-18T23:00:01.232000000Z' AND time < '2015-09-19'

-- Incorrect quote usage

SELECT 'bikes_available' FROM 'bikes' WHERE 'station_id'="9"

SELECT * from cr@zy where p^e='2'

SELECT "water_level" FROM "h2o_feet" WHERE time > "2015-08-18T23:00:01.232000000Z" AND time < "2015-09-19"
```

#### Why is my query with a `WHERE OR` time clause returning empty results?

InfluxQL does not support using `OR` in the `WHERE` clause to specify multiple
time ranges and returns an empty response if multiple are specified.
For example, the following query will return an empty response:

```sql
SELECT * FROM "absolutismus"
WHERE time = '2016-07-31T20:07:00Z' OR time = '2016-07-31T23:07:17Z'
```

#### Why does `fill(previous)` return empty results?

`fill(previous)` doesn't fill a null value if there is no previous value inside
the queried time range.

#### How do I query data with an identical tag key and field key?

Use the `::` syntax to specify if the key is a field key or tag key. For example:

```sql
SELECT * FROM "candied" WHERE "almonds"::field > 51
SELECT * FROM "candied" WHERE "almonds"::tag='true'
```

#### How do I query data across measurements?

InfluxQL does not support querying multiple measurements
All data must be under a single measurement to query it together.
To perform cross-measurement queries,
[use Flux](/influxdb/version/reference/syntax/flux/flux-vs-influxql/#math-across-measurements).

#### Does the order timestamps in a query matter?

No, it doesn't. There is a only a _negligible_ difference between the following queries:

```sql
SELECT ... FROM ... WHERE time > 'timestamp1' AND time < 'timestamp2'
SELECT ... FROM ... WHERE time < 'timestamp2' AND time > 'timestamp1'
```

#### How do I query data by a tag with a null value?

In your `WHERE` clause, specify an empty or null tag value with `''`. For example:

```sql
SELECT * FROM "vases" WHERE priceless=''
```

{{% show-in "cloud,cloud-serverless" %}}

#### Why am I getting the error, "total duration of queries in the last 30s exceeds limit of 25m0s"?

This error indicates you are exceeding the [Total query time global limit](/influxdb/cloud/account-management/limits/#global-limits)
for your organization.
Potential causes include:

- A single long-running query.
- Running too many queries at once.
- A combination of both.

If you are encountering this error due to a single long-running query, the query
and potentially your schema should be analyzed for optimization.
The following resources may help:

- [Optimize Flux queries](/influxdb/cloud/query-data/optimize-queries/)
- [Schema design best practices](/influxdb/cloud/write-data/best-practices/schema-design/)

If you are encountering this error due to the number of concurrent queries,
try delaying or staggering queries so they don't all run at the same time.

{{% /show-in %}}

---

## Deleting data

#### Can I delete a field?

{{% show-in "v2" %}}

No. InfluxDB {{< current-version >}} does not support deleting data by field.

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

Yes. InfluxDB Cloud supports deleting data by field.
Use the `_field` label in your [delete predicate](/influxdb/version/reference/syntax/delete-predicate/)
to identify the field to delete.

```js
_field == "example-field"
```

{{% /show-in %}}

#### Can I delete a measurement?

Yes. InfluxDB {{< current-version >}} supports deleting data by measurement.
Use the `_measurement` label in your [delete predicate](/influxdb/version/reference/syntax/delete-predicate/)
to identify the measurement to delete.

```js
_measurement == "example-measurement"
```

#### Can I delete multiple measurements at the same time?

No. InfluxDB {{< current-version >}} does not support deleting multiple measurements
in a single delete request.
To delete multiple measurements, [issue a delete request](/influxdb/version/write-data/delete-data/)
for each measurement.

#### Do I need to verify that data is deleted?

It is not necessary to verify delete operations once they have been submitted to the queue.
The `/api/v2/delete` endpoint returns a 204 response when the delete request has been added to the queue.
{{% show-in "cloud,cloud-serverless" %}}Because the delete queue executes asynchronously, there isn't a way to accurately
predict when the delete operation will be performed at the storage layer.{{% /show-in %}}

If you wish to verify a delete has occurred, try to query the deleted data.
If the query returns results, the data has not been fully deleted.

---

## InfluxDB tasks

#### How does retrying a task affect relative time ranges?

When you retry a task that uses relative time ranges, it will query the original
time range of the task execution (run).
Whenever a task executes, InfluxDB sets the [`now` option ](/flux/v0/stdlib/universe/#options)
in the task to the scheduled execution time of the task.
When using [`range()`](/flux/v0/stdlib/universe/range/)
or other functions that support relative duration values, these duration values
are relative to [`now()`](/flux/v0/stdlib/universe/now/), which returns the
value of the `now` option. Every task run has a unique `now` option based on
the time the run was scheduled to execute.

---

## Series and series cardinality

#### What is series cardinality?

[Series cardinality](/influxdb/version/reference/glossary/#series-cardinality) is
the total number of unique
{{% show-in "cloud,cloud-serverless" %}}**measurement**, **tag set**, and **field key** combinations{{% /show-in %}}
{{% show-in "v2" %}}**measurement** and **tag set** combinations{{% /show-in %}}
(series) stored on disk and indexed in memory.

#### Why does series cardinality matter?

{{% show-in "v2" %}}

InfluxDB maintains an in-memory index of every [series](/influxdb/version/reference/glossary/#series)\.
As the number of unique series grows, so does the memory usage.
High series cardinality can force the host operating system to kill the InfluxDB
process with an out of memory (OOM) exception.

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

InfluxDB maintains an in-memory index of every [series](/influxdb/version/reference/glossary/#series).
As the number of unique series grows, it can negatively affect query performance.
Each InfluxDB Cloud organization has a series cardinality limit to prevent
runaway cardinality. For information about adjusting cardinality limits, see
[How do I increase my organization’s rate limits and quotas?](#how-do-i-increase-my-organizations-rate-limits-and-quotas).

{{% /show-in %}}

Use [`influxdb.cardinality()`](/flux/v0/stdlib/influxdata/influxdb/cardinality/) in Flux
or [`SHOW SERIES CARDINALITY`](/influxdb/v1/query_language/spec/#show-series-cardinality)
in InfluxQL to measure the series cardinality in a bucket.
See [Resolve high series cardinality](/influxdb/version/write-data/best-practices/resolve-high-cardinality/)
for information about reducing series cardinality.

{{% show-in "v2" %}}

#### How do I remove series from the index?

To remove a series from an index:

1.  Use the **`influx` CLI** or **InfluxDB {{< current-version >}} API** to delete points
    associated with the series. See [Delete data](/influxdb/version/write-data/delete-data/)
    for more information.
2.  Use the [`influxd inspect build-tsi` tool](/influxdb/version/reference/cli/influxd/inspect/build-tsi/)
    to rebuild your index.

{{% /show-in %}}
