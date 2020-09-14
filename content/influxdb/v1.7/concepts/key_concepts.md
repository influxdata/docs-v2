---
title: InfluxDB key concepts
description: Covers key concepts to learn about InfluxDB.
menu:
  influxdb_1_7:
    name: Key concepts
    weight: 10
    parent: Concepts
v2: /influxdb/v2.0/reference/key-concepts/
---

Before diving into InfluxDB it's good to get acquainted with some of the key concepts of the database.
This document provides a gentle introduction to those concepts and common InfluxDB terminology.
We've provided a list below of all the terms we'll cover, but we recommend reading this document from start to finish to gain a more general understanding of our favorite time series database.

<table style="width:100%">
  <tr>
    <td><a href="#database">database</a></td>
    <td><a href="#field-key">field key</a></td>
    <td><a href="#field-set">field set</a></td>
  </tr>
  <tr>
    <td><a href="#field-value">field value</a></td>
    <td><a href="#measurement">measurement</a></td>
    <td><a href="#point">point</a></td>
  </tr>
    <tr>
    <td><a href="#retention-policy">retention policy</a></td>
    <td><a href="#series">series</a></td>
    <td><a href="#tag-key">tag key</a></td>
  </tr>
    <tr>
    <td><a href="#tag-set">tag set</a></td>
    <td><a href="#tag-value">tag value</a></td>
    <td><a href="#timestamp">timestamp</a></td>
  </tr>
</table>

Check out the [glossary](/influxdb/v1.7/concepts/glossary/) if you prefer the cold, hard facts.

### Sample data

The next section references the data printed out below.
The data is fictional, but represents a believable setup in InfluxDB.
They show the number of butterflies and honeybees counted by two scientists (`langstroth` and `perpetua`) in two locations (location `1` and location `2`) over the time period from August 18, 2015 at midnight through August 18, 2015 at 6:12 AM.
Assume that the data lives in a database called `my_database` and are subject to the `autogen` retention policy (more on databases and retention policies to come).

*Hint:* Hover over the links for tooltips to get acquainted with InfluxDB terminology and the layout.

**name:** <span class="tooltip" data-tooltip-text="Measurement">census</span>  

| time                                                                            | <span class ="tooltip" data-tooltip-text ="Field key">butterflies</span> | <span class ="tooltip" data-tooltip-text ="Field key">honeybees</span> | <span class ="tooltip" data-tooltip-text ="Tag key">location</span> | <span class ="tooltip" data-tooltip-text ="Tag key">scientist</span>  |
| ----                                                                            | ------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------  |
| 2015-08-18T00:00:00Z                                                            | 12                                                                       | 23                                                                     | 1                                                                   | langstroth                                                            |
| 2015-08-18T00:00:00Z                                                            | 1                                                                        | 30                                                                     | 1                                                                   | perpetua                                                              |
| 2015-08-18T00:06:00Z                                                            | 11                                                                       | 28                                                                     | 1                                                                   | langstroth                                                            |
| <span class="tooltip" data-tooltip-text="Timestamp">2015-08-18T00:06:00Z</span> | <span class ="tooltip" data-tooltip-text ="Field value">3</span>         | <span class ="tooltip" data-tooltip-text ="Field value">28</span>      | <span class ="tooltip" data-tooltip-text ="Tag value">1</span>      | <span class ="tooltip" data-tooltip-text ="Tag value">perpetua</span> |
| 2015-08-18T05:54:00Z                                                            | 2                                                                        | 11                                                                     | 2                                                                   | langstroth                                                            |
| 2015-08-18T06:00:00Z                                                            | 1                                                                        | 10                                                                     | 2                                                                   | langstroth                                                            |
| 2015-08-18T06:06:00Z                                                            | 8                                                                        | 23                                                                     | 2                                                                   | perpetua                                                              |
| 2015-08-18T06:12:00Z                                                            | 7                                                                        | 22                                                                     | 2                                                                   | perpetua                                                              |

### Discussion

Now that you've seen some sample data in InfluxDB this section covers what it all means.

InfluxDB is a time series database so it makes sense to start with what is at the root of everything we do: time.
In the data above there's a column called `time` - all data in InfluxDB have that column.
`time` stores timestamps, and the <a name="timestamp"></a>_**timestamp**_ shows the date and time, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) UTC, associated with particular data.

The next two columns, called `butterflies` and `honeybees`, are fields.
Fields are made up of field keys and field values.
<a name="field-key"></a>_**Field keys**_ (`butterflies` and `honeybees`) are strings; the field key `butterflies` tells us that the field values `12`-`7` refer to butterflies and the field key `honeybees` tells us that the field values `23`-`22` refer to, well, honeybees.

<a name="field-value"></a>_**Field values**_ are your data; they can be strings, floats, integers, or Booleans, and, because InfluxDB is a time series database, a field value is always associated with a timestamp.
The field values in the sample data are:

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

In the data above, the collection of field-key and field-value pairs make up a <a name="field-set"></a>_**field set**_.
Here are all eight field sets in the sample data:

* `butterflies = 12   honeybees = 23`
* `butterflies = 1    honeybees = 30`
* `butterflies = 11   honeybees = 28`
* `butterflies = 3    honeybees = 28`
* `butterflies = 2    honeybees = 11`
* `butterflies = 1    honeybees = 10`
* `butterflies = 8    honeybees = 23`
* `butterflies = 7    honeybees = 22`

Fields are a required piece of the InfluxDB data structure - you cannot have data in InfluxDB without fields.
It's also important to note that fields are not indexed.
[Queries](/influxdb/v1.7/concepts/glossary/#query) that use field values as filters must scan all values that match the other conditions in the query.
As a result, those queries are not performant relative to queries on tags (more on tags below).
In general, fields should not contain commonly-queried metadata.

The last two columns in the sample data, called `location` and `scientist`, are tags.
Tags are made up of tag keys and tag values.
Both <a name="tag-key"></a>_**tag keys**_ and <a name="tag-value"></a>_**tag values**_ are stored as strings and record metadata.
The tag keys in the sample data are `location` and `scientist`.
The tag key `location` has two tag values: `1` and `2`.
The tag key `scientist` also has two tag values: `langstroth` and `perpetua`.

In the data above, the <a name="tag-set"></a>_**tag set**_ is the different combinations of all the tag key-value pairs.
The four tag sets in the sample data are:

* `location = 1`, `scientist = langstroth`
* `location = 2`, `scientist = langstroth`
* `location = 1`, `scientist = perpetua`
* `location = 2`,  `scientist = perpetua`

Tags are optional.
You don't need to have tags in your data structure, but it's generally a good idea to make use of them because, unlike fields, tags are indexed.
This means that queries on tags are faster and that tags are ideal for storing commonly-queried metadata.

Avoid using the following reserved keys:
* `_field`
* `_measurement`
* `time`

If reserved keys are used as a tag or field key, the associated point is discarded.

> **Why indexing matters: The schema case study**

> Say you notice that most of your queries focus on the values of the field keys `honeybees` and `butterflies`:

> `SELECT * FROM "census" WHERE "butterflies" = 1`
> `SELECT * FROM "census" WHERE "honeybees" = 23`

> Because fields aren't indexed, InfluxDB scans every value of `butterflies`  in the first query and every value of `honeybees` in the second query before it provides a response.
That behavior can hurt query response times - especially on a much larger scale.
To optimize your queries, it may be beneficial to rearrange your [schema](/influxdb/v1.7/concepts/glossary/#schema) such that the fields (`butterflies` and `honeybees`) become the tags and the tags (`location` and `scientist`) become the fields:

> **name:** <span class="tooltip" data-tooltip-text="Measurement">census</span>  
>
| time                                                                            | <span class ="tooltip" data-tooltip-text ="Field key">location</span> | <span class ="tooltip" data-tooltip-text ="Field key">scientist</span>  | <span class ="tooltip" data-tooltip-text ="Tag key">butterflies</span> | <span class ="tooltip" data-tooltip-text ="Tag key">honeybees</span> |
| ----                                                                            | --------------------------------------------------------------------- | ----------------------------------------------------------------------  | ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 2015-08-18T00:00:00Z                                                            | 1                                                                     | langstroth                                                              | 12                                                                     | 23                                                                   |
| 2015-08-18T00:00:00Z                                                            | 1                                                                     | perpetua                                                                | 1                                                                      | 30                                                                   |
| 2015-08-18T00:06:00Z                                                            | 1                                                                     | langstroth                                                              | 11                                                                     | 28                                                                   |
| <span class="tooltip" data-tooltip-text="Timestamp">2015-08-18T00:06:00Z</span> | <span class ="tooltip" data-tooltip-text ="Field value">1</span>      | <span class ="tooltip" data-tooltip-text ="Field value">perpetua</span> | <span class ="tooltip" data-tooltip-text ="Tag value">3</span>         | <span class ="tooltip" data-tooltip-text ="Tag value">28</span>      |
| 2015-08-18T05:54:00Z                                                            | 2                                                                     | langstroth                                                              | 2                                                                      | 11                                                                   |
| 2015-08-18T06:00:00Z                                                            | 2                                                                     | langstroth                                                              | 1                                                                      | 10                                                                   |
| 2015-08-18T06:06:00Z                                                            | 2                                                                     | perpetua                                                                | 8                                                                      | 23                                                                   |
| 2015-08-18T06:12:00Z                                                            | 2                                                                     | perpetua                                                                | 7                                                                      | 22                                                                   |

> Now that `butterflies` and `honeybees` are tags, InfluxDB won't have to scan every one of their values when it performs the queries above - this means that your queries are even faster.

The <a name=measurement></a>_**measurement**_ acts as a container for tags, fields, and the `time` column, and the measurement name is the description of the data that are stored in the associated fields.
Measurement names are strings, and, for any SQL users out there, a measurement is conceptually similar to a table.
The only measurement in the sample data is `census`.
The name `census` tells us that the field values record the number of `butterflies` and `honeybees` - not their size, direction, or some sort of happiness index.

A single measurement can belong to different retention policies.
A <a name="retention-policy"></a>_**retention policy**_ describes how long InfluxDB keeps data (`DURATION`) and how many copies of this data is stored in the cluster (`REPLICATION`).
If you're interested in reading more about retention policies, check out [Database Management](/influxdb/v1.7/query_language/database_management/#retention-policy-management).

{{% warn %}} Replication factors do not serve a purpose with single node instances. For multiple data nodes in a cluster, the replication factor **must be evenly divisible** into the number of data nodes. For example, a replication factor of 2 works with 2, 4, or 6 data nodes, and so on. A replication factor of 3 works with 3, 6, or 9 data nodes, and so on.
{{% /warn %}}

In the sample data, everything in the `census` measurement belongs to the `autogen` retention policy.
InfluxDB automatically creates the `autogen` retention policy with an infinite duration and a replication factor set to one.

Now that you're familiar with measurements, tag sets, and retention policies, let's discuss series.
In InfluxDB, a <a name=series></a>_**series**_ is a collection of points that share a measurement, tag set, and field key.
The data above consist of eight series:

| Series number            | Measurement | Tag set                                 | Field key     |
|:------------------------ | ----------- | -------                                 | ---------     |
| series 1                 | `census`    | `location = 1`,`scientist = langstroth` | `butterflies` |
| series 2                 | `census`    | `location = 2`,`scientist = langstroth` | `butterflies` |
| series 3                 | `census`    | `location = 1`,`scientist = perpetua`   | `butterflies` |
| series 4                 | `census`    | `location = 2`,`scientist = perpetua`   | `butterflies` |
| series 5                 | `census`    | `location = 1`,`scientist = langstroth` | `honeybees`   |
| series 6                 | `census`    | `location = 2`,`scientist = langstroth` | `honeybees`   |
| series 7                 | `census`    | `location = 1`,`scientist = perpetua`   | `honeybees`   |
| series 8                 | `census`    | `location = 2`,`scientist = perpetua`   | `honeybees`   |

Understanding the concept of a series is essential when designing your [schema](/influxdb/v1.7/concepts/glossary/#schema) and when working with your data in InfluxDB.

A <a name="point"></a>_**point**_ represents a single data record that has four components: a measurement, tag set, field set, and a timestamp. A point is uniquely identified by its series and timestamp.

For example, here's a single point:
```
name: census
-----------------
time                    butterflies honeybees   location    scientist
2015-08-18T00:00:00Z    1           30          1           perpetua
```

The point in this example is part of series 3 and defined by the measurement (`census`), the tag set (`location = 1`, `scientist = perpetua`), the field set (`butterflies = 1`, `honeybees = 30`), and the timestamp `2015-08-18T00:00:00Z`.

All of the stuff we've just covered is stored in a database - the sample data are in the database `my_database`.
An InfluxDB <a name=database></a>_**database**_ is similar to traditional relational databases and serves as a logical container for users, retention policies, continuous queries, and, of course, your time series data.
See [Authentication and Authorization](/influxdb/v1.7/administration/authentication_and_authorization/) and [Continuous Queries](/influxdb/v1.7/query_language/continuous_queries/) for more on those topics.

Databases can have several users, continuous queries, retention policies, and measurements.
InfluxDB is a schemaless database which means it's easy to add new measurements, tags, and fields at any time.
It's designed to make working with time series data awesome.

You made it!
You've covered the fundamental concepts and terminology in InfluxDB.
If you're just starting out, we recommend taking a look at [Getting Started](/influxdb/v1.7/introduction/getting_started/) and the [Writing Data](/influxdb/v1.7/guides/writing_data/) and [Querying Data](/influxdb/v1.7/guides/querying_data/) guides.
May our time series database serve you well 🕔.
