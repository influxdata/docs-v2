---
title: Flux InfluxDB v1 package
list_title: InfluxDB v1 package
description: >
  The Flux InfluxDB v1 package provides functions for managing data from an InfluxDB v1.x
  database or structured using the InfluxDB v1 data structure.
  Import the `influxdata/influxdb/v1` package.
aliases:
  - /influxdb/cloud/reference/flux/functions/influxdb-v1/
menu:
  influxdb_cloud_ref:
    name: InfluxDB v1
    parent: Flux standard library
weight: 202
influxdb/v2.0/tags: [functions, influxdb-v1, package]
introduced: 0.16.0
---

InfluxDB v1 Flux functions provide tools for managing data from an InfluxDB v1.x
database or structured using the InfluxDB v1 data structure.
Import the `influxdata/influxdb/v1` package:

```js
import "influxdata/influxdb/v1"
```

{{< children type="functions" show="pages" >}}

{{% warn %}}
#### Deprecated functions
In **Flux 0.88.0**, the following InfluxDB v1 package functions moved to the
[InfluxDB schema package](/influxdb/cloud/reference/flux/stdlib/influxdb-schema/).
These functions are still available in the `v1` package for backwards compatibility,
but are deprecated in favor of `schema`.

| Deprecated v1 function        | → | Corresponding schema function                                                                      |
|:-------------------           |:-:|:------------------------                                                                           |
| **v1.fieldKeys()**            | → | [schema.fieldKeys()](/influxdb/cloud/reference/flux/stdlib/influxdb-schema/fieldkeys/)                       |
| **v1.fieldsAsCols()**         | → | [schema.fieldsAsCols()](/influxdb/cloud/reference/flux/stdlib/influxdb-schema/fieldsascols/)                 |
| **v1.measurementFieldKeys()** | → | [schema.measurementFieldKeys()](/influxdb/cloud/reference/flux/stdlib/influxdb-schema/measurementfieldkeys/) |
| **v1.measurements()**         | → | [schema.measurements()](/influxdb/cloud/reference/flux/stdlib/influxdb-schema/measurements/)                 |
| **v1.measurementTagKeys()**   | → | [schema.measurementTagKeys()](/influxdb/cloud/reference/flux/stdlib/influxdb-schema/measurementtagkeys/)     |
| **v1.measurementTagValues()** | → | [schema.measurementTagValues()](/influxdb/cloud/reference/flux/stdlib/influxdb-schema/measurementtagvalues/) |
| **v1.tagKeys()**              | → | [schema.tagKeys()](/influxdb/cloud/reference/flux/stdlib/influxdb-schema/tagkeys/)                           |
| **v1.tagValues()**            | → | [schema.tagValues()](/influxdb/cloud/reference/flux/stdlib/influxdb-schema/tagvalues/)                       |
{{% /warn %}}
