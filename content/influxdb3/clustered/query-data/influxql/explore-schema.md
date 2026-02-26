---
title: Explore your schema with InfluxQL
description: >
  Use InfluxQL `SHOW` statements to return information about your data schema.
menu:
  influxdb3_clustered:
    name: Explore your schema
    parent: Query with InfluxQL
    identifier: query-influxql-schema
weight: 201
influxdb3/clustered/tags: [query, influxql]
related:
  - /influxdb3/clustered/reference/influxql/show/
list_code_example: |
  ##### List measurements
  ```sql
  SHOW MEASUREMENTS
  ```

  ##### List field keys in a measurement
  ```sql
  SHOW FIELD KEYS FROM "measurement"
  ```

  ##### List tag keys in a measurement
  ```sql
  SHOW TAG KEYS FROM "measurement"
  ```

  ##### List tag values for a specific tag key
  ```sql
  SHOW TAG VALUES FROM "measurement" WITH KEY = "tag-key" WHERE time > now() - 1d
  ```
---

Use InfluxQL `SHOW` statements to return information about your data schema.

> [!Note]
> 
> #### Sample data
> 
> The following examples use data provided in [sample data sets](/influxdb3/clustered/reference/sample-data/).
> To run the example queries and return identical results, follow the instructions
> provided for each sample data set to write the data to your {{% product-name %}}
> database.

- [List measurements in a database](#list-measurements-in-a-database)
  - [List measurements that contain specific tag key-value pairs](#list-measurements-that-contain-specific-tag-key-value-pairs)
  - [List measurements that match a regular expression](#list-measurements-that-match-a-regular-expression)
- [List field keys in a measurement](#list-field-keys-in-a-measurement)
- [List tag keys in a measurement](#list-tag-keys-in-a-measurement)
  - [List tag keys in measurements that contain a specific tag key-value pair](#list-tag-keys-in-measurements-that-contain-a-specific-tag-key-value-pair)
- [List tag values for a specific tag key](#list-tag-values-for-a-specific-tag-key)
  - [List tag values for multiple tags](#list-tag-values-for-multiple-tags)
  - [List tag values for tags that match a regular expression](#list-tag-values-for-tags-that-match-a-regular-expression)
  - [List tag values associated with a specific tag key-value pair](#list-tag-values-associated-with-a-specific-tag-key-value-pair)

## List measurements in a database

Use [`SHOW MEASUREMENTS`](/influxdb3/clustered/reference/influxql/show/#show-measurements)
to list measurements in your InfluxDB database.

```sql
SHOW MEASUREMENTS
```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

{{% influxql/table-meta %}}
name: measurements
{{% /influxql/table-meta %}}

| name         |
| :----------- |
| bitcoin      |
| home         |
| home_actions |
| numbers      |
| weather      |

{{% /expand %}}
{{< /expand-wrapper >}}

### List measurements that contain specific tag key-value pairs

To return only measurements with specific tag key-value pairs, include a `WHERE`
clause with tag key-value pairs to query for.

```sql
SHOW MEASUREMENTS WHERE room = 'Kitchen'
```

{{< expand-wrapper >}}
{{% expand "View example output" "1" %}}

{{% influxql/table-meta %}}
name: measurements
{{% /influxql/table-meta %}}

| name         |
| :----------- |
| home         |
| home_actions |

{{% /expand %}}
{{< /expand-wrapper >}}

### List measurements that match a regular expression

To return only measurements with names that match a
[regular expression](/influxdb3/clustered/reference/influxql/regular-expressions/),
include a `WITH` clause that compares the `MEASUREMENT` to a regular expression.

```sql
SHOW MEASUREMENTS WITH MEASUREMENT =~ /^home/
```

{{< expand-wrapper >}}
{{% expand "View example output" "2" %}}

{{% influxql/table-meta %}}
name: measurements
{{% /influxql/table-meta %}}

| name         |
| :----------- |
| home         |
| home_actions |

{{% /expand %}}
{{< /expand-wrapper >}}

## List field keys in a measurement

Use [`SHOW FIELD KEYS`](/influxdb3/clustered/reference/influxql/show/#show-field-keys)
to return all field keys in a measurement.
Include a `FROM` clause to specify the measurement.
If no measurement is specified, the query returns all field keys in the database.

```sql
SHOW FIELD KEYS FROM home
```

{{< expand-wrapper >}}
{{% expand "View example output" "3" %}}

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| fieldKey | fieldType |
| :------- | :-------- |
| co       | integer   |
| hum      | float     |
| temp     | float     |

{{% /expand %}}
{{< /expand-wrapper >}}

## List tag keys in a measurement

Use [`SHOW TAG KEYS`](/influxdb3/clustered/reference/influxql/show/#show-field-keys)
to return all tag keys in a measurement.
Include a `FROM` clause to specify the measurement.
If no measurement is specified, the query returns all tag keys in the database.

```sql
SHOW TAG KEYS FROM home_actions
```

{{< expand-wrapper >}}
{{% expand "View example output" "4" %}}

{{% influxql/table-meta %}}
name: home_actions
{{% /influxql/table-meta %}}

| tagKey |
| :----- |
| action |
| level  |
| room   |

{{% /expand %}}
{{< /expand-wrapper >}}

### List tag keys in measurements that contain a specific tag key-value pair

To return all tag keys measurements that contain specific tag key-value pairs,
include a `WHERE` clause with the tag key-value pairs to query for.

```sql
SHOW TAG KEYS WHERE room = 'Kitchen'
```

{{< expand-wrapper >}}
{{% expand "View example output" "5" %}}

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| tagKey |
| :----- |
| room   |

{{% influxql/table-meta %}}
name: home_actions
{{% /influxql/table-meta %}}

| tagKey |
| :----- |
| action |
| level  |
| room   |

{{% /expand %}}
{{< /expand-wrapper >}}

## List tag values for a specific tag key

Use [`SHOW TAG VALUES`](/influxdb3/clustered/reference/influxql/show/#show-field-values)
to return all values for specific tags in a measurement.

- Include a `FROM` clause to specify one or more measurements to query.
- Use the `WITH` clause to compare `KEY` to tag keys to list the values of.
- Use the `WHERE` clause to restrict the search to a specific time range
  (default time range is the last day).

```sql
SHOW TAG VALUES FROM weather WITH KEY = location
```

> [!Note]
> 
> #### Include a FROM clause
> 
> Include a `FROM` clause with the `SHOW TAG VALUES`
> statement that specifies 1-50 tables to query.
> Without a `FROM` clause, the InfluxDB query engine must read data from all
> tables and return unique tag values from each.
> 
> Depending on the number of tables in your database and the number of unique tag
> values in each table, excluding a `FROM` clause can result in poor query performance,
> query timeouts, or unnecessary resource allocation that may affect other queries.

{{< expand-wrapper >}}
{{% expand "View example output" "5" %}}

{{% influxql/table-meta %}}
name: weather
{{% /influxql/table-meta %}}

| key      | value         |
| :------- | :------------ |
| location | Concord       |
| location | Hayward       |
| location | San Francisco |

{{% /expand %}}
{{< /expand-wrapper >}}

### List tag values for multiple tags

To return tag values for multiple specific tag keys, use the `IN` operator in
the `WITH` clause to compare `KEY` to a list of tag keys.

```sql
SHOW TAG VALUES FROM home_actions WITH KEY IN ("level", "action")
```

{{< expand-wrapper >}}
{{% expand "View example output" "6" %}}

{{% influxql/table-meta %}}
name: home_actions
{{% /influxql/table-meta %}}

| key    | value |
| :----- | :---- |
| action | alert |
| action | cool  |
| level  | ok    |
| level  | warn  |

{{% /expand %}}
{{< /expand-wrapper >}}

### List tag values for tags that match a regular expression

To return only tag values from tags keys that match a regular expression, use
regular expression comparison operators in your `WITH` clause to compare `KEY`
to the regular expression.

```sql
SHOW TAG VALUES FROM home, home_actions WITH KEY =~ /oo/
```

{{< expand-wrapper >}}
{{% expand "View example output" "7" %}}

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| key  | value       |
| :--- | :---------- |
| room | Kitchen     |
| room | Living Room |

{{% influxql/table-meta %}}
name: home_actions
{{% /influxql/table-meta %}}

| key  | value       |
| :--- | :---------- |
| room | Kitchen     |
| room | Living Room |

{{% /expand %}}
{{< /expand-wrapper >}}

### List tag values associated with a specific tag key-value pair

To list tag values for tags associated with a specific tag key-value pair:

- Use the `WITH` clause to identify what tag keys to return values for.
- Include a `WHERE` clause that identifies the tag key-value pair to query for.

The following example returns tag values for the `action` and `level` tags for
points where the `room` tag value is `Kitchen`.

```sql
SHOW TAG VALUES FROM home_actions WITH KEY IN ("action", "level") WHERE room = 'Kitchen'
```

{{< expand-wrapper >}}
{{% expand "View example output" "8" %}}

{{% influxql/table-meta %}}
name: home_actions
{{% /influxql/table-meta %}}

| key    | value |
| :----- | :---- |
| action | alert |
| action | cool  |
| level  | ok    |
| level  | warn  |

{{% /expand %}}
{{< /expand-wrapper >}}
