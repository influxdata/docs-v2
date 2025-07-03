
InfluxQL supports using regular expressions when specifying:

- [field keys](/influxdb/version/reference/glossary/#field-key) and [tag keys](/influxdb/version/reference/glossary/#tag-key) in the [`SELECT` clause](/influxdb/version/query-data/influxql/explore-data/select/).
- [measurements](/influxdb/version/reference/glossary/#measurement) in the [`FROM` clause](/influxdb/version/query-data/influxql/explore-data/select/#from-clause).
- [tag values](/influxdb/version/reference/glossary/#tag-value) and string [field values](/influxdb/version/reference/glossary/#field-value) in the [`WHERE` clause](/influxdb/version/query-data/influxql/explore-data/where/).
- [tag keys](/influxdb/version/reference/glossary/#tag-key) in the [`GROUP BY` clause](/influxdb/version/query-data/influxql/explore-data/group-by/)

Regular expressions in InfluxQL only support string comparisons and can only evaluate [fields](/influxdb/version/reference/glossary/#field) with string values.

{{% note %}}
**Note:** Regular expression comparisons are more computationally intensive than exact
string comparisons. Queries with regular expressions are not as performant
as those without.
{{% /note %}}

- [Syntax](#syntax)
- [Examples](#examples)

## Syntax

```sql
SELECT /<regular_expression_field_key>/ FROM /<regular_expression_measurement>/ WHERE [<tag_key> <operator> /<regular_expression_tag_value>/ | <field_key> <operator> /<regular_expression_field_value>/] GROUP BY /<regular_expression_tag_key>/
```

Regular expressions are surrounded by `/` characters and use the
[Go regular expression syntax](http://golang.org/pkg/regexp/syntax/).

## Supported operators

`=~`: matches against
`!~`: doesn't match against

### Examples

<!--test:setup
```bash
service influxdb start && \
influx setup \
  --username USERNAME \
  --token API_TOKEN \
  --org ORG_NAME \
  --bucket BUCKET_NAME \
  --force \
&& curl -L -O \
https://s3.amazonaws.com/noaa.water-database/NOAA_data.txt \
&& influx write --bucket BUCKET_NAME --file NOAA_data.txt --precision=s \
--skipHeader 8
```
-->

{{< expand-wrapper >}}

{{% expand "Use a regular expression to specify field keys and tag keys in the SELECT clause" %}}

```sql
SELECT /l/ FROM "h2o_feet" LIMIT 1
```

<!--test:prevblock
```bash
# If not 200 status, fail
curl -s -o /dev/null -w "%{http_code}" 'http://localhost:8086/query?pretty=true' \
 --header "Authorization: Token API_TOKEN" \
 --data-urlencode "db=BUCKET_NAME" \
 --data-urlencode "rp=autogen" \
 --data-urlencode "q=SELECT /l/ FROM \"h2o_feet\" LIMIT 1" \
 | grep -q "200" || exit 1
```
-->

Output:

{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time | level description | location |  water_level|
| :------------ | :----------------| :--------------| --------------:|
| 2019-08-17T00:00:00Z | below 3 feet | santa_monica |  2.0640000000|

The query selects all field keys and tag keys that include an `l`.
Note that the regular expression in the `SELECT` clause must match at least one
field key in order to return results for a tag key that matches the regular
expression.

Currently, there is no syntax to distinguish between regular expressions for
field keys and regular expressions for tag keys in the `SELECT` clause.
The syntax `/<regular_expression>/::[field | tag]` is not supported.

{{% /expand %}}

{{% expand "Use a regular expression to specify field keys and tag keys in function arguments" %}}

```sql
SELECT MAX(/_level/) FROM "h2o_feet" LIMIT 1
```

<!--test:prevblock
```bash
# If not 200 status, fail
curl -s \
 'http://localhost:8086/query?pretty=true' \
 --header "Authorization: Token API_TOKEN" \
 --data-urlencode "db=BUCKET_NAME" \
 --data-urlencode "rp=autogen" \
 --data-urlencode "q=SELECT MAX(/_level/) FROM \"h2o_feet\"" \
| grep -Fq "\"columns\":[\"time\",\"max_water_level\"]" || exit 1
```
-->

Output:

{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | max_water_level |
| :------------------- | ---------------------:|
| 2019-08-28T07:24:00Z | 9.964

This query uses the InfluxQL [`MAX()` selector function](/influxdb/version/query-data/influxql/functions/selectors/#max)
to find the greatest field value out of all field keys that match the regular expression.

{{% /expand %}}

{{% expand "Use a regular expression to specify measurements in the FROM clause" %}}

```sql
SELECT MEAN("degrees") FROM /temperature/
```

Output:

{{% influxql/table-meta %}}
Name: average_temperature
{{% /influxql/table-meta %}}

| time   | mean |
| :------------------ | ---------------------:|
| 1970-01-01T00:00:00Z | 79.9847293223 |

{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time   | mean |
| :------------------ | ---------------------:|
| 1970-01-01T00:00:00Z | 64.9980273540 |

This query uses the InfluxQL [MEAN() function](/influxdb/version/query-data/influxql/functions/aggregates/#mean) to calculate the average `degrees` for every [measurement](/influxdb/version/reference/glossary/#measurement) in the [NOAA sample data] that contains the word `temperature`.

{{% /expand %}}

{{% expand "Use a regular expression to specify tag values in the WHERE clause" %}}

```sql
SELECT MEAN(water_level) FROM "h2o_feet" WHERE "location" =~ /[m]/ AND "water_level" > 3
```

Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time   | mean |
| :------------------ | ---------------------:|
| 1970-01-01T00:00:00Z | 4.4710766395|

This query uses the InfluxQL [MEAN() function](/influxdb/version/query-data/influxql/functions/aggregates/#mean) to calculate the average `water_level` where the [tag value](/influxdb/version/reference/glossary/#measurement) of `location` includes an `m` and `water_level` is greater than three.

{{% /expand %}}

{{% expand "Use a regular expression to specify a tag with no value in the WHERE clause" %}}

```sql
SELECT * FROM "h2o_feet" WHERE "location" !~ /./
>
```

The query selects all data from the `h2o_feet` measurement where the `location`
[tag](/influxdb/version/reference/glossary/#tag) has no value.
Every data [point](/influxdb/version/reference/glossary/#point) in the [NOAA water sample data](/influxdb/version/reference/sample-data/#noaa-water-sample-data) has a tag value for `location`.
It's possible to perform this same query without a regular expression.
See the [Frequently Asked Questions](/influxdb/version/reference/faq/#how-do-i-query-data-by-a-tag-with-a-null-value)
document for more information.

{{% /expand %}}

{{% expand "Use a regular expression to specify a tag with a value in the WHERE clause" %}}

```sql
SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location" =~ /./
```

Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time   | mean |
| :------------------ | ---------------------:|
| 1970-01-01T00:00:00Z |  4.4418434585|

This query uses the InfluxQL [MEAN() function](/influxdb/version/query-data/influxql/functions/aggregates/#mean) to calculate the average `water_level` across all data with a tag value for `location`.

{{% /expand %}}

{{% expand "Use a regular expression to specify a field value in the WHERE clause" %}}

```sql
SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location" = 'santa_monica' AND "level description" =~ /between/
```

Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time   | mean |
| :------------------ | ---------------------:|
| 1970-01-01T00:00:00Z | 4.4713666916


This query uses the InfluxQL [MEAN() function](/influxdb/version/query-data/influxql/functions/aggregates/#mean)
to calculate the average `water_level` for all data where the field value of `level description` includes the word `between`.

{{% /expand %}}

{{% expand "Use a regular expression to specify tag keys in the GROUP BY clause" %}}

```sql
SELECT FIRST("index") FROM "h2o_quality" GROUP BY /l/
```

Output: 
{{% influxql/table-meta %}}
name: h2o_quality  
tags: location=coyote_creek
{{% /influxql/table-meta %}}

| time | mean |
| :------------------ |-------------------:|
| 2019-08-17T00:00:00Z | 41.0000000000 |


{{% influxql/table-meta %}}
name: h2o_quality  
tags: location=santa_monica
{{% /influxql/table-meta %}}

| time | mean |
| :------------------ |-------------------:|
| 2019-08-17T00:00:00Z | 99.0000000000 |

This query uses the InfluxQL [FIRST() function](/influxdb/version/query-data/influxql/functions/selectors/#first)

to select the first value of `index` for every tag that includes the letter `l`
in its tag key.

{{% /expand %}}

{{< /expand-wrapper >}}
