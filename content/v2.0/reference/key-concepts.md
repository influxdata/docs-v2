---
title: InfluxDB key concepts
description: >
  Concepts related to InfluxData products and platforms.
weight: 7
menu:
  v2_0_ref:
    name: Key concepts
v2.0/tags: [InfluxDB key concepts]
---

Learn the key concepts of InfluxDB 2.0, including:

<table style="width:100%">
  <tr>
    <td><a href="/v2.0/reference/key-concepts/#database">database</a></td>
    <td><a href="/v2.0/reference/key-concepts/#field-key">field key</a></td>
    <td><a href="/v2.0/reference/key-concepts/#field-set">field set</a></td>
  </tr>
  <tr>
    <td><a href="/v2.0/reference/key-concepts/#field-value">field value</a></td>
    <td><a href="/v2.0/reference/key-concepts/#measurement">measurement</a></td>
    <td><a href="/v2.0/reference/key-concepts/#point">point</a></td>
  </tr>
    <tr>
    <td><a href="/v2.0/reference/key-concepts/#retention-policy">retention policy</a></td>
    <td><a href="/v2.0/reference/key-concepts/#series">series</a></td>
    <td><a href="/v2.0/reference/key-concepts/#tag-key">tag key</a></td>
  </tr>
    <tr>
    <td><a href="/v2.0/reference/key-concepts/#tag-set">tag set</a></td>
    <td><a href="/v2.0/reference/key-concepts/#tag-value">tag value</a></td>
    <td><a href="/v2.0/reference/key-concepts/#timestamp">timestamp</a></td>
  </tr>
</table>

To look up a specific term, see the [Glossary](/v2.0/reference/glossary/).

### Sample data

To demonstrate key concepts, we'll use the sample data below: the number of butterflies and honeybees counted by two scientists (`anderson` and `mullen`) in two locations (`1` and `2`) from 12 AM to 6:12 AM on August 18, 2019. This sample data is stored in a bucket `my_bucket` and retained for the duration of the `default` retention policy.

*Hint:* Hover over the links for tooltips<> to get acquainted with InfluxDB terminology and the layout.

| Flag           | Description                 | Input type  |
|:----           |:-----------                 |:----------: |
| `-h`, `--help` | Help for the `find` command |             |
| `-i`, `--id`   | The authorization ID        | string      |
| `-o`, `--org`  | The organization            | string      |
| `--org-id`     | The organization ID         | string      |
| `-u`, `--user` | The user                    | string      |
| `--user-id`    | The user ID                 | string      |

name: <span class="tooltip" data-tooltip-text="Measurement">census</span>  
\-------------------------------------  
time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="tooltip" data-tooltip-text="Field key">butterflies</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="tooltip" data-tooltip-text="Field key">honeybees</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="tooltip" data-tooltip-text="Tag key">location</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="tooltip" data-tooltip-text="Tag key">scientist</span>  
2015-08-18T00:00:00Z&nbsp;&nbsp;&nbsp;12&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;23&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;anderson  
2015-08-18T00:00:00Z&nbsp;&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mullen  
2015-08-18T00:06:00Z&nbsp;&nbsp;&nbsp;11&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;28&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;anderson  
<span class="tooltip" data-tooltip-text="Timestamp">2015-08-18T00:06:00Z</span>&nbsp;&nbsp;&nbsp;<span class="tooltip" data-tooltip-text="Field value">3</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="tooltip" data-tooltip-text="Field value">28</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="tooltip" data-tooltip-text="Tag value">1</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="tooltip" data-tooltip-text="Tag value">mullen</span>  
2015-08-18T05:54:00Z&nbsp;&nbsp;&nbsp;2&nbsp;	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;anderson  
2015-08-18T06:00:00Z&nbsp;&nbsp;&nbsp;1	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;anderson  
2015-08-18T06:06:00Z&nbsp;&nbsp;&nbsp;8	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;23&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mullen  
2015-08-18T06:12:00Z&nbsp;&nbsp;&nbsp;7	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mullen  

### Discussion

InfluxDB is a time series database so it makes sense to start with time.
In the sample data, you'll notice a column called `time`. All data stored in InfluxDB have a `time` column that stores timestamps. <a name="timestamp"></a>**Timestamps** shows the date and time in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) UTC associated with particular data.

The next two columns, `butterflies` and `honeybees`, are fields.
Fields include field keys and field values. The <a name="field-key"></a>**field keys** (`butterflies` and `honeybees`) are strings and store metadata. The field key:

- `butterflies` includes field values `12`-`7`
- `honeybees` includes field values `23`-`22`

<a name="field-value"></a>**Field values** are your data; they can be strings, floats, integers, or Booleans, and, because InfluxDB is a time series database, a field value is always associated with a timestamp.

Field values in the sample data include:

```
12   23
1    30
11   28
3    28
2    11
1    10
8    23
7    22
```

The collection of field-key and field-value pairs make up a <a name="field-set"></a>**field set**. The eight field sets in the sample data:

* `butterflies = 12   honeybees = 23`
* `butterflies = 1    honeybees = 30`
* `butterflies = 11   honeybees = 28`
* `butterflies = 3    honeybees = 28`
* `butterflies = 2    honeybees = 11`
* `butterflies = 1    honeybees = 10`
* `butterflies = 8    honeybees = 23`
* `butterflies = 7    honeybees = 22`

Fields are required in InfluxDB data and are not indexed.
[Queries](/influxdb/v0.10/concepts/glossary/#query) filtering field values must scan all values to match conditions in the query. As a result, queries on fields are not as performant as queries on tags. In general, avoid storing commonly queried metadata in fields.

The last two columns in the sample data, `location` and `scientist`, are tags.
Tags include tag keys and tag values.
Both <a name="tag-key"></a>**tag keys** and <a name="tag-value"></a>**tag values** are stored as strings and record metadata.
The tag keys in the sample data are `location` and `scientist`.
The tag key `location` has two tag values: `1` and `2`.
The tag key `scientist` also has two tag values: `anderson` and `mullen`.

In the data above, the <a name="tag-set"></a>**tag set** is the different combinations of all the tag key-value pairs.
The four tag sets in the sample data are:

* `location = 1`, `scientist = anderson`
* `location = 2`, `scientist = anderson`
* `location = 1`, `scientist = mullen`
* `location = 2`,  `scientist = mullen`

Tags are optional.
You don't need to have tags in your data structure, but it's generally a good idea to make use of them because, unlike fields, tags are indexed.
This means that queries on tags are faster and that tags are ideal for storing commonly-queried metadata.

> **Why indexing matters: The schema case study**  

> Say you notice that most of your queries focus on the values of the field keys `honeybees` and `butterflies`:

> `SELECT * FROM census WHERE butterflies = 1`  
> `SELECT * FROM census WHERE honeybees = 23`

> Because fields aren't indexed, InfluxDB scans every value of `butterflies`  in the first query and every value of `honeybees` in the second query before it provides a response.
That behavior can hurt query response times - especially on a much larger scale.
To optimize your queries, it may be beneficial to rearrange your [schema](/influxdb/v0.10/concepts/glossary/#schema) such that the fields (`butterflies` and `honeybees`) become the tags and the tags (`location` and `scientist`) become the fields:

| _time                | _measurement | <span class="tooltip" data-tooltip-text="Tag key">scientist</span> | _field | _value |
|----------------------|--------------|-----------|--------|-------|
| 2015-08-18T00:00:00Z | census | mullen   | honeybees   | 23 |
| <span class="tooltip" data-tooltip-text="Timestamp">2015-08-18T00:00:00Z</span> | <span class="tooltip" data-tooltip-text="Measurement name">census</span> | <span class="tooltip" data-tooltip-text="Tag value">langstroth</span> | <span class="tooltip" data-tooltip-text="Field key">butterflies</span> | <span class="tooltip" data-tooltip-text="Field value">33</span> |
| 2015-08-18T00:06:00Z | census | anderson | butterflies | 45 |
| 2015-08-18T00:06:00Z | census | mullen   | honeybees   | 10 |

> Now that `butterflies` and `honeybees` are tags, InfluxDB won't have to scan every one of their values when it performs the queries above - this means that your queries are even faster.

The <a name=measurement></a>**measurement** acts as a container for tags, fields, and the `time` column, and the measurement name is the description of the data that are stored in the associated fields.
Measurement names are strings, and, for any SQL users out there, a measurement is conceptually similar to a table.
The only measurement in the sample data is `census`.
The name `census` tells us that the field values record the number of `butterflies` and `honeybees` - not their size, direction, or some sort of happiness index.

A single measurement can belong to different retention policies.
A <a name="retention-policy"></a>**retention policy** describes how long InfluxDB keeps data (`DURATION`) and how many copies of this data is stored in the cluster (`REPLICATION`).
If you're interested in reading more about retention policies, check out [Database Management](/influxdb/v0.10/query_language/database_management/#retention-policy-management).

In the sample data, everything in the `census` measurement belongs to the `default` retention policy.
InfluxDB automatically creates that retention policy; it has an infinite duration and a replication factor set to the number of nodes in the cluster.

Now that you're familiar with measurements, tag sets, and retention policies it's time to discuss series.
In InfluxDB, a <a name=series></a> **series** is the collection of data that share a retention policy, measurement, and tag set.
The data above consist of four series:

| Arbitrary series number  |  Bucket | Measurement  |  Tag set |
|---|---|---|---|
| series 1  | `default` | `census`  | `location = 1`,`scientist = anderson` |
| series 2 | `default` |  `census` |  `location = 2`,`scientist = anderson` |
| series 3  | `default` | `census`  | `location = 1`,`scientist = mullen` |
| series 4 | `default` |  `census` |  `location = 2`,`scientist = mullen` |

Understanding the concept of a series is essential when designing your [schema](/influxdb/v0.10/concepts/glossary/#schema) and when working with your data in InfluxDB.

Finally, a <a name="point"></a>**point** is the field set in the same series with the same timestamp.
For example, here's a single point:
```
name: census
-----------------
time			               butterflies	 honeybees	 location	 scientist
2015-08-18T00:00:00Z	 1		          30		       1		       mullen
```

The series in the example is defined by the retention policy (`default`), the measurement (`census`), and the tag set (`location = 1`, `scientist = mullen`).
The timestamp for the point is `2015-08-18T00:00:00Z`.

All of the stuff we've just covered is stored in a bucket call database `my_bucket`.
An InfluxDB <a name=database></a> **database** is similar to traditional relational databases and serves as a logical container for users, retention policies, continuous queries, and, of course, your time series data.
See [users](/influxdb/v0.10/administration/authentication_and_authorization/) and [continuous queries](/influxdb/v0.10/query_language/continuous_queries/) for more on those topics.

Databases can have several users, continuous queries, retention policies, and measurements.
InfluxDB is a schemaless database, so you can easily add new measurements, tags, and fields at any time.

If you're just starting out, we recommend taking a look at [Getting Started](/influxdb/v0.10/introduction/getting_started/) and the [Writing Data](/influxdb/v0.10/guides/writing_data/) and [Querying Data](/influxdb/v0.10/guides/querying_data/) guides.
May our time series database serve you well 🕔.
