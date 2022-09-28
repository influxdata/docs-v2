---
title: InfluxDB data schema
description: >
  InfluxDB uses a tabular data schema for displaying raw data in Data Explorer and for returning query results in annotated CSV syntax.
aliases:
  - /influxdb/v2.0/reference/key-concepts/table-structure
weight: 103
menu:
  influxdb_2_0_ref:
    parent: Key concepts
    name: Data schema
influxdb/v2.0/tags: [key concepts]
---

InfluxDB [data elements](/influxdb/v2.0/reference/key-concepts/data-elements/) are stored in **time-structured merge tree (TSM)** and **time series index (TSI)** files to efficiently compact stored data.

InfluxDB also provides a **tabular data schema** that includes the following:

- [Annotation rows](#annotation-rows)
- [Header row](#header-row)
- [Data rows](#data-rows)
- [Other columns](#other-columns)
- [Group keys](#group-keys)

The **tabular data schema is used for the following**:

- To [view raw data](/influxdb/v2.0/query-data/execute-queries/data-explorer/#view-raw-data) when [exploring metrics with InfluxDB](/influxdb/v2.0/visualize-data/explore-metrics)
- To return query results in [annotated CSV syntax](/influxdb/v2.0/reference/syntax/annotated-csv/)

## Annotation rows

Annotation rows describe column properties, for example:

- `#group`
- `#datatype`
- `#default`

## Header row

The header row defines column labels that describe data in each column, for example:

- `table`
- `_time`
- `_value`
- `_field`
- `_measurement`
-  tag key names (without underscore prefix): `tag-1`, `tag-2`

## Data rows

Each data row contains the data specified in the header row for one [point](/influxdb/v2.0/reference/glossary/#point).

## Other columns

In addition to the columns in each data row (specified in the header row), the following columns are optional:

- `annotation`
- `result`
- `table`

## Group keys

Determine the contents of output tables in Flux by grouping records that share common values in specified columns. Learn more about [grouping your data with Flux](/influxdb/v2.0/query-data/flux/group-data/).
