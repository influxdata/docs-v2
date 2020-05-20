---
title: Write CSV data to InfluxDB
description: >
  Use the [`influx write` command](/v2.0/reference/cli/influx/write/) to write CSV data
  to InfluxDB. Include annotations with the CSV data determine how the data translates
  into [line protocol](/v2.0/reference/syntax/line-protocol/).
menu:
  v2_0:
    name: Write CSV data
    parent: Write data
weight: 104
related:
  - /v2.0/reference/syntax/line-protocol/
  - /v2.0/reference/syntax/annotated-csv/
  - /v2.0/reference/cli/influx/write/
---

Use the [`influx write` command](/v2.0/reference/cli/influx/write/) to write CSV data
to InfluxDB. Include annotations with the CSV data to specify how the data translates
into [line protocol](/v2.0/reference/syntax/line-protocol/).

InfluxDB requires the following for each point written:

- measurement
- field set
- timestamp
- (optional) tag set

- Extended annotated CSV

- Write command
  - inject annotation headers
  - skip headers

- Example commands
  - Write the raw results of a Flux query
  - Simple annotated CSV with #datatype annotation
  - Annotated CSV with #datatype and CSV annotations
    - Include defaults with the #datatype annotation
